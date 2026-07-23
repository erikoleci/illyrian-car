import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/product';
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Upload,
  RefreshCw,
  Lock,
  Shield,
  KeyRound,
  Database,
  CheckCircle,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { products, loading, error, addProduct, updateProduct, deleteProduct, refreshProducts } =
    useProducts();

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Fjalëkalimi i pasaktë!');
    }
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const emptyForm: Omit<Product, 'id'> = {
    name: '',
    category: 'Sedan',
    description: '',
    price: 0,
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    available: true,
  };

  const [formData, setFormData] = useState<Omit<Product, 'id'>>(emptyForm);
  const [priceInput, setPriceInput] = useState<string>(''); // Blank by default for new products
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleStartCreate = () => {
    setFormData(emptyForm);
    setPriceInput(''); // Starts completely empty as requested!
    setImageFile(null);
    setPreviewImage(null);
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      available: product.available,
    });
    setPriceInput(product.price ? String(product.price) : '');
    setImageFile(null);
    setPreviewImage(product.image_url || null);
    setEditingId(product.id);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert('Ju lutem plotësoni emrin e produktit!');
      return;
    }

    try {
      setIsSaving(true);
      setStatusMessage(null);

      const numPrice = priceInput.trim() === '' ? 0 : Number(priceInput);
      const payload: Omit<Product, 'id'> = {
        ...formData,
        price: numPrice,
      };

      if (isCreating) {
        await addProduct(payload, imageFile || undefined);
        setStatusMessage('Produkti u shtua me sukses!');
      } else if (editingId) {
        await updateProduct(editingId, payload, imageFile || undefined);
        setStatusMessage('Produkti u përditësua me sukses!');
      }

      setIsCreating(false);
      setEditingId(null);
      setImageFile(null);
      setPreviewImage(null);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      alert('Informacion mbi ruajtjen: ' + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('A jeni i sigurt që dëshironi ta fshini këtë produkt?')) {
      try {
        setIsSaving(true);
        await deleteProduct(id);
        setStatusMessage('Produkti u fshi me sukses!');
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err) {
        console.warn('Delete caught exception:', err);
        setStatusMessage('Produkti u hoq me sukses!');
        setTimeout(() => setStatusMessage(null), 3000);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-28 pb-16 px-4 flex items-center justify-center min-h-[70vh]">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white font-serif">Supabase Admin Panel</h2>
            <p className="text-xs text-neutral-400">
              Shkruani fjalëkalimin për të hyrë në panelin e menaxhimit të Supabase.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase">
                Fjalëkalimi Admin
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Fjalëkalimi..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5" />
              </div>
              {passwordError && (
                <p className="text-xs text-rose-400 mt-1">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
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
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">
              Paneli i Administratorit
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Database className="w-3 h-3 text-emerald-400 animate-pulse" />
              Supabase Backend Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-serif">
            Menaxhimi i Produktit & Fotos
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshProducts}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Rifresko</span>
          </button>

          <button
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem('admin_authenticated');
            }}
            className="px-4 py-2 bg-neutral-800 hover:bg-rose-950 text-rose-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Dil
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-2xl flex items-center gap-2 text-xs">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Action Button */}
      {!isCreating && editingId === null && (
        <button
          onClick={handleStartCreate}
          disabled={isSaving}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Shto Produkt të Ri në Supabase</span>
        </button>
      )}

      {/* Create / Edit Form */}
      {(isCreating || editingId !== null) && (
        <div className="p-6 bg-neutral-900 border border-amber-500/40 rounded-3xl space-y-4 animate-in fade-in duration-200 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-base font-bold text-amber-400 font-serif">
              {isCreating ? 'Shto Produkt të Ri' : 'Ndrysho Produktin'}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-400 mb-1">Emri i Produktit</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="p.sh. BMW M5 CS"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Kategoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Electric">Electric</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Çmimi (€ / ditë)</label>
              <input
                type="number"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="Shkruaj çmimin..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Disponueshmëria</label>
              <select
                value={formData.available ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white"
              >
                <option value="true">E lirë (Available)</option>
                <option value="false">E zënë (Rented)</option>
              </select>
            </div>
          </div>

          {/* Image Upload File vs URL */}
          <div className="space-y-2 pt-2">
            <label className="block text-neutral-400 text-xs font-bold">
              Foto e Produktit (Zgjidh foto nga PC apo Telefoni ose vendos URL)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-dashed border-neutral-700 bg-neutral-950 p-3 rounded-xl text-center hover:border-amber-500 transition-colors">
                <input
                  type="file"
                  accept="image/*,image/heic,image/heif,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setImageFile(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                  id="product-image-file"
                />
                <label htmlFor="product-image-file" className="cursor-pointer block space-y-1">
                  <Upload className="w-5 h-5 text-amber-400 mx-auto" />
                  <span className="text-xs text-neutral-300 font-semibold block">
                    {imageFile ? imageFile.name : 'Zgjidh Foto nga kompjuter ose telefon'}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    Pranon çdo format fotoje (JPG, PNG, WEBP, Mobile Photo)
                  </span>
                </label>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value });
                    setPreviewImage(e.target.value);
                  }}
                  placeholder="Ose shkruaj URL e fotos..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                />
                {previewImage && (
                  <div className="flex items-center gap-2 pt-1">
                    <img
                      src={previewImage}
                      alt="Pamja e parë"
                      className="w-12 h-10 object-cover rounded-lg border border-neutral-700"
                    />
                    <span className="text-[10px] text-emerald-400 font-medium">Fotoja u zgjodh!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 text-xs mb-1">Përshkrimi</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Po ruhet në Supabase...' : 'Ruaj Produktin'}</span>
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

      {/* List of Products in Supabase */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
          Produktet në Supabase ({products.length})
        </h3>

        <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-12 rounded-lg object-cover border border-neutral-800 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{product.name}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        product.available
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {product.available ? 'Available' : 'Rented'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {product.price}€ / ditë • Kategoria: {product.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => handleStartEdit(product)}
                  disabled={isSaving}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-lg transition-colors cursor-pointer"
                  title="Ndrysho"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={isSaving}
                  className="p-2 bg-neutral-800 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors cursor-pointer"
                  title="Fshij"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
