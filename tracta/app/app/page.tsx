"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getViajes, getClientes, getTransportistas } from "@/lib/storage";
import { Viaje, Cliente, Transportista } from "@/lib/models";
import { tripMargin, isActiveTrip } from "@/lib/trips";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban-board";
import { TripCard } from "@/components/trip-card";
import {
  Truck,
  TrendingUp,
  Users,
  CircleDot,
  Plus,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);

  useEffect(() => {
    setViajes(getViajes());
    setClientes(getClientes());
    setTransportistas(getTransportistas());
  }, []);

  const activos = viajes.filter(isActiveTrip);
  const enTransito = viajes.filter((v) => v.status === "en_transito");
  const disponibles = transportistas.filter((t) => t.availabilityStatus === "GREEN");
  const margenTotal = viajes
    .filter((v) => v.costoTransportista !== undefined && v.status !== "cancelado")
    .reduce((sum, v) => sum + tripMargin(v), 0);

  const clienteById = (id: string) => clientes.find((c) => c.id === id);

  const stats = [
    { label: "Viajes activos", value: activos.length, icon: Truck, color: "text-primary-600 bg-primary-50" },
    { label: "En tránsito", value: enTransito.length, icon: CircleDot, color: "text-amber-600 bg-amber-50" },
    { label: "Margen acumulado", value: formatMoney(margenTotal), icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "Transportistas disponibles", value: disponibles.length, icon: Users, color: "text-indigo-600 bg-indigo-50" },
  ];

  const recientes = [...viajes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tablero de operación</h1>
          <p className="text-sm text-gray-500">
            Control de tráfico y estado de tus viajes
          </p>
        </div>
        <Button asChild className="gap-1.5">
          <Link href="/app/viajes/nuevo">
            <Plus className="h-4 w-4" /> Nuevo viaje
          </Link>
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{s.label}</span>
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Dispatch board */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Despacho</h2>
        <Link
          href="/app/viajes"
          className="text-sm text-primary-600 hover:underline flex items-center gap-1"
        >
          Ver todos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {viajes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Truck className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">Aún no hay viajes registrados.</p>
          <Button asChild className="mt-4 gap-1.5">
            <Link href="/app/viajes/nuevo">
              <Plus className="h-4 w-4" /> Crear el primero
            </Link>
          </Button>
        </div>
      ) : (
        <KanbanBoard viajes={viajes} clientes={clientes} />
      )}

      {/* Recent trips */}
      {recientes.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad reciente
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recientes.map((v) => (
              <TripCard key={v.id} viaje={v} cliente={clienteById(v.clienteId)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
