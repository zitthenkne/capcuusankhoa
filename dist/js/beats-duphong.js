'use strict';
/* Trang tí hon — chương 02 Dự phòng BHSS. Hình: Servier Medical Art (CC BY 4.0) cho người, em bé, bơm tiêm, cân, bàn tay; sơ đồ tự vẽ cho tử cung, tế bào cơ, bánh nhau, lọ thuốc. */
(() => {
const ZS = window.ZS, { C, T, kit, arrow } = ZS, B = ZS.beats;
const { Th, card, pic, tap, call, tcard, pcard, flow, heart, drops, vital, verdict } = ZS.BK;
const SV = 'Servier Medical Art · CC BY 4.0';
const seen = (s, k) => (s.seen || '').includes(k + ','), markSeen = (s, k) => { if (k && !seen(s, k)) s.seen = (s.seen || '') + k + ','; };
const tf = (cards, s, cols = 3, w = 170, h = 128, y0 = 56) => cards.map(([t, ok], i) => { const x = 20 + (i % cols) * (w + 8), y = y0 + Math.floor(i / cols) * (h + 10), sn = seen(s, 'q' + i);
  return `<g class="tap" data-set="!q${i}">${card(x, y, w, h, sn ? (ok ? C.mint : '#ffd0d8') : '#fff', sn ? C.soft : C.grid)}${ZS.wrap(t, Math.round(w / 10.5)).map((l, j) => T(x + w / 2, y + 34 + j * 19, l, { s: 13.5 })).join('')}${sn ? `<g class="fadein">${T(x + w / 2, y + h - 16, ok ? '✓ ĐÚNG' : '✗ SAI', { s: 15, c: ok ? C.green : C.redD })}</g>` : T(x + w / 2, y + h - 16, '👆', { s: 15, c: C.soft })}</g>`; }).join('');

// ═════════ Dự phòng bắt đầu trước khi em bé ra đời
kit('bd-cang', {
  init: () => ({ v: 0 }), ui: () => [{ t: 'range', k: 'v', label: '🎈 Tử cung căng', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.v >= 80,
  draw: s => {
    const f = s.v / 100, R = 90 + 45 * f, t = 26 - 18 * f, cx = 170, cy = 186;
    let o = card(20, 20, 300, 316, '#fffdfa') + `<path d="M${cx - R} ${cy} a${R} ${R} 0 1 0 ${2 * R} 0 a${R} ${R} 0 1 0 ${-2 * R} 0Z M${cx - R + t} ${cy} a${R - t} ${R - t} 0 1 1 ${2 * (R - t)} 0 a${R - t} ${R - t} 0 1 1 ${-2 * (R - t)} 0Z" fill="url(#gMyo)" fill-rule="evenodd" stroke="${C.myoD}" stroke-width="1.2"/>`;
    o += [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4, r = R - t / 2; return `<path d="M${(cx + r * Math.cos(a - .28)).toFixed(1)} ${(cy + r * Math.sin(a - .28)).toFixed(1)} A${r} ${r} 0 0 1 ${(cx + r * Math.cos(a + .28)).toFixed(1)} ${(cy + r * Math.sin(a + .28)).toFixed(1)}" fill="none" stroke="#d0688c" stroke-width="${2 + 3 * (1 - f)}"/>`; }).join('');
    const nb = f > .66 ? 2 : 1; o += [...Array(nb)].map((_, i) => `<circle cx="${cx - (nb - 1) * 34 + i * 68}" cy="${cy + 8}" r="${40 + 12 * f}" fill="url(#gSkin)" stroke="${C.skinD}"/>`).join('') + `<clipPath id="cavclip"><circle cx="${cx}" cy="${cy}" r="${R - t}"/></clipPath><rect clip-path="url(#cavclip)" x="${cx - R}" y="${cy + R - t - 50 * f}" width="${2 * R}" height="${50 * f + 4}" fill="#bfe1ff" opacity=".5"/>`;
    o += Th(cx, 336, f > .66 ? 'đa thai · đa ối · thai to' : 'đơn thai', { s: 13, c: C.mute });
    o += card(332, 20, 218, 316) + T(441, 56, 'Bề dày thành cơ', { s: 13, c: C.mute }) + ZS.bar(352, 66, 178, 100 - 70 * f, f > .6 ? C.amber : C.myoD, '', { h: 14 }) + T(441, 112, 'Sức co sau sinh', { s: 13, c: C.mute }) + ZS.bar(352, 122, 178, 100 - 55 * f, f > .6 ? C.red : C.green, '', { h: 14 });
    if (f >= .8) o += ZS.fade(verdict(348, 170, 186, false, 'nguy cơ đờ', 'sợi cơ bị kéo dài') + T(441, 274, '→ chuẩn bị trước:', { s: 13, c: C.mute }) + T(441, 296, 'đường truyền, máu, đội', { s: 13 }), ZS.fresh(s, x => x.v >= 80));
    return o;
  },
  say: s => s.v >= 80 ? ['worry', 'Tử cung **quá căng** (đa thai, đa ối, thai to) → sợi cơ bị kéo dài, **co kém sau sinh** → dễ băng huyết. Biết trước để **chuẩn bị**.'] : ['happy', 'Kéo thanh **🎈 Tử cung căng** — nhìn thành cơ khi tử cung phồng to 👆']
});
const RF_ZONES = [
  ['tc', '🎈 Tử cung quá căng', 'Đa thai · đa ối · thai to', 105, 140, 'cơ bị kéo dãn quá mức'],
  ['seo', '✂️ Vết mổ cũ tử cung', 'Mổ cũ · bóc u xơ', 105, 205, 'sẹo xơ dính, nguy cơ PAS'],
  ['mau', '🩸 Thiếu máu · đông máu', 'Hb thấp · rối loạn đông', 85, 75, 'kém dung nạp mất máu'],
  ['cd', '⏱️ Chuyển dạ kéo dài', 'Tăng co dồn · sinh giúp', 95, 260, 'cơ mỏi, nhiễm trùng ối']
];
kit('bd-phieu', {
  init: () => ({ tc: false, seo: false, mau: false, cd: false }), ui: () => [],
  goal: s => RF_ZONES.filter(([k]) => s[k]).length >= 3,
  draw: s => {
    const n = RF_ZONES.filter(([k]) => s[k]).length;
    let o = card(20, 20, 320, 316, '#fffdfa');
    o += `<svg x="26" y="26" width="130" height="300" viewBox="190 230 340 550" preserveAspectRatio="xMidYMid meet"><image href="${ZS.BK.I}sv-mang-thai.png" width="560" height="966"/></svg>`;
    o += RF_ZONES.map(([k, t, sub, hx, hy, mech]) => {
      const on = s[k];
      return `<g class="tap" data-set="!${k}">${on ? `<circle cx="${hx}" cy="${hy}" r="18" fill="none" stroke="${C.red}" stroke-width="2.5" class="pulse"/><circle cx="${hx}" cy="${hy}" r="6" fill="${C.red}"/>` : `<circle cx="${hx}" cy="${hy}" r="12" fill="#fff" fill-opacity=".3" stroke="${C.soft}" stroke-width="1.8" stroke-dasharray="4 3"/>`}</g>`;
    }).join('');
    o += RF_ZONES.map(([k, t, sub], i) => {
      const y = 38 + i * 70, on = s[k];
      return `<g class="tap" data-set="!${k}">${card(156, y, 174, 62, on ? '#ffe6ec' : '#fff', on ? C.red : C.grid)}<rect x="164" y="${y + 8}" width="16" height="16" rx="4" fill="${on ? C.red : '#fff'}" stroke="${on ? C.redD : C.soft}"/>${on ? T(172, y + 21, '✓', { s: 12, c: '#fff' }) : ''}${T(186, y + 21, t, { a: 'start', s: 12.5 })}${T(164, y + 46, sub, { a: 'start', s: 10.5, c: on ? C.redD : C.mute })}</g>`;
    }).join('');
    const lv = n >= 3 ? 2 : n ? 1 : 0;
    o += card(350, 20, 190, 316, ['#fff', '#fff8eb', '#ffeef2'][lv], C.grid);
    o += T(445, 48, n + ' yếu tố nguy cơ', { s: 16, c: lv === 2 ? C.redD : C.ink });
    o += [['💉', '2 đường truyền lớn 16–18G'], ['🩸', 'Định nhóm máu, dự trù máu'], ['📣', 'Báo kíp mổ & ngân hàng máu'], ['🏥', 'Sinh nơi có mổ cấp cứu']].map(([ic, t], i) => {
      const act = lv === 2 || (lv === 1 && i < 2);
      return `<g opacity="${act ? 1 : .28}" class="${act ? 'fadein' : ''}"><rect x="360" y="${68 + i * 54}" width="170" height="46" rx="10" fill="${act ? '#fff' : '#f8f6fc'}" stroke="${act ? C.mintD : C.grid}" stroke-width="${act ? 1.4 : 1}"/>${T(374, 96 + i * 54, ic, { s: 18 })}${ZS.wrap(t, 16).map((l, j) => T(396, 88 + i * 54 + j * 16, l, { a: 'start', s: 11.5 })).join('')}</g>`;
    }).join('');
    if (n >= 3) o += ZS.fade(verdict(360, 292, 170, true, '✓ SẴN SÀNG DỰ PHÒNG'), ZS.fresh(s, x => RF_ZONES.filter(([k]) => x[k]).length >= 3));
    return o;
  },
  say: s => RF_ZONES.filter(([k]) => s[k]).length >= 3 ? ['happy', 'Có nguy cơ → **chuẩn bị theo mức**: 2 đường truyền lớn, nhóm máu, báo kíp mổ & ngân hàng máu, sinh nơi đủ điều kiện.'] : ['happy', 'Chạm các **điểm nguy cơ** trên cơ thể mẹ để chuẩn bị các lớp dự phòng 👆']
});
kit('bd-hb', {
  init: () => ({ sat: false, loss: 0 }), ui: () => [{ t: 'tog', k: 'sat', label: '💊 Điều trị thiếu máu khi mang thai' }, { t: 'range', k: 'loss', label: '🩸 Mất máu khi sinh', min: 0, max: 100, step: 10, unit: '%' }],
  goal: s => s.sat && s.loss >= 60,
  draw: s => {
    const f = s.loss / 100, baseHb = s.sat ? 11.5 : 7.2, resHb = Math.max(2.5, baseHb - 5.5 * f);
    const po2 = Math.max(15, Math.round((s.sat ? 95 : 62) - 45 * f)), danger = po2 < 42;
    const rbcCount = s.sat ? Math.max(3, Math.round(12 - 7 * f)) : Math.max(1, Math.round(5 - 4 * f));
    let o = card(20, 20, 315, 316, danger ? '#fff0f2' : '#fffdfa');
    o += T(177, 44, 'Vi tuần hoàn & Oxy mô cơ tử cung', { s: 13.5 });
    // Khối cơ tử cung
    o += `<rect x="35" y="60" width="285" height="180" rx="14" fill="${danger ? '#784c60' : '#ffd3dc'}" stroke="${danger ? '#542d3e' : C.myoD}" stroke-width="2"/>`;
    o += [0, 1, 2, 3].map(i => `<path d="M45 ${85 + i * 40} Q177 ${95 + i * 40} 310 ${85 + i * 40}" fill="none" stroke="${danger ? '#5a3447' : '#e08ca0'}" stroke-width="3" stroke-dasharray="16 8"/>`).join('');
    // Lòng mạch máu nuôi cơ
    const VPATH = 'M40 150 C100 150 120 100 180 100 C240 100 260 150 315 150';
    o += `<path d="${VPATH}" fill="none" stroke="${danger ? '#962d3a' : C.redD}" stroke-width="24" stroke-linecap="round"/>`;
    o += `<path d="${VPATH}" fill="none" stroke="${danger ? '#ba3e4c' : '#ff858a'}" stroke-width="18" stroke-linecap="round"/>`;
    // Hồng cầu mang O2 chạy trong mạch
    o += [...Array(rbcCount)].map((_, i) => {
      const t = (i + 1) / (rbcCount + 1), px = 55 + t * 240, py = 150 - Math.sin(t * Math.PI) * 44;
      return `<g transform="translate(${px} ${py})"><ellipse rx="8" ry="5.5" fill="#e5484d" stroke="#b8323a" stroke-width="1.2"/><ellipse rx="4" ry="2.5" fill="#f4787d"/><circle cx="2" cy="-2" r="3" fill="#ffe066" stroke="#c49700" stroke-width=".8"/></g>`;
    }).join('');
    // Máu phun khi mất máu
    if (f > .1) o += drops(270, 160, Math.round(f * 4), .8, 14);
    o += `<circle cx="50" cy="222" r="4" fill="#ffe066" stroke="#c49700"/>` + T(62, 226, 'phân tử O₂', { a: 'start', s: 11, c: '#b8860b' });
    o += `<ellipse cx="140" cy="222" rx="7" ry="4.5" fill="#e5484d"/>` + T(154, 226, 'hồng cầu', { a: 'start', s: 11, c: C.redD });
    o += Th(177, 266, danger ? '⚠ Mô cơ thiếu oxy → đờ tử cung!' : '✓ Mô cơ đủ oxy → co hồi tốt', { s: 12.5, c: danger ? C.redD : C.green });
    // Bảng bên phải
    o += card(345, 20, 195, 316);
    o += T(442, 48, 'Dự trữ oxy mô', { s: 13, c: C.mute });
    o += vital(355, 62, 'Oxy mô (PO₂)', po2 + ' mmHg', danger ? C.redD : C.green, 175);
    o += vital(355, 120, 'Hb ước tính', resHb.toFixed(1) + ' g/dL', resHb < 6 ? C.redD : C.ink, 175);
    o += T(442, 190, 'Khoảng đệm an toàn', { s: 12, c: C.mute });
    o += ZS.bar(360, 202, 165, Math.max(4, po2), danger ? C.red : C.green, '', { h: 14 });
    o += T(442, 246, s.sat ? '✓ ĐÃ ĐIỀU TRỊ THIẾU MÁU' : '⚠ CHƯA ĐIỀU TRỊ THIẾU MÁU', { s: 11.5, c: s.sat ? C.green : '#c0561a' });
    o += ZS.wrap(s.sat ? 'Dự trữ dồi dào, chịu được mất máu' : 'Dự trữ mỏng, tụt oxy mô rất nhanh', 18).map((l, j) => T(442, 268 + j * 16, l, { s: 11.5, c: C.mute })).join('');
    return o;
  },
  say: s => s.sat && s.loss >= 60 ? ['wow', 'Thiếu máu làm mẹ **kém dung nạp** mất máu. Điều trị thiếu máu trong thai kỳ = **thêm khoảng dự trữ** trước khi sinh.'] : ['happy', 'Kéo **🩸 Mất máu**, rồi bật **💊 Điều trị thiếu máu** và kéo lại — so oxy mô 👆']
});
kit('bd-moi', {
  init: () => ({ run: false }), ui: () => [{ t: 'tog', k: 'run', label: '▶ Theo dõi 2 giờ đầu sau sinh' }], goal: s => s.run,
  draw: s => {
    let o = card(20, 20, 530, 316, '#fffdfa');
    o += T(285, 46, '20 sản phụ sau sinh — đều không có yếu tố nguy cơ trước sinh', { s: 13.5 });
    o += [...Array(20)].map((_, i) => {
      const x = 36 + (i % 10) * 50, y = 64 + Math.floor(i / 10) * 102, hit = s.run && (i === 6 || i === 13);
      return `<g ${hit ? 'class="fadein"' : ''}>${pic('sv-phu-nu.png', x, y, 28, 88)}${hit ? `<circle cx="${x + 14}" cy="${y + 50}" r="24" fill="none" stroke="${C.red}" stroke-width="3" class="pulse"/><ellipse cx="${x + 14}" cy="${y + 50}" rx="16" ry="12" fill="url(#gMyo)" opacity=".8"/>${drops(x + 14, y + 92, 2, .7)}` : ''}</g>`;
    }).join('');
    if (s.run) {
      o += `<g class="fadein"><rect x="36" y="270" width="488" height="52" rx="14" fill="#ffd8e0" stroke="${C.redD}" stroke-width="1.4"/>${T(280, 292, '🚨 Phát hiện 2 mẹ đờ tử cung âm thầm lúc 45 phút!', { s: 13.5, c: C.redD })}${T(280, 312, '→ Dùng oxytocin dự phòng & theo dõi sát 2 giờ đầu cho MỌI ca', { s: 12, c: C.ink })}</g>`;
    } else {
      o += T(285, 298, '👆 Bấm nút công tắc phía trên để bắt đầu theo dõi', { s: 13.5, c: C.soft });
    }
    return o;
  },
  say: s => s.run ? ['worry', 'BHSS vẫn xảy ra ở người **không có yếu tố báo trước** → **theo dõi MỌI sản phụ** sau sinh, ca nào cũng dùng thuốc co hồi dự phòng.'] : ['happy', 'Phiếu nguy cơ trống thì có cần theo dõi không? Bật **▶ Theo dõi** xem 👆']
});
B['du-phong-truoc-sinh'] = [
  { t: 'Tử cung căng quá, co kém', kit: 'bd-cang' },
  { t: 'Phiếu nguy cơ → chuẩn bị', kit: 'bd-phieu' },
  { t: 'Thiếu máu: dự trữ mỏng', kit: 'bd-hb' },
  { t: 'Không nguy cơ vẫn phải theo dõi', kit: 'bd-moi', cr: 'Người: ' + SV }
];

// ═════════ Giai đoạn III
// tử cung nhìn dọc thu nhỏ dần; bánh nhau bám đáy rồi bong và tụt xuống
const uts = (k, pl) => { const x = 170, y = 60 + (1 - k) * 90;
  let s = ZS.uterusSag({ x, y, k });
  const P = (lx, ly) => [x + (lx - 130) * k, y + ly * k];
  if (pl < 1) { const [px, py] = P(130, 40), w = 150 * .62, sh = pl * 20; s += `<ellipse cx="${px}" cy="${py + 12 + sh}" rx="${w / 2}" ry="14" fill="url(#gPlac)" stroke="${C.placD}"/>` + (pl > .3 ? `<ellipse cx="${px}" cy="${py + 2 + sh / 2}" rx="${w / 3}" ry="6" fill="url(#gClot)"/>` : ''); }
  else { const [px, py] = P(130, 230); s += `<ellipse cx="${px}" cy="${py}" rx="28" ry="14" fill="url(#gPlac)" stroke="${C.placD}"/>`; }
  return s;
};
kit('bg3-bong', {
  init: () => ({ t: 0 }), ui: () => [{ t: 'range', k: 't', label: '⏱ Phút sau sổ thai', min: 0, max: 10, step: 1, unit: ' phút' }], goal: s => s.t >= 8,
  draw: s => {
    const k = .82 - .26 * s.t / 10, pl = s.t < 3 ? 0 : s.t < 7 ? (s.t - 2) / 5 : 1;
    let o = card(20, 20, 300, 316, '#fffdfa') + uts(k, pl) + Th(170, 330, s.t < 3 ? 'tử cung bắt đầu co rút' : s.t < 7 ? 'giường nhau nhỏ lại → nhau bong' : 'nhau tụt xuống đoạn dưới', { s: 13, c: C.myoD });
    o += card(332, 20, 218, 316) + T(441, 50, 'Dấu nhau đã bong', { s: 14 });
    o += [['dây rốn dài ra', 7], ['ra một ít máu', 5], ['tử cung lên cao, chắc, tròn', 7]].map(([t, th], i) => `<g opacity="${s.t >= th ? 1 : .25}" class="${s.t >= th && ZS.fresh(s, z => z.t >= th) ? 'fadein' : ''}"><circle cx="356" cy="${88 + i * 46}" r="9" fill="${s.t >= th ? C.green : C.grid}"/>${T(374, 93 + i * 46, t, { a: 'start', s: 13 })}</g>`).join('');
    o += T(441, 270, 'diện giường nhau', { s: 12.5, c: C.mute }) + ZS.bar(360, 280, 162, 100 - 60 * s.t / 10, C.myoD, '', { h: 12 });
    return o;
  },
  say: s => s.t >= 8 ? ['wow', 'Sau sổ thai, tử cung **co rút** → diện giường nhau **nhỏ lại** → nhau (không co được) **bị bong** ra và tụt xuống. Co tốt = vừa bong nhau vừa cầm máu.'] : ['happy', 'Kéo thanh **⏱ Phút sau sổ thai** — nhìn tử cung và bánh nhau 👆']
});
const AM = [
  ['thuoc', '💉', 'Thuốc co hồi', 'Oxytocin 10 IU tiêm bắp trong 1 phút sau sinh', '⭐ Can thiệp quan trọng nhất'],
  ['keo', '🤲', 'Kéo rốn có đối lực', 'Kéo nhẹ theo trục + tay đẩy đáy tử cung lên', 'Phòng lộn tử cung, chỉ khi phù hợp'],
  ['kt', '🔍', 'Kiểm tra nhau & TC', 'Đủ múi, đủ màng, đáy tử cung chắc an toàn', 'Phát hiện sót nhau & đờ tử cung sớm']
];
kit('bg3-ba', {
  init: () => ({ cur: 'thuoc', seen: 'thuoc,' }), ui: () => [],
  after: (s, k) => { if (k === 'cur') markSeen(s, s.cur); },
  goal: s => AM.every(([k]) => seen(s, k)),
  draw: s => {
    const cur = s.cur || 'thuoc';
    let o = card(20, 20, 335, 316, '#fffdfa');
    if (cur === 'thuoc') {
      o += T(187, 44, 'Thao tác 1: Tiêm bắp Oxytocin dự phòng', { s: 13.5 });
      o += `<path d="M70 70 C120 70 260 90 280 180 C290 225 240 270 170 270 C100 270 60 210 70 70Z" fill="#ffd8e0" stroke="${C.myoD}" stroke-width="1.8"/>` + Th(175, 140, 'cơ tứ đầu đùi', { s: 12, c: C.myoD });
      o += `<g transform="translate(145 50)">${pic('sv-bom-tiem.png', -20, 0, 110, 40, 'transform="rotate(90 35 20)"')}</g>`;
      o += arrow('M180 100 V130', C.redD, 3.5) + Th(180, 175, '10 IU IM', { s: 18, c: C.redD }) + T(180, 198, 'trong vòng 1 phút sau sinh', { s: 12.5, c: C.ink });
      o += `<g transform="translate(90 220) scale(.45)">${ZS.uterusSag({ x: 170, y: 70, k: .6 })}</g>` + Th(230, 255, 'tử cung gò siết chặt', { s: 12, c: C.green });
    } else if (cur === 'keo') {
      o += T(187, 44, 'Thao tác 2: Kéo dây rốn có kiểm soát (CCT)', { s: 13.5 });
      o += ZS.uterusSag({ x: 180, y: 45, k: .65 });
      o += `<ellipse cx="180" cy="180" rx="40" ry="18" fill="url(#gPlac)" stroke="${C.placD}"/>`;
      o += `<path d="M180 195 C190 230 220 260 240 285" fill="none" stroke="#9b8fe0" stroke-width="6"/>`;
      o += arrow('M220 250 L250 290', C.redD, 4.5) + Th(250, 310, 'kéo nhẹ theo trục chậu', { a: 'middle', s: 11.5, c: C.redD });
      o += `<g transform="translate(195 145) scale(.7)">${pic('sv-ban-tay.png', -20, -30, 48, 80, 'transform="rotate(-50 4 10)"')}</g>`;
      o += arrow('M195 140 L165 95', C.green, 4.5) + Th(130, 105, 'đối lực đẩy đáy lên', { a: 'end', s: 12, c: C.green });
      o += `<rect x="60" y="278" width="130" height="26" rx="8" fill="#e8f8f0" stroke="${C.green}"/>` + T(125, 295, '✓ Chống lộn tử cung', { s: 11.5, c: C.green });
    } else {
      o += T(187, 44, 'Thao tác 3: Kiểm tra bánh nhau & đáy tử cung', { s: 13.5 });
      o += `<circle cx="130" cy="160" r="62" fill="#c94a5a" stroke="${C.placD}" stroke-width="2.5"/>`;
      o += [0, 1, 2, 3, 4, 5, 6].map(i => {
        const a = i * Math.PI * 2 / 7, rx = 130 + Math.cos(a) * 35, ry = 160 + Math.sin(a) * 35;
        return `<circle cx="${rx}" cy="${ry}" r="16" fill="#b23a4c" stroke="#8e2638" stroke-width="1.2"/>`;
      }).join('');
      o += Th(130, 240, 'đủ múi, đủ màng, 3 mạch rốn', { s: 11.5, c: C.placD });
      o += `<g transform="translate(245 105) scale(.6)">${ZS.uterusSag({ x: 80, y: 50, k: .55 })}</g>`;
      o += `<g transform="translate(285 105)">${pic('sv-ban-tay.png', -20, -30, 44, 76, 'transform="rotate(180)"')}</g>`;
      o += Th(285, 210, 'đáy tử cung chắc', { s: 13, c: C.green }) + T(285, 230, 'khối cầu an toàn', { s: 12, c: C.mute });
    }
    o += card(365, 20, 175, 316);
    o += T(452, 44, '3 can thiệp thiết yếu', { s: 13.5 });
    o += AM.map(([k, ic, a, b], i) => {
      const y = 58 + i * 86, on = cur === k, sn = seen(s, k);
      return `<g class="tap" data-set="cur=${k}">${card(375, y, 155, 78, on ? C.lav : sn ? '#f4fff8' : '#fff', on ? C.soft : sn ? C.mintD : C.grid, on ? 1.8 : 1)}${T(390, y + 24, ic, { s: 20 })}${T(410, y + 22, a, { a: 'start', s: 12, c: on ? C.ink : C.mute })}${sn ? T(516, y + 20, '✓', { s: 13, c: C.green }) : ''}${ZS.wrap(b, 17).map((l, j) => T(386, y + 44 + j * 15, l, { a: 'start', s: 10.5, c: on ? C.ink : C.mute })).join('')}</g>`;
    }).join('');
    return o;
  },
  say: s => AM.every(([k]) => seen(s, k)) ? ['happy', 'Ba việc: **thuốc co hồi** (quan trọng nhất), **kéo dây rốn có kiểm soát** khi phù hợp, **kiểm tra nhau + tử cung + máu mất**.'] : ['happy', 'Giai đoạn III gồm **3 việc**. Chạm từng thẻ để xem thao tác 👆']
});
kit('bg3-xoa', {
  init: () => ({ tc: '', seen: '' }), ui: () => [{ t: 'seg', k: 'tc', opts: [['chac', '🟢 Tử cung chắc, máu ít'], ['do', '🔴 Tử cung mềm, đang chảy']] }], after: s => markSeen(s, s.tc), goal: s => seen(s, 'chac') && seen(s, 'do'),
  draw: s => {
    const d = s.tc === 'do';
    let o = card(20, 20, 300, 316, '#fffdfa') + ZS.uterusSag({ x: 170, y: 90, k: d ? .7 : .5 }) + (d ? drops(170, 290, 3, .8, 16) : '');
    if (s.tc) o += `<g transform="translate(${d ? 150 : 176} ${d ? 66 : 92})"><g>${d ? '<animateTransform attributeName="transform" type="translate" values="0 0;16 6;0 12;-16 6;0 0" dur="1s" repeatCount="indefinite"/>' : ''}${pic('sv-ban-tay.png', -30, -40, 60, 104, 'transform="rotate(180)"')}</g></g>`;
    o += card(332, 20, 218, 316);
    o += !s.tc ? T(441, 170, '👆 chọn tình huống', { s: 14, c: C.soft }) : d ? ZS.fade(T(441, 80, 'XOA tử cung', { s: 20, c: C.redD }) + T(441, 108, '= can thiệp ĐIỀU TRỊ', { s: 14 }) + T(441, 150, 'kèm xử trí BHSS', { s: 13, c: C.mute }), ZS.fresh(s, x => x.tc === 'do')) : ZS.fade(T(441, 80, 'SỜ kiểm tra', { s: 20, c: C.green }) + T(441, 108, 'trương lực định kỳ', { s: 14 }) + T(441, 150, 'không cần xoa liên tục', { s: 13, c: C.mute }) + T(441, 172, 'khi đã dùng oxytocin', { s: 13, c: C.mute }), ZS.fresh(s, x => x.tc === 'chac'));
    return o;
  },
  say: s => seen(s, 'chac') && seen(s, 'do') ? ['worry', '**Đánh giá trương lực định kỳ** ≠ **xoa liên tục**. Đã dùng oxytocin dự phòng thì không xoa kéo dài thường quy; đờ tử cung thì **xoa là điều trị**.'] : ['happy', 'Hai tình huống sau sổ nhau — bấm **lần lượt cả hai** 👆']
});
B['giai-doan-ba'] = [
  { t: 'Tử cung co rút, nhau bong ra', kit: 'bg3-bong' },
  { t: 'Ba việc của giai đoạn III', kit: 'bg3-ba', cr: 'Bơm tiêm: ' + SV },
  { t: 'Sờ kiểm tra hay xoa liên tục?', kit: 'bg3-xoa', cr: 'Bàn tay: ' + SV }
];

// ═════════ Oxytocin dự phòng
kit('bo-cell', {
  init: () => ({ ox: 0 }), ui: () => [{ t: 'range', k: 'ox', label: '💉 Oxytocin gắn thụ thể', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.ox >= 80,
  draw: s => {
    const f = s.ox / 100, L = 300 - 90 * f, x0 = 40 + (300 - L) / 2;
    let o = card(20, 20, 380, 316, '#fffdfa') + T(210, 46, 'Một tế bào cơ tử cung', { s: 14, c: C.mute });
    o += `<rect x="${x0}" y="110" width="${L}" height="${100 + 30 * f}" rx="${50 + 15 * f}" fill="#ffd3dc" stroke="${C.myoD}" stroke-width="1.6"/>`;
    o += [0, 1, 2].map(i => `<path d="M${x0 + 30} ${140 + i * 24 + 10 * f} H${x0 + L - 30}" stroke="#d0688c" stroke-width="4" stroke-dasharray="${18 - 8 * f} 6"/>`).join('');
    o += [0, 1, 2, 3, 4].map(i => { const x = x0 + 20 + i * (L - 40) / 4, on = i < Math.round(5 * f); return `<path d="M${x} 110 v-10" stroke="${C.soft}" stroke-width="3"/><path d="M${x - 7} 96 q7 -10 14 0" fill="none" stroke="${C.soft}" stroke-width="3"/>${on ? `<circle cx="${x}" cy="88" r="7" fill="${C.cap}"/>` : ''}`; }).join('');
    o += flow(`M${x0 + 30} 200 Q${x0 + L / 2} 140 ${x0 + L - 30} 190`, Math.round(10 * f), '#ffb000', 2.4, 3.2) + T(x0 + L / 2, 262 + 6 * f, f > .2 ? 'Ca²⁺ tăng → sợi cơ trượt, tế bào ngắn lại' : '', { s: 12.5, c: '#b8860b' });
    o += `<circle cx="70" cy="312" r="7" fill="${C.cap}"/>` + T(84, 316, 'oxytocin', { a: 'start', s: 12, c: C.cap }) + `<circle cx="180" cy="312" r="4" fill="#ffb000"/>` + T(190, 316, 'Ca²⁺', { a: 'start', s: 12, c: '#b8860b' });
    const lw = 18 - 15 * f;
    o += card(412, 20, 138, 316) + T(481, 50, 'Mạch giường nhau', { s: 12.5, c: C.mute }) + `<path d="M481 80 V250" stroke="${C.redD}" stroke-width="${lw + 4}" stroke-linecap="round"/><path d="M481 80 V250" stroke="#ff8f93" stroke-width="${lw}" stroke-linecap="round"/>` + `<path d="M${458 + 10 * f} 120 Q481 ${130} ${504 - 10 * f} 120 M${458 + 10 * f} 200 Q481 210 ${504 - 10 * f} 200" fill="none" stroke="#d0688c" stroke-width="${3 + 5 * f}"/>` + T(481, 290, f >= .8 ? '✓ bị siết' : 'còn mở', { s: 15, c: f >= .8 ? C.green : C.redD });
    return o;
  },
  say: s => s.ox >= 80 ? ['wow', 'Oxytocin gắn **thụ thể** → **calcium** trong tế bào tăng → sợi cơ trượt, tế bào **co ngắn** → khối cơ **siết mạch giường nhau**.'] : ['happy', 'Kéo thanh **💉 Oxytocin** — nhìn thụ thể, calcium và mạch máu bên phải 👆']
});
kit('bo-lieu', {
  init: () => ({ d: '', seen: '' }), ui: () => [{ t: 'seg', k: 'd', opts: [['im', '💪 10 IU tiêm bắp'], ['ivc', '💧 10 IU IV chậm 1–2′'], ['ivn', '⚡ IV bolus nhanh']] }], after: s => markSeen(s, s.d), goal: s => seen(s, 'ivn') && (seen(s, 'ivc') || seen(s, 'im')),
  draw: s => {
    const bad = s.d === 'ivn', P = ZS.plot({ x: 210, y: 54, w: 320, h: 200, xr: [0, 10], yr: [50, 130], xt: 5, yt: 4, xl: 'phút sau tiêm', curves: s.d ? [{ f: t => 112 - (bad ? 38 * Math.exp(-((t - 1.2) ** 2) / .9) : 3 * Math.exp(-((t - 2) ** 2) / 4)), col: bad ? C.red : C.green, w: 3.4 }] : [], hl: [{ y: 90, c: C.amber, label: 'HA tâm thu 90' }], legend: s.d ? [[bad ? C.red : C.green, 'HA tâm thu mẹ']] : [] });
    let o = card(20, 20, 172, 316, '#fffdfa') + pic('sv-bom-tiem.png', 30, 70, 152, 48) + T(106, 160, '10 IU', { s: 26 }) + T(106, 186, 'oxytocin', { s: 13, c: C.mute }) + T(106, 240, s.d === 'ivc' ? 'pha loãng, đẩy 1–2 phút' : s.d === 'im' ? 'tiêm bắp đùi' : s.d === 'ivn' ? 'đẩy nhanh một lần' : '', { s: 12, c: bad ? C.redD : C.green });
    o += card(200, 20, 350, 316) + P.svg + (s.d ? ZS.fade(T(370, 316, bad ? '✗ tụt huyết áp đột ngột' : '✓ huyết động ổn', { s: 14, c: bad ? C.redD : C.green }), ZS.fresh(s, x => x.d === s.d)) : T(370, 160, '👆 chọn cách tiêm', { s: 14, c: C.soft }));
    return o;
  },
  say: s => seen(s, 'ivn') && (seen(s, 'ivc') || seen(s, 'im')) ? ['worry', 'Dự phòng: **oxytocin 10 IU** tiêm bắp hoặc **IV chậm 1–2 phút** (pha loãng). **Tránh bolus nhanh** — bất lợi huyết động.'] : ['happy', 'Cùng 10 IU, ba cách tiêm. Thử **cả cách nhanh** và một cách chậm 👆']
});
ZS.BK.tfKit('bo-bay', [['Dự phòng = cùng liều, tốc độ như tăng co chuyển dạ', false, 'Liều dự phòng khác liều tăng co chuyển dạ; không dùng chung phác đồ.'], ['Đổi số ống khi hàm lượng mỗi ống khác', false, 'Không quy theo số ống: luôn đọc hàm lượng trên nhãn rồi mới tính liều.'], ['IU (oxytocin) khác µg (carbetocin)', true, 'Oxytocin tính bằng IU, carbetocin bằng µg: nhầm đơn vị là sai liều.'], ['WHO 2025: bỏ ergometrine dự phòng thường quy', true, 'WHO 2025 không còn khuyến cáo ergometrine dự phòng thường quy.']], 'Liều dự phòng **không phải** phác đồ tăng co. Đọc **đúng hàm lượng**, không nhầm **IU với µg**. WHO 2025 không còn ergometrine dự phòng thường quy.');
B['oxytocin-du-phong'] = [
  { t: 'Oxytocin làm cơ co thế nào', kit: 'bo-cell' },
  { t: '10 IU: tiêm sao cho an toàn', kit: 'bo-lieu', cr: 'Bơm tiêm: ' + SV },
  { t: 'Bốn bẫy liều thuốc', kit: 'bo-bay' }
];

// ═════════ Bảo quản thuốc co hồi
const vial = (x, y, col, pot) => `<rect x="${x}" y="${y}" width="40" height="70" rx="8" fill="#fff" stroke="${C.soft}" stroke-width="1.6"/><rect x="${x + 6}" y="${y - 10}" width="28" height="12" rx="3" fill="${C.soft}"/><rect x="${x + 3}" y="${y + 70 - 50 * pot}" width="34" height="${50 * pot}" rx="6" fill="${col}" opacity="${.35 + .6 * pot}"/>`;
kit('bq-lanh', {
  init: () => ({ tdo: 4 }), ui: () => [{ t: 'range', k: 'tdo', label: '🌡 Nơi cất thuốc', min: 4, max: 40, step: 4, unit: '°C' }], goal: s => s.tdo >= 32,
  draw: s => {
    const pot = s.tdo <= 8 ? 1 : Math.max(.25, 1 - (s.tdo - 8) / 40), hot = s.tdo > 8;
    let o = card(20, 20, 300, 316, hot ? '#fff1e6' : '#eef7ff') + T(170, 50, hot ? '☀️ phòng nóng' : '❄️ tủ lạnh 2–8°C', { s: 16, c: hot ? '#c0561a' : '#2b6cb0' });
    o += [0, 1, 2].map(i => vial(90 + i * 60, 120, C.cap, pot)).join('') + T(170, 236, 'oxytocin', { s: 13, c: C.mute });
    o += `<rect x="60" y="260" width="220" height="16" rx="8" fill="#eee"/><rect x="60" y="260" width="${220 * (s.tdo - 4) / 36}" height="16" rx="8" fill="${hot ? '#ff8a4c' : '#7cc7f2'}"/>` + T(170, 304, s.tdo + '°C', { s: 18 });
    o += card(332, 20, 218, 316) + T(441, 56, 'Hoạt tính còn lại', { s: 13, c: C.mute }) + ZS.bar(360, 74, 162, pot * 100, pot < .7 ? C.red : C.green, '', { h: 18 }) + T(441, 124, pot > .95 ? 'còn tốt' : pot > .6 ? 'giảm dần' : 'giảm nhiều', { s: 20, c: pot < .7 ? C.redD : C.green }) + T(441, 144, 'minh họa xu hướng', { s: 10.5, c: C.mute });
    o += T(441, 180, 'tên thuốc vẫn đúng', { s: 13 }) + T(441, 202, 'nhưng hiệu quả giảm', { s: 13, c: hot ? C.redD : C.mute }) + T(441, 262, 'kiểm hạn, nhãn,', { s: 12.5, c: C.mute }) + T(441, 282, 'hàm lượng, cách bảo quản', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => s.tdo >= 32 ? ['ouch', 'Thuốc **đúng tên** nhưng bảo quản sai → **mất hoạt tính**, dự phòng thất bại. Chất lượng & chuỗi lạnh là **một phần của kế hoạch**.'] : ['happy', 'Oxytocin cần cất lạnh. Kéo thanh **🌡 Nơi cất thuốc** lên nóng dần 👆']
});
kit('bq-chon', {
  init: () => ({ lanh: true, cn: true, seen: 'oxy,' }),
  ui: () => [{ t: 'tog', k: 'lanh', label: '❄️ Oxytocin bảo đảm chuỗi lạnh 2–8°C' }, { t: 'tog', k: 'cn', label: '🔥 Có carbetocin CHỊU NHIỆT' }],
  after: s => markSeen(s, s.lanh ? 'oxy' : s.cn ? 'car' : 'mis'),
  goal: s => ['oxy', 'car', 'mis'].every(k => seen(s, k)),
  draw: s => {
    const pick = s.lanh ? 'oxy' : s.cn ? 'car' : 'mis';
    let o = card(20, 20, 335, 316, '#fffdfa');
    if (pick === 'oxy') {
      o += `<rect x="36" y="34" width="302" height="236" rx="16" fill="#f0f7ff" stroke="${C.skyD}" stroke-width="1.6"/>`;
      o += T(187, 58, '❄️ TỦ LẠNH Y TẾ BẢO ĐẢM 2–8°C', { s: 13, c: '#2b6cb0' });
      o += [0, 1, 2].map(i => vial(110 + i * 50, 84, C.cap, 1)).join('') + T(187, 168, 'Oxytocin 10 IU nguyên vẹn', { s: 12.5, c: C.mute });
      o += `<g transform="translate(130 185)">${pic('sv-bom-tiem.png', 0, 0, 115, 38)}</g>`;
      o += Th(187, 240, 'Oxytocin 10 IU IM / IV chậm', { s: 15, c: C.green });
      o += `<rect x="60" y="278" width="255" height="30" rx="10" fill="#e8f8f0" stroke="${C.green}"/>` + T(187, 298, '✓ LỰA CHỌN SỐ 1 KHI CÓ CHUỖI LẠNH', { s: 12, c: C.green });
    } else if (pick === 'car') {
      o += `<rect x="36" y="34" width="302" height="236" rx="16" fill="#fff5ec" stroke="#e07a38" stroke-width="1.6"/>`;
      o += T(187, 58, '☀️ NHIỆT ĐỘ PHÒNG NÓNG (30–35°C)', { s: 13, c: '#c0561a' });
      o += `<rect x="75" y="80" width="80" height="74" rx="10" fill="#ffe2d4" stroke="#e07a38" stroke-width="1.2"/>` + T(115, 108, '🌡️ >30°C', { s: 14, c: C.redD }) + T(115, 134, 'oxy hỏng!', { s: 11, c: C.redD });
      o += `<rect x="175" y="80" width="145" height="74" rx="10" fill="#eafaf1" stroke="${C.green}" stroke-width="1.4"/>` + T(247, 106, '🛡️ Chịu nhiệt', { s: 14, c: C.green }) + T(247, 132, 'Carbetocin 100 µg', { s: 12, c: C.green });
      o += `<g transform="translate(130 170)">${pic('sv-bom-tiem.png', 0, 0, 115, 38)}</g>`;
      o += Th(187, 235, 'Carbetocin 100 µg IM / IV', { s: 15, c: C.green });
      o += `<rect x="46" y="278" width="282" height="30" rx="10" fill="#e8f8f0" stroke="${C.green}"/>` + T(187, 298, '✓ LỰA CHỌN THAY THẾ SỐ 1 KHI MẤT LẠNH', { s: 11.5, c: C.green });
    } else {
      o += `<rect x="36" y="34" width="302" height="236" rx="16" fill="#fffbe6" stroke="#d4a318" stroke-width="1.6"/>`;
      o += T(187, 58, '🎒 TRẠM Y TẾ XA · KHÔNG THUỐC TIÊM', { s: 12.5, c: '#b8860b' });
      o += `<rect x="90" y="82" width="195" height="76" rx="12" fill="#fff" stroke="#d4a318"/>` + T(187, 106, 'Vỉ Misoprostol', { s: 13, c: '#b8860b' });
      o += [0, 1, 2].map(i => `<circle cx="${147 + i * 40}" cy="136" r="12" fill="#fff" stroke="#d4a318" stroke-width="1.6"/><circle cx="${147 + i * 40}" cy="136" r="8" fill="#ffe380"/>` + T(147 + i * 40, 140, '200', { s: 9, c: '#805d00' })).join('');
      o += Th(187, 200, '3 viên = 400–600 µg', { s: 16, c: '#b8860b' }) + T(187, 226, 'đường uống hoặc ngậm', { s: 12.5, c: C.ink });
      o += `<rect x="46" y="278" width="282" height="30" rx="10" fill="#fff9db" stroke="#d4a318"/>` + T(187, 298, '✓ LỰA CHỌN KHI KHÔNG CÓ THUỐC TIÊM', { s: 11.5, c: '#805d00' });
    }
    o += card(365, 20, 175, 316);
    o += T(452, 44, 'Bậc chọn thuốc', { s: 14 });
    const STEPS = [
      ['oxy', '1. Oxytocin', '10 IU IM/IV', C.mint, s.lanh],
      ['car', '2. Carbetocin', 'chịu nhiệt 100 µg', C.mint, !s.lanh && s.cn],
      ['mis', '3. Misoprostol', '400–600 µg uống', C.butter, !s.lanh && !s.cn]
    ];
    o += STEPS.map(([k, t, d, c, act], i) => {
      const y = 62 + i * 72;
      return `<rect x="375" y="${y}" width="155" height="60" rx="12" fill="${act ? c : '#fff'}" stroke="${act ? C.soft : C.grid}" stroke-width="${act ? 1.8 : 1}"/>${T(452, y + 24, t, { s: 13, c: act ? C.ink : C.mute })}${T(452, y + 46, d, { s: 11.5, c: act ? (c === C.butter ? '#805d00' : C.green) : C.mute })}`;
    }).join('');
    o += T(452, 296, 'chọn MỘT thuốc duy nhất', { s: 11.5, c: C.mute });
    return o;
  },
  say: s => ['oxy', 'car', 'mis'].every(k => seen(s, k)) ? ['happy', 'WHO 2025: **oxytocin** khi bảo đảm chất lượng; không có chuỗi lạnh → **carbetocin chịu nhiệt**; không có → **misoprostol**. Chọn **một** thuốc.'] : ['happy', 'Tắt bật hai công tắc — khám phá **cả 3 hoàn cảnh** chọn thuốc 👆']
});
ZS.BK.tfKit('bq-bay', [['Mọi carbetocin đều chịu nhiệt', false, 'Chỉ dạng carbetocin chịu nhiệt chuyên biệt mới chịu nhiệt.'], ['Carbetocin tác dụng dài → lặp lại cho mọi BHSS', false, 'Tác dụng dài không có nghĩa lặp lại tùy tiện; làm theo chỉ định.'], ['Thuốc co hồi sửa được rách hay sót nhau', false, 'Thuốc co hồi chỉ trị Tone; rách (Trauma) cần khâu, sót nhau (Tissue) cần lấy.'], ['Liều misoprostol dự phòng khác liều điều trị', true, 'Dự phòng và điều trị có liều khác nhau: đừng trộn.'], ['Kiểm hạn, nhãn, hàm lượng mỗi ống', true, 'Thuốc hết hạn hay nhầm hàm lượng gây hỏng hoặc quá liều.'], ['Đã dùng misoprostol thì không tự thêm nhiều đường', true, 'Đừng tự cộng dồn nhiều đường dùng hay liều ngoài phác đồ.']], 'Không phải carbetocin nào cũng chịu nhiệt; tác dụng dài **không sửa** Trauma/Tissue. Đừng trộn **liều dự phòng, liều điều trị** và hàm lượng.');
B['bao-quan-thuoc-go'] = [
  { t: 'Đúng tên vẫn hỏng vì nóng', kit: 'bq-lanh' },
  { t: 'Chọn một thuốc theo hoàn cảnh', kit: 'bq-chon' },
  { t: 'Sáu bẫy về thuốc co hồi', kit: 'bq-bay' }
];

// ═════════ Kẹp rốn muộn
const cordScene = (min, cut, ngat) => { const f = Math.min(1, min / 3);
  const CD = 'M144 180 C190 150 232 232 312 201';
  let s = `<ellipse cx="90" cy="180" rx="56" ry="22" fill="url(#gPlac)" stroke="${C.placD}"/>` + T(90, 220, 'bánh nhau', { s: 12.5, c: C.mute });
  s += ZS.BK.tintPic('sv-be.png', 262, 70, 120, 256, ngat ? .9 : 0, 'tim');
  s += `<path d="${CD}" fill="none" stroke="#c9c3f0" stroke-width="12" stroke-linecap="round"/><path d="${CD}" fill="none" stroke="#9b8fe0" stroke-width="3"/><circle cx="312" cy="201" r="5" fill="#9b8fe0" stroke="#fff" stroke-width="1.4"/>`;
  if (!cut) s += flow(CD, Math.round(2 + 5 * (1 - f)), '#e5484d', 1.6, 3.2);
  else s += `<rect x="209" y="176" width="10" height="28" rx="3" fill="${C.ink}" transform="rotate(26 214 190)"/>`;
  s += Th(312, 232, 'rốn', { s: 11.5, c: C.mute });
  return s; };
kit('bk-muon', {
  init: () => ({ m: 0, cut: false }), ui: () => [{ t: 'range', k: 'm', label: '⏱ Chờ trước khi kẹp', min: 0, max: 3, step: .5, unit: ' phút' }, { t: 'tog', k: 'cut', label: '✂️ Kẹp rốn' }], goal: s => s.cut && s.m >= 1,
  draw: s => {
    let o = card(20, 20, 380, 316, '#fffdfa') + cordScene(s.m, s.cut, false) + Th(200, 48, `${s.m} phút`, { s: 18 });
    const vol = Math.round(30 + 50 * Math.min(1, s.m / 3));
    o += card(412, 20, 138, 316) + T(481, 52, 'máu nhau → bé', { s: 12.5, c: C.mute }) + `<rect x="456" y="70" width="50" height="160" rx="12" fill="#fff" stroke="${C.soft}"/><rect x="458" y="${228 - 156 * vol / 80}" width="46" height="${156 * vol / 80}" rx="10" fill="${C.red}" opacity=".8"/>` + T(481, 256, vol >= 60 ? 'nhiều hơn' : 'ít', { s: 14, c: vol >= 60 ? C.green : C.mute });
    if (s.cut) o += ZS.fade(T(481, 296, s.m < 1 ? '✗ kẹp quá sớm' : '✓ 1–3 phút', { s: 14, c: s.m < 1 ? C.redD : C.green }), ZS.fresh(s, x => x.cut));
    return o;
  },
  say: s => s.cut && s.m >= 1 ? ['wow', 'WHO 2025: kẹp rốn **muộn 1–3 phút**, không trước 1 phút — vẫn dùng thuốc co hồi cho mẹ và **theo dõi mẹ, bé** trong lúc chờ.'] : s.cut ? ['worry', 'Kẹp **dưới 1 phút** là sớm (trừ trẻ cần hồi sức ngay). Bỏ kẹp, chờ thêm rồi kẹp lại 👆'] : ['happy', 'Bé vừa ra, máu từ nhau còn chảy sang bé. Kéo **⏱ Chờ**, rồi bấm **✂️ Kẹp rốn** 👆']
});
kit('bk-ngat', {
  init: () => ({ ngat: false }), ui: () => [{ t: 'tog', k: 'ngat', label: '😶 Bé ngạt, cần hồi sức' }], goal: s => s.ngat,
  draw: s => {
    let o = card(20, 20, 380, 316, '#fffdfa') + cordScene(s.ngat ? 0 : 1.5, s.ngat, s.ngat);
    o += card(412, 20, 138, 316) + (s.ngat ? ZS.fade(T(481, 80, '✂️', { s: 30 }) + T(481, 120, 'kẹp & chuyển', { s: 14, c: C.redD }) + T(481, 140, 'NGAY', { s: 16, c: C.redD }) + T(481, 186, 'để hồi sức', { s: 13 }) + T(481, 230, '🫁', { s: 30 }), ZS.fresh(s, x => x.ngat)) : T(481, 110, 'bé hồng,', { s: 14, c: C.green }) + T(481, 130, 'khóc tốt', { s: 14, c: C.green }) + T(481, 176, '→ kẹp muộn', { s: 14 }));
    return o;
  },
  say: s => s.ngat ? ['worry', 'Trẻ **ngạt cần hồi sức** → kẹp và chuyển **ngay**. Kẹp muộn **không cấm** hồi sức trẻ hay can thiệp khi mẹ nguy kịch.'] : ['happy', 'Nếu bé không khóc, tím, mềm thì sao? Bật **😶 Bé ngạt** 👆']
});
kit('bk-khac', {
  init: () => ({ sel: 'kep', seen: 'kep,' }), ui: () => [],
  after: (s, k) => { if (k === 'sel') markSeen(s, s.sel); },
  goal: s => seen(s, 'kep') && seen(s, 'keo'),
  draw: s => {
    const isKep = s.sel !== 'keo';
    let o = `<g class="tap" data-set="sel=kep">${card(20, 20, 255, 316, isKep ? C.lav : '#fff', isKep ? C.soft : seen(s, 'kep') ? C.mintD : C.grid, isKep ? 2 : 1)}`;
    o += T(147, 46, '✂️ KẸP RỐN MUỘN', { s: 15, c: isKep ? C.ink : C.mute });
    o += `<g transform="translate(18 20) scale(.6)">${cordScene(2, isKep, false)}</g>`;
    o += `<rect x="36" y="210" width="223" height="110" rx="12" fill="${isKep ? '#fff' : '#f8f6fc'}"/>`;
    o += T(147, 230, 'Đối tượng: BÉ SƠ SINH', { s: 12.5, c: C.cap });
    o += T(147, 252, 'Chờ 1–3 phút sau sinh', { s: 12, c: C.ink });
    o += ZS.wrap('Máu bánh nhau truyền thêm 80–100 mL sang bé → ngừa thiếu máu sơ sinh', 26).map((l, j) => T(147, 274 + j * 16, l, { s: 11, c: C.mute })).join('');
    o += `</g>`;

    o += `<g class="tap" data-set="sel=keo">${card(285, 20, 255, 316, !isKep ? C.lav : '#fff', !isKep ? C.soft : seen(s, 'keo') ? C.mintD : C.grid, !isKep ? 2 : 1)}`;
    o += T(412, 46, '🤲 KÉO DÂY RỐN CÓ ĐỐI LỰC', { s: 14, c: !isKep ? C.ink : C.mute });
    o += `<g transform="translate(290 40) scale(.52)">${ZS.uterusSag({ x: 180, y: 45, k: .65 })}<ellipse cx="180" cy="180" rx="40" ry="18" fill="url(#gPlac)" stroke="${C.placD}"/><path d="M180 195 C190 230 220 260 240 285" fill="none" stroke="#9b8fe0" stroke-width="6"/>${arrow('M220 250 L250 290', C.redD, 4.5)}<g transform="translate(195 145) scale(.7)">${pic('sv-ban-tay.png', -20, -30, 48, 80, 'transform="rotate(-50 4 10)"')}</g>${arrow('M195 140 L165 95', C.green, 4.5)}</g>`;
    o += `<rect x="301" y="210" width="223" height="110" rx="12" fill="${!isKep ? '#fff' : '#f8f6fc'}"/>`;
    o += T(412, 230, 'Đối tượng: SẢN PHỤ', { s: 12.5, c: C.redD });
    o += T(412, 252, 'Bé đã cắt rốn ra ngoài', { s: 12, c: C.ink });
    o += ZS.wrap('Kéo nhẹ dây rốn + tay đối lực trên bờ mu giúp sổ nhau và phòng lộn tử cung', 26).map((l, j) => T(412, 274 + j * 16, l, { s: 11, c: C.mute })).join('');
    o += `</g>`;
    return o;
  },
  say: s => seen(s, 'kep') && seen(s, 'keo') ? ['happy', '**Kẹp rốn** cắt liên thông bé–nhau; **kéo dây rốn có kiểm soát** giúp sổ nhau. Hai thao tác khác nhau, đừng nhầm.'] : ['happy', 'Hai việc cùng làm trên dây rốn. Chạm **cả hai thẻ** để phân biệt 👆']
});
B['kep-ron-muon'] = [
  { t: 'Kẹp rốn muộn 1–3 phút', kit: 'bk-muon', cr: 'Em bé: ' + SV },
  { t: 'Bé ngạt: kẹp và hồi sức ngay', kit: 'bk-ngat', cr: 'Em bé: ' + SV },
  { t: 'Kẹp rốn khác kéo dây rốn', kit: 'bk-khac', cr: 'Em bé: ' + SV }
];

// ═════════ Kéo dây rốn có kiểm soát
kit('bc-keo', {
  init: () => ({ dl: false, luc: 0 }), ui: () => [{ t: 'tog', k: 'dl', label: '✋ Tay đối lực trên vệ' }, { t: 'range', k: 'luc', label: '🤲 Lực kéo dây rốn', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.dl && s.luc >= 30 && s.luc <= 60,
  draw: s => {
    const inv = !s.dl && s.luc >= 60, ok = s.dl && s.luc >= 30 && s.luc <= 60, tooHard = s.dl && s.luc > 60;
    let o = card(20, 20, 340, 316, '#fffdfa');
    o += `<g transform="translate(0 ${inv ? 32 : 0})">${ZS.uterusSag({ x: 170, y: 40, k: .6 })}`;
    if (inv) {
      o += `<path d="M120 46 Q170 106 220 46" fill="#fff" stroke="${C.redD}" stroke-width="3"/>`;
      o += `<path d="M128 48 Q170 98 212 48" fill="url(#gMyo)" stroke="${C.redD}" stroke-width="2"/>`;
      o += arrow('M170 42 V88', C.redD, 4);
    }
    o += `</g>`;
    const py = ok ? 258 : inv ? 215 : 160;
    o += `<ellipse cx="170" cy="${py}" rx="32" ry="16" fill="url(#gPlac)" stroke="${C.placD}">${ZS.tw('cy', s._p ? (s._p.dl && s._p.luc >= 30 && s._p.luc <= 60 ? 258 : !s._p.dl && s._p.luc >= 60 ? 215 : 160) : null, py, .7)}</ellipse>`;
    o += `<path d="M170 ${py + 12} C170 268 200 295 ${200 + s.luc * .9} 314" fill="none" stroke="${inv ? C.red : '#9b8fe0'}" stroke-width="${inv ? 6 : 5}"/>`;
    if (s.luc) o += arrow(`M${210 + s.luc * .9} 316 l26 6`, s.luc > 60 ? C.red : C.green, 4);
    if (s.dl) {
      o += `<g class="fadein">${pic('sv-ban-tay.png', 198, 166, 48, 82, 'transform="rotate(-52 222 207)"')}${arrow('M214 166 l-16 -24', C.green, 4.5)}</g>` + Th(280, 264, 'tay đối lực đẩy đáy lên', { s: 12, c: C.green });
    }
    if (inv) {
      o += ZS.fade(Th(170, 70, '⚠ LỘN TỬ CUNG CẤP TÍNH!', { s: 13, c: C.redD }), true);
      o += drops(170, 290, 3, .8, 12);
    }
    o += card(372, 20, 178, 316) + (ok ? verdict(388, 115, 146, true, 'nhau xuống an toàn', 'lực vừa phải + đối lực vững') : inv ? verdict(388, 115, 146, false, 'LỘN TỬ CUNG', 'không đối lực, kéo mạnh đáy tụt theo') : tooHard ? verdict(388, 115, 146, false, 'lực quá mạnh!', 'dừng lại, đánh giá dấu bong nhau') : T(461, 145, 'bật đối lực xương vệ,', { s: 12.5, c: C.soft }) + T(461, 168, 'kéo vừa phải (30-60%)', { s: 12.5, c: C.soft }));
    return o;
  },
  say: s => s.dl && s.luc >= 30 && s.luc <= 60 ? ['wow', 'Kéo **nhẹ** khi tử cung co + **tay đối lực** trên vệ → nhau xuống. Không xuống thì **dừng, đánh giá lại** — không tăng lực.'] : !s.dl && s.luc >= 60 ? ['ouch', 'Kéo mạnh **không đối lực** → đáy tử cung bị kéo theo: **lộn tử cung**, xuất huyết ồ ạt!'] : ['happy', 'Thử kéo **mạnh không đối lực** trước, rồi bật **✋ Đối lực** và kéo **vừa phải** 👆']
});
kit('bc-nhau', {
  init: () => ({ tim: false }), ui: () => [], goal: s => s.tim,
  draw: s => {
    const lobes = [[0, 0], [-46, -24], [44, -26], [-58, 26], [54, 24], [-14, 50], [26, -54], [-24, -56], [12, 6]];
    let o = card(20, 20, 340, 316, '#fffdfa') + T(190, 46, 'Mặt mẹ của bánh nhau', { s: 14, c: C.mute }) + `<g transform="translate(190 186)"><circle r="110" fill="#c94a5a" stroke="${C.placD}" stroke-width="3"/>`;
    o += lobes.map(([x, y], i) => i === 5 ? `<path d="M${x - 26} ${y - 14} q26 -14 52 0 q6 24 -14 36 q-20 8 -38 -6Z" fill="#fff6f4" stroke="${C.placD}" stroke-dasharray="4 3"/>` : `<path d="M${x - 24} ${y - 10} q24 -18 48 0 q6 22 -16 32 q-18 6 -34 -6Z" fill="#b23a4c" stroke="#8e2638" stroke-width="1.4"/>`).join('') + `</g>`;
    o += s.tim ? ZS.fade(`<circle cx="176" cy="236" r="34" fill="none" stroke="${C.red}" stroke-width="3" class="pulse"/>` + call(176, 236, 290, 320, 'thiếu một múi!', C.redD, 'middle'), ZS.fresh(s, x => x.tim)) : `<g class="tap" data-set="tim=true"><circle cx="176" cy="236" r="30" fill="#fff" fill-opacity=".01" stroke="${C.soft}" stroke-width="2.2" stroke-dasharray="6 5" class="pulse"/></g>`;
    o += card(372, 20, 178, 316) + T(461, 56, 'Kiểm tra:', { s: 14 }) + ['mặt mẹ: đủ múi?', 'màng: đủ, không rách?', 'dây rốn: số mạch'].map((t, i) => T(388, 96 + i * 32, '☐ ' + t, { a: 'start', s: 12.5 })).join('') + (s.tim ? ZS.fade(verdict(388, 210, 146, false, 'sót nhau', '→ nguy cơ BHSS'), true) : '');
    return o;
  },
  say: s => s.tim ? ['worry', 'Thiếu múi = **sót mô nhau** trong tử cung → cản co hồi → **băng huyết** (Tissue). Luôn kiểm **mặt mẹ, màng, dây rốn**.'] : ['happy', 'Nhau vừa sổ. Có **chỗ nào bất thường** không? Chạm vào chỗ đó 👆']
});
kit('bc-pas', {
  init: () => ({ keo: false }), ui: () => [{ t: 'tog', k: 'keo', label: '✊ Cố bóc / kéo nhau' }], goal: s => s.keo,
  draw: s => {
    let o = card(20, 20, 340, 316, '#fffdfa') + `<rect x="40" y="170" width="300" height="140" rx="10" fill="url(#gMyo)"/>` + Th(320, 300, 'cơ tử cung', { a: 'end', s: 12.5, c: C.myoD });
    o += `<path d="M60 170 Q200 ${s.keo ? 100 : 130} 320 170 Z" fill="url(#gPlac)" stroke="${C.placD}" transform="translate(0 ${s.keo ? -30 : 0})"/>` + [110, 170, 230, 280].map(x => `<path d="M${x} 170 q-6 40 6 ${90}" fill="none" stroke="${C.placD}" stroke-width="7" opacity=".85"/>`).join('') + Th(190, 120 - (s.keo ? 30 : 0), 'gai nhau ăn sâu vào cơ', { s: 13, c: C.placD });
    if (s.keo) o += ZS.fade(`<path d="M80 168 Q190 196 300 168" fill="${C.red}" opacity=".8"/>` + drops(190, 150, 5, .9, 26), true);
    o += card(372, 20, 178, 316) + (s.keo ? verdict(388, 110, 146, false, 'mở diện chảy', 'máu rất lớn') + T(461, 230, '→ dừng, gọi', { s: 13 }) + T(461, 250, 'đội phẫu thuật', { s: 13 }) : T(461, 120, 'Nghi PAS?', { s: 16 }) + T(461, 150, '(nhau cài răng lược)', { s: 12, c: C.mute }) + T(461, 200, '👆 thử bật nút', { s: 13, c: C.soft }));
    return o;
  },
  say: s => s.keo ? ['ouch', 'Nhau **bám sâu vào cơ** (PAS) mà cố bóc, kéo → **mở diện chảy máu rất lớn**. Nghi PAS: không cố kéo, xử trí theo kế hoạch.'] : ['happy', 'Nếu nhau **không chịu bong** vì bám sâu thì sao? Bật **✊ Cố bóc / kéo nhau** 👆']
});
B['keo-day-ron'] = [
  { t: 'Kéo nhẹ, có tay đối lực', kit: 'bc-keo', cr: 'Bàn tay: ' + SV },
  { t: 'Kiểm tra bánh nhau', kit: 'bc-nhau' },
  { t: 'Nghi nhau cài răng lược: đừng cố kéo', kit: 'bc-pas' }
];

// ═════════ Đo máu mất
kit('bm-doan', {
  init: () => ({ g: 200, can: false }), ui: s => [...(s.can ? [] : [{ t: 'range', k: 'g', label: '👀 Bạn đoán', min: 100, max: 1500, step: 50, unit: ' mL' }]), { t: 'tog', k: 'can', label: '⚖️ Cân thật' }], goal: s => s.can,
  draw: s => {
    let o = card(20, 20, 330, 316, '#fffdfa') + T(185, 46, 'Tấm lót + gạc sau sinh', { s: 14, c: C.mute });
    o += `<rect x="50" y="70" width="228" height="160" rx="10" fill="#f7f1ea" stroke="#e2d6c6"/>` + [[120, 120, 60, 34], [210, 150, 74, 42], [150, 190, 46, 26], [250, 100, 30, 18]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#b81e34" opacity=".75"/>`).join('') + `<rect x="80" y="244" width="70" height="44" rx="6" fill="#d23c50" opacity=".8"/><rect x="170" y="250" width="70" height="40" rx="6" fill="#d23c50" opacity=".7"/>` + T(195, 316, 'gạc thấm máu', { s: 12, c: C.mute });
    const cL = v => 250 - v / 1500 * 180;
    o += `<rect x="314" y="70" width="28" height="180" rx="10" fill="#fff" stroke="${C.soft}"/>` + [0, 500, 1000, 1500].map(v => `<path d="M314 ${cL(v)} h8" stroke="${C.soft}"/>` + T(311, cL(v) + 4, v, { a: 'end', s: 9.5, c: C.mute })).join('') + (s.can ? `<rect x="316" y="${cL(1150)}" width="24" height="${248 - cL(1150)}" rx="8" fill="${C.red}" opacity=".85"><animate attributeName="y" from="248" to="${cL(1150)}" dur=".8s" fill="freeze"/><animate attributeName="height" from="2" to="${248 - cL(1150)}" dur=".8s" fill="freeze"/></rect>` + Th(328, cL(1150) - 6, 'thật', { s: 11, c: C.redD }) : '') + `<path d="M310 ${cL(s.g)} h36" stroke="${C.amber}" stroke-width="3" stroke-linecap="round"/>` + Th(328, cL(s.g) + 16, 'đoán', { s: 11, c: '#b8860b' });
    o += card(362, 20, 188, 316) + T(456, 60, 'Bạn đoán', { s: 13, c: C.mute }) + T(456, 96, s.g + ' mL', { s: 26 });
    if (s.can) { const real = 1150; o += ZS.fade(pic('sv-can.png', 386, 120, 140, 57) + T(456, 214, 'Cân thật', { s: 13, c: C.mute }) + T(456, 250, real + ' mL', { s: 28, c: C.redD }) + T(456, 286, s.g < real * .8 ? 'mắt đoán THIẾU' : 'đoán khá sát', { s: 14, c: s.g < real * .8 ? C.redD : C.green }), ZS.fresh(s, x => x.can)); }
    return o;
  },
  say: s => s.can ? ['worry', 'Mắt thường **đoán thiếu** lượng máu mất — càng nhiều càng thiếu. **Đo khách quan**: túi có vạch, cân gạc.'] : ['happy', 'Nhìn tấm lót và gạc: **bạn đoán** mất bao nhiêu mL? Kéo thanh, rồi bấm **⚖️ Cân thật** 👆']
});
kit('bm-can', {
  init: () => ({ n: 0, tru: false }), ui: () => [{ t: 'tog', k: 'tru', label: '➖ Trừ trọng lượng gạc khô' }], goal: s => s.n >= 3 && s.tru,
  draw: s => {
    const wet = [0, 140, 310, 470, 620][s.n], dry = s.n * 20, ml = s.tru ? wet - dry : wet;
    let o = card(20, 20, 330, 316, '#fffdfa') + pic('sv-can.png', 50, 150, 270, 110) + ZS.BK.scrub('n', s.n, 0, 4, 1, ' gạc', 185, 56);
    o += [...Array(s.n)].map((_, i) => `<rect x="${90 + (i % 2) * 70}" y="${120 - Math.floor(i / 2) * 18}" width="62" height="22" rx="6" fill="#d23c50" opacity=".85" class="${i === s.n - 1 && ZS.fresh(s, z => z.n >= i + 1) ? 'fadein' : ''}"/>`).join('');
    o += T(185, 290, `${wet} g${s.tru ? ` − ${dry} g gạc khô` : ''}`, { s: 16 });
    o += card(362, 20, 188, 316) + T(456, 60, 'Máu mất ≈', { s: 13, c: C.mute }) + T(456, 104, ml + ' mL', { s: 28, c: C.redD }) + T(456, 138, '1 g ≈ 1 mL máu', { s: 12.5, c: C.mute });
    o += T(456, 196, 'trừ thêm: ối, nước tiểu', { s: 12, c: C.mute }) + T(456, 230, 'máu KHÔNG thu được:', { s: 12.5 }) + T(456, 250, 'buồng tử cung, ổ tụ,', { s: 12, c: C.redD }) + T(456, 268, 'giường, sàn', { s: 12, c: C.redD });
    return o;
  },
  say: s => s.n >= 3 && s.tru ? ['happy', 'Cân gạc, **trừ trọng lượng khô** (1 g ≈ 1 mL). Nhớ **trừ dịch khác** và tìm máu **không thu được**: buồng tử cung, ổ tụ, giường, sàn.'] : ['happy', 'Rê ngang con số **[ 0 ] gạc** để đặt **3–4 gạc** lên cân, rồi bật **➖ Trừ gạc khô** 👆']
});
kit('bm-trig', {
  init: () => ({ ml: 200, hd: false }), ui: () => [{ t: 'range', k: 'ml', label: '🩸 Máu đo được', min: 0, max: 800, step: 50, unit: ' mL' }, { t: 'tog', k: 'hd', label: '💓 Huyết động bất thường' }], goal: s => s.hd && s.ml >= 300 && s.ml < 500,
  draw: s => {
    const tr = s.ml >= 500 || (s.ml >= 300 && s.hd), X = v => 60 + v / 800 * 440;
    let o = card(20, 20, 530, 316, '#fffdfa') + T(285, 50, 'WHO 2025 · trong 24 giờ sau sinh', { s: 14, c: C.mute });
    o += `<path d="M60 150 H500" stroke="${C.grid}" stroke-width="18" stroke-linecap="round"/><path d="M60 150 H${X(s.ml)}" stroke="${C.red}" stroke-width="18" stroke-linecap="round"/>`;
    o += [[300, '300 + huyết động bất thường', C.amber], [500, '500 mL', C.red]].map(([v, t, c]) => `<path d="M${X(v)} 124 V176" stroke="${c}" stroke-width="3"/>` + T(X(v), 116, v, { s: 14, c }) + T(X(v), 196, t, { s: 12, c })).join('') + T(X(s.ml), 92, s.ml + ' mL', { s: 16 });
    o += `<circle cx="285" cy="262" r="40" fill="${tr ? C.red : '#e8e4f2'}" ${tr ? 'class="pulse"' : ''}/>` + T(285, 268, tr ? '🚨' : '…', { s: 24 }) + T(285, 326, tr ? 'KHỞI TRỊ BHSS NGAY' : 'theo dõi tiếp', { s: 16, c: tr ? C.redD : C.mute });
    return o;
  },
  say: s => s.hd && s.ml >= 300 && s.ml < 500 ? ['wow', 'Trigger WHO 2025: máu đo **≥ 300 mL + huyết động bất thường** hoặc **≥ 500 mL** → khởi trị ngay. Mẹ bất ổn thì xử trí ngay, không chờ đủ mốc.'] : ['happy', 'Để máu đo ở **350 mL**, rồi bật **💓 Huyết động bất thường** 👆']
});
B['theo-doi-mau-mat'] = [
  { t: 'Mắt thường đoán thiếu', kit: 'bm-doan', cr: 'Cân: ' + SV },
  { t: 'Cân gạc để đo', kit: 'bm-can', cr: 'Cân: ' + SV },
  { t: 'Trigger khởi trị sớm', kit: 'bm-trig' }
];
})();
