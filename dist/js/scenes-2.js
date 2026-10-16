'use strict';
/* Họ 2: nhau – hồ máu, "kẹp sống" (cơ siết động mạch xoắn), tử cung ba lớp, oxytocin ở mức tế bào. */
(() => {
const { C, T, kit, plot, clamp, arrow, bar, lab, drop } = window.ZS, ZS = window.ZS;

// ───────── placenta: máu mẹ vào hồ máu, trao đổi qua gai nhau, máu thai nhận oxy
kit('placenta', {
  zones: () => ({ spiral: [110, 232, 60, 44], villi: [200, 98, 150, 56], cap: [300, 128, 66, 34], space: [200, 150, 150, 30] }),
  init: () => ({ mom: 85 }),
  ui: () => [{ t: 'range', k: 'mom', label: '🩸 Dòng máu mẹ về nhau', min: 5, max: 100, step: 5, unit: '%' }],
  draw: s => {
    const m = s.mom / 100, n = Math.round(m * 9), o2 = 100 * (1 - Math.exp(-3.2 * m)) / (1 - Math.exp(-3.2));
    let o = `<rect x="20" y="24" width="360" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += `<rect x="22" y="26" width="356" height="20" rx="10" fill="${C.ser}"/>` + T(200, 40, 'mặt thai · tấm đệm nhau', { s: 11, c: C.ink });
    o += `<rect x="22" y="46" width="356" height="146" fill="#ffd9e2"/>` + '';
    [70, 140, 210, 280, 350].forEach((x, i) => { const br = [[-26, 38], [0, 52], [26, 38]]; o += `<path d="M${x} 46 V84" stroke="${C.lavD}" stroke-width="9" stroke-linecap="round"/>` + br.map(([dx, dy]) => `<path d="M${x} 84 Q${x + dx * .4} 98 ${x + dx} ${84 + dy}" fill="none" stroke="${C.lavD}" stroke-width="6" stroke-linecap="round"/><circle cx="${x + dx}" cy="${84 + dy + 8}" r="9.5" fill="#d9e9ff" stroke="${C.cap}" stroke-width="2.5"/><circle cx="${x + dx}" cy="${84 + dy + 8}" r="3" fill="${C.cap}"/>`).join(''); });
    o += `<rect x="22" y="192" width="356" height="16" fill="#f6d9c3"/>` + T(30, 204, 'bản đệm (màng rụng)', { a: 'start', s: 10.5, c: '#a0785c' });
    o += `<rect x="22" y="208" width="356" height="54" rx="0" fill="url(#gMyo)" opacity=".9"/>` + T(30, 252, 'cơ tử cung', { a: 'start', s: 10.5, c: C.myoD });
    [110, 250].forEach(x => { o += `<path d="M${x} 262 C${x - 12} 246 ${x + 12} 232 ${x} 214 L${x} 192 L${x} 150" fill="none" stroke="${C.art}" stroke-width="${3 + m * 8}" stroke-linecap="round"/><path d="M${x} 262 C${x - 12} 246 ${x + 12} 232 ${x} 214 L${x} 192 L${x} 140" fill="none" stroke="#fff" stroke-width="2.2" stroke-dasharray="1 12" stroke-linecap="round" class="flow" style="animation-duration:${(2.2 - m * 1.6).toFixed(2)}s"/>`; });
    [180, 320].forEach(x => o += `<path d="M${x} 192 L${x} 262" fill="none" stroke="${C.ven}" stroke-width="7" stroke-linecap="round" opacity="${.35 + m * .65}"/>`);
    for (let i = 0; i < n; i++) { const x = 60 + i * 38, y = 126 + (i % 3) * 14; o += `<g class="bob" style="animation-delay:${i * .15}s"><circle cx="${x}" cy="${y}" r="8.5" fill="#fff" stroke="${C.cap}" stroke-width="2"/>${T(x, y + 3.5, 'O₂', { s: 8.5 })}</g>`; }
    o += ZS.pill(110, 276, 'ĐM xoắn: máu mẹ vào', { c: C.art, tc: C.redD }) + ZS.pill(84, 66, 'gai nhau', {}) + ZS.pill(330, 74, 'mao mạch thai', { c: C.cap, tc: C.cap }) + ZS.pill(250, 176, 'hồ máu (khoang gian gai)', { c: C.pinkD, tc: C.redD });
    o += `<g transform="translate(404 36)"><rect width="144" height="226" rx="20" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>${T(72, 26, 'Oxy tới thai', { s: 13 })}<rect x="48" y="40" width="48" height="140" rx="12" fill="#f4f0fb" stroke="${C.grid}" stroke-width="2"/><rect x="48" y="${40 + 140 * (1 - o2 / 100)}" width="48" height="${140 * o2 / 100}" rx="12" fill="${o2 > 60 ? C.green : o2 > 30 ? C.amber : C.red}"/>${T(72, 204, Math.round(o2) + '%', { s: 20, c: o2 > 60 ? C.green : o2 > 30 ? C.amber : C.red })}${T(72, 218, 'so với bình thường', { s: 9.5, c: C.mute })}</g>`;
    o += `<g transform="translate(404 284)">${T(72, 12, 'trao đổi qua gai nhau,', { s: 11, c: C.mute })}${T(72, 28, 'hai dòng máu KHÔNG trộn', { s: 11, c: C.mute })}</g>`;
    return o;
  },
  say: s => s.mom >= 70 ? ['happy', 'Máu mẹ đầy hồ máu → oxy khuếch tán qua gai nhau sang mao mạch thai. Hai dòng máu chỉ trao đổi, không trộn.'] : s.mom >= 35 ? ['worry', 'Máu mẹ về nhau giảm → ít oxy hơn để trao đổi → thai nhận ít oxy.'] : ['ouch', 'Mẹ mất nhiều máu → tưới máu nhau tụt → thai thiếu oxy dù máu của thai chưa mất giọt nào!']
});

// ───────── uterus: ba lớp thành tử cung và vùng yếu
kit('uterus', {
  zones: () => ({ body: [114, 112, 62, 62], lower: [150, 252, 70, 40], mag: [440, 244, 78, 78] }),
  init: () => ({ preg: false, scar: false }),
  ui: () => [{ t: 'tog', k: 'preg', label: '🤰 Đang mang thai' }, { t: 'tog', k: 'scar', label: '✂️ Có sẹo mổ cũ' }],
  draw: s => {
    const thin = s.preg ? 7 : 22, mag = (cx, cy, title, cow, crack) => { const endo = 9, ser = 7, tot = endo + cow + ser, y0 = cy - tot / 2;
      return `<circle cx="${cx}" cy="${cy}" r="62" fill="#fff" stroke="${C.lavD}" stroke-width="3"/><clipPath id="mg${cx}_${cy}"><circle cx="${cx}" cy="${cy}" r="59"/></clipPath><g clip-path="url(#mg${cx}_${cy})"><rect x="${cx - 62}" y="${y0 - 6}" width="124" height="${endo + 6}" fill="${C.decid}"/><rect x="${cx - 62}" y="${y0 + endo}" width="124" height="${cow}" fill="url(#gMyo)"/>${Array.from({ length: Math.max(2, Math.round(cow / 7)) }, (_, i) => `<path d="M${cx - 62} ${y0 + endo + (i + .5) * cow / Math.max(2, Math.round(cow / 7))} q31 -5 62 0 t62 0" fill="none" stroke="${C.myoD}" stroke-width="1.8" opacity=".6"/>`).join('')}<rect x="${cx - 62}" y="${y0 + endo + cow}" width="124" height="${ser + 6}" fill="url(#gSer)"/>${crack ? `<rect x="${cx - 26}" y="${y0 + endo}" width="30" height="${cow}" fill="${C.lav}"/><path d="M${cx - 24} ${y0 + endo} l9 ${cow / 3} l-8 ${cow / 3} l10 ${cow / 3}" fill="none" stroke="${C.redD}" stroke-width="3.2" stroke-linecap="round"/>` : ''}</g>` + lab(cx + 58, y0 + 2, cx + 66, y0 - 14, 'nội mạc', { s: 9.5 }).replace(/<path[^>]*\/>/, '') + T(cx, cy + 80, title, { s: 12 });
    };
    let o = ZS_U(s) + `<path d="M150 70 Q220 60 380 92" fill="none" stroke="${C.lavD}" stroke-width="2.4" stroke-dasharray="3 6"/><path d="M178 250 Q300 256 380 244" fill="none" stroke="${C.lavD}" stroke-width="2.4" stroke-dasharray="3 6"/>`;
    o += mag(440, 92, 'Thân: cơ dày', 40, false) + mag(440, 244, s.scar ? 'Đoạn dưới + SẸO' : s.preg ? 'Đoạn dưới: mỏng' : 'Đoạn dưới', thin, s.scar);
    o += T(440, 28, 'lớp: nội mạc · cơ · thanh mạc', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.scar ? ['worry', 'Sẹo ở cơ tử cung = chỗ yếu. Phải xem BIÊN BẢN MỔ; sẹo da ngoài không cho biết đường rạch tử cung.'] : s.preg ? ['happy', 'Có thai: đoạn dưới giãn mỏng, thân vẫn dày cơ để co rút cầm máu.'] : ['happy', 'Thân tử cung giàu cơ → co rút mạnh → là “kẹp sống” cầm máu sau sinh.']
});
function ZS_U(s) {
  const { C: c, uterusSag } = window.ZS;
  let o = uterusSag({ x: 150, y: 28, k: .86 });
  if (s.preg) o += `<ellipse cx="148" cy="130" rx="46" ry="38" fill="url(#gSkin)" stroke="${c.skinD}" stroke-width="2.5"/>` + `<path d="M118 150 q30 22 60 0" fill="none" stroke="${c.skinD}" stroke-width="3" stroke-linecap="round"/>`;
  if (s.scar) o += `<path d="M112 196 H188" stroke="${c.redD}" stroke-width="5" stroke-linecap="round"/>`;
  return o + T(150, 330, 'tử cung nhìn dọc', { s: 10.5, c: c.mute });
}

// ───────── ligature: "kẹp sống" — cơ co siết động mạch xoắn ở giường nhau
kit('ligature', {
  zones: (s, sp) => ({ bed: [196, 52, 100, 30], muscle: [86, 146, 70, 76], clot: [196, 70, 50, 30], artery: [196, 150, 30, 70], drops: [196, 250, 64, 26], cap: [196, 160, 44, 30], piece: [196, 56, 60, 30] }),
  init: sp => ({ tone: sp.mode === 'atony' || sp.mode === 'tissue' ? 100 : 55, cause: 'stretch', removed: false, pas: false }),
  ui: (s, sp) => sp.mode === 'atony' ? [{ t: 'seg', k: 'cause', opts: [['none', '✅ Cơ khỏe'], ['stretch', '🍼 Quá căng'], ['tired', '😮‍💨 Mệt cơ'], ['infect', '🦠 Nhiễm trùng']] }]
    : sp.mode === 'tissue' ? [{ t: 'tog', k: 'removed', label: '🧤 Lấy mô nhau còn lại' }, { t: 'tog', k: 'pas', label: '⚠️ Nhau bám sâu (nghi PAS)' }]
    : [{ t: 'range', k: 'tone', label: '💪 Lực co của cơ tử cung (đờ → co tốt)', min: 0, max: 100, step: 5, unit: '' }],
  draw: (s, sp) => {
    const cap = sp.mode === 'atony' ? ({ none: 100, stretch: 35, tired: 30, infect: 25 })[s.cause] : sp.mode === 'tissue' ? (s.removed && !s.pas ? 100 : 30) : 100;
    const eff = Math.min(s.tone, cap), c = eff / 100, w = 15 - 12 * c, mh = 70 + 56 * c, blow = sp.mode === 'tissue' && s.pas && s.removed;
    const my0 = 96, my1 = my0 + mh, y1 = 250;
    let o = `<rect x="20" y="24" width="360" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += `<rect x="22" y="26" width="356" height="22" rx="11" fill="#fffafc"/>` + T(32, 41, 'buồng tử cung', { a: 'start', s: 10.5, c: C.mute });
    o += `<rect x="22" y="48" width="356" height="${46 - 0}" fill="${C.decid}"/>` + T(366, 62, 'giường nhau (màng rụng)', { a: 'end', s: 10.5, c: '#a0785c' });
    o += `<rect x="22" y="${my0}" width="356" height="${mh}" fill="url(#gMyo)"/>`;
    for (let i = 0; i < 5; i++) o += `<path d="M22 ${my0 + 12 + i * (mh - 24) / 4} q60 ${-10 - 8 * c} 120 0 t120 0 t114 0" fill="none" stroke="${C.myoD}" stroke-width="${1.8 + c * 1.6}" opacity=".55"/>`;
    o += `<rect x="22" y="${my1}" width="356" height="${262 - my1}" fill="#fff"/>` + `<rect x="22" y="${my1}" width="356" height="16" fill="url(#gSer)"/>`;
    // động mạch xoắn: bị ép khi cơ co
    const path = `M196 48 C186 60 206 70 196 84 C186 98 206 ${my0 + 8} 196 ${my0 + 22} C188 ${my0 + 40} 204 ${my0 + 58} 196 ${my1 - 6} L196 ${y1 - 6}`;
    o += `<path d="${path}" fill="none" stroke="${C.art}" stroke-width="${w}" stroke-linecap="round" opacity="${blow ? 0 : 1}"/>`;
    if (!blow && w > 4) o += `<path d="${path}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="1 11" stroke-linecap="round" class="flow" style="animation-duration:${(.8 + c * 2).toFixed(2)}s"/>`;
    o += lab(196, my0 + 36, 262, my0 + 30, 'ĐM xoắn', { c: C.redD, a: 'start', s: 11.5 }) + T(60, my0 + mh / 2 + 4, 'CƠ TỬ CUNG', { s: 11, c: C.myoD }) + T(330, my0 + mh / 2 + 4, 'CƠ TỬ CUNG', { s: 11, c: C.myoD });
    if (c > .25) o += arrow(`M120 ${my0 + mh / 2} H172`, C.redD, 3.5) + arrow(`M276 ${my0 + mh / 2} H220`, C.redD, 3.5);
    if (blow) o += `<path d="M180 ${my0 + 14} l16 20 l-12 12 l22 20 l-10 14" fill="none" stroke="${C.red}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` + [0, 1, 2].map(i => drop(176 + i * 22, 270 + (i % 2) * 8, .8, 'drip')).join('');
    else { const nd = Math.round((1 - c) * 4); for (let i = 0; i < nd; i++) o += drop(196 + (i - (nd - 1) / 2) * 20, 38, .7, 'drip'); }
    if (sp.mode === 'clot' && c >= .5) o += `<g>` + [0, 1, 2, 3].map(i => `<path d="M${180} ${52 + i * 9} L${212} ${58 + i * 9} M${212} ${52 + i * 9} L${180} ${58 + i * 9}" stroke="${C.amber}" stroke-width="2.4" stroke-linecap="round"/>`).join('') + `</g>` + T(240, 40, 'fibrin bít miệng mạch', { a: 'start', s: 10.5, c: C.amber });
    if (sp.mode === 'tissue' && !(s.removed && !s.pas)) o += `<path d="M150 ${s.pas ? 50 : 44} Q196 24 246 46 L238 ${s.pas ? 92 : 70} Q196 ${s.pas ? 100 : 80} 156 ${s.pas ? 92 : 70}Z" fill="url(#gPlac)" stroke="${C.placD}" stroke-width="2.5"/>` + T(196, 62, 'mô nhau', { s: 10.5, c: '#fff' });
    // bảng bên phải
    const flow = Math.round(100 * Math.pow(1 - c, 2.5)), P = plot({ x: 410, y: 56, w: 138, h: 100, xr: [0, 100], yr: [0, 100], xt: 2, yt: 2, fx: v => v, fy: v => v, curves: [{ f: v => 100 * Math.pow(1 - v / 100, 2.5), col: C.red, w: 3 }, { f: v => v <= cap ? null : 100 * Math.pow(1 - v / 100, 2.5), col: C.grid, w: 0 }], pts: [{ x: eff, y: flow, col: C.red, r: 6 }], xl: 'cơ co', yl: 'máu chảy' });
    o += `<rect x="404" y="24" width="150" height="150" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(479, 44, 'Co cơ → dòng máu', { s: 11.5 }) + P.svg;
    if (cap < 100) o += `<path d="M${P.X(cap)} 56 V156" stroke="${C.amber}" stroke-width="2" stroke-dasharray="4 4"/>` + T(P.X(cap), 50, 'trần', { s: 9.5, c: C.amber });
    o += `<g transform="translate(404 190)"><rect width="150" height="72" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>${T(75, 22, 'Tử cung', { s: 12, c: C.mute })}${T(75, 56, c > .7 ? 'CHẮC' : c > .35 ? 'đang co' : 'MỀM', { s: 24, c: c > .7 ? C.green : c > .35 ? C.amber : C.red })}</g>`;
    o += T(200, 290, flow < 15 ? 'mạch bị ép kín → máu ngừng chảy' : flow < 30 ? 'mạch hẹp dần, còn rỉ máu' : 'mạch còn mở → máu chảy', { s: 12.5, c: flow < 15 ? C.green : C.redD });
    return o;
  },
  say: (s, sp) => { const cap = sp.mode === 'atony' ? ({ none: 100, stretch: 35, tired: 30, infect: 25 })[s.cause] : sp.mode === 'tissue' ? (s.removed && !s.pas ? 100 : 30) : 100; const eff = Math.min(s.tone, cap);
    if (sp.mode === 'tissue') return s.pas && s.removed ? ['ouch', 'Cố bóc nhau bám sâu (PAS) → xé mạch, chảy máu khó kiểm soát. Dừng, huy động đội, lập kế hoạch!'] : s.removed ? ['happy', 'Lấy hết mô nhau (bởi người có năng lực) → cơ co hồi được → siết mạch lại.'] : ['sad', 'Còn mô nhau: cơ không co chắc được (trần co thấp) → mạch giường nhau vẫn mở.'];
    if (sp.mode === 'atony') return cap < 100 ? ['worry', ({ stretch: 'Tử cung quá căng (đa thai, đa ối, thai to): sợi cơ bị kéo giãn quá mức → co yếu → ĐM xoắn còn mở → chảy máu.', tired: 'Chuyển dạ kéo dài / tăng co lâu: cơ mệt, co yếu → mạch giường nhau không được ép kín.', infect: 'Nhiễm trùng (viêm màng ối): cơ viêm co kém → mạch mở → xuất huyết.' })[s.cause]] : ['happy', 'Cơ khỏe co mạnh → các sợi cơ đan chéo siết kín ĐM xoắn: đây là “kẹp sống”. Chọn một nguyên nhân để xem cơ đờ.'];
    return eff >= 75 ? ['happy', 'Cơ co → ép xẹp ĐM xoắn → máu ngừng; lưới fibrin bít miệng mạch củng cố nút cầm máu.'] : eff >= 35 ? ['worry', 'Cơ đang siết mạch dần dần… vẫn còn rỉ máu.'] : ['sad', 'Cơ đờ → kẹp lỏng → ĐM xoắn mở → máu chảy ra buồng tử cung.']; }
});

// ───────── oxytocin: thụ thể → Ca²⁺ → actin–myosin → co cơ
kit('oxytocin', {
  zones: (s, sp) => ({ drug: [100, 62, 70, 30], recep: [200, 112, 60, 30], ca: [280, 168, 96, 40], filament: [200, 236, 140, 34], check: [480, 94, 66, 44], verdict: [480, 196, 66, 34] }),
  init: sp => ({ dose: true, route: 'slow', after: 'good' }),
  ui: (s, sp) => sp.mode === 'treat' ? [{ t: 'tog', k: 'dose', label: '💉 Oxytocin IV' }, { t: 'seg', k: 'after', opts: [['good', '🙂 Tử cung chắc · máu giảm'], ['firm', '🩸 Chắc mà máu vẫn nhiều'], ['soft', '😴 Vẫn mềm · máu nhiều']] }]
    : [{ t: 'tog', k: 'dose', label: '💉 Tiêm oxytocin' }, { t: 'seg', k: 'route', opts: [['slow', '🐢 IV chậm 1–2 phút'], ['fast', '⚡ IV nhanh (bolus)']] }],
  draw: (s, sp) => {
    const on = s.dose, sh = on ? 34 : 0;
    let o = `<rect x="20" y="24" width="380" height="244" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += `<rect x="36" y="98" width="348" height="22" rx="11" fill="${C.lav}" stroke="${C.lavD}" stroke-width="2.5"/>` + T(372, 92, 'màng tế bào cơ trơn', { a: 'end', s: 10.5, c: C.mute });
    o += `<path d="M180 120 V102 q0 -16 20 -16 q20 0 20 16 V120Z" fill="${C.mint}" stroke="${C.mintD}" stroke-width="2.5"/>` + T(200, 114, 'OTR', { s: 9.5, c: C.green }) + `<rect x="190" y="88" width="20" height="10" rx="5" fill="#fff" stroke="${C.mintD}" stroke-width="2"/>`;
    const cx = on ? 200 : 100, cy = on ? 84 : 58;
    o += `<g class="${on ? '' : 'bob'}"><circle cx="${cx}" cy="${cy}" r="12" fill="${C.pinkD}" stroke="${C.red}" stroke-width="2.5"/>${T(cx, cy + 3.5, 'Oxy', { s: 8.5 })}</g>` + (on ? '' : T(100, 86, 'oxytocin', { s: 10.5, c: C.mute }));
    o += `<path d="M64 150 Q64 244 200 252 Q336 244 336 150 Q336 122 200 122 Q64 122 64 150Z" fill="#fffafc" stroke="${C.pinkD}" stroke-width="2.5"/>`;
    o += `<ellipse cx="280" cy="156" rx="42" ry="16" fill="#e9f1ff" stroke="${C.cap}" stroke-width="2.5"/>` + T(280, 180, 'lưới nội cơ tương', { s: 9.5, c: C.cap });
    if (on) o += arrow('M200 124 Q220 140 250 150', C.green, 3) + Array.from({ length: 7 }, (_, i) => `<g class="bob" style="animation-delay:${i * .13}s"><circle cx="${150 + i * 26}" cy="${196 + (i % 2) * 12}" r="8" fill="${C.butter}" stroke="${C.butterD}" stroke-width="2.2"/>${T(150 + i * 26, 199 + (i % 2) * 12, 'Ca', { s: 7.5 })}</g>`).join('');
    // sợi actin–myosin trượt
    [0, 1].forEach(i => { const y = 226 + i * 12; o += `<rect x="${112 + sh * .5}" y="${y}" width="${176 - sh}" height="6" rx="3" fill="${C.myoD}"/>` + Array.from({ length: 8 }, (_, j) => `<path d="M${100 + j * 28 + (j < 4 ? sh * .55 : -sh * .55)} ${y - 5} v16" stroke="${C.soft}" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`).join(''); });
    o += T(200, 266, on ? 'actin trượt trên myosin → CƠ NGẮN LẠI' : 'tế bào cơ ở trạng thái nghỉ', { s: 11.5, c: on ? C.green : C.mute });
    // phải: biểu đồ
    if (sp.mode === 'treat') {
      const a = s.after, firmQ = a === 'firm' || (a === 'good'), bleed = a !== 'good';
      o += `<g transform="translate(406 24)"><rect width="148" height="244" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>${T(74, 24, 'Đánh giá lại', { s: 13 })}${[['Tử cung chắc?', firmQ && on], ['Máu còn chảy?', bleed && on]].map(([t, v], i) => `<g transform="translate(14 ${42 + i * 56})">${T(0, 12, t, { a: 'start', s: 11.5, c: C.mute })}<rect y="20" width="120" height="26" rx="13" fill="${v ? (i ? C.pink : C.mint) : '#f4f0fb'}" stroke="${v ? (i ? C.pinkD : C.mintD) : C.grid}" stroke-width="2.5"/>${T(60, 38, on ? (v ? 'CÓ' : 'KHÔNG') : '—', { s: 12 })}</g>`).join('')}<g transform="translate(14 158)">${T(0, 12, 'Hướng xử trí', { a: 'start', s: 11.5, c: C.mute })}<rect y="20" width="120" height="54" rx="14" fill="${!on ? '#f4f0fb' : a === 'good' ? C.mint : a === 'firm' ? C.peach : C.pink}" stroke="${C.grid}" stroke-width="2.5"/>${T(60, 42, !on ? 'bấm 💉' : a === 'good' ? 'tiếp tục theo dõi' : a === 'firm' ? 'tìm nguồn khác' : 'tăng can thiệp', { s: 11 })}${T(60, 60, !on ? '' : a === 'firm' ? '(4T, đoạn dưới)' : a === 'soft' ? '(thuốc khác…)' : '', { s: 9.5, c: C.mute })}</g></g>`;
    } else {
      const fast = s.route === 'fast', P = plot({ x: 424, y: 62, w: 118, h: 80, xr: [0, 10], yr: [0, 100], xt: 2, yt: 2, fx: v => v, fy: v => v, xl: 'phút sau tiêm', curves: [{ f: t => on ? 100 * (1 - Math.exp(-t * .9)) : 5, col: C.red, w: 3 }] });
      const P2 = plot({ x: 424, y: 194, w: 118, h: 42, xr: [0, 10], yr: [50, 130], xt: 2, yt: 2, fx: v => v, fy: v => v, xl: 'phút', curves: [{ f: t => on && fast ? 112 - 38 * Math.exp(-((t - 1.3) ** 2) / .5) : 112, col: C.cap, w: 3 }] });
      o += `<rect x="406" y="24" width="148" height="244" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(480, 46, 'Co cơ tử cung', { s: 11.5 }) + P.svg + T(480, 184, 'Huyết áp mẹ', { s: 11.5 }) + P2.svg;
      if (on && fast) o += T(480, 260, '⚠ bolus nhanh: HA tụt', { s: 10.5, c: C.redD });
    }
    return o;
  },
  say: (s, sp) => sp.mode === 'treat' ? (!s.dose ? ['happy', 'Bấm 💉 rồi chọn kết quả đánh giá lại tử cung & máu mất.'] : s.after === 'good' ? ['happy', 'Tử cung chắc, máu giảm: oxytocin đủ. Vẫn theo dõi huyết động và lượng máu.'] : s.after === 'firm' ? ['worry', 'Đích co cơ đã đạt mà máu vẫn nhiều → đừng chỉ tăng liều! Tìm Trauma, Tissue, Thrombin, diện đoạn dưới.'] : ['worry', 'Không đáp ứng → tìm nguyên nhân & tăng can thiệp (thuốc khác chọn theo chống chỉ định).']) :
    !s.dose ? ['sleep', 'Tế bào cơ đang nghỉ. Bấm 💉 để oxytocin gắn thụ thể.'] : s.route === 'fast' ? ['ouch', 'Oxytocin gắn thụ thể → Ca²⁺ → cơ co. Nhưng BOLUS IV nhanh làm huyết áp tụt — tiêm chậm 1–2 phút!'] : ['happy', 'Oxytocin gắn thụ thể → Ca²⁺ vào tế bào → actin trượt trên myosin → cơ co → siết mạch giường nhau (đích: Tone).']
});
})();
