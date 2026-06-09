"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { saveCliente } from "@/lib/storage";
import { Cliente } from "@/lib/models";
import { MEXICAN_STATES, MAJOR_CITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>;
}

export default function NuevoClientePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: "", contactName: "", phone: "+52", email: "", rfc: "",
    state: "", city: "", creditDays: "0", notes: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.contactName) return toast.error("Empresa y contacto requeridos");
    if (!/^\+52\d{10}$/.test(form.phone)) return toast.error("Teléfono debe ser +52 y 10 dígitos");
    if (!form.state || !form.city) return toast.error("Ubicación requerida");

    const cliente: Cliente = {
      id: uuidv4(),
      companyName: form.companyName,
      contactName: form.contactName,
      phone: form.phone,
      email: form.email || undefined,
      rfc: form.rfc || undefined,
      city: form.city,
      state: form.state,
      creditDays: Number(form.creditDays) || 0,
      notes: form.notes || undefined,
      ratingAvg: 0,
      ratingCount: 0,
      tags: [],
      createdAt: new Date().toISOString(),
    };
    saveCliente(cliente);
    toast.success("Cliente registrado");
    router.push(`/app/clientes/${cliente.id}`);
  };

  const cities = MAJOR_CITIES[form.state] ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/app/clientes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Clientes
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo cliente</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <Label>Empresa *</Label>
              <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Razón social o nombre comercial" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contacto *</Label>
                <Input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Nombre" />
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
                <Label>Ciudad *</Label>
                {cities.length > 0 ? (
                  <Select value={form.city} onChange={(e) => set("city", e.target.value)}>
                    <option value="">Ciudad</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                ) : (
                  <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Ciudad" />
                )}
              </div>
              <div>
                <Label>Días de crédito</Label>
                <Input type="number" min="0" value={form.creditDays} onChange={(e) => set("creditDays", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Notas</Label>
              <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} placeholder="Condiciones, contactos adicionales..." />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2 mt-6">
          <Button asChild variant="outline" type="button"><Link href="/app/clientes">Cancelar</Link></Button>
          <Button type="submit">Guardar cliente</Button>
        </div>
      </form>
    </div>
  );
}
