"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getTransportistas } from "@/lib/storage";
import { Transportista } from "@/lib/models";
import { MEXICAN_STATES, UNIT_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TransportistaCard } from "@/components/transportista-card";
import { Plus, Search } from "lucide-react";

export default function TransportistasPage() {
  const [items, setItems] = useState<Transportista[]>([]);
  const [query, setQuery] = useState("");
  const [availFilter, setAvailFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");

  useEffect(() => { setItems(getTransportistas()); }, []);

  const filtered = useMemo(() => {
    return items
      .filter((t) => availFilter === "all" || t.availabilityStatus === availFilter)
      .filter((t) => stateFilter === "all" || t.state === stateFilter)
      .filter((t) => unitFilter === "all" || t.unitTypes.includes(unitFilter))
      .filter((t) =>
        !query.trim() ||
        t.companyName.toLowerCase().includes(query.toLowerCase()) ||
        t.contactName.toLowerCase().includes(query.toLowerCase())
      );
  }, [items, availFilter, stateFilter, unitFilter, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transportistas</h1>
          <p className="text-sm text-gray-500">{filtered.length} de {items.length} proveedores</p>
        </div>
        <Button asChild className="gap-1.5">
          <Link href="/app/transportistas/nuevo"><Plus className="h-4 w-4" /> Nuevo transportista</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Input placeholder="Buscar..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)}>
          <option value="all">Disponibilidad</option>
          <option value="GREEN">Disponible</option>
          <option value="YELLOW">Por estar disponible</option>
          <option value="RED">No disponible</option>
        </Select>
        <Select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)}>
          <option value="all">Tipo de unidad</option>
          {UNIT_TYPES.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
        </Select>
        <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
          <option value="all">Estado</option>
          {MEXICAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
          No se encontraron transportistas.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => <TransportistaCard key={t.id} transportista={t} />)}
        </div>
      )}
    </div>
  );
}
