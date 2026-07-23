import React from 'react';
import { Car, MessageCircle, KeyRound, ArrowRight } from 'lucide-react';
import { createGeneralWhatsAppLink } from '../config/whatsapp';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: <Car className="w-8 h-8 text-amber-400" />,
      title: "Choose Your Car",
      titleSq: "Zgjidhni makinën tuaj",
      desc: "Explore our fleet of premium sedans, luxury SUVs, and economic hatchbacks. Filter by price, transmission, or brand.",
    },
    {
      step: "02",
      icon: <MessageCircle className="w-8 h-8 text-emerald-400" />,
      title: "Contact Us on WhatsApp",
      titleSq: "Kontaktoni në WhatsApp",
      desc: "Click 'Rezervo' on your chosen car. Our system generates a pre-formatted request sent directly to +355696234684.",
    },
    {
      step: "03",
      icon: <KeyRound className="w-8 h-8 text-amber-400" />,
      title: "Enjoy Your Trip",
      titleSq: "Shijoni udhëtimin tuaj",
      desc: "Pick up your keys at Rinas Airport or Tirana center and drive away with 100% peace of mind and full insurance.",
    },
  ];

  return (
    <section className="py-20 bg-black relative border-y border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
            Proces i thjeshtë në 3 Hapa
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
            How It Works
          </h2>
          <p className="text-neutral-400 text-sm">
            Marrja e makinës me qera nuk ka qenë kurrë më e lehtë dhe më e shpejtë.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="relative bg-neutral-900/60 rounded-2xl p-8 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-4xl font-black text-neutral-800 group-hover:text-amber-500/30 transition-colors">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{s.title}</h3>
                <p className="text-xs font-semibold text-amber-400 mb-3">{s.titleSq}</p>
                <p className="text-xs text-neutral-400 leading-relaxed">{s.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={createGeneralWhatsAppLink("Përshëndetje, dëshiroj të bëj një pyetje rreth rezervimeve.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-full shadow-xl shadow-emerald-950/60 border border-emerald-400/30 hover:scale-105 transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Fillo Rezervimin në WhatsApp (+355 69 623 4684)</span>
          </a>
        </div>
      </div>
    </section>
  );
};
