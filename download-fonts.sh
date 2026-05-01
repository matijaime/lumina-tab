#!/bin/bash

# Create fonts directory
mkdir -p fonts

echo "Downloading Google Fonts..."

# Function to download font
download_font() {
  local font_name=$1
  local font_family=$(echo "$font_name" | sed 's/ /+/g')
  local file_name=$(echo "$font_name" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')

  echo "Downloading: $font_name"

  # Fetch CSS to get woff2 URL
  css=$(curl -s "https://fonts.googleapis.com/css2?family=${font_family}:300,400,500,600,700&display=swap")

  # Extract woff2 URL (get the first one)
  woff2_url=$(echo "$css" | grep -oP 'https://[^)]+\.woff2' | head -1)

  if [ -z "$woff2_url" ]; then
    echo "  ⚠ No woff2 found for $font_name"
    return
  fi

  # Download the font
  curl -s "$woff2_url" -o "fonts/${file_name}.woff2"
  echo "  ✓ Downloaded: ${file_name}.woff2"
}

# Clock fonts
download_font "Oswald"
download_font "Bebas Neue"
download_font "Playfair Display"
download_font "DM Serif Display"
download_font "Cormorant Garamond"
download_font "Righteous"
download_font "Abril Fatface"
download_font "Josefin Sans"
download_font "Cinzel"
download_font "Major Mono Display"

# Greeting/Date fonts
download_font "Lora"
download_font "Raleway"
download_font "Nunito"
download_font "Quicksand"
download_font "Jost"
download_font "Outfit"
download_font "DM Sans"
download_font "Syne"
download_font "Figtree"
download_font "Plus Jakarta Sans"

echo ""
echo "✓ Font download complete!"
echo "All fonts are now available in the /fonts directory"
