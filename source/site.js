document.addEventListener('DOMContentLoaded',()=>{
  const search=document.querySelector('#search'),cards=[...document.querySelectorAll('[data-product]')],count=document.querySelector('#count'),empty=document.querySelector('#empty'),groups=[...document.querySelectorAll('.product-group')];
  function filter(){if(!search)return;const query=search.value.trim().toLowerCase();let visible=0;cards.forEach(card=>{const show=!query||card.dataset.search.includes(query);card.hidden=!show;if(show)visible++;});groups.forEach(group=>{const own=[...group.querySelectorAll('[data-product]')];group.hidden=own.length>0&&!own.some(card=>!card.hidden);});if(count)count.textContent=`${visible} unit`;if(empty)empty.hidden=visible!==0;}
  search?.addEventListener('input',filter);
  const dimmer=document.querySelector('#dimmer'),output=document.querySelector('#dimmer-value');function light(){if(!dimmer)return;const value=Number(dimmer.value);document.documentElement.style.setProperty('--light-level',value/100);if(output)output.textContent=value+'%';dimmer.setAttribute('aria-valuetext',value+' persen');}dimmer?.addEventListener('input',light);light();
});
