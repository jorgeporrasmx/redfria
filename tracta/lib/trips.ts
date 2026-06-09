import { Viaje } from "./models";

// Total logged expenses for a trip
export function tripExpensesTotal(viaje: Viaje): number {
  return (viaje.expenses ?? []).reduce((sum, e) => sum + e.amount, 0);
}

// Broker gross margin = what the client pays minus what the carrier is paid.
export function tripMargin(viaje: Viaje): number {
  return viaje.tarifaCliente - (viaje.costoTransportista ?? 0);
}

// Net margin also subtracts operational expenses absorbed by the broker.
export function tripNetMargin(viaje: Viaje): number {
  return tripMargin(viaje) - tripExpensesTotal(viaje);
}

// Margin as a percentage of revenue (0 when no revenue).
export function tripMarginPct(viaje: Viaje): number {
  if (!viaje.tarifaCliente) return 0;
  return (tripMargin(viaje) / viaje.tarifaCliente) * 100;
}

// Trips considered "live" operations on the dispatch board.
export function isActiveTrip(viaje: Viaje): boolean {
  return ["cotizacion", "confirmado", "asignado", "en_transito"].includes(
    viaje.status
  );
}
