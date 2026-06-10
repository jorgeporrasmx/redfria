"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BRAND } from "@/lib/brand";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { MessageCircle, CheckCircle2 } from "lucide-react";

const VIAJES = ["1 a 20", "20 a 50", "50 a 150", "Más de 150"];
const FLOTA = ["Solo subcontrato (comisionista)", "Mixta: flota + subcontrato", "Flota propia"];
const CONTROL = ["WhatsApp y Excel", "Un sistema / TMS", "Papel / pizarrón", "Otro"];
const RETO = [
  "Saber dónde va cada carga",
  "Conocer mi margen por viaje",
  "Conseguir transportista disponible",
  "Carta Porte y cumplimiento",
  "Coordinar a mi equipo",
];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>;
}

export function LeadForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    nombre: "", empresa: "", whatsapp: "",
    viajes: VIAJES[1], flota: FLOTA[0], control: CONTROL[0], reto: RETO[0],
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) return toast.error("Dinos tu nombre");
    if (!form.empresa.trim()) return toast.error("Dinos el nombre de tu empresa");
    if (!form.whatsapp.trim()) return toast.error("Déjanos un WhatsApp para contactarte");

    const message = `Hola, quiero un *demo gratuito de Tracta* a la medida.

*Nombre:* ${form.nombre}
*Empresa:* ${form.empresa}
*WhatsApp:* ${form.whatsapp}
*Viajes al mes:* ${form.viajes}
*Operación:* ${form.flota}
*Hoy controlo con:* ${form.control}
*Mi mayor reto:* ${form.reto}`;

    const url = `https://wa.me/${BRAND.salesWhatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    toast.success("¡Listo! Te llevamos a WhatsApp para confirmar tu demo.");
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-gray-200">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-xl font-bold text-gray-900">¡Casi listo, {form.nombre.split(" ")[0]}!</h3>
        <p className="mt-2 text-sm text-gray-600">
          Se abrió WhatsApp con tus datos. Solo presiona <strong>enviar</strong> y agendamos
          tu demo a la medida. Si no se abrió, escríbenos directo.
        </p>
        <Button
          asChild
          variant="whatsapp"
          className="mt-5 gap-1.5"
        >
          <a href={`https://wa.me/${BRAND.salesWhatsapp}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" /> Abrir WhatsApp
          </a>
        </Button>
        <button onClick={() => setSent(false)} className="mt-4 block w-full text-xs text-gray-400 hover:text-gray-600">
          Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl ring-1 ring-gray-200"
    >
      <h3 className="text-xl font-bold text-gray-900">Agenda tu demo gratuito</h3>
      <p className="mt-1 text-sm text-gray-500">
        4 datos rápidos y te preparamos una demostración con tu propia operación.
      </p>

      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Nombre *</Label>
            <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Tu nombre" />
          </div>
          <div>
            <Label>Empresa *</Label>
            <Input value={form.empresa} onChange={(e) => set("empresa", e.target.value)} placeholder="Nombre de tu empresa" />
          </div>
        </div>

        <div>
          <Label>WhatsApp *</Label>
          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="Ej. 55 1234 5678" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>¿Cuántos viajes mueves al mes?</Label>
            <Select value={form.viajes} onChange={(e) => set("viajes", e.target.value)}>
              {VIAJES.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </div>
          <div>
            <Label>¿Cómo operas?</Label>
            <Select value={form.flota} onChange={(e) => set("flota", e.target.value)}>
              {FLOTA.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </div>
          <div>
            <Label>¿Cómo controlas hoy tus viajes?</Label>
            <Select value={form.control} onChange={(e) => set("control", e.target.value)}>
              {CONTROL.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </div>
          <div>
            <Label>¿Cuál es tu mayor reto?</Label>
            <Select value={form.reto} onChange={(e) => set("reto", e.target.value)}>
              {RETO.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full gap-2">
        <MessageCircle className="h-5 w-5" /> Quiero mi demo gratuito
      </Button>
      <p className="mt-3 text-center text-xs text-gray-400">
        Sin compromiso · Te contactamos el mismo día hábil
      </p>
    </form>
  );
}
