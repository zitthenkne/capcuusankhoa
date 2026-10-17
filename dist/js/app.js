'use strict';
(() => {
const C = window.COURSE, L = C.lessons, M = C.modules, ZS = window.ZS, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const STORE = 'zitthenk-osce-san-6-v1', validIds = new Set(L.map(l => l.id));
const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plain = s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const norm = s => plain(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const md = t => e(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rand = a => a[Math.floor(Math.random() * a.length)];
const fresh = () => ({ version: 1, done: [], beats: {}, answers: {}, bookmarks: [], notes: {}, rubrics: {}, last: L[0].id, sound: true });
function sanitize(s) {
  if (!s || typeof s !== 'object' || Array.isArray(s) || s.version !== 1) throw Error('Không đúng định dạng tiến độ của sổ tay này.');
  const out = fresh();
  for (const k of ['done', 'bookmarks']) out[k] = [...new Set(Array.isArray(s[k]) ? s[k].filter(x => validIds.has(x)) : [])];
  if (validIds.has(s.last)) out.last = s.last;
  if (s.beats && typeof s.beats === 'object' && !Array.isArray(s.beats)) for (const [k, v] of Object.entries(s.beats)) if (v === true && /^[a-z0-9-]{1,80}\/b\d{1,2}$/.test(k) && validIds.has(k.split('/')[0])) out.beats[k] = true;
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
    else if (kind === 'click') { t(1900, 0, .018, 'square', .025, 700); t(420, .028, .05, 'triangle', .04, 300); }
    else if (kind === 'page') { const n = audioCtx.createBuffer(1, audioCtx.sampleRate * .16, audioCtx.sampleRate), d = n.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.2); const src = audioCtx.createBufferSource(), fl = audioCtx.createBiquadFilter(), g = audioCtx.createGain(); fl.type = 'bandpass'; fl.frequency.setValueAtTime(600, now); fl.frequency.exponentialRampToValueAtTime(2400, now + .15); g.gain.value = .22; src.buffer = n; src.connect(fl); fl.connect(g); g.connect(audioCtx.destination); src.start(now); }
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
const ahaCache = {};

// ───────── chú giải viết tắt: chạm/rê vào chữ gạch chấm để xem nghĩa (chỉ áp cho chữ HTML cạnh hình, không đụng chữ trong SVG)
const GLOSS = { BHSS: 'Băng huyết sau sinh', 'NTĐ': 'Nhau tiền đạo', NBN: 'Nhau bong non', PAS: 'Nhau cài răng lược (placenta accreta spectrum)', TVS: 'Siêu âm đầu dò âm đạo', CTC: 'Cổ tử cung', TSM: 'Tầng sinh môn', NMC: 'Gây tê ngoài màng cứng', CTG: 'Monitor tim thai + cơn co', DIC: 'Đông máu nội mạch lan tỏa', AFE: 'Thuyên tắc ối', TOLAC: 'Thử chuyển dạ sau mổ lấy thai', VBAC: 'Sinh ngả âm đạo sau mổ lấy thai', SI: 'Shock Index = mạch ÷ HA tâm thu', TXA: 'Tranexamic acid — chống tiêu fibrin', HA: 'Huyết áp', 'ĐM': 'Động mạch', Hb: 'Hemoglobin (huyết sắc tố)', IU: 'Đơn vị quốc tế', IV: 'Tiêm / truyền tĩnh mạch', IM: 'Tiêm bắp', CPR: 'Hồi sinh tim phổi', HELLP: 'Tan máu · men gan tăng · tiểu cầu thấp', '4T': 'Tone (đờ tử cung) · Tissue (sót mô) · Trauma (rách) · Thrombin (đông máu)', Tone: 'Trương lực tử cung (đờ)', Tissue: 'Mô nhau còn sót', Trauma: 'Chấn thương đường sinh dục', Thrombin: 'Rối loạn đông máu', Bandl: 'Vòng co thắt: rãnh ngang bụng dâng cao khi dọa vỡ', Frommel: 'Dây chằng tròn căng như dây đàn khi dọa vỡ', Couvelaire: 'Tử cung tím do máu thấm vào cơ', Sheehan: 'Suy tuyến yên sau sinh vì thiếu máu', Horner: 'Sụp mi + co đồng tử', Moro: 'Phản xạ giật mình ở trẻ sơ sinh', McRoberts: 'Gập hai đùi mẹ sát bụng', RCOG: 'Hội Sản Phụ khoa Hoàng gia Anh', FIGO: 'Liên đoàn Sản Phụ khoa Quốc tế', UMP: 'Đại học Y Dược TP.HCM' };
const glEsc = k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const glRe = new RegExp('(?<![\\p{L}\\d])(' + Object.keys(GLOSS).sort((a, b) => b.length - a.length).map(glEsc).join('|') + ')(?![\\p{L}\\d])', 'gu');
const gl = html => html.split(/(<[^>]+>)/).map((p, i) => i % 2 ? p : p.replace(glRe, m => `<abbr class="ab" tabindex="0" data-t="${e(GLOSS[m])}">${m}</abbr>`)).join('');
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
<div class="parts">${PARTS.map(([k, name, ids]) => `<div class="part"><h2>${e(name)}</h2>${ids.map(id => { const m = M.find(x => x.id === id), ls = moduleLessons(m), done = ls.filter(l => state.done.includes(l.id)).length, nxt = ls.find(l => !state.done.includes(l.id)) || ls[0]; return `<a class="mod c-${m.color}" href="${done ? '#/step/' + nxt.id : '#/chuong/' + id}"><div class="ic">${MODICON[id]}</div><h3>${e(m.short)}</h3><p>${ls.length} màn · ~${Math.ceil(ls.length * 1.5)} phút${done ? ' · xong ' + done : ''}</p><div class="pips" aria-hidden="true">${ls.map(l => `<i class="${state.done.includes(l.id) ? 'done' : ''}"></i>`).join('')}</div></a>`; }).join('')}</div>`).join('')}</div>
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
  // kéo thẳng trong hình: data-scrub="k:min:max:step" (kéo ngang đổi số) · data-drag="k:x0:y0:x1:y1" (kéo điểm → lưu k+'x', k+'y')
  { const art = $('#art'); let gest = null;
    art.addEventListener('pointerdown', ev => { const sc = ev.target.closest('[data-scrub]'), dr = ev.target.closest('[data-drag]'); if (!sc && !dr) return; ev.preventDefault();
      if (sc) { const [k, mn, mx, st] = sc.dataset.scrub.split(':'); gest = { t: 's', k, mn: +mn, mx: +mx, st: +st || 1, x0: ev.clientX, v0: +S[k] || 0 }; }
      else { const [k, a, b, c, d] = dr.dataset.drag.split(':'); gest = { t: 'd', k, b: [+a, +b, +c, +d], q: '[data-drag^="' + k + ':"]' }; }
      try { art.setPointerCapture(ev.pointerId); } catch (err) { /* không sao */ } });
    art.addEventListener('pointermove', ev => { if (!gest) return;
      if (gest.t === 's') { const v = Math.max(gest.mn, Math.min(gest.mx, Math.round((gest.v0 + (ev.clientX - gest.x0) / 7 * gest.st) / gest.st) * gest.st)); if (v !== S[gest.k]) { set(gest.k, v); done(gest.k, ev, true); } }
      else { const el = art.querySelector(gest.q), svg = el ? el.ownerSVGElement : art.querySelector('svg'); if (!svg) return; const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()), b = gest.b,
          x = Math.max(b[0], Math.min(b[2], Math.round(p.x))), y = Math.max(b[1], Math.min(b[3], Math.round(p.y))); if (x !== S[gest.k + 'x'] || y !== S[gest.k + 'y']) { set(gest.k + 'x', x); set(gest.k + 'y', y); done(gest.k, ev, true); } } });
    const end = () => { gest = null; }; art.addEventListener('pointerup', end); art.addEventListener('pointercancel', end); }
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
  const pgDone = (p, i) => BEATS()[id] ? (p === 'nho' ? !!state.answers[id]?.correct : !!state.beats[id + '/' + p] || (i === pi && isBeat && beatOk)) : (i < pi);
  const bar = () => {
    const dn = isBeat ? (beatOk || !!state.beats[id + '/' + sub]) : (sub === 'nho' ? !!state.answers[id]?.correct : touched);
    setBar(`<button class="btn flat" id="prev" data-go ${prevHash ? '' : 'disabled'}>◀ Trước</button><div class="mid"><div class="dots">${pages.map((p, i) => `<a class="dt" href="${lessonHash(l, p)}" title="${e(pageLab(l, p)[1])}"><i class="${i === pi ? 'cur' : ''} ${pgDone(p, i) ? 'done' : ''}"></i></a>`).join('')}</div><span class="sign">${SIGN}</span></div><button class="copy" id="copy" title="Sao chép link màn này" aria-label="Sao chép link màn này">📋</button><button class="btn ${dn ? 'primary' : ''}" id="next" data-go>${lastPg ? (endMod ? '🃏 Chốt chương ▶' : 'Bài tiếp ▶') : 'Tiếp ▶'}</button>`);
    $('#prev').onclick = goPrev; $('#next').onclick = goNext; $('#copy').onclick = copyLink;
  };
  const goPrev = () => { if (prevHash) { sound('page'); go(prevHash); } };
  const goNext = () => {
    sound('page'); go(nextHash);
  };
  window.__next = goNext; window.__prev = goPrev;
  setView('lesson-mode', m.color, `${MODICON[m.id]} ${m.short} · ${pos}/${ls.length} · ${pageLab(l, sub)[1]}`, ((pos - 1) + (pi + 1) / pages.length) / ls.length * 100); renderRail();
  const stepsHtml = () => `<ol class="bsteps" id="bsteps" aria-label="Các trang của bài này — bấm để nhảy">${pages.map((p, i) => { const dn = pgDone(p, i); return `<li class="${i === pi ? 'cur' : ''} ${dn ? 'done' : ''}"><a href="${lessonHash(l, p)}" title="${e(p === 'nho' ? 'Thử nhớ' : pageLab(l, p)[1])}${dn ? ' · xong' : ''}"><i>${dn ? '✓' : p === 'nho' ? '🧠' : i + 1}</i>${i === pi ? `<span>${e(p === 'nho' ? 'Thử nhớ' : pageLab(l, p)[1])}</span>` : ''}</a></li>`; }).join('')}</ol>`;
  const head = isBeat || (sub === 'nho' && BEATS()[id]) ? `<div class="head bhead"><div class="ttl"><small>📖 ${e(l.title)} · ${pi + 1}/${pages.length}</small><h1><mark>${e(isBeat ? pageLab(l, sub)[1] : 'Thử nhớ')}</mark></h1></div>${stepsHtml()}<button class="pin" id="bookmark" title="Ghim để ôn lại" aria-label="Ghim màn để ôn lại">${state.bookmarks.includes(id) ? '📌' : '📍'}</button></div>`
    : `<div class="head"><h1 class="ttl"><mark>${e(l.title)}</mark></h1><ol class="stp" aria-label="Các trang của bài này">${pages.map((p, i) => `<li class="${i === pi ? 'cur' : i < pi ? 'done' : ''}">${PAGE[p][0]} ${PAGE[p][1]}</li>`).join('')}</ol>${sub === 'hieu' ? `<button class="howto-open" id="how-open" ${hideHow ? '' : 'hidden'}>📝 Cách học</button>` : ''}<button class="pin" id="bookmark" title="Ghim để ôn lại" aria-label="Ghim màn để ôn lại">${state.bookmarks.includes(id) ? '📌' : '📍'}</button></div>`;
  const wireCommon = () => {
    $('#bookmark').onclick = () => { if (state.bookmarks.includes(id)) state.bookmarks = state.bookmarks.filter(x => x !== id); else state.bookmarks.push(id); save(); $('#bookmark').textContent = state.bookmarks.includes(id) ? '📌' : '📍'; sound('pop'); toast(state.bookmarks.includes(id) ? 'Đã ghim màn này để ôn 📌' : 'Đã bỏ ghim'); };
  };

  // ── trang Y4 sâu / Hình thầy / Thử nhớ: trang đầy đủ, mọi thứ hiện sẵn
  // ── trang tí hon: hình to + 1 việc để làm + 1 câu (không ô số, không khối chữ)
  if (isBeat) {
    const bt = BEATS()[id][pi], kit = ZS.kits[bt.kit], S = Object.assign({}, kit.init(bt)), chain = window.ZS.chains?.[id + '/b' + (pi + 1)];
    const ok = () => (bt.goal || kit.goal)?.(S, bt);
    const bkey = id + '/' + sub; beatOk = !!state.beats[bkey]; let demoOn = false;
    const syncDone = () => { const on = !!state.beats[bkey], b = $('#donebtn'); if (b) { b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '✓ Xong' : '○ Xong?'; }
      const li = $('#bsteps li.cur'); if (li) { li.classList.toggle('done', on); const ic = li.querySelector('i'); if (ic) ic.textContent = on ? '✓' : String(pi + 1); } };
    const solvedTxt = () => { try { return kit.say(ZS.solve(kit, bt, l), bt, l)[1]; } catch (err) { return ''; } };
    const wordsOf = t => String(t).replace(/\*\*/g, '').toLowerCase().match(/[\p{L}\d]+/gu) || [];
    const redundant = (ch, txt) => { const have = new Set(ch.flatMap(wordsOf)), w = wordsOf(txt); return !w.length || w.filter(x => have.has(x)).length / w.length >= .74; };
    const ahaKey = id + '/' + pi; let ahaTxt = ahaCache[ahaKey] || (ahaCache[ahaKey] = solvedTxt());
    const chainHtml = ch => ch.map((t, i) => `<div class="cn c${i}"><em>${['👀 Thấy', '⚙️ Vì', '✅ Nên'][i]}</em><span>${gl(md(t))}</span></div>`).join('<div class="ar" aria-hidden="true">▼</div>');
    const lockHtml = '<div class="cn lk"><em>👀 Thấy</em><span></span></div><div class="ar" aria-hidden="true">▼</div><div class="cn lk"><em>⚙️ Vì</em><span></span></div><div class="ar" aria-hidden="true">▼</div><div class="cn lk"><em>✅ Nên</em><span></span></div>';
    // chỉ tay 👆 đúng chỗ cần làm: chỗ chạm đầu tiên trong hình, hoặc điều khiển đầu tiên trên thanh
    const aimHand = () => { const fig = $('.fig'), hand = $('.fig>.coach'); if (!fig || !hand) return; if (beatOk || S._k) { hand.remove(); return; } const t = $('#art .tap, #art [data-scrub], #art [data-drag]') || $('#sim button, #sim input'); if (!t) return;
      const fr = fig.getBoundingClientRect(), r = t.getBoundingClientRect(); hand.style.right = 'auto'; hand.style.top = 'auto'; hand.style.left = clamp(r.left - fr.left + r.width * .5 - 6, 8, fr.width - 40) + 'px'; hand.style.bottom = clamp(fr.bottom - r.top - r.height * .45 - 4, 6, fr.height - 36) + 'px'; };
    const paint = bump => {
      const body = kit.draw(S, bt, l), sp = splitAt(body);
      // điện thoại: tách hình chính và bảng kết quả bên phải thành 2 khối xếp dọc để chữ trong hình đủ to
      $('#art').innerHTML = sp ? `<svg class="sp1" viewBox="14 14 ${sp - 18} 326" role="img" aria-label="${e(bt.t)}">${ZS.defs}${body}</svg><svg class="sp2" viewBox="${sp - 2} 14 ${556 - sp} 326" aria-hidden="true">${ZS.defs}${body}</svg>`
        : `<svg viewBox="${(innerWidth <= 700 && kit.vbPhone) || '0 0 560 350'}" role="img" aria-label="${e(bt.t)}">${ZS.defs}${body}</svg>`;
      let [mood, text] = kit.say(S, bt, l); const done = beatOk || !!ok();
      if (done) { if (!ahaTxt) ahaTxt = ahaCache[ahaKey] = text; mood = 'wow'; text = ok() ? rand(['Làm được rồi! ✓ Đọc **À ra vậy** bên dưới 👇', 'Chuẩn! ✓ Xem **À ra vậy** bên dưới 👇', 'Xong! ✓ Nối **nguyên nhân → kết quả** bên dưới 👇']) : 'Bạn đã xong trang này ✓ Thử lại bất cứ lúc nào, hoặc đọc **À ra vậy** 👇'; }
      $('#mas').innerHTML = mascot(mood); const b = $('#bub'); b.innerHTML = gl(md(text));
      $('#todo').className = 'todo' + (done ? ' done' : ''); $('#todo').textContent = done ? '✅ Xong việc' : '👆 Việc của bạn';
      const aha = $('#aha'); const was = aha.classList.contains('open'); aha.classList.toggle('open', done); aha.classList.toggle('locked', !done);
      $('#chain').innerHTML = done && chain ? chainHtml(chain) : lockHtml;
      $('#detail').innerHTML = done ? (chain ? (redundant(chain, ahaTxt) ? '' : '<small>📌 Ghi nhớ thêm</small>' + gl(md(ahaTxt))) : gl(md(ahaTxt))) : '<span class="lockmsg">🔒 Làm xong việc trên hình để mở</span>';
      if (done && !was) { aha.classList.remove('pop'); void aha.offsetWidth; aha.classList.add('pop'); if (innerWidth <= 900) setTimeout(() => aha.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 250); }
      if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
      requestAnimationFrame(aimHand);
    };
    const sim = () => { const cs = kit.ui(S, bt); $('#sim').hidden = !cs.length; $('#sim').innerHTML = cs.map((c, i) => ctlHtml(c, i, S)).join(''); requestAnimationFrame(() => { $('.fig')?.style.setProperty('--simh', (cs.length ? $('#sim').offsetHeight : 0) + 'px'); aimHand(); }); };
    $('#stage').innerHTML = `<article class="lesson tihon">${head}<div class="bscene"><figure class="fig"><button class="done-tag ${state.beats[bkey] ? 'on' : ''}" id="donebtn" type="button" aria-pressed="${!!state.beats[bkey]}" title="Huy hiệu xong — bấm để tự đánh dấu / bỏ đánh dấu">${state.beats[bkey] ? '✓ Xong' : '○ Xong?'}</button><div class="sim" id="sim"></div><div class="artw enter"><div id="art"></div></div><button class="zoom" id="zoom-fig" aria-label="Phóng to hình">⤢</button><span class="coach">👆</span></figure><div class="bside"><div class="task"><div class="trow"><b class="todo" id="todo">👆 Việc của bạn</b><button class="demo" id="demo" type="button" title="Xem bàn tay ma làm mẫu">▶ Xem mẫu</button></div><div class="say"><div id="mas"></div><div class="bub" id="bub" aria-live="polite"></div></div></div><section class="aha locked" id="aha" aria-live="polite"><h3>💡 À ra vậy</h3><div class="chain" id="chain"></div><p class="detail" id="detail"></p></section>${bt.cr ? `<p class="credit">🖼 ${bt.cr}</p>` : ''}</div></div></article>`;
    // ▶ Xem mẫu: bàn tay ma làm đúng chuỗi thao tác ngắn nhất tới đích (kế hoạch do ZS.plan tìm sẵn)
    let demoT = []; const later = (fn, ms) => demoT.push(setTimeout(fn, ms));
    const stopDemo = () => { demoT.forEach(clearTimeout); demoT = []; demoOn = false; cancelAnimationFrame(demoRaf); $('#demohand')?.remove(); const b = $('#demo'); if (b) { b.textContent = '▶ Xem mẫu'; b.classList.remove('on'); } };
    let demoRaf = 0; window.__stopDemo = stopDemo;
    const hand = () => { let h = $('#demohand'); if (!h) { h = document.createElement('span'); h.id = 'demohand'; h.className = 'demohand'; h.textContent = '👆'; $('.fig').appendChild(h); } return h; };
    const aim = (el, fx = .5, fy = .5) => { const h = hand(), fr = $('.fig').getBoundingClientRect(), r = el.getBoundingClientRect(); h.style.left = clamp(r.left - fr.left + r.width * fx - 8, 4, fr.width - 34) + 'px'; h.style.top = clamp(r.top - fr.top + r.height * fy - 4, 4, fr.height - 34) + 'px'; };
    const runStep = st => {
      if (st.t === 'tap') { const el = $('#art [data-set="' + st.raw + '"]'); if (!el) return 0; const r = el.querySelector('ellipse,rect,circle,path') || el; aim(r); later(() => { hand().classList.add('press'); later(() => { hand().classList.remove('press'); el.isConnected && el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, 220); }, 650); return 1100; }
      if (st.t === 'range') { const el = $('#sim input[data-r="' + st.k + '"]'); if (!el) return 0; const mn = +el.min, mx = +el.max, from = +el.value, to = st.v, fr0 = el.getBoundingClientRect();
        const thumb = v => ({ getBoundingClientRect: () => { const r = el.getBoundingClientRect(); return { left: r.left + (v - mn) / (mx - mn || 1) * r.width, top: r.top, width: 0, height: r.height }; } });
        aim(thumb(from), 0, .5); later(() => { const t0 = performance.now(), dur = 1100; const tick = now => { const k = clamp((now - t0) / dur, 0, 1), e2 = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, v = Math.round((from + (to - from) * e2) / (+el.step || 1)) * (+el.step || 1); const cur = $('#sim input[data-r="' + st.k + '"]'); if (!cur) return; aim(thumb(v), 0, .5); if (+cur.value !== v) { cur.value = v; cur.dispatchEvent(new Event('input', { bubbles: true })); } if (k < 1) demoRaf = requestAnimationFrame(tick); }; demoRaf = requestAnimationFrame(tick); }, 600); return 1900; }
      if (st.t === 'scrub' || st.t === 'drag') { const art = $('#art'), q = st.t === 'scrub' ? '[data-scrub^="' + st.k + ':"]' : '[data-drag^="' + st.k + ':"]', el = art.querySelector(q); if (!el) return 0;
        const svg = el.ownerSVGElement, toClient = (x, y) => { const pt = svg.createSVGPoint(); pt.x = x; pt.y = y; const c = pt.matrixTransform(svg.getScreenCTM()); return [c.x, c.y]; }, r0 = el.getBoundingClientRect(), sx = r0.left + r0.width / 2, sy = r0.top + r0.height / 2;
        const ev = (type, x, y) => art.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 77, clientX: x, clientY: y }));
        const Hh = hand(); aim({ getBoundingClientRect: () => ({ left: sx, top: sy, width: 0, height: 0 }) }, 0, 0);
        later(() => { el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 77, clientX: sx, clientY: sy })); const t0 = performance.now(), dur = 1100;
          let tx, ty; if (st.t === 'scrub') { const mn = +el.dataset.scrub.split(':')[1], mx = +el.dataset.scrub.split(':')[2], st0 = +el.dataset.scrub.split(':')[3] || 1, cur = +S[st.k] || 0; tx = sx + (st.v - cur) / st0 * 7; ty = sy; } else { [tx, ty] = toClient(st.x, st.y); }
          const tick = now => { const k = clamp((now - t0) / dur, 0, 1), e2 = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, cx = sx + (tx - sx) * e2, cy = sy + (ty - sy) * e2; aim({ getBoundingClientRect: () => ({ left: cx, top: cy, width: 0, height: 0 }) }, 0, 0); ev('pointermove', cx, cy); if (k < 1) demoRaf = requestAnimationFrame(tick); else ev('pointerup', cx, cy); }; demoRaf = requestAnimationFrame(tick); }, 600); return 1900; }
      const q = st.t === 'tog' ? '#sim [data-tog="' + st.k + '"]' : st.t === 'seg' ? '#sim [data-seg="' + st.k + '"][data-v="' + st.v + '"]' : '#sim [data-btn="' + st.k + '"][data-v="' + st.v + '"]'; const el = $(q); if (!el) return 0;
      if (st.t === 'tog' && (el.getAttribute('aria-pressed') === 'true') === !!st.v) return 0; aim(el); later(() => { hand().classList.add('press'); later(() => { hand().classList.remove('press'); el.isConnected && el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, 220); }, 650); return 1100;
    };
    $('#demo').onclick = () => {
      if (demoOn) { stopDemo(); return; }
      const steps = ZS.plan(kit, bt, l); if (!steps.length) { toast('Trang này tự làm là nhanh nhất 👆'); return; }
      stopDemo(); demoOn = true; $('.fig>.coach')?.remove(); const b = $('#demo'); b.textContent = '⏹ Dừng'; b.classList.add('on');
      Object.keys(S).forEach(k => delete S[k]); Object.assign(S, kit.init(bt)); beatOk = false; sim(); paint(); sound('pop');
      let t = 500; steps.forEach(st => { later(() => { const d = runStep(st); if (!d) return; }, t); t += (st.t === 'range' ? 1900 : 1100) + 650; });
      later(() => { stopDemo(); toast('Giờ tới lượt bạn thử lại nha 👆'); }, t + 600);
    };
    ['pointerdown', 'keydown'].forEach(ev => $('#art').addEventListener(ev, () => { if (demoOn) stopDemo(); }));
    sim(); paint(); bar(); wireCommon();
    wireSim(S, (k, v) => { const p = Object.assign({}, S); delete p._p; S._p = p; S._k = k; S[k] = v; kit.after?.(S, k, bt); }, (k, ev, slide) => {
      if (!slide) sim(); const was = beatOk; if (!(bt.goal || kit.goal)) beatOk = true; else if (ok()) beatOk = true;
      const [mood] = kit.say(S, bt, l); paint(true);
      if (beatOk && !was) { if (!demoOn && !state.beats[bkey]) { state.beats[bkey] = true; save(); syncDone(); } sound('chime'); burst(ev.target.closest('svg,button') || $('#art')); bar(); } else if (!slide) sound(ev.target.closest('.tg,.sg,.chip') ? 'click' : mood === 'ouch' || mood === 'sad' ? 'buzz' : 'pop');
    });
    $('#zoom-fig').onclick = () => openZoom($('#art').innerHTML, bt.t);
    $('#donebtn').onclick = () => { if (state.beats[bkey]) { delete state.beats[bkey]; beatOk = !!ok(); } else { state.beats[bkey] = true; beatOk = true; sound('chime'); } save(); syncDone(); paint(); bar(); };
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
let oStep = 0, oCase = '', oHidden = new Set(), oMode = 'steps';
function caseProgress(c) { const { total } = stepsFor(c); return total ? Math.round((state.rubrics[c.id] || []).length / total * 100) : 0; }
function renderOSCE() {
  const cases = window.OSCE_CASES || [], by = k => cases.filter(c => (ST[c.id]?.kind || 'cc') === k);
  const card = c => {
    const cf = ST[c.id] || { icon: '🩺' }, ans = arr(getAnswer(c)).length, pr = caseProgress(c);
    const topLabel = c.topic === 'nbn' ? 'Nhau bong non' : c.topic === 'ntd' ? 'Nhau tiền đạo' : 'TOLAC / Mổ cũ';
    const topBadge = c.topic === 'nbn' ? 'butter' : c.topic === 'ntd' ? 'lavender' : 'mint';
    return `<a class="st-card" href="#/case/${e(c.id)}">
      <span class="st-ic">${cf.icon}</span>
      <span class="st-body">
        <b>${e(c.title)}</b>
        <small>${e(c.source?.examLabel || 'Trạm OSCE')} · ⏱️ 5 phút</small>
        <span class="st-tags">
          <i style="background:var(--${topBadge});color:var(--ink)">${topLabel}</i>
          <i class="${ans ? 'ok' : ''}">${ans ? '✓ có đáp án nguồn' : 'chưa có đáp án riêng'}</i>
          ${pr ? `<i class="pr">tự chấm ${pr}%</i>` : ''}
        </span>
      </span>
      <span class="st-go">▶</span>
    </a>`;
  };
  $('#stage').innerHTML = `<section class="o-hero">
    <div>${mascot('happy', 'mas')}</div>
    <div>
      <h1>Phòng Thi Mô Phỏng OSCE Sản Khoa 🩺</h1>
      <p>Mô phỏng trạm thi 5 phút chuẩn Y4 ĐHYD: <b>Bản đồ tư duy logic ➔ Thi thử toàn trạm với Pacing Bar & Rubric 10đ ➔ Kịch bản lời nói mẫu thực chiến</b>.</p>
      <div class="go">
        <a class="btn primary" href="#/osce/guide">📘 4 Trụ Cột Chấm Điểm Rubric</a>
        <a class="btn pink" href="#/case/${e((cases[Math.floor(Math.random() * cases.length)] || {}).id || '')}">🎲 Bốc Trạm Thi Ngẫu Nhiên</a>
      </div>
    </div>
  </section>
  <div style="background:#fff;border:1.4px solid var(--c-d);border-radius:20px;padding:14px 18px;margin:12px 0;box-shadow:0 2px 10px rgba(74,63,99,.06)">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span style="font-size:20px">🧭</span>
      <b style="font:800 15px var(--disp);color:var(--ink)">QUY TẮC PHÒNG THI 5 PHÚT (TIME-PACING CHO SINH VIÊN Y4):</b>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;font-size:12.5px;font-weight:700">
      <div style="background:#eff6ff;padding:8px 10px;border-radius:12px;border:1px solid #bfdbfe"><b style="color:#1d4ed8">0:00 – 0:30 (Đọc đề):</b> Bắt 5 neo (Tuổi thai, Triệu chứng, Sinh hiệu, Tim thai, Yêu cầu)</div>
      <div style="background:#fee2e2;padding:8px 10px;border-radius:12px;border:1px solid #fecaca"><b style="color:#b91c1c">0:30 – 1:30 (Vào trạm):</b> LA TO BÁO ĐỘNG ĐỎ, 2 kim 18G, mắc monitor, lấy máu</div>
      <div style="background:#fffbeb;padding:8px 10px;border-radius:12px;border:1px solid #fde68a"><b style="color:#b45309">1:30 – 2:30 (CTG & Chẩn đoán):</b> Đọc nhịp giảm muộn/tăng trương lực + Nêu lý do từ đề</div>
      <div style="background:#f0fdf4;padding:8px 10px;border-radius:12px;border:1px solid #bbf7d0"><b style="color:#15803d">2:30 – 4:30 (CLS & Xử trí 3 làn):</b> CTM/Đông máu có Fibrinogen + Mổ khẩn/Sinh ngả + Sơ sinh</div>
      <div style="background:#faf5ff;padding:8px 10px;border-radius:12px;border:1px solid #e9d5ff"><b style="color:#6b21a8">4:30 – 5:00 (Tư vấn):</b> Lời đời thường, dặn dò 3 dấu hiệu nguy hiểm + Teach-back</div>
    </div>
  </div>
  <h2 class="o-h">🚨 Trạm Cấp Cứu Sản Khoa <small>${by('cc').length} trạm · nói to, phản xạ thần tốc, làm ngay</small></h2>
  <div class="st-grid">${by('cc').map(card).join('')}</div>
  <h2 class="o-h">💬 Trạm Tư Vấn Tiền Sản & Mổ Cũ <small>${by('tv').length} trạm · hỏi bệnh, cân bằng lợi ích & nguy cơ</small></h2>
  <div class="st-grid">${by('tv').map(card).join('')}</div>
  <p class="status-note" style="margin-top:14px">Đề là bản nhớ lại của sinh viên ĐHYD TP.HCM, ghi rõ nguồn. Phần gợi ý bám sát giáo trình UMP và Rubric Bộ môn Sản. <a href="#/sources/rubric">Xem rubric gốc ↗</a></p>`;
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

function renderOsceScene(c, st, oStep, cf) {
  const top = cf.topic, kind = cf.kind;
  let s = `<div class="osce-viz" style="margin-bottom:12px;border-radius:18px;overflow:hidden;border:1.2px solid var(--c-d);background:#fff;box-shadow:0 2px 10px rgba(74,63,99,.06)"><svg viewBox="0 0 560 210" style="width:100%;height:auto;display:block" role="img" aria-label="Mô phỏng trạm OSCE">`;
  s += `<defs><linearGradient id="gOcHeader" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#4a3f63"/><stop offset="100%" stop-color="#7c6f96"/></linearGradient></defs>`;
  s += `<rect width="560" height="210" fill="#faf8fd"/>`;
  s += `<rect width="560" height="34" fill="url(#gOcHeader)"/>`;
  s += `<text x="18" y="22" fill="#fff" font-family="Outfit, sans-serif" font-size="13" font-weight="800" letter-spacing=".5px">TRẠM THI MÔ PHỎNG LÂM SÀNG · BƯỚC ${oStep + 1}: ${e(st.t).toUpperCase()}</text>`;
  s += `<text x="542" y="22" text-anchor="end" fill="#fde68a" font-family="Outfit, sans-serif" font-size="12" font-weight="700">${kind === 'cc' ? '🚨 CẤP CỨU' : '💬 TƯ VẤN'}</text>`;

  if (st.id === 'read') {
    const f1 = cf.facts[0] || ['Sản phụ', 'Chưa rõ'], f2 = cf.facts[1] || ['Triệu chứng', 'Theo dõi'], f3 = cf.facts[2] || ['Sinh hiệu', 'Ổn'], f4 = cf.facts[3] || ['Mục tiêu', 'Xử trí'];
    const cards = [
      ['👤 ' + f1[0], f1[1], 18, '#3b82f6', '#eff6ff'],
      ['⚡ ' + f2[0], f2[1], 152, '#ef4444', '#fef2f2'],
      ['📊 ' + f3[0], f3[1], 286, '#f59e0b', '#fffbeb'],
      ['🎯 ' + f4[0], f4[1], 420, '#10b981', '#f0fdf4']
    ];
    cards.forEach(([hd, val, x, col, bg]) => {
      s += `<rect x="${x}" y="46" width="122" height="150" rx="14" fill="${bg}" stroke="${col}" stroke-width="1.3"/>`;
      s += `<rect x="${x}" y="46" width="122" height="28" rx="14" fill="${col}" opacity=".15"/>`;
      s += `<text x="${x + 8}" y="65" fill="${col}" font-family="Outfit, sans-serif" font-size="11.5" font-weight="800">${e(hd.slice(0, 15))}</text>`;
      const words = val.split(' ');
      let line = '', ly = 92;
      for (let w of words) {
        if ((line + ' ' + w).length > 15) {
          s += `<text x="${x + 8}" y="${ly}" fill="#1e293b" font-family="system-ui, sans-serif" font-size="11" font-weight="600">${e(line)}</text>`;
          line = w; ly += 16; if (ly > 185) break;
        } else { line = line ? line + ' ' + w : w; }
      }
      if (line && ly <= 185) s += `<text x="${x + 8}" y="${ly}" fill="#1e293b" font-family="system-ui, sans-serif" font-size="11" font-weight="600">${e(line)}</text>`;
    });
  } else if (st.id === 'enter' || st.id === 'open') {
    if (kind === 'cc') {
      s += `<rect x="20" y="46" width="160" height="150" rx="14" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>`;
      s += `<text x="100" y="72" text-anchor="middle" font-size="28">🗣️</text><text x="100" y="96" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" font-weight="800" fill="#991b1b">MŨI 1: BÁC SĨ</text><text x="100" y="118" text-anchor="middle" font-size="11" font-weight="700" fill="#7f1d1d">LA TO GỌI HỖ TRỢ</text><text x="100" y="136" text-anchor="middle" font-size="10.5" fill="#555">Phân công kíp trực</text><text x="100" y="152" text-anchor="middle" font-size="10.5" fill="#555">Báo phòng mổ cấp cứu</text><text x="100" y="172" text-anchor="middle" font-size="10" font-weight="700" fill="#dc2626">✓ THỂ HIỆN KHẨN TRƯƠNG</text>`;

      s += `<rect x="200" y="46" width="160" height="150" rx="14" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>`;
      s += `<text x="280" y="72" text-anchor="middle" font-size="28">🩸</text><text x="280" y="96" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" font-weight="800" fill="#0369a1">MŨI 2: ĐIỀU DƯỠNG</text><text x="280" y="118" text-anchor="middle" font-size="11" font-weight="700" fill="#075985">2 ĐƯỜNG TRUYỀN LỚN</text><text x="280" y="136" text-anchor="middle" font-size="10.5" fill="#555">Kim 16–18G + dịch ấm</text><text x="280" y="152" text-anchor="middle" font-size="10.5" fill="#555">Lấy máu xét nghiệm khẩn</text><text x="280" y="172" text-anchor="middle" font-size="10" font-weight="700" fill="#0284c7">✓ BÁO NGÂN HÀNG MÁU</text>`;

      s += `<rect x="380" y="46" width="160" height="150" rx="14" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>`;
      s += `<text x="460" y="72" text-anchor="middle" font-size="28">📈</text><text x="460" y="96" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" font-weight="800" fill="#b45309">MŨI 3: MONITOR</text><text x="460" y="118" text-anchor="middle" font-size="11" font-weight="700" fill="#92400e">THEO DÕI LIÊN TỤC</text><text x="460" y="136" text-anchor="middle" font-size="10.5" fill="#555">Mắc monitor sinh hiệu mẹ</text><text x="460" y="152" text-anchor="middle" font-size="10.5" fill="#555">Monitoring tim thai & cơn gò</text><text x="460" y="172" text-anchor="middle" font-size="10" font-weight="700" fill="#d97706">✓ ĐÁNH GIÁ TRI GIÁC</text>`;
    } else {
      s += `<rect x="30" y="50" width="500" height="142" rx="16" fill="#fdfbff" stroke="#a855f7" stroke-width="1.4"/>`;
      s += `<text x="280" y="74" text-anchor="middle" font-family="Outfit, sans-serif" font-size="14" font-weight="800" fill="#6b21a8">GIAO TIẾP TƯ VẤN 2 CHIỀU ĐỒNG THUẬN (SHARED DECISION)</text>`;
      s += `<g transform="translate(60 88)"><circle cx="30" cy="30" r="26" fill="#f3e8ff" stroke="#a855f7" stroke-width="1.5"/><text x="30" y="38" text-anchor="middle" font-size="24">👩‍⚕️</text><text x="30" y="72" text-anchor="middle" font-size="11" font-weight="700">Bác sĩ</text></g>`;
      s += `<path d="M130 118 H200" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="4 3"/>`;
      s += `<g transform="translate(205 92)"><rect width="150" height="52" rx="10" fill="#fff" stroke="#c084fc" stroke-width="1.2"/><text x="75" y="18" text-anchor="middle" font-size="10.5" font-weight="700" fill="#4a044e">1. Chào hỏi thân thiện</text><text x="75" y="33" text-anchor="middle" font-size="10.5" font-weight="700" fill="#4a044e">2. Xác nhận tên & tuổi</text><text x="75" y="47" text-anchor="middle" font-size="10" fill="#701a75">3. Lắng nghe lý do đến</text></g>`;
      s += `<path d="M360 118 H430" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="4 3"/>`;
      s += `<g transform="translate(435 88)"><circle cx="30" cy="30" r="26" fill="#fdf2f8" stroke="#ec4899" stroke-width="1.5"/><text x="30" y="38" text-anchor="middle" font-size="24">🤰</text><text x="30" y="72" text-anchor="middle" font-size="11" font-weight="700">Sản phụ</text></g>`;
    }
  } else if (st.id === 'assess' || st.id === 'history') {
    if (top === 'nbn') {
      s += `<rect x="20" y="46" width="250" height="150" rx="14" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>`;
      s += `<text x="34" y="68" fill="#38bdf8" font-family="Outfit, monospace" font-size="12" font-weight="700">PATIENT MONITOR</text>`;
      s += `<text x="34" y="96" fill="#ef4444" font-family="monospace" font-size="20" font-weight="800">HR: 115 <tspan font-size="11">bpm (nhanh)</tspan></text>`;
      s += `<text x="34" y="122" fill="#22c55e" font-family="monospace" font-size="18" font-weight="800">BP: 105/65 <tspan font-size="11">mmHg</tspan></text>`;
      s += `<text x="34" y="146" fill="#eab308" font-family="monospace" font-size="16" font-weight="800">SI = HR÷HATT = 1.09</text>`;
      s += `<rect x="34" y="156" width="222" height="26" rx="6" fill="#7f1d1d"/><text x="145" y="173" text-anchor="middle" fill="#fecaca" font-size="11" font-weight="800">⚠️ BÁO ĐỘNG SỐC TIỀM TẨN</text>`;

      s += `<rect x="286" y="46" width="254" height="150" rx="14" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>`;
      s += `<text x="413" y="68" text-anchor="middle" fill="#991b1b" font-family="Outfit, sans-serif" font-size="12" font-weight="800">BĂNG GHI CTG: CƯỜNG TÍNH</text>`;
      s += `<path d="M300 90 Q340 85 360 115 T420 120 T460 90 T520 88" fill="none" stroke="#dc2626" stroke-width="2.5"/>`;
      s += `<text x="413" y="112" text-anchor="middle" fill="#dc2626" font-size="10.5" font-weight="700">Nhịp giảm muộn sâu (Late decel)</text>`;
      s += `<path d="M300 160 Q330 135 360 160 Q390 135 420 160 Q450 135 480 160 Q500 145 520 160" fill="none" stroke="#7f1d1d" stroke-width="2.5"/>`;
      s += `<text x="413" y="178" text-anchor="middle" fill="#7f1d1d" font-size="10" font-weight="800">Cơn co dồn dập · Trương lực nền tăng cao</text>`;
    } else if (top === 'ntd') {
      s += `<rect x="20" y="46" width="250" height="150" rx="14" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>`;
      s += `<text x="145" y="70" text-anchor="middle" fill="#15803d" font-family="Outfit, sans-serif" font-size="13" font-weight="800">KHÁM MỎ VỊT AN TOÀN</text>`;
      s += `<path d="M70 120 C100 100 170 100 210 120" stroke="#16a34a" stroke-width="5" fill="none"/>`;
      s += `<circle cx="145" cy="118" r="16" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>`;
      s += `<circle cx="145" cy="118" r="5" fill="#7f1d1d"/>`;
      s += `<text x="145" y="152" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">Mỏ vịt bộc lộ cổ tử cung</text>`;
      s += `<text x="145" y="172" text-anchor="middle" font-size="10.5" fill="#15803d">Máu đỏ tươi từ lỗ CTC, cùng đồ mềm</text>`;

      s += `<rect x="286" y="46" width="254" height="150" rx="14" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>`;
      s += `<circle cx="413" cy="100" r="32" fill="#fff" stroke="#dc2626" stroke-width="3"/>`;
      s += `<text x="413" y="108" text-anchor="middle" font-size="32">✋</text>`;
      s += `<line x1="390" y1="80" x2="436" y2="120" stroke="#dc2626" stroke-width="4"/>`;
      s += `<text x="413" y="152" text-anchor="middle" fill="#991b1b" font-family="Outfit, sans-serif" font-size="12.5" font-weight="800">CẤM THĂM KHÁM NGÓN TAY!</text>`;
      s += `<text x="413" y="172" text-anchor="middle" fill="#b91c1c" font-size="10.5" font-weight="600">Nguy cơ chọc thủng bánh nhau gây tử vong</text>`;
    } else {
      s += `<rect x="20" y="46" width="520" height="150" rx="14" fill="#fff" stroke="#0284c7" stroke-width="1.4"/>`;
      s += `<text x="280" y="70" text-anchor="middle" fill="#0369a1" font-family="Outfit, sans-serif" font-size="13" font-weight="800">4 MỤC KHAI THÁC QUAN TRỌNG KHI CÓ SẸO MỔ LẤY THAI CŨ</text>`;
      const items = [
        ['1. LÝ DO MỔ CŨ', 'Ngôi mông / thai suy / chuyển dạ ngưng tiến? Có tái diễn không?'],
        ['2. ĐƯỜNG RẠCH TỬ CUNG', 'Sẹo ngang đoạn dưới? XIN GIẤY RA VIỆN / BIÊN BẢN MỔ!'],
        ['3. KHOẢNG CÁCH LẦN SINH', 'Khoảng cách > 18–24 tháng an toàn hơn cho sẹo mổ'],
        ['4. THAI KỲ HIỆN TẠI', 'Ngôi chỏm, con ước <3500g, nhau không che lỗ trong, mẹ ổn']
      ];
      items.forEach(([a, b], i) => {
        const y = 92 + i * 26;
        s += `<rect x="36" y="${y - 14}" width="488" height="22" rx="6" fill="${i === 1 ? '#ffedd5' : '#f0f9ff'}"/>`;
        s += `<text x="46" y="${y}" fill="${i === 1 ? '#c2410c' : '#0369a1'}" font-family="Outfit, sans-serif" font-size="11.5" font-weight="800">${a}:</text>`;
        s += `<text x="210" y="${y}" fill="#334155" font-size="11" font-weight="600">${b}</text>`;
      });
    }
  } else if (st.id === 'dx' || st.id === 'analyze') {
    if (top === 'nbn') {
      s += `<text x="280" y="65" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" font-weight="800" fill="#991b1b">CHUỖI SINH LÝ BỆNH: NHAU BONG NON ➔ DIC</text>`;
      const chain = ['Khối máu tụ sau nhau', 'Bóc tách gai nhau', 'Mất trao đổi Oxy', 'Tim thai chậm cấp', 'DIC / Tiêu thụ Fibrinogen'];
      chain.forEach((txt, i) => {
        const x = 20 + i * 105;
        s += `<rect x="${x}" y="85" width="98" height="85" rx="12" fill="${i === 4 ? '#fee2e2' : '#f8fafc'}" stroke="${i === 4 ? '#dc2626' : '#94a3b8'}" stroke-width="${i === 4 ? 2 : 1.2}"/>`;
        s += `<text x="${x + 49}" y="115" text-anchor="middle" font-size="18">${['🩸', '💥', '🫁', '📉', '🚨'][i]}</text>`;
        s += `<text x="${x + 49}" y="138" text-anchor="middle" font-family="Outfit, sans-serif" font-size="10" font-weight="700" fill="#1e293b">${txt.split(' ')[0]}</text>`;
        s += `<text x="${x + 49}" y="152" text-anchor="middle" font-size="9" fill="#64748b">${txt.split(' ').slice(1).join(' ')}</text>`;
      });
    } else if (top === 'ntd') {
      s += `<rect x="30" y="50" width="500" height="142" rx="16" fill="#fff" stroke="#f59e0b" stroke-width="1.4"/>`;
      s += `<text x="280" y="74" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13.5" font-weight="800" fill="#b45309">CƠ CHẾ CHẢY MÁU TRONG NHAU TIỀN ĐẠO</text>`;
      s += `<path d="M120 160 C150 90 230 90 260 160" stroke="#f59e0b" stroke-width="4" fill="none"/>`;
      s += `<rect x="160" y="145" width="60" height="18" rx="6" fill="#ef4444"/><text x="190" y="158" text-anchor="middle" fill="#fff" font-size="10" font-weight="800">Nhau che CTC</text>`;
      s += `<text x="370" y="105" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1e293b">Đoạn dưới tử cung kéo dài & dãn mỏng</text>`;
      s += `<text x="370" y="125" text-anchor="middle" font-size="11.5" font-weight="700" fill="#dc2626">➔ Bánh nhau không co giãn bị trượt bóc tách</text>`;
      s += `<text x="370" y="145" text-anchor="middle" font-size="11" fill="#475569">➔ Đứt các xoang mạch diện bám ➔ Máu đỏ tươi không đau</text>`;
    } else {
      s += `<rect x="20" y="46" width="250" height="150" rx="14" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.4"/>`;
      s += `<text x="145" y="72" text-anchor="middle" fill="#15803d" font-family="Outfit, sans-serif" font-size="13" font-weight="800">✓ ĐIỀU KIỆN THUẬN LỢI TOLAC</text>`;
      s += `<text x="34" y="96" fill="#166534" font-size="11" font-weight="700">• 1 lần mổ ngang đoạn dưới</text>`;
      s += `<text x="34" y="116" fill="#166534" font-size="11" font-weight="700">• Chỉ định mổ trước không tái diễn</text>`;
      s += `<text x="34" y="136" fill="#166534" font-size="11" font-weight="700">• Ngôi chỏm, thai đơn, con vừa</text>`;
      s += `<text x="34" y="156" fill="#166534" font-size="11" font-weight="700">• Từng sinh âm đạo trước đó</text>`;

      s += `<rect x="286" y="46" width="254" height="150" rx="14" fill="#fef2f2" stroke="#dc2626" stroke-width="1.4"/>`;
      s += `<text x="413" y="72" text-anchor="middle" fill="#991b1b" font-family="Outfit, sans-serif" font-size="13" font-weight="800">🚫 CHỐNG CHỈ ĐỊNH / ĐIỂM CHẶN</text>`;
      s += `<text x="300" y="96" fill="#7f1d1d" font-size="11" font-weight="700">• Sẹo mổ dọc thân / sẹo chữ T</text>`;
      s += `<text x="300" y="116" fill="#7f1d1d" font-size="11" font-weight="700">• Tiền căn vỡ tử cung trước đó</text>`;
      s += `<text x="300" y="136" fill="#7f1d1d" font-size="11" font-weight="700">• Nhau tiền đạo che lỗ trong</text>`;
      s += `<text x="300" y="156" fill="#7f1d1d" font-size="11" font-weight="700">• Cơ sở KHÔNG có phòng mổ cấp cứu</text>`;
    }
  } else if (st.id === 'risk' || st.id === 'explain') {
    s += `<rect x="20" y="46" width="520" height="150" rx="14" fill="#fff" stroke="#6366f1" stroke-width="1.3"/>`;
    s += `<text x="280" y="70" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" font-weight="800" fill="#4338ca">BÀN CÂN NGUY CƠ: MẸ vs THAI NHI</text>`;
    s += `<rect x="40" y="86" width="200" height="92" rx="10" fill="#fee2e2" stroke="#ef4444" stroke-width="1.2"/>`;
    s += `<text x="140" y="108" text-anchor="middle" fill="#991b1b" font-family="Outfit, sans-serif" font-size="12" font-weight="800">👩 NGUY CƠ CHO MẸ</text>`;
    s += `<text x="50" y="128" fill="#7f1d1d" font-size="11">• Mất máu, tụt HA, sốc giảm thể tích</text>`;
    s += `<text x="50" y="146" fill="#7f1d1d" font-size="11">• Rối loạn đông máu DIC, BHSS</text>`;
    s += `<text x="50" y="164" fill="#7f1d1d" font-size="11">• Nguy cơ cắt tử cung, tổn thương tạng</text>`;
    s += `<rect x="320" y="86" width="200" height="92" rx="10" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.2"/>`;
    s += `<text x="420" y="108" text-anchor="middle" fill="#0369a1" font-family="Outfit, sans-serif" font-size="12" font-weight="800">👶 NGUY CƠ CHO CON</text>`;
    s += `<text x="330" y="128" fill="#075985" font-size="11">• Thiếu oxy máu cấp, ngạt sơ sinh</text>`;
    s += `<text x="330" y="146" fill="#075985" font-size="11">• Toan chuyển hóa nặng, tổn thương não</text>`;
    s += `<text x="330" y="164" fill="#075985" font-size="11">• Sinh non cực độ hoặc tử vong chu sinh</text>`;
    s += `<circle cx="280" cy="132" r="14" fill="#6366f1"/><text x="280" y="137" text-anchor="middle" fill="#fff" font-size="12">⚖️</text>`;
  } else if (st.id === 'plan' || st.id === 'choice') {
    s += `<rect x="20" y="46" width="520" height="150" rx="14" fill="#fff" stroke="#10b981" stroke-width="1.3"/>`;
    s += `<text x="280" y="68" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" font-weight="800" fill="#065f46">LƯU ĐỒ XỬ TRÍ 3 LÀN SONG SONG (PARALLEL TRACKS)</text>`;
    const tracks = [
      ['LÀN 1: HỒI SỨC MẸ', 'Bù dịch ấm (Ringer/NaCl) · Lấy máu làm phản ứng chéo · Chuẩn bị 2-4 đv Hồng cầu lắng O', '#0284c7', '#f0f9ff'],
      ['LÀN 2: CHẤM DỨT THAI KỲ', 'Báo kíp mổ cấp cứu (Category 1) · Mổ lấy thai khẩn trương · Không trì hoãn chờ corticoid', '#dc2626', '#fef2f2'],
      ['LÀN 3: HỒI SỨC SƠ SINH', 'Bác sĩ Nhi sơ sinh sẵn sàng tại phòng mổ · Máy sưởi ấm, bóng bóp, đặt nội khí quản', '#d97706', '#fffbeb']
    ];
    tracks.forEach(([t1, t2, col, bg], i) => {
      const y = 88 + i * 35;
      s += `<rect x="36" y="${y - 12}" width="488" height="30" rx="8" fill="${bg}" stroke="${col}" stroke-width="1.2"/>`;
      s += `<text x="48" y="${y + 7}" fill="${col}" font-family="Outfit, sans-serif" font-size="11" font-weight="800">${t1}:</text>`;
      s += `<text x="200" y="${y + 7}" fill="#334155" font-size="10.5" font-weight="600">${t2}</text>`;
    });
  } else if (st.id === 'talk' || st.id === 'close') {
    s += `<rect x="20" y="46" width="520" height="150" rx="14" fill="#faf5ff" stroke="#9333ea" stroke-width="1.3"/>`;
    s += `<text x="280" y="68" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" font-weight="800" fill="#6b21a8">GIAO TIẾP VỚI NGƯỜI BỆNH & TEACH-BACK 2 CHIỀU</text>`;
    s += `<g transform="translate(36 84)"><rect width="230" height="56" rx="10" fill="#fff" stroke="#c084fc" stroke-width="1.2"/><text x="12" y="20" font-weight="800" font-size="11" fill="#7e22ce">👩‍⚕️ Bác sĩ giải thích & hỏi lại:</text><text x="12" y="38" font-size="10.5" fill="#4a044e">“Chị nhắc lại giúp em 3 dấu hiệu</text><text x="12" y="50" font-size="10.5" fill="#4a044e">nguy hiểm cần gọi cấp cứu ngay nhé?”</text></g>`;
    s += `<g transform="translate(294 84)"><rect width="230" height="56" rx="10" fill="#fff" stroke="#ec4899" stroke-width="1.2"/><text x="12" y="20" font-weight="800" font-size="11" fill="#be185d">🤰 Sản phụ nhắc lại (Teach-back):</text><text x="12" y="38" font-size="10.5" fill="#831843">“1. Ra máu tái phát · 2. Đau cứng bụng</text><text x="12" y="50" font-size="10.5" fill="#831843">3. Em bé giảm máy hoặc nín đạp!”</text></g>`;
    s += `<rect x="140" y="152" width="280" height="28" rx="8" fill="#f3e8ff"/><text x="280" y="170" text-anchor="middle" font-size="11" font-weight="700" fill="#581c87">🤝 Thấu cảm · Không hứa hẹn suông · Sẵn sàng phương án</text>`;
  } else {
    s += `<rect x="20" y="46" width="520" height="150" rx="14" fill="#fff" stroke="#10b981" stroke-width="1.4"/>`;
    s += `<text x="280" y="70" text-anchor="middle" font-family="Outfit, sans-serif" font-size="14" font-weight="800" fill="#047857">🏆 HOÀN TẤT TRẠM THI MÔ PHỎNG LÂM SÀNG</text>`;
    s += `<text x="280" y="96" text-anchor="middle" font-size="34">🎖️</text>`;
    s += `<text x="280" y="128" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" font-weight="800" fill="#0f172a">Bạn đã đi qua toàn bộ các bước của trạm!</text>`;
    s += `<text x="280" y="150" text-anchor="middle" font-size="11.5" fill="#475569">Hãy đối chiếu điểm tự chấm theo 4 nhóm tiêu chí và mở đáp án nguồn bên phải để rút kinh nghiệm.</text>`;
  }
  s += `</svg></div>`;
  return s;
}

function renderOsceModeSwitcher(cur) {
  return `<div class="o-mode-switch">
    <button class="o-mbtn ${cur === 'flowchart' ? 'cur' : ''}" data-omode="flowchart"><i>🧭</i> Bản đồ tư duy lâm sàng</button>
    <button class="o-mbtn ${cur === 'exam' ? 'cur' : ''}" data-omode="exam"><i>🎙️</i> Thi thử toàn trạm (5 phút)</button>
    <button class="o-mbtn ${cur === 'steps' ? 'cur' : ''}" data-omode="steps"><i>👣</i> Luyện từng bước & Lời mẫu</button>
  </div>`;
}

function renderOscePacing(rem, total = 300) {
  const elap = Math.max(0, total - rem), pct = Math.min(100, (elap / total) * 100);
  return `<div class="o-pacing">
    <div class="o-pacing-h">
      <span>⏱️ Thanh nhịp thời gian trạm thi 5 phút (Pacing Timeline)</span>
      <b>Đã dùng: ${Math.floor(elap / 60)}′${String(elap % 60).padStart(2, '0')}″ / 5′00″</b>
    </div>
    <div class="o-pacing-track">
      <div class="o-pacing-seg" style="width:10%;background:#38bdf8" title="0:00 – 0:30: Đọc đề & Bắt 5 điểm neo"></div>
      <div class="o-pacing-seg" style="width:20%;background:#ef4444" title="0:30 – 1:30: Triage mẹ & Kích hoạt Báo động đỏ"></div>
      <div class="o-pacing-seg" style="width:20%;background:#f97316" title="1:30 – 2:30: Đọc CTG & Chẩn đoán xác định + lý do"></div>
      <div class="o-pacing-seg" style="width:20%;background:#eab308" title="2:30 – 3:30: Chỉ định Cận lâm sàng có mục đích"></div>
      <div class="o-pacing-seg" style="width:20%;background:#22c55e" title="3:30 – 4:30: Phác đồ 3 làn khẩn song song (Mẹ - Thai - Nhi)"></div>
      <div class="o-pacing-seg" style="width:10%;background:#a855f7" title="4:30 – 5:00: Tư vấn người nhà & Teach-back 2 chiều"></div>
      <div class="o-pacing-now" id="pacing-now" style="left:${pct}%"></div>
    </div>
    <div class="o-pacing-legend">
      <span class="o-pacing-tag"><i style="background:#38bdf8"></i> 0–30s: 📖 Đọc đề</span>
      <span class="o-pacing-tag"><i style="background:#ef4444"></i> 30s–1m30: 🚨 Triage & Báo động</span>
      <span class="o-pacing-tag"><i style="background:#f97316"></i> 1m30–2m30: 🧠 CTG & Chẩn đoán</span>
      <span class="o-pacing-tag"><i style="background:#eab308"></i> 2m30–3m30: 🧪 CLS có mục đích</span>
      <span class="o-pacing-tag"><i style="background:#22c55e"></i> 3m30–4m30: 🏥 Phác đồ 3 làn</span>
      <span class="o-pacing-tag"><i style="background:#a855f7"></i> 4m30–5m: 🤝 Tư vấn & Dặn dò</span>
    </div>
  </div>`;
}

function getStepScript(c, stKey, cf) {
  const top = cf.topic, kind = cf.kind;
  if (stKey === 'read') {
    return `Dạ thưa giám khảo, em dành 30 giây đầu đọc đề và nắm chắc <span class="kw">5 điểm neo then chốt</span>: 1. Tuổi thai (${c.title}); 2. Triệu chứng cơ năng (đau bụng dữ dội hay ra máu đỏ tươi không đau); 3. Sinh hiệu mẹ (Shock Index có >0.9 không); 4. Tình trạng thai (tim thai/CTG bình thường hay suy cấp); 5. Yêu cầu của đề (cấp cứu, chẩn đoán hay tư vấn). Em tuyệt đối <span class="bad">không đọc lan man</span> làm mất thời gian xử trí.`;
  }
  if (stKey === 'enter' || stKey === 'open') {
    if (kind === 'cc') {
      return `Dạ thưa thầy/cô, vừa bước vào trạm thấy sản phụ trong tình trạng khẩn cấp, em lập tức <span class="kw">LA TO KÍCH HOẠT BÁO ĐỘNG ĐỎ CẤP CỨU SẢN KHOA</span>:<br>
      <i>“Báo động đỏ sản khoa! Nhờ điều dưỡng đo ngay sinh hiệu mẹ, lập 2 đường truyền lớn kim 18G, truyền dịch ấm Ringer Lactate và lấy máu xét nghiệm khẩn: Công thức máu, Nhóm máu, Phản ứng chéo và Đông máu toàn bộ có định lượng Fibrinogen! Báo ngân hàng máu chuẩn bị sẵn 2 đơn vị hồng cầu lắng O và báo phòng mổ cấp cứu!”</i><br>
      Đồng thời em trấn an sản phụ: <i>“Chị ơi, em là bác sĩ, tụi em đang tập trung cấp cứu cho chị và bé, chị hít thở đều nhé!”</i>`;
    } else {
      return `Dạ em chào chị ạ, em là bác sĩ trực hôm nay. Chị cho em xin họ tên và năm sinh để xác nhận thông tin nhé? Hôm nay chị đến khám vì vấn đề gì, chị có thể chia sẻ cho em nghe được không ạ?`;
    }
  }
  if (stKey === 'assess' || stKey === 'history') {
    if (top === 'nbn') {
      return `Em nhận định nhanh: Về phía mẹ, huyết áp dao động, mạch nhanh, tính ngay <span class="kw">Shock Index = HR ÷ HATT > 0.9</span> cảnh giác sốc giảm thể tích tiềm ẩn. Khám bụng: tử cung <span class="kw">co cứng như gỗ</span>, tăng trương lực cơ bản liên tục không có khoảng nghỉ giữa các cơn co. Trên CTG: cơn gò dồn dập kèm <span class="kw">nhịp giảm muộn (Late deceleration) lặp lại</span> ➔ Thai đang thiếu oxy cấp nghiêm trọng! Tuyệt đối <span class="bad">không loại trừ NBN chỉ vì ra ít máu</span> vì máu tụ sau nhau bóc tách âm thầm.`;
    } else if (top === 'ntd') {
      return `Em xác nhận tuổi thai và tình trạng ra máu đỏ tươi từ âm đạo. <span class="bad">TUYỆT ĐỐI CẤM THĂM ÂM ĐẠO BẰNG NGÓN TAY</span> vì ngón tay có thể chọc thủng bánh nhau bám ở đoạn dưới gây xuất huyết ồ ạt tử vong! Em đặt mỏ vịt nhẹ nhàng bộc lộ CTC thấy máu đỏ tươi chảy ra từ lỗ trong. Đánh giá cơn gò: cơn gò chuyển dạ làm kéo dãn đoạn dưới tử cung trượt diện bám bánh nhau. Khảo sát tiền căn sẹo mổ cũ: nếu có sẹo mổ cũ kèm nhau bám thấp mặt trước thì <span class="kw">báo động đỏ nguy cơ Nhau cài răng lược (PAS)</span>.`;
    } else {
      return `Em khai thác 4 điều kiện vàng: 1. Lý do mổ cũ là gì (ngôi mông / thai suy... là nguyên nhân không tái diễn ➔ ĐẠT); 2. <span class="kw">ĐƯỜNG RẠCH CƠ TỬ CUNG LÀ ĐƯỜNG NÀO?</span> Em xin phép xem giấy xuất viện hoặc biên bản mổ cũ (<span class="bad">tuyệt đối không đoán vết rạch tử cung từ sẹo da ngoài bụng</span>; chỉ sẹo ngang đoạn dưới mới được thử chuyển dạ, sẹo dọc thân/chữ T là chống chỉ định tuyệt đối); 3. Khoảng cách lần mổ trước > 18–24 tháng; 4. Thai kỳ hiện tại: thai đơn, ngôi chỏm, con ước lượng vừa (<3500g).`;
    }
  }
  if (stKey === 'dx' || stKey === 'analyze') {
    if (top === 'nbn') {
      return `Chẩn đoán xác định của em: <span class="kw">Nhau bong non thể nặng, có biến chứng suy thai cấp đe dọa tử vong chu sinh</span>. Lý do: tam chứng kinh điển gồm đau bụng đột ngột dữ dội liên tục, tử cung co cứng tăng trương lực nền, và CTG có nhịp giảm muộn kéo dài. Phân biệt với Nhau tiền đạo (chảy máu đỏ tươi không đau bụng, tử cung mềm) và Vỡ tử cung (thường có sẹo mổ cũ, mất tim thai đột ngột, bụng đề kháng).`;
    } else if (top === 'ntd') {
      return `Chẩn đoán xác định của em: <span class="kw">Nhau tiền đạo (trung tâm/bán trung tâm) đang ra huyết</span>. Đánh giá mức độ: mẹ hiện tại chưa sốc / đã sốc mất máu; có cơn co chuyển dạ phối hợp; cần loại trừ PAS nếu có tiền căn sẹo mổ lấy thai cũ.`;
    } else {
      return `Em phân tích: Sản phụ đủ điều kiện thực hiện <span class="kw">TOLAC (Thử thách sinh ngả âm đạo sau mổ cũ)</span> do có 1 vết mổ ngang đoạn dưới vì nguyên nhân không tái diễn, thai đơn ngôi chỏm, con ước lượng vừa, không có chống chỉ định sinh ngả âm đạo.`;
    }
  }
  if (stKey === 'risk' || stKey === 'explain') {
    if (top === 'nbn' || top === 'ntd') {
      return `Em nêu rõ nguy cơ tách biệt cho cả mẹ và con:<br>
      • <span class="kw">Nguy cơ cho con:</span> Thiếu oxy cấp tính dẫn đến ngạt nặng, toan chuyển hóa không hồi phục, tổn thương não và tử vong chu sinh dù có mổ khẩn.<br>
      • <span class="kw">Nguy cơ cho mẹ:</span> Mất máu ồ ạt, sốc giảm thể tích, băng huyết sau sinh do đờ tử cung (đặc biệt là Phong huyết tử cung - nhau Couvelaire), <span class="bad">Rối loạn đông máu nội mạch lan tỏa (DIC)</span>, suy thận cấp và nguy cơ phải cắt tử cung cấp cứu.`;
    } else {
      return `Em giải thích bằng lời đời thường: TOLAC là quá trình thử sinh thường sau khi đã có vết mổ cũ. Nếu sinh thường thành công thì gọi là VBAC. Lợi ích là tránh được cuộc đại phẫu, ít mất máu, hồi phục nhanh và giảm nguy cơ cho lần mang thai sau. Tuy nhiên, nguy cơ lớn nhất là <span class="bad">nứt hoặc vỡ vết mổ cũ (~0.5% theo RCOG)</span>, và có thể phải chuyển mổ cấp cứu trong chuyển dạ nếu thai suy hoặc chuyển dạ ngưng tiến.`;
    }
  }
  if (stKey === 'plan' || stKey === 'choice') {
    if (top === 'nbn') {
      return `Em kích hoạt ngay <span class="kw">PHÁC ĐỒ 3 LÀN SONG SONG</span>:<br>
      - <b>Làn 1 (Hồi sức mẹ):</b> 2 kim lớn 18G, truyền dịch ấm Ringer Lactate, bù hồng cầu lắng và kết tủa lạnh nếu Fibrinogen < 2 g/L.<br>
      - <b>Làn 2 (Chấm dứt thai kỳ):</b> Thai sống đang suy cấp ➔ <span class="kw">MỔ LẤY THAI CẤP CỨU TỐI KHẨN (Category 1)</span> trong 15–30 phút. Chuẩn bị sẵn phương án xử trí Đờ tử cung do Phong huyết Couvelaire: oxytocin liều cao, chuẩn bị Carboprost, bóng chèn Bakri và may B-Lynch. Tuyệt đối <span class="bad">không cho thuốc giảm co thường quy</span> và <span class="bad">không chờ đợi hồi sức xong hẳn mới chuẩn bị mổ</span>.<br>
      - <b>Làn 3 (Hồi sức sơ sinh):</b> Bác sĩ Nhi - Sơ sinh túc trực phòng mổ với lồng ấp ấm, bóng bóp oxy và bộ đặt nội khí quản.`;
    } else if (top === 'ntd') {
      return `Xử trí: Nếu ra máu ồ ạt hoặc mẹ/thai bất ổn ➔ <span class="kw">Mổ cấp cứu ngay lập tức bất kể tuổi thai, không chờ tiêm corticoid</span>. Nếu thai đủ tháng (≥37 tuần) hoặc nhau tiền đạo trung tâm ➔ Mổ lấy thai chủ động theo kế hoạch. Nếu non tháng (<34 tuần) và máu đã tự cầm ➔ Dưỡng thai tại viện, tiêm Corticoid trưởng thành phổi, MgSO4 bảo vệ thần kinh nếu <32 tuần, xét nghiệm nhóm máu dự trù sẵn.`;
    } else {
      return `Kế hoạch: Đồng thuận thử chuyển dạ (TOLAC) với sản phụ và thân nhân. Điều kiện bắt buộc là theo dõi chuyển dạ tại <span class="kw">cơ sở có khả năng phẫu thuật mổ cấp cứu trong vòng 15–30 phút</span> (có sẵn kíp mổ, gây mê, hồi sức sơ sinh và máu). Mắc monitor theo dõi tim thai và cơn gò liên tục. Nếu có dấu hiệu dọa vỡ (đau vết mổ ngoài cơn gò, nhịp tim thai bất thường đột ngột) ➔ Chuyển mổ khẩn ngay!`;
    }
  }
  if (stKey === 'talk' || stKey === 'close') {
    return `Em giao tiếp với sản phụ và người nhà: Dùng từ ngữ đời thường dễ hiểu, thái độ thấu cảm, giải thích rõ tình trạng nguy kịch và kế hoạch cấp cứu khẩn trương của ê-kíp mà <span class="bad">không bao giờ hứa hẹn chắc chắn 100%</span>. Đồng thời thực hiện <span class="kw">Teach-back 2 chiều</span>: “Chị/anh nhắc lại giúp em 3 dấu hiệu nguy hiểm cần báo bác sĩ ngay nhé?” (1. Ra máu tái phát; 2. Đau bụng co cứng liên tục; 3. Em bé giảm máy hoặc nín đạp).`;
  }
  return `Đối chiếu lại với rubric và đáp án nguồn để rút kinh nghiệm lâm sàng.`;
}

function getFullStationScript(c, cf) {
  const top = cf.topic, kind = cf.kind;
  return `<div class="o-script-card">
    <div class="sh">
      <b>🎙️ KỊCH BẢN NÓI MẪU TOÀN TRẠM CỦA THỦ KHOA (5 PHÚT THỰC CHIẾN)</b>
      <span class="badge good">Chuẩn Y4 ĐHYD</span>
    </div>
    <div class="o-script-body">
      <p><b>⏱️ PHÚT 0:00 – 1:00: VÀO TRẠM & BÁO ĐỘNG ĐỎ</b><br>
      ${getStepScript(c, 'enter', cf)}</p>

      <p><b>⏱️ PHÚT 1:00 – 2:00: NHẬN ĐỊNH LÂM SÀNG & ĐỌC CTG</b><br>
      ${getStepScript(c, 'assess', cf)}</p>

      <p><b>⏱️ PHÚT 2:00 – 2:45: CHẨN ĐOÁN XÁC ĐỊNH & LÝ DO</b><br>
      ${getStepScript(c, 'dx', cf)}</p>

      <p><b>⏱️ PHÚT 2:45 – 3:30: BÀN CÂN NGUY CƠ MẸ & THAI</b><br>
      ${getStepScript(c, 'risk', cf)}</p>

      <p><b>⏱️ PHÚT 3:30 – 4:30: PHÁC ĐỒ XỬ TRÍ 3 LÀN SONG SONG</b><br>
      ${getStepScript(c, 'plan', cf)}</p>

      <p><b>⏱️ PHÚT 4:30 – 5:00: TƯ VẤN THÂN NHÂN & TEACH-BACK</b><br>
      ${getStepScript(c, 'talk', cf)}</p>
    </div>
  </div>`;
}

function renderOsceFlowchart(c, cf) {
  const top = cf.topic;
  if (top === 'nbn') {
    return `<div class="o-flowchart">
      <div class="o-fc-head">
        <span class="st-ic" style="font-size:24px">🌩️</span>
        <div>
          <h3>Bản đồ Tư duy Lâm sàng: NHAU BONG NON (Abruptio Placentae)</h3>
          <span class="badge extra">Chuỗi Phản xạ Cấp cứu Sản khoa Y4 ĐHYD</span>
        </div>
      </div>
      <div class="o-fc-tree">
        <div class="o-fc-node root">
          <div class="o-fc-title"><span>🚨 BƯỚC 1: TIẾP NHẬN & NHẬN DIỆN TRIỆU CHỨNG SỚM</span><span class="o-fc-badge" style="background:#dbeafe;color:#1e40af">Khởi động</span></div>
          <p class="o-fc-desc">Sản phụ tam cá nguyệt 3 (hoặc có tiền sản giật / chấn thương / song thai) đột ngột <b>đau bụng dữ dội liên tục</b>, tử cung co cứng, âm đạo ra huyết sậm màu loãng không đông.</p>
        </div>
        <div class="o-fc-node warn">
          <div class="o-fc-title"><span>📊 BƯỚC 2: TRIAGE MẸ & THEO DÕI CTG / MONITOR</span><span class="o-fc-badge" style="background:#fef3c7;color:#92400e">Đánh giá</span></div>
          <p class="o-fc-desc">
            • <b>Mẹ:</b> Tính ngay <b>Shock Index = HR ÷ HATT</b> (> 0.9 là báo động sốc). <i>Cảnh giác: Lượng máu chảy ngoài ít KHÔNG phản ánh mức độ nặng vì máu tụ sau nhau bóc tách âm thầm!</i><br>
            • <b>Khám bụng:</b> Tử cung co cứng liên tục như gỗ (Tăng trương lực cơ bản, không có khoảng nghỉ giữa các cơn co).<br>
            • <b>CTG / Tim thai:</b> Gò cường tính dồn dập + Nhịp giảm muộn (Late deceleration) lặp lại hoặc nhịp tim thai chậm kéo dài (Suy thai cấp tối khẩn!).
          </p>
        </div>
        <div class="o-fc-node stop">
          <div class="o-fc-title"><span>🚫 ĐIỂM CHẶN SỐNG CÒN (HARD STOP / RED FLAGS)</span><span class="o-fc-badge" style="background:#fee2e2;color:#991b1b">Tuyệt đối cấm</span></div>
          <p class="o-fc-desc">
            1. <b>KHÔNG BAO GIỜ loại trừ NBN</b> chỉ vì âm đạo ra ít máu hoặc siêu âm “chưa thấy khối máu tụ” (Siêu âm chỉ phát hiện ~25-50% trường hợp cấp; NBN là chẩn đoán lâm sàng!).<br>
            2. <b>CẤM dùng thuốc giảm co (Tocolytics)</b> thường quy khi đã nghi ngờ NBN thể nặng.
          </p>
        </div>
        <div class="o-fc-node purple">
          <div class="o-fc-title"><span>🔀 BƯỚC 3: CÂY QUYẾT ĐỊNH ĐƯỜNG CHẤM DỨT THAI KỲ (DECISION FORK)</span><span class="o-fc-badge" style="background:#f3e8ff;color:#6b21a8">Chiến lược</span></div>
          <div class="o-fc-fork">
            <div class="o-fc-node danger" style="margin:0">
              <div class="o-fc-title"><span style="color:#dc2626">NHÁNH A: THAI SỐNG + SUY THAI CẤP (CTG CAT III)</span></div>
              <p class="o-fc-desc">
                ➔ <b>MỔ LẤY THAI CẤP CỨU TỐI KHẨN (Category 1)</b>.<br>
                • Mục tiêu: Đưa thai ra trong <b>15–30 phút</b> để cứu sống con và cầm máu mẹ.<br>
                • Báo động kíp phẫu thuật, bác sĩ gây mê hồi sức và bác sĩ Nhi - Sơ sinh vào ngay phòng mổ.
              </p>
            </div>
            <div class="o-fc-node act" style="margin:0">
              <div class="o-fc-title"><span style="color:#15803d">NHÁNH B: THAI LƯU + MẸ HUYẾT ĐỘNG ỔN ĐỊNH</span></div>
              <p class="o-fc-desc">
                ➔ <b>Ưu tiên sinh ngả âm đạo có kiểm soát</b>.<br>
                • <b>Bấm ối khẩn:</b> Giảm áp lực buồng tử cung (ngừa thuyên tắc ối & hạn chế giải phóng thromboplastin gây DIC).<br>
                • Truyền Oxytocin tăng co tích cực để sinh nhanh. Nếu mẹ diễn tiến sốc hoặc băng huyết ➔ Chuyển mổ khẩn.
              </p>
            </div>
          </div>
        </div>
        <div class="o-fc-node act">
          <div class="o-fc-title"><span>🏥 BƯỚC 4: PHÁC ĐỒ 3 LÀN KHẨN SONG SONG (PARALLEL TRACKS)</span><span class="o-fc-badge" style="background:#dcfce7;color:#166534">Xử trí</span></div>
          <p class="o-fc-desc">
            • <b>Làn 1 (Hồi sức mẹ):</b> 2 đường truyền lớn 16–18G, truyền dịch ấm Ringer Lactate, xét nghiệm khẩn (CTM, Nhóm máu, Phản ứng chéo, Đông máu toàn bộ có Fibrinogen). Bù Fibrinogen (kết tủa lạnh) nếu < 2 g/L, truyền hồng cầu lắng nếu mất máu nặng.<br>
            • <b>Làn 2 (Chấm dứt thai & Dự phòng PPH):</b> Mổ lấy thai. Cảnh giác <b>Phong huyết tử cung - nhau (Tử cung Couvelaire)</b> gây đờ tử cung mất trương lực ➔ Chuẩn bị sẵn Oxytocin liều cao, Carboprost, bóng chèn Bakri, may B-Lynch, sẵn sàng cắt tử cung nếu chảy máu không cầm.<br>
            • <b>Làn 3 (Bác sĩ Nhi):</b> Đội ngũ hồi sức sơ sinh túc trực phòng mổ, sẵn sàng đặt nội khí quản, hút đờm, sưởi ấm, chống toan chuyển hóa.
          </p>
        </div>
        <div class="o-fc-node root">
          <div class="o-fc-title"><span>🤝 BƯỚC 5: TƯ VẤN NGƯỜI NHÀ & TEACH-BACK 2 CHIỀU</span><span class="o-fc-badge" style="background:#e0e7ff;color:#3730a3">Giao tiếp</span></div>
          <p class="o-fc-desc">Dùng ngôn ngữ đời thường, thấu cảm, giải thích nguy kịch nhưng không giấu giếm, nói rõ ê-kíp đang hành động khẩn trương và hẹn cập nhật liên tục.</p>
        </div>
      </div>
    </div>`;
  }
  if (top === 'ntd') {
    return `<div class="o-flowchart">
      <div class="o-fc-head">
        <span class="st-ic" style="font-size:24px">🥧</span>
        <div>
          <h3>Bản đồ Tư duy Lâm sàng: NHAU TIỀN ĐẠO & PAS</h3>
          <span class="badge extra">Chuỗi Phản xạ Cấp cứu Sản khoa Y4 ĐHYD</span>
        </div>
      </div>
      <div class="o-fc-tree">
        <div class="o-fc-node root">
          <div class="o-fc-title"><span>🚨 BƯỚC 1: TIẾP NHẬN & NHẬN DIỆN TRIỆU CHỨNG SỚM</span><span class="o-fc-badge" style="background:#dbeafe;color:#1e40af">Khởi động</span></div>
          <p class="o-fc-desc">Sản phụ 3 tháng cuối đột ngột <b>ra máu đỏ tươi tự nhiên từ âm đạo, KHÔNG ĐAU BỤNG</b>. Máu có thể tự cầm rồi tái phát với lượng nhiều hơn.</p>
        </div>
        <div class="o-fc-node stop">
          <div class="o-fc-title"><span>🚫 ĐIỂM CHẶN SỐNG CÒN (CRITICAL RED LINE)</span><span class="o-fc-badge" style="background:#fee2e2;color:#991b1b">Tuyệt đối cấm</span></div>
          <p class="o-fc-desc">
            • <b>TUYỆT ĐỐI CẤM THĂM ÂM ĐẠO BẰNG NGÓN TAY!</b><br>
            <i>Lý do: Ngón tay đưa qua lỗ trong CTC có thể chọc thủng bánh nhau bám ở đoạn dưới gây xuất huyết ồ ạt dẫn đến tử vong mẹ và thai trong vài phút!</i><br>
            • <b>Khám an toàn:</b> Đặt mỏ vịt bộc lộ CTC nhẹ nhàng để kiểm tra nguồn máu + Siêu âm ngả âm đạo (TVS) an toàn.
          </p>
        </div>
        <div class="o-fc-node warn">
          <div class="o-fc-title"><span>🔍 BƯỚC 2: ĐÁNH GIÁ CHUYỂN DẠ & NGUY CƠ PAS (NHAU CÀI RĂNG LƯỢC)</span><span class="o-fc-badge" style="background:#fef3c7;color:#92400e">Đánh giá</span></div>
          <p class="o-fc-desc">
            • <b>Có cơn co chuyển dạ không?</b> Cơn co kéo dãn đoạn dưới tử cung làm trượt diện bám bánh nhau gây chảy máu.<br>
            • <b>Có sẹo mổ cũ không?</b> Tiền căn mổ lấy thai cũ + Nhau bám mặt trước đoạn dưới ➔ <b>Báo động đỏ PAS!</b> Cần hội chẩn đa chuyên khoa, dự trù máu lớn.
          </p>
        </div>
        <div class="o-fc-node purple">
          <div class="o-fc-title"><span>🔀 BƯỚC 3: CÂY QUYẾT ĐỊNH XỬ TRÍ (DECISION FORK)</span><span class="o-fc-badge" style="background:#f3e8ff;color:#6b21a8">Chiến lược</span></div>
          <div class="o-fc-fork">
            <div class="o-fc-node danger" style="margin:0">
              <div class="o-fc-title"><span style="color:#dc2626">NHÁNH A: MÁU Ồ ẠT / SỐC / SUY THAI</span></div>
              <p class="o-fc-desc">➔ <b>HỒI SỨC + MỔ LẤY THAI CẤP CỨU NGAY LẬP TỨC</b>, bất kể tuổi thai, không trì hoãn chờ tiêm corticoid!</p>
            </div>
            <div class="o-fc-node act" style="margin:0">
              <div class="o-fc-title"><span style="color:#15803d">NHÁNH B: ĐỦ THÁNG (≥37W) HOẶC NTĐ TRUNG TÂM</span></div>
              <p class="o-fc-desc">➔ <b>MỔ LẤY THAI CHỦ ĐỘNG THEO KẾ HOẠCH</b> (UMP 37–38 tuần; RCOG ≤37+6). Chuẩn bị máu, phòng mổ và bác sĩ mổ kinh nghiệm.</p>
            </div>
          </div>
        </div>
        <div class="o-fc-node root">
          <div class="o-fc-title"><span>🤝 BƯỚC 4: TƯ VẤN & TEACH-BACK 2 CHIỀU</span><span class="o-fc-badge" style="background:#e0e7ff;color:#3730a3">Giao tiếp</span></div>
          <p class="o-fc-desc">Dùng lời đời thường giải thích cơ chế chảy máu do đoạn dưới dãn nở. Dặn dò 3 dấu hiệu nguy hiểm cần vào viện ngay: 1. Ra máu lại; 2. Đau cứng bụng; 3. Thai giảm đạp.</p>
        </div>
      </div>
    </div>`;
  }
  return `<div class="o-flowchart">
    <div class="o-fc-head">
      <span class="st-ic" style="font-size:24px">💬</span>
      <div>
        <h3>Bản đồ Tư duy Lâm sàng: TOLAC / VBAC (Sinh Sau Mổ Cũ)</h3>
        <span class="badge extra">Chuỗi Tư Vấn & Ra Quyết Định Y4 ĐHYD</span>
      </div>
    </div>
    <div class="o-fc-tree">
      <div class="o-fc-node root">
        <div class="o-fc-title"><span>🙋 BƯỚC 1: TIẾP NHẬN MONG MUỐN CỦA SẢN PHỤ</span><span class="o-fc-badge" style="background:#dbeafe;color:#1e40af">Khởi động</span></div>
        <p class="o-fc-desc">Sản phụ 39–40 tuần có tiền căn 1 lần mổ lấy thai cũ đến khám và bày tỏ mong muốn: <i>“Lần này em có sinh thường được không bác sĩ?”</i></p>
      </div>
      <div class="o-fc-node warn">
        <div class="o-fc-title"><span>🔍 BƯỚC 2: KHẢO SÁT 4 ĐIỀU KIỆN VÀNG</span><span class="o-fc-badge" style="background:#fef3c7;color:#92400e">Đánh giá</span></div>
        <p class="o-fc-desc">
          1. <b>Lý do mổ cũ:</b> Không tái diễn (ngôi mông, thai suy, nhau tiền đạo... ➔ ĐẠT). Khung chậu hẹp tuyệt đối ➔ KHÔNG ĐẠT.<br>
          2. <b>Đường rạch tử cung:</b> Sẹo ngang đoạn dưới (BẮT BUỘC XIN BIÊN BẢN MỔ / GIẤY RA VIỆN; sẹo dọc thân / chữ T ➔ CHỐNG CHỈ ĐỊNH TUYỆT ĐỐI vì nguy cơ vỡ tử cung 4–9%!).<br>
          3. <b>Khoảng cách 2 lần sinh:</b> Khuyến cáo > 18–24 tháng.<br>
          4. <b>Thai kỳ hiện tại:</b> Thai đơn, ngôi chỏm, con vừa (<3500g), không có nhau tiền đạo, mẹ ổn định.
        </p>
      </div>
      <div class="o-fc-node purple">
        <div class="o-fc-title"><span>⚖️ BƯỚC 3: TƯ VẤN CÂN BẰNG LỢI ÍCH & NGUY CƠ (SHARED DECISION)</span><span class="o-fc-badge" style="background:#f3e8ff;color:#6b21a8">Cân nhắc</span></div>
        <p class="o-fc-desc">
          • <b>Tỷ lệ thành công:</b> 60–80% sinh thường thành công (VBAC).<br>
          • <b>Lợi ích:</b> Tránh cuộc mổ lớn, hồi phục nhanh, ít mất máu, giảm nguy cơ dính ruột và PAS cho lần mang thai sau.<br>
          • <b>Nguy cơ:</b> Nguy cơ nứt/vỡ sẹo mổ tử cung khoảng <b>0.5% (theo RCOG GTG45 2015)</b> ở chuyển dạ tự nhiên; tăng 2–3 lần nếu giục sinh/tăng co.
        </p>
      </div>
      <div class="o-fc-node act">
        <div class="o-fc-title"><span>🛡️ BƯỚC 4: QUY TẮC AN TOÀN SỐNG CÒN KHI THỬ CHUYỂN DẠ</span><span class="o-fc-badge" style="background:#dcfce7;color:#166534">An toàn</span></div>
        <p class="o-fc-desc">
          • Chỉ thực hiện tại cơ sở có khả năng phẫu thuật cấp cứu trong vòng <b>15–30 phút</b> (sẵn kíp mổ, gây mê, hồi sức sơ sinh và máu).<br>
          • Monitoring tim thai và cơn co liên tục suốt chuyển dạ. Dấu hiệu sớm nhất của vỡ tử cung là <b>nhịp tim thai bất thường đột ngột</b> trên CTG.
        </p>
      </div>
    </div>
  </div>`;
}

function renderOsceExamView(c, cf, steps, ticks, pct) {
  const top = cf.topic, kind = cf.kind;
  const official = window.OFFICIAL_RUBRIC;
  const rubricRows = [
    { id: 'r1', name: '1. Thái độ cấp cứu & Tác phong ban đầu', pts: 1.0, desc: 'La to gọi hỗ trợ, báo động đỏ, phân công kíp trực, lập 2 kim 18G, mắc monitor, lấy máu khẩn' },
    { id: 'r2', name: '2. Giao tiếp với sản phụ & thân nhân', pts: 1.0, desc: 'Chào hỏi, đồng cảm, giải thích trấn an ngắn gọn, không dùng biệt ngữ, không hứa hẹn suông' },
    { id: 'r3', name: '3. Nhận định sinh hiệu & CTG / Triệu chứng', pts: 2.0, desc: 'Shock Index > 0.9, tử cung co cứng như gỗ, nhận định nhịp giảm muộn (Late decel) hoặc nhịp chậm trên CTG' },
    { id: 'r4', name: '4. Chẩn đoán xác định kèm lý do từ đề', pts: 2.0, desc: 'Chẩn đoán đúng bệnh cảnh + mức độ nặng + biến chứng suy thai, nêu đủ lý do từ dữ kiện đề, phân biệt NTĐ/vỡ TC' },
    { id: 'r5', name: '5. Đề nghị Cận lâm sàng có mục đích', pts: 1.0, desc: 'CTM (thiếu máu), Nhóm máu & Phản ứng chéo (dự trù máu), Đông máu toàn bộ có Fibrinogen (tầm soát DIC)' },
    { id: 'r6', name: '6. Phác đồ xử trí 3 làn khẩn song song', pts: 2.0, desc: 'Làn 1 hồi sức dịch máu mẹ + Làn 2 mổ cấp cứu Cat 1 & dự phòng đờ TC Couvelaire + Làn 3 hồi sức sơ sinh Nhi' },
    { id: 'r7', name: '7. Tư vấn người nhà & Teach-back 2 chiều', pts: 1.0, desc: 'Giải thích lời đời thường, dặn dò 3 dấu hiệu báo động (ra máu lại, đau bụng, thai giảm máy) + kiểm tra hiểu' }
  ];

  const totalPossible = rubricRows.reduce((sum, r) => sum + r.pts, 0);
  const checkedRows = new Set(state.rubrics[c.id + '_exam'] || []);
  const currentScore = rubricRows.filter(r => checkedRows.has(r.id)).reduce((sum, r) => sum + r.pts, 0);
  const scorePercent = Math.round((currentScore / totalPossible) * 100);

  let ratingBadge = '';
  if (currentScore >= 8.5) ratingBadge = `<span class="badge good" style="font-size:13px">🌟 ĐẠT XUẤT SẮC (Thủ khoa)</span>`;
  else if (currentScore >= 7.0) ratingBadge = `<span class="badge extra" style="font-size:13px">👏 ĐẠT GIỎI</span>`;
  else if (currentScore >= 5.0) ratingBadge = `<span class="badge" style="font-size:13px;background:#fef3c7;color:#92400e">👍 ĐẠT YÊU CẦU</span>`;
  else ratingBadge = `<span class="badge" style="font-size:13px;background:#fee2e2;color:#991b1b">⚠️ CẦN RÀ SOÁT LẠI</span>`;

  return `<div class="o-exam-layout">
    <div class="o-exam-left">
      <div class="o-exam-timer-card">
        <div>
          <span style="font:800 12px var(--disp);text-transform:uppercase;color:#93c5fd;display:block">Đồng hồ thi trạm 5 phút</span>
          <div class="o-exam-clock" id="exam-clock">${timeText()}</div>
        </div>
        <div class="o-exam-btns">
          <button id="exam-timer-toggle" class="btn ${timerRunning ? 'flat' : 'primary'}" style="background:${timerRunning ? '#475569' : '#0284c7'};color:#fff">
            ${timerRunning ? '⏸ Tạm dừng' : '▶ Bắt đầu thi'}
          </button>
          <button id="exam-timer-reset" class="btn flat" style="color:#cbd5e1;border:1px solid #475569">↺ Đặt lại</button>
        </div>
      </div>

      ${renderOscePacing(remaining)}

      <figure class="fig o-case" style="margin:0">
        <div class="o-top">
          <span class="badge ${cf.kind === 'tv' ? 'extra' : 'good'}">${cf.kind === 'tv' ? '💬 Trạm tư vấn' : '🚨 Trạm cấp cứu'}</span>
          <span class="status-note">${e(c.source?.examLabel || '')} · ⏱️ 5 phút</span>
        </div>
        <h2 class="o-title">${cf.icon} ${e(c.title)}</h2>
        <ul class="o-facts">${cf.facts.map(([a, b]) => `<li><b>${e(a)}</b>${e(b)}</li>`).join('')}</ul>
        ${c.vitals ? `<p class="vitals">${e(c.vitals)}</p>` : ''}
        <details class="deep" open>
          <summary>📄 Đề gốc (bản nhớ lại của sinh viên)</summary>
          <div class="deep-body">
            <p>${e(c.stem).replace(/\n/g, '<br>')}</p>
            ${(c.originalQuestions || []).length ? `<p><b>Câu hỏi trạm:</b><br>${c.originalQuestions.map(q => '• ' + e(typeof q === 'string' ? q : q.text || q.prompt || '')).join('<br>')}</p>` : ''}
          </div>
        </details>
      </figure>

      <details class="deep" open>
        <summary>🎙️ Xem Kịch bản nói mẫu chuẩn Y4 ĐHYD (Bấm để gập/mở)</summary>
        <div class="deep-body">
          ${getFullStationScript(c, cf)}
        </div>
      </details>
    </div>

    <div class="o-exam-right">
      <div class="o-rubric-card">
        <div class="o-rc-head">
          <div>
            <h3>Checklist Rubric Chấm Điểm Thi Thật</h3>
            <small style="color:var(--muted);font-weight:700">Tự tick điểm theo lời bạn nói được trong 5 phút</small>
          </div>
          <div class="o-rc-score">
            <span>${currentScore.toFixed(1)}</span>
            <small>/ ${totalPossible.toFixed(1)} đ</small>
          </div>
        </div>

        <div style="margin-bottom:12px;display:flex;align-items:center;justify-content:space-between">
          ${ratingBadge}
          <span style="font:800 13px var(--disp);color:var(--muted)">Đạt ${scorePercent}% thang điểm</span>
        </div>

        <div class="o-rubric-list">
          ${rubricRows.map(r => {
            const isChecked = checkedRows.has(r.id);
            return `<label class="o-rubric-item ${isChecked ? 'checked' : ''}">
              <input type="checkbox" data-rubric-row="${r.id}" ${isChecked ? 'checked' : ''}>
              <div class="o-rubric-item-body">
                <div style="display:flex;justify-content:space-between;align-items:baseline">
                  <span class="o-rubric-item-txt">${e(r.name)}</span>
                  <span class="o-rubric-item-pts">+${r.pts.toFixed(1)}đ</span>
                </div>
                <small style="color:#64748b;font-size:11.5px">${e(r.desc)}</small>
              </div>
            </label>`;
          }).join('')}
        </div>

        <button class="btn pink" id="exam-answer-toggle" style="margin-top:10px;width:100%">Mở đáp án nguồn & đối chiếu ↗</button>
      </div>

      <section id="case-answer-exam" hidden>
        ${renderCaseAnswer(c, arr(getAnswer(c)), c.answerReview || {})}
      </section>
    </div>
  </div>`;
}

function renderCase(id) {
  const c = (window.OSCE_CASES || []).find(x => x.id === id); if (!c) { renderNotFound(); return; }
  if (currentCaseId !== id) { stopTimer(); remaining = (c.minutes || 5) * 60; currentCaseId = id; oStep = 0; oHidden = new Set(); }
  const { cf, steps, total } = stepsFor(c), ticks = new Set(state.rubrics[c.id] || []), st = steps[oStep], last = oStep === steps.length - 1;
  const pct = () => Math.round((state.rubrics[c.id] || []).length / Math.max(1, total) * 100);

  const modeSwitcher = renderOsceModeSwitcher(oMode);

  let mainContent = '';

  if (oMode === 'flowchart') {
    mainContent = `<div class="o-flowchart-container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div>
          <h2 style="font-size:22px;margin:0">${cf.icon} ${e(c.title)}</h2>
          <small style="color:var(--muted);font-weight:700">Bản đồ tư duy logic dòng chảy lâm sàng · Triage ➔ Chẩn đoán ➔ 3 Làn khẩn</small>
        </div>
        <button class="btn primary" id="go-exam-btn">🎙️ Sang Thi Thử 5 Phút ▶</button>
      </div>
      ${renderOsceFlowchart(c, cf)}
      <div style="margin-top:14px;background:#fff;border:1.2px solid var(--c-d);border-radius:18px;padding:14px">
        <details class="deep" open>
          <summary>📄 Tóm tắt đề thi & Dữ kiện ban đầu</summary>
          <div class="deep-body">
            <p>${e(c.stem).replace(/\n/g, '<br>')}</p>
            <ul class="o-facts">${cf.facts.map(([a, b]) => `<li><b>${e(a)}</b>${e(b)}</li>`).join('')}</ul>
          </div>
        </details>
      </div>
    </div>`;
  } else if (oMode === 'exam') {
    mainContent = renderOsceExamView(c, cf, steps, ticks, pct);
  } else {
    // Mode steps (Luyện từng bước)
    const stepBar = `<div class="o-steps">${steps.map((s, i) => { const its = s.items, done = its.length && its.every(x => ticks.has(x.i)); return `<button class="o-step ${i === oStep ? 'cur' : ''} ${done ? 'done' : ''}" data-st="${i}" title="${e(s.t)}"><span>${done ? '✓' : s.icon}</span><i>${i + 1}</i></button>`; }).join('')}</div>`;
    const facts = `<ul class="o-facts">${cf.facts.map(([a, b]) => `<li><b>${e(a)}</b>${e(b)}</li>`).join('')}</ul>`;
    const timer = `<div class="o-timer"><span class="timer" id="timer">${timeText()}</span><button id="timer-toggle" class="btn small">${timerRunning ? '⏸ Dừng' : '▶ Bắt đầu 5′'}</button><button id="timer-reset" class="btn small flat">↺</button></div>`;
    const stem = `<details class="deep"><summary>📄 Đề gốc (bản nhớ lại)</summary><div class="deep-body"><p>${e(c.stem).replace(/\n/g, '<br>')}</p>${(c.originalQuestions || []).length ? `<p><b>Câu hỏi:</b><br>${c.originalQuestions.map(q => '• ' + e(typeof q === 'string' ? q : q.text || q.prompt || '')).join('<br>')}</p>` : ''}<p class="status-note">${e(c.source?.file || '')}${c.source?.pages ? ' · trang ' + e(arr(c.source.pages).join(', ')) : ''}</p></div></details>`;
    const left = `<figure class="fig o-case">${renderOsceScene(c, st, oStep, cf)}<div class="o-top"><span class="badge ${cf.kind === 'tv' ? 'extra' : 'good'}">${cf.kind === 'tv' ? '💬 Trạm tư vấn' : '🚨 Trạm cấp cứu'}</span><span class="status-note">${e(c.source?.examLabel || '')}</span></div><h2 class="o-title">${cf.icon} ${e(c.title)}</h2>${facts}${c.vitals ? `<p class="vitals">${e(c.vitals)}</p>` : ''}${timer}${stem}</figure>`;

    let right = '';
    if (!last) {
      const done = st.items.filter(x => ticks.has(x.i)).length, hidden = oHidden.has(oStep);
      right = `<div class="o-panel">
        <div class="o-ph">
          <span class="o-pic">${st.icon}</span>
          <div><h3>${oStep + 1}. ${e(st.t)}</h3><small>⏱ ${e(st.secs)} · nhóm tiêu chí: ${e(PIL[st.pil] || '')}</small></div>
          <button class="btn small flat" id="o-hide-tog" style="margin-left:auto;font-size:12px">${hidden ? '💡 Mở gợi ý' : '🙈 Tự nhẩm (ẩn)'}</button>
        </div>
        <p class="o-goal">🎯 ${e(st.goal)}</p>

        <div class="o-script-card" style="margin:4px 0 8px">
          <div class="sh"><b>🎙️ Lời nói mẫu của Thủ khoa Y4:</b></div>
          <div class="o-script-body" style="font-size:12.5px">${getStepScript(c, st.id, cf)}</div>
        </div>

        <label class="o-say-l" for="o-note">🗣️ Bạn tự nói gì ở bước này? (Ghi lại ý chính):</label>
        <textarea id="o-note" data-note="${c.id}_${st.id}" maxlength="4000" placeholder="Luyện nói to thành tiếng, sau đó ghi chú lại...">${e(state.notes[c.id + '_' + st.id] || '')}</textarea>

        ${!hidden ? `<div class="o-hint">
          <div class="note lav"><span>💬</span><span>${e(st.say)}</span></div>
          <div class="o-checks">${st.items.map(x => `<label class="o-ck ${ticks.has(x.i) ? 'on' : ''}"><input type="checkbox" data-tick="${x.i}" ${ticks.has(x.i) ? 'checked' : ''}><span>${e(x.t)}</span></label>`).join('')}</div>
          <p class="o-prog">Bạn đã nói được <b>${done}/${st.items.length}</b> ý</p>
          <div class="note warn"><span>🚫</span><span><b>Đừng:</b> ${st.dont.map(e).join(' · ')}</span></div>
          <a class="text-btn" href="#/step/${st.lesson}">📚 Ôn lại bài liên quan ↗</a>
        </div>` : `<div class="note butter"><span>🙈</span><span>Đang ở chế độ <b>tự nhẩm</b>. Bạn hãy nói to thành tiếng ý chính, sau đó bấm <b>💡 Mở gợi ý</b> góc trên để tự chấm và đối chiếu nha.</span></div>`}
      </div>`;
    } else {
      const pil = {}; steps.forEach(s => s.items.forEach(x => { (pil[s.pil] ??= [0, 0])[1]++; if (ticks.has(x.i)) pil[s.pil][0]++; }));
      const ans = arr(getAnswer(c)), review = c.answerReview || {};
      right = `<div class="o-panel">
        <div class="o-ph"><span class="o-pic">✅</span><div><h3>Đối chiếu & tự chấm</h3><small>tự lượng giá, không phải điểm thi</small></div></div>
        <div class="o-score"><b>${pct()}%</b><span>ý đã nói</span></div>
        ${Object.entries(pil).map(([k, [a, b]]) => `<div class="o-bar"><span>${e(PIL[k])}</span><div><i style="width:${b ? a / b * 100 : 0}%"></i></div><b>${a}/${b}</b></div>`).join('')}
        <p class="status-note">Thiếu nhóm nào thì ôn lại bước đó. Không đạt điểm tự luyện không có nghĩa là trượt OSCE.</p>
        <button class="btn pink" id="answer-toggle">Mở đáp án nguồn & đối chiếu ↗</button>
      </div>`;
    }

    mainContent = `${stepBar}
      <div class="scene">
        <div class="viz">${left}<div class="say"><div id="mas">${mascot(last ? 'happy' : 'wow')}</div><div class="bub">${last ? 'Xong rồi! Xem điểm tự chấm bên phải nha.' : e(st.goal)}</div></div></div>
        <aside class="ctl">${right}</aside>
      </div>
      ${last ? `<section id="case-answer" hidden>${renderCaseAnswer(c, arr(getAnswer(c)), c.answerReview || {})}</section>` : ''}`;
  }

  const bottom = `<button class="btn flat" id="prev" data-go ${oStep === 0 || oMode !== 'steps' ? 'disabled' : ''}>◀ Trước</button><div class="mid"><div class="dots">${steps.map((s, i) => `<i class="${i === oStep ? 'cur' : ''}"></i>`).join('')}</div><span class="sign">${SIGN}</span></div><button class="btn primary" id="next" data-go>${last ? '✓ Xong · về danh sách' : 'Tiếp ▶'}</button>`;
  setView('lesson-mode', c.topic === 'tolac' ? 'mint' : c.topic === 'nbn' ? 'butter' : 'lavender', `🩺 ${cf.kind === 'tv' ? 'Tư vấn' : 'Cấp cứu'} · ${oMode === 'flowchart' ? 'Bản đồ tư duy' : oMode === 'exam' ? 'Thi thử 5′' : `Bước ${oStep + 1}/${steps.length}`}`, oMode === 'steps' ? ((oStep + 1) / steps.length * 100) : 100);
  renderRail();
  setBar(bottom);

  $('#stage').innerHTML = `<article class="lesson osce">
    <div class="head"><h1 class="ttl"><mark>${e(c.title)}</mark></h1></div>
    ${modeSwitcher}
    ${mainContent}
  </article>`;

  // Events for Mode Switcher
  $$('[data-omode]').forEach(btn => {
    btn.onclick = () => {
      oMode = btn.dataset.omode;
      sound('pop');
      renderCase(id);
      $('#stage').scrollTop = 0;
    };
  });

  const goExam = $('#go-exam-btn');
  if (goExam) goExam.onclick = () => { oMode = 'exam'; sound('pop'); renderCase(id); $('#stage').scrollTop = 0; };

  // Events for exam mode
  if (oMode === 'exam') {
    $('#exam-timer-toggle').onclick = () => {
      if (timerRunning) stopTimer();
      else startTimer();
      $('#exam-timer-toggle').textContent = timerRunning ? '⏸ Tạm dừng' : '▶ Tiếp tục thi';
      $('#exam-timer-toggle').style.background = timerRunning ? '#475569' : '#0284c7';
    };
    $('#exam-timer-reset').onclick = () => {
      stopTimer();
      remaining = (c.minutes || 5) * 60;
      updateTimer();
      $('#exam-timer-toggle').textContent = '▶ Bắt đầu thi';
      $('#exam-timer-toggle').style.background = '#0284c7';
    };
    const eat = $('#exam-answer-toggle');
    if (eat) {
      eat.onclick = () => {
        const a = $('#case-answer-exam');
        a.hidden = !a.hidden;
        eat.textContent = a.hidden ? 'Mở đáp án nguồn & đối chiếu ↗' : 'Gấp đáp án lại ↑';
        sound();
        if (!a.hidden) a.scrollIntoView({ behavior: 'smooth' });
      };
    }
    $$('[data-rubric-row]').forEach(chk => {
      chk.onchange = () => {
        const rowId = chk.dataset.rubricRow;
        const cur = new Set(state.rubrics[c.id + '_exam'] || []);
        if (chk.checked) cur.add(rowId);
        else cur.delete(rowId);
        state.rubrics[c.id + '_exam'] = [...cur];
        save();
        sound(chk.checked ? 'pop' : 'tick');
        renderCase(id);
      };
    });
  }

  // Events for step mode
  if (oMode === 'steps') {
    const go2 = n => { oStep = clamp(n, 0, steps.length - 1); renderCase(id); $('#stage').scrollTop = 0; };
    $$('.o-step').forEach(b => b.onclick = () => go2(+b.dataset.st));
    $('#prev').onclick = () => go2(oStep - 1);
    $('#next').onclick = () => { if (last) { go('#/osce'); return; } sound('page'); go2(oStep + 1); };
    window.__next = () => $('#next').click(); window.__prev = () => $('#prev').click();
    const ht = $('#o-hide-tog'); if (ht) ht.onclick = () => { if (oHidden.has(oStep)) oHidden.delete(oStep); else oHidden.add(oStep); sound('pop'); renderCase(id); };
    $$('[data-tick]').forEach(ch => ch.addEventListener('change', () => { const i = +ch.dataset.tick, cur = new Set(state.rubrics[c.id] || []); ch.checked ? cur.add(i) : cur.delete(i); state.rubrics[c.id] = [...cur].filter(n => n < 100); save(); sound(ch.checked ? 'pop' : 'tick'); const doneAll = st.items.every(x => cur.has(x.i)); if (ch.checked && doneAll) { sound('chime'); toast(rand(PRAISE) + ' Đủ ý bước này!'); burst(ch); } renderCase(id); }));
    $$('[data-note]').forEach(t => t.addEventListener('input', () => { state.notes[t.dataset.note] = t.value; save(); }));
    const tt = $('#timer-toggle');
    if (tt) tt.onclick = () => { if (timerRunning) stopTimer(); else startTimer(); tt.textContent = timerRunning ? '⏸ Dừng' : '▶ Tiếp tục'; };
    const tr = $('#timer-reset');
    if (tr) tr.onclick = () => { stopTimer(); remaining = (c.minutes || 5) * 60; updateTimer(); if (tt) tt.textContent = '▶ Bắt đầu 5′'; };
    const at = $('#answer-toggle'); if (at) at.onclick = () => { const a = $('#case-answer'); a.hidden = !a.hidden; at.textContent = a.hidden ? 'Mở đáp án nguồn & đối chiếu ↗' : 'Gấp đáp án lại ↑'; sound(); if (!a.hidden) a.scrollIntoView({ behavior: 'smooth' }); };
  }

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
function updateTimer(){
  const t = $('#timer'); if (t) { t.textContent = timeText(); t.classList.toggle('expired', remaining === 0); }
  const ec = $('#exam-clock');
  if (ec) {
    ec.textContent = timeText();
    ec.classList.toggle('warn', remaining > 0 && remaining <= 120);
    ec.classList.toggle('danger', remaining > 0 && remaining <= 60);
    ec.classList.toggle('expired', remaining === 0);
  }
  const pn = $('#pacing-now');
  if (pn) {
    const elapsed = Math.max(0, 300 - remaining), pct = Math.min(100, (elapsed / 300) * 100);
    pn.style.left = pct + '%';
  }
}
function startTimer(){
  if (remaining <= 0) { toast('Hết giờ tự luyện; bạn có thể đặt lại hoặc mở đáp án.'); return; }
  timerRunning = true;
  caseTimer = setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    updateTimer();
    if (!remaining) {
      stopTimer();
      sound('chime');
      toast('⏰ Đã hết 5 phút thi trạm! Hãy hoàn tất câu nói và đối chiếu với đáp án/rubric.');
      if ($('#timer-toggle')) $('#timer-toggle').textContent = 'Đã hết giờ';
      if ($('#exam-timer-toggle')) {
        $('#exam-timer-toggle').textContent = 'Đã hết giờ';
        $('#exam-timer-toggle').style.background = '#dc2626';
      }
    }
  }, 1000);
}
function stopTimer(){ if (caseTimer) clearInterval(caseTimer); caseTimer = null; timerRunning = false; }
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
let traState = { hr: 95, sbp: 110, oxyPha: 20, oxyMl: 125, pphVol: 350, pphAbn: true };

