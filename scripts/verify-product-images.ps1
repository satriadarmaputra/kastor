$ErrorActionPreference='Stop'
try{Add-Type -AssemblyName System.Drawing.Common -ErrorAction Stop}catch{Add-Type -AssemblyName System.Drawing -ErrorAction Stop}
$root=Split-Path -Parent $PSScriptRoot
$files=@(Get-ChildItem (Join-Path $root 'assets/products-hd') -Filter '*.jpg')
if($files.Count -ne 43){throw "Expected 43 HD product images, found $($files.Count)."}

$problems=@()
foreach($file in $files){
  $src=[System.Drawing.Bitmap]::FromFile($file.FullName)
  try{
    if($src.Width -ne 1600 -or $src.Height -ne 1600){$problems += "$($file.Name): $($src.Width)x$($src.Height), expected 1600x1600";continue}
    $preview=[System.Drawing.Bitmap]::new(200,200);$g=[System.Drawing.Graphics]::FromImage($preview)
    try{$g.DrawImage($src,0,0,200,200)}finally{$g.Dispose()}
    try{
      $unsafe=$false
      for($n=0;$n -lt 10 -and -not $unsafe;$n++){$far=199-$n;for($i=0;$i -lt 200;$i+=2){foreach($point in @(@($i,$n),@($i,$far),@($n,$i),@($far,$i))){$c=$preview.GetPixel($point[0],$point[1]);if($c.R-lt227-or$c.G-lt227-or$c.B-lt227){$unsafe=$true;break}}}}
      if($unsafe){$problems += "$($file.Name): product content is inside the 80px safe-edge area"}
    }finally{$preview.Dispose()}
  }finally{$src.Dispose()}
}
if($problems.Count){$problems|ForEach-Object{Write-Error $_};throw 'HD product image audit failed.'}
Write-Output "Verified 43 product images at 1600x1600 with safe edge margins."
