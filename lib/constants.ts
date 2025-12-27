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

// Major cities in Bajío/Norte region
export const MAJOR_CITIES: Record<string, string[]> = {
  Aguascalientes: ["Aguascalientes"],
  Chihuahua: ["Chihuahua", "Ciudad Juárez", "Delicias"],
  Coahuila: ["Saltillo", "Torreón", "Monclova"],
  Guanajuato: ["León", "Celaya", "Irapuato", "Salamanca", "Guanajuato"],
  Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque", "Puerto Vallarta"],
  "Nuevo León": ["Monterrey", "San Pedro Garza García", "Apodaca", "Santa Catarina"],
  Querétaro: ["Querétaro", "San Juan del Río"],
  "San Luis Potosí": ["San Luis Potosí", "Ciudad Valles"],
  Tamaulipas: ["Nuevo Laredo", "Reynosa", "Matamoros", "Tampico"],
  Zacatecas: ["Zacatecas", "Fresnillo"],
};

// Product types for shipments
export const PRODUCT_TYPES = [
  "Frutas y Verduras",
  "Productos Lácteos",
  "Carne Fresca",
  "Carne Congelada",
  "Mariscos y Pescados",
  "Helados y Postres",
  "Medicamentos",
  "Flores",
  "Productos Químicos",
  "Alimentos Procesados",
  "Bebidas",
  "Otro",
] as const;

// Temperature presets
export const TEMPERATURE_PRESETS = [
  { label: "Congelado (-18°C a -20°C)", min: -20, max: -18 },
  { label: "Refrigerado (0°C a 4°C)", min: 0, max: 4 },
  { label: "Fresco (8°C a 12°C)", min: 8, max: 12 },
  { label: "Ambiente controlado (15°C a 20°C)", min: 15, max: 20 },
] as const;
