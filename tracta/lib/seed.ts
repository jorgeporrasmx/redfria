import { v4 as uuidv4 } from "uuid";
import { Cliente, Transportista, Operador, Viaje } from "./models";
import {
  saveCliente,
  saveTransportista,
  saveOperador,
  saveViaje,
  isInitialized,
  markInitialized,
  resetAllData,
} from "./storage";
import { CITY_COORDS } from "./constants";

type Loc = { city: string; state: string };

const cities: Loc[] = [
  { city: "Querétaro", state: "Querétaro" },
  { city: "Guadalajara", state: "Jalisco" },
  { city: "Monterrey", state: "Nuevo León" },
  { city: "Nuevo Laredo", state: "Tamaulipas" },
  { city: "San Luis Potosí", state: "San Luis Potosí" },
  { city: "León", state: "Guanajuato" },
  { city: "Saltillo", state: "Coahuila" },
  { city: "Ciudad de México", state: "Ciudad de México" },
  { city: "Toluca", state: "México" },
  { city: "Apodaca", state: "Nuevo León" },
];

const firstNames = [
  "Carlos", "Miguel", "José", "Juan", "Roberto", "Fernando", "Alejandro",
  "Ricardo", "Eduardo", "Luis", "María", "Ana", "Patricia",
];
const lastNames = [
  "García", "Hernández", "López", "Martínez", "González", "Rodríguez",
  "Pérez", "Sánchez", "Ramírez", "Torres",
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function name(): string {
  return `${rand(firstNames)} ${rand(lastNames)}`;
}
function phone(): string {
  const area = ["55", "81", "33", "442", "449", "477"][Math.floor(Math.random() * 6)];
  const num = Math.floor(Math.random() * 9000000) + 1000000;
  return `+52${area}${num}`;
}
function coords(loc: Loc) {
  const base = CITY_COORDS[loc.city] ?? { lat: 22, lng: -101 };
  return {
    lat: base.lat + (Math.random() - 0.5) * 0.1,
    lng: base.lng + (Math.random() - 0.5) * 0.1,
  };
}
function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86400000).toISOString();
}
function daysFromNow(d: number): string {
  return new Date(Date.now() + d * 86400000).toISOString();
}

// ---------------------------------------------------------------------------
const clienteCompanies = [
  "Comercializadora del Bajío",
  "Industrias Aceros MX",
  "Distribuidora La Norteña",
  "Manufacturas Querétaro",
  "Bebidas y Abarrotes del Centro",
];

function buildClientes(): Cliente[] {
  return clienteCompanies.map((companyName, i) => {
    const loc = cities[i % cities.length];
    return {
      id: uuidv4(),
      companyName,
      contactName: name(),
      phone: phone(),
      email: `compras@${companyName.toLowerCase().replace(/[^a-z]/g, "")}.mx`,
      rfc: "XAXX010101000",
      city: loc.city,
      state: loc.state,
      creditDays: rand([0, 15, 30, 30, 45]),
      notes: "",
      ratingAvg: 4 + Math.random(),
      ratingCount: Math.floor(Math.random() * 20) + 5,
      tags: ["pago puntual", "buena comunicación"].slice(0, Math.floor(Math.random() * 2) + 1),
      createdAt: daysAgo(Math.random() * 200),
    };
  });
}

const unitPool = ["caja_seca", "plataforma", "refrigerado", "lowboy", "tolva"];

function buildTransportistas(): Transportista[] {
  const statuses: Transportista["availabilityStatus"][] = [
    "GREEN", "GREEN", "GREEN", "GREEN", "YELLOW", "YELLOW", "RED",
  ];
  const prefixes = ["Transportes", "Fletes", "Autotransportes", "Logística", "Carga"];
  const suffixes = ["del Norte", "del Bajío", "Express", "Premium", "González", "del Centro", "Rápidos"];

  const list: Transportista[] = [];
  for (let i = 0; i < 12; i++) {
    const loc = cities[i % cities.length];
    const status = statuses[i % statuses.length];
    const isLinea = Math.random() > 0.5;
    const units = [rand(unitPool)];
    if (Math.random() > 0.5) units.push(rand(unitPool));
    const cartaPorteReady = Math.random() > 0.25;

    list.push({
      id: uuidv4(),
      companyName: isLinea
        ? `${rand(prefixes)} ${rand(suffixes)}`
        : `${name()} (Hombre-camión)`,
      contactName: name(),
      phone: phone(),
      email: "",
      rfc: "XAXX010101000",
      type: isLinea ? "linea" : "hombre_camion",
      unitTypes: Array.from(new Set(units)),
      city: loc.city,
      state: loc.state,
      ...coords(loc),
      availabilityStatus: status,
      nextAvailableAt: status === "YELLOW" ? daysFromNow(Math.random() * 3) : undefined,
      capacityKg: rand([20000, 24000, 28000, 30000]),
      routesPreferred: [
        { fromState: loc.state, toState: rand(cities).state },
        { fromState: rand(cities).state, toState: loc.state },
      ],
      baseRate: rand([18000, 22000, 25000, 28000, 32000]),
      placas: `${rand(["A", "B", "C"])}${Math.floor(Math.random() * 90 + 10)}-AAA`,
      permisoSICT: cartaPorteReady ? `TPAF01-${Math.floor(Math.random() * 90000 + 10000)}` : undefined,
      seguroVigente: cartaPorteReady,
      cartaPorteReady,
      ratingAvg: 3.5 + Math.random() * 1.5,
      ratingCount: Math.floor(Math.random() * 50) + 5,
      tags: ["puntual", "buena comunicación", "documentación en orden"].slice(
        0,
        Math.floor(Math.random() * 3) + 1
      ),
      createdAt: daysAgo(Math.random() * 200),
    });
  }
  return list;
}

