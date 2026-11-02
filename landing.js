// MoneyGlow landing — motions: 01 hero reveal (10s hold), 05 count-ups, 07 cursor tour over real
// screens (pauses on any tap), 06 bento walk-through, 09 before/after, 11 comparison, 10 price roll,
// 12 click → success. Each section plays when scrolled into view and pauses off-screen.
(() => {
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const E = { out: 'cubic-bezier(.33,1,.68,1)', inout: 'cubic-bezier(.65,0,.35,1)', spring: 'cubic-bezier(.34,1.56,.64,1)', expo: 'cubic-bezier(.16,1,.3,1)' };
const ez = { out: t => 1 - Math.pow(1 - t, 3), inout: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, expo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t), lin: t => t };
const sleep = ms => RM ? Promise.resolve() : new Promise(r => setTimeout(r, ms));
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const CURSOR = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 2l16 9-7 2-3 7z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
function animator() { const l = []; const A = (el, kf, o = {}) => { if (!el) return Promise.resolve(); const a = el.animate(kf, { duration: RM ? 0 : o.d ?? 600, delay: RM ? 0 : o.delay || 0, easing: o.e || E.out, fill: 'both' }); l.push(a); return a.finished.catch(() => {}); }; A.clear = () => { l.forEach(a => a.cancel()); l.length = 0; }; return A; }
function tween(d, fn, e = 'out') { if (RM) { fn(1); return Promise.resolve(); } return new Promise(res => { const t0 = performance.now(); const f = n => { const t = Math.min(1, (n - t0) / d); fn(ez[e](t)); t < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); }); }
function rel(el, root) { const a = el.getBoundingClientRect(), b = root.getBoundingClientRect(); return { x: a.left - b.left + Math.min(a.width / 2, 60), y: a.top - b.top + a.height / 2 }; }
function cursorIn(root, A, el = $('.cursor', root)) {
  el.innerHTML = CURSOR; let cur = { x: root.offsetWidth * .8, y: root.offsetHeight * .9 };
  return { el, set(p) { cur = p; el.style.transform = `translate(${p.x}px,${p.y}px)`; },
    move(p, d = 800) { const k = [], cx = (cur.x + p.x) / 2 - (p.y - cur.y) * .2, cy = (cur.y + p.y) / 2 + (p.x - cur.x) * .2; for (let i = 0; i <= 14; i++) { const t = i / 14, u = 1 - t; k.push({ transform: `translate(${u * u * cur.x + 2 * u * t * cx + t * t * p.x}px,${u * u * cur.y + 2 * u * t * cy + t * t * p.y}px)` }); } cur = p; return el.animate(k, { duration: RM ? 0 : d, easing: E.inout, fill: 'forwards' }).finished.catch(() => {}); } };
}
function ripple(root, p) { const r = document.createElement('span'); r.className = 'ripple'; r.style.left = p.x + 'px'; r.style.top = p.y + 'px'; root.appendChild(r); r.animate([{ transform: 'scale(0)', opacity: .5 }, { transform: 'scale(2.6)', opacity: 0 }], { duration: 600 }).finished.then(() => r.remove()); }
function rng(s) { return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// play while visible, wait `hold`, replay
function loop(el, play, hold, reset, th = .3) {
  const A = animator(); let vis = false, running = false;
  reset && reset(A);
  const go = async () => { running = true; do { A.clear(); reset && reset(A); await play(A, () => vis); if (RM) break; await sleep(hold); } while (vis); running = false; };
  new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && !running) go(); }, { threshold: th }).observe(el);
}

