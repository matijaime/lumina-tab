#!/usr/bin/env python3
"""
Download Google Fonts as .woff2 files for offline use.
"""

import os
import urllib.request
import urllib.error
import time
import json

# Create fonts directory
fonts_dir = os.path.join(os.path.dirname(__file__), 'fonts')
os.makedirs(fonts_dir, exist_ok=True)

fonts = {
    # Clock fonts
    'Oswald': 'oswald',
    'Bebas Neue': 'bebas-neue',
    'Playfair Display': 'playfair-display',
    'DM Serif Display': 'dm-serif-display',
    'Cormorant Garamond': 'cormorant-garamond',
    'Righteous': 'righteous',
    'Abril Fatface': 'abril-fatface',
    'Josefin Sans': 'josefin-sans',
    'Cinzel': 'cinzel',
    'Major Mono Display': 'major-mono-display',
    # Greeting/Date fonts
    'Lora': 'lora',
    'Raleway': 'raleway',
    'Nunito': 'nunito',
    'Quicksand': 'quicksand',
    'Jost': 'jost',
    'Outfit': 'outfit',
    'DM Sans': 'dm-sans',
    'Syne': 'syne',
    'Figtree': 'figtree',
    'Plus Jakarta Sans': 'plus-jakarta-sans',
}

def download_font(font_name, file_name):
    """Download font from various sources."""

    print(f"Downloading: {font_name}")

    # Direct links to fonts (from fonts.google.com)
    direct_urls = {
        'oswald': 'https://fonts.gstatic.com/s/oswald/v52/TK3_WkUVqA0sngYjU3S0BQ.woff2',
        'bebas-neue': 'https://fonts.gstatic.com/s/bebas neue/v15/JTUSjIg1_i6t8kCHKm45_dJE.woff2',
        'playfair-display': 'https://fonts.gstatic.com/s/playfairdisplay/v21/nuFnD-_b08L-28M9hxHsFVtIUwhw.woff2',
        'dm-serif-display': 'https://fonts.gstatic.com/s/dmserifidisplay/v12/PN8dRfZbJg-Cwk9vcM3SYAjKf25qN4W-.woff2',
        'cormorant-garamond': 'https://fonts.gstatic.com/s/cormorantgaramond/v21/CMY1_c8HoYz064SfNc-8xRYkLg.woff2',
        'righteous': 'https://fonts.gstatic.com/s/righteous/v12/1cXxaUPXBYZkwMjnqKd8dA.woff2',
        'abril-fatface': 'https://fonts.gstatic.com/s/abrilfatface/v15/aFT57_ft1mYtbR7eCH-vn0EAI.woff2',
        'josefin-sans': 'https://fonts.gstatic.com/s/josephinsans/v32/Qw3EZHSR2At6N9S0BH-kpQ.woff2',
        'cinzel': 'https://fonts.gstatic.com/s/cinzel/v21/wXLqE3kVhMzA-FhWEekKVHY.woff2',
        'major-mono-display': 'https://fonts.gstatic.com/s/majormonodisplay/v12/RrQfboBx-C4GIPy-eEwmPQ.woff2',
        'lora': 'https://fonts.gstatic.com/s/lora/v23/0ybkGK0reIJYe-dsDtUUVQ.woff2',
        'raleway': 'https://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKhf_mBXSsBQ.woff2',
        'nunito': 'https://fonts.gstatic.com/s/nunito/v26/XRXV3I6Li01BKofINeaBTQ.woff2',
        'quicksand': 'https://fonts.gstatic.com/s/quicksand/v30/6xK-dSZuqHylqKn-aH-G.woff2',
        'jost': 'https://fonts.gstatic.com/s/jost/v14/92zptN5csFZl9eujBPQ.woff2',
        'outfit': 'https://fonts.gstatic.com/s/outfit/v11/QGYpz_wNahGAdqQ43RhVcHg.woff2',
        'dm-sans': 'https://fonts.gstatic.com/s/dmsans/v11/rtemDme0l3jL_XYi9f_f7g.woff2',
        'syne': 'https://fonts.gstatic.com/s/syne/v10/8vIS7wpfaC1iNrWU.woff2',
        'figtree': 'https://fonts.gstatic.com/s/figtree/v12/I_ufJcu8wWL-rVYjIhTFQ8w.woff2',
        'plus-jakarta-sans': 'https://fonts.gstatic.com/s/plusjakartasans/v8/tLK-JIVfA6xkfDjwEzSkGR-OA5.woff2',
    }

    file_path = os.path.join(fonts_dir, f'{file_name}.woff2')

    # Skip if already downloaded
    if os.path.exists(file_path):
        size = os.path.getsize(file_path)
        if size > 1000:
            print(f"  [OK] Already exists: {file_name}.woff2 ({size} bytes)")
            return True

    # Get URL for this font
    url = direct_urls.get(file_name)
    if not url:
        print(f"  [SKIP] No URL found for {font_name}")
        return False

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    try:
        print(f"  Getting: {url}")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read()
            if len(data) > 500:
                with open(file_path, 'wb') as f:
                    f.write(data)
                print(f"  [OK] {file_name}.woff2 ({len(data)} bytes)")
                return True
            else:
                print(f"  [ERROR] Downloaded file too small")
                return False
    except Exception as e:
        print(f"  [ERROR] {type(e).__name__}: {str(e)}")
        return False

print("Starting font downloads...")
print("")

success_count = 0
for font_name, file_name in fonts.items():
    if download_font(font_name, file_name):
        success_count += 1
    time.sleep(0.2)

print("")
print("Complete! Downloaded: {}/{}".format(success_count, len(fonts)))
print("")

# List downloaded files
if os.path.exists(fonts_dir):
    files = sorted(os.listdir(fonts_dir))
    print("Files in fonts/:")
    for f in files:
        size = os.path.getsize(os.path.join(fonts_dir, f))
        print(f"  {f} ({size} bytes)")
