import { z } from "zod";

// Availability status enum (carrier semaphore)
export const AvailabilityStatus = {
  GREEN: "GREEN",
  YELLOW: "YELLOW",
  RED: "RED",
} as const;

export type AvailabilityStatusType =
  (typeof AvailabilityStatus)[keyof typeof AvailabilityStatus];

const phoneRegex = /^\+52\d{10}$/;

// ---------------------------------------------------------------------------
// Cliente (embarcador / shipper)
// ---------------------------------------------------------------------------
export const clienteSchema = z.object({
  id: z.string().uuid(),
  companyName: z.string().min(2, "Nombre de empresa requerido"),
  contactName: z.string().min(2, "Nombre de contacto requerido"),
  phone: z.string().regex(phoneRegex, "Teléfono debe ser formato +52XXXXXXXXXX"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  rfc: z.string().optional(),
  city: z.string().min(2, "Ciudad requerida"),
  state: z.string().min(2, "Estado requerido"),
  creditDays: z.number().min(0).max(180).default(0),
  notes: z.string().max(500).optional(),
  ratingAvg: z.number().min(0).max(5).default(0),
  ratingCount: z.number().min(0).default(0),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
});

// ---------------------------------------------------------------------------
// Transportista (proveedor / carrier)
// ---------------------------------------------------------------------------
export const routePreferenceSchema = z.object({
  fromState: z.string(),
  toState: z.string(),
});

export const transportistaSchema = z.object({
  id: z.string().uuid(),
  companyName: z.string().min(2, "Nombre requerido"),
  contactName: z.string().min(2, "Nombre de contacto requerido"),
  phone: z.string().regex(phoneRegex, "Teléfono debe ser formato +52XXXXXXXXXX"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  rfc: z.string().optional(),
  type: z.enum(["linea", "hombre_camion"]).default("hombre_camion"),
  unitTypes: z.array(z.string()).min(1, "Selecciona al menos un tipo de unidad"),
  city: z.string().min(2, "Ciudad requerida"),
  state: z.string().min(2, "Estado requerido"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  availabilityStatus: z.enum(["GREEN", "YELLOW", "RED"]).default("GREEN"),
  nextAvailableAt: z.string().optional(),
  capacityKg: z.number().min(0).max(50000).optional(),
  routesPreferred: z.array(routePreferenceSchema).optional(),
  baseRate: z.number().min(0).optional(),
  // Compliance (broker verifies the carrier carries these)
  placas: z.string().optional(),
  permisoSICT: z.string().optional(),
  seguroVigente: z.boolean().default(false),
  cartaPorteReady: z.boolean().default(false),
  ratingAvg: z.number().min(0).max(5).default(0),
  ratingCount: z.number().min(0).default(0),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
});

// ---------------------------------------------------------------------------
// Operador (driver — belongs to a transportista)
// ---------------------------------------------------------------------------
export const operadorSchema = z.object({
  id: z.string().uuid(),
  transportistaId: z.string().uuid(),
  name: z.string().min(2, "Nombre requerido"),
  phone: z.string().regex(phoneRegex, "Teléfono inválido").optional().or(z.literal("")),
  licencia: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Viaje (trip / load — the central operational entity)
// ---------------------------------------------------------------------------
export const checkpointSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  location: z.string().optional(),
  note: z.string().optional(),
  timestamp: z.string(),
});

export const expenseSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  amount: z.number().min(0),
  note: z.string().optional(),
  createdAt: z.string(),
});

export const podSchema = z.object({
  imageDataUrl: z.string().optional(),
  receivedBy: z.string().optional(),
  signedAt: z.string().optional(),
  note: z.string().optional(),
});

export const viajeSchema = z.object({
  id: z.string().uuid(),
  folio: z.string(),
  clienteId: z.string().uuid(),
  originCity: z.string().min(2, "Ciudad origen requerida"),
  originState: z.string().min(2, "Estado origen requerido"),
  destCity: z.string().min(2, "Ciudad destino requerida"),
  destState: z.string().min(2, "Estado destino requerido"),
  pickupDate: z.string(),
  deliveryDate: z.string().optional(),
  cargoType: z.string().min(2, "Tipo de carga requerido"),
  unitTypeRequired: z.string().min(2, "Tipo de unidad requerido"),
  weightKg: z.number().min(0).optional(),
  description: z.string().optional(),
  specialRequirements: z.string().optional(),
  // Money: broker margin = tarifaCliente - costoTransportista
  tarifaCliente: z.number().min(0, "Tarifa requerida"),
  costoTransportista: z.number().min(0).optional(),
  transportistaId: z.string().uuid().optional(),
  operadorId: z.string().uuid().optional(),
  status: z
    .enum([
      "cotizacion",
      "confirmado",
      "asignado",
      "en_transito",
      "entregado",
      "facturado",
      "cerrado",
      "cancelado",
    ])
    .default("cotizacion"),
  checkpoints: z.array(checkpointSchema).default([]),
  expenses: z.array(expenseSchema).default([]),
  pod: podSchema.optional(),
  cartaPorteValidated: z.boolean().default(false),
  createdAt: z.string(),
});

// ---------------------------------------------------------------------------
// Review (bilateral reputation)
// ---------------------------------------------------------------------------
export const reviewSchema = z.object({
  id: z.string().uuid(),
  fromName: z.string(),
  toUserId: z.string().uuid(),
  toUserType: z.enum(["transportista", "cliente"]),
  rating: z.number().min(1).max(5),
  tags: z.array(z.string()),
  comment: z.string().max(500).optional(),
  relatedTripId: z.string().uuid().optional(),
  createdAt: z.string(),
});

// TypeScript types
export type RoutePreference = z.infer<typeof routePreferenceSchema>;
export type Cliente = z.infer<typeof clienteSchema>;
export type Transportista = z.infer<typeof transportistaSchema>;
export type Operador = z.infer<typeof operadorSchema>;
export type Checkpoint = z.infer<typeof checkpointSchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type Pod = z.infer<typeof podSchema>;
export type Viaje = z.infer<typeof viajeSchema>;
export type Review = z.infer<typeof reviewSchema>;

// Form input schemas (without generated fields)
export const createClienteSchema = clienteSchema.omit({
  id: true,
  ratingAvg: true,
  ratingCount: true,
  tags: true,
  createdAt: true,
});

export const createTransportistaSchema = transportistaSchema.omit({
  id: true,
  ratingAvg: true,
  ratingCount: true,
  tags: true,
  createdAt: true,
});

export const createViajeSchema = viajeSchema.omit({
  id: true,
  folio: true,
  status: true,
  checkpoints: true,
  expenses: true,
  pod: true,
  cartaPorteValidated: true,
  createdAt: true,
});

export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type CreateTransportistaInput = z.infer<typeof createTransportistaSchema>;
export type CreateViajeInput = z.infer<typeof createViajeSchema>;
