'use strict';
/* Trang tí hon — chương 04 Nhau tiền đạo. Hình: Servier Medical Art (CC BY 4.0) cho nhau tiền đạo / nhau bình thường, người; sơ đồ tự vẽ tử cung nhìn dọc có mép nhau đo được. */
(() => {
const ZS = window.ZS, { C, T, kit, arrow } = ZS, B = ZS.beats;
const { Th, card, pic, tap, call, tcard, pcard, flow, heart, drops, vital, verdict, seen, markSeen, tfKit } = ZS.BK;
const SV = 'Servier Medical Art · CC BY 4.0';
// tử cung nhìn dọc + bánh nhau bám thành sau; e = khoảng cách mép nhau → lỗ trong (mm; âm = che lỗ). L = độ dài đoạn dưới thêm
const UT = (x, y, k, e, o = {}) => {
  const P = (lx, ly) => [+(x + (lx - 130) * k).toFixed(1), +(y + ly * k).toFixed(1)], os = P(130, 208);
  let s = ZS.uterusSag({ x, y, k });
  const tEnd = e > 0 ? Math.max(.15, 1 - e / 70) : 1, cover = e < 0 ? Math.min(40, -e) : 0, pts = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20 * tEnd, lx = (1 - t) ** 2 * 205 + 2 * (1 - t) * t * 214 + t * t * 154, ly = (1 - t) ** 2 * 70 + 2 * (1 - t) * t * 170 + t * t * 206; pts.push(P(lx, ly)); }
  if (cover) pts.push(P(154 - cover * 1.3, 207));
  const d = 'M' + pts.map(p => p.join(' ')).join(' L');
  s += `<path d="${d}" fill="none" stroke="${C.placD}" stroke-width="${26 * k}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#e66d78" stroke-width="${21 * k}" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (o.bleed) s += `<path d="M${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]} Q${os[0] + 6} ${os[1]} ${os[0]} ${os[1] + 60 * k}" fill="none" stroke="${C.red}" stroke-width="${7 * k}" stroke-linecap="round"/>` + drops(os[0], os[1] + 74 * k, 3, .7, 12);
  if (o.measure && e > 0) { const end = pts[pts.length - 1]; s += `<path d="M${end[0]} ${end[1]} L${os[0]} ${os[1]}" stroke="${C.ink}" stroke-width="1.6" stroke-dasharray="4 3"/><circle cx="${os[0]}" cy="${os[1]}" r="4" fill="${C.ink}"/>` + Th((end[0] + os[0]) / 2 + 10, (end[1] + os[1]) / 2 - 8, e + ' mm', { a: 'start', s: 13 }); }
  if (o.osLabel) s += Th(os[0] - 14, os[1] + 4, 'lỗ trong', { a: 'end', s: 12, c: C.ink }) + `<circle cx="${os[0]}" cy="${os[1]}" r="4" fill="${C.ink}"/>`;
  return { svg: s, os, edge: pts[pts.length - 1] };
};
const cls = e => e <= 0 ? ['Nhau tiền đạo', 'mép nhau chạm / che lỗ trong', C.redD, 'sv-nhau-tien-dao.png'] : e < 20 ? ['Nhau bám thấp', 'mép nhau < 20 mm, chưa chạm', '#b5651d', 'sv-nhau-tien-dao.png'] : ['Vị trí bình thường', 'mép nhau ≥ 20 mm', C.green, 'sv-nhau-binh-thuong.png'];

// ═════════ Cùng một bánh nhau, khác vị trí là khác rủi ro
kit('bn-vt', {
  init: () => ({ e: 40, seen: '' }), ui: () => [{ t: 'range', k: 'e', label: '📏 Mép nhau → lỗ trong', min: -30, max: 40, step: 5, unit: ' mm' }], after: s => markSeen(s, cls(s.e)[0]), goal: s => cls(-1).slice(0, 1).concat(cls(10)[0]).every(k => seen(s, k)),
  draw: s => {
    const U = UT(180, 40, .95, s.e, { measure: true, osLabel: true }), c = cls(s.e);
    let o = card(20, 20, 330, 316, '#fffdfa') + U.svg + Th(180, 334, 'tử cung nhìn dọc (sau 16 tuần)', { s: 12, c: C.mute });
    o += card(362, 20, 188, 316) + `<g class="${ZS.fresh(s, z => cls(z.e)[0] === c[0]) ? 'fadein' : ''}">${pic(c[3], 386, 32, 140, 160)}${T(456, 222, c[0], { s: 16, c: c[2] })}${ZS.wrap(c[1], 22).map((l, i) => T(456, 246 + i * 18, l, { s: 12.5, c: C.mute })).join('')}</g>` + T(456, 314, 'RCOG 2026 · đo bằng TVS', { s: 11, c: C.mute });
    return o;
  },
  say: s => ['Nhau tiền đạo', 'Nhau bám thấp'].every(k => seen(s, k)) ? ['happy', '**Tiền đạo**: mép nhau **chạm/che** lỗ trong. **Bám thấp**: mép nhau **< 20 mm** nhưng chưa chạm. Đo bằng **TVS**; tên cũ “trung tâm, bám mép…” chỉ là lịch sử.'] : ['happy', 'Kéo thanh **📏 Mép nhau → lỗ trong** về gần 0 và qua số âm 👆']
});
kit('bn-di', {
  init: () => ({ w: 20 }), ui: () => [{ t: 'range', k: 'w', label: '🤰 Tuổi thai', min: 20, max: 36, step: 2, unit: ' tuần' }], goal: s => s.w >= 32,
  draw: s => {
    const g = (s.w - 20) / 16, e = Math.round(8 + 22 * g), U = UT(180, 30, .8 + .14 * g, e, { measure: true, osLabel: true });
    let o = card(20, 20, 330, 316, '#fffdfa') + U.svg;
    o += card(362, 20, 188, 316) + T(456, 54, s.w + ' tuần', { s: 22 }) + T(456, 92, cls(e)[0], { s: 15, c: cls(e)[2] }) + T(456, 140, 'đoạn dưới dài ra', { s: 13 }) + T(456, 160, '→ mép nhau xa dần', { s: 13 }) + T(456, 210, 'bánh nhau KHÔNG bò', { s: 13.5, c: C.redD }) + T(456, 230, 'trên thành tử cung', { s: 13, c: C.mute }) + T(456, 286, '→ tái đánh giá', { s: 13, c: C.green }) + T(456, 306, 'theo tuổi thai', { s: 13, c: C.green });
    return o;
  },
  say: s => s.w >= 32 ? ['wow', 'Đoạn dưới **dài ra** (và nhau phát triển về phía giàu máu) → mép nhau **xa dần** lỗ trong. Siêu âm sớm **chưa kết luận** được tới lúc sinh — tái đánh giá.'] : ['happy', 'Siêu âm 20 tuần thấy nhau bám thấp. Kéo **🤰 Tuổi thai** lên 👆']
});
B['vi-tri-nhau'] = [
  { t: 'Mép nhau cách lỗ trong bao xa?', kit: 'bn-vt', cr: 'Ảnh nhau: ' + SV },
  { t: 'Nhau không bò, đoạn dưới dài ra', kit: 'bn-di' }
];

// ═════════ Nguy cơ NTĐ
const RFN = [['ntd', 'NTĐ lần trước'], ['mo', 'Mổ / phẫu thuật tử cung'], ['ds', 'Đa sản'], ['tuoi', 'Tuổi mẹ cao'], ['thuoc', 'Thuốc lá, cocaine'], ['ivf', 'IVF, đa thai'], ['uxo', 'U xơ, endometriosis'], ['kt', 'Khoảng cách thai ngắn']];
kit('bn-ng', {
  init: () => Object.fromEntries(RFN.map(([k]) => [k, false])), ui: () => [], goal: s => RFN.filter(([k]) => s[k]).length >= 3,
  draw: s => {
    const n = RFN.filter(([k]) => s[k]).length;
    let o = RFN.map(([k, t], i) => tcard('!' + k, 20 + (i % 2) * 176, 20 + Math.floor(i / 2) * 80, 168, 70, s[k], [t], '#ffe0e6')).join('');
    o += card(372, 20, 178, 316) + T(461, 52, 'khả năng nhau thấp', { s: 12.5, c: C.mute }) + `<rect x="446" y="70" width="30" height="180" rx="15" fill="#f4f0fb" stroke="${C.grid}"/><rect x="450" y="${246 - 22 * n}" width="22" height="${22 * n + 2}" rx="11" fill="${n > 4 ? C.red : n > 1 ? C.amber : C.mintD}"/>`;
    o += T(461, 282, 'gợi ý XÁC SUẤT', { s: 13 }) + T(461, 302, 'không có ≠ loại trừ', { s: 12.5, c: C.redD });
    return o;
  },
  say: s => RFN.filter(([k]) => s[k]).length >= 3 ? ['happy', 'Yếu tố nguy cơ là **gợi ý xác suất**, không chứng minh nguyên nhân. Hỏi để **chuẩn bị đúng**, không để loại trừ.'] : ['happy', 'Bật vài **yếu tố nguy cơ** — nhìn cột khả năng 👆']
});
kit('bn-seo', {
  init: () => ({ seo: false, truoc: false }), ui: () => [], goal: s => s.seo && s.truoc,
  draw: s => {
    const P = (lx, ly) => [+(170 + (lx - 130) * .95).toFixed(1), +(40 + ly * .95).toFixed(1)];
    let o = card(20, 20, 300, 316, '#fffdfa') + ZS.uterusSag({ x: 170, y: 40, k: .95 });
    if (s.truoc) { const pts = [[56, 120], [60, 170], [96, 200], [128, 207]].map(p => P(...p)).map(p => p.join(' ')).join(' L'); o += `<path d="M${pts}" fill="none" stroke="${C.placD}" stroke-width="25" stroke-linecap="round"/><path d="M${pts}" fill="none" stroke="#e66d78" stroke-width="20" stroke-linecap="round"/>`; }
    if (s.seo) o += `<path d="M${P(36, 176).join(' ')} l18 6" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>` + Th(...P(20, 196), 'sẹo mổ', { a: 'end', s: 12.5 });
    if (s.seo && s.truoc) o += `<circle cx="${P(50, 182)[0]}" cy="${P(50, 182)[1]}" r="26" fill="none" stroke="${C.red}" stroke-width="3" class="pulse"/>`;
    o += tcard('!seo', 332, 20, 218, 70, s.seo, ['✂️ Mổ lấy thai cũ', 'sẹo đoạn dưới mặt trước']) + tcard('!truoc', 332, 100, 218, 70, s.truoc, ['🥞 Nhau mặt TRƯỚC thấp', 'đè lên vùng sẹo']);
    o += s.seo && s.truoc ? ZS.fade(verdict(332, 186, 218, false, 'Nghĩ PAS!', 'khảo sát có chủ đích') + T(441, 276, '“Biên bản mổ', { s: 12.5 }) + T(441, 296, 'có thể xem được không?”', { s: 12.5 }), true) : '';
    return o;
  },
  say: s => s.seo && s.truoc ? ['worry', 'Sẹo mổ cũ + nhau **mặt trước thấp đè lên sẹo** → hỏi và **khảo sát PAS có chủ đích**. Không hứa chắc “không PAS” chỉ vì ít lần mổ.'] : ['happy', 'Bật **cả hai** thẻ bên phải 👆']
});
B['nguy-co-ntd'] = [
  { t: 'Nguy cơ: gợi ý xác suất', kit: 'bn-ng' },
  { t: 'Sẹo mổ + nhau trước thấp → PAS?', kit: 'bn-seo' }
];

// ═════════ Cơ chế
kit('bn-tach', {
  init: () => ({ g: 0 }), ui: () => [{ t: 'range', k: 'g', label: '↕️ Đoạn dưới giãn, CTC thay đổi', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.g >= 70,
  draw: s => {
    const f = s.g / 100, U = UT(180, 40, .95, -20, { bleed: f >= .5, osLabel: true });
    let o = card(20, 20, 330, 316, '#fffdfa') + U.svg;
    if (f > .2) o += `<path d="M${U.os[0] + 6} ${U.os[1] - 10} q12 -10 22 -4" fill="none" stroke="${C.clotD}" stroke-width="${2 + 4 * f}"/>` + Th(U.os[0] + 26, U.os[1] + 44, 'diện bám bị kéo tách', { a: 'start', s: 12.5, c: C.redD });
    o += card(362, 20, 188, 316) + T(456, 60, 'Máu mẹ', { s: 13, c: C.mute }) + T(456, 86, f >= .5 ? 'THOÁT RA ngoài' : 'chưa chảy', { s: 16, c: f >= .5 ? C.redD : C.green }) + T(456, 140, 'Tử cung', { s: 13, c: C.mute }) + T(456, 166, 'MỀM, không gồng', { s: 15, c: C.green }) + T(456, 220, 'thường không đau', { s: 13.5 }) + T(456, 242, 'đỏ tươi, tái phát', { s: 13, c: C.mute }) + T(456, 296, '(chuyển dạ kèm → có thể đau)', { s: 11.5, c: C.mute });
    return o;
  },
  say: s => s.g >= 70 ? ['worry', 'Đoạn dưới giãn, CTC thay đổi → diện nhau bám thấp **bị kéo tách** → máu mẹ **thoát ra CTC**. Ít tụ thành khối căng → thường **không đau**, tử cung mềm.'] : ['happy', 'Kéo thanh **↕️ Đoạn dưới giãn** — nhìn mép nhau che lỗ trong 👆']
});
kit('bn-sosanh', {
  init: () => ({ k: '', seen: '' }), ui: () => [{ t: 'seg', k: 'k', opts: [['ntd', '🥞 Nhau tiền đạo'], ['nbn', '🌩️ Nhau bong non']] }], after: s => markSeen(s, s.k), goal: s => seen(s, 'ntd') && seen(s, 'nbn'),
  draw: s => {
    let o = card(20, 20, 330, 316, '#fffdfa');
    if (s.k === 'ntd') o += UT(180, 40, .95, -20, { bleed: true }).svg;
    else if (s.k === 'nbn') { const U = UT(180, 40, .95, 50); o += `<g class="pulse">${U.svg}</g><ellipse cx="236" cy="${140}" rx="20" ry="44" fill="url(#gClot)" opacity=".95"/>` + Th(260, 120, 'máu kẹt sau nhau', { a: 'start', s: 12.5, c: C.clotD }); }
    else o += T(185, 180, '👆 chọn ở trên', { s: 14, c: C.soft });
    const M = { ntd: [['máu', 'thoát ra ngoài'], ['tử cung', 'mềm'], ['đau', 'thường không'], ['tim thai', 'ổn nếu mẹ ổn']], nbn: [['máu', 'có thể kẹt kín'], ['tử cung', 'gồng cứng'], ['đau', 'liên tục'], ['tim thai', 'thường xấu']] }[s.k];
    o += card(362, 20, 188, 316) + (M ? M.map(([a, b], i) => T(380, 70 + i * 62, a, { a: 'start', s: 12.5, c: C.mute }) + `<g class="fadein">${T(380, 92 + i * 62, b, { a: 'start', s: 15, c: s.k === 'nbn' ? C.redD : C.ink })}</g>`).join('') : '');
    return o;
  },
  say: s => seen(s, 'ntd') && seen(s, 'nbn') ? ['worry', 'NTĐ: máu **có lối thoát**, tử cung **mềm**. NBN: máu **kẹt sau nhau**, tử cung **gồng đau**. Nhưng **không dùng màu máu hay “không đau” đơn độc** để chẩn đoán.'] : ['happy', 'So hai bệnh: bấm **lần lượt** cả hai 👆']
});
kit('bn-sau', {
  init: () => ({ go: false, bong: false }), ui: () => [{ t: 'tog', k: 'go', label: '💉 Thêm thuốc gò' }, { t: 'tog', k: 'bong', label: '🎈 Chèn ép đoạn dưới (bóng)' }], goal: s => s.bong,
  draw: s => {
    let o = card(20, 20, 330, 316, '#fffdfa') + ZS.uterusSag({ x: 180, y: 50, k: s.go ? .66 : .72 }) + Th(180, 46, 'đáy CHẮC', { s: 13, c: C.green });
    o += `<path d="M150 ${s.go ? 186 : 194} Q180 ${s.go ? 200 : 206} 212 ${s.go ? 186 : 194}" fill="none" stroke="#e66d78" stroke-width="10" opacity=".6"/>` + Th(180, 236, 'diện nhau ở đoạn dưới', { s: 12.5, c: C.placD });
    if (s.bong) o += `<ellipse cx="180" cy="176" rx="34" ry="44" fill="#d9ecff" stroke="#7cb8f0" stroke-width="2" class="fadein"/>`;
    else o += drops(180, 286, 3, .8, 14);
    o += card(362, 20, 188, 316) + (s.bong ? ZS.fade(verdict(378, 100, 156, true, 'cầm được', 'ép trực tiếp đoạn dưới'), true) : s.go ? T(456, 120, 'đáy chắc hơn…', { s: 13 }) + T(456, 144, 'đoạn dưới VẪN chảy', { s: 14, c: C.redD }) : T(456, 140, 'sau sổ nhau', { s: 13, c: C.mute }));
    o += T(456, 260, 'đoạn dưới ít cơ', { s: 12.5, c: C.mute }) + T(456, 280, '→ siết mạch kém', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => s.bong ? ['wow', 'Diện nhau ở **đoạn dưới** siết mạch kém → **BHSS dù đáy gò chắc**. Chèn ép đoạn dưới có thể hiệu quả hơn chỉ thêm thuốc gò.'] : s.go ? ['worry', 'Thêm thuốc: đáy chắc hơn nhưng **đoạn dưới vẫn chảy**. Thử nút còn lại 👆'] : ['happy', 'Sau sinh, đáy tử cung **chắc** mà máu vẫn chảy. Thử **💉 Thêm thuốc gò** trước 👆']
});
B['co-che-ntd'] = [
  { t: 'Đoạn dưới giãn, diện nhau bị tách', kit: 'bn-tach' },
  { t: 'Vì sao thường không đau?', kit: 'bn-sosanh' },
  { t: 'Sau sinh: đáy chắc vẫn chảy', kit: 'bn-sau' }
];

// ═════════ Chẩn đoán: TVS
kit('bn-kham', {
  init: () => ({ ex: 'abd', seen: 'abd,' }), ui: () => [{ t: 'seg', k: 'ex', opts: [['abd', '🫃 Siêu âm bụng'], ['tvs', '📡 Siêu âm đầu dò âm đạo'], ['ngon', '🖐 Ngón tay']] }], after: s => markSeen(s, s.ex), goal: s => seen(s, 'tvs') && seen(s, 'ngon'),
  draw: s => {
    const U = UT(160, 40, .9, -15, { osLabel: true, bleed: s.ex === 'ngon' });
    let o = card(20, 20, 300, 316, '#fffdfa') + U.svg;
    if (s.ex === 'abd') o += `<rect x="128" y="18" width="40" height="18" rx="6" fill="${C.soft}"/><path d="M148 36 L80 230 A140 140 0 0 0 220 230Z" fill="#9ecdf7" opacity=".18"/>`;
    if (s.ex === 'tvs') o += `<g transform="rotate(-8 ${U.os[0]} ${U.os[1] + 80})"><rect x="${U.os[0] - 8}" y="${U.os[1] + 30}" width="16" height="70" rx="8" fill="${C.soft}"/></g><path d="M${U.os[0]} ${U.os[1] + 30} L${U.os[0] - 60} ${U.os[1] - 60} A100 100 0 0 1 ${U.os[0] + 60} ${U.os[1] - 60}Z" fill="#9ecdf7" opacity=".25"/>` + Th(U.os[0] + 16, U.os[1] + 70, 'không vào lỗ trong', { a: 'start', s: 12, c: C.mute });
    if (s.ex === 'ngon') o += `<path d="M${U.os[0] - 30} 330 Q${U.os[0] - 10} 280 ${U.os[0]} ${U.os[1] + 4}" fill="none" stroke="#e9b99a" stroke-width="14" stroke-linecap="round"/>`;
    // màn hình
    o += card(332, 20, 218, 316) + `<rect x="346" y="34" width="190" height="170" rx="12" fill="${s.ex === 'ngon' ? '#fff1f4' : '#15141f'}"/>`;
    if (s.ex === 'ngon') o += T(441, 110, '⛔', { s: 38 }) + T(441, 150, 'tách thêm diện nhau', { s: 12.5, c: C.redD }) + T(441, 170, '→ chảy máu ồ ạt', { s: 12.5, c: C.redD });
    else o += `<path d="M441 42 L360 196 A160 160 0 0 0 522 196Z" fill="#26243a"/><g ${s.ex === 'abd' ? 'filter="url(#blr)"' : ''}><path d="M441 70 V176" stroke="#5f5c80" stroke-width="9" stroke-linecap="round"/><path d="M404 118 Q436 140 452 172" fill="none" stroke="#f3b6c8" stroke-width="12" stroke-linecap="round"/></g>` + (s.ex === 'tvs' ? T(441, 196, 'thấy rõ mép nhau ↔ lỗ trong', { s: 11.5, c: '#d8d0f5' }) : T(441, 196, 'mờ: bàng quang, đầu thai che', { s: 11.5, c: '#d8d0f5' }));
    const v = { abd: ['⚠ có thể chưa đủ', 'nghi ngờ → TVS', C.butter], tvs: ['✓ an toàn, rõ nhất', 'kể cả khi đang ra huyết', C.mint], ngon: ['✗ KHÔNG làm', 'khi chưa loại trừ NTĐ', '#ffd0d8'] }[s.ex];
    o += `<rect x="346" y="216" width="190" height="64" rx="14" fill="${v[2]}"/>` + T(441, 242, v[0], { s: 14 }) + T(441, 264, v[1], { s: 12, c: C.mute });
    return o;
  },
  say: s => seen(s, 'tvs') && seen(s, 'ngon') ? ['wow', '**TVS** đúng kỹ thuật: đầu dò ở âm đạo, không vào lỗ trong → thấy rõ mép nhau, **an toàn**. **Ngón tay** qua lỗ trong khi chưa loại trừ NTĐ → **chảy máu ồ ạt**.'] : ['happy', 'Ra huyết cuối thai kỳ, chưa biết vị trí nhau. So **3 cách khám** 👆']
});
tfKit('bn-khq', [['Sợ TVS nên chỉ dùng siêu âm bụng', false], ['Dùng ngón tay để “xác nhận” nhau tiền đạo', false], ['Mỏ vịt nhẹ nhàng tìm nguồn thấp là việc khác', true], ['Mẹ bất ổn: hồi sức trước, không chờ đủ khám', true]], 'Không để **nỗi sợ TVS** bỏ phương tiện tốt; không dùng **tay** để xác nhận NTĐ. Người bất ổn: **hồi sức trước**.');
B['chan-doan-ntd'] = [
  { t: 'Ba cách khám: cái nào an toàn?', kit: 'bn-kham' },
  { t: 'Bốn câu về thăm khám', kit: 'bn-khq' }
];

// ═════════ PAS
const PASL = [['Bình thường', 'có lớp màng rụng ngăn cách', C.green], ['Accreta', 'bám thẳng vào bề mặt cơ', '#b8860b'], ['Increta', 'xâm nhập vào cơ', '#c0561a'], ['Percreta', 'xuyên qua thanh mạc → bàng quang', C.redD]];
kit('bn-pas', {
  init: () => ({ d: 0 }), ui: () => [{ t: 'range', k: 'd', label: '🌱 Gai nhau ăn sâu', min: 0, max: 3, step: 1, unit: '/3' }], goal: s => s.d >= 3,
  draw: s => {
    const d = s.d, dep = [0, 18, 80, 150][d];
    let o = card(20, 20, 330, 316, '#fffdfa') + `<path d="M40 60 Q185 30 330 60 V110 Q185 90 40 110Z" fill="url(#gPlac)" stroke="${C.placD}"/>` + T(185, 82, 'bánh nhau', { s: 13, c: '#fff' });
    o += d === 0 ? `<rect x="40" y="110" width="290" height="12" fill="${C.decid}"/>` + Th(320, 120, 'màng rụng', { a: 'end', s: 11.5, c: C.myoD }) : '';
    o += `<rect x="40" y="${d ? 110 : 122}" width="290" height="${d ? 150 : 138}" fill="url(#gMyo)"/><rect x="40" y="260" width="290" height="12" fill="url(#gSer)"/><path d="M60 286 Q185 330 310 286 V330 H60Z" fill="${C.bladder}" stroke="#86b6e6"/>` + Th(185, 318, 'bàng quang', { s: 12.5, c: '#2b6cb0' }) + Th(320, 200, 'cơ', { a: 'end', s: 12, c: C.myoD }) + Th(320, 268, 'thanh mạc', { a: 'end', s: 11.5, c: '#7b6ba3' });
    if (d) o += [80, 130, 185, 240, 290].map(x => `<path d="M${x} 110 q${x % 2 ? 6 : -6} ${dep / 2} 0 ${dep + (d === 3 ? 24 : 0)}" fill="none" stroke="${C.placD}" stroke-width="7" stroke-linecap="round"/>`).join('');
    const L = PASL[d];
    o += card(362, 20, 188, 316) + `<g class="${ZS.fresh(s, z => z.d === d) ? 'fadein' : ''}">${T(456, 70, L[0], { s: 19, c: L[2] })}${ZS.wrap(L[1], 20).map((l, i) => T(456, 98 + i * 18, l, { s: 12.5, c: C.mute })).join('')}</g>`;
    o += T(456, 220, 'mô tả MỨC xâm lấn', { s: 12.5 }) + T(456, 240, 'không tự phân loại', { s: 12, c: C.mute }) + T(456, 258, 'chỉ bằng màu siêu âm', { s: 12, c: C.mute });
    return o;
  },
  say: s => s.d >= 3 ? ['ouch', 'PAS: **accreta** bám bề mặt cơ · **increta** vào cơ · **percreta** xuyên thanh mạc, có thể tới **bàng quang**. Mất mặt phẳng tách → bóc nhau chảy máu dữ dội.'] : ['happy', 'Kéo thanh **🌱 Gai nhau ăn sâu** từng mức 👆']
});
const PASP = [['dck', '👥 Đội đa chuyên khoa'], ['mau', '🩸 Máu & chế phẩm sẵn'], ['gm', '😷 Gây mê hồi sức'], ['pm', '🏥 Phòng mổ, cơ sở phù hợp'], ['sa', '🖥 Siêu âm chuyên sâu ± MRI'], ['khong', '✋ KHÔNG cố bóc nhau']];
kit('bn-pasp', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => PASP.every(([k]) => seen(s, k)),
  draw: s => T(285, 40, 'Nghi PAS: dựng kế hoạch — bật từng mục', { s: 14 }) + PASP.map(([k, t], i) => tcard('!' + k, 20 + (i % 2) * 268, 56 + Math.floor(i / 2) * 92, 262, 82, seen(s, k), [t], k === 'khong' ? '#ffe0e6' : C.mint)).join(''),
  say: s => PASP.every(([k]) => seen(s, k)) ? ['happy', 'Nghi PAS cần **kế hoạch đa chuyên khoa**: máu, gây mê, phòng mổ, cơ sở phù hợp, hình ảnh chuyên sâu — và **không cố bóc nhau** trong mổ.'] : ['happy', 'Bật đủ **6 mục** của kế hoạch 👆']
});
B['pas'] = [
  { t: 'Accreta, increta, percreta', kit: 'bn-pas' },
  { t: 'Nghi PAS: kế hoạch trước', kit: 'bn-pasp' }
];

// ═════════ Quản lý
kit('bn-khan', {
  init: () => ({ batOn: false, cho: false }), ui: () => [{ t: 'tog', k: 'batOn', label: '🚨 Mẹ bất ổn / chảy không kiểm soát' }, { t: 'tog', k: 'cho', label: '⏳ Chờ đủ corticoid' }], goal: s => s.batOn && !s.cho,
  draw: s => {
    const bad = s.batOn, wait = s.cho;
    let o = card(20, 20, 530, 316, '#fffdfa');
    o += vital(40, 40, 'Mạch', bad ? 132 : 88, bad ? '#ff6b7a' : '#7ee2b8', 150) + vital(40, 96, 'HA', bad ? '82/50' : '118/72', bad ? '#ff6b7a' : '#7ee2b8', 150) + T(115, 176, bad ? '🩸 chảy ồ ạt' : '🩸 ít, đã ngừng', { s: 14, c: bad ? C.redD : C.green });
    const r = bad ? (wait ? ['✗ KHÔNG chờ', 'mẹ/thai nguy kịch không chờ corticoid', false] : ['Hồi sức + CAN THIỆP KHẨN', 'máu, mổ lấy thai, đội', true]) : ['Theo dõi có chuẩn bị', 'nếu còn non & cơ sở sẵn sàng', true];
    o += `<rect x="220" y="40" width="310" height="140" rx="18" fill="${r[2] ? (bad ? '#ffe0cc' : C.mint) : '#ffd0d8'}"/>` + `<g class="fadein">${T(375, 100, r[0], { s: 17, c: r[2] ? (bad ? '#c0561a' : C.green) : C.redD })}${T(375, 130, r[1], { s: 13, c: C.mute })}</g>`;
    o += T(285, 230, 'Chuẩn bị luôn: nhóm máu · phản ứng chéo · thiếu máu · đông máu', { s: 13 }) + T(285, 260, 'corticoid / biện pháp non tháng: chỉ khi có chỉ định', { s: 12.5, c: C.mute }) + T(285, 286, 'không trì hoãn sinh cứu mẹ – thai để hoàn tất', { s: 12.5, c: C.redD });
    return o;
  },
  say: s => s.batOn && !s.cho ? ['worry', 'Mẹ **bất ổn**, chảy không kiểm soát → **hồi sức + can thiệp khẩn**. Không chờ đủ corticoid hay xét nghiệm trưởng thành phổi.'] : s.cho && s.batOn ? ['ouch', 'Chờ corticoid khi mẹ đang nguy kịch là **sai**. Tắt **⏳** đi 👆'] : ['happy', 'Mẹ ổn → theo dõi có chuẩn bị. Bật **🚨 Mẹ bất ổn**, thử cả nút **⏳** 👆']
});
kit('bn-khi', {
  init: () => ({ ng: 'ump', seen: 'ump,' }), ui: () => [{ t: 'seg', k: 'ng', opts: [['ump', '📘 Giáo trình UMP'], ['rcog', '🇬🇧 RCOG 2026']] }], after: s => markSeen(s, s.ng), goal: s => seen(s, 'rcog'),
  draw: s => {
    const X = w => 60 + (w - 34) / 6 * 440, r = s.ng === 'rcog';
    let o = card(20, 20, 530, 316, '#fffdfa') + `<path d="M60 170 H500" stroke="${C.ink}" stroke-width="2"/>` + [34, 35, 36, 37, 38, 39, 40].map(w => `<path d="M${X(w)} 164 V176" stroke="${C.ink}"/>` + T(X(w), 196, w + 'w', { s: 12, c: C.mute })).join('');
    o += r ? `<rect x="${X(37)}" y="120" width="${X(37.86) - X(37)}" height="44" rx="8" fill="${C.sky}"/>` + T(X(37.4), 110, '37+0 → 37+6', { s: 13.5, c: '#2b6cb0' }) + `<path d="M${X(37.86)} 112 V176" stroke="${C.red}" stroke-width="2.4"/>` + T(X(37.86) + 6, 140, 'không muộn hơn 37+6', { a: 'start', s: 12.5, c: C.redD })
      : `<rect x="${X(37)}" y="120" width="${X(39) - X(37)}" height="44" rx="8" fill="${C.mint}"/>` + T(X(38), 110, 'mổ thường 37–38 tuần', { s: 13.5, c: C.green });
    o += T(285, 236, r ? 'NTĐ / bám thấp không triệu chứng: cá thể hóa' : 'người ổn định; sớm hơn nếu chảy nhiều / chuyển dạ', { s: 13 }) + T(285, 262, 'Nhau che lỗ trong → thường mổ · bám thấp → quyết theo TVS', { s: 13 }) + T(285, 296, 'Mẹ / thai nguy kịch: KHÔNG chờ các mốc này', { s: 13.5, c: C.redD });
    return o;
  },
  say: s => seen(s, 'rcog') ? ['happy', 'UMP: ổn định → mổ **37–38 tuần**. RCOG 2026: cá thể hóa, **không muộn hơn 37+6**. Nhau bám thấp **không tự động** phải mổ. Nguy kịch thì không chờ.'] : ['happy', 'Khi nào cho sinh? Bấm **🇬🇧 RCOG 2026** để so với giáo trình 👆']
});
B['quan-ly-ntd'] = [
  { t: 'Mẹ bất ổn: can thiệp khẩn', kit: 'bn-khan' },
  { t: 'Ổn định thì sinh khi nào?', kit: 'bn-khi' }
];

// ═════════ Tư vấn
const TV = [['vt', '📍 Vị trí & lý do chảy', '“Bánh nhau ở thấp, gần đường em bé ra — khi phần dưới tử cung thay đổi, chỗ bám có thể chảy máu.”'], ['ng', '⚠️ Nguy cơ mẹ – bé', '“Mẹ có thể mất máu, cần truyền máu; bé có thể sinh non hoặc thiếu oxy.”'], ['kh', '🗺 Kế hoạch', '“Mình thống nhất nơi theo dõi, người đưa đi, cách gọi cấp cứu.”'], ['bd', '🚨 Dấu báo động', '“Ra huyết lại, đau / co, choáng, thai máy giảm → vào viện ngay; choáng thì không tự lái xe.”']];
kit('bn-tv', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => TV.every(([k]) => seen(s, k)),
  draw: s => {
    let o = TV.map(([k, t], i) => pcard('!' + k, 20, 20 + i * 80, 200, 70, seen(s, k), seen(s, k) && s._k === k, [t])).join('');
    const last = TV.find(([k]) => s._k === k && seen(s, k)) || TV.filter(([k]) => seen(s, k)).slice(-1)[0];
    o += card(232, 20, 318, 316, '#fff') + `<g transform="translate(250 40)">${pic('sv-phu-nu.png', 210, 140, 52, 160)}</g>`;
    if (last) o += `<g class="fadein"><rect x="246" y="40" width="290" height="${ZS.wrap(last[2], 36).length * 20 + 24}" rx="16" fill="${C.lav}"/>${ZS.wrap(last[2], 36).map((l, i) => T(258, 64 + i * 20, l, { a: 'start', s: 13 })).join('')}</g>`;
    else o += T(390, 120, '👆 chạm từng thẻ bên trái', { s: 13.5, c: C.soft });
    return o;
  },
  say: s => TV.every(([k]) => seen(s, k)) ? ['happy', 'Tư vấn bằng **lời cụ thể**: vị trí & lý do chảy, nguy cơ mẹ–bé, kế hoạch, **dấu báo động**. Không hứa chắc bảo tồn tử cung.'] : ['happy', 'Bấm **4 thẻ** để ráp lời tư vấn 👆']
});
kit('bn-teach', {
  init: () => ({ tb: false }), ui: () => [{ t: 'tog', k: 'tb', label: '🔁 Mời chị nhắc lại' }], goal: s => s.tb,
  draw: s => {
    let o = card(20, 20, 530, 316, '#fffdfa') + pic('sv-phu-nu.png', 50, 50, 70, 250) + pic('sv-phu-nu.png', 450, 50, 70, 250);
    o += `<rect x="140" y="50" width="290" height="80" rx="18" fill="${C.sky}"/>` + T(285, 84, '“Chị nhắc lại giúp em: khi nào', { s: 14 }) + T(285, 106, 'cần vào viện ngay nhé?”', { s: 14 });
    if (s.tb) o += `<g class="fadein"><rect x="140" y="150" width="290" height="120" rx="18" fill="${C.mint}"/>${['ra huyết lại', 'đau bụng / gò', 'choáng → không tự lái xe', 'con máy ít'].map((t, i) => T(160, 178 + i * 24, '✓ ' + t, { a: 'start', s: 13.5 })).join('')}</g>` + T(285, 300, 'hai bên hiểu giống nhau → kế hoạch mới an toàn', { s: 13, c: C.green });
    return o;
  },
  say: s => s.tb ? ['wow', '**Teach-back**: mời người bệnh nhắc lại dấu báo động & kế hoạch — cách chắc nhất để biết hai bên **hiểu nhau**.'] : ['happy', 'Tư vấn xong. Kiểm tra chị hiểu chưa: bấm **🔁 Mời chị nhắc lại** 👆']
});
B['tu-van-ntd'] = [
  { t: 'Ráp lời tư vấn bốn phần', kit: 'bn-tv', cr: 'Người: ' + SV },
  { t: 'Teach-back: mời nhắc lại', kit: 'bn-teach', cr: 'Người: ' + SV }
];
})();
