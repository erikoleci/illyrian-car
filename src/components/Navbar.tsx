import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, Phone, MessageCircle, ChevronRight, Instagram, Settings } from 'lucide-react';
import { COMPANY_CONFIG, createGeneralWhatsAppLink } from '../config/whatsapp';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Kreu' },
    { id: 'cars', label: 'Flota (Makinat)' },
    { id: 'about', label: 'Rreth Nesh' },
    { id: 'contact', label: 'Kontakt' },
    { id: 'admin', label: 'Admin' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/90 backdrop-blur-md border-b border-amber-500/20 py-3 shadow-xl shadow-black/50'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div onClick={() => handleNavClick('home')}>
            <Logo size="xl" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-neutral-900/60 p-1.5 rounded-full border border-neutral-800 backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-md shadow-amber-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Admin / Fleet Manager Modal trigger */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                title="Menaxhimi i Flotës (Admin)"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/50 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            {/* Instagram Quick Icon */}
            <a
              href={COMPANY_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* Direct Phone Call Button */}
            <a
              href={`tel:${COMPANY_CONFIG.whatsappNumber}`}
              className="hidden xl:flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-amber-400 px-3 py-2 rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>{COMPANY_CONFIG.phoneDisplay}</span>
            </a>

            {/* Book Now / WhatsApp Main Action Button */}
            <a
              href={createGeneralWhatsAppLink("Përshëndetje, dëshiroj të bëj një rezervim makine.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-emerald-900/30 border border-emerald-400/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 fill-current text-white" />
              <span>Book Now</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-emerald-600/90 text-white"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-amber-400 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/98 border-b border-amber-500/20 backdrop-blur-xl px-4 pt-4 pb-6 mt-2 space-y-3 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-left font-medium text-base transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                      : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-neutral-800/80 flex flex-col gap-3">
            <a
              href={`tel:${COMPANY_CONFIG.whatsappNumber}`}
              className="flex items-center justify-center gap-2 py-2.5 bg-neutral-900 rounded-xl text-neutral-200 text-sm font-semibold border border-neutral-800"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>{COMPANY_CONFIG.phoneDisplay}</span>
            </a>

            <a
              href={createGeneralWhatsAppLink("Përshëndetje, dëshiroj të bëj një rezervim makine.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/40"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Book Now on WhatsApp</span>
            </a>

            <div className="flex items-center justify-between pt-2 text-xs text-neutral-400">
              <a
                href={COMPANY_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <Instagram className="w-4 h-4 text-amber-500" />
                <span>{COMPANY_CONFIG.instagramHandle}</span>
              </a>

              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-amber-500" />
                  <span>Admin Flota</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
