"use client";

import { Transportista, Viaje } from "@/lib/models";
import { whatsappToTransportista } from "@/lib/matching";
import { cn, formatMoney } from "@/lib/utils";
import { unitTypeLabel } from "@/lib/constants";
import { Card, CardContent } from "./ui/card";
import { Badge, AvailabilityBadge } from "./ui/badge";
import { Button } from "./ui/button";
import { RatingDisplay } from "./ui/rating";
import { MapPin, Truck, ShieldCheck, MessageCircle, User } from "lucide-react";
import Link from "next/link";

interface TransportistaCardProps {
  transportista: Transportista;
  viaje?: Viaje;
  score?: number;
  reasons?: string[];
  onAssign?: (t: Transportista) => void;
  className?: string;
}

export function TransportistaCard({
  transportista: t,
  viaje,
  score,
  reasons,
  onAssign,
  className,
}: TransportistaCardProps) {
  const whatsappUrl = viaje
    ? whatsappToTransportista(t, viaje)
    : `https://wa.me/${t.phone.replace("+", "")}`;

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{t.companyName}</h3>
            <p className="text-sm text-gray-500">
              {t.contactName} ·{" "}
              {t.type === "linea" ? "Línea transportista" : "Hombre-camión"}
            </p>
          </div>
          <AvailabilityBadge status={t.availabilityStatus} />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              {t.city}, {t.state}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck className="h-4 w-4" />
            <span>{t.unitTypes.map(unitTypeLabel).join(", ")}</span>
          </div>
          {t.baseRate ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Tarifa ref:</span>
              <span>{formatMoney(t.baseRate)}</span>
            </div>
          ) : null}
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck
              className={cn(
                "h-4 w-4",
                t.cartaPorteReady ? "text-green-600" : "text-gray-300"
              )}
            />
            <span className={t.cartaPorteReady ? "text-green-700" : "text-gray-400"}>
              {t.cartaPorteReady ? "Carta Porte / seguro en regla" : "Documentación por validar"}
            </span>
          </div>
        </div>

        {t.ratingAvg > 0 && (
          <div className="mb-4">
            <RatingDisplay rating={t.ratingAvg} count={t.ratingCount} size="sm" />
          </div>
        )}

        {t.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {t.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {score !== undefined && (
          <div className="mb-4 p-2 bg-primary-50 rounded-lg">
            <p className="text-sm font-medium text-primary-700">
              Match: {score} puntos
            </p>
            {reasons && reasons.length > 0 && (
              <ul className="mt-1 text-xs text-primary-600">
                {reasons.slice(0, 3).map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {onAssign && (
            <Button size="sm" className="gap-1.5" onClick={() => onAssign(t)}>
              Asignar
            </Button>
          )}
          <Button asChild variant="whatsapp" size="sm" className="gap-1.5">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Contactar
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href={`/app/transportistas/${t.id}`}>
              <User className="h-4 w-4" />
              Perfil
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
