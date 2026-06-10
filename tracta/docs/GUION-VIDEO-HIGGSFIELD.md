# Guion de video para anuncio — Tracta (Higgsfield)

**Objetivo:** detener el scroll, mostrar el caos del comisionista y posicionar a Tracta
como la solución, llevando el clic a la landing (`/`) para agendar un demo.

**Formato:** 30 s · problema → solución · voz en off en español (México).
**Versión principal:** vertical **9:16** (Reels / TikTok / Shorts). Exportar también 1:1 y 16:9.
**Tono de locución:** cercano, seguro, ritmo ágil. Voz masculina o femenina neutra mexicana.
**Música:** percusión tensa al inicio (problema) que abre a una melodía limpia y optimista
en la solución. Sin letra.

> **Nota de producción:** Higgsfield genera las tomas **cinematográficas** (carretera,
> trailers, frontera, el coordinador estresado). Las tomas de **la app** deben ser
> **grabaciones de pantalla reales** de Tracta (tablero, asignar, rastreo) compuestas
> encima. Abajo, cada escena indica cuál es cuál. Los *prompts visuales van en inglés*
> (los modelos de video rinden mejor así); la locución y los textos en pantalla, en español.

---

## Storyboard escena por escena

### Escena 1 — Hook / el problema (0:00–0:03)
- **Fuente:** Higgsfield (cinematográfico)
- **Prompt (EN):** *"Cinematic close-up of a stressed Mexican freight dispatcher in a small office at night, three phones ringing, sticky notes everywhere, blue screen glow on his face, shallow depth of field, moody lighting, 35mm film look."*
- **Cámara (Higgsfield):** slow push-in
- **Locución:** "Si mover fletes se siente como apagar incendios todo el día…"
- **Texto en pantalla:** *“¿Tu operación es puro caos?”*

### Escena 2 — Amplificar el dolor (0:03–0:08)
- **Fuente:** Higgsfield + insertos
- **Prompt (EN):** *"Fast montage: a smartphone overflowing with WhatsApp chat notifications; a cluttered Excel spreadsheet reflected in tired eyes; a wall clock at 11 PM; cinematic, high contrast, quick cuts."*
- **Cámara:** handheld, cortes rápidos
- **Locución:** "…todo en WhatsApp y Excel, sin saber dónde va cada carga ni cuánto estás ganando."
- **Texto en pantalla:** *“WhatsApp + Excel = descontrol”*

### Escena 3 — El giro (0:08–0:12)
- **Fuente:** Higgsfield
- **Prompt (EN):** *"A fleet of clean cargo trailers driving on a Mexican highway at golden hour, drone shot rising to reveal the open road, hopeful and cinematic, warm light."*
- **Cámara:** drone reveal hacia arriba
- **Locución:** "Hay una forma más simple de tener el control."
- **Texto en pantalla:** *“Conoce Tracta”*

### Escena 4 — La solución / la app (0:12–0:22)
- **Fuente:** **Grabación de pantalla real de Tracta** (compuesta en un mockup de laptop/teléfono que puede generar Higgsfield)
- **Prompt de fondo (EN):** *"Clean modern laptop and smartphone floating on a soft blue gradient background, studio product shot, subtle motion."* (la pantalla se reemplaza con el screen recording)
- **Mostrar en orden (≈2.5s c/u):**
  1. **Tablero/Kanban** de viajes.
  2. **Asignar transportista** con el match.
  3. **Margen del viaje** apareciendo.
  4. **Portal de rastreo** en un teléfono.
- **Locución:** "Cotiza, asigna al mejor transportista, da seguimiento en tiempo real y ve el margen de cada viaje. Todo en una sola pantalla."
- **Texto en pantalla (rota):** *“Asigna en segundos” → “Margen al instante” → “Tu cliente rastrea solo”*

### Escena 5 — Beneficio / emoción (0:22–0:27)
- **Fuente:** Higgsfield
- **Prompt (EN):** *"The same dispatcher now calm and confident, leaning back with a coffee, organized bright modern office, soft natural daylight, a subtle smile, cinematic."*
- **Cámara:** slow pull-back
- **Locución:** "Menos llamadas, menos errores, más viajes cerrados."
- **Texto en pantalla:** *“Toma el control”*

### Escena 6 — Cierre / CTA (0:27–0:30)
- **Fuente:** Animación de marca (logo Tracta)
- **Prompt (EN):** *"Minimal brand end card on white, a blue truck icon, bold wordmark, clean motion graphics, premium tech feel."*
- **Locución:** "Tracta. Agenda tu demo gratuito hoy."
- **Texto en pantalla:** *Logo **Tracta** · “Demo gratuito” · tu-dominio.com · WhatsApp*

---

## Variantes de hook para A/B testing (primeros 3 segundos)
1. **Dolor:** “¿Tu operación de fletes es puro caos?”
2. **Dinero:** “¿Sabes cuánto ganaste en cada viaje del mes pasado?”
3. **Servicio:** “¿Cuántas veces al día te preguntan ‘¿dónde va mi carga?’”
4. **Curiosidad:** “El error de $112,000 que comete medio sector del transporte.” *(ángulo Carta Porte)*

## Copy del anuncio (para acompañar el video)
- **Texto principal:** *Deja de mover tus fletes en WhatsApp y Excel. Con Tracta cotizas,
  asignas transportista, das rastreo a tu cliente y ves tu margen en una sola pantalla.
  Hecho para comisionistas de carga en México. 👉 Agenda tu demo gratuito.*
- **Titular:** *Toda tu operación de fletes en una sola pantalla*
- **Descripción / CTA del botón:** *Más información* o *Reservar* → landing `/`

## Checklist de producción
- [ ] Reemplazar `salesWhatsapp` en `lib/brand.ts` con el número real (CTA del video y la landing).
- [ ] Grabar las 4 tomas de pantalla de Tracta (tablero, asignar, margen, rastreo).
- [ ] Generar escenas 1, 2, 3, 5, 6 en Higgsfield (9:16).
- [ ] Locución en español MX + música (problema→solución).
- [ ] Subtítulos quemados (la mayoría ve sin audio).
- [ ] Exportar 9:16, 1:1 y 16:9; primeros 3 s con el hook + texto grande.
