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
const seen = (s, k) => (s.seen || '').includes(k + ','), markSeen = (s, k) => { if (k && !seen(s, k)) s.seen = (s.seen || '') + k + ','; };
// lưới thẻ Đúng/Sai: bấm thẻ q<i> để lật
const tf = (cards, s, cols = 3, w = 170, h = 128, y0 = 56, lab = ['✓ ĐÚNG', '✗ SAI']) => cards.map(([t, ok], i) => { const x = 20 + (i % cols) * (w + 8), y = y0 + Math.floor(i / cols) * (h + 10), sn = seen(s, 'q' + i);
  return `<g class="tap" data-set="!q${i}">${card(x, y, w, h, sn ? (ok ? C.mint : '#ffd0d8') : '#fff', sn ? C.soft : C.grid)}${ZS.wrap(t, Math.round(w / 10.5)).map((l, j) => T(x + w / 2, y + 34 + j * 19, l, { s: 13.5 })).join('')}${sn ? `<g class="fadein">${T(x + w / 2, y + h - 16, ok ? lab[0] : lab[1], { s: 15, c: ok ? C.green : C.redD })}</g>` : T(x + w / 2, y + h - 16, '👆', { s: 15, c: C.soft })}</g>`; }).join('');
// kit Đúng/Sai dựng sẵn: title, danh sách [câu, đúng?], câu chốt
const tfKit = (name, cards, sayDone, sayStart = 'Đúng hay sai? Chạm **từng thẻ** để lật 👆', o = {}) => ZS.kit(name, { init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => cards.every((_, i) => seen(s, 'q' + i)),
  draw: s => T(285, 40, o.title || 'Đúng hay sai? Chạm từng thẻ', { s: 15 }) + tf(cards, s, o.cols || (cards.length > 4 ? 3 : 2), o.w || (cards.length > 4 ? 170 : 261), o.h || (cards.length > 4 ? 130 : 128), 56, o.lab),
  say: s => cards.every((_, i) => seen(s, 'q' + i)) ? ['worry', sayDone] : ['happy', sayStart] });
ZS.BK = { I, Th, card, pic, tap, call, tcard, pcard, lockIcon, flow, rbcFlow, heart, drops, vital, verdict, seen, markSeen, tf, tfKit };
})();
