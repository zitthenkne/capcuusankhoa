'use strict';
/* Bộ đồ nghề dùng chung cho trang tí hon (ZS.BK): chữ viền trắng, thẻ, ảnh, chỗ chạm, nhãn có đường chỉ, thẻ công tắc,
   dòng hạt chạy theo đường (máu, oxy), tim đập theo nhịp, giọt máu, khóa. Khung 560×350. */
(() => {
const ZS = window.ZS, { C, T } = ZS; ZS.beats = ZS.beats || {};
const I = 'assets/img/';
const Th = (x, y, t, o = {}) => T(x, y, t, { s: 14, ...o, x: 'stroke="#fff" stroke-width="4" stroke-linejoin="round" paint-order="stroke"' });
const card = (x, y, w, h, fill = '#fff', st = C.grid) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="${st}" stroke-width="1.2"/>`;
const pic = (f, x, y, w, h, extra = '') => `<image href="${I + f}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" ${extra}/>`;
// chỗ chạm: elip đứt nét nhấp nháy khi chưa chọn; st 1 = đúng, -1 = sai
const tap = (set, cx, cy, rx, ry, st = 0) => `<g class="tap" data-set="${set}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${st > 0 ? C.green : st < 0 ? C.red : '#fff'}" fill-opacity="${st ? .2 : .01}" stroke="${st > 0 ? C.green : st < 0 ? C.red : C.soft}" stroke-width="2.2" stroke-dasharray="${st ? '' : '6 5'}"${st ? '' : ' class="pulse"'}/></g>`;
const call = (x, y, tx, ty, t, col = C.ink, a = 'start', s = 14) => `<path d="M${x} ${y} L${tx} ${ty}" stroke="${col}" stroke-width="1.6" fill="none"/><circle cx="${x}" cy="${y}" r="3.2" fill="${col}"/>` + Th(tx + (a === 'start' ? 5 : a === 'end' ? -5 : 0), ty + 5, t, { a, c: col, s });
// thẻ bật/tắt trong hình: công tắc mini ở góc dưới phải
const tcard = (set, x, y, w, h, on, lines, col = C.mint) => `<g class="tap" data-set="${set}">${card(x, y, w, h, on ? col : '#fff', on ? C.soft : C.grid)}${lines.map((t, i) => T(x + 14, y + 22 + i * 17, t, { a: 'start', s: i ? 12 : 14.5, c: i ? C.mute : C.ink })).join('')}${ZS.sw(x + w - 36, y + h - 22, on, C.green)}</g>`;
// thẻ chọn (bấm để xem): viền đứt khi chưa xem, ✓ khi đã xem
const pcard = (set, x, y, w, h, seen, on, lines, col = C.lav) => `<g class="tap" data-set="${set}">${card(x, y, w, h, on ? col : '#fff', on ? C.soft : seen ? C.mintD : C.grid)}${lines.map((t, i) => T(x + w / 2, y + 24 + i * 18, t, { s: i ? 12.5 : 14.5, c: i ? C.mute : C.ink })).join('')}${seen ? T(x + w - 12, y + 18, '✓', { s: 13, c: C.green }) : ''}</g>`;
const lockIcon = (x, y, open) => `<g transform="translate(${x} ${y})"><rect x="-11" y="-2" width="22" height="17" rx="4" fill="${open ? C.green : C.red}"/><path d="M-6 -2 V-7 a6 6 0 0 1 12 0 ${open ? 'V-9' : 'V-2'}" fill="none" stroke="${open ? C.green : C.red}" stroke-width="3"/></g>`;
// dòng hạt chạy theo đường (SMIL animateMotion, chạy liên tục): n hạt, dur giây/vòng
const flow = (d, n, col, dur = 3, r = 4, o = {}) => n <= 0 ? '' : [...Array(n)].map((_, i) => `<circle r="${r}" fill="${col}" ${o.st ? `stroke="${o.st}" stroke-width="1"` : ''} opacity="${o.op ?? .95}"><animateMotion dur="${dur}s" repeatCount="indefinite" begin="${(-i * dur / n).toFixed(2)}s" path="${d}"/></circle>`).join('');
// hồng cầu chạy theo đường (hình đĩa lõm)
const rbcFlow = (d, n, dur = 3) => n <= 0 ? '' : [...Array(n)].map((_, i) => `<g><ellipse rx="7" ry="5" fill="#e5484d" stroke="#b8323a" stroke-width="1"/><ellipse rx="3.4" ry="2.2" fill="#c43a40"/><animateMotion dur="${dur}s" repeatCount="indefinite" begin="${(-i * dur / n).toFixed(2)}s" path="${d}" rotate="auto"/></g>`).join('');
// tim đập theo nhịp (bpm), to/nhỏ theo nhát bóp (k)
const heart = (x, y, sz, bpm, col = C.red, k = 1) => `<g transform="translate(${x} ${y}) scale(${sz / 40})"><g class="beat" style="animation-duration:${(60 / Math.max(30, bpm)).toFixed(2)}s"><path d="M0 34 C-40 6 -30 -26 -10 -22 C-4 -20 -1 -16 0 -12 C1 -16 4 -20 10 -22 C30 -26 40 6 0 34Z" transform="scale(${k})" fill="${col}" stroke="${C.redD}" stroke-width="2"/></g></g>`;
const drops = (x, y, n, k = .8, gap = 16) => [...Array(Math.max(0, n))].map((_, i) => ZS.drop(x + (i - (n - 1) / 2) * gap, y + (i % 2) * 10, k, 'drip')).join('');
// đồng hồ số kiểu monitor
const vital = (x, y, lab, val, col, w = 120) => `<rect x="${x}" y="${y}" width="${w}" height="46" rx="10" fill="#1f1d2b"/>${T(x + 10, y + 17, lab, { a: 'start', s: 11.5, c: '#a9a3c7' })}${T(x + w - 10, y + 38, val, { a: 'end', s: 22, c: col })}`;
const verdict = (x, y, w, ok, a, b) => `<rect x="${x}" y="${y}" width="${w}" height="${b ? 62 : 44}" rx="16" fill="${ok ? C.mint : '#ffd0d8'}"/>` + T(x + w / 2, y + 28, a, { s: 16, c: ok ? C.green : C.redD }) + (b ? T(x + w / 2, y + 49, b, { s: 12.5, c: C.mute }) : '');
// ảnh + lớp tô màu theo chính hình người (lvl 0–1), thay cho ô chữ nhật phủ lên
const tintPic = (f, x, y, w, h, lvl, flt = 'lanh') => pic(f, x, y, w, h) + (lvl > 0 ? `<g opacity="${Math.min(1, lvl).toFixed(2)}" filter="url(#${flt})">${pic(f, x, y, w, h)}</g>` : '');
// người đang ngồi dậy: nửa trên thẳng đứng, nửa dưới che bằng chăn (cắt ở eo)
const sitPic = (x, y, h) => { const k = h / 600; return `<svg x="${x}" y="${y}" width="${(297 * k).toFixed(1)}" height="${h}" viewBox="0 0 297 600"><image href="${I}sv-phu-nu.png" width="297" height="1060"/></svg><rect x="${x - 8}" y="${(y + 470 * k).toFixed(1)}" width="${(297 * k + 16).toFixed(1)}" height="${(130 * k + 6).toFixed(1)}" rx="10" fill="#ebe4ff" stroke="#c3b0fb" stroke-width="1.2"/><path d="M${x - 2} ${(y + 500 * k).toFixed(1)} h${(297 * k + 4).toFixed(1)}" stroke="#c3b0fb" stroke-width="1" stroke-dasharray="4 4"/>`; };
// nhãn số kéo trượt ngay trong hình: rê ngang để đổi (data-scrub); drag: điểm kéo trực tiếp (data-drag, lưu k+'x', k+'y')
const scrub = (k, val, min, max, step, unit, x, y, col = '#fff7d6') => `<g class="scr" data-scrub="${k}:${min}:${max}:${step}"><rect x="${x - 62}" y="${y - 17}" width="124" height="34" rx="17" fill="${col}" stroke="#e29a1c" stroke-width="1.6" stroke-dasharray="4 3"/>${T(x - 44, y + 6, '⇄', { s: 15, c: '#b8860b' })}${T(x + 8, y + 7, `${val}${unit}`, { s: 18 })}</g>`;
const drag = (k, x, y, r, lab, bounds, col = '#ff8fa8') => `<g class="drg" data-drag="${k}:${bounds.join(':')}"><circle cx="${x}" cy="${y}" r="${r + 7}" fill="${col}" opacity=".25" class="pulse"/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="#fff" stroke-width="2.4"/>${lab ? T(x, y + 5, lab, { s: 14, c: '#fff' }) : ''}</g>`;
const seen = (s, k) => (s.seen || '').includes(k + ','), markSeen = (s, k) => { if (k && !seen(s, k)) s.seen = (s.seen || '') + k + ','; };
// ───── Hỏi nhanh Đúng/Sai: thẻ lớn từng câu + hình chủ đề; chạm ✓ Đúng / ✗ Sai → thẻ hiện kết quả và LÝ DO; chạm số để nhảy câu bất kỳ
const QART = { 'bv-ndq': ['🚨', 'sv-monitor.png'], 'bt-q1': ['🛤️', 'sv-tu-cung.png'], 'bt-q2': ['📋', 'sv-tu-cung.png'], 'bt-q3': ['👀', 'sv-monitor.png'], 'ba-q': ['🫁', 'sv-tim.png'], 'ba-q2': ['🔍', 'sv-hong-cau.png'], 'bb-non': ['🌩️', 'sv-nhau.png'], 'bb-xtq': ['🩺', 'sv-thai-tu-cung.png'], 'bn-khq': ['🩻', 'sv-sieu-am.png'], 'bp-txaq': ['💊', 'sv-bom-tiem.png'], 'bp-tisq': ['🧩', 'sv-nhau.png'], 'bp-dicq': ['🩸', 'sv-dong-mau.png'], 'bs-siq': ['🚦', 'sv-monitor.png'], 'bs-goi': ['🧪', 'sv-dich-truyen.png'], 'bo-bay': ['💉', 'sv-bom-tiem.png'], 'bq-bay': ['🌡️', 'sv-bom-tiem.png'] };
const tfKit = (name, cards, sayDone, sayStart, OPT = {}) => {
  const N = cards.length, art = QART[name] || [], pf = OPT.pic || art[1], ic = OPT.icon || art[0] || '🤔', ask = OPT.ask || 'Đúng hay sai?';
  const A = s => String(s.ans || '').padEnd(N, '-').slice(0, N), allDone = s => !A(s).includes('-'), good = (r, j) => r !== '-' && (r === 'T') === cards[j][1];
  return ZS.kit(name, {
    init: () => ({ ans: '-'.repeat(N), cur: 0, pick: '' }), ui: () => [], vbPhone: '130 0 300 350',
    after: (s, k) => { const a = A(s).split(''); if (k === 'pick') { if (a[s.cur] === '-' && (s.pick === 'T' || s.pick === 'F')) { a[s.cur] = s.pick; s.ans = a.join(''); } s.pick = ''; }
      else if (k === 'go') s.cur = Math.max(0, Math.min(N - 1, +s.go || 0));
      else if (k === 'nx') { const nx = [...Array(N).keys()].map(i => (s.cur + 1 + i) % N).find(i => A(s)[i] === '-'); s.cur = nx != null ? nx : Math.min(N - 1, s.cur + 1); } },
    goal: allDone,
    solution: () => cards.flatMap(([, ok], i) => ['pick=' + (ok ? 'T' : 'F'), ...(i < N - 1 ? ['nx=1'] : [])]),
    draw: s => {
      const nar = typeof innerWidth !== 'undefined' && innerWidth <= 700, a = A(s), i = Math.min(N - 1, s.cur || 0), [text, ok, why] = cards[i], r = a[i], ans = r !== '-', right = good(r, i), done = allDone(s);
      const fill = !ans ? '#fff' : right ? C.mint : '#ffe3e8', stk = !ans ? C.grid : right ? C.mintD : '#f2a1b0', verdict = (right ? '✓ Chuẩn! ' : '✗ Chưa đúng · ') + (ok ? 'câu này ĐÚNG' : 'câu này SAI'), vcol = right ? C.green : C.redD;
      let o = '';
      if (!nar) {
        const x0 = pf ? 176 : 44;
        o += `<rect x="20" y="58" width="520" height="196" rx="22" fill="${fill}" stroke="${stk}" stroke-width="1.6"/>` + (pf ? pic(pf, 36, 72, 124, 168) : '') + T(pf ? 176 : 530, 80, `Câu ${i + 1}/${N}`, { a: pf ? 'start' : 'end', s: 12.5, c: C.mute });
        if (!ans) { const L = ZS.wrap(text, pf ? 30 : 44), y0 = 150 - (L.length - 1) * 14;
          o += `<g class="fadein">${L.map((l, j) => T(pf ? x0 : 280, y0 + j * 28, l, { a: pf ? 'start' : 'middle', s: 20 })).join('')}</g>` + T(pf ? x0 : 280, 236, `${ic} ${ask}`, { a: pf ? 'start' : 'middle', s: 14, c: C.soft }); }
        else { const L = ZS.wrap(text, pf ? 42 : 62).slice(0, 3), W = ZS.wrap(why || '', pf ? 40 : 58).slice(0, 4), vy = 96 + L.length * 19 + 10;
          o += `<g class="fadein">${L.map((l, j) => T(x0, 100 + j * 19, l, { a: 'start', s: 14.5, c: C.mute })).join('')}${T(x0, vy + 14, verdict, { a: 'start', s: 17, c: vcol })}${W.map((l, j) => T(x0, vy + 40 + j * 19, l, { a: 'start', s: 14.5 })).join('')}</g>`; }
        if (done) o += T(280, 304, `🎉 Xong ${N} câu — chạm số bên trên để xem lại câu khác`, { s: 13.5, c: C.green });
        else if (!ans) o += `<g class="tap" data-set="pick=T"><rect x="60" y="272" width="205" height="50" rx="25" fill="${C.mint}" stroke="${C.mintD}" stroke-width="2"/>${T(162, 304, '✓ Đúng', { s: 20, c: C.green })}</g><g class="tap" data-set="pick=F"><rect x="295" y="272" width="205" height="50" rx="25" fill="#ffe3e8" stroke="#f2a1b0" stroke-width="2"/>${T(397, 304, '✗ Sai', { s: 20, c: C.redD })}</g>`;
        else o += `<g class="tap" data-set="nx=1"><rect x="160" y="272" width="240" height="50" rx="25" fill="${C.lav}" stroke="${C.lavD}" stroke-width="2"/>${T(280, 304, 'Câu tiếp ▶', { s: 19, c: C.ink })}</g>`;
      } else {
        // điện thoại: cột hẹp 300 đơn vị (viewBox cắt 130–430) → chữ to, hình ở trên
        o += `<rect x="134" y="56" width="292" height="214" rx="20" fill="${fill}" stroke="${stk}" stroke-width="1.6"/>` + T(146, 76, `Câu ${i + 1}/${N}`, { a: 'start', s: 12.5, c: C.mute });
        if (!ans) { const L = ZS.wrap(text, 24).slice(0, 4), y0 = (pf ? 168 : 132) - (pf ? 0 : (L.length - 1) * 12);
          o += `<g class="fadein">${pf ? pic(pf, 230, 84, 100, 70) : ''}${L.map((l, j) => T(280, y0 + j * 25, l, { s: 19 })).join('')}</g>` + T(280, 258, `${ic} ${ask}`, { s: 13.5, c: C.soft }); }
        else { const L = ZS.wrap(text, 38).slice(0, 3), W = ZS.wrap(why || '', 36).slice(0, 5), vy = 92 + L.length * 18 + 12;
          o += `<g class="fadein">${L.map((l, j) => T(146, 96 + j * 18, l, { a: 'start', s: 13.5, c: C.mute })).join('')}${T(146, vy + 12, verdict, { a: 'start', s: 16, c: vcol })}${W.map((l, j) => T(146, vy + 36 + j * 19, l, { a: 'start', s: 14.5 })).join('')}</g>`; }
        if (done) o += T(280, 304, `🎉 Xong ${N} câu — chạm số để xem lại`, { s: 13.5, c: C.green });
        else if (!ans) o += `<g class="tap" data-set="pick=T"><rect x="140" y="282" width="134" height="46" rx="23" fill="${C.mint}" stroke="${C.mintD}" stroke-width="2"/>${T(207, 312, '✓ Đúng', { s: 19, c: C.green })}</g><g class="tap" data-set="pick=F"><rect x="286" y="282" width="134" height="46" rx="23" fill="#ffe3e8" stroke="#f2a1b0" stroke-width="2"/>${T(353, 312, '✗ Sai', { s: 19, c: C.redD })}</g>`;
        else o += `<g class="tap" data-set="nx=1"><rect x="170" y="282" width="220" height="46" rx="23" fill="${C.lav}" stroke="${C.lavD}" stroke-width="2"/>${T(280, 312, 'Câu tiếp ▶', { s: 18, c: C.ink })}</g>`;
      }
      const tw = 34, gap = 8, tx = 280 - (N * tw + (N - 1) * gap) / 2;
      o += cards.map((_, j) => { const x = tx + j * (tw + gap), rj = a[j], okj = good(rj, j), cur = j === i;
        return `<g class="tap" data-set="go=${j}"><rect x="${x}" y="14" width="${tw}" height="30" rx="10" fill="${rj === '-' ? (cur ? C.lav : '#fff') : okj ? C.mint : '#ffd0d8'}" stroke="${cur ? C.soft : C.grid}" stroke-width="${cur ? 2.2 : 1.2}"/>${T(x + tw / 2, 34, rj === '-' ? j + 1 : okj ? '✓' : '✗', { s: 14, c: rj === '-' ? C.ink : okj ? C.green : C.redD })}</g>`; }).join('');
      return o;
    },
    say: s => { const a = A(s), i = Math.min(N - 1, s.cur || 0), r = a[i];
      if (allDone(s)) return ['worry', sayDone];
      if (r === '-') return ['happy', `Câu ${i + 1}/${N}. ${ask} Chạm **✓ Đúng** hoặc **✗ Sai** 👆`];
      return good(r, i) ? ['wow', 'Chuẩn rồi! 🎉 Đọc **lý do** trên thẻ rồi qua **Câu tiếp**.'] : ['ouch', 'Chưa đúng — đọc **lý do** trên thẻ rồi qua **Câu tiếp** nha.']; }
  });
};
// bình chứa / bù dịch / bồn máu (pct 0–100)
const tank = (x, y, w, h, pct, col = '#e5484d', lab = '', prevPct = null) => {
  const p = Math.max(0, Math.min(100, pct)), fh = (h - 8) * p / 100, fy = y + h - 4 - fh;
  const twH = prevPct != null ? ZS.tw('height', (h - 8) * prevPct / 100, fh, 0.4) : '';
  const twY = prevPct != null ? ZS.tw('y', y + h - 4 - (h - 8) * prevPct / 100, fy, 0.4) : '';
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${C.grid}" stroke-width="1.6"/>` +
  `<rect x="${x + 4}" y="${fy}" width="${w - 8}" height="${fh}" rx="8" fill="${col}" fill-opacity=".75" stroke="${col}" stroke-width="1">${twH}${twY}</rect>` +
  (lab ? T(x + w / 2, y + h + 18, lab, { s: 12.5, c: C.mute }) : '') +
  T(x + w / 2, y - 6, Math.round(p) + '%', { s: 13, c: col }) + `</g>`;
};
// cán cân bập bênh (deg góc nghiêng)
const scale = (cx, cy, w, deg, leftLab, rightLab, pdeg = null) => {
  const hw = w / 2, twR = pdeg != null ? ZS.twRot(pdeg, deg, cx, cy, 0.4) : `transform="rotate(${deg} ${cx} ${cy})"`;
  return `<g><path d="M${cx} ${cy} L${cx - 16} ${cy + 36} H${cx + 16} Z" fill="#e2d9ee" stroke="${C.grid}" stroke-width="1.2"/>` +
  `<circle cx="${cx}" cy="${cy}" r="4" fill="${C.ink}"/>` +
  `<g ${twR}><line x1="${cx - hw}" y1="${cy}" x2="${cx + hw}" y2="${cy}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>` +
  `<line x1="${cx - hw}" y1="${cy}" x2="${cx - hw}" y2="${cy + 20}" stroke="${C.grid}" stroke-width="1.2"/>` +
  `<path d="M${cx - hw - 20} ${cy + 20} Q${cx - hw} ${cy + 32} ${cx - hw + 20} ${cy + 20} Z" fill="#fff" stroke="${C.grid}" stroke-width="1.2"/>` +
  `<line x1="${cx + hw}" y1="${cy}" x2="${cx + hw}" y2="${cy + 20}" stroke="${C.grid}" stroke-width="1.2"/>` +
  `<path d="M${cx + hw - 20} ${cy + 20} Q${cx + hw} ${cy + 32} ${cx + hw + 20} ${cy + 20} Z" fill="#fff" stroke="${C.grid}" stroke-width="1.2"/>` +
  Th(cx - hw, cy + 42, leftLab, { s: 12.5 }) +
  Th(cx + hw, cy + 42, rightLab, { s: 12.5 }) + `</g></g>`;
};
// lớp giải phẫu bóc tách lộ lớp sâu
const peel = (set, x, y, w, h, open, lab, col = C.mint) => {
  const dx = open ? w * 0.72 : 0;
  return `<g class="tap" data-set="${set}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${col}" stroke="${C.grid}" stroke-width="1.2"/>` +
  `<g transform="translate(${dx} 0)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#fff" stroke="${C.soft}" stroke-width="1.4" fill-opacity=".95"/>` +
  T(x + w / 2, y + h / 2 + 5, open ? '📖 ' + lab : '👉 ' + lab + ' (chạm mở)', { s: 13, c: C.ink }) + `</g></g>`;
};
// sóng co thắt / khử cực
const wave = (d, col = '#e5484d', dur = 2, w = 3) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="8 8"><animate attributeName="stroke-dashoffset" from="0" to="-32" dur="${dur}s" repeatCount="indefinite"/></path>`;

// đồng hồ đo bán nguyệt (Gauge) với các dải màu (zones: [[min, max, col], ...])
const gauge = (cx, cy, r, val, min, max, zones, label = '', opt = {}) => {
  const norm = Math.max(min, Math.min(max, val));
  const ang = -180 + ((norm - min) / (max - min)) * 180;
  const toRad = a => a * Math.PI / 180;
  let o = `<g id="${opt.id || 'hl-gauge'}"><path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${C.grid}" stroke-width="${opt.sw || 16}" stroke-linecap="round"/>`;
  if (zones && zones.length) {
    zones.forEach(([z1, z2, zcol]) => {
      const a1 = -180 + ((Math.max(min, z1) - min) / (max - min)) * 180;
      const a2 = -180 + ((Math.min(max, z2) - min) / (max - min)) * 180;
      const x1 = cx + r * Math.cos(toRad(a1)), y1 = cy + r * Math.sin(toRad(a1));
      const x2 = cx + r * Math.cos(toRad(a2)), y2 = cy + r * Math.sin(toRad(a2));
      const large = (a2 - a1) > 180 ? 1 : 0;
      o += `<path d="M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}" fill="none" stroke="${zcol}" stroke-width="${opt.sw || 16}"/>`;
    });
  }
  const na = toRad(ang), nx = cx + (r - 10) * Math.cos(na), ny = cy + (r - 10) * Math.sin(na);
  o += `<line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="${C.ink}" stroke-width="3.2" stroke-linecap="round"/>`;
  o += `<circle cx="${cx}" cy="${cy}" r="7" fill="${C.ink}" stroke="#fff" stroke-width="2"/>`;
  o += T(cx, cy + 24, `${typeof val === 'number' ? val.toFixed(opt.digits != null ? opt.digits : 2) : val} ${opt.unit || ''}`, { s: opt.valSize || 18, c: opt.valCol || C.ink });
  if (label) o += T(cx, cy + 42, label, { s: 12, c: C.mute });
  o += `</g>`;
  return o;
};

