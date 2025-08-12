const magnifier = document.getElementById('magnifier');
const zoom = 2;

document.addEventListener('mousemove', e => {
  magnifier.style.display = 'block';

  // Taille loupe
  const w = magnifier.offsetWidth / 2;
  const h = magnifier.offsetHeight / 2;

  // Position loupe (centrée sur la souris)
  let x = e.clientX - w;
  let y = e.clientY - h;

  // Empêcher loupe de sortir de l'écran (optionnel)
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + magnifier.offsetWidth > window.innerWidth) x = window.innerWidth - magnifier.offsetWidth;
  if (y + magnifier.offsetHeight > window.innerHeight) y = window.innerHeight - magnifier.offsetHeight;

  magnifier.style.left = x + 'px';
  magnifier.style.top = y + 'px';

  // Fond = screenshot de la page (en fait, on prend le body en background)
  // Comme on ne peut pas faire un vrai screenshot, on utilise une astuce :
  // On fixe le background à body, et on décale le background pour simuler le zoom sur la souris
  magnifier.style.backgroundImage = `url('')`; // PAS D'IMAGE car pas faisable directement ici

  // Solution alternative : on copie la page dans la loupe avec scale transform

  // Mais ici on va faire un truc plus simple avec une astuce : on va cloner le body, zoomer et positionner le clone sous la loupe.

});

// Option : afficher ou cacher la loupe quand on quitte la fenêtre
document.addEventListener('mouseout', e => {
  if (!e.relatedTarget) magnifier.style.display = 'none';
});
