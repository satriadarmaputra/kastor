const fs = require('node:fs');
const path = require('node:path');
const QRCode = require('qrcode');
const { PNG } = require('pngjs');
const { zipSync } = require('fflate');
const { series, products } = require('../data/catalog.cjs');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const base = 'https://kastor-product.pages.dev';
const config = JSON.parse(fs.readFileSync(path.join(root, 'data/site.json'), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route = product => `/p/${product.slug}/`;
const seriesRoute = item => `/series/${item.slug}/`;
const getSeries = slug => series.find(item => item.slug === slug);
function write(file, data) { const target = path.join(out, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, data); }
function contact() { return `<a class="contact" href="${config.contactUrl}" target="_blank" rel="noopener noreferrer">↗ Contact Us</a>`; }
function shell(title, body, customer = false) {
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)} | Kastor</title><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script></head><body><header>${customer?'<span>':'<a href="/" aria-label="Kastor Home">'}<img src="/brand/kastor-logo-transparent.png" width="2172" height="724" alt="Kastor Lighting">${customer?'</span>':'</a>'}<span class="small">${customer?'PRODUCT INFORMATION':'LIGHT FOR EVERY SPACE.'}</span></header><main>${body}</main><footer>KASTOR <span>Light for Every Space.</span></footer>${contact()}</body></html>`;
}
function dimmer() { return `<aside class="light-dock" aria-label="Kontrol cahaya halaman"><label for="dimmer">☀ Cahaya <output id="dimmer-value" for="dimmer">70%</output></label><input id="dimmer" type="range" min="0" max="100" value="70" aria-label="Cahaya halaman"></aside>`; }
function qrCard(product) { return `<div class="card-qr"><details><summary>Preview QR</summary><img src="/qr/files/${product.slug}.png" width="300" height="300" loading="lazy" alt="QR ${esc(product.name)}"><p class="small">Scan untuk membuka informasi produk.</p></details><a class="button" href="/qr/files/${product.slug}.png" download="${product.slug}.png">Download QR ↓</a></div>`; }
function productCard(product) { const meta=getSeries(product.series); return `<article class="card product-unit" data-product data-search="${esc((product.name+' '+product.group+' '+meta.name).toLowerCase())}" data-group="${esc(product.group)}"><a href="${route(product)}"><div class="photo product-photo"><img src="/products/${product.slug}.jpg" alt="${esc(product.name)}" loading="lazy"></div><p class="eyebrow">${esc(product.group)}</p><h3>${esc(product.name)}</h3><span class="small">Lihat spesifikasi ↗</span></a>${qrCard(product)}</article>`; }
async function makeQr(product) {
  const buffer = await QRCode.toBuffer(base + route(product), { errorCorrectionLevel:'H', margin:4, scale:16, color:{dark:'#573d3eff',light:'#ffffffff'} });
  const png=PNG.sync.read(buffer), logo=PNG.sync.read(fs.readFileSync(path.join(root,'assets/brand/kastor-logo.png')));
  const w=Math.floor(png.width*.20), h=Math.round(w*logo.height/logo.width), pad=8, x=Math.floor((png.width-w)/2), y=Math.floor((png.height-h)/2);
  for(let yy=y-pad;yy<y+h+pad;yy++) for(let xx=x-pad;xx<x+w+pad;xx++){const i=(yy*png.width+xx)*4; png.data.fill(255,i,i+4);}
  for(let yy=0;yy<h;yy++) for(let xx=0;xx<w;xx++){const si=(Math.floor(yy*logo.height/h)*logo.width+Math.floor(xx*logo.width/w))*4,di=((y+yy)*png.width+x+xx)*4; for(let k=0;k<3;k++) png.data[di+k]=Math.round(logo.data[si+k]*logo.data[si+3]/255+255*(1-logo.data[si+3]/255)); png.data[di+3]=255;}
  return PNG.sync.write(png);
}
async function build() {
  if (out !== path.resolve(root,'dist')) throw Error('Unexpected output path');
  if (fs.existsSync(out) && fs.lstatSync(out).isSymbolicLink()) throw Error('Refuse symlink output');
  fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out,{recursive:true});
  for (const name of ['kastor-logo.png','kastor-logo-transparent.png','sora-medium.ttf','sora-bold.ttf']) write('brand/'+name,fs.readFileSync(path.join(root,'assets/brand',name)));
  for (const name of fs.readdirSync(path.join(root,'assets/catalog'))) write('catalog/'+name,fs.readFileSync(path.join(root,'assets/catalog',name)));
  for (const name of fs.readdirSync(path.join(root,'assets/heroes'))) write('heroes/'+name,fs.readFileSync(path.join(root,'assets/heroes',name)));
  for (const name of fs.readdirSync(path.join(root,'assets/products-hd'))) write('products/'+name,fs.readFileSync(path.join(root,'assets/products-hd',name)));
  write('site.css',fs.readFileSync(path.join(root,'source/site.css'))); write('site.js',fs.readFileSync(path.join(root,'source/site.js'))); write('favicon.ico',fs.readFileSync(path.join(root,'source/favicon.ico')));
  const archive={};
  for (const product of products) {
    const meta=getSeries(product.series); const rows=Object.entries(product.specs).filter(([,v])=>v&&v!=='—').map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    const page=`<nav class="crumbs" aria-label="Breadcrumb"><span>${esc(meta.name)}</span><span>›</span><span>${esc(product.group)}</span><span>›</span><strong>${esc(product.name)}</strong></nav><section class="detail catalog-detail"><figure><img class="product-image product-cutout" src="/products/${product.slug}.jpg" alt="${esc(product.name)}" fetchpriority="high"><figcaption class="small">Foto produk dipotong dari katalog resmi Kastor.</figcaption></figure><div><p class="eyebrow">${esc(meta.name)} / ${esc(product.group)}</p><h1>${esc(product.name)}</h1><p>${esc(meta.description)}</p><h2 class="spec-heading">Spesifikasi produk</h2><dl>${rows}</dl><a class="contact-inline" href="${config.contactUrl}" target="_blank" rel="noopener noreferrer">Tanyakan produk ini via WhatsApp ↗</a></div></section>`;
    write(`p/${product.slug}/index.html`,shell(product.name,page,true));
    const png=await makeQr(product); write(`qr/files/${product.slug}.png`,png); archive[`${product.slug}.png`]=png;
  }
  write('qr/kastor-qr.zip',zipSync(archive));
  const seriesCards=series.map((item,index)=>{const count=products.filter(p=>p.series===item.slug).length; return `<article class="series-card reveal"><a href="${seriesRoute(item)}"><div class="series-photo"><img src="/heroes/${item.cover}" alt="${esc(item.name)}" ${index?'loading="lazy"':'fetchpriority="high"'}></div><div class="series-copy"><p class="eyebrow">MAIN SERIES ${String(index+1).padStart(2,'0')}</p><h2>${esc(item.name)}</h2><p>${esc(item.description)}</p><span>${count} unit produk · Explore series ↗</span></div></a></article>`}).join('');
  const home=`<section class="hero catalog-hero"><p class="eyebrow">KASTOR LIGHTING / NEW COLLECTION</p><h1>From series<br><em>to every detail.</em></h1><p>Pilih main series, temukan kelompok produk, lalu buka spesifikasi setiap unit.</p><a href="#series" class="button">Jelajahi series ↓</a><span class="hero-circle" aria-hidden="true"></span></section>${dimmer()}<section id="series" class="series-section"><div class="section-top"><div><p class="eyebrow">PRODUCT DIRECTORY</p><h2>Main Series</h2></div><span class="small">${series.length} series · ${products.length} unit</span></div><div class="series-grid">${seriesCards}</div></section><script src="/experience.js" defer></script>`;
  write('index.html',shell('Product Collection',home));
  for (const item of series) {
    const own=products.filter(p=>p.series===item.slug), groups=[...new Set(own.map(p=>p.group))];
    const chips=groups.map(g=>`<a href="#${g.toLowerCase().replace(/[^a-z0-9]+/g,'-')}">${esc(g)}</a>`).join('');
    const sections=groups.map(g=>`<section class="product-group" id="${g.toLowerCase().replace(/[^a-z0-9]+/g,'-')}"><div class="section-top"><h2>${esc(g)}</h2><span class="small">${own.filter(p=>p.group===g).length} unit</span></div><div class="grid">${own.filter(p=>p.group===g).map(productCard).join('')}</div></section>`).join('');
    const page=`<section class="series-hero"><img src="/heroes/${item.cover}" alt="${esc(item.name)}"><div><a href="/" class="back-link">← Semua series</a><p class="eyebrow">MAIN SERIES</p><h1>${esc(item.name)}</h1><p>${esc(item.description)}</p><div class="group-chips">${chips}</div></div></section><section class="catalog-toolbar"><label>Cari unit<input id="search" type="search" placeholder="Nama, ukuran, atau jenis…"></label><p id="count" class="small" aria-live="polite">${own.length} unit</p></section>${sections}<p id="empty" hidden>Tidak ada unit yang cocok.</p>${dimmer()}<script src="/experience.js" defer></script>`;
    write(`series/${item.slug}/index.html`,shell(item.name,page));
  }
  const qrCards=series.map(item=>`<section class="product-group"><div class="section-top"><h2>${esc(item.name)}</h2><span class="small">${products.filter(p=>p.series===item.slug).length} QR</span></div><div class="grid">${products.filter(p=>p.series===item.slug).map(p=>`<article class="qr-card"><img src="/qr/files/${p.slug}.png" width="300" height="300" alt="QR ${esc(p.name)}"><p class="eyebrow">${esc(p.group)}</p><h3>${esc(p.name)}</h3><a class="button" href="/qr/files/${p.slug}.png" download>Download QR</a><a class="text-link" href="${route(p)}" target="_blank">Preview scan ↗</a></article>`).join('')}</div></section>`).join('');
  write('qr/index.html',shell('Kumpulan QR',`<section class="page-title"><p class="eyebrow">LABEL & PRINT</p><h1>Kumpulan QR</h1><p>${products.length} QR berlogo Kastor, dikelompokkan berdasarkan main series.</p><a class="button" href="/qr/kastor-qr.zip" download>Download semua QR ↓</a></section>${qrCards}`));
  write('404.html',shell('Halaman tidak ditemukan','<section class="page-title"><h1>Halaman tidak ditemukan.</h1><p>Produk lama telah diganti dengan katalog terbaru.</p><a class="button" href="/">Buka katalog baru</a></section>',true));
  const old=['/demo','/demo/','/p/kastor-iris-reguler-matt-white','/p/kastor-iris-reguler-matt-white/','/p/iris-retrofit-downlight-pinhole','/p/iris-retrofit-downlight-pinhole/','/p/iris-retrofit-downlight-pinhole-white','/p/iris-retrofit-downlight-pinhole-white/'];
  write('_redirects',old.map(x=>`${x} / 301`).join('\n')+'\n');
  write('_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  X-Frame-Options: DENY\n/qr/*\n  X-Robots-Tag: noindex, nofollow\n');
  console.log(`Built ${series.length} series pages and ${products.length} product pages.`);
}
module.exports={series,products,route,base};
if(require.main===module) build().catch(error=>{console.error(error);process.exitCode=1;});
