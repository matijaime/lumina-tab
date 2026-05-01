# 📥 Descargar Fuentes Reales

He creado **archivos placeholder** (42 bytes cada uno) para que la extensión funcione sin errores 404. 

Para obtener las **fuentes reales**, elige una opción:

## ✅ Opción 1: Descargar Manualmente (Más Fácil)

### En Windows:
1. Visita https://fonts.google.com
2. Busca cada fuente (Oswald, Raleway, etc.)
3. Click en "Download"
4. Extrae el .zip
5. Busca archivo `.woff2` (no .ttf)
6. Cópialo a `/fonts/` carpeta (reemplaza placeholder)

**Ejemplo:**
```
Downloads/Oswald/Oswald-Regular.woff2 
→ Copy to → extension/fonts/oswald.woff2
```

### En Mac/Linux:
```bash
# Visita https://fonts.google.com/download?family=Oswald
# Descarga → Extrae → Encuentra .woff2
# Copia a fonts/ carpeta
```

---

## ✅ Opción 2: Usar Google Webfonts Helper (Recomendado)

1. Abre: https://google-webfonts-helper.herokuapp.com/fonts
2. **Busca cada fuente** de la lista abajo
3. Selecciona los estilos que quieras (regular/400 es suficiente)
4. Click en "Download files"
5. Extrae los .woff2 files
6. Renombra a nombres correctos (ver tabla)
7. Copia a `/fonts/` carpeta

---

## 📋 Lista de Fuentes a Descargar

### Fuentes del Reloj (10 fonts)

| Nombre | Filename |
|--------|----------|
| Oswald | `oswald.woff2` |
| Bebas Neue | `bebas-neue.woff2` |
| Playfair Display | `playfair-display.woff2` |
| DM Serif Display | `dm-serif-display.woff2` |
| Cormorant Garamond | `cormorant-garamond.woff2` |
| Righteous | `righteous.woff2` |
| Abril Fatface | `abril-fatface.woff2` |
| Josefin Sans | `josefin-sans.woff2` |
| Cinzel | `cinzel.woff2` |
| Major Mono Display | `major-mono-display.woff2` |

### Fuentes del Saludo/Fecha (10 fonts)

| Nombre | Filename |
|--------|----------|
| Lora | `lora.woff2` |
| Raleway | `raleway.woff2` |
| Nunito | `nunito.woff2` |
| Quicksand | `quicksand.woff2` |
| Jost | `jost.woff2` |
| Outfit | `outfit.woff2` |
| DM Sans | `dm-sans.woff2` |
| Syne | `syne.woff2` |
| Figtree | `figtree.woff2` |
| Plus Jakarta Sans | `plus-jakarta-sans.woff2` |

---

## 🎯 Pasos Finales

Una vez descargues las fuentes:

1. Reemplaza los archivos en `/fonts/` 
   - Borra placeholder → Copia verdadero .woff2
   
2. Recarga la extensión
   - Chrome: `chrome://extensions`
   - Busca "Lumina Tab"
   - Click en refresh icon ⟳

3. Abre nueva pestaña → Settings → "Personalizar Fuentes"
   - ¡Las fuentes reales ahora debería aparecer!

---

## 💡 Pro Tips

- Solo necesitas **descarga 1 fuente** para probar - replica el proceso para las demás
- **Quicksand** y **Raleway** son las más visuales - empieza por esas
- Si una fuente no se ve bien, puede ser que falte un weight específico (300, 400, 700)
- Los archivos deben ser **.woff2** (no .ttf, .otf, etc.)

---

## 🔧 Solución de Problemas

### "La fuente sigue sin aparecer"
- Verifica que el archivo en `/fonts/` sea > 5 KB
- El placeholder es ~42 bytes - asegúrate de reemplazarlo
- Recarga la extensión en chrome://extensions

### "El archivo .woff2 se ve muy grande"
- Normal, pueden ser 30-500 KB cada uno
- Si es > 1 MB, quizás descargaste el archivo completo con todos los weights

### "¿Puedo usar otras fuentes?"
- ¡Sí! Descarga cualquier .woff2
- Guarda con nombre único en `/fonts/`
- Actualiza `newtab.js` para agregarla a las listas

---

**¿Preguntas?** Lee `README_FONTS.md` para detalles técnicos.
