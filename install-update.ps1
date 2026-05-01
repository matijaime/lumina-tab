param([string]$Path="")
$oldPath = if ($Path) { $Path } else { Read-Host "Ruta de tu carpeta anterior" }
if (-not (Test-Path $oldPath)) { Write-Host "Carpeta no existe" -ForegroundColor Red; exit 1 }
Write-Host "[OK] Carpeta encontrada`n" -ForegroundColor Green
$tempDir = Join-Path $env:TEMP "lumina-tab"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
$gitOk = $null -ne (Get-Command git -ErrorAction SilentlyContinue)
if ($gitOk) { git clone https://github.com/matijaime/lumina-tab.git $tempDir 2>&1 | Out-Null; if ($LASTEXITCODE -ne 0) { $gitOk = $false } }
if (-not $gitOk) { Write-Host "Descargando ZIP..." -ForegroundColor Yellow; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $zip = Join-Path $env:TEMP "lumina.zip"; Invoke-WebRequest -Uri "https://github.com/matijaime/lumina-tab/archive/refs/heads/main.zip" -OutFile $zip; Expand-Archive -Path $zip -DestinationPath $tempDir; $extracted = Get-ChildItem $tempDir | Select-Object -First 1; if ($extracted.PSIsContainer) { $t2 = Join-Path $env:TEMP "lumina-temp2"; Move-Item $extracted.FullName $t2 -Force; Remove-Item $tempDir -Recurse -Force; Rename-Item $t2 $tempDir }; Remove-Item $zip -Force; Write-Host "[OK] Descargado`n" -ForegroundColor Green }
Write-Host "Respaldando..." -ForegroundColor Yellow
$backup = Join-Path (Split-Path $oldPath) "lumina-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $oldPath $backup -Recurse -Force | Out-Null
Write-Host "[OK] Backup: $backup`n" -ForegroundColor Green
Write-Host "Limpiando y actualizando..." -ForegroundColor Yellow
Get-Item "$oldPath\*.js", "$oldPath\*.css", "$oldPath\*.html", "$oldPath\*.json" -ErrorAction SilentlyContinue | Remove-Item -Force
Get-Item "$oldPath\icons" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
Get-ChildItem $tempDir -Recurse | ForEach-Object { $rel = $_.FullName.Substring($tempDir.Length + 1); $skip = $false; foreach ($ex in @(".git", ".gitignore", "*.md", "README", ".github")) { if ($rel -like "*$ex*") { $skip = $true; break } }; if (-not $skip) { $target = Join-Path $oldPath $rel; if ($_.PSIsContainer) { if (-not (Test-Path $target)) { New-Item $target -ItemType Directory -Force | Out-Null } } else { $tdir = Split-Path $target; if (-not (Test-Path $tdir)) { New-Item $tdir -ItemType Directory -Force | Out-Null }; Copy-Item $_.FullName $target -Force } } }
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "`n[LISTO] Actualizacion completa!`n" -ForegroundColor Green
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "1. Abre Chrome" -ForegroundColor White
Write-Host "2. Ve a: chrome://extensions/" -ForegroundColor White
Write-Host "3. Busca 'Lumina Tab'" -ForegroundColor White
Write-Host "4. Haz clic en RECARGA" -ForegroundColor White
Write-Host "5. Abre una nueva pestana`n" -ForegroundColor White
Write-Host "Tus datos se conservan automaticamente!" -ForegroundColor Green
Read-Host "Presiona Enter para cerrar"
