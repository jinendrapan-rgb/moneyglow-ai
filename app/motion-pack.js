// MoneyGlow AI — Landing Page Motion Pack layer.
// 01 Hero reveal (welcome screen, 10s hold) · 05 Count-up stats ·
// 06 Bento build (AI Hub) · 07 Cursor tour (every tab, pauses when you tap) ·
// 09 Before/after · 10 Price roll (Premium) · 11 Us vs them · 12 Click → success (sign-up)
(() => { if (location.search.includes('nomotion')) return;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const E = { out: 'cubic-bezier(.33,1,.68,1)', inout: 'cubic-bezier(.65,0,.35,1)', spring: 'cubic-bezier(.34,1.56,.64,1)', expo: 'cubic-bezier(.16,1,.3,1)' };
const ez = { out: t => 1 - Math.pow(1 - t, 3), inout: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, expo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t) };
const sleep = ms => RM ? Promise.resolve() : new Promise(r => setTimeout(r, ms));
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const PURPLE = '#105BFF';
const CURSOR = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 2l16 9-7 2-3 7z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const isShown = el => !!el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
function animator() { const l = []; const A = (el, kf, o = {}) => { if (!el) return Promise.resolve(); const a = el.animate(kf, { duration: RM ? 0 : o.d ?? 600, delay: RM ? 0 : o.delay || 0, easing: o.e || E.out, fill: 'both' }); l.push(a); return a.finished.catch(() => {}); }; A.clear = () => { l.forEach(a => a.cancel()); l.length = 0; }; return A; }
function tween(d, fn, e = 'out') { if (RM) { fn(1); return Promise.resolve(); } return new Promise(res => { const t0 = performance.now(); const f = n => { const t = Math.min(1, (n - t0) / d); fn(ez[e](t)); t < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); }); }
function rng(s) { return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function confetti(x0, y0) {
  if (RM) return;
  const cv = document.createElement('canvas'); Object.assign(cv.style, { position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 99999 });
  document.body.appendChild(cv); const dpr = devicePixelRatio || 1, W = innerWidth, H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; const x = cv.getContext('2d'); x.scale(dpr, dpr);
  const r = rng(42), cols = [PURPLE, '#ffffff', '#FC734D', '#10b981', '#105BFF'];
  const ps = Array.from({ length: 44 }, () => { const a = r() * Math.PI * 2, v = 5 + r() * 9; return { x: x0, y: y0, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, s: 6 + r() * 6, rot: r() * 6, vr: (r() - .5) * .5, c: cols[Math.floor(r() * 5)] }; });
  let f = 0; (function step() { x.clearRect(0, 0, W, H); f++; ps.forEach(p => { p.vy += .35; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; x.save(); x.globalAlpha = Math.max(0, 1 - f / 90); x.translate(p.x, p.y); x.rotate(p.rot); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); }); f < 90 ? requestAnimationFrame(step) : cv.remove(); })();
}

// ---------- 01 Hero reveal on the welcome screen (holds 10s, then replays) ----------
(function heroReveal() {
  const card = $('#welcomeStep1'), ov = $('#welcomeOverlay'); if (!card) return;
  const h1 = $('h1', card);
  if (h1 && !h1.dataset.split) { h1.dataset.split = 1; h1.innerHTML = h1.innerHTML.split(/<br\s*\/?>/i).map(line => line.trim().split(/\s+/).map(w => `<span class="mp-w">${w}</span>`).join(' ')).join('<br>'); }
  // the heading is gradient text (background-clip:text); animated words need their own slice of it
  const paintWords = () => { if (!h1) return; const cs = getComputedStyle(h1); if (cs.webkitBackgroundClip !== 'text' && cs.backgroundClip !== 'text') return;
    $$('.mp-w', h1).forEach(w => Object.assign(w.style, { backgroundImage: cs.backgroundImage, backgroundSize: h1.offsetWidth + 'px 100%', backgroundPosition: -(w.getBoundingClientRect().left - h1.getBoundingClientRect().left) + 'px 0', webkitBackgroundClip: 'text', backgroundClip: 'text', webkitTextFillColor: 'transparent' })); };
  const words = $$('.mp-w', card), glowWord = words.find(w => /MoneyGlow/.test(w.textContent));
  if (glowWord) { glowWord.style.position = 'relative'; glowWord.insertAdjacentHTML('beforeend', '<i class="mp-ul"></i>'); }
  const items = $$('li, .feature-row, .welcome-feature', card).length ? $$('li, .feature-row, .welcome-feature', card) : [...card.children].filter(c => /🔥|🎯|🧪|🤖|🔒|📦|🌐|💎/.test(c.textContent) && c.children.length < 6);
  const btns = $$('button', card);
  const primary = btns[0]; if (primary) { primary.style.position = 'relative'; primary.style.overflow = 'hidden'; primary.insertAdjacentHTML('beforeend', '<i class="mp-shine"></i>'); }
  const A = animator(); let running = false;
  const visible = () => ov && !ov.classList.contains('hidden') && isShown(card);
  async function loop() {
    running = true;
    while (visible()) {
      A.clear(); paintWords();
      A($('.welcome-logo, .welcome-icon', card) || card.firstElementChild, [{ opacity: 0, transform: 'translateY(-16px) scale(.8)' }, { opacity: 1, transform: 'none' }], { d: 600, e: E.spring });
      words.forEach((w, i) => A(w, [{ opacity: 0, transform: 'translateY(28px)', filter: 'blur(14px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { d: 700, delay: 250 + i * 90 }));
      const t = 250 + words.length * 90 + 300;
      A($('.mp-ul', card), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { d: 600, delay: t, e: E.inout });
      A($('.tagline', card), [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { d: 600, delay: t + 150 });
      items.forEach((it, i) => A(it, [{ opacity: 0, transform: 'translateX(-24px)' }, { opacity: 1, transform: 'none' }], { d: 450, delay: t + 300 + i * 70 }));
      btns.forEach((b, i) => A(b, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], { d: 600, delay: t + 400 + items.length * 70 + i * 90, e: E.spring }));
      await A($('.mp-shine', card), [{ transform: 'translateX(-120%) skewX(-20deg)' }, { transform: 'translateX(330%) skewX(-20deg)' }], { d: 900, delay: t + 900 + items.length * 70, e: E.inout });
      if (RM) break;
      await sleep(10000);
    }
    running = false;
  }
  new MutationObserver(() => { if (visible() && !running) loop(); }).observe(ov, { attributes: true, attributeFilter: ['class', 'style'] });
  new MutationObserver(() => { if (visible() && !running) loop(); }).observe(card, { attributes: true, attributeFilter: ['style'] });
  if (visible()) loop();
})();

// ---------- 05 Count-up stats on Home ----------
const NUM = /^([^\d-]*)(-?\d[\d,]*\.?\d*)(.*)$/;
function countUpIn(root) {
  if (!root || RM) return;
  const leaves = $$('*', root).filter(el => el.children.length === 0 && !el.closest('button') && el.textContent.trim().length < 18 && NUM.test(el.textContent.trim()) && !el.dataset.mpCounting);
  leaves.forEach(el => {
    const txt = el.textContent.trim(), m = txt.match(NUM); if (!m) return;
    const dec = (m[2].split('.')[1] || '').length, to = parseFloat(m[2].replace(/,/g, '')), commas = m[2].includes(',');
    if (!isFinite(to) || to === 0) return;
    el.dataset.mpCounting = 1;
    tween(1500, k => { if (el.textContent.trim() !== txt && k < 1 && !el.dataset.mpCounting) return; const v = to * k; el.textContent = m[1] + (commas ? v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec)) + m[3]; }, 'expo').then(() => { el.textContent = txt; delete el.dataset.mpCounting; });
  });
  // the score ring (if it is an SVG circle with a dash offset) redraws from empty
  $$('circle', root).forEach(c => { const off = c.style.strokeDashoffset || c.getAttribute('stroke-dashoffset'); const arr = parseFloat(c.getAttribute('stroke-dasharray') || getComputedStyle(c).strokeDasharray); if (off && arr) c.animate([{ strokeDashoffset: arr }, { strokeDashoffset: off }], { duration: 1500, easing: E.expo }); });
}
function homeCounts() { ['#sec-hero', '#sec-snapshot', '#sec-progresspreview', '.quick-stats, #qIn'].forEach(s => { const el = $(s); countUpIn(s.includes('qIn') && el ? el.parentElement.parentElement : el); }); }

// ---------- 06 Bento build: AI Hub cards fly in, then a spotlight walks every card ----------
let bentoTimer = 0;
function bento() {
  const hub = $('#sec-aihub'); if (!hub) return;
  const cards = $$('.aihub-card', hub); if (!cards.length) return;
  clearInterval(bentoTimer);
  const off = [[-60, -40, -5], [70, -30, 4], [-50, 50, 4], [60, 40, -5], [0, 70, 3], [-70, 20, -3]];
  cards.forEach((c, i) => { const [x, y, r] = off[i % 6]; c.animate([{ opacity: 0, transform: `translate(${x}px,${y}px) rotate(${r}deg) scale(.92)` }, { opacity: 1, transform: 'none' }], { duration: RM ? 0 : 800, delay: RM ? 0 : i * 120, easing: E.spring, fill: 'backwards' }); });
  if (RM) return;
  let k = 0;
  setTimeout(() => { bentoTimer = setInterval(() => { cards.forEach(c => c.classList.remove('mp-spot')); const c = cards[k++ % cards.length]; if (isShown(c)) c.classList.add('mp-spot'); }, 2600); }, 1500);
}

// ---------- 04 Review shuffle · 09 Before/after · 11 Us vs them (new Home cards) ----------
const REVIEWS = [
  ['First app that told me which debt to pay first — with the actual numbers.', 'Sample User', 'Debt Optimizer · placeholder review'],
  ['I ran the car purchase through Decision Lab before signing. Glad I did.', 'Demo User', 'Decision Lab · placeholder review'],
  ['Watching my debt-free date move closer keeps me going every week.', 'Example Name', 'Health Score · placeholder review'],
  ['Love that nothing leaves my phone. No bank login, no server.', 'Sample Person', 'Privacy · placeholder review'],
];
function addHomeCards() {
  const anchor = $('#sec-progresspreview'); if (!anchor || $('#mp-ba')) return;
  anchor.insertAdjacentHTML('afterend', `
  <div class="card" id="mp-ba" data-screen="home"><div class="mp-h">🔁 Spreadsheet vs. MoneyGlow <small>drag the handle</small></div>
    <div class="mp-baw"><div class="mp-before"><div class="mp-xl">budget_FINAL_v7 (2).xlsx</div><table>${[['', 'A', 'B', 'C'], ['2', 'Rent', '7,500', '7,500'], ['3', 'Car loan', '1,850', '???'], ['4', 'Card', '900', '<b class="e">#REF!</b>'], ['5', 'Groceries', '1,400', '2,100'], ['6', 'Total', '=SUM(B2:B7', '<b class="e">#VALUE!</b>'], ['7', 'Debt free when??', '', '']].map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>
    <div class="mp-after"><small><img src="../brand/moneyglow-symbol-on-dark.svg?v=2" alt="" style="height:18px;width:18px;vertical-align:-4px;margin-right:5px">MoneyGlow AI</small><div class="mp-big">Debt-free by<br><span>your real date.</span></div><div class="mp-row"><div>Health score<b>out of 100</b></div><div>Pay first<b>Highest rate</b></div><div>Plan<b>3 actions</b></div></div></div>
    <div class="mp-div"><i>⟷</i></div><span class="mp-tag l">BEFORE</span><span class="mp-tag r">AFTER</span></div></div>
  <div class="card" id="mp-cmp" data-screen="home"><div class="mp-h">⚖️ Why MoneyGlow</div>
    <div class="mp-cmpw"><div class="mp-panel"></div><div class="mp-grid"><div></div><div class="mp-hd">Budget apps</div><div class="mp-hd us">MoneyGlow</div>
    ${['Tells you what to do next', 'Shows your real debt-free date', 'Simulates big decisions first', 'No server holds your data', 'Works fully offline'].map(r => `<div class="mp-lb">${r}</div><div class="c"><svg class="mp-x" viewBox="0 0 30 30"><path d="M9 9 L21 21"/><path d="M21 9 L9 21"/></svg></div><div class="c"><svg class="mp-ok" viewBox="0 0 30 30"><circle cx="15" cy="15" r="14"/><path d="M9 15.5 l4 4 l8 -9"/></svg></div>`).join('')}</div>
    <button class="mp-cmpbtn" onclick="openPremiumModal()">See Premium →</button></div></div>`);
  baLoop(); cmpLoop(); // review shuffle (reviewLoop) stays off until real user reviews exist
}
function onScreenLoop(el, fn, hold) {
  let vis = false, running = false;
  const go = async () => { running = true; do { await fn(); if (RM) break; await sleep(hold); } while (vis && isShown(el)); running = false; };
  new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && !running) go(); }, { threshold: .3 }).observe(el);
}
function reviewLoop() {
  const box = $('#mp-reviews'), cards = $$('.mp-rc', box);
  const depth = (c, d, t = true) => { c.style.transition = t ? 'transform .6s cubic-bezier(.65,0,.35,1), filter .6s, opacity .5s' : 'none'; c.style.transform = `translateY(${-18 * d}px) scale(${1 - .05 * d})`; c.style.filter = `brightness(${1 - .12 * d})`; c.style.zIndex = 10 - d; c.style.opacity = 1; };
  let order = [...cards]; order.forEach((c, i) => depth(c, i, false));
  onScreenLoop(box, async () => {
    const f = order[0];
    $$('.mp-stars span', f).forEach((s, i) => { s.classList.remove('on'); setTimeout(() => { s.classList.add('on'); s.animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 300, easing: E.spring }); }, RM ? 0 : i * 90); });
    await sleep(6000); // long enough to read each card
    f.style.transition = 'transform .5s cubic-bezier(.65,0,.35,1), opacity .5s'; f.style.transform = 'translateX(-130%) rotate(-12deg)'; f.style.opacity = 0;
    order = [...order.slice(1), f]; order.slice(0, -1).forEach((c, i) => depth(c, i));
    await sleep(500); depth(f, order.length - 1, false); f.style.opacity = 0; f.offsetHeight; f.style.transition = 'opacity .4s'; f.style.opacity = 1;
  }, 0);
}
function baLoop() {
  const w = $('.mp-baw'); let drag = false, p = 92;
  const set = v => { p = v; w.style.setProperty('--p', v + '%'); };
  set(92);
  const ev = e => { const r = w.getBoundingClientRect(); set(Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100))); };
  w.addEventListener('pointerdown', e => { drag = true; w.setPointerCapture(e.pointerId); ev(e); }); w.addEventListener('pointermove', e => drag && ev(e)); w.addEventListener('pointerup', () => drag = false);
  const to = (v, d) => { const a = p; return tween(d, t => !drag && set(a + (v - a) * t), 'inout'); };
  onScreenLoop(w, async () => { w.classList.add('mv'); await to(6, 2000); w.classList.remove('mv'); await sleep(1500); w.classList.add('mv'); await to(50, 1200); await to(56, 180); await to(46, 200); await to(50, 180); w.classList.remove('mv'); await sleep(1500); w.classList.add('mv'); await to(92, 1100); w.classList.remove('mv'); }, 2500);
}
function cmpLoop() {
  const box = $('#mp-cmp'), A = animator();
  const paths = $$('path', box); paths.forEach(p => { p.style.strokeDasharray = 20; });
  onScreenLoop(box, async () => {
    A.clear(); paths.forEach(p => p.style.strokeDashoffset = 20); $$('.mp-lb, .mp-cmpbtn', box).forEach(e => e.style.opacity = 0);
    A($('.mp-panel', box), [{ transform: 'scaleY(0)', opacity: 0 }, { transform: 'scaleY(1)', opacity: 1 }], { d: 800, e: E.expo });
    const lbs = $$('.mp-lb', box), xs = $$('.mp-x', box), oks = $$('.mp-ok', box);
    for (let i = 0; i < lbs.length; i++) {
      await sleep(i ? 450 : 500);
      A(lbs[i], [{ opacity: 0, transform: 'translateX(-30px)' }, { opacity: 1, transform: 'none' }], { d: 450 });
      $$('path', xs[i]).forEach((p, j) => A(p, [{ strokeDashoffset: 20 }, { strokeDashoffset: 0 }], { d: 250, delay: 100 + j * 150 }));
      A($('circle', oks[i]), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { d: 450, delay: 150, e: E.spring });
      A($('path', oks[i]), [{ strokeDashoffset: 20 }, { strokeDashoffset: 0 }], { d: 300, delay: 350 });
    }
    await sleep(500); await A($('.mp-cmpbtn', box), [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], { d: 600, e: E.spring });
  }, 8000);
}

