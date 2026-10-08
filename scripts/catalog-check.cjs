const fs=require('node:fs'),path=require('node:path'),jsQR=require('jsqr');
const {PNG}=require('pngjs');
const {series,products,route,base}=require('./catalog-storefront.cjs');
const dist=path.resolve(__dirname,'../dist');
const assert=(ok,message)=>{if(!ok)throw Error(message);};
assert(series.length===5,'Expected 5 main series');assert(products.length===43,`Expected 43 units, got ${products.length}`);
for(const item of series)assert(fs.existsSync(path.join(dist,'series',item.slug,'index.html')),`Missing series ${item.slug}`);
for(const product of products){const htmlPath=path.join(dist,'p',product.slug,'index.html');assert(fs.existsSync(htmlPath),`Missing ${product.slug}`);const html=fs.readFileSync(htmlPath,'utf8');assert(!/Art No|ART Number|KST-DEMO/.test(html),`Internal code leaked in ${product.slug}`);assert(!html.includes('href="/"'),`Scan page links to catalog: ${product.slug}`);const png=PNG.sync.read(fs.readFileSync(path.join(dist,'qr','files',product.slug+'.png')));const decoded=jsQR(new Uint8ClampedArray(png.data),png.width,png.height);assert(decoded?.data===base+route(product),`QR decode failed ${product.slug}`);}
const home=fs.readFileSync(path.join(dist,'index.html'),'utf8');assert(!home.includes('KST-DEMO')&&!home.includes('kastor-iris-reguler-matt-white'),'Old listing remains');assert(fs.existsSync(path.join(dist,'qr','kastor-qr.zip')),'Missing QR ZIP');console.log(`Checked ${series.length} series, ${products.length} pages and all branded QR codes.`);
