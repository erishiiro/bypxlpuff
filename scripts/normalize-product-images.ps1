# Normalize product tee images: same shirt scale as rose, 2x resolution
Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$P = (Resolve-Path (Join-Path $PSScriptRoot '..\images\products')).Path

$MAIN_W = 1000; $MAIN_H = 1336
$THUMB_W = 328; $THUMB_H = 436
$MAIN_SHIRT_W = 980
$THUMB_SHIRT_W = 322

function Get-ContentRect([System.Drawing.Bitmap]$bmp, [int]$threshold = 248) {
  $minX = $bmp.Width; $maxX = -1; $minY = $bmp.Height; $maxY = -1
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
      $c = $bmp.GetPixel($x, $y)
      if ($c.A -lt 8) { continue }
      if ($c.R -ge $threshold -and $c.G -ge $threshold -and $c.B -ge $threshold) { continue }
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
  if ($maxX -lt 0) { return $null }
  return New-Object System.Drawing.Rectangle $minX, $minY, ($maxX - $minX + 1), ($maxY - $minY + 1)
}

function Get-BitmapCopy([string]$Path) {
  # Fully load into memory so source file can be overwritten
  $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $Path).Path)
  $ms = New-Object System.IO.MemoryStream(,$bytes)
  $img = [System.Drawing.Image]::FromStream($ms)
  $bmp = New-Object System.Drawing.Bitmap $img.Width, $img.Height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
  $g.Dispose(); $img.Dispose(); $ms.Dispose()
  return $bmp
}

function Save-Png([System.Drawing.Bitmap]$bmp, [string]$dest) {
  $tmp = "$dest.__out.png"
  $bmp.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  if (Test-Path $dest) { Remove-Item -LiteralPath $dest -Force }
  Move-Item -LiteralPath $tmp -Destination $dest -Force
}

function Fit-Shirt {
  param(
    [string]$Src,
    [string]$Dest,
    [int]$CanvasW,
    [int]$CanvasH,
    [int]$ShirtW,
    [string]$Side = ''  # '', 'left', 'right'
  )

  $srcBmp = Get-BitmapCopy $Src
  if ($Side) {
    $half = [int]([Math]::Floor($srcBmp.Width / 2))
    $crop = if ($Side -eq 'left') {
      New-Object System.Drawing.Rectangle 0, 0, $half, $srcBmp.Height
    } else {
      New-Object System.Drawing.Rectangle $half, 0, ($srcBmp.Width - $half), $srcBmp.Height
    }
    $piece = $srcBmp.Clone($crop, $srcBmp.PixelFormat)
    $srcBmp.Dispose()
    $srcBmp = $piece
  }

  $rect = Get-ContentRect $srcBmp
  if (-not $rect) { $srcBmp.Dispose(); throw "No content in $Src" }
  $content = $srcBmp.Clone($rect, $srcBmp.PixelFormat)
  $srcBmp.Dispose()

  $scale = $ShirtW / [double]$content.Width
  $dw = [int]([Math]::Round($content.Width * $scale))
  $dh = [int]([Math]::Round($content.Height * $scale))
  $maxH = [int]([Math]::Floor($CanvasH * 0.94))
  if ($dh -gt $maxH) {
    $s2 = $maxH / [double]$dh
    $dw = [int]([Math]::Round($dw * $s2))
    $dh = [int]([Math]::Round($dh * $s2))
  }
  $dx = [int](($CanvasW - $dw) / 2)
  $dy = [int](($CanvasH - $dh) / 2)

  $canvas = New-Object System.Drawing.Bitmap $CanvasW, $CanvasH
  $g = [System.Drawing.Graphics]::FromImage($canvas)
  $g.Clear([System.Drawing.Color]::White)
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($content, $dx, $dy, $dw, $dh)
  $g.Dispose(); $content.Dispose()
  Save-Png $canvas $Dest
  $canvas.Dispose()
  Write-Host ("OK {0} shirt={1}x{2} canvas={3}x{4}" -f (Split-Path $Dest -Leaf), $dw, $dh, $CanvasW, $CanvasH)
}

# Snapshot high-res sources before overwrite
$snap = Join-Path $P '_snap'
New-Item -ItemType Directory -Force -Path $snap | Out-Null
@(
  'dont-be-late-tee-main.png','dont-be-late-tee-thumb-1.png','dont-be-late-tee-thumb-2.png',
  'dont-be-late-tee-thumb-1-sage.png','dont-be-late-tee-thumb-2-sage.png',
  'cart-dont-be-late-tee-main-blue.png','dont-be-late-tee-thumb-2-blue.png',
  'everyday-comfort-tee-main.png','everyday-comfort-tee-thumb-1.png','everyday-comfort-tee-thumb-2.png',
  'everyday-comfort-tee-sage.png',
  'do-good-work-tee-main.png','do-good-work-tee-thumb-1.png','do-good-work-tee-thumb-2.png',
  'do-good-work-tee-lilac.png',
  'shop-everyday-comfort-tee-sage.png','shop-do-good-work-tee-lilac.png'
) | ForEach-Object {
  $src = Join-Path $P $_
  if (Test-Path $src) { Copy-Item $src (Join-Path $snap $_) -Force }
}

