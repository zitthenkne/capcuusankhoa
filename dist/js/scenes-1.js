'use strict';
/* Họ "hemo": đường cong bù trừ khi mất máu (nhịp tim, HATT, shock index), phân độ sốc, vận chuyển oxy, xét nghiệm lúc đầu. */
(() => {
const { C, T, kit, plot, clamp, arrow, bar, lab, legend } = window.ZS;
// mô hình minh họa theo bảng học phần: Độ I ≈15% · II 20–25% · III 30–35% · IV 40–45% (không phải công thức chẩn đoán)
const HR = L => 72 + 1.1 * L + .012 * L * L, SBP = L => L <= 20 ? 118 - .15 * L : 115 - (L - 20) * 1.6 - (L - 20) ** 2 * .02, SI = L => HR(L) / SBP(L);
const GR = [['I', 'Độ I', '≈15%', 'Mạch / HA có thể còn bình thường', 15, '#fff3c4'], ['II', 'Độ II', '20–25%', 'Mạch nhanh, tưới máu ngoại vi giảm, thở nhanh', 22, '#ffe6d5'], ['III', 'Độ III', '30–35%', 'Hạ HA rõ, lạnh/tái, thiểu niệu, toan', 33, '#ffe0ec'], ['IV', 'Độ IV', '40–45%', 'Trụy tuần hoàn, mạch ngoại vi khó bắt', 43, '#ebe4ff']];
const BANDS = [{ x0: 0, x1: 17.5, fill: '#fff3c4', label: 'I' }, { x0: 17.5, x1: 27.5, fill: '#ffe6d5', label: 'II' }, { x0: 27.5, x1: 37.5, fill: '#ffe0ec', label: 'III' }, { x0: 37.5, x1: 50, fill: '#ebe4ff', label: 'IV' }];
const gradeOf = L => L < 17.5 ? 0 : L < 27.5 ? 1 : L < 37.5 ? 2 : 3;
const xax = { xr: [0, 50], xt: 5, fx: v => v + '%' };

kit('hemo', {
  zones: (s, sp) => {
    const P1 = { x: 48, y: 34, w: 326, h: 128 }, X = v => P1.x + v / 50 * P1.w, Y = (v) => P1.y + P1.h - (v - 40) / 130 * P1.h;
    if (sp.mode === 'grade') return { g12: [X(14.5), 98, 54, 80], g3: [X(32.5), 98, 30, 80], g4: [X(43.5), 98, 40, 80] };
    if (sp.mode === 'si') return { hr: [48, 140, 22, 90], sbp: [210, 304, 130, 14], sector: [120, 76, 70, 38] };
    if (sp.mode === 'do2') return { vol: [X(20), Y(100) + 30, 80, 38], do2: [X(30), Y(55) + 8, 60, 38], hb: [X(38), Y(40) + 16, 60, 30] };
    if (sp.mode === 'labs') return { hct: [X(24), 80, 90, 36], fib: [X(36), 216 + 30, 100, 30], org: [470, 200, 62, 70] };
    return { vol: [X(s.loss), 140, 14, 104], hr: [X(20), Y(HR(20)), 40, 30], sbp: [X(40), Y(SBP(40)), 50, 36] };
  },
  init: sp => ({ loss: sp.mode === 'grade' ? 15 : sp.mode === 'si' ? 0 : sp.mode === 'labs' ? 25 : 20, fluid: false, grade: 'I', hr: 100, sbp: 110, time: 'now' }),
  ui: (s, sp) => sp.mode === 'grade' ? [{ t: 'seg', k: 'grade', opts: GR.map(g => [g[0], g[1] + ' · ' + g[2]]) }]
    : sp.mode === 'si' ? [{ t: 'range', k: 'hr', label: '💓 Nhịp tim', min: 50, max: 170, step: 5, unit: ' l/ph' }, { t: 'range', k: 'sbp', label: '🩺 HA tâm thu', min: 60, max: 180, step: 5, unit: ' mmHg' }]
    : sp.mode === 'do2' ? [{ t: 'range', k: 'loss', label: '🩸 Máu đã mất', min: 0, max: 50, step: 5, unit: '%' }, { t: 'tog', k: 'fluid', label: '💧 Truyền dịch tinh thể' }]
    : sp.mode === 'labs' ? [{ t: 'range', k: 'loss', label: '🩸 Máu đã mất (toàn phần)', min: 0, max: 50, step: 5, unit: '%' }, { t: 'seg', k: 'time', opts: [['now', '⏱️ Xét nghiệm ngay lúc đầu'], ['later', '⏳ Sau khi dịch cân bằng']] }]
    : [{ t: 'range', k: 'loss', label: '🩸 Máu đã mất', min: 0, max: 50, step: 5, unit: '%' }],
  draw: (s, sp) => {
    const m = sp.mode || 'vitals', L = m === 'grade' ? GR.find(g => g[0] === s.grade)[4] : s.loss;
    if (m === 'si') {
      const P = plot({ x: 58, y: 26, w: 300, h: 238, xr: [60, 180], yr: [40, 180], xt: 6, yt: 7, xl: 'HA tâm thu (mmHg)', yl: 'Nhịp tim (lần/phút)' });
      const X = P.X, Y = P.Y, si = s.hr / s.sbp;
      let o = P.svg + `<path d="M${X(60)} ${Y(60 * .9)} L${X(180)} ${Y(Math.min(180, 180 * .9))}" stroke="${C.amber}" stroke-width="2.5" stroke-dasharray="7 5"/><path d="M${X(60)} ${Y(60)} L${X(180)} ${Y(180)}" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
      o += `<path d="M${X(60)} ${Y(60)} L${X(180)} ${Y(180)} L${X(60)} ${Y(180)}Z" fill="${C.red}" opacity=".08"/>` + T(X(75), Y(150), 'SI > 1', { s: 13, c: C.redD }) + T(X(146), Y(118), 'SI 0,9', { s: 11, c: C.amber, a: 'start' });
      let tr = ''; for (let l = 0; l <= 50; l += 5) tr += `${l ? 'L' : 'M'}${X(SBP(l))} ${Y(HR(l))}`; o += `<path d="${tr}" fill="none" stroke="${C.soft}" stroke-width="2.5" stroke-dasharray="2 7" stroke-linecap="round"/>` + T(X(112), Y(142), 'đường đi khi mất máu →', { s: 10.5, c: C.soft, a: 'start' });
      o += `<path d="M${X(s.sbp)} ${Y(40)} V${Y(s.hr)} H${X(60)}" fill="none" stroke="${si > 1 ? C.red : si > .9 ? C.amber : C.green}" stroke-width="2" stroke-dasharray="4 4"/><circle cx="${X(s.sbp)}" cy="${Y(s.hr)}" r="8" fill="${si > 1 ? C.red : si > .9 ? C.amber : C.green}" stroke="#fff" stroke-width="3"/>`;
      o += `<g transform="translate(390 40)"><rect width="156" height="224" rx="20" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>${T(78, 30, 'Shock index', { s: 13, c: C.mute })}${T(78, 70, 'HR ÷ HATT', { s: 12 })}${T(78, 108, `${s.hr} ÷ ${s.sbp}`, { s: 22 })}${T(78, 158, '= ' + si.toFixed(2).replace('.', ','), { s: 38, c: si > 1 ? C.redD : si > .9 ? C.amber : C.green })}${T(78, 196, si > 1 ? '> 1 (WHO 2025)' : si > .9 ? '> 0,9 (FIGO 2022)' : 'dưới 0,9', { s: 12, c: C.mute })}${T(78, 214, 'không đổi ra % máu mất', { s: 10.5, c: C.mute })}</g>`;
      return o;
    }
    const P1 = plot({ x: 48, y: 32, w: 326, h: m === 'do2' || m === 'labs' ? 128 : 108, ...xax, yr: [40, 170], yt: 4, bands: BANDS, curves: [{ f: HR, col: C.red, w: 3.4 }, { f: SBP, col: C.cap, w: 3.4 }], vl: [{ x: L }], fy: v => Math.round(v) });
    const gi = gradeOf(L);
    let o = P1.svg + legend(54, 22, [[C.red, 'Nhịp tim'], [C.cap, 'HA tâm thu']]);
    if (m !== 'do2' && m !== 'labs') {
      const P2 = plot({ x: 48, y: 172, w: 326, h: 72, ...xax, yr: [.4, 2.4], yt: 4, bands: BANDS.map(b => ({ ...b, label: '' })), curves: [{ f: SI, col: C.ink, w: 3.4 }], hl: [{ y: .9, c: C.amber }, { y: 1, c: C.red }], vl: [{ x: L }], fy: v => v.toFixed(1).replace('.', ','), xl: 'máu mất (% thể tích)' });
      o += P2.svg + legend(54, 165, [[C.ink, 'Shock index = nhịp tim ÷ HA tâm thu']]) + T(370, P2.Y(.9) + 12, '0,9', { a: 'end', s: 10.5, c: C.amber }) + T(370, P2.Y(1) - 4, '1', { a: 'end', s: 10.5, c: C.red });
      o += `<circle cx="${P1.X(L)}" cy="${P1.Y(HR(L))}" r="6" fill="${C.red}" stroke="#fff" stroke-width="2.5"/><circle cx="${P1.X(L)}" cy="${P1.Y(SBP(L))}" r="6" fill="${C.cap}" stroke="#fff" stroke-width="2.5"/><circle cx="${P2.X(L)}" cy="${P2.Y(SI(L))}" r="6" fill="${C.ink}" stroke="#fff" stroke-width="2.5"/>`;
      if (m === 'grade') {
        const SG = [['💓', 'Mạch nhanh', 1], ['🫁', 'Thở nhanh', 1], ['🥶', 'Tưới máu ngoại vi giảm', 1], ['📉', 'Hạ HA rõ · lạnh tái', 2], ['💧', 'Thiểu niệu · toan', 2], ['🫥', 'Mạch ngoại vi khó bắt', 3], ['💔', 'Trụy tuần hoàn', 3]], g = GR[gi];
        o += `<g transform="translate(392 32)"><rect width="156" height="226" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="1.6"/><rect x="8" y="8" width="140" height="34" rx="12" fill="${g[5]}"/>${T(78, 30, g[1] + ' · ' + g[2], { s: 13.5 })}` + SG.map(([ic, t, min], i) => `<g transform="translate(14 ${52 + i * 21})" opacity="${gi >= min ? 1 : .28}"><text font-size="14" y="12">${ic}</text>${T(26, 12, t, { a: 'start', s: 10.5 })}</g>`).join('') + (gi === 0 ? T(78, 214, 'mạch / HA có thể còn bình thường', { s: 9.5, c: C.mute }) : T(78, 214, `tim ${Math.round(HR(L))} · HA ${Math.round(SBP(L))} · SI ${SI(L).toFixed(2).replace('.', ',')}`, { s: 10.5, c: C.mute })) + `</g>`;
      } else {
        // cơ thể bù trừ: tim nhanh + co mạch giữ HA → tới giới hạn thì mất bù
        const hr = Math.round(HR(L)), vw = clamp(1 - L / 55, .25, 1), uo = Math.round(clamp(60 - (L > 15 ? (L - 15) * 2.2 : 0), 3, 60)), st = L < 15 ? ['bình thường', C.green, C.mint] : L < 30 ? ['CÒN BÙ · HA còn giữ', C.amber, C.butter] : ['MẤT BÙ · HA tụt', C.redD, C.pink];
        o += `<g transform="translate(392 32)"><rect width="156" height="226" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="1.6"/>${T(78, 22, 'Cơ thể bù trừ', { s: 12 })}`;
        o += `<g transform="translate(30 58)"><g class="beat" style="animation-duration:${(60 / hr).toFixed(2)}s"><path d="M0 14 C-18 2 -13 -12 -4 -10 C-2 -9 0 -8 0 -6 C0 -8 2 -9 4 -10 C13 -12 18 2 0 14Z" fill="${C.red}"/></g></g>` + T(54, 54, 'Tim', { a: 'start', s: 10.5, c: C.mute }) + T(54, 70, hr + ' l/ph', { a: 'start', s: 13, c: hr > 100 ? C.redD : C.ink });
        o += `<path d="M12 106 H48" stroke="${C.pinkD}" stroke-width="${(14 * vw).toFixed(1)}" stroke-linecap="round"/><path d="M12 106 H48" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 6" class="flow"/>` + T(54, 102, 'Mạch ngoại vi', { a: 'start', s: 10.5, c: C.mute }) + T(54, 117, vw < .7 ? 'CO lại · da lạnh' : 'bình thường', { a: 'start', s: 11.5, c: vw < .7 ? C.cap : C.ink });
        o += `<text x="30" y="160" text-anchor="middle" font-size="20">💧</text>` + T(54, 150, 'Nước tiểu', { a: 'start', s: 10.5, c: C.mute }) + T(54, 165, uo + ' mL/giờ', { a: 'start', s: 12.5, c: uo < 30 ? C.redD : C.ink });
        o += `<rect x="8" y="180" width="140" height="38" rx="12" fill="${st[2]}"/>${T(78, 204, st[0], { s: 11.5, c: st[1] })}</g>`;
      }
      if (m === 'vitals') o += T(60, 306, `tim ${Math.round(HR(L))} · HA ${Math.round(SBP(L))} · SI ${SI(L).toFixed(2).replace('.', ',')}`, { a: 'start', s: 12.5 });
      return o;
    }
    if (m === 'do2') {
      const fl = s.fluid, V = v => fl ? 95 : 100 - v, Hbc = v => fl ? (100 - v) / .95 : 100, D = v => V(v) * Hbc(v) / 100;
      const P = plot({ x: 48, y: 34, w: 326, h: 226, ...xax, yr: [0, 110], yt: 5, fy: v => Math.round(v) + '', xl: 'máu mất (% thể tích)', curves: [{ f: v => 100 - v, col: C.skyD, w: 2.4, dash: '3 6' }, { f: V, col: C.cap, w: 3.4 }, { f: Hbc, col: C.red, w: 3.4 }, { f: D, col: C.green, w: 4 }], vl: [{ x: L }] });
      o = P.svg + T(60, 28, '% so với bình thường', { a: 'start', s: 11, c: C.mute }) + legend(56, 303, [[C.cap, 'Thể tích tuần hoàn'], [C.red, 'Hb mỗi lít máu'], [C.green, 'Oxy tới mô'], [C.skyD, 'Thể tích nếu không truyền dịch', '3 6']], { w: 500 }) + `<circle cx="${P.X(L)}" cy="${P.Y(V(L))}" r="6" fill="${C.cap}" stroke="#fff" stroke-width="2.5"/><circle cx="${P.X(L)}" cy="${P.Y(Hbc(L))}" r="6" fill="${C.red}" stroke="#fff" stroke-width="2.5"/><circle cx="${P.X(L)}" cy="${P.Y(D(L))}" r="7" fill="${C.green}" stroke="#fff" stroke-width="2.5"/>`;
       o += `<g transform="translate(392 34)"><rect width="156" height="226" rx="20" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>${[['Thể tích tuần hoàn', 'tim có gì để bơm', V(L), C.cap], ['Hb trong mỗi lít', 'xe chở oxy', Hbc(L), C.red], ['Oxy tới mô', '= dòng × nồng độ Hb', D(L), C.green]].map(([a, b, v, c], i) => `<g transform="translate(12 ${14 + i * 74})">${T(0, 12, a, { a: 'start', s: 12.5 })}${T(0, 27, b, { a: 'start', s: 10, c: C.mute })}${bar(0, 38, 130, v, c, '')}${T(130, 66, Math.round(v) + '%', { a: 'end', s: 12 })}</g>`).join('')}</g>`;
      return o;
    }
    const later = s.time === 'later', Hct = v => later ? 38 * (1 - 1.15 * v / 100) : 38, Fib = v => 4.5 * (1 - (later ? 1.35 : .3) * v / 100);
    const Pa = plot({ x: 48, y: 34, w: 326, h: 108, ...xax, yr: [10, 45], yt: 5, fy: v => Math.round(v), curves: [{ f: () => 38, col: C.grid, w: 2, dash: '2 5' }, { f: Hct, col: C.red, w: 3.6 }], vl: [{ x: L }] });
    const Pb = plot({ x: 48, y: 190, w: 326, h: 94, ...xax, yr: [0, 5], yt: 5, fy: v => v.toFixed(0), xl: 'máu mất (% thể tích)', curves: [{ f: Fib, col: C.amber, w: 3.6 }], hl: [{ y: 2, c: C.redD, label: 'mốc bù ≥ 2 g/L' }], vl: [{ x: L }] });
    o = Pa.svg + Pb.svg + legend(54, 22, [[C.red, 'Hct (%) — hồng cầu'], [C.grid, 'bình thường ≈ 38%', '2 5']]) + legend(54, 180, [[C.amber, 'Fibrinogen (g/L)']]) + `<circle cx="${Pa.X(L)}" cy="${Pa.Y(Hct(L))}" r="6" fill="${C.red}" stroke="#fff" stroke-width="2.5"/><circle cx="${Pb.X(L)}" cy="${Pb.Y(clamp(Fib(L), 0, 5))}" r="6" fill="${C.amber}" stroke="#fff" stroke-width="2.5"/>`;
    const hc = Hct(L) / 38, tube = (x) => `<rect x="${x}" y="60" width="48" height="170" rx="24" fill="#fff" stroke="${C.soft}" stroke-width="2.5"/><clipPath id="tbx"><rect x="${x + 3}" y="63" width="42" height="164" rx="21"/></clipPath><g clip-path="url(#tbx)"><rect x="${x}" y="60" width="48" height="170" fill="#ffe6a0"/><rect x="${x}" y="${230 - 164 * hc * .5 - 3}" width="48" height="3" fill="#fff"/><rect x="${x}" y="${230 - 164 * hc * .5}" width="48" height="${164 * hc * .5 + 3}" fill="${C.red}"/></g>`;
    o += `<g>${tube(410)}${T(434, 252, 'ống ly tâm', { s: 10.5, c: C.mute })}${lab(458, 150, 468, 110, 'huyết tương', { s: 10.5 })}${lab(458, 205, 468, 218, 'hồng cầu', { s: 10.5 })}</g>`;
    if (!later && L >= 15) o += `<g class="pulse">${T(210, 334, 'Hb/Hct còn “đẹp” dù đang mất máu toàn phần!', { s: 12.5, c: C.redD })}</g>`;
    return o;
  },
  say: (s, sp) => {
    const m = sp.mode || 'vitals', L = m === 'grade' ? GR.find(g => g[0] === s.grade)[4] : s.loss;
    if (m === 'si') { const si = s.hr / s.sbp; return si > 1 ? ['ouch', `SI ${si.toFixed(2).replace('.', ',')} > 1: vượt ngưỡng trong tổ hợp trigger WHO 2025 — đánh giá khẩn.`] : si > .9 ? ['worry', `SI ${si.toFixed(2).replace('.', ',')} > 0,9: dấu báo động theo FIGO 2022.`] : ['happy', `SI ${si.toFixed(2).replace('.', ',')}: chưa vượt dấu báo động, nhưng SI thấp KHÔNG loại trừ chảy máu nguy hiểm.`]; }
    if (m === 'grade') return ['happy', `${GR.find(g => g[0] === s.grade)[1]}: ${GR.find(g => g[0] === s.grade)[3]}. Khoảng % máu mất chỉ để hình dung, không phải công thức chẩn đoán.`];
    if (m === 'do2') return s.fluid ? ['worry', 'Dịch làm thể tích (xanh dương) về gần đủ nhưng Hb loãng đi (đỏ) → oxy tới mô (xanh lá) KHÔNG khá hơn. Dịch ≠ máu!'] : ['happy', 'Mất máu: thể tích giảm → tim bơm ít; hồng cầu mất → oxy tới mô giảm. Thử bật 💧 truyền dịch.'];
    if (m === 'labs') return s.time === 'now' ? (L >= 15 ? ['worry', 'Ngay lúc đầu: máu mất TOÀN PHẦN nên Hb/Hct chưa giảm. Đừng chờ Hb thấp mới chuẩn bị máu!'] : ['happy', 'Mất ít. Thử kéo thanh lên rồi bấm “sau khi dịch cân bằng”.']) : ['ouch', 'Sau khi dịch kéo vào/được truyền: Hb giảm, fibrinogen loãng xuống dưới mốc 2 g/L → cần bù huyết tương/chế phẩm.'];
    return L < 20 ? ['happy', 'Mất ít: tim hơi nhanh, HA gần như không đổi — dễ bỏ sót! Kéo thanh lên.'] : L < 30 ? ['worry', 'Tim nhanh, SI tăng dần; HA chưa tụt = sốc còn bù. Nhận diện ở đây là sớm nhất!'] : ['ouch', 'HA tụt, SI > 1,4, cơ quan thiếu oxy. Cần chặn chuỗi này TRƯỚC khi tới đây.'];
  }
});
})();