// biểu đồ CTG sản khoa (Cardiotocography): nhịp tim thai FHR + Cơn co tử cung UC
const ctg = (x, y, w, h, fhrType = 'normal', ucType = 'normal', opt = {}) => {
  const fhrH = h * 0.62, ucH = h * 0.30, gap = h * 0.08;
  const ucY = y + fhrH + gap;
  let o = `<g id="${opt.id || 'hl-ctg'}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#fffdfa" stroke="${C.grid}" stroke-width="1.4"/>`;
  for (let gy = y + 15; gy < y + fhrH; gy += fhrH / 4) o += `<line x1="${x}" y1="${gy}" x2="${x + w}" y2="${gy}" stroke="#fee2e2" stroke-width="1" stroke-dasharray="2 3"/>`;
  for (let gx = x + 30; gx < x + w; gx += 40) o += `<line x1="${gx}" y1="${y}" x2="${gx}" y2="${y + h}" stroke="#fee2e2" stroke-width="1" stroke-dasharray="2 3"/>`;
  const normY1 = y + fhrH * (200 - 160) / (200 - 60), normY2 = y + fhrH * (200 - 110) / (200 - 60);
  o += `<rect x="${x}" y="${normY1}" width="${w}" height="${normY2 - normY1}" fill="#f0fdf4" opacity=".6"/>`;
  o += T(x + 24, normY1 + 12, '160', { s: 9, c: '#15803d' }) + T(x + 24, normY2 - 4, '110', { s: 9, c: '#15803d' });
  let fhrPath = '';
  if (fhrType === 'normal') {
    fhrPath = `M${x + 30} ${y + fhrH * .45} Q${x + 60} ${y + fhrH * .40} ${x + 90} ${y + fhrH * .48} T${x + 150} ${y + fhrH * .43} T${x + 210} ${y + fhrH * .46} T${x + 270} ${y + fhrH * .42} T${x + 330} ${y + fhrH * .47}`;
  } else if (fhrType === 'late') {
    fhrPath = `M${x + 30} ${y + fhrH * .45} L${x + 90} ${y + fhrH * .45} Q${x + 130} ${y + fhrH * .45} ${x + 160} ${y + fhrH * .78} Q${x + 190} ${y + fhrH * .82} ${x + 220} ${y + fhrH * .48} L${x + 330} ${y + fhrH * .46}`;
  } else {
    fhrPath = `M${x + 30} ${y + fhrH * .46} L${x + 80} ${y + fhrH * .48} Q${x + 110} ${y + fhrH * .85} ${x + 140} ${y + fhrH * .88} L${x + 330} ${y + fhrH * .88}`;
  }
  o += `<path d="${fhrPath}" fill="none" stroke="${fhrType === 'normal' ? '#15803d' : '#dc2626'}" stroke-width="2.6" stroke-linecap="round"/>`;
  o += T(x + w - 46, y + 20, fhrType === 'brady' ? '📉 80 bpm' : fhrType === 'late' ? '⚠️ Late Decel' : '✓ 140 bpm', { s: 11, c: fhrType === 'normal' ? '#15803d' : '#dc2626' });

  let ucPath = '';
  if (ucType === 'normal') {
    ucPath = `M${x + 30} ${ucY + ucH - 4} Q${x + 80} ${ucY + ucH - 4} ${x + 110} ${ucY + 6} Q${x + 140} ${ucY + ucH - 4} ${x + 200} ${ucY + ucH - 4} Q${x + 230} ${ucY + 8} ${x + 260} ${ucY + ucH - 4} L${x + 330} ${ucY + ucH - 4}`;
  } else {
    ucPath = `M${x + 30} ${ucY + ucH * .4} Q${x + 60} ${ucY + 4} ${x + 90} ${ucY + ucH * .35} Q${x + 120} ${ucY + 2} ${x + 160} ${ucY + ucH * .3} Q${x + 200} ${ucY + 4} ${x + 240} ${ucY + ucH * .32} L${x + 330} ${ucY + ucH * .3}`;
  }
  o += `<path d="${ucPath}" fill="none" stroke="#b45309" stroke-width="2.4" stroke-linecap="round"/>`;
  o += T(x + w - 46, ucY + 18, ucType === 'tetany' ? '🔥 Tăng trương lực' : 'Cơn gò (UC)', { s: 10.5, c: '#b45309' });
  o += `</g>`;
  return o;
};

