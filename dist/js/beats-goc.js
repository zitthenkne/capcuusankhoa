'use strict';
/* Trang tí hon — chương 00 Từ gốc rễ. Hình: Servier Medical Art (CC BY 4.0); sơ đồ tự vẽ cho cơ chế (thành tử cung, mạch, dòng hồng cầu, CTG). */
(() => {
const ZS = window.ZS, { C, T, kit, arrow } = ZS, B = ZS.beats;
const { Th, card, pic, tap, call, tcard, pcard, flow, rbcFlow, heart, drops, vital, verdict } = ZS.BK;
const SV = 'Servier Medical Art · CC BY 4.0';
const tr = (from, to, d = .7) => from == null || from === to ? '' : `<animateTransform attributeName="transform" type="translate" from="${from}" to="${to}" dur="${d}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".25 .9 .3 1"/>`;
const seen = (s, k) => (s.seen || '').includes(k + ',');
const markSeen = (s, k) => { if (!seen(s, k)) s.seen = (s.seen || '') + k + ','; };

// ═════════ BÀI · Hai dòng máu, một nơi trao đổi
// bánh nhau cắt ngang (Servier, 398×669) ở khung trái; pn(): toạ độ ảnh → khung
const pn = (X, Y) => [+(20 + X * .5022).toFixed(1), +(8 + Y * .5022).toFixed(1)];
const MPATH = 'M128 28 C126 45 132 62 131 78 S124 96 126 104 S130 120 132 128 S152 150 171 160';
const FPATH = 'M113 329 C110 300 108 270 106 249 S104 225 103 219 S100 195 100 189 S97 168 95 159';
const nhau = (nM = 7, durM = 2.6, nF = 6) => pic('sv-nhau.png', 20, 8, 200, 336) + flow(MPATH, nM, '#e5484d', durM, 4.2, { st: '#fff' }) + flow(FPATH, nF, '#5b6ee0', 3.2, 4.2, { st: '#fff' }) + Th(28, 30, 'phía MẸ', { a: 'start', s: 12.5, c: C.redD }) + Th(28, 338, 'phía BÉ', { a: 'start', s: 12.5, c: '#3f51b5' });
kit('bg-hai', {
  init: () => ({ me: false, be: false }), ui: () => [], goal: s => s.me && s.be,
  draw: s => {
    let o = nhau() + tap('me=true', ...pn(330, 330), 30, 20, s.me ? 1 : 0) + tap('be=true', ...pn(165, 300), 26, 24, s.be ? 1 : 0);
    o += card(240, 20, 310, 310);
    if (s.me) o += `<path d="M${pn(330, 320)} L254 96" stroke="${C.redD}" stroke-width="1.4" stroke-dasharray="4 3"/>`;
    if (s.be) o += `<path d="M${pn(170, 290)} L254 180" stroke="#3f51b5" stroke-width="1.4" stroke-dasharray="4 3"/>`;
    o += s.me ? ZS.fade(`<circle cx="262" cy="96" r="7" fill="#e5484d"/>` + T(278, 101, 'Máu MẸ: ĐM xoắn → hồ máu', { a: 'start', s: 13.5 }), ZS.fresh(s, x => x.me)) : Th(395, 101, '1. chạm hồ máu tím', { s: 13, c: C.soft });
    o += s.be ? ZS.fade(`<circle cx="262" cy="180" r="7" fill="#5b6ee0"/>` + T(278, 185, 'Máu BÉ: dây rốn → gai nhau', { a: 'start', s: 13.5 }), ZS.fresh(s, x => x.be)) : Th(395, 185, '2. chạm chùm gai nhau', { s: 13, c: C.soft });
    if (s.me && s.be) o += ZS.fade(`<rect x="256" y="216" width="278" height="34" rx="10" fill="#ffd6dc"/><rect x="256" y="262" width="278" height="34" rx="10" fill="#dfe4ff"/><path d="M256 256 H534" stroke="${C.soft}" stroke-width="3"/>` + flow('M262 233 H530', 6, '#e5484d', 2.4, 4.5) + flow('M530 279 H262', 6, '#5b6ee0', 2.4, 4.5) + [300, 360, 420, 480].map((x, i) => flow(`M${x} 236 V274`, 1, '#2fa376', 1.4 + i * .15, 3.4)).join('') + Th(395, 318, 'hàng rào mỏng: chỉ oxy đi qua', { s: 12.5, c: C.green }), ZS.fresh(s, x => x.me && x.be));
    return o;
  },
  say: s => s.me && s.be ? ['wow', 'Máu mẹ vào **hồ máu**, máu bé chạy **trong gai nhau** — hai dòng **không trộn**, chỉ trao đổi oxy qua **hàng rào mỏng**.'] : ['happy', 'Bánh nhau cắt ngang: trên là **mẹ**, dưới là **bé**. Chạm vào **hồ máu mẹ** rồi **gai nhau** 👆']
});
kit('bg-oxy', {
  init: () => ({ loss: 0 }), ui: () => [{ t: 'range', k: 'loss', label: '🩸 Máu mẹ mất', min: 0, max: 40, step: 5, unit: '%' }], goal: s => s.loss >= 30,
  draw: s => {
    const f = s.loss / 40, flowPct = Math.round(100 - 1.6 * s.loss), o2 = Math.round(100 - 1.5 * s.loss), fhr = s.loss >= 30 ? 95 : 140;
    let o = nhau(Math.max(2, Math.round(8 * (1 - .7 * f))), 2.4 + 2.4 * f);
    o += card(240, 20, 310, 310) + T(256, 52, 'Máu tới hồ máu', { a: 'start', s: 14 }) + ZS.bar(256, 62, 210, flowPct, flowPct < 60 ? C.red : C.cap, '', { h: 14 }) + T(534, 75, flowPct + '%', { a: 'end', s: 14 });
    o += T(256, 118, 'Oxy cho bé', { a: 'start', s: 14 }) + ZS.bar(256, 128, 210, o2, o2 < 60 ? C.red : C.green, '', { h: 14 }) + T(534, 141, o2 + '%', { a: 'end', s: 14 });
    o += heart(300, 210, 34, fhr, fhr < 110 ? C.red : '#ff8fa8') + T(338, 206, 'tim thai', { a: 'start', s: 13, c: C.mute }) + T(338, 228, fhr + ' l/ph', { a: 'start', s: 18, c: fhr < 110 ? C.redD : C.ink });
    o += T(470, 206, 'máu BÉ mất', { s: 12.5, c: C.mute }) + T(470, 230, '0 giọt', { s: 18, c: C.green });
    if (s.loss >= 30) o += ZS.fade(verdict(256, 262, 278, false, 'Bé thiếu oxy', 'dù bé chưa mất giọt máu nào'), ZS.fresh(s, x => x.loss >= 30));
    return o;
  },
  say: s => s.loss >= 30 ? ['worry', 'Mẹ mất máu → **ít máu tới hồ máu** → bé **thiếu oxy**, tim thai chậm lại — dù bé **chưa mất giọt máu nào**. Cứu mẹ là cứu bé.'] : ['happy', 'Kéo thanh **🩸 Máu mẹ mất** — nhìn dòng máu đỏ vào hồ máu và tim thai 👆']
});
// thai trong tử cung, nhau bám đáy (Servier 560×660)
const pb = (X, Y) => [+(16 + X * .512).toFixed(1), +(6 + Y * .512).toFixed(1)];
const HONG = { me: ['❤️ Mẹ: bơm & thể tích', 'NTĐ → mẹ mất máu'], nhau: ['🥞 Nhau: diện trao đổi', 'NBN → máu mẹ + mất diện'], be: ['👶 Bé: tuần hoàn thai', 'vasa praevia vỡ → máu BÉ'] };
kit('bg-ba', {
  init: () => ({ sel: '', seen: '' }), ui: () => [], after: (s, k) => { if (k === 'sel') markSeen(s, s.sel); },
  goal: s => ['me', 'nhau', 'be'].every(k => seen(s, k)),
  draw: s => {
    let o = pic('sv-nhau-binh-thuong.png', 16, 6, 287, 338);
    o += tap('sel=me', ...pb(505, 330), 20, 46, s.sel === 'me' ? 1 : 0) + tap('sel=nhau', ...pb(310, 75), 62, 20, s.sel === 'nhau' ? 1 : 0) + tap('sel=be', ...pb(300, 245), 22, 22, s.sel === 'be' ? 1 : 0);
    const nw = ZS.fresh(s, x => x.sel === s.sel);
    if (s.sel === 'me') o += ZS.fade(drops(...pb(40, 640), 3, .7) + call(...pb(505, 330), 230, 330, 'mạch máu mẹ', C.redD, 'middle'), nw);
    if (s.sel === 'nhau') o += ZS.fade(`<path d="M${pb(380, 52)} Q${pb(430, 40)} ${pb(470, 90)} Q${pb(430, 100)} ${pb(380, 52)}Z" fill="url(#gClot)" opacity=".9"/>` + call(...pb(430, 70), 250, 24, 'bong ra', C.redD), nw);
    if (s.sel === 'be') o += ZS.fade(`<circle cx="${pb(300, 245)[0]}" cy="${pb(300, 245)[1]}" r="9" fill="none" stroke="${C.red}" stroke-width="3" class="pulse"/>` + drops(...pb(55, 625), 2, .6) + call(...pb(300, 245), 246, 168, 'mạch máu bé', '#3f51b5'), nw);
    o += card(318, 20, 232, 310);
    o += ['me', 'nhau', 'be'].map((k, i) => { const y = 34 + i * 98, on = s.sel === k, sn = seen(s, k);
      return `<rect x="330" y="${y}" width="208" height="86" rx="14" fill="${on ? C.lav : sn ? '#fbfaff' : '#fff'}" stroke="${on ? C.soft : C.grid}"/>` + (sn ? T(342, y + 30, HONG[k][0], { a: 'start', s: 14 }) + T(342, y + 56, HONG[k][1], { a: 'start', s: 13, c: k === 'be' ? C.redD : C.mute }) : T(434, y + 50, `${i + 1}. chạm vùng ${['thành tử cung', 'bánh nhau', 'dây rốn'][i]}`, { s: 12.5, c: C.soft })); }).join('');
    return o;
  },
  say: s => ['me', 'nhau', 'be'].every(k => seen(s, k)) ? ['worry', 'Máu chảy ra **chưa chắc là máu ai**: NTĐ mất máu **mẹ**, NBN thêm mất **diện trao đổi**, vasa praevia vỡ mất máu **bé**. Luôn đánh giá **cả mẹ lẫn bé**.'] : ['happy', 'Oxy tới bé phải qua **3 chặng**. Chạm lần lượt **thành tử cung · bánh nhau · dây rốn** 👆']
});
B['hai-tuan-hoan'] = [
  { t: 'Hai dòng máu, không trộn nhau', kit: 'bg-hai', cr: 'Bánh nhau: ' + SV },
  { t: 'Mẹ mất máu, bé thiếu oxy', kit: 'bg-oxy', cr: 'Bánh nhau: ' + SV },
  { t: 'Ba chặng có thể hỏng', kit: 'bg-ba', cr: SV }
];

// ═════════ BÀI · Tử cung có ba lớp — và một vùng yếu
// khối thành tử cung: lòng TC (trên) → nội mạc → cơ → thanh mạc → ổ bụng (dưới); d: độ sâu vết rách 0–3
const wall = (x, y, w, o = {}) => {
  const d = o.d || 0, hN = 34, hM = 150, hS = 14, yN = y, yM = y + hN, yS = yM + hM, cx = x + w / 2;
  let s = `<rect x="${x}" y="${yN}" width="${w}" height="${hN}" fill="#f7b3c3"/>` + [...Array(Math.floor(w / 22))].map((_, i) => `<path d="M${x + 8 + i * 22} ${yN} q4 ${hN * .6} 8 0" fill="#e98aa5"/>`).join('');
  s += `<rect x="${x}" y="${yM}" width="${w}" height="${hM}" fill="url(#gMyo)"/>` + [...Array(6)].map((_, i) => `<path d="M${x} ${yM + 14 + i * 24} q${w / 4} ${i % 2 ? 12 : -12} ${w / 2} 0 t${w / 2} 0" fill="none" stroke="#e07a98" stroke-width="5" opacity=".55"/>`).join('');
  s += `<rect x="${x}" y="${yS}" width="${w}" height="${hS}" fill="url(#gSer)"/><path d="M${x} ${yS + hS} H${x + w}" stroke="#9d88e6" stroke-width="1.4"/>`;
  if (d) { const depth = d === 1 ? hN + 50 : d === 2 ? hN + hM : hN + hM + hS + 2, wd = 16 + d * 6;
    s += `<path d="M${cx - wd} ${yN} L${cx} ${yN + depth} L${cx + wd} ${yN}Z" fill="#8c2a3a"/>`;
    if (d === 2) s += `<path d="M${cx - 24} ${yS} Q${cx} ${yS + 24} ${cx + 24} ${yS}" fill="url(#gClot)" opacity=".85"/>`; }
  return { svg: s, yN, yM, yS, hS, cx, bottom: yS + hS };
};
kit('bu-lop', {
  init: () => ({ sel: '', seen: '' }), ui: () => [], after: (s, k) => { if (k === 'sel') markSeen(s, s.sel); },
  goal: s => ['noi', 'co', 'tm'].every(k => seen(s, k)),
  draw: s => {
    let o = card(20, 20, 250, 310) + pic('sv-tu-cung.png', 30, 70, 230, 172) + `<circle cx="195" cy="140" r="22" fill="none" stroke="${C.soft}" stroke-width="2"/><path d="M215 132 L300 70" stroke="${C.soft}" stroke-width="1.4" stroke-dasharray="4 4"/>` + T(145, 280, 'tử cung (nhìn trước)', { s: 12.5, c: C.mute });
    const W = wall(300, 60, 140);
    o += T(370, 50, 'lòng tử cung', { s: 12, c: C.mute }) + W.svg + T(370, W.bottom + 18, 'ổ bụng', { s: 12, c: C.mute });
    o += tap('sel=noi', 370, W.yN + 17, 70, 15, s.sel === 'noi' ? 1 : 0) + tap('sel=co', 370, W.yM + 75, 70, 60, s.sel === 'co' ? 1 : 0) + tap('sel=tm', 370, W.yS + 7, 70, 10, s.sel === 'tm' ? 1 : 0);
    const L = [['noi', W.yN + 17, 'Nội mạc', 'nhau bám vào đây'], ['co', W.yM + 70, 'Cơ tử cung', 'co rút → siết mạch'], ['tm', W.yS + 8, 'Thanh mạc', 'lớp áo ngoài']];
    o += L.map(([k, y, a, b]) => seen(s, k) ? ZS.fade(Th(452, y, a, { a: 'start', s: 14, c: s.sel === k ? C.redD : C.ink }) + Th(452, y + 17, b, { a: 'start', s: 12, c: C.mute }), ZS.fresh(s, x => seen(x, k))) : Th(452, y + 5, '?', { a: 'start', s: 16, c: C.soft })).join('');
    return o;
  },
  say: s => ['noi', 'co', 'tm'].every(k => seen(s, k)) ? ['wow', 'Ba lớp: **nội mạc** (nhau bám) · **cơ** dày ở giữa (co rút siết mạch — chìa khóa cầm máu) · **thanh mạc** mỏng bên ngoài.'] : ['happy', 'Phóng to thành tử cung. Chạm vào **từng lớp** để biết tên 👆']
});
// tử cung nhìn dọc với đoạn dưới dài/mỏng theo tuổi thai
const uterusLS = (L, tl) => {
  const by = 228, ly = by + L, outer = `M180 35 C258 35 295 90 295 140 C295 185 280 212 262 ${by} L218 ${ly} L214 ${ly + 36} H146 L142 ${ly} L98 ${by} C80 212 65 185 65 140 C65 90 102 35 180 35Z`;
  const inner = `M180 58 C242 58 272 98 272 140 C272 178 258 202 ${246 - (14 - tl) * .3} ${by - 2} L${218 - tl} ${ly - 2} L186 ${ly + 2} V${ly + 36} H174 V${ly + 2} L${142 + tl} ${ly - 2} L${114 + (14 - tl) * .3} ${by - 2} C102 202 88 178 88 140 C88 98 118 58 180 58Z`;
  return `<path d="${outer}" fill="url(#gMyo)" stroke="${C.myoD}" stroke-width="1.3"/><path d="${inner}" fill="#fffafc" stroke="${C.decid}" stroke-width="3"/>`;
};
kit('bu-doan', {
  init: () => ({ w: 20 }), ui: () => [{ t: 'range', k: 'w', label: '🤰 Tuổi thai', min: 20, max: 40, step: 2, unit: ' tuần' }], goal: s => s.w >= 36,
  draw: s => {
    const g = (s.w - 20) / 20, L = 10 + 46 * g, tl = 16 - 12 * g, ly = 228 + L;
    let o = card(20, 20, 330, 316, '#fffdfa') + uterusLS(L, tl);
    o += `<circle cx="180" cy="${200 + L * .7}" r="${34 + 10 * g}" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/>` + T(180, 205 + L * .7, 'đầu thai', { s: 12, c: C.skinD });
    o += `<path d="M274 128 H296" stroke="${C.ink}" stroke-width="1.6" marker-start="url(#ar)" marker-end="url(#ar)"/>` + Th(300, 112, 'thân: dày', { a: 'start', s: 13 });
    o += `<path d="M${226 - tl} ${228 + L * .55} L${240} ${228 + L * .55}" stroke="${C.redD}" stroke-width="1.6"/>` + Th(246, 246 + L * .5, 'đoạn dưới', { a: 'start', s: 13, c: C.redD }) + Th(246, 262 + L * .5, tl < 7 ? 'MỎNG' : 'còn dày', { a: 'start', s: 13, c: C.redD });
    o += card(362, 20, 188, 316) + T(456, 54, s.w + ' tuần', { s: 22 });
    o += T(380, 98, 'Bề dày thân', { a: 'start', s: 13, c: C.mute }) + ZS.bar(380, 106, 150, 85, C.myoD, '', { h: 12 });
    o += T(380, 150, 'Bề dày đoạn dưới', { a: 'start', s: 13, c: C.mute }) + ZS.bar(380, 158, 150, tl / 16 * 85, tl < 7 ? C.red : C.myoD, '', { h: 12 });
    o += T(380, 202, 'Chiều dài đoạn dưới', { a: 'start', s: 13, c: C.mute }) + ZS.bar(380, 210, 150, 15 + 80 * g, C.soft, '', { h: 12 });
    if (s.w >= 36) o += ZS.fade(verdict(374, 250, 164, false, 'vùng yếu', 'ít cơ · mỏng'), ZS.fresh(s, x => x.w >= 36));
    return o;
  },
  say: s => s.w >= 36 ? ['worry', 'Cuối thai kỳ **đoạn dưới** dài ra và **giãn mỏng**; khối **cơ dày** vẫn ở **thân** tử cung — nơi co rút cầm máu mạnh nhất.'] : ['happy', 'Kéo thanh **🤰 Tuổi thai** — nhìn phần dưới tử cung thay đổi 👆']
});
// mạch máu xuyên qua khối cơ: k = sức siết (thân 1, đoạn dưới .35)
const vesselBlock = (x, title, rings, k, co) => {
  const sq = Math.min(1, co * k), lw = 16 * (1 - .9 * sq), cx = x + 110, nd = sq > .85 ? 0 : sq > .5 ? 1 : 2;
  let s = card(x, 20, 220, 300, '#fff') + T(cx, 46, title, { s: 15 }) + `<rect x="${x + 20}" y="96" width="180" height="200" rx="14" fill="url(#gMyo)"/>`;
  s += `<path d="M${cx} 300 V96" stroke="${C.redD}" stroke-width="${lw + 3}" stroke-linecap="round"/><path d="M${cx} 300 V96" stroke="#ff8f93" stroke-width="${lw}" stroke-linecap="round"/>`;
  s += [...Array(rings)].map((_, i) => { const y = 124 + i * (150 / Math.max(1, rings - 1 || 1)) * (rings > 1 ? 1 : 0) + (rings === 1 ? 70 : 0); return `<ellipse cx="${cx}" cy="${y}" rx="${30 - 18 * sq}" ry="9" fill="none" stroke="#c85a7c" stroke-width="${rings > 2 ? 9 : 5}" opacity=".9"/>`; }).join('');
  s += drops(cx, 74, nd, .85, 18) + T(cx, 316, nd ? '💧 vẫn rỉ máu' : '✓ ép kín', { s: 14, c: nd ? C.redD : C.green });
  return s;
};
kit('bu-siet', {
  init: () => ({ co: 0 }), ui: () => [{ t: 'range', k: 'co', label: '💪 Cơ tử cung co', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.co >= 80,
  draw: s => vesselBlock(40, 'THÂN tử cung · nhiều cơ', 4, 1, s.co / 100) + vesselBlock(300, 'ĐOẠN DƯỚI · ít cơ', 1, .38, s.co / 100) + Th(150, 86, 'giường nhau', { s: 12, c: C.mute }) + Th(410, 86, 'giường nhau', { s: 12, c: C.mute }),
  say: s => s.co >= 80 ? ['worry', 'Thớ cơ đan **quanh mạch** = **dây thắt sống**. Thân nhiều cơ → siết kín; **đoạn dưới** ít cơ → vẫn rỉ máu. Vì vậy nhau bám thấp dễ chảy máu sau sinh.'] : ['happy', 'Hai mạch máu như nhau, khác lượng cơ quấn quanh. Kéo thanh **💪 Cơ tử cung co** 👆']
});
const TYPE = { ngang: ['ngang đoạn dưới', 'nguy cơ thấp nhất', C.green], doc: ['DỌC thân tử cung', 'nguy cơ vỡ cao', C.redD], T: ['chữ T ngược', 'nguy cơ vỡ cao', C.redD] };
kit('bu-seo', {
  init: () => ({ xray: false, kieu: 'doc' }), ui: s => [{ t: 'tog', k: 'xray', label: '👁 Nhìn xuyên da' }, ...(s.xray ? [{ t: 'seg', k: 'kieu', opts: [['ngang', 'ngang'], ['doc', 'dọc'], ['T', 'chữ T']] }] : [])], goal: s => s.xray,
  draw: s => {
    let o = card(20, 20, 290, 310) + `<svg x="30" y="22" width="270" height="306" viewBox="20 250 260 294.8" preserveAspectRatio="xMidYMid slice"><image href="${ZS.BK.I}sv-phu-nu.png" width="297" height="1060"/></svg>`;
    o += `<path d="M122 266 Q165 276 208 266" fill="none" stroke="#b46a7a" stroke-width="3" stroke-linecap="round"/>` + [130, 145, 160, 175, 190, 202].map(x => `<path d="M${x} 262 v10" stroke="#b46a7a" stroke-width="1.4"/>`).join('') + Th(165, 296, 'sẹo da: NGANG', { s: 13, c: '#9a4f60' });
    if (s.xray) {
      const nw = ZS.fresh(s, x => x.xray), cut = s.kieu === 'ngang' ? 'M140 235 Q165 243 190 235' : s.kieu === 'doc' ? 'M165 150 V222' : 'M140 235 Q165 243 190 235 M165 236 V170';
      o += ZS.fade(`<g opacity=".93">${pic('sv-tu-cung.png', 90, 130, 150, 112)}</g><path d="${cut}" fill="none" stroke="${C.red}" stroke-width="4" stroke-linecap="round" stroke-dasharray="7 4"/>`, nw);
    }
    o += card(322, 20, 228, 310) + T(436, 56, 'Sẹo trên DA', { s: 13, c: C.mute }) + T(436, 82, 'ngang', { s: 18 });
    o += `<path d="M346 108 H526" stroke="${C.grid}"/>` + T(436, 140, 'Sẹo trên TỬ CUNG', { s: 13, c: C.mute }) + (s.xray ? T(436, 168, TYPE[s.kieu][0], { s: 17, c: TYPE[s.kieu][2] }) + T(436, 192, TYPE[s.kieu][1], { s: 13, c: C.mute }) : T(436, 172, '?', { s: 30, c: C.soft }));
    o += `<rect x="340" y="236" width="192" height="72" rx="14" fill="${C.butter}"/>` + T(436, 264, '📄 Muốn biết →', { s: 14 }) + T(436, 288, 'đọc BIÊN BẢN MỔ', { s: 14, c: C.redD });
    return o;
  },
  say: s => s.xray ? ['worry', 'Sẹo da **ngang** không cho biết đường rạch **tử cung** — có thể là **dọc thân**, nguy cơ vỡ khác hẳn. Phải đọc **biên bản mổ**.'] : ['happy', 'Mẹ có sẹo mổ cũ **ngang** trên da. Bấm **👁 Nhìn xuyên da** xem tử cung bên dưới 👆']
});
kit('bu-vo', {
  init: () => ({ d: 0 }), ui: () => [{ t: 'range', k: 'd', label: '⚡ Độ sâu vết rách', min: 0, max: 3, step: 1, unit: '/3' }], goal: s => s.d >= 3,
  draw: s => {
    const W = wall(40, 64, 260, { d: s.d });
    let o = card(20, 20, 300, 310) + T(170, 54, 'lòng tử cung (có thai)', { s: 12.5, c: C.mute }) + W.svg + T(170, W.bottom + 22, 'ổ bụng', { s: 12.5, c: C.mute });
    if (s.d >= 3) o += ZS.fade(`<path d="M150 ${W.bottom} Q170 ${W.bottom + 40} 200 ${W.bottom + 30} Q240 ${W.bottom + 44} 280 ${W.bottom + 36} L280 ${W.bottom + 54} H60 V${W.bottom + 40} Q100 ${W.bottom + 30} 150 ${W.bottom}Z" fill="${C.red}" opacity=".75"/>` + drops(170, W.bottom + 10, 2, .7), ZS.fresh(s, x => x.d >= 3));
    o += Th(312, W.yN + 22, 'nội mạc', { a: 'end', s: 12, c: C.mute }) + Th(312, W.yM + 80, 'cơ', { a: 'end', s: 12, c: C.mute }) + Th(312, W.yS + 12, 'thanh mạc', { a: 'end', s: 12, c: C.mute });
    const st = [['Còn nguyên', 'không rách', C.green], ['Rách nông', 'nội mạc + một phần cơ', C.amber], ['Rách hết cơ', 'thanh mạc còn → KÍN ĐÁO', '#b5651d'], ['VỠ toàn bộ', 'máu vào ổ bụng · thai nguy', C.redD]][s.d];
    o += card(332, 20, 218, 310) + T(441, 70, st[0], { s: 18, c: st[2] }) + T(441, 96, st[1], { s: 13, c: C.mute });
    o += heart(400, 190, 40, s.d >= 3 ? 70 : 140, s.d >= 3 ? C.red : '#ff8fa8') + T(450, 186, 'tim thai', { a: 'start', s: 12.5, c: C.mute }) + T(450, 210, s.d >= 3 ? 'chậm!' : 'ổn', { a: 'start', s: 16, c: s.d >= 3 ? C.redD : C.green });
    o += T(441, 270, s.d === 2 ? 'dễ bỏ sót' : s.d === 3 ? 'cấp cứu ngay' : '', { s: 15, c: st[2] });
    return o;
  },
  say: s => s.d >= 3 ? ['ouch', 'Rách cơ mà **thanh mạc còn** → biểu hiện **kín đáo**. **Vỡ hết bề dày** → máu tràn **ổ bụng**, thai nguy rất nhanh.'] : ['happy', 'Kéo thanh **⚡ Độ sâu vết rách** — từng lớp một 👆']
});
B['ba-lop-tu-cung'] = [
  { t: 'Ba lớp của thành tử cung', kit: 'bu-lop', cr: 'Tử cung: ' + SV },
  { t: 'Đoạn dưới giãn mỏng dần', kit: 'bu-doan' },
  { t: 'Thân siết mạch, đoạn dưới yếu', kit: 'bu-siet' },
  { t: 'Sẹo da không nói sẹo tử cung', kit: 'bu-seo', cr: 'Người & tử cung: ' + SV },
  { t: 'Rách cơ hay vỡ toàn bộ?', kit: 'bu-vo' }
];

// ═════════ BÀI · Nhau bong rồi, vì sao mẹ không chảy máu mãi?
// lát cắt thành tử cung: cơ (dưới) + ĐM xoắn + bánh nhau (trên). o: det (0–1 bong), co (0–1), plug ('', 'du', 'thieu'), frag (sót nhau)
const VX = [100, 190, 290, 390];
const bed = (o = {}) => {
  const co = o.co || 0, det = o.det || 0, top = 160 - 26 * co, lw = 13 * (1 - .92 * co), wob = 14 * (1 - co) + 3, bedL = 50 + 40 * co, bedR = 430 - 40 * co;
  let s = `<rect x="30" y="${top}" width="420" height="${336 - top}" rx="10" fill="url(#gMyo)"/>`;
  s += VX.map(x => `<path d="M${x} 336 C${x + wob} 300 ${x - wob} 260 ${x} ${top + 40} S${x + wob * .6} ${top + 10} ${x} ${top}" fill="none" stroke="${C.redD}" stroke-width="${lw + 3}" stroke-linecap="round"/><path d="M${x} 336 C${x + wob} 300 ${x - wob} 260 ${x} ${top + 40} S${x + wob * .6} ${top + 10} ${x} ${top}" fill="none" stroke="#ff8f93" stroke-width="${lw}" stroke-linecap="round"/>`).join('');
  s += [0, 1, 2, 3, 4].map(i => `<path d="M30 ${top + 26 + i * 34} q52 ${i % 2 ? 9 + 4 * co : -9 - 4 * co} 105 0 t105 0 t105 0 t105 0" fill="none" stroke="#d0688c" stroke-width="${4 + 6 * co}" opacity="${.45 + .4 * co}"/>`).join('');
  s += `<path d="M${bedL} ${top} H${bedR}" stroke="${C.myoD}" stroke-width="2" stroke-dasharray="5 4"/>` + Th(440, 326, 'cơ tử cung', { a: 'end', s: 12.5, c: C.myoD });
  // bánh nhau (dịch lên khi bong)
  const py = -70 * det;
  if (!o.noPlac) s += `<g transform="translate(0 ${py})">${tr(o.pdet == null ? null : `0 ${-70 * o.pdet}`, `0 ${py}`)}<path d="M44 ${top - 2} Q46 ${top - 52} 120 ${top - 58} H360 Q436 ${top - 52} 438 ${top - 2}Z" fill="url(#gPlac)" stroke="${C.placD}" stroke-width="1.3"/>${[90, 150, 210, 270, 330, 390].map(x => `<path d="M${x} ${top - 6} q-8 -22 4 -40" fill="none" stroke="${C.placD}" stroke-width="2" opacity=".6"/>`).join('')}${T(240, top - 26, 'bánh nhau', { s: 13, c: '#fff' })}</g>`;
  // máu ở miệng mạch
  const open = det > .5 && !o.plug, ooz = o.plug === 'thieu';
  if (open || ooz) s += VX.map(x => co < .8 || ooz ? drops(x, top - 14, ooz ? 1 : co < .4 ? 2 : 1, .8, 14) : '').join('');
  if (o.plug) s += VX.map(x => o.plug === 'du' ? `<g><ellipse cx="${x}" cy="${top - 2}" rx="14" ry="8" fill="url(#gClot)"/>${[-10, -4, 3, 9].map(d => `<path d="M${x + d} ${top - 9} l${d > 0 ? 6 : -6} 12" stroke="#f3e3a6" stroke-width="1.6"/>`).join('')}</g>` : `<g opacity=".8">${[-8, 2, 9].map((d, i) => `<circle cx="${x + d}" cy="${top - 4 - i * 4}" r="${4 - i}" fill="url(#gClot)"/>`).join('')}</g>`).join('');
  if (o.frag) s += `<path d="M250 ${top} Q262 ${top - 26} 300 ${top - 22} Q326 ${top - 14} 330 ${top}Z" fill="url(#gPlac)" stroke="${C.placD}"/>` + drops(290, top - 30, 1, .8);
  return { svg: s, top, bedL, bedR };
};
kit('bn-bong', {
  init: () => ({ bong: false }), ui: () => [{ t: 'tog', k: 'bong', label: '🫳 Cho nhau bong ra' }], goal: s => s.bong,
  draw: s => {
    const R = bed({ det: s.bong ? 1 : 0, pdet: s._p ? (s._p.bong ? 1 : 0) : null });
    let o = card(20, 20, 440, 316, '#fffdfa') + R.svg + Th(40, 44, 'lòng tử cung', { a: 'start', s: 12.5, c: C.mute });
    if (s.bong) o += ZS.fade(call(VX[1], R.top + 4, 250, 120, 'miệng ĐM xoắn mở', C.redD, 'middle'), ZS.fresh(s, x => x.bong));
    else o += call(VX[2], 250, 300, 300, 'động mạch xoắn', C.redD, 'middle');
    o += card(470, 20, 80, 316) + T(510, 60, 'giường', { s: 12.5, c: C.mute }) + T(510, 76, 'nhau', { s: 12.5, c: C.mute }) + T(510, 120, s.bong ? 'MỞ' : 'kín', { s: 18, c: s.bong ? C.redD : C.green }) + (s.bong ? drops(510, 170, 2, .8, 18) : '');
    return o;
  },
  say: s => s.bong ? ['ouch', 'Nhau rời ra → **hàng trăm động mạch xoắn** ở giường nhau bị **mở** → máu phun ra. Cơ thể chặn lại bằng cách nào? → Tiếp 👉'] : ['happy', 'Bánh nhau đang bám vào thành tử cung. Bấm **🫳 Cho nhau bong ra** 👆']
});
kit('bn-co', {
  init: () => ({ co: 0 }), ui: () => [{ t: 'range', k: 'co', label: '💪 Cơ tử cung co rút', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.co >= 80,
  draw: s => {
    const R = bed({ det: 1, co: s.co / 100, noPlac: true });
    let o = card(20, 20, 440, 316, '#fffdfa') + R.svg + `<path d="M${R.bedL} ${R.top - 12} H${R.bedR}" stroke="${C.ink}" stroke-width="1.4" marker-start="url(#ar)" marker-end="url(#ar)"/>` + Th((R.bedL + R.bedR) / 2, R.top - 20, 'diện nhau bám', { s: 12.5 });
    o += card(470, 20, 80, 316) + T(510, 56, 'máu', { s: 12.5, c: C.mute }) + T(510, 72, 'chảy', { s: 12.5, c: C.mute }) + `<rect x="496" y="${92 + 160 * s.co / 100}" width="28" height="${160 * (1 - s.co / 100) + 4}" rx="8" fill="${C.red}"/><rect x="496" y="92" width="28" height="164" rx="8" fill="none" stroke="${C.grid}"/>` + T(510, 290, s.co >= 80 ? '✓' : '', { s: 22, c: C.green });
    return o;
  },
  say: s => s.co >= 80 ? ['wow', '**Co** = sợi cơ ngắn lại; **co rút** = giữ tử cung nhỏ sau mỗi cơn co → **diện nhau bám** thu nhỏ, mạch xuyên cơ bị **ép kín**.'] : ['happy', 'Mạch đang mở. Kéo thanh **💪 Cơ tử cung co rút** — nhìn thớ cơ siết mạch 👆']
});
kit('bn-fib', {
  init: () => ({ dm: 'du', seen: 'du,' }), ui: () => [{ t: 'seg', k: 'dm', opts: [['du', '🧶 Đủ fibrin'], ['thieu', '💧 Thiếu yếu tố đông']] }], after: (s, k) => markSeen(s, s.dm), goal: s => seen(s, 'thieu'),
  draw: s => {
    const R = bed({ det: 1, co: .8, plug: s.dm, noPlac: true });
    let o = card(20, 20, 440, 316, '#fffdfa') + R.svg + ZS.fade(call(VX[2], R.top - 6, 330, 70, s.dm === 'du' ? 'nút fibrin bền' : 'nút bở, rỉ máu', s.dm === 'du' ? C.green : C.redD, 'middle'), ZS.fresh(s, x => x.dm === s.dm));
    o += card(470, 20, 80, 316) + T(510, 70, s.dm === 'du' ? '🧶' : '💧', { s: 30 }) + T(510, 118, s.dm === 'du' ? 'kín' : 'rỉ', { s: 17, c: s.dm === 'du' ? C.green : C.redD }) + T(510, 140, 'khắp', { s: 12, c: C.mute }) + T(510, 156, 'nơi', { s: 12, c: C.mute });
    return o;
  },
  say: s => s.dm === 'thieu' ? ['worry', 'Thiếu yếu tố đông → **nút cầm máu bở**, rỉ máu khắp nơi dù cơ đã siết mạch. Đông máu là **lớp khóa thứ hai**.'] : ['happy', 'Cơ đã siết, **fibrin** đan thành nút bịt miệng mạch. Bấm **💧 Thiếu yếu tố đông** xem sao 👆']
});
const T4 = [['tone', 'Tone', 'cơ không co'], ['tissue', 'Tissue', 'còn sót nhau'], ['trauma', 'Trauma', 'rách chỗ khác'], ['thrombin', 'Thrombin', 'đông máu kém']];
kit('bn-4t', {
  init: () => ({ t: '', seen: '' }), ui: () => [], after: (s, k) => { if (k === 't') markSeen(s, s.t); }, goal: s => T4.every(([k]) => seen(s, k)),
  draw: s => {
    const o4 = s.t === 'tone' ? { det: 1, co: .1 } : s.t === 'tissue' ? { det: 1, co: .8, frag: true } : s.t === 'thrombin' ? { det: 1, co: .8, plug: 'thieu' } : { det: 1, co: .85, plug: s.t ? 'du' : '' };
    const R = bed({ ...o4, noPlac: true });
    let o = `<svg x="0" y="0" width="560" height="350" viewBox="0 0 560 350"><g transform="translate(10 0) scale(.86 1)">${card(10, 20, 440, 316, '#fffdfa')}${R.svg}</g></svg>`;
    if (s.t === 'trauma') o += ZS.fade(`<g transform="translate(250 230)"><ellipse rx="44" ry="34" fill="${C.pink}" stroke="${C.pinkD}"/><ellipse rx="12" ry="20" fill="#fff" stroke="${C.myoD}"/><path d="M8 18 L18 34 L12 44" fill="none" stroke="${C.redD}" stroke-width="3"/>${drops(14, 56, 2, .7)}</g>` + Th(250, 186, 'rách cổ tử cung', { s: 13, c: C.redD }) + Th(200, 120, 'tử cung CHẮC', { s: 13, c: C.green }), ZS.fresh(s, x => x.t === 'trauma'));
    o += T4.map(([k, a, b], i) => pcard('t=' + k, 404, 20 + i * 80, 146, 70, seen(s, k), s.t === k, [a, b])).join('');
    return o;
  },
  say: s => T4.every(([k]) => seen(s, k)) ? ['worry', 'Mỗi T hỏng **một mắt xích**: cơ không co · còn nhau · rách chỗ khác · đông máu kém. **Thuốc gò không vá được vết rách.**'] : ['happy', 'Cầm máu có thể hỏng ở **4 chỗ (4T)**. Bấm từng thẻ bên phải 👆']
});
ZS.BK.bed = bed; ZS.BK.VX = VX;
B['so-nhau-cam-mau'] = [
  { t: 'Nhau bong: mạch máu mở ra', kit: 'bn-bong' },
  { t: 'Cơ co rút siết mạch lại', kit: 'bn-co' },
  { t: 'Fibrin khóa nút cầm máu', kit: 'bn-fib' },
  { t: 'Bốn chỗ có thể hỏng: 4T', kit: 'bn-4t' }
];

// ═════════ BÀI · Tưới máu không đồng nghĩa với một con số huyết áp
const VESSEL = 'M196 176 H468';
const tissue = (o2) => `<g>${[[500, 150], [526, 172], [498, 196], [524, 214], [500, 238]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${o2 > .7 ? '#ffd3dc' : o2 > .45 ? '#e6d3f0' : '#c9c3f0'}" stroke="${C.myoD}" stroke-width="1"/><circle cx="${x}" cy="${y}" r="4" fill="${C.myoD}" opacity=".5"/>`).join('')}</g>` + T(512, 128, 'mô', { s: 13, c: C.mute });
kit('bo-dong', {
  init: () => ({ loss: 0 }), ui: () => [{ t: 'range', k: 'loss', label: '🩸 Máu mất', min: 0, max: 40, step: 5, unit: '%' }], goal: s => s.loss >= 30,
  draw: s => {
    const sv = Math.round(70 * (1 - 1.4 * s.loss / 100)), hr = Math.round(80 + 1.2 * s.loss), co = hr * sv / 1000, rel = co / 5.6;
    let o = card(20, 20, 530, 230, '#fffdfa') + `<g class="beat" style="animation-duration:${(60 / hr).toFixed(2)}s">${pic('sv-tim.png', 40, 60, 140, 184)}</g>`;
    o += `<path d="${VESSEL}" stroke="${C.redD}" stroke-width="34" stroke-linecap="round"/><path d="${VESSEL}" stroke="#ffb3b8" stroke-width="28" stroke-linecap="round"/>` + rbcFlow(VESSEL, 7, (2.2 / rel).toFixed(2)) + tissue(rel);
    o += T(330, 140, 'dòng hồng cầu', { s: 12.5, c: C.mute });
    o += vital(30, 262, 'Nhịp tim', hr, '#ff8fa8', 112) + vital(150, 262, 'Nhát bóp mL', sv, sv < 45 ? '#ffb15c' : '#7ee2b8', 118) + vital(276, 262, 'Cung lượng L/ph', co.toFixed(1), rel < .75 ? '#ff6b7a' : '#7ee2b8', 136);
    o += `<rect x="420" y="262" width="126" height="46" rx="10" fill="${rel < .75 ? '#ffd0d8' : C.mint}"/>` + T(483, 279, 'oxy tới mô', { s: 11.5, c: C.mute }) + T(483, 301, Math.round(rel * 100) + '%', { s: 20, c: rel < .75 ? C.redD : C.green }) + T(285, 330, 'số minh họa xu hướng', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.loss >= 30 ? ['worry', 'Mất máu → tim có **ít máu để bơm** (nhát bóp ↓). Tim **đập nhanh** để bù nhưng **cung lượng vẫn giảm** → ít oxy tới mô.'] : ['happy', 'Tim bơm **dòng hồng cầu** tới mô. Kéo thanh **🩸 Máu mất** — xem tim, dòng chảy và mô 👆']
});
const HC = { du: ['Bình thường', 100, 100, 8], mat: ['Mất máu', 60, 60, 4], dich: ['Bù dịch tinh thể', 100, 60, 4], hc: ['Truyền hồng cầu', 100, 92, 8] };
kit('bo-hc', {
  init: () => ({ m: 'du', seen: '' }), ui: () => [{ t: 'seg', k: 'm', opts: [['du', 'Bình thường'], ['mat', '🩸 Mất máu'], ['dich', '💧 Bù dịch'], ['hc', '🅾️ Truyền hồng cầu']] }], after: (s, k) => markSeen(s, s.m), goal: s => seen(s, 'dich') && seen(s, 'hc'),
  draw: s => {
    const [name, vol, o2, n] = HC[s.m], w = 20 + 40 * vol / 100, P = 'M40 150 H520';
    let o = card(20, 20, 530, 300, '#fffdfa') + T(285, 52, name, { s: 17 });
    o += `<path d="${P}" stroke="${C.redD}" stroke-width="${w + 6}" stroke-linecap="round"/><path d="${P}" stroke="${s.m === 'dich' ? '#ffe3e6' : '#ffb3b8'}" stroke-width="${w}" stroke-linecap="round"/>` + rbcFlow(P, n, 3.2) + (s.m === 'dich' ? flow(P, 8, '#9ecdf7', 3.2, 5, { st: '#fff' }) : '');
    if (s.m === 'dich') o += pic('sv-dich-truyen.png', 470, 64, 60, 84);
    o += T(60, 226, 'Thể tích lòng mạch', { a: 'start', s: 14 }) + ZS.bar(240, 214, 230, vol, vol < 80 ? C.amber : C.cap, '', { h: 14 }) + T(530, 226, vol + '%', { a: 'end', s: 14 });
    o += T(60, 270, 'Oxy mang theo', { a: 'start', s: 14 }) + ZS.bar(240, 258, 230, o2, o2 < 80 ? C.red : C.green, '', { h: 14 }) + T(530, 270, o2 + '%', { a: 'end', s: 14 });
    o += T(285, 306, 'số minh họa xu hướng', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.m === 'dich' ? ['worry', '**Dịch tinh thể** đổ đầy lòng mạch nhưng **không chở oxy**, không có yếu tố đông.'] : s.m === 'hc' ? ['wow', 'Mất nhiều máu cần **hồng cầu** (và chế phẩm đông máu) — chỉ hồng cầu mới **chở oxy**.'] : ['happy', 'Bấm lần lượt **Mất máu → Bù dịch → Truyền hồng cầu**; nhìn số hồng cầu và thanh oxy 👆']
});
// người phụ nữ (Servier 297×1060) cao 320 ở x0
const woman = (x0, y0 = 14, h = 322) => { const k = h / 1060; return { svg: pic('sv-phu-nu.png', x0, y0, 297 * k, h), p: (X, Y) => [+(x0 + X * k).toFixed(1), +(y0 + Y * k).toFixed(1)], k }; };
kit('bo-bu', {
  init: () => ({ loss: 0 }), ui: () => [{ t: 'range', k: 'loss', label: '🩸 Máu mất', min: 0, max: 40, step: 5, unit: '%' }], goal: s => s.loss >= 20,
  draw: s => {
    const L = s.loss, hr = Math.round(80 + (L < 15 ? L : 15 + (L - 15) * 2.4)), sbp = Math.round(L < 30 ? 118 - L * .3 : 109 - (L - 30) * 3), cold = Math.min(1, L / 25), W = woman(30);
    let o = card(20, 20, 140, 316, '#fffdfa') + W.svg;
    o += [W.p(40, 560), W.p(255, 560), W.p(115, 1030), W.p(185, 1030)].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#7aa6e6" opacity="${(.55 * cold).toFixed(2)}"/>`).join('');
    o += heart(...W.p(150, 270), 18, hr) + `<circle cx="${W.p(148, 80)[0]}" cy="${W.p(148, 80)[1]}" r="16" fill="#ffd36b" opacity=".35"/>`;
    const P = ZS.plot({ x: 210, y: 46, w: 320, h: 200, xr: [0, 40], yr: [40, 160], xt: 4, yt: 4, xl: 'máu mất (%)', fx: v => v + '%', bands: [{ x0: 15, x1: 30, fill: C.butter, label: 'còn bù' }, { x0: 30, x1: 40, fill: '#ffd0d8', label: 'mất bù' }],
      curves: [{ f: v => 80 + (v < 15 ? v : 15 + (v - 15) * 2.4), col: C.red, w: 3.4 }, { f: v => v < 30 ? 118 - v * .3 : 109 - (v - 30) * 3, col: C.cap, w: 3.4 }], vl: [{ x: L, c: C.soft }],
      pts: [{ x: L, y: hr, col: C.red }, { x: L, y: sbp, col: C.cap }], legend: [[C.red, 'Nhịp tim'], [C.cap, 'HA tâm thu']] });
    o += card(172, 20, 378, 316) + P.svg + T(370, 322, `${hr} l/ph · HA ${sbp} · tay ${cold > .6 ? 'lạnh' : 'ấm'}`, { s: 13.5, c: L >= 15 && L < 30 ? '#b5651d' : L >= 30 ? C.redD : C.ink });
    return o;
  },
  say: s => s.loss >= 30 ? ['ouch', 'Hết sức bù → **HA tụt**: sốc **mất bù** — đã rất muộn.'] : s.loss >= 15 ? ['worry', 'HA **vẫn ổn** nhưng tim **nhanh**, tay **lạnh**: giao cảm co mạch để ưu tiên **não, tim**. Đây đã là **sốc còn bù**.'] : ['happy', 'Kéo thanh **🩸 Máu mất** — nhìn tim, bàn tay và hai đường trên đồ thị 👆']
});
const SIGNS = [['nao', 148, 75, 'Tri giác', 'lo âu → lơ mơ'], ['tim', 150, 270, 'Mạch', 'nhanh dần'], ['ha', 250, 360, 'Huyết áp', 'có thể còn bình thường'], ['da', 40, 560, 'Da', 'lạnh, làm đầy mao mạch chậm'], ['than', 148, 420, 'Nước tiểu', 'ít đi'], ['mau', 148, 520, 'Máu', 'đang chảy? máu kín?']];
kit('bo-doc', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => SIGNS.every(([k]) => seen(s, k)),
  draw: s => {
    const W = woman(40, 14, 322);
    let o = card(20, 20, 150, 316, '#fffdfa') + W.svg;
    o += SIGNS.map(([k, X, Y], i) => { const [x, y] = W.p(X, Y); return seen(s, k) ? `<circle cx="${x}" cy="${y}" r="7" fill="${C.red}"/><path d="M${x} ${y} L196 ${44 + i * 50}" stroke="${C.soft}" stroke-width="1.2" stroke-dasharray="3 3"/>` : `<g class="tap" data-set="!${k}"><circle cx="${x}" cy="${y}" r="13" fill="#fff" fill-opacity=".01" stroke="${C.soft}" stroke-width="2.2" stroke-dasharray="5 4" class="pulse"/></g>`; }).join('');
    o += card(186, 20, 364, 316) + SIGNS.map(([k, , , a, b], i) => seen(s, k) ? ZS.fade(T(204, 42 + i * 50, a, { a: 'start', s: 14.5 }) + T(204, 60 + i * 50, b, { a: 'start', s: 12.5, c: k === 'ha' ? C.redD : C.mute }), ZS.fresh(s, x => seen(x, k))) : T(204, 50 + i * 50, '○ …', { a: 'start', s: 14, c: C.grid })).join('');
    return o;
  },
  say: s => SIGNS.every(([k]) => seen(s, k)) ? ['worry', 'Đọc **cả cơ thể**: tri giác, mạch, da, nước tiểu, máu đang chảy. **HA chưa tụt không loại trừ sốc còn bù.**'] : ['happy', 'Chạm từng **vòng tròn** trên người mẹ — mỗi chỗ là một dấu hiệu tưới máu 👆']
});
B['van-chuyen-oxy'] = [
  { t: 'Tim bơm ít đi khi mất máu', kit: 'bo-dong', cr: 'Tim: ' + SV },
  { t: 'Dịch không chở được oxy', kit: 'bo-hc', cr: 'Dịch truyền: ' + SV },
  { t: 'Cơ thể bù: HA vẫn còn', kit: 'bo-bu', cr: 'Người: ' + SV },
  { t: 'Đọc cả cơ thể, không chỉ HA', kit: 'bo-doc', cr: 'Người: ' + SV }
];

