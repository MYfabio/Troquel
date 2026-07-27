# ABELLAPACK · Editor de troqueles

App React (Vite) para colocar logos e imágenes sobre plantillas de troquel. **Incluye chat de Gemini** para cambios automáticos por lenguaje natural.

## Desarrollo local

```bash
npm install
npm run dev
```

Para usar Gemini en local, crea un archivo `.env`:
```
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

## Desplegar en Railway con Gemini

### 1. Generar API key de Gemini
1. Ve a https://aistudio.google.com/app/apikeys
2. Clica **"Create API Key"** → **"Create API key in new project"**
3. Copia la key (será algo como `AIzaSy...`)

### 2. Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USER/troquel-capas
git push -u origin main
```

### 3. Desplegar en Railway
1. En Railway: **New Project → Deploy from GitHub repo** y elige tu repo.
2. Railway detecta Node automáticamente (Nixpacks). El `railway.json` ya configura build y start.
3. Una vez desplegado, ve a **Settings → Variables**.
4. **Add Variable** → Name: `VITE_GEMINI_API_KEY` → Value: `tu_key_aqui`
5. Railway redeploy automático en unos segundos.
6. Pulsa **Generate Domain** en Settings → Networking para obtener la URL.

### Uso del chat de IA
En el panel derecho, escribe peticiones en lenguaje natural:
- "Fondo azul oscuro"
- "Gira el logo 45 grados"
- "Hazlo 50mm más ancho"
- "Quitar fondo blanco del logo"

Gemini entiende y ejecuta los cambios automáticamente.

## Notas técnicas
- La exportación a PDF carga jsPDF desde CDN (no requiere dependencia npm).
- No hay backend: es una SPA estática + API de Gemini.
- El chat usa el modelo `gemini-2.0-flash` de Google (rápido y gratis con límites).
# Clean build