function renderTra() {
  setView('page-mode', 'butter'); pageBar();
  const si = (traState.hr / Math.max(1, traState.sbp)).toFixed(2);
  let siBg = '#dcfce7', siCol = '#15803d', siTxt = 'Bình thường / Còn bù (SI < 0.9)', siRec = 'Sinh hiệu trong giới hạn. Lưu ý: SI thấp KHÔNG loại trừ chảy máu trong (NBN, vỡ tử cung).';
  if (si >= 1.4) {
    siBg = '#fce7f3'; siCol = '#9d174d'; siTxt = '🚨 Sốc mất máu nặng đe dọa tử vong (Độ IV)';
    siRec = 'NGUY KỊCH! Kích hoạt quy trình truyền máu khối lượng lớn (MTP 1:1:1), can thiệp phẫu thuật khẩn cấp.';
  } else if (si >= 1.0) {
    siBg = '#fee2e2'; siCol = '#b91c1c'; siTxt = '⚠️ Sốc mất máu mức độ II–III (SI ≥ 1.0)';
    siRec = 'KÍCH HOẠT BÁO ĐỘNG ĐỎ PPH! Lập 2 đường truyền lớn, bù dịch ấm, kích hoạt truyền máu, tìm 4T.';
  } else if (si >= 0.9) {
    siBg = '#ffedd5'; siCol = '#c2410c'; siTxt = '⚡ Báo động sớm (FIGO 2022 / WHO 2025)';
    siRec = 'Khả năng bù trừ đang cạn kiệt. Gọi hỗ trợ, lập đường truyền lớn, chuẩn bị sẵn sàng máu.';
  }

  let oxyGiot = 0, oxyIuH = 0, oxyNote = '';
  if (traState.oxyPha === 10) {
    oxyNote = 'Liều nạp khẩn WHO: 10 IU IV chậm 1–2 phút hoặc pha 100 mL dịch truyền chảy trong 10–15 phút.';
  } else {
    oxyGiot = Math.round(traState.oxyMl * 20 / 60);
    oxyIuH = (traState.oxyMl * traState.oxyPha / 500).toFixed(1);
    oxyNote = `Tương đương ${(traState.oxyPha * 1000 / 500 * traState.oxyMl / 60).toFixed(0)} mIU/phút. Dùng tối đa 40 IU duy trì, không bolus nhanh trực tiếp tĩnh mạch (nguy cơ tụt HA).`;
  }

  const isTrigger = traState.pphVol >= 500 || (traState.pphVol >= 300 && traState.pphAbn);
  const isSevere = traState.pphVol >= 1000;
  let trgBg = '#f0fdf4', trgCol = '#166534', trgTitle = 'Chưa đạt trigger can thiệp PPH', trgAction = 'Tiếp tục theo dõi lượng máu mất đo được qua khay/túi và sinh hiệu mẹ mỗi 15 phút.';
  if (isSevere) {
    trgBg = '#fce7f3'; trgCol = '#9d174d'; trgTitle = '🚨 BĂNG HUYẾT SAU SINH NẶNG (≥ 1000 mL)';
    trgAction = 'Báo động đỏ toàn viện! Hồi sức tích cực, truyền máu khẩn, leo thang can thiệp phẫu thuật / thủ thuật.';
  } else if (isTrigger) {
    trgBg = '#fee2e2'; trgCol = '#b91c1c'; trgTitle = '🚨 ĐẠT TRIGGER KHỞI TRỊ BHSS (WHO 2025)';
    trgAction = 'KÍCH HOẠT BUNDLE ĐIỀU TRỊ PPH TRONG ≤ 15 PHÚT (Xoa đáy TC + Oxytocin IV + TXA 1g + 2 đường truyền lớn + tìm 4T)!';
  }

  $('#stage').innerHTML = `<div class="page-head"><div class="eyebrow">📌 TRA NHANH ĐI TRỰC</div><h1>Số & ngưỡng <em>hay dùng</em></h1><p>Mỗi dòng có link về bài để hiểu vì sao. Kèm 3 máy tính phản xạ tại giường giúp ra quyết định nhanh khi đi trực.</p></div>
<section class="tra-tools">
  <div class="tra-tbox">
    <div class="tra-th"><span>⚡ CÔNG CỤ PHẢN XẠ ĐI TRỰC</span><h3>Tính nhanh tại giường · Ra quyết định cấp cứu</h3></div>
    <div class="tra-tgrid">
      <div class="tra-card">
        <h4>💓 Máy tính Shock Index (SI)</h4>
        <small>SI = HR ÷ HATT · Báo động sốc mất máu trước khi tụt áp</small>
        <div class="tc-row">
          <div class="tc-lbl"><span>Mạch mẹ (HR):</span><b>${traState.hr} bpm</b></div>
          <input type="range" id="tra-hr" min="60" max="160" value="${traState.hr}">
        </div>
        <div class="tc-row">
          <div class="tc-lbl"><span>Huyết áp tâm thu (HATT):</span><b>${traState.sbp} mmHg</b></div>
          <input type="range" id="tra-sbp" min="50" max="160" value="${traState.sbp}">
        </div>
        <div class="tc-res" style="background:${siBg};color:${siCol}">
          <div class="tc-num"><b>SI = ${si}</b><small>(${traState.hr} ÷ ${traState.sbp})</small></div>
          <b style="font-size:13px">${siTxt}</b>
          <div class="tc-desc">${siRec}</div>
        </div>
      </div>

      <div class="tra-card">
        <h4>💉 Liều truyền Oxytocin điều trị BHSS</h4>
        <small>Chai 500 mL dịch tinh thể · Dây truyền chuẩn 20 giọt/mL</small>
        <div class="tc-select">
          <button class="tc-btn ${traState.oxyPha === 20 ? 'active' : ''}" data-oxy="20">20 IU / 500 mL</button>
          <button class="tc-btn ${traState.oxyPha === 40 ? 'active' : ''}" data-oxy="40">40 IU / 500 mL</button>
          <button class="tc-btn ${traState.oxyPha === 10 ? 'active' : ''}" data-oxy="10">10 IU nạp khẩn</button>
        </div>
        ${traState.oxyPha !== 10 ? `
        <div class="tc-row">
          <div class="tc-lbl"><span>Tốc độ máy truyền (mL/h):</span><b>${traState.oxyMl} mL/h</b></div>
          <input type="range" id="tra-oxyml" min="60" max="250" step="5" value="${traState.oxyMl}">
        </div>
        <div class="tc-res" style="background:#eff6ff;color:#1e40af">
          <div class="tc-num"><b>${oxyGiot} giọt/phút</b><small>≈ ${oxyIuH} IU/giờ</small></div>
          <div class="tc-desc">${oxyNote}</div>
        </div>
        ` : `
        <div class="tc-res" style="background:#fef3c7;color:#92400e">
          <div class="tc-num"><b>10 IU IV</b><small>trong 1–2 phút hoặc truyền 5–10′</small></div>
          <div class="tc-desc">${oxyNote}</div>
        </div>`}
      </div>

      <div class="tra-card">
        <h4>🎯 Trigger khởi trị BHSS (WHO 2025)</h4>
        <small>Dựa trên lượng máu đo khách quan + dấu hiệu huyết động</small>
        <div class="tc-row">
          <div class="tc-lbl"><span>Lượng máu đo được (drape/khay):</span><b>${traState.pphVol} mL</b></div>
          <input type="range" id="tra-vol" min="100" max="1500" step="50" value="${traState.pphVol}">
        </div>
        <label class="tc-check">
          <input type="checkbox" id="tra-abn" ${traState.pphAbn ? 'checked' : ''}>
          <span>Bất thường huyết động (Mạch>100 / HATT<90 / SI>1.0)</span>
        </label>
        <div class="tc-res" style="background:${trgBg};color:${trgCol}">
          <b style="font-size:13px">${trgTitle}</b>
          <div class="tc-desc">${trgAction}</div>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="tra">${TRA.map(([ic, t, col, rows]) => `<section class="tra-g c-${col}"><h2>${ic} ${e(t)}</h2>${rows.map(([a, b, id]) => `<a class="tra-r" href="#/step/${id}"><b>${e(a)}</b><span>${e(b)}</span><i>↗</i></a>`).join('')}</section>`).join('')}</div>`;

  bindTraTools();
  renderRail();
}

