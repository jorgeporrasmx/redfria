"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import {
  getViajeById,
  saveViaje,
  getClienteById,
  getTransportistaById,
  getTransportistas,
  getOperadoresByTransportista,
} from "@/lib/storage";
import { Viaje, Cliente, Transportista, Operador } from "@/lib/models";
import { matchTransportistasToViaje, whatsappToTransportista, whatsappToCliente } from "@/lib/matching";
import { tripMargin, tripNetMargin, tripExpensesTotal, tripMarginPct } from "@/lib/trips";
import { TRIP_STATUSES, EXPENSE_CATEGORIES, unitTypeLabel } from "@/lib/constants";
import { formatMoney, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Timeline } from "@/components/timeline";
import { TransportistaCard } from "@/components/transportista-card";
import { ReviewModal } from "@/components/review-modal";
import {
  ArrowLeft, ArrowRight, MapPin, Calendar, Package, Truck, ShieldCheck,
  MessageCircle, Plus, Star, Link2, FileCheck,
} from "lucide-react";

export default function ViajeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [cliente, setCliente] = useState<Cliente | undefined>();
  const [transportista, setTransportista] = useState<Transportista | undefined>();
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [showMatch, setShowMatch] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // inline form state
  const [cpLabel, setCpLabel] = useState("");
  const [cpLocation, setCpLocation] = useState("");
  const [expCat, setExpCat] = useState(EXPENSE_CATEGORIES[0]);
  const [expAmount, setExpAmount] = useState("");
  const [podBy, setPodBy] = useState("");

  const load = useCallback(() => {
    const v = getViajeById(id);
    if (!v) return;
    setViaje(v);
    setCliente(getClienteById(v.clienteId));
    setTransportista(v.transportistaId ? getTransportistaById(v.transportistaId) : undefined);
    setOperadores(v.transportistaId ? getOperadoresByTransportista(v.transportistaId) : []);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const persist = (updated: Viaje) => {
    saveViaje(updated);
    setViaje(updated);
    load();
  };

  if (!viaje) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-gray-500">
        Viaje no encontrado.{" "}
        <Link href="/app/viajes" className="text-primary-600 underline">Volver</Link>
      </div>
    );
  }

  const margin = tripMargin(viaje);
  const trackingUrl =
    typeof window !== "undefined" ? `${window.location.origin}/rastreo/${viaje.folio}` : "";

  const changeStatus = (status: string) =>
    persist({ ...viaje, status: status as Viaje["status"] });

  const assignTransportista = (t: Transportista) => {
    persist({
      ...viaje,
      transportistaId: t.id,
      costoTransportista: viaje.costoTransportista ?? t.baseRate,
      status: ["cotizacion", "confirmado"].includes(viaje.status) ? "asignado" : viaje.status,
    });
    setShowMatch(false);
    toast.success(`Asignado a ${t.companyName}`);
  };

  const addCheckpoint = () => {
    if (!cpLabel.trim()) return toast.error("Describe la actualización");
    const checkpoint = {
      id: uuidv4(),
      label: cpLabel.trim(),
      location: cpLocation.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    const status = viaje.status === "asignado" ? "en_transito" : viaje.status;
    persist({ ...viaje, checkpoints: [...viaje.checkpoints, checkpoint], status });
    setCpLabel(""); setCpLocation("");
    toast.success("Actualización agregada");
  };

  const addExpense = () => {
    const amount = Number(expAmount);
    if (!amount || amount <= 0) return toast.error("Monto inválido");
    const expense = { id: uuidv4(), category: expCat, amount, createdAt: new Date().toISOString() };
    persist({ ...viaje, expenses: [...viaje.expenses, expense] });
    setExpAmount("");
    toast.success("Gasto registrado");
  };

  const markDelivered = () => {
    const checkpoint = {
      id: uuidv4(),
      label: "Entregado",
      location: `${viaje.destCity}, ${viaje.destState}`,
      note: podBy ? `Recibido por ${podBy}` : undefined,
      timestamp: new Date().toISOString(),
    };
    persist({
      ...viaje,
      status: "entregado",
      checkpoints: [...viaje.checkpoints, checkpoint],
      pod: { receivedBy: podBy || undefined, signedAt: new Date().toISOString() },
    });
    setPodBy("");
    toast.success("Entrega registrada");
  };

  const toggleCartaPorte = () =>
    persist({ ...viaje, cartaPorteValidated: !viaje.cartaPorteValidated });

  const copyTracking = () => {
    navigator.clipboard?.writeText(trackingUrl);
    toast.success("Liga de rastreo copiada");
  };

  const matches = showMatch ? matchTransportistasToViaje(viaje, getTransportistas()) : [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/app/viajes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Viajes
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-gray-500">{viaje.folio}</span>
            <StatusBadge status={viaje.status} />
          </div>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-gray-900">
            {viaje.originCity}
            <ArrowRight className="h-5 w-5 text-gray-400" />
            {viaje.destCity}
          </h1>
          {cliente && (
            <Link href={`/app/clientes/${cliente.id}`} className="text-sm text-primary-600 hover:underline">
              {cliente.companyName}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={viaje.status} onChange={(e) => changeStatus(e.target.value)} className="w-44">
            {TRIP_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Detalle de la carga</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><MapPin className="h-4 w-4" /> {viaje.originCity}, {viaje.originState}</div>
                <div className="flex items-center gap-2 text-gray-600"><MapPin className="h-4 w-4" /> {viaje.destCity}, {viaje.destState}</div>
                <div className="flex items-center gap-2 text-gray-600"><Calendar className="h-4 w-4" /> Recolección: {formatDate(viaje.pickupDate)}</div>
                {viaje.deliveryDate && <div className="flex items-center gap-2 text-gray-600"><Calendar className="h-4 w-4" /> Entrega: {formatDate(viaje.deliveryDate)}</div>}
                <div className="flex items-center gap-2 text-gray-600"><Truck className="h-4 w-4" /> {unitTypeLabel(viaje.unitTypeRequired)}</div>
                <div className="flex items-center gap-2 text-gray-600"><Package className="h-4 w-4" /> {viaje.cargoType}{viaje.weightKg ? ` · ${viaje.weightKg.toLocaleString("es-MX")} kg` : ""}</div>
              </div>
              {viaje.specialRequirements && (
                <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                  ⚠ {viaje.specialRequirements}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Transportista / assignment */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Transportista asignado</h3>
                <Button size="sm" variant={transportista ? "outline" : "primary"} onClick={() => setShowMatch((s) => !s)}>
                  {transportista ? "Reasignar" : "Buscar transportista"}
                </Button>
              </div>

              {transportista ? (
                <div className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/app/transportistas/${transportista.id}`} className="font-medium text-gray-900 hover:underline">
                        {transportista.companyName}
                      </Link>
                      <p className="text-sm text-gray-500">{transportista.contactName} · {transportista.phone}</p>
                      {operadores[0] && <p className="text-xs text-gray-400">Operador: {operadores[0].name}</p>}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <ShieldCheck className={transportista.cartaPorteReady ? "h-4 w-4 text-green-600" : "h-4 w-4 text-gray-300"} />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="whatsapp" className="gap-1.5">
                      <a href={whatsappToTransportista(transportista, viaje)} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" /> Coordinar
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowReview(true)}>
                      <Star className="h-4 w-4" /> Calificar
                    </Button>
                  </div>
                </div>
              ) : (
                !showMatch && <p className="text-sm text-gray-400">Sin transportista asignado.</p>
              )}

              {showMatch && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Mejores opciones para esta carga</p>
                  {matches.length === 0 && (
                    <p className="text-sm text-gray-400">
                      No hay transportistas compatibles con {unitTypeLabel(viaje.unitTypeRequired)}.
                    </p>
                  )}
                  {matches.slice(0, 4).map((m) => (
                    <TransportistaCard
                      key={m.transportista.id}
                      transportista={m.transportista}
                      viaje={viaje}
                      score={m.score}
                      reasons={m.reasons}
                      onAssign={assignTransportista}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Seguimiento en ruta</h3>
              <Timeline checkpoints={viaje.checkpoints} />
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Input placeholder="Actualización (ej. En caseta Palmillas)" value={cpLabel} onChange={(e) => setCpLabel(e.target.value)} />
                <Input placeholder="Ubicación" value={cpLocation} onChange={(e) => setCpLocation(e.target.value)} className="sm:w-40" />
                <Button onClick={addCheckpoint} className="gap-1.5 shrink-0"><Plus className="h-4 w-4" /> Agregar</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Money */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Margen</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Tarifa cliente</dt><dd className="font-medium">{formatMoney(viaje.tarifaCliente)}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Costo transportista</dt><dd className="font-medium">{viaje.costoTransportista !== undefined ? formatMoney(viaje.costoTransportista) : "—"}</dd></div>
                <div className="flex justify-between border-t border-gray-100 pt-2">
                  <dt className="text-gray-700 font-medium">Margen bruto</dt>
                  <dd className={`font-semibold ${margin >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatMoney(margin)} ({tripMarginPct(viaje).toFixed(0)}%)
                  </dd>
                </div>
                <div className="flex justify-between"><dt className="text-gray-500">Gastos operación</dt><dd className="text-gray-600">{formatMoney(tripExpensesTotal(viaje))}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-700 font-medium">Margen neto</dt><dd className="font-semibold text-gray-900">{formatMoney(tripNetMargin(viaje))}</dd></div>
              </dl>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileCheck className="h-4 w-4" /> Carta Porte 3.1
              </h3>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={viaje.cartaPorteValidated} onChange={toggleCartaPorte} className="h-4 w-4 rounded border-gray-300" />
                Carta Porte del transportista validada
              </label>
              <p className="mt-2 text-xs text-gray-400">
                Verifica permiso SICT, placas y seguro antes de que la unidad circule.
              </p>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Gastos del viaje</h3>
              {viaje.expenses.length > 0 ? (
                <ul className="space-y-1.5 text-sm mb-3">
                  {viaje.expenses.map((e) => (
                    <li key={e.id} className="flex justify-between">
                      <span className="text-gray-500">{e.category}</span>
                      <span className="font-medium">{formatMoney(e.amount)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 mb-3">Sin gastos registrados.</p>
              )}
              <div className="flex gap-2">
                <Select value={expCat} onChange={(e) => setExpCat(e.target.value as typeof expCat)}>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
                <Input type="number" min="0" placeholder="$" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} className="w-24" />
                <Button size="sm" onClick={addExpense} className="shrink-0"><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>

          {/* POD / delivery */}
          {viaje.pod ? (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Evidencia de entrega</h3>
                <p className="text-sm text-gray-600">Recibido por: {viaje.pod.receivedBy || "—"}</p>
                {viaje.pod.signedAt && <p className="text-xs text-gray-400">{formatDate(viaje.pod.signedAt)}</p>}
              </CardContent>
            </Card>
          ) : (
            transportista && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Registrar entrega (POD)</h3>
                  <Input placeholder="Recibido por (nombre)" value={podBy} onChange={(e) => setPodBy(e.target.value)} className="mb-2" />
                  <Button onClick={markDelivered} className="w-full">Marcar como entregado</Button>
                </CardContent>
              </Card>
            )
          )}

          {/* Client tracking */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4" /> Portal de cliente
              </h3>
              <p className="text-xs text-gray-500 mb-3 break-all">{trackingUrl}</p>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" onClick={copyTracking}>Copiar liga</Button>
                {cliente && (
                  <Button asChild size="sm" variant="whatsapp" className="gap-1.5">
                    <a href={whatsappToCliente(cliente, viaje, trackingUrl)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" /> Enviar al cliente
                    </a>
                  </Button>
                )}
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/rastreo/${viaje.folio}`} target="_blank">Ver como cliente</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {transportista && (
        <ReviewModal
          isOpen={showReview}
          onClose={() => setShowReview(false)}
          toUserId={transportista.id}
          toUserType="transportista"
          tripId={viaje.id}
          onSuccess={load}
        />
      )}
    </div>
  );
}
