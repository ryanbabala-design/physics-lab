/* 智忠大人的教學模擬器：每支模擬器共用的工具
 * - 導覽列（上一支／首頁／下一支／演示／全螢幕）：單獨開啟模擬器時才顯示；在首頁外框裡由外框負責
 * - 演示模式：把主畫布放大到整個畫面，控制面板暫時收起
 * - iPad 觸控補強、離線快取註冊
 */
(function () {
  'use strict';
  var d = document, w = window;
  var file = (location.pathname.split('/').pop() || '').toLowerCase();
  var SIMS = w.LAB_SIMS || [];
  var idx = -1;
  for (var i = 0; i < SIMS.length; i++) if (SIMS[i].file === file) idx = i;
  var framed = false;
  try { framed = w.self !== w.top && w.parent.LAB_SHELL === true; } catch (e) { framed = false; }

  /* ---------- 共用樣式 ---------- */
  var css = [
    '.lab-nav{position:fixed;left:12px;bottom:12px;z-index:47;display:flex;align-items:stretch;gap:2px;padding:3px;border-radius:999px;',
    'background:rgba(15,23,42,.86);box-shadow:0 4px 14px rgba(0,0,0,.3);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);',
    "font:600 15px/1 system-ui,-apple-system,'PingFang TC','Microsoft JhengHei',sans-serif;-webkit-user-select:none;user-select:none}",
    '.lab-nav a,.lab-nav button{display:flex;align-items:center;gap:5px;min-height:42px;padding:0 13px;border-radius:999px;border:0;',
    'background:transparent;color:#fff;font:inherit;text-decoration:none;white-space:nowrap;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.lab-nav .on{background:rgba(255,255,255,.16)}.lab-nav .off{opacity:.3;pointer-events:none}',
    '.lab-nav .lab-min{padding:0 11px;font-size:18px}',
    '.lab-nav.mini>*:not(.lab-min){display:none}',
    /* 演示模式 */
    'html.lab-demo,html.lab-demo body{overflow:hidden!important}',
    '.lab-stage{position:fixed!important;inset:0!important;left:0!important;top:0!important;z-index:45!important;margin:0!important;',
    'width:100vw!important;max-width:none!important;height:100vh!important;height:100dvh!important;max-height:none!important;border-radius:0!important;',
    'display:flex!important;flex-direction:column!important;overflow:auto!important;box-sizing:border-box!important;',
    'padding-top:max(10px,var(--lab-safe-top,0px))!important;padding-bottom:62px!important}'
  ].join('');
  var st = d.createElement('style'); st.textContent = css; (d.head || d.documentElement).appendChild(st);

  /* ---------- 演示模式 ---------- */
  // 找出最大的畫布 → 它所在的卡片（含標題與工具列）放大成整個畫面；
  // 畫布維持原本的長寬比，放到畫面容得下的最大尺寸，其餘內容可往下捲。
  var demo = { on: false, stage: null, box: null, ratio: 1.6, ph: null, saved: [], back: null };
  function bigCanvas() {
    var best = null, area = 0;
    var cs = d.querySelectorAll('canvas');
    for (var i = 0; i < cs.length; i++) {
      var r = cs[i].getBoundingClientRect(), a = r.width * r.height;
      if (a > area) { area = a; best = cs[i]; }
    }
    return best;
  }
  function findStage(cv) {
    var stop = { BODY: 1, HTML: 1, MAIN: 1, SECTION: 1, ASIDE: 1, ARTICLE: 1 };
    var el = cv, stage = null, vw = w.innerWidth;
    while (el.parentElement && !stop[el.parentElement.tagName]) {
      el = el.parentElement;
      var s = w.getComputedStyle(el);
      if (el.getBoundingClientRect().width > vw * 0.98) break;
      if (parseFloat(s.borderTopLeftRadius) >= 10 || (s.boxShadow && s.boxShadow !== 'none')) stage = el;
    }
    return stage || cv.parentElement;
  }
  function fire() { try { w.dispatchEvent(new Event('resize')); } catch (e) {} }
  function save(el, props) {
    var o = { el: el, css: el.style.cssText };
    demo.saved.push(o);
    for (var k in props) el.style.setProperty(k, props[k], 'important');
  }
  function fit() {
    if (!demo.on) return;
    var stage = demo.stage, box = demo.box;
    var cs = w.getComputedStyle(stage);
    var innerW = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var top = box.getBoundingClientRect().top - stage.getBoundingClientRect().top + stage.scrollTop;
    var H = stage.clientHeight - top - parseFloat(cs.paddingBottom) - 4;
    H = Math.max(H, 260);
    var W = Math.min(innerW, H * demo.ratio);
    H = W / demo.ratio;
    box.style.setProperty('width', Math.floor(W) + 'px', 'important');
    box.style.setProperty('height', Math.floor(H) + 'px', 'important');
  }
  function setDemo(on) {
    if (on === demo.on) return demo.on;
    if (on) {
      var cv = bigCanvas(); if (!cv) return false;
      var stage = findStage(cv);
      var box = cv.parentElement === stage ? cv : cv.parentElement;
      var r = box.getBoundingClientRect();
      demo.ratio = r.width > 0 && r.height > 0 ? r.width / r.height : 1.6;
      demo.stage = stage; demo.box = box; demo.saved = [];
      demo.ph = d.createComment('lab-stage');
      stage.parentNode.insertBefore(demo.ph, stage);
      d.body.appendChild(stage);
      var bg = w.getComputedStyle(stage).backgroundColor;
      var props = {};
      if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') props['background-color'] = w.getComputedStyle(d.body).backgroundColor || '#fff';
      save(stage, props);
      stage.classList.add('lab-stage');
      // 不透明底板：卡片若是半透明，後面的頁面才不會透出來
      var bodyBg = w.getComputedStyle(d.body).backgroundColor;
      if (!bodyBg || bodyBg === 'transparent' || bodyBg === 'rgba(0, 0, 0, 0)') bodyBg = w.getComputedStyle(d.documentElement).backgroundColor;
      if (!bodyBg || bodyBg === 'transparent' || bodyBg === 'rgba(0, 0, 0, 0)') bodyBg = '#0f172a';
      demo.back = d.createElement('div');
      demo.back.style.cssText = 'position:fixed;inset:0;z-index:44;background:' + bodyBg.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, 'rgb($1,$2,$3)');
      d.body.insertBefore(demo.back, stage);
      // 畫布外層：解除寬度限制、置中
      for (var el = box.parentElement; el && el !== stage; el = el.parentElement)
        save(el, { 'width': '100%', 'max-width': 'none', 'grid-column': '1 / -1', 'align-self': 'stretch' });
      save(box, { 'flex': 'none', 'aspect-ratio': 'auto', 'min-height': '0', 'max-height': 'none', 'max-width': 'none', 'margin-left': 'auto', 'margin-right': 'auto' });
      if (box === cv) save(cv, { 'display': 'block' });
      d.documentElement.classList.add('lab-demo');
      demo.on = true;
      fit();
    } else {
      var s = demo.stage;
      if (s) {
        s.classList.remove('lab-stage');
        for (var i = demo.saved.length - 1; i >= 0; i--) demo.saved[i].el.style.cssText = demo.saved[i].css;
        if (demo.ph && demo.ph.parentNode) { demo.ph.parentNode.insertBefore(s, demo.ph); demo.ph.parentNode.removeChild(demo.ph); }
      }
      if (demo.back && demo.back.parentNode) demo.back.parentNode.removeChild(demo.back);
      d.documentElement.classList.remove('lab-demo');
      demo.on = false; demo.stage = null; demo.box = null; demo.ph = null; demo.saved = [];
    }
    fire(); setTimeout(fire, 60); setTimeout(fire, 300);
    return demo.on;
  }
  w.addEventListener('resize', function () { if (demo.on) fit(); });

  /* ---------- 全螢幕 ---------- */
  function fsEl() { return d.fullscreenElement || d.webkitFullscreenElement; }
  function canFs() {
    var el = d.documentElement;
    return !!(el.requestFullscreen || el.webkitRequestFullscreen) && !!(d.fullscreenEnabled || d.webkitFullscreenEnabled);
  }
  function isApp() { return w.navigator.standalone || (w.matchMedia && w.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches); }
  function toggleFs() {
    var el = d.documentElement;
    if (fsEl()) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else { var p = (el.requestFullscreen || el.webkitRequestFullscreen).call(el); if (p && p.catch) p.catch(function () {}); }
  }

  /* ---------- iPad 觸控：把手指點按／拖曳轉成原本程式的滑鼠移動 ---------- */
  var TOUCH = { 'sound-spectrum-25k.html': 'canvas-container', 'spectrogram-2d.html': 'canvas-container' };
  function touchShim() {
    var el = TOUCH[file] && d.getElementById(TOUCH[file]);
    if (!el) return;
    el.style.touchAction = 'none';
    function fwd(e) {
      if (e.pointerType === 'mouse') return;
      el.dispatchEvent(new MouseEvent('mousemove', { clientX: e.clientX, clientY: e.clientY, bubbles: true, cancelable: true, view: w }));
    }
    el.addEventListener('pointerdown', fwd); el.addEventListener('pointermove', fwd);
  }

  /* ---------- 導覽列（單獨開啟時） ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function buildNav() {
    var nav = d.createElement('nav');
    nav.className = 'lab-nav'; nav.id = 'lab-home-btn'; nav.setAttribute('aria-label', '模擬器導覽');
    function link(j, label) {
      if (j < 0 || j >= SIMS.length) return '<span class="off" aria-hidden="true" style="display:flex;align-items:center;padding:0 13px;color:#fff">' + label + '</span>';
      return '<a href="' + SIMS[j].file + '" title="' + esc(SIMS[j].title) + '">' + label + '</a>';
    }
    nav.innerHTML =
      '<button type="button" class="lab-min" title="收合導覽列" aria-label="收合導覽列">☰</button>' +
      (idx >= 0 ? link(idx - 1, '◀ 上一支') : '') +
      '<a href="index.html" class="on"><span style="font-size:17px">⌂</span>首頁</a>' +
      (idx >= 0 ? link(idx + 1, '下一支 ▶') : '') +
      '<button type="button" class="lab-demo-btn">🎯 演示</button>' +
      '<button type="button" class="lab-fs-btn" style="display:none"></button>';
    d.body.appendChild(nav);
    nav.querySelector('.lab-min').addEventListener('click', function () { nav.classList.toggle('mini'); });
    var db = nav.querySelector('.lab-demo-btn');
    db.addEventListener('click', function () { var on = setDemo(!demo.on); db.textContent = on ? '↩ 一般' : '🎯 演示'; db.classList.toggle('on', on); });
    var fb = nav.querySelector('.lab-fs-btn');
    if (canFs() && !isApp()) {
      fb.style.display = 'flex';
      var lab = function () { fb.innerHTML = fsEl() ? '⤡ 退出' : '⛶ 全螢幕'; };
      fb.addEventListener('click', toggleFs);
      d.addEventListener('fullscreenchange', lab); d.addEventListener('webkitfullscreenchange', lab); lab();
    }
  }

  /* ---------- 給外框呼叫的介面 ---------- */
  w.LAB = { demo: setDemo, isDemo: function () { return demo.on; }, file: file, index: idx };

  function init() {
    touchShim();
    if (!framed) buildNav();
    // 舊版頁面內嵌的導覽（若有）在外框內隱藏
    if (framed) { var old = d.getElementById('lab-home-btn'); if (old) old.style.display = 'none'; }
    if (!framed && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
    try { if (framed) w.parent.postMessage({ lab: 'ready', file: file }, '*'); } catch (e) {}
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
