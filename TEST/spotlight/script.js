// spotlight suit le pointeur (souris / tactile).
  const root = document.documentElement;

  // init au centre
  function setPos(x,y){
    root.style.setProperty('--x', x + 'px');
    root.style.setProperty('--y', y + 'px');
  }

  // position initiale au centre de la fenêtre
  setPos(window.innerWidth/2, window.innerHeight/2);

  // utiliser pointer events (gère souris, touch, stylet)
  let isPointerDown = false;
  window.addEventListener('pointermove', (e)=>{
    // si tu veux que le spot suive tout le temps : commenter la condition suivante
    // if (!isPointerDown) return;
    setPos(e.clientX, e.clientY);
  }, {passive:true});

  // activation au touch (optionnel)
  window.addEventListener('pointerdown', ()=> isPointerDown = true);
  window.addEventListener('pointerup', ()=> isPointerDown = false);

  // reposition après redimensionnement
  window.addEventListener('resize', ()=>{
    setPos(window.innerWidth/2, window.innerHeight/2);
  });const stage = document.getElementById('stage');
  const spot  = document.getElementById('spot');
  const beam  = document.getElementById('beam');
  const dust  = document.getElementById('dust');

  // position initiale (centre droite-ish)
  let pos = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.45 };
  spot.style.left = pos.x + 'px';
  spot.style.top  = pos.y + 'px';

  // création de poussières aléatoires
  const DUST = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dust-count')) || 12;
  for(let i=0;i<DUST;i++){
    const s = document.createElement('span');
    const angle = Math.random()*Math.PI*2;
    const r = (Math.random()*0.5 + 0.05) * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spot-size'));
    // position relative au centre du spot
    const dx = Math.round(Math.cos(angle) * r);
    const dy = Math.round(Math.sin(angle) * r * 0.6); // elliptique
    s.style.setProperty('--x', dx + 'px');
    s.style.setProperty('--y', dy + 'px');
    s.style.setProperty('--dur', (4 + Math.random()*6) + 's');
    s.style.left = '50%';
    s.style.top  = '50%';
    dust.appendChild(s);
  }

  // suivre la souris (desktop) et le touch (mobile)
  function moveSpot(x,y){
    // limite pour que le spot reste partiellement visible
    const margin = 20;
    const w = window.innerWidth, h = window.innerHeight;
    pos.x = Math.min(Math.max(x, margin), w - margin);
    pos.y = Math.min(Math.max(y, margin), h - margin);
    spot.style.left = pos.x + 'px';
    spot.style.top  = pos.y + 'px';

    // orienter légèrement le faisceau vers bas-right par exemple selon position
    const centerX = w/2, centerY = h/2;
    const dx = pos.x - centerX;
    const dy = pos.y - centerY;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    beam.style.transform = `translate(-50%,-30%) rotate(${angle}deg)`;
    // déplacer les poussières pour qu'elles suivent le spot
    dust.style.left = (pos.x - w/2) + 'px';
    dust.style.top  = (pos.y - h/2) + 'px';
    dust.style.transform = `translate(${w/2}px, ${h/2}px)`;
  }

  // souris
  window.addEventListener('mousemove', e => {
    moveSpot(e.clientX, e.clientY);
  }, {passive:true});

  // tactile : suivre le doigt
  window.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if(!t) return;
    moveSpot(t.clientX, t.clientY);
  }, {passive:true});

  // petite animation d'entrée : venir du bord
  window.addEventListener('load', () => {
    const startX = window.innerWidth * 0.95;
    const startY = window.innerHeight * 0.25;
    spot.style.transition = 'transform 0.6s ease, left 0.6s ease, top 0.6s ease';
    spot.style.left = startX + 'px';
    spot.style.top  = startY + 'px';
    setTimeout(()=> {
      spot.style.left = pos.x + 'px';
      spot.style.top  = pos.y + 'px';
    }, 70);
    setTimeout(()=> {
      spot.style.transition = '';
    }, 900);
  });

  // réajuster sur resize (nominal)
  window.addEventListener('resize', () => {
    // repositionne sans sortir de l'écran
    moveSpot(pos.x, pos.y);
  });