import React, { useState } from 'react';
import { Car } from '../types/car';
import { createCarBookingWhatsAppLink, COMPANY_CONFIG } from '../config/whatsapp';
import {
  ArrowLeft,
  MessageCircle,
  Gauge,
  Fuel,
  Users,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Phone,
  Plane,
  DoorClosed,
  Briefcase,
  UserCheck
} from 'lucide-react';

interface CarDetailsProps {
  car: Car;
  onBack: () => void;
}

export const CarDetails: React.FC<CarDetailsProps> = ({ car, onBack }) => {
  const galleryImages = car.gallery && car.gallery.length > 0 ? car.gallery : [car.image];
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [rentalDays, setRentalDays] = useState(3);

  const totalPrice = car.pricePerDay * rentalDays;
  const whatsappUrl = createCarBookingWhatsAppLink(car);

  return (
    <div className="min-h-screen text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-amber-500/40 text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Kthehu te Flota</span>
        </button>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Photo Gallery & Features */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image Showcase */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl">
              <img
                src={selectedImage}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Status Tag */}
              <div className="absolute top-4 left-4">
                {car.available ? (
                  <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    I lirë për Rezervim (Available)
                  </span>
                ) : (
                  <span className="bg-rose-950/90 text-rose-400 border border-rose-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
                    I Zënë (Rented)
                  </span>
                )}
              </div>

              {/* Type Badge */}
              <div className="absolute top-4 right-4 bg-black/80 text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                {car.type}
              </div>
            </div>

            {/* Thumbnail Gallery Picker */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                      selectedImage === img ? 'border-amber-500 scale-105' : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Specifications Grid */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white font-serif border-b border-neutral-800 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Specifikat Teknike</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-1">Marka & Modeli</span>
                  <p className="font-bold text-white">{car.brand} {car.model}</p>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-1">Viti i Prodhimit</span>
                  <p className="font-bold text-white">{car.year}</p>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-1">Transmisioni</span>
                  <p className="font-bold text-amber-300">{car.transmission}</p>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-1">Lloji i Karburantit</span>
                  <p className="font-bold text-white">{car.fuel}</p>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-1">Numri i Vendeve</span>
                  <p className="font-bold text-white">{car.seats} Vende</p>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-1">Kategoria</span>
                  <p className="font-bold text-white">{car.type}</p>
                </div>

                {car.engineSize && (
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-1">Motorri</span>
                    <p className="font-bold text-white">{car.engineSize}</p>
                  </div>
                )}

                {car.doors && (
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-1">Dyert</span>
                    <p className="font-bold text-white">{car.doors} Dyre</p>
                  </div>
                )}

                {car.minDriverAge && (
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px] uppercase font-bold block mb-1">Mosha Minimale</span>
                    <p className="font-bold text-amber-400">{car.minDriverAge}+ Vjeç</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold text-white font-serif">Përshkrimi i Mjetit</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">{car.description}</p>
            </div>
          </div>

          {/* Right Column: Pricing Calculator & Instant WhatsApp Trigger */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl sticky top-28">
              {/* Title Header */}
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-500 font-extrabold">
                  {car.brand}
                </p>
                <h1 className="text-3xl font-extrabold text-white font-serif">{car.model} ({car.year})</h1>
              </div>

              {/* Price Per Day Display */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">Çmimi për 1 ditë:</span>
                <span className="text-3xl font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  {car.pricePerDay}€
                </span>
              </div>

              {/* Interactive Duration Calculator */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-300">Zgjidhni numrin e ditëve të qerasë:</span>
                  <span className="text-amber-400 font-bold">{rentalDays} Ditë</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>1 Ditë</span>
                  <span>15 Ditë</span>
                  <span>30 Ditë</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex justify-between items-center text-sm">
                  <span className="text-neutral-300 font-bold">Llogaritja Përfundimtare:</span>
                  <span className="text-2xl font-black text-amber-300">
                    {totalPrice}€ <span className="text-xs font-normal text-neutral-400">({car.pricePerDay}€ x {rentalDays}d)</span>
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-950/80 border border-emerald-400/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Rezervo tani në WhatsApp (+355 69 623 4684)</span>
                </a>

                <p className="text-[11px] text-center text-neutral-400">
                  Klikimi do të hapë automatikisht bisedën në WhatsApp me detajet e {car.brand} {car.model}.
                </p>
              </div>

              {/* Guarantees List */}
              <div className="space-y-2 pt-4 border-t border-neutral-800 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Siguracion KASKO dhe CDW i përfshirë</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Marrje/Dorëzim pa pagesë në Aeroportin e Rinasit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Asistencë rrugore 24 orë në ditë</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
