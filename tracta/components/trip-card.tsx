"use client";

import Link from "next/link";
import { Viaje, Cliente } from "@/lib/models";
import { cn, formatMoney, formatDate } from "@/lib/utils";
import { unitTypeLabel } from "@/lib/constants";
import { tripMargin, tripMarginPct } from "@/lib/trips";
import { StatusBadge } from "./status-badge";
import { ArrowRight, Building2, Calendar, Truck } from "lucide-react";

export function TripCard({
  viaje,
  cliente,
  compact = false,
  className,
}: {
  viaje: Viaje;
  cliente?: Cliente;
  compact?: boolean;
  className?: string;
}) {
  const margin = tripMargin(viaje);
  const pct = tripMarginPct(viaje);
  const hasCost = viaje.costoTransportista !== undefined;

  return (
    <Link
      href={`/app/viajes/${viaje.id}`}
      className={cn(
        "block rounded-lg border border-gray-200 bg-white p-3 hover:shadow-md hover:border-primary-300 transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs font-semibold text-gray-500">
          {viaje.folio}
        </span>
        {!compact && <StatusBadge status={viaje.status} />}
      </div>

      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 mb-1">
        <span>{viaje.originCity}</span>
        <ArrowRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        <span>{viaje.destCity}</span>
      </div>

      {cliente && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
          <Building2 className="h-3 w-3" />
          {cliente.companyName}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Truck className="h-3 w-3" />
          {unitTypeLabel(viaje.unitTypeRequired)}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(viaje.pickupDate)}
        </span>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {formatMoney(viaje.tarifaCliente)}
        </span>
        {hasCost ? (
          <span
            className={cn(
              "text-xs font-semibold",
              margin >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            Margen {formatMoney(margin)} ({pct.toFixed(0)}%)
          </span>
        ) : (
          <span className="text-xs text-gray-400">Sin costo asignado</span>
        )}
      </div>
    </Link>
  );
}
