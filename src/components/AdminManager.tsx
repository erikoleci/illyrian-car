import React, { useState } from 'react';
import { Car } from '../types/car';
import { Plus, Trash2, Edit3, Save, X, Check, Copy, Shield, Lock, Database, RefreshCw, KeyRound } from 'lucide-react';
import { saveCarToFirestore, deleteCarFromFirestore, toggleCarAvailabilityInFirestore } from '../services/carsService';

interface AdminManagerProps {
  cars: Car[];
  onClose: () => void;
}

export const AdminManager: React.FC<AdminManagerProps> = ({ cars, onClose }) => {
  // Password authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Default admin password
  const ADMIN_PASSWORD = 'admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Fjalëkalimi i pasaktë! Ju lutem provoni përsëri.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  const [editingId, setEditingId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for creating or editing
  const emptyCar: Car = {
    id: Date.now(),
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    pricePerDay: 80,
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: 5,
    type: 'Sedan',
    description: '',
    available: true,
    featured: false,
  };

  const [formData, setFormData] = useState<Car>(emptyCar);
  const [isCreating, setIsCreating] = useState(false);

  const handleStartCreate = () => {
    setFormData({ ...emptyCar, id: Date.now() });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (car: Car) => {
    setFormData({ ...car });
    setEditingId(car.id);
    setIsCreating(false);
  };

  const handleSaveCar = async () => {
    if (!formData.brand || !formData.model) {
      alert('Ju lutem plotësoni Markën dhe Modelin e makinës!');
      return;
    }

    try {
      setIsSaving(true);
      await saveCarToFirestore(formData);
      setIsCreating(false);
      setEditingId(null);
    } catch (err) {
      alert('Gabim gjatë ruajtjes në databazë: ' + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCar = async (id: number) => {
    if (confirm('A jeni i sigurt që dëshironi ta fshini këtë makinë nga databaza live?')) {
      try {
        setIsSaving(true);
        await deleteCarFromFirestore(id);
      } catch (err) {
        alert('Gabim gjatë fshirjes: ' + (err as Error).message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleToggleAvailability = async (id: number, currentAvailable: boolean) => {
    try {
      setIsSaving(true);
      await toggleCarAvailabilityInFirestore(id, !currentAvailable);
    } catch (err) {
      alert('Gabim gjatë përditësimit: ' + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // Generate TypeScript code for backup
  const generateCode = () => {
    return `import { Car } from '../types/car';\n\nexport const initialCars: Car[] = ${JSON.stringify(
      cars,
      null,
      2
    )};`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Password Login View
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white font-serif">Akses i Kufizuar Admin</h2>
            <p className="text-xs text-neutral-400">
              Shkruani fjalëkalimin e administratorit për të menaxhuar flotën dhe databazën.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Fjalëkalimi
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Shkruani fjalëkalimin..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl py-3 px-4 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5" />
              </div>
              {passwordError && (
                <p className="text-xs text-rose-400 font-medium mt-1.5">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
            >
              <Shield className="w-4 h-4" />
              <span>Hyr si Admin</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-800 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">
                Menaxhimi i Flotës
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                <Database className="w-3 h-3 text-emerald-400 animate-pulse" />
                Firestore Live Database Active
              </span>
            </div>
            <h2 className="text-2xl font-black text-white font-serif">
              Fleet Admin Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Kodi u kopjua!' : 'Kopjo Backup'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-rose-950 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Dil nga Admin
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action button */}
        {!isCreating && editingId === null && (
          <button
            onClick={handleStartCreate}
            disabled={isSaving}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Shto Makinë të Re në Flotë & Databazë</span>
          </button>
        )}

        {/* Create / Edit Form */}
        {(isCreating || editingId !== null) && (
          <div className="p-6 bg-neutral-950 border border-amber-500/40 rounded-2xl space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-amber-400 font-serif">
              {isCreating ? 'Shto Makinë të Re në Databazë' : `Ndrysho: ${formData.brand} ${formData.model}`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Marka (p.sh. BMW)</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Modeli (p.sh. 5 Series)</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Viti (p.sh. 2024)</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Çmimi për ditë (€)</label>
                <input
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Kambio</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value as any })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Karburanti</label>
                <select
                  value={formData.fuel}
                  onChange={(e) => setFormData({ ...formData, fuel: e.target.value as any })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Tipi</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Vende (Seats)</label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Disponueshmëria</label>
                <select
                  value={formData.available ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white"
                >
                  <option value="true">E lirë (Available)</option>
                  <option value="false">E zënë (Rented)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 text-xs mb-1">Link i Fotos (URL)</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 text-xs mb-1">Përshkrimi</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSaveCar}
                disabled={isSaving}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Po ruhet...' : 'Ruaj në Databazë'}</span>
              </button>

              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                }}
                disabled={isSaving}
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs rounded-xl cursor-pointer"
              >
                Anulo
              </button>
            </div>
          </div>
        )}

        {/* Cars List Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
              Makinat në Databazë Live ({cars.length})
            </h3>
            <span className="text-xs text-neutral-500">Kliko mbi statusin për ta ndryshuar në kohë reale</span>
          </div>

          <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-950">
            {cars.map((car) => (
              <div
                key={car.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={car.image}
                    alt={car.brand}
                    className="w-16 h-12 rounded-lg object-cover border border-neutral-800 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">
                        {car.brand} {car.model} ({car.year})
                      </p>
                      <button
                        onClick={() => handleToggleAvailability(car.id, car.available)}
                        disabled={isSaving}
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold cursor-pointer transition-transform active:scale-95 ${
                          car.available
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/30 hover:bg-rose-900'
                        }`}
                        title="Kliko për të ndryshuar statusin në databazë"
                      >
                        {car.available ? '● E lirë (Available)' : '● E zënë (Rented)'}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {car.pricePerDay}€/ditë • {car.transmission} • {car.fuel} • {car.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleStartEdit(car)}
                    disabled={isSaving}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-lg transition-colors cursor-pointer"
                    title="Ndrysho"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    disabled={isSaving}
                    className="p-2 bg-neutral-800 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Fshij nga databaza"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
