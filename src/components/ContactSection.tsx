import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Send, Clock, CheckCircle2 } from 'lucide-react';
import { COMPANY_CONFIG, createGeneralWhatsAppLink } from '../config/whatsapp';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carPreference: 'BMW 5 Series',
    dates: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customMessage = `Përshëndetje Illyrian Rental Car,
Emri: ${formData.name || 'N/A'}
Telefoni: ${formData.phone || 'N/A'}
Makina e preferuar: ${formData.carPreference}
Datat e dëshiruara: ${formData.dates || 'Të papërcaktuara'}
Mesazhi: ${formData.notes || 'Dëshiroj informacion për disponueshmërinë.'}`;

    const link = createGeneralWhatsAppLink(customMessage);
    window.open(link, '_blank');
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
            Na Kontaktoni
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif">
            Contact Us
          </h2>
          <p className="text-neutral-400 text-sm">
            Jemi në shërbimin tuaj 24/7. Na kontaktoni për çdo pyetje apo rezervim të menjëhershëm.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Info Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 p-8 rounded-2xl shadow-xl space-y-8">
              <h3 className="text-2xl font-bold text-white font-serif border-b border-neutral-800 pb-4">
                Informacion Kontakti
              </h3>

              {/* Phone / Call */}
              <a
                href={`tel:${COMPANY_CONFIG.whatsappNumber}`}
                className="flex items-start gap-4 group p-3 rounded-xl hover:bg-neutral-800/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Telefon & Viber</p>
                  <p className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {COMPANY_CONFIG.phoneDisplay}
                  </p>
                  <p className="text-[11px] text-neutral-400">Përgjigje e menjëhershme</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={createGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:bg-emerald-950/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-emerald-950">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold">WhatsApp Direct</p>
                  <p className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    +{COMPANY_CONFIG.whatsappNumber}
                  </p>
                  <p className="text-[11px] text-emerald-400/80">Kliko për të çelur bisedën</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-4 p-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Lokacioni</p>
                  <p className="text-sm font-medium text-neutral-200">
                    {COMPANY_CONFIG.location}
                  </p>
                  <span className="inline-block mt-1 text-[11px] text-amber-400 font-semibold">
                    *Marrje & dorëzim në Aeroportin e Rinasit (TIA) 24/7
                  </span>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400">Na ndiqni:</span>
                <a
                  href={COMPANY_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-200 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-amber-400" />
                  <span>{COMPANY_CONFIG.instagramHandle}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Request Form */}
          <div className="lg:col-span-7 bg-neutral-900/90 border border-neutral-800 p-8 rounded-2xl shadow-xl">
            <div className="space-y-2 mb-6">
              <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">
                Dërgo Kërkesë të Shpejtë
              </span>
              <h3 className="text-2xl font-bold text-white font-serif">
                Direct WhatsApp Quick Reservation
              </h3>
              <p className="text-xs text-neutral-400">
                Plotësoni të dhënat dhe shtypni 'Dërgo në WhatsApp' për të marrë konfirmimin në çast.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-300">U hap biseda në WhatsApp!</h4>
                <p className="text-xs text-neutral-300">
                  Nëse nuk u hap automatikisht, ju lutem përdorni numrin: <strong>+{COMPANY_CONFIG.whatsappNumber}</strong>
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Dërgo një kërkesë tjetër
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Emri & Mbiemri
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="p.sh. Agron Hoxha"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Numri i Telefonit
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+355 6X XX XX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Makina e Dëshiruar
                    </label>
                    <select
                      value={formData.carPreference}
                      onChange={(e) => setFormData({ ...formData, carPreference: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="BMW 5 Series (120€/day)">BMW 5 Series (120€/day)</option>
                      <option value="Mercedes-Benz G-Class AMG (350€/day)">Mercedes-Benz G-Class AMG (350€/day)</option>
                      <option value="Audi RS6 Avant (220€/day)">Audi RS6 Avant (220€/day)</option>
                      <option value="Porsche Panamera GTS (280€/day)">Porsche Panamera GTS (280€/day)</option>
                      <option value="Range Rover Sport (250€/day)">Range Rover Sport (250€/day)</option>
                      <option value="Mercedes-Benz E-Class (130€/day)">Mercedes-Benz E-Class (130€/day)</option>
                      <option value="Volkswagen Golf 8 (55€/day)">Volkswagen Golf 8 (55€/day)</option>
                      <option value="Audi Q7 S-Line (160€/day)">Audi Q7 S-Line (160€/day)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Datat e Marrjes / Dorëzimit
                    </label>
                    <input
                      type="text"
                      placeholder="p.sh. 25 Korrik - 30 Korrik"
                      value={formData.dates}
                      onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Shënime shtesë / Kërkesa specifike
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Vendosni orarin e mbërritjes në aeroport, marrje në Tirane, etj..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm rounded-xl shadow-xl shadow-emerald-950/80 border border-emerald-400/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.99]"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Dërgo Kërkesën në WhatsApp (+355 69 623 4684)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
