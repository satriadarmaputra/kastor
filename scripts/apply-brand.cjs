const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../dist');
fs.mkdirSync(path.join(root,'brand'),{recursive:true});
for(const f of ['brand.css','kastor-logo.png','sora-medium.ttf','sora-bold.ttf'])fs.copyFileSync(path.join(__dirname,'../assets/brand',f),path.join(root,'brand',f));
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,item.name);if(item.isDirectory())walk(p);else if(item.name.endsWith('.html')){
let s=fs.readFileSync(p,'utf8');
s=s.replace('</head>','<link rel="stylesheet" href="/brand/brand.css"></head>');
s=s.replace(/(<a\b[^>]*class="wordmark"[^>]*>)[\s\S]*?<\/a>/g,'$1<img class="brand-logo" src="/brand/kastor-logo.png" alt="Kastor Lighting" width="680" height="222"></a>');
s=s.replace('10 produk.<br>Satu sistem yang rapi.','Light for<br>Every Space.');
s=s.replace('PRODUCT DEMO','PRODUCT COLLECTION / DEMO');
s=s.replace('10 produk · 1 template · 10 QR','Light for Every Space.');
fs.writeFileSync(p,s);
}}}
walk(root);
console.log('Applied Kastor GSM palette, official logo artwork and Sora fonts to all product pages.');
