# 📋 Actualización por Copiar-Pegar (La forma más fácil)

## ⚡ Opción 1: Comando directo (SIN archivo)

### Paso 1: Abre PowerShell
- Click derecho en el escritorio
- "Terminal (Administrador)" o "Windows PowerShell (Administrador)"

### Paso 2: Copia este comando

```powershell
iex (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/matijaime/lumina-tab/main/install-update.ps1')
```

### Paso 3: Pega en PowerShell
- Click derecho en la ventana → Pegar
- O: `Ctrl + V`

### Paso 4: Presiona Enter
El script se descarga y ejecuta automáticamente ✅

---

## 📝 Opción 2: Copiar-Pegar el script completo

### Paso 1: Abre PowerShell como Admin

### Paso 2: Copia TODO esto y pégalo en PowerShell:

```powershell
$oldPath = Read-Host "Ruta de tu carpeta anterior (D:\...)"; if (-not (Test-Path $oldPath)) { Write-Host "Carpeta no existe" -ForegroundColor Red; exit }; Write-Host "OK: $oldPath" -ForegroundColor Green; $tempDir = Join-Path $env:TEMP "lumina-temp"; if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }; $gitOk = $null -ne (Get-Command git -ErrorAction SilentlyContinue); if ($gitOk) { git clone https://github.com/matijaime/lumina-tab.git $tempDir 2>&1 | Out-Null; if ($LASTEXITCODE -ne 0) { $gitOk = $false } }; if (-not $gitOk) { Write-Host "Descargando ZIP..." -ForegroundColor Cyan; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $zip = Join-Path $env:TEMP "lumina.zip"; Invoke-WebRequest -Uri "https://github.com/matijaime/lumina-tab/archive/refs/heads/main.zip" -OutFile $zip -ErrorAction Stop; Expand-Archive -Path $zip -DestinationPath $tempDir -ErrorAction Stop; $extracted = Get-ChildItem $tempDir | Select-Object -First 1; if ($extracted.PSIsContainer) { $t2 = Join-Path $env:TEMP "lumina-temp2"; Move-Item $extracted.FullName $t2 -Force; Remove-Item $tempDir -Recurse -Force; Rename-Item $t2 $tempDir }; Remove-Item $zip -Force }; Write-Host "Respaldando..." -ForegroundColor Yellow; $backup = Join-Path (Split-Path $oldPath) "lumina-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"; Copy-Item $oldPath $backup -Recurse -Force; Write-Host "OK: $backup" -ForegroundColor Green; Write-Host "Limpiando y actualizando..." -ForegroundColor Yellow; Get-Item "$oldPath\*.js", "$oldPath\*.css", "$oldPath\*.html", "$oldPath\*.json" -ErrorAction SilentlyContinue | Remove-Item -Force; Get-Item "$oldPath\icons" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force; Get-ChildItem $tempDir -Recurse | ForEach-Object { $rel = $_.FullName.Substring($tempDir.Length + 1); $skip = $false; foreach ($ex in @(".git", ".gitignore", "*.md", "README")) { if ($rel -like "*$ex*") { $skip = $true; break } }; if (-not $skip) { $target = Join-Path $oldPath $rel; if ($_.PSIsContainer) { if (-not (Test-Path $target)) { New-Item $target -ItemType Directory -Force | Out-Null } } else { $tdir = Split-Path $target; if (-not (Test-Path $tdir)) { New-Item $tdir -ItemType Directory -Force | Out-Null }; Copy-Item $_.FullName $target -Force } } }; Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue; Write-Host "`nACTUALIZADO!`n" -ForegroundColor Green; Write-Host "chrome://extensions/ -> Busca Lumina Tab -> Recarga" -ForegroundColor Yellow; Read-Host "Presiona Enter"
```

### Paso 3: Presiona Enter
- Te pide la ruta de tu carpeta anterior
- Escribe y presiona Enter
- ¡Listo! 🎉

---

## ✅ ¿Qué hace?

1. Descarga la versión nueva desde GitHub
2. Respaldá tu versión anterior
3. Limpia los archivos viejos
4. Instala los nuevos
5. **TUS DATOS SE CONSERVAN** ✓

---

## 🎯 Para tus amigos

Comparte esto:

> Abre PowerShell como Admin y pega esto:
> ```powershell
> iex (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/matijaime/lumina-tab/main/install-update.ps1')
> ```

---

## ❌ Si algo falla

### "El comando no se reconoce"
- Asegúrate de estar en PowerShell (no CMD)
- Intenta como Administrador

### "No puedo pegar"
- Probablemente tienes "Edición rápida" desactivada
- Click derecho en la barra de título → Propiedades → Marca "Edición rápida"

### "Error de descarga"
- Verifica conexión a internet
- Intenta con una VPN si estás bloqueado

### Última opción
Descarga el archivo directamente:
- https://github.com/matijaime/lumina-tab/raw/main/actualizar-extension.ps1
- Guarda como `actualizar.ps1`
- Abre PowerShell y ejecuta: `.\actualizar.ps1`
