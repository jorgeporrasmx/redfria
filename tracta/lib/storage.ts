import { Cliente, Transportista, Operador, Viaje, Review } from "./models";

const STORAGE_KEYS = {
  CLIENTES: "tracta_clientes",
  TRANSPORTISTAS: "tracta_transportistas",
  OPERADORES: "tracta_operadores",
  VIAJES: "tracta_viajes",
  REVIEWS: "tracta_reviews",
  COUNTER: "tracta_folio_counter",
  INITIALIZED: "tracta_initialized",
} as const;

// Generic storage helpers
function getItem<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setItem<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Clientes ---
export function getClientes(): Cliente[] {
  return getItem<Cliente>(STORAGE_KEYS.CLIENTES);
}
export function getClienteById(id: string): Cliente | undefined {
  return getClientes().find((c) => c.id === id);
}
export function saveCliente(cliente: Cliente): void {
  const items = getClientes();
  const i = items.findIndex((c) => c.id === cliente.id);
  if (i >= 0) items[i] = cliente;
  else items.push(cliente);
  setItem(STORAGE_KEYS.CLIENTES, items);
}

// --- Transportistas ---
export function getTransportistas(): Transportista[] {
  return getItem<Transportista>(STORAGE_KEYS.TRANSPORTISTAS);
}
export function getTransportistaById(id: string): Transportista | undefined {
  return getTransportistas().find((t) => t.id === id);
}
export function saveTransportista(t: Transportista): void {
  const items = getTransportistas();
  const i = items.findIndex((x) => x.id === t.id);
  if (i >= 0) items[i] = t;
  else items.push(t);
  setItem(STORAGE_KEYS.TRANSPORTISTAS, items);
}
export function updateTransportistaAvailability(
  id: string,
  status: Transportista["availabilityStatus"],
  nextAvailableAt?: string
): void {
  const items = getTransportistas();
  const t = items.find((x) => x.id === id);
  if (t) {
    t.availabilityStatus = status;
    t.nextAvailableAt = nextAvailableAt;
    setItem(STORAGE_KEYS.TRANSPORTISTAS, items);
  }
}

// --- Operadores ---
export function getOperadores(): Operador[] {
  return getItem<Operador>(STORAGE_KEYS.OPERADORES);
}
export function getOperadoresByTransportista(transportistaId: string): Operador[] {
  return getOperadores().filter((o) => o.transportistaId === transportistaId);
}
export function getOperadorById(id: string): Operador | undefined {
  return getOperadores().find((o) => o.id === id);
}
export function saveOperador(o: Operador): void {
  const items = getOperadores();
  const i = items.findIndex((x) => x.id === o.id);
  if (i >= 0) items[i] = o;
  else items.push(o);
  setItem(STORAGE_KEYS.OPERADORES, items);
}

// --- Viajes ---
export function getViajes(): Viaje[] {
  return getItem<Viaje>(STORAGE_KEYS.VIAJES);
}
export function getViajeById(id: string): Viaje | undefined {
  return getViajes().find((v) => v.id === id);
}
export function getViajeByFolio(folio: string): Viaje | undefined {
  return getViajes().find((v) => v.folio.toLowerCase() === folio.toLowerCase());
}
export function saveViaje(v: Viaje): void {
  const items = getViajes();
  const i = items.findIndex((x) => x.id === v.id);
  if (i >= 0) items[i] = v;
  else items.push(v);
  setItem(STORAGE_KEYS.VIAJES, items);
}

// Sequential folio generator: TRC-YYYY-####
export function nextFolio(): string {
  if (typeof window === "undefined") return "TRC-0000";
  const current = Number(localStorage.getItem(STORAGE_KEYS.COUNTER) || "0") + 1;
  localStorage.setItem(STORAGE_KEYS.COUNTER, String(current));
  const year = new Date().getFullYear();
  return `TRC-${year}-${String(current).padStart(4, "0")}`;
}

// --- Reviews ---
export function getReviews(): Review[] {
  return getItem<Review>(STORAGE_KEYS.REVIEWS);
}
export function getReviewsForUser(userId: string): Review[] {
  return getReviews().filter((r) => r.toUserId === userId);
}
export function saveReview(review: Review): void {
  const reviews = getReviews();
  reviews.push(review);
  setItem(STORAGE_KEYS.REVIEWS, reviews);

  // Recompute aggregate rating + top tags for the target
  const userReviews = reviews.filter((r) => r.toUserId === review.toUserId);
  const avgRating =
    userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
  const tagCounts: Record<string, number> = {};
  userReviews.forEach((r) =>
    r.tags.forEach((tag) => (tagCounts[tag] = (tagCounts[tag] || 0) + 1))
  );
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  if (review.toUserType === "transportista") {
    const t = getTransportistaById(review.toUserId);
    if (t) {
      t.ratingAvg = Math.round(avgRating * 10) / 10;
      t.ratingCount = userReviews.length;
      t.tags = topTags;
      saveTransportista(t);
    }
  } else {
    const c = getClienteById(review.toUserId);
    if (c) {
      c.ratingAvg = Math.round(avgRating * 10) / 10;
      c.ratingCount = userReviews.length;
      c.tags = topTags;
      saveCliente(c);
    }
  }
}

// Initialization
export function isInitialized(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === "true";
}
export function markInitialized(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
}
export function resetAllData(): void {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
