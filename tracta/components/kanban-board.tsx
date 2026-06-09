"use client";

import { Viaje, Cliente } from "@/lib/models";
import { DISPATCH_COLUMNS, tripStatusMeta } from "@/lib/constants";
import { TripCard } from "./trip-card";

// Read-only dispatch board: trips grouped into lifecycle columns.
export function KanbanBoard({
  viajes,
  clientes,
}: {
  viajes: Viaje[];
  clientes: Cliente[];
}) {
  const clienteById = (id: string) => clientes.find((c) => c.id === id);

  return (
    <div className="grid grid-flow-col auto-cols-[minmax(240px,1fr)] gap-4 overflow-x-auto pb-2">
      {DISPATCH_COLUMNS.map((status) => {
        const meta = tripStatusMeta(status);
        const items = viajes.filter((v) => v.status === status);
        return (
          <div key={status} className="rounded-lg bg-gray-100/70 p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                {meta.label}
              </h3>
              <span className="text-xs font-medium text-gray-500 bg-white rounded-full px-2 py-0.5">
                {items.length}
              </span>
            </div>
            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">Sin viajes</p>
              ) : (
                items.map((v) => (
                  <TripCard
                    key={v.id}
                    viaje={v}
                    cliente={clienteById(v.clienteId)}
                    compact
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
