import os
import requests

# Configuración de ruta y lista de fuentes
DEST_FOLDER = r"D:\antigravity proyects\chrome modificado\fonts"
FONTS_LIST = [
    "Oswald", "Bebas Neue", "Playfair Display", "DM Serif Display", "Cormorant Garamond",
    "Righteous", "Abril Fatface", "Josefin Sans", "Cinzel", "Major Mono Display",
    "Lora", "Raleway", "Nunito", "Quicksand", "Jost", 
    "Outfit", "DM Sans", "Syne", "Figtree", "Plus Jakarta Sans"
]

def download_fonts():
    if not os.path.exists(DEST_FOLDER):
        os.makedirs(DEST_FOLDER)
        print(f"Carpeta creada: {DEST_FOLDER}")

    for font_name in FONTS_LIST:
        # Formatear nombre para el archivo (minúsculas y guiones)
        file_name = font_name.lower().replace(" ", "-") + ".ttf"
        save_path = os.path.join(DEST_FOLDER, file_name)
        
        # URL de descarga directa (simulando búsqueda de Google Fonts)
        # Nota: Google Fonts API prefiere archivos individuales mediante CSS, 
        # aquí usamos el repositorio oficial de GitHub de Google Fonts para descarga directa.
        search_name = font_name.replace(" ", "")
        download_url = f"https://github.com/google/fonts/raw/main/ofl/{search_name.lower()}/{font_name.replace(' ', '')}[wght].ttf"
        
        # Intento de descarga (algunas fuentes no tienen [wght] en el nombre del archivo)
        try:
            print(f"Descargando {font_name}...")
            # Alternativa simple: descargar desde la API de fuentes de Google (versión estática)
            fallback_url = f"https://fonts.google.com/download?family={font_name.replace(' ', '%20')}"
            
            response = requests.get(fallback_url)
            
            if response.status_code == 200:
                # El enlace anterior descarga un ZIP. Para simplificar y obtener solo el archivo,
                # guardaremos el ZIP temporalmente o puedes usar la URL de la API directamente.
                with open(os.path.join(DEST_FOLDER, f"{file_name}.zip"), "wb") as f:
                    f.write(response.content)
                print(f"✅ {font_name} descargada (en .zip)")
            else:
                print(f"❌ No se pudo descargar {font_name}")
                
        except Exception as e:
            print(f"Error con {font_name}: {e}")

if __name__ == "__main__":
    download_fonts()
    print("\n--- Proceso finalizado ---")
    print(f"Revisa tu carpeta: {DEST_FOLDER}")