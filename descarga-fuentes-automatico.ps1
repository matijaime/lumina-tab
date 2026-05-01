# Script para descargar fuentes automaticamente
$ErrorActionPreference = "SilentlyContinue"
$fontsDir = Join-Path -Path $PSScriptRoot -ChildPath 'fonts'

if (-not (Test-Path $fontsDir)) {
    New-Item -ItemType Directory -Path $fontsDir | Out-Null
}

$fontUrls = @{
    'oswald' = 'https://github.com/google/fonts/raw/main/ofl/oswald/Oswald-Regular.woff2'
    'bebas-neue' = 'https://github.com/google/fonts/raw/main/ofl/bebasneue/BebasNeue-Regular.woff2'
    'playfair-display' = 'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Regular.woff2'
    'dm-serif-display' = 'https://github.com/google/fonts/raw/main/ofl/dmserifidisplay/DMSerifDisplay-Regular.woff2'
    'cormorant-garamond' = 'https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond-Regular.woff2'
    'righteous' = 'https://github.com/google/fonts/raw/main/ofl/righteous/Righteous-Regular.woff2'
    'abril-fatface' = 'https://github.com/google/fonts/raw/main/ofl/abrilfatface/AbrilFatface-Regular.woff2'
    'josefin-sans' = 'https://github.com/google/fonts/raw/main/ofl/josephinsans/JosefinSans-Regular.woff2'
    'cinzel' = 'https://github.com/google/fonts/raw/main/ofl/cinzel/Cinzel-Regular.woff2'
    'major-mono-display' = 'https://github.com/google/fonts/raw/main/ofl/majormonodisplay/MajorMonoDisplay-Regular.woff2'
    'lora' = 'https://github.com/google/fonts/raw/main/ofl/lora/Lora-Regular.woff2'
    'raleway' = 'https://github.com/google/fonts/raw/main/ofl/raleway/Raleway-Regular.woff2'
    'nunito' = 'https://github.com/google/fonts/raw/main/ofl/nunito/Nunito-Regular.woff2'
    'quicksand' = 'https://github.com/google/fonts/raw/main/ofl/quicksand/Quicksand-Regular.woff2'
    'jost' = 'https://github.com/google/fonts/raw/main/ofl/jost/Jost-Regular.woff2'
    'outfit' = 'https://github.com/google/fonts/raw/main/ofl/outfit/Outfit-Regular.woff2'
    'dm-sans' = 'https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans-Regular.woff2'
    'syne' = 'https://github.com/google/fonts/raw/main/ofl/syne/Syne-Regular.woff2'
    'figtree' = 'https://github.com/google/fonts/raw/main/ofl/figtree/Figtree-Regular.woff2'
    'plus-jakarta-sans' = 'https://github.com/google/fonts/raw/main/ofl/plusjakartasans/PlusJakartaSans-Regular.woff2'
}

$successCount = 0
$total = $fontUrls.Count

Write-Host "========================================"
Write-Host "Descargando $total fuentes..."
Write-Host "========================================"
Write-Host ""

foreach ($fontName in $fontUrls.Keys) {
    $url = $fontUrls[$fontName]
    Write-Host "[$($successCount + 1)/$total] $fontName..." -NoNewline

    $filePath = Join-Path -Path $fontsDir -ChildPath "$fontName.woff2"

    try {
        $client = New-Object System.Net.WebClient
        $client.DownloadFile($url, $filePath)
        $fileSize = (Get-Item $filePath).Length

        if ($fileSize -gt 5000) {
            Write-Host " OK ($fileSize bytes)"
            $successCount++
        } else {
            Write-Host " FALLO (archivo pequeño)"
            Remove-Item $filePath -ErrorAction SilentlyContinue
        }
    } catch {
        Write-Host " FALLO"
        Remove-Item $filePath -ErrorAction SilentlyContinue
    }

    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "========================================"
Write-Host "Resultado: $successCount/$total fuentes descargadas"
Write-Host "========================================"
Write-Host ""

if (Test-Path $fontsDir) {
    $files = Get-ChildItem -Path $fontsDir -Filter '*.woff2'
    Write-Host "Archivos en fonts/:"
    foreach ($file in $files) {
        $kb = [math]::Round($file.Length / 1024, 1)
        Write-Host "  - $($file.Name) ($kb KB)"
    }
}

Write-Host ""
Write-Host "PROXIMOS PASOS:"
Write-Host "1. Cierra este programa"
Write-Host "2. Ve a chrome://extensions"
Write-Host "3. Recarga Lumina Tab"
Write-Host "4. Abre nueva pestana > Settings > Personalizar Fuentes"
Write-Host ""

if ($successCount -eq $total) {
    Write-Host "EXITO! Todas las fuentes listas!"
} elseif ($successCount -gt 0) {
    Write-Host "Se descargaron $successCount fuentes. Ejecuta de nuevo para las restantes."
} else {
    Write-Host "Problema descargando. Intenta manualmente en:"
    Write-Host "https://google-webfonts-helper.herokuapp.com/fonts"
}

Write-Host ""
Read-Host "Presiona Enter para cerrar"
