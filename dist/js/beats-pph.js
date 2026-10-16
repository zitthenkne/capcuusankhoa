'use strict';
/* Trang tí hon — chương 03 Xử trí BHSS. Hình: Servier Medical Art (CC BY 4.0) cho bàn tay, dịch truyền, bơm tiêm; sơ đồ tự vẽ cho giường nhau, tử cung, lưới fibrin, đường sinh dục, bóng chèn. */
(() => {
const ZS = window.ZS, { C, T, kit, arrow } = ZS, B = ZS.beats;
const { Th, card, pic, tap, call, tcard, pcard, flow, heart, drops, vital, verdict, seen, markSeen, tfKit, bed } = ZS.BK;
const SV = 'Servier Medical Art · CC BY 4.0';
const sel = (s, k) => { if (k === 'sel') markSeen(s, s.sel); };
// tử cung nhìn dọc + tay sờ đáy; k: cỡ, soft: mềm (viền đứt)
const ut = (x, y, k, o = {}) => `<g ${o.cls ? `class="${o.cls}"` : ''}>${ZS.uterusSag({ x, y, k })}</g>` + (o.soft ? `<path d="M${x - 105 * k} ${y + 60 * k} Q${x} ${y - 20 * k} ${x + 105 * k} ${y + 60 * k}" fill="none" stroke="${C.red}" stroke-width="2" stroke-dasharray="6 5"/>` : '');
// đường sinh dục nhìn từ dưới: âm hộ, âm đạo, cổ tử cung
const vulva = (cx, cy, o = {}) => `<ellipse cx="${cx}" cy="${cy}" rx="78" ry="104" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="1.4"/><ellipse cx="${cx}" cy="${cy - 8}" rx="40" ry="70" fill="#ffd9e3" stroke="${C.myoD}"/><ellipse cx="${cx}" cy="${cy - 30}" rx="26" ry="20" fill="#f7b3c3" stroke="${C.myoD}"/><ellipse cx="${cx}" cy="${cy - 30}" rx="6" ry="5" fill="#c94a5a"/><circle cx="${cx}" cy="${cy + 124}" r="12" fill="#f3c6d3" stroke="${C.pinkD}"/>` + Th(cx + 34, cy - 50, 'cổ TC', { a: 'start', s: 11, c: C.myoD }) + Th(cx + 46, cy + 30, 'âm đạo', { a: 'start', s: 11, c: C.myoD }) + Th(cx + 18, cy + 128, 'hậu môn', { a: 'start', s: 11, c: C.mute }) + (o.hema ? `<ellipse cx="${cx - 52}" cy="${cy + 10}" rx="${16 + 30 * o.hema}" ry="${22 + 34 * o.hema}" fill="url(#gClot)" opacity=".92"/>` : '');

// ═════════ Băng huyết: tên bệnh chưa cho biết cách cầm máu
kit('bp-som', {
  init: () => ({ h: 2, lo: true, hi: false }), ui: () => [{ t: 'range', k: 'h', label: '⏱ Thời điểm chảy máu sau sinh', min: 0, max: 100, step: 5, unit: '' }], after: s => { if (s.h < 40) s.lo = true; else s.hi = true; }, goal: s => s.lo && s.hi,
  draw: s => {
    const muon = s.h >= 40, X = 50 + s.h * 4.6;
    let o = card(20, 20, 530, 230, muon ? '#f6f3ff' : '#fff5f6') + T(285, 52, muon ? 'BHSS MUỘN (sau 24 giờ → 12 tuần)' : 'BHSS SỚM (trong 24 giờ)', { s: 16, c: muon ? '#5b45b5' : C.redD });
    const L = muon ? [['🧩', 'Sót mô nhau'], ['🦠', 'Nhiễm trùng'], ['❓', 'Bệnh lý khác']] : [['😮‍💨', 'Tone'], ['✂️', 'Trauma'], ['🧩', 'Tissue'], ['🩸', 'Thrombin']];
    o += L.map(([ic, t], i) => { const w = muon ? 150 : 112, x = 285 - (L.length * (w + 12) - 12) / 2 + i * (w + 12); return `<g class="fadein">${card(x, 76, w, 130, '#fff')}${T(x + w / 2, 134, ic, { s: 36 })}${T(x + w / 2, 182, t, { s: 15 })}</g>`; }).join('');
    o += T(285, 236, muon ? 'không áp nguyên xi xử trí đờ ngay sau sinh' : 'tìm cả 4 nhóm, có thể cùng lúc', { s: 13, c: C.mute });
    o += `<path d="M50 290 H510" stroke="${C.grid}" stroke-width="10" stroke-linecap="round"/><path d="M50 290 H${X}" stroke="${muon ? C.lavD : C.pinkD}" stroke-width="10" stroke-linecap="round"/><path d="M234 280 V300" stroke="${C.ink}" stroke-width="2"/>` + T(234, 274, '24 giờ', { s: 12.5 }) + T(60, 318, 'sinh', { s: 12, c: C.mute }) + T(500, 318, '12 tuần', { s: 12, c: C.mute }) + `<circle cx="${X}" cy="290" r="11" fill="#fff" stroke="${C.soft}" stroke-width="3"/>`;
    return o;
  },
  say: s => s.lo && s.hi ? ['happy', 'BHSS **sớm** (≤ 24 giờ) → nghĩ **4T**. BHSS **muộn** (tới 12 tuần) → nghĩ **sót mô, nhiễm trùng**, bệnh lý khác.'] : ['happy', 'Kéo thanh **⏱ Thời điểm** qua mốc **24 giờ** 👆']
});
kit('bp-dn', {
  init: () => ({ d: 'thuong', ml: 400, seen: 'thuong,' }), ui: () => [{ t: 'seg', k: 'd', opts: [['thuong', '🤱 Sinh thường'], ['mo', '🏥 Mổ lấy thai']] }, { t: 'range', k: 'ml', label: '🩸 Máu đo', min: 0, max: 1200, step: 50, unit: ' mL' }], after: s => markSeen(s, s.d), goal: s => seen(s, 'mo') && seen(s, 'thuong'),
  draw: s => {
    const def = s.d === 'mo' ? 1000 : 500, X = v => 60 + v / 1200 * 440, isDef = s.ml >= def, trig = s.ml >= 500;
    let o = card(20, 20, 530, 316, '#fffdfa') + `<path d="M60 150 H500" stroke="${C.grid}" stroke-width="18" stroke-linecap="round"/><path d="M60 150 H${X(s.ml)}" stroke="${C.red}" stroke-width="18" stroke-linecap="round"/>` + T(X(s.ml), 120, s.ml + ' mL', { s: 15 });
    o += `<path d="M${X(def)} 96 V176" stroke="${C.soft}" stroke-width="3" stroke-dasharray="5 4"/>` + T(X(def), 88, 'định nghĩa ' + def, { s: 12.5, c: C.soft }) + `<path d="M${X(500)} 130 V196" stroke="${C.red}" stroke-width="3"/>` + T(X(500), 212, 'trigger khởi trị 500', { s: 12.5, c: C.redD }) + `<path d="M${X(300)} 140 V196" stroke="${C.amber}" stroke-width="3"/>` + T(X(300), 228, '300 + HĐ bất thường', { s: 11.5, c: '#b8860b' });
    o += verdict(60, 256, 210, !isDef, isDef ? 'đủ ĐỊNH NGHĨA' : 'chưa đủ định nghĩa', 'để mô tả, thống kê') + verdict(300, 256, 210, !trig, trig ? 'ĐÃ tới trigger' : 'chưa tới trigger', 'để HÀNH ĐỘNG');
    return o;
  },
  say: s => seen(s, 'mo') && seen(s, 'thuong') ? ['worry', '**Định nghĩa** (500 sinh thường / 1000 mổ) để **mô tả**; **trigger** để **hành động sớm**. Huyết động quan trọng hơn con số ước bằng mắt.'] : ['happy', 'Kéo **🩸 Máu đo** tới 700 mL, rồi đổi giữa **Sinh thường** và **Mổ lấy thai** 👆']
});
const T4 = [['tone', 'Tone'], ['tissue', 'Tissue'], ['trauma', 'Trauma'], ['thrombin', 'Thrombin']];
kit('bp-cung', {
  init: () => ({ tone: false, tissue: false, trauma: false, thrombin: false }), ui: () => [], goal: s => T4.filter(([k]) => s[k]).length >= 2,
  draw: s => {
    const R = bed({ det: 1, co: s.tone ? .1 : .85, frag: s.tissue, plug: s.thrombin ? 'thieu' : s.tone ? '' : 'du', noPlac: true });
    let o = `<svg x="0" y="0" width="560" height="350" viewBox="0 0 560 350"><g transform="translate(10 0) scale(.86 1)">${card(10, 20, 440, 316, '#fffdfa')}${R.svg}</g></svg>`;
    if (s.trauma) o += `<g class="fadein" transform="translate(250 236)"><ellipse rx="44" ry="34" fill="${C.pink}" stroke="${C.pinkD}"/><ellipse rx="12" ry="20" fill="#fff" stroke="${C.myoD}"/><path d="M8 18 L18 34 L12 44" fill="none" stroke="${C.redD}" stroke-width="3"/>${drops(14, 56, 2, .7)}</g>`;
    o += T4.map(([k, t], i) => tcard('!' + k, 404, 20 + i * 80, 146, 70, s[k], [t], '#ffe0e6')).join('');
    return o;
  },
  say: s => T4.filter(([k]) => s[k]).length >= 2 ? ['worry', 'Một ca có thể **nhiều T cùng lúc** — vd tử cung mềm **và** nhau thiếu múi = **Tone + Tissue**. Tìm đủ cả bốn.'] : ['happy', 'Bật **hai T cùng lúc** — nhìn giường nhau chảy máu theo kiểu nào 👆']
});
B['dinh-nghia-4t'] = [
  { t: 'BHSS sớm hay muộn?', kit: 'bp-som' },
  { t: 'Định nghĩa khác trigger', kit: 'bp-dn' },
  { t: 'Bốn T có thể cùng lúc', kit: 'bp-cung' }
];

// ═════════ Bundle
const BUN = [['💆', 'Xoa tử cung'], ['💉', 'Thuốc co hồi'], ['🧪', 'TXA'], ['💧', 'Dịch IV'], ['🔍', 'Khám đường SD + nhau'], ['📣', 'Gọi tăng mức']];
kit('bp-bundle', {
  init: () => ({ c: '', seen: '' }), ui: () => [{ t: 'seg', k: 'c', opts: [['tt', '🐢 Làm lần lượt'], ['ss', '⚡ Bundle: cùng lúc']] }], after: s => markSeen(s, s.c), goal: s => seen(s, 'tt') && seen(s, 'ss'),
  draw: s => {
    const X = m => 170 + m * 10.5, ss = s.c === 'ss';
    let o = card(20, 20, 530, 316, '#fffdfa') + [0, 10, 15, 20, 30, 35].map(m => `<path d="M${X(m)} 50 V290" stroke="${m === 15 ? C.green : C.grid}" stroke-width="${m === 15 ? 2.4 : 1}" ${m === 15 ? 'stroke-dasharray="6 4"' : ''}/>` + T(X(m), 44, m + "′", { s: 11.5, c: m === 15 ? C.green : C.mute })).join('');
    o += BUN.map(([ic, t], i) => { const y = 62 + i * 38, st = ss ? 0 : i * 6, len = ss ? 8 + (i % 3) * 2 : 6; return T(158, y + 18, ic + ' ' + t, { a: 'end', s: 12.5 }) + (s.c ? `<rect x="${X(st)}" y="${y + 4}" width="${X(st + len) - X(st)}" height="20" rx="10" fill="${ss ? C.mintD : (st + len > 15 ? '#ffb15c' : C.skyD)}"><animate attributeName="width" from="0" to="${X(st + len) - X(st)}" dur=".5s" begin="${ss ? 0 : i * .25}s" fill="freeze"/></rect>` : ''); }).join('');
    o += s.c ? verdict(60, 294, 450, ss, ss ? 'Tất cả khởi động trong 15 phút' : 'Xong việc cuối ở phút 36 — quá muộn') : T(285, 312, '👆 chọn cách làm ở trên', { s: 14, c: C.soft });
    return o;
  },
  say: s => seen(s, 'tt') && seen(s, 'ss') ? ['wow', 'WHO 2025: **xoa tử cung, thuốc co hồi, TXA, dịch IV, khám nguồn, gọi tăng mức** — khởi động **cùng lúc**, lý tưởng **trong 15 phút**.'] : ['happy', 'Sáu việc khi chẩn đoán BHSS. So **làm lần lượt** với **bundle** 👆']
});
const ROLE = [['hs', '🫁', 'Hồi sức', 'ABC, đường truyền'], ['tc', '🤲', 'Tử cung & đường SD', 'xoa, khám nguồn'], ['th', '💊', 'Thuốc & máu', 'pha, gọi ngân hàng'], ['gh', '⏱️', 'Ghi giờ & diễn tiến', 'đọc to mốc thời gian']];
kit('bp-phan', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => ROLE.every(([k]) => seen(s, k)),
  draw: s => {
    let o = card(20, 20, 290, 316, '#fffdfa') + `<rect x="115" y="140" width="100" height="70" rx="12" fill="${C.sky}" stroke="${C.skyD}"/>` + T(165, 182, '🛏️ mẹ', { s: 16 });
    const P = [[70, 90], [260, 90], [70, 270], [260, 270]];
    o += ROLE.map(([k, ic], i) => seen(s, k) ? `<g class="fadein"><circle cx="${P[i][0]}" cy="${P[i][1]}" r="28" fill="${C.lav}" stroke="${C.soft}"/>${T(P[i][0], P[i][1] + 10, ic, { s: 24 })}</g>` : `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="28" fill="none" stroke="${C.grid}" stroke-dasharray="5 4"/>`).join('');
    o += ROLE.map(([k, ic, a, b], i) => tcard('!' + k, 322, 20 + i * 80, 228, 70, seen(s, k), [ic + ' ' + a, b])).join('');
    return o;
  },
  say: s => ROLE.every(([k]) => seen(s, k)) ? ['happy', 'Phân công rõ: **hồi sức · tử cung & đường sinh dục · thuốc & máu · ghi giờ**. Một người một việc, mọi việc cùng chạy.'] : ['happy', 'Giao **4 vai** cho đội — bật từng thẻ 👆']
});
kit('bp-lai', {
  init: () => ({ con: false }), ui: () => [{ t: 'tog', k: 'con', label: '🩸 Sau bundle: máu vẫn chảy?' }], goal: s => s.con,
  draw: s => {
    let o = card(20, 20, 530, 316, '#fffdfa') + `<rect x="200" y="40" width="170" height="44" rx="14" fill="${C.mint}"/>` + T(285, 68, 'Bundle 15 phút', { s: 15 });
    o += arrow('M285 86 V112', C.ink, 3) + `<rect x="200" y="114" width="170" height="44" rx="14" fill="${s.con ? '#ffd0d8' : '#f4f0fb'}"/>` + T(285, 142, 'Đánh giá lại nhanh', { s: 14 });
    if (s.con) o += ZS.fade([['🎈', 'Bóng chèn, ép tử cung', 40], ['🔪', 'Phẫu thuật, nút mạch', 207], ['🩸', 'Truyền máu lượng lớn', 374]].map(([ic, t, x]) => arrow(`M285 160 L${x + 78} 196`, C.red, 3) + `<rect x="${x}" y="200" width="156" height="80" rx="14" fill="#fff" stroke="${C.red}"/>` + T(x + 78, 232, ic, { s: 22 }) + T(x + 78, 262, t, { s: 12.5 })).join('') + T(285, 316, 'huy động sớm — không đợi thêm một vòng thuốc', { s: 13, c: C.redD }), ZS.fresh(s, x => x.con));
    else o += T(285, 230, 'đỡ → tiếp tục theo dõi sát', { s: 14, c: C.green });
    return o;
  },
  say: s => s.con ? ['worry', 'Chảy **không dừng** hoặc nguồn cần phẫu thuật → **huy động can thiệp sớm**. Thứ tự thật tùy mức nặng và đội.'] : ['happy', 'Bundle xong. Nếu **máu vẫn chảy** thì sao? Bật công tắc 👆']
});
B['bundle'] = [
  { t: 'Bundle: mọi việc cùng lúc', kit: 'bp-bundle' },
  { t: 'Một người một việc', kit: 'bp-phan' },
  { t: 'Đánh giá lại, leo thang sớm', kit: 'bp-lai' }
];

// ═════════ Tone
kit('bp-sotc', {
  init: () => ({ tt: '', seen: '' }), ui: () => [{ t: 'seg', k: 'tt', opts: [['chac', '🟢 Chắc liên tục'], ['mem', '🔴 Mềm, to'], ['xoa', '🟠 Chắc khi xoa rồi mềm lại']] }], after: s => markSeen(s, s.tt), goal: s => seen(s, 'xoa') && seen(s, 'mem'),
  draw: s => {
    const k = s.tt === 'chac' ? .5 : .72;
    let o = card(20, 20, 300, 316, '#fffdfa');
    o += s.tt === 'xoa' ? `<g transform="translate(170 180)"><g><animateTransform attributeName="transform" type="scale" values="1;.74;.74;1" keyTimes="0;.3;.6;1" dur="2.4s" repeatCount="indefinite"/><g transform="translate(-170 -180)">${ZS.uterusSag({ x: 170, y: 70, k: .72 })}</g></g></g><g transform="translate(140 36)"><g><animateTransform attributeName="transform" type="translate" values="0 0;14 6;0 12;-14 6;0 0" dur="1.2s" repeatCount="indefinite"/>${pic('sv-ban-tay.png', 0, 0, 56, 96, 'transform="rotate(180 28 48)"')}</g></g>` : ut(170, s.tt === 'chac' ? 110 : 70, k, { soft: s.tt === 'mem' });
    if (s.tt && s.tt !== 'chac') o += drops(170, 300, s.tt === 'mem' ? 3 : 2, .8, 16);
    o += card(332, 20, 218, 316);
    const M = { chac: ['Co tốt', 'kẹp sống đang siết', C.green], mem: ['ĐỜ tử cung', 'mạch giường nhau còn mở', C.redD], xoa: ['Chưa giải quyết!', 'chỉ chắc lúc đang xoa', '#c0561a'] }[s.tt];
    o += M ? ZS.fade(T(441, 120, M[0], { s: 20, c: M[2] }) + T(441, 150, M[1], { s: 13, c: C.mute }), ZS.fresh(s, x => x.tt === s.tt)) : T(441, 150, '👆 chọn cảm giác khi sờ', { s: 13, c: C.soft });
    return o;
  },
  say: s => seen(s, 'xoa') && seen(s, 'mem') ? ['worry', 'Tử cung **mềm, to** = đờ: mạch giường nhau còn mở. **Chỉ chắc trong lúc xoa rồi mềm lại** = vấn đề **chưa được giải quyết**.'] : ['happy', 'Tay sờ đáy tử cung qua bụng. Thử **cả ba** cảm giác 👆']
});
const CA = [['cang', '🎈', 'Quá căng'], ['moi', '😴', 'Cơ mỏi (CD, tăng co lâu)'], ['nt', '🦠', 'Nhiễm trùng'], ['thuoc', '💊', 'Thuốc giảm co'], ['sot', '🧩', 'Sót nhau']];
kit('bp-vs', {
  init: () => ({ sel: '', seen: '' }), ui: () => [], after: sel, goal: s => CA.every(([k]) => seen(s, k)),
  draw: s => {
    const c = s.sel;
    let o = card(20, 20, 300, 316, '#fffdfa') + ut(170, c === 'cang' ? 40 : 70, c === 'cang' ? .9 : .72, { soft: !!c });
    if (c === 'moi') o += `<g class="fadein">${T(230, 100, 'z', { s: 22, c: C.soft })}${T(250, 80, 'z', { s: 28, c: C.soft })}</g>`;
    if (c === 'nt') o += `<g class="fadein">${[[130, 130], [200, 150], [160, 190], [220, 110], [120, 170]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#9bd16f" stroke="#5d9a3a"/>`).join('')}</g>`;
    if (c === 'thuoc') o += `<g class="fadein">${T(250, 90, '💊', { s: 30 })}</g>`;
    if (c === 'sot') o += `<g class="fadein"><path d="M130 90 Q150 70 190 80 Q200 100 170 110Z" fill="url(#gPlac)" stroke="${C.placD}"/></g>`;
    o += CA.map(([k, ic, t], i) => pcard('sel=' + k, 332, 20 + i * 63, 218, 56, seen(s, k), c === k, [ic + ' ' + t])).join('');
    return o;
  },
  say: s => CA.every(([k]) => seen(s, k)) ? ['happy', 'Tìm nguyên nhân đờ: **quá căng, cơ mỏi, nhiễm trùng, thuốc giảm co, sót nhau**. Đờ thường gặp nhưng **không phải mọi BHSS đều là đờ**.'] : ['happy', 'Vì sao cơ không co? Chạm **từng nguyên nhân** 👆']
});
kit('bp-bq', {
  init: () => ({ sonde: false }), ui: () => [{ t: 'tog', k: 'sonde', label: '🚽 Làm trống bàng quang' }], goal: s => s.sonde,
  draw: s => {
    const f = s.sonde;
    let o = card(20, 20, 300, 316, '#fffdfa') + ut(150, f ? 92 : 48, f ? .58 : .7, { soft: !f });
    o += `<ellipse cx="236" cy="${f ? 286 : 262}" rx="${f ? 30 : 62}" ry="${f ? 16 : 50}" fill="${C.bladder}" stroke="#86b6e6" stroke-width="1.6">${ZS.tw('rx', s._p ? (s._p.sonde ? 30 : 62) : null, f ? 30 : 62)}${ZS.tw('ry', s._p ? (s._p.sonde ? 16 : 50) : null, f ? 16 : 50)}</ellipse>` + Th(236, f ? 316 : 324, 'bàng quang', { s: 12.5, c: '#2b6cb0' });
    if (!f) o += drops(150, 300, 2, .7) + arrow('M236 210 L200 180', '#2b6cb0', 3);
    o += card(332, 20, 218, 316) + T(441, 60, 'Co hồi', { s: 13, c: C.mute }) + ZS.bar(352, 72, 178, f ? 85 : 45, f ? C.green : C.red, '', { h: 16 }) + T(441, 130, f ? 'tử cung xuống, co chắc' : 'bàng quang căng đẩy', { s: 13 }) + T(441, 150, f ? '' : 'tử cung lên, co kém', { s: 13 });
    o += T(441, 210, 'cùng lúc:', { s: 12.5, c: C.mute }) + ['xoa tử cung', 'oxytocin đầu tay', 'hồi sức'].map((t, i) => T(441, 234 + i * 20, '✓ ' + t, { s: 13, c: C.green })).join('');
    return o;
  },
  say: s => s.sonde ? ['wow', 'Bàng quang căng **đẩy tử cung lên**, cản co. **Làm trống bàng quang** + xoa + oxytocin đầu tay. Đáp ứng kém → thuốc khác, ép/bóng chèn, ngoại khoa.'] : ['happy', 'Mẹ chưa đi tiểu sau sinh. Bấm **🚽 Làm trống bàng quang** 👆']
});
B['tone'] = [
  { t: 'Sờ đáy: chắc, mềm, hay giả chắc?', kit: 'bp-sotc' },
  { t: 'Vì sao cơ không co?', kit: 'bp-vs' },
  { t: 'Bàng quang căng cản co hồi', kit: 'bp-bq' }
];

// ═════════ Oxytocin điều trị
kit('bp-oxt', {
  init: () => ({ c: '', seen: '' }), ui: () => [{ t: 'seg', k: 'c', opts: [['bolus', '💉 10 IU IV chậm 1–2′'], ['truyen', '💧 Truyền trong 5–10′'], ['duy', '⏳ Duy trì 10–20 IU / dịch']] }], after: s => markSeen(s, s.c), goal: s => ['bolus', 'truyen', 'duy'].every(k => seen(s, k)),
  draw: s => {
    let o = card(20, 20, 300, 316, '#fffdfa');
    o += s.c === 'bolus' ? pic('sv-bom-tiem.png', 40, 120, 260, 82) : pic('sv-dich-truyen.png', 110, 40, 120, 166) + (s.c ? flow('M170 206 V320', 4, '#7cb8f0', 1.6, 4) : '');
    o += T(170, 300, s.c === 'duy' ? 'chỉnh theo đáp ứng trong 4 giờ' : s.c === 'truyen' ? 'liều đầu truyền nhanh 5–10 phút' : s.c === 'bolus' ? 'pha loãng, đẩy chậm' : '', { s: 13, c: C.mute });
    o += card(332, 20, 218, 316) + T(441, 56, 'WHO 2025', { s: 13, c: C.mute }) + T(441, 86, 'oxytocin IV đầu tay', { s: 15 });
    o += [['đã dự phòng', 'VẪN dùng điều trị'], ['theo dõi', 'huyết động, dịch, co hồi'], ['số giọt?', 'theo nồng độ & quy trình']].map(([a, b], i) => T(352, 140 + i * 56, a, { a: 'start', s: 12.5, c: C.mute }) + T(352, 160 + i * 56, b, { a: 'start', s: 13.5 })).join('');
    return o;
  },
  say: s => ['bolus', 'truyen', 'duy'].every(k => seen(s, k)) ? ['happy', 'Đã dự phòng **vẫn dùng** oxytocin điều trị: **10 IU IV chậm 1–2′** hoặc **truyền 5–10′**, duy trì **10–20 IU** trong dịch tinh thể, chỉnh theo đáp ứng **4 giờ**.'] : ['happy', 'Mẹ đã tiêm oxytocin dự phòng mà vẫn băng huyết. Bấm **cả 3 bước** dùng thuốc 👆']
});
kit('bp-na', {
  init: () => ({ h: 0 }), ui: () => [{ t: 'range', k: 'h', label: '⏳ Liều cao kéo dài + dịch nhược trương', min: 0, max: 12, step: 1, unit: ' giờ' }], goal: s => s.h >= 9,
  draw: s => {
    const na = Math.round(138 - s.h * 1.4), low = na < 128;
    let o = card(20, 20, 300, 316, '#fffdfa') + pic('sv-dich-truyen.png', 60, 40, 90, 124) + T(105, 186, 'nhược trương', { s: 12.5, c: C.mute }) + flow('M105 164 V240', 4, '#bfe1ff', 1.4, 4);
    o += `<circle cx="226" cy="150" r="${44 + (low ? 8 : 0)}" fill="#ffe9ef" stroke="${low ? C.red : C.soft}" stroke-width="2"/>` + T(226, 160, '🧠', { s: 34 }) + T(226, 226, low ? 'phù não, co giật' : 'não', { s: 13, c: low ? C.redD : C.mute });
    o += card(332, 20, 218, 316) + T(441, 60, 'Natri máu', { s: 13, c: C.mute }) + T(441, 110, na + ' mmol/L', { s: 26, c: low ? C.redD : C.ink }) + ZS.bar(352, 130, 178, (na - 115) / 30 * 100, low ? C.red : C.green, '', { h: 14 }) + T(441, 186, 'oxytocin giống ADH:', { s: 12.5, c: C.mute }) + T(441, 206, 'giữ nước tự do', { s: 13 }) + T(441, 300, 'số minh họa xu hướng', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.h >= 9 ? ['ouch', 'Oxytocin **liều cao kéo dài** cùng nhiều **dịch nhược trương** → giữ nước → **hạ natri máu** (phù não, co giật). Theo dõi dịch vào – điện giải.'] : ['happy', 'Kéo thanh **⏳** — truyền oxytocin liều cao nhiều giờ với dịch nhược trương 👆']
});
kit('bp-tang', {
  init: () => ({ tang: false, tim: false }), ui: () => [{ t: 'tog', k: 'tang', label: '⬆️ Tăng liều oxytocin' }, { t: 'tog', k: 'tim', label: '🔍 Tìm nguồn khác' }], goal: s => s.tim,
  draw: s => {
    let o = card(20, 20, 300, 316, '#fffdfa') + ut(170, 70, .52) + Th(170, 46, 'tử cung CHẮC', { s: 13, c: C.green });
    o += `<g transform="translate(170 270)"><ellipse rx="44" ry="30" fill="${C.pink}" stroke="${C.pinkD}"/><ellipse rx="12" ry="18" fill="#fff" stroke="${C.myoD}"/>${s.tim ? `<path d="M8 16 L18 30 L12 40" fill="none" stroke="${C.redD}" stroke-width="3" class="fadein"/>` : ''}${s.tim ? '' : drops(0, 50, 2, .7)}</g>` + (s.tim ? ZS.fade(call(180, 290, 260, 330, 'rách cổ tử cung', C.redD, 'middle', 13), true) : '');
    o += card(332, 20, 218, 316) + (s.tang ? T(441, 90, 'Tăng liều…', { s: 15 }) + T(441, 116, 'máu VẪN chảy', { s: 15, c: C.redD }) + T(441, 140, '(cơ đã co rồi!)', { s: 12.5, c: C.mute }) : '') + (s.tim ? ZS.fade(verdict(348, 190, 186, true, 'tìm ra vết rách', '→ khâu cầm máu'), ZS.fresh(s, x => x.tim)) : '');
    return o;
  },
  say: s => s.tim ? ['wow', 'Tử cung **chắc** mà vẫn chảy → **không tăng liều** để trì hoãn; đi **tìm nguồn khác** (rách, sót, đông máu) song song hồi sức.'] : s.tang ? ['worry', 'Tử cung đã chắc — thêm thuốc **không giải quyết** được. Thử nút còn lại 👆'] : ['happy', 'Sau oxytocin tử cung **chắc**, máu vẫn nhiều. Thử **⬆️ Tăng liều** trước 👆']
});
B['oxytocin-dieu-tri'] = [
  { t: 'Đã dự phòng vẫn dùng điều trị', kit: 'bp-oxt', cr: 'Bơm tiêm, dịch truyền: ' + SV },
  { t: 'Liều cao kéo dài: hạ natri', kit: 'bp-na', cr: 'Dịch truyền: ' + SV },
  { t: 'Chắc mà vẫn chảy: đừng tăng mãi', kit: 'bp-tang' }
];

// ═════════ Thuốc gò hàng hai
const DR = [['me', 'Methylergometrine', '0,2 mg tiêm bắp', 'lặp 2–4 giờ, tối đa 5 liều', 'không IV nhanh', ['tha', 'tim']], ['ca', 'Carboprost', '250 µg tiêm bắp sâu', 'lặp 15–90′, tối đa 2 mg / 8 liều', 'KHÔNG tiêm tĩnh mạch', ['hen', 'tim']], ['mi', 'Misoprostol', '800 µg ngậm dưới lưỡi', 'khi oxytocin không có / không đáp ứng', 'sốt, rét run', []]];
kit('bp-ccd', {
  init: () => ({ tha: false, hen: false, tim: false }), ui: () => [], goal: s => s.tha && s.hen,
  draw: s => {
    let o = [['tha', '🩺 THA, tiền sản giật'], ['hen', '🌬️ Hen'], ['tim', '❤️ Bệnh tim']].map(([k, t], i) => tcard('!' + k, 20 + i * 178, 20, 170, 56, s[k], [t], '#ffe0e6')).join('');
    o += DR.map(([k, n, d1], i) => { const x = 20 + i * 178, bad = DR[i][5].some(c => s[c]);
      return `<g>${card(x, 92, 170, 244, bad ? '#ffd0d8' : '#fff', bad ? C.red : C.grid)}${pic('sv-bom-tiem.png', x + 20, 110, 130, 41)}${T(x + 85, 186, n, { s: 14 })}${T(x + 85, 208, d1, { s: 12, c: C.mute })}${bad ? `<g class="fadein">${T(x + 85, 268, '⛔', { s: 34 })}${T(x + 85, 308, 'TRÁNH', { s: 16, c: C.redD })}</g>` : T(x + 85, 290, '✓ có thể', { s: 15, c: C.green })}</g>`; }).join('');
    return o;
  },
  say: s => s.tha && s.hen ? ['worry', 'Không có thuốc “mạnh nhất cho mọi người”: **tăng HA, tiền sản giật** → tránh **methylergometrine**; **hen** → tránh **carboprost**.'] : ['happy', 'Bật **bệnh nền** của mẹ ở hàng trên — thuốc nào bị loại? 👆']
});
kit('bp-the', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => DR.every(([k]) => seen(s, k)),
  draw: s => DR.map(([k, n, d1, d2, d3], i) => { const x = 20 + i * 178, sn = seen(s, k);
    return `<g class="tap" data-set="!${k}"><g transform="translate(${x + 85} 178)"><g transform="scale(${sn ? 1 : 1} 1)">${sn && ZS.fresh(s, z => seen(z, k)) ? '<animateTransform attributeName="transform" type="scale" values="1 1;0 1;1 1" dur=".5s"/>' : ''}<g transform="translate(${-x - 85} -178)">${card(x, 20, 170, 316, sn ? '#fffdf4' : C.lav, sn ? C.butterD : C.soft)}${sn ? T(x + 85, 56, n, { s: 14.5 }) + T(x + 85, 104, d1, { s: 14, c: C.redD }) + ZS.wrap(d2, 18).map((l, j) => T(x + 85, 150 + j * 20, l, { s: 13 })).join('') + T(x + 85, 250, d3, { s: 13, c: '#b5651d' }) : T(x + 85, 150, '💊', { s: 40 }) + T(x + 85, 200, n, { s: 14 }) + T(x + 85, 240, '👆 lật thẻ', { s: 13, c: C.soft })}</g></g></g></g>`; }).join(''),
  say: s => DR.every(([k]) => seen(s, k)) ? ['happy', '**Methylergometrine 0,2 mg IM** · **Carboprost 250 µg IM sâu, không IV** · **Misoprostol 800 µg ngậm dưới lưỡi**. Là nội dung học có nguồn, không phải đơn thuốc cá thể.'] : ['happy', 'Lật **3 thẻ thuốc** xem liều và đường dùng 👆']
});
kit('bp-tron', {
  init: () => ({ ng: 'who', seen: 'who,' }), ui: () => [{ t: 'seg', k: 'ng', opts: [['who', '🌍 WHO / FIGO'], ['td', '🏥 Từ Dũ 2018']] }], after: s => markSeen(s, s.ng), goal: s => seen(s, 'td'),
  draw: s => {
    const td = s.ng === 'td', R = [['Misoprostol', '800 µg ngậm dưới lưỡi', '800 µg đặt hậu môn'], ['Carboprost lặp lại', 'mỗi 15–90 phút', 'mỗi 30–90 phút']];
    let o = card(20, 20, 530, 316, '#fffdfa') + T(285, 56, td ? 'Phác đồ Từ Dũ 2018' : 'WHO 2025 / FIGO', { s: 17, c: td ? '#2b6cb0' : C.green });
    o += R.map(([a, w, t], i) => `<rect x="44" y="${84 + i * 92}" width="482" height="80" rx="16" fill="${td ? '#eef6ff' : '#eefaf3'}" stroke="${C.grid}"/>` + T(70, 116 + i * 92, a, { a: 'start', s: 14, c: C.mute }) + `<g class="fadein">${T(70, 146 + i * 92, td ? t : w, { a: 'start', s: 19 })}</g>`).join('');
    o += T(285, 292, '“Ergometrine” ≠ “methylergometrine”: khác tên, khác liều', { s: 13, c: C.redD }) + T(285, 316, 'đừng trộn hai phác đồ trong một lần dùng thuốc', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => seen(s, 'td') ? ['worry', 'Hai nguồn ghi khác nhau (misoprostol **dưới lưỡi** vs **hậu môn**, carboprost lặp **15–90′** vs **30–90′**). Biết rõ đang theo phác đồ nào, **không trộn**.'] : ['happy', 'Bấm **🏥 Từ Dũ 2018** để so với WHO 👆']
});
B['thuoc-go-hang-hai'] = [
  { t: 'Chọn thuốc theo chống chỉ định', kit: 'bp-ccd', cr: 'Bơm tiêm: ' + SV },
  { t: 'Ba thẻ thuốc: liều và đường', kit: 'bp-the' },
  { t: 'Đừng trộn hai phác đồ', kit: 'bp-tron' }
];

// ═════════ TXA
kit('bp-txa', {
  init: () => ({ txa: false }), ui: () => [{ t: 'tog', k: 'txa', label: '🛡 Cho TXA' }], goal: s => s.txa,
  draw: s => {
    const lines = [...Array(9)].map((_, i) => [40 + i * 32, 60, 300 - i * 18, 300]), cut = !s.txa;
    let o = card(20, 20, 340, 316, '#fffdfa') + T(190, 46, 'Lưới fibrin bịt mạch', { s: 14, c: C.mute });
    o += lines.map(([x1, y1, x2, y2], i) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#e8c95a" stroke-width="4" ${cut && i % 2 ? 'stroke-dasharray="40 14"' : ''}>${cut && i % 2 ? '<animate attributeName="stroke-dashoffset" from="0" to="-54" dur="1.6s" repeatCount="indefinite"/>' : ''}</path>`).join('') + [...Array(8)].map((_, i) => `<path d="M40 ${80 + i * 30} L330 ${70 + i * 32}" stroke="#e8c95a" stroke-width="3.4" ${cut && i % 3 === 0 ? 'stroke-dasharray="30 18"' : ''}/>`).join('');
    o += [[110, 120], [230, 200], [170, 260]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${cut ? `<animateTransform attributeName="transform" type="translate" values="${x} ${y};${x + 20} ${y - 10};${x} ${y}" dur="${1.4 + i * .3}s" repeatCount="indefinite"/>` : ''}<circle r="16" fill="${s.txa ? '#ddd' : '#b58ce8'}" stroke="${C.soft}"/>${T(0, 5, '✂️', { s: 15 })}${s.txa ? `<circle r="20" fill="none" stroke="${C.green}" stroke-width="3"/><path d="M-14 -14 L14 14" stroke="${C.green}" stroke-width="3"/>` : ''}</g>`).join('');
    o += card(372, 20, 178, 316) + T(461, 56, 'plasmin', { s: 14, c: '#7b4fc9' }) + T(461, 76, '= kéo cắt fibrin', { s: 12.5, c: C.mute }) + (s.txa ? ZS.fade(verdict(388, 110, 146, true, 'lưới bền', 'TXA chặn plasmin') + T(461, 240, 'nhưng TXA', { s: 13 }) + T(461, 260, 'KHÔNG làm co', { s: 14, c: C.redD }) + T(461, 280, 'tử cung', { s: 13 }), ZS.fresh(s, x => x.txa)) : verdict(388, 110, 146, false, 'lưới bị cắt', 'nút cầm máu bở'));
    return o;
  },
  say: s => s.txa ? ['wow', '**TXA** cản plasminogen → plasmin **không cắt** được fibrin → nút cầm máu **bền hơn**. TXA không làm co tử cung — vẫn phải sửa nguồn chảy.'] : ['happy', 'Plasmin ✂️ đang cắt lưới fibrin. Bấm **🛡 Cho TXA** 👆']
});
kit('bp-3h', {
  init: () => ({ phat: 1, cho: 1.5, seen: '' }), ui: () => [{ t: 'range', k: 'phat', label: '🔎 Phát hiện BHSS lúc', min: 0, max: 4, step: .5, unit: ' giờ' }, { t: 'range', k: 'cho', label: '💉 Cho TXA lúc', min: 0, max: 6, step: .5, unit: ' giờ' }], after: s => { if (s.cho > 3) markSeen(s, 'tre'); }, goal: s => seen(s, 'tre') && s.cho <= 3 && s.cho >= s.phat,
  draw: s => {
    const X = h => 60 + h / 6 * 440, ok = s.cho <= 3;
    let o = card(20, 20, 530, 316, '#fffdfa') + `<rect x="${X(0)}" y="110" width="${X(3) - X(0)}" height="60" rx="10" fill="${C.mint}"/>` + T((X(0) + X(3)) / 2, 100, 'cửa sổ 3 giờ TÍNH TỪ LÚC SINH', { s: 13.5, c: C.green });
    o += `<path d="M60 172 H500" stroke="${C.ink}" stroke-width="2"/>` + [0, 1, 2, 3, 4, 5, 6].map(h => `<path d="M${X(h)} 166 V178" stroke="${C.ink}"/>` + T(X(h), 196, h + 'g', { s: 12, c: C.mute })).join('') + T(X(0), 220, '👶 sinh', { s: 13 });
    o += `<path d="M${X(s.phat)} 112 V170" stroke="${C.amber}" stroke-width="3" stroke-dasharray="5 4"/>` + T(X(s.phat), 244, '🔎 phát hiện', { s: 12.5, c: '#b8860b' });
    o += `<circle cx="${X(s.cho)}" cy="140" r="14" fill="${ok ? C.green : C.red}"/>` + T(X(s.cho), 145, '💉', { s: 13 });
    o += verdict(60, 264, 440, ok, ok ? '✓ trong cửa sổ' : '✗ quá 3 giờ từ lúc sinh', '1 g IV trong 10 phút · thêm 1 g nếu còn chảy sau 30′ / chảy lại trong 24 giờ');
    return o;
  },
  say: s => seen(s, 'tre') && s.cho <= 3 ? ['wow', 'TXA **1 g IV trong 10 phút**, khởi đầu **trong 3 giờ tính từ lúc SINH** — không phải từ lúc phát hiện BHSS. Thêm 1 g nếu còn chảy sau 30 phút.'] : ['happy', 'Kéo **💉 Cho TXA** quá 3 giờ xem sao, rồi kéo về trong cửa sổ 👆']
});
tfKit('bp-txaq', [['TXA thay được thuốc gò', false], ['Chờ thuốc gò thất bại mới cho TXA', false], ['Chỉ dùng TXA khi đờ tử cung', false], ['Dùng sớm cùng chăm sóc chuẩn', true], ['Tránh khi có huyết khối đã biết', true], ['Suy rộng liều này cho mọi DIC, AFE', false]], 'TXA **sớm, cùng bundle**, không chỉ cho đờ; không thay thuốc gò; tránh khi có chống chỉ định huyết khối; **không tự suy rộng** sang mọi chảy máu.');
B['txa'] = [
  { t: 'TXA giữ lưới fibrin', kit: 'bp-txa' },
  { t: 'Cửa sổ 3 giờ từ lúc sinh', kit: 'bp-3h' },
  { t: 'Sáu câu về TXA', kit: 'bp-txaq' }
];

// ═════════ Trauma
kit('bp-trauma', {
  init: () => ({ go: false, khau: false }), ui: () => [{ t: 'tog', k: 'go', label: '💉 Thêm thuốc gò' }, { t: 'tog', k: 'khau', label: '🪡 Bộc lộ & khâu' }], goal: s => s.khau,
  draw: s => {
    let o = card(20, 20, 330, 316, '#fffdfa') + vulva(185, 160) + Th(185, 40, 'cổ tử cung · âm đạo nhìn qua van', { s: 12.5, c: C.mute });
    o += s.khau ? `<g class="fadein"><path d="M193 136 L206 150" stroke="${C.ink}" stroke-width="2"/>${[0, 1, 2].map(i => `<path d="M${190 + i * 6} ${134 + i * 6} l8 -6" stroke="${C.ink}" stroke-width="1.6"/>`).join('')}</g>` : `<path d="M192 136 L206 154 L200 166" fill="none" stroke="${C.redD}" stroke-width="3.5"/>` + drops(202, 190, 3, .8, 12);
    o += Th(270, 120, 'tử cung chắc', { s: 12.5, c: C.green });
    o += card(362, 20, 188, 316) + (s.go && !s.khau ? T(456, 96, 'thêm thuốc gò:', { s: 13 }) + T(456, 120, 'vẫn chảy', { s: 16, c: C.redD }) : '') + (s.khau ? ZS.fade(verdict(378, 150, 156, true, 'đã cầm', 'khâu đúng chỗ thấy rõ'), ZS.fresh(s, x => x.khau)) : '') + T(456, 290, 'không khâu mù', { s: 13, c: C.redD });
    return o;
  },
  say: s => s.khau ? ['wow', 'Mạch bị **rách** không siết lại được bằng thuốc gò. Phải **bộc lộ thấy rõ** rồi khâu cầm máu — **không khâu mù**.'] : ['happy', 'Tử cung chắc, máu chảy từ **vết rách cổ tử cung**. Thử **💉 Thêm thuốc gò** rồi **🪡 Khâu** 👆']
});
const DD = [['tsm', 185, 270, 'Tầng sinh môn'], ['ad', 150, 170, 'Thành âm đạo'], ['ctc', 185, 130, 'Cổ tử cung (van + đèn)'], ['tu', 120, 220, 'Khối máu tụ']];
kit('bp-kham', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => DD.every(([k]) => seen(s, k)),
  draw: s => {
    let o = card(20, 20, 330, 316, '#fffdfa') + vulva(185, 160, { hema: seen(s, 'tu') ? .4 : 0 });
    o += DD.map(([k, x, y]) => seen(s, k) ? `<circle cx="${x}" cy="${y}" r="8" fill="${C.green}"/>` : tap('!' + k, x, y, 18, 16)).join('');
    o += card(362, 20, 188, 316) + T(456, 46, 'Khám có hệ thống', { s: 13.5 }) + DD.map(([k, , , t], i) => T(378, 82 + i * 30, (seen(s, k) ? '✓ ' : '○ ') + t, { a: 'start', s: 12.5, c: seen(s, k) ? C.ink : C.grid })).join('');
    o += T(456, 226, 'cần đủ:', { s: 12.5, c: C.mute }) + T(456, 252, '💡 ánh sáng · 🧰 dụng cụ', { s: 12.5 }) + T(456, 276, '💉 giảm đau · 👐 người phụ', { s: 12.5 });
    return o;
  },
  say: s => DD.every(([k]) => seen(s, k)) ? ['happy', 'Khám **có hệ thống**: tầng sinh môn, âm đạo, cổ tử cung, khối máu tụ — đủ **ánh sáng, dụng cụ, giảm đau, người hỗ trợ**.'] : ['happy', 'Tìm nguồn chảy: chạm **4 vị trí** cần kiểm tra 👆']
});
kit('bp-tu', {
  init: () => ({ h: 0 }), ui: () => [{ t: 'range', k: 'h', label: '⏱ Giờ sau sinh', min: 0, max: 4, step: .5, unit: ' giờ' }], goal: s => s.h >= 3,
  draw: s => {
    const f = s.h / 4;
    let o = card(20, 20, 330, 316, '#fffdfa') + vulva(185, 160, { hema: f }) + (f > .3 ? Th(110, 64, 'khối máu tụ lớn dần', { s: 13, c: C.clotD }) : '');
    o += card(362, 20, 188, 316) + T(456, 50, 'Máu chảy ngoài', { s: 12.5, c: C.mute }) + T(456, 74, 'ÍT', { s: 17, c: C.green });
    o += vital(378, 92, 'Mạch', Math.round(88 + 40 * f), f > .5 ? '#ff6b7a' : '#7ee2b8', 156) + [['đau tăng, căng tức', .3], ['bí tiểu', .55], ['sốc không tương xứng', .75]].map(([t, th], i) => `<g opacity="${f >= th ? 1 : .2}">${T(378, 170 + i * 30, (f >= th ? '⚠ ' : '○ ') + t, { a: 'start', s: 12.5, c: f >= th ? C.redD : C.mute })}</g>`).join('');
    return o;
  },
  say: s => s.h >= 3 ? ['ouch', '**Máu tụ** có thể nằm dưới niêm mạc lành: đau tăng, bí tiểu, **sốc không tương xứng máu ngoài**. Tụ lớn lên hay mẹ bất ổn → can thiệp.'] : ['happy', 'Tử cung chắc, máu ngoài ít. Kéo **⏱ Giờ sau sinh** 👆']
});
B['trauma'] = [
  { t: 'Tử cung chắc mà vẫn chảy', kit: 'bp-trauma' },
  { t: 'Khám đường sinh dục có hệ thống', kit: 'bp-kham' },
  { t: 'Khối máu tụ: chảy máu kín', kit: 'bp-tu' }
];

// ═════════ Tissue
kit('bp-tis', {
  init: () => ({ lay: false }), ui: () => [{ t: 'tog', k: 'lay', label: '🧩 Lấy hết mô nhau sót' }], goal: s => s.lay,
  draw: s => {
    const R = bed({ det: 1, co: s.lay ? .85 : .55, frag: !s.lay, plug: s.lay ? 'du' : '', noPlac: true });
    return card(20, 20, 440, 316, '#fffdfa') + R.svg + (!s.lay ? call(290, R.top - 14, 330, 60, 'mảnh nhau sót', C.placD, 'middle') : ZS.fade(Th(240, 60, 'cơ co lại được, mạch khép', { s: 13, c: C.green }), true)) + card(470, 20, 80, 316) + T(510, 70, s.lay ? '✓' : '💧', { s: 28, c: C.green }) + T(510, 110, s.lay ? 'kín' : 'chảy', { s: 15, c: s.lay ? C.green : C.redD });
  },
  say: s => s.lay ? ['wow', 'Mô nhau còn lại **cản co hồi** và giữ diện chảy. Lấy hết mô (người có năng lực, vô cảm, điều kiện phù hợp) → cơ **khép mạch** được.'] : ['happy', 'Một mảnh nhau còn dính trong tử cung. Bấm **🧩 Lấy hết mô nhau sót** 👆']
});
kit('bp-pas2', {
  init: () => ({ k: 'sot', seen: 'sot,' }), ui: () => [{ t: 'seg', k: 'k', opts: [['sot', '🧩 Sót mảnh nhau'], ['pas', '🌱 PAS (cài răng lược)']] }], after: s => markSeen(s, s.k), goal: s => seen(s, 'pas'),
  draw: s => {
    const pas = s.k === 'pas';
    let o = card(20, 20, 340, 316, '#fffdfa') + `<rect x="40" y="170" width="300" height="140" rx="10" fill="url(#gMyo)"/><path d="M60 170 Q200 120 320 170 Z" fill="url(#gPlac)" stroke="${C.placD}"/>`;
    o += pas ? [110, 170, 230, 280].map(x => `<path d="M${x} 170 q-6 40 6 ${90}" fill="none" stroke="${C.placD}" stroke-width="7" opacity=".85"/>`).join('') + Th(190, 110, 'gai nhau xuyên vào cơ', { s: 13, c: C.placD }) + Th(190, 300, 'KHÔNG có mặt phẳng bóc tách', { s: 13, c: C.redD })
      : `<path d="M60 172 Q200 180 320 172" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="6 4"/>` + Th(190, 196, 'mặt phẳng bóc tách còn', { s: 13, c: C.green }) + Th(190, 110, 'mảnh nhau dính lỏng', { s: 13, c: C.placD });
    o += card(372, 20, 178, 316) + (pas ? verdict(388, 100, 146, false, 'ĐỪNG cố bóc', 'xuất huyết thảm khốc') + T(461, 230, '→ dừng, gọi đội', { s: 13 }) + T(461, 250, 'chuyên sâu', { s: 13 }) : verdict(388, 100, 146, true, 'lấy được', 'đủ điều kiện, có năng lực'));
    return o;
  },
  say: s => seen(s, 'pas') ? ['worry', '**Sót mảnh nhau** còn mặt phẳng bóc tách; **PAS** thì gai nhau xuyên vào cơ, không có mặt phẳng → **cố bóc gây chảy máu thảm khốc**. Dừng, gọi đội.'] : ['happy', 'Nhau không ra — nhưng vì sao? Bấm **🌱 PAS** để so 👆']
});
tfKit('bp-tisq', [['Nhau bám chặt → nạo mù', false], ['Siêu âm thay hồi sức người đang chảy nặng', false], ['Lấy nhau bằng tay cần vô cảm, người có năng lực', true], ['Có nguy cơ nhiễm trùng, thủng tử cung', true], ['Nghi PAS: thử kéo mạnh xem có ra không', false], ['Hỏi: nhau sổ chưa, tự nhiên hay khó khăn', true]], 'Tissue: hỏi kỹ cách sổ nhau, kiểm múi màng; lấy nhau bằng tay cần **người có năng lực, vô cảm**; **không nạo mù**, nghi PAS **không cố kéo**.');
B['tissue'] = [
  { t: 'Còn nhau thì cơ khó khép', kit: 'bp-tis' },
  { t: 'Sót mảnh nhau khác PAS', kit: 'bp-pas2' },
  { t: 'Sáu câu về Tissue', kit: 'bp-tisq' }
];

// ═════════ Thrombin
kit('bp-dic', {
  init: () => ({ k: 0 }), ui: () => [{ t: 'range', k: 'k', label: '⚡ Kích hoạt đông lan tỏa', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.k >= 80,
  draw: s => {
    const f = s.k / 100, V = ['M40 90 C120 70 160 130 240 110 S330 80 340 120', 'M40 170 C110 150 180 210 250 180 S320 160 340 200', 'M40 250 C120 240 170 290 240 260 S330 240 340 280'];
    let o = card(20, 20, 340, 316, '#fffdfa') + V.map(d => `<path d="${d}" fill="none" stroke="${C.redD}" stroke-width="16" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#ff9aa2" stroke-width="12" stroke-linecap="round"/>`).join('');
    o += [[90, 82], [180, 120], [280, 98], [120, 166], [230, 186], [300, 186], [90, 248], [200, 266], [300, 258]].slice(0, Math.round(9 * f)).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="url(#gClot)" class="fadein"/>`).join('') + Th(190, 46, 'vi huyết khối khắp nơi', { s: 13, c: C.clotD });
    if (f >= .7) o += ZS.fade(`<g transform="translate(316 312)">${pic('sv-bom-tiem.png', -40, -14, 80, 25)}</g>` + drops(270, 312, 2, .7) + Th(150, 322, 'vết chích không cầm', { s: 12.5, c: C.redD }), ZS.fresh(s, x => x.k >= 70));
    o += card(372, 20, 178, 316) + [['Tiểu cầu', 100 - 75 * f], ['Fibrinogen', 100 - 80 * f], ['Yếu tố đông', 100 - 70 * f]].map(([t, v], i) => T(390, 60 + i * 56, t, { a: 'start', s: 13 }) + ZS.bar(390, 70 + i * 56, 142, v, v < 40 ? C.red : C.green, '', { h: 12 })).join('') + T(461, 240, f >= .7 ? 'bị TIÊU HAO' : '', { s: 15, c: C.redD }) + T(461, 266, f >= .7 ? '→ chảy máu lan tỏa' : '', { s: 13, c: C.redD });
    return o;
  },
  say: s => s.k >= 80 ? ['ouch', 'DIC: đông **lan tỏa** tạo vi huyết khối → **tiêu hao** tiểu cầu, fibrinogen, yếu tố đông + tiêu sợi huyết → **chảy máu khắp nơi**.'] : ['happy', 'Kéo thanh **⚡ Kích hoạt đông** — nhìn mạch máu và các thanh bên phải 👆']
});
const DICC = [['nbn', '🌩️', 'Nhau bong non'], ['afe', '🫁', 'Thuyên tắc ối'], ['nt', '🦠', 'Nhiễm trùng'], ['hellp', '🧪', 'HELLP'], ['mm', '🩸', 'Mất máu nặng kéo dài']];
kit('bp-dicnn', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => DICC.every(([k]) => seen(s, k)),
  draw: s => T(285, 40, 'Ai kích hoạt DIC trong sản khoa? Chạm từng thẻ', { s: 14 }) + DICC.map(([k, ic, t], i) => { const x = 20 + (i % 3) * 178, y = 56 + Math.floor(i / 3) * 140, sn = seen(s, k);
    return `<g class="tap" data-set="!${k}">${card(x, y, 170, 130, sn ? '#ffe0e6' : '#fff', sn ? C.pinkD : C.grid)}${T(x + 85, y + 62, ic, { s: 34 })}${T(x + 85, y + 100, t, { s: 14 })}${sn ? '' : T(x + 85, y + 120, '👆', { s: 12, c: C.soft })}</g>`; }).join('') + `<rect x="376" y="196" width="170" height="130" rx="16" fill="${C.butter}"/>` + T(461, 236, 'theo dõi nối tiếp:', { s: 12.5, c: C.mute }) + T(461, 262, 'tiểu cầu, PT/aPTT,', { s: 13 }) + T(461, 284, 'fibrinogen', { s: 13 }),
  say: s => DICC.every(([k]) => seen(s, k)) ? ['happy', 'DIC sản khoa: **NBN, AFE, nhiễm trùng, HELLP, mất máu nặng kéo dài**. Xét nghiệm **nối tiếp**: tiểu cầu, PT/aPTT, fibrinogen.'] : ['happy', 'Chạm **5 thẻ** nguyên nhân 👆']
});
tfKit('bp-dicq', [['DIC thì cứ dùng heparin', false], ['Điều trị nguyên nhân kích hoạt', true], ['Chỉ cần nhìn Hb', false], ['Fibrinogen mục tiêu ≥ 2 g/L', true], ['Bù thành phần đông máu theo nhu cầu', true], ['Tiểu cầu không quan trọng', false]], 'DIC: **xử trí nguyên nhân + hồi sức + bù thành phần** theo nhu cầu; fibrinogen **≥ 2 g/L**; **heparin không thường quy** khi đang chảy máu.');
B['thrombin'] = [
  { t: 'DIC: đông khắp nơi rồi hết đông', kit: 'bp-dic', cr: 'Bơm tiêm: ' + SV },
  { t: 'Ai kích hoạt DIC?', kit: 'bp-dicnn' },
  { t: 'Sáu câu về xử trí DIC', kit: 'bp-dicq' }
];

// ═════════ Bóng chèn, ép, phẫu thuật
kit('bp-ep', {
  init: () => ({ ep: false }), ui: () => [{ t: 'tog', k: 'ep', label: '👐 Ép tử cung bằng hai tay' }], goal: s => s.ep,
  draw: s => {
    const e = s.ep;
    let o = card(20, 20, 330, 316, '#fffdfa') + `<g transform="translate(185 180) scale(${e ? .8 : 1} 1)"><g transform="translate(-185 -180)">${ZS.uterusSag({ x: 185, y: 60, k: .64 })}</g></g>` + (e ? '' : drops(185, 310, 3, .8, 16));
    o += `<g transform="translate(${e ? 92 : 50} 120)">${pic('sv-ban-tay.png', 0, 0, 60, 104, 'transform="rotate(-90 30 52)"')}</g><g transform="translate(${e ? 220 : 262} 120)">${pic('sv-ban-tay.png', 0, 0, 60, 104, 'transform="rotate(90 30 52)"')}</g>` + (e ? arrow('M120 100 L150 140', C.green, 4) + arrow('M250 100 L220 140', C.green, 4) : '');
    o += card(362, 20, 188, 316) + (e ? ZS.fade(verdict(378, 100, 156, true, 'tạm cầm máu', 'cầu nối khi đờ') + T(456, 230, 'trong lúc chuẩn bị', { s: 12.5, c: C.mute }) + T(456, 250, 'biện pháp triệt để', { s: 12.5, c: C.mute }), true) : T(456, 160, '👆 bật ép', { s: 14, c: C.soft }));
    return o;
  },
  say: s => s.ep ? ['happy', '**Ép tử cung bằng hai tay** ép thành cơ lại — là **cầu nối** trong đờ khi chuẩn bị bóng chèn hay phẫu thuật.'] : ['happy', 'Thuốc chưa đủ. Bấm **👐 Ép tử cung bằng hai tay** 👆']
});
kit('bp-bong', {
  init: () => ({ ml: 0, rach: false }), ui: () => [{ t: 'range', k: 'ml', label: '🎈 Bơm bóng', min: 0, max: 500, step: 50, unit: ' mL' }, { t: 'tog', k: 'rach', label: '✂️ Nguồn là vết rách âm đạo' }], goal: s => s.ml >= 300 && s.rach,
  draw: s => {
    const f = s.ml / 500, stop = f >= .6 && !s.rach;
    let o = card(20, 20, 330, 316, '#fffdfa') + ZS.uterusSag({ x: 185, y: 40, k: .74 }) + `<ellipse cx="185" cy="${142 + 14 * (1 - f)}" rx="${16 + 34 * f}" ry="${20 + 44 * f}" fill="#d9ecff" stroke="#7cb8f0" stroke-width="2" opacity=".9"/><path d="M185 ${162 + 30 * f} V330" stroke="#7cb8f0" stroke-width="4"/>`;
    o += s.rach ? `<path d="M160 300 l-10 14 l6 8" fill="none" stroke="${C.redD}" stroke-width="3.5"/>` + drops(150, 330, 2, .7) + Th(110, 296, 'rách âm đạo', { s: 12.5, c: C.redD }) : (stop ? '' : drops(185, 300, 2, .7));
    o += card(362, 20, 188, 316) + (s.rach ? verdict(378, 70, 156, false, 'bóng vô ích', 'nguồn không ở buồng TC') : stop ? verdict(378, 70, 156, true, 'cầm được', 'ép từ bên trong') : T(456, 100, 'bơm bóng…', { s: 14, c: C.soft }));
    o += T(456, 180, 'Điều kiện (WHO):', { s: 12.5 }) + ['thất bại đầu tay', 'đã loại Trauma/Tissue', 'người huấn luyện', 'sẵn máu & phẫu thuật'].map((t, i) => T(378, 206 + i * 22, '✓ ' + t, { a: 'start', s: 12 })).join('');
    return o;
  },
  say: s => s.ml >= 300 && s.rach ? ['worry', 'Bóng chèn **ép từ trong buồng tử cung** — vô ích khi nguồn là **vết rách**, đặt sai hay tuột. Đừng để bóng tạo **an toàn giả**.'] : ['happy', 'Bơm **🎈 bóng** tới 300 mL, rồi bật **✂️ Nguồn là vết rách** 👆']
});
const LAD = [['🪢', 'Khâu ép B-Lynch', 'ép thành tử cung'], ['🩸', 'Thắt / thuyên tắc mạch', 'giảm dòng máu tới'], ['🏥', 'Cắt tử cung', 'cứu sống']];
kit('bp-thang', {
  init: () => ({ bat: false }), ui: () => [{ t: 'tog', k: 'bat', label: '🚨 Mẹ mất ổn định nặng' }], goal: s => s.bat,
  draw: s => {
    let o = card(20, 20, 530, 316, '#fffdfa');
    o += LAD.map(([ic, a, b], i) => { const x = 50 + i * 166, y = 230 - i * 70, skip = s.bat && i < 2; return `<rect x="${x}" y="${y}" width="150" height="80" rx="14" fill="${skip ? '#f4f0fb' : i === 2 && s.bat ? '#ffd0d8' : C.mint}" stroke="${skip ? C.grid : C.soft}" opacity="${skip ? .5 : 1}"/>` + T(x + 75, y + 30, ic + ' ' + a, { s: 13.5 }) + T(x + 75, y + 54, b, { s: 12.5, c: C.mute }); }).join('');
    if (s.bat) o += ZS.fade(ZS.drawIn(arrow('M120 226 C200 100 300 90 380 106', C.red, 4), .8) + T(285, 330, 'không bắt buộc thử hết các bước bảo tồn', { s: 13.5, c: C.redD }), ZS.fresh(s, x => x.bat));
    else o += T(285, 330, 'Couvelaire đơn độc KHÔNG tự động là chỉ định cắt', { s: 13, c: C.mute });
    return o;
  },
  say: s => s.bat ? ['worry', 'Mẹ **mất ổn định** → quyết định **cứu sống kịp thời**, không buộc thử hết mọi biện pháp giữ tử cung. Chọn theo **nguồn chảy, mức nặng, nguồn lực**.'] : ['happy', 'Các bậc phẫu thuật có **đích khác nhau**. Bật **🚨 Mẹ mất ổn định nặng** 👆']
});
B['bong-ep-phau-thuat'] = [
  { t: 'Ép hai tay: cầu nối', kit: 'bp-ep', cr: 'Bàn tay: ' + SV },
  { t: 'Bóng chèn: đúng nguồn mới hiệu quả', kit: 'bp-bong' },
  { t: 'Bậc thang phẫu thuật', kit: 'bp-thang' }
];

// ═════════ Lộn tử cung
const inv = (d, x = 185, y = 40) => { // d 0–3: bình thường → đáy lõm → lộn trong buồng → ra âm đạo
  const k = .68, top = y + 10 * k + d * 40;
  let s = ZS.uterusSag({ x, y, k });
  if (d > 0) s += `<path d="M${x - 70} ${y + 14} Q${x} ${top + 10} ${x + 70} ${y + 14}" fill="#fff" stroke="${C.myoD}" stroke-width="2"/><path d="M${x - 50} ${y + 16} Q${x} ${top} ${x + 50} ${y + 16}" fill="url(#gMyo)" stroke="${C.myoD}"/>`;
  if (d >= 3) s += `<path d="M${x - 16} ${top} Q${x - 22} ${y + 200} ${x - 30} ${y + 230} H${x + 30} Q${x + 22} ${y + 200} ${x + 16} ${top}Z" fill="url(#gMyo)" stroke="${C.myoD}" stroke-width="1.4"/><ellipse cx="${x}" cy="${y + 240}" rx="44" ry="30" fill="url(#gMyo)" stroke="${C.myoD}" stroke-width="1.6"/>` + T(x, y + 246, 'đáy', { s: 12, c: '#fff' });
  return s; };
kit('bp-lon', {
  init: () => ({ d: 0 }), ui: () => [{ t: 'range', k: 'd', label: '⬇️ Mức lộn', min: 0, max: 3, step: 1, unit: '/3' }], goal: s => s.d >= 3,
  draw: s => {
    let o = card(20, 20, 330, 316, '#fffdfa') + inv(s.d) + Th(185, 32, 'bụng', { s: 12, c: C.mute });
    const L = ['Bình thường', 'Đáy lõm vào', 'Lộn trong buồng tử cung', 'Lộn ra âm đạo'];
    o += card(362, 20, 188, 316) + T(456, 70, L[s.d], { s: 15, c: s.d ? C.redD : C.green }) + T(456, 120, 'sờ đáy qua bụng:', { s: 12.5, c: C.mute }) + T(456, 144, s.d >= 2 ? 'KHÔNG thấy' : s.d === 1 ? 'lõm' : 'thấy', { s: 16, c: s.d >= 2 ? C.redD : C.ink });
    if (s.d >= 2) o += ZS.fade(T(456, 200, '⚠ đau dữ dội', { s: 13, c: C.redD }) + T(456, 224, '⚠ chảy máu', { s: 13, c: C.redD }) + T(456, 248, '⚠ sốc nhanh', { s: 13, c: C.redD }), ZS.fresh(s, x => x.d >= 2));
    return o;
  },
  say: s => s.d >= 3 ? ['ouch', 'Lộn tử cung: **đáy bị kéo vào trong**, có thể ra tới âm đạo. Sờ bụng **không thấy đáy**, đau, chảy máu, **sốc nhanh**.'] : ['happy', 'Kéo thanh **⬇️ Mức lộn** — nhìn đáy tử cung 👆']
});
kit('bp-phanbiet', {
  init: () => ({ k: '', seen: '' }), ui: () => [{ t: 'seg', k: 'k', opts: [['do', '😮‍💨 Đờ tử cung'], ['lon', '⬇️ Lộn tử cung']] }], after: s => markSeen(s, s.k), goal: s => seen(s, 'do') && seen(s, 'lon'),
  draw: s => {
    let o = card(20, 20, 330, 316, '#fffdfa') + (s.k === 'lon' ? inv(3) : s.k === 'do' ? ut(185, 40, .74, { soft: true }) : ut(185, 40, .6)) + `<g transform="translate(150 6)">${pic('sv-ban-tay.png', 0, 0, 40, 70, 'transform="rotate(180 20 35)"')}</g>`;
    const M = { do: ['đáy CÒN ở bụng', 'mềm, to', 'xoa + thuốc co hồi'], lon: ['đáy MẤT ở bụng', 'khối trong âm đạo', 'hoàn vị — chưa dùng thuốc co'] }[s.k];
    o += card(362, 20, 188, 316) + (M ? ZS.fade(T(456, 80, M[0], { s: 15, c: s.k === 'lon' ? C.redD : '#b5651d' }) + T(456, 110, M[1], { s: 13, c: C.mute }) + T(456, 180, '→ ' + M[2].split(' — ')[0], { s: 13.5 }) + (M[2].includes('—') ? T(456, 202, M[2].split(' — ')[1], { s: 12.5, c: C.redD }) : ''), ZS.fresh(s, x => x.k === s.k)) : T(456, 160, '👆 chọn', { s: 14, c: C.soft }));
    return o;
  },
  say: s => seen(s, 'do') && seen(s, 'lon') ? ['worry', 'Cùng “tử cung mềm” nhưng khác hẳn: **đờ** thì đáy còn ở bụng; **lộn** thì **mất đáy** + khối trong âm đạo. Phải xác định **vị trí đáy**.'] : ['happy', 'Tay sờ bụng sau sổ nhau. So **đờ** với **lộn** 👆']
});
kit('bp-hoanvi', {
  init: () => ({ thuoc: false, hv: false, sw: false }), ui: () => [{ t: 'tog', k: 'thuoc', label: '💉 Dùng thuốc co TRƯỚC' }, { t: 'tog', k: 'hv', label: '🤲 Hoàn vị đáy tử cung' }], after: (s, k) => { if (s.thuoc) s.sw = true; }, goal: s => s.hv && s.sw && !s.thuoc,
  draw: s => {
    const stuck = s.thuoc && !s.hv;
    let o = card(20, 20, 330, 316, '#fffdfa') + (s.hv && !s.thuoc ? `<g class="fadein">${ut(185, 40, .62)}</g>` : inv(3)) + (stuck ? `<ellipse cx="185" cy="232" rx="30" ry="9" fill="none" stroke="${C.red}" stroke-width="4"/>` + Th(260, 236, 'vòng thắt siết lại', { s: 12.5, c: C.redD }) : '');
    if (s.hv && !s.thuoc) o += ZS.drawIn(arrow('M185 300 V200', C.green, 5), .7);
    o += card(362, 20, 188, 316) + T(456, 50, 'Thứ tự:', { s: 13.5 }) + ['🆘 gọi hỗ trợ', '🫁 hồi sức', '🤲 hoàn vị (người có năng lực)', '💉 rồi mới thuốc co'].map((t, i) => T(374, 82 + i * 30, t, { a: 'start', s: 12.5 })).join('');
    o += s.hv && s.thuoc ? verdict(374, 220, 164, false, 'tắt thuốc co đã') : s.hv ? verdict(374, 220, 164, true, 'đã về vị trí', 'giờ mới duy trì co') : stuck ? verdict(374, 220, 164, false, 'khó hoàn vị hơn') : '';
    o += T(456, 312, 'nhau còn bám: không bóc thêm', { s: 11.5, c: C.mute });
    return o;
  },
  say: s => s.hv && s.sw && !s.thuoc ? ['wow', 'Gọi hỗ trợ, hồi sức, **hoàn vị trước**; chỉ khi tử cung **đã về vị trí** mới dùng thuốc co. Không hoàn vị được → giãn cơ, vô cảm, phẫu thuật.'] : ['happy', 'Thử bật **💉 Thuốc co TRƯỚC** xem sao, rồi tắt đi và **🤲 Hoàn vị** 👆']
});
B['lon-tu-cung'] = [
  { t: 'Đáy tử cung bị kéo vào trong', kit: 'bp-lon' },
  { t: 'Đờ hay lộn? Tìm vị trí đáy', kit: 'bp-phanbiet', cr: 'Bàn tay: ' + SV },
  { t: 'Hoàn vị trước, thuốc co sau', kit: 'bp-hoanvi' }
];
})();
