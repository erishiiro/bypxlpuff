Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

function Load-Bmp([string]$path) {
  $bytes = [IO.File]::ReadAllBytes((Resolve-Path $path).Path)
  $ms = New-Object IO.MemoryStream(,$bytes)
  $img = [Drawing.Image]::FromStream($ms)
  $bmp = New-Object Drawing.Bitmap $img.Width, $img.Height, ([Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
  $g.Dispose(); $img.Dispose(); $ms.Dispose()
  return $bmp
}

function Save-Bmp([Drawing.Bitmap]$bmp, [string]$dest) {
  $tmp = "$dest.__out.png"
  $bmp.Save($tmp, [Drawing.Imaging.ImageFormat]::Png)
  if (Test-Path $dest) { Remove-Item -LiteralPath $dest -Force }
  Move-Item -LiteralPath $tmp -Destination $dest -Force
}

function Clamp-Byte([double]$v) {
  if ($v -lt 0) { return [byte]0 }
  if ($v -gt 255) { return [byte]255 }
  return [byte][int][math]::Round($v)
}

function Map-Channel([double]$pix, [double]$srcMean, [double]$dstMean) {
  if ($srcMean -lt 1) { $srcMean = 1 }
  return (Clamp-Byte ($pix * ($dstMean / $srcMean)))
}

function Recolor-Tee {
  param(
    [string]$SharpPath,
    [string]$DestPath,
    [Drawing.Color]$SrcFabric,
    [Drawing.Color]$SrcGraphic,
    [Drawing.Color]$DstFabric,
    [Drawing.Color]$DstGraphic,
    [double]$GraphicBias = 1.1
  )

  $src = Load-Bmp $SharpPath
  $w = $src.Width; $h = $src.Height
  $out = New-Object Drawing.Bitmap $w, $h, ([Drawing.Imaging.PixelFormat]::Format32bppArgb)

  $sfR = [double]$SrcFabric.R; $sfG = [double]$SrcFabric.G; $sfB = [double]$SrcFabric.B
  $sgR = [double]$SrcGraphic.R; $sgG = [double]$SrcGraphic.G; $sgB = [double]$SrcGraphic.B
  $dfR = [double]$DstFabric.R; $dfG = [double]$DstFabric.G; $dfB = [double]$DstFabric.B
  $dgR = [double]$DstGraphic.R; $dgG = [double]$DstGraphic.G; $dgB = [double]$DstGraphic.B

  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      $c = $src.GetPixel($x, $y)
      if ($c.A -lt 10) { $out.SetPixel($x, $y, $c); continue }
      if ($c.R -ge 248 -and $c.G -ge 248 -and $c.B -ge 248) {
        $out.SetPixel($x, $y, [Drawing.Color]::White)
        continue
      }

      $pr = [double]$c.R; $pg = [double]$c.G; $pb = [double]$c.B
      $dfab = [math]::Sqrt(($pr - $sfR) * ($pr - $sfR) + ($pg - $sfG) * ($pg - $sfG) + ($pb - $sfB) * ($pb - $sfB))
      $dgra = [math]::Sqrt(($pr - $sgR) * ($pr - $sgR) + ($pg - $sgG) * ($pg - $sgG) + ($pb - $sgB) * ($pb - $sgB))
      $max = [math]::Max($pr, [math]::Max($pg, $pb))
      $min = [math]::Min($pr, [math]::Min($pg, $pb))
      $chroma = $max - $min

      $isGraphic = ($dgra * $GraphicBias -lt $dfab) -or (($chroma -gt 28) -and ($dgra -lt ($dfab + 25)))

      if ($isGraphic) {
        $nr = Map-Channel $pr $sgR $dgR
        $ng = Map-Channel $pg $sgG $dgG
        $nb = Map-Channel $pb $sgB $dgB
      } else {
        $nr = Map-Channel $pr $sfR $dfR
        $ng = Map-Channel $pg $sfG $dfG
        $nb = Map-Channel $pb $sfB $dfB
      }
      $out.SetPixel($x, $y, [Drawing.Color]::FromArgb([int]$c.A, [int]$nr, [int]$ng, [int]$nb))
    }
  }

  $src.Dispose()
  Save-Bmp $out $DestPath
  $out.Dispose()
  Write-Host "Wrote $DestPath"
}

$comfortSrcFab = [Drawing.Color]::FromArgb(227, 227, 227)
$comfortSrcGfx = [Drawing.Color]::FromArgb(236, 120, 140)
$sageFab = [Drawing.Color]::FromArgb(168, 184, 154)
$sageGfx = [Drawing.Color]::FromArgb(235, 230, 180)

$dgwSrcFab = [Drawing.Color]::FromArgb(251, 238, 224)
$dgwSrcGfx = [Drawing.Color]::FromArgb(240, 170, 90)
$lilacFab = [Drawing.Color]::FromArgb(220, 200, 235)
$lilacGfx = [Drawing.Color]::FromArgb(200, 120, 180)

Recolor-Tee `
  -SharpPath "images\products\everyday-comfort-tee-main.png" `
  -DestPath "images\products\shop-everyday-comfort-tee-sage.png" `
  -SrcFabric $comfortSrcFab -SrcGraphic $comfortSrcGfx `
  -DstFabric $sageFab -DstGraphic $sageGfx -GraphicBias 1.05

Recolor-Tee `
  -SharpPath "images\products\do-good-work-tee-main.png" `
  -DestPath "images\products\shop-do-good-work-tee-lilac.png" `
  -SrcFabric $dgwSrcFab -SrcGraphic $dgwSrcGfx `
  -DstFabric $lilacFab -DstGraphic $lilacGfx -GraphicBias 1.0

Copy-Item "images\products\shop-do-good-work-tee-lilac.png" "images\products\do-good-work-tee-main-lilac.png" -Force
Write-Host "done"
