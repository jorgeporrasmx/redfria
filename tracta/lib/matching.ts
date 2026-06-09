import { Transportista, Viaje, Cliente } from "./models";
import { unitTypeLabel } from "./constants";

export type MatchResult = {
  transportista: Transportista;
  score: number;
  reasons: string[];
};

// Score how well each carrier fits a given trip.
export function matchTransportistasToViaje(
  viaje: Viaje,
  transportistas: Transportista[]
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const t of transportistas) {
    const reasons: string[] = [];
    let score = 0;

    // 1. Unit type compatibility (hard filter)
    if (!t.unitTypes.includes(viaje.unitTypeRequired)) {
      continue;
    }
    score += 30;
    reasons.push(`Cuenta con ${unitTypeLabel(viaje.unitTypeRequired)}`);

    // 2. Capacity check (only when both known)
    if (viaje.weightKg && t.capacityKg) {
      if (t.capacityKg < viaje.weightKg) continue;
      score += 15;
      reasons.push(`Capacidad ${t.capacityKg.toLocaleString("es-MX")} kg`);
    }

    // 3. Availability semaphore
    switch (t.availabilityStatus) {
      case "GREEN":
        score += 25;
        reasons.push("Disponible ahora");
        break;
      case "YELLOW":
        score += 15;
        reasons.push("Disponible próximamente");
        break;
      case "RED":
        score += 5;
        reasons.push("No disponible actualmente");
        break;
    }

    // 4. Location / preferred routes
    if (t.state === viaje.originState) {
      score += 15;
      reasons.push(`Ubicado en ${t.state}`);
    } else {
      const hasRoute = t.routesPreferred?.some(
        (r) => r.fromState === viaje.originState || r.toState === viaje.destState
      );
      if (hasRoute) {
        score += 10;
        reasons.push("Ruta preferida");
      }
    }

    // 5. Compliance bonus (broker cares about Carta Porte readiness)
    if (t.cartaPorteReady && t.seguroVigente) {
      score += 10;
      reasons.push("Documentación en regla");
    }

    // 6. Rating bonus (0-10)
    if (t.ratingAvg > 0) {
      score += Math.round((t.ratingAvg / 5) * 10);
      reasons.push(`Calificación ${t.ratingAvg.toFixed(1)}/5`);
    }

    results.push({ transportista: t, score, reasons });
  }

  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const order = { GREEN: 0, YELLOW: 1, RED: 2 };
    const diff =
      order[a.transportista.availabilityStatus] -
      order[b.transportista.availabilityStatus];
    if (diff !== 0) return diff;
    return b.transportista.ratingAvg - a.transportista.ratingAvg;
  });
}

// WhatsApp deep-link to coordinate a trip with a carrier.
export function whatsappToTransportista(t: Transportista, viaje: Viaje): string {
  const pickup = new Date(viaje.pickupDate).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const message = `Hola ${t.contactName}! Te comparto una carga disponible:

*Folio:* ${viaje.folio}
*Ruta:* ${viaje.originCity}, ${viaje.originState} -> ${viaje.destCity}, ${viaje.destState}
*Recolección:* ${pickup}
*Unidad:* ${unitTypeLabel(viaje.unitTypeRequired)}
*Carga:* ${viaje.cargoType}${viaje.weightKg ? ` (${viaje.weightKg.toLocaleString("es-MX")} kg)` : ""}${
    viaje.costoTransportista
      ? `\n*Tarifa ofrecida:* $${viaje.costoTransportista.toLocaleString("es-MX")}`
      : ""
  }

¿Tienes disponibilidad?`;

  const phone = t.phone.replace("+", "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// WhatsApp deep-link to send a client the tracking link for their trip.
export function whatsappToCliente(
  cliente: Cliente,
  viaje: Viaje,
  trackingUrl: string
): string {
  const message = `Hola ${cliente.contactName}! Tu carga *${viaje.folio}* (${viaje.originCity} -> ${viaje.destCity}) está en seguimiento.

Consulta el estatus en tiempo real aquí:
${trackingUrl}`;
  const phone = cliente.phone.replace("+", "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
