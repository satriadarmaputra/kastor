const search=document.querySelector('#search');
const series=document.querySelector('#series');
const dimmer=document.querySelector('#dimmer');
if(dimmer){const updateLight=()=>{const value=Number(dimmer.value);document.querySelector('.hero').style.setProperty('--light-level',String(value/100));document.querySelector('#dimmer-value').textContent=`${value}%`;dimmer.setAttribute('aria-valuetext',`${value} persen`);};dimmer.addEventListener('input',updateLight);updateLight();}
const contactDialog=document.querySelector('#contact-dialog');
if(contactDialog){document.querySelector('#contact-open').addEventListener('click',()=>contactDialog.showModal());document.querySelector('#contact-close').addEventListener('click',()=>contactDialog.close());}
if(search&&series){
 const cards=[...document.querySelectorAll('[data-product]')];
 const filter=()=>{let count=0;for(const card of cards){const match=card.dataset.search.includes(search.value.trim().toLowerCase())&&(!series.value||card.dataset.series===series.value);card.hidden=!match;if(match)count++;}document.querySelector('#count').textContent=`${count} produk`;document.querySelector('#empty').hidden=count!==0;};
 search.addEventListener('input',filter);series.addEventListener('change',filter);
}
