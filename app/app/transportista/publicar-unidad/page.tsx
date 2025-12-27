"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailabilityBadge } from "@/components/ui/badge";
import { createCarrierSchema, CreateCarrierInput, Carrier } from "@/lib/models";
import { saveCarrier, getCarriers, updateCarrierAvailability } from "@/lib/storage";
import { MEXICAN_STATES, TEMPERATURE_PRESETS } from "@/lib/constants";
import { toast } from "sonner";
import {
  Truck,
  MapPin,
  Thermometer,
  Package,
  Phone,
  Building,
  User,
  CheckCircle,
} from "lucide-react";

// Approximate coordinates for major cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Querétaro: { lat: 20.5888, lng: -100.3899 },
  Guadalajara: { lat: 20.6597, lng: -103.3496 },
  Monterrey: { lat: 25.6866, lng: -100.3161 },
  "Nuevo Laredo": { lat: 27.4761, lng: -99.5066 },
  "San Luis Potosí": { lat: 22.1565, lng: -100.9855 },
  Aguascalientes: { lat: 21.8818, lng: -102.2916 },
  León: { lat: 21.1221, lng: -101.686 },
  Celaya: { lat: 20.5236, lng: -100.8157 },
  Irapuato: { lat: 20.6767, lng: -101.3555 },
  Saltillo: { lat: 25.4232, lng: -100.9924 },
  Torreón: { lat: 25.5428, lng: -103.4068 },
  "Ciudad Juárez": { lat: 31.6904, lng: -106.4245 },
  Chihuahua: { lat: 28.6353, lng: -106.0889 },
  Reynosa: { lat: 26.0508, lng: -98.2979 },
  Matamoros: { lat: 25.8697, lng: -97.5027 },
};

