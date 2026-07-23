import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Home } from './pages/Home';
import { CarsPage } from './pages/Cars';
import { CarDetails } from './pages/CarDetails';
import { AboutUsPage } from './pages/AboutUs';
import { ContactSection } from './components/ContactSection';
import { ProductsPage } from './pages/Products';
import { AdminPage } from './pages/Admin';
import { AdminManager } from './components/AdminManager';
import { initialCars } from './data/cars';
import { subscribeCars } from './services/carsService';
import { Car } from './types/car';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Real-time synchronization
  useEffect(() => {
    const unsubscribe = subscribeCars((liveCars) => {
      if (liveCars && liveCars.length > 0) {
        setCars(liveCars);
      }
    });

    return () => unsubscribe();
  }, []);

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
          setIsAdminOpen(false);
        }}
      />

      {/* Main Page Router View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home setActiveTab={setActiveTab} onSelectCar={handleSelectCar} cars={cars} />
        )}

        {activeTab === 'cars' && (
          <CarsPage onSelectCar={handleSelectCar} cars={cars} />
        )}

        {activeTab === 'products' && (
          <ProductsPage />
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

      {/* Legacy Admin Modal trigger option */}
      {isAdminOpen && (
        <AdminManager
          cars={cars}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Floating WhatsApp Action Trigger (Bottom-Right) */}
      <WhatsAppButton />

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
