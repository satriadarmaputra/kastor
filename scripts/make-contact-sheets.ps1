Add-Type -AssemblyName System.Drawing.Common -ErrorAction Stop
$root=Split-Path -Parent $PSScriptRoot; $src=Join-Path $root 'assets/products'; $out=Join-Path $root 'audit'; New-Item -ItemType Directory -Force $out|Out-Null
foreach($series in @('iris','linea','loop','pipo','snap')){
  $files=@(Get-ChildItem $src -Filter "$series-*.jpg" | Sort-Object Name); $cols=4; $cellW=360; $cellH=420; $rows=[Math]::Ceiling($files.Count/$cols); $sheet=[System.Drawing.Bitmap]::new($cols*$cellW,$rows*$cellH); $g=[System.Drawing.Graphics]::FromImage($sheet)
  try{$g.Clear([System.Drawing.Color]::FromArgb(238,235,231));$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;$font=[System.Drawing.Font]::new('Arial',13,[System.Drawing.FontStyle]::Bold)
    for($i=0;$i-lt$files.Count;$i++){ $img=[System.Drawing.Image]::FromFile($files[$i].FullName);try{$x=($i%$cols)*$cellW;$y=[Math]::Floor($i/$cols)*$cellH;$g.FillRectangle([System.Drawing.Brushes]::White,$x+8,$y+8,$cellW-16,$cellH-16);$g.DrawImage($img,$x+28,$y+24,304,304);$label=$files[$i].BaseName.Replace("$series-",'');$g.DrawString($label,$font,[System.Drawing.Brushes]::Black,$x+18,$y+345)}finally{$img.Dispose()}}
  }finally{$g.Dispose()};try{$sheet.Save((Join-Path $out "$series-contact.jpg"),[System.Drawing.Imaging.ImageFormat]::Jpeg)}finally{$sheet.Dispose()}
}
