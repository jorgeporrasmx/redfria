# RedFría - Marketplace de Transporte Refrigerado

RedFría es un marketplace B2B que conecta clientes con transportistas de carga refrigerada (reefer) en México, enfocado en el corredor Bajío/Norte.

## Características Principales

- **Semáforo de Disponibilidad**: Visualiza en tiempo real qué unidades están disponibles (verde), próximas a liberarse (amarillo), o no disponibles (rojo)
- **Reputación Bilateral**: Clientes califican transportistas y viceversa
- **Match Inteligente**: Algoritmo que encuentra las mejores opciones por temperatura, capacidad, ubicación y disponibilidad
- **Contacto por WhatsApp**: Comunicación directa sin intermediarios

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## URL Local

Una vez iniciado el servidor de desarrollo:

```
http://localhost:3000
```

## Estructura de Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page con hero y beneficios |
| `/app` | Dashboard con selector Cliente/Transportista |
| `/app/cliente/publicar-carga` | Formulario para publicar una carga |
| `/app/cliente/matches?id=...` | Lista de transportistas compatibles |
| `/app/mapa` | Mapa con semáforo de disponibilidad |
| `/app/transportista/publicar-unidad` | Formulario para publicar/actualizar unidad |
| `/app/perfil/[tipo]/[id]` | Perfil de cliente o transportista |

## Demo Data

Al iniciar la app por primera vez, se generan automáticamente:
- 12 transportistas con unidades refrigeradas
- 3 clientes
- 2 cargas de ejemplo

### Resetear Demo Data

En el Dashboard (`/app`), hay un botón "Reset Demo Data" que permite reiniciar todos los datos mock.

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: React hooks + LocalStorage
- **Validación**: Zod + React Hook Form
- **Mapa**: Leaflet (react-leaflet)
- **Notificaciones**: Sonner

## Modelos de Datos

### Transportista (Carrier)
- Datos de empresa y contacto
- Tipo de unidad (reefer)
- Rango de temperatura soportado
- Capacidad en pallets
- Estado de disponibilidad (GREEN/YELLOW/RED)
- Calificación y tags

### Cliente (Shipper)
- Datos de empresa y contacto
- Calificación y tags

### Carga (Shipment)
- Origen y destino
- Ventana de recolección
- Temperatura requerida
- Tipo de producto
- Pallets y peso

### Review
- Calificación 1-5
- Tags (puntual, buena comunicación, etc.)
- Comentario opcional

## Nota Legal

> RedFría es un marketplace que conecta clientes y transportistas. No presta servicios de transporte ni toma custodia de la carga.

## Desarrollo

```bash
# Linting
npm run lint

# Build
npm run build
```

## Licencia

Propietario - Todos los derechos reservados
