# Font Setup Instructions

## Problem
Chrome extensions have Content Security Policy (CSP) restrictions that prevent loading fonts from external sources like Google Fonts CDN. To use custom fonts, they must be bundled locally within the extension.

## Current Status
The font system is configured but requires downloading the .woff2 font files locally. Right now, the system uses **system font fallbacks** so the extension works, but custom fonts will not load until you add the files.

## How to Download Fonts

### Option 1: Automatic Download (Recommended)
We provide a Python script to download all fonts:

```bash
python3 download_fonts.py
```

This will download all 20 fonts to the `/fonts` folder automatically.

**Requirements:**
- Python 3.6+
- Internet connection
- About 5-10 MB of disk space

### Option 2: Manual Download
1. Visit https://fonts.google.com
2. Search for each font name below
3. Download the .woff2 file for each font
4. Save to the `/fonts` folder with the filename shown

**Clock Fonts:**
- Oswald → `fonts/oswald.woff2`
- Bebas Neue → `fonts/bebas-neue.woff2`
- Playfair Display → `fonts/playfair-display.woff2`
- DM Serif Display → `fonts/dm-serif-display.woff2`
- Cormorant Garamond → `fonts/cormorant-garamond.woff2`
- Righteous → `fonts/righteous.woff2`
- Abril Fatface → `fonts/abril-fatface.woff2`
- Josefin Sans → `fonts/josefin-sans.woff2`
- Cinzel → `fonts/cinzel.woff2`
- Major Mono Display → `fonts/major-mono-display.woff2`

**Greeting/Date Fonts:**
- Lora → `fonts/lora.woff2`
- Raleway → `fonts/raleway.woff2`
- Nunito → `fonts/nunito.woff2`
- Quicksand → `fonts/quicksand.woff2`
- Jost → `fonts/jost.woff2`
- Outfit → `fonts/outfit.woff2`
- DM Sans → `fonts/dm-sans.woff2`
- Syne → `fonts/syne.woff2`
- Figtree → `fonts/figtree.woff2`
- Plus Jakarta Sans → `fonts/plus-jakarta-sans.woff2`

### Option 3: Online Font Downloader
Use https://savefont.com or similar services to download from Google Fonts and save to `/fonts` folder.

## Troubleshooting

**Q: The font picker still shows all fonts but they don't display?**  
A: The fonts are still loading from system fallbacks. Download the .woff2 files to the `/fonts` folder to enable the custom fonts.

**Q: Can I use different fonts?**  
A: Yes! Download any .woff2 file and save it to `/fonts` with the correct name, then add it to the font lists in `newtab.js`.

**Q: The extension isn't loading fonts at all?**  
A: Check that:
1. Files are in `fonts/` folder (not subdirectories)
2. Files are named correctly (lowercase, with hyphens)
3. File extension is `.woff2`
4. Files are at least 1 KB in size

## Technical Details

The fonts are loaded via:
- `fonts.css` - Defines @font-face rules pointing to local files
- `fonts/` folder - Contains all .woff2 files
- `newtab.js` - Applies fonts dynamically

Once fonts are downloaded, they're cached locally and work offline.
