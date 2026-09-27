import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import AuthProvider from "@/components/providers/AuthProvider";

const notoSansArabic = Noto_Kufi_Arabic({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "خريطة سيما | SIMA Maps",
  description: "خريطة سيما العقارية التفاعلية لاستعراض العقارات ومخططات الأراضي الجوية",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${notoSansArabic.className} bg-[#09090B] text-zinc-100 min-h-screen`}>
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: '#18181B',
                  color: '#fff',
                  border: '1px solid rgba(241, 90, 36, 0.3)',
                },
              }}
            />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
