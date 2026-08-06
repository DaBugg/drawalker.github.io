
const menu=document.querySelector('[data-menu]');const panel=document.querySelector('.mobile-panel');if(menu)menu.addEventListener('click',()=>panel.classList.toggle('open'));
document.querySelectorAll('.faq-q').forEach(b=>b.addEventListener('click',()=>b.parentElement.classList.toggle('open')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(x=>io.observe(x));
const words=document.querySelectorAll('.tagline span');const wi=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){words.forEach((w,i)=>setTimeout(()=>w.classList.add('on'),i*70));wi.disconnect()}}),{threshold:.4});const t=document.querySelector('.tagline');if(t)wi.observe(t);
document.querySelectorAll('form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const btn=f.querySelector('button[type=submit]');btn.textContent='Request received';btn.disabled=true;const m=f.querySelector('[data-success]');if(m)m.hidden=false;}));
