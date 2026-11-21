(() => {
  const d = document;
  d.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const els = d.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) els.forEach(e => e.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach((e, i) => { e.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(e); });
  }

  // Mobile menu
  const toggle = d.querySelector('.menu-toggle'), links = d.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', open); links.classList.toggle('open', open);
    toggle.querySelector('.sr').textContent = open ? 'Close menu' : 'Open menu';
  });
  links.addEventListener('click', e => { if (e.target.closest('a') && toggle.getAttribute('aria-expanded') === 'true') toggle.click(); });
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { toggle.click(); toggle.focus(); } });

  // Process progress bar tied to scroll
  const proc = d.getElementById('process'), bar = d.querySelector('.progress');
  const onScroll = () => {
    const r = proc.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(Math.max((vh - r.top) / (r.height + vh * .3), 0), 1);
    bar.style.setProperty('--p', reduce ? 1 : p.toFixed(3));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Illustrative estimator
  const kwh = d.getElementById('kwh'), out = d.getElementById('kwh-out');
  const set = (id, v) => { const el = d.getElementById(id); if (el.textContent !== String(v)) { el.textContent = v; if (!reduce) { el.classList.add('bump'); setTimeout(() => el.classList.remove('bump'), 160); } } };
  const calc = () => {
    const m = +kwh.value; out.value = out.textContent = m;
    const kw = (m * 12) / 950, panels = Math.ceil(kw * 1000 / 400);
    set('o-kw', kw.toFixed(1)); set('o-panels', panels); set('o-area', panels * 2);
  };
  kwh.addEventListener('input', calc); calc();

  const form = d.getElementById('survey');
  form.addEventListener('submit', e => { e.preventDefault(); form.querySelector('.form-status').textContent = 'Demo only — nothing was sent.'; });
})();
