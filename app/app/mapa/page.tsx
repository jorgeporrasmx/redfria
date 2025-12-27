"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge, AvailabilityBadge } from "@/components/ui/badge";
import { RatingDisplay } from "@/components/ui/rating";
import { CardSkeleton } from "@/components/ui/skeleton";
import { getCarriers } from "@/lib/storage";
import { Carrier } from "@/lib/models";
import { MEXICAN_STATES } from "@/lib/constants";
import {
  Filter,
  MapPin,
  Thermometer,
  Package,
  MessageCircle,
  User,
  X,
  Truck,
} from "lucide-react";
import Link from "next/link";

// Dynamic import for map component (Leaflet requires client-side only)
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
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [filteredCarriers, setFilteredCarriers] = useState<Carrier[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [minCapacity, setMinCapacity] = useState<string>("0");

  useEffect(() => {
    const loadedCarriers = getCarriers();
    setCarriers(loadedCarriers);
    setFilteredCarriers(loadedCarriers);
    setIsLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...carriers];

    if (availabilityFilter !== "all") {
      filtered = filtered.filter((c) => c.availabilityStatus === availabilityFilter);
    }

    if (stateFilter !== "all") {
      filtered = filtered.filter((c) => c.state === stateFilter);
    }

    const minCap = parseInt(minCapacity);
    if (minCap > 0) {
      filtered = filtered.filter((c) => c.capacityPallets >= minCap);
    }

    setFilteredCarriers(filtered);
  }, [carriers, availabilityFilter, stateFilter, minCapacity]);

  // Get unique states from carriers
  const uniqueStates = [...new Set(carriers.map((c) => c.state))].sort();

  // Count by availability
  const counts = {
    total: filteredCarriers.length,
    green: filteredCarriers.filter((c) => c.availabilityStatus === "GREEN").length,
    yellow: filteredCarriers.filter((c) => c.availabilityStatus === "YELLOW").length,
    red: filteredCarriers.filter((c) => c.availabilityStatus === "RED").length,
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex">
        <div className="w-80 p-4 border-r bg-white">
          <CardSkeleton />
        </div>
        <div className="flex-1 bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      {/* Sidebar - Filters */}
      <div className="w-full md:w-80 p-4 border-b md:border-b-0 md:border-r bg-white overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mapa de Unidades</h1>
            <p className="text-sm text-gray-500 mt-1">
              Encuentra unidades refrigeradas disponibles
            </p>
          </div>

          {/* Status counts */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{counts.total} total</Badge>
            <Badge
              variant="success"
              className="cursor-pointer"
              onClick={() => setAvailabilityFilter("GREEN")}
            >
              {counts.green} disponibles
            </Badge>
            <Badge
              variant="warning"
              className="cursor-pointer"
              onClick={() => setAvailabilityFilter("YELLOW")}
            >
              {counts.yellow} próximos
            </Badge>
            <Badge
              variant="danger"
              className="cursor-pointer"
              onClick={() => setAvailabilityFilter("RED")}
            >
              {counts.red} no disponibles
            </Badge>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponibilidad
                </label>
                <Select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="all">Todas</option>
                  <option value="GREEN">Disponible ahora</option>
                  <option value="YELLOW">Por estar disponible</option>
                  <option value="RED">No disponible</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <Select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  {uniqueStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad mínima (pallets)
                </label>
                <Select
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(e.target.value)}
                >
                  <option value="0">Sin mínimo</option>
                  <option value="10">10+ pallets</option>
                  <option value="20">20+ pallets</option>
                  <option value="30">30+ pallets</option>
                </Select>
              </div>

              {(availabilityFilter !== "all" ||
                stateFilter !== "all" ||
                minCapacity !== "0") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setAvailabilityFilter("all");
                    setStateFilter("all");
                    setMinCapacity("0");
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Semáforo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Disponible ahora</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600">Por estar disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">No disponible</span>
              </div>
            </CardContent>
          </Card>

          {/* Empty state */}
          {filteredCarriers.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay unidades con estos filtros</p>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapComponent
          carriers={filteredCarriers}
          selectedCarrierId={selectedCarrier?.id}
          onSelectCarrier={setSelectedCarrier}
        />

        {/* Selected carrier panel (mobile overlay) */}
        {selectedCarrier && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-lg shadow-lg border">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedCarrier.companyName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedCarrier.contactName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCarrier(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <AvailabilityBadge status={selectedCarrier.availabilityStatus} />

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {selectedCarrier.city}, {selectedCarrier.state}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Thermometer className="h-4 w-4" />
                  {selectedCarrier.tempRangeMin}°C a {selectedCarrier.tempRangeMax}°C
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4" />
                  {selectedCarrier.capacityPallets} pallets
                </div>
              </div>

              {selectedCarrier.ratingAvg > 0 && (
                <div className="mt-3">
                  <RatingDisplay
                    rating={selectedCarrier.ratingAvg}
                    count={selectedCarrier.ratingCount}
                    size="sm"
                  />
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Button asChild variant="whatsapp" className="flex-1">
                  <a
                    href={`https://wa.me/${selectedCarrier.phone.replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contactar
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/app/perfil/carrier/${selectedCarrier.id}`}>
                    <User className="h-4 w-4 mr-2" />
                    Ver Perfil
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
