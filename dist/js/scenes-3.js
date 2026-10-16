'use strict';
/* Họ 3: đông máu (TXA, DIC, vòng xoắn), đồng hồ cấp cứu (song song, bundle, đánh giá lại), lưu đồ quyết định, đo máu, giai đoạn III, rốn, thuốc. */
(() => {
const ZS = window.ZS, { C, T, kit, plot, clamp, arrow, bar, lab, drop, pill } = ZS;
const fmt = v => String(v).replace('.', ',');

// ───────── coag: TXA bảo vệ lưới fibrin · DIC tiêu hao yếu tố
kit('coag', {
  zones: (s, sp) => sp.mode === 'dic' ? { trig: [74, 84, 58, 40], thrombi: [190, 150, 70, 36], bleed: [190, 224, 70, 34] } : { plasmin: [92, 96, 52, 36], net: [160, 168, 40, 26], when: [172, 296, 120, 22] },
  init: sp => sp.mode === 'dic' ? { act: 40 } : { txa: false, t: 60 },
  ui: (s, sp) => sp.mode === 'dic' ? [{ t: 'range', k: 'act', label: '⚡ Mức kích hoạt đông máu lan tỏa', min: 0, max: 100, step: 10, unit: '%' }]
    : [{ t: 'tog', k: 'txa', label: '💊 Tranexamic acid (TXA)' }, { t: 'range', k: 't', label: '⏱️ Dùng TXA sau sinh', min: 0, max: 240, step: 15, unit: ' phút' }],
  draw: (s, sp) => {
    const net = (cx, cy, r, n, col, sw) => { let p = ''; for (let i = 0; i < n; i++) { const a = i / n * Math.PI; p += `<path d="M${cx - r * Math.cos(a)} ${cy - r * Math.sin(a)} L${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`; } return p + `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * .7}" fill="none" stroke="${col}" stroke-width="${sw}" opacity=".6"/>`; };
    if (sp.mode === 'dic') {
      const a = s.act / 100, plt = 100 * (1 - .85 * a), fib = 4.5 * (1 - .8 * a), fac = 100 * (1 - .9 * a);
      let o = `<rect x="20" y="24" width="300" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
      o += `<g transform="translate(74 84)"><path d="M-44 -6 Q-40 -34 0 -34 Q40 -34 44 -6 Q40 28 0 30 Q-40 28 -44 -6Z" fill="url(#gPlac)" stroke="${C.placD}" stroke-width="2.5"/>${T(0, 0, 'nhau', { s: 12, c: '#fff' })}</g>` + T(74, 138, 'mô nhau · màng rụng', { s: 10, c: C.mute }) + arrow('M120 84 H176', C.red, 3.5) + T(148, 74, 'TF', { s: 11.5, c: C.redD });
      o += `<rect x="40" y="176" width="264" height="54" rx="27" fill="#ffd7e1" stroke="${C.pinkD}" stroke-width="3"/>`;
      const nc = Math.round(a * 5); for (let i = 0; i < nc; i++) o += `<ellipse cx="${100 + i * 38}" cy="203" rx="14" ry="9" fill="url(#gClot)" stroke="${C.clotD}" stroke-width="2"/>`;
      const np = Math.max(1, Math.round(plt / 12)); for (let i = 0; i < np; i++) o += `<circle cx="${60 + (i * 27) % 232}" cy="${188 + (i % 3) * 14}" r="4.5" fill="${C.butter}" stroke="${C.butterD}" stroke-width="2"/>`;
      o += ZS.pill(172, 250, 'vi huyết khối · tiểu cầu bị tiêu hao', { w: 232, s: 10.5 });
      const nb = Math.round(a * 4); for (let i = 0; i < nb; i++) o += drop(150 + i * 22, 168, .65, 'drip');
      const P = plot({ x: 352, y: 50, w: 188, h: 140, xr: [0, 100], yr: [0, 100], xt: 4, yt: 4, fx: v => v, fy: v => v, xl: 'mức kích hoạt đông (%)', curves: [{ f: v => 100 * (1 - .85 * v / 100), col: C.amber, w: 3 }, { f: v => 100 * (1 - .8 * v / 100), col: C.cap, w: 3 }, { f: v => 100 * (1 - .9 * v / 100), col: C.ven, w: 3 }], vl: [{ x: s.act }], hl: [{ y: 44, c: C.redD }] });
      o += `<rect x="334" y="24" width="214" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(441, 42, 'Còn lại trong máu (%)', { s: 11.5 }) + P.svg;
      o += T(360, 146, 'fibrinogen 2 g/L', { a: 'start', s: 9.5, c: C.redD }) + ZS.legend(352, 236, [[C.amber, 'Tiểu cầu'], [C.cap, 'Fibrinogen'], [C.ven, 'Yếu tố đông máu']], { w: 190, s: 10 });
      if (sp.couv) {
        o += ZS.uterusSag({ x: 262, y: 38, k: .36 });
        const blot = [[40, 112, 10, 26], [220, 104, 10, 24], [86, 26, 22, 9], [176, 28, 20, 8], [130, 20, 20, 7], [48, 168, 9, 18], [212, 164, 9, 16], [70, 210, 11, 13], [194, 208, 10, 12]];
        o += `<g transform="translate(262 38) scale(.36) translate(-130 0)" opacity="${(.15 + .85 * a).toFixed(2)}">` + blot.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#7d2f78" opacity=".72"/>`).join('') + `</g>`;
        o += T(262, 148, 'tử cung Couvelaire', { s: 10, c: '#7d2f78' }) + T(262, 161, 'vết bầm tím trên thanh mạc', { s: 9.5, c: C.mute });
      }
      return o;
    }
    const strands = s.txa ? 9 : 4, lys = s.txa ? .15 : .8, inWin = s.t <= 180;
    let o = `<rect x="20" y="24" width="300" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += `<rect x="36" y="150" width="268" height="86" rx="43" fill="#ffd7e1" stroke="${C.pinkD}" stroke-width="3"/><rect x="132" y="140" width="76" height="22" fill="#fff"/><path d="M132 150 V164 M208 150 V164" stroke="${C.redD}" stroke-width="4" stroke-linecap="round"/>` + net(170, 158, 36, strands, s.txa ? '#c9961a' : C.butterD, s.txa ? 4 : 2.4);
    o += Array.from({ length: 5 }, (_, i) => `<ellipse cx="${70 + i * 50}" cy="${196 + (i % 2) * 20}" rx="14" ry="8" fill="${C.red}" stroke="${C.redD}" stroke-width="2"/>`).join('');
    // plasmin
    const px = s.txa ? 70 : 118, py = s.txa ? 88 : 108;
    o += `<g class="${s.txa ? '' : 'wob'}"><circle cx="${px}" cy="${py}" r="24" fill="#d9c2ff" stroke="${C.lavD}" stroke-width="3"/><path d="M${px - 24} ${py} l-9 -5 l4 5 l-4 5Z" fill="${C.lavD}"/>${T(px, py + 4, 'plasmin', { s: 10 })}</g>`;
    if (s.txa) o += `<g class="hop"><circle cx="120" cy="118" r="20" fill="${C.butter}" stroke="${C.butterD}" stroke-width="3"/>${T(120, 122, 'TXA', { s: 11.5 })}<path d="M102 100 L138 136 M138 100 L102 136" stroke="${C.redD}" stroke-width="3.5" stroke-linecap="round" opacity=".85"/></g>`;
    else o += arrow('M140 124 L162 148', C.red, 3.5);
    if (!s.txa) for (let i = 0; i < 2; i++) o += drop(150 + i * 38, 250, .65, 'drip');
    o += T(170, 254, s.txa ? 'lưới fibrin được giữ bền' : 'lưới fibrin bị tiêu → rỉ máu', { s: 11, c: s.txa ? C.green : C.redD });
    const S = t => (1 - Math.exp(-t / .35)) * (1 - lys * (1 - Math.exp(-t / 1.6)));
    const P = plot({ x: 352, y: 50, w: 188, h: 126, xr: [0, 6], yr: [0, 1], xt: 3, yt: 2, fx: v => v + 'h', fy: v => v === 0 ? '0' : v === 1 ? 'max' : '', xl: 'giờ sau chảy máu', curves: [{ f: t => (1 - Math.exp(-t / .35)) * (1 - .8 * (1 - Math.exp(-t / 1.6))), col: C.grid, w: 2, dash: '4 4' }, { f: S, col: s.txa ? C.green : C.red, w: 3.6, area: true }] });
    o += `<rect x="334" y="24" width="214" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(441, 42, 'Độ bền cục máu theo thời gian', { s: 11.5 }) + P.svg;
    o += `<g transform="translate(350 214)">${T(0, 0, 'Liều: 1 g IV trong 10 phút', { a: 'start', s: 11 })}${T(0, 15, '+1 g nếu còn chảy sau 30′ / chảy lại ≤24 h', { a: 'start', s: 9.5, c: C.mute })}</g>`;
    // cửa sổ 3 giờ từ lúc sinh
    const bx = 36, bw = 268, X = m => bx + m / 240 * bw;
    o += `<rect x="${bx}" y="286" width="${bw}" height="14" rx="7" fill="#f4f0fb"/><rect x="${bx}" y="286" width="${X(180) - bx}" height="14" rx="7" fill="${C.mint}"/><rect x="${X(180)}" y="286" width="${bx + bw - X(180)}" height="14" rx="7" fill="${C.pink}"/>` + T(X(90), 297, 'trong 3 giờ từ lúc sinh', { s: 9.5 }) + T(X(210), 297, 'trễ', { s: 9.5, c: C.redD });
    o += `<g transform="translate(${X(s.t)} 292)"><path d="M0 -12 l-7 -9 h14Z" fill="${inWin ? C.green : C.red}"/></g>` + T(170, 322, inWin ? '✓ đang trong cửa sổ (tính từ lúc SINH)' : '⚠ ngoài cửa sổ 3 giờ từ lúc sinh', { s: 11.5, c: inWin ? C.green : C.redD });
    return o;
  },
  say: (s, sp) => sp.mode === 'dic' ? (s.act > 60 ? ['ouch', 'Đông lan tỏa tiêu hao tiểu cầu, fibrinogen, yếu tố → nút cầm máu mất bền → chảy máu lan tỏa. Bù thành phần còn thiếu; heparin KHÔNG phải thuốc thường quy.'] : s.act > 30 ? ['worry', 'Tissue factor kích hoạt đông, vi huyết khối hình thành và tiêu hao tiểu cầu/yếu tố.'] : ['happy', 'Kích hoạt nhẹ: vẫn còn đủ yếu tố để cầm máu.'])
    : s.txa ? ['happy', 'TXA chặn plasmin → lưới fibrin bền hơn (đường xanh). Vẫn phải sửa nguồn chảy và hồi sức!' + (s.t > 180 ? ' Nhưng đã quá 3 giờ từ lúc sinh.' : '')] : ['sad', 'Plasmin tiêu fibrin: cục máu yếu dần theo thời gian (đường đỏ). Bật TXA để so sánh.']
});

// ───────── triad: vòng xoắn tử thần
kit('triad', {
  zones: () => ({ loss: [90, 196, 60, 40], trio: [210, 98, 130, 44], loop: [210, 170, 44, 50] }),
  init: () => ({ fluid: false, warm: false, prod: false }),
  ui: () => [{ t: 'tog', k: 'fluid', label: '💧 Truyền nhiều dịch (không có máu)' }, { t: 'tog', k: 'warm', label: '🔥 Giữ ấm' }, { t: 'tog', k: 'prod', label: '🩸 Bù máu & yếu tố đông' }],
  draw: s => {
    const dil = s.fluid && !s.prod ? 1 : s.fluid ? .35 : 0, cold = s.warm ? 0 : 1, acid = s.prod ? .35 : 1, act = t => clamp(100 - t * (4 + dil * 7 + cold * 3 + acid * 3) + (s.prod ? 22 * (1 - Math.exp(-t / 6)) : 0), 8, 100);
    const f = t => act(t), loss = t => clamp(8 * t * (2 - f(t) / 100 * 1.5) / 10, 0, 100);
    let o = `<rect x="20" y="24" width="320" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    const bad = dil || cold || acid > .5, col = bad ? C.red : C.green, mk = bad ? 'arR' : 'arG', dur = (2.4 - (dil + cold * .5 + acid * .5) * .7).toFixed(2);
    const node = (x, y, w, t1, t2, fill) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-22" width="${w}" height="44" rx="16" fill="${fill}" stroke="${C.soft}" stroke-width="2"/>${T(0, t2 ? -3 : 4, t1, { s: 11 })}${t2 ? T(0, 13, t2, { s: 10, c: C.mute }) : ''}</g>`;
    o += node(180, 62, 200, '🩸 Mất máu', 'giảm tưới máu mô', C.pink) + node(268, 190, 130, '⛔ Máu khó đông', 'mất thêm máu', C.lav) + node(92, 190, 150, '🥶 Hạ nhiệt · toan', 'thiếu yếu tố đông', C.butter);
    const arc = d => `<path d="${d}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="3 9" class="flow" style="animation-duration:${dur}s" marker-end="url(#${mk})"/>`;
    o += arc('M246 86 Q300 120 290 164') + arc('M202 190 H168') + arc('M58 166 Q60 110 118 84') + T(180, 130, bad ? 'VÒNG XOẮN' : 'đã chặn', { s: 14, c: bad ? C.redD : C.green });
    // mạch máu mini: yếu tố đông ⭐ & hồng cầu
    o += `<rect x="36" y="236" width="288" height="18" rx="9" fill="#ffd7e1"/>` + Array.from({ length: Math.max(1, Math.round(f(8) / 14)) }, (_, i) => `<text x="${50 + i * 36}" y="251" font-size="13" text-anchor="middle">⭐</text>`).join('') + (s.fluid ? T(180, 230, '💧 dịch pha loãng yếu tố đông ⭐', { s: 10.5, c: '#4d86b3' }) : T(180, 230, 'yếu tố đông máu ⭐ trong mạch', { s: 10.5, c: C.mute }));
    const P = plot({ x: 372, y: 50, w: 166, h: 84, xr: [0, 20], yr: [0, 100], xt: 4, yt: 2, fx: v => v + '′', fy: v => v, curves: [{ f, col: C.cap, w: 3.2, area: true }], hl: [{ y: 40, c: C.redD }] });
    const P2 = plot({ x: 372, y: 170, w: 166, h: 84, xr: [0, 20], yr: [0, 100], xt: 4, yt: 2, fx: v => v + '′', fy: v => v, curves: [{ f: loss, col: C.red, w: 3.2 }], xl: 'phút' });
    o += `<rect x="354" y="24" width="200" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(454, 42, 'hoạt tính đông máu (%)', { s: 11 }) + P.svg + T(454, 164, 'mất máu tích lũy (tương đối)', { s: 11 }) + P2.svg;
    return o + T(454, 288, 'đường minh họa, không phải số đo', { s: 9.5, c: C.mute });
  },
  say: s => s.fluid && !s.prod ? ['ouch', 'Dịch không mang oxy và không có yếu tố đông: đổ nhiều → máu loãng, hoạt tính đông tụt nhanh → mất máu thêm. Dịch chỉ là cầu nối!'] : s.prod && s.warm ? ['happy', 'Bù đúng thành phần + giữ ấm → vòng xoắn bị chặn, hoạt tính đông máu được giữ.'] : ['worry', 'Mất máu → thiếu tưới máu → toan, hạ nhiệt, thiếu yếu tố → máu khó đông → mất thêm máu. Bật từng nút để phá vòng.']
});

// ───────── timeline: đồng hồ cấp cứu — song song, bundle, đánh giá lại
const sim = (f, n = 40) => f;
kit('timeline', {
  zones: (s, sp) => sp.mode === 'bundle' ? { e1: [90, 120, 60, 30], e2: [90, 176, 60, 30], e3: [90, 232, 60, 30] } : sp.mode === 'reassess' ? { q1: [90, 100, 60, 30], q2: [90, 170, 60, 30], q3: [90, 240, 60, 30] } : { call: [90, 100, 60, 30], iv: [90, 170, 60, 30], src: [90, 240, 60, 30] },
  init: sp => sp.mode === 'bundle' ? { cause: 'tone', par: true, e1: true, e2: true, e3: true } : sp.mode === 'reassess' ? { sc: 'hidden', c1: false, c2: false, c3: false } : { a: true, b: false },
  ui: (s, sp) => sp.mode === 'bundle' ? [{ t: 'seg', k: 'cause', opts: [['tone', '💪 Tone'], ['trauma', '🩹 Trauma'], ['tissue', '🧩 Tissue']] }, { t: 'tog', k: 'par', label: '⚡ Chạy SONG SONG ngay' }]
    : sp.mode === 'reassess' ? [{ t: 'seg', k: 'sc', opts: [['ok', '✅ Cầm máu tốt'], ['hidden', '⚠️ Máu ngoài ít lại, bụng căng']] }]
    : [],
  draw: (s, sp) => {
    let o = '';
    if (sp.mode === 'bundle') {
      const base = { tone: [.25, 1, .85, .9, .9, .85], trauma: [1, 1, .85, 1, .15, .85], tissue: [.8, 1, .85, 1, .2, .85] }[s.cause], eff = (t) => { let r = 100; if (s.e1 && (s.par || t >= 0)) r *= base[0]; if (s.e2 && (s.par || t >= 15)) r *= base[2]; if (s.e3 && (s.par || t >= 30)) r *= base[4]; return r; };
      const cum = t => { let a = 0; for (let u = 0; u < t; u += .5) { let r = 100; if (s.e1) r *= base[0]; if (s.e2 && (s.par || u >= 15)) r *= base[2]; if (s.e3 && (s.par || u >= 30)) r *= base[4]; if (!s.par && s.e1) { r = 100 * base[0] * ((s.e2 && u >= 15) ? base[2] : 1) * ((s.e3 && u >= 30) ? base[4] : 1); } a += r * .5 / 100; } return a; };
      const none = t => t, cur = t => { let a = 0; for (let u = 0; u < t; u += .5) { let r = 100; if (s.e1 && (s.par || u >= 0)) r *= base[0]; if (s.e2 && (s.par || u >= 15)) r *= base[2]; if (s.e3 && (s.par || u >= 30)) r *= base[4]; a += r * .5 / 100; } return a; };
      const P = plot({ x: 250, y: 44, w: 296, h: 180, xr: [0, 40], yr: [0, 40], xt: 4, yt: 4, fx: v => v + '′', fy: v => v, xl: 'phút kể từ lúc chẩn đoán', curves: [{ f: none, col: C.grid, w: 2.4, dash: '4 4' }, { f: cur, col: C.red, w: 3.6, area: true }], vl: [{ x: 15, c: C.grid, dash: true, w: 1.6 }, { x: 30, c: C.grid, dash: true, w: 1.6 }] });
      o += `<rect x="20" y="24" width="526" height="240" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + P.svg + ZS.legend(256, 36, [[C.red, 'Mất máu tích lũy'], [C.grid, 'nếu không can thiệp', '4 4']], { w: 290 }) + T(130, 38, '👆 bấm thẻ để bật / tắt', { s: 10, c: C.mute });
      const items = [['e1', '💆 Xoa tử cung + thuốc co', '→ chỉ hiệu quả nếu đờ (Tone)'], ['e2', '💊 TXA + 💧 dịch IV', 'bảo vệ fibrin · hồi sức'], ['e3', '🔍 Khám nguồn + leo thang', 'tìm Trauma/Tissue, can thiệp']];
      o += items.map(([k, a, b], i) => `<g transform="translate(34 ${96 + i * 56})" data-set="!${k}" opacity="${s[k] ? 1 : .6}"><rect width="196" height="46" rx="14" fill="${s[k] ? [C.pink, C.butter, C.mint][i] : '#f4f0fb'}" stroke="${C.soft}" stroke-width="2"/>${T(10, 19, a, { a: 'start', s: 11 })}${T(10, 35, b, { a: 'start', s: 9.5, c: C.mute })}${ZS.sw(162, 28, s[k], [C.pinkD, C.butterD, C.mintD][i])}</g>`).join('') + T(130, 86, `Nguyên nhân: ${{ tone: 'ĐỜ TỬ CUNG', trauma: 'RÁCH ĐƯỜNG SINH DỤC', tissue: 'SÓT NHAU' }[s.cause]}`, { s: 11.5, c: C.redD });
      o += `<g transform="translate(250 240)"><rect width="296" height="16" rx="8" fill="#f4f0fb"/>${[['e1', 0, C.pinkD], ['e2', s.par ? 0 : 15, C.butterD], ['e3', s.par ? 0 : 30, C.mintD]].map(([k, t0, col], i) => s[k] ? `<rect x="${t0 / 40 * 296}" y="${i * 5}" width="${296 - t0 / 40 * 296}" height="5" rx="2.5" fill="${col}"/>` : '').join('')}</g>`;
      return o + T(398, 288, s.par ? 'Bundle: tất cả chạy cùng lúc (mục tiêu ≤15 phút)' : 'Tuần tự: chờ từng bước thất bại mới làm bước kế', { s: 11.5, c: s.par ? C.green : C.redD });
    }
    if (sp.mode === 'reassess') {
      const hid = s.sc === 'hidden', ext = t => hid ? 30 * Math.exp(-t / 6) : 30 * Math.exp(-t / 4), hr = t => hid ? 100 + 2.2 * t : 112 - 22 * (1 - Math.exp(-t / 6)), sbp = t => hid ? 108 - 1.4 * t : 92 + 22 * (1 - Math.exp(-t / 6)), girth = t => hid ? 100 + 1.8 * t : 100;
      const P1 = plot({ x: 250, y: 46, w: 296, h: 84, xr: [0, 20], yr: [60, 150], xt: 4, yt: 3, fx: v => v + '′', fy: v => Math.round(v), curves: [{ f: hr, col: C.red, w: 3.2 }, { f: sbp, col: C.cap, w: 3.2 }, { f: v => (hid ? 100 + 0 : 100), col: 'none', w: 0 }] });
      const P2 = plot({ x: 250, y: 168, w: 296, h: 68, xr: [0, 20], yr: [0, 40], xt: 4, yt: 2, fx: v => v + '′', fy: v => v, xl: 'phút sau can thiệp', curves: [{ f: ext, col: C.amber, w: 3.2 }, { f: v => hid ? (girth(v) - 100) * 1.1 : 0, col: C.clot, w: 3.2 }] });
      o += `<rect x="20" y="24" width="526" height="240" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + P1.svg + ZS.legend(256, 36, [[C.red, 'Nhịp tim'], [C.cap, 'HA tâm thu']]) + P2.svg + ZS.legend(256, 158, [[C.amber, 'Máu thấy ngoài'], [C.clot, 'Chu vi bụng tăng']]);
      const rows = [['c1', '🩸 Máu còn chảy?', hid ? 'bụng căng, đau tăng → CÒN (kín)' : 'ngưng chảy ✓', !hid], ['c2', '💗 Tưới máu / tri giác', hid ? 'lạnh, lơ mơ ✗' : 'cải thiện ✓', !hid], ['c3', '🧪 Đông máu / cơ quan', hid ? 'xét nghiệm xấu ✗' : 'hồi phục ✓', !hid]];
      o += rows.map(([k, a, b, ok], i) => `<g transform="translate(34 ${60 + i * 66})" data-set="!${k}"><rect width="196" height="54" rx="14" fill="${s[k] ? (ok ? C.mint : C.pink) : '#f4f0fb'}" stroke="${C.soft}" stroke-width="2"/>${T(10, 22, a, { a: 'start', s: 11.5 })}${T(10, 41, s[k] ? b : 'bấm để kiểm tra', { a: 'start', s: 10.5, c: s[k] ? (ok ? C.green : C.redD) : C.mute })}${ZS.sw(162, 8, s[k], ok ? C.green : C.redD)}</g>`).join('') + T(132, 52, '👆 bấm từng câu hỏi để kiểm tra', { s: 10, c: C.mute });
      return o + T(398, 288, hid ? 'Máu ngoài giảm nhưng tim vẫn nhanh, HA tụt → tìm máu kín!' : 'Cả 3 câu hỏi đều ổn → hồi sức có hiệu quả', { s: 11.5, c: hid ? C.redD : C.green });
    }
    // resus song song
    const loss = t => { let a = 0; for (let u = 0; u < t; u += .5) a += (s.b && u >= 3 ? .15 : 1.8) * .5; return Math.min(45, a); };
    const perf = t => clamp(100 - 1.6 * loss(t) * (s.a ? .6 : 1.15) + (s.a ? 20 * (1 - Math.exp(-t / 5)) : 0) - (s.b ? 0 : 0) - (!s.a && s.b ? Math.min(14, t * .9) : 0) - (!s.a && !s.b ? t * .6 : 0), 5, 100);
    const P = plot({ x: 250, y: 44, w: 296, h: 120, xr: [0, 30], yr: [0, 100], xt: 6, yt: 4, fx: v => v + '′', fy: v => v, curves: [{ f: perf, col: C.green, w: 3.8, area: true }, { f: t => loss(t) * 2.2, col: C.red, w: 3.2 }], hl: [{ y: 50, c: C.redD, label: 'thiếu tưới máu' }] });
    o += `<rect x="20" y="24" width="526" height="240" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + P.svg + ZS.legend(256, 36, [[C.green, 'Tưới máu mô'], [C.red, 'Máu mất tích lũy']]) + T(398, 200, 'phút', { s: 10, c: C.mute });
    const lanes = [['a', '🚑 Hồi sức', C.cap], ['b', '🔍 Kiểm soát nguồn', C.red]];
    o += lanes.map(([k, t, col], i) => `<g transform="translate(250 ${216 + i * 24})"><rect width="296" height="18" rx="9" fill="#f4f0fb"/>${s[k] ? `<rect x="${k === 'b' ? 3 / 30 * 296 : 0}" width="${k === 'b' ? 296 - 3 / 30 * 296 : 296}" height="18" rx="9" fill="${col}" opacity=".9"/>` : ''}${T(k === 'b' ? 3 / 30 * 296 + 8 : 8, 13, t, { a: 'start', s: 10.5, c: s[k] ? '#fff' : C.mute })}</g>`).join('');
    o += `<g transform="translate(34 56)">${[['a', '🚑', 'Hồi sức', 'ABC · 2 đường truyền · dịch/máu · giữ ấm', C.mint, C.green], ['b', '🔍', 'Kiểm soát nguồn chảy', 'tìm và cầm nguồn chảy', C.pink, C.red]].map(([k, e, t, sub, col, cd], i) => `<g transform="translate(0 ${i * 94})" data-set="!${k}" opacity="${s[k] ? 1 : .6}"><rect width="190" height="82" rx="14" fill="${s[k] ? col : '#f4f0fb'}" stroke="${C.soft}" stroke-width="1.4"/><text x="26" y="44" text-anchor="middle" font-size="26">${e}</text>${T(48, 28, t, { a: 'start', s: 12 })}${ZS.wrap(sub, 24).map((ln, j) => T(48, 45 + j * 12, ln, { a: 'start', s: 9.5, c: C.mute })).join('')}${ZS.sw(150, 62, s[k], cd)}</g>`).join('')}</g>` + T(129, 256, '👆 bấm thẻ để bật / tắt', { s: 10, c: C.mute });
    return o + T(398, 296, s.a && s.b ? 'Hai việc cùng lúc → tưới máu hồi phục' : s.a ? 'Chỉ hồi sức: máu vẫn chảy → tụt lại' : s.b ? 'Chỉ cầm máu: mất ổn định kéo dài' : 'Không làm gì: xấu dần', { s: 12, c: s.a && s.b ? C.green : C.redD });
  },
  say: (s, sp) => sp.mode === 'bundle' ? (s.par ? ['happy', 'Chưa biết nguyên nhân nên làm SONG SONG: thuốc co hồi, TXA + dịch, khám nguồn. Mục tiêu khởi động tất cả trong ≤15 phút (không phải thời gian được chờ).'] : ['worry', 'Làm tuần tự: nếu nguyên nhân là rách hay sót nhau, thuốc co hồi vô hiệu → mất máu tích lũy cao hơn nhiều.'])
    : sp.mode === 'reassess' ? (s.sc === 'hidden' ? ['ouch', 'Máu ngoài ít lại nhưng tim vẫn nhanh, HA tụt, bụng căng: chảy máu KÍN. Đánh giá lại ngay, không bỏ theo dõi!'] : ['happy', 'Hồi sức đang hiệu quả: hết chảy, tưới máu và tri giác tốt hơn, đông máu hồi phục. Một lần HA tốt chưa đủ để kết thúc.'])
    : s.a && s.b ? ['happy', 'Hồi sức bảo vệ oxy & tưới máu; kiểm soát nguồn ngăn mất máu tiếp. Làm CẢ HAI cùng lúc.'] : s.a ? ['worry', 'Chỉ hồi sức mà không cắt nguồn chảy: tưới máu khá lên rồi tụt lại vì máu vẫn mất.'] : s.b ? ['worry', 'Chỉ cầm máu mà bỏ hồi sức: máu hết chảy nhưng tưới máu thiếu kéo dài.'] : ['sad', 'Chưa làm gì: máu mất tiếp, tưới máu rơi dần.']
});

// ───────── measure: đo máu thay vì đoán
kit('measure', {
  zones: () => ({ cup: [104, 160, 54, 112], vitals: [488, 42, 46, 14], rule: [400, 150, 130, 60] }),
  init: () => ({ ml: 350, abn: true }),
  ui: () => [{ t: 'range', k: 'ml', label: '🥛 Máu đo được (≤24 giờ sau sinh)', min: 0, max: 1000, step: 50, unit: ' mL' }, { t: 'tog', k: 'abn', label: '💓 Huyết động bất thường' }],
  draw: s => {
    const trig = (s.ml >= 300 && s.abn) || s.ml >= 500, y = v => 280 - 220 * v / 1000;
    let o = `<rect x="20" y="24" width="520" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += `<path d="M60 60 H150 L140 270 Q105 280 70 270Z" fill="#fff" stroke="${C.soft}" stroke-width="3" stroke-linejoin="round"/><clipPath id="cpx"><path d="M63 63 H147 L137 267 Q105 276 73 267Z"/></clipPath><g clip-path="url(#cpx)"><rect x="50" y="${y(s.ml)}" width="110" height="260" fill="url(#gRed)"/></g>` + [[300, C.amber], [500, C.redD], [1000, C.mute]].map(([v, c]) => `<path d="M150 ${y(v)} h22" stroke="${c}" stroke-width="3"/>${T(178, y(v) + 4, v, { a: 'start', s: 11.5, c })}`).join('') + T(105, 296, 'dụng cụ thu có vạch', { s: 10.5, c: C.mute }) + T(105, 312, `${s.ml} mL`, { s: 15 });
    const P = plot({ x: 250, y: 56, w: 270, h: 160, xr: [0, 60], yr: [0, 1000], xt: 6, yt: 5, fx: v => v, fy: v => v, xl: 'phút sau sinh', curves: [{ f: t => Math.min(s.ml, s.ml * (1 - Math.exp(-t / 14)) / (1 - Math.exp(-60 / 14))), col: C.red, w: 3.6, area: true }], hl: [{ y: 300, c: C.amber, label: '300 mL + bất thường huyết động', lpos: 'left' }, { y: 500, c: C.redD, label: '500 mL', lpos: 'left' }], pts: [{ x: 60, y: s.ml, col: trig ? C.red : C.green, r: 7 }] });
    o += P.svg + T(258, 46, 'máu đo được tích lũy (mL)', { a: 'start', s: 11.5 });
    o += `<g transform="translate(250 238)"><rect width="270" height="22" rx="11" fill="${trig ? C.red : '#f4f0fb'}"/>${T(135, 16, trig ? '🔔 ĐẠT TRIGGER → KHỞI TRỊ BHSS SỚM' : 'chưa chạm mốc — vẫn theo dõi sát', { s: 11.5, c: trig ? '#fff' : C.mute })}</g>`;
    o += `<g transform="translate(446 30)"><rect width="84" height="24" rx="12" fill="${s.abn ? C.pink : '#f4f0fb'}" stroke="${s.abn ? C.red : C.grid}" stroke-width="2"/>${T(42, 17, s.abn ? '💓 HĐ bất thường' : '💓 HĐ ổn', { s: 10 })}</g>`;
    return o + T(396, 290, 'Mắt dễ đoán thiếu: đo + theo dõi sinh hiệu & tử cung', { s: 11, c: C.mute });
  },
  say: s => (s.ml >= 300 && s.abn) || s.ml >= 500 ? ['ouch', 'Đạt trigger WHO 2025 (≥300 mL kèm bất thường huyết động, hoặc ≥500 mL) → khởi trị sớm. Đừng chờ đủ 1000 mL!'] : s.ml >= 300 ? ['worry', 'Đã ≥300 mL nhưng sinh hiệu chưa bất thường — theo dõi sát tử cung & sinh hiệu.'] : ['happy', 'Chưa tới mốc. Người đang bất ổn vì xuất huyết thì xử trí NGAY, không chờ đo đủ.']
});

// ───────── thirdstage: giai đoạn III — cơ co rút, diện nhau nhỏ lại, nhau bong
kit('thirdstage', {
  zones: () => ({ uterus: [110, 150, 80, 90], placenta: [104, 92, 52, 22], check: [400, 250, 130, 18] }),
  init: () => ({ t: 3, oxy: true }),
  ui: () => [{ t: 'range', k: 't', label: '⏱️ Phút sau sổ thai', min: 0, max: 15, step: 1, unit: ' phút' }, { t: 'tog', k: 'oxy', label: '💉 Oxytocin dự phòng' }],
  draw: s => {
    const ret = t => 1 - Math.exp(-t / (s.oxy ? 2.2 : 6)), sep = t => clamp((ret(t) - .45) / .4, 0, 1), c = ret(s.t), sp = sep(s.t), sc = 1 - .35 * c, py = 8 + sp * 70;
    let o = `<rect x="20" y="24" width="220" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += `<g transform="translate(130 70) scale(${sc}) translate(-130 0)"><path d="M26 118 Q18 18 130 10 Q242 18 234 118 Q230 190 168 226 L164 262 H96 L92 226 Q30 190 26 118Z" fill="url(#gMyo)" stroke="${C.myoD}" stroke-width="2.5"/><path d="M52 118 Q46 40 130 34 Q214 40 208 118 Q204 176 156 208 L152 262 H108 L104 208 Q56 176 52 118Z" fill="#fffafc"/>`;
    if (sp < .9) o += (s.t > 1 && sp < 1 ? `<ellipse cx="130" cy="${48 + py * .35}" rx="${16 + c * 14}" ry="${5 + c * 6}" fill="url(#gClot)" opacity=".9"/>` : '') + `<g transform="translate(0 ${py})"><path d="M78 56 Q130 ${30 - c * 8} 182 56 Q162 ${70 + c * 8} 130 ${64 + c * 8} Q98 ${70 + c * 8} 78 56Z" fill="url(#gPlac)" stroke="${C.placD}" stroke-width="2.5"/></g>`;
    o += `</g>` + (sp >= .9 ? `<g transform="translate(130 246)"><path d="M-40 0 Q0 -20 40 0 Q24 18 0 14 Q-24 18 -40 0Z" fill="url(#gPlac)" stroke="${C.placD}" stroke-width="2.5"/></g>` : '') + T(130, 270, `thân tử cung co rút ↓ ${Math.round(c * 100)}%`, { s: 10.5, c: C.mute });
    const P = plot({ x: 290, y: 50, w: 252, h: 104, xr: [0, 15], yr: [0, 100], xt: 5, yt: 4, fx: v => v + '′', fy: v => v, curves: [{ f: t => 100 * ret(t), col: C.red, w: 3.4 }, { f: t => 100 * sep(t), col: C.cap, w: 3.4 }], vl: [{ x: s.t }], xl: 'phút sau sổ thai' });
    o += `<rect x="256" y="24" width="298" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + ZS.legend(296, 38, [[C.red, 'Tử cung co rút (%)'], [C.cap, 'Nhau bong (%)']], { w: 250 }) + P.svg;
    o += [['dây rốn dài ra', sp > .5], ['máu chảy ra', sp > .3], ['đáy tử cung tròn, chắc', c > .7]].map(([n, on], i) => `<g transform="translate(276 ${208 + i * 18})" opacity="${on ? 1 : .35}"><circle cx="6" cy="0" r="5.5" fill="${on ? C.green : C.grid}"/>${T(18, 4, n, { a: 'start', s: 10.5 })}</g>`).join('');
    if (!s.oxy) o += T(130, 280, '⚠ không thuốc co hồi: co chậm, nhau bong muộn', { s: 10.5, c: C.redD });
    return o;
  },
  say: s => { const c = 1 - Math.exp(-s.t / (s.oxy ? 2.2 : 6)); return s.t < 2 ? ['happy', 'Vừa sổ thai: tử cung bắt đầu co rút, diện giường nhau còn rộng.'] : c < .8 ? ['happy', 'Cơ co rút → diện giường nhau nhỏ lại; nhau (không co được) bị nhăn, máu tụ sau nhau → nhau bong.'] : s.oxy ? ['happy', 'Nhau bong rồi sổ; tử cung tròn chắc. Đánh giá trương lực + máu mất định kỳ. Không giật dây rốn khi tử cung chưa co (nguy cơ lộn tử cung).'] : ['worry', 'Thiếu thuốc co hồi: co chậm, nhau bong muộn, giường nhau mở lâu → chảy nhiều. Thuốc co hồi là thành phần quan trọng nhất của dự phòng BHSS.']; }
});

// ───────── cord: truyền máu nhau–thai khi kẹp rốn muộn
kit('cord', {
  zones: () => ({ baby: [440, 150, 80, 70], mom: [84, 74, 54, 40], cord: [244, 160, 100, 40] }),
  init: () => ({ t: 90, asph: false }),
  ui: () => [{ t: 'range', k: 't', label: '⏱️ Kẹp rốn sau', min: 0, max: 180, step: 15, unit: ' giây' }, { t: 'tog', k: 'asph', label: '👶 Trẻ ngạt, không thở' }],
  draw: s => {
    const tr = t => 100 * (1 - Math.exp(-t / 70)) / (1 - Math.exp(-180 / 70)), done = s.asph ? 0 : tr(s.t);
    let o = `<rect x="20" y="24" width="360" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += `<g transform="translate(70 80)"><circle r="34" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="2.5"/><text y="9" text-anchor="middle" font-size="30">🤱</text></g>` + T(70, 128, 'mẹ', { s: 11, c: C.mute }) + `<g class="hop"><text x="118" y="68" font-size="22">💉</text></g>` + T(130, 92, 'oxytocin cho mẹ', { a: 'start', s: 10.5, c: C.mute }) + T(130, 105, '(song song)', { a: 'start', s: 10, c: C.mute });
    o += `<g transform="translate(86 196)"><path d="M-52 0 Q-40 -34 0 -34 Q40 -34 52 0 Q40 34 0 34 Q-40 34 -52 0Z" fill="url(#gPlac)" stroke="${C.placD}" stroke-width="2.5"/>${T(0, 5, 'nhau', { s: 12, c: '#fff' })}</g>`;
    o += `<path d="M136 196 C180 150 220 240 290 220 S330 226 336 232" fill="none" stroke="#ffb7c9" stroke-width="13" stroke-linecap="round"/><path d="M136 196 C180 150 220 240 290 220 S330 226 336 232" fill="none" stroke="${C.redD}" stroke-width="2.4"/>`;
    const flow = !s.asph && s.t > 0; if (flow) o += `<path d="M136 196 C180 150 220 240 290 220" fill="none" stroke="#fff" stroke-width="3.5" stroke-dasharray="2 12" stroke-linecap="round" class="flow" style="animation-duration:${s.t < 60 ? .5 : 1.1}s"/>`;
    o += `<g transform="translate(298 224)"><rect x="-12" y="-11" width="24" height="22" rx="7" fill="${C.butter}" stroke="${C.butterD}" stroke-width="3"/>${T(0, 5, '✂️', { s: 12 })}</g>`;
    o += `<g transform="translate(346 236)"><ellipse rx="26" ry="20" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/><circle cx="-6" cy="-4" r="2" fill="${C.ink}"/><circle cx="6" cy="-4" r="2" fill="${C.ink}"/>${s.asph ? `<path d="M-6 8 q6 -5 12 0" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>` : `<path d="M-6 6 q6 5 12 0" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>`}</g>`;
    o += T(200, 252, s.asph ? '🚑 ngạt: kẹp ngay, chuyển hồi sức' : s.t < 60 ? '✂️ kẹp quá sớm' : '✂️ kẹp muộn 1–3 phút', { s: 11.5, c: s.asph || s.t < 60 ? C.redD : C.green });
    const P = plot({ x: 410, y: 50, w: 132, h: 142, xr: [0, 180], yr: [0, 100], xt: 3, yt: 2, fx: v => v / 60 + '′', fy: v => v, xl: 'phút', bands: [{ x0: 60, x1: 180, fill: C.mint, op: .6, label: '1–3′' }], curves: [{ f: tr, col: C.red, w: 3.4 }], pts: s.asph ? [] : [{ x: s.t, y: tr(s.t), col: C.redD, r: 6.5 }] });
    o += `<rect x="396" y="24" width="158" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(475, 42, 'Máu nhau → bé (%)', { s: 11.5 }) + P.svg + bar(414, 232, 124, done, C.red, 'đã nhận') + T(475, 256, s.asph ? '—' : Math.round(done) + '%', { s: 12 });
    return o;
  },
  say: s => s.asph ? ['ouch', 'Trẻ ngạt cần chuyển ngay để hồi sức: không trì hoãn kẹp rốn.'] : s.t < 60 ? ['worry', 'Kẹp trước 1 phút ngắt sớm dòng máu nhau → bé: WHO 2025 không khuyến cáo (trừ trẻ ngạt).'] : ['happy', 'Kẹp rốn muộn 1–3 phút: máu từ nhau tiếp tục sang bé. Vẫn đánh giá mẹ, tử cung, chảy máu và trẻ trong lúc đó.']
});

// ───────── coldchain: chất lượng thuốc co hồi
const CC = { oxy: ['Oxytocin', '10 IU IM/IV', 'ưu tiên khi bảo đảm chất lượng (cold chain)'], carb: ['Carbetocin', '100 µg IM/IV', 'dạng CHỊU NHIỆT khi không bảo đảm cold chain'], miso: ['Misoprostol', '400/600 µg uống', 'khi không có hai thuốc trên'] };
kit('coldchain', {
  zones: () => ({ store: [90, 90, 70, 60], pick: [270, 90, 100, 50], dose: [270, 250, 200, 26] }),
  init: () => ({ store: 'hot', drug: 'oxy' }),
  ui: () => [{ t: 'seg', k: 'store', opts: [['cold', '❄️ Bảo quản đúng'], ['hot', '☀️ Không bảo đảm lạnh']] }, { t: 'seg', k: 'drug', opts: Object.entries(CC).map(([k, v]) => [k, v[0]]) }],
  draw: s => {
    const hot = s.store === 'hot', pot = { oxy: t => hot ? 100 * Math.exp(-t / 6) : 100 - t * .3, carb: t => 100 - t * .4, miso: t => 100 - t * .5 };
    let o = `<rect x="20" y="24" width="150" height="238" rx="18" fill="${hot ? '#fff0d4' : '#e6f4ff'}" stroke="${hot ? C.butterD : C.skyD}" stroke-width="2.5"/><text x="95" y="120" text-anchor="middle" font-size="58">${hot ? '☀️' : '❄️'}</text>${T(95, 160, hot ? 'nơi nóng' : 'tủ lạnh', { s: 13 })}${T(95, 178, hot ? 'không bảo đảm cold chain' : 'đúng nhãn', { s: 10.5, c: C.mute })}${T(95, 250, 'nơi cất thuốc', { s: 10.5, c: C.mute })}`;
    const P = plot({ x: 214, y: 54, w: 324, h: 150, xr: [0, 24], yr: [0, 100], xt: 4, yt: 4, fx: v => v, fy: v => v, xl: 'tháng bảo quản', curves: [{ f: pot.oxy, col: C.red, w: s.drug === 'oxy' ? 4 : 2, dash: s.drug === 'oxy' ? '' : '4 4' }, { f: pot.carb, col: C.green, w: s.drug === 'carb' ? 4 : 2, dash: s.drug === 'carb' ? '' : '4 4' }, { f: pot.miso, col: C.amber, w: s.drug === 'miso' ? 4 : 2, dash: s.drug === 'miso' ? '' : '4 4' }], hl: [{ y: 50, c: C.grid }] });
    o += `<rect x="190" y="24" width="364" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(372, 44, 'hoạt tính thuốc theo thời gian (minh họa)', { s: 11.5 }) + P.svg + T(222, 226, 'oxytocin', { a: 'start', s: 10.5, c: C.red }) + T(290, 226, 'carbetocin chịu nhiệt', { a: 'start', s: 10.5, c: C.green }) + T(420, 226, 'misoprostol', { a: 'start', s: 10.5, c: C.amber });
    o += `<g transform="translate(34 276)"><rect width="500" height="32" rx="16" fill="${C.butter}" stroke="${C.butterD}" stroke-width="2.5"/>${T(250, 21, `${CC[s.drug][0]} ${CC[s.drug][1]} · ${CC[s.drug][2]}`, { s: 11.5 })}</g>`;
    return o;
  },
  say: s => s.store === 'hot' && s.drug === 'oxy' ? ['ouch', 'Không bảo đảm cold chain: oxytocin mất hoạt tính, tăng số ống không cứu được. Chọn chế phẩm chịu nhiệt thật (không phải carbetocin nào cũng chịu nhiệt!) hoặc misoprostol.'] : s.drug === 'carb' ? ['happy', 'Carbetocin 100 µg IM/IV dạng chịu nhiệt khi không bảo đảm cold chain. Tác dụng kéo dài ≠ sửa được Trauma/Tissue.'] : s.drug === 'miso' ? ['happy', 'Misoprostol 400/600 µg uống khi không có oxytocin/carbetocin. Liều dự phòng khác liều điều trị.'] : ['happy', 'Oxytocin 10 IU IM/IV — ưu tiên khi bảo đảm chất lượng. Kiểm hạn, nhãn, hàm lượng; không trộn liều dự phòng/điều trị.']
});
})();
