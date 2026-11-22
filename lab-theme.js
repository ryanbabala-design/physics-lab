/* 智忠大人的教學模擬器：米色主題（放在每支模擬器 <head> 最前面）
 * 目標：所有底色統一為米色，文字與線條改為深色高對比，投影到大螢幕也看得清楚。
 * 作法：不改各模擬器原本的程式，而是在「上色」的那一刻把顏色換掉：
 *   1. 畫布（canvas）：攔截 fillStyle / strokeStyle / 漸層顏色，深色底 → 米色、亮色字線 → 深色、霓虹色 → 加深
 *   2. 網頁版面：依每個元素實際的顏色重新配色，並檢查文字與底色的對比
 * 想暫時看原本配色：網址加上 ?theme=original
 */
(function () {
  'use strict';
  var w = window, d = document;
  // 光學類模擬器維持原本深色配色（光線在黑底上較清楚）
  var KEEP_ORIGINAL = { 'pinhole.html': 1, 'reflection-law.html': 1, 'plane-mirror-drawing.html': 1, 'plane-mirror-image.html': 1, 'curved-mirrors.html': 1, 'wheel-refraction-model.html': 1, 'refraction-total-reflection.html': 1, 'three-layer-refraction.html': 1, 'lens-surface-refraction.html': 1, 'lens-types.html': 1, 'lens-black-box.html': 1, 'lens-imaging.html': 1, 'eye-vision.html': 1, 'optical-instruments.html': 1, 'dispersion-color.html': 1 };
  if (KEEP_ORIGINAL[(location.pathname.split('/').pop() || '').toLowerCase()]) { w.LAB_THEME = { on: false }; return; }
  var off = /[?&]theme=original/.test(location.search);
  try { if (off) sessionStorage.setItem('lab-theme', 'original'); else if (/[?&]theme=beige/.test(location.search)) sessionStorage.removeItem('lab-theme'); off = off || sessionStorage.getItem('lab-theme') === 'original'; } catch (e) {}
  if (off) { w.LAB_THEME = { on: false }; return; }

  /* ---------- 配色表 ---------- */
  var PAL = {
    page: [243, 234, 215],     // 米色底 #F3EAD7
    card: [251, 246, 236],     // 奶油色卡片 #FBF6EC
    ink: [43, 33, 24],         // 深棕墨色文字 #2B2118
    paper: [255, 252, 245]     // 淺色字（用在深色按鈕上）
  };

  /* 每支模擬器畫布原本是深底還是淺底（自動偵測為輔） */
  var file = (location.pathname.split('/').pop() || '').toLowerCase();
  var LIGHT_CANVAS = { 'plane-mirror-drawing.html': 1, 'plane-mirror-image.html': 1, 'curved-mirrors.html': 1, 'lens-imaging.html': 1, 'eye-vision.html': 1, 'optical-instruments.html': 1, 'torque-balance.html': 1 };

  /* ---------- 顏色工具 ---------- */
  var probe = d.createElement('canvas').getContext('2d');
  var P = CanvasRenderingContext2D.prototype;
  var rawFill = Object.getOwnPropertyDescriptor(P, 'fillStyle');
  function parse(str) {
    // 借用畫布把任何 CSS 顏色字串正規化成 #rrggbb 或 rgba(r, g, b, a)
    rawFill.set.call(probe, '#010203');
    rawFill.set.call(probe, str);
    var v = rawFill.get.call(probe);
    if (typeof v !== 'string') return null;
    if (v === '#010203' && !/^#?010203$/i.test(String(str).trim())) return null;
    if (v[0] === '#') return [parseInt(v.substr(1, 2), 16), parseInt(v.substr(3, 2), 16), parseInt(v.substr(5, 2), 16), 1];
    var m = v.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    var p = m[1].split(',').map(parseFloat);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  function parseCss(s) {
    var m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    var p = m[1].replace(/\//, ',').split(/[\s,]+/).filter(Boolean).map(parseFloat);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  function toHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) {
      var dd = mx - mn; s = l > 0.5 ? dd / (2 - mx - mn) : dd / (mx + mn);
      h = mx === r ? (g - b) / dd + (g < b ? 6 : 0) : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4; h *= 60;
    }
    return [h, s, l];
  }
  function toRgb(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    function f(p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }
    if (s === 0) { var v = Math.round(l * 255); return [v, v, v]; }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    return [Math.round(f(p, q, h + 1 / 3) * 255), Math.round(f(p, q, h) * 255), Math.round(f(p, q, h - 1 / 3) * 255)];
  }
  function fmt(c, a) { return a >= 1 ? 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')' : 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (+a.toFixed(3)) + ')'; }
  function lum(c) {
    var a = c.slice(0, 3).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

  /* 深色系 → 米色系（明暗反轉，保持層次） */
  function mapDark(c) {
    var hsl = toHsl(c[0], c[1], c[2]), h = hsl[0], s = hsl[1], l = hsl[2];
    if (s < 0.22 || (l < 0.2 && s < 0.6)) {
      var L = l < 0.5 ? Math.min(0.93, 0.96 - 0.7 * l) : 0.95 - 0.86 * l;   // 深底→米色、白字→深墨
      return L > 0.6 ? toRgb(40, L > 0.86 ? 0.45 : 0.3, L) : toRgb(28, 0.22, Math.max(L, 0.12));
    }
    if (c[3] !== undefined && c[3] < 0.6 && l >= 0.22) return c.slice(0, 3);   // 半透明光暈：保留原本亮色
    if (l < 0.22) return toRgb(h, Math.min(s, 0.6) * 0.55, 0.9 - l * 0.4);   // 深色帶色的面板 → 淡色帶色
    if (l > 0.42) return toRgb(h, Math.min(s, 0.9), Math.max(0.3, 0.42 - (l - 0.42) * 0.35)); // 霓虹亮色 → 加深
    return toRgb(h, Math.min(s, 0.9), l);
  }
  /* 淺色系：白、淺灰 → 米色／奶油色；其他保留，太淡的彩色加深一點 */
  function mapLight(c) {
    var hsl = toHsl(c[0], c[1], c[2]), h = hsl[0], s = hsl[1], l = hsl[2];
    if (s < 0.22 && l > 0.84) return l > 0.985 ? PAL.card.slice() : toRgb(40, 0.5, 0.86 + (l - 0.84) * 0.6);
    if (s < 0.22) return toRgb(28, Math.max(s, 0.08), l * 0.92);           // 灰字 → 暖色深灰
    return c.slice(0, 3);
  }

  var cache = {};
  function mapColor(str, mode) {
    if (typeof str !== 'string') return str;
    var k = mode + '|' + str;
    if (k in cache) return cache[k];
    var c = parse(str), out = str;
    if (c) out = fmt(mode === 'dark' ? mapDark(c) : mapLight(c), c[3]);
    cache[k] = out;
    return out;
  }

  /* ---------- 1. 畫布上色攔截 ---------- */
  function ctxMode(ctx) {
    if (ctx.__labMode) return ctx.__labMode;
    var cv = ctx.canvas;
    var m = LIGHT_CANVAS[file] ? 'light' : null;
    if (!m && cv && cv.dataset && cv.dataset.labMode) m = cv.dataset.labMode;
    return m || 'dark';
  }
  ['fillStyle', 'strokeStyle', 'shadowColor'].forEach(function (prop) {
    var desc = Object.getOwnPropertyDescriptor(P, prop);
    if (!desc || !desc.set) return;
    Object.defineProperty(P, prop, {
      configurable: true, enumerable: desc.enumerable,
      get: function () { return desc.get.call(this); },
      set: function (v) { desc.set.call(this, typeof v === 'string' ? mapColor(v, ctxMode(this)) : v); }
    });
  });
  var gcoDesc = Object.getOwnPropertyDescriptor(P, 'globalCompositeOperation');
  if (gcoDesc && gcoDesc.set) Object.defineProperty(P, 'globalCompositeOperation', {
    configurable: true, enumerable: gcoDesc.enumerable,
    get: function () { return gcoDesc.get.call(this); },
    // 「發光疊加」在淺底上會變成一片白，改成一般疊加
    set: function (v) { gcoDesc.set.call(this, (v === 'lighter' || v === 'screen' || v === 'plus-lighter') ? 'source-over' : v); }
  });
  ['createLinearGradient', 'createRadialGradient', 'createConicGradient'].forEach(function (fn) {
    var orig = P[fn]; if (!orig) return;
    P[fn] = function () { var g = orig.apply(this, arguments); g.__labMode = ctxMode(this); return g; };
  });
  if (w.CanvasGradient) {
    var addStop = CanvasGradient.prototype.addColorStop;
    CanvasGradient.prototype.addColorStop = function (o, c) { return addStop.call(this, o, mapColor(c, this.__labMode || 'dark')); };
  }

  /* ---------- 2. 網頁版面配色 ---------- */
  var pageMode = null;        // 依 body 底色判斷原本是深色還是淺色主題
  var bgOf = new WeakMap();
  var busy = false;
  var PROPS = ['background-color', 'color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
  function mapCssColor(s, mode) {
    var c = parseCss(s); if (!c || c[3] === 0) return null;
    return [mode === 'dark' ? mapDark(c) : mapLight(c), c[3]];
  }
  function effBg(el) {
    for (var p = el; p && p.nodeType === 1; p = p.parentElement) { var b = bgOf.get(p); if (b) return b; }
    return PAL.page;
  }
  function themeEl(el) {
    if (!el || el.nodeType !== 1 || el === d.body || el === d.documentElement) return;
    var tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CANVAS' || tag === 'IMG' || tag === 'VIDEO' || tag === 'svg' || tag === 'IFRAME' || el.id === 'lab-home-btn' || (el.closest && el.closest('.lab-nav'))) return;
    // 先拿掉自己上過的色，讀回原本的顏色
    if (el.__labStyled) { PROPS.concat(['background-image']).forEach(function (p) { if (el.__labStyled[p] !== undefined) el.style.removeProperty(p); }); }
    var cs = w.getComputedStyle(el), styled = {};
    var bg = mapCssColor(cs.backgroundColor, pageMode);
    if (bg && pageMode === 'light') {
      var raw = parseCss(cs.backgroundColor), hs = toHsl(raw[0], raw[1], raw[2]);
      if (hs[2] < 0.3 && (hs[1] < 0.5 || hs[2] < 0.14)) bg = [mapDark(raw), raw[3]];   // 深色工具列、提示列
    }
    if (bg) {
      var parentBg = effBg(el.parentElement);
      // 半透明底色：先和下方底色混合，算出實際看到的顏色
      var a = bg[1], mixed = [0, 1, 2].map(function (i) { return Math.round(bg[0][i] * a + parentBg[i] * (1 - a)); });
      styled['background-color'] = fmt(bg[0], a);
      bgOf.set(el, a > 0.5 ? mixed : parentBg);
    }
    var bi = cs.backgroundImage;
    if (bi && bi !== 'none' && /gradient/.test(bi)) {
      styled['background-image'] = bi.replace(/rgba?\([^)]+\)/g, function (m) { var r = mapCssColor(m, pageMode); return r ? fmt(r[0], r[1]) : m; });
      var first = bi.match(/rgba?\([^)]+\)/);
      if (first) { var fr = mapCssColor(first[0], pageMode); if (fr) bgOf.set(el, fr[0]); }
    }
    ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'].forEach(function (p) {
      var bw = parseFloat(cs.getPropertyValue(p.replace('-color', '-width'))); if (!bw) return;
      var r = mapCssColor(cs.getPropertyValue(p), pageMode); if (r) styled[p] = fmt(r[0], r[1]);
    });
    var fg = parseCss(cs.color);
    if (fg) {
      // 顏色若是從外層繼承來的（外層已換過色），就不要再換一次，只檢查對比
      var par = el.parentElement, inherited = par && par.nodeType === 1 && w.getComputedStyle(par).color === cs.color;
      var back = effBg(el), m2 = inherited ? null : mapCssColor(cs.color, pageMode), col = m2 ? m2[0] : fg.slice(0, 3);
      // 對比不足（例如深色按鈕上的字）→ 改用深墨或淺色字，取對比高的
      if (contrast(col, back) < 4.2) col = contrast(PAL.ink, back) >= contrast(PAL.paper, back) ? PAL.ink : PAL.paper;
      else if (inherited) col = null;
      if (col) styled['color'] = fmt(col, fg[3]);
    }
    busy = true;
    for (var p in styled) { el.style.setProperty(p, styled[p], 'important'); styled[p] = el.style.getPropertyValue(p); }
    busy = false;
    el.__labStyled = styled;
  }
  function themeTree(root) {
    if (!root || root.nodeType !== 1) return;
    themeEl(root);
    var all = root.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) themeEl(all[i]);
  }
  function start() {
    var bc = parseCss(w.getComputedStyle(d.body).backgroundColor);
    if (!bc || bc[3] === 0) bc = parseCss(w.getComputedStyle(d.documentElement).backgroundColor);
    pageMode = bc && bc[3] > 0 && toHsl(bc[0], bc[1], bc[2])[2] < 0.4 ? 'dark' : 'light';
    d.documentElement.style.setProperty('background-color', fmt(PAL.page, 1), 'important');
    d.body.style.setProperty('background-color', fmt(PAL.page, 1), 'important');
    d.body.style.setProperty('background-image', 'none', 'important');
    bgOf.set(d.body, PAL.page);
    themeTree(d.body);
    // 程式切換按鈕狀態、加入新內容時，跟著重新配色
    var pending = new Set(), scheduled = false;
    function flush() {
      scheduled = false;
      var list = Array.from(pending); pending.clear();
      list.forEach(function (el) { if (el.isConnected) themeTree(el); });
    }
    new MutationObserver(function (muts) {
      if (busy) return;
      muts.forEach(function (m) {
        if (m.type === 'attributes') { if (m.attributeName === 'style' && m.target.__labStyled && sameStyled(m.target)) return; pending.add(m.target); }
        else m.addedNodes.forEach(function (n) { if (n.nodeType === 1) pending.add(n); });
      });
      if (pending.size && !scheduled) { scheduled = true; requestAnimationFrame(flush); }
    }).observe(d.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style'] });
    // 畫布原本若是靠 CSS 底色（畫面清成透明），也一併換成米色
    setTimeout(function () { try { w.dispatchEvent(new Event('resize')); } catch (e) {} }, 50);
  }
  function sameStyled(el) {
    var s = el.__labStyled;
    for (var p in s) if (el.style.getPropertyValue(p) !== s[p]) return false;
    return true;
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', function () { setTimeout(start, 0); });
  else start();
  // Tailwind 樣式是執行時才產生，載入完成後再整理一次
  w.addEventListener('load', function () { setTimeout(function () { themeTree(d.body); }, 120); });

  w.LAB_THEME = { on: true, map: mapColor, retheme: function () { themeTree(d.body); } };
})();
