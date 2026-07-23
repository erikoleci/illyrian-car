import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Home } from './pages/Home';
import { CarsPage } from './pages/Cars';
import { CarDetails } from './pages/CarDetails';
import { AboutUsPage } from './pages/AboutUs';
import { ContactSection } from './components/ContactSection';
import { AdminPage } from './pages/Admin';
import { useProducts } from './hooks/useProducts';
import { Car } from './types/car';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const { products } = useProducts();

  // Single Source of Truth: Convert products from Admin/Supabase to Car items
  const cars: Car[] = useMemo(() => {
    return products.map((p) => {
      const nameParts = (p.name || '').trim().split(' ');
      const brand = p.brand || nameParts[0] || 'Auto';
      const model = p.model || nameParts.slice(1).join(' ') || p.name || 'Makinë';

      return {
        id: p.id,
        brand,
        model,
        year: p.year || 2024,
        image: p.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
        pricePerDay: Number(p.price || 0),
        transmission: (p.transmission as any) || 'Automatic',
        fuel: (p.fuel as any) || 'Diesel',
        seats: p.seats || 5,
        type: (p.category as any) || 'Sedan',
        description: p.description || '',
        available: p.available ?? true,
        featured: true,
      };
    });
  }, [products]);

  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
    setActiveTab('car-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCars = () => {
    setSelectedCar(null);
    setActiveTab('cars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Sticky Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => {
          setActiveTab('admin');
        }}
      />

      {/* Main Page Router View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home setActiveTab={setActiveTab} onSelectCar={handleSelectCar} cars={cars} />
        )}

        {(activeTab === 'cars' || activeTab === 'products') && (
          <CarsPage onSelectCar={handleSelectCar} cars={cars} />
        )}

        {activeTab === 'admin' && (
          <AdminPage />
        )}

        {activeTab === 'about' && (
          <AboutUsPage />
        )}

        {activeTab === 'contact' && (
          <div className="pt-24 pb-12">
            <ContactSection />
          </div>
        )}

        {activeTab === 'car-details' && selectedCar && (
          <CarDetails car={selectedCar} onBack={handleBackToCars} />
        )}
      </main>

      {/* Floating WhatsApp Action Trigger (Bottom-Right) */}
      <WhatsAppButton />

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
