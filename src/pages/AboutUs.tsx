import React from 'react';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { HowItWorks } from '../components/HowItWorks';
import { Logo } from '../components/Logo';
import { ShieldCheck, Award, MapPin, Users, Phone, MessageCircle } from 'lucide-react';
import { COMPANY_CONFIG, createGeneralWhatsAppLink } from '../config/whatsapp';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* About Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
            Rreth Kompanisë Tonë
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-serif">
            About Illyrian Rental Car
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Me përvojë plurivjeçare në tregun e marrjes së makinave me qera në Shqipëri, Illyrian Rental Car ofron cilësi premium, siguri maksimale dhe shërbim elitar 24/7.
          </p>
        </div>

        {/* Stats banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-neutral-900/80 rounded-3xl border border-neutral-800 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              100%
            </p>
            <p className="text-xs text-neutral-400 uppercase font-semibold">Mjete të Siguruara</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              24/7
            </p>
            <p className="text-xs text-neutral-400 uppercase font-semibold">Shërbim në Rinas</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              5,000+
            </p>
            <p className="text-xs text-neutral-400 uppercase font-semibold">Klientë të Kënaqur</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              0€
            </p>
            <p className="text-xs text-neutral-400 uppercase font-semibold">Kosto të Fshehura</p>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              Misioni Ynë & Standartet e Sigurisë
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              Tek Illyrian Rental Car, ne besojmë se çdo udhëtim nëpër Shqipëri duhet të jetë i rehatshëm, i sigurt dhe pa stope të papritura. Të gjitha mjetet tona i nënshtrohen kontrollit rigoroz teknik përpara se t'i dorëzohen klientit.
            </p>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Sistemi ynë i rezervimit është konceptuar që të jetë sa më i shpejtë nëpërmjet WhatsApp. Pa burokraci dhe pa pritje të gjata në radhë.
            </p>

            <div className="pt-2">
              <a
                href={createGeneralWhatsAppLink("Përshëndetje! Dëshiroj të pyes më shumë rreth shërbimeve tuaja.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Na Kontaktoni në WhatsApp (+355 69 623 4684)</span>
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
              alt="Illyrian Fleet"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Why Choose Us & How It Works embedded */}
        <WhyChooseUs />
        <HowItWorks />
      </div>
    </div>
  );
};
