'use strict';
/* Trang tí hon — chương 08 Kẹt vai. Mỗi trang: 1 hình thật/sơ đồ + 1 việc để làm + 1 câu.
   Hình: Hariadhi (CC BY-SA 4.0), geraldbaeck (CC0), Mottet và cs. (CC BY 4.0), Servier Medical Art (CC BY 4.0), ảnh lâm sàng Wikimedia (ghi ở từng trang). */
(() => {
const ZS = window.ZS, { C, T, kit, arrow } = ZS, B = ZS.beats = ZS.beats || {};
const { I, Th, card, pic, tap, call, tcard, lockIcon } = ZS.BK;
// hình kẹt vai (Hariadhi) trong khung trái 360×310; kp(): toạ độ ảnh gốc 2834 → khung
const KV = hand => `<svg x="0" y="20" width="360" height="310" viewBox="100 520 2734 2355" preserveAspectRatio="xMidYMid slice"><image href="${I}kv-base.svg" width="2834" height="2834"/>${hand ? `<image href="${I}kv-tay.svg" width="2834" height="2834"/>` : ''}</svg>`;
const kp = (X, Y) => [+((X - 100) * .1317).toFixed(1), +(20 + (Y - 520) * .1317).toFixed(1)];
const SH = kp(1745, 1560), PU = kp(1790, 1400), HD = kp(2240, 1950), NK = kp(1930, 1730), SP = kp(1500, 1230), FU = kp(260, 1560);
// eo trên nhìn từ dưới lên: vòng xương + thanh hai vai. deg: 0 = trước–sau (dọc). hl: nửa đường kính vai (đơn vị ×k)
const inlet = (cx, cy, k, deg, hl, o = {}) => {
  const rx = 128 * k, ry = (o.ry || 98) * k, a = deg * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), rE = 1 / Math.sqrt(dx * dx / (rx * rx) + dy * dy / (ry * ry)), L = hl * k, ok = L <= rE + .5, sr = 15 * k;
  const c1 = [cx + dx * (L - sr), cy + dy * (L - sr) + (o.push || 0)], c2 = [cx - dx * (L - sr), cy - dy * (L - sr) + (o.push || 0)];
  let s = `<ellipse cx="${cx}" cy="${cy}" rx="${rx + 9 * k}" ry="${ry + 9 * k}" fill="none" stroke="${C.bone}" stroke-width="${18 * k}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff7fa" stroke="${C.boneD}" stroke-width="1.2"/>`;
  s += `<rect x="${cx - 28 * k}" y="${cy - ry - 18 * k}" width="${56 * k}" height="${24 * k}" rx="${9 * k}" fill="url(#gBone)" stroke="${C.boneD}" stroke-width="1.2"/><path d="M${cx - 34 * k} ${cy + ry + 10 * k} Q${cx} ${cy + ry - 30 * k} ${cx + 34 * k} ${cy + ry + 10 * k}Z" fill="url(#gBone)" stroke="${C.boneD}" stroke-width="1.2"/>`;
  if (o.guides) s += `<path d="M${cx} ${cy - ry + 8 * k} V${cy + ry - 22 * k}" stroke="${C.cap}" stroke-width="1.6" stroke-dasharray="6 5"/><path d="M${cx - 78 * k} ${cy - 78 * k} L${cx + 78 * k} ${cy + 78 * k}" stroke="${C.green}" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  const y1 = cy - (L - sr) + (o.push || 0), y2 = cy + (L - sr) + (o.push || 0), pL = o.phl == null ? null : o.phl * k, py1 = pL == null ? null : cy - (pL - sr) + (o.push || 0), py2 = pL == null ? null : cy + (pL - sr) + (o.push || 0);
  s += `<g transform="rotate(${deg} ${cx} ${cy})">${ZS.twRot(o.pdeg, deg, cx, cy)}<line x1="${cx}" x2="${cx}" y1="${y1}" y2="${y2}" stroke="${C.skinD}" stroke-width="${13 * k}" stroke-linecap="round">${ZS.tw('y1', py1, y1)}${ZS.tw('y2', py2, y2)}</line><line x1="${cx}" x2="${cx}" y1="${y1}" y2="${y2}" stroke="#ffdcc4" stroke-width="${10 * k}" stroke-linecap="round">${ZS.tw('y1', py1, y1)}${ZS.tw('y2', py2, y2)}</line>`;
  s += `<circle cx="${cx}" cy="${cy + (o.push || 0)}" r="${18 * k}" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/><circle cx="${cx}" cy="${y1}" r="${sr}" fill="url(#gSkin)" stroke="${ok ? C.skinD : C.red}" stroke-width="${ok ? 1.2 : 2.4}">${ZS.tw('cy', py1, y1)}</circle><circle cx="${cx}" cy="${y2}" r="${o.arm ? sr * .7 : sr}" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2">${ZS.tw('cy', py2, y2)}</circle></g>`;
  if (!ok) s += `<circle cx="${c1[0]}" cy="${c1[1] - 4 * k}" r="${sr + 7}" fill="none" stroke="${C.red}" stroke-width="2" class="pulse"/>`;
  return { svg: s, ok, c1, c2, rx, ry };
};
const credHV = 'Hariadhi, Wikimedia Commons · CC BY-SA 4.0';

// ═════════ BÀI 1 · Đầu ra rồi, vai vẫn có thể mắc
kit('bv-rua', {
  init: () => ({ keo: 0 }), ui: () => [{ t: 'range', k: 'keo', label: '🤲 Kéo nhẹ đầu theo trục', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.keo >= 70,
  draw: s => {
    const f = s.keo / 100, hot = f >= .7;
    let o = KV(false);
    if (f > 0) {
      const hx = HD[0] + 16 + 24 * Math.min(f, .4), hy = HD[1] + 16 + 12 * Math.min(f, .4);
      o += arrow(`M${HD[0] + 16} ${HD[1] + 16} L${hx + 28} ${hy + 14}`, C.mute, 3 + 2 * f);
      if (hot) {
        o += `<g class="bob">${arrow(`M${HD[0] + 62} ${HD[1] + 54} q-32 8 -46 -10`, C.red, 5)}</g>`;
        o += Th(HD[0] + 4, HD[1] + 76, '🐢 đầu rụt lại sát TSM', { c: C.redD });
        o += `<g class="shake-once">${lockIcon(SH[0] - 30, SH[1] - 10, false)}</g>` + call(SH[0], SH[1], 250, 44, 'vai mắc sau khớp vệ', C.redD);
      }
    }
    o += card(372, 20, 178, 310) + T(461, 52, 'Kéo theo trục…', { s: 15 });
    o += T(461, 84, 'lực kéo: ' + s.keo + '%', { s: 13, c: hot ? C.redD : C.mute });
    o += ZS.bar(392, 98, 138, s.keo, hot ? C.red : C.amber, '', { h: 12 });
    o += T(461, 148, hot ? '🐢 Thụt lùi' : f > 0 ? 'Căng khớp vệ' : 'Chờ kéo nhẹ', { s: 14, c: hot ? C.redD : C.ink });
    o += T(461, 176, hot ? '✗ vai không ra' : 'vai có ra?', { s: 13, c: hot ? C.redD : C.mute });
    if (hot) o += `<rect x="388" y="210" width="146" height="74" rx="16" fill="#ffd0d8"/>` + T(461, 238, 'KẸT VAI!', { s: 21, c: C.redD }) + T(461, 262, 'ngừng kéo · gọi to', { s: 13, c: C.redD });
    return o;
  },
  say: s => s.keo >= 70 ? ['worry', 'Vai **không ra**, đầu còn **rụt lại** sát tầng sinh môn (**dấu con rùa 🐢**). Kéo nhẹ không ra = **kẹt vai**, ngừng kéo ngay!'] : ['happy', 'Đầu bé đã **ra ngoài** rồi. Kéo thanh **🤲 Kéo nhẹ đầu theo trục** xem vai có theo ra không 👆']
});
kit('bv-cho', {
  init: () => ({ pick: '' }), ui: () => [], goal: s => s.pick === 'vai',
  draw: s => {
    const ok = s.pick === 'vai';
    let o = KV(false) + tap('pick=vai', SH[0], SH[1] - 6, 30, 26, ok ? 1 : 0) + tap('pick=dau', HD[0], HD[1], 40, 40, s.pick === 'dau' ? -1 : 0) + tap('pick=bung', 120, 150, 54, 40, s.pick === 'bung' ? -1 : 0);
    if (ok) o += ZS.fade(call(PU[0] + 6, PU[1] - 12, 262, 44, 'xương mu', '#a07a3c', 'middle') + call(SH[0] - 6, SH[1], 150, 70, 'vai trước mắc ở đây', C.redD, 'end'), ZS.fresh(s, x => x.pick === 'vai'));
    o += card(372, 20, 178, 310);
    o += ok ? T(461, 56, 'Hay gặp nhất', { s: 13, c: C.mute }) + T(461, 80, 'vai TRƯỚC', { s: 18 }) + T(461, 100, 'mắc sau khớp vệ', { s: 14 }) + `<path d="M396 126 H526" stroke="${C.grid}"/>` + T(461, 156, 'Hiếm hơn', { s: 13, c: C.mute }) + T(461, 180, 'vai SAU', { s: 18 }) + T(461, 200, 'mắc ở mỏm nhô', { s: 14 }) + T(461, 252, '→ cả hai đều là', { s: 13, c: C.mute }) + T(461, 274, 'XƯƠNG chặn vai', { s: 15, c: C.redD })
      : T(461, 140, '👆', { s: 34 }) + T(461, 184, 'Vai bé', { s: 16 }) + T(461, 206, 'mắc ở đâu?', { s: 16 }) + (s.pick ? T(461, 250, 'Chưa đúng — thử chỗ khác', { s: 12.5, c: C.redD }) : '');
    return o;
  },
  say: s => s.pick === 'vai' ? ['wow', 'Đúng! **Vai trước** mắc sau **khớp vệ** (xương mu). Hiếm hơn: **vai sau** mắc ở **mỏm nhô**.'] : s.pick === 'dau' ? ['worry', 'Đầu đã ra ngoài rồi — chỗ mắc nằm **bên trong**, ngay sau xương mu.'] : s.pick === 'bung' ? ['worry', 'Thân bé còn trong tử cung nhưng không mắc ở đó. Tìm chỗ **xương chặn vai** nha.'] : ['happy', 'Đầu đã ra mà vai không ra. Vai bé **mắc ở đâu**? Chạm vào hình 👆']
});
kit('bv-keo', {
  init: () => ({ f: 0, dx: HD[0] + 14, dy: HD[1] + 16 }), ui: () => [], after: (s, k) => { if (k === 'dx' || k === 'dy') s.f = Math.max(0, Math.min(100, Math.round(100 * (s.dx - (HD[0] + 14)) / 56 / 10) * 10)); }, goal: s => s.f >= 70,
  draw: s => {
    const f = s.f / 100, col = f > .55 ? C.red : f > .25 ? C.amber : '#e5b800';
    let o = KV(false);
    const hx = HD[0] + 14 + 56 * f, hy = HD[1] + 16 + 26 * f;
    if (f) o += `<path d="M${HD[0] + 14} ${HD[1] + 16} L${hx} ${hy}" stroke="${C.red}" stroke-width="${3 + 4 * f}" stroke-linecap="round" opacity=".8"/>`;
    o += ZS.BK.drag('d', hx, hy, 10, '', [HD[0] + 14, HD[1] + 16, HD[0] + 70, HD[1] + 42], C.red) + (f ? '' : Th(HD[0] + 30, HD[1] + 58, 'kéo đầu →', { s: 12.5, c: C.redD }));
    o += [0, 1, 2, 3].map(i => `<path d="M${SH[0] + 6 + i * 3} ${SH[1] + 4 + i * 4} Q${NK[0]} ${NK[1] - 8 + i * 5} ${HD[0] - 22} ${HD[1] - 18 + i * 6}" fill="none" stroke="${col}" stroke-width="${1.6 + 1.4 * f}" stroke-linecap="round" ${f > .55 ? 'class="pulse"' : ''}/>`).join('');
    o += lockIcon(SH[0] - 34, SH[1] - 12, false) + (f > .55 ? call(NK[0], NK[1], 300, 300, 'đám rối căng!', C.redD, 'middle') : Th(300, 300, 'đám rối cánh tay', { c: '#a08400', s: 12.5 }));
    o += card(372, 20, 178, 310) + T(461, 52, 'Vai ra được?', { s: 14 }) + ZS.bar(392, 64, 138, 0, C.green, '', { h: 14 }) + T(461, 100, 'không nhúc nhích', { s: 12.5, c: C.mute });
    o += T(461, 150, 'Căng đám rối', { s: 14 }) + ZS.bar(392, 162, 138, s.f, col, '', { h: 14 }) + T(461, 198, s.f + '%', { s: 14, c: col });
    if (s.f >= 70) o += `<rect x="388" y="232" width="146" height="70" rx="16" fill="#ffd0d8"/>` + T(461, 262, '⚠ liệt tay', { s: 17, c: C.redD }) + T(461, 284, 'vai vẫn kẹt', { s: 13, c: C.redD });
    return o;
  },
  say: s => s.f >= 70 ? ['ouch', 'Kéo mạnh **không gỡ được vai** — xương vẫn chặn. Chỉ kéo **căng đám rối cánh tay** ở cổ → có thể liệt tay.'] : ['happy', 'Hay là kéo **mạnh hơn**? **Kéo chấm đỏ** ở đầu bé xuống xem 👆']
});
kit('bv-xoay', {
  init: () => ({ a: 0 }), ui: () => [{ t: 'range', k: 'a', label: '🔄 Xoay hai vai', min: 0, max: 45, step: 5, unit: '°' }], goal: s => s.a >= 40,
  draw: s => {
    const R = inlet(190, 180, 1.12, s.a, 107, { guides: true, pdeg: s._p?.a });
    let o = card(20, 20, 340, 310) + T(190, 44, 'Eo trên — nhìn từ dưới lên', { s: 14, c: C.mute }) + R.svg;
    o += Th(146, 68, 'khớp vệ', { a: 'end', s: 13, c: '#a07a3c' }) + Th(146, 304, 'mỏm nhô', { a: 'end', s: 13, c: '#a07a3c' });
    o += card(372, 20, 178, 310);
    o += ZS.legend(388, 54, [[C.cap, 'trước–sau', '6 5']], { s: 13 }) + T(461, 80, '≈ 11 cm · hẹp', { s: 14, c: C.cap });
    o += ZS.legend(388, 116, [[C.green, 'chéo', '6 5']], { s: 13 }) + T(461, 142, '≈ 12,5 cm · rộng', { s: 14, c: C.green });
    o += `<path d="M392 176 h36" stroke="${C.skinD}" stroke-width="10" stroke-linecap="round"/>` + T(436, 181, 'hai vai', { a: 'start', s: 13 }) + T(461, 204, '≈ 12 cm', { s: 14 });
    o += `<rect x="388" y="236" width="146" height="70" rx="16" fill="${R.ok ? C.mint : '#ffd0d8'}"/>` + T(461, 268, R.ok ? '✓ vai lọt' : '✗ vai kẹt', { s: 20, c: R.ok ? C.green : C.redD }) + T(461, 290, R.ok ? 'nằm đường chéo' : 'nằm trước–sau', { s: 13, c: C.mute });
    return o;
  },
  say: s => s.a >= 40 ? ['wow', 'Vai **≈12 cm** nằm **trước–sau** (≈11 cm) thì kẹt. Xoay sang **đường chéo** (≈12,5 cm) → **lọt**! Mọi thủ thuật đều nhắm vào điều này.'] : ['happy', 'Đây là **eo trên** nhìn từ dưới lên, hai vai đang nằm **trước–sau**. Kéo thanh **🔄 Xoay hai vai** 👆']
});
const RISK = [['big', '🍼 Thai to'], ['dm', '🍬 Mẹ đái tháo đường'], ['prev', '🔁 Từng kẹt vai'], ['long', '⏳ Giai đoạn 2 kéo dài'], ['tool', '🔧 Sinh giúp dụng cụ']];
kit('bv-ai', {
  init: () => ({ big: false, dm: false, prev: false, long: false, tool: false, norm: false }), ui: () => [], goal: s => s.norm,
  draw: s => {
    const n = RISK.filter(([k]) => s[k]).length;
    let o = RISK.map(([k, t], i) => tcard('!' + k, 20, 20 + i * 52, 212, 44, s[k], [t])).join('');
    o += T(126, 296, '👆 bấm từng thẻ', { s: 12.5, c: C.mute });
    // nhiệt kế nguy cơ
    o += `<rect x="252" y="40" width="34" height="230" rx="17" fill="#f4f0fb" stroke="${C.grid}"/><rect x="258" y="${264 - 36 * n - 10}" width="22" height="${36 * n + 10}" rx="11" fill="${n > 3 ? C.red : n > 1 ? C.amber : C.mintD}"/><circle cx="269" cy="288" r="22" fill="${n > 3 ? C.red : n > 1 ? C.amber : C.mintD}"/>` + T(269, 32, 'nguy cơ', { s: 12.5, c: C.mute });
    // bé bình thường: vẫn có thể kẹt
    o += `<g class="tap" data-set="!norm">${card(312, 20, 238, 310, s.norm ? '#fff6e0' : '#fff', s.norm ? C.amber : C.grid)}${pic('sv-be.png', 330, 44, 90, 190)}${T(486, 70, 'Bé ~3 kg', { s: 15 })}${T(486, 92, 'mẹ khỏe,', { s: 13, c: C.mute })}${T(486, 110, 'không yếu tố nào', { s: 13, c: C.mute })}`;
    o += s.norm ? T(486, 160, '⚠', { s: 34, c: C.amber }) + T(486, 196, 'vẫn có thể', { s: 15, c: '#b5651d' }) + T(486, 216, 'kẹt vai!', { s: 15, c: '#b5651d' }) : T(486, 180, '👆 bấm thử', { s: 13, c: C.soft });
    o += `${T(431, 270, 'Không đoán trước', { s: 13.5 })}${T(431, 290, 'được từng ca', { s: 13.5 })}</g>`;
    return o;
  },
  say: s => s.norm ? ['worry', 'Các yếu tố này làm **tăng** nguy cơ, nhưng **không đoán trước được từng ca** — bé không to vẫn có thể kẹt. Ca nào cũng phải **sẵn sàng**.'] : ['happy', 'Bấm các thẻ **yếu tố nguy cơ** xem nhiệt kế tăng, rồi bấm thẻ **bé ~3 kg** bên phải 👆']
});
B['co-hoc-vai'] = [
  { t: 'Đầu ra rồi… vai thì chưa', kit: 'bv-rua', cr: credHV },
  { t: 'Vai mắc ở đâu?', kit: 'bv-cho', cr: credHV },
  { t: 'Kéo mạnh hơn được không?', kit: 'bv-keo', cr: credHV },
  { t: 'Lời giải: xoay vai sang chỗ rộng', kit: 'bv-xoay' },
  { t: 'Ai dễ bị kẹt vai?', kit: 'bv-ai', cr: 'Em bé: Servier Medical Art · CC BY 4.0' }
];

// ═════════ BÀI 2 · Gọi tên kẹt vai, đổi tư thế và lực đúng chỗ
const team = (x, y, t, on) => `<g opacity="${on ? 1 : .18}" transform="translate(${x} ${y})"><circle r="24" fill="${C.sky}" stroke="${C.skyD}"/>${T(0, 9, '🧑‍⚕️', { s: 24 })}${T(0, 44, t, { s: 12.5 })}</g>`;
kit('bv-goi', {
  init: () => ({ call: false, time: false, push: false }), ui: () => [], goal: s => s.call && s.time && s.push,
  draw: s => {
    let o = card(20, 20, 300, 310, '#fffdf5');
    o += team(80, 66, 'sản', s.call) + team(170, 66, 'gây mê', s.call) + team(260, 66, 'nhi sơ sinh', s.call);
    // đồng hồ bấm giờ
    o += `<g transform="translate(110 222)"><circle r="58" fill="#fff" stroke="${C.soft}" stroke-width="2"/><rect x="-10" y="-74" width="20" height="12" rx="4" fill="${C.soft}"/>${[...Array(12)].map((_, i) => `<path d="M0 -52 v8" stroke="${C.grid}" stroke-width="2" transform="rotate(${i * 30})"/>`).join('')}<path d="M0 0 V-44" stroke="${C.red}" stroke-width="3" stroke-linecap="round">${s.time ? '<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite"/>' : ''}</path><circle r="5" fill="${C.red}"/></g>` + T(110, 306, s.time ? '⏱ đang ghi giờ' : 'chưa ghi giờ', { s: 12.5, c: s.time ? C.redD : C.mute });
    o += `<g transform="translate(250 222)" opacity="${s.push ? 1 : .25}">${T(0, 10, '🤰', { s: 46 })}${T(0, 52, 'mẹ ngừng rặn', { s: 12.5 })}</g>`;
    o += tcard('!call', 336, 20, 214, 92, s.call, ['🆘 Gọi to “KẸT VAI!”', 'gọi đủ người hỗ trợ']) + tcard('!time', 336, 129, 214, 92, s.time, ['⏱ Ghi giờ', 'lúc đầu ra ngoài']) + tcard('!push', 336, 238, 214, 92, s.push, ['🗣 Bảo mẹ', 'ngừng rặn']);
    return o;
  },
  say: s => s.call && s.time && s.push ? ['happy', 'Nói to “**KẸT VAI**”, gọi đủ người (sản · gây mê · nhi), **ghi giờ** đầu ra, bảo mẹ **ngừng rặn** — rồi mới làm thủ thuật.'] : ['worry', 'Vừa thấy kẹt vai! Bấm đủ **3 việc làm ngay** bên phải 👆']
});
kit('bv-mcr', {
  init: () => ({ flex: 0 }), ui: () => [{ t: 'range', k: 'flex', label: '🦵 Gập đùi mẹ sát bụng', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.flex >= 80,
  draw: s => {
    const f = s.flex / 100, rot = -24 * f, ok = f >= .8;
    let o = card(20, 20, 300, 310) + pic('mcroberts.svg', 24, 24, 292, 300) + Th(250, 160, '① gập đùi', { c: C.redD, s: 13 }) + Th(196, 202, '② ấn trên mu', { a: 'end', c: C.redD, s: 13 });
    // eo trên nhìn từ dưới lên: gập đùi → khớp vệ nhấc lên, đường trước–sau rộng ra
    const R = inlet(441, 186, .78, 0, 107, { ry: 98 + 14 * f });
    o += card(332, 20, 218, 310) + T(441, 44, 'Eo trên — nhìn từ dưới', { s: 12.5, c: C.mute }) + R.svg + Th(441, 186 - (98 + 14 * f) * .78 - 22, 'khớp vệ', { s: 12.5, c: '#a07a3c' });
    if (f > .1) o += arrow(`M500 ${150 - 10 * f} q8 -24 -18 ${-34 - 10 * f}`, C.green, 3);
    o += `<rect x="352" y="282" width="178" height="40" rx="14" fill="${ok ? C.mint : '#ffd0d8'}"/>` + T(441, 308, ok ? '✓ vai có chỗ thoát' : '✗ khớp vệ chặn vai', { s: 14, c: ok ? C.green : C.redD });
    return o;
  },
  say: s => s.flex >= 80 ? ['wow', 'Gập đùi sát bụng → **khớp vệ xoay lên trên**, cột sống thắt lưng thẳng ra → vai trước **có chỗ thoát**. Đơn giản mà hiệu quả.'] : ['happy', '**McRoberts**: người phụ gập hai đùi mẹ sát bụng. Kéo thanh **🦵 Gập đùi** xem khớp vệ thay đổi 👆']
});
kit('bv-supra', {
  init: () => ({ pick: '' }), ui: () => [], goal: s => s.pick === 'mu',
  draw: s => {
    const ok = s.pick === 'mu', bad = s.pick === 'day';
    let o = KV(ok) + (ok ? '' : tap('pick=mu', SP[0], SP[1], 26, 24)) + tap('pick=day', FU[0] + 10, FU[1] - 30, 30, 34, bad ? -1 : 0);
    if (ok) o += ZS.drawIn(arrow(`M${SP[0] - 34} ${SP[1] - 50} l22 34`, C.green, 5), .6) + Th(172, 52, 'ấn ngay trên xương mu', { a: 'middle', c: C.green }) + `<circle cx="${SH[0]}" cy="${SH[1] - 6}" r="20" fill="none" stroke="${C.green}" stroke-width="2.4"/>`;
    if (bad) o += Th(FU[0] + 12, FU[1] + 30, '⛔ đáy tử cung', { a: 'start', c: C.redD });
    const R = inlet(461, 170, .62, ok ? 45 : 0, ok ? 98 : 107, { pdeg: s._p ? (s._p.pick === 'mu' ? 45 : 0) : null, phl: s._p ? (s._p.pick === 'mu' ? 98 : 107) : null });
    o += card(372, 20, 178, 310) + T(461, 44, 'Nhìn từ dưới lên', { s: 12.5, c: C.mute }) + R.svg;
    o += T(461, 280, ok ? '✓ vai khép + xoay chéo' : 'vai đang trước–sau', { s: 13, c: ok ? C.green : C.mute }) + (ok ? T(461, 300, '→ lọt', { s: 15, c: C.green }) : '');
    return o;
  },
  say: s => s.pick === 'mu' ? ['wow', 'Đúng! Ấn **ngay trên xương mu**, đẩy **lưng vai trước** về phía ngực bé → vai **khép lại và xoay chéo** → lọt. Người đã được huấn luyện làm.'] : s.pick === 'day' ? ['ouch', 'Đó là **đáy tử cung** — ấn đây làm vai **nêm chặt hơn**. Thử chỗ khác!'] : ['happy', '**Ấn trên xương mu**: đặt tay ở đâu? Chạm vào một trong hai vòng 👆']
});
kit('bv-cam', {
  init: () => ({ pick: '', seen: '' }), ui: () => [{ t: 'seg', k: 'pick', opts: [['fun', '⛔ Ấn đáy tử cung'], ['yank', '⛔ Kéo giật đầu'], ['twist', '⛔ Vặn xoay đầu']] }],
  after: s => { if (s.pick && !s.seen.includes(s.pick)) s.seen += s.pick + ','; },
  goal: s => ['fun', 'yank', 'twist'].every(k => s.seen.includes(k)),
  draw: s => {
    let o = KV(false);
    if (s.pick === 'fun') o += ZS.drawIn(arrow(`M${FU[0] - 4} ${FU[1] - 70} l34 34`, C.red, 6)) + call(SH[0], SH[1], 250, 44, 'vai nêm CHẶT hơn', C.redD) + Th(FU[0] + 4, FU[1] + 40, 'có thể vỡ tử cung', { a: 'start', c: C.redD, s: 13 }) + `<circle cx="${SH[0]}" cy="${SH[1] - 6}" r="22" fill="none" stroke="${C.red}" stroke-width="3" class="pulse"/>`;
    if (s.pick === 'yank') o += ZS.drawIn(arrow(`M${HD[0] + 28} ${HD[1] + 24} l46 20`, C.red, 7)) + call(NK[0], NK[1], 300, 300, 'rách đám rối', C.redD, 'middle');
    if (s.pick === 'twist') o += `<path d="M${HD[0] - 30} ${HD[1] + 40} A42 42 0 1 0 ${HD[0] + 40} ${HD[1] - 26}" fill="none" stroke="${C.red}" stroke-width="3" marker-end="url(#arR)"/>` + call(NK[0], NK[1], 300, 300, 'tổn thương cổ', C.redD, 'middle');
    const R = { fun: ['⛔ Ấn đáy tử cung', 'vai nêm chặt hơn', 'có thể vỡ tử cung'], yank: ['⛔ Kéo giật đầu', 'rách đám rối cánh tay', 'vai vẫn kẹt'], twist: ['⛔ Vặn xoay đầu', 'tổn thương cổ', 'vai vẫn kẹt'] }[s.pick], n = s.seen.split(',').filter(Boolean).length;
    o += card(372, 20, 178, 310, R ? '#fff1f4' : '#fff', R ? C.pinkD : C.grid) + (R ? `<g class="fadein">${T(461, 70, R[0], { s: 15, c: C.redD })}<path d="M392 92 H530" stroke="${C.grid}"/>${T(461, 140, R[1], { s: 15 })}${T(461, 176, R[2], { s: 15, c: C.redD })}${T(461, 240, '⛔', { s: 46 })}</g>` : T(461, 150, '👆 chọn một việc', { s: 15, c: C.soft }) + T(461, 176, 'ở trên để xem hậu quả', { s: 13, c: C.mute })) + T(461, 312, `đã xem ${n}/3`, { s: 12.5, c: C.mute });
    return o;
  },
  say: s => ['fun', 'yank', 'twist'].every(k => s.seen.includes(k)) ? ['ouch', 'Ấn **đáy tử cung** → vai nêm chặt hơn, có thể vỡ tử cung. **Kéo giật / vặn đầu** → tổn thương cổ và đám rối cánh tay.'] : s.pick === 'fun' ? ['ouch', 'Lực từ **đáy** đẩy vai **nêm sâu hơn** vào khớp vệ.'] : s.pick === 'yank' ? ['ouch', 'Kéo giật **không gỡ được vai**, chỉ làm **rách đám rối cánh tay**.'] : s.pick === 'twist' ? ['ouch', 'Vặn đầu làm **tổn thương cổ**, vai vẫn kẹt.'] : ['worry', 'Có **3 việc CẤM** khi kẹt vai. Chọn từng việc ở trên xem hậu quả 👆']
});
kit('bv-tsm', {
  init: () => ({ cut: 0 }), ui: () => [{ t: 'range', k: 'cut', label: '✂️ Cắt TSM hướng 7h', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.cut >= 70,
  draw: s => {
    const f = s.cut / 100, hot = f >= .7, mo = (4.0 + 4.5 * f).toFixed(1);
    let o = card(20, 20, 340, 310) + T(190, 46, 'Lỗ ra khung chậu — nhìn từ dưới', { s: 13, c: C.mute });
    o += `<ellipse cx="190" cy="186" rx="128" ry="112" fill="none" stroke="${C.bone}" stroke-width="22"/><ellipse cx="190" cy="186" rx="117" ry="101" fill="none" stroke="${C.boneD}" stroke-width="1.2"/>` + Th(190, 84, 'VÒNG XƯƠNG (cố định 10 cm)', { s: 12.5, c: '#a07a3c' });
    o += `<ellipse cx="190" cy="${190 + 6 * f}" rx="${86 + 12 * f}" ry="${76 + 10 * f}" fill="#ffd6e2" stroke="${C.pinkD}" stroke-width="1.2"/>`;
    o += `<path d="M190 186 m-34 0 a34 ${34 + 20 * f} 0 1 0 68 0 a34 ${34 + 20 * f} 0 1 0 -68 0" fill="#fff" stroke="${C.myoD}" stroke-width="1.4"/>` + `<circle cx="190" cy="184" r="26" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/>`;
    if (f > 0) {
      o += `<path d="M198 238 L${198 + 42 * f} ${238 + 44 * f}" stroke="${C.redD}" stroke-width="${2 + 2 * f}" stroke-dasharray="5 4"/>` + Th(200 + 44 * f, 246 + 44 * f, 'đường cắt 7h', { a: 'start', s: 12, c: C.redD });
      if (hot) o += T(150, 252, '✋', { s: 26 }) + Th(118, 286, 'tay luồn vào được', { a: 'middle', s: 12.5, c: C.green });
    }
    o += Th(190, 132, 'mô mềm âm đạo', { s: 12.5, c: C.myoD });
    o += card(372, 20, 178, 310) + T(461, 52, 'Cắt TSM làm rộng…', { s: 14 });
    o += `<rect x="388" y="74" width="146" height="72" rx="14" fill="${hot ? C.mint : '#f7f4fc'}"/>` + T(461, 96, 'Mô mềm âm đạo', { s: 13 }) + T(461, 118, mo + ' cm', { s: 16, c: hot ? C.green : C.ink }) + T(461, 136, hot ? '✓ đủ chỗ đưa tay' : 'kéo thêm để rộng', { s: 11.5, c: hot ? C.green : C.mute });
    o += `<rect x="388" y="158" width="146" height="72" rx="14" fill="${hot ? '#ffe6d5' : '#f7f4fc'}"/>` + T(461, 180, 'Vòng xương chậu', { s: 13 }) + T(461, 202, '10,0 cm (y nguyên)', { s: 15, c: hot ? '#b5651d' : C.mute }) + T(461, 220, '✗ xương không đổi', { s: 11.5, c: hot ? C.redD : C.mute });
    o += T(461, 266, 'Kẹt do XƯƠNG', { s: 13, c: C.ink }) + T(461, 286, '→ cắt TSM', { s: 12.5, c: C.mute }) + T(461, 304, 'KHÔNG bắt buộc', { s: 13.5, c: C.redD });
    return o;
  },
  say: s => s.cut >= 70 ? ['worry', 'Chỉ **mô mềm** rộng ra (4 cm → 8,5 cm) → **tay** vào làm thủ thuật. **Xương không rộng thêm** chút nào → không bắt buộc cắt mọi ca.'] : ['happy', 'Có nên **cắt tầng sinh môn**? Kéo thanh **✂️ Cắt TSM hướng 7h** xem cái gì rộng ra 👆']
});
B['xu-tri-dau-tien'] = [
  { t: 'Việc đầu tiên: gọi to, ghi giờ', kit: 'bv-goi' },
  { t: 'McRoberts: gập đùi sát bụng', kit: 'bv-mcr', cr: 'McRoberts: geraldbaeck, Wikimedia Commons · CC0' },
  { t: 'Ấn TRÊN xương mu — đặt tay đâu?', kit: 'bv-supra', cr: credHV },
  { t: 'Ba việc CẤM', kit: 'bv-cam', cr: credHV },
  { t: 'Cắt tầng sinh môn để làm gì?', kit: 'bv-tsm' }
];

// ═════════ BÀI 3 · Không hiệu quả thì đổi cơ chế
const OPT = [['pull', '💪 Kéo mạnh hơn', false], ['rot', '🔄 Xoay vai', true], ['arm', '🖐 Lấy tay sau', true], ['four', '🐾 Tư thế bò 4 chân', true]];
kit('bv-doi', {
  init: () => ({ pull: false, rot: false, arm: false, four: false, last: '' }), ui: () => [],
  after: (s, k) => { s.last = k; }, goal: s => s.rot && s.arm && s.four,
  draw: s => {
    let o = `<rect x="150" y="24" width="260" height="56" rx="16" fill="#ffe6d5"/>` + T(280, 48, 'McRoberts + ấn trên mu', { s: 15 }) + T(280, 68, '✗ vai chưa ra', { s: 13, c: C.redD });
    o += OPT.map(([k, t, good], i) => { const x = 22 + i * 132, on = s[k];
      return arrow(`M280 82 L${x + 61} 120`, on ? (good ? C.green : C.red) : C.grid, 3) + `<g class="tap" data-set="!${k}">${card(x, 124, 122, 96, on ? (good ? C.mint : '#ffd0d8') : '#fff', on ? C.soft : C.grid)}${T(x + 61, 158, t.split(' ')[0], { s: 26 })}${t.slice(t.indexOf(' ') + 1).split(' ').reduce((a, w) => { const l = a[a.length - 1]; if ((l + ' ' + w).length > 11) a.push(w); else a[a.length - 1] = (l + ' ' + w).trim(); return a; }, ['']).map((l, j) => T(x + 61, 184 + j * 16, l, { s: 13 })).join('')}${on ? T(x + 106, 144, good ? '✓' : '⛔', { s: 16, c: good ? C.green : C.redD }) : ''}</g>`; }).join('');
    o += `<rect x="22" y="236" width="518" height="40" rx="14" fill="${C.butter}"/>` + T(281, 262, '⏱ Không cần đợi đủ 30 giây — chưa được là chuyển ngay', { s: 13.5 });
    o += `<rect x="22" y="286" width="518" height="40" rx="14" fill="#f4f0fb"/>` + T(281, 311, 'Cuối cùng: biện pháp cứu vãn — chỉ người nhiều kinh nghiệm', { s: 13, c: C.mute });
    return o;
  },
  say: s => s.last === 'pull' && s.pull ? ['ouch', 'Kéo mạnh hơn **không** gỡ được vai — chỉ thêm tổn thương. Chọn thẻ khác!'] : s.rot && s.arm && s.four ? ['happy', 'Chưa ra thì **đổi cơ chế** ngay: xoay vai, lấy tay sau, tư thế bò 4 chân — thứ tự theo phác đồ và đội đã huấn luyện.'] : ['worry', 'McRoberts + ấn trên mu **chưa ra**. Làm gì tiếp? Chạm **các thẻ đúng** 👆']
});
kit('bv-xoay2', {
  init: () => ({ a: 0 }), ui: () => [{ t: 'range', k: 'a', label: '🔄 Ngón tay xoay vai', min: 0, max: 45, step: 5, unit: '°' }], goal: s => s.a >= 40,
  draw: s => {
    const R = inlet(190, 180, 1.12, s.a, 107, { guides: true, pdeg: s._p?.a });
    let o = card(20, 20, 340, 310) + T(190, 44, 'Eo trên — nhìn từ dưới lên', { s: 14, c: C.mute }) + R.svg;
    // hai ngón tay đặt sau vai trước
    const [x, y] = R.c1, ang = s.a;
    o += `<g transform="translate(${x} ${y}) rotate(${ang})"><rect x="${-46}" y="-8" width="34" height="13" rx="6.5" fill="#ffe2cf" stroke="${C.skinD}"/><rect x="${-46}" y="8" width="34" height="13" rx="6.5" fill="#ffe2cf" stroke="${C.skinD}"/></g>` + Th(x - 52, y - 20, 'ngón tay', { a: 'end', s: 12.5 });
    if (s.a) o += `<path d="M${190 + 70} ${180 - 92} A116 116 0 0 1 ${190 + 108} ${180 - 30}" fill="none" stroke="${C.green}" stroke-width="2.4" marker-end="url(#arG)"/>`;
    o += card(372, 20, 178, 310) + T(461, 60, 'Ngón tay đẩy', { s: 14 }) + T(461, 80, 'mặt sau vai', { s: 14 }) + T(461, 126, '↓', { s: 22, c: C.soft }) + T(461, 160, 'hai vai xoay', { s: 14 }) + T(461, 180, 'sang đường chéo', { s: 14 });
    o += `<rect x="388" y="222" width="146" height="70" rx="16" fill="${R.ok ? C.mint : '#ffd0d8'}"/>` + T(461, 255, R.ok ? '✓ vai lọt' : '✗ còn kẹt', { s: 19, c: R.ok ? C.green : C.redD }) + T(461, 278, s.a + '°', { s: 13, c: C.mute });
    return o;
  },
  say: s => s.a >= 40 ? ['wow', '**Xoay vai**: ngón tay đẩy mặt sau vai → hai vai từ **trước–sau** sang **đường chéo** rộng hơn → lọt.'] : ['happy', 'Bác sĩ đưa **ngón tay** vào sau vai trước. Kéo thanh **🔄 Ngón tay xoay vai** 👆']
});
kit('bv-tay', {
  init: () => ({ keo: 0 }), ui: () => [{ t: 'range', k: 'keo', label: '🖐 Quét cẳng tay sau qua ngực', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.keo >= 70,
  draw: s => {
    const f = s.keo / 100, hot = f >= .7, hl = Math.round(107 - 23 * f), dk = (12.0 - 2.5 * f).toFixed(1);
    const R = inlet(461, 154, .62, 0, hl, { arm: hot, phl: s._p ? Math.round(107 - 23 * (s._p.keo || 0) / 100) : null });
    let o = card(20, 20, 340, 310) + pic('vai-hep.jpg', 30, 34, 320, 246);
    // khung highlight theo tiến trình kéo
    o += `<rect x="${hot ? 186 : 38}" y="38" width="154" height="236" rx="14" fill="none" stroke="${hot ? C.green : C.amber}" stroke-width="2.6" stroke-dasharray="${hot ? '' : '5 4'}" class="pulse"/>`;
    o += `<rect x="42" y="284" width="140" height="26" rx="13" fill="${hot ? '#fff' : '#ffd0d8'}" stroke="${hot ? C.grid : C.red}" stroke-width="1.4"/><rect x="194" y="284" width="154" height="26" rx="13" fill="${hot ? C.mint : '#fff'}" stroke="${hot ? C.green : C.grid}" stroke-width="1.4"/>` + Th(112, 301, '① 2 vai: 12,0 cm', { s: 12.5, c: C.redD }) + Th(271, 301, '② nách + vai: 9,5 cm', { s: 12.5, c: C.green });
    o += card(372, 20, 178, 310) + T(461, 42, 'Nhìn từ dưới lên', { s: 12, c: C.mute }) + R.svg;
    o += `<rect x="388" y="222" width="146" height="52" rx="12" fill="${R.ok ? C.mint : '#ffd0d8'}"/>` + T(461, 244, 'Đường kính vai', { s: 12, c: C.mute }) + T(461, 263, `${dk} cm (${R.ok ? '✓ LỌT' : '✗ KẸT'})`, { s: 15, c: R.ok ? C.green : C.redD });
    o += T(461, 292, R.ok ? 'giảm 2,5 cm' : 'chưa hạ tay sau', { s: 12.5, c: R.ok ? C.green : C.mute }) + (R.ok ? T(461, 308, 'vai trước trượt lọt!', { s: 12.5, c: C.green }) : '');
    return o;
  },
  say: s => s.keo >= 70 ? ['wow', 'Đưa **tay sau** ra ngoài → chỉ còn **vai + nách** đi qua → đường kính **giảm 2,5 cm** (12 cm → 9,5 cm) → vai lọt ngay.'] : ['happy', 'Kéo thanh **🖐 Quét cẳng tay sau qua ngực** — xem đường kính vai bé thu hẹp lại 👆']
});
B['thu-thuat-tiep'] = [
  { t: 'Chưa ra? Đổi cách, đừng kéo mạnh hơn', kit: 'bv-doi' },
  { t: 'Xoay vai bằng ngón tay', kit: 'bv-xoay2' },
  { t: 'Lấy tay sau: bớt một tay, vai hẹp lại', kit: 'bv-tay', cr: 'Mottet N. và cs., Wikimedia Commons · CC BY 4.0' }
];

// ═════════ BÀI 4 · Ra được thân chưa phải là hết việc
kit('bv-hoisuc', {
  init: () => ({ m: 0 }), ui: () => [{ t: 'range', k: 'm', label: '⏱ Thời gian kẹt vai', min: 0, max: 10, step: 1, unit: '' }], goal: s => s.m >= 7,
  draw: s => {
    const f = s.m / 10;
    let o = card(20, 20, 300, 310);
    o += pic('sv-be.png', 96, 26, 150, 300) + `<g opacity="${(f * .9).toFixed(2)}" filter="url(#tim)">${pic('sv-be.png', 96, 26, 150, 300)}</g>`;
    o += card(332, 20, 218, 310) + T(441, 52, 'Thiếu oxy', { s: 15 }) + ZS.bar(352, 64, 178, s.m * 10, f > .6 ? C.red : f > .3 ? C.amber : C.mintD, '', { h: 14 }) + T(441, 102, f > .6 ? 'nặng' : f > .3 ? 'tăng dần' : 'còn ít', { s: 13, c: C.mute });
    o += T(441, 146, 'kẹt càng lâu', { s: 14 }) + T(441, 166, '→ càng nặng', { s: 14 });
    o += `<rect x="350" y="204" width="182" height="104" rx="16" fill="${C.sky}"/>` + T(441, 236, '🧑‍⚕️ Đội nhi', { s: 15 }) + T(441, 258, 'có mặt SẴN', { s: 14 }) + T(441, 280, '→ hồi sức ngay', { s: 14 });
    return o;
  },
  say: s => s.m >= 7 ? ['worry', 'Kẹt càng lâu → bé **thiếu oxy** càng nặng (tím, mềm, ít thở). **Đội nhi** phải có mặt sẵn để **hồi sức ngay**.'] : ['happy', 'Kéo thanh **⏱ Thời gian kẹt vai** xem bé thay đổi thế nào 👆']
});
// sơ đồ rễ C5–T1 → chức năng (bên phải)
const ROOTS = [['C5', 'dạng vai'], ['C6', 'gấp khuỷu'], ['C7', 'duỗi khuỷu'], ['C8', 'gấp ngón'], ['T1', 'cơ bàn tay']];
const rootMap = (x, y, hot, tapSet) => `<rect x="${x}" y="${y}" width="18" height="${5 * 46 - 6}" rx="9" fill="url(#gBone)" stroke="${C.boneD}"/>` + T(x + 9, y - 8, 'tủy cổ', { s: 11.5, c: C.mute })
  + ROOTS.map(([r, f], i) => { const yy = y + 20 + i * 46, h = hot.includes(i); return `<g ${tapSet && i > 2 ? `class="tap" data-set="${tapSet}"` : ''}><path d="M${x + 18} ${yy} H${x + 50}" stroke="${h ? C.red : '#e5b800'}" stroke-width="${h ? 5 : 3}" stroke-linecap="round"/>${T(x + 58, yy + 5, r, { a: 'start', s: 15, c: h ? C.redD : C.ink })}${T(x + 88, yy + 5, f, { a: 'start', s: 12, c: h ? C.redD : C.mute })}${h ? `<path d="M${x + 22} ${yy - 7} l14 14 m0 -14 l-14 14" stroke="${C.redD}" stroke-width="2.4"/>` : ''}</g>`; }).join('');
kit('bv-erb', {
  init: () => ({ tap: false }), ui: () => [], goal: s => s.tap,
  draw: s => {
    let o = card(20, 20, 200, 310) + pic('erb.jpg', 26, 24, 188, 302);
    if (!s.tap) {
      o += tap('tap=true', 148, 195, 36, 80) + tap('tap=true', 68, 95, 26, 26);
      o += Th(68, 126, 'tay lành', { s: 12, c: C.green, a: 'middle' });
      o += Th(148, 276, 'tay liệt', { s: 12, c: C.redD, a: 'middle' });
    } else {
      o += `<circle cx="158" cy="106" r="16" fill="none" stroke="${C.red}" stroke-width="2.5" class="pulse"/>` + call(158, 106, 232, 70, 'C5 → vai khép, xoay trong', C.redD);
      o += `<circle cx="148" cy="195" r="16" fill="none" stroke="${C.red}" stroke-width="2.5" class="pulse"/>` + call(148, 195, 232, 186, 'C6 → khuỷu duỗi thẳng', C.redD);
      o += `<circle cx="126" cy="270" r="14" fill="none" stroke="${C.red}" stroke-width="2.5" class="pulse"/>` + call(126, 270, 232, 286, 'C7 → cổ tay bồi bàn', C.redD);
      o += `<circle cx="68" cy="95" r="16" fill="none" stroke="${C.green}" stroke-width="2"/>` + Th(68, 95, '✓ tay lành: co gập', { s: 12, c: C.green, a: 'middle' });
    }
    o += card(372, 20, 178, 310) + rootMap(384, 50, s.tap ? [0, 1] : [], '');
    return o;
  },
  say: s => s.tap ? ['worry', '**Erb (C5–C6)**: đầu bị kéo lệch xa vai → căng rễ trên. Tay **thõng, khép, xoay trong, cổ tay gập** (“tay bồi bàn”). **Nắm tay vẫn còn**.'] : ['happy', 'Bé này cử động **một tay** kém. Chạm vào **tay bị liệt** trên hình thật 👆']
});
kit('bv-klu', {
  init: () => ({ f: 0 }), ui: () => [{ t: 'range', k: 'f', label: '🙆 Tay bị kéo lên quá đầu', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.f >= 70,
  draw: s => {
    const hot = s.f >= 60, f = s.f / 100;
    let o = card(20, 20, 340, 310) + pic('horner.jpg', 30, 30, 320, 80);
    o += `<ellipse cx="85" cy="71" rx="26" ry="16" fill="none" stroke="${C.green}" stroke-width="1.6" stroke-dasharray="3 3"/>` + Th(85, 102, 'mắt lành bình thường', { s: 11.5, c: C.mute });
    if (hot) {
      o += `<ellipse cx="266" cy="71" rx="28" ry="18" fill="none" stroke="${C.red}" stroke-width="2.5" class="pulse"/>` + call(266, 52, 280, 22, 'mi sụp · co đồng tử (Horner)', C.redD, 'middle', 12);
    }
    o += pic('sv-ban-tay.png', 120, 128, 112, 194) + (f ? `<path d="M326 306 V${306 - 130 * f}" stroke="${hot ? C.red : C.amber}" stroke-width="${3 + 4 * f}" stroke-linecap="round" marker-end="url(#${hot ? 'arR' : 'ar'})"/>` + Th(326, 322, 'kéo tay lên ↑', { s: 11.5, c: hot ? C.redD : '#b8860b' }) : '');
    if (hot) o += `<ellipse cx="176" cy="268" rx="44" ry="38" fill="${C.red}" opacity=".22"/>` + call(176, 268, 244, 240, 'cơ nhỏ bàn tay liệt', C.redD) + Th(244, 262, '→ bàn tay vuốt', { a: 'start', s: 13, c: C.redD });
    o += card(372, 20, 178, 310) + rootMap(384, 50, hot ? [3, 4] : [], '');
    return o;
  },
  say: s => s.f >= 70 ? ['worry', '**Klumpke (C8–T1)**: tay kéo lên quá đầu → căng rễ dưới. **Cơ nhỏ bàn tay** liệt → **bàn tay vuốt**; tổn thương T1 → **sụp mi, co đồng tử (Horner)**.'] : ['happy', 'Kéo thanh **🙆 Tay bị kéo lên quá đầu** — rễ nào bị căng trên sơ đồ? 👆']
});
kit('bv-don', {
  init: () => ({ tap: false }), ui: () => [], goal: s => s.tap,
  draw: s => {
    let o = card(20, 20, 340, 310) + pic('sv-xuong-don.png', 30, 40, 320, 261);
    if (s.tap) {
      o += `<circle cx="142" cy="78" r="18" fill="${C.red}" fill-opacity=".2" stroke="${C.red}" stroke-width="2.5" class="pulse"/>`;
      o += call(142, 78, 220, 38, '🦴 gãy 1/3 ngoài–giữa', C.redD);
      o += Th(142, 114, '💥 sờ lạo xạo xương (crepitus)', { s: 12.5, c: C.redD });
    } else {
      o += tap('tap=true', 142, 78, 34, 26);
      o += Th(142, 114, '👆 chạm chỗ gãy', { s: 12, c: C.soft });
    }
    o += card(372, 20, 178, 310);
    o += s.tap ? [['🫳', 'sưng, sờ lạo xạo'], ['💪', 'tay ít cử động'], ['↔', 'Moro mất 1 bên'], ['⚠', 'dễ nhầm liệt'], ['🦴', 'can xương sau 2-4w']].map(([ic, t], i) => T(392, 66 + i * 52, ic, { a: 'start', s: 20 }) + T(422, 62 + i * 52, t, { a: 'start', s: 13 })).join('') : T(461, 170, '👆', { s: 34 }) + T(461, 212, 'Chỗ nào gãy?', { s: 15 }) + T(461, 234, 'sờ nắn xương đòn', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => s.tap ? ['worry', '**Gãy xương đòn**: sưng, sờ **lạo xạo xương**, tay ít cử động, Moro **mất một bên** — dễ nhầm với liệt đám rối nhưng can xương lành sau 2–4 tuần.'] : ['happy', 'Xương hay gãy nhất khi kẹt vai: sờ nắn chạm vào **chỗ gãy** trên hình 👆']
});
kit('bv-me', {
  init: () => ({ sel: '', u: false, p: false }), ui: () => [{ t: 'seg', k: 'sel', opts: [['u', '🤰 Tử cung'], ['p', '🩹 Tầng sinh môn']] }], after: s => { if (s.sel === 'u') s.u = true; if (s.sel === 'p') s.p = true; }, goal: s => s.u && s.p,
  draw: s => {
    let o = `<g>${card(20, 20, 256, 310, s.u ? '#fff1f4' : '#fff', s.u ? C.pinkD : C.grid)}${pic('sv-tu-cung.png', 34, 40, 228, 170)}`;
    o += s.u ? [0, 1, 2].map(i => ZS.drop(126 + i * 22, 232 + (i % 2) * 14, .9, 'drip')).join('') + T(148, 290, 'Tử cung mệt → đờ', { s: 14 }) + T(148, 310, '→ BĂNG HUYẾT', { s: 14, c: C.redD }) : T(148, 290, '👆 chọn 🤰 ở trên', { s: 14, c: C.soft });
    o += `</g><g>${card(294, 20, 256, 310, s.p ? '#fff1f4' : '#fff', s.p ? C.pinkD : C.grid)}`;
    o += `<ellipse cx="422" cy="130" rx="46" ry="70" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="1.4"/><ellipse cx="422" cy="128" rx="14" ry="44" fill="#fff" stroke="${C.myoD}"/><circle cx="422" cy="236" r="16" fill="#f3c6d3" stroke="${C.pinkD}" stroke-width="1.4"/><path d="M402 204 Q422 214 442 204 L440 220 Q422 226 404 220Z" fill="${C.peach}" stroke="${C.peachD}"/>` + T(474, 132, 'âm hộ', { a: 'start', s: 12.5, c: C.mute }) + call(404, 212, 372, 196, 'tầng sinh môn', C.mute, 'end', 12) + T(444, 241, 'hậu môn', { a: 'start', s: 12.5, c: C.mute });
    o += s.p ? `<path d="M422 174 L426 196 L418 210 L422 226" fill="none" stroke="${C.redD}" stroke-width="3" stroke-linecap="round"/>` + T(422, 290, 'Rách độ III–IV', { s: 14, c: C.redD }) + T(422, 310, '(tới cơ thắt hậu môn)', { s: 12, c: C.mute }) : T(422, 290, '👆 chọn 🩹 ở trên', { s: 14, c: C.soft });
    return o + '</g>';
  },
  say: s => s.u && s.p ? ['worry', 'Mẹ dễ **băng huyết** (tử cung mệt, đờ) và **rách tầng sinh môn độ III–IV** (tới cơ thắt hậu môn) → khám kỹ, xử trí ngay.'] : ['happy', 'Bé xong rồi, tới **mẹ**: chọn **2 chỗ** cần kiểm tra ở trên 👆']
});
const REC = [['⏱', 'Giờ đầu ra · giờ thân ra', '10:02 · 10:05'], ['👥', 'Ai có mặt, lúc mấy giờ', 'BS sản, gây mê, nhi'], ['🔄', 'Thủ thuật theo thứ tự + đáp ứng', 'McRoberts ✗ → ấn mu ✓'], ['👶', 'Tình trạng bé · 👩 mẹ', 'Apgar, tay P yếu · rách độ II'], ['💬', 'Đã giải thích cho gia đình', 'lúc 10:40, hẹn khám lại']];
kit('bv-ghi', {
  init: () => ({ f0: false, f1: false, f2: false, f3: false, f4: false }), ui: () => [], goal: s => REC.every((_, i) => s['f' + i]),
  draw: s => {
    let o = `<rect x="20" y="30" width="356" height="300" rx="14" fill="#fffdf4" stroke="${C.butterD}"/><rect x="150" y="18" width="96" height="26" rx="8" fill="${C.soft}"/>` + T(198, 36, 'HỒ SƠ', { s: 13, c: '#fff' });
    o += REC.map(([ic, t, v], i) => { const on = s['f' + i], y = 62 + i * 52;
      return `<g class="tap" data-set="!f${i}">${card(34, y, 328, 44, on ? '#fff' : '#f7f4fc', on ? C.mintD : C.grid)}${T(50, y + 28, ic, { a: 'start', s: 17 })}${T(80, y + 19, t, { a: 'start', s: 12.5, c: C.mute })}${on ? T(80, y + 36, v, { a: 'start', s: 13.5, c: C.ink }) : T(80, y + 36, '👆 chạm để ghi', { a: 'start', s: 12, c: C.soft })}</g>`; }).join('');
    o += `<g transform="rotate(4 466 170)">${card(392, 70, 150, 140, '#fff3c4', C.butterD)}${T(467, 112, '“Kẹt vai —', { s: 14 })}${T(467, 132, 'đã xử trí”', { s: 14 })}<path d="M402 100 L532 150" stroke="${C.red}" stroke-width="3"/>${T(467, 180, '✗ thiếu hết!', { s: 14, c: C.redD })}</g>`;
    o += T(466, 262, 'Ghi khách quan,', { s: 13, c: C.mute }) + T(466, 282, 'không phán chắc', { s: 13, c: C.mute }) + T(466, 302, 'nguyên nhân', { s: 13, c: C.mute });
    return o;
  },
  say: s => REC.every((_, i) => s['f' + i]) ? ['happy', 'Ghi **khách quan**: giờ, người có mặt, **thủ thuật theo thứ tự + đáp ứng**, tình trạng bé và mẹ. Giải thích gia đình, **không phán chắc** nguyên nhân tổn thương.'] : ['happy', 'Chạm từng dòng trống để **ghi hồ sơ** cho đủ 👆']
});
B['hau-qua-ghi-nhan'] = [
  { t: 'Bé ra rồi: hồi sức ngay', kit: 'bv-hoisuc', cr: 'Em bé: Servier Medical Art · CC BY 4.0' },
  { t: 'Erb (C5–C6): tay “xin tiền boa”', kit: 'bv-erb', cr: 'Ảnh: r, Wikimedia Commons · CC BY-SA 4.0' },
  { t: 'Klumpke (C8–T1): bàn tay & con mắt', kit: 'bv-klu', cr: 'Mắt: Waster, Wikimedia Commons · CC BY 2.5 · Bàn tay: Servier Medical Art · CC BY 4.0' },
  { t: 'Gãy xương đòn', kit: 'bv-don', cr: 'Servier Medical Art · CC BY 4.0' },
  { t: 'Còn mẹ thì sao?', kit: 'bv-me', cr: 'Tử cung: Servier Medical Art · CC BY 4.0' },
  { t: 'Ghi hồ sơ: đủ 5 dòng', kit: 'bv-ghi' }
];
})();