// ---------- 01 Hero reveal — holds 10 s so it can be read ----------
(() => {
  // the middle line changes on every reveal
  const LINES = ['Keep more of what you earn.', 'Make every payday count.', 'Spend smarter. Save more.', 'Stop living paycheck to paycheck.', 'Take control of every payday.'];
  const root = $('#hero'), mid = $$('h1 .ln', root)[1]; let words = $$('.w', root), k = LINES.length - 1;
  const nextLine = () => { mid.innerHTML = LINES[k++ % LINES.length].split(' ').map(w => `<span class="w">${w}</span>`).join(' '); words = $$('.w', root); };
  loop(root, async A => {
    A($('.badge', root), [{ opacity: 0, transform: 'translateY(-16px)' }, { opacity: 1, transform: 'none' }], { d: 600 });
    words.forEach((w, i) => A(w, [{ opacity: 0, transform: 'translateY(28px)', filter: 'blur(14px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { d: 700, delay: 250 + i * 90 }));
    const t = 250 + words.length * 90 + 300;
    A($('.ul', root), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { d: 600, delay: t, e: E.inout });
    A($('.lead', root), [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { d: 600, delay: t + 150 });
    $$('.btns .btn', root).forEach((b, i) => A(b, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], { d: 600, delay: t + 350 + i * 90, e: E.spring }));
    $$('.perks span', root).forEach((c, i) => A(c, [{ opacity: 0, transform: 'translateY(10px) scale(.9)' }, { opacity: 1, transform: 'none' }], { d: 450, delay: t + 250 + i * 110, e: E.spring }));
    A($('.note', root), [{ opacity: 0 }, { opacity: 1 }], { d: 500, delay: t + 650 });
    A($('#heroShot'), [{ opacity: 0, transform: 'translateY(240px) rotateX(28deg)' }, { opacity: 1, transform: 'none' }], { d: 1300, delay: t + 450, e: E.expo });
    await A($('.btns .shine', root), [{ transform: 'translateX(-120%) skewX(-20deg)' }, { transform: 'translateX(330%) skewX(-20deg)' }], { d: 900, delay: t + 1500, e: E.inout });
  }, 10000, nextLine, .15);
})();

// ---------- 05 Count-up facts ----------
(() => {
  const root = $('#facts');
  loop(root, async A => {
    $$('.fact', root).forEach((f, i) => A(f, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { d: 600, delay: i * 100 }));
    await Promise.all($$('[data-to]', root).map(el => { const to = +el.dataset.to; if (!to) { el.textContent = '0'; return Promise.resolve(); } return tween(1800, k => el.textContent = Math.round(to * k).toLocaleString('en-US'), 'expo'); }));
  }, 9000);
})();

// ---------- 07 Cursor tour over the real app screens ----------
(() => {
  const box = $('#tourBox'), vp = $('.viewport', box), stage = $('.stage', box), imgs = $$('.stage img', box), tabs = $$('.tabs button', box), descs = $$('.tour-desc div', box), chip = $('.tour-chip', box), url = $('#tourUrl');
  const names = ['Home', 'Debt Optimizer', 'Copilot & Decisions', 'Cash Flow'];
  // where the camera zooms on each screen (fractions of the screenshot)
  const focus = [[.3, .4], [.5, .45], [.5, .35], [.5, .4]];
  const IDLE = 15000; let last = 0, cam = 'none';
  const show = i => { imgs.forEach((im, j) => im.classList.toggle('on', j === i)); tabs.forEach((t, j) => t.classList.toggle('on', j === i)); descs.forEach((d, j) => d.classList.toggle('on', j === i)); url.textContent = 'moneyglow · ' + names[i]; };
  tabs.forEach((t, i) => t.addEventListener('click', e => { show(i); if (e.isTrusted) { last = Date.now(); chip.textContent = '⏸ Paused — explore freely'; } }));
  box.addEventListener('pointerdown', e => { if (e.isTrusted) { last = Date.now(); $('.cursor', box).style.opacity = 0; chip.textContent = '⏸ Paused — explore freely'; } });
  const zoom = (fx, fy, s, d = 900) => { const W = vp.offsetWidth, H = vp.offsetHeight; const tx = Math.min(0, Math.max(W * (1 - s), W / 2 - fx * W * s)), ty = Math.min(0, Math.max(H * (1 - s), H / 2 - fy * H * s)); const next = `translate(${tx}px,${ty}px) scale(${s})`; const a = stage.animate([{ transform: cam }, { transform: next }], { duration: RM ? 0 : d, easing: E.inout, fill: 'forwards' }).finished.catch(() => {}); cam = next; return a; };
  const cur = cursorIn(box, null, $('.cursor', box));
  let vis = false, running = false;
  const run = async () => {
    running = true;
    while (vis) {
      if (Date.now() - last < IDLE) { chip.style.opacity = 1; await sleep(1000); continue; }
      chip.textContent = '▶ Auto tour · tap a tab to take over'; chip.style.opacity = 1; $('.cursor', box).style.opacity = 1;
      for (let i = 0; i < tabs.length && vis && Date.now() - last >= IDLE; i++) {
        const p = rel(tabs[i], box); await cur.move(p, 800); if (Date.now() - last < IDLE) break;
        ripple(box, p); tabs[i].click();
        await sleep(500); await zoom(focus[i][0], focus[i][1], 1.35, 1000); await sleep(1700); await zoom(0, 0, 1, 800); await sleep(400);
      }
    }
    chip.style.opacity = 0; running = false;
  };
  if (!RM) new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && !running) run(); }, { threshold: .35 }).observe(box);
})();

// ---------- 07b Phone demo: a finger taps each tab and scrolls through the real mobile screen ----------
(() => {
  const phone = $('#phone'), screen = $('#pscreen'), imgs = $$('img', screen), nav = $$('.pnav button', phone), list = $$('.mob-list .card'), finger = $('.finger', phone);
  const IDLE = 15000; let last = 0, vis = false, running = false;
  const sets = $$('#mobile .co-set');
  const show = i => { imgs.forEach((im, j) => im.classList.toggle('on', j === i)); nav.forEach((b, j) => b.classList.toggle('on', j === i)); list.forEach((c, j) => c.classList.toggle('on', j === i)); sets.forEach(st => st.classList.toggle('on', +st.dataset.i === i)); screen.scrollTop = 0; };
  const user = e => { if (e.isTrusted) { last = Date.now(); finger.style.opacity = 0; } };
  nav.forEach((b, i) => b.addEventListener('click', e => { show(i); user(e); }));
  list.forEach((c, i) => c.addEventListener('click', e => { show(i); user(e); }));
  ['pointerdown', 'wheel', 'touchstart'].forEach(t => phone.addEventListener(t, user, { passive: true }));
  let fx = phone.clientWidth / 2, fy = phone.clientHeight * .6;
  const fingerTo = (x, y, d = 700) => { const a = finger.animate([{ transform: `translate(${fx}px,${fy}px)` }, { transform: `translate(${x}px,${y}px)` }], { duration: RM ? 0 : d, easing: E.inout, fill: 'forwards' }).finished.catch(() => {}); fx = x; fy = y; return a; };
  const tap = () => { finger.classList.remove('tap'); void finger.offsetWidth; finger.classList.add('tap'); };
  const idle = () => Date.now() - last >= IDLE;
  // scroll the screen like a thumb swipe: finger drags up while the content moves
  const swipe = async (dist, d) => {
    const from = screen.scrollTop, to = Math.min(screen.scrollHeight - screen.clientHeight, from + dist);
    const x = phone.clientWidth * .55; await fingerTo(x, phone.clientHeight * .7, 400);
    fingerTo(x, phone.clientHeight * .3, d);
    await tween(d, t => { if (idle()) screen.scrollTop = from + (to - from) * t; }, 'inout');
  };
  const run = async () => {
    running = true;
    while (vis) {
      if (!idle()) { await sleep(1000); continue; }
      finger.style.opacity = 1;
      for (let i = 0; i < nav.length && vis && idle(); i++) {
        const r = nav[i].getBoundingClientRect(), pr = phone.getBoundingClientRect();
        await fingerTo(r.left - pr.left + r.width / 2 - 11, r.top - pr.top + r.height / 2 - 11, 800); if (!idle()) break;
        tap(); nav[i].click(); await sleep(900);
        for (let k = 0; k < 3 && idle(); k++) { await swipe(screen.clientHeight * .75, 1300); await sleep(700); }
        if (idle()) { await tween(700, t => { if (idle()) screen.scrollTop = screen.scrollTop * (1 - t); }, 'inout'); await sleep(400); }
      }
    }
    finger.style.opacity = 0; running = false;
  };
  if (!RM) new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && !running) run(); }, { threshold: .4 }).observe(phone);
})();

