'use strict';
/* Trang tí hon — chương 05 Nhau bong non. Hình: Servier Medical Art (CC BY 4.0) cho nhau, người, máy siêu âm; sơ đồ tự vẽ tử cung có máu tụ sau nhau, CTG, ống nghiệm. */
(() => {
const ZS = window.ZS, { C, T, kit, arrow } = ZS, B = ZS.beats;
const { Th, card, pic, tap, call, tcard, pcard, flow, heart, drops, vital, verdict, seen, markSeen, tfKit } = ZS.BK;
const SV = 'Servier Medical Art · CC BY 4.0';
// tử cung nhìn dọc + bánh nhau thành sau-đáy; c = độ dày máu tụ sau nhau (0–1); ext: máu thoát theo màng ra ngoài
const AB = (x, y, k, c, o = {}) => {
  const P = (lx, ly) => [+(x + (lx - 130) * k).toFixed(1), +(y + ly * k).toFixed(1)], sh = 36 * c;
  let s = `<g ${o.hard ? 'class="pulse"' : ''}>${ZS.uterusSag({ x, y, k })}</g>`;
  if (o.couv) s += [[70, 60], [200, 80], [60, 150], [210, 160], [130, 30]].map(([lx, ly], i) => `<ellipse cx="${P(lx, ly)[0]}" cy="${P(lx, ly)[1]}" rx="${(16 + i * 3) * k}" ry="${(11 + i * 2) * k}" fill="#7d4f7e" opacity=".55"/>`).join('');
  const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16 * .62, lx = (1 - t) ** 2 * 200 + 2 * (1 - t) * t * 214 + t * t * 160, ly = (1 - t) ** 2 * 50 + 2 * (1 - t) * t * 170 + t * t * 206; pts.push(P(lx - sh * Math.sin(Math.PI * i / 16), ly)); }
  if (c > 0) { const mid = P(212 - sh / 2, 110); s += `<ellipse cx="${mid[0]}" cy="${mid[1]}" rx="${(sh / 2 + 5) * k}" ry="${(26 + 44 * c) * k}" fill="url(#gClot)" stroke="${C.clotD}" stroke-width="1"/>`; }
  const d = 'M' + pts.map(p => p.join(' ')).join(' L');
  s += `<path d="${d}" fill="none" stroke="${C.placD}" stroke-width="${24 * k}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#e66d78" stroke-width="${19 * k}" stroke-linecap="round"/>`;
  if (o.ext) { const a = P(206, 150), os = P(130, 208); s += `<path d="M${a[0]} ${a[1]} Q${P(196, 205)[0]} ${P(196, 205)[1]} ${os[0]} ${os[1] + 30 * k}" fill="none" stroke="${C.red}" stroke-width="${6 * k}" stroke-linecap="round"/>` + drops(os[0], os[1] + 46 * k, 2, .7, 12); }
  return { svg: s, P };
};
// băng CTG nhỏ: tim thai (trên) + cơn co (dưới); bad 0–1
const ctg = (x, y, w, bad, tone = 0) => { let p = '', u = ''; for (let i = 0; i <= 140; i++) { const t = i / 140, X = x + t * w, f = 4 + 3 * tone, cy = Math.max(0, Math.sin((t * f) * Math.PI)) ** 2, dec = bad * 34 * Math.max(0, Math.sin((t * f - .3) * Math.PI)) ** 2, base = 140 - 20 * bad - dec + (1 - bad) * 4 * Math.sin(t * 60);
    p += `${i ? 'L' : 'M'}${X.toFixed(1)} ${(y + 60 - (base - 110) * 1.2 + Math.sin(t * 77) * (3 - 2 * bad)).toFixed(1)}`; u += `${i ? 'L' : 'M'}${X.toFixed(1)} ${(y + 140 - 18 * tone - cy * (34 - 10 * tone)).toFixed(1)}`; }
  return `<rect x="${x}" y="${y}" width="${w}" height="150" rx="8" fill="#fff6f0" stroke="#f3d3c4"/><rect x="${x}" y="${y + 60 - 50 * 1.2}" width="${w}" height="${50 * 1.2}" fill="${C.mint}" opacity=".3"/><path d="${p}" fill="none" stroke="${bad > .4 ? C.red : '#2a2a3a'}" stroke-width="1.8"/><path d="${u}" fill="none" stroke="${C.cap}" stroke-width="1.6"/>`; };

// ═════════ Nhau đúng chỗ, nhưng bong quá sớm
kit('bb-tu', {
  init: () => ({ c: 0 }), ui: () => [{ t: 'range', k: 'c', label: '🩸 Máu tụ sau nhau', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.c >= 70,
  draw: s => {
    const f = s.c / 100, A = AB(170, 40, .95, f, { hard: f > .5 }), ex = Math.round(100 - 70 * f), fhr = f > .6 ? 90 : f > .3 ? 120 : 140;
    let o = card(20, 20, 300, 316, '#fffdfa') + A.svg + (f > .1 ? call(...A.P(186, 112), 300, 330, 'máu tụ sau nhau', C.clotD, 'end', 12.5) : call(...A.P(206, 100), 300, 330, 'bánh nhau', C.placD, 'end', 12.5));
    o += card(332, 20, 218, 316) + T(441, 52, 'Diện trao đổi còn lại', { s: 13, c: C.mute }) + ZS.bar(352, 62, 178, ex, ex < 50 ? C.red : C.green, '', { h: 16 }) + T(441, 100, ex + '%', { s: 18, c: ex < 50 ? C.redD : C.ink });
    o += heart(392, 166, 32, fhr, fhr < 110 ? C.red : '#ff8fa8') + T(426, 160, 'tim thai', { a: 'start', s: 12.5, c: C.mute }) + T(426, 184, fhr + ' l/ph', { a: 'start', s: 18, c: fhr < 110 ? C.redD : C.ink });
    o += T(441, 240, 'máu tụ đẩy nhau', { s: 13 }) + T(441, 260, 'BÓC THÊM ra', { s: 14, c: C.redD }) + T(441, 300, 'vòng xoắn tự nặng lên', { s: 12, c: C.mute });
    return o;
  },
  say: s => s.c >= 70 ? ['ouch', 'Mạch màng rụng vỡ → **máu tụ sau nhau** → bóc nhau **thêm** → mất **diện trao đổi** oxy → tim thai chậm.'] : ['happy', 'Nhau bám đúng chỗ. Kéo thanh **🩸 Máu tụ sau nhau** 👆']
});
kit('bb-kin', {
  init: () => ({ k: '', seen: '' }), ui: () => [{ t: 'seg', k: 'k', opts: [['ngoai', '🩸 Máu thoát ra ngoài'], ['kin', '🔒 Máu kẹt kín sau nhau']] }], after: s => markSeen(s, s.k), goal: s => seen(s, 'ngoai') && seen(s, 'kin'),
  draw: s => {
    const kin = s.k === 'kin', A = AB(170, 40, .95, s.k ? (kin ? .9 : .4) : 0, { ext: s.k === 'ngoai', hard: kin });
    let o = card(20, 20, 300, 316, '#fffdfa') + A.svg;
    o += card(332, 20, 218, 316) + (s.k ? `<g class="fadein">${T(441, 52, 'máu thấy được', { s: 12.5, c: C.mute })}${T(441, 78, kin ? 'ÍT / không có' : 'nhiều', { s: 17, c: kin ? C.green : C.redD })}${vital(352, 100, 'Mạch', kin ? 128 : 104, kin ? '#ff6b7a' : '#ffb15c', 178)}${vital(352, 154, 'HA', kin ? '84/52' : '110/70', kin ? '#ff6b7a' : '#7ee2b8', 178)}${T(441, 236, kin ? 'mẹ sốc nặng hơn' : '', { s: 14, c: C.redD })}${T(441, 258, kin ? 'lượng máu thấy được!' : '', { s: 13, c: C.redD })}</g>` : T(441, 170, '👆 chọn ở trên', { s: 14, c: C.soft }));
    return o;
  },
  say: s => seen(s, 'ngoai') && seen(s, 'kin') ? ['worry', 'Máu có thể **thoát theo màng ra ngoài** hoặc **kẹt kín sau nhau**. **Máu ngoài ít không loại trừ NBN nặng** — đọc mạch, HA, tử cung, tim thai.'] : ['happy', 'Hai kiểu chảy máu của NBN. Bấm **lần lượt** cả hai 👆']
});
tfKit('bb-non', [['“Non” = chỉ xảy ra khi thai non tháng', false, '"Non" = nhau bong trước khi thai sổ; có thể gặp ở thai đủ tháng.'], ['“Non” = nhau bong TRƯỚC khi thai sổ', true, 'Đúng: bong sớm so với thời điểm sổ thai.'], ['Nặng nhẹ chỉ cần nhìn lượng máu ngoài', false, 'Máu có thể kẹt kín sau nhau; máu ngoài ít vẫn có thể nặng.'], ['Nặng nhẹ theo diện bong, tốc độ, đông máu', true, 'Diện bong lớn, bong nhanh, rối loạn đông máu thì nặng.']], '“Non” nghĩa là **bong trước khi thai sổ**, không phải thai non tháng. Nặng nhẹ phụ thuộc **diện bong, tốc độ, máu mất, đông máu** — không chỉ máu ngoài.');
B['bong-nhau-som'] = [
  { t: 'Máu tụ sau nhau bóc nhau ra', kit: 'bb-tu' },
  { t: 'Máu ra ngoài hay kẹt kín?', kit: 'bb-kin' },
  { t: '“Non” nghĩa là gì?', kit: 'bb-non' }
];

// ═════════ Nguy cơ NBN
const RB = [['tha', '🩺 Tăng HA, tiền sản giật', 'mach'], ['tc', '🔁 Từng bị NBN', 'mach'], ['thuoc', '🚬 Thuốc lá, chất kích thích', 'mach'], ['viem', '🦠 Viêm màng ối, nhiễm trùng', 'viem'], ['oi', '💧 Ối vỡ', 'viem'], ['cham', '🚗 Chấn thương bụng', 'co'], ['the', '🎈 Đa ối vỡ, đa thai: thể tích đổi nhanh', 'co']];
const MECH = { mach: ['Mạch máu', 'nền mạch dễ vỡ', '#e5484d'], viem: ['Viêm', 'màng rụng bị viêm', '#2fa376'], co: ['Cơ học', 'lực kéo tách diện nhau', '#4f9be0'] };
kit('bb-ng', {
  init: () => ({ sel: '', seen: '' }), ui: () => [], after: (s, k) => { if (k === 'sel') markSeen(s, s.sel); }, goal: s => RB.every(([k]) => seen(s, k)),
  draw: s => {
    let o = RB.map(([k, t, m], i) => pcard('sel=' + k, 20, 20 + i * 45, 290, 40, seen(s, k), s.sel === k, [t], '#fff')).join('');
    const cur = RB.find(([k]) => k === s.sel), m = cur && cur[2];
    o += card(322, 20, 228, 316) + T(436, 46, 'Cơ chế', { s: 13, c: C.mute });
    o += Object.entries(MECH).map(([k, [a, b, col]], i) => { const on = m === k, y = 64 + i * 88, n = RB.filter(r => r[2] === k && seen(s, r[0])).length; return `<rect x="338" y="${y}" width="196" height="76" rx="14" fill="${on ? col : '#fff'}" fill-opacity="${on ? .18 : 1}" stroke="${on ? col : C.grid}" stroke-width="${on ? 2 : 1}"/>` + T(354, y + 30, a, { a: 'start', s: 15, c: on ? col : C.ink }) + T(354, y + 52, b, { a: 'start', s: 12, c: C.mute }) + T(520, y + 30, '●'.repeat(n), { a: 'end', s: 11, c: col }); }).join('');
    return o;
  },
  say: s => RB.every(([k]) => seen(s, k)) ? ['happy', 'Nhớ nguy cơ NBN theo **3 cơ chế**: nền **mạch máu** dễ vỡ, môi trường **viêm**, **lực cơ học** tách diện nhau.'] : ['happy', 'Chạm từng yếu tố — xem nó thuộc **cơ chế** nào bên phải 👆']
});
kit('bb-khong', {
  init: () => ({ xem: false }), ui: () => [{ t: 'tog', k: 'xem', label: '🔎 Khám & đọc CTG' }], goal: s => s.xem,
  draw: s => {
    let o = `<rect x="20" y="20" width="250" height="316" rx="14" fill="#fffdf4" stroke="${C.butterD}"/>` + T(145, 46, '📋 Phiếu nguy cơ', { s: 14 }) + ['Từng NBN', 'Tăng HA / TSG', 'Chấn thương', 'Hút thuốc', 'Viêm màng ối'].map((t, i) => `<rect x="40" y="${68 + i * 36}" width="14" height="14" rx="4" fill="#fff" stroke="${C.soft}"/>` + T(64, 80 + i * 36, t, { a: 'start', s: 13 })).join('') + T(145, 268, 'KHÔNG có yếu tố nào', { s: 13.5, c: C.green });
    o += card(282, 20, 268, 316) + (s.xem ? `<g class="fadein">${T(416, 48, 'đau liên tục · tử cung gồng cứng', { s: 12.5, c: C.redD })}${ctg(298, 60, 236, .9, .8)}${verdict(298, 222, 236, false, 'Vẫn phải nghĩ NBN', 'bệnh đang biểu hiện quan trọng hơn phiếu')}</g>` : T(416, 170, '👆 bấm nút ở trên', { s: 14, c: C.soft }));
    return o;
  },
  say: s => s.xem ? ['worry', '**Không có nguy cơ kinh điển** không loại được bệnh **đang biểu hiện**: đau, tử cung gồng, CTG xấu → vẫn xử trí như NBN.'] : ['happy', 'Phiếu nguy cơ trống trơn. Bấm **🔎 Khám & đọc CTG** 👆']
});
B['nguy-co-nbn'] = [
  { t: 'Nguy cơ theo ba cơ chế', kit: 'bb-ng' },
  { t: 'Không nguy cơ vẫn có thể NBN', kit: 'bb-khong' }
];

// ═════════ Tăng trương lực
kit('bb-tl', {
  init: () => ({ th: 0 }), ui: () => [{ t: 'range', k: 'th', label: '⚡ Thrombin kích thích cơ', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.th >= 70,
  draw: s => {
    const f = s.th / 100, A = AB(150, 60, .74, .4 + .5 * f, { hard: f > .5 });
    let o = card(20, 20, 260, 316, '#fffdfa') + A.svg + (f > .5 ? Th(150, 46, 'cứng như gỗ, ấn đau', { s: 13, c: C.redD }) : '') + T(150, 320, f > .5 ? '😣 đau liên tục' : '', { s: 14, c: C.redD });
    o += card(292, 20, 258, 316) + T(421, 46, 'CTG', { s: 13, c: C.mute }) + ctg(306, 56, 230, f, f) + ZS.legend(310, 228, [[f > .4 ? C.red : '#2a2a3a', 'tim thai'], [C.cap, 'cơn co']], { s: 11.5 });
    o += T(421, 262, f > .5 ? 'trương lực nền ↑ · cơn co dồn dập' : 'cơn co bình thường', { s: 12.5, c: f > .5 ? C.redD : C.mute }) + T(421, 284, f > .5 ? 'tim thai giảm muộn lặp lại' : '', { s: 12.5, c: C.redD }) + T(421, 318, 'tocograph ngoài: đọc tần số, không đọc áp lực', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.th >= 70 ? ['worry', 'Máu và **thrombin** ở diện bong kích thích cơ → **trương lực nền tăng**, cơn co dồn dập, **đau**; mất diện trao đổi → **tim thai bất thường**.'] : ['happy', 'Kéo thanh **⚡ Thrombin** — nhìn tử cung và băng CTG 👆']
});
const SG = [['dau', '😣', 'Đau đột ngột / liên tục'], ['an', '🖐', 'Ấn đau tử cung'], ['go', '🪵', 'Trương lực nền tăng'], ['mau', '🩸', 'Ra huyết (có thể ít)'], ['ctg', '📉', 'Tim thai bất thường / thai lưu']];
kit('bb-dh', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => SG.every(([k]) => seen(s, k)),
  draw: s => {
    let o = SG.map(([k, ic, t], i) => tcard('!' + k, 20, 20 + i * 63, 280, 56, seen(s, k), [ic + ' ' + t], '#ffe0e6')).join('');
    const n = SG.filter(([k]) => seen(s, k)).length;
    o += card(312, 20, 238, 316) + T(431, 56, 'Bức tranh kinh điển', { s: 13.5 }) + `<rect x="336" y="76" width="190" height="16" rx="8" fill="#f4f0fb"/><rect x="336" y="76" width="${38 * n}" height="16" rx="8" fill="${C.red}"/>` + T(431, 120, n + ' / 5', { s: 18 });
    o += T(431, 190, 'ca nhẹ: KHÔNG đủ', { s: 13.5, c: C.redD }) + T(431, 212, 'bức tranh kinh điển', { s: 13 }) + T(431, 266, 'không chờ đủ đau + máu', { s: 12.5, c: C.mute }) + T(431, 286, '+ siêu âm thấy khối', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => SG.every(([k]) => seen(s, k)) ? ['worry', 'Gợi ý: **đau, ấn đau, trương lực nền tăng, ra huyết, tim thai bất thường**. Ca nhẹ có thể thiếu vài dấu — **không chờ đủ** mới hành động.'] : ['happy', 'Bật từng **dấu hiệu** gợi ý NBN 👆']
});
B['tang-truong-luc'] = [
  { t: 'Thrombin làm tử cung gồng', kit: 'bb-tl' },
  { t: 'Năm dấu hiệu gợi ý', kit: 'bb-dh' }
];

// ═════════ Chẩn đoán
kit('bb-sa', {
  init: () => ({ h: 0, seenFresh: true }), ui: () => [{ t: 'range', k: 'h', label: '⏱ Máu tụ được bao lâu', min: 0, max: 48, step: 6, unit: ' giờ' }], after: s => { if (s.h <= 6) s.seenFresh = true; }, goal: s => s.seenFresh && s.h >= 24,
  draw: s => {
    const f = Math.min(1, s.h / 36), A = AB(150, 60, .74, .7);
    let o = card(20, 20, 260, 316, '#fffdfa') + A.svg + Th(150, 46, 'thật ra: có máu tụ', { s: 13, c: C.clotD }) + ZS.bar(50, 306, 200, f * 100, f < .3 ? '#bdb6dc' : f < .7 ? '#7e78a8' : '#3a3657', `máu tụ ${s.h} giờ tuổi`, { h: 12 });
    o += card(292, 20, 258, 316) + `<rect x="306" y="34" width="230" height="200" rx="12" fill="#15141f"/><path d="M421 42 L320 226 A190 190 0 0 0 522 226Z" fill="#26243a"/>`;
    o += `<path d="M470 70 Q500 140 470 210" fill="none" stroke="#c9c3e6" stroke-width="22" stroke-linecap="round" opacity=".7"/>` + `<ellipse cx="452" cy="140" rx="12" ry="40" fill="${f < .3 ? '#bdb6dc' : f < .7 ? '#7e78a8' : '#3a3657'}" opacity=".85"/>` + T(421, 226, f < .3 ? 'máu tụ MỚI: trông giống mô nhau' : 'máu tụ cũ: dễ thấy hơn', { s: 11.5, c: '#d8d0f5' });
    o += verdict(306, 250, 230, f >= .7, f < .3 ? '“Không thấy gì”' : 'thấy khối tụ', f < .3 ? 'KHÔNG loại trừ NBN' : 'siêu âm chỉ hỗ trợ');
    return o;
  },
  say: s => s.seenFresh && s.h >= 24 ? ['worry', 'Máu tụ **mới** trông giống mô nhau trên siêu âm → **“không thấy gì” không loại trừ NBN**. Chẩn đoán chủ yếu bằng **lâm sàng**.'] : ['happy', 'Máu tụ ngay lúc đầu siêu âm có thấy không? Kéo thanh **⏱** từ 0 lên 👆']
});
const XN = [['cbc', '#a985e8', 'Công thức máu, tiểu cầu', true], ['fib', '#7cc7f2', 'Đông máu, fibrinogen', true], ['nm', '#ff8fb1', 'Nhóm máu, chế phẩm', true], ['dd', '#cfcfcf', 'D-dimer đơn độc', false]];
kit('bb-xn', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => XN.every(([k]) => seen(s, k)),
  draw: s => T(285, 44, 'Xét nghiệm để làm gì? Chạm từng ống', { s: 14 }) + XN.map(([k, cap, t, ok], i) => { const x = 40 + i * 128, sn = seen(s, k);
    return `<g class="tap" data-set="!${k}"><rect x="${x + 38}" y="70" width="34" height="18" rx="6" fill="${cap}" stroke="${C.soft}"/><rect x="${x + 41}" y="86" width="28" height="120" rx="12" fill="#fff" stroke="${C.soft}"/><rect x="${x + 43}" y="120" width="24" height="84" rx="10" fill="${sn && !ok ? '#cdb6bc' : '#c8283c'}"/>${sn ? `<circle cx="${x + 55}" cy="146" r="38" fill="none" stroke="${ok ? C.green : C.red}" stroke-width="2.6" class="fadein"/>` : ''}${ZS.wrap(t, 14).map((l, j) => T(x + 55, 232 + j * 17, l, { s: 12.5 })).join('')}${sn ? `<g class="fadein">${T(x + 55, 296, ok ? '✓ hậu quả & kế hoạch' : '✗ không đặc hiệu', { s: 12, c: ok ? C.green : C.redD })}</g>` : T(x + 55, 296, '👆', { s: 14, c: C.soft })}</g>`; }).join('') + T(285, 330, 'xét nghiệm đánh giá HẬU QUẢ, không “xác nhận” NBN', { s: 12.5, c: C.mute }),
  say: s => XN.every(([k]) => seen(s, k)) ? ['happy', 'Xét nghiệm để đánh giá **hậu quả và chuẩn bị máu**. **D-dimer đơn độc** không đặc hiệu trong thai kỳ, không xác nhận NBN.'] : ['happy', 'Chạm **4 ống** xét nghiệm 👆']
});
kit('bb-pb', {
  init: () => ({ sel: '', seen: '' }), ui: () => [{ t: 'seg', k: 'sel', opts: [['ntd', '🥧 Nhau tiền đạo'], ['vo', '⚡ Vỡ tử cung'], ['cd', '🌊 Chuyển dạ']] }], after: s => markSeen(s, s.sel), goal: s => ['ntd', 'vo', 'cd'].every(k => seen(s, k)),
  draw: s => {
    const D = { ntd: ['Nhau tiền đạo', 'không đau, TC mềm', 'TVS thấy nhau thấp'], vo: ['Vỡ tử cung', 'sẹo cũ / tắc nghẽn', 'mất ngôi, đau, sốc'], cd: ['Chuyển dạ', 'cơn co có nghỉ', 'TC mềm giữa cơn'] }, d = D[s.sel];
    let o = card(20, 20, 300, 316, '#fffdfa');
    if (s.sel === 'ntd') o += `<g class="fadein">${pic('sv-nhau-tien-dao.png', 70, 36, 200, 236)}</g>`;
    else if (s.sel === 'vo') o += `<g class="fadein">${ZS.uterusSag({ x: 170, y: 46, k: .8 })}<path d="M104 150 l14 -10 l-6 18 l16 -8 l-8 22" fill="none" stroke="${C.red}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="pulse"/>${ZS.drop(100, 215, .9, 'drip')}</g>`;
    else if (s.sel === 'cd') o += `<g class="fadein">${ZS.uterusSag({ x: 170, y: 46, k: .8 })}<path d="M60 296 q18 -34 36 0 t36 0 t36 0 t36 0" fill="none" stroke="${C.myoD}" stroke-width="3"/>${T(170, 322, 'cơn co → nghỉ → cơn co', { s: 12, c: C.mute })}</g>`;
    else o += T(170, 160, '👆 chọn một bệnh ở trên', { s: 15, c: C.soft });
    o += card(332, 20, 218, 316) + (d ? `<g class="fadein">${T(441, 62, d[0], { s: 17 })}<path d="M352 80 H530" stroke="${C.grid}"/>${T(441, 120, d[1], { s: 14.5 })}${T(441, 150, d[2], { s: 14.5, c: C.mute })}</g>` : T(441, 150, 'khác NBN ở đâu?', { s: 14, c: C.soft }));
    o += `<rect x="346" y="226" width="190" height="86" rx="14" fill="#fff1f4" stroke="${C.pinkD}"/>` + T(441, 254, 'NBN thì…', { s: 12.5, c: C.mute }) + T(441, 278, 'đau liên tục, TC gồng', { s: 14, c: C.redD }) + T(441, 298, 'tim thai xấu, đông máu', { s: 13, c: C.redD });
    return o;
  },
  say: s => ['ntd', 'vo', 'cd'].every(k => seen(s, k)) ? ['happy', 'Phân biệt NBN với **nhau tiền đạo, vỡ tử cung, chuyển dạ** và nguồn chảy khác. Người bất ổn: **hồi sức trước**, không chờ “xét nghiệm chắc”.'] : ['happy', 'Chọn **từng bệnh** ở trên, so với NBN 👆']
});
B['chan-doan-nbn'] = [
  { t: 'Siêu âm “không thấy” chưa loại trừ', kit: 'bb-sa' },
  { t: 'Xét nghiệm: hậu quả, không xác nhận', kit: 'bb-xn' },
  { t: 'Phân biệt với bệnh khác', kit: 'bb-pb' }
];

// ═════════ DIC & Couvelaire
kit('bb-dic', {
  init: () => ({ tf: 0 }), ui: () => [{ t: 'range', k: 'tf', label: '🧨 Tissue factor từ diện bong', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.tf >= 70,
  draw: s => {
    const f = s.tf / 100, fib = +(4.5 - 3.6 * f).toFixed(1), clot = fib >= 2;
    let o = card(20, 20, 300, 316, '#fffdfa') + T(170, 46, 'Ống máu để yên 8 phút', { s: 13, c: C.mute });
    o += `<rect x="128" y="64" width="84" height="220" rx="36" fill="#fff" stroke="${C.soft}" stroke-width="2"/>` + (clot ? `<path d="M134 150 Q170 130 206 150 V246 Q170 274 134 246Z" fill="#8e1b2c"/>` + T(170, 310, 'đông thành cục', { s: 13.5, c: C.green }) : `<path d="M134 120 H206 V250 Q170 278 134 250Z" fill="#d23c50"/>` + T(170, 310, 'KHÔNG đông, vẫn lỏng', { s: 13.5, c: C.redD }));
    o += card(332, 20, 218, 316) + T(441, 56, 'Fibrinogen', { s: 13, c: C.mute }) + T(441, 96, fib.toString().replace('.', ',') + ' g/L', { s: 26, c: fib < 2 ? C.redD : C.ink }) + ZS.bar(352, 108, 178, fib / 4.5 * 100, fib < 2 ? C.red : C.green, '', { h: 14 });
    o += T(441, 170, 'Tiểu cầu', { s: 13, c: C.mute }) + ZS.bar(352, 180, 178, 100 - 70 * f, f > .6 ? C.red : C.green, '', { h: 14 }) + T(441, 250, f > .6 ? 'chảy máu lan tỏa' : '', { s: 14, c: C.redD }) + T(441, 272, f > .6 ? 'vượt xa máu thấy được' : '', { s: 12.5, c: C.redD }) + T(441, 314, 'số minh họa', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.tf >= 70 ? ['ouch', 'Nhau và màng rụng giàu **tissue factor** → đông lan tỏa, tiêu hao **fibrinogen, tiểu cầu** → máu **không đông**. Chuẩn bị máu **không chỉ hồng cầu**.'] : ['happy', 'Kéo thanh **🧨 Tissue factor** — nhìn ống máu bên trái 👆']
});
kit('bb-couv', {
  init: () => ({ mo: false, co: false }), ui: () => [{ t: 'tog', k: 'mo', label: '🔪 Mổ: nhìn tử cung' }, { t: 'tog', k: 'co', label: '💪 Tử cung co hồi tốt, cầm máu' }], goal: s => s.mo && s.co,
  draw: s => {
    let o = card(20, 20, 310, 316, '#fffdfa');
    if (!s.mo) {
      o += T(175, 160, '👆 Bật “🔪 Mổ” để vào phẫu trường', { s: 14, c: C.soft });
    } else {
      o += `<g class="fadein"><rect x="30" y="30" width="290" height="296" rx="14" fill="#366352"/>`;
      o += `<ellipse cx="175" cy="178" rx="120" ry="130" fill="#f8e8ea" stroke="#d48a98" stroke-width="3"/>`;
      o += `<path d="M55 120 C70 150 70 200 55 230" fill="none" stroke="#b0b8c4" stroke-width="7" stroke-linecap="round"/><path d="M295 120 C280 150 280 200 295 230" fill="none" stroke="#b0b8c4" stroke-width="7" stroke-linecap="round"/>`;
      const k = s.co ? 0.82 : 1;
      const myoCol = s.co ? '#bd526c' : '#542654';
      o += `<g transform="translate(175 180) scale(${k}) translate(-175 -180)">`;
      o += `<path d="M100 130 C90 70 140 60 175 60 C210 60 260 70 250 130 C240 210 205 250 175 255 C145 250 110 210 100 130 Z" fill="${myoCol}" stroke="${s.co ? '#943149' : '#331235'}" stroke-width="2.5"/>`;
      const patches = [[140, 95, 22, 14], [210, 100, 26, 16], [165, 135, 34, 22], [130, 160, 20, 15], [215, 165, 25, 18], [175, 195, 30, 16], [175, 80, 18, 10]];
      o += patches.map(([px, py, prx, pry], i) => `<ellipse cx="${px}" cy="${py}" rx="${prx}" ry="${pry}" fill="${s.co ? '#481d3e' : '#2b092d'}" opacity="${s.co ? .55 : .85}" transform="rotate(${i * 15} ${px} ${py})"/>`).join('');
      o += `<path d="M130 85 Q175 75 220 90" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>`;
      o += `<path d="M100 110 Q65 100 50 130" fill="none" stroke="${s.co ? '#b8546e' : '#5a2d58'}" stroke-width="6" stroke-linecap="round"/>`;
      o += `<path d="M250 110 Q285 100 300 130" fill="none" stroke="${s.co ? '#b8546e' : '#5a2d58'}" stroke-width="6" stroke-linecap="round"/>`;
      o += `<path d="M135 220 Q175 230 215 220" fill="none" stroke="${s.co ? '#2fa376' : '#e5484d'}" stroke-width="3.5" stroke-linecap="round"/>`;
      if (!s.co) o += drops(175, 235, 3, .8, 18);
      o += `</g>`;
      o += call(140, 130, 42, 46, 'Máu thấm thớ cơ', '#fff', 'start', 12);
      o += call(210, 190, 308, 46, s.co ? 'Cơ co săn chắc' : 'Tử cung nhão', s.co ? C.green : '#ff8595', 'end', 12);
      o += `</g>`;
    }
    o += card(342, 20, 208, 316);
    if (s.mo) {
      o += T(446, 52, 'Tử cung Couvelaire', { s: 16, c: C.clotD }) + T(446, 72, '(phong huyết tử cung - nhau)', { s: 11.5, c: C.mute }) + `<path d="M360 86 H532" stroke="${C.grid}"/>`;
      if (!s.co) {
        o += `<rect x="358" y="98" width="176" height="64" rx="14" fill="#ffd0d8"/>` + T(446, 124, 'Tím đen bầm dập', { s: 15, c: C.redD }) + T(446, 146, '→ Có phải cắt ngay?', { s: 13, c: C.redD }) + T(446, 195, 'Bác sĩ trẻ hay sợ hãi', { s: 12.5, c: C.mute }) + T(446, 215, 'tưởng cơ tử cung hoại tử!', { s: 12.5, c: C.mute }) + T(446, 260, '👉 Bật công tắc kiểm tra:', { s: 12, c: C.ink }) + T(446, 280, '“Tử cung co hồi tốt”', { s: 12.5, c: C.green });
      } else {
        o += `<g class="fadein">` + verdict(356, 98, 180, true, 'KHÔNG CẮT TỬ CUNG!', 'co hồi tốt = giữ lại') + `<rect x="356" y="174" width="180" height="92" rx="12" fill="#d6f4e6" stroke="#95dbbb"/>` + T(446, 196, 'Nguyên tắc vàng:', { s: 12.5, c: '#237352' }) + T(370, 218, '• Tím do máu thấm cơ', { a: 'start', s: 11.5, c: '#237352' }) + T(370, 236, '• Cơ vẫn co bóp siết mạch', { a: 'start', s: 11.5, c: '#237352' }) + T(370, 254, '• Chỉ cắt nếu đờ kháng trị', { a: 'start', s: 11.5, c: '#237352' }) + T(446, 298, 'Bảo tồn tối đa cho mẹ', { s: 12.5, c: C.green }) + `</g>`;
      }
    } else {
      o += T(446, 150, '👆 Bật nút trên', { s: 14, c: C.soft }) + T(446, 175, 'để mổ quan sát', { s: 13, c: C.mute });
    }
    return o;
  },
  say: s => s.mo && s.co ? ['wow', '**Couvelaire**: máu thấm vào cơ dưới thanh mạc làm tử cung **tím bầm**. Tím **không đồng nghĩa hoại tử** — cơ co tốt, cầm máu được thì **KHÔNG CẮT TỬ CUNG**!'] : s.mo ? ['worry', 'Tử cung tím đen loang lổ! Đừng hoảng hốt vội cắt — kiểm tra xem **tử cung có co hồi được không** 👆'] : ['happy', 'Bật **🔪 Mổ: nhìn tử cung** để xem màu sắc thực tế của tử cung Couvelaire 👆']
});
B['dic-couvelaire'] = [
  { t: 'DIC: máu không còn đông', kit: 'bb-dic' },
  { t: 'Tử cung tím có phải cắt?', kit: 'bb-couv' }
];

// ═════════ Xử trí: đường sinh
kit('bb-dg', {
  init: () => ({ me: 'on', thai: 'song', nhanh: 'khong', seen: 'mo,' }), ui: () => [],
  after: s => markSeen(s, s.thai === 'song' ? (s.nhanh === 'khong' ? 'mo' : 'am') : (s.me === 'soc' ? 'kh' : 'uu')), goal: s => ['mo', 'am', 'kh', 'uu'].filter(k => seen(s, k)).length >= 3,
  draw: s => {
    const tb = (k, vals, x, y, lines, col) => `<g class="tap" data-set="${k}=${vals[(vals.indexOf(s[k]) + 1) % vals.length]}">${card(x, y, 160, 80, col, C.soft)}${lines.map((t, i) => T(x + 80, y + 32 + i * 22, t, { s: i ? 13 : 15, c: i ? C.mute : C.ink })).join('')}${T(x + 146, y + 18, '⇄', { s: 12, c: C.soft })}</g>`;
    let o = tb('me', ['on', 'soc'], 20, 20, ['🤰 MẸ', s.me === 'soc' ? 'sốc / DIC / chảy tiếp' : 'sinh hiệu ổn'], s.me === 'soc' ? '#ffd0d8' : C.mint) + tb('thai', ['song', 'mat'], 20, 112, ['👶 THAI', s.thai === 'song' ? 'còn sống, bị đe dọa' : 'đã mất'], s.thai === 'song' ? C.butter : C.lav) + tb('nhanh', ['khong', 'co'], 20, 204, ['🚪 Sinh âm đạo', s.nhanh === 'co' ? 'gần tức thời' : 'không nhanh được'], C.sky);
    o += T(100, 312, '👆 bấm thẻ để đổi', { s: 12, c: C.mute });
    const r = s.thai === 'song' ? (s.nhanh === 'khong' ? ['MỔ KHẨN', 'đưa thai ra kịp thời', '#ffd0d8'] : ['Sinh âm đạo ngay', 'nếu thật sự gần tức thời', C.mint]) : (s.me === 'soc' ? ['Quyết định khẩn', 'sốc không kiểm soát có thể cần mổ', '#ffe0cc'] : ['Ưu tiên sinh âm đạo', 'tránh mổ khi rối loạn đông', C.mint]);
    o += arrow('M184 150 H226', C.ink, 3) + `<rect x="232" y="40" width="318" height="220" rx="18" fill="${r[2]}"/>` + `<g class="fadein">${T(391, 130, r[0], { s: 22 })}${T(391, 162, r[1], { s: 14, c: C.mute })}</g>` + T(391, 300, 'luôn kèm: hồi sức + sửa đông máu', { s: 13.5, c: C.redD });
    return o;
  },
  say: s => ['mo', 'am', 'kh', 'uu'].filter(k => seen(s, k)).length >= 3 ? ['worry', 'Thai **còn sống, bị đe dọa**, không sinh âm đạo nhanh được → **mổ khẩn**. Thai đã mất → thường **ưu tiên âm đạo**, trừ khi mẹ sốc không kiểm soát.'] : ['happy', 'Bấm các thẻ **MẸ · THAI · Sinh âm đạo** để đổi tình huống — xem **3 kết quả khác nhau** 👆']
});
tfKit('bb-xtq', [['Tia ối bắt buộc cho mọi ca NBN', false, 'Tia ối không phải lệnh chung; quyết định theo từng ca.'], ['Cho giảm co thường quy để giữ thai', false, 'Không giảm co thường quy trong NBN nặng: nguy cơ lớn hơn lợi ích.'], ['Ca nhẹ, non, ổn định: theo dõi rất chọn lọc', true, 'Chỉ ca nhẹ, thai non, mẹ–thai ổn định mới cân nhắc theo dõi sát.'], ['Hồi sức & sửa đông máu song song', true, 'Hồi sức và sửa đông máu luôn chạy song song với xử trí sản khoa.']], 'Tia ối **không phải lệnh chung**; **không giảm co thường quy** trong NBN nặng. Ca nhẹ, non, ổn định mới cân nhắc theo dõi — luôn hồi sức & sửa đông máu song song.');
B['xu-tri-nbn'] = [
  { t: 'Sinh đường nào?', kit: 'bb-dg' },
  { t: 'Bốn câu về xử trí NBN', kit: 'bb-xtq' }
];

// ═════════ OSCE NBN
const OS = [['ctg', '📈 Nhận định', '“CTG có nhịp giảm muộn lặp lại, tử cung gồng liên tục.”'], ['cd', '🩺 Chẩn đoán', '“Dấu hiệu gợi ý bánh nhau bong sớm.”'], ['ng', '⚠️ Nguy cơ', '“Bé thiếu oxy; mẹ có nguy cơ mất máu, rối loạn đông máu.”'], ['kh', '🚑 Kế hoạch', '“Em đang gọi đội, chuẩn bị máu, đưa bé ra khẩn theo ê-kíp.”']];
kit('bb-osce', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => OS.every(([k]) => seen(s, k)),
  draw: s => {
    let o = OS.map(([k, t], i) => pcard('!' + k, 20, 20 + i * 80, 190, 70, seen(s, k), s._k === k, [t])).join('');
    o += card(222, 20, 328, 316) + OS.filter(([k]) => seen(s, k)).map(([k, , t], i) => `<g class="${s._k === k ? 'fadein' : ''}">${ZS.wrap(t, 40).map((l, j) => T(238, 52 + i * 72 + j * 19, l, { a: 'start', s: 13 })).join('')}</g>`).join('');
    if (!OS.some(([k]) => seen(s, k))) o += T(386, 170, '👆 chạm các thẻ theo thứ tự', { s: 13.5, c: C.soft });
    return o;
  },
  say: s => OS.every(([k]) => seen(s, k)) ? ['happy', 'Trạm NBN nặng: **nhận định → chẩn đoán → nguy cơ mẹ–con → kế hoạch** song song. Không chỉ nêu một tên bệnh.'] : ['happy', 'Ráp **4 câu nói** của trạm OSCE 👆']
});
kit('bb-noi', {
  init: () => ({ c: '', seen: '' }), ui: () => [{ t: 'seg', k: 'c', opts: [['hua', '😊 Hứa chắc'], ['doa', '😱 Chỉ dọa'], ['can', '🤝 Rõ khẩn + đồng cảm']] }], after: s => markSeen(s, s.c), goal: s => s.c === 'can' && (seen(s, 'hua') || seen(s, 'doa')),
  draw: s => {
    const M = { hua: ['“Chị yên tâm, chắc chắn mẹ con đều ổn.”', '✗ hứa điều không chắc', false], doa: ['“Rất nguy hiểm, bé có thể mất!”', '✗ dọa mà không có kế hoạch', false], can: ['“Bánh nhau có thể bong sớm làm bé thiếu oxy. Em đã gọi đội, chuẩn bị máu và đưa bé ra khẩn. Vẫn có nguy cơ, em sẽ cập nhật cho chị.”', '✓ rõ mức khẩn, có kế hoạch, đồng cảm', true] }[s.c];
    let o = card(20, 20, 530, 316, '#fffdfa') + pic('sv-phu-nu.png', 46, 60, 64, 230) + pic('sv-phu-nu.png', 460, 60, 64, 230) + T(78, 310, 'Bác sĩ', { s: 12.5, c: C.mute }) + T(492, 310, 'Người nhà', { s: 12.5, c: C.mute });
    if (M) o += `<g class="fadein"><rect x="130" y="60" width="310" height="${ZS.wrap(M[0], 34).length * 21 + 26}" rx="18" fill="${M[2] ? C.mint : '#ffd0d8'}"/>${ZS.wrap(M[0], 34).map((l, i) => T(146, 86 + i * 21, l, { a: 'start', s: 14 })).join('')}${T(285, 290, M[1], { s: 14, c: M[2] ? C.green : C.redD })}</g>`;
    else o += T(285, 170, '👆 chọn cách nói', { s: 14, c: C.soft });
    return o;
  },
  say: s => s.c === 'can' && (seen(s, 'hua') || seen(s, 'doa')) ? ['wow', 'Nói **rõ mức khẩn** + **kế hoạch đang làm** + **đồng cảm**. Tránh **hứa chắc** an toàn hoặc **chỉ dọa** mà không có kế hoạch.'] : ['happy', 'Ba cách nói với người nhà — thử **cả cách sai** và cách đúng 👆']
});
B['osce-nbn'] = [
  { t: 'Ráp câu trả lời trạm NBN', kit: 'bb-osce' },
  { t: 'Nói khẩn mà vẫn đồng cảm', kit: 'bb-noi', cr: 'Người: ' + SV }
];
})();
