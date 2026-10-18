'use strict';
/* Trang tí hon — chương 06 Vỡ tử cung, 07 TOLAC, 09 AFE & tổng hợp. Hình: Servier Medical Art (CC BY 4.0) cho tim, người; sơ đồ tự vẽ tử cung, CTG, mảng 1000 người, vòng tuần hoàn. */
(() => {
const ZS = window.ZS, { C, T, kit, arrow } = ZS, B = ZS.beats;
const { Th, card, pic, tap, call, tcard, pcard, flow, heart, drops, vital, verdict, seen, markSeen, tfKit, wall } = ZS.BK;
const SV = 'Servier Medical Art · CC BY 4.0';
const EZ = 'calcMode="spline" keyTimes="0;1" keySplines=".25 .9 .3 1"';
// CTG: bad 0–1 (nhịp chậm dần), x,y,w
const ctg = (x, y, w, bad, o = {}) => { let p = '', u = ''; for (let i = 0; i <= 140; i++) { const t = i / 140, X = x + t * w, br = o.brady && t > o.brady ? Math.min(1, (t - o.brady) * 6) : 0, cy = br ? 0 : Math.max(0, Math.sin(t * 5 * Math.PI)) ** 2, base = 140 - 60 * br - bad * 30 * Math.max(0, Math.sin((t * 5 - .3) * Math.PI)) ** 2;
    p += `${i ? 'L' : 'M'}${X.toFixed(1)} ${(y + 64 - (base - 110) * 1.2 + Math.sin(t * 81) * 3).toFixed(1)}`; u += `${i ? 'L' : 'M'}${X.toFixed(1)} ${(y + 146 - cy * 34).toFixed(1)}`; }
  return `<rect x="${x}" y="${y}" width="${w}" height="156" rx="8" fill="#fff6f0" stroke="#f3d3c4"/><rect x="${x}" y="${y + 64 - 50 * 1.2}" width="${w}" height="${50 * 1.2}" fill="${C.mint}" opacity=".3"/><path id="hl-ctg-fhr" d="${p}" fill="none" stroke="${bad || o.brady ? C.red : '#2a2a3a'}" stroke-width="1.8"/><path id="hl-ctg-tone" d="${u}" fill="none" stroke="${C.cap}" stroke-width="1.6"/>`; };
// tử cung chuyển dạ: thân dày, đoạn dưới mỏng dần; r = vị trí vòng Bandl (0–1); vo: 'nut' | 'vo'
const LU = (x, y, r, vo = '') => {
  const ring = y + 205 - 72 * r, thin = Math.max(4, 18 - 14 * r);
  // Khung xương chậu mẹ (bờ mu + xương cùng)
  let s = `<ellipse cx="${x}" cy="${y + 276}" rx="88" ry="18" fill="none" stroke="${C.bone}" stroke-width="14" opacity=".4"/>`;
  // Đoạn trên tử cung: cơ dày, gò bóp siết khi r tăng
  s += `<path d="M${x - 110} ${y + 115} Q${x - 116} ${y} ${x} ${y - 8} Q${x + 116} ${y} ${x + 110} ${y + 115} L${x + 94} ${ring} Q${x} ${ring + 12} ${x - 94} ${ring} Z" fill="url(#gMyo)" stroke="${C.myoD}" stroke-width="${1.6 + r * .8}"/>`;
  // Thớ cơ đan chéo thân trên tử cung
  s += `<path d="M${x - 85} ${y + 40} Q${x} ${y + 60} ${x + 85} ${y + 40} M${x - 95} ${y + 75} Q${x} ${y + 95} ${x + 95} ${y + 75}" fill="none" stroke="#e07d98" stroke-width="1.8" opacity="${.4 + r * .4}"/>`;
  // Đoạn dưới tử cung: giãn mỏng, căng hình phễu
  s += `<path d="M${x - 94} ${ring} Q${x - 84} ${y + 258} ${x - 28} ${y + 284} H${x + 28} Q${x + 84} ${y + 258} ${x + 94} ${ring} Q${x} ${ring + 12} ${x - 94} ${ring} Z" fill="#fff9fb" fill-opacity=".85" stroke="${C.myoD}" stroke-width="${Math.max(1, 2 - r * 1.2)}"/>`;
  // Lòng buồng tử cung
  s += `<path d="M${x - 84} ${y + 115} Q${x - 88} ${y + 24} ${x} ${y + 18} Q${x + 88} ${y + 24} ${x + 84} ${y + 115} L${x + 94 - thin} ${ring} Q${x + 82 - thin} ${y + 256} ${x + 22} ${y + 278} H${x - 22} Q${x - 82 + thin} ${y + 256} ${x - 94 + thin} ${ring} Z" fill="#fffafc" stroke="${C.decid}" stroke-width="2.5" opacity=".7"/>`;
  // Thai nhi: thân mình cuộn gập sinh lý
  s += `<g opacity="${vo === 'vo' ? .35 : .95}"><path d="M${x - 22} ${y + 192} C${x - 64} ${y + 160} ${x - 58} ${y + 75} ${x} ${y + 60} C${x + 48} ${y + 72} ${x + 54} ${y + 126} ${x + 22} ${y + 175}" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.4"/><path d="M${x - 20} ${y + 115} Q${x} ${y + 138} ${x - 8} ${y + 165}" fill="none" stroke="${C.skinD}" stroke-width="4.5" stroke-linecap="round"/></g>`;
  // Thai nhi: đầu ngôi chỏm lọt xuống đoạn dưới
  if (vo !== 'vo') {
    s += `<ellipse cx="${x}" cy="${y + 232}" rx="44" ry="48" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.4"/><path d="M${x - 22} ${y + 220} Q${x} ${y + 226} ${x + 22} ${y + 220} M${x} ${y + 205} V${y + 255}" fill="none" stroke="#e09e76" stroke-width="1.2" opacity=".6"/><ellipse cx="${x - 16}" cy="${y + 236}" rx="3" ry="2" fill="#7a523d" opacity=".5"/><ellipse cx="${x + 16}" cy="${y + 236}" rx="3" ry="2" fill="#7a523d" opacity=".5"/>`;
  }
  // Vòng Bandl (rãnh co thắt dâng cao hình đồng hồ cát)
  if (r > .2) {
    s += `<path d="M${x - 102} ${ring} Q${x} ${ring + 14} ${x + 102} ${ring}" fill="none" stroke="${C.redD}" stroke-width="3" stroke-dasharray="6 4" class="pulse"/><ellipse cx="${x - 98}" cy="${ring}" rx="4" ry="4" fill="${C.redD}"/><ellipse cx="${x + 98}" cy="${ring}" rx="4" ry="4" fill="${C.redD}"/>`;
  }
  // Dấu Frommel: 2 dây chằng tròn tử cung căng như dây đàn
  if (r > .25) {
    const colFro = r > .6 ? C.red : '#e2753b';
    s += `<path d="M${x - 86} ${y + 60} Q${x - 108} ${ring} ${x - 104} ${y + 268}" fill="none" stroke="${colFro}" stroke-width="${1.6 + r * 2.2}" stroke-linecap="round"${r > .6 ? ' class="pulse"' : ''}/>`;
    s += `<path d="M${x + 86} ${y + 60} Q${x + 108} ${ring} ${x + 104} ${y + 268}" fill="none" stroke="${colFro}" stroke-width="${1.6 + r * 2.2}" stroke-linecap="round"${r > .6 ? ' class="pulse"' : ''}/>`;
  }
  // Nứt sẹo (dehiscence): cơ nứt ngang, thanh mạc còn nguyên phủ bên ngoài
  if (vo === 'nut') {
    s += `<g id="hl-dehiscence" class="fadein"><path d="${x + 60} ${y + 224} Q${x + 86} ${y + 234} ${x + 72} ${y + 254}" fill="none" stroke="${C.redD}" stroke-width="3.2" stroke-dasharray="5 3"/><ellipse cx="${x + 80}" cy="${y + 240}" rx="16" ry="12" fill="url(#gClot)" opacity=".65"/><path d="${x + 90} ${ring + 4} Q${x + 98} ${y + 258} ${x + 28} ${y + 284}" fill="none" stroke="${C.decid}" stroke-width="2.5" opacity=".9"/></g>`;
  }
  // Vỡ toàn bộ bề dày (complete rupture): toác rách toang, máu xối xả, đầu thai lọt ra ổ bụng
  if (vo === 'vo') {
    s += `<g id="hl-rupture" class="fadein"><path d="${x + 58} ${y + 204} L${x + 120} ${y + 230} L${x + 64} ${y + 268} Z" fill="#6a1220"/><path d="${x + 54} ${y + 198} L${x + 126} ${y + 228} L${x + 60} ${y + 274}" fill="none" stroke="${C.redD}" stroke-width="3.5" stroke-linejoin="round"/>`;
    // Đầu thai lọt một phần ra ngoài phúc mạc
    s += `<ellipse cx="${x + 104}" cy="${y + 242}" rx="42" ry="46" fill="url(#gSkin)" stroke="${C.red}" stroke-width="2.4" class="pulse"/>`;
    // Máu xối xả tràn khoang bụng
    s += `<g id="hl-hemoperitoneum"><ellipse cx="${x + 130}" cy="${y + 260}" rx="40" ry="26" fill="${C.red}" opacity=".8"/><path d="M${x + 80} ${y + 250} Q${x + 130} ${y + 280} ${x + 150} ${y + 270}" fill="none" stroke="${C.redD}" stroke-width="4"/>${drops(x + 126, y + 275, 4, .9, 14)}</g></g>`;
  }
  return s; };

// ═════════ 06 · Nứt cơ và vỡ toàn bộ bề dày
kit('bv-nut', {
  ask: {
    q: 'Trong chuyển dạ có sẹo mổ cũ (TOLAC), biến chứng nào có biểu hiện âm thầm nhất nhưng rất dễ bị bỏ sót?',
    opts: [
      { t: 'Nứt sẹo (Dehiscence): rách lớp cơ nhưng thanh mạc còn nguyên, triệu chứng kín đáo', ok: true, fb: 'Chính xác! Nứt sẹo thường kín đáo, phúc mạc bao bọc nên ít gây đau dữ dội hay tràn máu ổ bụng.' },
      { t: 'Vỡ hoàn toàn: rách toang cơ và thanh mạc, triệu chứng luôn dữ dội', ok: false, fb: 'Sai. Vỡ hoàn toàn gây sốc mất máu rầm rộ chứ không âm thầm.' },
      { t: 'Sa dây rốn ra âm đạo', ok: false, fb: 'Sai hoàn toàn. Sa dây rốn là biến chứng ối vỡ, không phải tổn thương sẹo tử cung.' }
    ]
  },
  chain: [
    { hl: '#hl-dehiscence', h: 'Nứt sẹo mổ cũ', b: 'Lớp cơ đoạn dưới tách đôi nhưng lớp phúc mạc thanh mạc bên ngoài vẫn còn nguyên' },
    { hl: '#hl-rupture', h: 'Vỡ toàn bộ bề dày', b: 'Cơ và thanh mạc toác rách toang, buồng ối vỡ khiến thai lọt một phần vào ổ bụng' },
    { hl: '#hl-hemoperitoneum', h: 'Tràn máu ổ phúc mạc', b: 'Máu xối xả vào khoang bụng gây sốc mất máu kín và đe dọa tử vong mẹ - con' }
  ],
  clin: 'Nứt sẹo (dehiscence) thường chỉ tình cờ phát hiện khi mổ lại. Ngược lại, vỡ hoàn toàn là cấp cứu tối khẩn cần phẫu thuật trong vòng 10-15 phút.',
  trap: 'Đừng đánh giá nguy cơ chỉ bằng máu âm đạo! Vỡ hoàn toàn máu chảy kín vào ổ bụng nên máu âm đạo có thể rất ít.',
  init: () => ({ k: '', seen: '' }), ui: () => [{ t: 'seg', k: 'k', opts: [['nut', '🩹 Nứt sẹo (còn thanh mạc)'], ['vo', '💥 Vỡ toàn bộ bề dày']] }], after: s => markSeen(s, s.k), goal: s => seen(s, 'nut') && seen(s, 'vo'),
  draw: s => {
    let o = card(20, 20, 330, 316, '#fffdfa') + LU(185, 36, .4, s.k);
    if (s.k === 'vo') o += ZS.fade(call(318, 286, 300, 330, 'máu, thai/nhau vào ổ bụng', C.redD, 'end', 12.5), ZS.fresh(s, x => x.k === 'vo'));
    if (s.k === 'nut') o += ZS.fade(call(266, 276, 300, 330, 'sẹo hở, thanh mạc còn', C.myoD, 'end', 12.5), ZS.fresh(s, x => x.k === 'nut'));
    const M = { nut: ['kín đáo', 'triệu chứng nghèo', 'có thể chỉ phát hiện khi mổ', C.amber], vo: ['RẤT NẶNG', 'mất máu kín nhanh', 'thai thiếu oxy nhanh', C.redD] }[s.k];
    o += card(362, 20, 188, 316) + (M ? `<g class="fadein">${T(456, 80, M[0], { s: 20, c: M[3] })}${T(456, 116, M[1], { s: 13.5 })}${T(456, 140, M[2], { s: 13, c: C.mute })}</g>` : T(456, 170, '👆 chọn ở trên', { s: 14, c: C.soft })) + T(456, 280, 'không đo mức khẩn', { s: 12.5, c: C.mute }) + T(456, 300, 'bằng lượng ra huyết', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => seen(s, 'nut') && seen(s, 'vo') ? ['worry', '**Nứt/dehiscence** còn thanh mạc → kín đáo. **Vỡ hoàn toàn** phá cả cơ và thanh mạc → máu, thai/nhau vào ổ bụng, mất máu kín nhanh.'] : ['happy', 'Hai mức tổn thương. Bấm **lần lượt** cả hai 👆']
});
kit('bv-hai', {
  init: () => ({ seo: false, t: 0 }), ui: () => [{ t: 'tog', k: 'seo', label: '✂️ Tử cung CÓ sẹo mổ' }, { t: 'range', k: 't', label: '⏱ Chuyển dạ tiến triển', min: 0, max: 3, step: 1, unit: '' }],
  goal: s => s.seo && s.t >= 3,
  draw: s => {
    const t = s.t, isSeo = s.seo;
    let o = card(20, 20, 335, 316, '#fffdfa');
    o += T(187, 44, isSeo ? 'Tử cung CÓ sẹo mổ cũ (TOLAC)' : 'Tử cung CHƯA SẸO (Bất xứng)', { s: 13.5, c: isSeo ? C.redD : C.ink });
    if (!isSeo) {
      // Tử cung chưa sẹo: gặp vật cản, vòng Bandl dâng cao, dọa vỡ rõ rệt
      const r = t === 0 ? .1 : t === 1 ? .35 : t === 2 ? .75 : 1;
      o += `<g transform="translate(2 0)">${LU(185, 36, r, t === 3 ? 'vo' : '')}</g>`;
      o += `<rect x="115" y="318" width="140" height="12" rx="6" fill="url(#gBone)" stroke="${C.boneD}"/>` + Th(185, 312, 'vật cản: bất xứng đầu chậu', { s: 11.5, c: '#a07a3c' });
      if (t >= 2) o += Th(300, 236 - 72 * r, 'vòng Bandl dâng cao', { a: 'end', s: 12, c: C.redD });
    } else {
      // Tử cung có sẹo mổ cũ: sẹo mỏng âm thầm toác ra dưới áp lực bình thường
      const r = .25;
      o += `<g transform="translate(2 0)">${LU(185, 36, r, t === 2 ? 'nut' : t === 3 ? 'vo' : '')}</g>`;
      // Vết sẹo mổ ngang đoạn dưới
      o += `<path d="M125 240 Q185 246 245 240" fill="none" stroke="${t >= 2 ? C.redD : C.decid}" stroke-width="${t >= 2 ? 3.5 : 2}" stroke-dasharray="5 3"/>` + Th(185, 230, t >= 2 ? 'sẹo toác rách!' : 'sẹo mổ ngang đoạn dưới', { s: 11.5, c: t >= 2 ? C.redD : C.mute });
    }
    // Bảng bên phải
    o += card(365, 20, 175, 316);
    o += T(452, 44, 'Diễn tiến chuyển dạ', { s: 13.5 });
    const ST_NO = [['1. Chuyển dạ', 'co bóp bình thường'], ['2. Tắc nghẽn', 'đầu thai mắc eo trên'], ['3. DỌA VỠ', 'Bandl, Frommel, đau chói'], ['4. VỠ', 'toác tử cung']];
    const ST_YES = [['1. Chuyển dạ', 'chuyển dạ bình thường'], ['2. Tiến triển', 'cơn co không quá mạnh'], ['3. Vỡ thầm lặng', 'sẹo nứt, tim thai xấu'], ['4. VỠ HOÀN TOÀN', 'đầu thai vào ổ bụng']];
    const curSteps = isSeo ? ST_YES : ST_NO;
    o += curSteps.map(([a, b], i) => {
      const y = 60 + i * 56, act = t >= i, cur = t === i;
      return `<rect x="375" y="${y}" width="155" height="48" rx="10" fill="${cur ? (i >= 2 ? '#ffd8e0' : C.lav) : act ? '#f4fff8' : '#fff'}" stroke="${cur ? C.redD : act ? C.mintD : C.grid}" stroke-width="${cur ? 1.8 : 1}"/><circle cx="390" cy="${y + 24}" r="10" fill="${act ? (i >= 2 ? C.redD : C.green) : C.grid}"/><text x="390" y="${y + 28}" text-anchor="middle" font-size="11" fill="#fff">${i + 1}</text><text x="408" y="${y + 20}" font-size="12" font-weight="bold" fill="${cur ? C.ink : C.mute}">${a.slice(3)}</text><text x="408" y="${y + 38}" font-size="10.5" fill="${cur ? C.redD : C.mute}">${b}</text>`;
    }).join('');
    o += T(452, 298, isSeo ? 'sẹo thân: vỡ cả trước CD' : 'chưa sẹo: có pha dọa rõ', { s: 11.5, c: isSeo ? C.redD : C.green });
    return o;
  },
  say: s => s.seo && s.t >= 3 ? ['worry', 'Chưa sẹo: thường có chuỗi **tắc nghẽn → dọa vỡ → vỡ**. Có sẹo: vỡ có thể **âm thầm**, không có pha dọa rõ; sẹo thân có thể vỡ trước chuyển dạ.'] : ['happy', 'Kéo **⏱** hết thanh, rồi bật **✂️ Có sẹo** và kéo lại 👆']
});
B['vo-hay-nut'] = [
  { t: 'Nứt sẹo hay vỡ toàn bộ?', kit: 'bv-nut' },
  { t: 'Chưa sẹo và có sẹo vỡ khác nhau', kit: 'bv-hai' }
];
kit('bv-bandl', {
  init: () => ({ co: 0 }), ui: () => [{ t: 'range', k: 'co', label: '💪 Cơn co đẩy vào vật cản', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.co >= 80,
  draw: s => {
    const r = s.co / 100;
    let o = card(20, 20, 330, 316, '#fffdfa') + LU(185, 36, r) + `<rect x="120" y="318" width="130" height="12" rx="6" fill="url(#gBone)" stroke="${C.boneD}"/>` + Th(185, 312, 'vật cản: bất xứng', { s: 12, c: '#a07a3c' });
    if (r > .2) o += Th(300, 236 - 72 * r, 'vòng Bandl', { a: 'end', s: 12.5, c: C.redD });
    o += card(362, 20, 188, 316) + T(456, 54, 'Đoạn dưới', { s: 13, c: C.mute }) + ZS.bar(380, 64, 152, 100 - 80 * r, r > .6 ? C.red : C.myoD, '', { h: 14 }) + T(456, 104, r > .6 ? 'MỎNG, kéo giãn' : 'còn dày', { s: 14, c: r > .6 ? C.redD : C.ink });
    o += T(456, 160, 'vòng Bandl', { s: 13, c: C.mute }) + T(456, 184, r > .6 ? 'lên cao gần rốn' : r > .2 ? 'xuất hiện' : 'chưa thấy', { s: 14, c: r > .6 ? C.redD : C.ink }) + T(456, 250, 'sửa VẬT CẢN', { s: 14, c: C.green }) + T(456, 272, 'không tăng lực co', { s: 13.5, c: C.redD });
    return o;
  },
  say: s => s.co >= 80 ? ['ouch', 'Thai không xuống mà cơ vẫn co mạnh → **đoạn dưới kéo giãn mỏng**, **vòng Bandl** lên cao. Phải sửa **vật cản**, không tăng lực co.'] : ['happy', 'Đầu thai mắc vật cản. Kéo thanh **💪 Cơn co** 👆']
});
const DV = [
  ['don', '⏩ Cơn co dồn dập', 185, 75, 'tăng trương lực cơ bản'],
  ['bandl', '〰️ Vòng thắt Bandl', 185, 160, 'rãnh dâng cao ngang rốn'],
  ['fro', '🪢 Dây chằng tròn căng', 95, 180, 'dấu Frommel như dây đàn'],
  ['dau', '🔥 Đau chói đoạn dưới', 185, 230, 'đau liên tục ngoài cơn co'],
  ['dau2', '👶 Đầu thai không lọt', 185, 290, 'chồng khớp sọ rõ'],
  ['but', '😖 Mẹ bứt rứt lo sợ', 280, 110, 'kèm tim thai suy cấp']
];
kit('bv-dau', {
  init: () => ({ seen: '' }), ui: () => [],
  after: (s, k) => markSeen(s, k),
  goal: s => DV.every(([k]) => seen(s, k)),
  draw: s => {
    const n = DV.filter(([k]) => seen(s, k)).length;
    let o = card(20, 20, 335, 316, '#fffdfa');
    o += T(187, 44, '6 Dấu hiệu Dọa Vỡ Tử Cung trên lâm sàng', { s: 13.5 });
    // Giải phẫu bụng mẹ & tử cung
    o += `<g transform="translate(2 0)">${LU(185, 36, Math.min(1, n / 5))}</g>`;
    // 6 điểm chạm giải phẫu
    o += DV.map(([k, t, x, y, desc]) => {
      const sn = seen(s, k);
      return `<g class="tap" data-set="!${k}">${sn ? `<circle cx="${x}" cy="${y}" r="17" fill="none" stroke="${C.red}" stroke-width="2.5" class="pulse"/><circle cx="${x}" cy="${y}" r="6" fill="${C.red}"/>` : `<circle cx="${x}" cy="${y}" r="12" fill="#fff" fill-opacity=".3" stroke="${C.soft}" stroke-width="1.8" stroke-dasharray="4 3"/>`}${sn ? call(x, y, x > 185 ? 310 : 60, y + (y > 200 ? 25 : -15), t.slice(3), C.redD, x > 185 ? 'start' : 'end', 11.5) : ''}</g>`;
    }).join('');
    // Bảng bên phải
    o += card(365, 20, 175, 316);
    o += T(452, 44, 'Hội chứng dọa vỡ', { s: 14 });
    o += T(452, 68, `${n} / 6 dấu hiệu`, { s: 20, c: n === 6 ? C.redD : C.ink });
    o += ZS.bar(375, 82, 155, (n / 6) * 100, n >= 4 ? C.red : C.amber, '', { h: 12 });
    o += DV.map(([k, t], i) => {
      const y = 104 + i * 32, sn = seen(s, k);
      return `<g class="tap" data-set="!${k}"><rect x="375" y="${y}" width="155" height="26" rx="8" fill="${sn ? '#ffeef2' : '#f8f6fc'}" stroke="${sn ? C.red : C.grid}"/><text x="382" y="${y + 18}" font-size="11" fill="${sn ? C.redD : C.mute}">${sn ? '✓' : '○'} ${t}</text></g>`;
    }).join('');
    if (n === 6) o += ZS.fade(verdict(375, 296, 155, false, '🚨 DỌA VỠ TỬ CUNG', 'KÍCH HOẠT MỔ CẤP CỨU!'), true);
    return o;
  },
  say: s => DV.every(([k]) => seen(s, k)) ? ['worry', 'Dọa vỡ: **bứt rứt, đau đoạn dưới liên tục, cơn co dồn, vòng Bandl, Frommel**, đầu thai chồng xương + thai thiếu oxy.'] : ['happy', 'Chạm các **điểm giải phẫu** trên bụng mẹ để phát hiện 6 dấu dọa vỡ 👆']
});
kit('bv-lam', {
  init: () => ({ c: '', seen: '' }), ui: () => [{ t: 'seg', k: 'c', opts: [['tang', '⬆️ Tăng oxytocin cho “vượt”'], ['dung', '🛑 Ngừng tăng co, gọi đội']] }], after: s => markSeen(s, s.c), goal: s => seen(s, 'tang') && seen(s, 'dung'),
  draw: s => {
    const bad = s.c === 'tang';
    let o = card(20, 20, 330, 316, '#fffdfa') + `<g transform="translate(70 30) scale(.62)">${LU(185, 36, bad ? 1 : .55, bad ? 'vo' : '')}</g>` + (s.c === 'dung' ? `<g class="fadein"><rect x="34" y="34" width="302" height="282" rx="24" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="9 6"/>${T(185, 308, '🛑 ngừng tăng co · gọi đội', { s: 13.5, c: C.green })}</g>` : s.c === 'tang' ? `<g class="fadein">${T(185, 308, '⬆️ tăng oxytocin ép cơ lên vật cản…', { s: 13, c: C.redD })}</g>` : '');
    o += card(362, 20, 188, 316) + (s.c ? ZS.fade(bad ? verdict(378, 70, 156, false, 'VỠ tử cung', 'ép cơ vượt bất xứng') : verdict(378, 70, 156, true, 'đúng hướng', 'chuẩn bị can thiệp khẩn') + T(456, 190, 'giảm co: theo chỉ định', { s: 12.5, c: C.mute }) + T(456, 210, 'do đội thực hiện', { s: 12.5, c: C.mute }), ZS.fresh(s, x => x.c === s.c)) : T(456, 170, '👆 chọn hành động', { s: 14, c: C.soft }));
    return o;
  },
  say: s => seen(s, 'tang') && seen(s, 'dung') ? ['worry', 'Nghi tắc nghẽn / dọa vỡ: **ngừng tăng co**, gọi đội, chuẩn bị **can thiệp khẩn**. Không tăng oxytocin để “vượt” bất xứng.'] : ['happy', 'Dọa vỡ trên bất xứng. Thử **cả hai** hành động 👆']
});
B['doa-vo'] = [
  { t: 'Tử cung đẩy vào vật cản', kit: 'bv-bandl' },
  { t: 'Sáu dấu dọa vỡ', kit: 'bv-dau' },
  { t: 'Ngừng tăng co, đừng ép vượt', kit: 'bv-lam' }
];
kit('bv-ctg', {
  ask: {
    q: 'Dấu hiệu nào xuất hiện SỚM NHẤT và nhạy nhất để báo động vỡ tử cung ở thai phụ có sẹo mổ cũ đang chuyển dạ (TOLAC)?',
    opts: [
      { t: 'Đau bụng xé rách kèm sờ mất độ lọt ngôi thai', ok: false, fb: 'Sai. Đây là dấu hiệu muộn trong tam chứng kinh điển khi tử cung đã toác rách hoàn toàn.' },
      { t: 'Bất thường tim thai trên CTG (nhịp chậm kéo dài, nhịp giảm biến đổi sâu lặp lại)', ok: true, fb: 'Chính xác! Bất thường tim thai xuất hiện sớm nhất ở > 70-80% các trường hợp vỡ tử cung.' },
      { t: 'Máu âm đạo chảy ồ ạt đỏ tươi', ok: false, fb: 'Sai. Máu thường chảy kín vào ổ phúc mạc nên máu âm đạo có thể xuất hiện muộn hoặc ít.' }
    ]
  },
  chain: [
    { hl: '#hl-ctg-fhr', h: 'Tim thai suy sụp sớm', b: 'Nhịp tim thai chậm kéo dài do thiếu máu nuôi gai nhau cấp tính' },
    { hl: '#hl-ctg-tone', h: 'Biến mất cơn co tử cung', b: 'Thành tử cung toác vỡ làm tụt áp lực trong buồng ối, mất hoàn toàn cơn gò' },
    { hl: '#hl-ctg-signs', h: 'Chuỗi dấu hiệu lâm sàng muộn', b: 'Đau chói vết mổ, tụt huyết áp, sốc mất máu kín và mất độ lọt ngôi thai' }
  ],
  clin: 'Theo dõi CTG liên tục là bắt buộc trong TOLAC. Khi tim thai xuất hiện nhịp chậm kéo dài không hồi phục, phải nghĩ ngay đến vỡ tử cung và kích hoạt mổ tối khẩn.',
  trap: 'Sản phụ đã gây tê ngoài màng cứng có thể không thấy đau khi sẹo toác. Không bao giờ chủ quan khi không thấy đau; CTG là chỉ điểm vàng duy nhất!',
  init: () => ({ t: 0 }), ui: () => [{ t: 'range', k: 't', label: '⏱ Phút sau khi sẹo vỡ', min: 0, max: 20, step: 2, unit: '′' }], goal: s => s.t >= 14,
  draw: s => {
    const f = s.t / 20;
    let o = card(20, 20, 360, 316, '#fffdfa') + T(200, 46, 'CTG — TOLAC', { s: 13, c: C.mute }) + ctg(36, 56, 328, 0, { brady: s.t ? 1 - Math.min(.9, f + .1) : 2 }) + ZS.legend(40, 230, [[s.t ? C.red : '#2a2a3a', 'tim thai'], [C.cap, 'cơn co']], { s: 11.5 });
    o += T(200, 270, s.t >= 2 ? 'tim thai chậm kéo dài · mất cơn co' : '', { s: 13, c: C.redD });
    const M = [['tim thai bất thường', 2], ['đau sẹo / đau mới', 6], ['ra huyết', 10], ['mẹ mạch nhanh, tụt HA', 14], ['mất độ lọt', 16]];
    o += card(392, 20, 158, 316) + T(471, 46, 'xuất hiện dần', { s: 12.5, c: C.mute }) + `<g id="hl-ctg-signs">` + M.map(([t, th], i) => `<g opacity="${s.t >= th ? 1 : .2}">${T(404, 80 + i * 44, (s.t >= th ? '⚠ ' : '○ ') + t, { a: 'start', s: 12, c: s.t >= th ? C.redD : C.mute })}</g>`).join('') + `</g>`;
    return o;
  },
  say: s => s.t >= 14 ? ['worry', '**Tim thai bất thường** thường là dấu **đầu tiên**; đau, ra huyết, sốc, mất độ lọt đến sau. **Không chờ đủ tam chứng** mới gọi mổ.'] : ['happy', 'Kéo thanh **⏱** — dấu nào xuất hiện trước? 👆']
});
tfKit('bv-ndq', [['Chờ đủ tam chứng mới gọi mổ', false, 'Tam chứng (đau, ra huyết, mất độ lọt) thường đến SAU; tim thai bất thường hay là dấu đầu tiên. Nghi vỡ là gọi đội, chuẩn bị mổ.'], ['Đã gây tê ngoài màng cứng, không đau → yên tâm', false, 'Gây tê NMC có thể che đau. Không đau KHÔNG loại trừ vỡ; vẫn theo dõi tim thai, cơn co, sinh hiệu.'], ['Sau sinh sốc không tương xứng máu ngoài → tìm vỡ', true, 'Máu có thể chảy kín vào ổ bụng hoặc thành khối tụ sâu, nên mẹ sốc mà máu ngoài ít: phải tìm vỡ tử cung / tụ máu.'], ['Làm thêm siêu âm dù mẹ – thai đang bị đe dọa', false, 'Khi mẹ–thai đang bị đe dọa, siêu âm KHÔNG được làm chậm cuộc mổ; quyết định bằng lâm sàng.']], 'Không chờ tam chứng; gây tê NMC **không thay monitoring**; sau sinh sốc không tương xứng → tìm vỡ / tụ máu sâu; siêu âm **không được trì hoãn mổ**.');
B['nhan-dien-vo'] = [
  { t: 'Tim thai báo trước', kit: 'bv-ctg' },
  { t: 'Bốn câu về nhận diện vỡ', kit: 'bv-ndq' }
];
kit('bv-song', {
  init: () => ({ c: '', seen: '' }), ui: () => [{ t: 'seg', k: 'c', opts: [['cho', '🧪 Chờ đủ xét nghiệm, hình ảnh'], ['ss', '⚡ Hồi sức + mổ đồng thời']] }], after: s => markSeen(s, s.c), goal: s => seen(s, 'cho') && seen(s, 'ss'),
  draw: s => {
    const late = s.c === 'cho', X = m => 160 + m * 34;
    let o = card(20, 20, 530, 316, '#fffdfa') + [0, 2, 4, 6, 8, 10].map(m => `<path d="M${X(m)} 52 V230" stroke="${C.grid}"/>` + T(X(m), 46, m * 3 + "′", { s: 11.5, c: C.mute })).join('');
    o += T(150, 92, '🫁 Hồi sức, máu', { a: 'end', s: 13 }) + T(150, 152, '🏥 Mổ lấy thai, cầm máu', { a: 'end', s: 13 }) + T(150, 212, '👶 Tim thai', { a: 'end', s: 13 });
    if (s.c) { o += `<rect x="${X(0)}" y="78" width="${X(10) - X(0)}" height="24" rx="12" fill="${C.mintD}"><animate attributeName="width" from="0" to="${X(10) - X(0)}" dur="1s" fill="freeze"/></rect><rect x="${X(late ? 6 : .5)}" y="138" width="${X(10) - X(late ? 6 : .5)}" height="24" rx="12" fill="${late ? '#ffb15c' : C.mintD}"><animate attributeName="width" from="0" to="${X(10) - X(late ? 6 : .5)}" dur="1s" begin="${late ? .5 : 0}s" fill="freeze"/></rect>` + (late ? T(X(3), 156, 'chờ kết quả…', { s: 12.5, c: '#b5651d' }) : '');
      o += `<path d="M${X(0)} 210 ${late ? `L${X(3)} 214 L${X(6)} 238` : `L${X(4)} 214 L${X(10)} 208`}" fill="none" stroke="${late ? C.red : C.green}" stroke-width="4" pathLength="1" stroke-dasharray="1"><animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.2s" fill="freeze"/></path>` + verdict(160, 256, 360, !late, late ? 'Mất thời gian quý' : 'Thai được lấy khi còn cứu được', late ? 'thời gian là mô và sự sống' : 'đội: sản, gây mê, sơ sinh, máu'); }
    else o += T(335, 170, '👆 chọn cách làm', { s: 14, c: C.soft });
    return o;
  },
  say: s => seen(s, 'cho') && seen(s, 'ss') ? ['wow', 'Nghi vỡ: **hồi sức + mổ khẩn đồng thời**. Không đợi đủ xét nghiệm, hình ảnh hay một “khoảng an toàn” từ nghiên cứu cũ.'] : ['happy', 'Nghi vỡ tử cung. Thử **cả hai** cách tổ chức 👆']
});
kit('bv-mo', {
  init: () => ({ gon: false, on: true, bq: false, seen: 'cat,' }), ui: () => [], after: s => markSeen(s, s.gon && s.on ? 'khau' : 'cat'), goal: s => s.bq && seen(s, 'khau') && seen(s, 'cat'),
  draw: s => {
    const khau = s.gon && s.on;
    // Phẫu trường mở bụng cấp cứu bên trái x = 20..350
    let o = card(20, 20, 335, 316, '#fffdfa');
    o += T(187, 42, 'Phẫu trường xử trí vỡ tử cung', { s: 13.5 });
    // Van banh tự động phẫu trường ổ bụng
    o += `<ellipse cx="187" cy="172" rx="138" ry="118" fill="#eaf4ef" stroke="#cbd5e1" stroke-width="8"/><ellipse cx="187" cy="172" rx="134" ry="114" fill="#fff" stroke="#94a3b8" stroke-width="2"/>`;
    // Thân tử cung trong phẫu trường
    o += `<path d="M125 180 C110 110 140 82 187 82 C234 82 264 110 249 180 C240 216 220 236 187 236 C154 236 134 216 125 180 Z" fill="${khau ? '#d87085' : '#b25368'}" stroke="${khau ? '#b0435c' : '#7f1d1d'}" stroke-width="2.5"/>`;
    // Thớ cơ tử cung
    o += `<path d="M142 120 Q187 136 232 120 M136 150 Q187 168 238 150" fill="none" stroke="${khau ? '#f29bb0' : '#8c3548'}" stroke-width="2" opacity=".6"/>`;

    if (khau) {
      // Nhánh khâu bảo tồn: mép rách ngang đoạn dưới gọn gàng, 4 mũi chỉ chữ X tím, kim phẫu thuật cong
      o += `<path d="M145 196 Q187 202 229 196" fill="none" stroke="#6b21a8" stroke-width="3"/>`;
      // Các mũi khâu chữ X
      [155, 175, 199, 219].forEach(x => {
        o += `<path d="M${x - 6} 190 L${x + 6} 202 M${x - 6} 202 L${x + 6} 190" stroke="#7c3aed" stroke-width="2.2" stroke-linecap="round"/><circle cx="${x}" cy="190" r="2.5" fill="#5b21b6"/>`;
      });
      // Kim cong khâu phẫu thuật 🪡
      o += `<path d="M228 194 Q242 184 238 174" fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round"/><circle cx="238" cy="174" r="2" fill="#475569"/>`;
      o += `<rect x="75" y="60" width="224" height="24" rx="12" fill="${C.mint}" stroke="${C.green}" stroke-width="1.2"/>` + T(187, 76, '✓ Khâu bảo tồn tử cung 2 lớp', { s: 12, c: C.green });
    } else {
      // Nhánh cắt tử cung: vết toác rách phức tạp xé toạc bờ bên, đứt bó mạch tử cung, máu phun xối xả
      o += `<path d="M140 185 L175 194 L195 186 L235 204 L258 172" fill="none" stroke="#7f1d1d" stroke-width="4.5" stroke-linejoin="round"/>`;
      // Máu đọng và chảy xối xả
      o += `<ellipse cx="210" cy="216" rx="42" ry="18" fill="${C.red}" opacity=".85"/><path d="M235 198 Q260 215 272 205" fill="none" stroke="${C.redD}" stroke-width="3"/>${drops(265, 215, 3, .9, 10)}`;
      // 2 Kẹp Heaney kẹp cuống mạch tử cung 2 bên
      o += `<path d="M108 200 L145 192 M108 208 L145 194" stroke="#475569" stroke-width="3.5" stroke-linecap="round"/>`;
      o += `<path d="M266 182 L230 188 M268 190 L230 190" stroke="#475569" stroke-width="3.5" stroke-linecap="round"/>`;
      o += `<rect x="72" y="60" width="230" height="24" rx="12" fill="#ffe0e6" stroke="${C.red}" stroke-width="1.2"/>` + T(187, 76, '🚨 Cắt tử cung khẩn cấp cứu mẹ', { s: 12, c: C.redD });
    }

    // Bàng quang & niệu quản ở cực dưới phẫu trường
    if (s.bq) {
      o += `<path d="M145 240 Q187 232 229 240 Q220 270 187 274 Q154 270 145 240 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1.6"/>` + Th(187, 258, 'bàng quang đã bóc tách hạ thấp', { s: 10.5, c: '#854d0e' });
      // 2 dải bộc lộ niệu quản
      o += `<path d="M130 220 Q124 250 132 276" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-dasharray="4 2"/>`;
      o += `<path d="M244 220 Q250 250 242 276" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-dasharray="4 2"/>`;
      o += `<rect x="80" y="286" width="214" height="22" rx="11" fill="#f0fdf4" stroke="${C.green}"/><text x="187" y="301" text-anchor="middle" font-size="11" fill="${C.green}">✓ Đã bảo vệ bàng quang & niệu quản</text>`;
    } else {
      o += `<rect x="80" y="286" width="214" height="22" rx="11" fill="#fff1f2" stroke="${C.red}" stroke-dasharray="4 3"/><text x="187" y="301" text-anchor="middle" font-size="11" fill="${C.redD}">⚠️ Chưa kiểm tra bàng quang & niệu quản!</text>`;
    }

    // Bảng điều khiển bên phải x = 365..540
    o += card(365, 20, 175, 316);
    o += T(452, 42, 'Đánh giá trong mổ', { s: 13.5 });
    o += tcard('!gon', 372, 60, 161, 56, s.gon, ['🩹 Mép vỡ gọn, dễ khâu', '💥 Rách toác phức tạp'], C.mint);
    o += tcard('!on', 372, 124, 161, 56, s.on, ['🩺 Huyết động kiểm soát', '🩸 Máu xối xả, rối loạn'], C.mint);
    o += tcard('!bq', 372, 188, 161, 56, s.bq, ['🔍 Thám sát BQ, niệu quản', 'Chưa bóc tách kiểm tra'], C.sky);

    // Kết luận quyết định
    o += `<rect x="372" y="254" width="161" height="68" rx="12" fill="${khau ? C.mint : '#fee2e2'}" stroke="${khau ? C.green : C.red}" stroke-width="1.5"/>`;
    o += T(452, 276, khau ? '🪡 Khâu phục hồi' : '🏥 Cắt tử cung', { s: 15, c: khau ? C.green : C.redD });
    o += T(452, 296, khau ? 'bảo tồn khi mép gọn' : 'cứu sống tính mạng mẹ', { s: 11, c: C.ink });
    o += T(452, 312, khau ? 'và huyết động ổn' : 'không chần chừ!', { s: 11, c: C.mute });
    return o;
  },
  say: s => s.bq && seen(s, 'khau') && seen(s, 'cat') ? ['happy', 'Khâu hay cắt theo **vết vỡ, chảy máu, huyết động**; luôn kiểm tra **bàng quang, niệu quản**. Mong muốn sinh sản không được làm chậm cứu sống.'] : ['happy', 'Trong mổ: bật **🩹 Vết vỡ gọn** xem quyết định đổi, rồi bật **🔍 Kiểm tra bàng quang** 👆']
});
B['xu-tri-vo'] = [
  { t: 'Hồi sức và mổ cùng lúc', kit: 'bv-song' },
  { t: 'Khâu hay cắt tử cung?', kit: 'bv-mo' }
];
const PV = [['seo', '📄 Đọc hồ sơ sẹo, đường rạch'], ['sd', '📈 Theo dõi chuyển dạ có hệ thống'], ['tc', '💉 Tăng co đúng chỉ định'], ['dc', '🔧 Không sinh dụng cụ khi chưa đủ ĐK'], ['nc', '🏥 Nơi sinh có mổ khẩn']];
kit('bv-khien', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => PV.every(([k]) => seen(s, k)),
  draw: s => {
    const n = PV.filter(([k]) => seen(s, k)).length;
    // Bức tranh lâm sàng bên trái x = 20..345: Hệ thống 5 tầng phòng ngự bảo vệ thành tử cung
    let o = card(20, 20, 330, 316, '#fffdfa');
    o += T(185, 42, 'Hệ thống phòng hộ vỡ tử cung', { s: 13.5 });

    // Tử cung có sẹo mổ cũ ở trung tâm
    o += `<g transform="translate(48 25) scale(.75)">${LU(185, 36, .2)}</g>`;
    // Vết sẹo mổ ngang đoạn dưới
    o += `<path d="M150 206 Q185 212 220 206" fill="none" stroke="${n >= 3 ? C.mintD : C.redD}" stroke-width="${n >= 3 ? 2.5 : 3.5}" stroke-dasharray="4 2"/>`;
    o += Th(185, 222, n >= 3 ? 'sẹo được bảo vệ an toàn' : 'sẹo mổ cũ chịu áp lực', { s: 11, c: n >= 3 ? C.green : C.redD });

    // Các mũi tên áp lực chuyển dạ nếu chưa đủ lớp bảo vệ
    if (n < 5) {
      o += arrow('M50 150 L110 170', C.red, 3) + arrow('M320 150 L260 170', C.red, 3);
      o += Th(70, 140, 'áp lực co bóp', { a: 'start', s: 10.5, c: C.redD }) + Th(300, 140, 'nguy cơ toác sẹo', { a: 'end', s: 10.5, c: C.redD });
    }

    // 5 Tầng khiên phòng ngự bọc quanh tử cung (tương ứng với 5 việc lâm sàng)
    const SHIELDS = [
      ['seo', '📄 Hồ sơ', 185, 260, 110, 80, '#38bdf8', 'lọc đúng chỉ định'],
      ['sd', '📈 CTG', 185, 255, 122, 92, '#2dd4bf', 'phát hiện suy thai sớm'],
      ['tc', '💉 Oxytocin', 185, 250, 134, 104, '#a78bfa', 'không ép vượt bất xứng'],
      ['dc', '🔧 Dụng cụ', 185, 245, 146, 116, '#f472b6', 'đúng điều kiện đầu lọt'],
      ['nc', '🏥 Mổ khẩn', 185, 240, 158, 128, '#4ade80', 'sẵn sàng kíp mổ 30′']
    ];

    SHIELDS.forEach(([k, label, cx, cy, rx, ry, col, desc], i) => {
      const active = seen(s, k);
      if (active) {
        o += `<ellipse cx="${cx}" cy="${cy - 85}" rx="${rx}" ry="${ry}" fill="none" stroke="${col}" stroke-width="3.2" stroke-dasharray="${i % 2 === 0 ? 'none' : '6 3'}" opacity=".9" class="pulse"/>`;
        o += `<rect x="${cx - 45}" y="${cy - 85 - ry - 8}" width="90" height="18" rx="9" fill="${col}" opacity=".95"/><text x="${cx}" y="${cy - 85 - ry + 5}" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">${label}</text>`;
      }
    });

    // Huy hiệu tổng kết ở góc dưới
    o += `<rect x="40" y="278" width="290" height="46" rx="14" fill="${n === 5 ? C.mint : '#f8f6fc'}" stroke="${n === 5 ? C.green : C.grid}" stroke-width="${n === 5 ? 1.8 : 1}"/>`;
    o += T(185, 296, n === 5 ? '🛡️ ĐỦ 5 CHỐT CHẶN AN TOÀN' : `Đã dựng ${n} / 5 phòng tuyến`, { s: 13, c: n === 5 ? C.green : C.ink });
    o += T(185, 314, n === 5 ? 'giảm tối đa nguy cơ toác vỡ tử cung' : 'chạm các thẻ bên phải để kích hoạt chốt', { s: 11, c: C.mute });

    // Cột bên phải x = 360..545: 5 chốt chặn tương tác
    o += card(360, 20, 180, 316);
    o += T(450, 42, '5 Chốt chặn lâm sàng', { s: 13.5 });
    o += PV.map(([k, t], i) => {
      const y = 58 + i * 52, sn = seen(s, k);
      return `<g class="tap" data-set="!${k}"><rect x="368" y="${y}" width="164" height="44" rx="10" fill="${sn ? C.mint : '#fff'}" stroke="${sn ? C.green : C.grid}" stroke-width="${sn ? 1.6 : 1}"/><circle cx="382" cy="${y + 22}" r="8" fill="${sn ? C.green : C.grid}"/><text x="382" y="${y + 26}" text-anchor="middle" font-size="10" fill="#fff">${sn ? '✓' : ''}</text><text x="398" y="${y + 19}" font-size="11.5" font-weight="bold" fill="${sn ? C.ink : C.mute}">${t.slice(0, 14)}</text><text x="398" y="${y + 34}" font-size="10" fill="${sn ? C.green : C.mute}">${t.slice(14)}</text></g>`;
    }).join('');
    return o;
  },
  say: s => PV.every(([k]) => seen(s, k)) ? ['happy', 'Phòng vỡ là **đọc diễn tiến**: hồ sơ sẹo, theo dõi chuyển dạ, tăng co đúng chỉ định, không sinh dụng cụ sai điều kiện, sinh nơi **mổ khẩn được**.'] : ['happy', 'Dựng **lá chắn** phòng vỡ: bật từng việc 👆']
});
kit('bv-nguoi', {
  init: () => ({ ng: false }), ui: () => [{ t: 'tog', k: 'ng', label: '🧑‍⚕️ Có người nhận định & hành động' }], goal: s => s.ng,
  draw: s => {
    let o = card(20, 20, 330, 316, '#fffdfa') + ctg(36, 40, 298, .8) + T(185, 230, '🔔 bất thường lúc 02:10', { s: 14, c: C.redD });
    o += s.ng ? ZS.fade(`<rect x="60" y="250" width="250" height="60" rx="14" fill="${C.mint}"/>` + T(185, 278, '02:12 BS đọc → kích hoạt mổ', { s: 13.5 }) + T(185, 298, 'theo kế hoạch đã bàn giao', { s: 12, c: C.mute }), ZS.fresh(s, x => x.ng)) : `<rect x="60" y="250" width="250" height="60" rx="14" fill="#ffd0d8"/>` + T(185, 278, '“theo dõi sát”… không ai xem', { s: 13.5, c: C.redD }) + T(185, 298, '04:00 mới phát hiện', { s: 12, c: C.redD });
    o += card(362, 20, 188, 316) + T(456, 100, 'đo nhiều hơn', { s: 14 }) + T(456, 124, '≠ an toàn hơn', { s: 14, c: C.redD }) + T(456, 190, 'cần: người đọc', { s: 13 }) + T(456, 212, '+ kế hoạch đáp ứng', { s: 13 }) + T(456, 234, 'cụ thể', { s: 13 });
    return o;
  },
  say: s => s.ng ? ['wow', 'Monitoring chỉ cứu được khi có **người nhận định và hành động** theo kế hoạch cụ thể — không phải chỉ ghi “theo dõi sát”.'] : ['worry', 'Máy báo bất thường mà **không ai đọc**. Bật **🧑‍⚕️** 👆']
});
B['phong-vo'] = [
  { t: 'Lá chắn phòng vỡ', kit: 'bv-khien' },
  { t: 'Theo dõi phải có người đọc', kit: 'bv-nguoi' }
];

// ═════════ 07 · TOLAC
kit('bt-cay', {
  init: () => ({ seen: '', cur: 'vbac' }), ui: () => [],
  after: (s, k) => { markSeen(s, k); s.cur = k; },
  goal: s => ['vbac', 'fail', 'ercs'].every(k => seen(s, k)),
  draw: s => {
    const cur = s.cur || 'vbac';
    // Bức tranh lâm sàng trực quan bên trái x = 20..350
    let o = card(20, 20, 335, 316, '#fffdfa');
    o += T(187, 42, 'Cán cân lâm sàng: TOLAC vs ERCS', { s: 13.5 });

    // Cán cân y khoa ở trung tâm trên
    const angle = cur === 'vbac' ? -10 : cur === 'fail' ? 8 : 12;
    o += `<g transform="translate(187 100) rotate(${angle})">` +
      `<rect x="-95" y="-3" width="190" height="6" rx="3" fill="#64748b"/>` +
      `<circle cx="0" cy="0" r="5" fill="#334155"/>` +
      // Đĩa cân trái (TOLAC)
      `<path d="M-80 0 L-95 35 H-65 Z" fill="none" stroke="#94a3b8" stroke-width="1.5"/><rect x="-105" y="35" width="50" height="6" rx="3" fill="${cur === 'ercs' ? '#cbd5e1' : C.mintD}"/>` +
      // Đĩa cân phải (ERCS)
      `<path d="M80 0 L65 35 H95 Z" fill="none" stroke="#94a3b8" stroke-width="1.5"/><rect x="55" y="35" width="50" height="6" rx="3" fill="${cur === 'ercs' ? C.sky : '#cbd5e1'}"/>` +
      `</g>`;
    // Trụ cân
    o += `<path d="M187 100 V130 M175 130 H199" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>`;
    o += T(105, 78, 'TOLAC (Thử sinh)', { s: 11.5, c: cur !== 'ercs' ? C.green : C.mute });
    o += T(265, 78, 'ERCS (Mổ lại)', { s: 11.5, c: cur === 'ercs' ? C.cap : C.mute });

    // Khung minh họa kết cục bên dưới x = 35..340, y = 145..320
    o += `<rect x="35" y="145" width="305" height="175" rx="14" fill="#fff" stroke="${cur === 'vbac' ? C.green : cur === 'fail' ? C.redD : C.cap}" stroke-width="1.8"/>`;

    if (cur === 'vbac') {
      // Kết cục VBAC: sinh âm đạo thành công, bé sơ sinh kề da mẹ, không có sẹo mới
      o += `<g class="fadein">`;
      o += pic('sv-be.png', 50, 165, 65, 70);
      o += `<rect x="130" y="160" width="195" height="26" rx="13" fill="${C.mint}" stroke="${C.green}"/><text x="227" y="177" text-anchor="middle" font-size="12" font-weight="bold" fill="${C.green}">🎉 VBAC: 60 – 80% thành công</text>`;
      o += T(227, 202, '✓ Tránh phẫu thuật lớn & biến chứng gây mê', { s: 11.5, c: C.ink });
      o += T(227, 220, '✓ Thời gian nằm viện ngắn, hồi phục nhanh', { s: 11.5, c: C.ink });
      o += T(227, 238, '✓ Không tích lũy sẹo mới trên thành tử cung', { s: 11.5, c: C.green });
      o += `<rect x="50" y="260" width="275" height="48" rx="10" fill="#f0fdf4"/>`;
      o += T(187, 278, 'Lợi ích lớn nhất cho mẹ còn muốn sinh nhiều con', { s: 11, c: C.green });
      o += T(187, 296, 'giảm triệt để nguy cơ nhau bám bất thường lần sau', { s: 10.5, c: C.mute });
      o += `</g>`;
    } else if (cur === 'fail') {
      // Kết cục thất bại: chuyển mổ cấp cứu trong chuyển dạ
      o += `<g class="fadein">`;
      o += `<g transform="translate(50 162) scale(.45)">${LU(185, 36, .4, 'nut')}</g>`;
      o += `<rect x="130" y="160" width="195" height="26" rx="13" fill="#ffe0e6" stroke="${C.red}"/><text x="227" y="177" text-anchor="middle" font-size="12" font-weight="bold" fill="${C.redD}">⚠️ Mổ trong chuyển dạ: 20 – 40%</text>`;
      o += T(227, 202, '• Nguy cơ vỡ tử cung ≈ 0,5% (5 / 1000 mẹ)', { s: 11.5, c: C.redD });
      o += T(227, 220, '• Tỷ lệ nhiễm trùng sau mổ cao hơn mổ hẹn trước', { s: 11.5, c: C.ink });
      o += T(227, 238, '• Cần sẵn sàng kíp mổ rạch da trong 30 phút', { s: 11.5, c: C.ink });
      o += `<rect x="50" y="260" width="275" height="48" rx="10" fill="#fff1f2"/>`;
      o += T(187, 278, 'Phải có “lối thoát hiểm” phòng mổ khẩn trực chiến', { s: 11, c: C.redD });
      o += T(187, 296, 'không để mẹ thử chuyển dạ đơn độc không hỗ trợ', { s: 10.5, c: C.mute });
      o += `</g>`;
    } else {
      // Kết cục ERCS: mổ lặp lại chủ động tuần 39
      o += `<g class="fadein">`;
      o += pic('sv-tu-cung.png', 50, 162, 65, 75);
      o += `<rect x="130" y="160" width="195" height="26" rx="13" fill="#f0f9ff" stroke="${C.cap}"/><text x="227" y="177" text-anchor="middle" font-size="12" font-weight="bold" fill="${C.cap}">🏥 Mổ lặp lại chủ động (ERCS)</text>`;
      o += T(227, 202, '✓ Tránh nguy cơ vỡ tử cung trong chuyển dạ', { s: 11.5, c: C.green });
      o += T(227, 220, '✗ Biến chứng dính ruột, bàng quang, mất máu', { s: 11.5, c: C.ink });
      o += T(227, 238, '✗ Sẹo tích lũy: TĂNG VỌNG NGUY CƠ PAS (nhau cài)', { s: 11.5, c: C.redD });
      o += `<rect x="50" y="260" width="275" height="48" rx="10" fill="#f8fafc"/>`;
      o += T(187, 278, 'Càng mổ nhiều lần → nguy cơ nhau cài răng lược càng cao', { s: 11, c: '#0369a1' });
      o += T(187, 296, 'cần tư vấn kế hoạch gia đình dài hạn cho người bệnh', { s: 10.5, c: C.mute });
      o += `</g>`;
    }

    // Cột bên phải x = 360..545: 3 thẻ bấm kết cục
    o += card(360, 20, 180, 316);
    o += T(450, 42, '3 Kết cục lâm sàng', { s: 13.5 });

    const OUTCOMES = [
      ['vbac', '🌿 VBAC thành công', '60–80% sinh âm đạo', C.mint, C.green],
      ['fail', '🚨 Chuyển mổ cấp', '20–40% mổ chuyển dạ', '#ffe0e6', C.redD],
      ['ercs', '🏥 Mổ theo lịch (ERCS)', 'tránh vỡ nhưng sẹo cộng dồn', '#f0f9ff', C.cap]
    ];

    o += OUTCOMES.map(([k, title, desc, bg, col], i) => {
      const y = 60 + i * 78, sn = seen(s, k), isSelected = cur === k;
      return `<g class="tap" data-set="!${k}"><rect x="368" y="${y}" width="164" height="68" rx="12" fill="${isSelected ? bg : '#fff'}" stroke="${isSelected ? col : sn ? C.mintD : C.grid}" stroke-width="${isSelected ? 2 : 1}"/><circle cx="384" cy="${y + 24}" r="8" fill="${sn ? col : C.grid}"/><text x="384" y="${y + 28}" text-anchor="middle" font-size="10" fill="#fff">${sn ? '✓' : ''}</text><text x="398" y="${y + 22}" font-size="12" font-weight="bold" fill="${col}">${title}</text><text x="398" y="${y + 40}" font-size="10.5" fill="${C.ink}">${desc.slice(0, 20)}</text><text x="398" y="${y + 55}" font-size="10" fill="${C.mute}">${desc.slice(20)}</text></g>`;
    }).join('');

    o += T(450, 310, 'VBAC là KẾT QUẢ, không hứa trước', { s: 10.5, c: C.redD });
    return o;
  },
  say: s => ['vbac', 'fail', 'ercs'].every(k => seen(s, k)) ? ['happy', '**TOLAC** là lựa chọn thử chuyển dạ; **VBAC** là kết quả nếu thành công. So cả **thất bại → mổ trong chuyển dạ** và **mổ lặp lại** với sẹo tích lũy.'] : ['happy', 'Chạm **3 kết cục** để xem lợi – hại 👆']
});
tfKit('bt-q1', [['Đã mổ thì lần sau luôn phải mổ', false, 'Không đúng: nếu phù hợp, có thể chọn thử chuyển dạ (TOLAC) sau mổ cũ.'], ['Hứa chắc chị sẽ sinh thường được', false, 'Không hứa VBAC: chỉ có xác suất thành công, vẫn có thể phải mổ trong chuyển dạ.'], ['Mổ lặp lại cũng có nguy cơ riêng', true, 'Sẹo tích lũy, dính, nhau cài răng lược… tăng theo số lần mổ — mổ lặp lại không "an toàn tuyệt đối".'], ['Quyết định có tính mong muốn sinh con sau này', true, 'Số con muốn sinh làm đổi cán cân lợi–hại giữa TOLAC và mổ lặp lại.']], 'Không có câu “đã mổ thì luôn phải mổ”; không hứa VBAC. Cân **cả hai lựa chọn** cùng mong muốn sinh sản và năng lực cơ sở.');
B['tolac-vbac'] = [
  { t: 'TOLAC là lựa chọn, VBAC là kết quả', kit: 'bt-cay' },
  { t: 'Bốn câu về lựa chọn', kit: 'bt-q1' }
];
const HS = [['ngang', 'Sẹo ngang đoạn dưới', 'ok'], ['vbac', 'Từng sinh thường / VBAC', 'ok'], ['tunhien', 'Chuyển dạ tự nhiên', 'ok'], ['vo', 'Tiền căn vỡ tử cung', 'stop'], ['doc', 'Sẹo dọc thân / cổ điển', 'stop'], ['ntd', 'Nhau che lỗ trong', 'stop'], ['hai', 'Hai lần mổ cũ', 'ca'], ['to', 'Thai to', 'ca'], ['chua', 'Chưa biết sẹo', 'ca']];
const HSC = { ok: ['Thuận lợi', C.mint, C.green], stop: ['Điểm chặn', '#ffd0d8', C.redD], ca: ['Cá thể hóa', C.butter, '#b8860b'] };
kit('bt-ho', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => HS.every(([k]) => seen(s, k)),
  draw: s => {
    const cnt = g => HS.filter(([k, , gg]) => gg === g && seen(s, k)).length, LAMP = [['stop', 'Điểm chặn', 70, '#ef5350'], ['ca', 'Cá thể hóa', 130, '#ffca28'], ['ok', 'Thuận lợi', 190, '#43c28a']];
    let o = card(20, 20, 150, 316, '#fffdfa') + `<rect x="50" y="46" width="62" height="238" rx="24" fill="#3b3550" stroke="#2b2640" stroke-width="2"/>`;
    o += LAMP.map(([g, , y, col]) => `<circle cx="81" cy="${y}" r="21" fill="${cnt(g) ? col : '#5b5570'}" opacity="${cnt(g) ? 1 : .55}" ${cnt(g) ? 'class="pulse"' : ''}/>${cnt(g) ? `<circle cx="81" cy="${y}" r="30" fill="${col}" opacity=".18"/>` : ''}`).join('');
    o += LAMP.map(([g, t, y]) => T(124, y + 5, `${cnt(g)}/3`, { a: 'start', s: 15 })).join('') + T(95, 306, 'đèn sáng khi bạn', { s: 11.5, c: C.mute }) + T(95, 322, 'xếp đúng nhóm', { s: 11.5, c: C.mute });
    o += HS.map(([k, t, g], i) => { const x = 182 + (i % 2) * 184, y = 24 + Math.floor(i / 2) * 62, sn = seen(s, k), c = HSC[g];
      return `<g class="tap" data-set="!${k}">${card(x, y, 176, 54, sn ? c[1] : '#fff', sn ? C.soft : C.grid)}${ZS.wrap(t, 20).map((l, j) => T(x + 88, y + 22 + j * 16, l, { s: 12.5 })).join('')}${sn ? `<g class="fadein">${T(x + 88, y + 47, c[0], { s: 11, c: c[2] })}</g>` : ''}</g>`; }).join('');
    return o;
  },
  say: s => HS.every(([k]) => seen(s, k)) ? ['happy', '**Thuận lợi**: sẹo ngang đoạn dưới, từng sinh thường. **Chặn**: tiền căn vỡ, sẹo dọc thân, nhau che lỗ trong. **Cá thể hóa**: 2 lần mổ, thai to, chưa rõ sẹo.'] : ['happy', 'Chạm **9 thẻ hồ sơ** — mỗi thẻ làm **một đèn** sáng lên đúng nhóm 👆']
});
tfKit('bt-q2', [['Từ chối TOLAC vì chủng tộc hay hôn nhân', false, 'Không dùng chủng tộc hay tình trạng hôn nhân để loại trừ; dựa vào yếu tố y khoa.'], ['Một lần đo đoạn dưới đủ để tự quyết', false, 'Độ dày đoạn dưới đo một lần chưa có ngưỡng chung, không dùng riêng lẻ để quyết định.'], ['Cần biết lần trước rạch ở đâu, vì sao mổ', true, 'Loại đường rạch (ngang đoạn dưới hay dọc thân) và lý do mổ quyết định nguy cơ vỡ.'], ['Hai lần mổ: chống chỉ định tuyệt đối', false, 'Hai lần mổ cần cá thể hóa, không phải chống chỉ định tuyệt đối.']], 'Không dùng **chủng tộc, hôn nhân, một con số** đơn độc để từ chối. Đoạn dưới đo một lần **chưa có ngưỡng phổ quát**. Hai lần mổ cần **cá thể hóa**, không tuyệt đối.');
B['chon-nguoi'] = [
  { t: 'Đọc hồ sơ tử cung', kit: 'bt-ho' },
  { t: 'Bốn câu khi chọn người', kit: 'bt-q2' }
];
kit('bt-1000', {
  init: () => ({ ind: false }), ui: () => [{ t: 'tog', k: 'ind', label: '💉 Gây chuyển dạ / tăng co' }], goal: s => s.ind,
  draw: s => {
    const n = s.ind ? 13 : 5, red = new Set([47, 133, 288, 512, 761, 95, 340, 455, 610, 702, 820, 905, 222].slice(0, n));
    let o = card(20, 20, 350, 316, '#fffdfa') + T(195, 44, '1000 mẹ chọn TOLAC', { s: 13.5 });
    for (let i = 0; i < 1000; i++) { const x = 36 + (i % 40) * 8, y = 58 + Math.floor(i / 40) * 10.6; o += `<circle cx="${x}" cy="${y}" r="${red.has(i) ? 3.6 : 2.6}" fill="${red.has(i) ? C.red : '#d9d2ea'}"/>`; }
    o += card(382, 20, 168, 316) + T(466, 66, 'vỡ tử cung', { s: 13, c: C.mute }) + T(466, 110, '≈ ' + (s.ind ? '10–15' : '5'), { s: 28, c: C.redD }) + T(466, 136, 'trong 1000', { s: 13 }) + T(466, 186, s.ind ? 'tăng 2–3 lần' : 'chuyển dạ tự nhiên', { s: 13.5, c: s.ind ? '#c0561a' : C.green }) + T(466, 270, 'RCOG GTG45 (2015)', { s: 11.5, c: C.mute }) + T(466, 290, 'số quần thể,', { s: 11.5, c: C.mute }) + T(466, 306, 'không dự đoán 1 ca', { s: 11.5, c: C.mute });
    return o;
  },
  say: s => s.ind ? ['worry', 'Nguy cơ vỡ ≈ **0,5%** (5/1000); gây chuyển dạ/tăng co **tăng 2–3 lần** → khoảng **10–15/1000**. Nói cả **số tuyệt đối** lẫn nguồn & phiên bản.'] : ['happy', 'Mỗi chấm là một mẹ. Bật **💉 Gây chuyển dạ** 👆']
});
kit('bt-noi', {
  init: () => ({ c: '', seen: '' }), ui: () => [{ t: 'seg', k: 'c', opts: [['tuongdoi', '😱 “Tăng gấp 3 lần!”'], ['tuyetdoi', '🔢 Số tuyệt đối + bối cảnh']] }], after: s => markSeen(s, s.c), goal: s => seen(s, 'tuongdoi') && seen(s, 'tuyetdoi'),
  draw: s => {
    const M = { tuongdoi: ['“Gây chuyển dạ làm vỡ tử cung tăng gấp 3 lần đó chị!”', '✗ chỉ số tương đối → sợ hãi, thiếu số thật', false], tuyetdoi: ['“Khoảng 5 trong 1000 mẹ bị vỡ; nếu phải gây chuyển dạ có thể lên 10–15 trong 1000. Mổ lặp lại cũng có nguy cơ riêng. Chị lo nhất điều gì?”', '✓ số tuyệt đối, cân bằng, hỏi giá trị', true] }[s.c];
    let o = card(20, 20, 530, 316, '#fffdfa') + pic('sv-phu-nu.png', 46, 60, 64, 230) + pic('sv-phu-nu.png', 460, 60, 64, 230) + T(78, 310, 'Bác sĩ', { s: 12.5, c: C.mute }) + T(492, 310, 'Người bệnh', { s: 12.5, c: C.mute });
    o += M ? `<g class="fadein"><rect x="130" y="54" width="310" height="${ZS.wrap(M[0], 34).length * 21 + 26}" rx="18" fill="${M[2] ? C.mint : '#ffd0d8'}"/>${ZS.wrap(M[0], 34).map((l, i) => T(146, 80 + i * 21, l, { a: 'start', s: 14 })).join('')}${T(285, 296, M[1], { s: 13.5, c: M[2] ? C.green : C.redD })}</g>` : T(285, 170, '👆 chọn cách nói', { s: 14, c: C.soft });
    return o;
  },
  say: s => seen(s, 'tuongdoi') && seen(s, 'tuyetdoi') ? ['happy', 'Tư vấn bằng **số tuyệt đối**, cân **cả TOLAC lẫn mổ lặp lại**, hỏi điều người bệnh lo. Người bệnh có quyền chọn và **đổi kế hoạch** theo diễn tiến.'] : ['happy', 'So **hai cách nói** cùng một con số 👆']
});
B['nguy-co-va-tu-van'] = [
  { t: '1000 mẹ: nguy cơ bằng số thật', kit: 'bt-1000' },
  { t: 'Nói số tuyệt đối, không dọa', kit: 'bt-noi', cr: 'Người: ' + SV }
];
const DK = [['ctg', '📈 CTG liên tục'], ['mo', '🏥 Mổ cấp cứu sẵn'], ['gm', '😷 Gây mê có mặt'], ['ss', '👶 Hồi sức sơ sinh'], ['mau', '🩸 Máu sẵn']];
kit('bt-dk', {
  init: () => Object.fromEntries(DK.map(([k]) => [k, false])), ui: () => [], goal: s => DK.every(([k]) => s[k]),
  draw: s => {
    const n = DK.filter(([k]) => s[k]).length, ok = n === 5;
    // Bức tranh mặt bằng phòng sinh và lối thoát hiểm bên trái x = 20..350
    let o = card(20, 20, 335, 316, '#fffdfa');
    o += T(187, 42, 'Hạ tầng phòng sinh an toàn cho TOLAC', { s: 13.5 });

    // Khu vực phòng sinh ở trung tâm
    o += `<rect x="40" y="60" width="165" height="155" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.6"/>`;
    o += T(122, 78, 'Phòng sinh (TOLAC)', { s: 12, c: C.ink });

    // Giường sản phụ
    o += `<rect x="55" y="95" width="75" height="52" rx="8" fill="#e2e8f0" stroke="#94a3b8"/><rect x="58" y="100" width="22" height="18" rx="4" fill="#fff"/>`;
    o += pic('sv-phu-nu.png', 72, 88, 30, 60);

    // 1. Máy CTG bên giường (ctg)
    const onCtg = s.ctg;
    o += `<g class="tap" data-set="!ctg"><rect x="140" y="92" width="55" height="42" rx="6" fill="${onCtg ? C.mint : '#f1f5f9'}" stroke="${onCtg ? C.green : C.grid}" stroke-width="${onCtg ? 1.6 : 1}"/>` +
      `<text x="167" y="108" text-anchor="middle" font-size="10" font-weight="bold" fill="${onCtg ? C.green : C.mute}">📈 CTG</text>` +
      `<path d="M146 122 Q153 114 160 124 T174 120 T188 124" fill="none" stroke="${onCtg ? C.green : C.grid}" stroke-width="1.8"/>` +
      `</g>`;

    // 2. Bác sĩ Gây mê túc trực (gm)
    const onGm = s.gm;
    o += `<g class="tap" data-set="!gm"><circle cx="65" cy="175" r="16" fill="${onGm ? '#e0e7ff' : '#f1f5f9'}" stroke="${onGm ? '#6366f1' : C.grid}" stroke-width="${onGm ? 1.6 : 1}"/>` +
      `<text x="65" y="180" text-anchor="middle" font-size="14">😷</text>` +
      `<text x="65" y="202" text-anchor="middle" font-size="9.5" font-weight="bold" fill="${onGm ? '#4338ca' : C.mute}">Gây mê</text>` +
      `</g>`;

    // 3. Kíp hồi sức sơ sinh (ss)
    const onSs = s.ss;
    o += `<g class="tap" data-set="!ss"><circle cx="115" cy="175" r="16" fill="${onSs ? '#fef3c7' : '#f1f5f9'}" stroke="${onSs ? '#f59e0b' : C.grid}" stroke-width="${onSs ? 1.6 : 1}"/>` +
      `<text x="115" y="180" text-anchor="middle" font-size="14">👶</text>` +
      `<text x="115" y="202" text-anchor="middle" font-size="9.5" font-weight="bold" fill="${onSs ? '#b45309' : C.mute}">Sơ sinh</text>` +
      `</g>`;

    // 4. Dự trù máu sẵn sàng (mau)
    const onMau = s.mau;
    o += `<g class="tap" data-set="!mau"><circle cx="165" cy="175" r="16" fill="${onMau ? '#fee2e2' : '#f1f5f9'}" stroke="${onMau ? C.red : C.grid}" stroke-width="${onMau ? 1.6 : 1}"/>` +
      `<text x="165" y="180" text-anchor="middle" font-size="14">🩸</text>` +
      `<text x="165" y="202" text-anchor="middle" font-size="9.5" font-weight="bold" fill="${onMau ? C.redD : C.mute}">Tủ máu</text>` +
      `</g>`;

    // 5. Phòng mổ cấp cứu kề bên (mo) & Hành lang chuyển mổ
    const onMo = s.mo;
    o += `<rect x="235" y="60" width="105" height="155" rx="14" fill="${onMo ? '#ecfdf5' : '#f8fafc'}" stroke="${onMo ? C.green : '#cbd5e1'}" stroke-width="${onMo ? 1.8 : 1.6}"/>`;
    o += T(287, 80, 'Phòng mổ (OR)', { s: 12, c: onMo ? C.green : C.mute });
    o += `<rect x="250" y="98" width="75" height="50" rx="8" fill="#fff" stroke="${onMo ? C.green : C.grid}" stroke-width="1.4"/>`;
    o += `<circle cx="287" cy="120" r="14" fill="${onMo ? '#a7f3d0' : '#e2e8f0'}"/><text x="287" y="125" text-anchor="middle" font-size="14">💡</text>`;
    o += T(287, 160, onMo ? 'Đèn mổ trực chiến' : 'Chưa có kíp mổ', { s: 9.5, c: onMo ? C.green : C.mute });
    o += T(287, 174, onMo ? 'rạch da < 30 phút' : 'không mổ khẩn được', { s: 9, c: onMo ? C.ink : C.redD });

    // Hành lang nối giữa 2 phòng (Lối thoát hiểm)
    o += `<rect x="200" y="105" width="40" height="36" fill="${ok ? C.mint : '#f1f5f9'}" stroke="${ok ? C.green : '#94a3b8'}" stroke-width="1.2"/>`;
    if (ok) {
      o += arrow('M202 123 H234', C.green, 3);
    } else {
      o += `<path d="M210 110 L230 134 M230 110 L210 134" stroke="${C.red}" stroke-width="2.5"/>`;
    }

    // Biển báo lối thoát ở bên dưới
    o += `<rect x="40" y="230" width="300" height="92" rx="14" fill="${ok ? C.mint : '#fff1f2'}" stroke="${ok ? C.green : C.red}" stroke-width="1.6"/>`;
    if (ok) {
      o += `<g class="fadein">`;
      o += T(190, 256, '🚪 LỐI THOÁT MỞ: ĐỦ ĐIỀU KIỆN TOLAC', { s: 13, c: C.green });
      o += T(190, 278, '• Khi tim thai suy / nghi vỡ: chuyển mổ rạch da < 30 phút', { s: 11, c: C.ink });
      o += T(190, 296, '• Đủ kíp sản, gây mê, hồi sức sơ sinh và máu truyền', { s: 11, c: C.ink });
      o += T(190, 312, '✓ Bảo đảm an toàn tối đa cho mẹ và thai nhi', { s: 10.5, c: C.green });
      o += `</g>`;
    } else {
      o += `<g class="fadein">`;
      o += T(190, 256, `🚨 THIẾU ${5 - n} ĐIỀU KIỆN — KHÔNG LÀM TOLAC!`, { s: 13, c: C.redD });
      o += T(190, 280, '“Theo dõi kỹ” KHÔNG bù được điều kiện bị thiếu!', { s: 11.5, c: C.redD });
      o += T(190, 302, 'Thiếu phòng mổ/gây mê/máu/sơ sinh → chuyển viện hoặc mổ chủ động', { s: 10.5, c: C.mute });
      o += `</g>`;
    }

    // Cột bên phải x = 365..545: 5 thẻ bật điều kiện
    o += card(365, 20, 175, 316);
    o += T(452, 42, '5 Điều kiện bắt buộc', { s: 13.5 });
    o += DK.map(([k, t], i) => {
      const y = 60 + i * 51, on = s[k];
      return `<g class="tap" data-set="!${k}"><rect x="372" y="${y}" width="161" height="44" rx="10" fill="${on ? C.mint : '#fff'}" stroke="${on ? C.green : C.grid}" stroke-width="${on ? 1.6 : 1}"/><circle cx="386" cy="${y + 22}" r="8" fill="${on ? C.green : C.grid}"/><text x="386" y="${y + 26}" text-anchor="middle" font-size="10" fill="#fff">${on ? '✓' : ''}</text><text x="402" y="${y + 26}" font-size="12" font-weight="bold" fill="${on ? C.green : C.mute}">${t}</text></g>`;
    }).join('');
    return o;
  },
  say: s => DK.every(([k]) => s[k]) ? ['happy', 'TOLAC chỉ an toàn khi có **lối thoát sẵn**: CTG liên tục, mổ cấp cứu, gây mê, sơ sinh, máu. Thiếu thì **không bù bằng lời “theo dõi kỹ”**.'] : ['happy', 'Mở **lối thoát**: bật đủ 5 điều kiện 👆']
});
tfKit('bt-q3', [['Misoprostol khởi phát thường quy cho TOLAC đủ tháng', false, 'Không dùng misoprostol khởi phát thường quy trên sẹo mổ cũ: nguy cơ vỡ tăng.'], ['Gây tê ngoài màng cứng không đau → loại vỡ', false, 'NMC dùng được, nhưng không đau KHÔNG loại trừ vỡ; vẫn theo dõi tim thai, cơn co.'], ['Oxytocin là chống chỉ định tuyệt đối', false, 'Không tuyệt đối cấm; cần chỉ định rõ và giám sát chặt.'], ['Bàn giao rõ dấu chặn và người cần gọi', true, 'Ai nhận ca cũng biết dấu báo động và gọi ai, nên giảm chậm trễ.'], ['Tim thai xấu, đau mới, mất độ lọt → đánh giá vỡ', true, 'Đây là các dấu gợi ý vỡ tử cung; phải đánh giá khẩn.'], ['Gây chuyển dạ cần chỉ định + giám sát chuyên khoa', true, 'Gây chuyển dạ / tăng co làm nguy cơ vỡ tăng, nên cần chỉ định và giám sát chuyên khoa.']], '**Không misoprostol** khởi phát thường quy; NMC dùng được nhưng **không đau không loại vỡ**; oxytocin **không tuyệt đối cấm** nhưng cần chỉ định. Bàn giao rõ **dấu chặn**.');
B['theo-doi-tolac'] = [
  { t: 'Lối thoát phải sẵn trước', kit: 'bt-dk' },
  { t: 'Sáu câu khi theo dõi TOLAC', kit: 'bt-q3' }
];

// ═════════ 09 · AFE & tổng hợp
kit('ba-co', {
  init: () => ({ a: 0 }), ui: () => [{ t: 'range', k: 'a', label: '⚡ Phản ứng với dịch ối', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.a >= 70,
  draw: s => {
    const a = s.a / 100, sp = Math.round(98 - 24 * a), sb = Math.round(118 - 52 * a);
    let o = card(20, 20, 300, 316, '#fffdfa') + `<path d="M150 112 C144 72 72 84 78 156 C82 206 130 214 154 194Z M190 112 C196 72 268 84 262 156 C258 206 210 214 186 194Z" fill="${a > .5 ? '#c9bff0' : '#dbeeff'}" stroke="${C.soft}" stroke-width="1.6"/>` + Th(112, 156, 'phổi', { s: 12, c: C.mute }) + Th(228, 156, 'phổi', { s: 12, c: C.mute });
    if (a > .4) o += `<path d="M150 130 l12 12 m0 -12 l-12 12 M190 130 l12 12 m0 -12 l-12 12" stroke="${C.redD}" stroke-width="3" class="fadein"/>` + Th(170, 100, 'co thắt mạch phổi', { s: 12.5, c: C.redD });
    o += `<g transform="translate(170 226) scale(${1 + a * .22})"><g class="beat" style="animation-duration:${(.55 + (1 - a) * .5).toFixed(2)}s">${pic('sv-tim.png', -50, -66, 100, 131)}</g></g>` + (a > .4 ? Th(236, 262, 'thất phải giãn', { a: 'start', s: 11.5, c: C.redD }) : '');
    o += flow('M40 300 C80 260 100 200 140 170', Math.round(6 * a), '#e8d27a', 2.2, 4) + T(60, 326, 'dịch ối vào máu mẹ', { a: 'start', s: 11.5, c: '#b8860b' });
    o += card(332, 20, 218, 316) + vital(350, 40, 'SpO₂', sp + '%', sp < 90 ? '#ff6b7a' : '#7ee2b8', 182) + vital(350, 96, 'HA tâm thu', sb, sb < 90 ? '#ff6b7a' : '#7ee2b8', 182);
    o += `<g transform="translate(360 168)">${[0, 1, 2, 3].map(i => `<circle cx="${i * 26}" cy="12" r="9" fill="${i < Math.round(a * 4) ? 'url(#gClot)' : C.red}" stroke="${C.redD}"/>`).join('')}</g>` + T(441, 214, a > .5 ? 'DIC: đông lan tỏa → chảy máu' : 'đông máu còn tốt', { s: 12.5, c: a > .5 ? C.redD : C.mute });
    o += T(441, 270, 'viêm + mạch phổi', { s: 13 }) + T(441, 290, 'không chỉ “nút tắc”', { s: 13, c: C.redD }) + T(441, 318, 'số minh họa xu hướng', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.a >= 70 ? ['ouch', 'AFE: **đáp ứng viêm + co thắt mạch phổi** → suy thất phải, thiếu oxy, tụt áp, có thể **DIC**. Không chỉ là hạt ối bịt một ống mạch.'] : ['happy', 'Kéo thanh **⚡ Phản ứng với dịch ối** — nhìn phổi, tim và các chỉ số 👆']
});
const DDX = [['mm', '🩸 Xuất huyết nặng'], ['pv', '🐝 Phản vệ'], ['ttp', '🫁 Thuyên tắc phổi'], ['gm', '😷 Tai biến gây mê'], ['sg', '⚡ Sản giật'], ['tim', '❤️ Bệnh tim']];
kit('ba-pb', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => DDX.every(([k]) => seen(s, k)),
  draw: s => {
    const kk = 300 / 1060, X0 = 50, Y0 = 26, P = (a, b) => [+(X0 + a * kk).toFixed(1), +(Y0 + b * kk).toFixed(1)];
    const SITE = { sg: [148, 55], tim: [178, 285], pv: [262, 420], gm: [40, 430], mm: [150, 480], ttp: [110, 820] }, ORD = ['sg', 'tim', 'pv', 'gm', 'mm', 'ttp'];
    let o = card(20, 20, 170, 316, '#fffdfa') + pic('sv-phu-nu.png', X0, Y0, 297 * kk, 300);
    o += ORD.map(k => { const [x, y] = P(...SITE[k]); return seen(s, k) ? `<circle cx="${x}" cy="${y}" r="7" fill="${C.lavD}" stroke="#fff" stroke-width="1.6"/>` : tap('!' + k, x, y, 13, 13); }).join('');
    o += card(202, 20, 348, 316) + T(376, 46, 'Đột ngột khó thở, tụt áp quanh sinh — còn nghĩ gì?', { s: 12.5 });
    o += ORD.map((k, i) => { const [x, y] = P(...SITE[k]), nm = DDX.find(([kk2]) => kk2 === k)[1], ry = 78 + i * 38; return seen(s, k) ? `<path d="M${x} ${y} L226 ${ry}" stroke="${C.lavD}" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/><g class="fadein"><rect x="226" y="${ry - 16}" width="300" height="30" rx="12" fill="${C.lav}"/>${T(242, ry + 4, nm, { a: 'start', s: 15 })}</g>` : `<rect x="226" y="${ry - 16}" width="300" height="30" rx="12" fill="none" stroke="${C.grid}" stroke-dasharray="4 4"/>` + T(242, ry + 4, '○ chạm vòng đứt nét trên người mẹ', { a: 'start', s: 12.5, c: C.grid }); }).join('');
    o += T(376, 322, 'chẩn đoán AFE là lâm sàng — không có xét nghiệm đặc hiệu', { s: 12, c: C.redD });
    return o;
  },
  say: s => DDX.every(([k]) => seen(s, k)) ? ['worry', 'Phân biệt với **xuất huyết, phản vệ, thuyên tắc phổi, tai biến gây mê, sản giật, bệnh tim**. AFE chẩn đoán **lâm sàng**, không chờ tử thiết hay tế bào thai.'] : ['happy', 'Chạm **6 vòng** trên người mẹ để lần ra 6 chẩn đoán phân biệt 👆']
});
B['afe-co-che'] = [
  { t: 'AFE: viêm và mạch phổi', kit: 'ba-co', cr: 'Tim: ' + SV },
  { t: 'Còn nghĩ đến gì khác?', kit: 'ba-pb' }
];
kit('ba-dich', {
  init: () => ({ f: 20 }), ui: () => [{ t: 'range', k: 'f', label: '💧 Truyền dịch', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.f >= 70,
  draw: s => {
    const f = s.f / 100, CO = (rv, x) => rv ? 62 + 60 * x - 135 * x * x : 55 + 90 * x - 70 * x * x, P = ZS.plot({ x: 336, y: 60, w: 196, h: 180, xr: [0, 100], yr: [0, 100], xt: 5, yt: 4, xl: 'dịch truyền (%)', curves: [{ f: v => CO(false, v / 100), col: C.mute, w: 2.4, dash: '4 4' }, { f: v => CO(true, v / 100), col: C.red, w: 3.4 }], vl: [{ x: s.f }], pts: [{ x: s.f, y: CO(true, f), col: C.red }] });
    const rv = 1 + f * .55;
    let o = card(20, 20, 290, 316, '#fffdfa') + `<g transform="translate(160 170)"><path d="M-46 -54 Q-16 -74 6 -54 L12 44 Q-8 66 -40 50Z" fill="#ffd6d6" stroke="${C.redD}" stroke-width="1.6" transform="scale(${(1 - f * .25).toFixed(2)} 1)"/><path d="M6 -54 Q44 -70 60 -30 Q70 22 24 58 Q8 62 12 44Z" fill="#f4a6a8" stroke="${C.redD}" stroke-width="1.6" transform="scale(${rv.toFixed(2)} ${(1 + f * .12).toFixed(2)})"/>${T(-20, 6, 'TT', { s: 13 })}${T(36 * rv, 14, 'TP', { s: 13, c: C.redD })}</g>`;
    o += T(165, 296, f > .5 ? 'thất phải CĂNG → đè thất trái' : 'thất phải còn dung nạp', { s: 13, c: f > .5 ? C.redD : C.mute });
    o += card(322, 20, 228, 316) + T(436, 46, 'Cung lượng tim theo dịch', { s: 12.5 }) + P.svg + ZS.legend(338, 300, [[C.red, 'Suy thất phải'], [C.mute, 'Tim bình thường', '4 4']], { w: 200, s: 11 });
    return o;
  },
  say: s => s.f >= 70 ? ['ouch', 'Thất phải suy mà **truyền dịch ồ ạt** → thất phải căng, **đè thất trái** → cung lượng tim **tụt**. Tránh quá tải dịch; vận mạch/inotrope theo đội hồi sức.'] : ['happy', 'Kéo thanh **💧 Truyền dịch** — nhìn đường đỏ của thất phải suy 👆']
});
tfKit('ba-q', [['“Cocktail” digoxin–atropine–dextran–heparin cho mọi AFE', false, 'Phác đồ "cocktail" trong ghi chú cũ không có bằng chứng; không dùng cho mọi ca.'], ['Oxy, thông khí, CPR khi ngừng tim', true, 'Nền tảng hồi sức AFE: oxy/thông khí, tuần hoàn, CPR khi ngừng tim.'], ['Đánh giá đông máu sớm, bù chế phẩm', true, 'AFE hay kèm DIC: làm đông máu sớm và bù theo nhu cầu.'], ['Mọi sốc đều truyền dịch như xuất huyết', false, 'AFE có suy thất phải: truyền dịch ồ ạt có hại. Chiến lược dịch khác sốc xuất huyết.']], 'Hồi sức AFE: **oxy/thông khí, tuần hoàn (CPR khi cần)**, đội đa chuyên khoa, **đông máu sớm**. Không dùng “cocktail” từ note cũ; chiến lược dịch **khác** xuất huyết.');
B['afe-hoi-suc'] = [
  { t: 'Dịch ồ ạt làm suy tim phải', kit: 'ba-dich' },
  { t: 'Bốn câu hồi sức AFE', kit: 'ba-q' }
];
const SK = { vol: ['🩸 Mất máu', ['↓', '↓', '↑'], 'cầm máu + thể tích, hồng cầu, đông máu'], dist: ['🦠 Sepsis / phản vệ', ['↓', '↑/↓', '↓'], 'kháng sinh sớm, nguồn nhiễm (có thể KHÔNG sốt)'], pump: ['❤️ Tim yếu', ['↑', '↓', '↑'], 'hồi sức theo huyết động'], block: ['🧱 AFE / tắc phổi', ['↑', '↓', '—'], 'thuật toán đặc hiệu, tránh quá tải dịch'] };
kit('ba-soc', {
  init: () => ({ k: 'vol', seen: 'vol,' }), ui: () => [{ t: 'seg', k: 'k', opts: Object.entries(SK).map(([k, v]) => [k, v[0]]) }], after: s => markSeen(s, s.k), goal: s => Object.keys(SK).every(k => seen(s, k)),
  draw: s => {
    const [n, ar, act] = SK[s.k], tank = s.k === 'vol' ? .3 : .75, pipe = s.k === 'dist' ? 22 : 12, weak = s.k === 'pump', block = s.k === 'block';
    let o = card(20, 20, 530, 230, '#fffdfa');
    o += `<rect x="50" y="70" width="90" height="140" rx="12" fill="#fff" stroke="${C.soft}" stroke-width="2"/><rect x="52" y="${70 + 140 * (1 - tank)}" width="86" height="${140 * tank - 2}" rx="10" fill="${C.red}" opacity=".75"/>` + T(95, 232, 'bể (thể tích)', { s: 12, c: C.mute });
    o += `<path d="M140 140 H230" stroke="${C.redD}" stroke-width="16"/>` + `<g transform="translate(270 140)"><g class="beat" style="animation-duration:${weak ? 1.3 : .7}s">${pic('sv-tim.png', -40, -52, 80, 105, weak ? 'opacity=".55"' : '')}</g></g>` + T(270, 232, 'bơm (tim)', { s: 12, c: C.mute });
    o += `<path d="M310 140 H510" stroke="${C.redD}" stroke-width="${pipe + 4}"/><path d="M310 140 H510" stroke="#ff9aa2" stroke-width="${pipe}"/>` + (block ? `<rect x="338" y="120" width="14" height="40" rx="4" fill="${C.ink}"/>` : '') + flow('M312 140 H508', s.k === 'vol' ? 3 : 6, '#c8283c', block ? 4 : 2, 4) + T(410, 232, 'ống (mạch)', { s: 12, c: C.mute });
    o += [['CVP', ar[0]], ['CO', ar[1]], ['SVR', ar[2]]].map(([a, v], i) => `<rect x="${40 + i * 120}" y="262" width="110" height="64" rx="14" fill="#f8f6fc"/>` + T(95 + i * 120, 284, a, { s: 12.5, c: C.mute }) + T(95 + i * 120, 314, v, { s: 22, c: v === '↓' ? C.cap : v === '↑' ? C.redD : C.ink })).join('');
    o += `<rect x="400" y="262" width="150" height="64" rx="14" fill="${C.butter}"/>` + ZS.wrap(act, 22).slice(0, 3).map((l, i) => T(475, 282 + i * 16, l, { s: 11.5 })).join('');
    return o;
  },
  say: s => Object.keys(SK).every(k => seen(s, k)) ? ['worry', 'Trước khi đóng khung “mất máu”: kiểm **sepsis (có thể không sốt), phản vệ, AFE/tắc phổi, tim**. Một mẹ có thể **sốc hỗn hợp**.'] : ['happy', 'Bấm **4 loại sốc** — nhìn bể, bơm, ống thay đổi 👆']
});
tfKit('ba-q2', [['Không sốt → loại sepsis', false, 'Sepsis sản khoa có thể không sốt.'], ['Không có máu ngoài → loại xuất huyết', false, 'Máu có thể chảy kín (ổ bụng, khối tụ).'], ['Chờ lấy cấy xong mới cho kháng sinh', false, 'Lấy cấy nhanh, nhưng KHÔNG được làm chậm kháng sinh.'], ['Một biến cố có thể thành sốc hỗn hợp', true, 'Ví dụ mất máu cộng nhiễm trùng cùng lúc: tìm đủ các cơ chế.']], 'Không sốt **không loại** sepsis; không có máu ngoài **không loại** xuất huyết; lấy cấy **không được làm chậm** kháng sinh. Sốc có thể **hỗn hợp**.');
B['phan-biet-soc'] = [
  { t: 'Bể, bơm, ống: bốn loại sốc', kit: 'ba-soc', cr: 'Tim: ' + SV },
  { t: 'Bốn bẫy khi phân biệt sốc', kit: 'ba-q2' }
];
const FR = [
  ['tt', '📝 Tóm tắt', '“Sản phụ 34 tuổi, thai 36 tuần, mổ cũ, ra huyết…”', '1. Tóm tắt súc tích', 'Nêu đủ tuổi thai, PARA, sẹo mổ và triệu chứng chính'],
  ['kh', '🚨 Mức khẩn', '“Hiện mạch 120, HA 90/60 — có dấu hiệu bất ổn.”', '2. Báo mức khẩn cấp', 'Đánh giá ngay mạch, HA, tri giác — nhận định sốc sớm'],
  ['cd', '🩺 Chẩn đoán', '“Em nghĩ nhiều nhau tiền đạo vì ra huyết không đau, mổ cũ.”', '3. Chẩn đoán có lý do', 'Chẩn đoán phải gắn liền với triệu chứng then chốt'],
  ['ks', '🔎 Khảo sát', '“Siêu âm ngả âm đạo để xác định vị trí nhau.”', '4. Khảo sát đúng đích', 'Nêu xét nghiệm có mục đích rõ, không đọc danh sách vẹt'],
  ['kh2', '⚡ Kế hoạch', '“Em vừa hồi sức, vừa chuẩn bị máu và phòng mổ song song.”', '5. Kế hoạch song hành', 'Vừa ổn định hồi sức vừa chuẩn bị can thiệp sản khoa'],
  ['neu', '🔀 Nếu… thì…', '“Nếu chảy tiếp hoặc tim thai xấu, em xin mổ khẩn.”', '6. Dự phòng tình huống', 'Đón đầu kịch bản diễn tiến xấu, không bị động']
];
kit('ba-osce', {
  init: () => ({ seen: '', cur: 'tt' }), ui: () => [],
  after: (s, k) => { markSeen(s, k); s.cur = k; },
  goal: s => FR.every(([k]) => seen(s, k)),
  draw: s => {
    const n = FR.filter(([k]) => seen(s, k)).length, cur = s.cur || 'tt';
    const curIdx = FR.findIndex(([k]) => k === cur);
    const curItem = FR[curIdx >= 0 ? curIdx : 0];

    // Pipeline bên trái x = 20..200: 6 bước tư duy lâm sàng
    let o = card(20, 20, 185, 316, '#fffdfa');
    o += T(112, 42, 'Khung 6 bước OSCE', { s: 13.5 });

    // Đường ray nối các node
    o += `<path d="M42 75 V285" stroke="${C.grid}" stroke-width="2.5"/>`;
    if (n > 1) {
      const hProg = Math.min(210, ((n - 1) / 5) * 210);
      o += `<path d="M42 75 V${75 + hProg}" stroke="${C.green}" stroke-width="2.8"/>`;
    }

    o += FR.map(([k, t], i) => {
      const y = 60 + i * 42, sn = seen(s, k), isSelected = cur === k;
      return `<g class="tap" data-set="!${k}">` +
        `<circle cx="42" cy="${y + 16}" r="11" fill="${isSelected ? C.cap : sn ? C.green : '#fff'}" stroke="${isSelected ? C.capD || C.ink : sn ? C.green : C.grid}" stroke-width="2"/>` +
        `<text x="42" y="${y + 20}" text-anchor="middle" font-size="10" font-weight="bold" fill="${isSelected || sn ? '#fff' : C.mute}">${sn ? '✓' : i + 1}</text>` +
        `<rect x="62" y="${y}" width="135" height="32" rx="8" fill="${isSelected ? C.lav : sn ? '#f0fdf4' : '#fff'}" stroke="${isSelected ? C.soft : sn ? C.mintD : C.grid}" stroke-width="${isSelected ? 1.6 : 1}"/>` +
        `<text x="70" y="${y + 20}" font-size="11" font-weight="${isSelected ? 'bold' : 'normal'}" fill="${isSelected ? C.ink : sn ? C.green : C.mute}">${t}</text>` +
        `</g>`;
    }).join('');

    // Hộp hiển thị nội dung lâm sàng bên phải x = 215..545
    o += card(215, 20, 335, 316, '#fffdfa');
    o += T(382, 42, 'Kịch bản trả lời thực chiến', { s: 13.5 });

    // Thanh đo tiến độ hoàn thiện
    o += `<rect x="230" y="58" width="305" height="42" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>`;
    o += T(242, 74, `Tiến độ: ${n} / 6 bước`, { a: 'start', s: 11.5, c: C.ink });
    o += T(522, 74, n === 6 ? '🏆 10/10 ĐIỂM' : `${(n * 1.66).toFixed(1)}/10`, { a: 'end', s: 12, c: n === 6 ? C.green : C.cap });
    o += ZS.bar(242, 84, 280, (n / 6) * 100, n === 6 ? C.green : C.cap, '', { h: 8 });

    // Hộp câu trả lời mẫu
    o += `<g class="fadein">`;
    o += `<rect x="230" y="110" width="305" height="150" rx="14" fill="${C.lav}" stroke="${C.soft}" stroke-width="1.4"/>`;
    // Nhãn bước
    o += `<rect x="245" y="122" width="180" height="24" rx="12" fill="#fff"/>`;
    o += `<text x="335" y="138" text-anchor="middle" font-size="11.5" font-weight="bold" fill="${C.ink}">${curItem[3]}</text>`;

    // Lời thoại thực tế
    o += ZS.wrap(curItem[2], 32).map((l, j) => T(382, 175 + j * 22, l, { s: 13.5, c: C.ink })).join('');

    // Bí kíp ăn điểm
    o += `<rect x="230" y="268" width="305" height="54" rx="10" fill="#f0fdf4" stroke="${C.mintD}" stroke-width="1.2"/>`;
    o += T(382, 288, `💡 Bí kíp: ${curItem[4]}`, { s: 11, c: C.green });
    o += T(382, 308, 'Nói to thành tiếng sau mỗi bước để tạo phản xạ', { s: 10.5, c: C.mute });
    o += `</g>`;

    return o;
  },
  say: s => FR.every(([k]) => seen(s, k)) ? ['happy', 'Khung OSCE: **tóm tắt → mức khẩn → chẩn đoán có lý do → khảo sát có mục đích → kế hoạch song song → nếu… thì…**. Nói lại thành tiếng sau mỗi trạm.'] : ['happy', 'Ráp **khung câu trả lời** OSCE — chạm 6 thẻ 👆']
});
kit('ba-xn', {
  init: () => ({ c: '', seen: '' }), ui: () => [{ t: 'seg', k: 'c', opts: [['list', '📃 Chỉ đọc danh sách xét nghiệm'], ['md', '🎯 Nói rõ xét nghiệm + mục đích lâm sàng']] }], after: s => markSeen(s, s.c), goal: s => seen(s, 'list') && seen(s, 'md'),
  draw: s => {
    const isMd = s.c === 'md';
    let o = card(20, 20, 530, 316, '#fffdfa');
    o += T(285, 42, 'Tư duy đề nghị Cận lâm sàng trong cấp cứu', { s: 14 });

    const LABS = [
      ['Công thức máu (CBC)', 'xem mức độ thiếu máu (Hb) để chuẩn bị bù dịch/máu', '#ec4899', 'sv-can.png'],
      ['Nhóm máu + Phản ứng chéo', 'chuẩn bị sẵn máu tương thích, tránh chậm trễ khi sốc', '#ef4444', 'sv-bom-tiem.png'],
      ['Đông máu toàn bộ + Fibrinogen', 'phát hiện sớm đông máu nội mạch rải rác (DIC)', '#8b5cf6', 'sv-tim.png'],
      ['Siêu âm cấp cứu tại giường', 'xác định vị trí nhau tiền đạo / loại trừ vỡ tử cung', '#06b6d4', 'sv-tu-cung.png']
    ];

    if (!s.c) {
      o += T(285, 170, '👆 chọn cách trình bày ở thanh trên', { s: 14, c: C.soft });
    } else {
      o += LABS.map(([name, purp, col], i) => {
        const y = 62 + i * 54;
        let row = `<g class="fadein" style="animation-delay:${i * .08}s">`;
        // Ống nghiệm tượng trưng
        row += `<rect x="40" y="${y}" width="16" height="38" rx="8" fill="${col}" opacity=".85"/><rect x="42" y="${y - 4}" width="12" height="6" rx="2" fill="#64748b"/>`;
        // Tên xét nghiệm
        row += `<rect x="68" y="${y}" width="${isMd ? 190 : 440}" height="38" rx="10" fill="${isMd ? '#f8fafc' : '#fee2e2'}" stroke="${isMd ? '#cbd5e1' : '#fca5a5'}" stroke-width="1.2"/>`;
        row += T(isMd ? 163 : 288, y + 24, name, { s: 12.5, c: isMd ? C.ink : C.redD });

        if (isMd) {
          // Mũi tên kết nối mục đích lâm sàng
          row += arrow(`M262 ${y + 19} H280`, C.green, 2.5);
          // Hộp mục đích lâm sàng
          row += `<rect x="284" y="${y}" width="225" height="38" rx="10" fill="${C.mint}" stroke="${C.green}" stroke-width="1.2"/>`;
          row += ZS.wrap('→ ' + purp, 34).map((l, j) => T(294, y + 16 + j * 14, l, { a: 'start', s: 10.5, c: C.ink })).join('');
        }
        row += `</g>`;
        return row;
      }).join('');

      o += verdict(60, 285, 450, isMd, isMd ? '✓ GIÁM KHẢO ĐÁNH GIÁ CAO: HIỂU VÌ SAO CHỈ ĐỊNH' : '✗ CHỈ LÀ DANH SÁCH HỌC VẸT: THIẾU TƯ DUY LÂM SÀNG', isMd ? 'mỗi xét nghiệm đều phục vụ một quyết định hành động' : 'không nói được mục đích sẽ bị trừ điểm nặng ở trạm OSCE');
    }
    return o;
  },
  say: s => seen(s, 'list') && seen(s, 'md') ? ['happy', 'Đừng đọc danh sách xét nghiệm suông — **mỗi xét nghiệm nói rõ để làm gì**. Điểm app chỉ để tự luyện, không thay bảng chấm thật.'] : ['happy', 'So **hai cách trình bày** cận lâm sàng 👆']
});
B['tu-duy-osce'] = [
  { t: 'Khung câu trả lời OSCE', kit: 'ba-osce' },
  { t: 'Xét nghiệm nào, để làm gì', kit: 'ba-xn' }
];
})();
