const search=document.querySelector('#search');
const series=document.querySelector('#series');
const dimmer=document.querySelector('#dimmer');
if(dimmer){
 const root=document.documentElement;
 const mix=(dark,light,t)=>`rgb(${dark.map((v,i)=>Math.round(v+(light[i]-v)*t)).join(', ')})`;
 const updateLight=()=>{
  const value=Math.max(0,Math.min(100,Number(dimmer.value))),level=value/100;
  root.style.setProperty('--light-level',String(level));
  const tones={bg:[[166,148,128],[248,246,242]],text:[[45,31,28],[87,61,62]],panel:[[184,166,145],[255,255,255]],muted:[[57,40,32],[120,100,100]],accent:[[82,33,23],[127,57,46]],line:[[101,82,71],[222,215,204]],hero:[[18,15,15],[87,61,62]]};
  for(const [name,[dark,light]] of Object.entries(tones))root.style.setProperty('--ambient-'+name,mix(dark,light,level));
  root.style.setProperty('--ambient-photo',String(.65+.35*level));
  document.querySelector('#dimmer-value').textContent=`${value}%`;
  dimmer.setAttribute('aria-valuetext',`${value} persen`);
 };dimmer.addEventListener('input',updateLight);updateLight();
}
const contactDialog=document.querySelector('#contact-dialog');
if(contactDialog){document.querySelector('#contact-open').addEventListener('click',()=>contactDialog.showModal());document.querySelector('#contact-close').addEventListener('click',()=>contactDialog.close());}
if(search&&series){
 const cards=[...document.querySelectorAll('[data-product]')];
 const submenu=document.querySelector('#subcategory-menu');
 let subcategory='';
 const subButtons=submenu?[...submenu.querySelectorAll('button')]:[];
 const filter=()=>{if(submenu)submenu.hidden=series.value!=='Iris';for(const button of subButtons)button.setAttribute('aria-pressed',String(button.dataset.subcategory===subcategory));let count=0;for(const card of cards){const match=card.dataset.search.includes(search.value.trim().toLowerCase())&&(!series.value||card.dataset.series===series.value)&&(!subcategory||card.dataset.subcategory===subcategory);card.hidden=!match;if(match)count++;}document.querySelector('#count').textContent=`${count} produk`;document.querySelector('#empty').hidden=count!==0;};
 for(const button of subButtons)button.addEventListener('click',()=>{subcategory=button.dataset.subcategory;filter();});
 search.addEventListener('input',filter);series.addEventListener('change',()=>{subcategory='';filter();});
}

