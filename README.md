# Convertidor MP4 → MP3 (100% en el navegador, gratis)

Este es un sitio **estático** que convierte MP4 a MP3 sin subir archivos, usando `ffmpeg.wasm`.  
Se puede desplegar gratis en **Vercel**, **Netlify** o **GitHub Pages**.

## 1) Requisitos (gratis)
- Una cuenta en GitHub (gratis).
- Opcional: cuentas en Vercel o Netlify (gratis).

## 2) Estructura
```
mp4-to-mp3-site/
├─ index.html
├─ styles.css
└─ privacy.html
```

## 3) Deploy gratis (elige una)

### Opción A — Vercel (recomendada)
1. Inicia sesión en https://vercel.com con tu GitHub.
2. Clic **Add New → Project** y selecciona tu repositorio.
3. En "Framework Preset", elige **Other** (es un sitio estático).
4. Directorio raíz: `/` (por defecto). Build Command y Output Directory vacíos.
5. Deploy. Tu web quedará en `https://<tu-proyecto>.vercel.app/` (gratis).

### Opción B — Netlify
1. Inicia sesión en https://app.netlify.com/ con GitHub.
2. **Add new site → Import an existing project**.
3. Selecciona tu repo, en "Build command" y "Publish directory" déjalos vacíos (es estático).
4. Deploy y listo (`https://<tu-proyecto>.netlify.app/`).

### Opción C — GitHub Pages
1. Sube esta carpeta a un repositorio en GitHub.
2. En tu repo: **Settings → Pages**.
3. Source: **Deploy from a branch**, Branch: **main** y carpeta **/** (root).
4. Guarda. Se publicará en `https://<tu-usuario>.github.io/<repo>/` (gratis).

> Nota: la primera conversión puede tardar más porque el navegador descarga el core de ffmpeg desde un CDN.

## 4) Coste 0€ — Por qué
- No hay servidor ni base de datos.
- Toda la conversión ocurre en el navegador del usuario.
- El hosting estático en Vercel/Netlify/GitHub Pages tiene plan gratuito.

## 5) SEO/Monetización (también gratis)
- **SEO**: en `index.html` ya hay `description` y `JSON-LD`. Puedes crear guías adicionales (p. ej. `guia-iphone.html`) duplicando la plantilla.
- **Monetización**:
  - **AdSense**: crea una cuenta (gratis) y pega el script de anuncios en `index.html`. No necesitas dominio de pago, aunque ayuda para aprobación.
  - **Afiliados**: añade enlaces a guías/tutoriales (gratis).
  - **Donaciones**: Ko‑fi/PayPal son gratis a nivel de plataforma; solo aplican comisiones por pago cuando recibes dinero.

## 6) Limitaciones y consejos
- Límite de tamaño por memoria del navegador (configurado a 500 MB por defecto).
- No cierres la pestaña durante la conversión.
- Evita promocionar descargas de plataformas con DRM o que violen Términos de Servicio.

## 7) Desarrollo local (opcional)
- Simplemente abre `index.html` con un navegador moderno.
- Si usas un servidor local, cualquier "Live Server" funciona (VS Code → extensión Live Server).

¡Éxitos!
