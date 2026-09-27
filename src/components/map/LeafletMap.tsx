'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Layers, Globe } from 'lucide-react';

export interface Property {
  id: string;
  title: string;
  titleAr: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  purpose: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  images: { url: string; alt: string }[];
  isFeatured: boolean;
}

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  selectedProperty?: Property | null;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const CARTO_API_KEY = 'cb1_3w2i_1_0086e70d092d4c1ac7eb1dc2';

function getTileUrl(theme: 'dark' | 'voyager' | 'satellite') {
  if (theme === 'satellite') {
    // High-definition Google Satellite with terrain and labels
    return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
  }
  if (theme === 'voyager') {
    return `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`;
  }
  return `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`;
}

export default function LeafletMap({
  properties,
  onPropertySelect,
  selectedProperty,
  center = { lat: 24.7136, lng: 46.6753 },
  zoom = 12,
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [mapTheme, setMapTheme] = useState<'dark' | 'voyager' | 'satellite'>('dark');
  const router = useRouter();

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
    });

    const initialUrl = getTileUrl(mapTheme);

    const tileLayer = L.tileLayer(initialUrl, {
      maxZoom: 20,
      attribution: '&copy; خريطة سيما',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Zoom controls
    L.control
      .zoom({
        position: 'topleft',
      })
      .addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Switch Map Theme between Carto Dark, Voyager, and Satellite
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const newUrl = getTileUrl(mapTheme);
    tileLayerRef.current.setUrl(newUrl);
  }, [mapTheme]);

  // 3. Render Custom Markers with navigation to Details Page
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    properties.forEach((property) => {
      const lat = property.latitude || 24.7136;
      const lng = property.longitude || 46.6753;

      const formattedPrice = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(property.price);

      const isSelected = selectedProperty?.id === property.id;

      // Custom HTML Marker Pill
      const customIcon = L.divIcon({
        className: 'sima-leaflet-marker-container',
        html: `
          <div class="sima-marker-pill ${isSelected ? 'selected' : ''}" id="marker-${property.id}">
            <div class="sima-marker-dot"></div>
            <span class="sima-marker-price">${formattedPrice} <span class="currency">ر.س</span></span>
          </div>
        `,
        iconSize: [85, 34],
        iconAnchor: [42, 17],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const mainImage = property.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';
      const displayTitle = property.titleAr || property.title;
      const isPartner = property.purpose?.toUpperCase() === 'PARTNER' || property.purpose?.toUpperCase() === 'INVESTMENT';
      const badgeText = isPartner ? 'عروض شركاء سيما' : 'عروض سيما';
      const badgeBg = isPartner ? '#d97706' : '#F15A24';
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const shareUrl = `${origin}/properties/${property.id}`;
      const shareMessage = `🏡 *عرض عقاري من خريطة سيما* 📍\n✨ *${displayTitle}*\n🏷️ التصنيف: ${badgeText}\n💰 السعر: ${new Intl.NumberFormat('ar-SA').format(property.price)} ريال\n🔗 تفاصيل العرض والخريطة:\n${shareUrl}`;

      // Popup with direct link to details page and quick WhatsApp share
      const popupHtml = `
        <div class="sima-popup-card" dir="rtl">
          <a href="/properties/${property.id}" class="sima-popup-image-wrapper block">
            <img src="${mainImage}" alt="${displayTitle}" class="sima-popup-image" />
            <div class="sima-popup-badge" style="background-color: ${badgeBg}; color: #ffffff !important;">${badgeText}</div>
            ${property.isFeatured ? '<div class="sima-popup-featured">مميز</div>' : ''}
          </a>
          <div class="sima-popup-content">
            <a href="/properties/${property.id}" class="sima-popup-title hover:text-[#F15A24] transition-colors block" style="color: #ffffff !important; text-decoration: none;">
              ${displayTitle}
            </a>
            <div class="sima-popup-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F15A24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${property.city} • ${property.address || property.city}</span>
            </div>
            <div class="sima-popup-specs">
              ${property.bedrooms ? `<span>🛏️ ${property.bedrooms} غرف</span>` : ''}
              ${property.bathrooms ? `<span>🚿 ${property.bathrooms} حمام</span>` : ''}
              <span>📐 ${property.area} م²</span>
            </div>
            <div class="sima-popup-footer" style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
              <div class="sima-popup-price">
                ${new Intl.NumberFormat('ar-SA').format(property.price)} <small>ر.س</small>
              </div>
              <div style="display:flex; align-items:center; gap:5px;">
                <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}" target="_blank" rel="noreferrer" title="مشاركة عبر واتساب" style="background:#25D366; color:#ffffff; padding:5px 8px; border-radius:8px; font-size:11px; text-decoration:none; font-weight:bold; display:inline-flex; align-items:center;">
                  واتساب
                </a>
                <a href="/properties/${property.id}" class="sima-popup-btn" style="text-decoration:none; display:inline-block;">
                  عرض ←
                </a>
              </div>
            </div>
          </div>
        </div>
      `;

      const popup = L.popup({
        maxWidth: 300,
        minWidth: 260,
        className: 'sima-dark-popup',
        offset: [0, -10],
      }).setContent(popupHtml);

      marker.bindPopup(popup);

      marker.on('click', () => {
        onPropertySelect?.(property);
      });

      marker.addTo(markersLayer);
    });

    if (selectedProperty) {
      const lat = selectedProperty.latitude || 24.7136;
      const lng = selectedProperty.longitude || 46.6753;
      map.flyTo([lat, lng], 15, { duration: 1.2 });
    }
  }, [properties, selectedProperty, onPropertySelect, router]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0A0A0C]">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Theme Switcher on Map */}
      <div className="absolute top-4 left-4 z-10 flex items-center bg-zinc-950/95 backdrop-blur-md rounded-2xl border border-zinc-800 p-1 shadow-2xl">
        <button
          onClick={() => setMapTheme('satellite')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapTheme === 'satellite'
              ? 'bg-[#F15A24] text-white shadow-md shadow-orange-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="استعراض تضاريس وطبيعة الأرض عبر الأقمار الصناعية"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>🛰️ ساتالايت (طبيعة الأرض)</span>
        </button>
        <button
          onClick={() => setMapTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapTheme === 'dark'
              ? 'bg-[#F15A24] text-white shadow-md shadow-orange-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>ليلي Dark</span>
        </button>
        <button
          onClick={() => setMapTheme('voyager')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapTheme === 'voyager'
              ? 'bg-[#F15A24] text-white shadow-md shadow-orange-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>شوارع Voyager</span>
        </button>
      </div>

      {/* Floating Map Branding Watermark */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none flex items-center gap-2 bg-zinc-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-800 text-xs text-zinc-400 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-[#F15A24] animate-pulse"></span>
        <span className="font-bold text-zinc-200">خريطة سيما</span>
        <span className="text-zinc-600">|</span>
        <span className="text-[11px] text-zinc-400">
          {mapTheme === 'satellite' ? 'بث الأقمار الصناعية عالي الدقة' : 'خريطة الصكوك والمخططات'}
        </span>
      </div>
    </div>
  );
}
