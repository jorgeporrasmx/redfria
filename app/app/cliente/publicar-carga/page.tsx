"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createShipmentSchema, CreateShipmentInput, Shipment } from "@/lib/models";
import { saveShipment, getShippers } from "@/lib/storage";
import { MEXICAN_STATES, PRODUCT_TYPES, TEMPERATURE_PRESETS } from "@/lib/constants";
import { toast } from "sonner";
import { Package, MapPin, Thermometer, Calendar, Info } from "lucide-react";

export default function PublicarCargaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateShipmentInput>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      tempRequiredMin: -18,
      tempRequiredMax: -10,
      pallets: 20,
    },
  });

  const tempMin = watch("tempRequiredMin");
  const tempMax = watch("tempRequiredMax");

  const applyPreset = (index: number) => {
    const preset = TEMPERATURE_PRESETS[index];
    setValue("tempRequiredMin", preset.min);
    setValue("tempRequiredMax", preset.max);
    setSelectedPreset(index);
  };

  const onSubmit = async (data: CreateShipmentInput) => {
    setIsSubmitting(true);

    try {
      // Get first shipper as mock current user
      const shippers = getShippers();
      const currentShipper = shippers[0];

      if (!currentShipper) {
        toast.error("No hay clientes registrados en el sistema");
        return;
      }

      const shipment: Shipment = {
        ...data,
        id: uuidv4(),
        shipperId: currentShipper.id,
        status: "active",
        createdAt: new Date().toISOString(),
      };

      saveShipment(shipment);
      toast.success("Carga publicada correctamente");
      router.push(`/app/cliente/matches?id=${shipment.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Error al publicar la carga");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date for min pickup date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="h-8 w-8 text-primary-600" />
          Publicar Carga
        </h1>
        <p className="text-gray-600 mt-2">
          Describe tu carga y encuentra transportistas compatibles
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Origin & Destination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Origen y Destino
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad Origen *
                </label>
                <Input
                  {...register("originCity")}
                  placeholder="Ej: Querétaro"
                  error={errors.originCity?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Origen *
                </label>
                <Select {...register("originState")} error={errors.originState?.message}>
                  <option value="">Seleccionar estado</option>
                  {MEXICAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad Destino *
                </label>
                <Input
                  {...register("destCity")}
                  placeholder="Ej: Monterrey"
                  error={errors.destCity?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Destino *
                </label>
                <Select {...register("destState")} error={errors.destState?.message}>
                  <option value="">Seleccionar estado</option>
                  {MEXICAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Window */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Ventana de Recolección
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde *
                </label>
                <Input
                  type="datetime-local"
                  {...register("pickupWindowStart")}
                  min={minDate}
                  error={errors.pickupWindowStart?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta *
                </label>
                <Input
                  type="datetime-local"
                  {...register("pickupWindowEnd")}
                  min={minDate}
                  error={errors.pickupWindowEnd?.message}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Temperatura Requerida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presets comunes
              </label>
              <div className="flex flex-wrap gap-2">
                {TEMPERATURE_PRESETS.map((preset, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant={selectedPreset === i ? "primary" : "outline"}
                    size="sm"
                    onClick={() => applyPreset(i)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatura Mínima (°C) *
                </label>
                <Input
                  type="number"
                  {...register("tempRequiredMin", { valueAsNumber: true })}
                  error={errors.tempRequiredMin?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatura Máxima (°C) *
                </label>
                <Input
                  type="number"
                  {...register("tempRequiredMax", { valueAsNumber: true })}
                  error={errors.tempRequiredMax?.message}
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Rango seleccionado: {tempMin}°C a {tempMax}°C
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalles del Producto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Producto *
              </label>
              <Select {...register("productType")} error={errors.productType?.message}>
                <option value="">Seleccionar tipo</option>
                {PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad de Pallets *
                </label>
                <Input
                  type="number"
                  {...register("pallets", { valueAsNumber: true })}
                  min={1}
                  max={40}
                  error={errors.pallets?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso Total (kg)
                </label>
                <Input
                  type="number"
                  {...register("weightKg", { valueAsNumber: true })}
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requisitos Especiales
              </label>
              <Textarea
                {...register("specialRequirements")}
                placeholder="Ej: Requiere termógrafo, manejo cuidadoso, horario específico..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presupuesto Objetivo (MXN)
              </label>
              <Input
                type="number"
                {...register("budgetTarget", { valueAsNumber: true })}
                placeholder="Opcional"
              />
            </div>
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
            {isSubmitting ? "Publicando..." : "Publicar Carga"}
          </Button>
        </div>
      </form>
    </div>
  );
}
