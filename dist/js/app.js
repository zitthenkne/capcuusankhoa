'use strict';
(() => {
const C = window.COURSE, L = C.lessons, M = C.modules, ZS = window.ZS, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const STORE = 'zitthenk-osce-san-6-v1', validIds = new Set(L.map(l => l.id));
const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plain = s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const norm = s => plain(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const md = t => e(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rand = a => a[Math.floor(Math.random() * a.length)];
const fresh = () => ({ version: 1, done: [], answers: {}, bookmarks: [], notes: {}, rubrics: {}, last: L[0].id, sound: true });
function sanitize(s) {
  if (!s || typeof s !== 'object' || Array.isArray(s) || s.version !== 1) throw Error('Không đúng định dạng tiến độ của sổ tay này.');
  const out = fresh();
  for (const k of ['done', 'bookmarks']) out[k] = [...new Set(Array.isArray(s[k]) ? s[k].filter(x => validIds.has(x)) : [])];
  if (validIds.has(s.last)) out.last = s.last;
  out.sound = s.sound !== false;
  if (s.answers && typeof s.answers === 'object') for (const [id, a] of Object.entries(s.answers)) if (validIds.has(id) && a && Number.isInteger(a.choice) && a.choice >= 0 && a.choice < 3) out.answers[id] = { choice: a.choice, correct: a.choice === L.find(x => x.id === id).quiz.answer, attempts: Math.min(999, Math.max(1, Number(a.attempts) || 1)) };
  for (const k of ['notes', 'rubrics']) if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) for (const [id, v] of Object.entries(s[k])) { if (!/^[a-z0-9_-]{1,120}$/.test(id)) continue; if (k === 'notes' && typeof v === 'string') out[k][id] = v.slice(0, 20000); if (k === 'rubrics' && Array.isArray(v)) out[k][id] = v.filter(n => Number.isInteger(n) && n >= 0 && n < 100); }
  return out;
}
let state = fresh(), storageOK = true;
try { const raw = localStorage.getItem(STORE); if (raw) state = sanitize(JSON.parse(raw)); } catch (err) { storageOK = false; }
function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); storageOK = true; } catch (err) { if (storageOK) toast('Trình duyệt không lưu được tiến độ. Bạn dùng nút “Lưu tiến độ” để giữ lại nha.'); storageOK = false; } updateTop(); }
let toastTimer, audioCtx, caseTimer = null, remaining = 300, timerRunning = false, currentCaseId = '';
function toast(message) { const t = $('#toast'); t.textContent = message; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800); }
function sound(kind = 'pop') {
  if (!state.sound) return;
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume(); const now = audioCtx.currentTime;
    const t = (f, o, d, ty = 'sine', v = .06, f2) => { const os = audioCtx.createOscillator(), g = audioCtx.createGain(); os.type = ty; os.connect(g); g.connect(audioCtx.destination); os.frequency.setValueAtTime(f, now + o); if (f2) os.frequency.exponentialRampToValueAtTime(f2, now + o + d); g.gain.setValueAtTime(v, now + o); g.gain.exponentialRampToValueAtTime(.001, now + o + d); os.start(now + o); os.stop(now + o + d + .02); };
    if (kind === 'pop') t(520, 0, .09, 'sine', .06, 800);
    else if (kind === 'tick') t(660, 0, .04, 'sine', .03);
    else if (kind === 'chime') [523, 659, 784].forEach((f, i) => t(f, i * .1, .24));
    else if (kind === 'buzz') t(170, 0, .22, 'square', .03, 105);
    else if (kind === 'tada') [523, 659, 784, 1047].forEach((f, i) => t(f, i * .09, .32, 'triangle', .07));
  } catch (err) { /* âm thanh là phần thêm, không có cũng học được */ }
}
// kiến thức Y4 đầy đủ nhưng chia thẻ nhỏ: câu đầu luôn thấy, phần còn lại mở khi bấm
function deepCards(html, open) {
  const d = document.createElement('div'); d.innerHTML = html; let out = '';
  [...d.children].forEach(el => {
    if (el.tagName !== 'P') { out += el.outerHTML; return; }
    const m = el.innerHTML.match(/^(.{40,}?[.:;!?](?:<\/[a-z]+>)?)\s+([\s\S]+)$/);
    out += m ? `<details class="dc"${open ? ' open' : ''}><summary>${m[1]}</summary><div>${m[2]}</div></details>` : `<div class="dc one">${el.innerHTML}</div>`;
  });
  return out;
}
const PRAISE = ['Chuẩn rồi! 🎉', 'Xịn xò! ✨', 'Giỏi quá trời! 🌟', 'Đỉnh luôn! 💖', 'Thông minh ghê! 🧠'];
function burst(el) {
  const r = (el || document.body).getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  ['✨', '🌸', '⭐', '💖', '✨', '🌟'].forEach((c, i) => { const s = document.createElement('span'); s.className = 'sp'; s.textContent = c; s.style.left = cx + 'px'; s.style.top = cy + 'px'; const a = i / 6 * 6.28 + Math.random(); s.style.setProperty('--dx', Math.cos(a) * 80 + 'px'); s.style.setProperty('--dy', Math.sin(a) * 70 - 20 + 'px'); document.body.appendChild(s); setTimeout(() => s.remove(), 950); });
}
// bé Giọt: linh vật giọt máu đội mũ y tá, đổi mặt theo tâm trạng
function mascot(mood = 'happy', cls = 'mas') {
  const eye = x => mood === 'ouch' ? `<path d="M${x - 3} 38l6 6m0-6l-6 6" stroke="#4a3f63" stroke-width="2.4" stroke-linecap="round"/>` : `<ellipse cx="${x}" cy="41" rx="3.3" ry="${mood === 'wow' ? 5 : 4.3}" fill="#4a3f63"/><circle cx="${x + 1}" cy="39.6" r="1.2" fill="#fff"/>`;
  const mo = { happy: '<path d="M26 51q6 6 12 0" fill="none" stroke="#4a3f63" stroke-width="2.4" stroke-linecap="round"/>', sad: '<path d="M26 56q6-5 12 0" fill="none" stroke="#4a3f63" stroke-width="2.4" stroke-linecap="round"/>', worry: '<path d="M25 55q3.5-4 7 0q3.5 4 7 0" fill="none" stroke="#4a3f63" stroke-width="2.4" stroke-linecap="round"/>', wow: '<ellipse cx="32" cy="53" rx="3" ry="4" fill="#4a3f63"/>', ouch: '<path d="M26 56q6-5 12 0" fill="none" stroke="#4a3f63" stroke-width="2.4" stroke-linecap="round"/>' }[mood] || '';
  return `<svg class="${cls}" viewBox="0 0 64 68" aria-hidden="true"><path d="M32 4C32 4 7 34 7 46a25 25 0 0 0 50 0C57 34 32 4 32 4Z" fill="#ff7a93" stroke="#e0506f" stroke-width="3" stroke-linejoin="round"/><ellipse cx="19" cy="42" rx="3.6" ry="6.5" fill="#fff" opacity=".5" transform="rotate(16 19 42)"/>${eye(24)}${eye(40)}<circle cx="18" cy="49" r="3.8" fill="#ffb0c4" opacity=".85"/><circle cx="46" cy="49" r="3.8" fill="#ffb0c4" opacity=".85"/>${mo}<path d="M19 22Q19 8 32 8Q45 8 45 22Z" fill="#fff" stroke="#e0506f" stroke-width="2.6" stroke-linejoin="round"/><path d="M32 11v8M28 15h8" stroke="#e0506f" stroke-width="2.6" stroke-linecap="round"/></svg>`;
}
const MODICON = { goc: '🌱', soc: '🥶', duphong: '🛡️', pph: '🩸', ntd: '🥧', nbn: '🌩️', votc: '⚡', tolac: '🛤️', vai: '💪', afe: '🌊' };
const PARTS = [['A', '🌱 Nền tảng', ['goc']], ['B', '🛡️ Sốc & Dự phòng', ['soc', 'duphong']], ['C', '🚨 Xử trí băng huyết', ['pph']], ['D', '🧩 Nhau & tử cung', ['ntd', 'nbn', 'votc']], ['E', '🌟 Đọc thêm', ['tolac', 'vai', 'afe']]];
const SIGN = '✎ Nguyễn Việt Thanh - Y23C - 17';
function updateTop() {
  const good = Object.values(state.answers).filter(a => a.correct).length;
  $('#stars').textContent = '⭐ ' + (state.done.length + good);
  $('#sound').textContent = state.sound ? '🔔' : '🔕'; $('#sound').setAttribute('aria-pressed', String(state.sound)); $('#sound').setAttribute('aria-label', state.sound ? 'Tắt âm thanh' : 'Bật âm thanh');
}
function sourceLabel(s) { return typeof s === 'string' ? s : [s.label || s.file || s.title || s.id, arr(s.pages).length ? 'tr. ' + arr(s.pages).join(', ') : ''].filter(Boolean).join(' · '); }
function refs(ids) { return '<div class="source-stamps">' + [...new Set(ids || [])].map(id => typeof id === 'object' ? `<span title="${e(id.path || '')}">${e(sourceLabel(id))}</span>` : `<a href="#/sources/${e(id)}" title="${e(C.sources[id]?.title || id)}">↗ ${e(id)}${C.sources[id]?.year ? ' · ' + e(C.sources[id].year) : ''}</a>`).join('') + '</div>'; }
function moduleOf(l) { return M.find(m => m.id === l.module); }
function moduleLessons(m) { return L.filter(l => l.module === (typeof m === 'string' ? m : m.id)); }
function go(hash) { location.hash = hash; }
function renderRail() { updateTop(); }
function setBar(html) { $('#botbar').innerHTML = html; }
function setView(mode, color = 'pink', where = '', pct = 0) {
  document.body.className = 'c-' + color; const st = $('#stage'); st.className = mode; $('#where').textContent = where; $('#progress-bar').style.width = pct + '%';
}
function initTOC() { $('#toc-list').innerHTML = M.map(m => `<h3>${MODICON[m.id]} ${m.n} · ${e(m.title)}${m.extra ? ' · Đọc thêm' : ''}</h3>${moduleLessons(m).map(l => `<a href="#/step/${l.id}"><span>${state.done.includes(l.id) ? '✅' : '⚪'}</span>${e(l.title)}</a>`).join('')}`).join(''); }

// ───────── trang chủ: bản đồ lộ trình
function renderMap() {
  const last = L.find(l => l.id === state.last) || L[0], count = state.done.length, pct = Math.round(count / L.length * 100), circ = 2 * Math.PI * 44;
  setView('map', 'pink', '', 0); renderRail();
  $('#stage').innerHTML = `<section class="hero c-pink"><div>${mascot('happy', 'mas')}</div><div><h1>zitthenk học<br>Cấp cứu Sản khoa 🩸</h1><p>Học bằng cách chơi: bấm, kéo, thử — mỗi màn chỉ một ý, có hình mô phỏng ngay trong từng bước!</p><div class="go"><a class="btn primary" href="#/step/${last.id}">${count ? '▶ Học tiếp' : '▶ Bắt đầu thôi'}</a><span class="status-note">${count ? 'Đang dở: ' + e(last.title) : '62 màn · khoảng 90 phút'}</span></div></div><div class="ring-p" aria-label="Tiến độ ${count}/${L.length} màn"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#fff" stroke-width="9"/><circle cx="50" cy="50" r="44" fill="none" stroke="var(--c-d)" stroke-width="9"/><circle cx="50" cy="50" r="44" fill="none" stroke="var(--red)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct / 100)}"/></svg><b>${count}/${L.length}<small>màn xong</small></b></div></section>
<div class="parts">${PARTS.map(([k, name, ids]) => `<div class="part"><h2>${e(name)}</h2>${ids.map(id => { const m = M.find(x => x.id === id), ls = moduleLessons(m), done = ls.filter(l => state.done.includes(l.id)).length, nxt = ls.find(l => !state.done.includes(l.id)) || ls[0]; return `<a class="mod c-${m.color}" href="#/step/${nxt.id}"><div class="ic">${MODICON[id]}</div><h3>${e(m.short)}</h3><p>${ls.length} màn · ~${Math.ceil(ls.length * 1.5)} phút${done ? ' · xong ' + done : ''}</p><div class="pips" aria-hidden="true">${ls.map(l => `<i class="${state.done.includes(l.id) ? 'done' : ''}"></i>`).join('')}</div></a>`; }).join('')}</div>`).join('')}</div>
<div class="quick"><a class="btn pink" href="#/osce">🩺 Luyện OSCE</a><a class="btn mint" href="#/sources">📚 Nguồn & đối chiếu</a><a class="btn" href="#/tra">📌 Tra nhanh đi trực</a><a class="btn" href="#/review">↺ Ôn câu chưa vững</a></div>
<p class="status-note" style="text-align:center">Phím ← → để chuyển màn · / để tìm · tiến độ lưu ngay trên máy bạn.</p>`;
  setBar(`<span class="sign">${SIGN}</span><span class="mid"><span class="status-note">Chọn một thẻ để vào học nha 👆</span></span><span class="sign">☰ mục lục ở góc trên</span>`);
}
const labTo = { shock: 'van-chuyen-oxy', tone: 'so-nhau-cam-mau', previa: 'vi-tri-nhau', abruption: 'bong-nhau-som', shoulder: 'xu-tri-dau-tien', fibrin: 'txa' };

