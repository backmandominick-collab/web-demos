(() => {
  const d = document;
  d.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  const els = d.querySelectorAll('.reveal');
  if (reduce || !hasIO) els.forEach(e => e.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach((e, i) => { e.style.transitionDelay = (i % 4) * 90 + 'ms'; io.observe(e); });
  }

  // Word-by-word statement lit by scroll position
  const split = d.querySelector('.split');
  if (split && !reduce) {
    const words = split.textContent.trim().split(/\s+/);
    split.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
    const spans = [...split.querySelectorAll('.word')];
    const light = () => {
      const r = split.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(Math.max((vh * .85 - r.top) / (r.height + vh * .35), 0), 1);
      const n = Math.round(p * spans.length);
      spans.forEach((s, i) => { if (i < n) s.classList.add('lit'); });
    };
    addEventListener('scroll', light, { passive: true }); light();
  }

  const nav = d.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const toggle = d.querySelector('.menu-toggle'), links = d.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', open); links.classList.toggle('open', open);
    toggle.querySelector('.sr').textContent = open ? 'Close menu' : 'Open menu';
  });
  links.addEventListener('click', e => { if (e.target.closest('a') && toggle.getAttribute('aria-expanded') === 'true') toggle.click(); });

  // Schedule filter
  const btns = d.querySelectorAll('.filters button'), slots = d.querySelectorAll('.slots li');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.setAttribute('aria-pressed', x === b));
    slots.forEach(s => s.hidden = !(b.dataset.day === 'all' || s.dataset.day === b.dataset.day));
  }));

  // Testimonial slider (manual only — no autoplay)
  const slides = [...d.querySelectorAll('.slide')], count = d.querySelector('.count');
  let i = 0;
  const show = n => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => s.hidden = k !== i); count.textContent = `${i + 1} / ${slides.length}`; };
  d.querySelector('.prev').addEventListener('click', () => show(i - 1));
  d.querySelector('.next').addEventListener('click', () => show(i + 1));

  const form = d.getElementById('join-form');
  form.addEventListener('submit', e => { e.preventDefault(); d.querySelector('#join .form-status').textContent = 'Demo only — nothing was sent.'; });
})();