function buildOperadores(transportistas: Transportista[]): Operador[] {
  const ops: Operador[] = [];
  transportistas.forEach((t) => {
    const count = t.type === "linea" ? 2 : 1;
    for (let i = 0; i < count; i++) {
      ops.push({
        id: uuidv4(),
        transportistaId: t.id,
        name: name(),
        phone: phone(),
        licencia: `LIC-${Math.floor(Math.random() * 900000 + 100000)}`,
      });
    }
  });
  return ops;
}

const cargoPool = [
  "Carga general", "Tarimas / Pallets", "Automotriz / Autopartes",
  "Bebidas", "Acero / Metales", "Materiales de construcción",
];

function buildViajes(
  clientes: Cliente[],
  transportistas: Transportista[],
  operadores: Operador[]
): Viaje[] {
  // Scripted set so the dashboard + dispatch board look alive across statuses
  const plan: { status: Viaje["status"]; assigned: boolean; pickupOffset: number }[] = [
    { status: "cotizacion", assigned: false, pickupOffset: 4 },
    { status: "cotizacion", assigned: false, pickupOffset: 6 },
    { status: "confirmado", assigned: false, pickupOffset: 3 },
    { status: "asignado", assigned: true, pickupOffset: 2 },
    { status: "en_transito", assigned: true, pickupOffset: 0 },
    { status: "en_transito", assigned: true, pickupOffset: -1 },
    { status: "entregado", assigned: true, pickupOffset: -3 },
    { status: "facturado", assigned: true, pickupOffset: -8 },
    { status: "cerrado", assigned: true, pickupOffset: -15 },
  ];

  return plan.map((p, i) => {
    const cliente = clientes[i % clientes.length];
    const origin = cities[i % cities.length];
    let dest = cities[(i + 3) % cities.length];
    if (dest.city === origin.city) dest = cities[(i + 4) % cities.length];

    const tarifa = rand([26000, 30000, 34000, 38000, 42000]);
    const costo = tarifa - rand([4000, 5000, 6000, 7000, 8000]);

    let transportistaId: string | undefined;
    let operadorId: string | undefined;
    let unitTypeRequired = rand(unitPool);

    if (p.assigned) {
      const t = transportistas[i % transportistas.length];
      transportistaId = t.id;
      unitTypeRequired = t.unitTypes[0];
      operadorId = operadores.find((o) => o.transportistaId === t.id)?.id;
    }

    const checkpoints =
      ["en_transito", "entregado", "facturado", "cerrado"].includes(p.status)
        ? [
            {
              id: uuidv4(),
              label: "Carga recolectada",
              location: `${origin.city}, ${origin.state}`,
              note: "Salida a tiempo",
              timestamp: daysAgo(Math.abs(p.pickupOffset) + 0.5),
            },
            {
              id: uuidv4(),
              label: "En ruta",
              location: "Carretera 57",
              timestamp: daysAgo(Math.abs(p.pickupOffset)),
            },
          ]
        : [];

    if (["entregado", "facturado", "cerrado"].includes(p.status)) {
      checkpoints.push({
        id: uuidv4(),
        label: "Entregado",
        location: `${dest.city}, ${dest.state}`,
        note: "Recibido sin novedad",
        timestamp: daysAgo(Math.abs(p.pickupOffset) - 1),
      });
    }

    const pod = ["entregado", "facturado", "cerrado"].includes(p.status)
      ? { receivedBy: name(), signedAt: daysAgo(Math.abs(p.pickupOffset) - 1), note: "POD en archivo" }
      : undefined;

    return {
      id: uuidv4(),
      folio: `TRC-2026-${String(i + 1).padStart(4, "0")}`,
      clienteId: cliente.id,
      originCity: origin.city,
      originState: origin.state,
      destCity: dest.city,
      destState: dest.state,
      pickupDate: daysFromNow(p.pickupOffset),
      deliveryDate: daysFromNow(p.pickupOffset + 1),
      cargoType: rand(cargoPool),
      unitTypeRequired,
      weightKg: rand([12000, 18000, 22000, 26000]),
      description: "",
      specialRequirements: Math.random() > 0.6 ? "Requiere custodia" : undefined,
      tarifaCliente: tarifa,
      costoTransportista: p.assigned ? costo : undefined,
      transportistaId,
      operadorId,
      status: p.status,
      checkpoints,
      expenses: p.assigned
        ? [
            { id: uuidv4(), category: "Casetas", amount: rand([800, 1200, 1500]), createdAt: daysAgo(2) },
          ]
        : [],
      pod,
      cartaPorteValidated: p.assigned && Math.random() > 0.3,
      createdAt: daysAgo(Math.abs(p.pickupOffset) + 1),
    };
  });
}

function generateAll() {
  const clientes = buildClientes();
  const transportistas = buildTransportistas();
  const operadores = buildOperadores(transportistas);
  const viajes = buildViajes(clientes, transportistas, operadores);
  return { clientes, transportistas, operadores, viajes };
}

function persist(data: ReturnType<typeof generateAll>) {
  data.clientes.forEach(saveCliente);
  data.transportistas.forEach(saveTransportista);
  data.operadores.forEach(saveOperador);
  data.viajes.forEach(saveViaje);
  // advance folio counter past seeded trips
  if (typeof window !== "undefined") {
    localStorage.setItem("tracta_folio_counter", String(data.viajes.length));
  }
  markInitialized();
}

export function seedData(): void {
  if (typeof window === "undefined") return;
  if (isInitialized()) return;
  persist(generateAll());
}

export function resetAndReseed(): void {
  if (typeof window === "undefined") return;
  resetAllData();
  persist(generateAll());
}
