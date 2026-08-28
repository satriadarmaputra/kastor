const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {PNG}=require('pngjs'),jsQR=require('jsqr'),{unzipSync}=require('fflate');
const {products,route,base}=require('./storefront.cjs');
const root=path.resolve(__dirname,'../dist');
let pages=0;
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.html')){pages++;const s=fs.readFileSync(p,'utf8');for(const m of s.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);}assert.ok(s.includes('/site.css'));}}}
walk(root);assert.equal(pages,products.length+3);
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(home.includes('/experience.js'));
assert.equal((home.match(/id="dimmer"/g)||[]).length,1);
assert.ok(home.includes('<aside class="light-dock"'));
assert.ok(!home.split('<section class="hero">')[1].split('</section>')[0].includes('id="dimmer"'));
new (require('node:vm').Script)(fs.readFileSync(path.join(root,'experience.js'),'utf8'));
assert.equal((home.match(/<details>/g)||[]).length,products.length);
for(const p of products){assert.ok(home.includes(`download="${p.slug}.png"`));assert.ok(home.includes(`alt="QR ${p.name}"`));}
for(const p of products){
 const html=fs.readFileSync(path.join(root,route(p),'index.html'),'utf8');
 assert.ok(!/KST-DEMO-|Product ID|SKU|qr\/|data-product|href="\/"/.test(html),'Customer page must not contain internal IDs, QR links or catalogue navigation');
 assert.ok(html.includes(p.name));assert.ok(html.includes('contact-dialog'));
 assert.ok(!html.includes('/experience.js'),'Home enhancements must not load on scan pages');
 if(p.demo)assert.ok(html.includes('DATA DUMMY'));
 const png=PNG.sync.read(fs.readFileSync(path.join(root,'qr/files',p.slug+'.png')));
 for(const size of [png.width,300]){
  const rgba=new Uint8ClampedArray(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){const src=(Math.floor(y*png.height/size)*png.width+Math.floor(x*png.width/size))*4;rgba.set(png.data.subarray(src,src+4),(y*size+x)*4);}
  assert.equal(jsQR(rgba,size,size)?.data,base+route(p),'Branded QR must decode at '+size+'px');
 }
}
assert.equal(Object.keys(unzipSync(fs.readFileSync(path.join(root,'qr/kastor-qr.zip')))).length,products.length);
assert.ok(!fs.existsSync(path.join(root,'demo/products-demo.json')));
const redirects=fs.readFileSync(path.join(root,'_redirects'),'utf8');
for(const p of products.filter(p=>p.demo))assert.ok(redirects.includes(`/demo/p/${p.id} ${route(p)} 301`));
// Exercise the actual browser filter and contact handlers against small DOM fixtures.
const vm=require('node:vm');const nodes={};
for(const id of ['search','series','count','empty','contact-open','contact-close','contact-dialog'])nodes['#'+id]={value:'',handlers:{},addEventListener(type,cb){this.handlers[type]=cb;},showModal(){this.open=true;},close(){this.open=false;}};
nodes['#dimmer']={value:'70',handlers:{},addEventListener(type,cb){this.handlers[type]=cb;},setAttribute(name,value){this[name]=value;}};
nodes['#dimmer-value']={};nodes['.hero']={style:{setProperty(name,value){this[name]=value;}}};
const cards=products.map(p=>({dataset:{search:(p.name+' '+p.specs.Type).toLowerCase(),series:p.series},hidden:false}));
vm.runInNewContext(fs.readFileSync(path.join(root,'site.js'),'utf8'),{document:{documentElement:nodes['.hero'],querySelector:s=>nodes[s],querySelectorAll:()=>cards}});
for(const value of ['0','70','100']){nodes['#dimmer'].value=value;nodes['#dimmer'].handlers.input();assert.equal(nodes['.hero'].style['--light-level'],String(Number(value)/100));assert.equal(nodes['#dimmer-value'].textContent,value+'%');}
assert.equal(nodes['.hero'].style['--ambient-bg'],'rgb(248, 246, 242)');
nodes['#dimmer'].value='0';nodes['#dimmer'].handlers.input();assert.equal(nodes['.hero'].style['--ambient-bg'],'rgb(166, 148, 128)');assert.equal(nodes['.hero'].style['--ambient-photo'],'0.65');
nodes['#search'].value='magnetic';nodes['#search'].handlers.input();assert.equal(cards.filter(c=>!c.hidden).length,2);
nodes['#series'].value='Iris';nodes['#series'].handlers.change();assert.ok(nodes['#empty'].hidden===false);
nodes['#search'].value='';nodes['#series'].value='';nodes['#search'].handlers.input();assert.equal(cards.filter(c=>!c.hidden).length,products.length);
nodes['#contact-open'].handlers.click();assert.equal(nodes['#contact-dialog'].open,true);nodes['#contact-close'].handlers.click();assert.equal(nodes['#contact-dialog'].open,false);
console.log('Passed: all pages, customer privacy checks, QR decoding, ZIP, redirects, filters and contact handlers.');