// ---------- 06 Bento: tiles fly in, then a spotlight walks every tile and plays its animation ----------
(() => {
  const grid = $('#bento'), cards = $$('.card', grid), ring = $('.fgc', grid), ringNum = $('#ringNum'), key = $('#keyTxt');
  const C = 2 * Math.PI * 42; ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C;
  const KEY = 'Copilot: "Pay the 24% card first — it saves the most interest."';
  const play = async i => {
    cards.forEach((c, j) => { c.classList.toggle('on', j === i); c.classList.toggle('play', j === i); });
    if (i === 2) { ring.animate([{ strokeDashoffset: C }, { strokeDashoffset: C * (1 - .78) }], { duration: 1400, easing: E.expo, fill: 'forwards' }); tween(1400, k => ringNum.textContent = Math.round(78 * k), 'expo'); }
    if (i === 4) { key.textContent = ''; for (const ch of KEY) { if (!grid.dataset.vis) break; key.textContent += ch; await sleep(30); } }
  };
  const off = [[-70, -40, -5], [70, -30, 4], [-50, 50, 4], [60, 40, -5], [0, 70, 3]];
  loop(grid, async (A, vis) => {
    grid.dataset.vis = 1;
    cards.forEach((c, i) => { const [x, y, r] = off[i]; A(c, [{ opacity: 0, transform: `translate(${x}px,${y}px) rotate(${r}deg) scale(.92)` }, { opacity: 1, transform: 'none' }], { d: 800, delay: i * 120, e: E.spring }); });
    await sleep(1400); A.clear();
    for (let i = 0; i < cards.length && vis(); i++) { await play(i); await sleep(2600); }
    cards.forEach(c => c.classList.remove('on'));
  }, 400, () => { delete grid.dataset.vis; key.textContent = KEY; }, .2);
})();

