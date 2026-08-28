// Progressive Home interactions; scan pages remain unchanged.
const collection=document.querySelector('#collection');
if(collection){
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const select=document.querySelector('#series');
 const chips=document.createElement('div');chips.className='series-chips';chips.setAttribute('aria-label','Pilih seri');
 for(const option of select.options){const button=document.createElement('button');button.type='button';button.textContent=option.textContent;button.dataset.value=option.value;button.setAttribute('aria-pressed',String(option.selected));button.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change'));});chips.append(button);}
 document.querySelector('.filters').after(chips);
 select.addEventListener('change',()=>{for(const button of chips.children)button.setAttribute('aria-pressed',String(button.dataset.value===select.value));});
 const animateResults=()=>{if(!reduced.matches)document.querySelectorAll('.card:not([hidden])').forEach((card,i)=>{card.getAnimations().forEach(animation=>animation.cancel());card.animate([{opacity:.45,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,delay:Math.min(i*20,100),easing:'ease-out'});});};
 select.addEventListener('change',animateResults);document.querySelector('#search').addEventListener('input',animateResults);
 const reset=document.createElement('button');reset.className='reset-filter';reset.type='button';reset.textContent='Reset pencarian ↺';reset.addEventListener('click',()=>{document.querySelector('#search').value='';select.value='';select.dispatchEvent(new Event('change'));});document.querySelector('#empty').append(reset);
 const original=document.querySelector('#dimmer');
 const dock=document.createElement('aside');dock.className='light-dock';dock.setAttribute('aria-label','Kontrol cahaya halaman');dock.hidden=true;
 dock.innerHTML='<label for="dock-dimmer">☀ Cahaya <output id="dock-value" for="dock-dimmer">70%</output></label><input id="dock-dimmer" type="range" min="0" max="100" value="70" aria-label="Cahaya halaman">';document.body.append(dock);
 const mirror=dock.querySelector('input'),value=dock.querySelector('output');
 const sync=()=>{mirror.value=original.value;value.textContent=original.value+'%';};
 original.addEventListener('input',sync);mirror.addEventListener('input',()=>{original.value=mirror.value;original.dispatchEvent(new Event('input'));});sync();
 if('IntersectionObserver' in window){
  const dockObserver=new IntersectionObserver(entries=>{dock.hidden=entries[0].isIntersecting;},{threshold:0});dockObserver.observe(document.querySelector('.hero'));
  const reveal=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){if(!reduced.matches)entry.target.animate([{opacity:.3,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.2,.7,.2,1)'});reveal.unobserve(entry.target);}}},{threshold:.08});
  document.querySelectorAll('.card,.featured-story').forEach(el=>reveal.observe(el));
 }
 document.querySelectorAll('.card details').forEach(details=>details.addEventListener('toggle',()=>{if(details.open){for(const other of document.querySelectorAll('.card details'))if(other!==details)other.open=false;}}));
}
