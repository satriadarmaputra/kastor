const series = [
  { slug: 'iris', name: 'Iris Series', cover: 'iris-cover.jpg', sheet: 'iris-spec.jpg', description: 'Recessed downlight dengan cahaya nyaman, sumber cahaya tersembunyi, serta pilihan standard, pinhole, slotted, dan glasses.' },
  { slug: 'linea', name: 'Linea Series', cover: 'linea-cover.jpg', sheet: 'linea-spec.jpg', description: 'Linear spotlight untuk garis cahaya yang rapi dan seamless, tersedia dalam versi recessed dan surface.' },
  { slug: 'loop', name: 'Loop Series', cover: 'loop-cover.jpg', sheet: 'loop-spec.jpg', description: 'Koleksi downlight berperforma tinggi dengan ukuran dan karakter sorot yang lengkap.' },
  { slug: 'pipo', name: 'Pipo Series', cover: 'pipo-cover.jpg', sheet: 'pipo-spec.jpg', description: 'Pulldown ceiling spotlight yang dapat tampil rata atau diarahkan untuk menonjolkan objek dan detail arsitektur.' },
  { slug: 'snap', name: 'Snap Series', cover: 'snap-cover.jpg', sheet: 'snap-spec.jpg', description: 'Sistem magnetic track modular yang mudah dipasang, dilepas, dan diatur ulang sesuai kebutuhan ruang.' }
];

const products = [];
const add = (seriesSlug, group, name, slug, specs, sheet) => products.push({ series: seriesSlug, group, name, slug, specs, sheet });
const finish = { 'Trim Finishing': 'Black | White', Reflector: 'Dark Chrome | Black | White' };
const cct = '2700K | 3000K | 4000K';
const dim = 'Dimmable | Non Dimmable';

add('iris','Standard','Basic Recessed Downlight','iris-basic-recessed-downlight',{CRI:'90',CCT:cct,'Beam Angle':'15° | 24° | 36°','IP Rating':'IP20',Watt:'20W',Lumen:'500 | 1200 | 1400 lm/W',Voltage:'36V / 150mA',Dimming:dim,Dimension:'Ø83 × H57 mm','Cut Out Size':'Ø75 mm',...finish});
add('iris','Standard','Adjustable Recessed Downlight','iris-adjustable-recessed-downlight',{CRI:'90',CCT:cct,'Beam Angle':'15° | 24° | 36°','IP Rating':'IP20',Watt:'20W',Lumen:'500 | 1200 | 1400 lm/W',Voltage:'36V / 150mA',Dimming:dim,Dimension:'Ø83 × H57 mm','Cut Out Size':'Ø75 mm',...finish});
add('iris','Pinhole','Recessed Pinhole Downlight','iris-recessed-pinhole-downlight',{CRI:'90',CCT:cct,'Beam Angle':'15° | 24° | 36°','IP Rating':'IP20',Watt:'20W',Lumen:'500 | 1200 | 1400 lm/W',Voltage:'36V / 150mA',Dimming:dim,Dimension:'Ø83 × H57 mm','Cut Out Size':'Ø75 mm',...finish});
add('iris','Slotted Pinhole','Recessed Slotted Pinhole Downlight','iris-recessed-slotted-pinhole-downlight',{CRI:'90',CCT:cct,'Beam Angle':'15° | 24° | 36°','IP Rating':'IP20',Watt:'20W',Lumen:'500 | 1200 | 1400 lm/W',Voltage:'36V / 150mA',Dimming:dim,Dimension:'Ø83 × H57 mm','Cut Out Size':'Ø75 mm',...finish});
add('iris','Glasses','Recessed Glasses Downlight','iris-recessed-glasses-downlight',{CRI:'90',CCT:cct,'Beam Angle':'24° | 36°','IP Rating':'IP54',Watt:'6.5W',Lumen:'500 lm/W',Voltage:'12V',Dimming:'Non Dimmable',Dimension:'Ø92 × H83 mm','Cut Out Size':'Ø78 mm',Fitting:'GU5.3','Trim Finishing':'White',Reflector:'White'});

for (const [group,name,slug,watt,lumen,beam,dimension] of [
 ['Recessed','XS-3 Cells — Recessed Fixed','linea-xs-3-cells','6W','450 lm/W','30° | 40°',''],
 ['Recessed','S-5 Cells — Recessed Fixed','linea-s-5-cells-recessed','10W','750 lm/W','30° | 40°',''],
 ['Recessed','M-10 Cells — Recessed Fixed','linea-m-10-cells','20W','1500 lm/W','30° | 40°',''],
 ['Surface','S-5 Cells — Surface Fixed','linea-s-5-cells-surface','10W','900 lm/W','15° | 30° | 40°','185 × 35 × 70 mm']
]) add('linea',group,name,slug,{CRI:'90',CCT:cct,'Beam Angle':beam,'IP Rating':'IP20',Watt:watt,Lumen:lumen,Dimming:dim,...(dimension?{Dimension:dimension}:{}),'Trim Finishing':'Black | White',Reflector:group==='Recessed'?'Dark Chrome':'—','Control Options':'Non-DIM | 1–10 V | DALI'});

