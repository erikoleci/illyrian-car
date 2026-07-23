import React from 'react';
import { Product } from '../types/product';
import { createProductWhatsAppOrderLink } from '../utils/whatsapp';
import { MessageCircle, CheckCircle2, XCircle, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const whatsappUrl = createProductWhatsAppOrderLink(product);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg">
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Availability Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md shadow-md ${
              product.available
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
            }`}
          >
            {product.available ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                E Lirë
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" />
                E Zënë
              </>
            )}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-900/80 text-amber-400 border border-amber-500/30 backdrop-blur-md flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white font-serif group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500">Çmimi</span>
            <p className="text-xl font-black text-amber-400 font-serif">
              {product.price}€ <span className="text-xs text-neutral-400 font-sans font-normal">/ ditë</span>
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:shadow-emerald-900/30"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Porosit</span>
          </a>
        </div>
      </div>
    </div>
  );
};