// bóng chèn buồng tử cung Bakri
const balloon = (cx, cy, vol, maxVol = 500, opt = {}) => {
  const f = Math.max(0, Math.min(1, vol / maxVol));
  const rx = 24 + 54 * f, ry = 30 + 68 * f;
  const col = opt.leak ? '#ef4444' : '#38bdf8';
  let o = `<g id="${opt.id || 'hl-bakri'}">`;
  o += `<path d="M${cx - 95} ${cy + 110} C${cx - 90} ${cy - 80} ${cx - 50} ${cy - 110} ${cx} ${cy - 110} C${cx + 50} ${cy - 110} ${cx + 90} ${cy - 80} ${cx + 95} ${cy + 110} Z" fill="#ffe4e6" stroke="#f43f5e" stroke-width="2.5" opacity=".6"/>`;
  o += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${col}" fill-opacity="${.35 + .4 * f}" stroke="${col}" stroke-width="2.2"/>`;
  if (vol >= 200) {
    o += `<path d="M${cx - rx + 10} ${cy} L${cx - rx - 10} ${cy}" stroke="#0284c7" stroke-width="2.5"/>`;
    o += `<path d="M${cx + rx - 10} ${cy} L${cx + rx + 10} ${cy}" stroke="#0284c7" stroke-width="2.5"/>`;
    o += `<path d="M${cx} ${cy - ry + 10} L${cx} ${cy - ry - 10}" stroke="#0284c7" stroke-width="2.5"/>`;
  }
  o += `<line x1="${cx}" x2="${cx}" y1="${cy + ry}" y2="${cy + 135}" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>`;
  o += T(cx, cy + 6, `${vol} mL`, { s: 15, c: '#0f172a' });
  o += T(cx, cy + 24, vol < 250 ? 'Chưa đủ ép' : vol <= 500 ? 'Áp lực ép đạt' : 'Quá căng', { s: 11, c: '#0369a1' });
  o += `</g>`;
  return o;
};

// nhịp tim đập trực quan (Pulse rhythm)
const pulseRhythm = (cx, cy, r, bpm, col = '#ef4444', label = '') => {
  const dur = (60 / Math.max(40, bpm)).toFixed(2);
  return `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" opacity=".2"><animate attributeName="r" values="${r};${r * 1.35};${r}" dur="${dur}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".35;.05;.35" dur="${dur}s" repeatCount="indefinite"/></circle>` +
  `<circle cx="${cx}" cy="${cy}" r="${r * .75}" fill="${col}" stroke="#fff" stroke-width="2"/>` +
  `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="${r * .6}" fill="#fff" font-family="Outfit, sans-serif" font-weight="800">💓</text>` +
  T(cx, cy + r + 18, `${bpm} l/p`, { s: 13, c: col }) +
  (label ? T(cx, cy + r + 32, label, { s: 11, c: C.mute }) : '') + `</g>`;
};

ZS.BK = { I, Th, card, pic, tintPic, sitPic, scrub, drag, tap, call, tcard, pcard, lockIcon, flow, rbcFlow, heart, drops, vital, verdict, seen, markSeen, tfKit, tank, scale, peel, wave, gauge, ctg, balloon, pulseRhythm };
})();
