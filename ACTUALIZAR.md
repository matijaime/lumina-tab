# 🔄 Cómo Actualizar Lumina Tab

## Opción 1: Script Automático (Recomendado)

### Para Windows (PowerShell):

```powershell
# 1. Descarga el script desde GitHub:
# https://raw.githubusercontent.com/matijaime/lumina-tab/main/actualizar-extension.ps1

# 2. Abre PowerShell como administrador (Click derecho > "Ejecutar como administrador")

# 3. Ejecuta:
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
C:\ruta\a\actualizar-extension.ps1
```

**El script:**
- Te pide la ruta de tu carpeta anterior
- Descarga automáticamente la versión nueva desde GitHub
- Borra los archivos antiguos
- Copia los nuevos
- Respaldará tu versión anterior por si acaso
- **TUS DATOS SE CONSERVAN AUTOMÁTICAMENTE** ✓

### Pasos después:

1. Abre Chrome
2. Ve a `chrome://extensions/`
3. Busca "Lumina Tab"
4. Haz clic en el botón de recarga (🔄)
5. Abre una nueva pestaña

**Listo!** 🎉

---

## Opción 2: Manual (Si el script no funciona)

### Paso 1: Descargar
- Ve a: https://github.com/matijaime/lumina-tab
- Haz clic en Code → Download ZIP
- Extrae en una carpeta temporal

### Paso 2: Reemplazar archivos
Copia estos archivos a tu carpeta de la extensión:
- `newtab.html`
- `newtab.js`
- `newtab.css`
- `fonts.css`
- `manifest.json`
- `background.js`
- `font-loader.js`
- Carpeta `fonts/`
- Carpeta `icons/`

### Paso 3: Limpiar (opcional)
Puedes borrar los scripts `.py`, `.ps1`, `.sh` que tenías antes (no son necesarios)

### Paso 4: Recargar
- Chrome: `chrome://extensions/`
- Busca "Lumina Tab"
- Haz clic en recarga (🔄)

---

## ⚠️ ¿Pierdo mis datos?

**NO.** Tus datos se guardan en `localStorage` de Chrome, que:
- ✅ NO se borra cuando actualizas una extensión
- ✅ NO se sincroniza a servidores externos
- ✅ Permanece en tu navegador local

Se conserva automáticamente:
- Tu nombre personalizado
- Fondos guardados
- Shortcuts del dock
- Fuentes seleccionadas
- Configuración de hora (12h/24h)
- Datos del clima guardados

---

## Resolución de problemas

### "El script no se ejecuta"
```powershell
# Intenta esto primero:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "No tengo git instalado"
El script automáticamente descargará vía ZIP si git no está disponible. ✓

### "Error: Git falló"
El script automáticamente intenta descargar el ZIP. Si aún falla:
- Verifica tu conexión a internet
- Intenta la opción manual

### "Chrome no ve los cambios"
1. Cierra todas las pestañas de New Tab
2. Ve a `chrome://extensions/`
3. Haz clic en recarga (🔄)
4. Abre una **nueva** pestaña

---

## Para compartir con tus amigos

**Comparte esto:**

1. El script: `actualizar-extension.ps1` (desde el repo)
2. O el link: https://github.com/matijaime/lumina-tab

**Instrucciones simples:**
1. Descargar el script
2. Ejecutar en PowerShell
3. Ingresar la ruta de su extension actual
4. ¡Listo! Recargar en Chrome

---

## Preguntas?

Si algo no funciona:
1. Verifica que tienes la carpeta anterior correcta
2. Cierra Chrome mientras ejecutas el script
3. Asegúrate de tener conexión a internet
4. Reporta el error en GitHub
