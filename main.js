const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];

// Cursor lighting
addEventListener('pointermove', (e) => $('.cursor-glow').style.transform = `translate(${e.clientX}px,${e.clientY}px)`);

// In-view storytelling reveals and live navigation
const navLinks = $$('.nav-links a');
const sections = $$('main > section[id]');
const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .16 });
$$('.reveal').forEach(el => observer.observe(el));
const sectionObserver = new IntersectionObserver((entries) => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
}), { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));
addEventListener('scroll', () => $('.nav').classList.toggle('scrolled', scrollY > 30), { passive: true });

// Counters start only when the value becomes part of the story.
const counted = new WeakSet();
function formatValue(value, el) {
  const decimal = el.dataset.decimal;
  const separator = el.dataset.separator;
  let output = decimal ? value.toFixed(1).replace('.', decimal) : Math.round(value).toString();
  if (separator) output = output.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return output + (el.dataset.suffix || '');
}
const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting || counted.has(entry.target)) return;
  counted.add(entry.target);
  const el = entry.target, end = Number(el.dataset.target), start = performance.now(), duration = 1250;
  const tick = (now) => { const progress = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - progress, 4); el.textContent = formatValue(end * eased, el); if (progress < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), { threshold: .55 });
$$('.counter').forEach(el => counterObserver.observe(el));

// Explanatory data flow
$$('.flow article').forEach(step => step.addEventListener('mouseenter', () => {
  const desc = $('#flow-desc'); desc.textContent = step.dataset.desc; desc.style.color = '#d5e8ff';
}));

// Smart leads modal
const modal = $('#modal');
$$('.lead-action').forEach(button => button.addEventListener('click', () => {
  $('#modal-text').textContent = `${button.dataset.client} foi priorizado para ação da concessionária.`;
  modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false');
}));
function closeModal(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); }
$('.modal-close').addEventListener('click', closeModal); $('.close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

// Lightweight connected-data field rendered only where it helps the presentation.
function network(canvasId, density = 1) {
  const canvas = document.getElementById(canvasId), ctx = canvas.getContext('2d');
  let points = [];
  function resize() {
    const dpr = Math.min(devicePixelRatio, 2), box = canvas.getBoundingClientRect();
    canvas.width = box.width * dpr; canvas.height = box.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = Array.from({ length: Math.max(20, Math.floor(box.width / 48) * density) }, () => ({ x: Math.random()*box.width, y: Math.random()*box.height, vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22, r:Math.random()*1.3+.25 }));
  }
  function draw() {
    const box=canvas.getBoundingClientRect(), w=box.width,h=box.height; ctx.clearRect(0,0,w,h);
    for (let i=0;i<points.length;i++) { const p=points[i]; p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1; for(let j=i+1;j<points.length;j++){const q=points[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);if(d<128){ctx.strokeStyle=`rgba(69,157,255,${.14*(1-d/128)})`;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}ctx.fillStyle='rgba(119,189,255,.68)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill(); }
    requestAnimationFrame(draw);
  }
  resize(); addEventListener('resize', resize); draw();
}
network('network', 1); network('final-network', .7);
