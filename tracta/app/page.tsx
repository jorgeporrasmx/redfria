import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/lead-form";
import { BRAND } from "@/lib/brand";
import {
  Truck, MessageCircle, LayoutDashboard, Route, TrendingUp, ShieldCheck,
  MapPin, PhoneOff, FileSpreadsheet, AlertTriangle, Check, ArrowRight, PlayCircle,
} from "lucide-react";

const waDirect = `https://wa.me/${BRAND.salesWhatsapp}`;

export default function SalesLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-primary-600" />
            <span className="text-xl font-bold tracking-tight text-gray-900">{BRAND.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/app">Ver demo en vivo</Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <a href="#demo">Agendar demo</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero + form */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/60 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 lg:py-20 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
              <Truck className="h-4 w-4" /> Software para comisionistas de carga en México
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              Toda tu operación de fletes en <span className="text-primary-600">una sola pantalla</span>.
              No en WhatsApp y Excel.
            </h1>
            <p className="mt-5 text-lg text-gray-600">
              Cotiza, asigna al transportista ideal, da seguimiento en tiempo real y conoce el
              margen de cada viaje. {BRAND.name} ordena tu operación para que dejes de apagar
              incendios y empieces a crecer.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <a href="#demo">Agendar demo gratuito <ArrowRight className="h-5 w-5" /></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/app"><PlayCircle className="h-5 w-5" /> Ver demo en vivo</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> Sin instalar nada</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> En español, hecho para México</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> Carta Porte 3.1</span>
            </div>
          </div>

          <div id="demo" className="lg:sticky lg:top-24 scroll-mt-24">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            ¿Tu operación se vive así?
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: PhoneOff, t: "El cliente te marca 5 veces al día", d: "\"¿Dónde va mi carga?\" y tienes que hablarle al operador para averiguarlo." },
              { icon: FileSpreadsheet, t: "Todo vive en WhatsApp y Excel", d: "Si tu coordinador no contesta o se va, la operación —y la cartera— se va con él." },
              { icon: AlertTriangle, t: "No sabes cuánto ganaste", d: "El margen de cada viaje lo descubres hasta fin de mes… si bien te va." },
            ].map((p) => (
              <div key={p.t} className="rounded-xl border border-gray-200 bg-white p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-500">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold text-gray-900">{p.t}</h3>
                <p className="mt-2 text-sm text-gray-600">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution / how it works */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Con {BRAND.name}, controlas todo desde un tablero</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Cuatro pasos. La misma forma en que ya trabajas, pero ordenada y visible para todo tu equipo.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { n: "1", icon: LayoutDashboard, t: "Captura el viaje", d: "Registra la carga de tu cliente en 60 segundos y ve el margen al instante." },
              { n: "2", icon: Route, t: "Asigna transportista", d: "El sistema te sugiere el mejor disponible por unidad, ruta y documentación." },
              { n: "3", icon: MapPin, t: "Da seguimiento", d: "Checkpoints en ruta y evidencia de entrega en un solo expediente." },
              { n: "4", icon: MessageCircle, t: "El cliente se autoatiende", d: "Le mandas una liga de rastreo y deja de llamarte para saber dónde va." },
            ].map((s) => (
              <div key={s.n} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">{s.n}</span>
                  <s.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{s.t}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: TrendingUp, t: "Margen por viaje", d: "Tarifa, costo y utilidad de cada operación, en vivo." },
              { icon: MessageCircle, t: "Rastreo para tu cliente", d: "Portal por folio. Menos llamadas, mejor servicio." },
              { icon: Route, t: "Match de transportistas", d: "El mejor disponible, con razones claras." },
              { icon: ShieldCheck, t: "Cumplimiento sin sustos", d: "Valida Carta Porte, SICT y seguro antes de asignar." },
            ].map((b) => (
              <div key={b.t} className="rounded-xl bg-white p-6 ring-1 ring-gray-200">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <b.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold text-gray-900">{b.t}</h3>
                <p className="mt-2 text-sm text-gray-600">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Hecho para comisionistas de carga</h2>
          <p className="mt-4 text-gray-600">
            Si conectas clientes con transportistas y vives del margen entre lo que cobras y lo
            que pagas, {BRAND.name} es tu centro de control — tengas flota propia o no.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            {["Brokers de carga", "Líneas con subcontratación", "Operadores de tráfico", "Corredores Bajío / Norte / Frontera"].map((tag) => (
              <span key={tag} className="rounded-full bg-primary-50 px-4 py-1.5 font-medium text-primary-700">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">Preguntas frecuentes</h2>
          <div className="mt-10 space-y-5">
            {[
              { q: "¿Tengo que instalar algo?", a: "No. Tracta funciona desde el navegador, en computadora o celular." },
              { q: "¿Mi equipo necesita ser experto en sistemas?", a: "Si saben usar WhatsApp, saben usar Tracta. Capturar un viaje toma menos de un minuto." },
              { q: "¿Sirve si no tengo flota propia?", a: "Está diseñado exactamente para eso: gestionar transportistas subcontratados y tu margen." },
              { q: "¿Emite Carta Porte o facturas?", a: "Tracta valida que tu transportista esté en regla antes de asignar. La emisión fiscal se integra en fases posteriores." },
              { q: "¿Qué incluye el demo gratuito?", a: "Una sesión donde montamos tu operación real (tus rutas y tarifas) y te mostramos cómo se vería tu día a día en Tracta." },
            ].map((f) => (
              <div key={f.q} className="rounded-xl bg-white p-5 ring-1 ring-gray-200">
                <h3 className="font-semibold text-gray-900">{f.q}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl bg-primary-600 px-6 py-12 text-center text-white">
            <h2 className="text-3xl font-bold">Toma el control de tu operación esta semana</h2>
            <p className="mt-3 text-primary-100">
              Agenda una demostración gratuita y a la medida. Sin compromiso.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <a href="#demo">Agendar mi demo <ArrowRight className="h-5 w-5" /></a>
              </Button>
              <Button asChild size="lg" variant="whatsapp" className="gap-2">
                <a href={waDirect} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Escríbenos por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary-600" />
            <span className="font-semibold text-gray-900">{BRAND.name}</span>
            <span className="text-sm text-gray-400">· {BRAND.tagline}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/app" className="hover:text-gray-900">Demo en vivo</Link>
            <a href="#demo" className="hover:text-gray-900">Agendar</a>
            <a href={waDirect} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">WhatsApp</a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400 px-4">{BRAND.legal}</p>
      </footer>
    </div>
  );
}
