/**
 * Font Loader - Detects if fonts are available and provides user feedback
 * If fonts are not found, displays a helpful message
 */

(function() {
  'use strict';

  const REQUIRED_FONTS = [
    'Oswald', 'Bebas Neue', 'Playfair Display', 'DM Serif Display',
    'Cormorant Garamond', 'Righteous', 'Abril Fatface', 'Josefin Sans',
    'Cinzel', 'Major Mono Display', 'Lora', 'Raleway', 'Nunito',
    'Quicksand', 'Jost', 'Outfit', 'DM Sans', 'Syne', 'Figtree',
    'Plus Jakarta Sans'
  ];

  /**
   * Check if a font is loaded using canvas test
   */
  function isFontLoaded(fontName) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const text = 'Test';
    const baseline = 30;

    // Fallback font
    ctx.font = `20px sans-serif`;
    ctx.fillText(text, 0, baseline);
    const fallbackData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Test font
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `20px "${fontName}", sans-serif`;
    ctx.fillText(text, 0, baseline);
    const testData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Compare (fonts render differently)
    return !arraysEqual(fallbackData, testData);
  }

  function arraysEqual(a, b) {
    for (let i = 0; i < Math.min(a.length, b.length); i += 4) {
      if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) {
        return false;
      }
    }
    return true;
  }

  // Check fonts after page load
  window.addEventListener('load', () => {
    // Give fonts time to load
    setTimeout(() => {
      const missingFonts = REQUIRED_FONTS.filter(f => !isFontLoaded(f));

      if (missingFonts.length > 0) {
        console.warn(
          'Custom fonts not found. Download them for better appearance:\n' +
          'Run: python3 download_fonts.py\n' +
          'Or see: FONTS_SETUP.md'
        );

        // Optional: Show a subtle notification (commented out to avoid UI clutter)
        // const note = document.createElement('div');
        // note.style.cssText = `
        //   position: fixed; top: 10px; right: 10px; z-index: 999;
        //   background: rgba(0,0,0,0.8); color: white; padding: 12px;
        //   border-radius: 8px; font-size: 12px; max-width: 300px;
        // `;
        // note.textContent = '💡 Custom fonts not found. Run "python3 download_fonts.py"';
        // document.body.appendChild(note);
      } else {
        console.log('✓ All custom fonts loaded successfully!');
      }
    }, 2000);
  });
})();