// ───────── màn học: mỗi bài = 2 TRANG nối nhau bằng "Tiếp" (Hiểu + Y4 sâu cùng trang với hình · Thử nhớ); không tab con, không gì bị giấu
const imgsOf = l => (window.REFERENCE_IMAGES || []).filter(im => im.lessonIds.includes(l.id));
// bài có "trang tí hon" (ZS.beats): mỗi trang 1 ý = 1 hình + 1 việc để làm + 1 câu; cuối là Thử nhớ
const BEATS = () => window.ZS?.beats || {};
const pagesOf = l => BEATS()[l.id] ? [...BEATS()[l.id].map((_, i) => 'b' + (i + 1)), 'nho'] : ['hieu', 'nho'];
const PAGE = { hieu: ['🔎', 'Hiểu + Y4 sâu'], nho: ['🧠', 'Thử nhớ'] };
const pageLab = (l, p) => p[0] === 'b' ? ['●', BEATS()[l.id][+p.slice(1) - 1].t] : PAGE[p];
// tìm khung bảng kết quả bên phải (thẻ cao ≥ 280, mép phải ở 550) → mốc cắt hình khi màn hẹp
const splitAt = svg => { if (innerWidth > 700) return 0; let best = 0; for (const m of svg.matchAll(/<rect x="(\d+(?:\.\d+)?)" y="(\d+)" width="(\d+(?:\.\d+)?)" height="(\d+(?:\.\d+)?)" rx="1[468]"/g)) { const x = +m[1], w = +m[3], h = +m[4]; if (x >= 280 && x <= 420 && Math.abs(x + w - 550) < 2 && h >= 280 && +m[2] <= 30) best = Math.max(best, x); } return best; };
const lessonHash = (l, p) => '#/step/' + l.id + (p && p !== pagesOf(l)[0] ? '/' + p : '');
const ctlHtml = (c, i, S) => c.t === 'range' ? `<div class="rg"><div class="rgh"><label for="r${i}">${c.label}</label>${c.chips ? `<div class="chips">${c.chips.map(([v, t]) => `<button class="chip" data-chip="${c.k}:${v}">${t}</button>`).join('')}</div>` : ''}<output id="o${i}">${S[c.k]}${c.unit || ''}</output></div><input id="r${i}" type="range" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${S[c.k]}" data-r="${c.k}" data-u="${e(c.unit || '')}" data-o="o${i}"></div>`
  : c.t === 'tog' ? `<button class="tg" data-tog="${c.k}" aria-pressed="${!!S[c.k]}"><i>${S[c.k] ? '✓' : ''}</i>${c.label}</button>`
  : c.t === 'seg' ? `<div class="segw" role="group">${c.opts.map(([v, t]) => `<button class="sg" data-seg="${c.k}" data-v="${e(v)}" aria-pressed="${String(S[c.k]) === String(v)}">${t}</button>`).join('')}</div>`
  : `<button class="sg" data-btn="${c.k}" data-v="${e(c.v)}" aria-pressed="${String(S[c.k]) === String(c.v)}">${c.label}</button>`;
