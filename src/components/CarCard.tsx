import React from 'react';
import { Car } from '../types/car';
import { createCarBookingWhatsAppLink } from '../config/whatsapp';
import { Fuel, Gauge, Users, Calendar, CheckCircle2, XCircle, ArrowUpRight, MessageCircle } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onSelectCar?: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onSelectCar }) => {
  const whatsappUrl = createCarBookingWhatsAppLink(car);

  return (
    <div className="group relative bg-neutral-900/80 rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />

        {/* Status Badge (Available / Rented) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-md border">
          {car.available ? (
            <span className="bg-emerald-950/80 text-emerald-400 border-emerald-500/30 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Available
            </span>
          ) : (
            <span className="bg-rose-950/80 text-rose-400 border-rose-500/30 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              Rented
            </span>
          )}
        </div>

        {/* Car Type Tag */}
        <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold tracking-wider uppercase">
          {car.type}
        </div>

        {/* Daily Price Badge */}
        <div className="absolute bottom-3 right-3 bg-neutral-950/90 border border-amber-500/40 px-3.5 py-1.5 rounded-xl shadow-lg text-right backdrop-blur-sm">
          <span className="text-2xl font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
            {car.pricePerDay}€
          </span>
          <span className="text-[11px] text-neutral-400 font-medium ml-1">/ditë</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Header & Model Name */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-500 font-bold">
                {car.brand}
              </p>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                {car.model}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700/60 font-medium">
              <Calendar className="w-3 h-3 text-amber-400" />
              {car.year}
            </span>
          </div>

          <p className="text-xs text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
            {car.description}
          </p>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-neutral-800/80 text-xs">
            <div className="flex flex-col items-center p-2 rounded-lg bg-neutral-950/50 border border-neutral-800/50">
              <Gauge className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-neutral-400 text-[10px] uppercase tracking-wider">Kambio</span>
              <span className="font-semibold text-neutral-200">{car.transmission}</span>
            </div>

            <div className="flex flex-col items-center p-2 rounded-lg bg-neutral-950/50 border border-neutral-800/50">
              <Fuel className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-neutral-400 text-[10px] uppercase tracking-wider">Karburanti</span>
              <span className="font-semibold text-neutral-200">{car.fuel}</span>
            </div>

            <div className="flex flex-col items-center p-2 rounded-lg bg-neutral-950/50 border border-neutral-800/50">
              <Users className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-neutral-400 text-[10px] uppercase tracking-wider">Vende</span>
              <span className="font-semibold text-neutral-200">{car.seats} Seats</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 flex items-center gap-2">
          {/* View Details Button */}
          {onSelectCar && (
            <button
              onClick={() => onSelectCar(car)}
              className="flex-1 py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-semibold border border-neutral-700/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Detajet</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          )}

          {/* Rezervo WhatsApp Main Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md ${
              car.available
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50 border border-emerald-400/20'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700/40 cursor-not-allowed opacity-90'
            }`}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Rezervo</span>
          </a>
        </div>
      </div>
    </div>
  );
};
