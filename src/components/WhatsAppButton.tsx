import React from 'react';
import { MessageCircle } from 'lucide-react';
import { createGeneralWhatsAppLink } from '../config/whatsapp';

export const WhatsAppButton: React.FC = () => {
  const whatsappUrl = createGeneralWhatsAppLink("Përshëndetje Illyrian Rental Car! Dëshiroj të pyes rreth rezervimit të makinave.");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden sm:flex mr-3 px-3.5 py-2 rounded-xl bg-neutral-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-xl shadow-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Chat në WhatsApp 24/7
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-950/80 hover:scale-110 active:scale-95 transition-all duration-300 border border-emerald-300/30"
      >
        {/* Pulsing Outer Ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30 pointer-events-none" />

        {/* Status Indicator */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-neutral-900 rounded-full" />

        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
};
