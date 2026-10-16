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
  return `<rect x="${x}" y="${y}" width="${w}" height="156" rx="8" fill="#fff6f0" stroke="#f3d3c4"/><rect x="${x}" y="${y + 64 - 50 * 1.2}" width="${w}" height="${50 * 1.2}" fill="${C.mint}" opacity=".3"/><path d="${p}" fill="none" stroke="${bad || o.brady ? C.red : '#2a2a3a'}" stroke-width="1.8"/><path d="${u}" fill="none" stroke="${C.cap}" stroke-width="1.6"/>`; };
// tử cung chuyển dạ: thân dày, đoạn dưới mỏng dần; r = vị trí vòng Bandl (0–1); vo: 'nut' | 'vo'
const LU = (x, y, r, vo = '') => {
  const ring = y + 205 - 72 * r, thin = 18 - 13 * r;
  let s = `<path d="M${x - 110} ${y + 120} Q${x - 116} ${y} ${x} ${y - 6} Q${x + 116} ${y} ${x + 110} ${y + 120} L${x + 92} ${ring} Q${x + 80} ${y + 260} ${x + 28} ${y + 286} H${x - 28} Q${x - 80} ${y + 260} ${x - 92} ${ring}Z" fill="url(#gMyo)" stroke="${C.myoD}" stroke-width="1.3"/>`;
  s += `<path d="M${x - 84} ${y + 120} Q${x - 88} ${y + 24} ${x} ${y + 20} Q${x + 88} ${y + 24} ${x + 84} ${y + 120} L${x + 92 - thin} ${ring} Q${x + 80 - thin} ${y + 258} ${x + 22} ${y + 280} H${x - 22} Q${x - 80 + thin} ${y + 258} ${x - 92 + thin} ${ring}Z" fill="#fffafc" stroke="${C.decid}" stroke-width="3"/>`;
  if (r > .2) s += `<path d="M${x - 96} ${ring} Q${x} ${ring + 14} ${x + 96} ${ring}" fill="none" stroke="${C.redD}" stroke-width="2.4" stroke-dasharray="6 4"/>`;
  s += `<circle cx="${x}" cy="${y + 232}" r="46" fill="url(#gSkin)" stroke="${C.skinD}"/>`;
  if (vo === 'nut') s += `<path d="M${x + 76} ${y + 230} q10 10 4 22" fill="none" stroke="#fffafc" stroke-width="7"/><path d="M${x + 76} ${y + 230} q10 10 4 22" fill="none" stroke="${C.redD}" stroke-width="1.6" stroke-dasharray="3 3"/>`;
  if (vo === 'vo') s += `<path d="M${x + 70} ${y + 214} L${x + 104} ${y + 236} L${x + 74} ${y + 262}Z" fill="#8c2a3a"/><ellipse cx="${x + 132}" cy="${y + 250}" rx="34" ry="22" fill="${C.red}" opacity=".7"/>`;
  return s; };

