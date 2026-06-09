"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { saveTransportista } from "@/lib/storage";
import { Transportista } from "@/lib/models";
import { MEXICAN_STATES, MAJOR_CITIES, UNIT_TYPES, CITY_COORDS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>;
}

export default function NuevoTransportistaPage() {
  const router = useRouter();
  const [units, setUnits] = useState<string[]>([]);
  const [form, setForm] = useState({
    companyName: "", contactName: "", phone: "+52", email: "", rfc: "",
    type: "hombre_camion", state: "", city: "", capacityKg: "",
    baseRate: "", placas: "", permisoSICT: "",
    availabilityStatus: "GREEN", seguroVigente: false, cartaPorteReady: false,
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const toggleUnit = (u: string) =>
    setUnits((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.contactName) return toast.error("Nombre y contacto requeridos");
    if (!/^\+52\d{10}$/.test(form.phone)) return toast.error("Teléfono debe ser +52 y 10 dígitos");
    if (!form.state || !form.city) return toast.error("Ubicación requerida");
    if (units.length === 0) return toast.error("Selecciona al menos un tipo de unidad");

    const base = CITY_COORDS[form.city] ?? { lat: 22 + Math.random(), lng: -101 - Math.random() };
    const t: Transportista = {
      id: uuidv4(),
      companyName: form.companyName,
      contactName: form.contactName,
      phone: form.phone,
      email: form.email || undefined,
      rfc: form.rfc || undefined,
      type: form.type as Transportista["type"],
      unitTypes: units,
      city: form.city,
      state: form.state,
      lat: base.lat,
      lng: base.lng,
      availabilityStatus: form.availabilityStatus as Transportista["availabilityStatus"],
      capacityKg: form.capacityKg ? Number(form.capacityKg) : undefined,
      baseRate: form.baseRate ? Number(form.baseRate) : undefined,
      placas: form.placas || undefined,
      permisoSICT: form.permisoSICT || undefined,
      seguroVigente: form.seguroVigente,
      cartaPorteReady: form.cartaPorteReady,
      ratingAvg: 0,
      ratingCount: 0,
      tags: [],
      createdAt: new Date().toISOString(),
    };
    saveTransportista(t);
    toast.success("Transportista registrado");
    router.push(`/app/transportistas/${t.id}`);
  };

  const cities = MAJOR_CITIES[form.state] ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/app/transportistas" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Transportistas
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo transportista</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre / Razón social *</Label>
                <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
              </div>
              <div>
                <Label>Tipo *</Label>
                <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
                  <option value="hombre_camion">Hombre-camión</option>
                  <option value="linea">Línea transportista</option>
                </Select>
              </div>
              <div>
                <Label>Contacto *</Label>
                <Input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} />
              </div>
              <div>
                <Label>Teléfono *</Label>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+52..." />
              </div>
              <div>
                <Label>Correo</Label>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="opcional" />
              </div>
              <div>
                <Label>RFC</Label>
                <Input value={form.rfc} onChange={(e) => set("rfc", e.target.value)} placeholder="opcional" />
              </div>
              <div>
                <Label>Estado *</Label>
                <Select value={form.state} onChange={(e) => { set("state", e.target.value); set("city", ""); }}>
                  <option value="">Estado</option>
                  {MEXICAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label>Ciudad base *</Label>
                {cities.length > 0 ? (
                  <Select value={form.city} onChange={(e) => set("city", e.target.value)}>
                    <option value="">Ciudad</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                ) : (
                  <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Ciudad" />
                )}
              </div>
            </div>

            <div>
              <Label>Tipos de unidad *</Label>
              <div className="flex flex-wrap gap-2">
                {UNIT_TYPES.map((u) => (
                  <button key={u.value} type="button" onClick={() => toggleUnit(u.value)}>
                    <Badge variant={units.includes(u.value) ? "success" : "outline"} className="cursor-pointer">
                      {u.label}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Capacidad (kg)</Label>
                <Input type="number" min="0" value={form.capacityKg} onChange={(e) => set("capacityKg", e.target.value)} />
              </div>
              <div>
                <Label>Tarifa ref (MXN)</Label>
                <Input type="number" min="0" value={form.baseRate} onChange={(e) => set("baseRate", e.target.value)} />
              </div>
              <div>
                <Label>Disponibilidad</Label>
                <Select value={form.availabilityStatus} onChange={(e) => set("availabilityStatus", e.target.value)}>
                  <option value="GREEN">Disponible</option>
                  <option value="YELLOW">Por estar disponible</option>
                  <option value="RED">No disponible</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-gray-900">Cumplimiento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Placas</Label>
                <Input value={form.placas} onChange={(e) => set("placas", e.target.value)} placeholder="Ej. A12-AAA" />
              </div>
              <div>
                <Label>Permiso SICT</Label>
                <Input value={form.permisoSICT} onChange={(e) => set("permisoSICT", e.target.value)} placeholder="Ej. TPAF01-..." />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.seguroVigente} onChange={(e) => set("seguroVigente", e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
              Póliza de seguro vigente
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.cartaPorteReady} onChange={(e) => set("cartaPorteReady", e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
              Emite Carta Porte 3.1
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button asChild variant="outline" type="button"><Link href="/app/transportistas">Cancelar</Link></Button>
          <Button type="submit">Guardar transportista</Button>
        </div>
      </form>
    </div>
  );
}
