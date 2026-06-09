# Tracta — Control total de tu carga

**Tracta** es una plataforma operativa para **comisionistas / brokers de autotransporte en México**.
La empresa no opera flota propia: conecta a sus **clientes (embarcadores)** con **transportistas terceros**,
controla cada viaje de punta a punta y da seguimiento en tiempo real.

Derivado de la base de RedFría, reutiliza sus mejores elementos (semáforo de disponibilidad, match
inteligente, reputación bilateral, contacto por WhatsApp, mapa) y los reorienta a la operación de un broker.

## Despliegue en un clic

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjorgeporrasmx%2Fredfria&root-directory=tracta&project-name=tracta&repository-name=tracta)

> El botón ya viene con **Root Directory = `tracta`** preconfigurado, que es la subcarpeta donde vive la app.
> Vercel detecta Next.js automáticamente; no requiere variables de entorno.

¿Prefieres importar el repo existente en lugar de clonarlo? Entra a
[vercel.com/new](https://vercel.com/new), importa `jorgeporrasmx/redfria` y selecciona
**Root Directory → `tracta`** antes de hacer Deploy.

## Características

- **Tablero de despacho (Kanban)**: viajes por estatus — cotización, confirmado, asignado, en tránsito, entregado.
- **Match de transportistas**: por tipo de unidad, ruta, disponibilidad, capacidad, documentación y calificación.
- **Margen por viaje**: tarifa al cliente vs. costo del transportista, margen bruto, neto y % de utilidad.
- **Seguimiento en ruta**: línea de tiempo de checkpoints y evidencia de entrega (POD).
- **Portal de cliente**: rastreo público por folio (`/rastreo/[folio]`), sin exponer datos de margen.
- **Cumplimiento Carta Porte 3.1**: validación de permiso SICT, placas y seguro del transportista.
- **Comunicación WhatsApp**: mensajes prearmados para coordinar transportistas y avisar a clientes.
- **Reputación bilateral**: calificación de clientes y transportistas.
- **Mapa**: semáforo de disponibilidad de transportistas por ubicación.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zod · Leaflet · sonner · lucide-react.
Persistencia 100% en el navegador (`localStorage`) — prototipo demo sin backend.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
```

Al abrir la app por primera vez se cargan automáticamente datos de demostración
(clientes, transportistas, operadores y viajes en distintos estatus).

## Estructura de rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing |
| `/app` | Tablero con KPIs y Kanban de despacho |
| `/app/viajes` · `/nuevo` · `/[id]` | Lista, alta y detalle operativo de viajes |
| `/app/clientes` · `/nuevo` · `/[id]` | CRM de embarcadores |
| `/app/transportistas` · `/nuevo` · `/[id]` | Directorio de proveedores |
| `/app/mapa` | Mapa con semáforo de disponibilidad |
| `/rastreo/[folio]` | Portal público de rastreo para el cliente |

## Branding

El nombre y los textos de marca viven en `lib/brand.ts` — cámbialos en un solo lugar para renombrar el producto.

## Nota legal

Tracta es una plataforma de gestión operativa. La empresa opera como comisionista de transporte
y no presta directamente el servicio de autotransporte.
