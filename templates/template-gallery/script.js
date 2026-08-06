(()=>{
  const featured=[
    ['01 / PRODUCT DEMONSTRATION','SitePilot Operations','Field operations software shown through a role-based dashboard, live workflow, and mobile field state.','Book a product demo','Interactive dashboard','../sitepilot-operations/index.html','sitepilot'],
    ['02 / TECHNICAL PROCUREMENT','Forgeworks Industrial','A drawing-to-shipment crate reveal with machining media, process selection, inspection record, and RFQ packaging.','Submit an RFQ','Scroll crate reveal','../forgeworks-industrial/index.html','forge-feature'],
    ['03 / FREIGHT + LOGISTICS','FleetAxis Logistics','A video-led quote entry that opens into event-based lane status, handoffs, and shipment control.','Build a freight quote','Video quote + control tower','../fleetaxis-logistics/index.html','fleet-feature'],
    ['04 / HOME SERVICES','RapidRoot Home Services','A photo-led path from problem selection through ZIP and requested service time.','Book service','Three-step booking','../rapidroot-home-services/index.html','rapid-feature']
  ];
  let index=0;
  function render(){const data=featured[index];['index','title','desc','goal','hero'].forEach((key,i)=>document.querySelector(`[data-feature-${key}]`).textContent=data[i]);document.querySelector('[data-feature-link]').href=data[5];document.querySelector('.featured-preview').className=`featured-preview ${data[6]}`}
  document.querySelector('[data-feature=prev]').addEventListener('click',()=>{index=(index+featured.length-1)%featured.length;render()});
  document.querySelector('[data-feature=next]').addEventListener('click',()=>{index=(index+1)%featured.length;render()});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(item=>item.classList.remove('active'));button.classList.add('active');document.querySelectorAll('.concept').forEach(card=>card.classList.toggle('hidden',button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter))}));
  const view=document.querySelector('[data-view]'),grid=document.querySelector('[data-grid]');view.addEventListener('click',()=>{const list=grid.classList.toggle('list');view.setAttribute('aria-pressed',String(list));view.textContent=list?'Grid view':'List view'});
})();
