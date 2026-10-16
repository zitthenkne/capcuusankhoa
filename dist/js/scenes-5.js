'use strict';
/* Họ 5: nhau tiền đạo, PAS, nhau bong non, băng CTG, vỡ tử cung, đường rạch tử cung & nguy cơ. */
(() => {
const ZS = window.ZS, { C, T, kit, plot, clamp, arrow, bar, lab, drop, pill, uterusSag } = ZS;

// ───────── băng CTG dùng chung: nhịp tim thai (trên) + cơn co (dưới)
ZS.ctg = (x, y, w, o = {}) => {
  const { fhr = 'normal', uc = 'normal', hh = 100, th = 58, dark = false, tone = 12 } = o, ucT = uc === 'hyper' ? 1.7 : 4.2, bg = dark ? '#16151f' : '#f7fffa', grid = dark ? '#2f2d44' : '#d9efe0';
  const ucv = t => { let v = tone; for (let c = 1; c < 12; c++) { const tc = c * ucT; if (Math.abs(t - tc) < 1.2) v += 55 * Math.exp(-((t - tc) ** 2) / .25); } return v; };
  const f = t => { let v = 140 + 3 * Math.sin(t * 7) + 2 * Math.sin(t * 19); if (fhr === 'late') for (let c = 1; c < 12; c++) { const tc = c * ucT + .45; if (Math.abs(t - tc) < 1.4) v -= 34 * Math.exp(-((t - tc) ** 2) / .45); } if (fhr === 'brady') v = 62 + 2 * Math.sin(t * 5); return v; };
  const A = plot({ x, y, w, h: hh, xr: [0, 10], yr: [60, 180], xt: 5, yt: 4, fx: v => v + '′', fy: v => v, bands: [{ x0: 0, x1: 10, fill: dark ? '#243a2f' : '#e3f6ea', op: .0 }], curves: [{ f, col: fhr === 'normal' ? (dark ? '#6ee7a1' : C.green) : (dark ? '#ff7a8a' : C.red), w: 2.4, n: 260 }], hl: [{ y: 110, c: C.grid }, { y: 160, c: C.grid }] });
  const B = plot({ x, y: y + hh + 28, w, h: th, xr: [0, 10], yr: [0, 100], xt: 5, yt: 2, fx: v => v + '′', fy: v => v, curves: [{ f: ucv, col: uc === 'hyper' ? (dark ? '#ff7a8a' : C.red) : C.soft, w: 2.4, n: 260 }] });
  return A.svg + B.svg + T(x + 6, y + 12, 'nhịp tim thai (lần/phút)', { a: 'start', s: 10.5, c: C.mute }) + T(x + 6, y + hh + 38, 'cơn co tử cung (mmHg)', { a: 'start', s: 10.5, c: C.mute });
};
const ctgOf = d => ({ fhr: d > 70 ? 'brady' : d > 35 ? 'late' : 'normal', uc: d > 50 ? 'hyper' : 'normal', tone: 10 + d * .25 });

// ───────── previa: vị trí nhau so với lỗ trong cổ tử cung — dist | stretch | exam
const wallPt = u => { // mép nhau chạy dọc thành trước (trái) rồi băng ngang lỗ trong; tọa độ gốc 260×262
  if (u <= 1) { const a = 1 - u; return [a * a * 52 + 2 * a * u * 56 + u * u * 104, a * a * 118 + 2 * a * u * 176 + u * u * 208]; } return [104 + (u - 1) * 52 / .9, 208]; };
const uOf = d => clamp(.1 + (40 - d) * .0225, .1, 1.9);
const K = 1, X0 = 170, Y0 = 24, cv = ([ox, oy]) => [X0 + (ox - 130) * K, Y0 + oy * K];
kit('previa', {
  zones: (s, sp) => { const d = sp.mode === 'dist' ? s.d : -12, e = cv(wallPt(uOf(d))), os = cv([130, 208]); return sp.mode === 'dist' ? { os: [os[0], os[1], 40, 16], edge: [e[0], e[1], 30, 24], ruler: [e[0] + 24, (e[1] + os[1]) / 2, 30, Math.max(14, (os[1] - e[1]) / 2 + 6)] } : sp.mode === 'stretch' ? { low: [170, 205, 70, 26], peel: [e[0], e[1], 36, 30], blood: [170, 290, 28, 40] } : { mom: [444, 44, 100, 16], screen: [444, 160, 98, 84], safe: [178, 304, 46, 24] }; },
  init: sp => sp.mode === 'dist' ? { d: 12 } : sp.mode === 'stretch' ? { eff: 20 } : { exam: 'abd' },
  ui: (s, sp) => sp.mode === 'dist' ? [{ t: 'range', k: 'd', label: '📏 Khoảng cách mép nhau – lỗ trong', min: -30, max: 40, step: 5, unit: ' mm' }]
    : sp.mode === 'stretch' ? [{ t: 'range', k: 'eff', label: '↔️ Đoạn dưới giãn · cổ tử cung xóa mở', min: 0, max: 100, step: 10, unit: '%' }]
      : [{ t: 'seg', k: 'exam', opts: [['abd', '🫃 Siêu âm bụng'], ['tvs', '📡 Siêu âm đầu dò (TVS)'], ['finger', '🖐 Thăm bằng ngón tay']] }],
  draw: (s, sp) => {
    const d = sp.mode === 'dist' ? s.d : -12, eff = sp.mode === 'stretch' ? s.eff / 100 : 0, finger = s.exam === 'finger', tvs = s.exam === 'tvs';
    const u = uOf(d), N = 22, pts = []; for (let i = 0; i <= N; i++) pts.push(cv(wallPt(.06 + (u - .06) * i / N)));
    let pp = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(x + (i > N * .6 ? eff * 8 : 0)).toFixed(1)} ${(y - (i > N * .6 ? eff * 10 : 0)).toFixed(1)}`).join(' ');
    let o = `<rect x="20" y="24" width="300" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + uterusSag({ x: X0, y: Y0, k: K });
    o += `<circle cx="${cv([180, 118])[0]}" cy="${cv([180, 118])[1]}" r="34" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/>`;
    o += `<path d="${pp}" fill="none" stroke="${C.placD}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><path d="${pp}" fill="none" stroke="url(#gPlac)" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>`;
    const os = cv([130, 208]); o += `<path d="M${os[0] - 34} ${os[1]} H${os[0] + 34}" stroke="${C.redD}" stroke-width="3" stroke-dasharray="6 5"/>` + T(os[0] - 40, os[1] - 4, 'lỗ trong', { a: 'end', s: 11, c: C.redD });
    const e = pts[N];
    if (sp.mode === 'dist') {
      if (d > 0) o += `<path d="M${e[0] + 30} ${e[1]} V${os[1]} M${e[0] + 24} ${e[1]} h12 M${e[0] + 24} ${os[1]} h12" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>` + T(e[0] + 40, (e[1] + os[1]) / 2 + 4, `d = ${d} mm`, { a: 'start', s: 13 });
      o += T(170, 318, d <= 0 ? 'NHAU TIỀN ĐẠO (chạm/che lỗ trong)' : d < 20 ? 'NHAU BÁM THẤP (<20 mm, chưa chạm)' : 'mép nhau còn xa lỗ trong', { s: 12.5, c: d <= 0 ? C.redD : d < 20 ? C.amber : C.green });
      const P = plot({ x: 366, y: 44, w: 170, h: 130, xr: [-30, 40], yr: [0, 100], xt: 7, yt: 2, fx: v => v, fy: () => '', xl: 'd (mm)', bands: [{ x0: -30, x1: 0, fill: C.pink, label: 'tiền đạo' }, { x0: 0, x1: 20, fill: C.butter, label: 'bám thấp' }, { x0: 20, x1: 40, fill: C.mint, label: 'xa' }], pts: [{ x: d, y: 50, col: C.red, r: 7 }], vl: [{ x: d }] });
      o += `<rect x="338" y="24" width="212" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(444, 40, 'Phân loại theo d (RCOG 2026)', { s: 11 }) + P.svg + T(444, 232, 'TVS đo thật theo kỹ thuật chuyên khoa;', { s: 10, c: C.mute }) + T(444, 246, 'hình này chỉ minh họa quan hệ.', { s: 10, c: C.mute });
    } else if (sp.mode === 'stretch') {
      const nb = Math.round(eff * 5); for (let i = 0; i < nb; i++) o += drop(170 + (i % 2) * 8 - 4, 262 + i * 14, .6, 'drip');
      o += `<path d="M${os[0] - 40} ${os[1] + 14} l-20 12 M${os[0] + 40} ${os[1] + 14} l20 12" stroke="${C.lavD}" stroke-width="4" stroke-linecap="round"/>` + T(170, 318, eff > .3 ? 'máu mẹ thoát ra lỗ trong — thường KHÔNG đau' : 'đoạn dưới còn chưa giãn', { s: 12, c: eff > .3 ? C.redD : C.mute });
      const P = plot({ x: 366, y: 44, w: 170, h: 120, xr: [0, 100], yr: [0, 100], xt: 5, yt: 2, fx: v => v, fy: () => '', xl: 'đoạn dưới giãn (%)', curves: [{ f: v => 100 * Math.min(1, v / 70) ** 1.6, col: C.red, w: 3.2, area: true }], vl: [{ x: s.eff }] });
      o += `<rect x="338" y="24" width="212" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(444, 40, 'Diện nhau bị kéo tách', { s: 11.5 }) + P.svg + T(444, 206, 'Sau sinh: đoạn dưới co rút', { s: 10.5, c: C.mute }) + T(444, 220, 'kém hơn thân → vẫn có thể', { s: 10.5, c: C.mute }) + T(444, 234, 'băng huyết dù đáy chắc.', { s: 10.5, c: C.mute });
    } else {
      const abd = s.exam === 'abd', fan = (x, y, ang, len, op) => `<path d="M${x} ${y} L${x + len * Math.sin(ang - .38)} ${y - len * Math.cos(ang - .38)} A${len} ${len} 0 0 1 ${x + len * Math.sin(ang + .38)} ${y - len * Math.cos(ang + .38)}Z" fill="#9ecdf7" opacity="${op}"/>`;
      if (abd) o += fan(40, 160, Math.PI / 2, 250, .18) + `<rect x="26" y="140" width="14" height="40" rx="6" fill="${C.soft}"/>` + T(33, 132, 'đầu dò bụng', { s: 10, c: C.mute });
      if (tvs) o += fan(170, 300, 0, 120, .22) + `<g transform="rotate(-10 170 300)"><rect x="162" y="298" width="16" height="44" rx="8" fill="${C.soft}"/></g>` + T(196, 318, 'đầu dò âm đạo', { a: 'start', s: 10, c: C.mute }) + T(196, 331, 'không vào lỗ trong', { a: 'start', s: 10, c: C.mute });
      if (finger) o += `<path d="M150 344 Q160 300 ${os[0]} ${os[1] + 4}" fill="none" stroke="#e9b99a" stroke-width="14" stroke-linecap="round"/><path d="M150 344 Q160 300 ${os[0]} ${os[1] + 4}" fill="none" stroke="#ffdcc4" stroke-width="10" stroke-linecap="round"/><g class="pulse"><ellipse cx="${os[0] - 6}" cy="${os[1] - 14}" rx="22" ry="14" fill="url(#gClot)" opacity=".9"/></g>` + [0, 1, 2, 3].map(i => drop(184 + i * 11, 286 + (i % 2) * 14, .6, 'drip')).join('');
      // khung phải: mẹ & thai → màn hình → kết luận
      o += `<rect x="338" y="24" width="212" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/><rect x="350" y="32" width="188" height="26" rx="13" fill="${C.mint}"/>` + T(444, 49, '🤰 Mẹ & thai: ổn định → khám tiếp', { s: 10.5 });
      o += `<rect x="350" y="68" width="188" height="176" rx="14" fill="${finger ? '#fff1f4' : '#15141f'}"/>`;
      if (tvs || abd) {
        o += `<path d="M444 76 L362 236 A170 170 0 0 0 526 236Z" fill="#26243a"/>`;
        o += `<g opacity="${tvs ? 1 : .35}" ${abd ? 'filter="url(#blr)"' : ''}><path d="M444 96 V220" stroke="#5f5c80" stroke-width="10" stroke-linecap="round"/><path d="M404 150 Q440 168 456 210" fill="none" stroke="#f3b6c8" stroke-width="13" stroke-linecap="round"/></g>`;
        if (tvs) o += `<path d="M424 204 H464" stroke="#ff8fa8" stroke-width="2" stroke-dasharray="4 3"/>` + T(470, 207, 'lỗ trong', { a: 'start', s: 9.5, c: '#ffc2d1' }) + T(400, 142, 'mép nhau', { a: 'end', s: 9.5, c: '#ffc2d1' }) + T(444, 236, 'nhìn rõ mép nhau ↔ lỗ trong', { s: 10, c: '#d8d0f5' });
        if (abd) o += `<circle cx="470" cy="150" r="40" fill="#3a3854" opacity=".95"/>` + T(470, 154, 'đầu thai', { s: 9.5, c: '#bfb6e0' }) + T(444, 236, 'mờ: bàng quang, đầu thai, nhau mặt sau', { s: 9.5, c: '#d8d0f5' });
      } else o += T(444, 130, '⛔', { s: 34 }) + T(444, 170, 'ngón tay qua lỗ trong', { s: 11, c: C.redD }) + T(444, 186, '→ tách thêm diện nhau', { s: 11, c: C.redD }) + T(444, 202, '→ chảy máu ồ ạt', { s: 11, c: C.redD });
      const v = tvs ? ['✓ An toàn, rõ nhất', 'thấy mép nhau & lỗ trong', C.mint] : abd ? ['⚠ Có thể chưa đủ', 'nghi ngờ → làm TVS', C.butter] : ['✗ Không làm', 'khi chưa loại trừ nhau tiền đạo', C.pink];
      o += `<rect x="350" y="254" width="188" height="58" rx="14" fill="${v[2]}"/>` + T(444, 278, v[0], { s: 12.5 }) + T(444, 296, v[1], { s: 10, c: C.mute });
    }
    return o;
  },
  say: (s, sp) => sp.mode === 'dist' ? (s.d <= 0 ? ['ouch', 'Mép nhau chạm/che lỗ trong → nhau tiền đạo (RCOG 2026, sau 16 tuần). Đo bằng siêu âm đầu dò.'] : s.d < 20 ? ['worry', 'Mép nhau cách lỗ trong <20 mm nhưng chưa chạm → nhau bám thấp (low-lying).'] : ['happy', 'Mép nhau ≥20 mm: không còn nhóm bám thấp theo ngưỡng này. Vẫn chưa loại trừ nguyên nhân chảy máu khác.'])
    : sp.mode === 'stretch' ? (s.eff < 20 ? ['happy', 'Kéo thanh để đoạn dưới giãn và cổ tử cung xóa mở: xem diện nhau bám thấp bị kéo tách.'] : ['worry', 'Đoạn dưới giãn → diện nhau bị kéo tách → máu mẹ thoát ra lỗ trong: ra huyết đỏ tươi, thường không đau. Triệu chứng kinh điển không phải điều kiện bắt buộc.'])
      : s.exam === 'finger' ? ['ouch', 'KHÔNG thăm ngón tay khi chưa loại trừ nhau tiền đạo — có thể làm bong thêm, xuất huyết nặng!'] : s.exam === 'tvs' ? ['happy', 'TVS đúng kỹ thuật: đầu dò nằm trong âm đạo, không vào lỗ trong — thấy rõ mép nhau và lỗ trong, an toàn kể cả khi đang ra huyết.'] : ['worry', 'Siêu âm bụng có thể bị bàng quang, đầu thai, nhau mặt sau che → mép nhau mờ. Nghi ngờ thì làm TVS. Mẹ bất ổn thì hồi sức trước.']
});

// ───────── pas: lớp mô & mức xâm lấn
kit('pas', {
  zones: () => ({ dec: [280, 100, 220, 16], villi: [280, 152, 210, 52], peel: [280, 296, 220, 32] }),
  init: () => ({ g: '1', peel: false }),
  ui: () => [{ t: 'seg', k: 'g', opts: [['0', '🌱 Bình thường'], ['1', 'Accreta'], ['2', 'Increta'], ['3', 'Percreta']] }, { t: 'tog', k: 'peel', label: '✋ Cố bóc nhau' }],
  draw: s => {
    const g = +s.g, depth = [0, 26, 86, 150][g], bleed = s.peel && g > 0, lift = s.peel && g === 0 ? -22 : 0;
    let o = `<rect x="20" y="24" width="520" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += `<rect x="30" y="84" width="500" height="26" fill="${C.decid}"/><rect x="30" y="110" width="500" height="96" fill="url(#gMyo)"/><rect x="30" y="206" width="500" height="16" fill="url(#gSer)"/><rect x="30" y="222" width="500" height="26" fill="${C.bladder}"/>`;
    o += T(44, 102, 'màng rụng (nội mạc)', { a: 'start', s: 11 }) + T(44, 162, 'cơ tử cung', { a: 'start', s: 12, c: C.myoD }) + T(44, 218, 'thanh mạc', { a: 'start', s: 10, c: '#7b6bb0' }) + T(44, 240, 'bàng quang', { a: 'start', s: 11, c: '#4d86b3' });
    o += Array.from({ length: 5 }, (_, i) => `<path d="M30 ${122 + i * 17} q125 -9 250 0 t250 0" fill="none" stroke="${C.myoD}" stroke-width="2" opacity=".5"/>`).join('');
    o += `<g transform="translate(0 ${lift})"><rect x="76" y="30" width="408" height="52" rx="24" fill="url(#gPlac)" stroke="${C.placD}" stroke-width="2.5"/>${T(150, 62, 'bánh nhau', { s: 12, c: '#fff' })}` + [150, 280, 410].map((x, i) => `<path d="M${x - 16} 80 L${x - 7} ${84 + depth + (i % 2) * 8} L${x + 2} ${80 + depth * .85} L${x + 9} ${84 + depth} L${x + 16} 80Z" fill="${C.plac}" stroke="${C.placD}" stroke-width="2.4" stroke-linejoin="round"/>`).join('') + `</g>`;
    if (g === 0) o += `<path d="M30 84 H530" stroke="${C.green}" stroke-width="3.4" stroke-dasharray="9 6"/>` + T(520, 78, 'mặt phẳng tách bình thường', { a: 'end', s: 11, c: C.green });
    if (g === 3) o += `<ellipse cx="410" cy="240" rx="34" ry="14" fill="${C.plac}" opacity=".9"/>` + T(410, 270, 'chạm cơ quan kế cận', { s: 10.5, c: C.redD });
    if (bleed) o += [0, 1, 2, 3, 4].map(i => drop(90 + i * 100, 284 + (i % 2) * 14, .8, 'drip')).join('') + `<g class="pulse">${T(280, 312, 'xé mạch → chảy máu khó kiểm soát!', { s: 14, c: C.redD })}</g>`;
    else o += T(280, 290, ['mặt phẳng tách còn → nhau bong êm', 'ACCRETA: gai nhau bám bất thường ở mặt cơ', 'INCRETA: gai nhau xâm nhập vào cơ', 'PERCRETA: xuyên tới/qua thanh mạc'][g], { s: 13, c: g ? C.redD : C.green });
    o += `<g transform="translate(496 292)"><text text-anchor="middle" font-size="26" class="${s.peel ? 'wob' : ''}">✋</text></g>`;
    return o;
  },
  say: s => { const g = +s.g; return s.peel ? (g > 0 ? ['ouch', 'Cố bóc khi nhau xâm lấn → xé mạch, chảy máu khó kiểm soát. Nghi PAS: KHÔNG bóc, lập kế hoạch đa chuyên khoa.'] : ['happy', 'Có mặt phẳng tách bình thường nên nhau bong được.']) : g === 0 ? ['happy', 'Màng rụng bình thường: nhau tách khỏi thành tử cung qua một mặt phẳng.'] : ['worry', ['', 'Accreta: bám bất thường ở mặt cơ.', 'Increta: xâm nhập vào cơ.', 'Percreta: xuyên tới/qua thanh mạc, có thể liên quan cơ quan kế cận.'][g] + ' (mô tả mức xâm lấn)']; }
});

// ───────── abruption: nhau bong non — basic | ctg | scan
kit('abruption', {
  zones: (s, sp) => { const d = s.detach ?? 60, r = 8 + d * .3; return sp.mode === 'scan' ? { signs: [425, 253, 125, 71], labs: [425, 150, 125, 20], scan: [425, 77, 125, 43] } : sp.mode === 'ctg' ? { clot: [236, 126, r + 14, 40 + d * .3], tone: [470, 150, 74, 60], fhr: [470, 70, 74, 40] } : { vessel: [210, 72, 22, 22], clot: [226, 140, r + 16, 22 + d * .55], placenta: [196, 128, 26, 56] }; },
  init: sp => ({ detach: sp.mode === 'scan' ? 70 : 40, concealed: true, scan: false }),
  ui: (s, sp) => sp.mode === 'scan' ? [] : [{ t: 'range', k: 'detach', label: '🧲 Mức nhau bong', min: 5, max: 90, step: 5, unit: '%' }, ...(sp.mode === 'basic' ? [{ t: 'tog', k: 'concealed', label: '🔒 Máu bị giữ kín' }] : [])],
  draw: (s, sp) => {
    const d = s.detach, r = 8 + d * .3, o2 = clamp(100 - d * 1.05, 5, 100);
    let o = `<rect x="20" y="24" width="${sp.mode === 'basic' ? 320 : 280}" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + uterusSag({ x: 150, y: 34, k: .96 });
    // nhau bám thành phải; máu tụ sau nhau đẩy nhau vào trong
    const px = 214 - r * .55; o += `<path d="M${px + 6} 70 Q${px - 12} 130 ${px + 4} 200" fill="none" stroke="${C.placD}" stroke-width="22" stroke-linecap="round"/><path d="M${px + 6} 70 Q${px - 12} 130 ${px + 4} 200" fill="none" stroke="url(#gPlac)" stroke-width="15" stroke-linecap="round"/>`;
    o += `<ellipse cx="${226}" cy="${136}" rx="${r}" ry="${22 + d * .55}" fill="url(#gClot)" stroke="${C.clotD}" stroke-width="2.5"/>` + T(226, 142 + 22 + d * .55 + 12, 'máu tụ sau nhau', { s: 10.5, c: C.clotD });
    o += `<path d="M220 70 l9 -9 l-4 15 l11 -4" fill="none" stroke="${C.red}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` + ZS.pill(124, 66, 'ĐM màng rụng vỡ', { c: C.redD, tc: C.redD });
    o += `<circle cx="120" cy="140" r="30" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/>`;
    if (sp.mode === 'basic') {
      if (!s.concealed) o += [0, 1, 2].map(i => drop(150 + (i - 1) * 10, 296 + i * 10, .6, 'drip')).join(''); else o += T(150, 316, '(ngoài âm đạo có thể ít máu)', { s: 10.5, c: C.mute });
      const P = plot({ x: 368, y: 64, w: 160, h: 100, xr: [0, 100], yr: [0, 100], xt: 5, yt: 2, fx: v => v, fy: () => '', xl: 'mức nhau bong (%)', curves: [{ f: v => 100 - v * 1.05, col: C.green, w: 3.2 }, { f: v => v * 1.05, col: C.clot, w: 3.2 }], vl: [{ x: d }] });
      o += `<rect x="348" y="24" width="202" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + ZS.legend(364, 40, [[C.green, 'Diện trao đổi còn lại'], [C.clot, 'Máu tụ sau nhau']], { w: 172, s: 10 }) + P.svg + bar(366, 214, 164, o2, o2 > 60 ? C.green : o2 > 30 ? C.amber : C.red, 'oxy tới thai') + T(449, 262, d >= 60 ? 'thai thiếu oxy' : d >= 30 ? 'diện trao đổi giảm' : 'còn đủ', { s: 12, c: d >= 60 ? C.redD : C.ink }) + T(449, 296, s.concealed ? 'máu kín: băng có thể ít máu' : 'một phần máu thoát ra ngoài', { s: 10, c: C.mute });
    } else if (sp.mode === 'ctg') {
      o += `<rect x="304" y="24" width="246" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + ZS.ctg(316, 40, 222, { ...ctgOf(d), hh: 100, th: 58 }) + T(427, 262, d > 70 ? 'nhịp chậm kéo dài · tăng trương lực nền' : d > 35 ? 'nhịp giảm muộn lặp lại · cơn co dồn' : 'còn bình thường', { s: 10.5, c: d > 35 ? C.redD : C.green }) + T(427, 280, 'nhận định CẢ tim thai VÀ hoạt động tử cung', { s: 10, c: C.mute });
    } else {
      const sc = s.scan;
      o += (sc ? `<path d="M262 40 L150 220 A150 150 0 0 0 290 150Z" fill="#9ecdf7" opacity=".2"/><rect x="248" y="28" width="30" height="14" rx="6" fill="${C.soft}" transform="rotate(30 263 35)"/>` : '') + `<g transform="translate(300 34)" data-set="!scan"><rect width="250" height="86" rx="16" fill="${sc ? '#1b1a2b' : '#f0edf8'}" stroke="${sc ? '#1b1a2b' : C.soft}" stroke-width="1.4" ${sc ? '' : 'stroke-dasharray="5 4"'}/>${ZS.sw(214, 62, sc, C.cap)}${sc ? `<path d="M20 60 Q60 30 100 52 T180 44 T230 56" fill="none" stroke="#7aaee8" stroke-width="7" stroke-linecap="round" opacity=".7"/>${T(125, 28, '“không thấy khối máu tụ rõ”', { s: 11, c: '#fff' })}${T(125, 78, 'máu tụ mới dễ lẫn với mô nhau', { s: 10, c: '#bfb6e0' })}` : T(118, 50, '👆 bấm để làm siêu âm', { s: 12, c: C.soft })}</g>`;
      o += `<g transform="translate(300 130)"><rect width="250" height="40" rx="14" fill="#fff" stroke="${C.soft}" stroke-width="2"/>${T(125, 25, '🧪 mất máu · công thức máu · đông máu / fibrinogen', { s: 10.5 })}</g>`;
      o += `<g transform="translate(300 182)"><rect width="250" height="142" rx="16" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="2.5"/>${T(125, 22, 'DẤU LÂM SÀNG (vẫn còn)', { s: 11.5 })}${[['😣', 'đau bụng liên tục'], ['🪨', 'tử cung tăng trương lực'], ['🩸', 'ra huyết'], ['📉', 'CTG bất thường']].map(([e, t], i) => `<g transform="translate(${14 + (i % 2) * 120} ${40 + Math.floor(i / 2) * 48})"><text font-size="22" y="18">${e}</text>${T(30, 17, t, { a: 'start', s: 10 })}</g>`).join('')}</g>`;
    }
    return o;
  },
  say: (s, sp) => sp.mode === 'scan' ? (s.scan ? ['worry', 'Siêu âm “sạch” không loại trừ NBN: máu tụ mới dễ lẫn mô nhau. Đau, tử cung cứng, chảy máu, CTG xấu vẫn còn → xử trí theo lâm sàng.'] : ['worry', 'Chẩn đoán NBN chủ yếu dựa LÂM SÀNG. Bấm 📡 xem siêu âm nói gì.'])
    : sp.mode === 'ctg' ? (s.detach < 35 ? ['happy', 'Bong ít: tử cung còn mềm, tim thai còn ổn. Kéo thanh lên.'] : s.detach < 70 ? ['worry', 'Máu tụ kích thích cơ → trương lực nền tăng, cơn co dồn; mất diện trao đổi → nhịp giảm muộn lặp lại.'] : ['ouch', 'Tăng trương lực nền + nhịp chậm kéo dài: thai bị đe dọa nặng. Đừng chờ đủ mọi dấu mới hành động!'])
      : s.concealed ? (s.detach < 30 ? ['happy', 'Bong ít: máu tụ nhỏ, thai còn đủ oxy.'] : ['ouch', 'Máu bị giữ kín sau nhau: băng có thể ít máu mà mẹ mất máu nhiều, thai mất diện trao đổi.']) : ['worry', 'Một phần máu thoát ra ngoài nên dễ thấy hơn — nhưng vẫn không phản ánh hết lượng mất.']
});

// ───────── rupture: vỡ tử cung — wall | obstruct
kit('rupture', {
  zones: (s, sp) => sp.mode === 'obstruct' ? { obstacle: [170, 296, 84, 24], force: [170, 62, 90, 30], lower: [170, 196, 100, 24] } : { scar: [280, 150, 66, 40], tear: [280, 168, 50, 56], belly: [280, 286, 220, 34] },
  init: sp => sp.mode === 'obstruct' ? { force: 35, oxy: false } : { k: 'ok' },
  ui: (s, sp) => sp.mode === 'obstruct' ? [{ t: 'range', k: 'force', label: '💪 Cơn co tử cung (vừa → dồn dập)', min: 0, max: 100, step: 5, unit: '' }, { t: 'tog', k: 'oxy', label: '💉 Tăng oxytocin' }] : [{ t: 'seg', k: 'k', opts: [['ok', '🙂 Nguyên vẹn'], ['crack', '🌱 Nứt cơ · còn thanh mạc'], ['full', '💥 Vỡ toàn bộ bề dày']] }],
  draw: (s, sp) => {
    if (sp.mode === 'obstruct') {
      const eff = Math.min(100, s.force + (s.oxy ? 30 : 0)), w = 24 - eff * .17, ring = 168 - eff * .55, danger = eff >= 70, crit = eff >= 92;
      let o = `<rect x="20" y="24" width="300" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
      o += `<path d="M92 270 Q70 170 104 110 Q132 56 170 52 Q208 56 236 110 Q270 170 248 270" fill="none" stroke="${danger ? C.red : C.myoD}" stroke-width="${w + 7}" stroke-linecap="round" opacity=".5"/><path d="M92 270 Q70 170 104 110 Q132 56 170 52 Q208 56 236 110 Q270 170 248 270" fill="none" stroke="${danger ? '#ffc6cf' : 'url(#gMyo)'}" stroke-width="${w}" stroke-linecap="round"/>`;
      o += `<ellipse cx="170" cy="214" rx="52" ry="58" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/><path d="M60 304 Q96 276 146 288 L196 288 Q244 276 280 304" fill="none" stroke="${C.boneD}" stroke-width="30" stroke-linecap="round"/><path d="M60 304 Q96 276 146 288 L196 288 Q244 276 280 304" fill="none" stroke="url(#gBone)" stroke-width="24" stroke-linecap="round"/>` + T(170, 320, 'đầu không lọt: bất xứng / vật cản', { s: 11 });
      o += `<path d="M84 ${ring} H256" stroke="${C.redD}" stroke-width="${danger ? 6 : 3.4}" stroke-dasharray="${danger ? '' : '6 5'}" stroke-linecap="round"/>` + T(262, ring - 6, 'vòng Bandl', { a: 'end', s: 11, c: C.redD });
      o += `<g class="${eff > 40 ? 'bob' : ''}">` + arrow('M118 70 V108', C.red, 4) + arrow('M222 70 V108', C.red, 4) + `</g>` + (crit ? `<g class="pulse">${T(170, 40, '⚠️ nguy cơ vỡ!', { s: 15, c: C.redD })}</g>` : '');
      const P = plot({ x: 352, y: 44, w: 176, h: 118, xr: [0, 100], yr: [0, 30], xt: 5, yt: 3, fx: v => v, fy: v => v, xl: 'lực co hiệu dụng', curves: [{ f: v => 24 - v * .17, col: C.myoD, w: 3.4, area: true }], pts: [{ x: eff, y: w, col: C.red, r: 7 }], hl: [{ y: 9, c: C.redD, label: 'mỏng nguy hiểm', lpos: 'left' }] });
      return o + `<rect x="334" y="24" width="216" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(442, 40, 'Độ dày đoạn dưới (mm, minh họa)', { s: 10.5 }) + P.svg + T(442, 226, s.oxy ? '💉 oxytocin cộng thêm lực co' : 'cơn co tăng dần', { s: 11, c: s.oxy ? C.redD : C.mute }) + T(442, 244, 'Sửa vật cản — KHÔNG tăng lực co', { s: 11.5, c: C.ink });
    }
    const k = s.k, cx = 446, cy = 172, R = 104;
    let o = `<rect x="20" y="24" width="300" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + uterusSag({ x: 172, y: 34, k: .93 });
    o += `<circle cx="168" cy="132" r="30" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/><path d="M146 116 q22 -16 44 0" fill="none" stroke="${C.skinD}" stroke-width="2" opacity=".6"/>`;
    // vị trí sẹo / vết nứt trên thành trước đoạn dưới
    if (k === 'ok') o += `<path d="M82 196 Q76 214 90 232" fill="none" stroke="${C.lavD}" stroke-width="9" stroke-linecap="round" stroke-dasharray="3 6"/>`;
    if (k === 'crack') o += `<path d="M78 208 Q58 220 80 238" fill="none" stroke="url(#gClot)" stroke-width="14" stroke-linecap="round"/><path d="M92 214 l10 8 l-8 8" fill="none" stroke="${C.redD}" stroke-width="3.5" stroke-linecap="round"/>`;
    if (k === 'full') o += `<path d="M92 204 l14 12 l-12 10 l16 12" fill="none" stroke="${C.red}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="62" cy="228" rx="20" ry="14" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/>` + [0, 1, 2].map(i => drop(48 + i * 16, 258 + (i % 2) * 10, .6, 'drip')).join('');
    o += T(170, 306, k === 'ok' ? 'thành nguyên vẹn · sẹo cũ là chỗ yếu' : k === 'crack' ? 'nứt cơ, thanh mạc còn → máu tụ kín' : 'vỡ toàn bộ → máu & thai vào ổ bụng', { s: 11, c: k === 'full' ? C.redD : C.ink });
    o += `<path d="M96 214 Q230 200 ${cx - R + 6} ${cy}" fill="none" stroke="${C.lavD}" stroke-width="2.4" stroke-dasharray="3 6"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="${C.lavD}" stroke-width="3.5"/><clipPath id="rw"><circle cx="${cx}" cy="${cy}" r="${R - 4}"/></clipPath><g clip-path="url(#rw)">`;
    const X0 = cx - R, W = 2 * R, yEnd = cy - 30, yMy = cy - 12, yS = cy + 58, yS2 = cy + 72;
    const layer = (y0, y1, fill, gap) => gap ? `<path d="M${X0} ${y0} H${cx - 22} L${cx - 12} ${(y0 + y1) / 2} L${cx - 24} ${y1} H${X0}Z M${X0 + W} ${y0} H${cx + 24} L${cx + 12} ${(y0 + y1) / 2} L${cx + 26} ${y1} H${X0 + W}Z" fill="${fill}" stroke="${C.myoD}" stroke-width="1.6" stroke-linejoin="round"/>` : `<rect x="${X0}" y="${y0}" width="${W}" height="${y1 - y0}" fill="${fill}"/>`;
    o += `<rect x="${X0}" y="${cy - 100}" width="${W}" height="${yEnd - (cy - 100)}" fill="#fffafc"/>` + layer(yEnd, yMy, C.decid, k !== 'ok') + layer(yMy, yS, 'url(#gMyo)', k !== 'ok') + (k === 'full' ? layer(yS, yS2, 'url(#gSer)', true) : `<rect x="${X0}" y="${yS}" width="${W}" height="${yS2 - yS}" fill="url(#gSer)" ${k === 'crack' ? 'class="wob"' : ''}/>`);
    o += `<rect x="${X0}" y="${yS2}" width="${W}" height="110" fill="${C.sky}" opacity=".55"/>`;
    if (k === 'ok') o += `<rect x="${cx - 30}" y="${yMy - 2}" width="60" height="${yS - yMy + 4}" rx="10" fill="none" stroke="${C.lavD}" stroke-width="2.5" stroke-dasharray="5 4"/>`;
    if (k === 'crack') o += `<ellipse cx="${cx}" cy="${yS2 + 16}" rx="40" ry="16" fill="url(#gClot)" stroke="${C.clotD}" stroke-width="2.5"/>`;
    if (k === 'full') o += `<g class="bob"><ellipse cx="${cx}" cy="${yS2 + 18}" rx="22" ry="16" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/></g>` + [0, 1, 2].map(i => drop(cx - 36 + i * 36, yS2 + 52, .7, 'drip')).join('');
    o += `</g>` + T(X0 + 20, yEnd - 14, 'buồng tử cung', { a: 'start', s: 10, c: C.mute }) + T(X0 + 14, yEnd + 10, 'nội mạc', { a: 'start', s: 9.5 }) + T(X0 + 14, (yMy + yS) / 2 + 3, 'cơ tử cung', { a: 'start', s: 11.5 }) + T(X0 + 14, yS + 11, 'thanh mạc', { a: 'start', s: 9.5, c: '#7b6bb0' }) + T(cx + R - 18, cy + R - 20, 'ổ bụng', { a: 'end', s: 10.5, c: '#4d86b3' });
    o += T(cx, 322, k === 'ok' ? 'ba lớp còn nguyên' : k === 'crack' ? 'nứt cơ (dehiscence)' : 'vỡ toàn bộ bề dày', { s: 11.5, c: C.mute });
    return o;
  },
  say: (s, sp) => sp.mode === 'obstruct' ? (Math.min(100, s.force + (s.oxy ? 30 : 0)) >= 92 ? ['ouch', 'Cơn co mạnh chống vật cản → đoạn dưới mỏng như giấy → dọa vỡ! Ngừng tăng co, gọi đội, chuẩn bị can thiệp khẩn.'] : s.oxy ? ['worry', 'Tăng oxytocin để “vượt” bất xứng đầu–chậu là SAI: đoạn dưới càng căng, càng gần vỡ.'] : s.force > 55 ? ['worry', 'Cơn co mạnh nhưng đầu không xuống → vòng Bandl dâng cao. Phải sửa vật cản, không tăng lực co.'] : ['happy', 'Kéo “Cơn co” hoặc bật 💉 để xem đoạn dưới mỏng dần khi thai bị cản.'])
    : s.k === 'ok' ? ['happy', 'Ba lớp còn nguyên. Sẹo cũ là chỗ yếu — thử xem nứt cơ và vỡ toàn bộ khác nhau thế nào.'] : s.k === 'crack' ? ['worry', 'Nứt cơ (dehiscence): cơ rách nhưng thanh mạc còn → máu tụ kín, biểu hiện có thể rất kín đáo.'] : ['ouch', 'Vỡ toàn bộ bề dày: mất máu kín vào ổ bụng rất nhanh, thai thiếu oxy. Đừng chờ thấy phần thai mới nghi!']
});

// ───────── scarpick: đường rạch da ≠ đường rạch cơ tử cung
kit('scarpick', {
  zones: () => ({ uterus: [427, 160, 96, 110], baby: [412, 228, 54, 14], wish: [427, 301, 108, 13] }),
  init: () => ({ skin: 'h', ut: 'low', previa: false, rupt: false }),
  ui: () => [{ t: 'seg', k: 'skin', opts: [['h', '➖ Sẹo da ngang'], ['v', '❘ Sẹo da dọc']] }, { t: 'seg', k: 'ut', opts: [['low', '➖ Rạch ngang đoạn dưới'], ['class', '❘ Rạch dọc thân (cổ điển)']] }, { t: 'tog', k: 'previa', label: '🥧 Nhau che lỗ trong' }, { t: 'tog', k: 'rupt', label: '💥 Tiền căn vỡ tử cung' }],
  draw: s => {
    const stop = s.ut === 'class' || s.previa || s.rupt;
    let o = `<rect x="20" y="24" width="190" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/><g transform="translate(115 170)"><path d="M-58 -118 Q-86 0 -62 118 H62 Q86 0 58 -118Z" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/>${s.skin === 'h' ? `<path d="M-44 70 H44" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>` : `<path d="M0 -40 V90" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>`}<circle cy="-14" r="5" fill="#fff" stroke="${C.skinD}" stroke-width="2"/></g>` + T(115, 44, 'sẹo da ngoài', { s: 11.5 });
    o += `<rect x="224" y="130" width="66" height="60" rx="14" fill="#fff" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="6 5"/>` + T(257, 156, '≠', { s: 30, c: C.redD }) + T(257, 178, 'không suy ra', { s: 9.5, c: C.mute });
    o += `<rect x="304" y="24" width="246" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + uterusSag({ x: 410, y: 50, k: .88 });
    o += s.ut === 'low' ? `<path d="M372 230 H448" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>` : `<path d="M410 82 V220" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>`;
    if (s.previa) o += `<path d="M376 224 H444" stroke="${C.plac}" stroke-width="20" stroke-linecap="round"/>`;
    o += T(427, 44, 'đường rạch CƠ TỬ CUNG', { s: 11.5 });
    o += `<circle cx="96" cy="284" r="0"/>` + `<rect x="316" y="288" width="222" height="26" rx="13" fill="${stop ? C.pink : C.mint}" stroke="${stop ? C.pinkD : C.mintD}" stroke-width="2.5"/>` + T(427, 306, stop ? '⛔ có điểm chặn quan trọng' : '✅ điển hình thuận lợi', { s: 12 });
    return o;
  },
  say: s => s.rupt || s.ut === 'class' || s.previa ? ['ouch', (s.rupt ? 'Tiền căn vỡ tử cung' : s.ut === 'class' ? 'Sẹo dọc thân/cổ điển' : 'Nhau che lỗ trong') + ' là điểm chặn quan trọng đối với sinh đường âm đạo.'] : ['happy', 'Đổi sẹo da bao nhiêu lần, kết luận KHÔNG đổi: phải xem biên bản mổ để biết đường rạch cơ tử cung. Ngang đoạn dưới + không chống chỉ định = điển hình thuận lợi.']
});

// ───────── riskntd: sẹo cũ + nhau thấp mặt trước → nghĩ PAS
kit('riskntd', {
  zones: () => ({ history: [120, 180, 64, 90], factors: [330, 300, 130, 22], pasflag: [440, 168, 100, 100] }),
  init: () => ({ pl: 'post', scar: false }),
  ui: () => [{ t: 'seg', k: 'pl', opts: [['post', '🍑 Nhau thấp mặt SAU'], ['ant', '🍑 Nhau thấp mặt TRƯỚC']] }, { t: 'tog', k: 'scar', label: '✂️ Mổ lấy thai / phẫu thuật tử cung cũ' }],
  draw: s => {
    const pas = s.pl === 'ant' && s.scar, ant = s.pl === 'ant';
    let o = `<rect x="20" y="24" width="250" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + uterusSag({ x: 150, y: 36, k: .98 });
    const wx = ant ? 54 : 246, p = `M${wx + (ant ? 6 : -6)} 180 Q${wx + (ant ? -8 : 8)} 222 ${wx + (ant ? 22 : -22)} 252`; o += `<path d="${p}" fill="none" stroke="${C.placD}" stroke-width="22" stroke-linecap="round"/><path d="${p}" fill="none" stroke="url(#gPlac)" stroke-width="15" stroke-linecap="round"/>`;
    if (s.scar) o += `<path d="M52 232 H98" stroke="${C.redD}" stroke-width="5" stroke-linecap="round"/>` + T(70, 280, 'sẹo mặt trước', { s: 10, c: C.redD });
    o += `<circle cx="150" cy="132" r="30" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/>`;
    o += `<path d="M70 236 L336 196" stroke="${C.mute}" stroke-width="2" stroke-dasharray="3 6"/><circle cx="440" cy="168" r="100" fill="#fff" stroke="${C.lavD}" stroke-width="3"/><clipPath id="mz"><circle cx="440" cy="168" r="96"/></clipPath><g clip-path="url(#mz)"><rect x="340" y="68" width="200" height="14" fill="${C.ser}"/><rect x="340" y="82" width="200" height="30" fill="${C.decid}"/><rect x="340" y="112" width="200" height="${pas ? 26 : 56}" fill="${pas ? '#fbe0cf' : 'url(#gMyo)'}"/><rect x="340" y="${pas ? 138 : 168}" width="200" height="${pas ? 80 : 50}" fill="url(#gMyo)" opacity="${pas ? 1 : .7}"/>${s.scar ? `<rect x="426" y="112" width="30" height="106" fill="${C.lav}"/><path d="M427 114 l10 24 l-8 24 l10 24" fill="none" stroke="${C.redD}" stroke-width="3.2"/>` : ''}<rect x="340" y="218" width="200" height="16" fill="url(#gSer)"/><rect x="350" y="46" width="180" height="36" rx="16" fill="url(#gPlac)"/>${[400, 440, 480].map((x, i) => `<path d="M${x - 10} 82 L${x - 4} ${pas ? 82 + 100 + (i % 2) * 14 : 98 + (i % 2) * 8} L${x + 4} ${pas ? 150 : 96} L${x + 10} 82Z" fill="${C.plac}" stroke="${C.placD}" stroke-width="2.2"/>`).join('')}</g>` + T(440, 288, pas ? '⚠️ gai nhau bám sâu qua sẹo' : 'màng rụng còn tốt', { s: 11.5, c: pas ? C.redD : C.green });
    if (pas) o += `<g class="pulse">${T(440, 36, 'NGHĨ ĐẾN PAS', { s: 15, c: C.redD })}</g>`;
    o += T(150, 316, 'tử cung nhìn dọc', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.pl === 'ant' && s.scar ? ['ouch', 'Nhau thấp mặt trước nằm trên sẹo mổ cũ → gai nhau dễ bám/xâm lấn sâu (PAS). Khảo sát PAS có chủ đích & chuẩn bị đa chuyên khoa.'] : s.scar ? ['worry', 'Có sẹo cũ nhưng nhau không nằm trên sẹo: vẫn hỏi biên bản mổ, nguy cơ PAS thấp hơn.'] : ['happy', 'Hỏi nguy cơ để chuẩn bị đúng: tiền căn nhau thấp, mổ/can thiệp tử cung. Không đủ yếu tố vẫn không loại trừ NTĐ.']
});

// ───────── riskabr: ba hướng dẫn đến nhau bong non
const RA = { vasc: ['Mạch máu', 'THA / tiền sản giật / tiền căn NBN: động mạch xoắn tổn thương, dễ vỡ → máu tụ sau nhau.'], inflam: ['Viêm · ối vỡ', 'Viêm màng ối, ối vỡ, bệnh lý nhau: màng rụng viêm, yếu → nhau dễ bong.'], mech: ['Cơ học', 'Chấn thương hoặc thay đổi thể tích đột ngột: thành tử cung xê dịch, nhau không xê dịch theo → bị giật tách.'] };
kit('riskabr', {
  zones: () => ({ vasc: [100, 160, 78, 120], inflam: [280, 160, 78, 120], mech: [460, 160, 78, 120] }),
  init: () => ({ k: '' }),
  ui: () => [],
  draw: s => {
    // mỗi thẻ: lát cắt nhau – màng rụng – cơ tử cung; bật cơ chế → máu tụ tách nhau khỏi màng rụng
    const cell = (x, k, ic, extra, cap0, cap1) => { const on = s.k === k, lift = on ? 10 : 0, sh = on && k === 'mech' ? -10 : 0;
      let g = `<g transform="translate(${x} 0)" data-set="k=${k}"><rect x="-84" y="34" width="168" height="260" rx="20" fill="${on ? '#fff5f8' : '#fff'}" stroke="${on ? C.redD : C.grid}" stroke-width="1.4" ${on ? '' : 'stroke-dasharray="5 4"'}/>${T(0, 60, ic + ' ' + RA[k][0], { s: 13.5 })}`;
      g += `<g transform="translate(${sh} 0)"><rect x="-64" y="122" width="128" height="30" fill="${k === 'inflam' && on ? '#f6c9d5' : C.decid}"/><rect x="-64" y="152" width="128" height="72" fill="url(#gMyo)"/><rect x="-64" y="224" width="128" height="8" fill="${C.ser}"/>`;
      g += `<path d="M0 232 C-8 212 8 196 0 180 C-8 166 8 150 0 ${126}" fill="none" stroke="${C.art}" stroke-width="${on && k === 'vasc' ? 3 : 6}" stroke-linecap="round" ${on && k === 'vasc' ? 'stroke-dasharray="6 5"' : ''}/>${extra}</g>`;
      if (on) g += `<ellipse cx="0" cy="${120 - lift / 2}" rx="34" ry="${8 + lift / 2}" fill="url(#gClot)"/>`;
      g += `<rect x="-64" y="${88 - lift}" width="128" height="32" rx="8" fill="url(#gPlac)"/>` + T(0, 108 - lift, 'nhau', { s: 10, c: '#fff' });
      if (x === 100) g += T(-60, 141, 'màng rụng', { a: 'start', s: 9, c: C.mute }) + T(-60, 200, 'cơ tử cung', { a: 'start', s: 9, c: C.mute });
      return g + T(0, 262, on ? cap1 : cap0, { s: 10, c: on ? C.redD : C.mute }) + (on ? T(0, 278, 'máu tụ sau nhau → nhau bong', { s: 9.5, c: C.clotD }) : T(0, 278, '👆 bấm để xem', { s: 9.5, c: C.soft })) + `</g>`; };
    let o = cell(100, 'vasc', '🩸', s.k === 'vasc' ? `<path d="M-6 132 l12 -6 l-4 10" fill="none" stroke="${C.redD}" stroke-width="2"/>` : '', 'THA · TSG · tiền căn NBN', 'ĐM xoắn tổn thương → vỡ');
    o += cell(280, 'inflam', '🦠', Array.from({ length: s.k === 'inflam' ? 10 : 2 }, (_, i) => `<circle cx="${-50 + (i * 23) % 100}" cy="${130 + (i * 7) % 18}" r="4" fill="${C.butter}" stroke="#c99a1a" stroke-width="1.2"/>`).join(''), 'viêm · ối vỡ · bệnh lý nhau', 'màng rụng viêm, yếu');
    o += cell(460, 'mech', '💥', s.k === 'mech' ? arrow('M40 190 H8', C.redD, 3) : '', 'chấn thương · đổi thể tích', 'thành xê dịch, nhau thì không') + (s.k === 'mech' ? arrow('M500 104 H530', C.mute, 3) : '');
    o += `<rect x="30" y="304" width="500" height="26" rx="13" fill="${C.butter}" stroke="${C.butterD}" stroke-width="2.5"/>` + T(280, 322, 'không có yếu tố nguy cơ kinh điển ≠ loại trừ NBN đang biểu hiện', { s: 11.5 });
    return o;
  },
  say: s => s.k ? ['happy', RA[s.k][1]] : ['happy', 'Bấm một thẻ: mỗi nhóm nguy cơ làm nhau bong theo một cơ chế khác nhau.']
});
})();
