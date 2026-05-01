@echo off
REM Script para extraer todos los ZIP y renombrar los archivos .woff2

echo ========================================
echo Extrayendo fuentes...
echo ========================================
echo.

cd /d "%~dp0fonts"

REM Crear carpeta temporal
mkdir _temp 2>nul

REM Extraer todos los ZIP a carpeta temporal
echo Extrayendo archivos...
for %%F in (*.zip) do (
    echo  - %%F
    powershell -Command "Expand-Archive -Path '%%F' -DestinationPath '_temp\%%~nF' -Force" 2>nul
)

echo.
echo Buscando archivos .woff2...
echo.

REM Mapeo de nombres (ZIP name -> archivo final)
REM Nota: Los nombres pueden variar, pero buscaremos todos los .woff2

REM Clock fonts
call :extract_font "_temp" "*Oswald*" "oswald.woff2"
call :extract_font "_temp" "*Bebas*" "bebas-neue.woff2"
call :extract_font "_temp" "*Playfair*" "playfair-display.woff2"
call :extract_font "_temp" "*DM Serif*" "dm-serif-display.woff2"
call :extract_font "_temp" "*Cormorant*" "cormorant-garamond.woff2"
call :extract_font "_temp" "*Righteous*" "righteous.woff2"
call :extract_font "_temp" "*Abril*" "abril-fatface.woff2"
call :extract_font "_temp" "*Josefin*" "josefin-sans.woff2"
call :extract_font "_temp" "*Cinzel*" "cinzel.woff2"
call :extract_font "_temp" "*Major*" "major-mono-display.woff2"

REM Greeting fonts
call :extract_font "_temp" "*Lora*" "lora.woff2"
call :extract_font "_temp" "*Raleway*" "raleway.woff2"
call :extract_font "_temp" "*Nunito*" "nunito.woff2"
call :extract_font "_temp" "*Quicksand*" "quicksand.woff2"
call :extract_font "_temp" "*Jost*" "jost.woff2"
call :extract_font "_temp" "*Outfit*" "outfit.woff2"
call :extract_font "_temp" "*DM Sans*" "dm-sans.woff2"
call :extract_font "_temp" "*Syne*" "syne.woff2"
call :extract_font "_temp" "*Figtree*" "figtree.woff2"
call :extract_font "_temp" "*Plus*" "plus-jakarta-sans.woff2"

REM Limpiar
echo.
echo Limpiando archivos temporales...
rmdir /s /q _temp 2>nul
del *.zip 2>nul

echo.
echo ========================================
echo Archivos .woff2 en la carpeta:
echo ========================================
dir *.woff2 /b 2>nul

echo.
echo LISTO! Los archivos estan listos.
echo.
echo PROXIMOS PASOS:
echo 1. Cierra este programa
echo 2. Ve a chrome://extensions
echo 3. Recarga "Lumina Tab"
echo 4. Abre nueva pestana
echo 5. Settings (engranaje) > Personalizar Fuentes
echo.

pause
goto :eof

:extract_font
REM Busca y copia el primer .woff2 encontrado
for /r "%~1" %%A in (%~2*.woff2) do (
    if exist "%%A" (
        copy /y "%%A" "%~3" >nul
        echo  + %~3
        goto :eof
    )
)
echo  - %~3 (NO ENCONTRADO)
goto :eof
