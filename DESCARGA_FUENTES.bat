@echo off
REM Script para descargar automáticamente todas las fuentes
REM Simplemente haz doble-click en este archivo

echo ========================================
echo Descargando fuentes para Lumina Tab...
echo ========================================
echo.

REM Ejecutar el script PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0descarga-fuentes-automatico.ps1"

pause
