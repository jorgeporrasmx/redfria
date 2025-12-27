import { Carrier, Shipment } from "./models";

export type MatchResult = {
  carrier: Carrier;
  score: number;
  reasons: string[];
};

// Calculate match score between a shipment and carriers
export function matchCarriersToShipment(shipment: Shipment, carriers: Carrier[]): MatchResult[] {
  const results: MatchResult[] = [];

  for (const carrier of carriers) {
    const reasons: string[] = [];
    let score = 0;

    // 1. Only reefer units (MVP filter)
    if (carrier.unitType !== "reefer") {
      continue;
    }

    // 2. Temperature compatibility
    const tempCompatible =
      carrier.tempRangeMin <= shipment.tempRequiredMin &&
      carrier.tempRangeMax >= shipment.tempRequiredMax;

    if (!tempCompatible) {
      continue;
    }
    score += 30;
    reasons.push("Rango de temperatura compatible");

    // 3. Capacity check
    if (carrier.capacityPallets < shipment.pallets) {
      continue;
    }
    score += 20;
    reasons.push(`Capacidad para ${carrier.capacityPallets} pallets`);

    // 4. Availability status scoring
    switch (carrier.availabilityStatus) {
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

    // 5. Location proximity (same state = bonus)
    if (carrier.state === shipment.originState) {
      score += 15;
      reasons.push(`Ubicado en ${carrier.state}`);
    } else {
      // Check preferred routes
      const hasPreferredRoute = carrier.routesPreferred?.some(
        (route) =>
          route.fromState === shipment.originState || route.toState === shipment.destState
      );
      if (hasPreferredRoute) {
        score += 10;
        reasons.push("Ruta preferida");
      }
    }

    // 6. Rating bonus (0-10 points based on rating)
    if (carrier.ratingAvg > 0) {
      const ratingBonus = Math.round((carrier.ratingAvg / 5) * 10);
      score += ratingBonus;
      reasons.push(`Calificación: ${carrier.ratingAvg.toFixed(1)}/5`);
    }

    results.push({
      carrier,
      score,
      reasons,
    });
  }

  // Sort by score descending, then by availability, then by rating
  return results.sort((a, b) => {
    // Primary: score
    if (b.score !== a.score) return b.score - a.score;

    // Secondary: availability status
    const statusOrder = { GREEN: 0, YELLOW: 1, RED: 2 };
    const statusDiff =
      statusOrder[a.carrier.availabilityStatus] - statusOrder[b.carrier.availabilityStatus];
    if (statusDiff !== 0) return statusDiff;

    // Tertiary: rating
    return b.carrier.ratingAvg - a.carrier.ratingAvg;
  });
}

// Generate WhatsApp link with pre-filled message
export function generateWhatsAppLink(carrier: Carrier, shipment: Shipment): string {
  const pickupDate = new Date(shipment.pickupWindowStart).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const pickupTime = new Date(shipment.pickupWindowStart).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = `Hola! Vi tu unidad refrigerada en RedFría.

*Detalles de mi carga:*
- Origen: ${shipment.originCity}, ${shipment.originState}
- Destino: ${shipment.destCity}, ${shipment.destState}
- Fecha: ${pickupDate}
- Hora: ${pickupTime}
- Temperatura: ${shipment.tempRequiredMin}°C a ${shipment.tempRequiredMax}°C
- Pallets: ${shipment.pallets}
- Producto: ${shipment.productType}

¿Tienes disponibilidad?`;

  const phone = carrier.phone.replace("+", "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// Filter carriers by criteria
export type FilterCriteria = {
  minRating?: number;
  availabilityStatus?: Carrier["availabilityStatus"][];
  states?: string[];
  minCapacity?: number;
};

export function filterCarriers(carriers: Carrier[], criteria: FilterCriteria): Carrier[] {
  return carriers.filter((carrier) => {
    if (criteria.minRating && carrier.ratingAvg < criteria.minRating) {
      return false;
    }

    if (
      criteria.availabilityStatus &&
      !criteria.availabilityStatus.includes(carrier.availabilityStatus)
    ) {
      return false;
    }

    if (criteria.states && !criteria.states.includes(carrier.state)) {
      return false;
    }

    if (criteria.minCapacity && carrier.capacityPallets < criteria.minCapacity) {
      return false;
    }

    return true;
  });
}