function bindTraTools() {
  const hr = $('#tra-hr'), sbp = $('#tra-sbp'), oxyml = $('#tra-oxyml'), vol = $('#tra-vol'), abn = $('#tra-abn');
  if (hr) hr.oninput = () => { traState.hr = +hr.value; renderTra(); };
  if (sbp) sbp.oninput = () => { traState.sbp = +sbp.value; renderTra(); };
  if (oxyml) oxyml.oninput = () => { traState.oxyMl = +oxyml.value; renderTra(); };
  if (vol) vol.oninput = () => { traState.pphVol = +vol.value; renderTra(); };
  if (abn) abn.onchange = () => { traState.pphAbn = abn.checked; renderTra(); };
  $$('[data-oxy]').forEach(btn => btn.onclick = () => { traState.oxyPha = +btn.dataset.oxy; renderTra(); });
}


// ───────── mở chương: 3 mục tiêu + lộ trình (để thấy mạch logic cả chương trước khi học)
const GOALS = {
  goc: ['Vẽ được **đường đi của máu**: mẹ → hồ máu → bé', 'Hiểu **cơ co rút + đông máu** cầm máu sau sinh ra sao', 'Đọc **tưới máu** của mẹ, không chỉ nhìn HA'],
  soc: ['Nhận ra **sốc còn bù** trước khi tụt áp', 'Dùng **Shock Index** và các mức mất máu đúng cách', 'Hồi sức + cầm máu **song song**, tránh tam giác chết'],
  duphong: ['Tìm **yếu tố nguy cơ** trước sinh, chuẩn bị đúng mức', 'Làm đúng **giai đoạn III**: thuốc co hồi, kẹp rốn, kéo dây rốn', '**Đo máu mất khách quan**, biết khi nào khởi trị'],
  pph: ['Gọi tên **4T** và tìm đúng nguyên nhân từng ca', 'Chạy **bundle**, chọn thuốc theo chống chỉ định', 'Biết các **bước leo thang**: ép, bóng chèn, phẫu thuật'],
  ntd: ['Phân biệt **tiền đạo / bám thấp**, hiểu vì sao nhau "di chuyển"', 'Khám **an toàn** (TVS), biết việc **cấm** (ngón tay)', 'Nhận ra **PAS**, lên kế hoạch và tư vấn người bệnh'],
  nbn: ['Giải thích **máu tụ sau nhau → mất oxy → tim thai chậm**', 'Chẩn đoán bằng **lâm sàng**, biết giới hạn siêu âm & D-dimer', 'Xử trí **DIC, Couvelaire** và chọn đường sinh'],
  votc: ['Phân biệt **nứt hay vỡ**, **có sẹo hay chưa**', 'Nhận **dấu dọa vỡ** và dừng tăng co', 'Nhận diện qua **tim thai trước**; hồi sức + mổ cùng lúc'],
  tolac: ['Phân biệt **TOLAC** (lựa chọn) và **VBAC** (kết quả)', '**Chọn người** phù hợp, tư vấn bằng **số tuyệt đối**', 'Biết **điều kiện lối thoát** khi theo dõi TOLAC'],
  vai: ['Hiểu **vai mắc ở đâu** và vì sao kéo mạnh là sai', 'Làm đúng **thứ tự thủ thuật**, nhớ 3 việc cấm', 'Nhận **hậu quả cho bé và mẹ** + ghi hồ sơ đủ'],
  afe: ['Giải thích **AFE** bằng viêm + co thắt mạch phổi', 'Hồi sức AFE: **tránh quá tải dịch**, đội đa chuyên khoa', '**Phân biệt các loại sốc**, trả lời OSCE có khung']
};
function renderChuong(mid) {
  const m = M.find(x => x.id === mid); if (!m) { renderNotFound(); return; }
  const ls = moduleLessons(m), nPages = ls.reduce((n, l) => n + pagesOf(l).length, 0), mins = Math.max(3, Math.round(nPages * .6)), done = ls.filter(l => state.done.includes(l.id)).length;
  const nxt = ls.find(l => !state.done.includes(l.id)) || ls[0], first = ls[0], mi = M.indexOf(m);
  setView('lesson-mode', m.color, `${MODICON[m.id]} ${m.short} · mở chương`, 0);
  $('#stage').innerHTML = `<article class="lesson chuong"><section class="chero"><div class="cic">${MODICON[m.id]}</div><div class="ctx"><small>Chương ${mi + 1}/${M.length} · ${nPages} trang · khoảng ${mins} phút</small><h1><mark>${e(m.title)}</mark></h1><p>${e(m.desc)}</p></div></section>
<div class="cgrid"><section class="cgoals"><h2>🎯 Xong chương này bạn sẽ…</h2><ol>${(GOALS[m.id] || []).map(g => `<li><i>✓</i><span>${md(g)}</span></li>`).join('')}</ol><p class="cnote">Mỗi trang = 1 hình + 1 việc để chạm/kéo + 1 chuỗi <b>Thấy → Vì → Nên</b>. Cuối bài có 🧠 Thử nhớ.</p></section>
<section class="croad"><h2>🗺️ Lộ trình ${ls.length} bài</h2><ol>${ls.map((l, i) => { const ps = BEATS()[l.id] ? BEATS()[l.id].map(b => b.t) : []; return `<li class="${state.done.includes(l.id) ? 'done' : ''}"><a href="#/step/${l.id}"><i>${state.done.includes(l.id) ? '✓' : i + 1}</i><span><b>${e(l.title)}</b>${ps.length ? `<small>${ps.map(e).join(' → ')}</small>` : ''}</span></a></li>`; }).join('')}</ol></section></div></article>`;
  const prevHash = mi ? '#/chot/' + M[mi - 1].id : '#/map';
  setBar(`<a class="btn flat" href="#/map" data-go>🏠 Bản đồ</a><span class="mid"><span class="sign">${SIGN}</span></span><a class="btn primary" id="cstart" href="#/step/${nxt.id}" data-go>${done ? '▶ Học tiếp' : '▶ Bắt đầu chương'}</a>`);
  window.__next = () => { sound('page'); go('#/step/' + nxt.id); }; window.__prev = () => go('#/map');
}

