import React from 'react';
import illyrianLogo from '../assets/illyrian-logo.jpeg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20',
  };

  return (
    <div className={`flex items-center cursor-pointer group ${className}`}>
      <img
        src={illyrianLogo}
        alt="Illyrian Rental Car"
        className={`${sizeMap[size]} w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105`}
      />
    </div>
  );
};
