"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { CarrierCard } from "@/components/carrier-card";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getShipmentById, getCarriers } from "@/lib/storage";
import { matchCarriersToShipment, MatchResult } from "@/lib/matching";
import { Shipment, Carrier } from "@/lib/models";
import { formatDateTime } from "@/lib/utils";
import { MEXICAN_STATES } from "@/lib/constants";
import {
  Package,
  MapPin,
  Thermometer,
  Calendar,
  Map,
  Filter,
  Truck,
  AlertCircle,
} from "lucide-react";

function MatchesContent() {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("id");

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [minRating, setMinRating] = useState<string>("0");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");

  useEffect(() => {
    if (shipmentId) {
      const loadedShipment = getShipmentById(shipmentId);
      if (loadedShipment) {
        setShipment(loadedShipment);
        const carriers = getCarriers();
        const matchResults = matchCarriersToShipment(loadedShipment, carriers);
        setMatches(matchResults);
        setFilteredMatches(matchResults);
      }
    }
    setIsLoading(false);
  }, [shipmentId]);

  // Apply filters
  useEffect(() => {
    let filtered = [...matches];

    // Rating filter
    const minRatingNum = parseFloat(minRating);
    if (minRatingNum > 0) {
      filtered = filtered.filter((m) => m.carrier.ratingAvg >= minRatingNum);
    }

    // Availability filter
    if (availabilityFilter !== "all") {
      filtered = filtered.filter(
        (m) => m.carrier.availabilityStatus === availabilityFilter
      );
    }

    // State filter
    if (stateFilter !== "all") {
      filtered = filtered.filter((m) => m.carrier.state === stateFilter);
    }

    setFilteredMatches(filtered);
  }, [matches, minRating, availabilityFilter, stateFilter]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <CardSkeleton />
          </div>
          <div className="md:col-span-2 space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Carga no encontrada
            </h2>
            <p className="text-gray-600 mb-4">
              La carga que buscas no existe o ha sido eliminada.
            </p>
            <Button asChild>
              <Link href="/app/cliente/publicar-carga">Publicar Nueva Carga</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get unique states from matches for filter
  const uniqueStates = [...new Set(matches.map((m) => m.carrier.state))].sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Transportistas Compatibles
        </h1>
        <p className="text-gray-600 mt-1">
          {filteredMatches.length} unidades encontradas para tu carga
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar - Shipment Details & Filters */}
        <div className="md:col-span-1 space-y-6">
          {/* Shipment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Tu Carga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">
                    {shipment.originCity}, {shipment.originState}
                  </p>
                  <p className="text-sm text-gray-500">→</p>
                  <p className="font-medium text-gray-900">
                    {shipment.destCity}, {shipment.destState}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">
                  {shipment.tempRequiredMin}°C a {shipment.tempRequiredMax}°C
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">
                  {shipment.pallets} pallets • {shipment.productType}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">
                  {formatDateTime(shipment.pickupWindowStart)}
                </span>
              </div>
              {shipment.specialRequirements && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                  {shipment.specialRequirements}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calificación mínima
                </label>
                <Select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                >
                  <option value="0">Todas</option>
                  <option value="3">3+ estrellas</option>
                  <option value="4">4+ estrellas</option>
                  <option value="4.5">4.5+ estrellas</option>
                </Select>
              </div>

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
                  <option value="all">Todos</option>
                  {uniqueStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href="/app/mapa">
                  <Map className="h-4 w-4 mr-2" />
                  Ver en Mapa
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Matches List */}
        <div className="md:col-span-2">
          {filteredMatches.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Truck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay matches con estos filtros
                </h2>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar los filtros o espera a que más unidades estén
                  disponibles.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMinRating("0");
                    setAvailabilityFilter("all");
                    setStateFilter("all");
                  }}
                >
                  Limpiar Filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Results header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    {filteredMatches.length} resultados
                  </Badge>
                  {filteredMatches.filter((m) => m.carrier.availabilityStatus === "GREEN")
                    .length > 0 && (
                    <Badge variant="success">
                      {
                        filteredMatches.filter(
                          (m) => m.carrier.availabilityStatus === "GREEN"
                        ).length
                      }{" "}
                      disponibles
                    </Badge>
                  )}
                </div>
              </div>

              {/* Matches grid */}
              <div className="grid gap-4">
                {filteredMatches.map((match) => (
                  <CarrierCard
                    key={match.carrier.id}
                    carrier={match.carrier}
                    shipment={shipment}
                    score={match.score}
                    reasons={match.reasons}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <CardSkeleton />
            </div>
            <div className="md:col-span-2 space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      }
    >
      <MatchesContent />
    </Suspense>
  );
}