// ───────── chốt chương: tự trả lời trong đầu rồi lật thẻ
function renderChot(mid) {
  const m = M.find(x => x.id === mid); if (!m) { renderNotFound(); return; }
  const ls = moduleLessons(m), mi = M.indexOf(m), nextM = M[mi + 1], target = nextM ? '#/step/' + moduleLessons(nextM)[0].id : '#/map';
  const done = new Set(); let ready = false;
  setView('lesson-mode', m.color, `${MODICON[m.id]} ${m.short} · chốt chương`, 100);
  $('#stage').innerHTML = `<article class="lesson"><div class="head"><h1 class="ttl"><mark>🃏 Chốt chương: ${e(m.short)}</mark></h1></div><div class="howto"><b>📝 Cách học</b><ol><li><span>Đọc câu hỏi, <b>tự trả lời trong đầu</b> trước</span></li><li><span>Bấm thẻ để <b>lật</b> xem đáp án</span></li><li><span>Lật bao nhiêu tuỳ bạn — sang bài tiếp bất cứ lúc nào</span></li></ol></div><div class="flips">${ls.map((l, i) => `<button class="fc" data-i="${i}"><span class="f1"><small>${i + 1}. ${e(l.title)}</small><b>${e(l.quiz.q)}</b><em>chạm để lật</em></span><span class="f2"><b>✓ ${e(l.quiz.options[l.quiz.answer])}</b><small>${e(l.quiz.explain)}</small></span></button>`).join('')}</div></article>`;
  const bar = () => setBar(`<a class="btn flat" href="${lessonHash(ls[ls.length - 1], pagesOf(ls[ls.length - 1]).slice(-1)[0])}" data-go>◀ Quay lại</a><div class="mid"><div class="dots">${ls.map((_, i) => `<i class="${done.has(i) ? 'done' : ''}"></i>`).join('')}</div><span class="sign">${SIGN}</span></div><button class="btn ${ready ? 'primary' : ''}" id="next" data-go>${nextM ? 'Bài tiếp: ' + e(nextM.short) + ' ▶' : '🏠 Về bản đồ'}</button>`);
  bar();
  const go2 = () => { sound(ready ? 'tada' : 'page'); go(target); };
  $('#stage').onclick = ev => { const c = ev.target.closest('.fc'); if (!c) return; c.classList.toggle('on'); done.add(+c.dataset.i); sound('pop'); if (!ready && done.size >= ls.length) { ready = true; toast(rand(PRAISE) + ' Chốt chương xong!'); burst(c); } bar(); $('#next').onclick = go2; };
  $('#next').onclick = go2; window.__next = go2; window.__prev = () => go(lessonHash(ls[ls.length - 1], pagesOf(ls[ls.length - 1]).slice(-1)[0]));
}
function pageBar() { setBar(`<a class="btn flat" href="#/map">🏠 Bản đồ</a><span class="mid"><span class="sign">${SIGN}</span></span><a class="btn primary" href="#/step/${state.last}">▶ Học tiếp</a>`); }
function route() {
  const hash = location.hash || '#/map';
  if (!hash.startsWith('#/')) { document.getElementById(hash.slice(1))?.scrollIntoView(); return; }
  const parts = hash.slice(2).split('/'), view = parts[0], id = parts[1];
  if (view !== 'case') { stopTimer(); currentCaseId = ''; }
  $$('dialog[open]').forEach(d => d.close()); stopRun(); window.__stopDemo?.(); window.__stopDemo = null; window.__next = window.__prev = null; $('#stage').onclick = null;
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
  else if (view === 'chuong') renderChuong(id);
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
window.ALL_SCREENS = () => ['#/map', ...M.map(m => '#/chuong/' + m.id), ...L.flatMap(l => pagesOf(l).map(p => lessonHash(l, p))), ...M.map(m => '#/chot/' + m.id), '#/tra', '#/osce', '#/osce/guide', ...(window.OSCE_CASES || []).map(c => '#/case/' + c.id)];
window.addEventListener('hashchange', route); window.addEventListener('beforeunload', stopTimer);
updateTop(); route();
})();
