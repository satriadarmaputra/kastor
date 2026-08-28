const fs = require('node:fs');
const path = require('node:path');
const QRCode = require('qrcode');
const {PNG} = require('pngjs');
const {zipSync} = require('fflate');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const base = 'https://kastor-product.pages.dev';
const demo = require('../data/demo-products.json');
const slugs = ['iris-recessed-matt-white','iris-adjustable-black','linea-magnetic-spot','linea-magnetic-linear','terra-garden-bollard','terra-inground','luna-wall-up-down','nova-pendant','flex-led-strip','flex-led-strip-pro'];
const products = [{name:'Kastor Iris Reguler Matt-White',series:'Iris',slug:'kastor-iris-reguler-matt-white',image:'assets/iris-product.jpg',specs:{Brand:'Kastor',Series:'Iris Series',Type:'Fixture-Deep anti glare (GU10/Module)','Product Size':'D83xH57mm',Cutout:'D75mm','Trim Finishing':'White','Reflector Finishing':'Matt-White'}},...demo.map((p,i)=>({...p,slug:slugs[i],demo:true,image:`assets/demo/${p.id}.png`}))];
const esc = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route = p=>`/p/${p.slug}/`;
const config = JSON.parse(fs.readFileSync(path.join(root,'data/site.json'),'utf8'));
function contact(){return config.contactUrl ? `<button class="contact" type="button" id="contact-open" aria-haspopup="dialog">↗ Contact Us</button><dialog id="contact-dialog" aria-labelledby="contact-title"><button type="button" id="contact-close" aria-label="Close contact">×</button><h2 id="contact-title">Contact Us</h2><p>${esc(config.greeting)}</p><p>How may we assist you today? Please select the services or products you are looking for:</p><ol class="services">${config.services.map((s,i)=>`<li><a href="${config.contactUrl}?text=${encodeURIComponent((i+1)+'. '+s+'\nHello, I would like assistance with this service.')}" target="_blank" rel="noopener noreferrer">${esc(s)} ↗</a></li>`).join('')}</ol><p>Please reply with the number of your preferred option, and our team will assist you accordingly.</p><p><strong>Operational Hours</strong><br>Monday–Friday | 08.30–17.30 WIB</p><p>Messages received outside our operational hours will be responded to during the next operational period.</p><p>Thank you for choosing Dharmawan Group’s products and services!</p><a class="button" href="${config.contactUrl}" target="_blank" rel="noopener noreferrer">Continue to WhatsApp ↗</a><p class="small">Memilih layanan membuka WhatsApp. Pesan baru terkirim setelah Anda menekan Kirim.</p></dialog>` : '';}
function shell(title,body,detail=false){return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)} | Kastor</title><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script></head><body><header>${detail?'<span>':'<a href="/" aria-label="Kastor Home">'}<img src="/brand/kastor-logo-transparent.png" width="2172" height="724" alt="Kastor Lighting">${detail?'</span>':'</a>'}<span class="small">${detail?'PRODUCT INFORMATION':'LIGHT FOR EVERY SPACE.'}</span></header><main>${body}</main><footer>KASTOR <span>Light for Every Space.</span></footer>${contact()}</body></html>`;}
function write(file,data){const target=path.join(out,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,data);}
function picture(p){return `/images/${p.slug}${path.extname(p.image)}`;}
function filters(){return `<section class="filters" aria-label="Cari produk"><label>Cari produk<input id="search" type="search" placeholder="Nama atau jenis lampu…"></label><label>Seri<select id="series"><option value="">Semua seri</option>${[...new Set(products.map(p=>p.series))].map(s=>`<option>${esc(s)}</option>`).join('')}</select></label></section><p id="count" class="small" aria-live="polite">${products.length} produk</p><p id="empty" hidden>Tidak ada produk yang cocok. Coba kata lain atau reset filter.</p>`;}
function cardAttrs(p){return `data-product data-search="${esc((p.name+' '+p.specs.Type).toLowerCase())}" data-series="${esc(p.series)}"`;}
async function qr(p){
 const buffer=await QRCode.toBuffer(base+route(p),{errorCorrectionLevel:'H',margin:4,scale:16,color:{dark:'#573d3eff',light:'#ffffffff'}});
 const png=PNG.sync.read(buffer), logo=PNG.sync.read(fs.readFileSync(path.join(root,'assets/brand/kastor-logo.png')));
 // Small white-backed logo; preserve all finder patterns and the four-module quiet zone.
 const w=Math.floor(png.width*.20),h=Math.round(w*logo.height/logo.width),pad=8,x=Math.floor((png.width-w)/2),y=Math.floor((png.height-h)/2);
 for(let yy=y-pad;yy<y+h+pad;yy++)for(let xx=x-pad;xx<x+w+pad;xx++){const i=(yy*png.width+xx)*4;png.data.fill(255,i,i+4);}
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){const si=(Math.floor(yy*logo.height/h)*logo.width+Math.floor(xx*logo.width/w))*4,di=((y+yy)*png.width+x+xx)*4;for(let k=0;k<3;k++)png.data[di+k]=Math.round(logo.data[si+k]*logo.data[si+3]/255+255*(1-logo.data[si+3]/255));png.data[di+3]=255;}
 return PNG.sync.write(png);
}
async function build(){
 // Only remove this repository's generated build directory, never source assets.
 if(out!==path.resolve(__dirname,'../dist'))throw Error('Unexpected output path');
 if(fs.existsSync(out)&&fs.lstatSync(out).isSymbolicLink())throw Error('Refuse symlink output');
 fs.rmSync(out,{recursive:true,force:true});
 fs.mkdirSync(out,{recursive:true});
 for(const name of ['kastor-logo.png','kastor-logo-transparent.png','sora-medium.ttf','sora-bold.ttf'])write('brand/'+name,fs.readFileSync(path.join(root,'assets/brand',name)));
 for(const name of ['site.css','site.js','experience.js'])write(name,fs.readFileSync(path.join(root,'source',name)));
 write('favicon.ico',fs.readFileSync(path.join(root,'source/favicon.ico')));
 const archive={};
 for(const p of products){
  write(picture(p).slice(1),fs.readFileSync(path.join(root,p.image)));
  const rows=Object.entries({Series:p.series+' Series',...p.specs}).map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  const warning=p.demo?'<p class="notice"><strong>DATA DUMMY</strong> — Foto ilustrasi AI dan spesifikasi contoh, bukan acuan pembelian atau pemasangan.</p>':'';
  write(`p/${p.slug}/index.html`,shell(p.name,`${warning}<section class="detail"><figure><img class="product-image" src="${picture(p)}" alt="${esc(p.name)}${p.demo?' — ilustrasi AI':''}" fetchpriority="high"></figure><div><p class="eyebrow">${esc(p.series)} SERIES</p><h1>${esc(p.name)}</h1>${p.status==='discontinued'?'<p class="notice">Produk ini sudah tidak diproduksi.</p>':''}<h2 class="spec-heading">Spesifikasi ${p.demo?'contoh':'produk'}</h2><dl>${rows}</dl></div></section>`,true));
  const png=await qr(p);write(`qr/files/${p.slug}.png`,png);archive[`${p.slug}.png`]=png;
 }
 write('qr/kastor-qr.zip',zipSync(archive));
 const cards=products.map(p=>`<article class="card" ${cardAttrs(p)}><a href="${route(p)}"><div class="photo"><img src="${picture(p)}" alt="${esc(p.name)}" loading="lazy"></div><p class="eyebrow">${esc(p.series)} SERIES ${p.demo?' · DEMO':''}</p><h2>${esc(p.name)}</h2><span class="small">Lihat spesifikasi ↗</span></a><div class="card-qr"><details><summary>Preview QR<span class="sr-only"> ${esc(p.name)}</span></summary><img src="/qr/files/${p.slug}.png" width="300" height="300" loading="lazy" alt="QR ${esc(p.name)}"><p class="small">Scan untuk membuka spesifikasi produk.</p></details><a class="button" href="/qr/files/${p.slug}.png" download="${p.slug}.png">Download QR<span class="sr-only"> ${esc(p.name)}</span> ↓</a></div></article>`).join('');
 write('index.html',shell('Product Collection',`<section class="hero"><p class="eyebrow">KASTOR LIGHTING / COLLECTION</p><h1>Light for<br><em>Every Space.</em></h1><p>Temukan pencahayaan untuk setiap sudut ruang.</p><a href="#collection" class="button">Jelajahi koleksi ↓</a><span class="hero-circle" aria-hidden="true"></span><div class="light-scene" aria-hidden="true"><span class="pendant-cord"></span><span class="pendant-shade"></span><span class="light-beam"></span><span class="light-pool"></span></div><div class="dimmer"><div class="dimmer-heading"><label for="dimmer">Set the mood</label><output id="dimmer-value" for="dimmer">70%</output></div><input id="dimmer" type="range" min="0" max="100" value="70" aria-label="Kecerahan efek lampu" aria-valuetext="70 persen"><div class="dimmer-labels"><span>Redup</span><span>Terang</span></div><small>Simulasi cahaya · geser untuk mencoba</small></div></section><script src="/experience.js" defer></script><section class="featured-story"><div class="featured-photo"><img src="/images/kastor-iris-reguler-matt-white.jpg" alt="Kastor Iris Reguler Matt-White" loading="lazy"></div><div class="featured-copy"><p class="eyebrow">IN THE SPOTLIGHT / IRIS SERIES</p><h2>Small details.<br>Beautiful light.</h2><p>Kenali Iris Reguler Matt-White. Lihat detail ukuran, cutout, dan finishing untuk kebutuhan ruang Anda.</p><a class="button" href="/p/kastor-iris-reguler-matt-white/">Explore Iris ↗</a></div></section><section id="collection"><div class="section-top"><h2>Our collection</h2><span class="small">1 produk · 10 contoh demo</span></div><p class="notice">Produk berlabel DEMO menggunakan foto AI dan spesifikasi dummy.</p>${filters()}<div class="grid">${cards}</div></section>`));
 const qrCards=products.map(p=>`<article class="qr-card" ${cardAttrs(p)}><img src="/qr/files/${p.slug}.png" width="300" height="300" alt="QR ${esc(p.name)}"><p class="eyebrow">${p.demo?'DEMO · '+esc(p.id):'PRODUK KASTOR'}</p><h2>${esc(p.name)}</h2><a class="button" href="/qr/files/${p.slug}.png" download>Download QR</a><a class="text-link" href="${route(p)}" target="_blank" rel="noopener">Cek halaman scan ↗</a></article>`).join('');
 write('qr/index.html',shell('Kumpulan QR',`<section class="page-title"><p class="eyebrow">LABEL & PRINT</p><h1>Kumpulan QR</h1><p>QR berlogo Kastor. Scan langsung membuka spesifikasi produk.</p><p class="notice">Halaman ini publik, bukan panel admin dengan login. Jangan simpan data rahasia di sini. Sepuluh QR demo hanya untuk pengujian.</p><a class="button" href="/qr/kastor-qr.zip" download>Download semua QR ↓</a></section>${filters()}<div class="grid">${qrCards}</div>`));
 write('404.html',shell('Halaman tidak ditemukan','<h1>Halaman tidak ditemukan.</h1><p>Periksa kembali alamat atau QR produk Anda.</p>',true));
 const redirects=['/demo / 301','/demo/ / 301',...demo.flatMap((p,i)=>[`/demo/p/${p.id} /p/${slugs[i]}/ 301`,`/demo/p/${p.id}/ /p/${slugs[i]}/ 301`])];
 write('_redirects',redirects.join('\n')+'\n');
 write('_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  X-Frame-Options: DENY\n/qr/*\n  X-Robots-Tag: noindex, nofollow\n');
 console.log(`Built ${products.length} customer pages, Home, QR collection and branded QR ZIP.`);
}
module.exports={products,route,base};
if(require.main===module)build().catch(e=>{console.error(e);process.exitCode=1;});


