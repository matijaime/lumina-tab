# ============================================
# LUMINA TAB - Script de Actualizacion Automatica
# ============================================

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ACTUALIZADOR - Lumina Tab Extension     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# 1. Pedir la ruta de la carpeta anterior
Write-Host "Donde esta tu carpeta anterior de la extension?" -ForegroundColor Yellow
Write-Host "(Ejemplo: D:\antigravity proyects\chrome modificado)" -ForegroundColor Gray
$oldPath = Read-Host "Ruta"

# Validar que exista
if (-not (Test-Path $oldPath)) {
    Write-Host "`nError: La carpeta no existe en: $oldPath" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ Carpeta encontrada: $oldPath" -ForegroundColor Green

# 2. Crear backup de localStorage (en un archivo temporal)
Write-Host "`nBuscando datos guardados (localStorage)..." -ForegroundColor Yellow
$backupFile = "$env:TEMP\lumina-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"

# Copiar archivos de configuración que pueda haber
$configFiles = @(
    "newtab.html",
    "newtab.js",
    "newtab.css",
    "manifest.json"
)

Write-Host "Archivos de configuracion a restaurar:" -ForegroundColor Yellow
foreach ($file in $configFiles) {
    if (Test-Path (Join-Path $oldPath $file)) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    }
}

# 3. Descargar la version nueva desde GitHub
Write-Host "`nDescargando version nueva desde GitHub..." -ForegroundColor Yellow

$tempDir = Join-Path $env:TEMP "lumina-tab-temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force | Out-Null
}

# Intentar clonar con git primero
$gitAvailable = $null -ne (Get-Command git -ErrorAction SilentlyContinue)

if ($gitAvailable) {
    Write-Host "Usando git para descargar..." -ForegroundColor Cyan
    git clone https://github.com/matijaime/lumina-tab.git $tempDir 2>&1 | Out-Null

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Git fall. Intentando descarga manual..." -ForegroundColor Yellow
        $gitAvailable = $false
    }
}

# Si git no funciona, descargar ZIP
if (-not $gitAvailable) {
    Write-Host "Descargando archivo ZIP desde GitHub..." -ForegroundColor Cyan
    $zipUrl = "https://github.com/matijaime/lumina-tab/archive/refs/heads/main.zip"
    $zipPath = Join-Path $env:TEMP "lumina-tab-main.zip"

    try {
        # Descargar ZIP
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -ErrorAction Stop
        Write-Host "✓ ZIP descargado" -ForegroundColor Green

        # Extraer
        Expand-Archive -Path $zipPath -DestinationPath $tempDir -ErrorAction Stop
        Write-Host "✓ ZIP extraido" -ForegroundColor Green

        # Mover contenido (el ZIP tiene una carpeta raiz)
        $extracted = Get-ChildItem $tempDir | Select-Object -First 1
        if ($extracted.PSIsContainer) {
            $source = $extracted.FullName
            $tempDir2 = Join-Path $env:TEMP "lumina-tab-temp2"
            Move-Item $source $tempDir2 -Force
            Remove-Item $tempDir -Recurse -Force
            Rename-Item $tempDir2 $tempDir
        }

        # Limpiar ZIP
        Remove-Item $zipPath -Force
    } catch {
        Write-Host "`nError descargando desde GitHub: $_" -ForegroundColor Red
        Write-Host "Verifica tu conexion a internet" -ForegroundColor Yellow
        exit 1
    }
}

if (-not (Test-Path (Join-Path $tempDir "manifest.json"))) {
    Write-Host "`nError: No se encontro manifest.json en la descarga" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Version nueva descargada correctamente" -ForegroundColor Green

# 4. Respaldar datos (aunque no hay datos sensibles en este caso)
Write-Host "`nRespaldando archivos originales..." -ForegroundColor Yellow
$backupDir = Join-Path (Split-Path $oldPath) "lumina-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $oldPath $backupDir -Recurse -Force | Out-Null
Write-Host "✓ Respaldo creado en: $backupDir" -ForegroundColor Green

# 5. Limpiar la carpeta anterior (excepto la carpeta fonts si quieres conservarla)
Write-Host "`nLimpiando carpeta anterior..." -ForegroundColor Yellow
$itemsToDelete = @(
    "*.js",
    "*.css",
    "*.html",
    "*.json",
    "background.js",
    "font-loader.js"
)

foreach ($pattern in $itemsToDelete) {
    Get-Item "$oldPath\$pattern" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
}

# Borrar carpetas helper pero mantener fonts
Get-Item "$oldPath\icons" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✓ Carpeta limpiada" -ForegroundColor Green

# 6. Copiar archivos nuevos (excepto .git, .gitignore, y docs)
Write-Host "`nCopiar archivos nuevos..." -ForegroundColor Yellow

$excludePatterns = @(".git", ".gitignore", "*.md", "*.txt", "ACTUALIZACIONES*", "README*", ".github")

Get-ChildItem $tempDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Substring($tempDir.Length + 1)

    # Saltar archivos excluidos
    $skip = $false
    foreach ($exclude in $excludePatterns) {
        if ($relativePath -like "*$exclude*") {
            $skip = $true
            break
        }
    }

    if (-not $skip) {
        $targetPath = Join-Path $oldPath $relativePath

        if ($_.PSIsContainer) {
            if (-not (Test-Path $targetPath)) {
                New-Item $targetPath -ItemType Directory -Force | Out-Null
            }
        } else {
            $targetDir = Split-Path $targetPath
            if (-not (Test-Path $targetDir)) {
                New-Item $targetDir -ItemType Directory -Force | Out-Null
            }
            Copy-Item $_.FullName $targetPath -Force | Out-Null
        }
    }
}

Write-Host "✓ Archivos nuevos copiados" -ForegroundColor Green

# 7. Limpiar temp
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

# 8. Mostrar resumen
Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ACTUALIZACION COMPLETADA!                ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`nProximos pasos:" -ForegroundColor Yellow
Write-Host "1. Abre Chrome" -ForegroundColor Cyan
Write-Host "2. Ve a chrome://extensions/" -ForegroundColor Cyan
Write-Host "3. Busca 'Lumina Tab'" -ForegroundColor Cyan
Write-Host "4. Haz clic en el icono de recarga" -ForegroundColor Cyan
Write-Host "5. Abre una nueva pestana para ver los cambios" -ForegroundColor Cyan

Write-Host "`nTus datos guardados se conservan automaticamente:" -ForegroundColor Green
Write-Host "  ✓ Nombre personalizado" -ForegroundColor Green
Write-Host "  ✓ Fondos de pantalla" -ForegroundColor Green
Write-Host "  ✓ Shortcuts del dock" -ForegroundColor Green
Write-Host "  ✓ Fuentes seleccionadas" -ForegroundColor Green
Write-Host "  ✓ Configuracion de hora" -ForegroundColor Green

Write-Host "`nRespaldo de la version anterior:" -ForegroundColor Yellow
Write-Host "  $backupDir" -ForegroundColor Gray

Write-Host "`n✓ Listo para usar!" -ForegroundColor Green
Write-Host ""

# Pausa para que el usuario vea el mensaje
Read-Host "Presiona Enter para cerrar"