const loopAdd=(group,name,slug,watt,lumen,beam,dimension,cut,extra={})=>add('loop',group,name,slug,{CRI:group==='XS-3 Watt'?'97':'95',CCT:cct,'Beam Angle':beam,'IP Rating':group==='XS-3 Watt'?'IP20':'IP54',Watt:watt,Lumen:lumen,Dimming:dim,Dimension:dimension,'Cut Out Size':cut,...finish,...extra});
loopAdd('XS-3 Watt','General Mini Downlight','loop-xs-general-mini-downlight','3W','240 lm/W','15° | 24° | 36°','Ø20 × H65 mm','Ø18 mm');
for (const [group,prefix,watt,lumen,beam,dimn,cut] of [['S-7 Watt','s','7W','490 lm/W','15° | 24° | 36°','Ø35 × H95 mm','Ø30 mm'],['M-12 Watt','m','12W','840 lm/W','15° | 24° | 36°','Ø46 × H110 mm','Ø40 mm'],['L-18 Watt','l','18W','3000 lm/W','10° | 24° | 36°','Ø102 × H150 mm','Ø95 mm'],['XL-30 Watt','xl','30W','1800 | 3000 lm/W','10° | 24° | 36°','Ø102 × H150 mm','Ø95 mm']]) {
  loopAdd(group,'General Downlight',`loop-${prefix}-general-downlight`,watt,lumen,beam,dimn,cut,group==='XL-30 Watt'?{Configuration:'Fixed | Adjustable'}:{});
  loopAdd(group,'Pinhole',`loop-${prefix}-pinhole`,watt,group==='XL-30 Watt'?'3000 lm/W':lumen,beam,dimn,cut);
  loopAdd(group,'Slotted Pinhole',`loop-${prefix}-slotted-pinhole`,watt,(group==='L-18 Watt'||group==='XL-30 Watt')?'1800 lm/W':lumen,beam,dimn,cut);
}
add('loop','Vanity','Recessed Vanity Downlight','loop-recessed-vanity-downlight',{CRI:'90',CCT:cct,'Beam Angle':'Polarized','IP Rating':'IP20',Watt:'10W',Lumen:'1080 lm/W',Current:'250mA | 350mA',Dimming:dim,Dimension:'Ø62 × H84 mm','Cut Out Size':'Ø55 mm','Trim Finishing':'Black | White',Reflector:'Grey'} ,'loop-xl-spec.jpg');

add('pipo','S-75mm','Downlight Pulldown S-75mm','pipo-downlight-pulldown-s',{CRI:'95',CCT:cct,'Beam Angle':'10° | 24° | 50°','IP Rating':'IP20',Watt:'10W',Lumen:'1000 lm/W',Dimming:dim,Dimension:'Ø84 × H104 mm','Cut Out Size':'Ø75 mm','Trim Finishing':'Black | White',Reflector:'Black | White'});
add('pipo','M-95mm','Downlight Pulldown M-95mm','pipo-downlight-pulldown-m',{CRI:'95',CCT:cct,'Beam Angle':'15° | 24° | 38°','IP Rating':'IP20',Watt:'22W',Lumen:'2090 lm/W',Dimming:'Non Dimmable',Dimension:'Ø110 × H127 mm','Cut Out Size':'Ø95 mm','Trim Finishing':'Black | White',Reflector:'Black | White'});

const snapCommon={CRI:'90',CCT:cct,'Beam Angle':'24° | 36°','IP Rating':'IP20',Voltage:'DC 48V',Dimming:dim,'Trim Finishing':'Black | White'};
for (const [group,name,slug,watt,lumen,dimension] of [
 ['XS-6mm','Magnetic Spotlight','snap-xs-magnetic-spotlight','9W','75 lm/W','Ø45 × L75 mm'],['XS-6mm','Magnetic Linear Fixed','snap-xs-magnetic-linear-fixed','9W','75 lm/W','L303 × W61 × H14 mm'],['XS-6mm','Magnetic Linear Adjustable','snap-xs-magnetic-linear-adjustable','9W','75 lm/W','L212 × W6 × H40 mm'],['XS-6mm','Magnetic Cylinder','snap-xs-magnetic-cylinder','9W','75 lm/W','Ø65 × H45 mm'],['M-20mm','Magnetic Spotlight','snap-m-magnetic-spotlight','10W | 20W','>80 lm/W | >90 lm/W','Ø45 × L110 mm | Ø60 × L145 mm'],['M-20mm','Magnetic Linear Fixed','snap-m-magnetic-linear-fixed','12W','','L220 × W22.5 × H43 mm'],['M-20mm','Magnetic Linear Adjustable','snap-m-magnetic-linear-adjustable','12W','','']
]) add('snap',group,name,slug,{...snapCommon,Watt:watt,...(lumen?{Lumen:lumen}:{}),...(dimension?{Dimension:dimension}:{})});
const accessory=(group,name,slug,spec={})=>add('snap',`Accessories ${group}`,name,slug,{Category:'Magnetic Track Accessory',System:group,...spec},'snap-accessories.jpg');
accessory('XS-6mm','Recessed Rail Track','snap-xs-recessed-rail-track',{Length:'1m | 2m',Dimensions:'40 × 20 mm'}); accessory('XS-6mm','Surfaced Rail Track','snap-xs-surfaced-rail-track',{Length:'1m | 2m',Dimensions:'40 × 20 mm'}); accessory('XS-6mm','Bracket Connector','snap-xs-bracket-connector'); accessory('XS-6mm','I-Connector','snap-xs-i-connector'); accessory('XS-6mm','Power End','snap-xs-power-end');
accessory('M-20mm','Rail Track Trimless','snap-m-rail-track-trimless',{Length:'1m | 2m',Dimensions:'40 × 20 mm'}); accessory('M-20mm','Rail Track Trim','snap-m-rail-track-trim',{Length:'1m | 2m',Dimensions:'40 × 20 mm'}); accessory('M-20mm','Flexible Connector','snap-m-flexible-connector'); accessory('M-20mm','I-Connector','snap-m-i-connector'); accessory('M-20mm','Power End','snap-m-power-end'); accessory('M-20mm','Power Supply','snap-m-power-supply');

module.exports = { series, products };
