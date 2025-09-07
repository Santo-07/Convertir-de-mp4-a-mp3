// Modo oscuro / claro con persistencia
(function theme(){
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const KEY = 'theme-preference';
  function set(dark){
    root.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem(KEY, dark ? 'dark' : 'light');
  }
  // inicial
  const stored = localStorage.getItem(KEY);
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
  set(stored ? stored === 'dark' : prefers);

  btn?.addEventListener('click', ()=>{
    set((root.dataset.theme || 'dark') !== 'dark');
    btn.textContent = (root.dataset.theme === 'dark') ? '🌙' : '☀️';
  });
})();

// Menú móvil
(function nav(){
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  toggle?.addEventListener('click', ()=>{
    const open = menu.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(open));
  });
})();

// Búsqueda interna (filtra tarjetas por data-tags y texto)
(function search(){
  const input = document.getElementById('searchInput');
  const cards = [...document.querySelectorAll('#cardsGrid .card')];
  if(!input || !cards.length) return;

  function normalize(s){ return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,''); }

  input.addEventListener('input', ()=>{
    const q = normalize(input.value.trim());
    cards.forEach(card=>{
      const text = normalize(card.textContent + ' ' + (card.dataset.tags || ''));
      const show = !q || text.includes(q);
      card.style.display = show ? '' : 'none';
    });
  });
})();

// Efecto reveal al hacer scroll (mejora UX)
(function reveal(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.style.transform = 'translateY(0)';
        e.target.style.opacity = '1';
        obs.unobserve(e.target);
      }
    });
  },{threshold:.12});
  document.querySelectorAll('.card,.longform,.deal,.faq__item').forEach(el=>{
    el.style.transform='translateY(18px)';
    el.style.opacity='.001';
    el.style.transition='all .6s cubic-bezier(.2,.7,.1,1)';
    obs.observe(el);
  });
})();
