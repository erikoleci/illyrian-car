import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showBadge = true }) => {
  const sizeMap = {
    sm: { circle: 'w-10 h-10', textMain: 'text-sm font-black', textSub: 'text-[9px]' },
    md: { circle: 'w-12 h-12', textMain: 'text-lg font-black', textSub: 'text-[10px]' },
    lg: { circle: 'w-16 h-16', textMain: 'text-2xl font-black', textSub: 'text-[12px]' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      {/* Circle Metallic Logo Badge */}
      <div
        className={`relative ${currentSize.circle} rounded-full bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border border-amber-500/30 group-hover:border-amber-400/80 transition-all duration-300 shadow-lg shadow-black/60 flex items-center justify-center p-2 shrink-0 overflow-hidden`}
      >
        {/* Subtle metallic shine flare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Car Silhouette SVG Matching Screenshot */}
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full text-slate-200 fill-current filter drop-shadow-[0_1px_2px_rgba(255,255,255,0.2)]"
        >
          <g>
            {/* Aerodynamic Roof & Hood Line */}
            <path
              d="M 20 70 C 40 68, 55 45, 80 35 C 105 25, 140 25, 160 40 C 175 50, 185 62, 185 70 C 175 66, 155 68, 140 65 C 120 62, 95 62, 70 65 C 45 68, 30 70, 20 70 Z"
              className="fill-slate-100"
            />
            {/* Front Bumper & Headlight Wing */}
            <path
              d="M 15 75 C 25 72, 40 73, 50 78 C 35 80, 22 81, 15 75 Z"
              className="fill-slate-300"
            />
            {/* Rear Swoop & Fender */}
            <path
              d="M 135 68 C 150 67, 175 68, 188 78 C 170 82, 145 78, 135 68 Z"
              className="fill-slate-300"
            />
            {/* Wheel Arch Accent Left */}
            <path
              d="M 40 76 C 42 70, 52 70, 58 76 C 52 74, 44 74, 40 76 Z"
              className="fill-slate-400"
            />
            {/* Wheel Arch Accent Right */}
            <path
              d="M 148 74 C 150 68, 160 68, 166 74 C 160 72, 152 72, 148 74 Z"
              className="fill-slate-400"
            />
          </g>
        </svg>
      </div>

      {/* Typography: ILLYRIAN RENTAL CAR */}
      <div className="flex flex-col tracking-wider">
        <span
          className={`font-serif uppercase tracking-[0.18em] bg-gradient-to-r from-slate-100 via-amber-200 to-amber-400 bg-clip-text text-transparent font-extrabold ${currentSize.textMain} leading-tight drop-shadow-sm`}
        >
          ILLYRIAN
        </span>
        <span
          className={`uppercase tracking-[0.25em] text-slate-400 font-medium ${currentSize.textSub} leading-none mt-0.5`}
        >
          RENTAL CAR
        </span>
      </div>
    </div>
  );
};
