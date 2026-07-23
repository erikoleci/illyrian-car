export const COMPANY_CONFIG = {
  name: "Illyrian Rental Car",
  tagline: "Rent Your Dream Car in Albania",
  phoneDisplay: "+355 69 623 4684",
  whatsappNumber: "355696234684", // Pure digits for wa.me link
  location: "Rinas International Airport (TIA) & Tirana Center, Albania",
  instagramUrl: "https://instagram.com/illyrianrentalcar",
  instagramHandle: "@illyrianrentalcar",
  workingHours: "24/7 Service & Airport Delivery",
};

/**
 * Formats a WhatsApp message for a specific car booking request
 */
export function createCarBookingWhatsAppLink(car: {
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  transmission: string;
  fuel: string;
  type?: string;
}): string {
  const message = `Përshëndetje,
Jam i interesuar për rezervimin e kësaj makine:

Makina:
${car.brand} ${car.model}

Viti:
${car.year}

Çmimi:
${car.pricePerDay}€/ditë

Kambio:
${car.transmission}

Karburanti:
${car.fuel}

Ju lutem më dërgoni informacion për disponueshmërinë dhe kushtet.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Creates a general WhatsApp contact link
 */
export function createGeneralWhatsAppLink(customMessage?: string): string {
  const defaultMsg = `Përshëndetje Illyrian Rental Car, dëshiroj të marr më shumë informacion rreth makinave me qera.`;
  const text = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${text}`;
}
