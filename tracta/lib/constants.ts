// Mexican states for dropdowns
export const MEXICAN_STATES = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "México",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
] as const;

// Major cities by state (industrial corridors + frontera)
export const MAJOR_CITIES: Record<string, string[]> = {
  Aguascalientes: ["Aguascalientes"],
  "Baja California": ["Tijuana", "Mexicali", "Ensenada"],
  Chihuahua: ["Chihuahua", "Ciudad Juárez", "Delicias"],
  Coahuila: ["Saltillo", "Torreón", "Monclova", "Ramos Arizpe"],
  "Ciudad de México": ["Ciudad de México"],
  Guanajuato: ["León", "Celaya", "Irapuato", "Salamanca", "Silao"],
  Jalisco: ["Guadalajara", "Zapopan", "El Salto", "Puerto Vallarta"],
  México: ["Toluca", "Tepotzotlán", "Cuautitlán Izcalli", "Ecatepec"],
  "Nuevo León": ["Monterrey", "Apodaca", "Santa Catarina", "Guadalupe", "García"],
  Puebla: ["Puebla", "San Martín Texmelucan"],
  Querétaro: ["Querétaro", "San Juan del Río", "El Marqués"],
  "San Luis Potosí": ["San Luis Potosí", "Villa de Reyes"],
  Sonora: ["Hermosillo", "Nogales", "Ciudad Obregón"],
  Tamaulipas: ["Nuevo Laredo", "Reynosa", "Matamoros", "Altamira", "Tampico"],
  Veracruz: ["Veracruz", "Córdoba", "Orizaba"],
  Zacatecas: ["Zacatecas", "Fresnillo"],
};

// Approximate coordinates for major cities (used for the map)
export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "Ciudad de México": { lat: 19.4326, lng: -99.1332 },
  Monterrey: { lat: 25.6866, lng: -100.3161 },
  Guadalajara: { lat: 20.6597, lng: -103.3496 },
  Querétaro: { lat: 20.5888, lng: -100.3899 },
  León: { lat: 21.1619, lng: -101.6921 },
  Celaya: { lat: 20.5235, lng: -100.8156 },
  "San Luis Potosí": { lat: 22.1565, lng: -100.9855 },
  Saltillo: { lat: 25.4232, lng: -101.0053 },
  Aguascalientes: { lat: 21.8853, lng: -102.2916 },
  "Nuevo Laredo": { lat: 27.4763, lng: -99.5164 },
  Reynosa: { lat: 26.0922, lng: -98.2779 },
  "Ciudad Juárez": { lat: 31.6904, lng: -106.4245 },
  Tijuana: { lat: 32.5149, lng: -117.0382 },
  Toluca: { lat: 19.2826, lng: -99.6557 },
  Puebla: { lat: 19.0414, lng: -98.2063 },
  Silao: { lat: 20.9437, lng: -101.4283 },
  Apodaca: { lat: 25.7817, lng: -100.1886 },
};

// Cargo types for general freight (not cold-chain specific)
export const CARGO_TYPES = [
  "Carga general",
  "Tarimas / Pallets",
  "Granel sólido",
  "Refrigerado",
  "Materiales de construcción",
  "Automotriz / Autopartes",
  "Productos químicos",
  "Bebidas",
  "Maquinaria / Equipo",
  "Mudanzas",
  "Acero / Metales",
  "Otro",
] as const;

// Unit (trailer) types
export const UNIT_TYPES = [
  { value: "caja_seca", label: "Caja seca (53')" },
  { value: "refrigerado", label: "Refrigerado (reefer)" },
  { value: "plataforma", label: "Plataforma / Flatbed" },
  { value: "lowboy", label: "Lowboy / Cama baja" },
  { value: "tolva", label: "Tolva / Granelera" },
  { value: "tanque", label: "Tanque / Pipa" },
  { value: "full", label: "Full (doble caja)" },
  { value: "otro", label: "Otro" },
] as const;

export type UnitTypeValue = (typeof UNIT_TYPES)[number]["value"];

export function unitTypeLabel(value: string): string {
  return UNIT_TYPES.find((u) => u.value === value)?.label ?? value;
}

// Trip statuses (lifecycle) with display metadata for badges and the dispatch board
export const TRIP_STATUSES = [
  { value: "cotizacion", label: "Cotización", color: "gray" },
  { value: "confirmado", label: "Confirmado", color: "blue" },
  { value: "asignado", label: "Asignado", color: "indigo" },
  { value: "en_transito", label: "En tránsito", color: "amber" },
  { value: "entregado", label: "Entregado", color: "green" },
  { value: "facturado", label: "Facturado", color: "teal" },
  { value: "cerrado", label: "Cerrado", color: "slate" },
  { value: "cancelado", label: "Cancelado", color: "red" },
] as const;

export type TripStatusValue = (typeof TRIP_STATUSES)[number]["value"];

export function tripStatusMeta(value: string) {
  return TRIP_STATUSES.find((s) => s.value === value) ?? TRIP_STATUSES[0];
}

// Columns shown on the dispatch board (Kanban)
export const DISPATCH_COLUMNS: TripStatusValue[] = [
  "cotizacion",
  "confirmado",
  "asignado",
  "en_transito",
  "entregado",
];

// Expense categories logged against a trip
export const EXPENSE_CATEGORIES = [
  "Combustible",
  "Casetas",
  "Maniobras",
  "Pensión / Estadía",
  "Custodia",
  "Otros",
] as const;

// Review tags
export const TRANSPORTISTA_TAGS = [
  "puntual",
  "buena comunicación",
  "unidad en buen estado",
  "profesional",
  "precio justo",
  "flexible",
  "documentación en orden",
  "rastreo confiable",
] as const;

export const CLIENTE_TAGS = [
  "pago puntual",
  "buena comunicación",
  "carga lista a tiempo",
  "documentación clara",
  "trato respetuoso",
  "flexible",
] as const;
