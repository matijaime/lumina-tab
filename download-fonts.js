#!/usr/bin/env node

/**
 * Download Google Fonts as .woff2 files
 * Usage: node download-fonts.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const fonts = [
  'Oswald',
  'Bebas Neue',
  'Playfair Display',
  'DM Serif Display',
  'Cormorant Garamond',
  'Righteous',
  'Abril Fatface',
  'Josefin Sans',
  'Cinzel',
  'Major Mono Display',
  'Lora',
  'Raleway',
  'Nunito',
  'Quicksand',
  'Jost',
  'Outfit',
  'DM Sans',
  'Syne',
  'Figtree',
  'Plus Jakarta Sans'
];

const fontsDir = path.join(__dirname, 'fonts');

// Create fonts directory if it doesn't exist
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
  console.log(`Created directory: ${fontsDir}`);
}

// Convert font name to filename
function toFileName(fontName) {
  return fontName.toLowerCase().replace(/\s+/g, '-');
}

// Download font from Google Fonts
function downloadFont(fontName) {
  return new Promise((resolve, reject) => {
    const fontFamily = fontName.replace(/\s+/g, '+');
    const url = `https://fonts.googleapis.com/css2?family=${fontFamily}:300,400,500,600,700&display=swap`;

    console.log(`Fetching metadata for: ${fontName}`);

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Extract woff2 URLs from CSS
        const woff2Regex = /url\(([^)]*\.woff2)\)/g;
        const matches = [...data.matchAll(woff2Regex)];

        if (matches.length === 0) {
          console.warn(`No woff2 files found for: ${fontName}`);
          resolve();
          return;
        }

        // Download the first variant (regular weight)
        const fontUrl = matches[0][1];
        const fileName = toFileName(fontName);
        const filePath = path.join(fontsDir, `${fileName}.woff2`);

        console.log(`Downloading: ${fontName} from ${fontUrl}`);

        https.get(fontUrl, (res) => {
          const file = fs.createWriteStream(filePath);
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${fileName}.woff2`);
            resolve();
          });
          file.on('error', reject);
        }).on('error', reject);
      });
    }).on('error', reject);
  });
}

// Download all fonts
async function downloadAllFonts() {
  console.log('Starting font downloads...\n');

  for (const font of fonts) {
    try {
      await downloadFont(font);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error downloading ${font}:`, error.message);
    }
  }

  console.log('\n✓ Font download complete!');
}

downloadAllFonts();