// ═════════ 06 · Nứt cơ và vỡ toàn bộ bề dày
kit('bv-nut', {
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
  init: () => ({ seo: false, t: 0 }), ui: () => [{ t: 'tog', k: 'seo', label: '✂️ Tử cung CÓ sẹo mổ' }, { t: 'range', k: 't', label: '⏱ Chuyển dạ tiến triển', min: 0, max: 3, step: 1, unit: '' }], goal: s => s.seo && s.t >= 3,
  draw: s => {
    const steps = s.seo ? [['🙂', 'chuyển dạ bình thường'], ['🙂', 'vẫn có vẻ ổn'], ['🤫', 'triệu chứng nghèo'], ['💥', 'VỠ — có thể không có pha dọa']] : [['🚧', 'tắc nghẽn'], ['💪', 'co gắng vượt trở ngại'], ['⚠️', 'DỌA VỠ: Bandl, đau đoạn dưới'], ['💥', 'VỠ']];
    let o = card(20, 20, 530, 316, '#fffdfa') + T(285, 50, s.seo ? 'Tử cung có sẹo' : 'Tử cung chưa sẹo', { s: 16 });
    o += steps.map(([ic, t], i) => { const x = 40 + i * 128, on = i <= s.t; return `<g opacity="${on ? 1 : .2}" class="${on && ZS.fresh(s, z => z.t >= i && z.seo === s.seo) ? 'fadein' : ''}">${card(x, 80, 116, 150, i === 3 && on ? '#ffd0d8' : '#fff')}${T(x + 58, 140, ic, { s: 34 })}${ZS.wrap(t, 14).map((l, j) => T(x + 58, 184 + j * 18, l, { s: 12.5 })).join('')}</g>` + (i < 3 ? arrow(`M${x + 118} 156 H${x + 126}`, C.ink, 2) : ''); }).join('');
    o += T(285, 270, s.seo ? 'sẹo thân tử cung: có thể vỡ cả TRƯỚC chuyển dạ' : 'có thời gian nhận diện pha dọa vỡ', { s: 13.5, c: s.seo ? C.redD : C.green }) + T(285, 300, 'không chờ thấy phần thai trong ổ bụng mới nghi vỡ', { s: 12.5, c: C.mute });
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
const DV = [['but', '😖 Bứt rứt, lo sợ'], ['dau', '🔥 Đau liên tục đoạn dưới'], ['don', '⏩ Cơn co dồn dập'], ['bandl', '〰️ Vòng Bandl'], ['fro', '🪢 Dây chằng tròn căng (Frommel)'], ['dau2', '👶 Đầu chồng xương + thai thiếu oxy']];
kit('bv-dau', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => DV.every(([k]) => seen(s, k)),
  draw: s => {
    const n = DV.filter(([k]) => seen(s, k)).length;
    let o = DV.map(([k, t], i) => tcard('!' + k, 20, 20 + i * 52, 300, 46, seen(s, k), [t], '#ffe0e6')).join('');
    o += card(332, 20, 218, 316) + `<g transform="translate(158 40) scale(.64)">${LU(441, 30, Math.min(1, n / 5))}</g>`;
    return o;
  },
  say: s => DV.every(([k]) => seen(s, k)) ? ['worry', 'Dọa vỡ: **bứt rứt, đau đoạn dưới liên tục, cơn co dồn, vòng Bandl, Frommel**, đầu thai chồng xương + thai thiếu oxy.'] : ['happy', 'Bật từng **dấu dọa vỡ** — tử cung bên phải thay đổi theo 👆']
});
kit('bv-lam', {
  init: () => ({ c: '', seen: '' }), ui: () => [{ t: 'seg', k: 'c', opts: [['tang', '⬆️ Tăng oxytocin cho “vượt”'], ['dung', '🛑 Ngừng tăng co, gọi đội']] }], after: s => markSeen(s, s.c), goal: s => seen(s, 'tang') && seen(s, 'dung'),
  draw: s => {
    const bad = s.c === 'tang';
    let o = card(20, 20, 330, 316, '#fffdfa') + `<g transform="translate(70 30) scale(.62)">${LU(185, 36, bad ? 1 : .55, bad ? 'vo' : '')}</g>`;
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
  init: () => ({ t: 0 }), ui: () => [{ t: 'range', k: 't', label: '⏱ Phút sau khi sẹo vỡ', min: 0, max: 20, step: 2, unit: '′' }], goal: s => s.t >= 14,
  draw: s => {
    const f = s.t / 20;
    let o = card(20, 20, 360, 316, '#fffdfa') + T(200, 46, 'CTG — TOLAC', { s: 13, c: C.mute }) + ctg(36, 56, 328, 0, { brady: s.t ? 1 - Math.min(.9, f + .1) : 2 }) + ZS.legend(40, 230, [[s.t ? C.red : '#2a2a3a', 'tim thai'], [C.cap, 'cơn co']], { s: 11.5 });
    o += T(200, 270, s.t >= 2 ? 'tim thai chậm kéo dài · mất cơn co' : '', { s: 13, c: C.redD });
    const M = [['tim thai bất thường', 2], ['đau sẹo / đau mới', 6], ['ra huyết', 10], ['mẹ mạch nhanh, tụt HA', 14], ['mất độ lọt', 16]];
    o += card(392, 20, 158, 316) + T(471, 46, 'xuất hiện dần', { s: 12.5, c: C.mute }) + M.map(([t, th], i) => `<g opacity="${s.t >= th ? 1 : .2}">${T(404, 80 + i * 44, (s.t >= th ? '⚠ ' : '○ ') + t, { a: 'start', s: 12, c: s.t >= th ? C.redD : C.mute })}</g>`).join('');
    return o;
  },
  say: s => s.t >= 14 ? ['worry', '**Tim thai bất thường** thường là dấu **đầu tiên**; đau, ra huyết, sốc, mất độ lọt đến sau. **Không chờ đủ tam chứng** mới gọi mổ.'] : ['happy', 'Kéo thanh **⏱** — dấu nào xuất hiện trước? 👆']
});
tfKit('bv-ndq', [['Chờ đủ tam chứng mới gọi mổ', false], ['Đã gây tê ngoài màng cứng, không đau → yên tâm', false], ['Sau sinh sốc không tương xứng máu ngoài → tìm vỡ', true], ['Làm thêm siêu âm dù mẹ – thai đang bị đe dọa', false]], 'Không chờ tam chứng; gây tê NMC **không thay monitoring**; sau sinh sốc không tương xứng → tìm vỡ / tụ máu sâu; siêu âm **không được trì hoãn mổ**.');
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
    let o = tcard('!gon', 20, 20, 250, 70, s.gon, ['🩹 Vết vỡ gọn, đơn giản', 'tắt = phức tạp, lan rộng'], C.mint) + tcard('!on', 20, 100, 250, 70, s.on, ['🩺 Huyết động kiểm soát được', 'tắt = chảy máu không kiểm soát'], C.mint) + tcard('!bq', 20, 180, 250, 70, s.bq, ['🔍 Kiểm tra bàng quang, niệu quản'], C.sky);
    const khau = s.gon && s.on;
    o += `<rect x="290" y="20" width="260" height="190" rx="18" fill="${khau ? C.mint : '#ffe0cc'}"/>` + `<g class="fadein">${T(420, 96, khau ? '🪡 Khâu phục hồi' : '🏥 Cắt tử cung', { s: 20 })}${T(420, 128, khau ? 'giữ tử cung khi an toàn' : 'cứu sống, không chậm trễ', { s: 13, c: C.mute })}</g>`;
    o += T(420, 246, s.bq ? '✓ đánh giá tổn thương kèm' : '○ chưa kiểm tra cơ quan lân cận', { s: 13, c: s.bq ? C.green : C.redD }) + T(285, 300, 'sau vỡ: thai kỳ sau tư vấn chuyên khoa, không TOLAC thường quy', { s: 13, c: C.mute });
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
    let o = PV.map(([k, t], i) => tcard('!' + k, 20, 20 + i * 63, 300, 56, seen(s, k), [t])).join('');
    o += card(332, 20, 218, 316) + `<path d="M441 50 L520 80 V170 Q520 260 441 300 Q362 260 362 170 V80Z" fill="#f4f0fb" stroke="${C.soft}" stroke-width="2"/><clipPath id="khien"><path d="M441 50 L520 80 V170 Q520 260 441 300 Q362 260 362 170 V80Z"/></clipPath><rect clip-path="url(#khien)" x="362" y="${300 - 50 * n}" width="158" height="${50 * n}" fill="${C.mintD}" opacity=".9"/>` + T(441, 190, n + ' / 5', { s: 24 });
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
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => ['vbac', 'fail', 'ercs'].every(k => seen(s, k)),
  draw: s => {
    const box = (k, x, y, w, t, sub, col, pros) => `<g class="tap" data-set="!${k}">${card(x, y, w, seen(s, k) ? 128 : 70, seen(s, k) ? col : '#fff', seen(s, k) ? C.soft : C.grid)}${T(x + w / 2, y + 28, t, { s: 15 })}${T(x + w / 2, y + 50, sub, { s: 12, c: C.mute })}${seen(s, k) ? `<g class="fadein">${pros.map((p, i) => T(x + w / 2, y + 78 + i * 20, p, { s: 12, c: C.ink })).join('')}</g>` : T(x + w - 14, y + 20, '👆', { s: 13, c: C.soft })}</g>`;
    let o = `<rect x="40" y="24" width="220" height="56" rx="16" fill="${C.lav}"/>` + T(150, 48, 'TOLAC', { s: 17 }) + T(150, 68, 'thử chuyển dạ', { s: 12, c: C.mute }) + `<rect x="330" y="24" width="200" height="56" rx="16" fill="#f4f0fb"/>` + T(430, 48, 'Mổ lặp lại chủ động', { s: 14 }) + T(430, 68, '(ERCS)', { s: 12, c: C.mute });
    o += arrow('M110 82 L90 112', C.green, 3) + arrow('M190 82 L214 112', C.red, 3) + arrow('M430 82 V112', C.ink, 3);
    o += box('vbac', 20, 116, 160, 'VBAC ✓', 'sinh âm đạo được', C.mint, ['tránh phẫu thuật', 'hồi phục nhanh']) + box('fail', 188, 116, 160, 'Thất bại', 'mổ trong chuyển dạ', '#ffe0cc', ['nguy cơ cao hơn', 'mổ chủ động']) + box('ercs', 356, 116, 194, 'Mổ theo lịch', 'không chuyển dạ', C.sky, ['gây mê, chảy máu, dính', 'sẹo tích lũy → PAS sau']);
    o += T(285, 300, 'VBAC là KẾT QUẢ — không hứa trước', { s: 14, c: C.redD }) + T(285, 322, 'quyết định cùng người bệnh, theo nguy cơ & cơ sở', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => ['vbac', 'fail', 'ercs'].every(k => seen(s, k)) ? ['happy', '**TOLAC** là lựa chọn thử chuyển dạ; **VBAC** là kết quả nếu thành công. So cả **thất bại → mổ trong chuyển dạ** và **mổ lặp lại** với sẹo tích lũy.'] : ['happy', 'Chạm **3 kết cục** để xem lợi – hại 👆']
});
tfKit('bt-q1', [['Đã mổ thì lần sau luôn phải mổ', false], ['Hứa chắc chị sẽ sinh thường được', false], ['Mổ lặp lại cũng có nguy cơ riêng', true], ['Quyết định có tính mong muốn sinh con sau này', true]], 'Không có câu “đã mổ thì luôn phải mổ”; không hứa VBAC. Cân **cả hai lựa chọn** cùng mong muốn sinh sản và năng lực cơ sở.');
B['tolac-vbac'] = [
  { t: 'TOLAC là lựa chọn, VBAC là kết quả', kit: 'bt-cay' },
  { t: 'Bốn câu về lựa chọn', kit: 'bt-q1' }
];
const HS = [['ngang', 'Sẹo ngang đoạn dưới', 'ok'], ['vbac', 'Từng sinh thường / VBAC', 'ok'], ['tunhien', 'Chuyển dạ tự nhiên', 'ok'], ['vo', 'Tiền căn vỡ tử cung', 'stop'], ['doc', 'Sẹo dọc thân / cổ điển', 'stop'], ['ntd', 'Nhau che lỗ trong', 'stop'], ['hai', 'Hai lần mổ cũ', 'ca'], ['to', 'Thai to', 'ca'], ['chua', 'Chưa biết sẹo', 'ca']];
const HSC = { ok: ['Thuận lợi', C.mint, C.green], stop: ['Điểm chặn', '#ffd0d8', C.redD], ca: ['Cá thể hóa', C.butter, '#b8860b'] };
kit('bt-ho', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => HS.every(([k]) => seen(s, k)),
  draw: s => T(285, 40, 'Hồ sơ nào thuộc nhóm nào? Chạm từng thẻ', { s: 14 }) + HS.map(([k, t, g], i) => { const x = 20 + (i % 3) * 178, y = 56 + Math.floor(i / 3) * 92, sn = seen(s, k), c = HSC[g];
    return `<g class="tap" data-set="!${k}">${card(x, y, 170, 82, sn ? c[1] : '#fff', sn ? C.soft : C.grid)}${ZS.wrap(t, 18).map((l, j) => T(x + 85, y + 30 + j * 18, l, { s: 13.5 })).join('')}${sn ? `<g class="fadein">${T(x + 85, y + 70, c[0], { s: 12.5, c: c[2] })}</g>` : T(x + 85, y + 70, '👆', { s: 13, c: C.soft })}</g>`; }).join(''),
  say: s => HS.every(([k]) => seen(s, k)) ? ['happy', '**Thuận lợi**: sẹo ngang đoạn dưới, từng sinh thường. **Chặn**: tiền căn vỡ, sẹo dọc thân, nhau che lỗ trong. **Cá thể hóa**: 2 lần mổ, thai to, chưa rõ sẹo.'] : ['happy', 'Chạm **9 thẻ hồ sơ** để xếp nhóm 👆']
});
tfKit('bt-q2', [['Từ chối TOLAC vì chủng tộc hay hôn nhân', false], ['Một lần đo đoạn dưới đủ để tự quyết', false], ['Cần biết lần trước rạch ở đâu, vì sao mổ', true], ['Hai lần mổ: chống chỉ định tuyệt đối', false]], 'Không dùng **chủng tộc, hôn nhân, một con số** đơn độc để từ chối. Đoạn dưới đo một lần **chưa có ngưỡng phổ quát**. Hai lần mổ cần **cá thể hóa**, không tuyệt đối.');
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
    let o = card(20, 20, 530, 316, '#fffdfa') + pic('sv-phu-nu.png', 46, 60, 64, 230) + pic('sv-phu-nu.png', 460, 60, 64, 230);
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
    let o = DK.map(([k, t], i) => tcard('!' + k, 20, 20 + i * 63, 280, 56, s[k], [t])).join('');
    o += card(312, 20, 238, 316) + `<rect x="376" y="60" width="110" height="140" rx="14" fill="${ok ? C.mint : '#f4f0fb'}" stroke="${C.soft}"/><rect x="416" y="${ok ? 70 : 120}" width="30" height="${ok ? 120 : 70}" rx="6" fill="${ok ? '#fff' : C.grid}"/>` + T(431, 230, ok ? '🚪 lối thoát mở' : `thiếu ${5 - n} điều kiện`, { s: 15, c: ok ? C.green : C.redD });
    o += T(431, 282, ok ? 'đủ điều kiện TOLAC' : '“theo dõi kỹ” không bù', { s: 12.5, c: ok ? C.green : C.mute }) + T(431, 302, ok ? '' : 'được điều kiện thiếu', { s: 12.5, c: C.mute });
    return o;
  },
  say: s => DK.every(([k]) => s[k]) ? ['happy', 'TOLAC chỉ an toàn khi có **lối thoát sẵn**: CTG liên tục, mổ cấp cứu, gây mê, sơ sinh, máu. Thiếu thì **không bù bằng lời “theo dõi kỹ”**.'] : ['happy', 'Mở **lối thoát**: bật đủ 5 điều kiện 👆']
});
tfKit('bt-q3', [['Misoprostol khởi phát thường quy cho TOLAC đủ tháng', false], ['Gây tê ngoài màng cứng không đau → loại vỡ', false], ['Oxytocin là chống chỉ định tuyệt đối', false], ['Bàn giao rõ dấu chặn và người cần gọi', true], ['Tim thai xấu, đau mới, mất độ lọt → đánh giá vỡ', true], ['Gây chuyển dạ cần chỉ định + giám sát chuyên khoa', true]], '**Không misoprostol** khởi phát thường quy; NMC dùng được nhưng **không đau không loại vỡ**; oxytocin **không tuyệt đối cấm** nhưng cần chỉ định. Bàn giao rõ **dấu chặn**.');
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
    o += `<g transform="translate(170 250) scale(${1 + a * .3})"><g class="beat" style="animation-duration:${(.55 + (1 - a) * .5).toFixed(2)}s">${pic('sv-tim.png', -50, -66, 100, 131)}</g></g>` + (a > .4 ? Th(250, 270, 'thất phải giãn, suy', { a: 'start', s: 12, c: C.redD }) : '');
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
  draw: s => T(285, 40, 'Đột ngột khó thở, tụt áp quanh sinh — còn nghĩ gì? Chạm từng thẻ', { s: 13.5 }) + DDX.map(([k, t], i) => { const x = 20 + (i % 3) * 178, y = 56 + Math.floor(i / 3) * 128, sn = seen(s, k);
    return `<g class="tap" data-set="!${k}">${card(x, y, 170, 118, sn ? C.lav : '#fff', sn ? C.soft : C.grid)}${T(x + 85, y + 62, t, { s: 15 })}${sn ? T(x + 152, y + 20, '✓', { s: 13, c: C.green }) : T(x + 85, y + 96, '👆', { s: 14, c: C.soft })}</g>`; }).join('') + T(285, 334, 'chẩn đoán AFE là lâm sàng — không có xét nghiệm đặc hiệu', { s: 12.5, c: C.redD }),
  say: s => DDX.every(([k]) => seen(s, k)) ? ['worry', 'Phân biệt với **xuất huyết, phản vệ, thuyên tắc phổi, tai biến gây mê, sản giật, bệnh tim**. AFE chẩn đoán **lâm sàng**, không chờ tử thiết hay tế bào thai.'] : ['happy', 'Chạm **6 chẩn đoán phân biệt** 👆']
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
tfKit('ba-q', [['“Cocktail” digoxin–atropine–dextran–heparin cho mọi AFE', false], ['Oxy, thông khí, CPR khi ngừng tim', true], ['Đánh giá đông máu sớm, bù chế phẩm', true], ['Mọi sốc đều truyền dịch như xuất huyết', false]], 'Hồi sức AFE: **oxy/thông khí, tuần hoàn (CPR khi cần)**, đội đa chuyên khoa, **đông máu sớm**. Không dùng “cocktail” từ note cũ; chiến lược dịch **khác** xuất huyết.');
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
tfKit('ba-q2', [['Không sốt → loại sepsis', false], ['Không có máu ngoài → loại xuất huyết', false], ['Chờ lấy cấy xong mới cho kháng sinh', false], ['Một biến cố có thể thành sốc hỗn hợp', true]], 'Không sốt **không loại** sepsis; không có máu ngoài **không loại** xuất huyết; lấy cấy **không được làm chậm** kháng sinh. Sốc có thể **hỗn hợp**.');
B['phan-biet-soc'] = [
  { t: 'Bể, bơm, ống: bốn loại sốc', kit: 'ba-soc', cr: 'Tim: ' + SV },
  { t: 'Bốn bẫy khi phân biệt sốc', kit: 'ba-q2' }
];
const FR = [['tt', '📝 Tóm tắt', '“Sản phụ 34 tuổi, thai 36 tuần, mổ cũ, ra huyết…”'], ['kh', '🚨 Mức khẩn', '“Hiện mạch 120, HA 90/60 — có dấu bất ổn.”'], ['cd', '🩺 Chẩn đoán + lý do', '“Em nghĩ nhiều nhau tiền đạo vì ra huyết không đau, mổ cũ.”'], ['ks', '🔎 Khảo sát có mục đích', '“Siêu âm ngả âm đạo để xác định vị trí nhau.”'], ['kh2', '⚡ Kế hoạch song song', '“Em vừa hồi sức, vừa chuẩn bị máu và phòng mổ.”'], ['neu', '🔀 Nếu… thì…', '“Nếu chảy tiếp hoặc tim thai xấu, em mổ khẩn.”']];
kit('ba-osce', {
  init: () => ({ seen: '' }), ui: () => [], after: (s, k) => markSeen(s, k), goal: s => FR.every(([k]) => seen(s, k)),
  draw: s => {
    let o = FR.map(([k, t], i) => pcard('!' + k, 20, 20 + i * 53, 200, 46, seen(s, k), s._k === k, [t])).join('');
    o += card(232, 20, 318, 316) + FR.filter(([k]) => seen(s, k)).map(([k, , t], i) => `<g class="${s._k === k ? 'fadein' : ''}">${ZS.wrap(t, 40).map((l, j) => T(246, 46 + i * 50 + j * 18, l, { a: 'start', s: 12.5 })).join('')}</g>`).join('');
    if (!FR.some(([k]) => seen(s, k))) o += T(391, 170, '👆 chạm theo thứ tự', { s: 13.5, c: C.soft });
    return o;
  },
  say: s => FR.every(([k]) => seen(s, k)) ? ['happy', 'Khung OSCE: **tóm tắt → mức khẩn → chẩn đoán có lý do → khảo sát có mục đích → kế hoạch song song → nếu… thì…**. Nói lại thành tiếng sau mỗi trạm.'] : ['happy', 'Ráp **khung câu trả lời** OSCE — chạm 6 thẻ 👆']
});
kit('ba-xn', {
  init: () => ({ c: '', seen: '' }), ui: () => [{ t: 'seg', k: 'c', opts: [['list', '📃 Đọc danh sách xét nghiệm'], ['md', '🎯 Mỗi xét nghiệm một mục đích']] }], after: s => markSeen(s, s.c), goal: s => seen(s, 'list') && seen(s, 'md'),
  draw: s => {
    const L = [['Công thức máu', 'xem mức thiếu máu'], ['Nhóm máu, phản ứng chéo', 'chuẩn bị truyền'], ['Đông máu, fibrinogen', 'tìm DIC'], ['Siêu âm ngả âm đạo', 'xác định vị trí nhau']];
    let o = card(20, 20, 530, 316, '#fffdfa');
    o += s.c ? L.map(([a, b], i) => `<g class="fadein" style="animation-delay:${i * .12}s">${T(60, 80 + i * 56, '• ' + a, { a: 'start', s: 15 })}${s.c === 'md' ? T(330, 80 + i * 56, '→ ' + b, { a: 'start', s: 14, c: C.green }) : ''}</g>`).join('') + verdict(60, 290, 450, s.c === 'md', s.c === 'md' ? 'Giám khảo thấy bạn hiểu vì sao làm' : 'Chỉ là danh sách — thiếu tác dụng') : T(285, 170, '👆 chọn cách trình bày', { s: 14, c: C.soft });
    return o;
  },
  say: s => seen(s, 'list') && seen(s, 'md') ? ['happy', 'Đừng đọc danh sách xét nghiệm suông — **mỗi xét nghiệm nói rõ để làm gì**. Điểm app chỉ để tự luyện, không thay bảng chấm thật.'] : ['happy', 'So **hai cách trình bày** cận lâm sàng 👆']
});
B['tu-duy-osce'] = [
  { t: 'Khung câu trả lời OSCE', kit: 'ba-osce' },
  { t: 'Xét nghiệm nào, để làm gì', kit: 'ba-xn' }
];
})();
