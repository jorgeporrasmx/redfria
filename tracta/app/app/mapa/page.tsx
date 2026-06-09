"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getTransportistas } from "@/lib/storage";
import { Transportista } from "@/lib/models";
import { MEXICAN_STATES, UNIT_TYPES, unitTypeLabel } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AvailabilityBadge } from "@/components/ui/badge";
import { RatingDisplay } from "@/components/ui/rating";
import { MapPin, Truck, MessageCircle, User } from "lucide-react";

const MapComponent = dynamic(
  () => import("@/components/map-component").then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    ),
  }
);

export default function MapaPage() {
  const [items, setItems] = useState<Transportista[]>([]);
  const [selected, setSelected] = useState<Transportista | null>(null);
  const [availFilter, setAvailFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");

  useEffect(() => { setItems(getTransportistas()); }, []);

  const filtered = useMemo(() => {
    return items
      .filter((t) => availFilter === "all" || t.availabilityStatus === availFilter)
      .filter((t) => stateFilter === "all" || t.state === stateFilter)
      .filter((t) => unitFilter === "all" || t.unitTypes.includes(unitFilter));
  }, [items, availFilter, stateFilter, unitFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mapa de transportistas</h1>
        <p className="text-sm text-gray-500">Semáforo de disponibilidad por ubicación</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <Select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)}>
          <option value="all">Toda disponibilidad</option>
          <option value="GREEN">Disponible</option>
          <option value="YELLOW">Por estar disponible</option>
          <option value="RED">No disponible</option>
        </Select>
        <Select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)}>
          <option value="all">Todo tipo de unidad</option>
          {UNIT_TYPES.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
        </Select>
        <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
          <option value="all">Todos los estados</option>
          {MEXICAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-[600px]">
          <MapComponent transportistas={filtered} onSelect={setSelected} />
        </div>
        <div>
          {selected ? (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{selected.companyName}</h3>
                  <AvailabilityBadge status={selected.availabilityStatus} />
                </div>
                <div className="space-y-1.5 text-sm text-gray-600 mt-3">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {selected.city}, {selected.state}</p>
                  <p className="flex items-center gap-2"><Truck className="h-4 w-4" /> {selected.unitTypes.map(unitTypeLabel).join(", ")}</p>
                </div>
                {selected.ratingAvg > 0 && <div className="mt-2"><RatingDisplay rating={selected.ratingAvg} count={selected.ratingCount} size="sm" /></div>}
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="whatsapp" size="sm" className="flex-1 gap-1.5">
                    <a href={`https://wa.me/${selected.phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5">
                    <Link href={`/app/transportistas/${selected.id}`}><User className="h-4 w-4" /> Perfil</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-5 text-center text-sm text-gray-400">
                Selecciona un transportista en el mapa para ver detalles.
                <p className="mt-2 text-gray-500">{filtered.length} transportistas visibles</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
