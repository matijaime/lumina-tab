# Custom Fonts Setup Guide

## ⚠️ Important: Chrome Extension CSP Restrictions

Chrome extensions have strict Content Security Policy (CSP) that **prevents loading fonts from external CDNs** like Google Fonts CDN. To use custom fonts, they must be **bundled locally** within the extension.

## ✅ Current Status

Your extension is **fully configured** for custom fonts, but requires downloading the font files locally.

- ✅ Font picker UI is working
- ✅ Font storage system is ready
- ✅ CSS rules are configured
- ⚠️ **Font files need to be downloaded** (not in repo to save space)

## 🚀 Quick Start: Download Fonts

### Method 1: Automatic (Python 3.6+)

```bash
# In the extension folder, run:
python3 download_fonts.py
```

This will download all 20 fonts (~5-10 MB) to the `/fonts` folder.

### Method 2: Using a Font Downloader Website

1. Visit https://google-webfonts-helper.herokuapp.com/fonts
2. Search for each font name below
3. Download the .woff2 file
4. Save to the `/fonts` folder with the correct filename

### Method 3: Online Downloader Service

Use websites like https://savefont.com to download fonts from Google Fonts CDN.

## 📝 Complete Font List

Place all fonts in a `/fonts` folder in the extension root.

### Clock Fonts (Display/Impactful)
```
fonts/oswald.woff2
fonts/bebas-neue.woff2
fonts/playfair-display.woff2
fonts/dm-serif-display.woff2
fonts/cormorant-garamond.woff2
fonts/righteous.woff2
fonts/abril-fatface.woff2
fonts/josefin-sans.woff2
fonts/cinzel.woff2
fonts/major-mono-display.woff2
```

### Greeting/Date Fonts (Elegant/Readable)
```
fonts/lora.woff2
fonts/raleway.woff2
fonts/nunito.woff2
fonts/quicksand.woff2
fonts/jost.woff2
fonts/outfit.woff2
fonts/dm-sans.woff2
fonts/syne.woff2
fonts/figtree.woff2
fonts/plus-jakarta-sans.woff2
```

## 🔍 How It Works

1. **fonts.css** - Defines @font-face rules pointing to local `.woff2` files
2. **font-loader.js** - Detects if fonts are loaded and logs helpful messages
3. **newtab.js** - Applies fonts dynamically from localStorage
4. **/fonts folder** - Contains local .woff2 font files

### Font Selection Flow
```
User opens Settings → "Personalizar Fuentes" → 
Font Picker shows available fonts → 
User selects font → 
Saved to localStorage → 
Applied on next new tab
```

## ✨ Features

- **20 Google Fonts** included (clock + greeting categories)
- **Live preview** of each font before selecting
- **Persistent storage** - selections saved across sessions
- **Offline capable** - fonts work without internet after downloading
- **Mobile friendly** - responsive font picker UI
- **Dark mode** - matches extension aesthetic

## 🐛 Troubleshooting

### Fonts Not Appearing?

1. **Check browser console** (F12) for error messages
2. **Verify files exist**: `/fonts/` folder should contain `.woff2` files
3. **File naming**: Must be lowercase with hyphens (e.g., `playfair-display.woff2`)
4. **File size**: Each should be > 1 KB
5. **Run download script**: `python3 download_fonts.py`

### Font Picker Shows Fonts But They Don't Display?

- Fonts are loading from system fallbacks temporarily
- Download the .woff2 files to the `/fonts` folder
- Reload extension (Ctrl+Shift+R in extensions page)

### "Invalid selector" Error?

- This means fonts.css couldn't load the fonts
- Download and place all .woff2 files in `/fonts` folder
- Ensure filenames match exactly (lowercase, hyphens)

### Can I Use Different Fonts?

Yes! You can:
1. Download any .woff2 font file
2. Save to `/fonts` folder
3. Add @font-face rule to `fonts.css`
4. Add font name to lists in `newtab.js`

## 📦 File Structure

```
chrome-extension/
├── fonts/                    ← Font files go here
│   ├── oswald.woff2
│   ├── raleway.woff2
│   └── ... (18 more)
├── fonts.css                 ← @font-face definitions
├── font-loader.js            ← Detects loaded fonts
├── newtab.html              ← Main UI
├── newtab.js                ← Logic
├── newtab.css               ← Styles
├── FONTS_SETUP.md           ← This guide
└── download_fonts.py        ← Auto-downloader script
```

## 🎯 Next Steps

1. Run `python3 download_fonts.py` to download all fonts
2. Restart Chrome extension (reload in chrome://extensions)
3. Open a new tab
4. Go to Settings → "Personalizar Fuentes"
5. Select your favorite fonts!

## 📚 Resources

- Google Fonts: https://fonts.google.com
- Font Helper: https://google-webfonts-helper.herokuapp.com/
- WebFont Loader: https://github.com/typekit/webfontloader
- CSP Documentation: https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/

---

**Questions?** Check the browser console (F12) for helpful diagnostics. The `font-loader.js` script will report which fonts are missing.
