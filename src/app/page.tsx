'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PropertyMap, { Property } from '@/components/map/PropertyMap';
import PropertySearch from '@/components/search/PropertySearch';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, LogOut, LogIn, Crown, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import LoginGate from '@/components/auth/LoginGate';

// Sample properties with coordinates
// Sample properties with coordinates
const fallbackProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Villa with Pool',
    titleAr: 'فيلا مودرن فاخرة مع مسبح خاص',
    price: 2500000,
    area: 450,
    bedrooms: 5,
    bathrooms: 4,
    type: 'VILLA',
    status: 'AVAILABLE',
    purpose: 'SALE',
    latitude: 24.7136,
    longitude: 46.6753,
    address: 'حي العليا، شارع التحلية',
    city: 'الرياض',
    images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', alt: 'Villa' }],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Commercial Investment Building',
    titleAr: 'عمارة تجارية استثمارية بالرياض',
    price: 4850000,
    area: 950,
    bedrooms: 0,
    bathrooms: 8,
    type: 'BUILDING',
    status: 'AVAILABLE',
    purpose: 'SALE',
    latitude: 24.7236,
    longitude: 46.6853,
    address: 'حي الملز، طريق الملك عبدالعزيز',
    city: 'الرياض',
    images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', alt: 'Building' }],
    isFeatured: false
  },
  {
    id: '3',
    title: 'Commercial Office Space',
    titleAr: 'مقر مكتبي تجاري بتشطيبات ذكية',
    price: 1850000,
    area: 320,
    bedrooms: 0,
    bathrooms: 3,
    type: 'OFFICE',
    status: 'AVAILABLE',
    purpose: 'SALE',
    latitude: 24.6936,
    longitude: 46.6553,
    address: 'حي الغدير، برج الأعمال',
    city: 'الرياض',
    images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', alt: 'Office' }],
    isFeatured: true
  },
  {
    id: '4',
    title: 'Luxury Villa Compound',
    titleAr: 'فيلا قصر مودرن شمال الرياض',
    price: 3600000,
    area: 600,
    bedrooms: 6,
    bathrooms: 5,
    type: 'VILLA',
    status: 'AVAILABLE',
    purpose: 'SALE',
    latitude: 24.6836,
    longitude: 46.7253,
    address: 'حي النرجس، شمال الرياض',
    city: 'الرياض',
    images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', alt: 'Villa' }],
    isFeatured: false
  },
  {
    id: '5',
    title: 'Luxury Villa in Jeddah',
    titleAr: 'قصر بحري فاخر على الكورنيش',
    price: 5000000,
    area: 800,
    bedrooms: 7,
    bathrooms: 6,
    type: 'VILLA',
    status: 'AVAILABLE',
    purpose: 'SALE',
    latitude: 21.5433,
    longitude: 39.1728,
    address: 'حي الشاطئ، كورنيش جدة',
    city: 'جدة',
    images: [{ url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', alt: 'Villa' }],
    isFeatured: true
  }
];

function getRoleArabic(role?: string) {
  switch (role) {
    case 'SYSTEM_ADMIN': return 'مدير النظام';
    case 'GENERAL_MANAGER': return 'مدير عام';
    case 'SALES_MANAGER': return 'مدير مبيعات';
    case 'PROPERTY_MANAGER': return 'مسؤول عقارات';
    case 'CUSTOMER_SERVICE': return 'خدمة عملاء';
    case 'INTERNAL_MARKETER': return 'مسوق عقاري';
    case 'EXTERNAL_MARKETER': return 'مسوق خارجي';
    case 'CONTRACTS_OFFICER': return 'مسؤول عقود';
    case 'ACCOUNTANT': return 'محاسب';
    default: return 'عضو معتمد';
  }
}

export default function HomePage() {
  const { data: session, status } = useSession();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>(fallbackProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);

  const lang = 'ar';
  const isAr = lang === 'ar';

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          if (data.properties && data.properties.length > 0) {
            const formatted: Property[] = data.properties.map((p: any) => ({
              id: p.id,
              title: p.title,
              titleAr: p.titleAr || p.title,
              price: Number(p.price),
              area: Number(p.area),
              bedrooms: p.bedrooms || 0,
              bathrooms: p.bathrooms || 0,
              type: p.type,
              status: p.status,
              purpose: p.purpose,
              latitude: p.latitude || 24.7136,
              longitude: p.longitude || 46.6753,
              address: p.address || p.city || 'الرياض',
              city: p.city || 'الرياض',
              images: p.images && p.images.length > 0
                ? p.images.map((img: any) => ({ url: img.url, alt: img.alt || '' }))
                : [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', alt: 'Property' }],
              isFeatured: p.isFeatured || false,
            }));
            setProperties(formatted);
          }
        }
      } catch (err) {
        console.error('Failed to fetch properties from DB, using fallback data:', err);
      }
    }

    loadProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (p.titleAr || '').toLowerCase().includes(q) || (p.title || '').toLowerCase().includes(q);
        const matchCity = (p.city || '').toLowerCase().includes(q);
        const matchAddress = (p.address || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchAddress) return false;
      }
      if (selectedType && p.type.toUpperCase() !== selectedType.toUpperCase()) {
        return false;
      }
      if (selectedPurpose && p.purpose.toUpperCase() !== selectedPurpose.toUpperCase()) {
        return false;
      }
      return true;
    });
  }, [properties, searchQuery, selectedType, selectedPurpose]);

  const userRole = (session?.user as any)?.role;
  const isStaff = userRole && userRole !== 'CLIENT';

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#09090B]">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="خريطة سيما" className="h-16 w-auto animate-pulse" />
          <div className="w-8 h-8 border-2 border-[#F15A24] border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-400 text-xs">جاري تحميل خريطة سيما...</span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <LoginGate onSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#09090B] text-zinc-100">
      {/* Luxury Dark Navbar matching SIMA Logo (Clean, prominent logo, orange SIMA word removed) */}
      <header className="bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2 flex items-center justify-between z-50 shrink-0" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Highly visible logo */}
            <img
              src="/logo.png"
              alt="خريطة سيما"
              className="h-11 md:h-12 w-auto object-contain drop-shadow-md transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tight text-white transition-colors">
                خريطة سيما
              </span>
              <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">
                خريطة الصكوك والعروض العقارية المباشرة
              </span>
            </div>
          </Link>
        </div>

        {/* User Status / Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {session?.user ? (
            <>
              {/* User Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#F15A24] to-amber-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  {session.user?.name ? session.user.name.charAt(0) : 'U'}
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-white font-semibold text-xs leading-tight">
                    {session.user?.name || 'مستخدم معتمد'}
                  </span>
                  <span className="text-[10px] text-[#F15A24] font-medium flex items-center gap-0.5">
                    {userRole === 'SYSTEM_ADMIN' && <Crown className="w-2.5 h-2.5 inline" />}
                    {getRoleArabic(userRole)}
                  </span>
                </div>
              </div>

              {/* Direct link to dashboard for managers / staff */}
              {isStaff && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 hover:text-white px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#F15A24]/60 transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#F15A24]" />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-red-400 px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-red-500/30 transition-all"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white px-4 py-2 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>دخول النظام</span>
            </Link>
          )}
        </div>
      </header>

      {/* Top Search & Filter Bar */}
      <div className="z-40 shrink-0">
        <PropertySearch
          lang={lang}
          onSearchChange={setSearchQuery}
          onTypeFilter={setSelectedType}
          onPurposeFilter={setSelectedPurpose}
        />
      </div>

      {/* Full-Screen Leaflet Dark Mode Map */}
      <div className="relative flex-grow w-full h-full overflow-hidden">
        <PropertyMap
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          onPropertySelect={(p) => setSelectedProperty(p)}
        />

        {/* Floating Quick Count Badge on Map */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none bg-zinc-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-800 shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F15A24] animate-pulse"></span>
          <span className="text-xs font-bold text-white">
            {filteredProperties.length} عرض عقاري متوفر على الخريطة
          </span>
        </div>
      </div>
    </div>
  );
}
