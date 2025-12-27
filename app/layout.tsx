import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SeedInitializer } from "@/components/seed-initializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RedFría - Marketplace de Transporte Refrigerado",
  description:
    "Conectamos clientes con transportistas de carga refrigerada en México. Encuentra capacidad en minutos.",
  keywords: [
    "transporte refrigerado",
    "reefer",
    "carga fría",
    "logística",
    "México",
    "marketplace",
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
