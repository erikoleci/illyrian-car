import React from 'react';
import { CarFilterOptions } from '../types/car';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface CarFilterProps {
  options: CarFilterOptions;
  setOptions: React.Dispatch<React.SetStateAction<CarFilterOptions>>;
  uniqueBrands: string[];
  totalResultsCount: number;
  onReset: () => void;
}

export const CarFilter: React.FC<CarFilterProps> = ({
  options,
  setOptions,
  uniqueBrands,
  totalResultsCount,
  onReset,
}) => {
  const carTypes = ['All', 'SUV', 'Sedan', 'Electric', 'Luxury', 'Hatchback'];
  const transmissions = ['All', 'Automatic', 'Manual'];
  const fuels = ['All', 'Diesel', 'Petrol', 'Hybrid', 'Electric'];

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl shadow-black/40 backdrop-blur-md space-y-5">
      {/* Search Input Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
          <input
            type="text"
            value={options.searchQuery}
            onChange={(e) => setOptions((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Kërko makinën (p.sh. BMW, Mercedes, Audi)..."
            className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <span className="text-xs text-amber-400/90 font-semibold px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            {totalResultsCount} Makina
          </span>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-amber-400 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pastro Filtrat</span>
          </button>
        </div>
      </div>

      {/* Filter Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-neutral-800/80">
        {/* Brand Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            <span>Marka</span>
          </label>
          <select
            value={options.brand}
            onChange={(e) => setOptions((prev) => ({ ...prev, brand: e.target.value }))}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">Gjithë Markat</option>
            {uniqueBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            <span>Tipi i Makinës</span>
          </label>
          <select
            value={options.type}
            onChange={(e) => setOptions((prev) => ({ ...prev, type: e.target.value }))}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            {carTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'Të gjitha tipet' : t}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-300">Kambio</label>
          <select
            value={options.transmission}
            onChange={(e) => setOptions((prev) => ({ ...prev, transmission: e.target.value }))}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            {transmissions.map((tr) => (
              <option key={tr} value={tr}>
                {tr === 'All' ? 'Automatike & Manuale' : tr}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-300">Karburanti</label>
          <select
            value={options.fuel}
            onChange={(e) => setOptions((prev) => ({ ...prev, fuel: e.target.value }))}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            {fuels.map((f) => (
              <option key={f} value={f}>
                {f === 'All' ? 'Gjithë Llojet' : f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Max Price Range Slider & Availability Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-neutral-800/80 text-xs">
        <div className="w-full sm:w-1/2 flex items-center gap-3">
          <span className="text-neutral-400 whitespace-nowrap font-medium">
            Çmimi Maksimal: <strong className="text-amber-400">{options.maxPrice}€/ditë</strong>
          </span>
          <input
            type="range"
            min="40"
            max="400"
            step="10"
            value={options.maxPrice}
            onChange={(e) => setOptions((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-neutral-300 select-none">
          <input
            type="checkbox"
            checked={options.onlyAvailable}
            onChange={(e) => setOptions((prev) => ({ ...prev, onlyAvailable: e.target.checked }))}
            className="w-4 h-4 rounded accent-amber-500 bg-neutral-950 border-neutral-800"
          />
          <span>Shfaq vetëm makinat e lira (Available)</span>
        </label>
      </div>
    </div>
  );
};
