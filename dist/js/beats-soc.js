'use strict';
/* Trang tí hon — chương 01 Sốc mất máu. Hình: Servier Medical Art (CC BY 4.0) cho người, thận, dịch truyền; sơ đồ tự vẽ cho domino, ống nghiệm, túi máu, bồn thể tích. */
(() => {
const ZS = window.ZS, { C, T, kit, arrow } = ZS, B = ZS.beats;
const { Th, card, pic, tap, call, tcard, pcard, flow, heart, drops, vital, verdict } = ZS.BK;
const SV = 'Servier Medical Art · CC BY 4.0';
const seen = (s, k) => (s.seen || '').includes(k + ','), markSeen = (s, k) => { if (k && !seen(s, k)) s.seen = (s.seen || '') + k + ','; };
const woman = (x0, y0 = 14, h = 322) => { const k = h / 1060; return { svg: pic('sv-phu-nu.png', x0, y0, 297 * k, h), p: (X, Y) => [+(x0 + X * k).toFixed(1), +(y0 + Y * k).toFixed(1)] }; };
const EZ = 'calcMode="spline" keyTimes="0;1" keySplines=".3 0 .7 1"';

// ═════════ Sốc là thiếu tưới máu, không chỉ là tụt áp
const DOM = [['🩸', 'Giảm hồi lưu', 'tim ít máu để bơm'], ['💓', 'Tim nhanh, co mạch', 'cơ thể đang bù'], ['🧪', 'Thiếu oxy mô', 'lactate, toan'], ['🫘', 'Suy cơ quan', 'thận, đông máu…']];
kit('bs-domino', {
  init: () => ({ run: false, stop: false }), ui: () => [{ t: 'tog', k: 'run', label: '▶ Để mất máu tiếp' }, { t: 'tog', k: 'stop', label: '🛑 Can thiệp sớm' }], goal: s => s.run && s.stop,
  draw: s => {
    let o = card(20, 20, 530, 316, '#fffdfa') + `<path d="M40 268 H530" stroke="${C.grid}" stroke-width="4" stroke-linecap="round"/>`;
    DOM.forEach(([ic, a, b], i) => { const x = 60 + i * 122, falls = s.run && (!s.stop || i < 2), ang = falls ? 68 : 0;
      o += `<g transform="rotate(${ang} ${x + 70} 266)">${falls && ZS.fresh(s, z => z.run && (!z.stop || i < 2)) ? `<animateTransform attributeName="transform" type="rotate" from="0 ${x + 70} 266" to="${ang} ${x + 70} 266" dur=".45s" begin="${(i * .35).toFixed(2)}s" fill="freeze" ${EZ}/>` : ''}<rect x="${x}" y="96" width="70" height="170" rx="12" fill="${['#ffd6dc', '#ffe6c9', '#e6dcff', '#d9ecff'][i]}" stroke="${C.soft}" stroke-width="1.2"/>${T(x + 35, 140, ic, { s: 30 })}</g>`;
      o += T(x + 35, 296, a, { s: 13 }) + T(x + 35, 314, b, { s: 11.5, c: C.mute }); });
    if (s.stop) o += `<g class="fadein"><rect x="286" y="150" width="20" height="118" rx="8" fill="${C.green}"/>${Th(296, 140, '🛑 chặn ở đây', { s: 13, c: C.green })}</g>`;
    o += T(285, 58, s.run ? (s.stop ? 'Chặn sớm → chuỗi dừng ở bước bù trừ' : 'Không chặn → đổ tới suy cơ quan') : 'Chuỗi sốc mất máu', { s: 15, c: s.run && !s.stop ? C.redD : s.stop ? C.green : C.ink });
    return o;
  },
  say: s => s.run && s.stop ? ['wow', 'Sốc đi từ **bù trừ → mất bù → suy cơ quan**. Đích của nhận diện sớm là **chặn chuỗi** trước khi mẹ tụt áp sâu.'] : s.run ? ['ouch', 'Không ai chặn → domino đổ hết tới **suy cơ quan**. Bật thêm **🛑 Can thiệp sớm** 👆'] : ['happy', 'Bấm **▶ Để mất máu tiếp** xem chuỗi domino 👆']
});
const NSD = { nhin: [['Bứt rứt → lơ mơ', 148, 60], ['Xanh tái, vã mồ hôi', 100, 122], ['Thở nhanh', 150, 235]], so: [['Mạch nhanh, yếu', 32, 556], ['Tưới máu ngoại vi kém', 268, 590], ['Da lạnh', 120, 1010]], do: [['Sinh hiệu nối tiếp', 262, 330], ['Nước tiểu', 150, 490], ['Máu đang mất', 150, 566]] };
kit('bs-nsd', {
  init: () => ({ m: 'nhin', seen: 'nhin,' }), ui: () => [{ t: 'seg', k: 'm', opts: [['nhin', '👀 Nhìn'], ['so', '🖐 Sờ'], ['do', '📏 Đo']] }], after: s => markSeen(s, s.m), goal: s => ['nhin', 'so', 'do'].every(k => seen(s, k)),
  draw: s => {
    const W = woman(50);
    let o = card(20, 20, 160, 316, '#fffdfa') + W.svg + card(192, 20, 358, 316);
    o += NSD[s.m].map(([t, X, Y], i) => { const [x, y] = W.p(X, Y); return `<g class="fadein" style="animation-delay:${i * .15}s"><circle cx="${x}" cy="${y}" r="8" fill="${C.red}" opacity=".85"/><path d="M${x} ${y} L212 ${70 + i * 86}" stroke="${C.soft}" stroke-width="1.2" stroke-dasharray="3 3"/>${T(220, 76 + i * 86, t, { a: 'start', s: 16 })}</g>`; }).join('');
    o += T(371, 316, s.m === 'do' ? 'đo nhiều lần, xem xu hướng' : s.m === 'so' ? 'sờ tay, chân, mạch quay' : 'nhìn từ xa khi vừa bước vào', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => ['nhin', 'so', 'do'].every(k => seen(s, k)) ? ['happy', '**Nhìn** (tái, vã mồ hôi, lơ mơ, thở nhanh) · **Sờ** (mạch nhanh yếu, da lạnh) · **Đo** nối tiếp (sinh hiệu, máu mất, nước tiểu).'] : ['happy', 'Nhận diện sốc bằng 3 giác quan. Bấm **Nhìn → Sờ → Đo** 👆']
});
const TOL = [['Mẹ khỏe', 1500, ''], ['Thiếu máu sẵn', 700, 'Hb nền thấp'], ['Mất rất nhanh', 900, 'trong vài phút'], ['Bệnh tim', 600, 'khó bù trừ']];
kit('bs-lit', {
  init: () => ({ ml: 0 }), ui: () => [{ t: 'range', k: 'ml', label: '🩸 Lượng máu mất', min: 0, max: 1600, step: 100, unit: ' mL' }], goal: s => s.ml >= 800,
  draw: s => {
    let o = card(20, 20, 530, 316, '#fffdfa');
    o += TOL.map(([n, th, sub], i) => { const x = 40 + i * 128, sh = s.ml >= th, f = Math.min(1, s.ml / th);
      return `${ZS.BK.tintPic('sv-phu-nu.png', x + 30, 40, 54, 192, sh ? .85 : 0)}` + T(x + 57, 254, n, { s: 14 }) + T(x + 57, 272, sub, { s: 11.5, c: C.mute }) + ZS.bar(x + 12, 284, 90, f * 100, sh ? C.red : f > .7 ? C.amber : C.mintD, '', { h: 10 }) + T(x + 57, 318, sh ? 'SỐC' : 'còn chịu', { s: 14, c: sh ? C.redD : C.green }); }).join('');
    o += T(285, 336, 'số minh họa — ngưỡng mỗi người mỗi khác', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.ml >= 800 ? ['worry', 'Cùng lượng máu mất, người **thiếu máu sẵn, mất nhanh, bệnh tim** sốc sớm hơn. **Không học “mất đúng 1 lít mới sốc”.**'] : ['happy', 'Bốn mẹ khác nhau. Kéo thanh **🩸 Lượng máu mất** — ai sốc trước? 👆']
});
kit('bs-mach', {
  init: () => ({ sel: 'dau', xt: false, seen: '' }), ui: () => [{ t: 'seg', k: 'sel', opts: [['dau', '😣 Đau'], ['sot', '🌡️ Sốt'], ['lo', '😰 Lo'], ['mau', '🩸 Mất máu']] }, { t: 'tog', k: 'xt', label: '✅ Xử trí nguyên nhân' }],
  after: s => { if (s.xt) markSeen(s, s.sel); }, goal: s => ['dau', 'sot', 'lo', 'mau'].every(k => seen(s, k)),
  draw: s => {
    const bleed = s.sel === 'mau', W = woman(42, 34, 284), hr = t => { const base = 118 + (bleed ? .35 * t : 0); if (!s.xt || t < 30) return base; return bleed ? 118 + .35 * 30 + .75 * (t - 30) : 84 + (base - 84) * Math.exp(-(t - 30) / 7); };
    const ICON = { dau: ['😣', ...W.p(148, 470)], sot: ['🌡️', ...W.p(148, 40)], lo: ['😰', ...W.p(148, 125)], mau: ['🩸', ...W.p(150, 566)] };
    let o = card(20, 20, 170, 316, '#fffdfa') + W.svg + Object.entries(ICON).map(([k, [ic, x, y]]) => `<g opacity="${s.sel === k ? 1 : .3}"><circle cx="${x}" cy="${y}" r="${s.sel === k ? 17 : 11}" fill="#fff" stroke="${s.sel === k ? C.red : C.grid}" stroke-width="2" ${s.sel === k ? 'class="pulse"' : ''}/>${T(x, y + (s.sel === k ? 7 : 5), ic, { s: s.sel === k ? 20 : 13 })}</g>`).join('');
    const P = ZS.plot({ x: 232, y: 70, w: 296, h: 170, xr: [0, 60], yr: [60, 150], xt: 4, yt: 3, xl: 'phút', title: 'Mạch (l/ph)', curves: [{ f: hr, col: bleed ? C.red : C.cap, w: 3.6 }], hl: [{ y: 100, label: '100', c: C.amber, lpos: 'left' }], vl: s.xt ? [{ x: 30, label: 'xử trí', c: C.green, dash: true }] : [] });
    o += card(202, 20, 348, 316) + P.svg;
    const done = s.xt, drop = done && !bleed;
    o += verdict(222, 262, 310, drop, !done ? 'Mạch 118 — vì sao?' : drop ? 'Hết nguyên nhân → mạch GIẢM' : 'Mạch vẫn TĂNG → nghĩ MẤT MÁU', !done ? 'bật ✅ xử trí nguyên nhân ở trên' : drop ? 'đau, sốt, lo: mạch nhanh nhưng đáp ứng' : 'da lạnh · máu vẫn chảy · không đáp ứng');
    return o;
  },
  say: s => ['dau', 'sot', 'lo', 'mau'].every(k => seen(s, k)) ? ['worry', 'Mạch nhanh **đơn độc** có thể do đau, sốt, lo. Đọc **toàn cảnh** và **theo thời gian**: mạch tăng dần + da lạnh + máu chảy → sốc.'] : ['happy', 'Mạch 118 có nhiều lý do. Chọn từng nguyên nhân, bật **✅ Xử trí** — mạch có giảm không? Xem **cả 4** 👆']
});
const KEO = [['🧪', 'Toan chuyển hóa', 1], ['🩸', 'Rối loạn đông máu', 2.5], ['🫘', 'Suy thận', 3.5], ['🧠', 'Tuyến yên → Sheehan', 5]];
kit('bs-keo', {
  init: () => ({ h: 0 }), ui: () => [{ t: 'range', k: 'h', label: '⏳ Sốc kéo dài', min: 0, max: 6, step: .5, unit: ' giờ' }], goal: s => s.h >= 5,
  draw: s => {
    let o = card(20, 20, 530, 316, '#fffdfa') + T(285, 50, 'Thiếu tưới máu càng lâu, càng nhiều cơ quan bị tổn thương', { s: 14 });
    o += KEO.map(([ic, t, th], i) => { const on = s.h >= th, x = 40 + i * 128;
      return `<g ${on && ZS.fresh(s, z => z.h >= th) ? 'class="fadein"' : ''}>${card(x, 80, 116, 170, on ? '#ffe0e6' : '#f8f6fc', on ? C.pinkD : C.grid)}${i === 2 ? pic('sv-than.png', x + 34, 96, 48, 72, `opacity="${on ? 1 : .3}"`) : T(x + 58, 150, ic, { s: 40, c: on ? C.ink : C.grid })}${T(x + 58, 204, t.split(' → ')[0], { s: 13.5, c: on ? C.redD : C.mute })}${t.includes('→') ? T(x + 58, 224, '→ ' + t.split(' → ')[1], { s: 12.5, c: on ? C.redD : C.mute }) : ''}</g>`; }).join('');
    o += `<path d="M40 290 H530" stroke="${C.grid}" stroke-width="10" stroke-linecap="round"/><path d="M40 290 H${40 + 490 * s.h / 6}" stroke="${C.red}" stroke-width="10" stroke-linecap="round"/>` + T(285, 322, s.h + ' giờ thiếu tưới máu', { s: 13, c: C.mute });
    return o;
  },
  say: s => s.h >= 5 ? ['ouch', 'Sốc kéo dài → **toan**, **rối loạn đông máu**, **suy thận**; thiếu máu tuyến yên có thể để lại **hội chứng Sheehan**.'] : ['happy', 'Kéo thanh **⏳ Sốc kéo dài** — xem cơ quan nào bị kéo theo 👆']
});
B['nhan-dien-soc'] = [
  { t: 'Sốc là một chuỗi domino', kit: 'bs-domino' },
  { t: 'Nhìn – sờ – đo', kit: 'bs-nsd', cr: 'Người: ' + SV },
  { t: 'Không có “mất 1 lít mới sốc”', kit: 'bs-lit', cr: 'Người: ' + SV },
  { t: 'Mạch nhanh: chưa chắc là sốc', kit: 'bs-mach' },
  { t: 'Sốc kéo dài kéo theo cơ quan', kit: 'bs-keo', cr: 'Thận: ' + SV }
];

// ═════════ Shock index
const siCol = v => v > 1 ? C.red : v > .9 ? C.amber : C.green;
kit('bs-si', {
  init: () => ({ hr: 90, sbp: 120 }), ui: () => [{ t: 'range', k: 'hr', label: '💓 Nhịp tim', min: 60, max: 160, step: 5, unit: ' l/ph' }, { t: 'range', k: 'sbp', label: '🩺 HA tâm thu', min: 60, max: 140, step: 5, unit: ' mmHg' }], goal: s => s.hr / s.sbp > 1,
  draw: s => {
    const si = s.hr / s.sbp, a = Math.min(1, si / 1.6) * 180 - 90;
    let o = card(20, 20, 300, 270, '#fffdfa') + T(170, 70, `${s.hr} ÷ ${s.sbp}`, { s: 30 }) + `<path d="M70 86 H270" stroke="${C.ink}" stroke-width="2"/>` + T(170, 130, 'SI = ' + si.toFixed(2).replace('.', ','), { s: 30, c: siCol(si) });
    o += T(170, 176, 'nhịp tim ÷ HA tâm thu', { s: 13, c: C.mute }) + T(170, 218, 'thử: mạch 120, HATT 100', { s: 13, c: C.soft });
    // đồng hồ
    const g = (v, r) => { const t = (Math.min(1.6, v) / 1.6) * Math.PI; return [435 - r * Math.cos(t), 180 - r * Math.sin(t)]; };
    const arc = (v0, v1, col) => { const [x0, y0] = g(v0, 90), [x1, y1] = g(v1, 90); return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A90 90 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${col}" stroke-width="20"/>`; };
    o += card(332, 20, 218, 270) + arc(0, .9, C.mintD) + arc(.9, 1, '#ffd36b') + arc(1, 1.6, '#ff9aa6');
    o += `<g transform="rotate(${a.toFixed(1)} 435 180)">${ZS.twRot(s._p ? (Math.min(1, s._p.hr / s._p.sbp / 1.6) * 180 - 90).toFixed(1) : null, a.toFixed(1), 435, 180, .4)}<path d="M435 180 V104" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/></g><circle cx="435" cy="180" r="8" fill="${C.ink}"/>`;
    o += T(372, 212, '0,9', { s: 12, c: C.mute }) + T(470, 212, '1,0', { s: 12, c: C.mute }) + T(441, 244, si > 1 ? 'WHO: > 1 bất thường' : si > .9 ? 'FIGO: > 0,9 báo động' : 'chưa vượt ngưỡng', { s: 13, c: siCol(si) }) + T(441, 266, '(hai ngữ cảnh khác nhau)', { s: 11, c: C.mute });
    o += verdict(20, 300, 530, si <= .9, si > .9 ? 'SI cao → đánh giá khẩn toàn cảnh' : 'Tiếp tục theo dõi xu hướng');
    return o;
  },
  say: s => s.hr / s.sbp > 1 ? ['worry', '**SI = nhịp tim ÷ HA tâm thu**. FIGO dùng **> 0,9** báo động; WHO 2025 dùng **> 1** kèm lượng máu mất. Ví dụ 120 ÷ 100 = **1,20**.'] : ['happy', 'Kéo hai thanh — tăng **nhịp tim**, giảm **HA tâm thu** — xem kim đồng hồ SI 👆']
});
kit('bs-nguoc', {
  init: () => ({ t: 0 }), ui: () => [{ t: 'range', k: 't', label: '⏱ Thời gian chảy máu', min: 0, max: 60, step: 5, unit: ' phút' }], goal: s => s.t >= 50,
  draw: s => {
    const hr = t => 85 + t * 0.9, sb = t => t < 35 ? 120 - t * .25 : 111 - (t - 35) * 1.6, si = t => hr(t) / sb(t);
    const P = ZS.plot({ x: 70, y: 52, w: 300, h: 220, xr: [0, 60], yr: [60, 160], xt: 6, yt: 5, xl: 'phút', curves: [{ f: hr, col: C.red, w: 3.2 }, { f: sb, col: C.cap, w: 3.2 }], vl: [{ x: s.t, c: C.soft }], pts: [{ x: s.t, y: hr(s.t), col: C.red }, { x: s.t, y: sb(s.t), col: C.cap }], legend: [[C.red, 'Nhịp tim'], [C.cap, 'HA tâm thu']] });
    let o = card(20, 20, 380, 316, '#fffdfa') + P.svg;
    const v = si(s.t), t9 = [...Array(61).keys()].find(t => si(t) > .9), t90 = [...Array(61).keys()].find(t => sb(t) < 90);
    o += `<path d="M${P.X(t9)} 52 V272" stroke="${C.amber}" stroke-width="1.6" stroke-dasharray="5 4"/>` + Th(P.X(t9) + 4, 70, `SI > 0,9 ở phút ${t9}`, { a: 'start', s: 12, c: '#b8860b' });
    o += card(410, 20, 140, 316) + T(480, 60, 'SI', { s: 14, c: C.mute }) + T(480, 100, v.toFixed(2).replace('.', ','), { s: 30, c: siCol(v) }) + T(480, 150, 'HATT < 90', { s: 12.5, c: C.mute }) + T(480, 172, 'ở phút ' + t90, { s: 15, c: C.cap });
    o += T(480, 230, 'SI báo động', { s: 12.5, c: C.mute }) + T(480, 252, 'sớm hơn', { s: 16, c: C.green }) + T(480, 274, (t90 - t9) + ' phút', { s: 16, c: C.green });
    return o;
  },
  say: s => s.t >= 50 ? ['wow', 'Hai số đi **ngược chiều** (mạch ↑, HA ↓) nên SI vượt ngưỡng **sớm hơn** hẳn so với chờ HA tụt.'] : ['happy', 'Kéo thanh **⏱ Thời gian** — nhìn hai đường tách nhau 👆']
});
ZS.BK.tfKit('bs-siq', [['Quy SI ra chính xác % máu mất', false, 'SI chỉ là dấu báo động; không quy ra % máu mất chính xác.'], ['SI thấp → yên tâm, không chảy máu nguy hiểm', false, 'SI thấp không loại trừ chảy máu nguy hiểm (thuốc, bệnh nền, bù trừ sớm).'], ['SI cao → đánh giá khẩn theo toàn cảnh', true, 'SI vượt ngưỡng là lý do đánh giá khẩn cả lâm sàng, không là chẩn đoán.'], ['Chờ SI cao hơn nữa mới hành động', false, 'Không chờ SI xấu thêm: SI đã vượt ngưỡng là hành động ngay.']], 'SI là **đèn báo**, không là máy chẩn đoán: không quy ra % máu mất, SI thấp **không loại trừ** chảy máu nguy hiểm, **không chờ** SI xấu thêm.');
B['shock-index'] = [
  { t: 'SI: một phép chia', kit: 'bs-si' },
  { t: 'Hai số đi ngược chiều', kit: 'bs-nguoc' },
  { t: 'SI không phải máy chẩn đoán', kit: 'bs-siq' }
];

// ═════════ Bốn mức sốc
const GR = [['I', '≈ 15%', ['mạch, HA có thể bình thường', 'hạ áp tư thế'], 0], ['II', '20–25%', ['mạch nhanh', 'ngoại vi lạnh, thở nhanh'], 20], ['III', '30–35%', ['hạ HA rõ, lạnh tái', 'thiểu niệu, toan'], 30], ['IV', '40–45%', ['trụy tuần hoàn', 'mạch ngoại vi khó bắt'], 40]];
kit('bs-do', {
  init: () => ({ p: 10 }), ui: () => [{ t: 'range', k: 'p', label: '🩸 Máu mất (minh họa)', min: 10, max: 45, step: 5, unit: '%' }], goal: s => s.p >= 40,
  draw: s => {
    const g = s.p >= 40 ? 3 : s.p >= 30 ? 2 : s.p >= 20 ? 1 : 0, W = woman(40, 26, 284), hr = [90, 115, 135, 150][g], ha = ['118/76', '108/78', '84/56', '< 70'][g];
    let o = card(20, 20, 136, 316, '#fffdfa') + W.svg + (g ? `<g opacity="${[0, .25, .6, .95][g]}" filter="url(#lanh)">${pic('sv-phu-nu.png', 40, 26, 297 * 284 / 1060, 284)}</g>` : '') + heart(...W.p(150, 270), 16, hr);
    o += [W.p(40, 560), W.p(255, 560)].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#7aa6e6" opacity="${[0, .4, .6, .8][g]}"/>`).join('');
    o += GR.map(([n, pct, sg], i) => { const y = 24 + i * 78, on = i === g;
      return `<rect x="168" y="${y}" width="382" height="70" rx="14" fill="${on ? ['#e8f8f0', '#fff3c4', '#ffe0cc', '#ffd0d8'][i] : '#fff'}" stroke="${on ? C.soft : C.grid}" stroke-width="${on ? 1.6 : 1}"/>` + T(196, y + 44, n, { s: 26, c: on ? C.redD : C.grid }) + T(232, y + 28, pct, { a: 'start', s: 13.5, c: on ? C.ink : C.mute }) + T(232, y + 50, sg.join(' · '), { a: 'start', s: 12.5, c: on ? C.ink : C.mute }); }).join('');
    o += `<rect x="168" y="${24 + g * 78}" width="382" height="70" rx="14" fill="none" stroke="${C.red}" stroke-width="2.4">${ZS.tw('y', s._p ? 24 + (s._p.p >= 40 ? 3 : s._p.p >= 30 ? 2 : s._p.p >= 20 ? 1 : 0) * 78 : null, 24 + g * 78, .4)}</rect>` + Th(88, 328, `${hr} · HA ${ha}`, { s: 12, c: g >= 2 ? C.redD : C.ink });
    return o;
  },
  say: s => s.p >= 40 ? ['ouch', 'Độ IV: **trụy tuần hoàn**. Bảng cho thấy diễn tiến **bù → mất bù**; con số % chỉ là **minh họa**, không là công thức cho từng mẹ.'] : ['happy', 'Kéo thanh **🩸 Máu mất** — nhìn mẹ và dòng sáng trong bảng 4 mức 👆']
});
kit('bs-tuthe', {
  init: () => ({ ngoi: false }), ui: () => [{ t: 'tog', k: 'ngoi', label: '🪑 Cho mẹ ngồi dậy' }], goal: s => s.ngoi,
  draw: s => {
    const n = s.ngoi;
    let o = card(20, 20, 260, 316, '#fffdfa') + T(150, 52, n ? 'Ngồi dậy (đầu cao)' : 'Nằm', { s: 16 });
    o += n ? `<g class="fadein">${ZS.BK.sitPic(112, 66, 236)}</g>` : `<g transform="rotate(-90 150 200)">${pic('sv-phu-nu.png', 117, 82, 66, 236)}</g><rect x="156" y="170" width="116" height="64" rx="12" fill="#ebe4ff" opacity=".8" stroke="#c3b0fb"/>`;
    o += card(292, 20, 258, 316) + T(421, 52, 'Độ I: máu mất ≈ 15%', { s: 14, c: C.mute });
    o += vital(312, 72, 'Mạch', n ? 118 : 92, n ? '#ffb15c' : '#7ee2b8', 218) + vital(312, 128, 'Huyết áp', n ? '96/62' : '116/74', n ? '#ffb15c' : '#7ee2b8', 218);
    o += n ? ZS.fade(verdict(312, 196, 218, false, 'Hạ áp tư thế', 'mạch ↑ HA ↓ khi đổi tư thế') + T(421, 300, 'dấu sớm khi nằm còn “bình thường”', { s: 12, c: C.mute }), ZS.fresh(s, x => x.ngoi)) : T(421, 230, 'nằm: trông bình thường', { s: 14, c: C.green });
    return o;
  },
  say: s => s.ngoi ? ['worry', 'Độ I: nằm thì mạch, HA còn bình thường; **ngồi dậy** thì mạch vọt, HA tụt — **hạ áp tư thế** là dấu sớm.'] : ['happy', 'Mẹ mất máu ít, nằm trông ổn. Bấm **🪑 Cho mẹ ngồi dậy** 👆']
});
kit('bs-som', {
  init: () => ({ hb: 12 }), ui: () => [], goal: s => s.hb <= 9,
  draw: s => {
    const lv = Math.max(0, Math.min(1, (12 - s.hb) / 6)), g = s.hb <= 9 ? 2 : 1;
    let o = card(20, 20, 530, 316, '#fffdfa') + T(285, 52, 'Cùng mất ≈ 800 mL', { s: 16 });
    [['Mẹ A: Hb nền thấp dần', 46, lv, g], ['Mẹ B: Hb nền bình thường (≈ 12)', 300, .04, 1]].forEach(([t, x, tint, gg], i) => {
      o += ZS.BK.tintPic('sv-phu-nu.png', x + 70, 66, 53, 190, tint, 'lanh') + T(x + 96, 272, t, { s: i ? 12 : 13.5 }) + `<rect x="${x + 150}" y="110" width="70" height="56" rx="12" fill="${gg === 2 ? '#ffe0cc' : '#fff3c4'}"/>` + T(x + 185, 148, 'Độ ' + ['I', 'II', 'III'][gg], { s: 18, c: gg === 2 ? C.redD : '#b8860b' });
    });
    o += ZS.BK.scrub('hb', s.hb, 6, 13, 1, ' g/dL', 142, 312) + T(142, 288, 'kéo Hb nền mẹ A', { s: 11, c: C.mute });
    return o;
  },
  say: s => s.hb <= 9 ? ['worry', 'Thiếu máu sẵn hoặc mất **nhanh** → xấu ở lượng **thấp hơn bảng**. Đọc toàn cảnh, **không đợi độ III** mới hành động.'] : ['happy', 'Hai mẹ mất máu như nhau. Rê ngang số **Hb của mẹ A** xuống thấp 👆']
});
B['phan-do-soc'] = [
  { t: 'Bốn mức: từ bù tới trụy', kit: 'bs-do', cr: 'Người: ' + SV },
  { t: 'Độ I: ngồi dậy mới lộ', kit: 'bs-tuthe', cr: 'Người: ' + SV },
  { t: 'Bảng chỉ để minh họa', kit: 'bs-som', cr: 'Người: ' + SV }
];

// ═════════ Một đội, hai việc cùng lúc
const TEAM = [['san', '👩‍⚕️', 'Sản khoa cao cấp'], ['gm', '😷', 'Gây mê hồi sức'], ['mau', '🩸', 'Ngân hàng máu'], ['nhi', '👶', 'Hồi sức sơ sinh'], ['ghi', '📝', 'Người ghi chép']];
kit('bs-doi', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => TEAM.every(([k]) => seen(s, k)),
  draw: s => {
    let o = card(20, 20, 300, 316, '#fffdfa') + `<rect x="120" y="140" width="100" height="70" rx="12" fill="${C.sky}" stroke="${C.skyD}"/>` + T(170, 182, '🛏️ mẹ', { s: 16 });
    const P = [[80, 80], [260, 80], [60, 250], [280, 250], [170, 290]];
    o += TEAM.map(([k, ic, t], i) => seen(s, k) ? `<g class="${ZS.fresh(s, z => seen(z, k)) ? 'fadein' : ''}"><circle cx="${P[i][0]}" cy="${P[i][1]}" r="24" fill="${C.lav}" stroke="${C.soft}"/>${T(P[i][0], P[i][1] + 9, ic, { s: 22 })}</g>` : `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="24" fill="none" stroke="${C.grid}" stroke-dasharray="5 4"/>`).join('');
    o += TEAM.map(([k, ic, t], i) => tcard('!' + k, 334, 20 + i * 63, 216, 56, seen(s, k), [ic + ' ' + t])).join('');
    return o;
  },
  say: s => TEAM.every(([k]) => seen(s, k)) ? ['happy', 'Báo **cấp cứu sản khoa**: sản khoa cao cấp, gây mê hồi sức, ngân hàng máu, hồi sức sơ sinh (theo tình huống) và **một người ghi chép**.'] : ['happy', 'Mẹ đang sốc. Gọi **đủ người** — bật từng thẻ 👆']
});
const ABC = [['a', 148, 100, 'A · Đường thở', 'thông, an toàn'], ['b', 215, 225, 'B · Thở', 'oxy / thông khí theo mức thiếu oxy'], ['c', 178, 292, 'C · Tuần hoàn', 'mạch, HA, tưới máu, máu đang mất']];
kit('bs-abc', {
  init: () => ({ sel: '', seen: '' }), ui: () => [{ t: 'seg', k: 'sel', opts: ABC.map(([k, , , a]) => [k, a]) }], after: s => markSeen(s, s.sel), goal: s => ABC.every(([k]) => seen(s, k)),
  draw: s => {
    const W = woman(50);
    let o = card(20, 20, 160, 316, '#fffdfa') + W.svg;
    o += ABC.map(([k, X, Y]) => { const [x, y] = W.p(X, Y), on = s.sel === k; return seen(s, k) ? `<circle cx="${x}" cy="${y}" r="${on ? 13 : 8}" fill="${C.green}" ${on ? 'class="pulse"' : ''}/>` : ''; }).join('');
    o += card(194, 20, 356, 316) + ABC.map(([k, , , a, b], i) => seen(s, k) ? `<g class="${s.sel === k ? 'fadein' : ''}"><rect x="204" y="${56 + i * 90}" width="336" height="76" rx="14" fill="${s.sel === k ? C.mint : '#fff'}" stroke="${s.sel === k ? C.mintD : C.grid}"/>${T(222, 90 + i * 90, a, { a: 'start', s: 17 })}${T(222, 114 + i * 90, b, { a: 'start', s: 13, c: C.mute })}</g>` : T(222, 100 + i * 90, ['A', 'B', 'C'][i] + ' · chọn nút ở trên', { a: 'start', s: 14, c: C.grid })).join('');
    o += T(372, 322, 'không tự động đặt nội khí quản cho mọi ca', { s: 12, c: C.redD });
    return o;
  },
  say: s => ABC.every(([k]) => seen(s, k)) ? ['happy', 'Đánh giá **A–B–C**; oxy/thông khí **theo mức thiếu oxy và độ nặng** — không tự động đặt nội khí quản cho mọi ca.'] : ['happy', 'Bấm lần lượt **A · B · C** ở trên — chấm xanh hiện đúng chỗ cần kiểm tra trên người mẹ 👆']
});
const LINE = [['iv1', 36, 500, '💉 Đường truyền 1', 'kim to, tĩnh mạch ngoại vi'], ['xn', 40, 400, '🧪 Lấy máu cùng lúc', 'xét nghiệm + nhóm máu'], ['iv2', 262, 500, '💉 Đường truyền 2', 'kim to, tay bên kia'], ['dich', -1, -1, '💧 Dịch tinh thể ấm', 'cầu nối, chờ máu'], ['am', 150, 700, '🧣 Giữ ấm', 'người, dịch và máu']];
kit('bs-duong', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => LINE.every(([k]) => seen(s, k)),
  draw: s => {
    const W = woman(52);
    let o = card(20, 20, 164, 316, '#fffdfa') + W.svg + (seen(s, 'am') ? `<rect x="58" y="182" width="86" height="104" rx="12" fill="${C.lav}" opacity=".7" class="fadein"/>` : '') + `<g opacity="${seen(s, 'dich') ? 1 : .35}">${pic('sv-dich-truyen.png', 138, 24, 44, 62)}</g>` + (seen(s, 'dich') ? `<path d="M160 86 Q168 150 140 ${W.p(262, 500)[1] - 6}" fill="none" stroke="#9ecdf7" stroke-width="2" class="fadein"/>` : '');
    o += LINE.map(([k, X, Y], i) => { const [x, y] = X < 0 ? [160, 56] : W.p(X, Y); return seen(s, k) ? (X < 0 ? '' : `<circle cx="${x}" cy="${y}" r="7" fill="${C.cap}"/>`) : tap('!' + k, x, y, X < 0 ? 22 : 12, X < 0 ? 32 : 12); }).join('');
    o += card(196, 20, 354, 316) + LINE.map(([k, , , a, b], i) => seen(s, k) ? ZS.fade(T(214, 52 + i * 60, a, { a: 'start', s: 15 }) + T(214, 72 + i * 60, b, { a: 'start', s: 12.5, c: C.mute }), ZS.fresh(s, z => seen(z, k))) : T(214, 62 + i * 60, '○ chạm vòng trên người mẹ', { a: 'start', s: 13, c: C.grid })).join('');
    return o;
  },
  say: s => LINE.every(([k]) => seen(s, k)) ? ['happy', '**Hai đường truyền lớn**, lấy máu xét nghiệm **cùng lúc**, dịch tinh thể **ấm** làm cầu nối, **chuẩn bị máu sớm**, giữ ấm.'] : ['happy', 'Chạm **5 vòng** trên người mẹ để thiết lập hồi sức 👆']
});
kit('bs-bon', {
  init: () => ({ c: '', seen: '' }), ui: () => [{ t: 'seg', k: 'c', opts: [['hs', '💧 Chỉ hồi sức'], ['cm', '🩹 Chỉ cầm máu'], ['ca', '⚡ Cả hai cùng lúc']] }], after: s => markSeen(s, s.c), goal: s => seen(s, 'ca') && (seen(s, 'hs') || seen(s, 'cm')),
  draw: s => {
    const inn = s.c === 'hs' || s.c === 'ca', out = s.c !== 'cm' && s.c !== 'ca', lvl = { '': .55, hs: .45, cm: .28, ca: .8 }[s.c], H = 200, top = 70 + H * (1 - lvl);
    let o = card(20, 20, 330, 316, '#fffdfa') + `<path d="M90 70 V270 Q90 290 110 290 H240 Q260 290 260 270 V70" fill="none" stroke="${C.soft}" stroke-width="3"/>`;
    const ptop = s._p ? 70 + H * (1 - ({ '': .55, hs: .45, cm: .28, ca: .8 }[s._p.c] ?? .55)) : null;
    o += `<clipPath id="bonclip"><path d="M92 60 V270 Q92 288 110 288 H240 Q258 288 258 270 V60Z"/></clipPath><g clip-path="url(#bonclip)"><rect x="92" y="${top}" width="166" height="${300 - top}" fill="${C.red}" opacity=".75">${ptop != null ? `<animate attributeName="y" from="${ptop}" to="${top}" dur="1.2s" fill="freeze"/><animate attributeName="height" from="${300 - ptop}" to="${300 - top}" dur="1.2s" fill="freeze"/>` : ''}</rect></g>` + T(175, 316, 'thể tích tuần hoàn', { s: 13, c: C.mute });
    if (inn) o += `<path d="M40 40 H130 V70" fill="none" stroke="${C.cap}" stroke-width="6"/>` + flow('M40 40 H130 V110', 4, '#9ecdf7', 1.4, 5) + Th(40, 32, 'dịch, máu vào', { a: 'start', s: 12.5, c: C.cap });
    o += out ? `<path d="M258 250 H310" stroke="${C.red}" stroke-width="6"/>` + drops(320, 262, 3, .8, 12) + Th(290, 300, 'máu vẫn chảy', { s: 12.5, c: C.redD }) : `<rect x="256" y="240" width="14" height="22" rx="4" fill="${C.green}"/>` + Th(290, 300, 'đã bịt nguồn', { s: 12.5, c: C.green });
    const R = { '': ['', ''], hs: ['Đổ vào bao nhiêu, chảy ra bấy nhiêu', 'vòng xoắn không dừng'], cm: ['Bịt được nguồn nhưng bồn cạn', 'mẹ trụy trước khi kịp'], ca: ['Bồn đầy lại và giữ được', 'hai việc chạy CÙNG LÚC'] }[s.c];
    o += card(362, 20, 188, 316) + (s.c ? T(456, 120, R[0].split(' ').slice(0, 4).join(' '), { s: 14 }) + T(456, 142, R[0].split(' ').slice(4).join(' '), { s: 14 }) + T(456, 176, R[1], { s: 12.5, c: s.c === 'ca' ? C.green : C.redD }) + T(456, 240, s.c === 'ca' ? '✓' : '✗', { s: 42, c: s.c === 'ca' ? C.green : C.redD }) : T(456, 170, '👆 chọn cách làm', { s: 14, c: C.soft }));
    return o;
  },
  say: s => seen(s, 'ca') && (seen(s, 'hs') || seen(s, 'cm')) ? ['wow', 'Hồi sức giữ **oxy & tưới máu**, cầm máu **chặn đường ra**. Bỏ một việc là vòng xoắn không dừng — hai việc phải chạy **cùng lúc**.'] : ['happy', 'Cơ thể mẹ như **một bồn máu bị thủng**. Thử lần lượt **3 cách** ở trên 👆']
});
kit('bs-nghieng', {
  init: () => ({ ng: false, seen: '' }), ui: () => [{ t: 'tog', k: 'ng', label: '↪️ Nghiêng trái / đẩy tử cung' }], after: s => markSeen(s, s.ng ? 'ng' : 'ngua'), goal: s => s.ng,
  draw: s => {
    const ng = s.ng;
    let o = card(20, 20, 300, 316, '#fffdfa') + T(170, 50, ng ? 'Nghiêng trái' : 'Nằm ngửa', { s: 16 }) + T(170, 70, 'mặt cắt ngang bụng mẹ', { s: 12, c: C.mute });
    o += `<g transform="${ng ? 'rotate(-14 170 200)' : ''}"><ellipse cx="170" cy="190" rx="120" ry="70" fill="${C.peach}" stroke="${C.peachD}"/><circle cx="170" cy="${ng ? 162 : 196}" r="58" fill="url(#gMyo)" stroke="${C.myoD}">${ZS.tw('cy', s._p ? (s._p.ng ? 162 : 196) : null, ng ? 162 : 196)}</circle>${T(170, ng ? 166 : 200, 'tử cung', { s: 13, c: '#fff' })}</g>`;
    o += `<ellipse cx="145" cy="${ng ? 262 : 258}" rx="${ng ? 16 : 18}" ry="${ng ? 13 : 4}" fill="#5b6ee0" stroke="#3f51b5"/>` + Th(145, 296, 'TM chủ dưới', { s: 12.5, c: '#3f51b5' }) + `<circle cx="200" cy="262" r="10" fill="${C.red}"/>` + Th(205, 296, 'ĐM chủ', { a: 'start', s: 12, c: C.redD });
    o += `<rect x="40" y="275" width="260" height="10" rx="4" fill="#e4dccf"/>`;
    o += card(332, 20, 218, 316) + T(441, 60, 'Máu về tim', { s: 14 }) + ZS.bar(352, 72, 178, ng ? 100 : 65, ng ? C.green : C.amber, '', { h: 16 }) + T(441, 112, ng ? 'tốt hơn' : 'bị tử cung đè', { s: 13, c: ng ? C.green : '#b5651d' });
    o += T(441, 170, 'thai lớn, nằm ngửa →', { s: 12.5, c: C.mute }) + T(441, 190, 'tử cung chèn tĩnh mạch chủ', { s: 12.5, c: C.mute }) + T(441, 240, 'tư thế chọn theo', { s: 12.5, c: C.mute }) + T(441, 260, 'bối cảnh hồi sức', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => s.ng ? ['wow', 'Tử cung có thai lớn **đè tĩnh mạch chủ** khi nằm ngửa → máu về tim giảm. **Nghiêng trái / đẩy tử cung** sang trái giải phóng dòng về.'] : ['happy', 'Mẹ có thai lớn đang nằm ngửa. Bấm **↪️ Nghiêng trái** xem tĩnh mạch chủ 👆']
});
B['hoi-suc-song-song'] = [
  { t: 'Gọi đúng người', kit: 'bs-doi' },
  { t: 'A–B–C trước tiên', kit: 'bs-abc', cr: 'Người: ' + SV },
  { t: 'Hai đường truyền, máu, giữ ấm', kit: 'bs-duong', cr: 'Người, dịch truyền: ' + SV },
  { t: 'Hai việc phải chạy cùng lúc', kit: 'bs-bon' },
  { t: 'Thai lớn đè tĩnh mạch chủ', kit: 'bs-nghieng' }
];

// ═════════ Xét nghiệm & ngân hàng máu
const glass = (x, y, lvl, col, lab) => `<path d="M${x} ${y} L${x + 12} ${y + 150} H${x + 88} L${x + 100} ${y}" fill="none" stroke="${C.soft}" stroke-width="2.4"/><path d="M${x + 12 - (1 - lvl) * 0} ${y + 150 - 140 * lvl} L${x + 12} ${y + 150} H${x + 88} L${x + 88 + 0} ${y + 150 - 140 * lvl}Z" fill="${col}" opacity=".9"/>` + T(x + 50, y + 176, lab, { s: 13, c: C.mute });
kit('bs-hb', {
  init: () => ({ mat: false, pha: false }), ui: () => [{ t: 'tog', k: 'mat', label: '🩸 Mất máu toàn phần' }, { t: 'tog', k: 'pha', label: '💧 Vài giờ sau: dịch kéo vào' }], after: (s, k) => { if (k === 'pha' && s.pha) s.mat = true; if (k === 'mat' && !s.mat) s.pha = false; }, goal: s => s.mat && s.pha,
  draw: s => {
    const lvl = s.pha ? .9 : s.mat ? .5 : .9, col = s.pha ? '#f08a9a' : '#c8283c', hb = s.pha ? 8 : 12;
    let o = card(20, 20, 300, 316, '#fffdfa') + T(170, 52, 'Ly máu của mẹ', { s: 15 }) + glass(110, 80, lvl, col, s.pha ? 'loãng ra' : s.mat ? 'vơi nửa, màu vẫn đậm' : 'đầy');
    if (s.mat && !s.pha) o += drops(170, 300, 3, .8, 16);
    o += card(332, 20, 218, 316) + T(441, 60, 'Hb đo được', { s: 14, c: C.mute }) + T(441, 112, hb + ' g/dL', { s: 34, c: s.pha ? C.redD : C.ink }) + T(441, 150, s.pha ? 'giờ mới giảm' : s.mat ? 'CHƯA giảm!' : 'bình thường', { s: 15, c: s.mat && !s.pha ? C.redD : C.mute });
    o += T(441, 212, 'máu mất', { s: 13, c: C.mute }) + T(441, 236, s.mat ? 'rất nhiều' : 'chưa', { s: 17, c: s.mat ? C.redD : C.green }) + T(441, 300, 'số minh họa', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.mat && s.pha ? ['worry', 'Mất máu **toàn phần** thì nồng độ Hb **chưa đổi**; Hb chỉ giảm khi dịch kéo vào. **Không chờ Hb “đủ thấp”** mới chuẩn bị máu.'] : s.mat ? ['ouch', 'Ly vơi một nửa nhưng **màu vẫn đậm** → Hb **chưa giảm** dù mất rất nhiều. Bấm tiếp **💧 Vài giờ sau** 👆'] : ['happy', 'Hb là **nồng độ**, không phải lượng máu. Bấm **🩸 Mất máu toàn phần** 👆']
});
const TUBE = [['cbc', '#a985e8', 'Công thức máu', 'Hb, tiểu cầu'], ['dm', '#7cc7f2', 'Đông máu', 'PT, aPTT, fibrinogen'], ['lac', '#ffffff', 'Khí máu, lactate', 'mô thiếu oxy?'], ['sh', '#f5c542', 'Sinh hóa', 'thận, điện giải'], ['nm', '#ff8fb1', 'Nhóm máu, phản ứng chéo', 'chuẩn bị truyền']];
kit('bs-ong', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => TUBE.every(([k]) => seen(s, k)),
  draw: s => {
    let o = card(20, 20, 530, 316, '#fffdfa') + T(285, 48, 'Mỗi ống trả lời một câu hỏi — chạm từng ống', { s: 14 });
    o += TUBE.map(([k, cap, a, b], i) => { const x = 50 + i * 102, sn = seen(s, k);
      return `<g class="tap" data-set="!${k}">${k === 'lac' ? `<rect x="${x + 26}" y="70" width="16" height="140" rx="6" fill="#f4f0fb" stroke="${C.soft}"/><rect x="${x + 22}" y="66" width="24" height="12" rx="4" fill="${C.mute}"/><path d="M${x + 34} 210 V236" stroke="${C.mute}" stroke-width="2"/>` : `<rect x="${x + 18}" y="70" width="32" height="18" rx="6" fill="${cap}" stroke="${C.soft}"/><rect x="${x + 21}" y="86" width="26" height="130" rx="12" fill="#fff" stroke="${C.soft}"/><rect x="${x + 23}" y="${sn ? 130 : 200}" width="22" height="${sn ? 84 : 14}" rx="10" fill="#c8283c">${sn && ZS.fresh(s, z => seen(z, k)) ? `<animate attributeName="y" from="200" to="130" dur=".6s" fill="freeze"/><animate attributeName="height" from="14" to="84" dur=".6s" fill="freeze"/>` : ''}</rect>`}${T(x + 34, 258, a.split(', ')[0], { s: 12.5 })}${a.includes(', ') ? T(x + 34, 274, a.split(', ')[1], { s: 12.5 }) : ''}${sn ? `<g class="fadein">${T(x + 34, 302, b, { s: 11.5, c: C.redD })}</g>` : T(x + 34, 302, '👆', { s: 13, c: C.soft })}</g>`; }).join('');
    return o;
  },
  say: s => TUBE.every(([k]) => seen(s, k)) ? ['happy', 'Hậu quả: **công thức máu, đông máu + fibrinogen, lactate, thận**. Chuẩn bị: **nhóm máu, phản ứng chéo**, báo ngân hàng máu sớm.'] : ['happy', 'Lấy máu một lần cho nhiều câu hỏi. Chạm **từng ống** 👆']
});
const BAG = [['hc', '#9b1c2e', 'Hồng cầu', 'mang oxy', 'Hb thấp'], ['ht', '#f2c14e', 'Huyết tương', 'yếu tố đông', 'PT/aPTT kéo dài'], ['fib', '#f7e7a6', 'Fibrinogen / tủa lạnh', 'đích ≥ 2 g/L', 'fibrinogen 1,4 g/L'], ['tc', '#f5d9a0', 'Tiểu cầu', 'khi < 50 + chảy máu vi mạch', 'tiểu cầu 40 · rỉ máu']];
kit('bs-tui', {
  init: () => ({ sel: '', seen: '' }), ui: () => [{ t: 'seg', k: 'sel', opts: BAG.map(([k, , , , lab]) => [k, lab]) }], after: s => markSeen(s, s.sel), goal: s => BAG.every(([k]) => seen(s, k)),
  draw: s => {
    let o = card(20, 20, 530, 316, '#fffdfa') + T(285, 46, 'Kết quả nào → túi nào? Chọn kết quả ở trên', { s: 14 });
    o += BAG.map(([k, col, a, b, lab], i) => { const x = 36 + i * 128, sn = seen(s, k);
      return `<g class="${s.sel === k ? 'bob' : ''}"><rect x="${x}" y="62" width="116" height="40" rx="12" fill="${s.sel === k ? '#ffc2cf' : sn ? '#ffe0e6' : '#fff'}" stroke="${sn ? C.pinkD : C.soft}" stroke-dasharray="${sn ? '' : '5 4'}"/>${T(x + 58, 87, lab, { s: 12 })}${sn ? arrow(`M${x + 58} 106 V126`, C.red, 3) : ''}<g opacity="${sn ? 1 : .35}"><rect x="${x + 22}" y="132" width="72" height="104" rx="18" fill="${col}" stroke="${C.soft}"/><rect x="${x + 50}" y="122" width="16" height="12" rx="3" fill="#ddd"/><rect x="${x + 32}" y="150" width="52" height="26" rx="6" fill="#fff" opacity=".85"/>${T(x + 58, 168, '🩸', { s: 12 })}</g>${T(x + 58, 262, a.split(' / ')[0], { s: 13.5 })}${sn ? `<g class="fadein">${T(x + 58, 284, b.length > 18 ? b.slice(0, b.indexOf(' +')) : b, { s: 12, c: C.redD })}${b.length > 18 ? T(x + 58, 300, b.slice(b.indexOf('+')), { s: 12, c: C.redD }) : ''}</g>` : ''}</g>`; }).join('');
    o += T(285, 330, 'điều chỉnh theo xét nghiệm & quy trình — không một tỉ lệ cố định cho mọi người', { s: 11.5, c: C.mute });
    return o;
  },
  say: s => BAG.every(([k]) => seen(s, k)) ? ['happy', '**Hồng cầu** mang oxy; **huyết tương, fibrinogen, tiểu cầu** sửa đông cầm máu. WHO 2025: fibrinogen **≥ 2 g/L**; tiểu cầu **< 50** + chảy máu vi mạch → cân nhắc.'] : ['happy', 'Mỗi chế phẩm sửa **một thiếu hụt**. Chọn **từng kết quả** ở trên để nối với túi 👆']
});
B['xet-nghiem-truyen-mau'] = [
  { t: 'Hb đầu tiên có thể chưa thấp', kit: 'bs-hb' },
  { t: 'Mỗi ống một câu hỏi', kit: 'bs-ong' },
  { t: 'Chế phẩm nào sửa cái gì', kit: 'bs-tui' }
];

// ═════════ Vì sao bù dịch quá mức cũng có thể gây hại?
kit('bs-tamgiac', {
  init: () => ({ l: 0 }), ui: () => [{ t: 'range', k: 'l', label: '💧 Dịch lạnh đổ vào', min: 0, max: 4, step: .5, unit: ' L' }], goal: s => s.l >= 3,
  draw: s => {
    const f = s.l / 4, sp = (6 - 4.5 * f).toFixed(2), temp = (37 - 2.6 * f).toFixed(1);
    let o = card(20, 20, 330, 316, '#fffdfa') + `<g><path d="M185 70 A100 100 0 1 1 184 70" fill="none" stroke="${f > .5 ? C.red : C.grid}" stroke-width="5" stroke-dasharray="14 10"><animateTransform attributeName="transform" type="rotate" from="0 185 170" to="360 185 170" dur="${sp}s" repeatCount="indefinite"/></path></g>`;
    o += [[185, 62, '🧊 Hạ nhiệt'], [96, 230, '🧪 Toan'], [274, 230, '🩸 Đông máu kém']].map(([x, y, t]) => `<rect x="${x - 64}" y="${y - 20}" width="128" height="40" rx="20" fill="#fff" stroke="${f > .5 ? C.red : C.soft}" stroke-width="1.6"/>` + T(x, y + 5, t, { s: 13.5 })).join('');
    o += T(185, 168, 'mất máu', { s: 14 }) + T(185, 188, 'thêm', { s: 14 }) + drops(185, 216, Math.round(1 + 3 * f), .7, 14);
    o += card(362, 20, 188, 316) + T(456, 56, 'Thân nhiệt', { s: 13, c: C.mute }) + T(456, 92, temp + '°C', { s: 26, c: f > .5 ? C.cap : C.ink });
    o += T(456, 140, 'Yếu tố đông', { s: 13, c: C.mute }) + ZS.bar(380, 150, 150, 100 - 55 * f, f > .5 ? C.red : C.green, '', { h: 14 }) + T(456, 196, 'Oxy mang theo', { s: 13, c: C.mute }) + ZS.bar(380, 206, 150, 100 - 35 * f, f > .5 ? C.amber : C.green, '', { h: 14 });
    o += T(456, 268, 'pha loãng + lạnh', { s: 13, c: f > .5 ? C.redD : C.mute }) + T(456, 288, '→ vòng xoắn quay nhanh', { s: 13, c: f > .5 ? C.redD : C.mute }) + T(456, 322, 'số minh họa', { s: 10.5, c: C.mute });
    return o;
  },
  say: s => s.l >= 3 ? ['ouch', 'Quá nhiều dịch **không mang oxy**, lại **lạnh** → pha loãng yếu tố đông, hạ nhiệt, toan → máu khó đông → **mất máu thêm**. Dịch chỉ là **cầu nối**.'] : ['happy', 'Kéo thanh **💧 Dịch lạnh đổ vào** — nhìn vòng xoắn ở giữa 👆']
});
const FL = [['nacl', 'NaCl 0,9% / Ringer', '✓ đẳng trương: ở lại lòng mạch', true], ['glu', 'Glucose 5%', '✗ thành nước, rời lòng mạch nhanh', false], ['keo', 'Dịch keo', '✗ không thay yếu tố đông, không mặc định', false], ['mau', 'Máu & chế phẩm', '✓ giải quyết thật sự', true]];
kit('bs-chai', {
  init: () => ({ sel: '', seen: '' }), ui: () => [], after: (s, k) => { if (k === 'sel') markSeen(s, s.sel); }, goal: s => FL.every(([k]) => seen(s, k)),
  draw: s => {
    const cur = FL.find(([k]) => k === s.sel);
    let o = FL.map(([k, t, , good], i) => { const x = 20 + i * 106, on = s.sel === k, sn = seen(s, k);
      return `<g class="tap" data-set="sel=${k}">${card(x, 20, 98, 150, on ? (good ? C.mint : '#ffd0d8') : '#fff', on ? C.soft : sn ? C.mintD : C.grid)}${k === 'mau' ? `<rect x="${x + 24}" y="36" width="50" height="70" rx="14" fill="#9b1c2e"/>` : pic('sv-dich-truyen.png', x + 19, 30, 60, 84)}${ZS.wrap(t, 12).map((l, j) => T(x + 49, 134 + j * 16, l, { s: 12 })).join('')}</g>`; }).join('');
    o += card(450, 20, 100, 150) + T(500, 80, '👆', { s: 26 }) + T(500, 112, 'chọn chai', { s: 12.5, c: C.mute });
    // lòng mạch & mô: dịch đi đâu
    o += card(20, 182, 530, 154, '#fffdfa') + `<rect x="40" y="226" width="490" height="60" rx="30" fill="#ffe1e4" stroke="${C.redD}" stroke-width="2"/>` + T(285, 214, 'lòng mạch', { s: 12.5, c: C.redD }) + T(285, 318, 'mô xung quanh', { s: 12.5, c: C.mute });
    if (cur) { const [k, , msg, good] = cur, leak = k === 'glu';
      o += flow('M50 256 H520', 6, k === 'mau' ? '#c8283c' : '#7cb8f0', 3, 6, { st: '#fff' }) + (leak ? [120, 220, 320, 420].map(x => flow(`M${x} 270 V312`, 1, '#7cb8f0', 1.2, 5)).join('') : '');
      o += `<g class="fadein">${T(285, 344, msg, { s: 13.5, c: good ? C.green : C.redD })}</g>`; }
    return o;
  },
  say: s => FL.every(([k]) => seen(s, k)) ? ['happy', 'Cầu nối: **tinh thể đẳng trương**. **Glucose** không dùng hồi sức thể tích; **dịch keo** không thay yếu tố đông. Giải quyết thật: **máu & cầm máu**.'] : ['happy', 'Chạm **từng chai** — nhìn dịch ở lại lòng mạch hay thoát ra 👆']
});
ZS.BK.tfKit('bs-goi', [['Vận mạch thay được bù thể tích', false, 'Vận mạch không thay cầm máu và bù thể tích/máu.'], ['Corticoid, bicarbonate cho mọi ca', false, 'Không có gói thuốc cho mọi sốc mất máu; chỉ định theo tình huống.'], ['Lấy CVP làm đích duy nhất', false, 'Một con số đơn độc không đủ: đọc tưới máu, sinh hiệu, nước tiểu, lactate.'], ['Giữ ấm người, dịch và máu', true, 'Hạ thân nhiệt làm rối loạn đông máu nặng thêm.'], ['Theo dõi điện giải khi truyền lớn', true, 'Truyền khối lượng lớn dễ rối loạn điện giải (kali, canxi…).'], ['Bù đúng thành phần đang thiếu', true, 'Hồng cầu mang oxy; huyết tương, fibrinogen, tiểu cầu sửa rối loạn đông.']], 'Không có **“gói thuốc”** cho mọi sốc mất máu: vận mạch **không thay** cầm máu & thể tích. Giữ ấm, theo dõi điện giải, bù **đúng thứ đang thiếu**.', null, { ask: 'Nên hay không nên?' });
B['vong-xoan-va-dich'] = [
  { t: 'Tam giác chết: lạnh, toan, đông kém', kit: 'bs-tamgiac' },
  { t: 'Dịch nào làm cầu nối?', kit: 'bs-chai', cr: 'Chai dịch: ' + SV },
  { t: 'Không có “gói thuốc” cho mọi sốc', kit: 'bs-goi' }
];

// ═════════ Thế nào là hồi sức đang có hiệu quả?
kit('bs-hieu', {
  init: () => ({ kb: 'tot', seen: 'tot,', t: 0 }), ui: () => [{ t: 'seg', k: 'kb', opts: [['tot', '📈 Đang tốt lên'], ['ha', '🎭 Chỉ HA đẹp']] }, { t: 'range', k: 't', label: '⏱ Sau hồi sức', min: 0, max: 60, step: 10, unit: ' phút' }], after: s => markSeen(s, s.kb), goal: s => seen(s, 'ha') && s.t >= 40,
  draw: s => {
    const f = s.t / 60, good = s.kb === 'tot';
    const G = [['🩸', 'Máu còn chảy?', good ? 1 - f : .9 - .1 * f, true], ['🧠', 'Tri giác, da', good ? .3 + .7 * f : .4, false], ['💧', 'Nước tiểu', good ? .2 + .7 * f : .25, false], ['🧪', 'Lactate giảm?', good ? .2 + .7 * f : .15, false], ['🩺', 'Huyết áp', .4 + .5 * f, false]];
    let o = card(20, 20, 530, 316, '#fffdfa');
    o += G.map(([ic, t, v, inv], i) => { const y = 44 + i * 50, okv = inv ? v < .4 : v > .6; return T(48, y + 20, ic, { s: 20 }) + T(76, y + 18, t, { a: 'start', s: 14 }) + ZS.bar(230, y + 6, 220, v * 100, okv ? C.green : i === 4 ? C.cap : C.red, '', { h: 14 }) + T(470, y + 19, okv ? '✓' : '✗', { a: 'start', s: 16, c: okv ? C.green : C.redD }); }).join('');
    o += verdict(40, 290, 490, good && f >= .6, good ? (f >= .6 ? 'Hồi sức đang hiệu quả' : 'đang cải thiện…') : 'HA đẹp nhưng chưa hiệu quả');
    return o;
  },
  say: s => seen(s, 'ha') && s.t >= 40 ? ['worry', 'Hiệu quả = **máu ngừng chảy** + **tưới máu, tri giác, nước tiểu, lactate** cải thiện. Một con số HA đẹp **chưa đủ** để kết thúc cấp cứu.'] : ['happy', 'Kéo **⏱ thời gian**, rồi đổi sang **🎭 Chỉ HA đẹp** — so hai bảng điểm 👆']
});
kit('bs-kin2', {
  init: () => ({ t: 0, bung: false }), ui: () => [{ t: 'range', k: 't', label: '⏱ Theo dõi', min: 0, max: 60, step: 10, unit: ' phút' }, { t: 'tog', k: 'bung', label: '🔎 Khám bụng' }], goal: s => s.bung && s.t >= 30,
  draw: s => {
    const f = s.t / 60;
    let o = card(20, 20, 290, 316, '#fffdfa') + `<svg x="24" y="22" width="282" height="312" viewBox="190 240 340 540" preserveAspectRatio="xMidYMid meet"><image href="${ZS.BK.I}sv-mang-thai.png" width="560" height="966"/></svg>`;
    if (s.bung) o += ZS.fade(`<ellipse cx="62" cy="262" rx="${14 + 12 * f}" ry="${9 + 10 * f}" fill="${C.red}" opacity=".65"/>` + Th(54, 228, 'máu tự do', { s: 11.5, c: C.redD }) + Th(54, 241, 'trong ổ bụng', { s: 11.5, c: C.redD }), ZS.fresh(s, x => x.bung));
    o += card(322, 20, 228, 316) + T(436, 50, 'Máu ra âm đạo', { s: 13, c: C.mute }) + ZS.bar(346, 60, 180, 80 - 70 * f, C.red, '', { h: 12 }) + T(436, 96, f > .3 ? 'ÍT LẠI ↓' : 'nhiều', { s: 15, c: f > .3 ? C.green : C.redD });
    o += vital(342, 116, 'Mạch', Math.round(118 + 20 * f), '#ff8fa8', 188) + vital(342, 170, 'Tri giác', f > .3 ? 'lơ mơ' : 'tỉnh', f > .3 ? '#ff6b7a' : '#7ee2b8', 188) + vital(342, 224, 'Da', f > .3 ? 'lạnh' : 'mát', f > .3 ? '#ff6b7a' : '#ffb15c', 188);
    o += T(436, 296, f > .3 ? 'không khớp nhau!' : '', { s: 14, c: C.redD });
    return o;
  },
  say: s => s.bung && s.t >= 30 ? ['ouch', 'Máu ngoài **ít lại** mà mạch nhanh, lơ mơ, bụng đau tăng → **chảy máu kín**. Chưa kiểm soát được — đánh giá lại ngay.'] : ['happy', 'Kéo **⏱ Theo dõi** tới 30 phút, rồi bấm **🔎 Khám bụng** 👆']
});
const HO = [['⏱', 'Khởi phát lúc', '21:10'], ['🩸', 'Máu ước / đo', '≈ 1.800 mL (cân gạc)'], ['🔎', 'Nguồn nghi ngờ', 'đờ tử cung + rách CTC'], ['📈', 'Sinh hiệu theo giờ', 'mạch 132 → 98'], ['💉', 'Dịch, máu, thuốc + đáp ứng', '2 L tinh thể, 4 đv HC, TXA'], ['🗓', 'Kế hoạch tiếp', 'thận · đông máu · tâm lý']];
kit('bs-giao', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => HO.every((_, i) => seen(s, 'h' + i)),
  draw: s => {
    let o = `<rect x="20" y="30" width="530" height="306" rx="14" fill="#fffdf4" stroke="${C.butterD}"/><rect x="226" y="18" width="118" height="26" rx="8" fill="${C.soft}"/>` + T(285, 36, 'BÀN GIAO', { s: 13, c: '#fff' });
    o += HO.map(([ic, t, v], i) => { const x = 34 + (i % 2) * 258, y = 58 + Math.floor(i / 2) * 90, sn = seen(s, 'h' + i);
      return `<g class="tap" data-set="!h${i}">${card(x, y, 246, 80, sn ? '#fff' : '#f7f4fc', sn ? C.mintD : C.grid)}${T(x + 18, y + 32, ic, { a: 'start', s: 18 })}${T(x + 48, y + 30, t, { a: 'start', s: 13, c: C.mute })}${sn ? `<g class="fadein">${T(x + 48, y + 56, v, { a: 'start', s: 14 })}</g>` : T(x + 48, y + 56, '👆 chạm để ghi', { a: 'start', s: 12.5, c: C.soft })}</g>`; }).join('');
    return o;
  },
  say: s => HO.every((_, i) => seen(s, 'h' + i)) ? ['happy', 'Bàn giao đủ: **giờ khởi phát, máu mất, nguồn nghi, diễn tiến sinh hiệu, dịch–máu–thuốc + đáp ứng**, kế hoạch tiếp (thận, đông máu, thiếu máu, tâm lý).'] : ['happy', 'Chuyển mẹ lên hồi sức. Chạm từng ô để **điền phiếu bàn giao** 👆']
});
B['danh-gia-lai-soc'] = [
  { t: 'Hiệu quả không chỉ là HA', kit: 'bs-hieu' },
  { t: 'Máu ngoài ít đi mà mẹ xấu hơn', kit: 'bs-kin2', cr: 'Thai phụ: ' + SV },
  { t: 'Bàn giao đủ ý', kit: 'bs-giao' }
];
})();