// ═════════ BÀI · Đặt máu mất lên bản đồ thời điểm
const BEFORE = [['sv-nhau-tien-dao.png', 'Nhau tiền đạo', 'nhau che lỗ trong'], ['sv-nhau-binh-thuong.png', 'Nhau bong non', 'nhau bong sớm'], ['sv-tu-cung.png', 'Vỡ tử cung', 'sẹo cũ / tắc nghẽn']];
const AFTER = [['😮‍💨', 'Tone', 'tử cung mềm'], ['✂️', 'Trauma', 'rách / máu tụ'], ['🧩', 'Tissue', 'sót nhau'], ['🩸', 'Thrombin', 'đông máu kém']];
kit('bb-tg', {
  init: () => ({ t: 20, lo: true, hi: false }), ui: () => [{ t: 'range', k: 't', label: '⏱ Thời điểm chảy máu', min: 0, max: 100, step: 5, unit: '' }],
  after: s => { if (s.t < 55) s.lo = true; else s.hi = true; }, goal: s => s.lo && s.hi,
  draw: s => {
    const pre = s.t < 55, X = 50 + s.t * 4.6;
    let o = card(20, 20, 530, 220, pre ? '#fff7fa' : '#f6fbff') + T(285, 48, pre ? 'TRƯỚC SINH: nghĩ nhau & tử cung' : 'SAU SINH: quay về 4T', { s: 16, c: pre ? C.redD : '#2b6cb0' });
    o += pre ? BEFORE.map(([f, a, b], i) => `<g class="fadein">${pic(f, 50 + i * 168, 62, 120, 120)}${T(110 + i * 168, 200, a, { s: 14 })}${T(110 + i * 168, 220, b, { s: 12, c: C.mute })}</g>`).join('')
      : AFTER.map(([ic, a, b], i) => `<g class="fadein">${card(40 + i * 128, 70, 116, 150, '#fff')}${T(98 + i * 128, 126, ic, { s: 40 })}${T(98 + i * 128, 172, a, { s: 16 })}${T(98 + i * 128, 194, b, { s: 12, c: C.mute })}</g>`).join('');
    o += `<path d="M50 290 H510" stroke="${C.grid}" stroke-width="10" stroke-linecap="round"/><path d="M50 290 H${X}" stroke="${pre ? C.pinkD : C.skyD}" stroke-width="10" stroke-linecap="round"/>`;
    o += [['thai kỳ', 110], ['chuyển dạ', 230], ['sau sinh', 420]].map(([t, x]) => T(x, 318, t, { s: 13, c: C.mute })).join('') + T(303, 278, '★ sổ thai', { s: 13, c: C.ink }) + `<path d="M303 282 V298" stroke="${C.ink}" stroke-width="2"/>`;
    o += `<circle cx="${X}" cy="290" r="11" fill="#fff" stroke="${C.soft}" stroke-width="3"/>` + T(285, 338, 'Mọi lúc: mức nặng + hồi sức song song', { s: 12.5, c: C.redD });
    return o;
  },
  say: s => s.lo && s.hi ? ['happy', 'Trước sinh nghĩ **nhau & tử cung**; sau sinh quay về **4T**. Mọi lúc: đánh giá **mức nặng** và hồi sức song song.'] : ['happy', 'Kéo thanh **⏱ Thời điểm** qua mốc **★ sổ thai** — danh sách nguyên nhân đổi theo 👆']
});
kit('bb-truoc', {
  init: () => ({ sel: '', seen: '' }), ui: () => [], after: (s, k) => { if (k === 'sel') markSeen(s, s.sel); }, goal: s => ['ntd', 'nbn', 'vo'].every(k => seen(s, k)),
  draw: s => {
    const D = { ntd: ['ra huyết KHÔNG đau', 'tử cung mềm'], nbn: ['ĐAU, tử cung gồng cứng', 'máu có thể ẩn sau nhau'], vo: ['đau, mất ngôi thai', 'sẹo mổ cũ / tắc nghẽn'] };
    let o = ['ntd', 'nbn', 'vo'].map((k, i) => { const x = 20 + i * 178, on = s.sel === k, sn = seen(s, k);
      return `<g class="tap" data-set="sel=${k}">${card(x, 20, 168, 250, on ? C.lav : '#fff', on ? C.soft : sn ? C.mintD : C.grid)}${pic(BEFORE[i][0], x + 14, 30, 140, 140)}${k === 'nbn' ? `<ellipse cx="${x + 120}" cy="62" rx="20" ry="9" fill="url(#gClot)" transform="rotate(30 ${x + 120} 62)"/>` : ''}${k === 'vo' ? `<path d="M${x + 106} 72 l10 14 l-8 8 l10 14" fill="none" stroke="${C.redD}" stroke-width="3.5"/>` : ''}${T(x + 84, 190, BEFORE[i][1], { s: 15 })}${sn ? `<g class="${on && ZS.fresh(s, z => z.sel === k) ? 'fadein' : ''}">${T(x + 84, 216, D[k][0], { s: 12.5, c: C.redD })}${T(x + 84, 236, D[k][1], { s: 12, c: C.mute })}</g>` : T(x + 84, 226, '👆 chạm', { s: 13, c: C.soft })}</g>`; }).join('');
    o += `<rect x="20" y="282" width="530" height="48" rx="14" fill="${C.butter}"/>` + T(285, 304, 'Còn: cổ tử cung · âm đạo · nhầy máu · vasa praevia', { s: 13.5 }) + T(285, 322, 'Không đoán bệnh chỉ bằng màu máu', { s: 12.5, c: C.redD });
    return o;
  },
  say: s => ['ntd', 'nbn', 'vo'].every(k => seen(s, k)) ? ['happy', 'Ba câu hỏi lớn trước sinh: **nhau che lỗ trong?** · **nhau bong sớm?** · **tử cung vỡ?** — rồi mới đến nguồn nhỏ hơn.'] : ['happy', 'Ra huyết cuối thai kỳ: chạm **từng thẻ** để biết dấu hiệu gợi ý 👆']
});
kit('bb-kin', {
  init: () => ({ soi: false }), ui: () => [{ t: 'tog', k: 'soi', label: '🔦 Soi máu kín' }], goal: s => s.soi,
  draw: s => {
    let o = card(20, 20, 300, 316, '#fffdfa') + `<svg x="24" y="22" width="292" height="312" viewBox="120 200 380 406" preserveAspectRatio="xMidYMid slice"><image href="${ZS.BK.I}sv-mang-thai.png" width="560" height="966"/></svg>`;
    if (s.soi) { const nw = ZS.fresh(s, x => x.soi);
      o += ZS.fade(`<ellipse cx="250" cy="120" rx="34" ry="16" fill="url(#gClot)" opacity=".9" transform="rotate(-50 250 120)"/>` + call(250, 120, 300, 40, 'sau nhau', C.redD, 'end', 13) + `<ellipse cx="80" cy="250" rx="40" ry="22" fill="${C.red}" opacity=".55"/>` + call(80, 250, 70, 312, 'ổ bụng', C.redD, 'middle', 13) + `<ellipse cx="128" cy="322" rx="18" ry="11" fill="url(#gClot)"/>` + call(128, 322, 190, 312, 'máu tụ', C.redD, 'start', 13), nw); }
    o += card(332, 20, 218, 316) + T(441, 50, 'Băng thấm', { s: 13, c: C.mute }) + `<rect x="396" y="62" width="90" height="34" rx="16" fill="#fff" stroke="${C.grid}"/><circle cx="441" cy="79" r="6" fill="${C.red}"/>` + T(441, 120, 'ÍT', { s: 18, c: C.green });
    o += vital(352, 140, 'Mạch', 132, '#ff8fa8', 180) + vital(352, 194, 'Huyết áp', '82/50', '#ff6b7a', 180);
    o += T(441, 270, s.soi ? 'máu nằm bên trong!' : 'không khớp nhau?', { s: 15, c: C.redD }) + T(441, 292, s.soi ? '→ tìm máu kín' : '', { s: 13, c: C.redD });
    return o;
  },
  say: s => s.soi ? ['ouch', 'Máu có thể **nằm trong**: sau nhau, ổ bụng, khối máu tụ. **Ít máu ngoài mà mẹ sốc** → đi tìm máu kín ngay.'] : ['worry', 'Băng thấm **ít** mà mạch 132, HA 82/50 — vô lý? Bấm **🔦 Soi máu kín** 👆']
});
kit('bb-song', {
  init: () => ({ cach: '', seen: '' }), ui: () => [{ t: 'seg', k: 'cach', opts: [['hoi', '🗣 Hỏi kỹ rồi mới gọi'], ['song', '⚡ Gọi đội + hồi sức song song']] }], after: (s, k) => markSeen(s, s.cach), goal: s => seen(s, 'hoi') && s.cach === 'song',
  draw: s => {
    const late = s.cach === 'hoi', on = !!s.cach, X = m => 150 + m * 36;
    let o = card(20, 20, 530, 316, '#fffdfa') + [0, 2, 4, 6, 8, 10].map(m => `<path d="M${X(m)} 52 V250" stroke="${C.grid}"/>` + T(X(m), 46, m + "′", { s: 11.5, c: C.mute })).join('');
    o += T(140, 98, '🔍 Tìm nguyên nhân', { a: 'end', s: 13.5 }) + T(140, 158, '🚑 Hồi sức', { a: 'end', s: 13.5 }) + T(140, 222, '🤰 Tình trạng mẹ', { a: 'end', s: 13.5 });
    if (on) {
      o += `<rect x="${X(0)}" y="82" width="${X(9) - X(0)}" height="26" rx="13" fill="${C.sky}"><animate attributeName="width" from="0" to="${X(9) - X(0)}" dur="1.2s" fill="freeze"/></rect>`;
      o += `<rect x="${X(late ? 7 : 0)}" y="142" width="${X(10) - X(late ? 7 : 0)}" height="26" rx="13" fill="${late ? '#ffb15c' : C.mintD}"><animate attributeName="width" from="0" to="${X(10) - X(late ? 7 : 0)}" dur="1.2s" begin="${late ? '.6s' : '0s'}" fill="freeze"/></rect>` + (late ? T(X(3.5), 160, 'chờ hỏi xong…', { s: 12.5, c: '#b5651d' }) : '');
      o += `<path d="M${X(0)} 210 ${late ? `L${X(5)} 214 L${X(7)} 236 L${X(10)} 244` : `L${X(4)} 214 L${X(10)} 208`}" fill="none" stroke="${late ? C.red : C.green}" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1"><animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.4s" fill="freeze"/></path>`;
      o += verdict(150, 268, 380, !late, late ? 'Mẹ xấu đi trong lúc chờ' : 'Mẹ được giữ ổn định', late ? 'hồi sức trễ 7 phút' : 'tên bệnh tìm song song');
    } else o += T(335, 160, '👆 chọn một cách làm ở trên', { s: 15, c: C.soft });
    return o;
  },
  say: s => s.cach === 'song' && seen(s, 'hoi') ? ['wow', 'Mẹ bất ổn: **gọi đội + hồi sức ngay**, tìm nguyên nhân **song song**. Đừng để việc đặt tên bệnh làm chậm cấp cứu.'] : s.cach === 'hoi' ? ['ouch', 'Hỏi bệnh thật kỹ rồi mới gọi → hồi sức **trễ**, mẹ xấu đi. Thử cách còn lại 👆'] : ['happy', 'Mẹ đang chảy máu, sinh hiệu xấu. Thử **cả hai cách làm** ở trên 👆']
});
B['ban-do-xuat-huyet'] = [
  { t: 'Bản đồ thời điểm chảy máu', kit: 'bb-tg', cr: 'Nhau & tử cung: ' + SV },
  { t: 'Trước sinh: ba câu hỏi lớn', kit: 'bb-truoc', cr: SV },
  { t: 'Ít máu ngoài mà mẹ sốc?', kit: 'bb-kin', cr: 'Thai phụ: ' + SV },
  { t: 'Hồi sức trước, tên bệnh sau', kit: 'bb-song' }
];

