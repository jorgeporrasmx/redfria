"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getClienteById, getViajes, getReviewsForUser } from "@/lib/storage";
import { Cliente, Viaje, Review } from "@/lib/models";
import { tripMargin } from "@/lib/trips";
import { formatMoney, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingDisplay } from "@/components/ui/rating";
import { TripCard } from "@/components/trip-card";
import { ReviewModal } from "@/components/review-modal";
import {
  ArrowLeft, Building2, MapPin, Phone, Mail, CreditCard, Star, MessageCircle,
} from "lucide-react";

export default function ClienteDetailPage() {
  const { id } = useParams() as { id: string };
  const [cliente, setCliente] = useState<Cliente | undefined>();
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReview, setShowReview] = useState(false);

  const load = useCallback(() => {
    setCliente(getClienteById(id));
    setViajes(getViajes().filter((v) => v.clienteId === id));
    setReviews(getReviewsForUser(id));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!cliente) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-gray-500">
        Cliente no encontrado. <Link href="/app/clientes" className="text-primary-600 underline">Volver</Link>
      </div>
    );
  }

  const facturado = viajes
    .filter((v) => v.status !== "cancelado")
    .reduce((s, v) => s + v.tarifaCliente, 0);
  const margenGenerado = viajes
    .filter((v) => v.costoTransportista !== undefined && v.status !== "cancelado")
    .reduce((s, v) => s + tripMargin(v), 0);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/app/clientes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Clientes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Building2 className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{cliente.companyName}</h1>
            <p className="text-sm text-gray-500">{cliente.contactName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="whatsapp" size="sm" className="gap-1.5">
            <a href={`https://wa.me/${cliente.phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowReview(true)}>
            <Star className="h-4 w-4" /> Calificar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {cliente.city}, {cliente.state}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {cliente.phone}</p>
              {cliente.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {cliente.email}</p>}
              {cliente.rfc && <p className="flex items-center gap-2 font-mono text-xs">RFC: {cliente.rfc}</p>}
              <p className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Crédito: {cliente.creditDays} días</p>
              {cliente.ratingAvg > 0 && <div className="pt-2"><RatingDisplay rating={cliente.ratingAvg} count={cliente.ratingCount} /></div>}
              {cliente.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {cliente.tags.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
              )}
              {cliente.notes && <p className="pt-2 text-xs text-gray-500 border-t border-gray-100">{cliente.notes}</p>}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">Facturado</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{formatMoney(facturado)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">Margen generado</p>
              <p className="mt-1 text-lg font-bold text-green-600">{formatMoney(margenGenerado)}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Viajes ({viajes.length})</h2>
          {viajes.length === 0 ? (
            <p className="text-sm text-gray-400">Aún no hay viajes con este cliente.</p>
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
                      {r.comment && <p className="mt-2 text-sm text-gray-600">{r.comment}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ReviewModal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        toUserId={cliente.id}
        toUserType="cliente"
        onSuccess={load}
      />
    </div>
  );
}
