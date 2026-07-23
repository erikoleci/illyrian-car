import React, { useState } from 'react';
import { CarCard } from '../components/CarCard';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { HowItWorks } from '../components/HowItWorks';
import { ContactSection } from '../components/ContactSection';
import { getFeaturedCars } from '../data/cars';
import { Car } from '../types/car';
import { createGeneralWhatsAppLink, COMPANY_CONFIG } from '../config/whatsapp';
import { MessageCircle, ArrowRight, ShieldCheck, Sparkles, Plane, Calendar, MapPin, ChevronRight, Check } from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  onSelectCar: (car: Car) => void;
  cars?: Car[];
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, onSelectCar, cars }) => {
  const featuredCars = cars ? cars.filter((c) => c.featured) : getFeaturedCars();

  const [pickupLocation, setPickupLocation] = useState('Tirana Airport (TIA)');
  const [carType, setCarType] = useState('All');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('cars');
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"
            alt="Illyrian Rental Car Hero"
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black" />
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-8">
          <div className="max-w-3xl space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Premium Fleet in Albania • Rinas Airport Delivery</span>
            </div>

            {/* Main Hero Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-serif tracking-tight leading-[1.1] text-white">
              Rent Your{' '}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Dream Car
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl">
              Choose from our premium fleet and enjoy a comfortable and reliable driving experience.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              {/* View Cars Button */}
              <button
                onClick={() => {
                  setActiveTab('cars');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <span>View Cars</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Contact WhatsApp Button */}
              <a
                href={createGeneralWhatsAppLink("Përshëndetje, po ju kontaktoj nga faqja kryesore për të pyetur rreth makinave me qera.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-emerald-600/90 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-emerald-950/60 border border-emerald-400/30 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Contact WhatsApp</span>
              </a>
            </div>

            {/* Quick Benefits Bullet List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-800/80 text-xs font-semibold text-neutral-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Siguracion i Plotë</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Dorëzim në Aeroport 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero Tarifa të Fshehura</span>
              </div>
            </div>
          </div>

          {/* Quick Filter Search Bar Bar Widget */}
          <div className="mt-12 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-3 items-end">
              <div className="lg:col-span-2 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Lokacioni i Marrjes</span>
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Tirana Airport (TIA)">Aeroporti i Rinasit (TIA)</option>
                  <option value="Tirana Center">Qendra e Tiranës</option>
                  <option value="Durres Port">Porti i Durrësit</option>
                  <option value="Vlora City">Vlorë / Bregdet</option>
                </select>
              </div>

              <div className="lg:col-span-2 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Tipi i Makinës</span>
                </label>
                <select
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="All">Gjithë Kategoritë</option>
                  <option value="SUV">SUV & 4x4</option>
                  <option value="Luxury">Luxury & Sports</option>
                  <option value="Sedan">Sedan Business</option>
                  <option value="Electric">Electric / Hybrid</option>
                </select>
              </div>

              <div className="lg:col-span-2 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Rezervim Direkt
                </label>
                <a
                  href={createGeneralWhatsAppLink(`Përshëndetje! Dëshiroj të marr makinë në ${pickupLocation}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp (+355 69 623 4684)</span>
                </a>
              </div>

              <div className="lg:col-span-1">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Kërko</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= FEATURED FLEET SECTION ================= */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block mb-3">
                Flota e Përzgjedhur
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
                Featured Fleet
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                Shfletoni disa nga makinat tona më të kërkuara me çmimet më të mira në treg.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('cars');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-all cursor-pointer self-start md:self-auto"
            >
              <span>Shiko të gjithë flotën</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} onSelectCar={onSelectCar} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <WhyChooseUs />

      {/* ================= HOW IT WORKS ================= */}
      <HowItWorks />

      {/* ================= AIRPORT SPECIAL PROMO BANNER ================= */}
      <section className="py-16 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-emerald-950/40 border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-neutral-900/80 p-8 sm:p-12 rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden">
            <div className="space-y-4 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                <Plane className="w-4 h-4" />
                <span>Airport Pickup & Dropoff Included</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-serif leading-tight">
                Mbërrini në Aeroportin e Rinasit? Makina juaj ju pret në dalje!
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Nuk keni nevojë të prisni në radhë apo të paguani taksi të shtrenjta. Stafi ynë do t'ju presë direkt në terminalin e mbërritjeve me mjetin e përzgjedhur.
              </p>
            </div>

            <div className="shrink-0 relative z-10">
              <a
                href={createGeneralWhatsAppLink("Përshëndetje! Dëshiroj të marr mjetin në Aeroportin e Rinasit (TIA).")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-950/80 border border-emerald-400/30 flex items-center gap-3 hover:scale-105 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Rezervo për Aeroport (+355 69 623 4684)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <ContactSection />
    </div>
  );
};