// ═════════ BÀI · Xuất huyết cuối thai kỳ: quyết định đầu tiên
const DS = [['ltri', '😵 Lơ mơ, vật vã'], ['mach', '💓 Mạch nhanh dần'], ['ha', '📉 HA tụt'], ['da', '🥶 Da lạnh, ẩm'], ['chay', '🩸 Máu đang chảy nhiều']];
kit('bt-den', {
  init: () => ({ ltri: false, mach: false, ha: false, da: false, chay: false, red: false }), ui: () => [],
  after: s => { if (DS.filter(([k]) => s[k]).length >= 3) s.red = true; }, goal: s => s.red,
  draw: s => {
    const n = DS.filter(([k]) => s[k]).length, lv = n >= 3 ? 0 : n >= 1 ? 1 : 2;
    let o = DS.map(([k, t], i) => tcard('!' + k, 20, 20 + i * 62, 250, 54, s[k], [t], '#ffe0e6')).join('');
    o += card(290, 20, 260, 310) + pic('sv-den.png', 300, 30, 100, 238);
    const L = [[350.5, 79], [350.5, 150.5], [350.5, 222]], col = ['#ff4d5e', '#ffc93c', '#3ad08a'];
    o += L.map(([x, y], i) => i === lv ? `<circle cx="${x}" cy="${y}" r="33" fill="none" stroke="${col[i]}" stroke-width="5" class="pulse"/>` : `<circle cx="${x}" cy="${y}" r="29" fill="#2b2b38" opacity=".75"/>`).join('');
    o += [['ĐỎ', 'gọi đội + ABC NGAY'], ['VÀNG', 'theo dõi sát'], ['XANH', 'ổn — tìm nguồn']].map(([a, b], i) => T(470, 76 + i * 66, a, { s: 15, c: i === lv ? ['#d6334a', '#b8860b', C.green][i] : C.grid }) + T(470, 96 + i * 66, b, { s: 12, c: i === lv ? C.ink : C.grid })).join('');
    o += T(420, 300, n + ' dấu hiệu', { s: 14, c: C.mute });
    return o;
  },
  say: s => s.red ? ['worry', 'Câu hỏi đầu tiên luôn là **mẹ có bất ổn không**. Bất ổn → **gọi đội + ABC ngay**, chưa cần biết tên bệnh.'] : ['happy', 'Bật dần các **dấu hiệu** bên trái — đèn chuyển màu theo mức khẩn 👆']
});
const ctg = (x, y, w, bad) => { let p = '', u = ''; for (let i = 0; i <= 120; i++) { const t = i / 120, X = x + t * w, cy = Math.max(0, Math.sin((t * 4 - .15) * Math.PI)) ** 2, base = bad ? 140 - 34 * Math.max(0, Math.sin((t * 4 - .45) * Math.PI)) ** 2 : 140 + 4 * Math.sin(t * 60); p += `${i ? 'L' : 'M'}${X.toFixed(1)} ${(y + 70 - (base - 100) * 1.1 + (bad ? Math.sin(t * 90) : Math.sin(t * 47) * 3)).toFixed(1)}`; u += `${i ? 'L' : 'M'}${X.toFixed(1)} ${(y + 150 - cy * 40).toFixed(1)}`; }
  return `<rect x="${x}" y="${y}" width="${w}" height="160" rx="8" fill="#fff6f0" stroke="#f3d3c4"/>` + [...Array(6)].map((_, i) => `<path d="M${x} ${y + 10 + i * 20} H${x + w}" stroke="#f6dccf"/>`).join('') + `<rect x="${x}" y="${y + 70 - 60 * 1.1}" width="${w}" height="${50 * 1.1}" fill="${C.mint}" opacity=".35"/><path d="${p}" fill="none" stroke="${bad ? C.red : '#2a2a3a'}" stroke-width="1.8"/><path d="${u}" fill="none" stroke="${C.cap}" stroke-width="1.6"/>`; };
