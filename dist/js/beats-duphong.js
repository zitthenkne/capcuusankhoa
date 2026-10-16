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
const RF = [['bh', 'Từng BHSS'], ['mo', 'Mổ / can thiệp tử cung'], ['dm', 'Rối loạn đông máu'], ['ntd', 'Nhau tiền đạo / PAS'], ['tm', 'Thiếu máu'], ['cd', 'Chuyển dạ kéo dài / quá nhanh'], ['tc', 'Tăng co kéo dài'], ['nt', 'Nhiễm trùng ối'], ['sg', 'Sinh giúp dụng cụ']];
kit('bd-phieu', {
  init: () => Object.fromEntries(RF.map(([k]) => [k, false])), ui: () => [], goal: s => RF.filter(([k]) => s[k]).length >= 3,
  draw: s => {
    const n = RF.filter(([k]) => s[k]).length;
    let o = `<rect x="20" y="20" width="350" height="316" rx="14" fill="#fffdf4" stroke="${C.butterD}"/>` + T(195, 44, '📋 Phiếu nguy cơ', { s: 15 });
    o += RF.map(([k, t], i) => { const y = 58 + i * 30, on = s[k]; return `<g class="tap" data-set="!${k}"><rect x="34" y="${y}" width="322" height="26" rx="8" fill="${on ? '#ffe0e6' : '#fff'}" stroke="${on ? C.pinkD : C.grid}"/><rect x="42" y="${y + 6}" width="14" height="14" rx="4" fill="${on ? C.red : '#fff'}" stroke="${C.soft}"/>${on ? T(49, y + 18, '✓', { s: 11, c: '#fff' }) : ''}${T(66, y + 18, t, { a: 'start', s: 13 })}</g>`; }).join('');
    const lv = n >= 3 ? 2 : n ? 1 : 0;
    o += card(382, 20, 168, 316, ['#fff', '#fff3c4', '#ffe0e6'][lv], C.grid) + T(466, 52, n + ' yếu tố', { s: 18 });
    o += [['💉', '2 đường truyền'], ['🩸', 'nhóm máu, xét nghiệm'], ['📣', 'báo đội & ngân hàng máu'], ['🏥', 'sinh nơi đủ điều kiện']].map(([ic, t], i) => `<g opacity="${lv === 2 || (lv === 1 && i < 2) ? 1 : .25}">${T(398, 96 + i * 52, ic, { a: 'start', s: 18 })}${ZS.wrap(t, 13).map((l, j) => T(426, 92 + i * 52 + j * 16, l, { a: 'start', s: 12.5 })).join('')}</g>`).join('');
    return o;
  },
  say: s => RF.filter(([k]) => s[k]).length >= 3 ? ['happy', 'Có nguy cơ → **chuẩn bị theo mức**: đường truyền, nhóm máu, xét nghiệm, báo đội & ngân hàng máu, sinh nơi đủ điều kiện.'] : ['happy', 'Hỏi bệnh để **tìm nguy cơ**. Đánh dấu vài yếu tố trên phiếu 👆']
});
kit('bd-hb', {
  init: () => ({ sat: false, loss: 0 }), ui: () => [{ t: 'tog', k: 'sat', label: '💊 Điều trị thiếu máu khi mang thai' }, { t: 'range', k: 'loss', label: '🩸 Mất máu khi sinh', min: 0, max: 100, step: 10, unit: '%' }], goal: s => s.sat && s.loss >= 60,
  draw: s => {
    const base = s.sat ? .85 : .5, lvl = Math.max(.04, base - .4 * s.loss / 100), Y = l => 290 - 220 * l, danger = .3;
    let o = card(20, 20, 300, 316, '#fffdfa') + T(170, 46, 'Dự trữ hồng cầu', { s: 15 });
    o += `<rect x="110" y="70" width="120" height="220" rx="16" fill="#fff" stroke="${C.soft}" stroke-width="2"/><rect x="112" y="${Y(lvl)}" width="116" height="${290 - Y(lvl) - 2}" rx="14" fill="${lvl < danger ? '#e5484d' : '#c8283c'}">${ZS.tw('y', s._p ? Y(Math.max(.04, (s._p.sat ? .85 : .5) - .4 * s._p.loss / 100)) : null, Y(lvl))}${ZS.tw('height', s._p ? 288 - Y(Math.max(.04, (s._p.sat ? .85 : .5) - .4 * s._p.loss / 100)) : null, 288 - Y(lvl))}</rect>`;
    o += `<path d="M104 ${Y(danger)} H236" stroke="${C.red}" stroke-width="2" stroke-dasharray="6 4"/>` + Th(102, Y(danger) + 4, 'ngưỡng nguy', { a: 'end', s: 12, c: C.redD }) + Th(102, Y(base) + 4, s.sat ? 'Hb tốt lên' : 'Hb thấp sẵn', { a: 'end', s: 12, c: C.mute });
    o += card(332, 20, 218, 316) + T(441, 60, 'Còn bao xa tới ngưỡng?', { s: 13, c: C.mute }) + T(441, 110, lvl < danger ? 'QUA NGƯỠNG' : Math.round((lvl - danger) * 100) + ' phần', { s: lvl < danger ? 20 : 26, c: lvl < danger ? C.redD : C.green });
    o += T(441, 170, s.sat ? '✓ khoảng dự trữ rộng' : '⚠ dự trữ mỏng', { s: 14, c: s.sat ? C.green : '#b5651d' }) + T(441, 300, 'số minh họa', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.sat && s.loss >= 60 ? ['wow', 'Thiếu máu làm mẹ **kém dung nạp** mất máu. Điều trị thiếu máu trong thai kỳ = **thêm khoảng dự trữ** trước khi sinh.'] : ['happy', 'Kéo **🩸 Mất máu**, rồi bật **💊 Điều trị thiếu máu** và kéo lại — so khoảng cách tới ngưỡng 👆']
});
kit('bd-moi', {
  init: () => ({ run: false }), ui: () => [{ t: 'tog', k: 'run', label: '▶ Cho 20 mẹ “không nguy cơ” sinh' }], goal: s => s.run,
  draw: s => {
    let o = card(20, 20, 530, 316, '#fffdfa') + T(285, 46, '20 sản phụ — phiếu nguy cơ đều trống', { s: 14 });
    o += [...Array(20)].map((_, i) => { const x = 46 + (i % 10) * 49, y = 64 + Math.floor(i / 10) * 118, hit = s.run && (i === 6 || i === 13);
      return `<g ${hit ? 'class="fadein"' : ''}>${pic('sv-phu-nu.png', x, y, 28, 100)}${hit ? `<circle cx="${x + 14}" cy="${y + 56}" r="26" fill="none" stroke="${C.red}" stroke-width="3" class="pulse"/>${drops(x + 14, y + 104, 1, .6)}` : ''}</g>`; }).join('');
    o += s.run ? verdict(60, 290, 450, false, 'Vẫn có mẹ băng huyết dù không có yếu tố nào') : T(285, 312, '👆 bấm nút ở trên', { s: 14, c: C.soft });
    return o;
  },
  say: s => s.run ? ['worry', 'BHSS vẫn xảy ra ở người **không có yếu tố báo trước** → **theo dõi MỌI sản phụ** sau sinh, ca nào cũng dùng thuốc co hồi dự phòng.'] : ['happy', 'Phiếu nguy cơ trống thì có cần theo dõi không? Bấm **▶** xem 👆']
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
const AM = [['thuoc', '💉', 'Thuốc co hồi dự phòng', '⭐ quan trọng nhất'], ['keo', '🤲', 'Kéo dây rốn có kiểm soát', 'người được đào tạo, khi phù hợp'], ['kt', '🔍', 'Kiểm tra nhau + tử cung + máu mất', 'đủ múi, đủ màng, co tốt']];
kit('bg3-ba', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => AM.every(([k]) => seen(s, k)),
  draw: s => T(285, 44, 'Xử trí giai đoạn III: chạm từng việc', { s: 15 }) + AM.map(([k, ic, a, b], i) => { const x = 20 + i * 178, sn = seen(s, k);
    return `<g class="tap" data-set="!${k}">${card(x, 60, 170, 270, sn ? (i === 0 ? C.butter : C.mint) : '#fff', sn ? C.soft : C.grid)}${i === 0 ? pic('sv-bom-tiem.png', x + 10, 92, 150, 48) : T(x + 85, 132, ic, { s: 46 })}${ZS.wrap(a, 16).map((l, j) => T(x + 85, 190 + j * 19, l, { s: 14.5 })).join('')}${sn ? `<g class="fadein">${ZS.wrap(b, 18).map((l, j) => T(x + 85, 262 + j * 18, l, { s: 12.5, c: i === 0 ? '#b8860b' : C.mute })).join('')}</g>` : T(x + 85, 280, '👆', { s: 16, c: C.soft })}</g>`; }).join(''),
  say: s => AM.every(([k]) => seen(s, k)) ? ['happy', 'Ba việc: **thuốc co hồi** (quan trọng nhất), **kéo dây rốn có kiểm soát** khi phù hợp, **kiểm tra nhau + tử cung + máu mất**.'] : ['happy', 'Giai đoạn III gồm **3 việc**. Chạm từng thẻ 👆']
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
const OXQ = [['Dự phòng = cùng liều, tốc độ như tăng co chuyển dạ', false], ['Đổi số ống khi hàm lượng mỗi ống khác', false], ['IU (oxytocin) khác µg (carbetocin)', true], ['WHO 2025: bỏ ergometrine dự phòng thường quy', true]];
kit('bo-bay', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => OXQ.every((_, i) => seen(s, 'q' + i)),
  draw: s => T(285, 40, 'Đúng hay sai? Chạm từng thẻ', { s: 15 }) + tf(OXQ, s, 2, 261, 128, 56),
  say: s => OXQ.every((_, i) => seen(s, 'q' + i)) ? ['worry', 'Liều dự phòng **không phải** phác đồ tăng co. Đọc **đúng hàm lượng**, không nhầm **IU với µg**. WHO 2025 không còn ergometrine dự phòng thường quy.'] : ['happy', 'Bốn câu hay nhầm. Chạm từng thẻ để lật 👆']
});
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
  init: () => ({ lanh: true, cn: true, seen: 'oxy,' }), ui: () => [{ t: 'tog', k: 'lanh', label: '❄️ Oxytocin bảo đảm chất lượng' }, { t: 'tog', k: 'cn', label: '🔥 Có carbetocin CHỊU NHIỆT' }], after: s => markSeen(s, s.lanh ? 'oxy' : s.cn ? 'car' : 'mis'), goal: s => ['oxy', 'car', 'mis'].every(k => seen(s, k)),
  draw: s => {
    const pick = s.lanh ? 'oxy' : s.cn ? 'car' : 'mis', on = (k) => pick === k;
    const box = (x, y, w, h, l, c, k) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${on(k) ? c : '#fff'}" stroke="${on(k) ? C.soft : C.grid}" stroke-width="${on(k) ? 1.8 : 1}"/>` + l.map((t, j) => T(x + w / 2, y + 26 + j * 19, t, { s: j ? 13 : 15, c: j ? C.mute : C.ink })).join('');
    let o = card(20, 20, 530, 316, '#fffdfa');
    o += `<rect x="40" y="40" width="220" height="56" rx="14" fill="#f4f0fb"/>` + T(150, 64, 'Oxytocin bảo đảm', { s: 14 }) + T(150, 84, 'chất lượng?', { s: 14 });
    o += arrow('M260 68 H312', s.lanh ? C.green : C.grid, 3) + T(286, 60, 'có', { s: 12, c: C.green }) + box(318, 36, 214, 64, ['Oxytocin', '10 IU IM / IV'], C.mint, 'oxy');
    o += arrow('M150 98 V134', !s.lanh ? C.red : C.grid, 3) + T(166, 120, 'không', { a: 'start', s: 12, c: C.redD });
    o += `<rect x="40" y="138" width="220" height="56" rx="14" fill="#f4f0fb" opacity="${s.lanh ? .4 : 1}"/>` + T(150, 162, 'Có carbetocin', { s: 14 }) + T(150, 182, 'CHỊU NHIỆT?', { s: 14 });
    o += arrow('M260 166 H312', !s.lanh && s.cn ? C.green : C.grid, 3) + box(318, 134, 214, 64, ['Carbetocin', '100 µg IM / IV'], C.mint, 'car');
    o += arrow('M150 196 V232', !s.lanh && !s.cn ? C.red : C.grid, 3) + box(40, 236, 492, 64, ['Misoprostol', '400–600 µg uống'], C.butter, 'mis');
    o += T(285, 326, 'chọn MỘT thuốc dự phòng — không cộng dồn', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => ['oxy', 'car', 'mis'].every(k => seen(s, k)) ? ['happy', 'WHO 2025: **oxytocin** khi bảo đảm chất lượng; không có chuỗi lạnh → **carbetocin chịu nhiệt**; không có → **misoprostol**. Chọn **một** thuốc.'] : ['happy', 'Tắt bật hai công tắc — đi hết **cả 3 nhánh** của sơ đồ 👆']
});
const BQ = [['Mọi carbetocin đều chịu nhiệt', false], ['Carbetocin tác dụng dài → lặp lại cho mọi BHSS', false], ['Thuốc co hồi sửa được rách hay sót nhau', false], ['Liều misoprostol dự phòng khác liều điều trị', true], ['Kiểm hạn, nhãn, hàm lượng mỗi ống', true], ['Đã dùng misoprostol thì không tự thêm nhiều đường', true]];
kit('bq-bay', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => BQ.every((_, i) => seen(s, 'q' + i)),
  draw: s => T(285, 40, 'Đúng hay sai? Chạm từng thẻ', { s: 15 }) + tf(BQ, s, 3, 170, 130, 56),
  say: s => BQ.every((_, i) => seen(s, 'q' + i)) ? ['worry', 'Không phải carbetocin nào cũng chịu nhiệt; tác dụng dài **không sửa** Trauma/Tissue. Đừng trộn **liều dự phòng, liều điều trị** và hàm lượng.'] : ['happy', 'Sáu câu về thuốc co hồi. Chạm từng thẻ 👆']
});
B['bao-quan-thuoc-go'] = [
  { t: 'Đúng tên vẫn hỏng vì nóng', kit: 'bq-lanh' },
  { t: 'Chọn một thuốc theo hoàn cảnh', kit: 'bq-chon' },
  { t: 'Sáu bẫy về thuốc co hồi', kit: 'bq-bay' }
];

// ═════════ Kẹp rốn muộn
const cordScene = (min, cut, ngat) => { const f = Math.min(1, min / 3);
  let s = `<ellipse cx="90" cy="180" rx="56" ry="22" fill="url(#gPlac)" stroke="${C.placD}"/>` + T(90, 220, 'bánh nhau', { s: 12.5, c: C.mute });
  s += `<path d="M144 180 C190 150 220 230 262 196" fill="none" stroke="#c9c3f0" stroke-width="12" stroke-linecap="round"/><path d="M144 180 C190 150 220 230 262 196" fill="none" stroke="#9b8fe0" stroke-width="3"/>`;
  if (!cut) s += flow('M144 180 C190 150 220 230 262 196', Math.round(2 + 5 * (1 - f)), '#e5484d', 1.6, 3.2);
  else s += `<rect x="196" y="176" width="10" height="28" rx="3" fill="${C.ink}"/>`;
  s += pic('sv-be.png', 262, 70, 120, 256) + (ngat ? `<rect x="262" y="70" width="120" height="256" fill="#8fa8ff" opacity=".35" rx="12"/>` : '');
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
  init: () => ({ sel: '', seen: '' }), ui: () => [], after: (s, k) => { if (k === 'sel') markSeen(s, s.sel); }, goal: s => seen(s, 'kep') && seen(s, 'keo'),
  draw: s => {
    const D = { kep: ['✂️ KẸP rốn', 'cắt liên thông bé – nhau', 'thời điểm: muộn 1–3 phút'], keo: ['🤲 KÉO dây rốn có kiểm soát', 'giúp sổ NHAU', 'tay kia đối lực trên vệ'] };
    return Object.entries(D).map(([k, [a, b, c]], i) => { const x = 20 + i * 268, on = s.sel === k, sn = seen(s, k);
      return `<g class="tap" data-set="sel=${k}">${card(x, 20, 262, 316, on ? C.lav : '#fff', on ? C.soft : sn ? C.mintD : C.grid)}<g transform="translate(${x + 10} 30) scale(.62)">${cordScene(2, k === 'kep', false)}</g>${k === 'keo' ? arrow(`M${x + 70} 140 L${x + 30} 176`, C.red, 4) : ''}${T(x + 131, 250, a, { s: 15 })}${sn ? `<g class="fadein">${T(x + 131, 276, b, { s: 13.5, c: C.redD })}${T(x + 131, 298, c, { s: 12.5, c: C.mute })}</g>` : T(x + 131, 286, '👆 chạm', { s: 13, c: C.soft })}</g>`; }).join('');
  },
  say: s => seen(s, 'kep') && seen(s, 'keo') ? ['happy', '**Kẹp rốn** cắt liên thông bé–nhau; **kéo dây rốn có kiểm soát** giúp sổ nhau. Hai thao tác khác nhau, đừng nhầm.'] : ['happy', 'Hai việc cùng làm trên dây rốn. Chạm **cả hai thẻ** 👆']
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
    o += `<g transform="translate(0 ${inv ? 40 : 0})">${ZS.uterusSag({ x: 170, y: 40, k: .6 })}${inv ? `<path d="M128 46 Q170 ${80} 212 46" fill="#fff" stroke="${C.red}" stroke-width="3"/>` : ''}</g>`;
    const py = ok ? 260 : inv ? 230 : 160;
    o += `<ellipse cx="170" cy="${py}" rx="30" ry="15" fill="url(#gPlac)" stroke="${C.placD}">${ZS.tw('cy', s._p ? (s._p.dl && s._p.luc >= 30 && s._p.luc <= 60 ? 260 : !s._p.dl && s._p.luc >= 60 ? 230 : 160) : null, py, .7)}</ellipse>`;
    o += `<path d="M170 ${py + 12} C170 270 200 300 ${200 + s.luc * .9} 316" fill="none" stroke="#9b8fe0" stroke-width="5"/>` + (s.luc ? arrow(`M${210 + s.luc * .9} 318 l26 6`, s.luc > 60 ? C.red : C.green, 4) : '');
    if (s.dl) o += `<g class="fadein">${pic('sv-ban-tay.png', 214, 20, 48, 84, 'transform="rotate(200 238 62)"')}${arrow('M232 104 l-14 -26', C.green, 4)}</g>` + Th(290, 60, 'đối lực', { s: 12.5, c: C.green });
    if (inv) o += ZS.fade(Th(170, 70, '⚠ đáy tử cung bị kéo lộn', { s: 14, c: C.redD }), true);
    o += card(372, 20, 178, 316) + (ok ? verdict(388, 120, 146, true, 'nhau xuống', 'nhẹ + đối lực') : inv ? verdict(388, 120, 146, false, 'LỘN TỬ CUNG', 'không đối lực, kéo mạnh') : tooHard ? verdict(388, 120, 146, false, 'quá mạnh', 'dừng, đánh giá lại') : T(461, 150, 'bật đối lực,', { s: 13, c: C.soft }) + T(461, 170, 'kéo vừa phải', { s: 13, c: C.soft }));
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
    o += `<rect x="60" y="70" width="250" height="160" rx="10" fill="#f7f1ea" stroke="#e2d6c6"/>` + [[120, 120, 60, 34], [210, 150, 74, 42], [150, 190, 46, 26], [250, 100, 30, 18]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#b81e34" opacity=".75"/>`).join('') + `<rect x="80" y="244" width="70" height="44" rx="6" fill="#d23c50" opacity=".8"/><rect x="170" y="250" width="70" height="40" rx="6" fill="#d23c50" opacity=".7"/>` + T(195, 316, 'gạc thấm máu', { s: 12, c: C.mute });
    o += card(362, 20, 188, 316) + T(456, 60, 'Bạn đoán', { s: 13, c: C.mute }) + T(456, 96, s.g + ' mL', { s: 26 });
    if (s.can) { const real = 1150; o += ZS.fade(pic('sv-can.png', 386, 120, 140, 57) + T(456, 214, 'Cân thật', { s: 13, c: C.mute }) + T(456, 250, real + ' mL', { s: 28, c: C.redD }) + T(456, 286, s.g < real * .8 ? 'mắt đoán THIẾU' : 'đoán khá sát', { s: 14, c: s.g < real * .8 ? C.redD : C.green }), ZS.fresh(s, x => x.can)); }
    return o;
  },
  say: s => s.can ? ['worry', 'Mắt thường **đoán thiếu** lượng máu mất — càng nhiều càng thiếu. **Đo khách quan**: túi có vạch, cân gạc.'] : ['happy', 'Nhìn tấm lót và gạc: **bạn đoán** mất bao nhiêu mL? Kéo thanh, rồi bấm **⚖️ Cân thật** 👆']
});
kit('bm-can', {
  init: () => ({ n: 0, tru: false }), ui: () => [{ t: 'range', k: 'n', label: '🧻 Số gạc đặt lên cân', min: 0, max: 4, step: 1, unit: '' }, { t: 'tog', k: 'tru', label: '➖ Trừ trọng lượng gạc khô' }], goal: s => s.n >= 3 && s.tru,
  draw: s => {
    const wet = [0, 140, 310, 470, 620][s.n], dry = s.n * 20, ml = s.tru ? wet - dry : wet;
    let o = card(20, 20, 330, 316, '#fffdfa') + pic('sv-can.png', 50, 150, 270, 110);
    o += [...Array(s.n)].map((_, i) => `<rect x="${90 + (i % 2) * 70}" y="${120 - Math.floor(i / 2) * 18}" width="62" height="22" rx="6" fill="#d23c50" opacity=".85" class="${i === s.n - 1 && ZS.fresh(s, z => z.n >= i + 1) ? 'fadein' : ''}"/>`).join('');
    o += T(185, 290, `${wet} g${s.tru ? ` − ${dry} g gạc khô` : ''}`, { s: 16 });
    o += card(362, 20, 188, 316) + T(456, 60, 'Máu mất ≈', { s: 13, c: C.mute }) + T(456, 104, ml + ' mL', { s: 28, c: C.redD }) + T(456, 138, '1 g ≈ 1 mL máu', { s: 12.5, c: C.mute });
    o += T(456, 196, 'trừ thêm: ối, nước tiểu', { s: 12, c: C.mute }) + T(456, 230, 'máu KHÔNG thu được:', { s: 12.5 }) + T(456, 250, 'buồng tử cung, ổ tụ,', { s: 12, c: C.redD }) + T(456, 268, 'giường, sàn', { s: 12, c: C.redD });
    return o;
  },
  say: s => s.n >= 3 && s.tru ? ['happy', 'Cân gạc, **trừ trọng lượng khô** (1 g ≈ 1 mL). Nhớ **trừ dịch khác** và tìm máu **không thu được**: buồng tử cung, ổ tụ, giường, sàn.'] : ['happy', 'Đặt **3–4 gạc** lên cân, rồi bật **➖ Trừ gạc khô** 👆']
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
