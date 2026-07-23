import React, { useState, useMemo } from 'react';
import { initialCars, filterCars, getUniqueBrands } from '../data/cars';
import { CarCard } from '../components/CarCard';
import { CarFilter } from '../components/CarFilter';
import { CarFilterOptions, Car } from '../types/car';
import { createGeneralWhatsAppLink } from '../config/whatsapp';
import { Sparkles, MessageCircle, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CarsProps {
  onSelectCar: (car: Car) => void;
  cars?: Car[];
}

export const CarsPage: React.FC<CarsProps> = ({ onSelectCar, cars: providedCars }) => {
  const currentCars = providedCars || initialCars;

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(currentCars.map((car) => car.brand))).sort();
  }, [currentCars]);

  const defaultFilters: CarFilterOptions = {
    searchQuery: '',
    brand: 'All',
    type: 'All',
    transmission: 'All',
    fuel: 'All',
    maxPrice: 400,
    onlyAvailable: false,
  };

  const [filterOptions, setFilterOptions] = useState<CarFilterOptions>(defaultFilters);
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'yearDesc'>('recommended');

  const filteredCars = useMemo(() => {
    let list = currentCars.filter((car) => {
      if (
        filterOptions.searchQuery &&
        !`${car.brand} ${car.model}`.toLowerCase().includes(filterOptions.searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (filterOptions.brand !== 'All' && car.brand !== filterOptions.brand) {
        return false;
      }
      if (filterOptions.type !== 'All' && car.type !== filterOptions.type) {
        return false;
      }
      if (filterOptions.transmission !== 'All' && car.transmission !== filterOptions.transmission) {
        return false;
      }
      if (filterOptions.fuel !== 'All' && car.fuel !== filterOptions.fuel) {
        return false;
      }
      if (car.pricePerDay > filterOptions.maxPrice) {
        return false;
      }
      if (filterOptions.onlyAvailable && !car.available) {
        return false;
      }
      return true;
    });

    if (sortBy === 'priceAsc') {
      list = [...list].sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'priceDesc') {
      list = [...list].sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === 'yearDesc') {
      list = [...list].sort((a, b) => b.year - a.year);
    }

    return list;
  }, [currentCars, filterOptions, sortBy]);

  const handleResetFilters = () => {
    setFilterOptions(defaultFilters);
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Flota Jonë Zyrtare</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif">
            Our Rental Fleet
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Zgjidhni nga makinat tona më të reja. Të gjitha mjetet janë të pajisura me siguracion të plotë dhe të gatuara për dërgim në çdo moment.
          </p>
        </div>

        {/* Filter Bar Component */}
        <CarFilter
          options={filterOptions}
          setOptions={setFilterOptions}
          uniqueBrands={uniqueBrands}
          totalResultsCount={filteredCars.length}
          onReset={handleResetFilters}
        />

        {/* Sorting & Result Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>
              Duke shfaqur <strong className="text-white">{filteredCars.length}</strong> nga{' '}
              <strong className="text-white">{currentCars.length}</strong> makina
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Rendit sipas:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="recommended">Më të rekomanduarat</option>
              <option value="priceAsc">Çmimi: Më i ulëti parë</option>
              <option value="priceDesc">Çmimi: Më i larti parë</option>
              <option value="yearDesc">Viti: Më të rejat</option>
            </select>
          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} onSelectCar={onSelectCar} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-neutral-900/40 rounded-3xl border border-neutral-800 space-y-4">
            <p className="text-lg font-bold text-neutral-300">Nuk u gjet asnjë makinë me këto filtra.</p>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Ju lutem ndryshoni kriteret e kërkimit ose pastroni filtrat për të parë mjetet e tjera.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl cursor-pointer"
            >
              Pastro të gjithë filtrat
            </button>
          </div>
        )}

        {/* Bottom Direct Custom Request Banner */}
        <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white font-serif">Kërkoni një makinë tjetër specifike?</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Na dërgoni modelin që dëshironi në WhatsApp dhe ne do t'jua gjejmë mjetin e duhur me çmimin më të mirë.
            </p>
          </div>
          <a
            href={createGeneralWhatsAppLink("Përshëndetje! Po kërkoj një makinë specifike që nuk e gjeta në listë.")}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Pyet në WhatsApp (+355 69 623 4684)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
