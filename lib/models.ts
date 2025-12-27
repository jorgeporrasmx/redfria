import { z } from "zod";

// Availability status enum
export const AvailabilityStatus = {
  GREEN: "GREEN",
  YELLOW: "YELLOW",
  RED: "RED",
} as const;

export type AvailabilityStatusType = (typeof AvailabilityStatus)[keyof typeof AvailabilityStatus];

// Tags for reviews
export const CarrierTags = [
  "puntual",
  "buena comunicación",
  "unidad limpia",
  "profesional",
  "precio justo",
  "flexible",
  "documentación en orden",
] as const;

export const ShipperTags = [
  "pago puntual",
  "buena comunicación",
  "carga lista a tiempo",
  "documentación clara",
  "trato respetuoso",
  "flexible",
] as const;

// Zod Schemas
export const routePreferenceSchema = z.object({
  fromState: z.string(),
  toState: z.string(),
});

export const carrierSchema = z.object({
  id: z.string().uuid(),
  companyName: z.string().min(2, "Nombre de empresa requerido"),
  contactName: z.string().min(2, "Nombre de contacto requerido"),
  phone: z.string().regex(/^\+52\d{10}$/, "Teléfono debe ser formato +52XXXXXXXXXX"),
  unitType: z.enum(["reefer", "caja_seca", "plataforma"]).default("reefer"),
  city: z.string().min(2, "Ciudad requerida"),
  state: z.string().min(2, "Estado requerido"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  availabilityStatus: z.enum(["GREEN", "YELLOW", "RED"]).default("GREEN"),
  nextAvailableAt: z.string().optional(),
  tempRangeMin: z.number().min(-30).max(10),
  tempRangeMax: z.number().min(-20).max(25),
  capacityPallets: z.number().min(1).max(40),
  routesPreferred: z.array(routePreferenceSchema).optional(),
  ratingAvg: z.number().min(0).max(5).default(0),
  ratingCount: z.number().min(0).default(0),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
});

export const shipperSchema = z.object({
  id: z.string().uuid(),
  companyName: z.string().min(2, "Nombre de empresa requerido"),
  contactName: z.string().min(2, "Nombre de contacto requerido"),
  phone: z.string().regex(/^\+52\d{10}$/, "Teléfono debe ser formato +52XXXXXXXXXX"),
  ratingAvg: z.number().min(0).max(5).default(0),
  ratingCount: z.number().min(0).default(0),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
});

export const shipmentSchema = z.object({
  id: z.string().uuid(),
  shipperId: z.string().uuid(),
  originCity: z.string().min(2, "Ciudad origen requerida"),
  originState: z.string().min(2, "Estado origen requerido"),
  destCity: z.string().min(2, "Ciudad destino requerida"),
  destState: z.string().min(2, "Estado destino requerido"),
  pickupWindowStart: z.string(),
  pickupWindowEnd: z.string(),
  tempRequiredMin: z.number().min(-30).max(10),
  tempRequiredMax: z.number().min(-20).max(25),
  productType: z.string().min(2, "Tipo de producto requerido"),
  pallets: z.number().min(1).max(40),
  weightKg: z.number().min(1).optional(),
  specialRequirements: z.string().optional(),
  budgetTarget: z.number().positive().optional(),
  status: z.enum(["active", "matched", "completed", "cancelled"]).default("active"),
  createdAt: z.string(),
});

export const reviewSchema = z.object({
  id: z.string().uuid(),
  fromUserId: z.string().uuid(),
  toUserId: z.string().uuid(),
  toUserType: z.enum(["carrier", "shipper"]),
  rating: z.number().min(1).max(5),
  tags: z.array(z.string()),
  comment: z.string().max(500).optional(),
  createdAt: z.string(),
  relatedShipmentId: z.string().uuid().optional(),
});

// TypeScript types derived from schemas
export type RoutePreference = z.infer<typeof routePreferenceSchema>;
export type Carrier = z.infer<typeof carrierSchema>;
export type Shipper = z.infer<typeof shipperSchema>;
export type Shipment = z.infer<typeof shipmentSchema>;
export type Review = z.infer<typeof reviewSchema>;

// Form input types (without generated fields)
export const createCarrierSchema = carrierSchema.omit({
  id: true,
  ratingAvg: true,
  ratingCount: true,
  tags: true,
  createdAt: true,
});

export const createShipperSchema = shipperSchema.omit({
  id: true,
  ratingAvg: true,
  ratingCount: true,
  tags: true,
  createdAt: true,
});

export const createShipmentSchema = shipmentSchema.omit({
  id: true,
  shipperId: true,
  status: true,
  createdAt: true,
});

export const createReviewSchema = reviewSchema.omit({
  id: true,
  fromUserId: true,
  createdAt: true,
});

export type CreateCarrierInput = z.infer<typeof createCarrierSchema>;
export type CreateShipperInput = z.infer<typeof createShipperSchema>;
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