// sự kiện chung cho hình + thanh điều khiển (dùng cho cả trang Hiểu và trang tí hon)
const wireSim = (S, set, done) => {
  $('#art').addEventListener('click', ev => { const d = ev.target.closest('[data-set]'); if (!d) return; const raw = d.dataset.set; let k, v; if (raw[0] === '!') { k = raw.slice(1); v = !S[k]; } else { [k, v] = raw.split('='); v = v === 'true' ? true : v === 'false' ? false : isNaN(+v) ? v : +v; } set(k, v); done(k, ev); });
  $('#sim').addEventListener('input', ev => { const r = ev.target.closest('[data-r]'); if (!r) return; set(r.dataset.r, +r.value); $('#' + r.dataset.o).textContent = r.value + r.dataset.u; done(r.dataset.r, ev, true); });
  $('#sim').addEventListener('click', ev => {
    const chip = ev.target.closest('[data-chip]'), tg = ev.target.closest('[data-tog]'), sg = ev.target.closest('[data-seg]'), bt = ev.target.closest('[data-btn]');
    if (chip) { const [k, v] = chip.dataset.chip.split(':'); set(k, +v); done(k, ev); }
    else if (tg) { set(tg.dataset.tog, !S[tg.dataset.tog]); done(tg.dataset.tog, ev); }
    else if (sg) { set(sg.dataset.seg, sg.dataset.v); done(sg.dataset.seg, ev); }
    else if (bt) { set(bt.dataset.btn, bt.dataset.v); done(bt.dataset.btn, ev); }
  });
};
function renderLesson(id, sub) {
  const idx = L.findIndex(x => x.id === id); if (idx < 0) { renderNotFound(); return; }
  stopRun();
  const l = L[idx], m = moduleOf(l), ls = moduleLessons(m), pos = ls.indexOf(l) + 1, prevL = L[idx - 1], nextL = L[idx + 1];
  const pages = pagesOf(l); if (!pages.includes(sub)) sub = pages[0];
  const isBeat = sub[0] === 'b'; let beatOk = false;
  const pi = pages.indexOf(sub), lastPg = pi === pages.length - 1, endMod = !nextL || nextL.module !== l.module;
  state.last = l.id; save();
  let touched = state.done.includes(id), hideHow = false, wrong = 0;
  try { hideHow = localStorage.getItem('zk-howto') === '0'; } catch (err) { /* không nhớ được cũng không sao */ }
  const prevHash = pi > 0 ? lessonHash(l, pages[pi - 1]) : prevL ? lessonHash(prevL, pagesOf(prevL).slice(-1)[0]) : '';
  const nextHash = !lastPg ? lessonHash(l, pages[pi + 1]) : endMod ? '#/chot/' + l.module : lessonHash(nextL);
  const markDone = el => {
    $('.coach')?.remove(); if (touched) return; touched = true;
    if (!state.done.includes(id)) { state.done.push(id); save(); }
    sound('chime'); toast(rand(PRAISE) + ' +1 ⭐'); burst(el || document.body); bar();
  };
  const bar = () => {
    const gated = gatedNow();
    setBar(`<button class="btn flat" id="prev" data-go ${prevHash ? '' : 'disabled'}>◀ Trước</button><div class="mid"><div class="dots">${pages.map((p, i) => `<i class="${i === pi ? 'cur' : i < pi ? 'done' : ''}" title="${e(pageLab(l, p)[1])}"></i>`).join('')}</div><span class="sign">${SIGN}</span></div><button class="copy" id="copy" title="Sao chép link màn này" aria-label="Sao chép link màn này">📋</button><button class="btn ${gated ? '' : 'primary'}" id="next" data-go>${lastPg ? (endMod ? '🃏 Chốt chương ▶' : 'Bài tiếp ▶') : ((sub === 'hieu' || isBeat) && !gated ? '✓ Tiếp ▶' : 'Tiếp ▶')}</button>`);
    $('#prev').onclick = goPrev; $('#next').onclick = goNext; $('#copy').onclick = copyLink;
  };
  const gatedNow = () => (sub === 'hieu' && !(touched || state.done.includes(id))) || (isBeat && !beatOk && !state.done.includes(id));
  const goPrev = () => { if (prevHash) go(prevHash); };
  const goNext = () => {
    if (gatedNow()) { const n = $('#next'); n.classList.remove('shake'); void n.offsetWidth; n.classList.add('shake'); sound('buzz'); toast(isBeat ? 'Làm thử trên hình đã nha 👆' : 'Làm xong phần tương tác của trang này đã nha 👆'); return; }
    sound('pop'); go(nextHash);
  };
  window.__next = goNext; window.__prev = goPrev;
  setView('lesson-mode', m.color, `${MODICON[m.id]} ${m.short} · ${pos}/${ls.length} · ${pageLab(l, sub)[1]}`, ((pos - 1) + (pi + 1) / pages.length) / ls.length * 100); renderRail();
  const head = isBeat || (sub === 'nho' && BEATS()[id]) ? `<div class="head bhead"><div class="ttl"><small>${e(l.title)} · ${pi + 1}/${pages.length}</small><h1><mark>${e(isBeat ? pageLab(l, sub)[1] : 'Thử nhớ')}</mark></h1></div><div class="bprog" aria-hidden="true">${pages.map((p, i) => `<i class="${i === pi ? 'cur' : i < pi ? 'done' : ''}"></i>`).join('')}</div><button class="pin" id="bookmark" title="Ghim để ôn lại" aria-label="Ghim màn để ôn lại">${state.bookmarks.includes(id) ? '📌' : '📍'}</button></div>`
    : `<div class="head"><h1 class="ttl"><mark>${e(l.title)}</mark></h1><ol class="stp" aria-label="Các trang của bài này">${pages.map((p, i) => `<li class="${i === pi ? 'cur' : i < pi ? 'done' : ''}">${PAGE[p][0]} ${PAGE[p][1]}</li>`).join('')}</ol>${sub === 'hieu' ? `<button class="howto-open" id="how-open" ${hideHow ? '' : 'hidden'}>📝 Cách học</button>` : ''}<button class="pin" id="bookmark" title="Ghim để ôn lại" aria-label="Ghim màn để ôn lại">${state.bookmarks.includes(id) ? '📌' : '📍'}</button></div>`;
  const wireCommon = () => {
    $('#bookmark').onclick = () => { if (state.bookmarks.includes(id)) state.bookmarks = state.bookmarks.filter(x => x !== id); else state.bookmarks.push(id); save(); $('#bookmark').textContent = state.bookmarks.includes(id) ? '📌' : '📍'; sound('pop'); toast(state.bookmarks.includes(id) ? 'Đã ghim màn này để ôn 📌' : 'Đã bỏ ghim'); };
  };

  // ── trang Y4 sâu / Hình thầy / Thử nhớ: trang đầy đủ, mọi thứ hiện sẵn
  // ── trang tí hon: hình to + 1 việc để làm + 1 câu (không ô số, không khối chữ)
  if (isBeat) {
    const bt = BEATS()[id][pi], kit = ZS.kits[bt.kit], S = Object.assign({}, kit.init(bt));
    const ok = () => (bt.goal || kit.goal)?.(S, bt);
    const paint = bump => {
      const body = kit.draw(S, bt, l), sp = splitAt(body);
      // điện thoại: tách hình chính và bảng kết quả bên phải thành 2 khối xếp dọc để chữ trong hình đủ to
      $('#art').innerHTML = sp ? `<svg class="sp1" viewBox="14 14 ${sp - 18} 326" role="img" aria-label="${e(bt.t)}">${ZS.defs}${body}</svg><svg class="sp2" viewBox="${sp - 2} 14 ${556 - sp} 326" aria-hidden="true">${ZS.defs}${body}</svg>`
        : `<svg viewBox="0 0 560 350" role="img" aria-label="${e(bt.t)}">${ZS.defs}${body}</svg>`;
      const [mood, text] = kit.say(S, bt, l); $('#mas').innerHTML = mascot(mood); const b = $('#bub'); b.innerHTML = md(text);
      if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    };
    const sim = () => { const cs = kit.ui(S, bt); $('#sim').hidden = !cs.length; $('#sim').innerHTML = cs.map((c, i) => ctlHtml(c, i, S)).join(''); requestAnimationFrame(() => $('.fig')?.style.setProperty('--simh', (cs.length ? $('#sim').offsetHeight : 0) + 'px')); };
    $('#stage').innerHTML = `<article class="lesson tihon">${head}<div class="bscene"><figure class="fig"><div class="sim" id="sim"></div><div class="artw"><div id="art"></div></div><button class="zoom" id="zoom-fig" aria-label="Phóng to hình">⤢</button><span class="coach">👆</span></figure><div class="bside"><div class="say"><div id="mas"></div><div class="bub" id="bub" aria-live="polite"></div></div>${bt.cr ? `<p class="credit">🖼 ${bt.cr}</p>` : ''}</div></div></article>`;
    sim(); paint(); bar(); wireCommon();
    wireSim(S, (k, v) => { const p = Object.assign({}, S); delete p._p; S._p = p; S._k = k; S[k] = v; kit.after?.(S, k, bt); }, (k, ev, slide) => {
      $('.fig>.coach')?.remove(); if (!slide) sim(); const was = beatOk; if (!(bt.goal || kit.goal)) beatOk = true; else if (ok()) beatOk = true;
      const [mood] = kit.say(S, bt, l); paint(true);
      if (beatOk && !was) { sound('chime'); burst(ev.target.closest('svg,button') || $('#art')); bar(); } else if (!slide) sound(mood === 'ouch' || mood === 'sad' ? 'buzz' : 'pop');
    });
    $('#zoom-fig').onclick = () => openZoom($('#art').innerHTML, bt.t);
    return;
  }
  if (sub !== 'hieu') {
    const q = l.quiz;
    const body = (() => { const a = state.answers[id], done = a?.correct;
        return `<div class="pg nho"><div class="qtop"><div id="qmas">${mascot(done ? 'wow' : 'happy', 'mas')}</div><h2>${e(q.q)}</h2></div><div class="opts">${q.options.map((o, i) => `<button class="opt ${done && i === q.answer ? 'ok' : ''}" data-ans="${i}" ${done ? 'disabled' : ''}><b>${'ABC'[i]}</b><span>${e(o)}</span></button>`).join('')}</div><div id="fb">${done ? `<div class="fb ok"><strong>🎉 Đúng rồi!</strong>${e(q.explain)}</div>` : ''}</div>${BEATS()[id] ? refs(l.refs) : ''}</div>`; })();
    $('#stage').innerHTML = `<article class="lesson sub">${head}${body}</article>`;
    bar(); wireCommon();
    const answerQ = (i, btn) => {
      const prev = state.answers[id], ok = i === q.answer;
      state.answers[id] = { choice: i, correct: ok, attempts: (prev?.attempts || 0) + 1 }; save();
      const fb = $('#fb');
      if (ok) { $$('.opt').forEach(o => { o.disabled = true; if (+o.dataset.ans === q.answer) o.classList.add('ok'); }); fb.innerHTML = `<div class="fb ok"><strong>🎉 Đúng rồi!</strong>${e(q.explain)}</div>`; $('#qmas').innerHTML = mascot('wow', 'mas'); sound('tada'); burst(btn); markDone(btn); }
      else { wrong++; btn.classList.add('no', 'shake'); btn.disabled = true; sound('buzz'); $('#qmas').innerHTML = mascot('worry', 'mas');
        if (wrong >= 2) { $$('.opt').forEach(o => { o.disabled = true; if (+o.dataset.ans === q.answer) o.classList.add('ok'); }); fb.innerHTML = `<div class="fb no"><strong>💡 Đáp án đúng là ${'ABC'[q.answer]}</strong>${e(q.explain)}</div>`; }
        else fb.innerHTML = '<div class="fb no"><strong>Chưa đúng, thử lại nha! 💪</strong>Bấm ◀ Trước để đọc lại rồi chọn tiếp.</div>'; }
    };
    $('#stage').onclick = ev => { const a = ev.target.closest('[data-ans]'); if (a) answerQ(+a.dataset.ans, a); };
    return;
  }

  // ── trang Hiểu: hình mô phỏng NẰM NGAY trong bước + 3 ô số
  const sp = ZS.spec[l.id], kit = ZS.kits[sp.kit], S = Object.assign({}, kit.init(sp), { _a: -1 });
  const ZC = ['#ff9fc2', '#f0c24a', '#6fcfa6'];
  const zones = () => { const z = kit.zones(S, sp); return (sp.z || ['a', 'b', 'c']).map(n => z[n] || [280, 175, 60, 60]); };
  const cut = t => t.length > 30 ? t.slice(0, 29) + '…' : t;
  const hint = c => c.t === 'range' ? `Kéo <b>${cut(c.label)}</b>` : c.t === 'tog' ? `Bật/tắt <b>${cut(c.label)}</b>` : c.t === 'seg' ? 'Chọn <b>một nút</b> trên hình' : `Bấm <b>${cut(c.label)}</b>`;
  const howSteps = () => sp.how ? [...sp.how, 'Bấm <b>ô số 1·2·3</b> → nhãn chỉ đúng chỗ trên hình'] : ['Bấm <b>ô số</b> → hình sáng đúng chỗ', ...(kit.ui(S, sp).length ? [hint(kit.ui(S, sp)[0]) + ' → hình đổi'] : /data-set=/.test(kit.draw(S, sp, l)) ? ['Bấm <b>thẻ / vùng trong hình</b> → hình đổi'] : ['Bấm <b>▶ Tự chạy</b>']), 'Cuộn xuống đọc <b>📚 Y4 sâu</b> → <b>Tiếp</b> để thử nhớ ⭐'];
  const thin = svg => svg.replace(/<(rect|path|ellipse|circle|polygon)\b[^>]*>/g, t => { const f = t.match(/\bfill="([^"]*)"/); if (!f || f[1] === 'none') return t; return t.replace(/stroke-width="([\d.]+)"/, (m, n) => 'stroke-width="' + Math.max(.9, +n * .5).toFixed(2) + '"'); });
  const kw = i => { const t = String((sp.n || l.chain)[i] || ''), m = t.match(/\*\*(.+?)\*\*/); return (m ? m[1] : t.split(/[:;—→(]/)[0]).replace(/[:.,;]\s*$/, '').trim(); };
  const art = () => {
    const zs = zones(), body = kit.draw(S, sp, l);
    const pos = zs.map(([cx, cy, rx, ry], i) => sp.bz?.[i] ? [...sp.bz[i]] : [clamp(cx - rx + 8, 18, 542), clamp(cy - ry + 8, 18, 332)]);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (!sp.bz?.[j] && Math.hypot(pos[i][0] - pos[j][0], pos[i][1] - pos[j][1]) < 30) pos[j][1] = clamp(pos[j][1] + 30, 18, 332);
    const ov = zs.map((z, i) => { const [bx, by] = pos[i]; return `<g class="zb" data-z="${i}" style="--zc:${ZC[i]}"><rect x="${bx - 8}" y="${by - 8}" width="16" height="16" rx="5"/><text x="${bx}" y="${by + 4}" text-anchor="middle">${i + 1}</text></g>`; }).join('');
    let hl = '', co = '';
    if (S._a >= 0) {
      const i = S._a, [cx, cy, rx, ry] = zs[i]; let txt = kw(i); if (txt.length > 36) txt = txt.slice(0, 35) + '…';
      const shown = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase().includes(txt.toLowerCase()); // chữ đã có sẵn trên hình thì chỉ khoanh vùng
      const w = Math.round(txt.length * 6.2 + 36), h = 24, up = cy > 175 ? cy - ry - h - 14 >= 4 : cy + ry + h + 14 > 346, py = up ? cy - ry - h - 12 : Math.min(346 - h, cy + ry + 12), px = clamp(cx - w / 2, 4, 556 - w);
      hl = `<ellipse class="ring" cx="${cx}" cy="${cy}" rx="${rx + 4}" ry="${ry + 4}" pointer-events="none"/>`;
      if (!shown) co = `<g class="callout" pointer-events="none"><path d="M${cx} ${up ? cy - ry : cy + ry} L${clamp(cx, px + 14, px + w - 14)} ${up ? py + h : py}" stroke="${ZC[i]}" stroke-width="1.5" fill="none"/><rect x="${px}" y="${py}" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${ZC[i]}" stroke-width="1.5"/><rect x="${px + 4}" y="${py + 4}" width="16" height="16" rx="5" fill="${ZC[i]}"/><text x="${px + 12}" y="${py + 16}" text-anchor="middle" class="cn">${i + 1}</text><text x="${px + 26}" y="${py + 16.5}" class="ct">${e(txt)}</text></g>`;
    }
    return `<svg viewBox="0 0 560 350" role="img" aria-label="${e(l.title)}">${ZS.defs}${thin(body)}${hl}${ov}${co}</svg>`;
  };
  const sayNow = () => S._a >= 0 ? ['happy', 'Vùng ' + (S._a + 1) + ': ' + (sp.n || l.chain)[S._a].replace(/\*\*/g, '')] : kit.say(S, sp, l);
  const paint = (bump) => {
    $('#art').innerHTML = art(); const [mood, text] = sayNow(); $('#mas').innerHTML = mascot(mood); const b = $('#bub'); b.textContent = text;
    if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    $$('.nchip').forEach(c => c.classList.toggle('on', +c.dataset.z === S._a));
  };
  const sim = () => { const cs = kit.ui(S, sp); $('#sim').hidden = !cs.length; $('#sim').innerHTML = cs.map((c, i) => ctlHtml(c, i, S)).join('') + (touched || !cs.length ? '' : '<span class="coach">👆</span>'); if (!cs.length && !touched && !$('.fig .coach')) $('.fig').insertAdjacentHTML('beforeend', '<span class="coach">👆</span>'); requestAnimationFrame(() => $('.fig')?.style.setProperty('--simh', (cs.length ? $('#sim').offsetHeight : 0) + 'px')); };
  const touch = () => markDone($('#art'));
  const interact = () => { touch(); const [mood] = sayNow(); sound(mood === 'ouch' || mood === 'sad' ? 'buzz' : 'pop'); paint(true); };
  const pane = () => { $('#pane').innerHTML = (sp.n || l.chain).map((c, i) => `<button class="nchip k${i}" data-z="${i}"><i>${i + 1}</i><span>${md(c)}</span></button>`).join('') + '<button class="btn mint small run" id="run">▶ Tự chạy từng ý</button>'; paint(); };
  const y4Html = () => `<section class="y4s" id="y4s"><h2>📚 Y4 sâu</h2><div class="note"><span>🎯</span><span>${e(l.core)}</span></div><div class="note warn"><span>⚠️</span><span>${e(l.pitfall)}</span></div><div class="deep-body">${deepCards(l.deep, true)}</div>${imgsOf(l).length ? `<h2>📷 Hình của thầy</h2>${imgsOf(l).map(im => `<figure class="refimg"><img src="${e(im.src)}" alt="${e(im.title)}"><button class="zoom" data-zimg="${e(im.src)}" aria-label="Phóng to hình">⤢</button><figcaption><b>${e(im.title)}</b> · ${e(im.caption)}<br>📷 ${e(im.source)}</figcaption></figure>`).join('')}` : ''}${refs(l.refs)}</section>`;
  $('#stage').innerHTML = `<article class="lesson">${head}
<div class="howto" id="howto" ${hideHow ? 'hidden' : ''}><b id="how-t">📝 Cách học</b><ol>${howSteps().map(s => `<li><span>${s}</span></li>`).join('')}</ol><button class="x" id="how-x" aria-label="Ẩn cách học">✕</button></div>
<div class="scene"><div class="viz"><figure class="fig"><div class="sim" id="sim"></div><div class="artw"><div id="art"></div></div><button class="zoom" id="zoom-fig" aria-label="Phóng to hình">⤢</button></figure><div class="say"><div id="mas"></div><div class="bub" id="bub" aria-live="polite"></div></div></div>
<aside class="ctl"><div class="pane" id="pane"></div>${y4Html()}</aside></div></article>`;
  sim(); pane(); bar(); wireCommon();
  // ── sự kiện (ủy quyền): hình, thanh mô phỏng, ô số
  const setCtl = (k, v) => { S[k] = v; kit.after?.(S, k, sp); };
  $('#art').onclick = ev => {
    const z = ev.target.closest('[data-z]'), d = ev.target.closest('[data-set]');
    if (z) { stopRun(); S._a = S._a === +z.dataset.z ? -1 : +z.dataset.z; touch(); sound('pop'); paint(true); }
    else if (d) { const raw = d.dataset.set; let k, v; if (raw[0] === '!') { k = raw.slice(1); v = !S[k]; } else { [k, v] = raw.split('='); v = v === 'true' ? true : v === 'false' ? false : isNaN(+v) ? v : +v; } setCtl(k, v); sim(); interact(k); }
  };
  $('#sim').addEventListener('input', ev => { const r = ev.target.closest('[data-r]'); if (!r) return; setCtl(r.dataset.r, +r.value); $('#' + r.dataset.o).textContent = r.value + r.dataset.u; interact(r.dataset.r); });
  $('#sim').addEventListener('click', ev => {
    const chip = ev.target.closest('[data-chip]'), tg = ev.target.closest('[data-tog]'), sg = ev.target.closest('[data-seg]'), bt = ev.target.closest('[data-btn]');
    if (chip) { const [k, v] = chip.dataset.chip.split(':'); setCtl(k, +v); sim(); interact(k); }
    else if (tg) { setCtl(tg.dataset.tog, !S[tg.dataset.tog]); sim(); interact(tg.dataset.tog); }
    else if (sg) { const v = sg.dataset.v; setCtl(sg.dataset.seg, v); sim(); interact(sg.dataset.seg); }
    else if (bt) { setCtl(bt.dataset.btn, bt.dataset.v); sim(); interact(bt.dataset.btn); }
  });
  $('.ctl').addEventListener('click', ev => {
    const z = ev.target.closest('.nchip'), run = ev.target.closest('#run'), zi = ev.target.closest('[data-zimg]');
    if (zi) openZoom(`<img src="${e(zi.dataset.zimg)}" alt="">`, 'Hình của thầy');
    else if (z) { stopRun(); S._a = S._a === +z.dataset.z ? -1 : +z.dataset.z; touch(); sound('pop'); paint(true); }
    else if (run) { toggleRun(); }
  });
  $('#how-t').onclick = () => $('#howto').classList.toggle('open');
  $('#how-x').onclick = () => { $('#howto').hidden = true; $('#how-open').hidden = false; try { localStorage.setItem('zk-howto', '0'); } catch (err) { /* bỏ qua */ } };
  $('#how-open').onclick = () => { $('#howto').hidden = false; $('#how-open').hidden = true; try { localStorage.setItem('zk-howto', '1'); } catch (err) { /* bỏ qua */ } };
  $('#zoom-fig').onclick = () => openZoom($('#art').innerHTML, l.title);
  const toggleRun = () => { if (runT) { stopRun(); S._a = -1; paint(); return; } let k = 0; sound('pop'); const step = () => { if (k > 2) { stopRun(); S._a = -1; touch(); paint(true); burst($('#art')); sound('tada'); return; } S._a = k++; paint(true); sound('pop'); const b = $('#run'); if (b) b.textContent = '⏸ Dừng'; }; step(); runT = setInterval(step, 2400); };
  runStop = () => { const b = $('#run'); if (b) b.textContent = '▶ Tự chạy từng ý'; };
}
let runT = null, runStop = () => {};
function stopRun() { if (runT) { clearInterval(runT); runT = null; } runStop(); }
function openZoom(html, title) { $('#zoom-title').textContent = title; $('#zoom-body').innerHTML = html; $('#zoom').showModal(); }
async function copyLink() {
  const url = location.href.split('#')[0] + (location.hash.startsWith('#/') ? location.hash : '#/map');
  try { if (!navigator.clipboard) throw Error('clipboard'); await navigator.clipboard.writeText(url); sound('pop'); toast('Đã sao chép link màn này 📋'); }
  catch (err) { const ta = document.createElement('textarea'); ta.value = url; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); toast(ok ? 'Đã sao chép link màn này 📋' : 'Trình duyệt chặn copy — bạn copy URL trên thanh địa chỉ nha.'); }
}

// ───────── OSCE: mỗi ca là một trạm hướng dẫn từng bước
const ST = {
  'de-y18-1-ntd': { kind: 'cc', topic: 'ntd', icon: '🥧', facts: [['Chẩn đoán đã biết', 'nhau tiền đạo TRUNG TÂM, không thấy nhau cài răng lược'], ['Cho sẵn', '1 siêu âm nhau + 1 sổ khám thai'], ['Tình huống', 'mô hình toàn máu, vào xử trí cấp cứu liền'], ['Giấy cuối', 'nói “khám mỏ vịt” mới nhận được'], ['Việc cần làm', 'xử trí cấp cứu → tư vấn → xử trí, quản lý']] },
  'de-y17-3-nbn': { kind: 'cc', topic: 'nbn', icon: '🌩️', facts: [['Tuổi thai', '30 tuần, sổ khám thai không bất thường'], ['Triệu chứng', 'đột ngột đau bụng dữ dội, vùng bụng dưới'], ['Tử cung', 'co căng cứng liên tục; bụng không đề kháng'], ['Tim thai', 'không đều'], ['Sinh hiệu mẹ', 'ổn'], ['Khám trong', 'CTC mở 2 cm xóa 50%, ối vỡ khi khám, dịch hồng, không sa dây rốn']] },
  'de-y17-5-nbn-song-thai': { kind: 'cc', topic: 'nbn', icon: '🌩️', facts: [['Báo động', '“Rớt tim thai rồi bác sĩ ơi”'], ['Trong diễn biến nguồn', 'bệnh nhân sốc, song thai (chi tiết lộ trong lời giải)'], ['Câu hỏi', '“What behind” trên EFM: cái gì gây ra và xử trí gì?']] },
  'de-y19-3-nbn': { kind: 'cc', topic: 'nbn', icon: '🌩️', facts: [['Tình huống', 'ba tháng cuối, đau bụng; tờ khám thai tam cá nguyệt III bình thường, không nhau tiền đạo'], ['Sinh hiệu mẹ', 'còn ổn'], ['Tim thai', '60 lần/phút'], ['Âm đạo', 'ra ít huyết'], ['Bụng', 'gò cứng liên tục'], ['CTG', 'không có kết quả']] },
  'de-nho-ntd-36w-lan4': { kind: 'cc', topic: 'ntd', icon: '🥧', facts: [['Chẩn đoán đã biết', 'nhau tiền đạo trung tâm đang ra huyết'], ['Tuổi thai', '36 tuần'], ['Tiền sử', 'nhập viện 3 lần vì ra huyết, lần này là lần thứ 4'], ['Yêu cầu', 'nhận định tình trạng và đưa ra hướng xử trí']] },
  'de-nho-ntd-26w': { kind: 'tv', topic: 'ntd', icon: '💬', facts: [['Trạm 1', '26 tuần ra huyết: hỏi bệnh sử, tiền căn, tư vấn, khám (nghe tim thai trên mô hình)'], ['Tiền căn', '1 lần sinh có tiền sản giật, 1 lần vỡ ối/VMC (ghi theo nguồn)'], ['Trạm 2', 'trả kết quả: siêu âm nhau bám đến lỗ trong cổ tử cung, còn lại bình thường']] },
  'de-y19-2-ntd': { kind: 'tv', topic: 'ntd', icon: '💬', facts: [['Tình huống', 'sản phụ đến vì kết quả siêu âm nhau tiền đạo'], ['Tuổi thai', '> 28 tuần (nguồn không ghi chính xác hơn)'], ['Yêu cầu', 'tư vấn']] },
  'de-y21-2-tolac': { kind: 'tv', topic: 'tolac', icon: '💬', facts: [['Tiền sử', '2 năm trước mổ ngang đoạn dưới vì ngôi mông'], ['Hiện tại', 'thai 39 tuần, hỏi “sinh thường được không?”'], ['Giấy tờ', '2 sổ khám thai + 1 giấy xuất viện lần trước (phải HỎI mới được đưa)'], ['Yêu cầu', 'khai thác bệnh sử + tư vấn']] },
  'de-y22-1-tolac': { kind: 'tv', topic: 'tolac', icon: '💬', facts: [['Người bệnh', '22 tuổi, nhân viên văn phòng, PARA 1001'], ['Lần mổ trước', '2023, vì thai yếu, con 3300 g, đủ tháng, hậu phẫu 5 ngày, không biến chứng'], ['Hiện tại', 'thai 40 tuần, chưa chuyển dạ (dòng “40 ngày” trong nguồn là lỗi chép)'], ['Khám hôm nay', 'con ~3000 g, ngôi chỏm, lọt −2, ối còn, CTC mở 2 cm xóa 70%'], ['Vết mổ da', 'ngang trên vệ 10 cm, không đau'], ['Giấy tờ', 'sổ khám thai + giấy ra viện (giấu dưới gối, phải xin)']] }
};
// pillar = nhóm tiêu chí trong rubric chung của bộ môn
const PIL = { cc: 'Thái độ cấp cứu', ass: 'Nhận định / diễn giải', dx: 'Chẩn đoán', risk: 'Nguy cơ mẹ – con', plan: 'Xử trí', com: 'Giao tiếp / tư vấn', his: 'Khai thác & tiền sử' };
const STEPS = {
  cc: {
    read: { icon: '📖', t: 'Đọc đề', secs: '≈30 giây', goal: 'Gạch ngay: tuổi thai · triệu chứng · sinh hiệu · tim thai · yêu cầu của trạm.', say: 'Tự nhắc: “Đây là trạm cấp cứu. Việc đầu tiên là đánh giá mẹ có bất ổn không.”', items: ['Tuổi thai là bao nhiêu?', 'Triệu chứng chính (đau, ra huyết, tử cung)?', 'Sinh hiệu mẹ, tim thai: ổn hay bất thường?', 'Đề yêu cầu làm gì (nhận định? xử trí? tư vấn?)'], dont: ['Đọc lan man mà chưa biết mẹ có bất ổn không'], pil: 'ass', lesson: 'triage-aph' },
    enter: { icon: '🚨', t: 'Vào trạm: khẩn trương', secs: '10–20 giây đầu', goal: 'Nói to và làm ngay: gọi hỗ trợ, đo sinh hiệu, đường truyền, lấy máu.', say: '“Em báo cấp cứu, nhờ gọi thêm người, đo sinh hiệu, lập hai đường truyền lớn và lấy máu xét nghiệm, chuẩn bị máu.”', items: ['Gọi hỗ trợ / ê-kíp (thể hiện khẩn trương)', 'Đo sinh hiệu, hỏi tri giác', 'Lập 2 đường truyền lớn, lấy máu, báo ngân hàng máu', 'Mắc monitor tim thai + cơn co (nếu còn thai)'], dont: ['Đứng đọc bệnh án lâu khi mẹ/thai đang bị đe dọa', 'Chờ đủ xét nghiệm rồi mới hành động'], pil: 'cc', lesson: 'hoi-suc-song-song' },
    assess: { nbn: { icon: '🔎', t: 'Nhận định mẹ – tử cung – thai', secs: '≈60 giây', goal: 'Đọc dấu hiệu: tử cung gồng cứng, tim thai, mức mất máu (kín hay ngoài).', say: '“Mẹ đau bụng liên tục, tử cung co cứng, tim thai bất thường, ra máu ít — gợi ý nhau bong non.”', items: ['Mẹ: mạch, HA, da, tri giác (máu ngoài ít ≠ nhẹ)', 'Tử cung: đau liên tục, co cứng, tăng trương lực nền', 'Tim thai/CTG: nhịp giảm muộn lặp lại, nhịp chậm; cơn co dồn (gò cường tính)', 'Ối (đỏ/hồng?), tuổi thai, THA/chấn thương/tiền căn NBN'], dont: ['Loại trừ NBN chỉ vì ra ít máu hoặc siêu âm “không thấy gì”'], pil: 'ass', lesson: 'tang-truong-luc' },
      ntd: { icon: '🔎', t: 'Nhận định & khám an toàn', secs: '≈60 giây', goal: 'Xác nhận tuổi thai, ra huyết, cơn co, tiền căn; khám đúng cách.', say: '“Em xác nhận tuổi thai, hỏi ra huyết, cơn co, tiền căn; không thăm âm đạo bằng ngón tay — em khám mỏ vịt khi phù hợp để tìm nguồn chảy.”', items: ['Xác nhận tuổi thai', 'Ra huyết đỏ tươi (thường không đau); có cơn co / chuyển dạ không?', 'Tiền căn: mổ cũ, nhau thấp, các lần nhập viện ra huyết trước', 'Vị trí nhau đã biết (siêu âm, sổ khám thai); đánh giá thai', 'KHÔNG thăm ngón tay; khám mỏ vịt khi phù hợp; TVS'], dont: ['Thăm âm đạo bằng ngón tay để “xác nhận nhau tiền đạo”'], pil: 'ass', lesson: 'chan-doan-ntd' } },
    dx: { nbn: { icon: '🧠', t: 'Chẩn đoán + lý do', secs: '≈30 giây', goal: 'Nêu chẩn đoán KÈM lý do lấy từ dữ kiện đề, và chẩn đoán phân biệt.', say: '“Em nghĩ nhiều đến nhau bong non, vì đau liên tục, tử cung co cứng, tim thai bất thường; phân biệt với nhau tiền đạo, vỡ tử cung, chuyển dạ.”', items: ['Chẩn đoán làm việc: nhau bong non (thể nặng nếu thai bị đe dọa)', 'Nêu LÝ DO bằng dữ kiện của đề', 'Chẩn đoán phân biệt: NTĐ, vỡ tử cung, chuyển dạ, nguồn khác', 'Siêu âm chỉ hỗ trợ; âm tính không loại trừ'], dont: ['Chỉ nói “chắc là nhau bong non” không có lý do'], pil: 'dx', lesson: 'chan-doan-nbn' },
      ntd: { icon: '🧠', t: 'Chẩn đoán + mức nặng', secs: '≈30 giây', goal: 'Nhau tiền đạo đang ra huyết: đã sốc chưa? có chuyển dạ không? có nguy cơ PAS không?', say: '“Nhau tiền đạo trung tâm đang ra huyết; hiện mẹ chưa/đã sốc; có/không cơn co; cần loại trừ PAS nếu có sẹo.”', items: ['Chẩn đoán: nhau tiền đạo (theo siêu âm) đang ra huyết', 'Mức nặng: sinh hiệu, lượng máu, đã sốc chưa', 'Có cơn co/chuyển dạ không (có thể là “thủ phạm”)', 'Nếu có sẹo mổ: nghĩ đến PAS'], dont: ['Chỉ dựa màu máu hoặc “không đau” để chẩn đoán'], pil: 'dx', lesson: 'vi-tri-nhau' } },
    risk: { nbn: { icon: '⚠️', t: 'Nguy cơ cho con và mẹ', secs: '≈30 giây', goal: 'Nói rõ nguy cơ của CON và của MẸ (rubric chấm riêng từng phần).', say: '“Con thiếu oxy, nguy cơ tử vong ngay cả khi mổ khẩn; mẹ nguy cơ băng huyết, rối loạn đông máu và biến chứng nặng.”', items: ['Con: thiếu oxy, nguy cơ tử vong dù mổ khẩn', 'Mẹ: băng huyết sau sinh', 'Mẹ: rối loạn đông máu / DIC, suy cơ quan, có thể tử vong'], dont: ['Chỉ dọa mà không có kế hoạch'], pil: 'risk', lesson: 'dic-couvelaire' },
      ntd: { icon: '⚠️', t: 'Nguy cơ cho mẹ và con', secs: '≈30 giây', goal: 'Nguy cơ mất máu/băng huyết của mẹ; thai thiếu oxy nếu mẹ sốc; non tháng.', say: '“Mẹ có nguy cơ mất máu, sốc, băng huyết sau sinh; con có thể thiếu oxy nếu mẹ sốc hoặc phải sinh non.”', items: ['Mẹ: mất máu, sốc, BHSS (đoạn dưới co rút kém)', 'Con: thiếu oxy nếu mẹ sốc/suy hô hấp; xác nhận tuổi thai', 'Chảy tiếp: nguy cơ tăng dần'], dont: ['Trấn an tuyệt đối về thai'], pil: 'risk', lesson: 'co-che-ntd' } },
    plan: { nbn: { icon: '🏥', t: 'Xử trí song song', secs: '≈60 giây', goal: 'Hồi sức và sinh/mổ cùng lúc; chọn đường sinh theo thai và mẹ.', say: '“Em hồi sức mẹ, chuẩn bị máu và sửa đông máu; thai sống bị đe dọa, không sinh âm đạo nhanh được nên em đề nghị mổ lấy thai khẩn, báo gây mê, sơ sinh.”', items: ['Hồi sức mẹ + chuẩn bị máu, sửa đông máu', 'Thai sống bị đe dọa, không sinh âm đạo nhanh → mổ lấy thai khẩn', 'Báo gây mê hồi sức, sơ sinh, ngân hàng máu', 'Thai đã mất, mẹ ổn → thường ưu tiên sinh âm đạo; mẹ sốc không kiểm soát → khẩn theo an toàn mẹ', 'Không cho giảm co thường quy'], dont: ['Hứa chắc an toàn', 'Đợi hồi sức “xong hẳn” mới chuẩn bị mổ'], pil: 'plan', lesson: 'xu-tri-nbn' },
      ntd: { icon: '🏥', t: 'Xử trí & quản lý', secs: '≈60 giây', goal: 'Ổn định mẹ, quyết định mổ khi nào, chuẩn bị đủ.', say: '“Em ổn định mẹ, chuẩn bị máu và phòng mổ; nếu bất ổn hoặc chảy không kiểm soát em mổ khẩn, không chờ corticoid.”', items: ['Chưa sốc: ổn định nội khoa (đường truyền, máu) nhưng chuẩn bị mổ', 'Bất ổn / chảy không kiểm soát → hồi sức + mổ khẩn, không chờ corticoid', 'Đủ tháng, che lỗ trong, đã chảy nhiều lần → mổ lấy thai (UMP 37–38 tuần; RCOG ≤37+6)', 'Chuẩn bị máu, phòng mổ, hồi sức; báo nguy cơ PAS nếu có sẹo'], dont: ['Trì hoãn cứu mẹ/thai nguy kịch để chờ đủ tuần'], pil: 'plan', lesson: 'quan-ly-ntd' } },
    talk: { nbn: { icon: '🗣️', t: 'Nói với người nhà', secs: '≈30 giây', goal: 'Đời thường, đồng cảm, không hứa chắc, kiểm tra hiểu.', say: '“Các dấu hiệu gợi ý bánh nhau bong sớm, làm em bé thiếu oxy và mẹ có nguy cơ mất máu, rối loạn đông máu. Em đang gọi đội cấp cứu, chuẩn bị máu và đưa bé ra khẩn theo đánh giá của ê-kíp. Dù xử trí nhanh vẫn có nguy cơ nghiêm trọng; em sẽ cập nhật cho chị.”', items: ['Ngôn ngữ đời thường, không thuật ngữ', 'Đồng cảm, nêu lý do hành động nhanh', 'Không hứa chắc an toàn; nói sẽ cập nhật', 'Kiểm tra người nhà đã hiểu'], dont: ['Chỉ dọa mà không có kế hoạch', 'Hứa “chắc chắn ổn”'], pil: 'com', lesson: 'osce-nbn' },
      ntd: { icon: '🗣️', t: 'Nói với bệnh nhân', secs: '≈30 giây', goal: 'Giải thích vị trí nhau, kế hoạch, dấu báo động; teach-back.', say: '“Bánh nhau của chị bám thấp, gần hoặc che đường em bé ra, nên khi phần dưới tử cung thay đổi, chỗ bám có thể chảy máu. Mình cần theo dõi/mổ lấy thai và chuẩn bị máu.”', items: ['Giải thích vị trí nhau và lý do chảy máu bằng lời đời thường', 'Kế hoạch theo dõi/sinh/máu; nguy cơ thiếu máu, BHSS, truyền máu', 'Dấu báo động + teach-back', 'Không hứa chắc bảo tồn tử cung'], dont: ['Dùng thuật ngữ khó; hứa chắc'], pil: 'com', lesson: 'tu-van-ntd' } }
  },
  tv: {
    read: { icon: '📖', t: 'Đọc đề', secs: '≈30–60 giây', goal: 'Gạch: ai đến, vì sao đến, tuổi thai, giấy tờ có sẵn, yêu cầu.', say: 'Tự nhắc: “Trạm tư vấn: hỏi trước, hiểu rồi mới giải thích.”', items: ['Người bệnh là ai, đến vì lý do gì?', 'Tuổi thai, tiền sử đã biết', 'Giấy tờ/kết quả có sẵn (có thể phải HỎI mới được đưa)', 'Yêu cầu: khai thác / khám / tư vấn?'], dont: ['Bắt đầu giải thích khi chưa hỏi'], pil: 'his', lesson: 'tu-van-ntd' },
    open: { icon: '👋', t: 'Mở đầu', secs: '≈20 giây', goal: 'Chuyên nghiệp: chào, giới thiệu, hỏi tên, nói sẽ làm gì.', say: '“Chào chị, em là bác sĩ ___. Chị cho em biết tên và tuổi? Hôm nay chị đến vì vấn đề gì ạ?”', items: ['Chào, tự giới thiệu', 'Hỏi tên / tuổi để xác nhận', 'Hỏi lý do đến khám bằng chính lời người bệnh', 'Nói sẽ hỏi bệnh rồi giải thích'], dont: ['Vào thẳng câu hỏi mà không chào'], pil: 'com', lesson: 'tu-van-ntd' },
    history: { ntd: { icon: '🧾', t: 'Khai thác bệnh sử', secs: '≈90 giây', goal: 'PARA, tuổi thai, ra huyết, tiền căn mổ/nhau thấp; đủ để chọn hướng tư vấn.', say: '“Chị mang thai lần mấy, hiện bao nhiêu tuần? Ra máu từ lúc nào, nhiều hay ít, có đau không? Lần trước chị có mổ hay nhau thấp không?”', items: ['Tuổi thai, PARA', 'Ra huyết: khi nào, lượng, đau không, tái phát?', 'Cơn co, thai máy', 'Tiền căn: mổ/can thiệp tử cung, nhau thấp, tiền sản giật, vỡ ối', 'Có thể đến bệnh viện nhanh không? Ai đi cùng?'], dont: ['Hỏi dồn dập không lắng nghe'], pil: 'his', lesson: 'nguy-co-ntd' },
      tolac: { icon: '🧾', t: 'Khai thác bệnh sử', secs: '≈90 giây', goal: 'Lần mổ trước (vì sao, đường rạch, biến chứng), thai kỳ hiện tại; XIN giấy tờ.', say: '“Lần mổ trước chị mổ vì sao, năm nào? Có giấy xuất viện hoặc biên bản mổ cho em xem được không ạ?”', items: ['PARA, tuổi thai hiện tại', 'Lần mổ trước: năm, lý do, đường rạch tử cung (xin giấy ra viện/biên bản mổ), biến chứng', 'Từng sinh âm đạo / VBAC chưa?', 'Thai kỳ này: ngôi, cân nặng ước, nhau, bệnh nội khoa', 'Chỉ định mổ trước có tái diễn không?'], dont: ['Suy đường rạch tử cung từ sẹo da', 'Chờ người bệnh tự đưa giấy tờ'], pil: 'his', lesson: 'chon-nguoi' } },
    analyze: { ntd: { icon: '🔬', t: 'Phân tích kết quả / khám', secs: '≈45 giây', goal: 'Diễn giải kết quả siêu âm và khám; chọn khám an toàn.', say: '“Siêu âm cho thấy nhau bám đến lỗ trong cổ tử cung; em sẽ nghe tim thai, đánh giá chị, không thăm âm đạo bằng tay.”', items: ['Nêu lại kết quả: nhau bám đến/che lỗ trong', 'Khám/nghe tim thai (mô hình), đánh giá mẹ', 'Nếu có sẹo mổ cũ: nghĩ đến PAS', 'Chỉ định thêm xét nghiệm kèm MỤC ĐÍCH'], dont: ['Thăm âm đạo bằng ngón tay', 'Đọc danh sách xét nghiệm không nêu mục đích'], pil: 'ass', lesson: 'chan-doan-ntd' },
      tolac: { icon: '🔬', t: 'Phân tích để chọn hướng', secs: '≈45 giây', goal: 'Điểm thuận lợi và điểm chặn của sinh âm đạo sau mổ.', say: '“Sẹo ngang đoạn dưới và không có chống chỉ định sinh âm đạo là hoàn cảnh thuận lợi; em còn cần xem ngôi, nhau, cân nặng thai.”', items: ['Thuận lợi: sẹo ngang đoạn dưới, chỉ định mổ trước không tái diễn, không chống chỉ định sinh âm đạo', 'Điểm chặn: sẹo dọc/cổ điển, tiền căn vỡ tử cung, nhau che lỗ trong', 'Hai lần mổ cũ, thai to, chưa biết sẹo: cá thể hóa, không tự gộp thành chống chỉ định tuyệt đối', 'Hiện tại: ngôi, độ lọt, cổ tử cung, cân nặng ước'], dont: ['Dùng chủng tộc, tình trạng hôn nhân hay một con số tính sẵn làm lý do từ chối'], pil: 'ass', lesson: 'chon-nguoi' } },
    explain: { ntd: { icon: '💡', t: 'Giải thích bằng lời đời thường', secs: '≈60 giây', goal: 'Vị trí nhau → vì sao chảy máu → vì sao ít đau.', say: '“Bánh nhau của chị bám thấp, gần hoặc che đường em bé ra. Khi phần dưới tử cung thay đổi, chỗ bám có thể chảy máu — nên chị ra máu mà không đau.”', items: ['Giải thích vị trí nhau', 'Vì sao chảy máu (đoạn dưới thay đổi, diện bám bị kéo tách)', 'Nguy cơ cho mẹ (mất máu, thiếu máu, BHSS) và cho con (thiếu oxy, sinh non)', 'Dùng lời đời thường, vẽ/minh họa nếu cần'], dont: ['“Placenta praevia, nguy cơ PAS…” với bệnh nhân'], pil: 'com', lesson: 'tu-van-ntd' },
      tolac: { icon: '💡', t: 'Giải thích bằng lời đời thường', secs: '≈60 giây', goal: 'Phân biệt TOLAC và VBAC; giải thích đơn giản.', say: '“TOLAC là mình thử chuyển dạ sau lần mổ cũ. Nếu sinh thường thành công thì gọi là VBAC; nếu không được thì mổ ngay trong chuyển dạ.”', items: ['TOLAC = thử chuyển dạ; VBAC = kết quả sinh âm đạo thành công', 'Không hứa trước sẽ VBAC', 'Kế hoạch có thể đổi theo diễn tiến chuyển dạ', 'Dùng lời đời thường'], dont: ['Nói “đã mổ thì luôn phải mổ”'], pil: 'com', lesson: 'tolac-vbac' } },
    choice: { ntd: { icon: '⚖️', t: 'Kế hoạch & lựa chọn', secs: '≈60 giây', goal: 'Theo dõi/sinh/máu; thống nhất cùng người bệnh.', say: '“Mình thống nhất nơi theo dõi, người đi cùng, cách gọi cấp cứu, kế hoạch sinh và chuẩn bị máu.”', items: ['Nơi theo dõi & người hỗ trợ', 'Kế hoạch sinh (nhau che lỗ trong thường cần mổ lấy thai theo kế hoạch)', 'Chuẩn bị máu, nơi sinh đủ năng lực', 'Quyền lựa chọn và đồng thuận'], dont: ['Hứa chắc bảo tồn tử cung khi có nguy cơ xuất huyết nặng'], pil: 'plan', lesson: 'quan-ly-ntd' },
      tolac: { icon: '⚖️', t: 'Nguy cơ & lựa chọn (số tuyệt đối)', secs: '≈90 giây', goal: 'Trả lời đúng 3 câu hỏi của bệnh nhân; nguy cơ có số tuyệt đối và đúng phiên bản.', say: '“Nguy cơ vỡ tử cung khoảng 0,5% trong dự định sinh thường theo RCOG 2015, tăng 2–3 lần nếu gây chuyển dạ. Mổ lặp lại cũng có nguy cơ riêng. Mình cùng chọn.”', items: ['Nguy cơ vỡ tử cung ~0,5% (RCOG GTG45, 2015) — số quần thể, không là dự đoán cá nhân', 'Gây chuyển dạ/tăng co có thể tăng 2–3 lần', 'Nguy cơ mổ lặp lại: gây mê, chảy máu, nhiễm trùng, dính, sẹo/PAS', 'Tôn trọng ưu tiên; không tự quyết thay người bệnh'], dont: ['Chỉ nói “tăng gấp nhiều lần” mà bỏ số tuyệt đối', 'Ép chọn một phía'], pil: 'plan', lesson: 'nguy-co-va-tu-van' } },
    close: { ntd: { icon: '🤝', t: 'Dấu báo động + teach-back', secs: '≈45 giây', goal: 'Để người bệnh tự nói lại khi nào phải vào viện ngay.', say: '“Chị nhắc lại giúp em khi nào chị cần vào viện ngay nhé?”', items: ['Ra huyết lại, đau/co, choáng, thai máy giảm → đến viện ngay', 'Không tự lái xe khi choáng', 'Mời người bệnh nhắc lại (teach-back)', 'Hẹn tái khám / bàn giao'], dont: ['Hỏi “chị hiểu rồi đúng không?” rồi kết thúc'], pil: 'com', lesson: 'tu-van-ntd' },
      tolac: { icon: '🤝', t: 'Kế hoạch an toàn + teach-back', secs: '≈45 giây', goal: 'Nơi có mổ cấp cứu, theo dõi liên tục, dấu báo động; teach-back.', say: '“Nếu chị chọn thử chuyển dạ, mình sẽ theo dõi tim thai liên tục ở nơi có mổ cấp cứu, gây mê, sơ sinh và máu. Chị nhắc lại giúp em dấu hiệu cần báo ngay nhé?”', items: ['Theo dõi tim thai liên tục; nơi có mổ cấp cứu, gây mê, sơ sinh, máu', 'Dấu báo động: đau dữ dội/liên tục, ra máu, thai máy/tim thai bất thường', 'Giảm đau ngoài màng cứng có thể dùng nhưng không bỏ monitoring', 'Teach-back + kế hoạch dự phòng nếu phải mổ'], dont: ['“Theo dõi kỹ” mà không có phương án mổ cấp cứu'], pil: 'com', lesson: 'theo-doi-tolac' } }
  }
};
function stepsFor(c) {
  const cf = ST[c.id] || { kind: 'cc', topic: c.topic === 'nbn' ? 'nbn' : 'ntd', icon: '🩺', facts: [] }, B = STEPS[cf.kind], top = cf.topic, pick = o => (o.nbn || o.ntd || o.tolac) ? (o[top] || o.ntd || o.nbn || o.tolac) : o;
  const keys = cf.kind === 'cc' ? ['read', 'enter', 'assess', 'dx', 'risk', 'plan', 'talk'] : ['read', 'open', 'history', 'analyze', 'explain', 'choice', 'close'];
  let n = 0; const steps = keys.map(k => { const s = pick(B[k]); return { id: k, ...s, items: s.items.map(t => ({ t, i: n++ })) }; });
  steps.push({ id: 'check', icon: '✅', t: 'Đối chiếu & tự chấm', secs: 'sau trạm', goal: 'Xem điểm tự chấm theo từng nhóm tiêu chí, rồi đối chiếu với đáp án nguồn.', items: [] });
  return { cf, steps, total: n };
}
let oStep = 0, oCase = '', oShown = new Set();
function caseProgress(c) { const { total } = stepsFor(c); return total ? Math.round((state.rubrics[c.id] || []).length / total * 100) : 0; }
function renderOSCE() {
  const cases = window.OSCE_CASES || [], by = k => cases.filter(c => (ST[c.id]?.kind || 'cc') === k);
  const card = c => { const cf = ST[c.id] || { icon: '🩺' }, ans = arr(getAnswer(c)).length, pr = caseProgress(c); return `<a class="st-card" href="#/case/${e(c.id)}"><span class="st-ic">${cf.icon}</span><span class="st-body"><b>${e(c.title)}</b><small>${e(c.source?.examLabel || 'Trạm OSCE')} · ${c.minutes || 5} phút</small><span class="st-tags"><i class="${ans ? 'ok' : ''}">${ans ? '✓ có đáp án nguồn' : 'chưa có đáp án riêng'}</i>${pr ? `<i class="pr">tự chấm ${pr}%</i>` : ''}</span></span><span class="st-go">▶</span></a>`; };
  $('#stage').innerHTML = `<section class="o-hero"><div>${mascot('happy', 'mas')}</div><div><h1>Phòng thi OSCE 🩺</h1><p>Mỗi ca là một trạm ${C.date ? '' : ''}5 phút. Làm từng bước: <b>đọc đề → nói thành tiếng → xem gợi ý & tick → đối chiếu</b>. Không cần học thuộc đáp án, chỉ cần đủ ý và đúng thứ tự.</p><div class="go"><a class="btn primary" href="#/osce/guide">📘 Học cách làm một trạm</a><a class="btn pink" href="#/case/${e((cases[Math.floor(Math.random() * cases.length)] || {}).id || '')}">🎲 Vào trạm ngẫu nhiên</a></div></div></section>
<h2 class="o-h">🚨 Trạm cấp cứu <small>${by('cc').length} trạm · nói to, làm ngay</small></h2><div class="st-grid">${by('cc').map(card).join('')}</div>
<h2 class="o-h">💬 Trạm tư vấn <small>${by('tv').length} trạm · hỏi trước, giải thích sau</small></h2><div class="st-grid">${by('tv').map(card).join('')}</div>
<p class="status-note" style="margin-top:14px">Đề là bản nhớ lại của sinh viên, ghi rõ nguồn. Phần gợi ý do sổ tay soạn từ bài học UMP + rubric, <b>không phải đáp án thi chính thức</b>. <a href="#/sources/rubric">Xem rubric gốc ↗</a></p>`;
  renderRail();
}
function renderOsceGuide() {
  const ph = [['📖', 'Đọc đề', 'Gạch 5 thứ: ai · tuổi thai · triệu chứng · sinh hiệu/tim thai · yêu cầu.', '≈30 giây'], ['👋', 'Mở đầu', 'Tư vấn: chào, giới thiệu, hỏi tên. Cấp cứu: LA LÊN gọi hỗ trợ, đo sinh hiệu.', '10–20 giây'], ['🔎', 'Khai thác / nhận định', 'PARA, tuổi thai, tiền căn; hoặc dấu cấp cứu của mẹ và thai.', '≈90 giây'], ['🧪', 'Chỉ định có mục đích', 'Mỗi xét nghiệm kèm “để làm gì”. Không đọc danh sách trống.', '≈30 giây'], ['💡', 'Giải pháp & giải thích', 'Chẩn đoán + lý do, nguy cơ, kế hoạch — bằng lời đời thường.', '≈60 giây'], ['🤝', 'Đồng thuận & kiểm tra hiểu', 'Teach-back, dấu báo động, kế hoạch tiếp, bàn giao.', '≈45 giây']];
  const pil = [['Giao tiếp / chuyên nghiệp', 'Chào hỏi, đời thường, đồng cảm, hai chiều'], ['Khai thác & phân tích', 'PARA, tuổi thai, tiền sử — hỏi đúng chỗ'], ['Nhận diện chỉ báo & test', 'Chọn và diễn giải xét nghiệm có mục đích'], ['Giải pháp · đồng thuận · quản lý tiếp', 'Kế hoạch, kiểm tra hiểu, theo dõi tiếp']];
  $('#stage').innerHTML = `<div class="page-head"><div class="eyebrow">📘 CÁCH LÀM MỘT TRẠM</div><h1>6 bước, <em>5 phút</em></h1><p>Giám khảo chấm theo bốn nhóm tiêu chí. Làm đủ sáu bước này là bạn đã chạm cả bốn nhóm.</p></div>
<div class="g-steps">${ph.map((p, i) => `<div class="g-step"><span class="g-n">${i + 1}</span><span class="g-ic">${p[0]}</span><b>${p[1]}</b><p>${p[2]}</p><small>${p[3]}</small></div>`).join('')}</div>
<h2 class="o-h">🎯 Giám khảo chấm gì? <small>rubric chung của bộ môn</small></h2><div class="g-pil">${pil.map(p => `<div><b>${p[0]}</b><p>${p[1]}</p></div>`).join('')}</div>
<p class="status-note">Thang mức đạt trong tài liệu: F / 50% / 75% / 100% (một số phiên bản dùng F / 40% / 80% / 100% — không trộn). Một số điều kiện “không đạt” phải đọc riêng trong <a href="#/sources/rubric">rubric gốc ↗</a>.</p>
<div class="hero-actions"><a class="btn primary" href="#/osce">▶ Chọn trạm để luyện</a></div>`;
  renderRail();
}
function renderCase(id) {
  const c = (window.OSCE_CASES || []).find(x => x.id === id); if (!c) { renderNotFound(); return; }
  if (currentCaseId !== id) { stopTimer(); remaining = (c.minutes || 5) * 60; currentCaseId = id; oStep = 0; oShown = new Set(); }
  const { cf, steps, total } = stepsFor(c), ticks = new Set(state.rubrics[c.id] || []), st = steps[oStep], last = oStep === steps.length - 1;
  const pct = () => Math.round((state.rubrics[c.id] || []).length / Math.max(1, total) * 100);
  const stepBar = `<div class="o-steps">${steps.map((s, i) => { const its = s.items, done = its.length && its.every(x => ticks.has(x.i)); return `<button class="o-step ${i === oStep ? 'cur' : ''} ${done ? 'done' : ''}" data-st="${i}" title="${e(s.t)}"><span>${done ? '✓' : s.icon}</span><i>${i + 1}</i></button>`; }).join('')}</div>`;
  const facts = `<ul class="o-facts">${cf.facts.map(([a, b]) => `<li><b>${e(a)}</b>${e(b)}</li>`).join('')}</ul>`;
  const timer = `<div class="o-timer"><span class="timer" id="timer">${timeText()}</span><button id="timer-toggle" class="btn small">${timerRunning ? '⏸ Dừng' : '▶ Bắt đầu 5′'}</button><button id="timer-reset" class="btn small flat">↺</button></div>`;
  const stem = `<details class="deep"><summary>📄 Đề gốc (bản nhớ lại)</summary><div class="deep-body"><p>${e(c.stem).replace(/\n/g, '<br>')}</p>${(c.originalQuestions || []).length ? `<p><b>Câu hỏi:</b><br>${c.originalQuestions.map(q => '• ' + e(typeof q === 'string' ? q : q.text || q.prompt || '')).join('<br>')}</p>` : ''}<p class="status-note">${e(c.source?.file || '')}${c.source?.pages ? ' · trang ' + e(arr(c.source.pages).join(', ')) : ''}</p></div></details>`;
  const left = `<figure class="fig o-case"><div class="o-top"><span class="badge ${cf.kind === 'tv' ? 'extra' : 'good'}">${cf.kind === 'tv' ? '💬 Trạm tư vấn' : '🚨 Trạm cấp cứu'}</span><span class="status-note">${e(c.source?.examLabel || '')}</span></div><h2 class="o-title">${cf.icon} ${e(c.title)}</h2>${facts}${c.vitals ? `<p class="vitals">${e(c.vitals)}</p>` : ''}${timer}${stem}</figure>`;
  let right = '';
  if (!last) {
    const done = st.items.filter(x => ticks.has(x.i)).length, shown = oShown.has(oStep);
    right = `<div class="o-panel"><div class="o-ph"><span class="o-pic">${st.icon}</span><div><h3>${oStep + 1}. ${e(st.t)}</h3><small>⏱ ${e(st.secs)} · nhóm tiêu chí: ${e(PIL[st.pil] || '')}</small></div></div><p class="o-goal">🎯 ${e(st.goal)}</p>
<label class="o-say-l" for="o-note">🗣️ Nói thành tiếng trước, rồi ghi ý chính (tự do):</label><textarea id="o-note" data-note="${c.id}_${st.id}" maxlength="4000" placeholder="Bạn sẽ nói gì ở bước này?">${e(state.notes[c.id + '_' + st.id] || '')}</textarea>
${shown ? `<div class="o-hint"><div class="note lav"><span>💬</span><span>${e(st.say)}</span></div><div class="o-checks">${st.items.map(x => `<label class="o-ck ${ticks.has(x.i) ? 'on' : ''}"><input type="checkbox" data-tick="${x.i}" ${ticks.has(x.i) ? 'checked' : ''}><span>${e(x.t)}</span></label>`).join('')}</div><p class="o-prog">Bạn đã nói được <b>${done}/${st.items.length}</b> ý</p><div class="note warn"><span>🚫</span><span><b>Đừng:</b> ${st.dont.map(e).join(' · ')}</span></div><a class="text-btn" href="#/step/${st.lesson}">📚 Ôn lại bài liên quan ↗</a></div>` : `<button class="btn mint" id="o-show">💡 Xem gợi ý & tick ý đã nói</button>`}</div>`;
  } else {
    const pil = {}; steps.forEach(s => s.items.forEach(x => { (pil[s.pil] ??= [0, 0])[1]++; if (ticks.has(x.i)) pil[s.pil][0]++; }));
    const ans = arr(getAnswer(c)), review = c.answerReview || {};
    right = `<div class="o-panel"><div class="o-ph"><span class="o-pic">✅</span><div><h3>Đối chiếu & tự chấm</h3><small>tự lượng giá, không phải điểm thi</small></div></div><div class="o-score"><b>${pct()}%</b><span>ý đã nói</span></div>${Object.entries(pil).map(([k, [a, b]]) => `<div class="o-bar"><span>${e(PIL[k])}</span><div><i style="width:${b ? a / b * 100 : 0}%"></i></div><b>${a}/${b}</b></div>`).join('')}<p class="status-note">Thiếu nhóm nào thì ôn lại bước đó. Không đạt điểm tự luyện không có nghĩa là trượt OSCE.</p><button class="btn pink" id="answer-toggle">Mở đáp án nguồn & đối chiếu ↗</button></div>`;
  }
  const bottom = `<button class="btn flat" id="prev" data-go ${oStep === 0 ? 'disabled' : ''}>◀ Trước</button><div class="mid"><div class="dots">${steps.map((s, i) => `<i class="${i === oStep ? 'cur' : ''}"></i>`).join('')}</div><span class="sign">${SIGN}</span></div><button class="btn primary" id="next" data-go>${last ? '✓ Xong · về danh sách' : 'Tiếp ▶'}</button>`;
  setView('lesson-mode', c.topic === 'tolac' ? 'mint' : c.topic === 'nbn' ? 'butter' : 'lavender', `🩺 ${cf.kind === 'tv' ? 'Tư vấn' : 'Cấp cứu'} · bước ${oStep + 1}/${steps.length}`, (oStep + 1) / steps.length * 100); renderRail(); setBar(bottom);
  $('#stage').innerHTML = `<article class="lesson osce"><div class="head"><h1 class="ttl"><mark>${e(c.title)}</mark></h1></div>${stepBar}<div class="scene"><div class="viz">${left}<div class="say"><div id="mas">${mascot(last ? 'happy' : 'wow')}</div><div class="bub">${last ? 'Xong rồi! Xem điểm tự chấm bên phải nha.' : e(st.goal)}</div></div></div><aside class="ctl">${right}</aside></div>${last ? `<section id="case-answer" hidden>${renderCaseAnswer(c, arr(getAnswer(c)), c.answerReview || {})}</section>` : ''}</article>`;
  const go2 = n => { oStep = clamp(n, 0, steps.length - 1); renderCase(id); $('#stage').scrollTop = 0; };
  $$('.o-step').forEach(b => b.onclick = () => go2(+b.dataset.st));
  $('#prev').onclick = () => go2(oStep - 1);
  $('#next').onclick = () => { if (last) { go('#/osce'); return; } if (!oShown.has(oStep)) { const n = $('#next'); n.classList.remove('shake'); void n.offsetWidth; n.classList.add('shake'); sound('buzz'); toast('Thử nói trước rồi bấm 💡 Xem gợi ý nha'); return; } sound('pop'); go2(oStep + 1); };
  window.__next = () => $('#next').click(); window.__prev = () => $('#prev').click();
  const sh = $('#o-show'); if (sh) sh.onclick = () => { oShown.add(oStep); sound('pop'); renderCase(id); };
  $$('[data-tick]').forEach(ch => ch.addEventListener('change', () => { const i = +ch.dataset.tick, cur = new Set(state.rubrics[c.id] || []); ch.checked ? cur.add(i) : cur.delete(i); state.rubrics[c.id] = [...cur].filter(n => n < 100); save(); sound(ch.checked ? 'pop' : 'tick'); const doneAll = st.items.every(x => cur.has(x.i)); if (ch.checked && doneAll) { sound('chime'); toast(rand(PRAISE) + ' Đủ ý bước này!'); burst(ch); } renderCase(id); }));
  $$('[data-note]').forEach(t => t.addEventListener('input', () => { state.notes[t.dataset.note] = t.value; save(); }));
  $('#timer-toggle').onclick = () => { if (timerRunning) stopTimer(); else startTimer(); $('#timer-toggle').textContent = timerRunning ? '⏸ Dừng' : '▶ Tiếp tục'; };
  $('#timer-reset').onclick = () => { stopTimer(); remaining = (c.minutes || 5) * 60; updateTimer(); $('#timer-toggle').textContent = '▶ Bắt đầu 5′'; };
  const at = $('#answer-toggle'); if (at) at.onclick = () => { const a = $('#case-answer'); a.hidden = !a.hidden; at.textContent = a.hidden ? 'Mở đáp án nguồn & đối chiếu ↗' : 'Gấp đáp án lại ↑'; sound(); if (!a.hidden) a.scrollIntoView({ behavior: 'smooth' }); };
  updateTimer();
}

function getAnswer(c){return c.originalAnswer||c.referenceAnswer||c.modelAnswer||[];}
function arr(v){return Array.isArray(v)?v:v?[v]:[];}
function renderCaseAnswer(c,answers,review){
 const src=c.sourceAnswer||c.answerSource||{},status=review.status||'',corrected=arr(review.correctedAnswer||c.correctedAnswer),corrections=review.corrections||[],guidelineNotes=arr(c.guidelineNotes||review.guidelineNotes);
 return `<div class="case-answer"><h2>${corrected.length?'Đáp án đã đối chiếu giáo trình':'Đáp án tham khảo trong tài liệu'}</h2><p class="origin">${e(src.kind|| (answers.length?'Đáp án tham khảo · xem nguồn':'Chưa tìm thấy đáp án nguồn'))}<br>${e(src.file||'')}${src.pages?' · trang '+e(arr(src.pages).join(', ')):''}${status?'<br>Trạng thái kiểm: '+e(status):''}</p>${review.summary?`<p><b>Nhận định đối chiếu:</b> ${e(review.summary)}</p>`:''}${corrected.length?corrected.map(p=>`<p>${e(p).replace(/\n/g,'<br>')}</p>`).join(''):answers.length?answers.map(p=>`<p>${e(p).replace(/\n/g,'<br>')}</p>`).join(''):'<p>Không thấy đáp án tham khảo đủ căn cứ cho ca này. Bạn có thể đọc bài học liên quan và đối chiếu với giảng viên; sổ tay không tạo một đáp án mới rồi gọi là đáp án thi.</p>'}${corrected.length&&answers.length?`<details class="deep"><summary>Đối chiếu đáp án tham khảo nguyên bản</summary><div class="deep-body">${answers.map(p=>`<p>${e(p).replace(/\n/g,'<br>')}</p>`).join('')}</div></details>`:''}${corrections.length?`<details class="deep" open><summary>Các ý được sửa / làm rõ</summary><div class="deep-body">${corrections.map(x=>`<p><b>Nguồn ghi:</b> ${e(x.original||'')}<br><b>Hiệu chỉnh:</b> ${e(x.corrected||'')}<br><b>Vì sao:</b> ${e(x.reason||'')}<br><small>${e(arr(x.sources||x.source).map(sourceLabel).join(' · '))}</small></p>`).join('')}</div></details>`:''}${guidelineNotes.length?`<div class="source-answer-caution"><b>Góc đối chiếu thực hành hiện hành — tách khỏi đáp án học phần</b>${guidelineNotes.map(t=>`<p>${e(typeof t==='string'?t:t.text||t.note||JSON.stringify(t))}</p>`).join('')}</div>`:''}${c.textbookCorrection?.note?`<p class="status-note">${e(c.textbookCorrection.note)}</p>`:''}${refs(review.verifiedSources||[])}</div>${c.referenceReading?.length?`<details class="deep" open><summary>Đoạn tham khảo trong giáo trình theo chủ đề</summary><div class="deep-body"><p class="status-note">Các đoạn dưới đây là nguồn đọc thêm, không phải đáp án riêng của đề. Không tự suy những dữ kiện đề chưa cung cấp.</p>${c.referenceReading.map(r=>`<article><h3>${e(r.title)}</h3><p class="status-note">${e(r.file)} · trang ${e(arr(r.pages).join(', '))}</p>${r.note?`<p class="status-note">${e(r.note)}</p>`:''}${arr(r.excerpt).map(t=>`<p>${e(t)}</p>`).join('')}</article>`).join('')}</div></details>`:''}${c.rubric?.length?`<details class="deep"><summary>Checklist tách từ đáp án / tự lượng giá</summary><div class="deep-body"><p class="status-note">${e(c.rubricNote||'Bảng tự lượng giá từ nội dung nguồn; không phải điểm OSCE chính thức.')}</p><div class="rubric-list">${c.rubric.map((r,i)=>`<label class="rubric-item"><input type="checkbox" data-rubric="${i}" ${(state.rubrics[c.id]||[]).includes(i)?'checked':''}><span>${e(r.text||r)}${r.critical?'<span class="critical">ý cần chú ý</span>':''}</span></label>`).join('')}</div><p id="rubric-score" class="rubric-score"></p></div></details>`:''}`;
}
function updateRubric(c){const el=$('#rubric-score');if(!el)return;const n=(state.rubrics[c.id]||[]).length;el.textContent=`Bạn đã tự đối chiếu ${n}/${c.rubric.length} ý. Đây là mức tự rà soát, không quy đổi thành điểm thi.`;}
function timeText(){return `${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;}
function updateTimer(){const t=$('#timer');if(t){t.textContent=timeText();t.classList.toggle('expired',remaining===0);}}
function startTimer(){if(remaining<=0){toast('Hết giờ tự luyện; bạn có thể đặt lại hoặc mở đáp án.');return;}timerRunning=true;caseTimer=setInterval(()=>{remaining=Math.max(0,remaining-1);updateTimer();if(!remaining){stopTimer();sound('chime');toast('Hết giờ tự luyện. Bạn hoàn tất ý đang nói rồi mở đáp án để đối chiếu.');if($('#timer-toggle'))$('#timer-toggle').textContent='Đã hết giờ';}},1000);}
function stopTimer(){if(caseTimer)clearInterval(caseTimer);caseTimer=null;timerRunning=false;}
function renderSources(anchor){
 const lib=window.SOURCE_LIBRARY||{},official=window.OFFICIAL_RUBRIC;
 $('#stage').innerHTML=`<div class="page-head"><div class="eyebrow">📚 SỔ NGUỒN · CÓ ĐỊA CHỈ ĐỂ KIỂM LẠI</div><h1>Bám giáo trình.<br><em>Đọc rõ từng nguồn.</em></h1><p>Nội dung được tổ chức theo ELOs Topic 46 và bộ bài giảng UMP. Phần đối chiếu guideline có phiên bản riêng; ghi chú/đáp án của sinh viên không được mặc định là đáp án bộ môn.</p></div><div class="source-note">${e(lib.inventorySummary||'Đã rà tài liệu tại các thư mục được cung cấp.')}<br><b>Ngày kiểm:</b> ${C.date}. ${L.length} trang học; ${M.length} chặng, trong đó ba chặng đọc thêm. Đây là phạm vi đã đối chiếu, không phải tuyên bố mọi trang của mọi đề scan đã được OCR.</div><div class="pill-list"><a class="pill" href="#sources-local">Nguồn học phần</a><a class="pill" href="#sources-coverage">Bảng phủ nội dung</a><a class="pill" href="#sources-rubric">Rubric gốc</a><a class="pill" href="#sources-guideline">Đối chiếu guideline</a></div><section id="sources-local"><div class="section-title"><h2>Tài liệu được chọn làm trục</h2><p>Đọc bản đầy đủ, bỏ học lặp</p></div>${(lib.selected||[]).map(s=>`<details class="deep"><summary>${e(s.title)} <span class="badge">${e(s.id)} · tr. ${e(s.pages)}</span></summary><div class="deep-body"><p>${e(s.why)}</p><p class="status-note">Đường dẫn gốc trên máy:<br><code style="overflow-wrap:anywhere">${e(s.path)}</code></p></div></details>`).join('')}<p class="status-note">Toàn bộ nguồn gốc vẫn ở thư mục của bạn. Bản kiểm kê, hash và bản trích nằm trong thư mục research của dự án; web chỉ đóng gói metadata và hình chọn lọc.</p></section><section id="sources-coverage"><div class="section-title"><h2>Kiến thức có chỗ đứng ở đâu?</h2></div><div class="table-scroll"><table class="coverage-table"><thead><tr><th>Nhóm</th><th>Trang học</th><th>Nguồn</th></tr></thead><tbody>${(lib.coverage||[]).map(c=>`<tr><td>${e(c.label)}</td><td>${(c.lessonIds||[]).filter(id=>validIds.has(id)).map(id=>`<a href="#/step/${id}">${e(L.find(l=>l.id===id).title)}</a>`).join('<br>')}</td><td>${e(c.source)}</td></tr>`).join('')}</tbody></table></div></section><section id="sources-rubric"><div class="section-title"><h2>Rubric thật, đọc đúng bệnh cảnh</h2></div><p class="status-note">Rubric-thi-OSCE-cuối-kỳ.pdf (3 trang) có thang F/50%/75%/100%. Một số phiên bản khác dùng F/40%/80%/100%; không trộn các thang.</p><div class="source-note"><b>Khung chung:</b> giao tiếp/chuyên nghiệp; khai thác và phân tích tiền sử, PARA, tuổi thai; nhận diện chỉ báo, lựa chọn và diễn giải test; giải pháp/đồng thuận/kiểm tra hiểu và quản lý tiếp. Quy tắc không đạt của rubric phải đọc riêng, không chỉ cộng điểm.</div>${official?`<h3 style="margin-top:25px">${e(official.title||'Rubric NBN cụ thể')}</h3><p class="status-note">${e(official.context||'Ca NBN nặng có CTG đe dọa, không áp dụng cho mọi ca NBN.')}<br>${e(official.source||'RUBRIC.pdf, trang 6')}</p><div class="table-scroll"><table><thead><tr><th>Năng lực</th><th>Tối đa</th><th>Nội dung / mức đánh giá</th></tr></thead><tbody>${(official.rows||[]).map(r=>`<tr><td>${e(r.name||r.title||r.skill)}</td><td>${e(r.max)}</td><td>${renderCriteria(r.criteria)}</td></tr>`).join('')}</tbody></table></div><p class="status-note">Tổng tối đa 10 điểm. Ô 80% của “thái độ cấp cứu” không được tính theo chú thích bảng gốc. Xem ảnh gốc bên dưới để đọc đầy đủ mức F/40%/80%/100%.</p>`:''}<details class="deep"><summary>Xem ảnh rubric NBN gốc</summary><figure class="ref-inline"><img src="assets/rubric-nbn-original.png" alt="Bảng rubric ca NBN từ RUBRIC.pdf trang 6, bảy thành phần và các mức điểm" loading="lazy"><figcaption>RUBRIC.pdf · trang 6. Dùng đúng ca đã cho; không xem đây là bảng chấm cho mọi trạm.</figcaption></figure></details></section><section><div class="section-title"><h2>Hình từ tài liệu học phần</h2></div><div class="ref-gallery">${(window.REFERENCE_IMAGES||[]).map(im=>`<figure><img src="${e(im.src)}" alt="${e(im.title)}" loading="lazy"><figcaption><strong>${e(im.title)}</strong>${e(im.caption)}<br>Nguồn: ${e(im.source)}</figcaption></figure>`).join('')}</div></section><section id="sources-guideline"><div class="section-title"><h2>Giáo trình cũ & điểm đối chiếu hiện hành</h2></div><p class="status-note">Bảng này làm rõ thay đổi và lỗi ghi chú; không thay dữ kiện đề hoặc gán guideline mới thành đáp án bộ môn.</p>${(lib.corrections||[]).map(c=>`<div class="correction"><div class="old"><b>Điểm cần cảnh giác trong nguồn cũ</b>${e(c.old)}</div><div><b>Đối chiếu</b>${e(c.current)}<br><small>${e(c.source)}</small></div></div>`).join('')}<div class="section-title"><h2>Danh mục nguồn kiểm chứng</h2></div>${Object.entries(C.sources).map(([id,s])=>`<article class="source-card" id="source-${id}"><span class="source-id">[${e(id)}] · ${e(s.year||'')}</span><h2>${e(s.title)}</h2><p>${e(s.note||'')}</p>${s.url?`<a href="${e(s.url)}" target="_blank" rel="noopener noreferrer">Mở nguồn chính thức ↗</a>`:''}</article>`).join('')}</section><section><div class="section-title"><h2>Giới hạn công khai</h2></div><ul>${(lib.limitations||[]).map(t=>`<li style="font-size:12px">${e(t)}</li>`).join('')}<li style="font-size:12px">Chưa truy xuất được phác đồ Bộ Y tế/Từ Dũ 2026 đầy đủ; nguồn địa phương 2018 được ghi đúng năm. Liều thuốc chưa kiểm chứng không được tự thêm.</li><li style="font-size:12px">Tiến độ không tự đồng bộ qua cloud. Link chặng chỉ mang vị trí; để chuyển cả tiến độ, dùng Lưu/Nhập tiến độ.</li></ul></section>`;
 const crs=[...new Set(Object.values(BEATS()).flat().map(b=>b.cr).filter(Boolean))];
 if(crs.length)$('#stage').insertAdjacentHTML('beforeend',`<section class="page-head" id="source-hinh"><div class="eyebrow">🖼 HÌNH ẢNH DÙNG LẠI · GIẤY PHÉP MỞ</div><ul>${crs.map(c=>`<li>${e(c)}</li>`).join('')}</ul><p class="status-note">Hình CC BY-SA được tách lớp / bỏ chữ để gắn tương tác; bản chỉnh sửa giữ nguyên giấy phép CC BY-SA 4.0.</p></section>`);
 renderRail();if(anchor)setTimeout(()=>{const target=anchor==='rubric'?$('#sources-rubric'):document.getElementById('source-'+anchor);target?.scrollIntoView();},0);
}
function renderCriteria(c){if(Array.isArray(c))return c.map(x=>e(typeof x==='string'?x:JSON.stringify(x))).join('<br>');if(c&&typeof c==='object')return Object.entries(c).map(([k,v])=>`<b>${e(k)}:</b> ${e(v)}`).join('<br>');return e(c||'');}
function renderReview(){const missed=L.filter(l=>state.answers[l.id]&&!state.answers[l.id].correct),marked=L.filter(l=>state.bookmarks.includes(l.id));$('#stage').innerHTML=`<div class="page-head"><div class="eyebrow">↺ CHỖ CẦN QUAY LẠI</div><h1>Ôn lại mắt xích<br><em>chưa nối chắc.</em></h1><p>Câu trả lời gần nhất chưa đúng và trang bạn đã ghim. Tự giải thích trước khi mở chi tiết; làm lại để cập nhật trạng thái.</p></div><div class="section-title"><h2>${missed.length} câu cần thử lại</h2></div>${missed.length?missed.map(reviewLink).join(''):'<div class="empty">Chưa có câu trả lời sai đang lưu. Bạn có thể bắt đầu học hoặc quay lại những trang đã ghim.</div>'}<div class="section-title"><h2>${marked.length} trang đã ghim</h2></div>${marked.length?marked.map(reviewLink).join(''):'<p class="status-note">Bấm “Ghim trang để ôn” ở cuối bài để thêm vào đây.</p>'}<a class="btn primary" href="#/step/${state.last}">Học tiếp ↗</a>`;renderRail();}
function reviewLink(l){return `<a class="review-card" href="#/step/${l.id}/nho"><h2>${e(l.title)}</h2><p>${e(l.quiz.q)}</p></a>`;}
function renderNotFound(){$('#stage').innerHTML='<div class="page-head"><h1>Trang này chưa có trong sổ.</h1><p>Link có thể đã sai hoặc thay đổi. Bạn mở bản đồ để chọn đúng trang nhé.</p><a class="btn primary" href="#/map">Về bản đồ ↗</a></div>';renderRail();}


// ───────── Tra nhanh đi trực: số và ngưỡng hay dùng, kèm nguồn & link về bài
const TRA = [
  ['🔔', 'Nhận diện sớm', 'pink', [['Shock index = HR ÷ HATT', 'FIGO 2022: > 0,9 là dấu báo động · WHO 2025: > 1 trong tổ hợp trigger. SI thấp không loại trừ.', 'shock-index'], ['Phân độ sốc (bảng học phần)', 'I ≈15% · II 20–25% · III 30–35% · IV 40–45% máu mất; chỉ để hình dung.', 'phan-do-soc'], ['Trigger khởi trị BHSS (WHO 2025)', 'Máu đo ≥ 300 mL kèm bất thường huyết động, hoặc ≥ 500 mL (≤ 24 giờ sau sinh).', 'theo-doi-mau-mat']]],
  ['💪', 'BHSS: tìm đúng T & bundle', 'peach', [['4T', 'Tone (đờ) · Trauma (rách, máu tụ, vỡ/lộn) · Tissue (sót, nhau bám bất thường) · Thrombin (đông máu).', 'dinh-nghia-4t'], ['Bundle chạy song song', 'Xoa tử cung + thuốc co hồi · TXA + dịch IV · khám nguồn chảy + leo thang; khởi động ≤ 15 phút.', 'bundle'], ['TXA', '1 g IV trong 10 phút, trong 3 giờ từ lúc SINH; thêm 1 g nếu còn chảy sau 30′ hoặc chảy lại ≤ 24 giờ.', 'txa'], ['Fibrinogen & tiểu cầu', 'Mốc fibrinogen ≥ 2 g/L; cân nhắc tiểu cầu khi chảy vi mạch và < 50 × 10⁹/L (WHO 2025).', 'xet-nghiem-truyen-mau']]],
  ['💊', 'Thuốc co hồi', 'mint', [['Dự phòng (WHO 2025, chọn MỘT)', 'Oxytocin 10 IU IM/IV (ưu tiên) · carbetocin 100 µg IM/IV (dạng chịu nhiệt) · misoprostol 400/600 µg uống.', 'bao-quan-thuoc-go'], ['Điều trị đầu tay', 'Oxytocin IV (WHO: 10 IU IV chậm 1–2 phút hoặc truyền 5–10 phút). Đổi IU → mL cần biết hàm lượng.', 'oxytocin-dieu-tri'], ['Chống chỉ định bậc hai', 'Methylergometrine: tránh THA/TSG/tim mạch · Carboprost: tránh hen, bệnh tim/phổi/thận/gan hoạt động · Misoprostol 800 µg ngậm dưới lưỡi.', 'thuoc-go-hang-hai'], ['Kẹp rốn & kéo dây', 'Kẹp muộn 1–3 phút (trừ trẻ ngạt) · kéo dây có kiểm soát chỉ khi tử cung co + tay đối lực.', 'kep-ron-muon']]],
  ['🥧', 'Nhau tiền đạo / PAS', 'lavender', [['Phân loại (RCOG 2026)', 'Mép nhau chạm/che lỗ trong = tiền đạo · < 20 mm chưa chạm = bám thấp.', 'vi-tri-nhau'], ['Khám an toàn', 'KHÔNG thăm ngón tay khi chưa loại trừ NTĐ; TVS an toàn; khám mỏ vịt khi phù hợp.', 'chan-doan-ntd'], ['Thời điểm sinh', 'UMP: mổ 37–38 tuần ở người ổn định · RCOG 2026: không muộn hơn 37+6. Nguy kịch thì không chờ.', 'quan-ly-ntd'], ['Sẹo + nhau mặt trước thấp', 'Nghĩ PAS, chuẩn bị đa chuyên khoa, không cố bóc nhau.', 'pas']]],
  ['🌩️', 'Nhau bong non & vỡ tử cung', 'butter', [['NBN', 'Chẩn đoán chủ yếu lâm sàng; siêu âm âm tính không loại trừ; tim thai + cơn co đọc cùng nhau; DIC cần bù thành phần.', 'chan-doan-nbn'], ['Đường sinh khi NBN', 'Thai sống đe dọa, không sinh nhanh được → mổ khẩn · thai mất & mẹ ổn → ưu tiên sinh âm đạo · mẹ sốc không kiểm soát → khẩn theo an toàn mẹ.', 'xu-tri-nbn'], ['Dọa vỡ', 'Ngừng tăng co, gọi kíp, hồi sức + mổ khẩn song song; không tăng oxytocin để vượt bất xứng.', 'xu-tri-vo']]],
  ['🛤️', 'TOLAC & kẹt vai', 'sky', [['Nguy cơ vỡ tử cung', '≈ 0,5% = 5/1000 trong dự định VBAC (RCOG GTG45, 2015); gây chuyển dạ/tăng co có thể ×2–3.', 'nguy-co-va-tu-van'], ['Điểm chặn', 'Sẹo dọc/cổ điển · tiền căn vỡ tử cung · nhau che lỗ trong; sẹo da không cho biết đường rạch tử cung.', 'chon-nguoi'], ['Kẹt vai', 'Gọi hỗ trợ + ghi giờ → McRoberts → ấn TRÊN xương mu (KHÔNG ấn đáy) → đổi cơ chế; không kéo đầu mạnh.', 'xu-tri-dau-tien']]]
];
function renderTra() {
  setView('page-mode', 'butter'); pageBar();
  $('#stage').innerHTML = `<div class="page-head"><div class="eyebrow">📌 TRA NHANH ĐI TRỰC</div><h1>Số & ngưỡng <em>hay dùng</em></h1><p>Mỗi dòng có link về bài để hiểu vì sao. Số theo bài giảng và guideline kèm phiên bản — không thay phác đồ nơi bạn làm.</p></div>
<div class="tra">${TRA.map(([ic, t, col, rows]) => `<section class="tra-g c-${col}"><h2>${ic} ${e(t)}</h2>${rows.map(([a, b, id]) => `<a class="tra-r" href="#/step/${id}"><b>${e(a)}</b><span>${e(b)}</span><i>↗</i></a>`).join('')}</section>`).join('')}</div>`;
  renderRail();
}

// ───────── chốt chương: tự trả lời trong đầu rồi lật thẻ
function renderChot(mid) {
  const m = M.find(x => x.id === mid); if (!m) { renderNotFound(); return; }
  const ls = moduleLessons(m), mi = M.indexOf(m), nextM = M[mi + 1], target = nextM ? '#/step/' + moduleLessons(nextM)[0].id : '#/map';
  const done = new Set(); let ready = false;
  setView('lesson-mode', m.color, `${MODICON[m.id]} ${m.short} · chốt chương`, 100);
  $('#stage').innerHTML = `<article class="lesson"><div class="head"><h1 class="ttl"><mark>🃏 Chốt chương: ${e(m.short)}</mark></h1></div><div class="howto"><b>📝 Cách học</b><ol><li><span>Đọc câu hỏi, <b>tự trả lời trong đầu</b> trước</span></li><li><span>Bấm thẻ để <b>lật</b> xem đáp án</span></li><li><span>Lật đủ ${ls.length} thẻ để sang bài tiếp</span></li></ol></div><div class="flips">${ls.map((l, i) => `<button class="fc" data-i="${i}"><span class="f1"><small>${i + 1}. ${e(l.title)}</small><b>${e(l.quiz.q)}</b><em>chạm để lật</em></span><span class="f2"><b>✓ ${e(l.quiz.options[l.quiz.answer])}</b><small>${e(l.quiz.explain)}</small></span></button>`).join('')}</div></article>`;
  const bar = () => setBar(`<a class="btn flat" href="${lessonHash(ls[ls.length - 1], pagesOf(ls[ls.length - 1]).slice(-1)[0])}" data-go>◀ Quay lại</a><div class="mid"><div class="dots">${ls.map((_, i) => `<i class="${done.has(i) ? 'done' : ''}"></i>`).join('')}</div><span class="sign">${SIGN}</span></div><button class="btn ${ready ? 'primary' : ''}" id="next" data-go>${nextM ? 'Bài tiếp: ' + e(nextM.short) + ' ▶' : '🏠 Về bản đồ'}</button>`);
  bar();
  const go2 = () => { if (!ready) { const n = $('#next'); n.classList.remove('shake'); void n.offsetWidth; n.classList.add('shake'); sound('buzz'); toast('Lật đủ ' + ls.length + ' thẻ đã nha 🃏'); return; } sound('tada'); go(target); };
  $('#stage').onclick = ev => { const c = ev.target.closest('.fc'); if (!c) return; c.classList.toggle('on'); done.add(+c.dataset.i); sound('pop'); if (!ready && done.size >= ls.length) { ready = true; toast(rand(PRAISE) + ' Chốt chương xong!'); burst(c); } bar(); $('#next').onclick = go2; };
  $('#next').onclick = go2; window.__next = go2; window.__prev = () => go(lessonHash(ls[ls.length - 1], pagesOf(ls[ls.length - 1]).slice(-1)[0]));
}
function pageBar() { setBar(`<a class="btn flat" href="#/map">🏠 Bản đồ</a><span class="mid"><span class="sign">${SIGN}</span></span><a class="btn primary" href="#/step/${state.last}">▶ Học tiếp</a>`); }
function route() {
  const hash = location.hash || '#/map';
  if (!hash.startsWith('#/')) { document.getElementById(hash.slice(1))?.scrollIntoView(); return; }
  const parts = hash.slice(2).split('/'), view = parts[0], id = parts[1];
  if (view !== 'case') { stopTimer(); currentCaseId = ''; }
  $$('dialog[open]').forEach(d => d.close()); stopRun(); window.__next = window.__prev = null; $('#stage').onclick = null;
  $$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === (view === 'case' ? 'osce' : view === 'step' ? 'map' : view)));
  const page = (color) => { setView('page-mode', color); pageBar(); };
  if (view === 'step') renderLesson(id, parts[2]);
  else if (view === 'lab') { go('#/step/' + (labTo[id] || 'van-chuyen-oxy')); return; }
  else if (view === 'osce') { page('sky'); id === 'guide' ? renderOsceGuide() : renderOSCE(); }
  else if (view === 'case') { page('sky'); renderCase(id); }
  else if (view === 'sources') { page('lavender'); renderSources(id); }
  else if (view === 'review') { page('peach'); renderReview(); }
  else if (view === 'tra') renderTra();
  else if (view === 'chot') renderChot(id);
  else if (view === 'map') renderMap();
  else { page('pink'); renderNotFound(); }
  document.title = (view === 'step' ? (L.find(x => x.id === id)?.title || 'Màn học') + ' · ' : '') + 'zitthenk học Cấp cứu Sản khoa';
  $('#stage').scrollTop = 0;
}
function search() {
  const query = norm($('#search-input').value), results = query ? L.filter(l => norm(l.title + ' ' + l.core + ' ' + l.deep + ' ' + l.pitfall).includes(query)) : L.slice(0, 6);
  $('#search-results').innerHTML = `<p class="status-note">${query ? results.length + ' màn phù hợp' : 'Gợi ý · gõ để tìm trong toàn bộ nội dung'}</p>` + results.slice(0, 35).map(l => `<a class="search-result" href="#/step/${l.id}"><small>${MODICON[l.module]} ${e(moduleOf(l).short)}</small><br><strong>${e(l.title)}</strong><p>${e(l.core).slice(0, 150)}…</p></a>`).join('') + (!results.length ? '<p>Chưa thấy. Bạn thử từ ngắn hơn hoặc bỏ dấu nha.</p>' : '');
}
$('#search-open').onclick = () => { $('#search-dialog').showModal(); search(); $('#search-input').focus(); }; $('#search-input').addEventListener('input', search);
$('#toc-open').onclick = () => { initTOC(); $('#toc-dialog').showModal(); };
$$('[data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());
$$('dialog').forEach(d => d.addEventListener('click', ev => { if (ev.target === d) { const r = d.getBoundingClientRect(); if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) d.close(); } }));
$('#toc-list').addEventListener('click', ev => { if (ev.target.closest('a')) $('#toc-dialog').close(); });
$('#search-results').addEventListener('click', ev => { if (ev.target.closest('a')) $('#search-dialog').close(); });
$('#sound').onclick = () => { state.sound = !state.sound; save(); sound('chime'); toast(state.sound ? 'Đã bật âm thanh 🔔' : 'Đã tắt âm thanh 🔕'); };
$('#export').onclick = () => { const data = JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2), blob = new Blob([data], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'zitthenk-chuong6-tien-do.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1500); toast('Đã tải bản tiến độ để giữ hoặc chuyển máy.'); };
$('#import').addEventListener('change', async ev => { const file = ev.target.files[0]; if (!file) return; try { if (file.size > 1000000) throw Error('File quá lớn. Hãy chọn đúng bản tiến độ JSON.'); const imported = sanitize(JSON.parse(await file.text())); state.done = [...new Set([...state.done, ...imported.done])]; state.bookmarks = [...new Set([...state.bookmarks, ...imported.bookmarks])]; state.answers = { ...state.answers, ...imported.answers }; state.notes = { ...state.notes, ...imported.notes }; state.rubrics = { ...state.rubrics, ...imported.rubrics }; state.last = imported.last; save(); route(); toast('Đã nhập và gộp tiến độ. Các màn đã học vẫn còn nha.'); } catch (err) { toast('Không nhập được: ' + err.message); } ev.target.value = ''; });
document.addEventListener('keydown', ev => {
  const editable = ev.target.closest?.('input,textarea,select,[contenteditable=true]'), interactive = ev.target.closest?.('button,a,summary');
  if ($('dialog[open]')) return;
  if (ev.key === '/' && !editable) { ev.preventDefault(); $('#search-open').click(); return; }
  if (editable || ev.ctrlKey || ev.metaKey || ev.altKey || (ev.code === 'Space' && interactive)) return;
  if (ev.key === 'ArrowRight' || ev.code === 'Space') { if (window.__next) { ev.preventDefault(); window.__next(); } }
  if (ev.key === 'ArrowLeft' && window.__prev) { ev.preventDefault(); window.__prev(); }
});
let tx = 0, ty = 0, tOK = false;
$('#stage').addEventListener('touchstart', ev => { const t = ev.touches[0]; tx = t.clientX; ty = t.clientY; tOK = !ev.target.closest('.fig,.sim,input,.ctl,.deep-body'); }, { passive: true });
$('#stage').addEventListener('touchend', ev => { const t = ev.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty; if (tOK && Math.abs(dx) > 80 && Math.abs(dy) < 40) { if (dx < 0 && window.__next) window.__next(); else if (dx > 0 && window.__prev) window.__prev(); } }, { passive: true });
window.ALL_SCREENS = () => ['#/map', ...L.flatMap(l => pagesOf(l).map(p => lessonHash(l, p))), ...M.map(m => '#/chot/' + m.id), '#/tra', '#/osce', '#/osce/guide', ...(window.OSCE_CASES || []).map(c => '#/case/' + c.id)];
window.addEventListener('hashchange', route); window.addEventListener('beforeunload', stopTimer);
updateTop(); route();
})();
