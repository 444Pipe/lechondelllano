# Lechón del Llano — Sitio web

Sitio estático (HTML + CSS + JS, sin dependencias) para la lechonería **Lechón del Llano** de Restrepo, Meta.
Optimizado para buscar "lechona" en **Restrepo**, **Cumaral** y **Villavicencio**.

## Estructura

```
index.html                      Página principal (hero, días de venta, servicios, menú, calculadora,
                                armador de pedido, zonas, galería, nosotros, testimonios, FAQ, mapa)
lechona-en-restrepo.html        Página SEO local: Restrepo (sede)
lechona-en-cumaral.html         Página SEO local: Cumaral
lechona-en-villavicencio.html   Página SEO local: Villavicencio
404.html                        Página de error
robots.txt · sitemap.xml        SEO técnico
site.webmanifest                Icono e instalación en celular (PWA básica)
static/css/styles.css           Estilos (paleta blanco + rojo, responsive, animaciones)
static/js/data.js               ⭐ CONFIGURACIÓN DEL NEGOCIO (editar aquí)
static/js/main.js               Interactividad (festivos, calculadora, pedido por WhatsApp, etc.)
static/img/                     Logo, favicons, imagen para redes (og-image.jpg)
static/img/galeria/             ← Pon aquí tus fotos (ver abajo)
Dockerfile · Caddyfile          Servidor Caddy para Railway (URLs limpias, 404, compresión, caché)
railway.json                    Configuración del despliegue en Railway
```

## Antes de publicar: qué debes cambiar

1. **Número de WhatsApp** (ya configurado: +57 313 834 7857) → `static/js/data.js` (`whatsapp` y `telefonoVisible`).
   Además, busca y reemplaza `573138347857` en todos los `.html` (aparece en los datos
   estructurados y como enlace de respaldo si el visitante no tiene JavaScript).
2. **Dominio** → busca y reemplaza `https://www.lechondelllano.com/` en los `.html`,
   `sitemap.xml` y `robots.txt` por tu dominio real.
3. **Dirección exacta y coordenadas** → `data.js` (`direccion`) y en `index.html` las etiquetas
   `geo.position`, `ICBM`, el bloque `"geo"` del JSON-LD y la URL del mapa (`maps?q=...`).
4. **Horario** → `data.js` (`horario`). El estado "¡Hoy hay lechona!" se calcula con esos valores.
5. **Precios** → en `index.html`, cada `<span class="price price--ask">Consultar</span>`;
   cámbialo por `<span class="price">$ 18.000</span>` por ejemplo.
6. **Testimonios** → `data.js` (`testimonios`). Los que vienen son de ejemplo: reemplázalos por reseñas reales.
7. **Redes sociales** → `data.js` (`redes`). Si dejas `""` el ícono se oculta solo.
8. **Fotos de la galería** → guarda tus fotos (JPG, ~1200 px de ancho) con estos nombres en `static/img/galeria/`:
   - `01-lechona-entera-restrepo.jpg`
   - `02-porcion-lechona.jpg`
   - `03-cojin-lechona.jpg`
   - `04-evento-lechona-villavicencio.jpg`
   - `05-piel-crocante.jpg`
   - `06-domicilio-lechona-cumaral.jpg`
   Mientras no existan, la galería muestra tarjetas rojas con un ícono.
9. **Tamaños de la calculadora** → `data.js` (`tamanos`): ajusta cuántas personas rinde cada cojín o lechona.

## Cómo funciona lo dinámico

- **Días de venta**: `main.js` calcula los festivos de Colombia (Ley Emiliani, Semana Santa, etc.) y muestra
  los próximos sábados, domingos y lunes festivos, además del aviso "¡Hoy hay lechona!".
- **Calculadora**: recomienda cojín o lechona según el número de personas y arma el mensaje de WhatsApp.
- **Armador de pedido**: el formulario no envía datos a ningún servidor; construye el mensaje y abre WhatsApp.
- **Todos los botones de WhatsApp** usan el atributo `data-wa="mensaje"`; el número se toma de `data.js`.

## Publicar en Railway

El proyecto ya trae todo lo necesario: `Dockerfile` (imagen de Caddy), `Caddyfile` y `railway.json`.
Railway detecta el Dockerfile solo; no hay variables de entorno que configurar.

**Opción A — desde GitHub (recomendada, redespliega con cada push)**

```bash
git add .
git commit -m "Sitio web Lechón del Llano"
git push -u origin main
```

1. Entra a https://railway.com → **New Project** → **Deploy from GitHub repo** → elige `444Pipe/lechondelllano`.
2. Cuando termine el build, ve a **Settings → Networking → Generate Domain**. Te da una URL `xxx.up.railway.app`.
3. Cada `git push` a `main` vuelve a desplegar automáticamente.

**Opción B — con el CLI de Railway (ya instalado)**

```bash
railway login
railway init      # crea el proyecto (o railway link para uno existente)
railway up        # sube y despliega
railway domain    # genera la URL pública
```

**Dominio propio**: en **Settings → Networking → Custom Domain** agrega tu dominio, crea el registro CNAME que
Railway te indica en tu proveedor de DNS y luego reemplaza `https://www.lechondelllano.com/` en los `.html`,
`sitemap.xml` y `robots.txt` por el dominio real (paso 2 de la lista de arriba).

**Cómo sirve Caddy el sitio**

- URLs limpias: `/lechona-en-cumaral` sirve `lechona-en-cumaral.html`; las direcciones con `.html` redirigen (301).
- `404.html` aparece automáticamente para rutas que no existen.
- Compresión gzip/zstd, caché de 1 día para `/static/*` y cabeceras básicas de seguridad.
- Escucha en el puerto que Railway entrega en la variable `PORT`.

**Probar la imagen en tu PC** (con Docker Desktop abierto):

```bash
docker build -t lechondelllano .
docker run --rm -p 8080:8080 lechondelllano
# abre http://localhost:8080
```

Si algún día cambias de hosting, el sitio sigue siendo estático: sube la carpeta completa a Netlify, Vercel,
Cloudflare Pages u Hostinger con `index.html` en la raíz del dominio.

## Checklist SEO local (después de publicar)

- [ ] Crear/verificar el **Perfil de Negocio de Google** (Google Maps) con el mismo nombre, dirección y teléfono
      que aparecen en la página; categoría "Restaurante" o "Lechonería"; horario sáb/dom; fotos reales.
- [ ] Registrar el dominio en **Google Search Console** y enviar `sitemap.xml`.
- [ ] Pedir reseñas a clientes en Google y responderlas.
- [ ] Publicar en Facebook/Instagram con el enlace al sitio y a las páginas de Cumaral y Villavicencio.
- [ ] Validar los datos estructurados en https://search.google.com/test/rich-results
