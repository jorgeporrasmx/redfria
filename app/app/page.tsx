"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getShipments, getCarriers, getShippers } from "@/lib/storage";
import { resetAndReseed } from "@/lib/seed";
import { Shipment, Carrier, Shipper } from "@/lib/models";
import { formatDateTime } from "@/lib/utils";
import { AvailabilityBadge, Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  MapPin,
  ArrowRight,
  RefreshCw,
  Thermometer,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [shippers, setShippers] = useState<Shipper[]>([]);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setShipments(getShipments());
    setCarriers(getCarriers());
    setShippers(getShippers());
  };

  const handleResetData = () => {
    setIsResetting(true);
    setTimeout(() => {
      resetAndReseed();
      loadData();
      setIsResetting(false);
      toast.success("Datos de demo reiniciados");
    }, 500);
  };

  const availableCarriers = carriers.filter(
    (c) => c.availabilityStatus === "GREEN"
  );
  const activeShipments = shipments.filter((s) => s.status === "active");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Panel de Control
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus cargas y unidades en un solo lugar
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetData}
          disabled={isResetting}
          className="mt-4 sm:mt-0"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isResetting ? "animate-spin" : ""}`}
          />
          Reset Demo Data
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {availableCarriers.length}
                </p>
                <p className="text-sm text-gray-500">Unidades disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Package className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {activeShipments.length}
                </p>
                <p className="text-sm text-gray-500">Cargas activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {carriers.length}
                </p>
                <p className="text-sm text-gray-500">Transportistas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {shippers.length}
                </p>
                <p className="text-sm text-gray-500">Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="cliente" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="cliente" className="flex-1 sm:flex-none">
            <Package className="h-4 w-4 mr-2" />
            Soy Cliente
          </TabsTrigger>
          <TabsTrigger value="transportista" className="flex-1 sm:flex-none">
            <Truck className="h-4 w-4 mr-2" />
            Soy Transportista
          </TabsTrigger>
        </TabsList>

        {/* Client Tab */}
        <TabsContent value="cliente">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-between">
                  <Link href="/app/cliente/publicar-carga">
                    Publicar Nueva Carga
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href="/app/mapa">
                    Ver Mapa de Disponibilidad
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Active Shipments */}
            <Card>
              <CardHeader>
                <CardTitle>Cargas Activas</CardTitle>
              </CardHeader>
              <CardContent>
                {activeShipments.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No tienes cargas activas</p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link href="/app/cliente/publicar-carga">
                        Publicar carga
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeShipments.slice(0, 3).map((shipment) => (
                      <div
                        key={shipment.id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {shipment.originCity} → {shipment.destCity}
                            </p>
                            <p className="text-sm text-gray-500">
                              {shipment.productType} • {shipment.pallets} pallets
                            </p>
                          </div>
                          <Badge variant="success">Activa</Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            {shipment.tempRequiredMin}°C a{" "}
                            {shipment.tempRequiredMax}°C
                          </span>
                          <span>{formatDateTime(shipment.pickupWindowStart)}</span>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                        >
                          <Link href={`/app/cliente/matches?id=${shipment.id}`}>
                            Ver Matches
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Carrier Tab */}
        <TabsContent value="transportista">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-between">
                  <Link href="/app/transportista/publicar-unidad">
                    Publicar/Actualizar Unidad
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href="/app/mapa">
                    Ver Mapa de Cargas
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Available Carriers */}
            <Card>
              <CardHeader>
                <CardTitle>Unidades Registradas</CardTitle>
              </CardHeader>
              <CardContent>
                {carriers.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No hay unidades registradas</p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link href="/app/transportista/publicar-unidad">
                        Publicar unidad
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {carriers.slice(0, 4).map((carrier) => (
                      <div
                        key={carrier.id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {carrier.companyName}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {carrier.city}, {carrier.state}
                            </p>
                          </div>
                          <AvailabilityBadge status={carrier.availabilityStatus} />
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            {carrier.tempRangeMin}°C a {carrier.tempRangeMax}°C
                          </span>
                          <span>{carrier.capacityPallets} pallets</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Legal Notice */}
      <div className="mt-12 p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-sm text-gray-600">
          RedFría es un marketplace que conecta clientes y transportistas. No
          presta servicios de transporte ni toma custodia de la carga.
        </p>
      </div>
    </div>
  );
}
