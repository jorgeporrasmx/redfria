"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getViajeByFolio, getClienteById } from "@/lib/storage";
import { Viaje, Cliente } from "@/lib/models";
import { unitTypeLabel, tripStatusMeta } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { StatusBadge } from "@/components/status-badge";
import { Timeline } from "@/components/timeline";
import { Truck, ArrowRight, MapPin, Calendar, Package, CheckCircle2, Circle } from "lucide-react";

// Public, client-facing progress steps (hide internal billing states)
const PUBLIC_STEPS = ["confirmado", "asignado", "en_transito", "entregado"] as const;

export default function RastreoPage() {
  const { folio } = useParams() as { folio: string };
  const [viaje, setViaje] = useState<Viaje | null | undefined>(undefined);
  const [cliente, setCliente] = useState<Cliente | undefined>();

  useEffect(() => {
    const v = getViajeByFolio(folio);
    setViaje(v ?? null);
    if (v) setCliente(getClienteById(v.clienteId));
  }, [folio]);

  if (viaje === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>;
  }

  if (viaje === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <Truck className="h-10 w-10 text-gray-300" />
        <h1 className="mt-4 text-xl font-bold text-gray-900">Folio no encontrado</h1>
        <p className="mt-1 text-sm text-gray-500">Verifica el número de folio: {folio}</p>
      </div>
    );
  }

  const currentIndex = PUBLIC_STEPS.indexOf(viaje.status as typeof PUBLIC_STEPS[number]);
  const isCancelled = viaje.status === "cancelado";
  // facturado/cerrado are post-delivery → treat as delivered for the public bar
  const effectiveIndex =
    ["facturado", "cerrado"].includes(viaje.status) ? PUBLIC_STEPS.length - 1 : currentIndex;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary-600" />
          <span className="text-lg font-bold text-gray-900">{BRAND.name}</span>
          <span className="ml-auto text-xs text-gray-400">Seguimiento de carga</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-sm font-semibold text-gray-500">{viaje.folio}</span>
            <StatusBadge status={viaje.status} />
          </div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            {viaje.originCity} <ArrowRight className="h-5 w-5 text-gray-400" /> {viaje.destCity}
          </h1>
          {cliente && <p className="text-sm text-gray-500 mt-1">{cliente.companyName}</p>}

          <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-600">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {viaje.originCity}, {viaje.originState}</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {viaje.destCity}, {viaje.destState}</p>
            <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Recolección: {formatDate(viaje.pickupDate)}</p>
            {viaje.deliveryDate && <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Entrega est.: {formatDate(viaje.deliveryDate)}</p>}
            <p className="flex items-center gap-2"><Package className="h-4 w-4" /> {viaje.cargoType}</p>
            <p className="flex items-center gap-2"><Truck className="h-4 w-4" /> {unitTypeLabel(viaje.unitTypeRequired)}</p>
          </div>
        </div>

        {/* Progress bar */}
        {!isCancelled && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
            <div className="flex justify-between">
              {PUBLIC_STEPS.map((step, i) => {
                const done = i <= effectiveIndex;
                const meta = tripStatusMeta(step);
                return (
                  <div key={step} className="flex-1 flex flex-col items-center text-center">
                    {done ? (
                      <CheckCircle2 className="h-7 w-7 text-primary-600" />
                    ) : (
                      <Circle className="h-7 w-7 text-gray-300" />
                    )}
                    <span className={`mt-1 text-xs ${done ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Actualizaciones</h2>
          <Timeline checkpoints={viaje.checkpoints} />
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Powered by {BRAND.name} · {BRAND.tagline}
        </p>
      </main>
    </div>
  );
}
