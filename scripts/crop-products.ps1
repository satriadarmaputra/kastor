Add-Type -AssemblyName System.Drawing.Common -ErrorAction Stop
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root 'assets/products'
$heroOut = Join-Path $root 'assets/heroes'
New-Item -ItemType Directory -Force $out | Out-Null
New-Item -ItemType Directory -Force $heroOut | Out-Null
function Crop($source,$slug,$x,$y,$w,$h) {
  $src=[System.Drawing.Bitmap]::FromFile((Join-Path $root "assets/catalog/$source"))
  try {
    $rect=[System.Drawing.Rectangle]::new($x,$y,$w,$h)
    $dst=[System.Drawing.Bitmap]::new(1200,1200)
    $g=[System.Drawing.Graphics]::FromImage($dst)
    try {
      $g.Clear([System.Drawing.Color]::White)
      $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $scale=[Math]::Min(1080/$w,1080/$h); $dw=[int]($w*$scale); $dh=[int]($h*$scale); $dx=[int]((1200-$dw)/2); $dy=[int]((1200-$dh)/2)
      $g.DrawImage($src,[System.Drawing.Rectangle]::new($dx,$dy,$dw,$dh),$rect,[System.Drawing.GraphicsUnit]::Pixel)
    } finally { $g.Dispose() }
    try { $dst.Save((Join-Path $out "$slug.jpg"),[System.Drawing.Imaging.ImageFormat]::Jpeg) } finally { $dst.Dispose() }
  } finally { $src.Dispose() }
}
function Hero($source,$slug,$x,$y,$w,$h) {
  $src=[System.Drawing.Bitmap]::FromFile((Join-Path $root "assets/catalog/$source")); try {
    $dst=[System.Drawing.Bitmap]::new(1920,1080); $g=[System.Drawing.Graphics]::FromImage($dst); try {
      $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.DrawImage($src,[System.Drawing.Rectangle]::new(0,0,1920,1080),[System.Drawing.Rectangle]::new($x,$y,$w,$h),[System.Drawing.GraphicsUnit]::Pixel)
    } finally {$g.Dispose()}; try {$dst.Save((Join-Path $heroOut "$slug-hero.jpg"),[System.Drawing.Imaging.ImageFormat]::Jpeg)} finally {$dst.Dispose()}
  } finally {$src.Dispose()}
}

# Clean central crops: exclude all printed series titles and descriptions embedded at both edges.
Hero iris-cover.jpg iris 1300 500 2000 1125
Hero linea-cover.jpg linea 1450 500 1850 1041
Hero loop-cover.jpg loop 1300 500 2000 1125
Hero snap-cover.jpg snap 1300 500 2000 1125
Hero pipo-cover.jpg pipo 1300 500 2000 1125

Crop iris-spec.jpg iris-basic-recessed-downlight 150 930 360 430
Crop iris-spec.jpg iris-adjustable-recessed-downlight 150 1900 360 430
Crop iris-spec.jpg iris-recessed-pinhole-downlight 1270 930 360 430
Crop iris-spec.jpg iris-recessed-slotted-pinhole-downlight 1270 1900 360 430
Crop iris-spec.jpg iris-recessed-glasses-downlight 2580 930 400 430

Crop linea-spec.jpg linea-xs-3-cells 140 1040 350 360
Crop linea-spec.jpg linea-s-5-cells-recessed 140 2100 350 360
Crop linea-spec.jpg linea-m-10-cells 1240 1040 390 360
Crop linea-spec.jpg linea-s-5-cells-surface 2550 1040 430 340

Crop pipo-spec.jpg pipo-downlight-pulldown-s 190 1050 300 500
Crop pipo-spec.jpg pipo-downlight-pulldown-m 1300 1030 320 520

Crop snap-spec.jpg snap-xs-magnetic-spotlight 150 870 350 400
Crop snap-spec.jpg snap-xs-magnetic-linear-fixed 1260 900 430 300
Crop snap-spec.jpg snap-xs-magnetic-linear-adjustable 130 2020 430 320
Crop snap-spec.jpg snap-xs-magnetic-cylinder 1260 1980 420 430
Crop snap-spec.jpg snap-m-magnetic-spotlight 2540 870 370 410
Crop snap-spec.jpg snap-m-magnetic-linear-fixed 3660 900 460 300
Crop snap-spec.jpg snap-m-magnetic-linear-adjustable 2520 2020 470 330

Crop snap-accessories.jpg snap-xs-recessed-rail-track 150 720 500 300
Crop snap-accessories.jpg snap-xs-surfaced-rail-track 150 1090 500 300
Crop snap-accessories.jpg snap-xs-bracket-connector 150 1480 500 260
Crop snap-accessories.jpg snap-xs-i-connector 150 1710 500 270
Crop snap-accessories.jpg snap-xs-power-end 150 1990 500 250
Crop snap-accessories.jpg snap-m-rail-track-trimless 1290 720 480 300
Crop snap-accessories.jpg snap-m-rail-track-trim 1290 1010 480 300
Crop snap-accessories.jpg snap-m-flexible-connector 1290 1370 480 300
Crop snap-accessories.jpg snap-m-i-connector 1290 1690 480 280
Crop snap-accessories.jpg snap-m-power-end 1290 2020 480 280
Crop snap-accessories.jpg snap-m-power-supply 1290 2320 480 220

Crop loop-spec.jpg loop-xs-general-mini-downlight 270 860 260 560
foreach($item in @(
 @('loop-s-general-downlight',1380,840),@('loop-s-pinhole',1380,1660),@('loop-s-slotted-pinhole',1380,2600),
 @('loop-m-general-downlight',2710,840),@('loop-m-pinhole',2710,1660),@('loop-m-slotted-pinhole',2710,2600),
 @('loop-l-general-downlight',3660,820),@('loop-l-pinhole',3660,1660),@('loop-l-slotted-pinhole',3660,2600)
)) { Crop loop-spec.jpg $item[0] $item[1] $item[2] 300 540 }
Crop loop-xl-spec.jpg loop-xl-general-downlight 220 800 300 520
Crop loop-xl-spec.jpg loop-xl-pinhole 220 1660 300 520
Crop loop-xl-spec.jpg loop-xl-slotted-pinhole 220 2500 300 520
Crop loop-xl-spec.jpg loop-recessed-vanity-downlight 2600 970 350 520
# Pipo cover artwork is mostly typography. Replace it with a clean, text-free product composition.
$hero=[System.Drawing.Bitmap]::new(1920,1080); $hg=[System.Drawing.Graphics]::FromImage($hero); try {
  $hg.Clear([System.Drawing.Color]::FromArgb(61,56,54)); $hg.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::HighQuality; $hg.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $s=[System.Drawing.Image]::FromFile((Join-Path $out 'pipo-downlight-pulldown-s.jpg')); $m=[System.Drawing.Image]::FromFile((Join-Path $out 'pipo-downlight-pulldown-m.jpg')); try {
    $hg.FillRectangle([System.Drawing.Brushes]::White,210,130,680,820); $hg.FillRectangle([System.Drawing.Brushes]::White,1030,130,680,820)
    $hg.DrawImage($s,250,200,600,600); $hg.DrawImage($m,1070,200,600,600)
  } finally {$s.Dispose();$m.Dispose()}
} finally {$hg.Dispose()}; try {$hero.Save((Join-Path $heroOut 'pipo-hero.jpg'),[System.Drawing.Imaging.ImageFormat]::Jpeg)} finally {$hero.Dispose()}
Write-Output "Created $((Get-ChildItem $out -Filter *.jpg).Count) HD product crops and 5 clean heroes."
