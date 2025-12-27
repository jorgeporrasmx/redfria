import { Carrier, Shipper, Shipment, Review } from "./models";

const STORAGE_KEYS = {
  CARRIERS: "redfria_carriers",
  SHIPPERS: "redfria_shippers",
  SHIPMENTS: "redfria_shipments",
  REVIEWS: "redfria_reviews",
  CURRENT_USER: "redfria_current_user",
  INITIALIZED: "redfria_initialized",
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

// Carriers
export function getCarriers(): Carrier[] {
  return getItem<Carrier>(STORAGE_KEYS.CARRIERS);
}

export function getCarrierById(id: string): Carrier | undefined {
  return getCarriers().find((c) => c.id === id);
}

export function saveCarrier(carrier: Carrier): void {
  const carriers = getCarriers();
  const existingIndex = carriers.findIndex((c) => c.id === carrier.id);
  if (existingIndex >= 0) {
    carriers[existingIndex] = carrier;
  } else {
    carriers.push(carrier);
  }
  setItem(STORAGE_KEYS.CARRIERS, carriers);
}

export function updateCarrierAvailability(
  id: string,
  status: Carrier["availabilityStatus"],
  nextAvailableAt?: string
): void {
  const carriers = getCarriers();
  const carrier = carriers.find((c) => c.id === id);
  if (carrier) {
    carrier.availabilityStatus = status;
    carrier.nextAvailableAt = nextAvailableAt;
    setItem(STORAGE_KEYS.CARRIERS, carriers);
  }
}

// Shippers
export function getShippers(): Shipper[] {
  return getItem<Shipper>(STORAGE_KEYS.SHIPPERS);
}

export function getShipperById(id: string): Shipper | undefined {
  return getShippers().find((s) => s.id === id);
}

export function saveShipper(shipper: Shipper): void {
  const shippers = getShippers();
  const existingIndex = shippers.findIndex((s) => s.id === shipper.id);
  if (existingIndex >= 0) {
    shippers[existingIndex] = shipper;
  } else {
    shippers.push(shipper);
  }
  setItem(STORAGE_KEYS.SHIPPERS, shippers);
}

// Shipments
export function getShipments(): Shipment[] {
  return getItem<Shipment>(STORAGE_KEYS.SHIPMENTS);
}

export function getShipmentById(id: string): Shipment | undefined {
  return getShipments().find((s) => s.id === id);
}

export function saveShipment(shipment: Shipment): void {
  const shipments = getShipments();
  const existingIndex = shipments.findIndex((s) => s.id === shipment.id);
  if (existingIndex >= 0) {
    shipments[existingIndex] = shipment;
  } else {
    shipments.push(shipment);
  }
  setItem(STORAGE_KEYS.SHIPMENTS, shipments);
}

// Reviews
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

  // Update user rating
  const userReviews = reviews.filter((r) => r.toUserId === review.toUserId);
  const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
  const tagCounts: Record<string, number> = {};

  userReviews.forEach((r) => {
    r.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Get top 5 tags
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  if (review.toUserType === "carrier") {
    const carriers = getCarriers();
    const carrier = carriers.find((c) => c.id === review.toUserId);
    if (carrier) {
      carrier.ratingAvg = Math.round(avgRating * 10) / 10;
      carrier.ratingCount = userReviews.length;
      carrier.tags = topTags;
      setItem(STORAGE_KEYS.CARRIERS, carriers);
    }
  } else {
    const shippers = getShippers();
    const shipper = shippers.find((s) => s.id === review.toUserId);
    if (shipper) {
      shipper.ratingAvg = Math.round(avgRating * 10) / 10;
      shipper.ratingCount = userReviews.length;
      shipper.tags = topTags;
      setItem(STORAGE_KEYS.SHIPPERS, shippers);
    }
  }
}

// Current user (mock auth)
export type CurrentUser = {
  id: string;
  type: "carrier" | "shipper";
};

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: CurrentUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

// Initialization check
export function isInitialized(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === "true";
}

export function markInitialized(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
}

// Reset data
export function resetAllData(): void {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
