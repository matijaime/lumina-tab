# Guía de Actualizaciones - Lumina Tab

## ¿Cómo actualizar sin perder datos?

### 📱 Si instalaste la extensión desde el archivo (.crx)

1. **Descarga la última versión** desde GitHub o recibe el archivo actualizado
2. **Desinstala la extensión anterior**:
   - Ve a `chrome://extensions/`
   - Busca "Lumina Tab"
   - Haz clic en "Eliminar"
3. **Instala la nueva versión**:
   - Abre la nueva carpeta de la extensión
   - Ve a `chrome://extensions/`
   - Activa el "Modo de desarrollador" (arriba a la derecha)
   - Haz clic en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta de la extensión

**✅ Tus datos se conservan automáticamente:**
- ✓ Nombre personalizado
- ✓ Fondos guardados
- ✓ Shortcuts del dock
- ✓ Fuentes seleccionadas
- ✓ Configuración de hora (12h/24h)
- ✓ Datos del clima guardados

### 🔄 Cómo actualizar desde GitHub

```bash
# Clona el repositorio
git clone https://github.com/matijaime/lumina-tab.git

# O actualiza si ya lo tienes clonado
cd lumina-tab
git pull origin main
```

Luego repite los pasos 2-3 arriba.

## ⚙️ Qué se guarda automáticamente

Lumina Tab almacena TODO en `localStorage`, que **persiste automáticamente** entre actualizaciones:

| Dato | Clave localStorage | Se guarda |
|------|-------------------|----------|
| Nombre personalizado | `lum_name` | ✅ |
| Formato hora (12h/24h) | `lum_24h` | ✅ |
| Blur del fondo | `lum_blur` | ✅ |
| Imagen de fondo | `lum_bg` | ✅ |
| Shortcuts del dock | `lum_dock` | ✅ |
| Fuente del reloj | `lum_font_clock` | ✅ |
| Fuente del saludo | `lum_font_greeting` | ✅ |
| Datos del clima | `lum_w` | ✅ |

**Nota importante**: Chrome **NUNCA borra localStorage automáticamente** cuando actualizas una extensión. Tus datos estarán ahí aunque desinstales y reinstales.

## 🚨 Si pierdes datos accidentalmente

Si por alguna razón pierdes tus datos:

1. **Abre la consola de desarrollador** en la nueva pestaña:
   - Presiona `F12` o `Ctrl+Shift+I`
   - Ve a la pestaña "Console"
   
2. **Revisa qué datos tienes**:
   ```javascript
   JSON.stringify(localStorage)
   ```

3. **Si necesitas restaurar**, exporta tus datos antes de actualizar:
   - Ve a `chrome://extensions/`
   - Abre la consola de developer tools
   - Ejecuta: `JSON.stringify(localStorage)` y cópialo

## 📝 Cambios en v1.1.0

- ✨ Código optimizado y más rápido
- 🎯 Menos redundancia en event listeners
- 💾 Sistema de almacenamiento mejorado
- 🔄 Actualizaciones más limpias sin pérdida de datos

## ❓ ¿Preguntas?

Si algo no funciona:
1. Limpia el caché: `Ctrl+Shift+Delete` en la nueva pestaña
2. Abre DevTools (`F12`) y revisa la consola
3. Reporta el error en GitHub con un screenshot
