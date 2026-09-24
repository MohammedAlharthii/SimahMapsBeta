'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { Property } from './LeafletMap';

export type { Property };

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  selectedProperty?: Property | null;
  center?: { lat: number; lng: number };
  zoom?: number;
}

// Dynamically import LeafletMap with SSR disabled to prevent 'window is not defined'
const DynamicLeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#09090B] text-zinc-400 gap-3 border border-zinc-800">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-medium text-zinc-300">جاري تحميل خريطة سيما العقارية...</p>
    </div>
  ),
});

export default function PropertyMap(props: PropertyMapProps) {
  return (
    <div className="w-full h-full relative">
      <DynamicLeafletMap {...props} />
    </div>
  );
}