// ---------- 10 Price roll: Premium price spins like an odometer from the regular AED 39 ----------
function odometer(el, from, to) {
  const s = String(to), f = String(from).padStart(s.length, '0');
  el.innerHTML = s.split('').map((d, i) => `<span class="mp-odo"><span style="transform:translateY(-${10 + +f[i]}em)">${'012345678901234567890123456789'.split('').map(x => `<i>${x}</i>`).join('')}</span></span>`).join('');
  requestAnimationFrame(() => requestAnimationFrame(() => $$('.mp-odo > span', el).forEach((strip, i) => { strip.style.transition = RM ? 'none' : `transform ${0.9 + i * .1}s cubic-bezier(.2,.85,.25,1)`; strip.style.transform = `translateY(-${(i === s.length - 1 ? 20 : 10) + +s[i]}em)`; })));
}
if (typeof window.openPremiumModal === 'function') {
  const orig = window.openPremiumModal;
  window.openPremiumModal = function (...a) {
    const r = orig.apply(this, a);
    setTimeout(() => $$('.pricing-tier.featured .pt-price, .pricing-tier .pt-price').forEach((p, i) => {
      const n = p.firstChild && p.firstChild.nodeType === 3 ? p.firstChild : null; if (!n) return;
      const m = n.textContent.match(/^(\D*)(\d+)(.*)$/); if (!m) return;
      const span = document.createElement('span'); span.className = 'mp-num'; n.textContent = m[1]; n.after(span); if (m[3]) span.after(m[3]);
      const regular = p.closest('.featured') ? Math.max(39, +m[2]) : +m[2];
      odometer(span, regular, +m[2]);
      if (p.closest('.featured') && regular !== +m[2]) p.insertAdjacentHTML('beforeend', `<s class="mp-was">AED ${regular}</s>`);
    }), 60);
    return r;
  };
}