kit('bt-thai', {
  init: () => ({ xem: false }), ui: () => [{ t: 'tog', k: 'xem', label: '👂 Xem tim thai (CTG)' }], goal: s => s.xem,
  draw: s => {
    let o = card(20, 20, 200, 316) + T(120, 50, '🤰 Mẹ', { s: 16 }) + vital(40, 66, 'Mạch', 92, '#7ee2b8', 160) + vital(40, 120, 'Huyết áp', '118/72', '#7ee2b8', 160) + vital(40, 174, 'SpO₂', '98%', '#7ee2b8', 160) + verdict(40, 240, 160, true, 'mẹ ổn');
    o += card(232, 20, 318, 316) + T(391, 50, '👶 Bé', { s: 16 });
    o += s.xem ? ZS.fade(ctg(248, 66, 286, true) + ZS.legend(252, 246, [['#c43a40', 'tim thai'], [C.cap, 'cơn co']], { s: 11.5 }) + verdict(248, 262, 286, false, 'nhịp giảm muộn lặp lại', 'thai bị đe dọa → KHẨN'), ZS.fresh(s, x => x.xem)) : T(391, 180, '?', { s: 46, c: C.soft });
    return o;
  },
  say: s => s.xem ? ['ouch', '**Mẹ ổn chưa chắc bé ổn**: tim thai có thể báo nguy trước khi mẹ tụt áp. Luôn đánh giá **cả hai**.'] : ['happy', 'Mẹ ra huyết, sinh hiệu còn tốt. Có yên tâm được chưa? Bấm **👂 Xem tim thai** 👆']
});
kit('bt-nguon', {
  init: () => ({ sel: '', seen: '' }), ui: () => [], after: (s, k) => { if (k === 'sel') markSeen(s, s.sel); }, goal: s => seen(s, 'sa') && seen(s, 'hoi'),
  draw: s => {
    const C3 = [['ngon', 'sv-ban-tay.png', 'Khám ngón tay', ['⛔ CHƯA được', 'khi chưa loại trừ NTĐ'], false], ['sa', 'sv-sieu-am.png', 'Siêu âm', ['✓ xác định', 'vị trí bánh nhau'], true], ['hoi', '', 'Hỏi bệnh', ['✓ tuổi thai · đau?', 'thai máy · mổ cũ'], true]];
    return C3.map(([k, f, t, d, good], i) => { const x = 20 + i * 178, on = s.sel === k, sn = seen(s, k);
      return `<g class="tap" data-set="sel=${k}">${card(x, 20, 168, 310, on ? (good ? C.mint : '#ffd0d8') : '#fff', on ? C.soft : sn ? C.mintD : C.grid)}${f ? pic(f, x + 34, 34, 100, 170) : T(x + 84, 130, '🗒️', { s: 64 })}${T(x + 84, 232, t, { s: 16 })}${sn ? T(x + 84, 262, d[0], { s: 14, c: good ? C.green : C.redD }) + T(x + 84, 284, d[1], { s: 12.5, c: C.mute }) : T(x + 84, 270, '👆 chạm', { s: 13, c: C.soft })}</g>`; }).join('');
  },
  say: s => seen(s, 'sa') && seen(s, 'hoi') ? ['happy', 'Tìm nguồn **an toàn**: hỏi bệnh + **siêu âm** vị trí nhau. **Không khám ngón tay** trước khi loại trừ nhau tiền đạo.'] : s.sel === 'ngon' ? ['ouch', 'Ngón tay chọc vào bánh nhau tiền đạo → **chảy máu ồ ạt**. Chọn cách khác!'] : ['happy', 'Mẹ ổn rồi — giờ tìm **nguồn chảy máu**. Chọn các cách **an toàn** 👆']
});
kit('bt-khan', {
  init: () => ({ wait: false, sw: false }), ui: () => [{ t: 'tog', k: 'wait', label: '⏳ Chờ đủ xét nghiệm & hình ảnh' }], after: s => { if (s.wait) s.sw = true; }, goal: s => s.sw && !s.wait,
  draw: s => {
    const w = s.wait;
    let o = card(20, 20, 300, 316, '#fffdfa') + T(170, 50, 'Mẹ / thai nguy kịch', { s: 15, c: C.redD });
    o += [['🚨 Gọi đội', 0], ['💉 ABC · đường truyền · máu', 1], ['🏥 Chuẩn bị sinh / cầm máu', 2]].map(([t, i]) => `<rect x="40" y="${74 + i * 56}" width="260" height="44" rx="14" fill="${w && i === 2 ? '#f4f0fb' : C.mint}" stroke="${w && i === 2 ? C.grid : C.mintD}"/>` + T(56, 101 + i * 56, t, { a: 'start', s: 13.5, c: w && i === 2 ? C.mute : C.ink }) + (w && i === 2 ? T(290, 101 + i * 56, '⏸', { a: 'end', s: 15 }) : T(290, 101 + i * 56, '▶', { a: 'end', s: 13, c: C.green }))).join('');
    o += T(170, 270, 'cùng lúc, không chờ nhau', { s: 13, c: C.green }) + (w ? T(170, 298, '⏳ đang chờ kết quả…', { s: 14, c: '#b5651d' }) : '');
    const fhr = w ? 80 : 140;
    o += card(332, 20, 218, 316) + heart(400, 120, 50, fhr, w ? C.red : '#ff8fa8') + T(470, 112, 'tim thai', { a: 'start', s: 12.5, c: C.mute }) + T(470, 138, fhr, { a: 'start', s: 22, c: w ? C.redD : C.ink });
    o += `<g transform="translate(441 236)"><circle r="44" fill="#fff" stroke="${C.soft}" stroke-width="2"/><path d="M0 0 V-34" stroke="${C.red}" stroke-width="3" stroke-linecap="round">${w ? '<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2.5s" repeatCount="indefinite"/>' : ''}</path><circle r="4" fill="${C.red}"/></g>` + T(441, 304, w ? 'thời gian trôi…' : 'không chờ', { s: 13, c: w ? C.redD : C.green });
    return o;
  },
  say: s => s.sw && !s.wait ? ['happy', 'Mẹ hoặc thai nguy kịch → **chuẩn bị can thiệp ngay**, không chờ hoàn tất mọi khảo sát. Đội làm **nhiều nhánh cùng lúc**.'] : s.wait ? ['ouch', 'Chờ đủ xét nghiệm → tim thai **chậm dần**. Tắt nút ⏳ đi!'] : ['happy', 'Thử bật **⏳ Chờ đủ xét nghiệm & hình ảnh** xem chuyện gì xảy ra 👆']
});
B['triage-aph'] = [
  { t: 'Câu hỏi đầu: mẹ có bất ổn?', kit: 'bt-den', cr: 'Đèn: ' + SV },
  { t: 'Mẹ ổn chưa chắc bé ổn', kit: 'bt-thai' },
  { t: 'Tìm nguồn chảy máu an toàn', kit: 'bt-nguon', cr: 'Bàn tay, máy siêu âm: ' + SV },
  { t: 'Nguy kịch: không chờ đủ khảo sát', kit: 'bt-khan' }
];
ZS.BK.wall = wall; ZS.BK.woman = woman;
})();
