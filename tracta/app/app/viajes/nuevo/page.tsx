"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { getClientes, saveViaje, nextFolio } from "@/lib/storage";
import { Cliente, Viaje } from "@/lib/models";
import {
  MEXICAN_STATES,
  MAJOR_CITIES,
  CARGO_TYPES,
  UNIT_TYPES,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>;
}

export default function NuevoViajePage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState({
    clienteId: "",
    originState: "",
    originCity: "",
    destState: "",
    destCity: "",
    pickupDate: "",
    deliveryDate: "",
    cargoType: "",
    unitTypeRequired: "",
    weightKg: "",
    tarifaCliente: "",
    costoTransportista: "",
    specialRequirements: "",
    description: "",
  });

  useEffect(() => {
    setClientes(getClientes());
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clienteId) return toast.error("Selecciona un cliente");
    if (!form.originCity || !form.destCity) return toast.error("Captura origen y destino");
    if (!form.pickupDate) return toast.error("Indica la fecha de recolección");
    if (!form.cargoType || !form.unitTypeRequired) return toast.error("Indica carga y unidad");
    if (!form.tarifaCliente) return toast.error("Captura la tarifa al cliente");

    const viaje: Viaje = {
      id: uuidv4(),
      folio: nextFolio(),
      clienteId: form.clienteId,
      originCity: form.originCity,
      originState: form.originState,
      destCity: form.destCity,
      destState: form.destState,
      pickupDate: new Date(form.pickupDate).toISOString(),
      deliveryDate: form.deliveryDate ? new Date(form.deliveryDate).toISOString() : undefined,
      cargoType: form.cargoType,
      unitTypeRequired: form.unitTypeRequired,
      weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      description: form.description || undefined,
      specialRequirements: form.specialRequirements || undefined,
      tarifaCliente: Number(form.tarifaCliente),
      costoTransportista: form.costoTransportista ? Number(form.costoTransportista) : undefined,
      status: "cotizacion",
      checkpoints: [],
      expenses: [],
      cartaPorteValidated: false,
      createdAt: new Date().toISOString(),
    };

    saveViaje(viaje);
    toast.success(`Viaje ${viaje.folio} creado`);
    router.push(`/app/viajes/${viaje.id}`);
  };

  const originCities = MAJOR_CITIES[form.originState] ?? [];
  const destCities = MAJOR_CITIES[form.destState] ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/app/viajes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Viajes
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nuevo viaje / cotización</h1>
      <p className="text-sm text-gray-500 mb-6">
        Registra la carga de tu cliente. Luego asignas transportista y das seguimiento.
      </p>

      {clientes.length === 0 && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          No tienes clientes registrados.{" "}
          <Link href="/app/clientes/nuevo" className="font-medium underline">
            Crea un cliente primero
          </Link>
          .
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <Label>Cliente *</Label>
              <Select value={form.clienteId} onChange={(e) => set("clienteId", e.target.value)}>
                <option value="">Selecciona un cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estado origen *</Label>
                <Select value={form.originState} onChange={(e) => { set("originState", e.target.value); set("originCity", ""); }}>
                  <option value="">Estado</option>
                  {MEXICAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label>Ciudad origen *</Label>
                {originCities.length > 0 ? (
                  <Select value={form.originCity} onChange={(e) => set("originCity", e.target.value)}>
                    <option value="">Ciudad</option>
                    {originCities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                ) : (
                  <Input value={form.originCity} onChange={(e) => set("originCity", e.target.value)} placeholder="Ciudad" />
                )}
              </div>
              <div>
                <Label>Estado destino *</Label>
                <Select value={form.destState} onChange={(e) => { set("destState", e.target.value); set("destCity", ""); }}>
                  <option value="">Estado</option>
                  {MEXICAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label>Ciudad destino *</Label>
                {destCities.length > 0 ? (
                  <Select value={form.destCity} onChange={(e) => set("destCity", e.target.value)}>
                    <option value="">Ciudad</option>
                    {destCities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                ) : (
                  <Input value={form.destCity} onChange={(e) => set("destCity", e.target.value)} placeholder="Ciudad" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Recolección *</Label>
                <Input type="datetime-local" value={form.pickupDate} onChange={(e) => set("pickupDate", e.target.value)} />
              </div>
              <div>
                <Label>Entrega estimada</Label>
                <Input type="datetime-local" value={form.deliveryDate} onChange={(e) => set("deliveryDate", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de carga *</Label>
                <Select value={form.cargoType} onChange={(e) => set("cargoType", e.target.value)}>
                  <option value="">Selecciona</option>
                  {CARGO_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <Label>Tipo de unidad *</Label>
                <Select value={form.unitTypeRequired} onChange={(e) => set("unitTypeRequired", e.target.value)}>
                  <option value="">Selecciona</option>
                  {UNIT_TYPES.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                </Select>
              </div>
              <div>
                <Label>Peso (kg)</Label>
                <Input type="number" min="0" value={form.weightKg} onChange={(e) => set("weightKg", e.target.value)} placeholder="Ej. 22000" />
              </div>
            </div>

            <div>
              <Label>Requerimientos especiales</Label>
              <Input value={form.specialRequirements} onChange={(e) => set("specialRequirements", e.target.value)} placeholder="Ej. Custodia, maniobras, lonas..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-gray-900">Tarifas y margen</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tarifa al cliente (MXN) *</Label>
                <Input type="number" min="0" value={form.tarifaCliente} onChange={(e) => set("tarifaCliente", e.target.value)} placeholder="Ej. 34000" />
              </div>
              <div>
                <Label>Costo transportista (MXN)</Label>
                <Input type="number" min="0" value={form.costoTransportista} onChange={(e) => set("costoTransportista", e.target.value)} placeholder="Opcional" />
              </div>
            </div>
            {form.tarifaCliente && form.costoTransportista && (
              <p className="text-sm font-medium text-green-700">
                Margen estimado: ${(Number(form.tarifaCliente) - Number(form.costoTransportista)).toLocaleString("es-MX")}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button asChild variant="outline" type="button">
            <Link href="/app/viajes">Cancelar</Link>
          </Button>
          <Button type="submit">Crear viaje</Button>
        </div>
      </form>
    </div>
  );
}
