"use client";

import { Carrier, Shipment } from "@/lib/models";
import { generateWhatsAppLink } from "@/lib/matching";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Badge, AvailabilityBadge } from "./ui/badge";
import { Button } from "./ui/button";
import { RatingDisplay } from "./ui/rating";
import {
  MapPin,
  Thermometer,
  Package,
  MessageCircle,
  User,
} from "lucide-react";
import Link from "next/link";

interface CarrierCardProps {
  carrier: Carrier;
  shipment?: Shipment;
  score?: number;
  reasons?: string[];
  className?: string;
}

export function CarrierCard({
  carrier,
  shipment,
  score,
  reasons,
  className,
}: CarrierCardProps) {
  const whatsappUrl = shipment
    ? generateWhatsAppLink(carrier, shipment)
    : `https://wa.me/${carrier.phone.replace("+", "")}`;

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{carrier.companyName}</h3>
            <p className="text-sm text-gray-500">{carrier.contactName}</p>
          </div>
          <AvailabilityBadge status={carrier.availabilityStatus} />
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              {carrier.city}, {carrier.state}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Thermometer className="h-4 w-4" />
            <span>
              {carrier.tempRangeMin}°C a {carrier.tempRangeMax}°C
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>{carrier.capacityPallets} pallets</span>
          </div>
        </div>

        {/* Rating */}
        {carrier.ratingAvg > 0 && (
          <div className="mb-4">
            <RatingDisplay
              rating={carrier.ratingAvg}
              count={carrier.ratingCount}
              size="sm"
            />
          </div>
        )}

        {/* Tags */}
        {carrier.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {carrier.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Match Score */}
        {score !== undefined && (
          <div className="mb-4 p-2 bg-primary-50 rounded-lg">
            <p className="text-sm font-medium text-primary-700">
              Score: {score} puntos
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

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="whatsapp"
            size="sm"
            className="gap-1.5"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Contactar
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href={`/app/perfil/carrier/${carrier.id}`}>
              <User className="h-4 w-4" />
              Ver Perfil
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
