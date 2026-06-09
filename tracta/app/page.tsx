"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import {
  Truck,
  LayoutDashboard,
  Users,
  Route,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Tablero de despacho",
    desc: "Todos tus viajes en un Kanban: cotización, asignado, en tránsito y entregado. El control de tráfico en una sola pantalla.",
  },
  {
    icon: Route,
    title: "Match de transportistas",
    desc: "Encuentra al transportista ideal por tipo de unidad, ruta, disponibilidad y documentación en regla.",
  },
  {
    icon: TrendingUp,
    title: "Margen por viaje",
    desc: "Tarifa al cliente vs. costo del transportista. Ve tu utilidad de comisionista en cada operación y en el tablero.",
  },
  {
    icon: MessageCircle,
    title: "Comunicación directa",
    desc: "Coordina con transportistas y avisa a tus clientes por WhatsApp con mensajes prearmados.",
  },
  {
    icon: ShieldCheck,
    title: "Cumplimiento Carta Porte",
    desc: "Valida permiso SICT, placas y seguro de cada transportista antes de asignar la carga.",
  },
  {
    icon: Users,
    title: "Portal de cliente",
    desc: "Tus clientes rastrean su carga por folio en tiempo real, sin llamar por teléfono.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-primary-600" />
            <span className="text-xl font-bold tracking-tight text-gray-900">
              {BRAND.name}
            </span>
          </div>
          <Button asChild size="sm">
            <Link href="/app">Entrar al sistema</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
            <Truck className="h-4 w-4" /> Plataforma operativa de autotransporte
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            {BRAND.name}
            <span className="block text-primary-600 mt-2 text-2xl md:text-3xl font-semibold">
              {BRAND.tagline}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            El software para comisionistas de carga en México. Conecta clientes
            con transportistas, controla cada viaje de punta a punta y da
            seguimiento en tiempo real.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/app">
                Abrir tablero <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/app/viajes/nuevo">Crear un viaje</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Todo lo que opera un comisionista, en un solo lugar
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600 mb-4">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Toma el control de tu operación
          </h2>
          <p className="mt-4 text-gray-600">
            Explora el sistema con datos de demostración ya cargados.
          </p>
          <Button asChild size="lg" className="mt-8 gap-2">
            <Link href="/app">
              Entrar al sistema <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
          <p>{BRAND.legal}</p>
          <p className="mt-2 text-xs text-gray-400">
            © {new Date().getFullYear()} {BRAND.name}.
          </p>
        </div>
      </footer>
    </div>
  );
}
