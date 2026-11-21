(() => {
  const d = document, root = d.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveals
  const els = d.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) els.forEach(e => e.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach((e, i) => { e.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(e); });
  }

  // Sticky nav state
  const nav = d.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  const toggle = d.querySelector('.menu-toggle'), links = d.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', open); links.classList.toggle('open', open);
    toggle.querySelector('.sr').textContent = open ? 'Close menu' : 'Open menu';
  });
  links.addEventListener('click', e => { if (e.target.closest('a') && toggle.getAttribute('aria-expanded') === 'true') toggle.click(); });

  // Accessible tabs (arrow keys)
  const tabs = [...d.querySelectorAll('[role=tab]')];
  const select = t => {
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; d.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (k) { const n = tabs[(i + k + tabs.length) % tabs.length]; select(n); n.focus(); e.preventDefault(); }
    });
  });

  // Count-up stats
  if (!reduce && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io2.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, t0 = performance.now();
      const step = t => { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      el.textContent = '0'; requestAnimationFrame(step);
    }), { threshold: .6 });
    d.querySelectorAll('[data-count]').forEach(e => io2.observe(e));
  }

  // Demo form: never submits
  const form = d.getElementById('book-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelector('.form-status').textContent = 'Demo only — nothing was sent. A real site would connect this to email or a booking tool.';
  });
})();
