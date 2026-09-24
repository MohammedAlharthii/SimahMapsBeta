'use client';

import React, { useState } from 'react';
import { Heart, MapPin, Bed, Bath, Maximize, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property } from '../map/PropertyMap';

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
  isSelected?: boolean;
  lang?: 'en' | 'ar';
}

export default function PropertyCard({ property, onClick, isSelected, lang = 'ar' }: PropertyCardProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const isAr = lang === 'ar';
  const title = isAr ? property.titleAr || property.title : property.title;
  const purposeAr = property.purpose === 'SALE' || property.purpose === 'sale' ? 'للبيع' : 'للإيجار';

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property.images || property.images.length === 0) return;
    setCurrentImageIdx((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property.images || property.images.length === 0) return;
    setCurrentImageIdx((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', alt: title }];

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 overflow-hidden cursor-pointer transition-all duration-300",
        "hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1",
        isSelected && "border-orange-500 ring-2 ring-orange-500/40 shadow-xl shadow-orange-500/20"
      )}
      onClick={() => onClick?.(property)}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Image Carousel */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        <img
          src={images[currentImageIdx]?.url}
          alt={images[currentImageIdx]?.alt || title}
          className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 left-3 p-2 rounded-full bg-zinc-950/60 backdrop-blur-md border border-white/10 hover:bg-zinc-900/90 transition-all z-10 hover:scale-110 active:scale-95"
          aria-label="Favorite"
        >
          <Heart className={cn("w-4 h-4 transition-colors", isFavorite ? "fill-[#F15A24] text-[#F15A24]" : "text-zinc-200")} />
        </button>

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span className="bg-[#F15A24] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-orange-600/30">
            {purposeAr}
          </span>
          {property.isFeatured && (
            <span className="flex items-center gap-1 bg-zinc-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>{isAr ? 'مميز' : 'Featured'}</span>
            </span>
          )}
        </div>

        {/* Price on Image Bottom */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="text-lg font-extrabold text-white tracking-tight flex items-baseline gap-1 drop-shadow-md">
            <span className="text-[#F15A24]">
              {new Intl.NumberFormat('ar-SA').format(property.price)}
            </span>
            <span className="text-xs text-zinc-300 font-semibold">ر.س</span>
          </div>
        </div>

        {/* Carousel Arrows on Hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-950/70 hover:bg-[#F15A24] text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-950/70 hover:bg-[#F15A24] text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-3 flex gap-1 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    currentImageIdx === idx ? "w-4 bg-[#F15A24]" : "bg-white/40"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Property Information */}
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-zinc-100 text-sm sm:text-base line-clamp-1 group-hover:text-[#F15A24] transition-colors">
            {title}
          </h3>
          <span className="text-xs text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md font-medium shrink-0">
            {property.type}
          </span>
        </div>

        <p className="text-zinc-400 text-xs flex items-center gap-1.5 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
          <span>{property.city} • {property.address || property.city}</span>
        </p>

        {/* Specs Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-xs text-zinc-300">
          <div className="flex items-center justify-center gap-1.5 bg-zinc-800/50 py-1.5 rounded-lg">
            <Bed className="w-3.5 h-3.5 text-zinc-400" />
            <span>{property.bedrooms || 0} غرف</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-zinc-800/50 py-1.5 rounded-lg">
            <Bath className="w-3.5 h-3.5 text-zinc-400" />
            <span>{property.bathrooms || 0} حمام</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-zinc-800/50 py-1.5 rounded-lg">
            <Maximize className="w-3.5 h-3.5 text-zinc-400" />
            <span>{property.area} م²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
