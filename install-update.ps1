# Lumina Tab - Update Script (downloadable via iex)

Write-Host "`n╔═══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  LUMINA TAB - ACTUALIZADOR           ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════╝`n" -ForegroundColor Cyan

$oldPath = Read-Host "Ruta de tu carpeta anterior (D:\antigravity proyects\chrome modificado)"
if (-not (Test-Path $oldPath)) {
    Write-Host "`nError: Carpeta no existe en: $oldPath" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Carpeta encontrada" -ForegroundColor Green

$tempDir = Join-Path $env:TEMP "lumina-tab-temp"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }

# Try git first
$gitOk = $null -ne (Get-Command git -ErrorAction SilentlyContinue)
if ($gitOk) {
    Write-Host "`nDescargando con git..." -ForegroundColor Yellow
    git clone https://github.com/matijaime/lumina-tab.git $tempDir 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { $gitOk = $false }
}

# Fallback to ZIP
if (-not $gitOk) {
    Write-Host "Descargando ZIP desde GitHub..." -ForegroundColor Yellow
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $zip = Join-Path $env:TEMP "lumina.zip"

    try {
        Invoke-WebRequest -Uri "https://github.com/matijaime/lumina-tab/archive/refs/heads/main.zip" -OutFile $zip -ErrorAction Stop
        Expand-Archive -Path $zip -DestinationPath $tempDir -ErrorAction Stop

        $extracted = Get-ChildItem $tempDir | Select-Object -First 1
        if ($extracted.PSIsContainer) {
            $t2 = Join-Path $env:TEMP "lumina-temp2"
            Move-Item $extracted.FullName $t2 -Force
            Remove-Item $tempDir -Recurse -Force
            Rename-Item $t2 $tempDir
        }

        Remove-Item $zip -Force
        Write-Host "✓ Descargado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "`nError descargando: $_" -ForegroundColor Red
        exit 1
    }
}

# Backup
Write-Host "Respaldando versión anterior..." -ForegroundColor Yellow
$backupDir = Join-Path (Split-Path $oldPath) "lumina-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $oldPath $backupDir -Recurse -Force | Out-Null
Write-Host "✓ Respaldo: $backupDir" -ForegroundColor Green

# Clean old files
Write-Host "Limpiando archivos anteriores..." -ForegroundColor Yellow
Get-Item "$oldPath\*.js", "$oldPath\*.css", "$oldPath\*.html", "$oldPath\*.json" -ErrorAction SilentlyContinue | Remove-Item -Force
Get-Item "$oldPath\icons" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force

# Copy new files
Write-Host "Instalando archivos nuevos..." -ForegroundColor Yellow
Get-ChildItem $tempDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Substring($tempDir.Length + 1)

    $skip = $false
    foreach ($exclude in @(".git", ".gitignore", "*.md", "*.txt", "README", ".github")) {
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

Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n╔═══════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ACTUALIZACIÓN COMPLETADA!           ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`nProximos pasos:" -ForegroundColor Yellow
Write-Host "1. Abre Chrome" -ForegroundColor White
Write-Host "2. Ve a: chrome://extensions/" -ForegroundColor White
Write-Host "3. Busca 'Lumina Tab'" -ForegroundColor White
Write-Host "4. Haz clic en el icono de recarga (circular)" -ForegroundColor White
Write-Host "5. Abre una NUEVA pestaña" -ForegroundColor White

Write-Host "`nTus datos se conservan automaticamente:" -ForegroundColor Green
Write-Host "  ✓ Nombre, fondos, shortcuts, fuentes, config" -ForegroundColor Green

Write-Host ""
Read-Host "Presiona Enter para cerrar"
