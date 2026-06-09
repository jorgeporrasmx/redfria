import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SeedInitializer } from "@/components/seed-initializer";
import { BRAND } from "@/lib/brand";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.description,
  keywords: [
    "logística",
    "autotransporte",
    "comisionista de transporte",
    "broker de carga",
    "trailers",
    "tráfico",
    "México",
    "TMS",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SeedInitializer />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
