# PowerShell script to download Google Fonts
# Usage: .\download-fonts.ps1

$fonts = @{
    # Clock fonts
    'Oswald' = 'oswald'
    'Bebas Neue' = 'bebas-neue'
    'Playfair Display' = 'playfair-display'
    'DM Serif Display' = 'dm-serif-display'
    'Cormorant Garamond' = 'cormorant-garamond'
    'Righteous' = 'righteous'
    'Abril Fatface' = 'abril-fatface'
    'Josefin Sans' = 'josefin-sans'
    'Cinzel' = 'cinzel'
    'Major Mono Display' = 'major-mono-display'
    # Greeting/Date fonts
    'Lora' = 'lora'
    'Raleway' = 'raleway'
    'Nunito' = 'nunito'
    'Quicksand' = 'quicksand'
    'Jost' = 'jost'
    'Outfit' = 'outfit'
    'DM Sans' = 'dm-sans'
    'Syne' = 'syne'
    'Figtree' = 'figtree'
    'Plus Jakarta Sans' = 'plus-jakarta-sans'
}

$fontsDir = Join-Path -Path $PSScriptRoot -ChildPath 'fonts'

# Create fonts directory
if (-not (Test-Path $fontsDir)) {
    New-Item -ItemType Directory -Path $fontsDir | Out-Null
    Write-Host "Created directory: $fontsDir"
}

Write-Host "Starting font downloads..."
Write-Host ""

$successCount = 0

foreach ($fontName in $fonts.Keys) {
    $fileName = $fonts[$fontName]
    Write-Host "Downloading: $fontName"

    $filePath = Join-Path -Path $fontsDir -ChildPath "$fileName.woff2"

    # Check if file already exists and is large enough
    if (Test-Path $filePath) {
        $fileSize = (Get-Item $filePath).Length
        if ($fileSize -gt 1000) {
            Write-Host "  [OK] Already exists ($fileSize bytes)"
            $successCount++
            continue
        }
    }

    # Try to download from Google Fonts API
    $fontFamily = $fontName -replace ' ', '+'
    $cssUrl = "https://fonts.googleapis.com/css2?family=$fontFamily&display=swap"

    try {
        $ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        $response = Invoke-WebRequest -Uri $cssUrl -UserAgent $ua -TimeoutSec 10

        # Extract woff2 URL from CSS
        if ($response.Content -match 'src: url\(([^)]*\.woff2)\)') {
            $fontUrl = $matches[1]

            Write-Host "  Getting: $fontUrl"

            try {
                Invoke-WebRequest -Uri $fontUrl -OutFile $filePath -UserAgent $ua -TimeoutSec 10
                $fileSize = (Get-Item $filePath).Length
                if ($fileSize -gt 1000) {
                    Write-Host "  [OK] Downloaded ($fileSize bytes)"
                    $successCount++
                } else {
                    Write-Host "  [ERROR] File too small"
                    Remove-Item $filePath -ErrorAction SilentlyContinue
                }
            } catch {
                Write-Host "  [ERROR] $($_.Exception.Message)"
                Remove-Item $filePath -ErrorAction SilentlyContinue
            }
        } else {
            Write-Host "  [SKIP] Could not extract font URL from CSS"
        }
    } catch {
        Write-Host "  [ERROR] $($_.Exception.Message)"
    }

    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "Complete! Downloaded: $successCount/$($fonts.Count) fonts"
Write-Host ""

# List downloaded files
if (Test-Path $fontsDir) {
    $files = Get-ChildItem -Path $fontsDir -Filter '*.woff2'
    Write-Host "Files in $fontsDir`:"
    foreach ($file in $files) {
        Write-Host "  $($file.Name) ($($file.Length) bytes)"
    }
}

Write-Host ""
Write-Host "NOTE: If fonts didn't download, try:"
Write-Host "  1. python3 download_fonts.py"
Write-Host "  2. Visit FONTS_SETUP.md for manual download instructions"