export default function PublicarUnidadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCarriers, setExistingCarriers] = useState<Carrier[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateCarrierInput>({
    resolver: zodResolver(createCarrierSchema),
    defaultValues: {
      unitType: "reefer",
      availabilityStatus: "GREEN",
      tempRangeMin: -20,
      tempRangeMax: 0,
      capacityPallets: 28,
      lat: 22.5,
      lng: -102.0,
    },
  });

  const city = watch("city");
  const availabilityStatus = watch("availabilityStatus");

  useEffect(() => {
    const carriers = getCarriers();
    setExistingCarriers(carriers);
  }, []);

  // Update coordinates when city changes
  useEffect(() => {
    if (city && cityCoordinates[city]) {
      setValue("lat", cityCoordinates[city].lat);
      setValue("lng", cityCoordinates[city].lng);
    }
  }, [city, setValue]);

  const handleSelectExisting = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    reset({
      companyName: carrier.companyName,
      contactName: carrier.contactName,
      phone: carrier.phone,
      unitType: carrier.unitType,
      city: carrier.city,
      state: carrier.state,
      lat: carrier.lat,
      lng: carrier.lng,
      availabilityStatus: carrier.availabilityStatus,
      nextAvailableAt: carrier.nextAvailableAt,
      tempRangeMin: carrier.tempRangeMin,
      tempRangeMax: carrier.tempRangeMax,
      capacityPallets: carrier.capacityPallets,
    });
  };

  const handleQuickStatusChange = (
    carrierId: string,
    status: Carrier["availabilityStatus"]
  ) => {
    updateCarrierAvailability(carrierId, status);
    setExistingCarriers(getCarriers());
    toast.success(`Estado actualizado a ${status === "GREEN" ? "Disponible" : status === "YELLOW" ? "Por estar disponible" : "No disponible"}`);
  };

  const onSubmit = async (data: CreateCarrierInput) => {
    setIsSubmitting(true);

    try {
      const carrier: Carrier = {
        ...data,
        id: selectedCarrier?.id || uuidv4(),
        ratingAvg: selectedCarrier?.ratingAvg || 0,
        ratingCount: selectedCarrier?.ratingCount || 0,
        tags: selectedCarrier?.tags || [],
        createdAt: selectedCarrier?.createdAt || new Date().toISOString(),
      };

      saveCarrier(carrier);
      toast.success(
        selectedCarrier ? "Unidad actualizada correctamente" : "Unidad publicada correctamente"
      );
      router.push("/app/mapa");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la unidad");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Truck className="h-8 w-8 text-primary-600" />
          Publicar Unidad
        </h1>
        <p className="text-gray-600 mt-2">
          Registra tu unidad refrigerada y actualiza tu disponibilidad
        </p>
      </div>

      {/* Existing carriers quick update */}
      {existingCarriers.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Actualización Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Haz clic en el semáforo para cambiar el estado de disponibilidad
            </p>
            <div className="space-y-3">
              {existingCarriers.slice(0, 5).map((carrier) => (
                <div
                  key={carrier.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedCarrier?.id === carrier.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleSelectExisting(carrier)}
                    >
                      <p className="font-medium text-gray-900">
                        {carrier.companyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {carrier.city}, {carrier.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Quick status buttons */}
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(carrier.id, "GREEN")}
                          className={`w-8 h-8 rounded-full transition-all ${
                            carrier.availabilityStatus === "GREEN"
                              ? "bg-green-500 ring-2 ring-green-300"
                              : "bg-green-200 hover:bg-green-300"
                          }`}
                          title="Disponible"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(carrier.id, "YELLOW")}
                          className={`w-8 h-8 rounded-full transition-all ${
                            carrier.availabilityStatus === "YELLOW"
                              ? "bg-yellow-500 ring-2 ring-yellow-300"
                              : "bg-yellow-200 hover:bg-yellow-300"
                          }`}
                          title="Por estar disponible"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(carrier.id, "RED")}
                          className={`w-8 h-8 rounded-full transition-all ${
                            carrier.availabilityStatus === "RED"
                              ? "bg-red-500 ring-2 ring-red-300"
                              : "bg-red-200 hover:bg-red-300"
                          }`}
                          title="No disponible"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Información de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Empresa *
                </label>
                <Input
                  {...register("companyName")}
                  placeholder="Ej: Transportes del Norte"
                  error={errors.companyName?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Contacto *
                </label>
                <Input
                  {...register("contactName")}
                  placeholder="Ej: Juan Pérez"
                  error={errors.contactName?.message}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono (WhatsApp) *
              </label>
              <Input
                {...register("phone")}
                placeholder="+528112345678"
                error={errors.phone?.message}
              />
              <p className="mt-1 text-xs text-gray-500">
                Formato: +52 seguido de 10 dígitos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <Input
                  {...register("city")}
                  placeholder="Ej: Querétaro"
                  list="cities-list"
                  error={errors.city?.message}
                />
                <datalist id="cities-list">
                  {Object.keys(cityCoordinates).map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <Select {...register("state")} error={errors.state?.message}>
                  <option value="">Seleccionar estado</option>
                  {MEXICAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <input type="hidden" {...register("lat", { valueAsNumber: true })} />
            <input type="hidden" {...register("lng", { valueAsNumber: true })} />
          </CardContent>
        </Card>

        {/* Unit Specs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Especificaciones de la Unidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Unidad
              </label>
              <Select {...register("unitType")}>
                <option value="reefer">Reefer (Refrigerado)</option>
                <option value="caja_seca">Caja Seca</option>
                <option value="plataforma">Plataforma</option>
              </Select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatura Mínima (°C) *
                </label>
                <Input
                  type="number"
                  {...register("tempRangeMin", { valueAsNumber: true })}
                  error={errors.tempRangeMin?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatura Máxima (°C) *
                </label>
                <Input
                  type="number"
                  {...register("tempRangeMax", { valueAsNumber: true })}
                  error={errors.tempRangeMax?.message}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad (pallets) *
              </label>
              <Input
                type="number"
                {...register("capacityPallets", { valueAsNumber: true })}
                min={1}
                max={40}
                error={errors.capacityPallets?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Disponibilidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado actual
              </label>
              <div className="flex flex-wrap gap-3">
                {(["GREEN", "YELLOW", "RED"] as const).map((status) => (
                  <label
                    key={status}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                      availabilityStatus === status
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("availabilityStatus")}
                      value={status}
                      className="sr-only"
                    />
                    <AvailabilityBadge status={status} />
                  </label>
                ))}
              </div>
            </div>

            {availabilityStatus === "YELLOW" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponible a partir de
                </label>
                <Input
                  type="datetime-local"
                  {...register("nextAvailableAt")}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none">
            {isSubmitting
              ? "Guardando..."
              : selectedCarrier
              ? "Actualizar Unidad"
              : "Publicar Unidad"}
          </Button>
        </div>
      </form>
    </div>
  );
}
