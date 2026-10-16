'use strict';
/* Họ 4: lưu đồ quyết định (algo), 4T trên giải phẫu, ma trận chống chỉ định thuốc, đường sinh dục rách, leo thang cầm máu, lộn tử cung. */
(() => {
const ZS = window.ZS, { C, T, kit, plot, clamp, arrow, bar, lab, drop, pill, uterusSag } = ZS;

// ───────── algo: lưu đồ thật; nhánh đang đi sáng lên theo lựa chọn
const FHR = (x, y, w, h, kind) => { const pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40; let v = kind === 'brady' ? .12 : kind === 'late' ? .55 + .06 * Math.sin(t * 40) - (t > .5 && t < .8 ? .3 * Math.sin((t - .5) / .3 * Math.PI) : 0) : .6 + .05 * Math.sin(t * 50) + .03 * Math.sin(t * 17); pts.push(`${i ? 'L' : 'M'}${x + t * w} ${y + h - v * h}`); } return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#f6fff9" stroke="${C.grid}" stroke-width="2"/><path d="${pts.join(' ')}" fill="none" stroke="${kind === 'normal' ? C.green : C.red}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`; };
const box = (x, y, w, h, lines, on, col, o = {}) => `<g opacity="${on ? 1 : .38}"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${o.r || 14}" fill="${on ? col : '#f7f4fc'}" stroke="${on ? C.soft : C.grid}" stroke-width="${on ? 2.6 : 2}"/>${lines.map((t, i) => T(x, y - (lines.length - 1) * 6.5 + i * 13 + 4, t, { s: o.s || 10.5, w: i === 0 && lines.length > 1 ? 800 : 700 })).join('')}</g>`;
const dia = (x, y, w, h, txt, on, col) => `<g opacity="${on ? 1 : .38}"><path d="M${x} ${y - h / 2} L${x + w / 2} ${y} L${x} ${y + h / 2} L${x - w / 2} ${y}Z" fill="${on ? col : '#f7f4fc'}" stroke="${on ? C.soft : C.grid}" stroke-width="2.6" stroke-linejoin="round"/>${T(x, y + 4, txt, { s: 11 })}</g>`;
const ar = (d, on, lbl, lx, ly) => `<path d="${d}" fill="none" stroke="${on ? C.ink : C.grid}" stroke-width="${on ? 1.8 : 1.2}" stroke-linecap="round" marker-end="url(#ar)"/>` + (lbl ? T(lx, ly, lbl, { s: 10.5, c: on ? C.ink : C.mute }) : '');
const monitor = (m) => `<g transform="translate(20 24)"><rect width="150" height="238" rx="18" fill="#2c2840"/><rect x="8" y="8" width="134" height="222" rx="12" fill="#1b1a2b"/>${T(75, 28, 'MONITOR', { s: 10, c: '#8c80a6' })}${T(18, 56, 'HR', { a: 'start', s: 11, c: '#8c80a6' })}${T(132, 60, m.hr, { a: 'end', s: 22, c: m.bad ? '#ff7a8a' : '#7be0a8' })}${T(18, 92, 'HA', { a: 'start', s: 11, c: '#8c80a6' })}${T(132, 96, m.bp, { a: 'end', s: 17, c: m.bad ? '#ff7a8a' : '#7be0a8' })}${T(18, 124, 'tim thai', { a: 'start', s: 11, c: '#8c80a6' })}${T(132, 128, m.fhr, { a: 'end', s: 19, c: m.fbad ? '#ff7a8a' : '#7be0a8' })}<g transform="translate(14 140)">${FHR(0, 0, 122, 50, m.ftrace).replace('#f6fff9', '#0d0d18').replace(C.grid, '#2c2840')}</g>${T(75, 216, m.note || '', { s: 10.5, c: '#bfb6e0' })}</g>`;
kit('algo', {
  zones: (s, sp) => sp.cfg.zones,
  init: sp => sp.cfg.init,
  ui: (s, sp) => sp.cfg.ui,
  draw: (s, sp) => {
    // tbox: thẻ bấm để đổi giá trị (vals = danh sách giá trị; không có vals = bật/tắt)
    const tbox = (k, vals, x, y, w, h, lines, on, col, o = {}) => { const nx = vals ? vals[(vals.indexOf(s[k]) + 1) % vals.length] : null;
      return `<g data-set="${vals ? k + '=' + nx : '!' + k}">${box(x, y, w, h, lines, true, on ? col : '#f7f4fc', o)}${vals ? `<g transform="translate(${x + w / 2 - 15} ${y - h / 2 + 13})"><circle r="9" fill="#fff" stroke="${C.soft}" stroke-width="1.2"/><text y="4" text-anchor="middle" font-size="11" fill="${C.soft}">⇄</text></g>` : ZS.sw(x + w / 2 - 34, y + h / 2 - 20, on, C.green)}</g>`; };
    return sp.cfg.draw(s, { box, dia, ar, monitor, FHR, T, C, arrow, bar, pill, plot, tbox });
  },
  say: (s, sp) => sp.cfg.say(s)
});

// ───────── fourT: bốn chữ T trên giải phẫu
const FT = { tone: ['Tone', 'đờ tử cung'], trauma: ['Trauma', 'rách · máu tụ · vỡ/lộn'], tissue: ['Tissue', 'sót nhau · bám bất thường'], thrombin: ['Thrombin', 'rối loạn đông máu'] };
kit('fourT', {
  zones: () => ({ alarm: [52, 60, 34, 30], bundle: [52, 176, 34, 30], all: [272, 150, 200, 124] }),
  init: () => ({ tone: false, trauma: false, tissue: false, thrombin: false }),
  ui: () => [],
  draw: s => {
    const n = Object.keys(FT).filter(k => s[k]).length;
    let o = `<rect x="96" y="24" width="450" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += uterusSag({ x: 250, y: 30, k: .66, cav: s.tone ? '#f7e3e9' : '#fffafc' });
    o += `<path d="M250 182 V204 Q250 226 284 232 L356 236" fill="none" stroke="${C.decid}" stroke-width="30" stroke-linecap="round"/><path d="M250 182 V204 Q250 226 284 232 L356 236" fill="none" stroke="#fff6fa" stroke-width="20" stroke-linecap="round"/>`;
    const G = (k, x, y, ic, lab, body) => `<g data-set="!${k}">${s[k] ? body : `<circle cx="${x}" cy="${y}" r="17" fill="#fff" stroke="${C.soft}" stroke-width="2" stroke-dasharray="4 4" opacity=".85"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="17" opacity=".75">${ic}</text>${T(x, y + 32, lab, { s: 10, c: C.mute })}`}</g>`;
    o += G('tone', 198, 104, '💪', 'Tone: đờ?', `<path d="M196 110 q20 -10 40 0 t40 0 t40 0" fill="none" stroke="${C.redD}" stroke-width="2.5" stroke-dasharray="3 5"/>` + ZS.pill(250, 96, 'mềm · cơ không siết', { c: C.pinkD }));
    o += G('tissue', 250, 78, '🧩', 'Tissue: sót?', `<path d="M214 70 Q248 52 282 72 L276 96 Q248 104 218 96Z" fill="url(#gPlac)" stroke="${C.placD}" stroke-width="2.5"/>` + ZS.pill(248, 120, 'mô nhau còn sót', { c: C.pinkD }));
    o += G('trauma', 306, 208, '🩹', 'Trauma: rách?', `<path d="M268 214 l12 14 l-10 8 l14 12" fill="none" stroke="${C.redD}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="316" cy="214" rx="26" ry="14" fill="url(#gClot)" opacity=".9"/>` + ZS.pill(318, 192, 'rách · máu tụ', { c: C.pinkD }));
    o += G('thrombin', 478, 96, '🧪', 'Thrombin: đông máu?', `<g transform="translate(470 78)"><rect x="-16" y="-26" width="32" height="92" rx="14" fill="#fff" stroke="${C.soft}" stroke-width="2.5"/><rect x="-13" y="-6" width="26" height="68" rx="11" fill="#ffd1d6"/><path d="M-10 6 h20 M-10 18 h20" stroke="#fff" stroke-width="2"/></g>` + ZS.pill(470, 160, 'máu không đông', { c: C.pinkD }));
    const nb = n; for (let i = 0; i < nb; i++) o += drop(240 + i * 22, 262, .7, 'drip');
    o += T(446, 48, '👆 bấm vòng nét đứt để bật', { s: 10, c: C.mute });
    o += `<g transform="translate(52 60)"><circle r="30" fill="#fff" stroke="${C.soft}" stroke-width="2.5"/><text y="9" text-anchor="middle" font-size="28">🔔</text></g>` + T(52, 108, 'nhận diện', { s: 10.5, c: C.mute }) + T(52, 121, 'mức nặng', { s: 10.5, c: C.mute });
    o += `<g transform="translate(52 176)"><circle r="30" fill="#fff" stroke="${C.soft}" stroke-width="2.5"/><text y="9" text-anchor="middle" font-size="26">💧</text></g>` + T(52, 224, 'hồi sức', { s: 10.5, c: C.mute }) + T(52, 237, '+ bundle ngay', { s: 10.5, c: C.mute }) + `<path d="M52 128 V142" stroke="${C.mute}" stroke-width="1.4" marker-end="url(#ar)"/>`;
    o += `<rect x="20" y="276" width="526" height="52" rx="16" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(34, 296, 'BHSS SỚM: trong 24 giờ đầu', { a: 'start', s: 11.5 }) + `<rect x="34" y="304" width="150" height="12" rx="6" fill="${C.pinkD}"/><rect x="190" y="304" width="340" height="12" rx="6" fill="${C.lav}"/>` + T(360, 296, 'BHSS MUỘN: sau 24 giờ đến 12 tuần (nghĩ sót mô, nhiễm trùng)', { a: 'start', s: 10.5, c: C.mute });
    return o;
  },
  say: s => { const on = Object.keys(FT).filter(k => s[k]); return !on.length ? ['happy', 'Bật từng chữ T để thấy nguồn chảy máu nằm ở đâu. Một ca có thể có NHIỀU T cùng lúc.'] : on.length === 1 ? ['worry', FT[on[0]][0] + ': ' + FT[on[0]][1] + '. Còn T nào khác không?'] : ['ouch', on.map(k => FT[k][0]).join(' + ') + ' cùng lúc → hồi sức song song và tìm cả bốn nhóm, đừng dừng ở một nguyên nhân.']; }
});

// ───────── pickdrug: ma trận chống chỉ định
const RX = [['meth', 'Methylergometrine', '0,2 mg IM · lặp 2–4 giờ · tối đa 5 liều', ['ha', 'cv'], 'Ergot gây co mạch → có thể tăng huyết áp. Tránh ở THA, tiền sản giật, bệnh tim mạch; không tiêm IV nhanh.'], ['carbo', 'Carboprost', '250 µg IM sâu · lặp 15–90 phút · tối đa 2 mg/8 liều', ['hen', 'org'], 'Tránh ở hen (theo Từ Dũ); bệnh tim/phổi/thận/gan hoạt động là chống chỉ định trên nhãn. Không IV.'], ['miso', 'Misoprostol', '800 µg ngậm dưới lưỡi khi oxytocin IV không có/không đáp ứng', [], 'Không vướng THA/hen ở bảng này; hay sốt, rét run; không tự lặp thêm nếu đã dùng dự phòng.']];
const PT = { ha: 'THA / tiền sản giật', cv: 'Tim mạch', hen: 'Hen', org: 'Tim · phổi · thận · gan hoạt động' };
kit('pickdrug', {
  zones: () => ({ tone: [70, 142, 56, 90], grid: [330, 108, 200, 62], row: [330, 210, 200, 46] }),
  init: () => ({ pt: '', pick: 'meth' }),
  ui: () => [{ t: 'seg', k: 'pt', opts: [['', '🙂 Không bệnh nền'], ['ha', '📈 THA / tiền sản giật'], ['hen', '🫁 Hen'], ['org', '🫀 Bệnh tim/phổi/thận/gan']] }],
  draw: s => {
    const bad = r => r[3].includes(s.pt) || (s.pt === 'ha' && r[3].includes('cv'));
    let o = `<rect x="20" y="24" width="106" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + uterusSag({ x: 73, y: 54, k: .34, cav: '#f7e3e9' }) + T(73, 156, 'tử cung vẫn ĐỜ', { s: 11 }) + T(73, 172, 'sau oxytocin', { s: 10, c: C.mute }) + `<rect x="34" y="188" width="78" height="60" rx="14" fill="${s.pt ? C.pink : C.mint}" stroke="${C.soft}" stroke-width="2"/>` + T(73, 212, 'bệnh nền:', { s: 10, c: C.mute }) + T(73, 232, s.pt ? PT[s.pt].split(' / ')[0].split(' · ')[0] : 'không', { s: 12, c: s.pt ? C.redD : C.green });
    o += `<rect x="140" y="24" width="406" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += T(222, 50, '', {}) + ['THA / TSG', 'Tim mạch', 'Hen', 'Tim·phổi·thận·gan'].map((t, i) => T(302 + i * 60, 52, t.length > 9 ? t.replace(' · ', '·').replace('Tim·phổi·thận·gan', 'tim·phổi·gan') : t, { s: 9.5, c: C.mute })).join('');
    RX.forEach((r, i) => { const y = 62 + i * 54, on = s.pick === r[0], b = bad(r); o += `<g data-set="pick=${r[0]}" transform="translate(150 ${y})"><rect width="388" height="46" rx="14" fill="${b ? C.pink : on ? C.mint : '#fff'}" stroke="${on ? C.ink : C.grid}" stroke-width="${on ? 3 : 2}"/>${T(10, 28, r[1], { a: 'start', s: 11.5 })}${['ha', 'cv', 'hen', 'org'].map((k, j) => { const ban = r[3].includes(k), hit = ban && (s.pt === k || (k === 'cv' && s.pt === 'ha')); return `<g transform="translate(${152 + j * 60} 23)"><circle r="12" fill="${ban ? (hit ? C.red : C.pinkD) : C.mint}" stroke="${ban ? C.redD : C.mintD}" stroke-width="2"/>${T(0, 5, ban ? '⛔' : '✓', { s: 11, c: ban ? '#fff' : C.green })}</g>`; }).join('')}</g>`; });
    const r = RX.find(x => x[0] === s.pick);
    o += `<rect x="150" y="226" width="388" height="28" rx="14" fill="${bad(r) ? C.pink : C.butter}" stroke="${C.soft}" stroke-width="2"/>` + T(344, 245, r[2], { s: 10.5 });
    o += T(150, 284, 'Liều trên là nội dung học có nguồn/phiên bản, KHÔNG phải đơn thuốc cá thể.', { a: 'start', s: 10.5, c: C.mute });
    return o;
  },
  say: s => { const r = RX.find(x => x[0] === s.pick), b = r[3].includes(s.pt) || (s.pt === 'ha' && r[3].includes('cv')); return b ? ['ouch', '⛔ ' + r[4]] : ['happy', (s.pt ? 'Không vướng chống chỉ định của bệnh nền này. ' : '') + r[4] + ' Luôn đánh giá lại tử cung & máu mất.']; }
});

// ───────── trauma: đường sinh dục rách — tử cung chắc mà máu vẫn chảy
kit('trauma', {
  zones: () => ({ tear: [330, 214, 52, 36], hema: [250, 250, 44, 26], fix: [488, 214, 54, 52] }),
  init: () => ({ utero: false, loc: 'cervix', fix: false }),
  ui: () => [{ t: 'seg', k: 'loc', opts: [['cervix', 'Cổ tử cung'], ['vagina', 'Thành âm đạo'], ['perineum', 'Tầng sinh môn']] }, { t: 'tog', k: 'utero', label: '💉 Thuốc làm tử cung co chắc' }],
  draw: s => {
    const pos = { cervix: [262, 192], vagina: [310, 226], perineum: [372, 244] }[s.loc];
    let o = `<rect x="20" y="24" width="400" height="276" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/>`;
    o += uterusSag({ x: 190, y: 30, k: .62, cav: s.utero ? '#f4d7df' : '#fffafc' }) + (s.utero ? `<path d="M130 80 q20 -8 40 0 t40 0 t40 0" fill="none" stroke="${C.myoD}" stroke-width="3" opacity=".8"/>` + T(190, 40, 'tử cung CHẮC', { s: 11, c: C.green }) : T(190, 40, 'tử cung mềm', { s: 11, c: C.mute }));
    o += `<path d="M190 180 V204 Q190 232 228 238 L394 244" fill="none" stroke="${C.decid}" stroke-width="32" stroke-linecap="round"/><path d="M190 180 V204 Q190 232 228 238 L394 244" fill="none" stroke="#fff6fa" stroke-width="22" stroke-linecap="round"/>` + T(330, 290, 'đường sinh dục (nhìn dọc)', { s: 10.5, c: C.mute });
    o += `<ellipse cx="250" cy="250" rx="${s.fix ? 14 : 28}" ry="${s.fix ? 8 : 14}" fill="url(#gClot)" opacity=".9"/>` + T(250, 276, s.fix ? 'tụ nhỏ, theo dõi' : 'máu tụ kín trong mô', { s: 10, c: C.mute });
    if (s.fix) o += `<path d="M${pos[0] - 12} ${pos[1] - 10} l24 20 m0 -20 l-24 20" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>` + T(pos[0], pos[1] - 18, '✓ khâu', { s: 11, c: C.green });
    else o += `<path d="M${pos[0] - 12} ${pos[1] - 12} l10 10 l-8 8 l12 12" fill="none" stroke="${C.red}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` + [0, 1, 2].map(i => drop(pos[0] + 14 + i * 14, pos[1] + 22 + (i % 2) * 10, .65, 'drip')).join('') + T(pos[0], pos[1] - 20, 'vết rách', { s: 11, c: C.redD });
    const ext = s.fix ? 0 : 70, hid = s.fix ? 0 : 55;
    o += `<rect x="430" y="24" width="116" height="276" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/>` + T(488, 46, 'Mất máu', { s: 11.5 }) + `<g transform="translate(440 62)">${bar(0, 14, 96, ext, C.red, 'thấy ngoài')}${bar(0, 50, 96, hid, C.clot, 'kín trong mô')}</g>`;
    o += `<g data-set="!fix" transform="translate(488 214)"><rect x="-50" y="-52" width="100" height="104" rx="16" fill="${s.fix ? C.mint : '#fff'}" stroke="${s.fix ? C.green : C.soft}" stroke-width="1.4" ${s.fix ? '' : 'stroke-dasharray="5 4"'}/><text x="-18" y="-16" text-anchor="middle" font-size="24">🔦</text><text x="20" y="-16" text-anchor="middle" font-size="24">🪡</text>${T(0, 8, 'Bộc lộ & khâu', { s: 11.5 })}${T(0, 24, 'ánh sáng · dụng cụ', { s: 9.5, c: C.mute })}${T(0, 36, '· người hỗ trợ', { s: 9.5, c: C.mute })}${ZS.sw(12, 40, s.fix, C.green)}</g>` + (s.fix ? '' : T(488, 316, '👆 bấm để khâu', { s: 10, c: C.soft }));
    return o;
  },
  say: s => s.fix ? ['happy', 'Bộc lộ rõ nguồn chảy rồi khâu. Không khâu mù chỗ không thấy rõ; cần ánh sáng, dụng cụ, vô cảm và người hỗ trợ.'] : s.utero ? ['worry', 'Thuốc gò chỉ làm cơ tử cung co — vết rách đường sinh dục vẫn chảy! Tử cung chắc mà máu vẫn ra: nghĩ Trauma.'] : ['sad', 'Rách cổ tử cung/âm đạo/tầng sinh môn hoặc máu tụ dưới niêm mạc. Máu có thể tụ kín: đau tăng, chèn ép, sốc không tương xứng máu ngoài.']
});

// ───────── escalate: ép — bóng chèn — B-Lynch — thắt mạch — cắt tử cung
const ESC = { hand: ['🤲 Ép hai tay', 'Cầu nối tạm trong đờ tử cung.', 'tạm giữ', 60], balloon: ['🎈 Bóng chèn', 'Áp lực cơ học từ trong buồng. WHO: sau sinh âm đạo, khi thất bại đầu tay, đã loại trừ Trauma/Tissue, có người huấn luyện, theo dõi, sẵn máu & phẫu thuật.', 'tạm giữ', 70], blynch: ['🧵 B-Lynch', 'Khâu ép thành tử cung (phẫu thuật).', 'phẫu thuật', 75], ligate: ['🔗 Thắt/thuyên tắc mạch', 'Giảm dòng máu đến tử cung.', 'phẫu thuật', 65], hyst: ['✂️ Cắt tử cung', 'Cứu sống khi không kiểm soát được hoặc tổn thương quá nặng.', 'triệt để', 100] };
kit('escalate', {
  zones: () => ({ temp: [96, 150, 70, 74], site: [280, 140, 90, 100], final: [470, 150, 70, 100] }),
  init: () => ({ m: 'hand', unstable: false }),
  ui: () => [{ t: 'seg', k: 'm', opts: Object.entries(ESC).map(([k, v]) => [k, v[0]]) }, { t: 'tog', k: 'unstable', label: '🚨 Mẹ đang mất ổn định' }],
  draw: s => {
    const m = s.m, red = ESC[m][3];
    let o = `<rect x="150" y="24" width="270" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    if (m === 'hyst') o += `<g opacity=".28">${uterusSag({ x: 285, y: 36, k: .8 })}</g>` + `<path d="M230 200 q55 -26 110 0" fill="none" stroke="${C.green}" stroke-width="5" stroke-linecap="round" stroke-dasharray="6 6"/>` + T(285, 250, 'đã lấy bỏ nguồn chảy máu', { s: 11, c: C.green });
    else o += uterusSag({ x: 285, y: 36, k: .8, cav: m === 'balloon' ? '#d6ebff' : '#fffafc' });
    if (m === 'hand') o += `<g class="wob"><rect x="190" y="110" width="40" height="84" rx="20" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/></g><g class="wob"><rect x="340" y="110" width="40" height="84" rx="20" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/></g>` + arrow('M232 152 H252', C.green, 4) + arrow('M338 152 H318', C.green, 4);
    if (m === 'balloon') o += `<g class="beat"><ellipse cx="285" cy="128" rx="44" ry="54" fill="url(#gBlue)" stroke="${C.cap}" stroke-width="3" opacity=".95"/></g><path d="M285 182 V250" stroke="${C.cap}" stroke-width="6" stroke-linecap="round"/>` + T(285, 132, 'bóng', { s: 12, c: '#fff' });
    if (m === 'blynch') o += `<path d="M222 96 Q285 30 348 96 M226 188 Q285 232 344 188 M222 96 V188 M348 96 V188" fill="none" stroke="${C.green}" stroke-width="3.5" stroke-dasharray="7 6" stroke-linecap="round"/>` + arrow('M200 142 H228', C.green, 4) + arrow('M370 142 H342', C.green, 4);
    if (m === 'ligate') o += [[236, 214], [334, 214]].map(([x, y]) => `<path d="M${x} ${y} q${x < 285 ? -30 : 30} -14 ${x < 285 ? -44 : 44} -60" fill="none" stroke="${C.red}" stroke-width="8" stroke-linecap="round"/><circle cx="${x + (x < 285 ? -22 : 22)}" cy="${y - 34}" r="9" fill="${C.butter}" stroke="${C.butterD}" stroke-width="2.5"/>${T(x + (x < 285 ? -22 : 22), y - 30, '×', { s: 13 })}`).join('') + T(285, 254, 'giảm dòng máu đến tử cung', { s: 10.5, c: C.mute });
    const n = Math.round((100 - red) / 26); for (let i = 0; i < n; i++) o += drop(268 + (i - (n - 1) / 2) * 20, 262, .6, 'drip');
    o += `<g transform="translate(20 24)"><rect width="122" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>${T(61, 24, 'Mức chảy máu', { s: 11.5 })}<rect x="42" y="38" width="38" height="150" rx="12" fill="#f4f0fb"/><rect x="42" y="${38 + 150 * (red / 100)}" width="38" height="${150 * (1 - red / 100)}" rx="12" fill="${C.red}"/>${T(61, 212, ESC[m][2], { s: 12, c: m === 'hyst' ? C.green : C.amber })}${T(61, 228, m === 'hyst' ? '' : 'chưa triệt để', { s: 10, c: C.mute })}</g>`;
    o += `<g transform="translate(432 24)"><rect width="114" height="238" rx="18" fill="${s.unstable ? C.pink : '#fff'}" stroke="${s.unstable ? C.red : C.grid}" stroke-width="2.5"/><text x="57" y="62" text-anchor="middle" font-size="38" ${s.unstable ? 'class="pulse"' : ''}>${s.unstable ? '🚨' : '🙂'}</text>${T(57, 98, s.unstable ? 'Mất ổn định' : 'Còn ổn định', { s: 12 })}${(s.unstable ? ['không bắt buộc', 'thử hết bảo tồn', 'cứu sống kịp thời'] : ['chọn theo nguồn chảy,', 'mức nặng, đáp ứng', 'và nguồn lực']).map((t, i) => T(57, 126 + i * 16, t, { s: 10.5, c: C.mute })).join('')}</g>`;
    return o;
  },
  say: s => s.unstable ? ['ouch', 'Mẹ mất ổn định: không bắt buộc thử hết mọi biện pháp bảo tồn — quyết định cứu sống kịp thời cùng đội chuyên khoa. (Couvelaire đơn độc không tự động là chỉ định cắt.)'] : ['happy', ESC[s.m][1]]
});

// ───────── inversion: lộn tử cung — đối lực khi kéo dây rốn
kit('inversion', {
  zones: (s, sp) => sp.mode === 'inv' ? { fundus: [250, 56, 92, 30], bed: [250, 130, 60, 50], fix: [386, 150, 40, 44] } : { uterus: [250, 110, 92, 80], hand: [160, 214, 34, 30], plac: [250, 290, 60, 24] },
  init: sp => sp.mode === 'inv' ? { d: 60 } : { counter: false, force: 'light' },
  ui: (s, sp) => sp.mode === 'inv' ? [{ t: 'range', k: 'd', label: '🌀 Đáy tử cung bị kéo vào trong', min: 0, max: 100, step: 5, unit: '%' }] : [{ t: 'tog', k: 'counter', label: '✋ Tay đối lực trên xương vệ' }, { t: 'seg', k: 'force', opts: [['light', '🤏 Kéo nhẹ'], ['strong', '💪 Kéo mạnh']] }],
  draw: (s, sp) => {
    const d = sp.mode === 'inv' ? s.d : (s.counter ? (s.force === 'strong' ? 40 : 0) : (s.force === 'strong' ? 90 : 25)), out = sp.mode !== 'inv' && s.counter && s.force === 'light', bad = d >= 60;
    const dip = d * 1.05;
    let o = `<rect x="20" y="24" width="${sp.mode === 'inv' ? 408 : 416}" height="${sp.mode === 'inv' ? 226 : 238}" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += `<g transform="translate(250 ${sp.mode === 'inv' ? 28 : 34}) scale(${sp.mode === 'inv' ? .72 : .8}) translate(-130 0)"><path d="M26 118 Q18 18 130 ${10 + dip} Q242 18 234 118 Q230 190 168 226 L164 262 H96 L92 226 Q30 190 26 118Z" fill="${bad ? '#f7a9bb' : 'url(#gMyo)'}" stroke="${C.myoD}" stroke-width="2.5" stroke-linejoin="round"/>` + (d < 40 ? `<path d="M52 118 Q46 40 130 ${34 + dip * .5} Q214 40 208 118 Q204 176 156 208 L152 262 H108 L104 208 Q56 176 52 118Z" fill="#fffafc" stroke="${C.decid}" stroke-width="5"/>` : `<path d="M52 150 Q56 190 104 208 L108 262 H152 L156 208 Q204 190 208 150 Q170 ${120 + dip * .35} 130 ${130 + dip * .4} Q90 ${120 + dip * .35} 52 150Z" fill="#fffafc"/>`) + `</g>`;
    if (d < 40 || out) { if (!out) o += `<path d="M250 112 Q262 ${sp.mode === 'inv' ? 150 : 200} 250 ${sp.mode === 'inv' ? 226 : 296}" fill="none" stroke="${C.mute}" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>`; }
    else o += `<path d="M250 ${bad ? 150 : 120} Q262 ${sp.mode === 'inv' ? 190 : 220} 250 ${sp.mode === 'inv' ? 226 : 280}" fill="none" stroke="${C.mute}" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>`;
    if (bad && sp.mode === 'inv') o += `<path d="M232 224 Q250 ${250 + d * .4} 268 224" fill="url(#gMyo)" stroke="${C.myoD}" stroke-width="2.5"/>`;
    if (sp.mode === 'inv') {
      const stages = [[0, 'bình thường'], [35, 'lõm đáy'], [65, 'lộn một phần'], [95, 'lộn hoàn toàn']], cur = d < 20 ? 0 : d < 50 ? 1 : d < 80 ? 2 : 3;
      o += stages.map(([dd, nm], i) => `<g transform="translate(${44 + i * 98} 268)" opacity="${i === cur ? 1 : .5}"><rect x="-6" y="-10" width="84" height="66" rx="14" fill="${i === cur ? C.butter : '#fff'}" stroke="${i === cur ? C.butterD : C.grid}" stroke-width="2.5"/><g transform="translate(36 -4) scale(.2) translate(-130 0)"><path d="M26 118 Q18 18 130 ${10 + dd * 1.05} Q242 18 234 118 Q230 190 168 226 L164 262 H96 L92 226 Q30 190 26 118Z" fill="url(#gMyo)" stroke="${C.myoD}" stroke-width="7"/></g>${T(36, 54, nm, { s: 9.5 })}</g>`).join('');
      o += `<g transform="translate(386 150)"><rect x="-36" y="-40" width="72" height="80" rx="16" fill="#fff" stroke="${C.soft}" stroke-width="2.5"/><text y="4" text-anchor="middle" font-size="28">🧑‍⚕️</text>${T(0, 30, 'hoàn vị', { s: 10.5 })}</g>`;
      o += bad ? `<g class="pulse">${T(104, 150, '⚡ sốc nhanh', { s: 11.5, c: C.redD })}${T(104, 165, 'không sờ thấy đáy', { s: 11, c: C.redD })}</g>` : T(104, 150, d >= 30 ? 'đáy lõm vào' : 'đáy ở vị trí', { s: 11.5, c: C.mute }) + (d >= 30 ? '' : T(104, 165, 'bình thường', { s: 11.5, c: C.mute }));
      o += `<g transform="translate(436 24)"><rect width="110" height="0"/></g>`;
    } else {
      o += `<g class="${s.counter ? 'hop' : ''}"><text x="160" y="230" text-anchor="middle" font-size="36" opacity="${s.counter ? 1 : .3}">✋</text></g>` + T(160, 250, 'đối lực', { s: 10.5, c: C.mute });
      o += `<g transform="translate(250 ${out ? 300 : 282})"><path d="M-34 0 Q0 -18 34 0 Q22 16 0 12 Q-22 16 -34 0Z" fill="url(#gPlac)" stroke="${C.placD}" stroke-width="2.5"/></g>` + arrow(`M250 ${s.force === 'strong' ? 306 : 316} V${s.force === 'strong' ? 330 : 326}`, C.ink, 4);
      o += T(350, 104, s.force === 'strong' ? '💪 kéo mạnh' : '🤏 kéo nhẹ', { s: 13 }) + (bad ? `<g class="pulse">${T(350, 130, '⚠️ đáy bị lộn', { s: 13, c: C.redD })}</g>` : out ? T(350, 130, '✓ nhau sổ → kiểm tra đủ', { s: 11.5, c: C.green }) : '');
    }
    o += `<g transform="translate(436 24)"><rect width="110" height="238" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>${T(55, 24, 'Mức lộn', { s: 11.5 })}<rect x="40" y="36" width="30" height="150" rx="12" fill="#f4f0fb"/><rect x="40" y="${36 + 150 * (1 - Math.min(100, d) / 100)}" width="30" height="${150 * Math.min(100, d) / 100}" rx="12" fill="${bad ? C.red : C.amber}"/>${T(55, 212, d < 30 ? 'bình thường' : d < 60 ? 'một phần' : 'LỘN', { s: 12, c: bad ? C.redD : C.ink })}</g>`;
    return o;
  },
  say: (s, sp) => { if (sp.mode === 'inv') return s.d >= 60 ? ['ouch', 'Đáy lộn vào/qua cổ tử cung: sốc nhanh, chảy máu, không sờ thấy đáy qua bụng. Gọi hỗ trợ + hồi sức + hoàn vị bởi người có năng lực.'] : s.d >= 30 ? ['worry', 'Đáy đang lõm vào — lộn một phần.'] : ['happy', 'Đáy tử cung ở đúng chỗ (hoặc đã được hoàn vị).']; return !s.counter && s.force === 'strong' ? ['ouch', 'Kéo mạnh mà không có tay đối lực → lôi đáy tử cung xuống → LỘN TỬ CUNG + xuất huyết!'] : s.counter && s.force === 'light' ? ['happy', 'Tử cung co + tay đối lực trên vệ + kéo nhẹ → nhau sổ êm; rồi kiểm tra nhau có đủ không.'] : !s.counter ? ['worry', 'Thiếu tay đối lực: dù kéo nhẹ vẫn nguy hiểm. Kỹ thuật này phải tập trên mô hình có giám sát.'] : ['worry', 'Có đối lực nhưng kéo thô bạo vẫn sai — nếu nhau không xuống thuận lợi, DỪNG và đánh giá lại.']; }
});
})();
