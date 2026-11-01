// MoneyGlow — laptop / big-screen layout helper (pairs with desktop-layout.css).
// On non-Home tabs the cards flow into balanced columns. A card that would still be far
// taller than its neighbours (Debts, Living Expenses, Bills…) is made full width, and the
// repeating items inside it are laid out side by side, so no tab leaves a huge empty gap.
(function () {
  if (location.search.includes('nodesktop')) return;
  const WIDE = window.matchMedia('(min-width: 1024px)');
  const TALL = 1000; // px at column width: anything taller spans the full row

  function findRepeatingList(card, minH = 110) {
    // the deepest element whose direct children are 2+ similar blocks (same tag + class), each a real "item"
    let best = null;
    card.querySelectorAll('div, ul, section').forEach(el => {
      const kids = [...el.children].filter(k => k.offsetParent !== null);
      if (kids.length < 2) return;
      const sig = k => k.tagName + '.' + (k.className || '').toString().split(' ')[0];
      const first = sig(kids[0]);
      const same = kids.filter(k => sig(k) === first && k.offsetHeight > minH);
      if (same.length >= 2 && same.length >= kids.length * 0.6) {
        const area = same.reduce((a, k) => a + k.offsetHeight, 0);
        if (!best || area > best.area) best = { el, area };
      }
    });
    return best && best.el;
  }

  let busy = false;
  function layout() {
    if (busy) return; busy = true;
    requestAnimationFrame(() => {
      const c = document.querySelector('.container');
      const home = document.body.getAttribute('data-active-screen') === 'home';
      document.querySelectorAll('.mg-wide').forEach(e => e.classList.remove('mg-wide'));
      document.querySelectorAll('.mg-autogrid').forEach(e => e.classList.remove('mg-autogrid'));
      if (!c || !WIDE.matches || home) { c && c.classList.remove('mg-cols'); busy = false; return; }
      c.classList.add('mg-cols');
      const visible = k => k.offsetParent !== null && k.offsetHeight > 0 && !/^(STYLE|SCRIPT|TEMPLATE)$/.test(k.tagName);
      // an empty wrapper (e.g. #ie-grid off the Cash Flow tab) must not split the columns
      [...c.children].forEach(k => k.classList.toggle('mg-skip', !k.classList.contains('card') && k.offsetHeight === 0));
      // 1) very tall cards span the full row
      [...c.children].filter(k => k.classList.contains('card') && visible(k)).forEach(card => {
        if (card.offsetHeight > TALL) { card.classList.add('mg-wide'); const l = findRepeatingList(card); l && l.classList.add('mg-autogrid'); }
      });
      // 2) split the remaining cards into runs between full-width blocks; a card alone in its run
      //    goes full width too, and the column count follows the biggest run (max 3)
      const runs = [[]];
      [...c.children].filter(visible).forEach(k => {
        if (k.classList.contains('card') && !k.classList.contains('mg-wide')) runs[runs.length - 1].push(k);
        else runs.push([]);
      });
      let most = 0;
      runs.forEach(r => { if (r.length === 1) { r[0].classList.add('mg-wide'); const l = findRepeatingList(r[0], 50); l && l.classList.add('mg-autogrid'); } else most = Math.max(most, r.length); });
      c.dataset.mgCols = String(Math.min(most || 1, window.innerWidth >= 1360 ? 3 : 2));
      // 3) side-by-side pairs inside #ie-grid: a column far taller than its partner lays its items out in two columns
      const ie = document.getElementById('ie-grid');
      if (ie && visible(ie)) [...ie.children].forEach(card => { if (card.offsetHeight > 900) { const l = findRepeatingList(card); l && l.classList.add('mg-autogrid', 'mg-two'); } });
      busy = false;
    });
  }

  function wrap(name) {
    const fn = window[name];
    if (typeof fn !== 'function' || fn.__mgWrapped) return;
    const w = function () { const r = fn.apply(this, arguments); setTimeout(layout, 60); return r; };
    w.__mgWrapped = true; window[name] = w;
  }
  function boot() {
    ['switchScreen', 'switchMoneyTab', 'switchSubTab', 'refreshAll', 'renderAll'].forEach(wrap);
    layout();
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(layout, 150); });
    WIDE.addEventListener ? WIDE.addEventListener('change', layout) : WIDE.addListener(layout);
    // cards that open/close change heights
    document.addEventListener('click', e => { if (e.target.closest('.card h2, .collapsible h2, .mg-subtab-btn, .money-tab-btn, .lab-tab')) setTimeout(layout, 400); });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 300)) : setTimeout(boot, 300);
})();
