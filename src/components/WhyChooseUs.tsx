import React from 'react';
import { ShieldCheck, Banknote, Zap, Headset, Plane, Sparkles } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-amber-400" />,
      title: "Premium Fleet",
      titleSq: "Makinat Premium",
      desc: "Our vehicles are fully insured, rigorously inspected, and kept in brand new immaculate condition.",
    },
    {
      icon: <Banknote className="w-8 h-8 text-amber-400" />,
      title: "Affordable Prices",
      titleSq: "Çmimet më Konkurruese",
      desc: "Transparent rates with zero hidden charges or surprise fees. Best value for luxury driving.",
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      title: "Fast Booking",
      titleSq: "Rezervim i Menjëhershëm",
      desc: "No long paperwork. Book directly via WhatsApp in less than 2 minutes and collect your keys.",
    },
    {
      icon: <Headset className="w-8 h-8 text-amber-400" />,
      title: "24/7 Support",
      titleSq: "Mbështetje 24/7",
      desc: "Our dedicated concierge and roadside team are available around the clock to assist your journey.",
    },
    {
      icon: <Plane className="w-8 h-8 text-amber-400" />,
      title: "Airport Delivery",
      titleSq: "Dërgim në Aeroport (Rinas)",
      desc: "Free or seamless vehicle delivery right outside Tirana Rinas Airport arrival terminal.",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      title: "Unlimited Comfort",
      titleSq: "Komfort Pa Limite",
      desc: "Clean interiors, full options, GPS navigation, and climate control for maximum comfort.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
            Pse të zgjidhni Illyrian
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif">
            Why Choose Us
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Përjetoni shërbimin me elitare të marrjes së makinave me qera në Shqipëri me flotën tonë të përzgjedhur të mjeteve luksoze dhe ekonomike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/50"
            >
              <div className="w-14 h-14 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-amber-500/40 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs font-semibold text-amber-400/90 mb-3">{item.titleSq}</p>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
