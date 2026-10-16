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
  init: () => ({ pull: false }), ui: () => [{ t: 'tog', k: 'pull', label: '🤲 Kéo nhẹ đầu theo trục' }], goal: s => s.pull,
  draw: s => {
    let o = KV(false);
    if (s.pull) { const nw = ZS.fresh(s, x => x.pull); o += ZS.drawIn(arrow(`M${HD[0] + 30} ${HD[1] + 26} l30 14`, C.mute, 4), .4) + `<g class="bob">${ZS.drawIn(arrow(`M${HD[0] + 58} ${HD[1] + 54} q-30 8 -44 -10`, C.red, 4), .9)}</g>` + ZS.fade(Th(HD[0] + 4, HD[1] + 76, '🐢 đầu rụt lại', { c: C.redD }) + `<g class="shake-once">${lockIcon(SH[0] - 30, SH[1] - 10, false)}</g>` + call(SH[0], SH[1], 250, 44, 'vai không ra', C.redD), nw); }
    o += card(372, 20, 178, 310) + T(461, 54, 'Kéo nhẹ thường…', { s: 15 });
    o += T(461, 100, 'vai có ra không?', { s: 13, c: C.mute }) + T(461, 150, s.pull ? '✗' : '?', { s: 44, c: s.pull ? C.redD : C.grid });
    if (s.pull) o += `<rect x="388" y="200" width="146" height="70" rx="16" fill="#ffd0d8"/>` + T(461, 232, 'KẸT VAI', { s: 22, c: C.redD }) + T(461, 254, 'gọi to ngay!', { s: 13, c: C.redD });
    return o;
  },
  say: s => s.pull ? ['worry', 'Vai **không ra**, đầu còn **rụt lại** sát tầng sinh môn (**dấu con rùa 🐢**). Kéo nhẹ thường không ra = **kẹt vai**.'] : ['happy', 'Đầu bé đã **ra ngoài** rồi. Bấm **🤲 Kéo nhẹ đầu theo trục** xem vai có theo ra không 👆']
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
  init: () => ({ f: 0 }), ui: () => [{ t: 'range', k: 'f', label: '💪 Lực kéo đầu', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.f >= 70,
  draw: s => {
    const f = s.f / 100, col = f > .55 ? C.red : f > .25 ? C.amber : '#e5b800';
    let o = KV(false);
    if (f) o += arrow(`M${HD[0] + 28} ${HD[1] + 24} l${18 + 34 * f} ${8 + 15 * f}`, C.red, 4 + 3 * f);
    o += [0, 1, 2, 3].map(i => `<path d="M${SH[0] + 6 + i * 3} ${SH[1] + 4 + i * 4} Q${NK[0]} ${NK[1] - 8 + i * 5} ${HD[0] - 22} ${HD[1] - 18 + i * 6}" fill="none" stroke="${col}" stroke-width="${1.6 + 1.4 * f}" stroke-linecap="round" ${f > .55 ? 'class="pulse"' : ''}/>`).join('');
    o += lockIcon(SH[0] - 34, SH[1] - 12, false) + (f > .55 ? call(NK[0], NK[1], 300, 300, 'đám rối căng!', C.redD, 'middle') : Th(300, 300, 'đám rối cánh tay', { c: '#a08400', s: 12.5 }));
    o += card(372, 20, 178, 310) + T(461, 52, 'Vai ra được?', { s: 14 }) + ZS.bar(392, 64, 138, 0, C.green, '', { h: 14 }) + T(461, 100, 'không nhúc nhích', { s: 12.5, c: C.mute });
    o += T(461, 150, 'Căng đám rối', { s: 14 }) + ZS.bar(392, 162, 138, s.f, col, '', { h: 14 }) + T(461, 198, s.f + '%', { s: 14, c: col });
    if (s.f >= 70) o += `<rect x="388" y="232" width="146" height="70" rx="16" fill="#ffd0d8"/>` + T(461, 262, '⚠ liệt tay', { s: 17, c: C.redD }) + T(461, 284, 'vai vẫn kẹt', { s: 13, c: C.redD });
    return o;
  },
  say: s => s.f >= 70 ? ['ouch', 'Kéo mạnh **không gỡ được vai** — xương vẫn chặn. Chỉ kéo **căng đám rối cánh tay** ở cổ → có thể liệt tay.'] : ['happy', 'Hay là kéo **mạnh hơn**? Kéo thanh **💪 Lực kéo đầu** lên xem 👆']
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
    let o = card(20, 20, 300, 310) + pic('mcroberts.svg', 24, 24, 292, 300) + Th(250, 140, '① gập đùi', { c: C.redD, s: 13 }) + Th(150, 182, '② ấn trên mu', { c: C.redD, s: 13 });
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
    if (ok) o += ZS.drawIn(arrow(`M${SP[0] - 34} ${SP[1] - 50} l22 34`, C.green, 5), .6) + Th(SP[0] - 40, SP[1] - 58, 'ấn ngay trên xương mu', { a: 'end', c: C.green }) + `<circle cx="${SH[0]}" cy="${SH[1] - 6}" r="20" fill="none" stroke="${C.green}" stroke-width="2.4"/>`;
    if (bad) o += Th(FU[0] + 12, FU[1] + 30, '⛔ đáy tử cung', { a: 'start', c: C.redD });
    const R = inlet(461, 170, .62, ok ? 45 : 0, ok ? 98 : 107, { pdeg: s._p ? (s._p.pick === 'mu' ? 45 : 0) : null, phl: s._p ? (s._p.pick === 'mu' ? 98 : 107) : null });
    o += card(372, 20, 178, 310) + T(461, 44, 'Nhìn từ dưới lên', { s: 12.5, c: C.mute }) + R.svg;
    o += T(461, 280, ok ? '✓ vai khép + xoay chéo' : 'vai đang trước–sau', { s: 13, c: ok ? C.green : C.mute }) + (ok ? T(461, 300, '→ lọt', { s: 15, c: C.green }) : '');
    return o;
  },
  say: s => s.pick === 'mu' ? ['wow', 'Đúng! Ấn **ngay trên xương mu**, đẩy **lưng vai trước** về phía ngực bé → vai **khép lại và xoay chéo** → lọt. Người đã được huấn luyện làm.'] : s.pick === 'day' ? ['ouch', 'Đó là **đáy tử cung** — ấn đây làm vai **nêm chặt hơn**. Thử chỗ khác!'] : ['happy', '**Ấn trên xương mu**: đặt tay ở đâu? Chạm vào một trong hai vòng 👆']
});
kit('bv-cam', {
  init: () => ({ fun: false, yank: false, twist: false, seen: '' }), ui: () => [],
  after: (s, k) => { if (s[k] && !s.seen.includes(k)) s.seen += k + ','; ['fun', 'yank', 'twist'].forEach(x => { if (x !== k) s[x] = false; }); },
  goal: s => ['fun', 'yank', 'twist'].every(k => s.seen.includes(k)),
  draw: s => {
    let o = KV(false);
    if (s.fun) o += ZS.drawIn(arrow(`M${FU[0] - 4} ${FU[1] - 70} l34 34`, C.red, 6)) + call(SH[0], SH[1], 250, 44, 'vai nêm CHẶT hơn', C.redD) + Th(FU[0] + 4, FU[1] + 40, 'có thể vỡ tử cung', { a: 'start', c: C.redD, s: 13 }) + `<circle cx="${SH[0]}" cy="${SH[1] - 6}" r="22" fill="none" stroke="${C.red}" stroke-width="3" class="pulse"/>`;
    if (s.yank) o += ZS.drawIn(arrow(`M${HD[0] + 28} ${HD[1] + 24} l46 20`, C.red, 7)) + call(NK[0], NK[1], 300, 300, 'rách đám rối', C.redD, 'middle');
    if (s.twist) o += `<path d="M${HD[0] - 30} ${HD[1] + 40} A42 42 0 1 0 ${HD[0] + 40} ${HD[1] - 26}" fill="none" stroke="${C.red}" stroke-width="3" marker-end="url(#arR)"/>` + call(NK[0], NK[1], 300, 300, 'tổn thương cổ', C.redD, 'middle');
    o += tcard('!fun', 372, 20, 178, 92, s.fun, ['⛔ Ấn đáy tử cung', 'xem hậu quả'], '#ffd0d8') + tcard('!yank', 372, 129, 178, 92, s.yank, ['⛔ Kéo giật đầu', 'xem hậu quả'], '#ffd0d8') + tcard('!twist', 372, 238, 178, 92, s.twist, ['⛔ Vặn xoay đầu', 'xem hậu quả'], '#ffd0d8');
    return o;
  },
  say: s => ['fun', 'yank', 'twist'].every(k => s.seen.includes(k)) ? ['ouch', 'Ấn **đáy tử cung** → vai nêm chặt hơn, có thể vỡ tử cung. **Kéo giật / vặn đầu** → tổn thương cổ và đám rối cánh tay.'] : s.fun ? ['ouch', 'Lực từ **đáy** đẩy vai **nêm sâu hơn** vào khớp vệ.'] : s.yank ? ['ouch', 'Kéo giật **không gỡ được vai**, chỉ làm **rách đám rối cánh tay**.'] : s.twist ? ['ouch', 'Vặn đầu làm **tổn thương cổ**, vai vẫn kẹt.'] : ['worry', 'Có **3 việc CẤM** khi kẹt vai. Bấm từng thẻ xem hậu quả 👆']
});
kit('bv-tsm', {
  init: () => ({ cut: false }), ui: () => [{ t: 'tog', k: 'cut', label: '✂️ Cắt tầng sinh môn' }], goal: s => s.cut,
  draw: s => {
    const c = s.cut;
    let o = card(20, 20, 340, 310) + T(190, 46, 'Lỗ ra khung chậu — nhìn từ dưới', { s: 13, c: C.mute });
    o += `<ellipse cx="190" cy="186" rx="128" ry="112" fill="none" stroke="${C.bone}" stroke-width="22"/><ellipse cx="190" cy="186" rx="117" ry="101" fill="none" stroke="${C.boneD}" stroke-width="1.2"/>` + Th(190, 84, 'XƯƠNG (cứng)', { s: 13, c: '#a07a3c' });
    o += `<ellipse cx="190" cy="${c ? 196 : 190}" rx="${c ? 88 : 86}" ry="${c ? 82 : 76}" fill="#ffd6e2" stroke="${C.pinkD}" stroke-width="1.2"/>`;
    o += `<path d="M190 ${c ? 190 : 186} m-34 0 a34 ${c ? 50 : 34} 0 1 0 68 0 a34 ${c ? 50 : 34} 0 1 0 -68 0" fill="#fff" stroke="${C.myoD}" stroke-width="1.4"/>` + `<circle cx="190" cy="${c ? 184 : 184}" r="26" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/>`;
    if (c) o += `<path d="M198 238 L238 282" stroke="${C.redD}" stroke-width="2.4" stroke-dasharray="5 4"/>` + Th(244, 296, 'đường cắt', { a: 'start', s: 12.5, c: C.redD }) + T(150, 250, '✋', { s: 26 }) + Th(118, 286, 'tay vào được', { a: 'middle', s: 12.5, c: C.green });
    o += Th(190, 132, 'mô mềm', { s: 12.5, c: C.myoD });
    o += card(372, 20, 178, 310) + T(461, 60, 'Cắt TSM làm', { s: 14 }) + T(461, 80, 'rộng cái gì?', { s: 14 });
    o += `<rect x="388" y="110" width="146" height="60" rx="14" fill="${c ? C.mint : '#f7f4fc'}"/>` + T(461, 136, 'mô mềm', { s: 14 }) + T(461, 156, c ? '✓ rộng ra' : '?', { s: 14, c: c ? C.green : C.mute });
    o += `<rect x="388" y="186" width="146" height="60" rx="14" fill="${c ? '#ffe6d5' : '#f7f4fc'}"/>` + T(461, 212, 'xương', { s: 14 }) + T(461, 232, c ? '✗ y nguyên' : '?', { s: 14, c: c ? '#b5651d' : C.mute });
    if (c) o += T(461, 284, 'không bắt buộc', { s: 13, c: C.mute }) + T(461, 302, 'mọi ca', { s: 13, c: C.mute });
    return o;
  },
  say: s => s.cut ? ['worry', 'Chỉ **mô mềm** rộng ra → **tay** dễ vào làm thủ thuật. **Xương không rộng thêm** chút nào → không bắt buộc cắt mọi ca.'] : ['happy', 'Có nên **cắt tầng sinh môn**? Bấm **✂️** xem cái gì rộng ra 👆']
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
  init: () => ({ arm: false }), ui: () => [{ t: 'tog', k: 'arm', label: '🖐 Lấy tay sau ra ngoài' }], goal: s => s.arm,
  draw: s => {
    const R = inlet(461, 160, .62, 0, s.arm ? 84 : 107, { arm: s.arm, phl: s._p ? (s._p.arm ? 84 : 107) : null });
    let o = card(20, 20, 340, 310) + pic('vai-hep.jpg', 34, 40, 312, 240) + Th(110, 300, 'đủ hai tay: rộng', { s: 13, c: C.redD }) + Th(266, 300, 'bớt một tay: hẹp', { s: 13, c: C.green });
    o += card(372, 20, 178, 310) + T(461, 44, 'Nhìn từ dưới lên', { s: 12.5, c: C.mute }) + R.svg;
    o += T(461, 270, R.ok ? '✓ vai lọt' : '✗ vai kẹt', { s: 18, c: R.ok ? C.green : C.redD }) + T(461, 292, s.arm ? 'còn vai + nách' : 'đủ hai vai', { s: 13, c: C.mute });
    return o;
  },
  say: s => s.arm ? ['wow', 'Đưa **tay sau** ra ngoài → chỉ còn **vai + nách** đi qua → đường kính **nhỏ lại** → vai lọt.'] : ['happy', 'Bấm **🖐 Lấy tay sau ra ngoài** — xem đường kính vai đổi thế nào 👆']
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
    let o = card(20, 20, 300, 310) + `<filter id="tim"><feColorMatrix type="matrix" values="0.55 0 0 0 0  0 0.62 0 0 0.05  0 0 1 0 0.22  0 0 0 1 0"/></filter>`;
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
    if (!s.tap) o += tap('tap=true', 140, 210, 34, 86) + tap('tap=true', 66, 110, 30, 40);
    else o += call(160, 120, 232, 70, 'vai khép, xoay trong', C.redD) + call(136, 200, 232, 186, 'khuỷu duỗi', C.redD) + call(128, 286, 232, 290, 'cổ tay gập', C.redD) + Th(30, 174, 'tay lành: gập', { s: 12.5, c: C.green, a: 'start' });
    o += card(372, 20, 178, 310) + rootMap(384, 50, s.tap ? [0, 1] : [], '');
    return o;
  },
  say: s => s.tap ? ['worry', '**Erb (C5–C6)**: đầu bị kéo lệch xa vai → căng rễ trên. Tay **thõng, khép, xoay trong, cổ tay gập** (“tay xin tiền boa”). **Nắm tay vẫn còn**.'] : ['happy', 'Bé này cử động **một tay** kém. Chạm vào **tay bị liệt** 👆']
});
kit('bv-klu', {
  init: () => ({ tap: false }), ui: () => [], goal: s => s.tap,
  draw: s => {
    let o = card(20, 20, 340, 310) + pic('horner.jpg', 30, 30, 320, 80);
    o += pic('sv-ban-tay.png', 120, 128, 112, 194);
    if (s.tap) o += `<ellipse cx="176" cy="268" rx="44" ry="38" fill="${C.red}" opacity=".22"/>` + call(176, 268, 244, 240, 'cơ nhỏ bàn tay liệt', C.redD) + Th(244, 262, '→ bàn tay vuốt', { a: 'start', s: 13, c: C.redD }) + call(268, 72, 300, 126, 'đồng tử co · mi sụp', C.redD, 'middle');
    o += card(372, 20, 178, 310) + rootMap(384, 50, s.tap ? [3, 4] : [], s.tap ? '' : 'tap=true');
    if (!s.tap) o += `<rect x="384" y="${50 + 3 * 46 + 2}" width="160" height="88" rx="14" fill="none" stroke="${C.soft}" stroke-width="2" stroke-dasharray="6 5" class="pulse"/>`;
    return o;
  },
  say: s => s.tap ? ['worry', '**Klumpke (C8–T1)**: tay bị kéo lên quá đầu → căng rễ dưới. **Cơ nhỏ bàn tay** liệt → **bàn tay vuốt**; tổn thương T1 → **sụp mi, co đồng tử** (Horner).'] : ['happy', 'Chạm vào **2 rễ dưới cùng (C8–T1)** trên sơ đồ 👆']
});
kit('bv-don', {
  init: () => ({ tap: false }), ui: () => [], goal: s => s.tap,
  draw: s => {
    let o = card(20, 20, 340, 310) + pic('sv-xuong-don.png', 30, 40, 320, 261);
    o += s.tap ? call(116, 92, 210, 44, 'xương đòn gãy', C.redD) : tap('tap=true', 116, 92, 34, 26);
    o += card(372, 20, 178, 310);
    o += s.tap ? [['🫳', 'sưng, sờ lạo xạo'], ['💪', 'tay ít cử động'], ['↔', 'Moro mất 1 bên'], ['⚠', 'dễ nhầm liệt'], ['🦴', 'có thể gãy cánh tay']].map(([ic, t], i) => T(392, 66 + i * 52, ic, { a: 'start', s: 20 }) + T(422, 62 + i * 52, t, { a: 'start', s: 13 })).join('') : T(461, 170, '👆', { s: 34 }) + T(461, 212, 'Chỗ nào gãy?', { s: 15 });
    return o;
  },
  say: s => s.tap ? ['worry', '**Gãy xương đòn**: sưng, sờ **lạo xạo**, tay bên đó **ít cử động**, Moro **mất một bên** — dễ nhầm với liệt đám rối.'] : ['happy', 'Xương hay gãy nhất khi kẹt vai: chạm vào **chỗ gãy** trên hình 👆']
});
kit('bv-me', {
  init: () => ({ u: false, p: false }), ui: () => [], goal: s => s.u && s.p,
  draw: s => {
    let o = `<g class="tap" data-set="!u">${card(20, 20, 256, 310, s.u ? '#fff1f4' : '#fff', s.u ? C.pinkD : C.grid)}${pic('sv-tu-cung.png', 34, 40, 228, 170)}`;
    o += s.u ? [0, 1, 2].map(i => ZS.drop(126 + i * 22, 232 + (i % 2) * 14, .9, 'drip')).join('') + T(148, 290, 'Tử cung mệt → đờ', { s: 14 }) + T(148, 310, '→ BĂNG HUYẾT', { s: 14, c: C.redD }) : T(148, 290, '👆 tử cung', { s: 14, c: C.soft });
    o += `</g><g class="tap" data-set="!p">${card(294, 20, 256, 310, s.p ? '#fff1f4' : '#fff', s.p ? C.pinkD : C.grid)}`;
    o += `<ellipse cx="422" cy="130" rx="46" ry="70" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="1.4"/><ellipse cx="422" cy="128" rx="14" ry="44" fill="#fff" stroke="${C.myoD}"/><circle cx="422" cy="236" r="16" fill="#f3c6d3" stroke="${C.pinkD}" stroke-width="1.4"/><path d="M402 204 Q422 214 442 204 L440 220 Q422 226 404 220Z" fill="${C.peach}" stroke="${C.peachD}"/>` + T(474, 132, 'âm hộ', { a: 'start', s: 12.5, c: C.mute }) + call(442, 212, 478, 196, 'tầng sinh môn', C.mute, 'start', 12) + T(444, 241, 'hậu môn', { a: 'start', s: 12.5, c: C.mute });
    o += s.p ? `<path d="M422 174 L426 196 L418 210 L422 226" fill="none" stroke="${C.redD}" stroke-width="3" stroke-linecap="round"/>` + T(422, 290, 'Rách độ III–IV', { s: 14, c: C.redD }) + T(422, 310, '(tới cơ thắt hậu môn)', { s: 12, c: C.mute }) : T(422, 290, '👆 tầng sinh môn', { s: 14, c: C.soft });
    return o + '</g>';
  },
  say: s => s.u && s.p ? ['worry', 'Mẹ dễ **băng huyết** (tử cung mệt, đờ) và **rách tầng sinh môn độ III–IV** (tới cơ thắt hậu môn) → khám kỹ, xử trí ngay.'] : ['happy', 'Bé xong rồi, tới **mẹ**: chạm **2 chỗ** cần kiểm tra 👆']
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