// ---------- 09 Before/after ----------
(() => {
  const w = $('#ba'); let drag = false, p = 92;
  const set = v => { p = v; w.style.setProperty('--p', v + '%'); $('.tag.l', w).style.opacity = v > 12 ? 1 : 0; $('.tag.r', w).style.opacity = v < 88 ? 1 : 0; };
  const ev = e => { const r = w.getBoundingClientRect(); set(Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100))); };
  w.addEventListener('pointerdown', e => { drag = true; w.setPointerCapture(e.pointerId); ev(e); }); w.addEventListener('pointermove', e => drag && ev(e)); w.addEventListener('pointerup', () => drag = false);
  const to = (v, d) => { const a = p; return tween(d, t => !drag && set(a + (v - a) * t), 'inout'); };
  loop(w, async () => { w.classList.add('mv'); await to(6, 2000); w.classList.remove('mv'); await sleep(1500); w.classList.add('mv'); await to(50, 1200); await to(56, 180); await to(46, 200); await to(50, 180); w.classList.remove('mv'); await sleep(1500); w.classList.add('mv'); await to(92, 1100); w.classList.remove('mv'); }, 2500, () => set(92));
})();

// ---------- 11 Comparison ----------
(() => {
  const box = $('#cmp');
  loop(box, async A => {
    A($('.panel', box), [{ transform: 'scaleY(0)', opacity: 0 }, { transform: 'scaleY(1)', opacity: 1 }], { d: 800, e: E.expo });
    const lbs = $$('.lb', box), xs = $$('.cx', box), oks = $$('.co', box);
    for (let i = 0; i < lbs.length; i++) {
      await sleep(i ? 450 : 500);
      A(lbs[i], [{ opacity: 0, transform: 'translateX(-30px)' }, { opacity: 1, transform: 'none' }], { d: 450 });
      $$('path', xs[i]).forEach((pa, j) => A(pa, [{ strokeDashoffset: 20 }, { strokeDashoffset: 0 }], { d: 250, delay: 100 + j * 150 }));
      A($('circle', oks[i]), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { d: 450, delay: 150, e: E.spring });
      A($('path', oks[i]), [{ strokeDashoffset: 20 }, { strokeDashoffset: 0 }], { d: 300, delay: 350 });
    }
    await sleep(800);
  }, 7000, () => { $$('.lb', box).forEach(l => l.style.opacity = 0); $$('path', box).forEach(pa => pa.style.strokeDashoffset = 20); $$('.co circle', box).forEach(c => c.style.transform = 'scale(0)'); });
})();

// ---------- 10 Price roll ----------
(() => {
  const root = $('#pricing'), seg = $('#seg'), sl = $('.sl', seg), btn = $$('button', seg), save = $('#save'), plans = $$('.plan', root);
  const vals = plans.map(p => p.dataset.v.split(',').map(Number));
  const len = Math.max(...vals.flat().map(v => String(v).length));
  plans.forEach(p => { const pr = $('.price', p), per = $('.per', pr); for (let i = 0; i < len; i++) { const o = document.createElement('span'); o.className = 'odo'; o.innerHTML = '<span>' + '012345678901234567890123456789'.split('').map(d => `<i>${d}</i>`).join('') + '</span>'; per ? pr.insertBefore(o, per) : pr.appendChild(o); } p._c = $$('.odo', pr).map(c => ({ c, s: c.firstElementChild })); });
  const place = (col, idx, anim) => { col.s.style.transition = anim ? '' : 'none'; col.s.style.transform = `translateY(${-idx}em)`; };
  const setMode = (m, anim) => {
    btn.forEach((b, i) => b.classList.toggle('on', i === m)); sl.style.left = btn[m].offsetLeft + 'px'; sl.style.width = btn[m].offsetWidth + 'px';
    save.animate([{ transform: `scale(${m ? 0 : 1})` }, { transform: `scale(${m ? 1 : 0})` }], { duration: anim && !RM ? 450 : 0, easing: m ? E.spring : E.out, fill: 'forwards' });
    plans.forEach((p, j) => { const s = String(vals[j][m]).padStart(len, ' ');
      p._c.forEach((col, i) => { const ch = s[i], ones = i === len - 1, d = ch === ' ' ? 0 : +ch; col.c.classList.toggle('hide', ch === ' ');
        if (!anim) return place(col, 10 + d); if (ones) { place(col, 20 + d, true); setTimeout(() => place(col, 10 + d), RM ? 0 : 950); } else place(col, 10 + d, true); });
      $('.b0', p).style.opacity = m ? 0 : 1; $('.b1', p).style.opacity = m ? 1 : 0; });
  };
  btn.forEach((b, i) => b.addEventListener('click', e => { setMode(i, true); if (e.isTrusted) root.dataset.user = Date.now(); }));
  const box = $('#plans'), cur = cursorIn(box, null, $('.cursor', box)), pop = $('.plan.pop', root);
  setMode(0, false);
  loop(root, async () => {
    if (Date.now() - (+root.dataset.user || 0) < 15000) return;
    $('.cursor', box).style.opacity = 1;
    let p = rel(btn[1], box); await cur.move(p, 800); ripple(box, p); setMode(1, true); await sleep(1400);
    p = rel(pop, box); await cur.move({ x: p.x + 40, y: p.y + 30 }, 700); pop.classList.add('lift'); await sleep(1500); pop.classList.remove('lift');
    p = rel(btn[0], box); await cur.move(p, 800); ripple(box, p); setMode(0, true); await sleep(900);
    $('.cursor', box).style.opacity = 0;
  }, 2500, null, .35);
})();

