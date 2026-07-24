import crypto from 'crypto';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const OWNER_EMAIL = process.env.OWNER_EMAIL || process.env.GOOGLE_CALENDAR_ID;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

let serviceAccount = null;
function getServiceAccount() {
  if (serviceAccount) return serviceAccount;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var is missing');
  serviceAccount = JSON.parse(raw);
  return serviceAccount;
}

// ---------- Google Auth (Service Account JWT -> Access Token) ----------
function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function signJWT(sa, scope) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: sa.client_email,
    scope,
    aud: sa.token_uri,
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer
    .sign(sa.private_key)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${unsigned}.${signature}`;
}

async function getGoogleAccessToken() {
  const sa = getServiceAccount();
  const jwt = signJWT(sa, 'https://www.googleapis.com/auth/calendar');
  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Failed to get Google access token: ' + JSON.stringify(data));
  }
  return data.access_token;
}

// ---------- Tool implementations ----------
async function checkAvailability({ startDate, endDate }) {
  const accessToken = await getGoogleAccessToken();
  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin: new Date(startDate + 'T00:00:00Z').toISOString(),
      timeMax: new Date(endDate + 'T23:59:59Z').toISOString(),
      items: [{ id: CALENDAR_ID }],
    }),
  });
  const data = await res.json();
  const busy = data?.calendars?.[CALENDAR_ID]?.busy || [];
  return { available: busy.length === 0, busy };
}

async function createReservation({
  carName,
  startDate,
  endDate,
  customerName,
  customerContact,
  pricePerDay,
  totalDays,
}) {
  const totalPrice = Number(pricePerDay || 0) * Number(totalDays || 1);

  // 1. Create Google Calendar event
  const accessToken = await getGoogleAccessToken();
  const eventRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `Rezervim: ${carName} — ${customerName || 'Klient'}`,
        description: `Makina: ${carName}\nKlienti: ${customerName || '-'}\nKontakt: ${customerContact || '-'}\nÇmimi/ditë: €${pricePerDay}\nDitë: ${totalDays}\nTotal: €${totalPrice}`,
        start: { date: startDate },
        end: { date: endDate },
      }),
    }
  );
  const eventData = await eventRes.json();

  // 2. Send confirmation email via Resend (best-effort, doesn't block booking)
  if (RESEND_API_KEY && OWNER_EMAIL) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Illyrian Rental Car <onboarding@resend.dev>',
          to: [OWNER_EMAIL],
          subject: `🚗 Rezervim i ri: ${carName}`,
          html: `
            <h2>Rezervim i ri nga faqja</h2>
            <p><b>Makina:</b> ${carName}</p>
            <p><b>Klienti:</b> ${customerName || '-'}</p>
            <p><b>Kontakt:</b> ${customerContact || '-'}</p>
            <p><b>Data:</b> ${startDate} → ${endDate} (${totalDays} ditë)</p>
            <p><b>Çmimi/ditë:</b> €${pricePerDay}</p>
            <p><b>Total:</b> €${totalPrice}</p>
          `,
        }),
      });
    } catch (e) {
      console.warn('Email send failed:', e);
    }
  }

  // 3. Save to Supabase
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          car_name: carName,
          customer_name: customerName,
          customer_contact: customerContact,
          start_date: startDate,
          end_date: endDate,
          total_days: totalDays,
          price_per_day: pricePerDay,
          total_price: totalPrice,
        }),
      });
    } catch (e) {
      console.warn('Supabase log failed:', e);
    }
  }

  return {
    success: !eventData.error,
    eventLink: eventData.htmlLink || null,
    totalPrice,
  };
}

// ---------- Gemini conversation ----------
const TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'check_availability',
        description: 'Kontrollon nëse datat e kërkuara janë të lira në kalendar (asnjë rezervim tjetër në ato data).',
        parameters: {
          type: 'OBJECT',
          properties: {
            startDate: { type: 'STRING', description: 'Data e fillimit, format YYYY-MM-DD' },
            endDate: { type: 'STRING', description: 'Data e mbarimit, format YYYY-MM-DD' },
          },
          required: ['startDate', 'endDate'],
        },
      },
      {
        name: 'create_reservation',
        description:
          'Krijon rezervimin final: shton event në kalendar, dërgon email konfirmimi te pronari, dhe e ruan në databazë. Përdore VETËM pasi klienti ka konfirmuar shprehimisht dhe check_availability ka treguar se datat janë të lira.',
        parameters: {
          type: 'OBJECT',
          properties: {
            carName: { type: 'STRING' },
            startDate: { type: 'STRING', description: 'YYYY-MM-DD' },
            endDate: { type: 'STRING', description: 'YYYY-MM-DD' },
            customerName: { type: 'STRING' },
            customerContact: { type: 'STRING', description: 'Numri telefonit ose email i klientit' },
            pricePerDay: { type: 'NUMBER' },
            totalDays: { type: 'NUMBER' },
          },
          required: ['carName', 'startDate', 'endDate', 'pricePerDay', 'totalDays'],
        },
      },
    ],
  },
];

async function callGemini(contents, systemInstruction) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        tools: TOOLS,
        systemInstruction: { parts: [{ text: systemInstruction }] },
      }),
    }
  );
  const data = await res.json();
  if (data.error) throw new Error('Gemini error: ' + JSON.stringify(data.error));
  return data.candidates?.[0]?.content;
}

async function fetchAvailableCars() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cars?select=brand,model,category,price_per_day,available&available=eq.true`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, history = [] } = req.body || {};
    if (!message) {
      res.status(400).json({ error: 'Missing message' });
      return;
    }

    const cars = await fetchAvailableCars();
    const carsListText = cars
      .map((c) => `- ${c.brand} ${c.model} (${c.category}): €${c.price_per_day}/ditë`)
      .join('\n');

    const today = new Date().toISOString().split('T')[0];

    const systemInstruction = `Je asistenti virtual i "Illyrian Rental Car", një kompani me qera makinash në Shqipëri. Flet gjithmonë shqip, në mënyrë miqësore dhe profesionale.

Data e sotme është: ${today}

Makinat aktualisht të disponueshme:
${carsListText || 'Nuk ka makina të listuara aktualisht.'}

Detyra jote:
1. Pyet klientin çfarë lloj makine dëshiron dhe buxhetin e tij, nëse s'i ka dhënë ende.
2. Rekomando makinë nga lista sipas buxhetit.
3. Pyet për datat e sakta (fillim + mbarim) të qerasë.
4. Kur ke datat, thirr FUNKSIONIN check_availability për të parë nëse janë të lira.
5. Nëse janë të lira, konfirmo me klientin çmimin total dhe kërko emrin + një kontakt (telefon ose email).
6. Vetëm pasi klienti konfirmon shprehimisht ("po", "ok", "konfirmoj"), thirr create_reservation.
7. Nëse datat NUK janë të lira, sugjero data alternative.
8. Mbaje bisedën të shkurtër dhe të qartë, si mesazhe chat-i, jo paragrafë të gjatë.`;

    const contents = [
      ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: message }] },
    ];

    let modelContent = await callGemini(contents, systemInstruction);
    let loopGuard = 0;

    while (loopGuard < 3) {
      const functionCallPart = modelContent?.parts?.find((p) => p.functionCall);
      if (!functionCallPart) break;

      const { name, args } = functionCallPart.functionCall;
      let toolResult;
      if (name === 'check_availability') {
        toolResult = await checkAvailability(args);
      } else if (name === 'create_reservation') {
        toolResult = await createReservation(args);
      } else {
        toolResult = { error: 'Unknown function' };
      }

      contents.push({ role: 'model', parts: modelContent.parts });
      contents.push({
        role: 'function',
        parts: [{ functionResponse: { name, response: toolResult } }],
      });

      modelContent = await callGemini(contents, systemInstruction);
      loopGuard++;
    }

    const replyText =
      modelContent?.parts?.find((p) => p.text)?.text ||
      'Më vjen keq, diçka shkoi keq. Provo përsëri ose na kontakto në WhatsApp.';

    res.status(200).json({ reply: replyText });
  } catch (err) {
    console.error('agent-chat error:', err);
    res.status(500).json({ reply: 'Pati një problem teknik. Ju lutem provoni sërish ose na shkruani në WhatsApp.' });
  }
}
