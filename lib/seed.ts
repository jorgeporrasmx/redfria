import { v4 as uuidv4 } from "uuid";
import { Carrier, Shipper, Shipment } from "./models";
import {
  getCarriers,
  getShippers,
  saveCarrier,
  saveShipper,
  saveShipment,
  isInitialized,
  markInitialized,
} from "./storage";

// Cities with approximate coordinates in Bajío/Norte region
const cities = [
  { city: "Querétaro", state: "Querétaro", lat: 20.5888, lng: -100.3899 },
  { city: "Guadalajara", state: "Jalisco", lat: 20.6597, lng: -103.3496 },
  { city: "Monterrey", state: "Nuevo León", lat: 25.6866, lng: -100.3161 },
  { city: "Nuevo Laredo", state: "Tamaulipas", lat: 27.4761, lng: -99.5066 },
  { city: "San Luis Potosí", state: "San Luis Potosí", lat: 22.1565, lng: -100.9855 },
  { city: "Aguascalientes", state: "Aguascalientes", lat: 21.8818, lng: -102.2916 },
  { city: "León", state: "Guanajuato", lat: 21.1221, lng: -101.686 },
  { city: "Celaya", state: "Guanajuato", lat: 20.5236, lng: -100.8157 },
  { city: "Irapuato", state: "Guanajuato", lat: 20.6767, lng: -101.3555 },
  { city: "Saltillo", state: "Coahuila", lat: 25.4232, lng: -100.9924 },
  { city: "Torreón", state: "Coahuila", lat: 25.5428, lng: -103.4068 },
  { city: "Ciudad Juárez", state: "Chihuahua", lat: 31.6904, lng: -106.4245 },
];

const companyPrefixes = [
  "Transportes",
  "Fletes",
  "Logística",
  "Refrigerados",
  "Express",
  "Carga",
];

const companySuffixes = [
  "del Norte",
  "del Bajío",
  "Rápidos",
  "Premium",
  "Profesionales",
  "México",
  "Plus",
  "Pro",
];

const firstNames = [
  "Carlos",
  "Miguel",
  "José",
  "Juan",
  "Roberto",
  "Fernando",
  "Alejandro",
  "Ricardo",
  "Eduardo",
  "Luis",
  "María",
  "Ana",
  "Patricia",
];

const lastNames = [
  "García",
  "Hernández",
  "López",
  "Martínez",
  "González",
  "Rodríguez",
  "Pérez",
  "Sánchez",
  "Ramírez",
  "Torres",
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone(): string {
  const areaCode = ["55", "81", "33", "442", "449", "477"][Math.floor(Math.random() * 6)];
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `+52${areaCode}${number}`;
}

function generateCarriers(): Carrier[] {
  const carriers: Carrier[] = [];
  const statuses: Carrier["availabilityStatus"][] = ["GREEN", "GREEN", "GREEN", "YELLOW", "YELLOW", "RED"];

  for (let i = 0; i < 12; i++) {
    const location = cities[i % cities.length];
    const status = statuses[i % statuses.length];

    const carrier: Carrier = {
      id: uuidv4(),
      companyName: `${randomElement(companyPrefixes)} ${randomElement(companySuffixes)}`,
      contactName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      phone: generatePhone(),
      unitType: "reefer",
      city: location.city,
      state: location.state,
      lat: location.lat + (Math.random() - 0.5) * 0.1,
      lng: location.lng + (Math.random() - 0.5) * 0.1,
      availabilityStatus: status,
      nextAvailableAt:
        status === "YELLOW"
          ? new Date(Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      tempRangeMin: -20 + Math.floor(Math.random() * 10),
      tempRangeMax: 0 + Math.floor(Math.random() * 10),
      capacityPallets: 20 + Math.floor(Math.random() * 14),
      routesPreferred: [
        { fromState: location.state, toState: randomElement(cities).state },
        { fromState: randomElement(cities).state, toState: location.state },
      ],
      ratingAvg: 3.5 + Math.random() * 1.5,
      ratingCount: Math.floor(Math.random() * 50) + 5,
      tags:
        Math.random() > 0.3
          ? ["puntual", "buena comunicación", "unidad limpia"].slice(
              0,
              Math.floor(Math.random() * 3) + 1
            )
          : [],
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    };
    carriers.push(carrier);
  }

  return carriers;
}

function generateShippers(): Shipper[] {
  const shipperCompanies = [
    "Alimentos Frescos MX",
    "Distribuidora Agrícola del Norte",
    "Productos Lácteos Premium",
  ];

  return shipperCompanies.map((companyName) => ({
    id: uuidv4(),
    companyName,
    contactName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
    phone: generatePhone(),
    ratingAvg: 4.0 + Math.random() * 1.0,
    ratingCount: Math.floor(Math.random() * 30) + 10,
    tags: ["pago puntual", "buena comunicación"].slice(0, Math.floor(Math.random() * 2) + 1),
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

function generateShipments(shippers: Shipper[]): Shipment[] {
  const products = [
    "Frutas y Verduras",
    "Productos Lácteos",
    "Carne Congelada",
    "Mariscos",
    "Helados",
  ];

  const shipments: Shipment[] = [];

  for (let i = 0; i < 2; i++) {
    const origin = randomElement(cities);
    let dest = randomElement(cities);
    while (dest.city === origin.city) {
      dest = randomElement(cities);
    }

    const pickupStart = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000);
    const pickupEnd = new Date(pickupStart.getTime() + 4 * 60 * 60 * 1000);

    shipments.push({
      id: uuidv4(),
      shipperId: shippers[i % shippers.length].id,
      originCity: origin.city,
      originState: origin.state,
      destCity: dest.city,
      destState: dest.state,
      pickupWindowStart: pickupStart.toISOString(),
      pickupWindowEnd: pickupEnd.toISOString(),
      tempRequiredMin: -18 + Math.floor(Math.random() * 8),
      tempRequiredMax: -2 + Math.floor(Math.random() * 6),
      productType: randomElement(products),
      pallets: 10 + Math.floor(Math.random() * 20),
      weightKg: 5000 + Math.floor(Math.random() * 15000),
      specialRequirements: Math.random() > 0.5 ? "Requiere termógrafo" : undefined,
      status: "active",
      createdAt: new Date().toISOString(),
    });
  }

  return shipments;
}

export function seedData(): void {
  if (typeof window === "undefined") return;
  if (isInitialized()) return;

  const carriers = generateCarriers();
  const shippers = generateShippers();
  const shipments = generateShipments(shippers);

  carriers.forEach(saveCarrier);
  shippers.forEach(saveShipper);
  shipments.forEach(saveShipment);

  markInitialized();

  console.log("RedFría: Demo data seeded successfully");
  console.log(`- ${carriers.length} carriers`);
  console.log(`- ${shippers.length} shippers`);
  console.log(`- ${shipments.length} shipments`);
}

export function resetAndReseed(): void {
  if (typeof window === "undefined") return;

  // Clear all data
  const keys = [
    "redfria_carriers",
    "redfria_shippers",
    "redfria_shipments",
    "redfria_reviews",
    "redfria_current_user",
    "redfria_initialized",
  ];
  keys.forEach((key) => localStorage.removeItem(key));

  // Reseed
  const carriers = generateCarriers();
  const shippers = generateShippers();
  const shipments = generateShipments(shippers);

  carriers.forEach(saveCarrier);
  shippers.forEach(saveShipper);
  shipments.forEach(saveShipment);

  markInitialized();

  console.log("RedFría: Demo data reset and reseeded");
}
