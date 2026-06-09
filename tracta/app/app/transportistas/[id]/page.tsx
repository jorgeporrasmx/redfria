"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  getTransportistaById, getViajes, getReviewsForUser,
  getOperadoresByTransportista, updateTransportistaAvailability,
} from "@/lib/storage";
import { Transportista, Viaje, Review, Operador } from "@/lib/models";
import { unitTypeLabel } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, AvailabilityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RatingDisplay } from "@/components/ui/rating";
import { TripCard } from "@/components/trip-card";
import {
  ArrowLeft, Truck, MapPin, Phone, Mail, ShieldCheck, ShieldAlert, MessageCircle, User,
} from "lucide-react";

export default function TransportistaDetailPage() {
  const { id } = useParams() as { id: string };
  const [t, setT] = useState<Transportista | undefined>();
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);

  const load = useCallback(() => {
    setT(getTransportistaById(id));
    setViajes(getViajes().filter((v) => v.transportistaId === id));
    setReviews(getReviewsForUser(id));
    setOperadores(getOperadoresByTransportista(id));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!t) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-gray-500">
        Transportista no encontrado. <Link href="/app/transportistas" className="text-primary-600 underline">Volver</Link>
      </div>
    );
  }

  const changeAvailability = (status: string) => {
    updateTransportistaAvailability(id, status as Transportista["availabilityStatus"]);
    toast.success("Disponibilidad actualizada");
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/app/transportistas" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Transportistas
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Truck className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.companyName}</h1>
            <p className="text-sm text-gray-500">
              {t.contactName} · {t.type === "linea" ? "Línea transportista" : "Hombre-camión"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={t.availabilityStatus} onChange={(e) => changeAvailability(e.target.value)} className="w-48">
            <option value="GREEN">Disponible</option>
            <option value="YELLOW">Por estar disponible</option>
            <option value="RED">No disponible</option>
          </Select>
          <Button asChild variant="whatsapp" size="sm" className="gap-1.5">
            <a href={`https://wa.me/${t.phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 space-y-2 text-sm text-gray-600">
              <div className="mb-2"><AvailabilityBadge status={t.availabilityStatus} /></div>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {t.city}, {t.state}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {t.phone}</p>
              {t.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {t.email}</p>}
              {t.rfc && <p className="font-mono text-xs">RFC: {t.rfc}</p>}
              {t.capacityKg && <p>Capacidad: {t.capacityKg.toLocaleString("es-MX")} kg</p>}
              {t.ratingAvg > 0 && <div className="pt-2"><RatingDisplay rating={t.ratingAvg} count={t.ratingCount} /></div>}
              <div className="pt-2">
                <p className="text-xs text-gray-400 mb-1">Unidades</p>
                <div className="flex flex-wrap gap-1">
                  {t.unitTypes.map((u) => <Badge key={u} variant="default" className="text-xs">{unitTypeLabel(u)}</Badge>)}
                </div>
              </div>
              {t.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {t.tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Cumplimiento</h3>
              <ul className="space-y-2 text-sm">
                <ComplianceRow ok={!!t.permisoSICT} label={t.permisoSICT ? `Permiso SICT: ${t.permisoSICT}` : "Sin permiso SICT"} />
                <ComplianceRow ok={t.seguroVigente} label={t.seguroVigente ? "Seguro vigente" : "Seguro por validar"} />
                <ComplianceRow ok={t.cartaPorteReady} label={t.cartaPorteReady ? "Emite Carta Porte 3.1" : "Carta Porte por confirmar"} />
                {t.placas && <li className="text-gray-500 text-xs">Placas: {t.placas}</li>}
              </ul>
            </CardContent>
          </Card>

          {operadores.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Operadores</h3>
                <ul className="space-y-2 text-sm">
                  {operadores.map((o) => (
                    <li key={o.id} className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" /> {o.name} {o.phone && <span className="text-xs text-gray-400">· {o.phone}</span>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Viajes asignados ({viajes.length})</h2>
          {viajes.length === 0 ? (
            <p className="text-sm text-gray-400">Sin viajes asignados.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {viajes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((v) => (
                <TripCard key={v.id} viaje={v} />
              ))}
            </div>
          )}

          {reviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Reseñas</h2>
              <div className="space-y-3">
                {reviews.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <RatingDisplay rating={r.rating} showCount={false} size="sm" />
                        <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                      </div>
                      {r.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {r.tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                        </div>
                      )}
                      {r.comment && <p className="mt-2 text-sm text-gray-600">{r.comment}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComplianceRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? "text-green-700" : "text-gray-500"}`}>
      {ok ? <ShieldCheck className="h-4 w-4 text-green-600" /> : <ShieldAlert className="h-4 w-4 text-amber-500" />}
      {label}
    </li>
  );
}