// ---------- 12 Click → success ----------
(() => {
  const wrap = $('#cta'), b = $('.cta-btn', wrap), cv = $('canvas', wrap), done = $('.cta-done', wrap), cur = cursorIn(wrap, null, $('.cursor', wrap));
  function confetti(o) {
    if (RM) return; const dpr = devicePixelRatio || 1, W = cv.offsetWidth, H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; const x = cv.getContext('2d'); x.scale(dpr, dpr);
    const r = rng(42), cols = ['#105BFF', '#FC734D', '#ffffff', '#10b981', '#7ea2ff'];
    const ps = Array.from({ length: 44 }, () => { const a = r() * Math.PI * 2, v = 5 + r() * 9; return { x: o.x, y: o.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, s: 6 + r() * 6, rot: r() * 6, vr: (r() - .5) * .5, c: cols[Math.floor(r() * 5)] }; });
    let f = 0; (function step() { x.clearRect(0, 0, W, H); f++; ps.forEach(p => { p.vy += .35; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; x.save(); x.globalAlpha = Math.max(0, 1 - f / 90); x.translate(p.x, p.y); x.rotate(p.rot); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); }); f < 90 ? requestAnimationFrame(step) : x.clearRect(0, 0, W, H); })();
  }
  loop(wrap, async A => {
    const p = rel(b, wrap); $('.cursor', wrap).style.opacity = 1; await cur.move({ x: p.x + 20, y: p.y + 8 }, 1000);
    A(b, [{ transform: 'none' }, { transform: 'translateY(-4px)' }], { d: 300 });
    await A($('.shine', b), [{ transform: 'translateX(-120%) skewX(-20deg)' }, { transform: 'translateX(330%) skewX(-20deg)' }], { d: 700, e: E.inout });
    ripple(wrap, { x: p.x + 20, y: p.y + 8 });
    const w = b.offsetWidth, h = b.offsetHeight;
    await A(b, [{ transform: 'translateY(-4px) scale(1)' }, { transform: 'scale(.94)' }], { d: 140 });
    A($('.cta-l', b), [{ opacity: 1 }, { opacity: 0 }], { d: 150 });
    A(b, [{ width: w + 'px', transform: 'scale(.94)' }, { width: h + 'px', transform: 'scale(1)' }], { d: 450, e: E.inout });
    $('.cursor', wrap).style.opacity = 0;
    A($('.cta-spin', b), [{ opacity: 0, transform: 'rotate(0)' }, { opacity: 1, transform: 'rotate(720deg)' }], { d: 1200, delay: 300, e: 'linear' });
    await sleep(1450);
    A($('.cta-spin', b), [{ opacity: 1 }, { opacity: 0 }], { d: 150 });
    A(b, [{ background: '#ffffff' }, { background: '#FC734D' }], { d: 300 });
    A($('.cta-chk', b), [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }], { d: 500, e: E.spring });
    A($('.cta-chk path', b), [{ strokeDashoffset: 40 }, { strokeDashoffset: 0 }], { d: 400, delay: 100 });
    confetti(rel(b, wrap));
    await A(done, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { d: 600, delay: 300 });
    await sleep(1500);
  }, 4000, () => { done.style.opacity = 0; });
})();
})();