// ---------- 12 Click → success: sign-up success screen ----------
(function signupSuccess() {
  const s3 = $('#welcomeStep3'); if (!s3) return;
  let fired = false;
  new MutationObserver(() => {
    if (isShown(s3) && !fired) {
      fired = true;
      const icon = s3.firstElementChild;
      icon && icon.animate([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1.15)', opacity: 1 }, { transform: 'scale(1)' }], { duration: 700, easing: E.spring });
      $$('h1, .tagline, button', s3).forEach((e, i) => e.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 250 + i * 90, easing: E.out, fill: 'backwards' }));
      const r = s3.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + 80);
    }
    if (!isShown(s3)) fired = false;
  }).observe(s3, { attributes: true, attributeFilter: ['style'] });
  const btn = $('#signupSubmitBtn');
  btn && btn.addEventListener('click', () => btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 300, easing: E.spring }), true);
})();

// ---------- 07 Cursor tour: walks every tab of the app; any real tap pauses it ----------
(function tour() {
  if (RM || location.search.includes('notour')) return;
  const IDLE = 15000; let last = Date.now() - IDLE + 4000, x = innerWidth * .7, y = innerHeight * .6;
  const cur = document.createElement('div'); cur.innerHTML = CURSOR; cur.className = 'mp-cursor'; document.body.appendChild(cur);
  const chip = document.createElement('div'); chip.className = 'mp-chip'; document.body.appendChild(chip);
  cur.style.transform = `translate(${x}px,${y}px)`;
  ['pointerdown', 'keydown'].forEach(t => addEventListener(t, e => { if (!e.isTrusted) return; last = Date.now(); cur.style.opacity = 0; chip.textContent = '⏸ Tour paused — explore freely'; }, true));
  const paused = () => Date.now() - last < IDLE;
  const blocked = () => { const w = $('#welcomeOverlay'); return (w && !w.classList.contains('hidden')) || $$('button').some(b => /Skip tour/.test(b.textContent) && isShown(b)) || isShown($('#lockOverlay')) || $$('.modal-backdrop').some(m => m.classList.contains('active') || m.classList.contains('show') || getComputedStyle(m).display !== 'none' && getComputedStyle(m).opacity !== '0' && m.offsetParent); };
  const move = el => { const r = el.getBoundingClientRect(), nx = r.left + Math.min(r.width / 2, 50), ny = r.top + r.height / 2; const k = [], cx = (x + nx) / 2 - (ny - y) * .2, cy = (y + ny) / 2 + (nx - x) * .2; for (let i = 0; i <= 14; i++) { const t = i / 14, u = 1 - t; k.push({ transform: `translate(${u * u * x + 2 * u * t * cx + t * t * nx}px,${u * u * y + 2 * u * t * cy + t * t * ny}px)` }); } x = nx; y = ny; return cur.animate(k, { duration: 800, easing: E.inout, fill: 'forwards' }).finished; };
  const ripple = () => { const r = document.createElement('span'); r.className = 'mp-ripple'; r.style.left = x - 18 + 'px'; r.style.top = y - 18 + 'px'; document.body.appendChild(r); r.animate([{ transform: 'scale(0)', opacity: .55 }, { transform: 'scale(2.6)', opacity: 0 }], { duration: 600 }).finished.then(() => r.remove()); };
  const nav = n => () => $(`.bottom-nav-item[data-screen-target="${n}"]`);
  const steps = () => [
    ...$$('#sec-aihub .aihub-card').map(c => ({ t: () => c, act: 'glow' })),
    { t: nav('money'), act: 'click' }, ...['cashflow', 'debts', 'transactions', 'bills', 'networth'].map(m => ({ t: () => $(`.money-tab-btn[data-money-tab-target="${m}"]`), act: 'click' })),
    { t: nav('goals'), act: 'click' }, ...['goals', 'forecasts', 'missions'].map(m => ({ t: () => $(`.mg-subtab-btn[data-subtab-group="goals"][data-subtab-target="${m}"]`), act: 'click' })),
    { t: nav('more'), act: 'click' }, ...['reports', 'family', 'notifications', 'rewards'].map(m => ({ t: () => $(`.mg-subtab-btn[data-subtab-group="more"][data-subtab-target="${m}"]`), act: 'click' })),
    { t: nav('copilot'), act: 'click' }, ...['extra', 'salary', 'jobloss', 'car', 'mortgage', 'refi'].map(m => ({ t: () => $(`.lab-tab[data-tab="${m}"]`), act: 'click' })),
    { t: nav('home'), act: 'click', wait: 3500 },
  ];
  (async function loop() {
    for (;;) {
      if (paused() || blocked()) { cur.style.opacity = 0; chip.style.opacity = blocked() ? 0 : 1; await sleep(1000); continue; }
      chip.textContent = '▶ Auto tour · tap anything to take over'; chip.style.opacity = 1;
      for (const s of steps()) {
        if (paused() || blocked()) break;
        const el = s.t(); if (!el || !isShown(el)) continue;
        const r = el.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) el.scrollIntoView({ block: 'center', behavior: 'smooth' }), await sleep(500);
        cur.style.opacity = 1; await move(el); if (paused()) break;
        if (s.act === 'click') { ripple(); el.click(); if (el.matches('.bottom-nav-item') && el.dataset.screenTarget === 'home') setTimeout(() => { homeCounts(); bento(); }, 300); }
        else el.animate([{ boxShadow: '0 0 0 0 rgba(16,91,255,0)' }, { boxShadow: '0 0 0 2px rgba(16,91,255,.8), 0 0 24px rgba(16,91,255,.4)' }, { boxShadow: '0 0 0 0 rgba(16,91,255,0)' }], { duration: 1300 });
        await sleep(s.wait || 2200);
      }
      cur.style.opacity = 0; await sleep(800);
    }
  })();
})();

// ---------- boot ----------
function boot() {
  addHomeCards();
  const home = () => document.body.getAttribute('data-active-screen') !== 'money' && isShown($('#sec-hero'));
  if (home()) { homeCounts(); bento(); }
  // replay counts + bento whenever someone returns to Home
  const orig = window.switchScreen;
  if (typeof orig === 'function') window.switchScreen = function (n) { const r = orig.apply(this, arguments); if (n === 'home') setTimeout(() => { homeCounts(); bento(); }, 150); return r; };
}
document.readyState === 'complete' ? setTimeout(boot, 600) : addEventListener('load', () => setTimeout(boot, 600));
})();