function S([string]$name) { Join-Path $snap $name }
function D([string]$name) { Join-Path $P $name }

# Rose family
Fit-Shirt (S 'dont-be-late-tee-main.png') (D 'dont-be-late-tee-main.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'dont-be-late-tee-thumb-1.png') (D 'dont-be-late-tee-thumb-1.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W
Fit-Shirt (S 'dont-be-late-tee-thumb-2.png') (D 'dont-be-late-tee-thumb-2.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W
Fit-Shirt (S 'dont-be-late-tee-main.png') (D 'shop-dont-be-late-tee.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'dont-be-late-tee-main.png') (D 'cart-dont-be-late-tee.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'dont-be-late-tee-main.png') (D 'home-dont-be-late-tee.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W

# Sage DBL
Fit-Shirt (S 'dont-be-late-tee-thumb-1-sage.png') (D 'dont-be-late-tee-thumb-1-sage.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'dont-be-late-tee-thumb-1-sage.png') (D 'dont-be-late-tee-main-sage.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'dont-be-late-tee-thumb-2-sage.png') (D 'dont-be-late-tee-thumb-2-sage.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W

# Blue DBL
Fit-Shirt (S 'cart-dont-be-late-tee-main-blue.png') (D 'cart-dont-be-late-tee-main-blue.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'cart-dont-be-late-tee-main-blue.png') (D 'cart-dont-be-late-tee-blue.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'cart-dont-be-late-tee-main-blue.png') (D 'dont-be-late-tee-main-blue.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'cart-dont-be-late-tee-main-blue.png') (D 'dont-be-late-tee-thumb-1-blue.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W
Fit-Shirt (S 'cart-dont-be-late-tee-main-blue.png') (D 'shop-dont-be-late-tee-blue.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'dont-be-late-tee-thumb-2-blue.png') (D 'dont-be-late-tee-thumb-2-blue.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W

# Everyday Comfort
Fit-Shirt (S 'everyday-comfort-tee-main.png') (D 'everyday-comfort-tee-main.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'everyday-comfort-tee-thumb-1.png') (D 'everyday-comfort-tee-thumb-1.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W
Fit-Shirt (S 'everyday-comfort-tee-thumb-2.png') (D 'everyday-comfort-tee-thumb-2.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W
Fit-Shirt (S 'everyday-comfort-tee-main.png') (D 'shop-everyday-comfort-tee.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'everyday-comfort-tee-main.png') (D 'cart-everyday-comfort-tee.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'everyday-comfort-tee-main.png') (D 'home-everyday-comfort-tee.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'everyday-comfort-tee-sage.png') (D 'shop-everyday-comfort-tee-sage.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W 'left'
Fit-Shirt (S 'everyday-comfort-tee-sage.png') (D 'everyday-comfort-tee-thumb-2-sage.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W 'right'

# Do Good Work
Fit-Shirt (S 'do-good-work-tee-main.png') (D 'do-good-work-tee-main.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'do-good-work-tee-thumb-1.png') (D 'do-good-work-tee-thumb-1.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W
Fit-Shirt (S 'do-good-work-tee-thumb-2.png') (D 'do-good-work-tee-thumb-2.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W
Fit-Shirt (S 'do-good-work-tee-main.png') (D 'shop-do-good-work-tee.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'do-good-work-tee-main.png') (D 'cart-do-good-work-tee.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'do-good-work-tee-main.png') (D 'home-do-good-work-tee.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W
Fit-Shirt (S 'do-good-work-tee-lilac.png') (D 'shop-do-good-work-tee-lilac.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W 'left'
Fit-Shirt (S 'do-good-work-tee-lilac.png') (D 'do-good-work-tee-main-lilac.png') $MAIN_W $MAIN_H $MAIN_SHIRT_W 'left'
Fit-Shirt (S 'do-good-work-tee-lilac.png') (D 'do-good-work-tee-thumb-1-lilac.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W 'left'
Fit-Shirt (S 'do-good-work-tee-lilac.png') (D 'do-good-work-tee-thumb-2-lilac.png') $THUMB_W $THUMB_H $THUMB_SHIRT_W 'right'

Remove-Item $snap -Recurse -Force

Write-Host "`n--- verify shirt widths (mains should be ~980) ---"
Get-ChildItem $P\*.png | ForEach-Object {
  if ($_.Name -in @('do-good-work-tee-lilac.png','everyday-comfort-tee-sage.png','dont-be-late-tee-blue.png')) { return }
  $bmp = New-Object System.Drawing.Bitmap $_.FullName
  $r = Get-ContentRect $bmp
  if ($r -and $bmp.Width -ge 500) {
    [PSCustomObject]@{ Name = $_.Name; Canvas = "$($bmp.Width)x$($bmp.Height)"; ShirtW = $r.Width; ShirtH = $r.Height }
  }
  $bmp.Dispose()
} | Sort-Object Name | Format-Table -AutoSize
