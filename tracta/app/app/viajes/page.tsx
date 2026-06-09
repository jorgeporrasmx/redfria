"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getViajes, getClientes } from "@/lib/storage";
import { Viaje, Cliente } from "@/lib/models";
import { TRIP_STATUSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TripCard } from "@/components/trip-card";
import { Plus, Search } from "lucide-react";

export default function ViajesPage() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setViajes(getViajes());
    setClientes(getClientes());
  }, []);

  const clienteById = (id: string) => clientes.find((c) => c.id === id);

  const filtered = useMemo(() => {
    return viajes
      .filter((v) => statusFilter === "all" || v.status === statusFilter)
      .filter((v) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        const cliente = clienteById(v.clienteId);
        return (
          v.folio.toLowerCase().includes(q) ||
          v.originCity.toLowerCase().includes(q) ||
          v.destCity.toLowerCase().includes(q) ||
          cliente?.companyName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viajes, clientes, statusFilter, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Viajes</h1>
          <p className="text-sm text-gray-500">{filtered.length} de {viajes.length} viajes</p>
        </div>
        <Button asChild className="gap-1.5">
          <Link href="/app/viajes/nuevo">
            <Plus className="h-4 w-4" /> Nuevo viaje
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Input
            placeholder="Buscar por folio, ruta o cliente..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="sm:w-56">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos los estatus</option>
            {TRIP_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
          No se encontraron viajes con esos criterios.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <TripCard key={v.id} viaje={v} cliente={clienteById(v.clienteId)} />
          ))}
        </div>
      )}
    </div>
  );
}
