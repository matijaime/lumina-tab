@echo off
REM Este script abre Chrome con los links de descarga de cada fuente
REM Solo tienes que descargar cada una!

echo Abriendo descargas de fuentes...
echo.

REM Links de Google Fonts - se abriran en Chrome
REM Cada link abre la pagina de descarga de cada fuente

start chrome "https://fonts.google.com/download?family=Oswald"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Bebas+Neue"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Playfair+Display"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=DM+Serif+Display"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Cormorant+Garamond"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Righteous"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Abril+Fatface"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Josefin+Sans"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Cinzel"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Major+Mono+Display"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Lora"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Raleway"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Nunito"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Quicksand"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Jost"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Outfit"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=DM+Sans"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Syne"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Figtree"
timeout /t 1 >nul
start chrome "https://fonts.google.com/download?family=Plus+Jakarta+Sans"

echo.
echo Se abrieron todas las descargas en Chrome
echo.
echo Pasos:
echo 1. Click en Download en cada pestana
echo 2. Extrae cada ZIP
echo 3. Busca el archivo .woff2 (no .ttf)
echo 4. Copia a la carpeta "fonts" de la extension
echo 5. Renombra segun la lista en GET_REAL_FONTS.md
echo 6. Recarga chrome://extensions
echo.
echo Alternativamente, usa:
echo https://google-webfonts-helper.herokuapp.com/fonts
echo.
pause
