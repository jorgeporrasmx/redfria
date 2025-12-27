"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Snowflake,
  Map,
  Star,
  Zap,
  Truck,
  Package,
  CheckCircle,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-16 md:py-24">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Snowflake className="h-16 w-16 text-white/90" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Capacidad refrigerada
                <br />
                <span className="text-primary-200">en minutos</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-8">
                El marketplace que conecta clientes con transportistas de carga
                refrigerada en el Bajío y Norte de México.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-primary-50"
                >
                  <Link href="/app/cliente/publicar-carga">
                    <Package className="h-5 w-5 mr-2" />
                    Publicar Carga
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link href="/app/transportista/publicar-unidad">
                    <Truck className="h-5 w-5 mr-2" />
                    Publicar Unidad
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Lo que nos hace diferentes
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tecnología diseñada para el transporte refrigerado en México
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <Map className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Semáforo en Mapa
                </h3>
                <p className="text-gray-600">
                  Ve en tiempo real qué unidades están disponibles, próximas a
                  liberarse, o no disponibles. Sin llamadas innecesarias.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <Star className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Reputación Bilateral
                </h3>
                <p className="text-gray-600">
                  Clientes califican transportistas y viceversa. Trabaja solo
                  con quienes tienen historial comprobado.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Match Rápido
                </h3>
                <p className="text-gray-600">
                  Algoritmo inteligente que encuentra las mejores opciones por
                  temperatura, capacidad, ubicación y disponibilidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Cómo funciona
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* For Clients */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-8 w-8 text-primary-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Si necesitas mover carga
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Publica tu carga con origen, destino y temperatura requerida",
                    "Revisa los matches ordenados por compatibilidad y reputación",
                    "Contacta por WhatsApp y cierra el trato directamente",
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                        {i + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-6">
                  <Link href="/app/cliente/publicar-carga">
                    Publicar mi carga
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* For Carriers */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="h-8 w-8 text-primary-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Si tienes unidad disponible
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Registra tu unidad con capacidad y rango de temperatura",
                    "Actualiza tu disponibilidad con el semáforo verde/amarillo/rojo",
                    "Recibe contactos de clientes verificados por WhatsApp",
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                        {i + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-6">
                  <Link href="/app/transportista/publicar-unidad">
                    Publicar mi unidad
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-100 text-green-600 mb-4">
                <Shield className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Confianza en cada viaje
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Mecanismos diseñados para que trabajes con tranquilidad
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Verificación básica",
                  desc: "Datos de contacto y empresa verificados",
                },
                {
                  title: "Calificaciones públicas",
                  desc: "Historial visible antes de contratar",
                },
                {
                  title: "Tags de experiencia",
                  desc: "Puntual, buena comunicación, unidad limpia...",
                },
                {
                  title: "Contacto directo",
                  desc: "Negocias y acuerdas sin intermediarios",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Empieza a usar RedFría hoy
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              Sin cuotas de registro. Publica tu primera carga o unidad en
              minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-700 hover:bg-primary-50"
              >
                <Link href="/app">Entrar a la App</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/app/mapa">Ver Mapa</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
