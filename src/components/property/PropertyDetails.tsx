'use client';

import React from 'react';
import { Heart, Share2, MapPin, Bed, Bath, Maximize, Building2, Eye, Phone, Grid } from 'lucide-react';
import type { Property } from '../map/PropertyMap';

interface PropertyDetailsProps {
  property: Property;
  lang?: 'en' | 'ar';
}

export default function PropertyDetails({ property, lang = 'ar' }: PropertyDetailsProps) {
  const isAr = lang === 'ar';
  const title = isAr ? property.titleAr : property.title;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
            <span className="flex items-center gap-1 underline cursor-pointer hover:text-black">
              <MapPin className="w-4 h-4" /> {property.city}, {property.address}
            </span>
            <span>•</span>
            <span className="text-white bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-md font-bold">
              {isAr ? 'قابل للتفاوض' : 'Negotiable'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button className="flex items-center gap-2 text-sm font-medium underline hover:text-gray-500 transition-colors">
            <Share2 className="w-4 h-4" /> {isAr ? 'مشاركة' : 'Share'}
          </button>
          <button className="flex items-center gap-2 text-sm font-medium underline hover:text-gray-500 transition-colors">
            <Heart className="w-4 h-4" /> {isAr ? 'حفظ' : 'Save'}
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8 group">
        <div className="md:col-span-2 h-full relative cursor-pointer">
          <img src={property.images[0]?.url} alt="Main" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <img src={property.images[1]?.url} alt="Image 2" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
          <img src={property.images[2]?.url} alt="Image 3" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <img src={property.images[3]?.url} alt="Image 4" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
          <div className="relative w-full h-full">
            <img src={property.images[4]?.url || property.images[0]?.url} alt="Image 5" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
            <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-900 font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
              <Grid className="w-4 h-4" />
              {isAr ? 'عرض كل الصور' : 'Show all photos'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Main Info */}
          <div className="flex justify-between items-start pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {property.type} {isAr ? 'بواسطة المالك' : 'by Owner'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms} {isAr ? 'غرف' : 'beds'}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms} {isAr ? 'حمامات' : 'baths'}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {property.area} m²</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{isAr ? 'الوصف' : 'Description'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {isAr ? 
                'عقار مميز بموقع استراتيجي، تشطيبات فاخرة وتصميم عصري يناسب العائلات. يتوفر موقف سيارات وحراسة على مدار الساعة.' : 
                'Exceptional property in a strategic location, luxury finishes and modern design suitable for families. Parking and 24/7 security available.'}
            </p>
          </div>

          {/* Amenities */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{isAr ? 'المميزات والمرافق' : 'Amenities'}</h2>
            <div className="grid grid-cols-2 gap-4">
              {['موقف سيارات / Parking', 'مسبح / Pool', 'حديقة / Garden', 'حراسة / Security'].map(amenity => (
                <div key={amenity} className="flex items-center gap-3 text-gray-700">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span>{isAr ? amenity.split('/')[0] : amenity.split('/')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right/Sticky Column */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-xl shadow-gray-200/50">
            <div className="flex items-end gap-1 mb-6">
              <span className="text-2xl font-bold text-gray-900 dir-ltr">
                {new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(property.price)}
              </span>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <button className="w-full bg-[#E51D53] hover:bg-[#D70466] text-white font-bold py-3 px-4 rounded-lg transition-colors">
                {isAr ? 'طلب معاينة' : 'Request Viewing'}
              </button>
              <button className="w-full bg-white hover:bg-gray-50 border border-gray-900 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                {isAr ? 'إظهار الرقم' : 'Show Number'}
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{isAr ? 'شركة العقارات المتميزة' : 'Premium Real Estate'}</p>
                  <p className="text-sm text-gray-500">{isAr ? 'وسيط عقاري' : 'Real Estate Broker'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
