import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, Instagram, MessageCircle, Heart, ShieldCheck, ChevronRight } from 'lucide-react';
import { COMPANY_CONFIG, createGeneralWhatsAppLink } from '../config/whatsapp';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const whatsappUrl = createGeneralWhatsAppLink("Përshëndetje Illyrian Rental Car!");

  return (
    <footer className="bg-black text-neutral-400 border-t border-neutral-800 relative overflow-hidden">
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div onClick={() => setActiveTab('home')}>
              <Logo size="lg" />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mt-4">
              Kompania udhëheqëse për makina me qera luksoze dhe ekonomike në Shqipëri. Shërbim profesional, çmime transparente dhe dërgim falas në Aeroportin e Rinasit (TIA).
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>+{COMPANY_CONFIG.whatsappNumber}</span>
              </a>

              <a
                href={COMPANY_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-bold hover:text-amber-400 hover:border-amber-500/40 transition-colors"
              >
                <Instagram className="w-4 h-4 text-amber-400" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              Navigimi
            </h4>
            <ul className="space-y-2 text-xs">
              {['Home', 'Cars', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      setActiveTab(item.toLowerCase());
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-amber-500" />
                    <span>{item === 'About' ? 'About Us' : item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              Kontakti
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-neutral-200">{COMPANY_CONFIG.phoneDisplay}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 fill-current" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  +{COMPANY_CONFIG.whatsappNumber}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-neutral-400 leading-tight">
                  Tirana & Aeroporti i Rinasit (TIA), Albania
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-400 transition-colors">Termat & Kushtet</span>
            <span className="hover:text-neutral-400 transition-colors">Politika e Privatësisë</span>
            <span className="flex items-center gap-1 text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full Insurance Included</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
