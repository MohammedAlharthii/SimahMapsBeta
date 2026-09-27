'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, Building, Home, LandPlot, Briefcase, Warehouse } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertySearchProps {
  lang?: 'en' | 'ar';
  onSearchChange?: (query: string) => void;
  onTypeFilter?: (type: string | null) => void;
  onPurposeFilter?: (purpose: string | null) => void;
}

const propertyTypes = [
  { id: 'ALL', labelAr: 'الكل', labelEn: 'All', icon: Building },
  { id: 'VILLA', labelAr: 'فلل', labelEn: 'Villas', icon: Home },
  { id: 'BUILDING', labelAr: 'عمائر', labelEn: 'Buildings', icon: Warehouse },
  { id: 'OFFICE', labelAr: 'مكاتب', labelEn: 'Offices', icon: Briefcase },
];

export default function PropertySearch({
  lang = 'ar',
  onSearchChange,
  onTypeFilter,
  onPurposeFilter,
}: PropertySearchProps) {
  const isAr = lang === 'ar';
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('ALL');
  const [activePurpose, setActivePurpose] = useState<'ALL' | 'SALE'>('ALL');

  const handleQueryChange = (val: string) => {
    setQuery(val);
    onSearchChange?.(val);
  };

  const handleTypeSelect = (id: string) => {
    setActiveType(id);
    onTypeFilter?.(id === 'ALL' ? null : id);
  };

  const handlePurposeSelect = (purpose: 'ALL' | 'SALE') => {
    setActivePurpose(purpose);
    onPurposeFilter?.(purpose === 'ALL' ? null : purpose);
  };

  return (
    <div className="w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Top Search Line */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
          {/* Main Search Bar */}
          <div className="relative flex-grow w-full max-w-2xl">
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3.5">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              className="block w-full ps-10 pe-24 py-2.5 bg-zinc-900/90 border border-zinc-700/80 rounded-full text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/20 transition-all shadow-inner"
              placeholder={isAr ? 'ابحث باسم العقار، المدينة (الرياض، جدة...) أو الحي...' : 'Search by title, city, or district...'}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
            />
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className="absolute inset-y-0 end-16 flex items-center pe-2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button className="absolute inset-y-1 end-1 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white px-4 rounded-full text-xs font-bold transition-all shadow-md shadow-orange-500/20 active:scale-95">
              {isAr ? 'بحث' : 'Search'}
            </button>
          </div>

          {/* Purpose Tabs (Sale Only) */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-full shrink-0">
            <button
              onClick={() => handlePurposeSelect('ALL')}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                activePurpose === 'ALL'
                  ? "bg-[#F15A24] text-white shadow-md shadow-orange-500/20"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => handlePurposeSelect('SALE')}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                activePurpose === 'SALE'
                  ? "bg-[#F15A24] text-white shadow-md shadow-orange-500/20"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {isAr ? 'شراء / بيع' : 'Buy / Sale'}
            </button>
          </div>
        </div>

        {/* Property Type Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            const isActive = activeType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border shrink-0",
                  isActive
                    ? "bg-[#F15A24]/15 border-[#F15A24] text-[#F15A24] shadow-sm shadow-orange-500/10 font-bold"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#F15A24]" : "text-zinc-400")} />
                <span>{isAr ? type.labelAr : type.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
