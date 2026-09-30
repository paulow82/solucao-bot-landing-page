(() => {
  const root = document.querySelector('.real-product');
  if (!root) return;
  root.classList.add('animation-ready');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [
    {image:'assets/kanban-demo.webp', label:'CRM · Kanban', title:'Cada oportunidade, no lugar certo.', description:'Organize o funil e acompanhe suas negociações em uma visão só.', point:[77,6.5], focus:[9.5,21,66,69], alt:'Kanban da plataforma com empresa, contatos e negociações fictícios.'},
    {image:'assets/insights-demo.webp', label:'Gestão · Relatórios', title:'Os números que ajudam a decidir.', description:'Visualize volume de atendimento, etapas do funil e indicadores da operação.', point:[39,45], focus:[9.5,35.5,86,17], alt:'Indicadores e gráficos com dados ilustrativos da empresa fictícia Aurora Casa.'},
    {image:'assets/fluxos-demo.webp', label:'Automação · Fluxos', title:'Suas regras. Uma rotina mais inteligente.', description:'Conecte gatilhos, condições e ações em um fluxo visual.', point:[58,61], focus:[13,41,53,27], alt:'Exemplo ilustrativo do fluxo Comente eu quero, com conta fictícia do Instagram.'},
    {image:'assets/automacoes-demo.webp', label:'Operação · Automações', title:'Menos tarefas repetidas no seu dia.', description:'Gerencie os fluxos e acompanhe quais automações estão ativas.', point:[65,35], focus:[8,15,90,56], alt:'Cinco automações ilustrativas, incluindo Comente eu quero no Instagram.'},
    {image:'assets/conversas-demo.webp', label:'Atendimento · Conversas', title:'Tudo começa com uma boa conversa.', description:'Abertas, pendentes e finalizadas: cada atendimento no seu lugar.', point:[72,57], focus:[31,17,65,70], alt:'Conversas ilustrativas da Aurora Casa com nomes e mensagens fictícios.'}
  ];
  scenes.forEach(scene => { const img = new Image(); img.src = scene.image; });
  const stage = document.getElementById('real-stage');
  const menu = document.getElementById('real-menu');
  const cursor = document.getElementById('demo-cursor');
  const spotlight = document.getElementById('demo-spotlight');
  const toggle = document.getElementById('demo-play');
  const menuToggle = document.getElementById('demo-menu-toggle');
  let front = document.getElementById('demo-image');
  let back = document.getElementById('demo-next');
  let index = 0, elapsed = 0, visible = false, paused = reduced.matches;
  let hoveringMenu = false, phase = -1, transitionId = 0, countElapsed = 0;
  const duration = 6500;
  function syncPlay() {
    root.classList.toggle('is-paused', paused || reduced.matches);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Reproduzir apresentação automática' : 'Pausar apresentação automática');
    toggle.querySelector('.pause-symbol').textContent = paused ? '▶' : 'Ⅱ';
    toggle.querySelector('.play-text').textContent = paused ? 'Reproduzir' : 'Pausar';
    if (paused) { setMenu(false,true); setCounts(1400); }
  }
  function setMenu(open, automatic = false) {
    menu.classList.toggle(automatic ? 'auto-expand' : 'expanded', open);
    const expanded = menu.classList.contains('expanded') || menu.classList.contains('auto-expand');
    menuToggle.setAttribute('aria-expanded', String(expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Recolher menu' : 'Expandir menu');
  }
  function setSceneDetails() {
    const scene = scenes[index];
    stage.dataset.activeScene = String(index);
    document.getElementById('demo-title').textContent = scene.title;
    document.getElementById('demo-description').textContent = scene.description;
    document.getElementById('demo-chapter').textContent = String(index+1).padStart(2,'0') + ' / 05';
    document.getElementById('real-scene-label').textContent = scene.label;
    root.querySelectorAll('[data-scene]').forEach(button => {
      const active = Number(button.dataset.scene) === index;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    spotlight.style.opacity = '0';
    const [x,y,w,h] = scene.focus;
    Object.assign(spotlight.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
    countElapsed = (reduced.matches || paused) ? 1400 : 0;
    setCounts(countElapsed);
  }
  async function selectScene(next, manual = false) {
    if (manual) { paused = true; syncPlay(); }
    const request = ++transitionId;
    const candidate = new Image(); candidate.src = scenes[next].image;
    try { await candidate.decode(); } catch { return; }
    if (request !== transitionId) return;
    index = next; elapsed = 0; phase = -1;
    back.src = scenes[index].image; back.alt = scenes[index].alt;
    back.removeAttribute('aria-hidden'); front.setAttribute('aria-hidden','true');
    stage.classList.remove('is-switching');
    void stage.offsetWidth;
    stage.classList.add('is-switching');
    const incoming = back, outgoing = front;
    incoming.classList.remove('scene-enter','scene-exit');
    outgoing.classList.remove('scene-enter','scene-exit');
    incoming.classList.add('current','scene-enter');
    outgoing.classList.add('scene-exit');
    outgoing.classList.remove('current');
    [front,back] = [back,front];
    setSceneDetails();
    window.setTimeout(() => {
      if (request === transitionId) stage.classList.remove('is-switching');
      incoming.classList.remove('scene-enter');
      outgoing.classList.remove('scene-exit');
    }, 920);
  }
  function setCounts(ms) {
    if (index !== 1) return;
    const progress = Math.min(1,ms/1400);
    const eased = 1-Math.pow(1-progress,3);
    stage.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = Math.round(Number(el.dataset.count) * eased).toLocaleString('pt-BR');
    });
  }
  function animateScene() {
    const nextPhase = elapsed < 450 ? 0 : elapsed < 1450 ? 1 : elapsed < 2450 ? 2 : elapsed < 3200 ? 3 : 4;
    if (nextPhase === phase) return;
    phase = nextPhase;
    if (phase === 0) { cursor.style.left='2.7%'; cursor.style.top=(25+index*7)+'%'; spotlight.style.opacity='0'; }
    if (phase === 1) setMenu(true,true);
    if (phase === 2) { setMenu(false,true); cursor.style.left=scenes[index].point[0]+'%'; cursor.style.top=scenes[index].point[1]+'%'; }
    if (phase === 3) { cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click'); }
    if (phase === 4) spotlight.style.opacity='1';
  }
  root.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => selectScene(Number(button.dataset.scene),true)));
  toggle.addEventListener('click', () => { paused=!paused; elapsed=0; phase=-1; syncPlay(); });
  let pointerInMenu = false, keyboardInMenu = false;
  function syncMenuInteraction() {
    hoveringMenu = pointerInMenu || keyboardInMenu;
    setMenu(hoveringMenu);
  }
  menu.addEventListener('pointerenter', event => {
    if(event.pointerType==='mouse') { pointerInMenu=true; syncMenuInteraction(); }
  });
  menu.addEventListener('pointerleave', () => { pointerInMenu=false; syncMenuInteraction(); });
  menu.addEventListener('focusin', event => {
    if(event.target.matches(':focus-visible')) { keyboardInMenu=true; syncMenuInteraction(); }
  });
  menu.addEventListener('focusout', event => {
    if(!menu.contains(event.relatedTarget)) { keyboardInMenu=false; syncMenuInteraction(); }
  });
  menuToggle.addEventListener('click', () => {
    if (!pointerInMenu) {
      const open = !menu.classList.contains('expanded');
      keyboardInMenu = open;
      hoveringMenu = open;
      setMenu(open);
    }
  });
  menu.addEventListener('keydown', event => {
    if(event.key==='Escape') { keyboardInMenu=false; pointerInMenu=false; setMenu(false); setMenu(false,true); }
  });
  document.getElementById('demo-expand').addEventListener('click', () => {
    paused=true; syncPlay();
    const img=document.getElementById('expanded-screenshot'); img.src=scenes[index].image; img.alt=scenes[index].alt;
    document.getElementById('screenshot-dialog').showModal();
  });
  const mobileRoot=document.querySelector('.real-mobile-preview');
  const mobileWindow=document.getElementById('mobile-capture-window');
  const mobileImage=document.getElementById('mobile-real-image');
  const mobilePlay=document.getElementById('mobile-play');
  let mobileIndex=0, mobileElapsed=0, mobilePaused=reduced.matches, mobileVisible=false, mobileRequest=0;
  const mobileScenes=[scenes[4],scenes[0],scenes[1]];
  function syncMobilePlay() {
    mobileRoot.classList.toggle('is-paused',mobilePaused||reduced.matches);
    mobilePlay.textContent=mobilePaused?'▶':'Ⅱ';
    mobilePlay.setAttribute('aria-pressed',String(mobilePaused));
    mobilePlay.setAttribute('aria-label',mobilePaused?'Reproduzir animação mobile':'Pausar animação mobile');
  }
  async function selectMobile(next,manual=false) {
    if(manual){mobilePaused=true;syncMobilePlay();}
    const token=++mobileRequest;
    const probe=new Image();probe.src=mobileScenes[next].image;
    try{await probe.decode();}catch{return;}
    if(token!==mobileRequest)return;
    mobileIndex=next;mobileElapsed=0;
    mobileImage.src=mobileScenes[next].image;mobileImage.alt='Enquadramento adaptado. '+mobileScenes[next].alt;
    mobileWindow.dataset.mobileScene=String(next);
    mobileWindow.classList.remove('is-animating');void mobileWindow.offsetWidth;
    if(!mobilePaused&&!reduced.matches)mobileWindow.classList.add('is-animating');
    mobileRoot.querySelectorAll('button[data-mobile-scene]').forEach(button=>{const active=Number(button.dataset.mobileScene)===next;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  }
  mobileRoot.querySelectorAll('button[data-mobile-scene]').forEach(button=>button.addEventListener('click',()=>selectMobile(Number(button.dataset.mobileScene),true)));
  mobilePlay.addEventListener('click',()=>{mobilePaused=!mobilePaused;syncMobilePlay();if(!mobilePaused){mobileWindow.classList.remove('is-animating');void mobileWindow.offsetWidth;mobileWindow.classList.add('is-animating');mobileElapsed=0;}});
  let entered=false;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.target===root){visible=entry.isIntersecting;if(visible&&!entered){entered=true;elapsed=-1700;root.classList.add('has-entered');window.setTimeout(()=>document.getElementById('demo-boot')?.remove(),1900);}}else{mobileVisible=entry.isIntersecting;mobileWindow.classList.toggle('is-animating',mobileVisible&&!mobilePaused&&!reduced.matches);}}),{threshold:.12});
  observer.observe(root);observer.observe(mobileRoot);
  reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;mobilePaused=true;}syncPlay();syncMobilePlay();setCounts(1400);});
  let last=performance.now();
  function frame(now){
    const delta=Math.min(now-last,80);last=now;
    if(!document.hidden){
      if(visible&&!paused&&!reduced.matches&&!hoveringMenu){elapsed+=delta;countElapsed+=delta;animateScene();setCounts(countElapsed);root.style.setProperty('--demo-progress',String(Math.max(0,Math.min(1,elapsed/duration))));if(elapsed>=duration){elapsed=0;selectScene((index+1)%scenes.length);}}
      if(mobileVisible&&!mobilePaused&&!reduced.matches){mobileElapsed+=delta;if(mobileElapsed>=duration){mobileElapsed=0;selectMobile((mobileIndex+1)%mobileScenes.length);}}
    }
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange',()=>{mobileWindow.style.animationPlayState=document.hidden?'paused':'running';mobileImage.style.animationPlayState=document.hidden?'paused':'';});
  setSceneDetails();syncPlay();syncMobilePlay();requestAnimationFrame(frame);
})();
