import { Product } from '../types/product';
import { COMPANY_CONFIG } from '../config/whatsapp';

/**
 * Generate direct WhatsApp order link with exact required template format
 */
export const createProductWhatsAppOrderLink = (product: Product): string => {
  const number = COMPANY_CONFIG.whatsappNumber || '355696234684';

  const messageText = `Përshëndetje,\nJam i interesuar për:\n\nProdukt:\n${product.name}\n\nÇmimi:\n${product.price}€\n\nJu lutem më dërgoni informacion.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(messageText)}`;
};
