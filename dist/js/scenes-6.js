'use strict';
/* Họ 6: kẹt vai trên xương chậu, đám rối cánh tay, huyết động AFE & các loại sốc, mảng 1000 người (nguy cơ), tư vấn, TOLAC, CTG khi nghi vỡ, sản đồ, bản đồ xuất huyết, nguy cơ BHSS. */
(() => {
const ZS = window.ZS, { C, T, kit, plot, clamp, arrow, bar, lab, drop, pill, uterusSag, ctg } = ZS;

// ───────── shoulder: chậu nhìn nghiêng (mẹ nằm ngửa, đầu mẹ bên trái) + eo trên nhìn từ dưới lên
// mặt thai nhi: đỉnh đầu theo hướng (dx,dy) tính từ cổ
const babyHead = (x, y, r, dx, dy, o = {}) => { const a = Math.atan2(dx, -dy) * 180 / Math.PI;
  return `<g transform="translate(${x} ${y}) rotate(${a.toFixed(1)})"><path d="M${-r * .93} ${-r * .1} a${r * .2} ${r * .26} 0 1 0 0 ${r * .5}" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/><path d="M${r * .93} ${-r * .1} a${r * .2} ${r * .26} 0 1 1 0 ${r * .5}" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/><circle r="${r}" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.4"/>`
    + `<path d="M${-r * .62} ${-r * .62} Q0 ${-r * 1.18} ${r * .62} ${-r * .62} Q${r * .2} ${-r * .82} 0 ${-r * .74} Q${-r * .3} ${-r * .8} ${-r * .62} ${-r * .62}Z" fill="#c99a7a" opacity=".55"/>`
    + (o.awake ? `<circle cx="${-r * .34}" cy="${r * .02}" r="${r * .08}" fill="${C.ink}"/>${o.ptosis ? `<path d="M${-r * .5} ${-r * .06} Q${-r * .34} ${r * .06} ${-r * .18} ${-r * .06}" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.6"/>` : ''}<circle cx="${r * .34}" cy="${r * .02}" r="${r * .1}" fill="${C.ink}"/>`
      : `<path d="M${-r * .46} ${r * .02} q${r * .12} ${r * .1} ${r * .24} 0 M${r * .22} ${r * .02} q${r * .12} ${r * .1} ${r * .24} 0" fill="none" stroke="${C.ink}" stroke-width="1.5" stroke-linecap="round"/>`)
    + `<ellipse cx="${-r * .5}" cy="${r * .3}" rx="${r * .14}" ry="${r * .09}" fill="#ffb5c4" opacity=".7"/><ellipse cx="${r * .5}" cy="${r * .3}" rx="${r * .14}" ry="${r * .09}" fill="#ffb5c4" opacity=".7"/><path d="M${-r * .06} ${r * .22} q${r * .06} ${r * .08} ${r * .12} 0" fill="none" stroke="${C.skinD}" stroke-width="1.3" stroke-linecap="round"/><path d="M${-r * .14} ${r * .48} q${r * .14} ${r * .1} ${r * .28} 0" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/></g>`; };
// chi: đoạn thẳng da có viền (vẽ 2 lớp)
const Th = (x, y, t, o = {}) => T(x, y, t, { ...o, x: 'stroke="#fff" stroke-width="3.2" paint-order="stroke"' });
const limb = (d, w = 11) => `<path d="${d}" fill="none" stroke="${C.skinD}" stroke-width="${w + 2.4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffdcc4" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
kit('shoulder', {
  zones: (s, sp) => sp.mode === 'first' ? { call: [80, 44, 50, 18], mc: [300, 58, 44, 30], supra: [178, 74, 34, 30] }
    : sp.mode === 'second' ? { fail: [210, 112, 34, 30], rot: [455, 158, 80, 66], check: [455, 306, 86, 14] }
      : { head: [300, 206, 42, 40], stuck: [210, 112, 34, 30], change: [455, 158, 80, 66] },
  init: sp => sp.mode === 'first' ? { mc: false, supra: false, fundal: false } : sp.mode === 'second' ? { step: 'fail' } : { pull: false, change: false },
  ui: (s, sp) => sp.mode === 'first' ? [{ t: 'tog', k: 'mc', label: '🦵 McRoberts' }, { t: 'tog', k: 'supra', label: '✊ Ấn TRÊN xương mu' }, { t: 'tog', k: 'fundal', label: '⛔ Ấn đáy tử cung?' }]
    : sp.mode === 'second' ? [{ t: 'seg', k: 'step', opts: [['fail', '✖ Đầu tay chưa được'], ['rot', '🔄 Xoay vai'], ['arm', '🖐 Lấy tay sau']] }]
      : [{ t: 'tog', k: 'pull', label: '💪 Kéo đầu thật mạnh' }, { t: 'tog', k: 'change', label: '🔄 Xoay vai sang đường chéo' }],
  after: (s, k) => { if (k === 'fundal' && s.fundal) { s.mc = false; s.supra = false; } else if ((k === 'mc' || k === 'supra') && s[k]) s.fundal = false; if (k === 'pull' && s.pull) s.change = false; if (k === 'change' && s.change) s.pull = false; },
  draw: (s, sp) => {
    const f = sp.mode === 'first', mc = f && s.mc, supra = f && s.supra, fund = f && s.fundal, pull = sp.mode === 'basic' && s.pull, change = sp.mode === 'basic' && s.change;
    const rot = sp.mode === 'second' && s.step === 'rot', arm = sp.mode === 'second' && s.step === 'arm', ok = mc || supra || rot || arm || change, turn = supra || rot || change;
    // ── khung trái: lát cắt dọc giữa, mẹ nằm ngửa (đầu mẹ bên trái, bụng ở trên)
    let o = `<rect x="20" y="24" width="330" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/>`;
    o += `<path d="M20 56 Q90 22 170 34 Q236 50 252 98 Q262 128 268 166 L268 236 Q272 262 262 286 Q240 316 200 318 L20 318Z" fill="#fff4ec" stroke="${C.peachD}" stroke-width="1.2"/>`;
    o += `<path d="M218 98 Q176 40 96 44 Q34 56 30 120 Q30 162 60 170 L132 166 Q156 220 192 250 Q224 270 252 262 L266 240 L266 168 Q258 152 248 142Z" fill="#ffe4ec" stroke="${C.pinkD}" stroke-width="1" opacity=".9"/>` + T(62, 150, 'tử cung', { s: 9.5, c: C.myoD, w: 700 });
    // cột sống thắt lưng + xương cùng – cụt (phía sau = dưới)
    o += [[36, 186, -8], [62, 182, -5], [88, 179, -2], [112, 177, 2]].map(([x, y, r]) => `<rect x="${x - 11}" y="${y - 9}" width="22" height="18" rx="5" fill="url(#gBone)" stroke="${C.boneD}" stroke-width="1.2" transform="rotate(${r} ${x} ${y})"/>`).join('');
    o += `<path d="M126 170 Q140 156 150 162 Q156 214 188 244 Q220 268 254 262 L256 272 Q214 286 178 258 Q138 224 128 186Z" fill="url(#gBone)" stroke="${C.boneD}" stroke-width="1.3" stroke-linejoin="round"/><path d="M136 192 l16 -4 M146 216 l16 -8 M164 238 l14 -10 M190 256 l10 -12" stroke="${C.boneD}" stroke-width="1" opacity=".7"/>`;
    // thai trong hệ toạ độ thân: gốc = giữa hai vai, trục x → đáy tử cung, trục y → từ vai trước sang vai sau
    const mv = turn ? [8, 4] : mc ? [8, 4] : arm ? [8, 16] : fund ? [3, 1] : [0, 0], sy = turn ? 27 : 38, M = [190 + mv[0], 147 + mv[1]];
    const ex = [-.909, -.416], ey = [-.416, .909], G = (x, y) => [M[0] + x * ex[0] + y * ey[0], M[1] + x * ex[1] + y * ey[1]];
    const A = G(0, -sy), P = G(0, sy), hd = pull ? 128 : 112, H = G(-hd, 0);
    o += `<g transform="matrix(${ex[0]} ${ex[1]} ${ey[0]} ${ey[1]} ${M[0]} ${M[1]})">`;
    o += limb('M-6 0 H-80', pull ? 15 : 21);
    o += `<path d="M-4 ${-sy} C26 ${-sy - 10} 70 -40 88 -22 C102 -8 100 18 86 30 C62 44 22 ${sy + 8} -4 ${sy}Z" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.4"/><path d="M80 -20 Q68 0 80 22" fill="none" stroke="${C.skinD}" stroke-width="1.2" opacity=".7"/>`;
    if (arm) o += limb(`M0 ${sy - 4} Q-50 ${sy + 8} -98 ${sy - 6}`, 7) + `<circle cx="-102" cy="${sy - 7}" r="5.5" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/>`;
    o += `<circle cy="${-sy}" r="17" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.4"/><circle cy="${sy}" r="${arm ? 12 : 17}" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.4"/>`;
    if (pull) o += `<path d="M-8 0 H-80" stroke="${C.red}" stroke-width="1.6" stroke-dasharray="3 4"/>`;
    o += `</g>` + babyHead(H[0], H[1], 34, H[0] - M[0], H[1] - M[1]);
    // xương mu – khớp vệ (phía trước = trên); McRoberts xoay khớp vệ lên trên
    o += `<g transform="${mc ? 'translate(4 -14) rotate(-16 238 122)' : ''}"><ellipse cx="238" cy="122" rx="13" ry="30" transform="rotate(-35 238 122)" fill="url(#gBone)" stroke="${C.boneD}" stroke-width="1.3"/></g>` + Th(266, 110, 'khớp vệ', { a: 'start', s: 10, c: '#a58d62' });
    // môi âm hộ ôm quanh chỗ thai ra
    o += `<path d="M268 158 q-8 6 -4 14 M266 232 q-6 8 2 14" fill="none" stroke="${C.pinkD}" stroke-width="5" stroke-linecap="round"/>`;
    if (mc) o += arrow('M272 150 Q284 120 266 92', C.green, 3);
    // mặt phẳng eo trên: khớp vệ → mỏm nhô
    o += `<path d="M220 98 L140 162" stroke="${C.cap}" stroke-width="1.4" stroke-dasharray="5 4"/>` + Th(120, 172, 'eo trên', { a: 'end', s: 9.5, c: C.cap }) + Th(122, 200, 'mỏm nhô', { a: 'end', s: 10, c: '#a58d62' }) + Th(176, 292, 'xương cùng · cụt', { s: 10, c: '#a58d62' });
    o += Th(A[0] - 20, A[1] - 16, 'vai trước', { a: 'end', s: 10 }) + Th(P[0] - 20, P[1] + 26, arm ? 'tay sau đã ra' : 'vai sau', { a: 'end', s: 10 });
    if (!ok) o += `<g class="pulse"><circle cx="214" cy="104" r="8" fill="none" stroke="${C.red}" stroke-width="2"/><path d="M214 90 v-6 M226 96 l5 -4 M202 96 l-5 -4" stroke="${C.red}" stroke-width="2" stroke-linecap="round"/></g>`;
    else o += Th(A[0] + 2, A[1] + 30, '✓', { s: 16, c: C.green });
    if (pull) o += arrow(`M${H[0] - 14} ${H[1] + 44} l34 15`, C.red, 5) + Th(296, 286, 'kéo đầu: vai vẫn kẹt,', { s: 10, c: C.redD }) + Th(296, 300, 'cổ căng → đám rối', { s: 10, c: C.redD });
    if (change || rot) o += arrow(`M${A[0] - 22} ${A[1] - 4} Q${M[0] - 52} ${M[1]} ${P[0] - 20} ${P[1] + 8}`, C.green, 3);
    if (rot) o += limb('M344 148 Q300 150 266 166 L224 132', 7) + Th(344, 136, 'ngón tay xoay vai', { a: 'end', s: 9.5 });
    if (supra) o += arrow('M192 40 L204 92', C.green, 5) + T(184, 42, '✊', { s: 16 }) + Th(176, 76, 'ấn TRÊN mu', { a: 'end', s: 10, c: C.green });
    if (fund) o += arrow('M24 92 L58 106', C.red, 5) + Th(28, 126, 'ấn đáy ✗', { a: 'start', s: 10, c: C.redD });
    if (f) {
      o += `<g transform="translate(34 32)"><rect width="92" height="22" rx="11" fill="${C.pink}"/>${T(46, 15, '🆘 gọi đội · ghi giờ', { s: 9.5 })}</g>`;
      // dáng mẹ thu nhỏ: nằm phụ khoa ↔ McRoberts (gập đùi sát bụng)
      const th = mc ? 'M312 58 L290 40 L304 30' : 'M312 58 L326 36 L342 40';
      o += `<rect x="264" y="28" width="82" height="52" rx="10" fill="#fff" stroke="${C.grid}" stroke-width="1.2"/><g opacity="${mc ? 1 : .6}"><circle cx="274" cy="56" r="5" fill="${C.peach}" stroke="${C.peachD}"/><path d="M282 58 H312" stroke="${C.peachD}" stroke-width="6" stroke-linecap="round"/><path d="${th}" fill="none" stroke="${C.peachD}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>` + T(305, 74, mc ? 'gập đùi sát bụng' : 'tư thế thường', { s: 8.5, c: mc ? C.green : C.mute });
    }
    // ── khung phải: eo trên nhìn từ dưới lên — vai nằm trước–sau (hẹp) hay chéo (rộng)
    const ry = 58 + (mc ? 6 : 0), cy = 158 - (mc ? 6 : 0), ang = turn ? 48 : 90, hl = arm ? 42 : 60, push = fund ? -6 : 0;
    const e1 = [455 - hl * Math.cos(ang * Math.PI / 180), 158 - hl * Math.sin(ang * Math.PI / 180) + push], e2 = [455 + hl * Math.cos(ang * Math.PI / 180), 158 + hl * Math.sin(ang * Math.PI / 180) + push];
    o += `<rect x="362" y="24" width="188" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/>` + T(456, 44, 'Eo trên nhìn từ dưới lên', { s: 11 });
    o += `<ellipse cx="455" cy="${cy}" rx="74" ry="${ry}" fill="#fff7fa" stroke="${C.boneD}" stroke-width="1.2"/><ellipse cx="455" cy="${cy}" rx="80" ry="${ry + 6}" fill="none" stroke="${C.bone}" stroke-width="10" opacity=".9"/>`;
    o += `<path d="M455 ${cy - ry + 2} V${cy + ry - 14}" stroke="${C.grid}" stroke-width="1.2" stroke-dasharray="4 4"/><path d="M${455 - 50} ${cy - 40} L${455 + 50} ${cy + 40}" stroke="${C.grid}" stroke-width="1.2" stroke-dasharray="4 4"/>`;
    o += `<rect x="437" y="${cy - ry - 14}" width="36" height="16" rx="7" fill="url(#gBone)" stroke="${C.boneD}" stroke-width="1.2"/><path d="M439 ${cy + ry + 4} Q455 ${cy + ry - 20} 471 ${cy + ry + 4}Z" fill="url(#gBone)" stroke="${C.boneD}" stroke-width="1.2"/>`;
    o += T(432, cy - ry - 4, 'khớp vệ', { a: 'end', s: 9.5, c: '#a58d62' }) + T(434, cy + ry + 2, 'mỏm nhô', { a: 'end', s: 9.5, c: '#a58d62' });
    o += `<path d="M${e1[0]} ${e1[1]} L${e2[0]} ${e2[1]}" stroke="${C.skinD}" stroke-width="11" stroke-linecap="round"/><path d="M${e1[0]} ${e1[1]} L${e2[0]} ${e2[1]}" stroke="#ffdcc4" stroke-width="8" stroke-linecap="round"/><circle cx="455" cy="${158 + push}" r="15" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/>${T(455, 162 + push, 'cổ', { s: 9, c: C.skinD })}`;
    o += `<circle cx="${e1[0]}" cy="${e1[1]}" r="13" fill="url(#gSkin)" stroke="${ok ? C.skinD : C.red}" stroke-width="${ok ? 1.2 : 2}"/><circle cx="${e2[0]}" cy="${e2[1]}" r="${arm ? 9 : 13}" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/>`;
    if (!ok) o += `<circle cx="${e1[0]}" cy="${e1[1] - 6}" r="16" fill="none" stroke="${C.red}" stroke-width="1.6" class="pulse"/>`;
    o += Th(e1[0] + (turn ? -18 : 18), e1[1] + 4, 'vai trước', { a: turn ? 'end' : 'start', s: 9.5 }) + Th(e2[0] + 18, e2[1] + 4, arm ? 'nách' : 'vai sau', { a: 'start', s: 9.5 });
    const why = fund ? 'ấn đáy: vai ép CHẶT hơn' : arm ? 'bớt một vai → hẹp lại' : rot || change ? 'xoay sang đường chéo rộng' : supra ? 'khép vai + xoay sang chéo' : mc ? 'khớp vệ xoay lên, rộng ra' : pull ? 'kéo đầu không đổi gì ở vai' : 'vai nằm trước–sau: hẹp nhất';
    const vy = sp.mode === 'second' ? 262 : 272;
    o += T(456, vy, ok ? '✓ vai lọt' : '✗ vai kẹt', { s: 17, c: ok ? C.green : C.redD }) + T(456, vy + 18, why, { s: 10, c: C.mute });
    if (sp.mode === 'second') o += `<rect x="378" y="296" width="156" height="20" rx="10" fill="${C.butter}"/>` + T(456, 310, '👀 đánh giá · chưa được → chuyển', { s: 9.5 });
    return o;
  },
  say: (s, sp) => {
    if (sp.mode === 'first') return s.fundal ? ['ouch', 'KHÔNG ấn đáy tử cung! Lực từ đáy ép vai trước vào khớp vệ chặt hơn và gây tổn thương.'] : s.supra ? ['happy', 'Ấn TRÊN xương mu (người được huấn luyện) đẩy mặt sau vai trước: vai khép lại và xoay sang đường chéo rộng hơn.'] : s.mc ? ['happy', 'McRoberts: gập đùi sát bụng → khớp vệ xoay lên trên, khoảng trước–sau rộng ra.'] : ['worry', 'Đầu đã ra ngoài nhưng vai trước mắc sau khớp vệ. Gọi hỗ trợ, ghi giờ, rồi bật từng biện pháp.'];
    if (sp.mode === 'second') return s.step === 'fail' ? ['worry', 'McRoberts/ấn trên mu chưa được → ĐỔI cơ chế, không kéo mạnh hơn. Không bắt chờ đủ 30–60 giây mới chuyển.'] : s.step === 'rot' ? ['happy', 'Xoay vai: ngón tay đẩy mặt sau vai, chuyển đường kính hai vai từ trước–sau sang đường chéo rộng hơn.'] : ['happy', 'Lấy tay sau ra: chỉ còn một vai + nách đi qua → đường kính nhỏ lại. Rồi đánh giá, chưa được thì chuyển nhanh.'];
    return s.pull ? ['ouch', 'Kéo đầu mạnh KHÔNG gỡ được vai đang mắc — chỉ kéo căng cổ và đám rối cánh tay.'] : s.change ? ['happy', 'Xoay vai từ trước–sau sang đường chéo → vai trước thoát khỏi khớp vệ. Đổi quan hệ vai – chậu mới là lời giải.'] : ['worry', 'Đầu đã ra, nhưng hai vai nằm theo đường trước–sau (chỗ hẹp nhất): vai trước mắc khớp vệ. Thử bật từng nút.'];
  }
});

// ───────── plexus: trẻ sau kẹt vai — Erb · Klumpke · gãy xương đòn; mẹ; ghi nhận
kit('plexus', {
  zones: () => ({ baby: [160, 180, 104, 130], mom: [455, 96, 88, 66], note: [455, 250, 88, 70] }),
  init: () => ({ inj: 'none' }),
  ui: () => [{ t: 'seg', k: 'inj', opts: [['none', '🙂 Bình thường'], ['erb', 'C5–C6 (Erb)'], ['klu', 'C8–T1 (Klumpke)'], ['clav', '🦴 Gãy xương đòn']] }],
  draw: s => {
    const erb = s.inj === 'erb', klu = s.inj === 'klu', clav = s.inj === 'clav', hurt = s.inj !== 'none';
    let o = `<rect x="20" y="24" width="330" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/>`;
    // tã lót + chân ếch (trẻ nằm ngửa, nhìn từ trên xuống)
    const bx = 226;
    o += limb(`M${bx - 26} 258 Q${bx - 56} 268 ${bx - 52} 292 q4 10 18 8`, 17) + limb(`M${bx + 26} 258 Q${bx + 56} 268 ${bx + 52} 292 q-4 10 -18 8`, 17);
    o += `<path d="M${bx - 44} 150 Q${bx - 50} 210 ${bx - 38} 262 Q${bx} 276 ${bx + 38} 262 Q${bx + 50} 210 ${bx + 44} 150 Q${bx} 136 ${bx - 44} 150Z" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.4"/>`;
    o += `<path d="M${bx - 42} 230 Q${bx} 222 ${bx + 42} 230 Q${bx + 42} 262 ${bx + 30} 268 Q${bx} 280 ${bx - 30} 268 Q${bx - 42} 262 ${bx - 42} 230Z" fill="#eef6ff" stroke="${C.skyD}" stroke-width="1.2"/><circle cx="${bx}" cy="206" r="2.5" fill="${C.skinD}"/>`;
    // xương đòn
    const cl = `M${bx - 6} 150 Q${bx - 22} 144 ${bx - 40} 150`;
    o += `<path d="${cl}" fill="none" stroke="${C.boneD}" stroke-width="3" stroke-linecap="round" opacity=".45"/><path d="M${bx + 6} 150 Q${bx + 22} 144 ${bx + 40} 150" fill="none" stroke="${C.boneD}" stroke-width="3" stroke-linecap="round" opacity=".45"/>`;
    if (clav) o += `<ellipse cx="${bx - 24}" cy="148" rx="13" ry="8" fill="${C.pink}" opacity=".8"/><path d="M${bx - 28} 140 l4 6 l-4 4 l5 6" fill="none" stroke="${C.redD}" stroke-width="2" stroke-linecap="round"/>`;
    // tay lành (phía phải hình): gấp, nắm tay cạnh mặt
    o += limb(`M${bx + 42} 158 Q${bx + 70} 176 ${bx + 70} 190 Q${bx + 66} 160 ${bx + 54} 140`, 13) + `<circle cx="${bx + 54}" cy="136" r="9" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/>`;
    // tay bên tổn thương (phía trái hình = tay phải của trẻ)
    if (erb) o += limb(`M${bx - 42} 158 Q${bx - 54} 196 ${bx - 52} 234`, 13) + `<g transform="translate(${bx - 52} 244) rotate(28)"><ellipse rx="7.5" ry="11" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/><path d="M-4 8 q-2 8 4 10 M1 9 q0 8 6 8" fill="none" stroke="${C.skinD}" stroke-width="1.6" stroke-linecap="round"/></g>`;
    else if (clav) o += limb(`M${bx - 42} 158 Q${bx - 62} 194 ${bx - 66} 226`, 13) + `<circle cx="${bx - 66}" cy="234" r="9" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/>`;
    else o += limb(`M${bx - 42} 158 Q${bx - 70} 176 ${bx - 70} 190 Q${bx - 66} 160 ${bx - 54} 140`, 13) + (klu
      ? `<g transform="translate(${bx - 56} 132)"><ellipse rx="9" ry="8" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/>${[-6, -2, 2, 6].map(x => `<path d="M${x} -6 q0 -9 4 -9 q2 3 -1 6" fill="none" stroke="${C.skinD}" stroke-width="4" stroke-linecap="round"/><path d="M${x} -6 q0 -9 4 -9 q2 3 -1 6" fill="none" stroke="#ffdcc4" stroke-width="2.2" stroke-linecap="round"/>`).join('')}</g>`
      : `<circle cx="${bx - 54}" cy="136" r="9" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="1.2"/>`);
    // đầu + cổ
    o += `<rect x="${bx - 14}" y="128" width="28" height="22" fill="url(#gSkin)"/>` + babyHead(bx, 92, 40, 0, -1, { awake: true, ptosis: klu });
    // đám rối cánh tay: rễ C5–T1 đi từ cổ, dưới xương đòn, vào nách → tay
    const roots = [0, 1, 2, 3, 4].map(i => { const hot = (erb && i < 2) || (klu && i > 2), y0 = 126 + i * 5;
      return `<path d="M${bx - 10} ${y0} Q${bx - 26} ${y0 + 6} ${bx - 34} ${150 + i * 2} T${bx - 46} ${166 + i}" fill="none" stroke="${hot ? C.red : '#e5b800'}" stroke-width="${hot ? 2.4 : 1.4}" stroke-linecap="round"${hot ? ' class="pulse"' : ''}/>`; }).join('');
    o += `<g opacity="${erb || klu ? 1 : .75}">${roots}</g>`;
    // kính lúp: phóng to đám rối
    o += `<path d="M${bx - 34} 146 L104 108" stroke="${C.soft}" stroke-width="1" stroke-dasharray="3 3"/><circle cx="72" cy="88" r="40" fill="#fff" stroke="${C.soft}" stroke-width="1.4"/><path d="M102 64 V112" stroke="${C.boneD}" stroke-width="8" stroke-linecap="round" opacity=".5"/>`;
    o += ['C5', 'C6', 'C7', 'C8', 'T1'].map((n, i) => { const hot = (erb && i < 2) || (klu && i > 2), y0 = 66 + i * 11;
      return `<path d="M98 ${y0} Q74 ${y0 + 4} 62 ${94 + i * 2} T44 ${102 + i * 2}" fill="none" stroke="${hot ? C.red : '#e5b800'}" stroke-width="${hot ? 3 : 2}" stroke-linecap="round"/>` + T(86, y0 - 1.5, n, { s: 8.5, c: hot ? C.redD : C.mute }); }).join('');
    o += T(72, 140, 'đám rối cánh tay', { s: 9.5, c: C.mute });
    // cơ chế (đỏ) + dấu hiệu: khối chữ bên trái, cạnh tay bên tổn thương
    const info = erb ? ['Erb · C5–C6', 'do đầu bị kéo lệch xa vai', 'tay thõng, xoay trong', 'cổ tay gập: “xin boa”', 'nắm tay vẫn còn'] : klu ? ['Klumpke · C8–T1', 'do tay bị kéo lên quá đầu', 'bàn tay vuốt quặp', 'sụp mi, co đồng tử', '(Horner nếu tổn thương T1)'] : clav ? ['Gãy xương đòn', 'sưng, sờ lạo xạo', 'tay bên đó ít cử động', 'Moro mất một bên'] : ['Bình thường', 'hai tay gấp, cử động đều', 'Moro đối xứng', 'hồng hào, khóc tốt'];
    o += info.map((t, i) => T(30, 168 + i * 16 + (i ? 6 : 0), t, { a: 'start', s: i ? 9.5 : 11.5, c: i ? (i === 1 && hurt && !clav ? C.redD : C.ink) : hurt ? C.redD : C.green, w: i ? 700 : 800 })).join('');
    if (erb) o += `<path d="M${bx - 26} 112 Q${bx - 46} 122 ${bx - 50} 146" fill="none" stroke="${C.red}" stroke-width="1.6" marker-end="url(#arR)" marker-start="url(#arR)"/>`;
    else if (klu) o += arrow(`M${bx - 80} 196 V160`, C.red, 3);
    // ── khung phải: mẹ & ghi nhận
    o += `<rect x="362" y="24" width="188" height="140" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/>` + T(456, 44, '👩 Mẹ: tìm ngay', { s: 11 });
    o += uterusSag({ x: 410, y: 58, k: .26 }) + [0, 1].map(i => drop(404 + i * 12, 138 + i * 6, .55, 'drip')).join('') + T(410, 156, 'băng huyết', { s: 9.5, c: C.redD });
    o += `<g transform="translate(500 98)"><ellipse rx="13" ry="22" fill="${C.pink}" stroke="${C.pinkD}" stroke-width="1.2"/><ellipse rx="4" ry="12" fill="#fff" stroke="${C.pinkD}"/><circle cy="40" r="5" fill="#f3c6d3" stroke="${C.pinkD}"/><path d="M0 14 L2 24 L-2 30 L0 36" fill="none" stroke="${C.redD}" stroke-width="2" stroke-linecap="round"/></g>` + T(500, 156, 'rách TSM độ III–IV', { s: 9.5, c: C.redD });
    o += `<rect x="362" y="174" width="188" height="150" rx="18" fill="#fffdf4" stroke="${C.butterD}" stroke-width="1.2"/>` + T(456, 194, '📝 Ghi nhận khách quan', { s: 11 });
    o += ['🕐 giờ đầu ra · giờ thân ra', '🧰 thủ thuật theo thứ tự', '↩️ đáp ứng từng bước', '👶 tình trạng trẻ · 👩 mẹ', '💬 giải thích cho gia đình'].map((t, i) => T(376, 218 + i * 21, t, { a: 'start', s: 10, w: 700 })).join('');
    return o;
  },
  say: s => s.inj === 'erb' ? ['worry', 'Erb (C5–C6): đầu bị kéo lệch xa vai → rễ trên căng. Tay thõng, khép, xoay trong, cổ tay gập; nắm tay còn. Khám chuyên khoa để xác định.'] : s.inj === 'klu' ? ['worry', 'Klumpke (C8–T1): tay bị kéo lên quá đầu → rễ dưới căng. Bàn tay vuốt quặp; T1 tổn thương có thể kèm sụp mi, co đồng tử (Horner).'] : s.inj === 'clav' ? ['worry', 'Gãy xương đòn: sưng, lạo xạo, tay bên đó ít cử động, Moro không đều. Phân biệt với tổn thương đám rối.'] : ['happy', 'Ra được thân chưa phải hết việc: khám trẻ (đám rối, xương đòn, thiếu oxy), tìm băng huyết & rách TSM ở mẹ, ghi giờ – thủ thuật – đáp ứng.']
});

// ───────── afe: huyết động — mech | fluid
kit('afe', {
  zones: (s, sp) => sp.mode === 'fluid' ? { abc: [76, 76, 50, 40], heart: [210, 130, 70, 58], coag: [280, 300, 220, 22] } : { event: [76, 76, 56, 44], lungheart: [210, 150, 100, 76], blood: [452, 266, 76, 40] },
  init: sp => sp.mode === 'fluid' ? { fluid: 20 } : { ins: 50 },
  ui: (s, sp) => sp.mode === 'fluid' ? [{ t: 'range', k: 'fluid', label: '💧 Truyền dịch', min: 0, max: 100, step: 10, unit: '%' }] : [{ t: 'range', k: 'ins', label: '⚡ Mức phản ứng AFE', min: 0, max: 100, step: 10, unit: '%' }],
  draw: (s, sp) => {
    let o = `<rect x="20" y="24" width="${sp.mode === 'fluid' ? 520 : 300}" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    if (sp.mode === 'fluid') {
      const f = s.fluid / 100, CO = (rv, fl) => rv ? 62 + 60 * fl - 135 * fl * fl : 55 + 90 * fl - 70 * fl * fl, P = plot({ x: 330, y: 56, w: 200, h: 168, xr: [0, 100], yr: [0, 100], xt: 5, yt: 4, fx: v => v, fy: v => v, xl: 'dịch truyền (%)', curves: [{ f: v => CO(false, v / 100), col: C.mute, w: 2.4, dash: '4 4' }, { f: v => CO(true, v / 100), col: C.red, w: 3.6 }], vl: [{ x: s.fluid }], pts: [{ x: s.fluid, y: CO(true, f), col: C.red, r: 7 }] });
      const rvS = 1 + f * .55;
      o += `<g transform="translate(196 150)"><path d="M-40 -46 Q-14 -64 6 -46 L12 40 Q-8 60 -34 44Z" fill="#ffd6d6" stroke="${C.redD}" stroke-width="2.5"/><path d="M6 -46 Q40 -60 54 -26 Q64 20 22 52 Q8 56 12 40Z" fill="#f4a6a8" stroke="${C.redD}" stroke-width="2.5" transform="scale(${rvS} ${1 + f * .12}) translate(${-(rvS - 1) * 6} 0)"/>${T(-18, 4, 'LV', { s: 14 })}${T(30 * rvS, 14, 'RV', { s: 14, c: C.redD })}</g>` + T(196, 244, f > .4 ? 'thất phải CĂNG GIÃN → đè thất trái' : 'thất phải còn dung nạp', { s: 11, c: f > .4 ? C.redD : C.mute });
      o += `<g transform="translate(76 76)"><circle r="40" fill="${C.pink}" stroke="${C.soft}" stroke-width="2.5"/>${T(0, -6, '🫁 ❤️', { s: 20 })}${T(0, 18, 'ABC · CPR', { s: 11 })}</g>` + arrow('M120 92 L150 118', C.ink, 3);
      o += `<rect x="46" y="278" width="270" height="34" rx="17" fill="${C.butter}" stroke="${C.butterD}" stroke-width="2.5"/>` + T(181, 300, 'sửa đông máu · phối hợp sản khoa', { s: 11.5 });
      o += T(430, 44, 'Cung lượng tim (CO) theo dịch', { s: 11.5 }) + P.svg + ZS.legend(334, 288, [[C.red, 'Suy thất phải (AFE)'], [C.mute, 'Tim phải bình thường', '4 4']], { w: 200, s: 10 });
      return o;
    }
    const a = s.ins / 100, pap = 18 + 40 * a, co = 100 - 55 * a, sbp = 118 - 52 * a, spo2 = 98 - 22 * a;
    o += `<g transform="translate(76 76)"><circle r="40" fill="${C.pink}" stroke="${C.soft}" stroke-width="2.5"/>${T(0, -6, '🤰⚡', { s: 22 })}${T(0, 18, 'quanh sinh', { s: 10.5 })}</g>` + arrow('M120 92 L150 112', C.ink, 3);
    o += `<path d="M150 90 C120 120 150 170 204 150" fill="none" stroke="${C.ven}" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 10" class="flow"/>`;
    o += `<path d="M196 112 C190 72 118 84 124 156 C128 206 176 214 200 194Z M236 112 C242 72 314 84 308 156 C304 206 256 214 232 194Z" fill="${a > .5 ? '#c9bff0' : '#dbeeff'}" stroke="${C.soft}" stroke-width="2.5" opacity=".9"/>` + T(158, 160, 'phổi', { s: 11, c: C.mute }) + T(280, 160, 'phổi', { s: 11, c: C.mute });
    o += `<g transform="translate(216 168)"><g class="beat" style="animation-duration:${(.6 + (1 - a) * .6).toFixed(2)}s"><path d="M0 34 C-40 6 -30 -26 -10 -22 C-4 -20 -1 -16 0 -12 C1 -16 4 -20 10 -22 C30 -26 40 6 0 34Z" transform="scale(${1 + a * .25})" fill="${a > .5 ? '#ff5a78' : C.red}" stroke="${C.redD}" stroke-width="2.5"/></g></g>` + (a > .4 ? T(216, 222, 'thất phải suy', { s: 10.5, c: C.redD }) : '');
    if (a > .5) o += `<path d="M196 130 l14 14 m0 -14 l-14 14 M242 130 l14 14 m0 -14 l-14 14" stroke="${C.redD}" stroke-width="3.2" stroke-linecap="round"/>` + T(218, 104, 'co thắt mạch phổi', { s: 10, c: C.redD });
    const nd = Math.round(a * 3); o += `<g transform="translate(76 252)">${Array.from({ length: 4 }, (_, i) => `<circle cx="${i * 28}" cy="0" r="9" fill="${i < nd ? 'url(#gClot)' : C.red}" stroke="${C.redD}" stroke-width="2"/>`).join('')}${T(44, 30, a > .5 ? 'DIC: đông lan tỏa → chảy máu' : 'đông máu còn tốt', { s: 10.5, c: a > .5 ? C.redD : C.mute })}</g>`;
    const bars = [['Áp lực ĐM phổi', pap, 70, C.red], ['Cung lượng tim', co, 100, C.cap], ['HA tâm thu', sbp, 130, C.green], ['SpO₂', spo2, 100, C.amber]];
    o += `<rect x="334" y="24" width="216" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + bars.map(([n, v, mx, c], i) => `<g transform="translate(350 ${52 + i * 62})">${T(0, 0, n, { a: 'start', s: 11.5, c: C.mute })}${bar(0, 8, 150, v / mx * 100, c, '')}${T(184, 20, Math.round(v) + (i === 3 ? '%' : ''), { a: 'end', s: 13 })}</g>`).join('') + T(442, 304, 'số minh họa xu hướng, không là số đo', { s: 9.5, c: C.mute });
    return o;
  },
  say: (s, sp) => sp.mode === 'fluid' ? (s.fluid > 60 ? ['ouch', 'Dịch ồ ạt làm thất phải căng, đè thất trái → cung lượng tim TỤT. Tránh quá tải dịch ở người suy thất phải/phù phổi.'] : s.fluid > 30 ? ['worry', 'Dịch bắt đầu làm thất phải căng. Đánh giá huyết động trước khi truyền thêm.'] : ['happy', 'Hồi sức AFE: oxy/thông khí, tuần hoàn (CPR khi cần), đánh giá huyết động — không đổ dịch ồ ạt theo thói quen.'])
    : s.ins >= 70 ? ['ouch', 'Co thắt mạch phổi + suy thất phải + thiếu oxy + DIC cùng lúc: cấp cứu LÂM SÀNG, hồi sức ngay — không chờ xét nghiệm đặc hiệu.'] : s.ins >= 30 ? ['worry', 'Đáp ứng viêm & rối loạn mạch phổi làm áp lực ĐM phổi tăng, thất phải phải gồng; cung lượng và HA bắt đầu tụt.'] : ['happy', 'Kéo thanh “Mức phản ứng AFE”: đây không chỉ là “nút tắc cơ học” mà là phản ứng viêm + rối loạn mạch phổi/tuần hoàn.']
});

// ───────── shocktypes: bơm – ống – bể (huyết động đặc trưng từng loại sốc)
const ST = { vol: ['🩸 Mất thể tích', 'Xuất huyết: bể cạn. CVP ↓ · CO ↓ · SVR ↑. Cầm máu + bù thể tích/hồng cầu/đông máu.'], dist: ['🦠 Giãn mạch / phân bố', 'Sepsis, phản vệ: ống giãn, rò rỉ. CVP ↓ · SVR ↓. Sepsis không bắt buộc sốt: kháng sinh sớm, kiểm soát nguồn.'], pump: ['❤️ Tim yếu', 'Bệnh tim: bơm yếu. CVP ↑ · CO ↓ · SVR ↑. Hồi sức theo huyết động.'], block: ['🧱 Tắc nghẽn', 'AFE, thuyên tắc phổi: đường ra bị chặn. CVP ↑ · CO ↓. Thuật toán đặc hiệu, tránh quá tải dịch.'] };
kit('shocktypes', {
  zones: () => ({ tank: [80, 176, 50, 84], pipes: [357, 132, 70, 22], combo: [372, 322, 170, 22] }),
  init: () => ({ vol: true, dist: false, pump: false, block: false }),
  ui: () => [],
  draw: s => {
    const on = Object.keys(ST).filter(k => s[k]), n = on.length, bp = clamp(100 - n * 26, 12, 100);
    const DIR = { vol: [-1, -1, 1], dist: [-1, 0, -1], pump: [1, -1, 1], block: [1, -1, 1] };
    const co = clamp(1 - (s.vol ? .35 : 0) - (s.pump ? .4 : 0) - (s.block ? .4 : 0) + (s.dist ? .1 : 0), .15, 1.1), spd = (1.4 / co).toFixed(2), perf = bp > 60;
    let o = `<rect x="20" y="24" width="526" height="268" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/>`;
    // vòng tuần hoàn: bể (thể tích) → bơm (tim) → ống (ĐM) → mô → TM về bể
    const pw = s.dist ? 22 : 12, pipe = d => `<path d="${d}" fill="none" stroke="${s.dist ? '#ffc9d8' : C.pinkD}" stroke-width="${pw}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="2.6" stroke-dasharray="3 13" stroke-linecap="round" class="flow" style="animation-duration:${spd}s"/>`;
    o += pipe('M122 132 H206') + pipe('M294 132 H420') + pipe('M470 210 V262 H78 V250');
    if (s.dist) o += [0, 1, 2].map(i => drop(250 + i * 70, 158 + (i % 2) * 10, .5, 'drip')).join('') + T(357, 175, 'mạch giãn · rò rỉ', { s: 10, c: C.mute });
    // bể thể tích
    const lvl = s.vol ? .28 : .85;
    o += `<rect x="38" y="84" width="84" height="166" rx="20" fill="#fff" stroke="${C.soft}" stroke-width="2"/><clipPath id="tk3"><rect x="40" y="86" width="80" height="162" rx="18"/></clipPath><g clip-path="url(#tk3)"><rect x="38" y="${86 + 162 * (1 - lvl)}" width="84" height="170" fill="url(#gRed)"/></g>` + T(80, 76, 'thể tích máu', { s: 10.5, c: C.mute });
    if (s.vol) o += [0, 1].map(i => drop(64 + i * 30, 270 + i * 8, .6, 'drip')).join('');
    // bơm
    o += `<g transform="translate(250 132)"><g class="beat" style="animation-duration:${s.pump ? 1.8 : .9}s"><path d="M0 40 C-50 6 -38 -34 -12 -28 C-5 -26 -1 -22 0 -18 C1 -22 5 -26 12 -28 C38 -34 50 6 0 40Z" fill="${s.pump ? '#efb7c4' : C.red}" stroke="${C.redD}" stroke-width="2"/></g></g>`;
    // nút tắc
    if (s.block) o += `<rect x="330" y="110" width="22" height="44" rx="8" fill="url(#gClot)" stroke="${C.clotD}" stroke-width="2"/>`;
    // mô
    o += `<g transform="translate(470 170)"><circle r="40" fill="${perf ? '#ffe3ea' : '#e6e3f3'}" stroke="${perf ? C.pinkD : C.soft}" stroke-width="2"/>${[[-14, -12], [12, -16], [-18, 12], [14, 10], [0, -1]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${perf ? '#ff9fb5' : '#b6aed3'}"/>`).join('')}</g>` + T(470, 226, perf ? 'mô đủ máu' : 'mô thiếu máu', { s: 10.5, c: perf ? C.green : C.redD });
    // nhãn bấm trực tiếp lên từng bộ phận
    const pill = (k, x, y, w) => `<g data-set="!${k}" transform="translate(${x} ${y})"><rect width="${w}" height="26" rx="13" fill="${s[k] ? C.pink : '#fff'}" stroke="${s[k] ? C.redD : C.soft}" stroke-width="1.4"/>${T(10, 17.5, ST[k][0], { a: 'start', s: 11 })}${ZS.sw(w - 33, 6, s[k], C.redD)}</g>`;
    o += pill('vol', 30, 34, 132) + pill('pump', 184, 34, 112) + pill('dist', 320, 34, 172) + pill('block', 300, 188, 118);
    // kết quả: HA + chiều CVP · CO · SVR (nhiều cơ chế → lẫn lộn)
    const arr = j => { const d = [...new Set(on.map(k => DIR[k][j]))]; return !d.length ? ['–', C.mute] : d.length > 1 ? ['↕', C.amber] : d[0] > 0 ? ['↑', C.redD] : d[0] < 0 ? ['↓', C.cap] : ['↔', C.mute]; };
    o += `<rect x="20" y="300" width="526" height="44" rx="14" fill="${perf ? '#f3fbf6' : '#fff1f4'}" stroke="${perf ? C.mintD : C.pinkD}" stroke-width="1.4"/>` + T(40, 327, 'HA', { a: 'start', s: 12, c: C.mute }) + bar(66, 318, 120, bp, perf ? C.green : C.red, '') + T(196, 327, perf ? 'còn đủ' : 'TỤT', { a: 'start', s: 13, c: perf ? C.green : C.redD });
    o += ['CVP', 'CO', 'SVR'].map((h, j) => { const [a, c] = arr(j); return T(300 + j * 78, 327, h, { a: 'end', s: 11, c: C.mute }) + T(306 + j * 78, 329, a, { a: 'start', s: 19, c }); }).join('');
    if (n >= 2) o += `<g class="pulse">${T(516, 327, 'lẫn!', { a: 'end', s: 12, c: C.amber })}</g>`;
    return o;
  },
  say: s => { const on = Object.keys(ST).filter(k => s[k]); return on.length === 0 ? ['happy', 'Bấm vào bể, bơm, ống hoặc nút tắc để làm hỏng từng phần — xem HA và chiều CVP · CO · SVR đổi ra sao.'] : on.length === 1 ? ['worry', ST[on[0]][1]] : ['ouch', 'Nhiều cơ chế cùng lúc (vd xuất huyết + sepsis): mũi tên CVP/CO/SVR “lẫn” — không còn khuôn mẫu đẹp. Mỗi cơ chế cần đích xử trí riêng; không sốt không loại trừ sepsis.']; }
});

// ───────── risk100: nguy cơ tuyệt đối trên 1000 người
kit('risk100', {
  zones: () => ({ dots: [220, 130, 200, 100], factor: [470, 120, 70, 60], choice: [470, 262, 70, 50] }),
  init: () => ({ ind: false, rcs: false }),
  ui: () => [{ t: 'tog', k: 'ind', label: '💉 Gây chuyển dạ / tăng co' }, { t: 'tog', k: 'rcs', label: '🔪 Xem mổ lấy thai chủ động' }],
  draw: s => {
    const base = 5, mid = s.ind ? 12 : 5, lo = s.ind ? 10 : 5, hi = s.ind ? 15 : 5;
    let o = `<rect x="20" y="24" width="400" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(220, 46, '1000 sản phụ có sẹo mổ cũ, dự định sinh âm đạo', { s: 12 });
    for (let i = 0; i < 1000; i++) { const cx = 38 + (i % 50) * 7.6, cy = 62 + Math.floor(i / 50) * 12; const hot = i < lo, extra = i >= lo && i < hi; o += `<circle cx="${cx}" cy="${cy}" r="2.9" fill="${hot ? C.red : extra ? C.amber : '#e4def2'}"/>`; }
    o += `<g transform="translate(36 312)"><circle r="5" fill="${C.red}"/>${T(10, 4, `~${base} người (0,5%)`, { a: 'start', s: 11 })}${s.ind ? `<circle cx="140" r="5" fill="${C.amber}"/>${T(150, 4, `thêm khi gây chuyển dạ: ~${lo - base}–${hi - base}`, { a: 'start', s: 11 })}` : ''}</g>`;
    o += `<rect x="434" y="24" width="116" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(492, 48, 'Vỡ tử cung', { s: 12 }) + T(492, 66, s.ind ? 'tăng 2–3 lần' : 'chuyển dạ tự nhiên', { s: 10.5, c: s.ind ? C.redD : C.mute }) + T(492, 124, s.ind ? '1–1,5%' : '0,5%', { s: 26, c: s.ind ? C.redD : C.ink }) + T(492, 144, '(RCOG GTG45, 2015)', { s: 9.5, c: C.mute });
    o += `<g transform="translate(446 170)"><rect width="92" height="140" rx="14" fill="${s.rcs ? C.butter : '#f7f4fc'}" stroke="${C.soft}" stroke-width="2"/>${T(46, 20, 'Mổ lặp lại', { s: 10.5 })}${['gây mê', 'chảy máu', 'nhiễm trùng', 'dính', 'sẹo/PAS'].map((t, i) => T(46, 44 + i * 18, s.rcs ? '• ' + t : '', { s: 10 })).join('')}${!s.rcs ? T(46, 84, 'cũng có nguy cơ', { s: 10, c: C.mute }) : ''}</g>`;
    return o;
  },
  say: s => s.ind ? ['worry', 'Gây chuyển dạ/tăng co có thể tăng nguy cơ vỡ tử cung 2–3 lần. Số quần thể, đúng phiên bản nguồn — KHÔNG phải dự đoán chính xác cho một ca.'] : ['happy', 'Nguy cơ vỡ tử cung ~0,5% = 5/1000 trong chuyển dạ theo kế hoạch (RCOG GTG45, 2015). Nói bằng số tuyệt đối + điều kiện áp dụng, và nhớ cân nguy cơ của mổ lặp lại.']
});

// ───────── route: TOLAC là lựa chọn, VBAC là kết quả
kit('route', {
  zones: () => ({ choose: [90, 90, 70, 50], tolac: [270, 90, 80, 50], outcome: [450, 224, 90, 80] }),
  init: () => ({ path: 'tolac', res: 'vbac' }),
  ui: () => [{ t: 'seg', k: 'path', opts: [['tolac', '🛤️ TOLAC (thử chuyển dạ)'], ['ercs', '🏥 Mổ lấy thai chủ động']] }, { t: 'seg', k: 'res', opts: [['vbac', '✅ Sinh âm đạo thành công'], ['cs', '⚠️ Mổ trong chuyển dạ']] }],
  draw: s => {
    const t = s.path === 'tolac', ok = s.res === 'vbac';
    const n = (x, y, w, h, l1, l2, on, col) => `<g opacity="${on ? 1 : .3}"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="18" fill="${on ? col : '#f7f4fc'}" stroke="${on ? C.soft : C.grid}" stroke-width="2.6"/>${T(x, y - 4, l1, { s: 12.5 })}${T(x, y + 14, l2, { s: 10, c: C.mute })}</g>`;
    let o = `<rect x="20" y="24" width="530" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += n(90, 90, 130, 56, 'Tư vấn', 'chọn cùng người bệnh', true, C.sky) + n(270, 90, 140, 56, t ? 'TOLAC' : 'Mổ chủ động', t ? 'thử chuyển dạ' : '(ERCS)', true, t ? C.mint : C.butter);
    o += `<path d="M156 90 H196" stroke="${C.ink}" stroke-width="1.8" marker-end="url(#ar)" fill="none"/>`;
    o += n(450, 90, 150, 56, t ? 'Chuyển dạ' : 'Mổ theo lịch', t ? 'theo dõi liên tục' : 'tránh chuyển dạ', true, C.pink) + `<path d="M342 90 H372" stroke="${C.ink}" stroke-width="1.8" marker-end="url(#ar)" fill="none"/>`;
    if (t) { o += `<path d="M450 120 V150" stroke="${C.ink}" stroke-width="1.8" marker-end="url(#ar)" fill="none"/>`; o += n(240, 214, 190, 64, 'VBAC ✅', 'sinh âm đạo sau mổ', ok, C.mint) + n(470, 214, 190, 64, 'Mổ trong chuyển dạ', 'TOLAC chưa đạt VBAC', !ok, C.peach); o += `<path d="M450 150 L260 182 M450 150 L470 182" stroke="${C.ink}" stroke-width="3" fill="none"/>`; }
    else o += n(450, 214, 190, 64, 'Mổ lấy thai lặp lại', 'nguy cơ riêng của phẫu thuật', true, C.butter);
    o += T(280, 292, t ? 'TOLAC = quá trình lựa chọn/thử · VBAC = KẾT QUẢ' : 'Mổ lặp lại cũng có nguy cơ: gây mê, chảy máu, nhiễm trùng, dính, tích lũy sẹo/PAS', { s: 11.5, c: C.ink });
    return o;
  },
  say: s => s.path === 'ercs' ? ['happy', 'Mổ lấy thai chủ động là một lựa chọn khác, có nguy cơ riêng. Không dùng câu “đã mổ thì luôn phải mổ”.'] : s.res === 'cs' ? ['worry', 'Đã thử chuyển dạ nhưng cuối cùng mổ: đó là TOLAC chưa đạt VBAC — không phải “không TOLAC”.'] : ['happy', 'TOLAC là lựa chọn thử chuyển dạ; nếu sinh âm đạo thành công thì kết quả gọi là VBAC. Không hứa sẽ VBAC trước chuyển dạ.']
});

// ───────── ctgvo: nhận diện vỡ tử cung & theo dõi TOLAC trên băng CTG
kit('ctgvo', {
  zones: (s, sp) => sp.mode === 'tolac' ? { mon: [220, 92, 190, 62], door: [220, 276, 200, 34], clock: [490, 176, 56, 118] } : { ctg: [220, 92, 190, 62], signs: [220, 276, 200, 34], act: [490, 176, 56, 118] },
  init: sp => sp.mode === 'tolac' ? { fhr: 'late', anes: true, or: false, nicu: true, blood: false } : { fhr: 'late', pain: false, station: false, shock: false },
  ui: () => [{ t: 'seg', k: 'fhr', opts: [['normal', '✅ Tim thai ổn'], ['late', '⚠️ Giảm muộn lặp lại'], ['brady', '🚨 Nhịp chậm kéo dài']] }],
  draw: (s, sp) => {
    const bad = s.fhr !== 'normal';
    let o = `<rect x="20" y="24" width="400" height="212" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/>` + ctg(56, 40, 352, { fhr: s.fhr, uc: s.fhr === 'brady' ? 'hyper' : 'normal', hh: 100, th: 52, tone: s.fhr === 'brady' ? 22 : 10 });
    // thẻ bấm trực tiếp trong hình (mỗi thứ chỉ có MỘT chỗ để bấm)
    const card = (k, x, w, ic, t1, t2, on, col, cd) => `<g data-set="!${k}" transform="translate(${x} 246)" opacity="${on ? 1 : .62}"><rect width="${w}" height="62" rx="14" fill="${on ? col : '#f7f4fc'}" stroke="${on ? cd : C.grid}" stroke-width="1.6"/><text x="17" y="27" text-anchor="middle" font-size="18">${ic}</text>${T(32, 23, t1, { a: 'start', s: 11 })}${T(32, 38, t2, { a: 'start', s: 9.5, c: C.mute })}${ZS.sw(w - 34, 42, on, cd)}</g>`;
    if (sp.mode === 'tolac') {
      const ex = [['anes', '😴', 'Gây mê', 'sẵn sàng'], ['or', '🏥', 'Phòng mổ', 'trống, sẵn'], ['nicu', '👶', 'Sơ sinh', 'hồi sức'], ['blood', '🩸', 'Máu', 'đã dự trù']];
      o += ex.map(([k, ic, a, b], i) => card(k, 20 + i * 101, 94, ic, a, b, s[k], C.mint, C.green)).join('') + T(220, 326, '👆 bấm từng thẻ “lối thoát” để bật / tắt', { s: 10, c: C.mute });
      const n = ex.filter(([k]) => s[k]).length, t = 15 + (4 - n) * 12, Y = v => 270 - v / 70 * 190, col = t > 30 ? C.red : C.green;
      o += `<rect x="430" y="24" width="120" height="282" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/>` + T(490, 44, 'Quyết định →', { s: 11 }) + T(490, 58, 'lấy thai', { s: 11 });
      o += `<rect x="474" y="${Y(70)}" width="32" height="190" rx="10" fill="#f4f0fb"/><rect x="474" y="${Y(t)}" width="32" height="${270 - Y(t)}" rx="10" fill="${col}" opacity="${bad ? .9 : .35}"/><path d="M466 ${Y(30)} H514" stroke="${C.redD}" stroke-width="1.4" stroke-dasharray="4 3"/>` + T(518, Y(30) + 4, '30′', { a: 'start', s: 10, c: C.redD });
      o += T(490, 292, `≈ ${t} phút`, { s: 14, c: bad ? col : C.mute }) + T(490, 304, bad ? (t > 30 ? 'chậm trễ' : 'kịp lấy thai') : 'nếu có biến cố', { s: 9.5, c: C.mute });
    } else {
      const sg = [['pain', '😣', 'Đau mới', 'đau vùng sẹo'], ['station', '⬆️', 'Mất độ lọt', 'ngôi lùi lên'], ['shock', '🩸', 'Ra máu / sốc', 'mạch nhanh, tụt HA']];
      o += sg.map(([k, ic, a, b], i) => card(k, 20 + i * 135, 128, ic, a, b, s[k], C.pink, C.redD)).join('') + T(220, 326, '👆 bấm dấu hiệu của mẹ để bật / tắt', { s: 10, c: C.mute });
      const k = [bad, s.pain, s.station, s.shock].filter(Boolean).length, lvl = k >= 2 ? 2 : k;
      o += `<rect x="430" y="24" width="120" height="282" rx="18" fill="${lvl === 2 ? C.pink : '#fff'}" stroke="${lvl === 2 ? C.red : C.grid}" stroke-width="2"/>` + T(490, 46, 'Mức nghi ngờ', { s: 11.5 });
      o += [0, 1, 2, 3].map(i => `<rect x="470" y="${232 - i * 40}" width="40" height="34" rx="9" fill="${i < k ? (k >= 2 ? C.red : C.amber) : '#f4f0fb'}"/>`).join('');
      o += T(490, 290, lvl === 2 ? 'NGHI VỠ' : lvl ? 'theo dõi sát' : 'chưa gợi ý', { s: 13, c: lvl === 2 ? C.redD : C.mute }) + (lvl === 2 ? `<g class="pulse">${T(490, 304, 'mổ khẩn + hồi sức', { s: 10, c: C.redD })}</g>` : '');
    }
    return o;
  },
  say: (s, sp) => {
    const bad = s.fhr !== 'normal';
    if (sp.mode === 'tolac') { const n = [s.anes, s.or, s.nicu, s.blood].filter(Boolean).length; return !bad ? ['happy', `CTG đang ổn. Vẫn theo dõi liên tục — và kiểm tra trước ${4 - n ? `(${4 - n} lối thoát còn thiếu)` : '(đủ 4 lối thoát)'} vì biến cố đến rất nhanh.`] : n === 4 ? ['worry', 'Tim thai xấu nhưng gây mê, phòng mổ, sơ sinh, máu đều sẵn → lấy thai kịp. Monitoring chỉ có ích khi có ê-kíp đáp ứng.'] : ['ouch', `Tim thai xấu mà thiếu ${4 - n} lối thoát → thời gian quyết định → lấy thai kéo dài. Thiếu điều kiện thì không làm TOLAC.`]; }
    const k = [bad, s.pain, s.station, s.shock].filter(Boolean).length;
    return k >= 2 ? ['ouch', 'Tim thai xấu + đau mới / mất độ lọt / ra máu, sốc: nghi vỡ tử cung → gọi đội, mổ khẩn song song hồi sức. Đừng chờ đủ tam chứng.'] : k ? ['worry', 'Một dấu bất thường (thường là tim thai) đã đủ để cảnh giác và đánh giá lại ngay — bấm thêm dấu hiệu của mẹ.'] : ['happy', 'CTG ổn, mẹ chưa có dấu gì. Thử chọn “Giảm muộn lặp lại” rồi bật dấu hiệu của mẹ.'];
  }
});

// ───────── partogram: đọc diễn tiến để phòng vỡ tử cung
kit('partogram', {
  zones: () => ({ cx: [205, 112, 150, 72], station: [205, 196, 150, 26], uc: [461, 284, 80, 30] }),
  init: () => ({ t: 6, obs: false, oxy: false }),
  ui: () => [{ t: 'range', k: 't', label: '⏱️ Giờ theo dõi chuyển dạ (pha hoạt động)', min: 0, max: 10, step: 1, unit: ' giờ' }, { t: 'tog', k: 'obs', label: '🚧 Có bất xứng / vật cản' }, { t: 'tog', k: 'oxy', label: '💉 Tăng oxytocin' }],
  draw: s => {
    const dil = h => s.obs ? 4 + 1.2 * Math.min(h, 2.5) : Math.min(10, 4 + 1.2 * h), fifth = h => s.obs ? 4 - .2 * Math.min(h, 2) : clamp(4 - .75 * h, 0, 5), ucn = h => Math.min(6, 3 + (s.obs ? .22 * h : 0) + (s.oxy ? 1.5 : 0));
    const x0 = 56, y0 = 44, W = 300, H = 190, X = h => x0 + h / 10 * W, Y = v => y0 + H - v / 10 * H;
    let o = `<rect x="20" y="24" width="350" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/><rect x="${x0}" y="${y0}" width="${W}" height="${H}" fill="#fffdf5" stroke="${C.grid}" stroke-width="1"/>`;
    for (let i = 0; i <= 10; i++) o += `<path d="M${X(i)} ${y0} V${y0 + H} M${x0} ${Y(i)} H${x0 + W}" stroke="${C.grid}" stroke-width=".7"/>` + T(X(i), y0 + H + 13, i, { s: 9.5, c: C.mute, w: 700 }) + T(x0 - 6, Y(i) + 3.5, i, { a: 'end', s: 9.5, c: C.mute, w: 700 });
    o += T(x0 + W + 10, y0 + H + 13, 'giờ', { a: 'start', s: 10, c: C.mute }) + T(x0 - 30, y0 + H / 2, 'cm  ·  ngôi /5', { s: 10, c: C.mute, x: `transform="rotate(-90 ${x0 - 30} ${y0 + H / 2})"` });
    // đường báo động & hành động (sản đồ WHO)
    o += `<path d="M${X(0)} ${Y(4)} L${X(6)} ${Y(10)}" stroke="${C.amber}" stroke-width="1.6"/><path d="M${X(4)} ${Y(4)} L${X(10)} ${Y(10)}" stroke="${C.red}" stroke-width="1.6"/>` + T(X(2.4), Y(7.6), 'báo động', { a: 'end', s: 10, c: C.amber }) + T(X(9.2), Y(8.2), 'hành động', { a: 'end', s: 10, c: C.redD });
    // độ mở (X) và độ lọt (O) mỗi giờ tới thời điểm t
    let pd = '', pf = '';
    for (let h = 0; h <= s.t; h++) { pd += `${h ? 'L' : 'M'}${X(h)} ${Y(dil(h))}`; pf += `${h ? 'L' : 'M'}${X(h)} ${Y(fifth(h))}`; }
    o += `<path d="${pd}" fill="none" stroke="${s.obs ? C.red : C.green}" stroke-width="1.6"/><path d="${pf}" fill="none" stroke="${C.cap}" stroke-width="1.4" stroke-dasharray="4 3"/>`;
    for (let h = 0; h <= s.t; h++) o += `<path d="M${X(h) - 4} ${Y(dil(h)) - 4} l8 8 m0 -8 l-8 8" stroke="${s.obs ? C.redD : C.green}" stroke-width="2" stroke-linecap="round"/><circle cx="${X(h)}" cy="${Y(fifth(h))}" r="3.6" fill="#fff" stroke="${C.cap}" stroke-width="1.8"/>`;
    o += ZS.legend(x0 + 4, y0 - 8, [[s.obs ? C.red : C.green, '✕ độ mở cổ tử cung'], [C.cap, '○ ngôi sờ trên khớp vệ (/5)', '4 3']], { w: W });
    // cơn co mỗi 10 phút (ô tô đậm như sản đồ)
    o += T(x0 - 6, 284, 'cơn co', { a: 'end', s: 9.5, c: C.mute }) + T(x0 - 6, 296, '/10 phút', { a: 'end', s: 9.5, c: C.mute });
    for (let h = 0; h < s.t; h++) { const n = Math.round(ucn(h + .5)); for (let k = 0; k < 6; k++) o += `<rect x="${X(h) + 3}" y="${306 - (k + 1) * 6}" width="${W / 10 - 6}" height="5" rx="1.5" fill="${k < n ? (n >= 6 ? C.red : n >= 5 ? C.amber : C.soft) : '#f4f0fb'}"/>`; }
    // bảng nhận định
    const t = s.t, d = dil(t), stuck = s.obs && t >= 4, act = d < 4 + (t - 4) - .01 && t > 4, alert = d < 4 + t - .01, hyper = ucn(t) >= 5, bandl = s.obs && s.oxy && t >= 5;
    const rows = [['cổ TC không mở thêm', stuck], ['ngôi không xuống', s.obs && t >= 3], ['cơn co dồn ≥ 5 / 10′', hyper], ['vòng Bandl · đoạn dưới đau', bandl]];
    o += `<rect x="380" y="24" width="166" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2"/>` + T(463, 46, `Giờ thứ ${t}: ${Math.round(d * 10) / 10} cm`, { s: 12 }) + T(463, 62, alert ? (act ? 'qua đường HÀNH ĐỘNG' : 'qua đường báo động') : 'bên trái đường báo động', { s: 10, c: act ? C.redD : alert ? C.amber : C.green });
    o += rows.map(([txt, on], i) => `<g transform="translate(392 ${84 + i * 38})"><rect width="142" height="30" rx="10" fill="${on ? C.pink : '#f7f4fc'}"/><circle cx="14" cy="15" r="5" fill="${on ? C.red : '#d9d2ea'}"/>${T(26, 19, txt, { a: 'start', s: 10, c: on ? C.redD : C.mute })}</g>`).join('');
    const bad = stuck || act, msg = bandl ? ['DỌA VỠ', 'ngừng oxytocin · mổ'] : bad ? ['TẮC NGHẼN', 'quyết định sớm · sẵn mổ'] : ['TIẾN TRIỂN ĐỀU', 'tiếp tục theo dõi'];
    o += `<rect x="392" y="${242}" width="142" height="70" rx="14" fill="${bandl ? '#ffd0d8' : bad ? C.peach : C.mint}"/>` + `<g ${bandl ? 'class="pulse"' : ''}>${T(463, 272, msg[0], { s: 13.5, c: bandl ? C.redD : bad ? '#b5651d' : C.green })}</g>` + T(463, 292, msg[1], { s: 10, c: C.ink });
    return o;
  },
  say: s => s.obs && s.oxy ? ['ouch', 'Tăng oxytocin để “vượt” bất xứng: cơn co dồn, đoạn dưới căng mỏng, vòng Bandl → dọa vỡ. Ngừng tăng co, sửa vật cản, chuẩn bị mổ.'] : s.obs ? (s.t < 4 ? ['worry', 'Bất xứng: mấy giờ đầu còn mở được, nhưng kéo thanh thời gian tới — đường độ mở sẽ nằm ngang và vượt qua đường báo động.'] : ['worry', 'Độ mở đứng yên, ngôi không xuống dù cơn co mạnh dần → tắc nghẽn. Nhận diện sớm trên sản đồ, quyết định sớm, sẵn mổ.']) : ['happy', 'Bình thường: độ mở (✕) đi lên ~1 cm/giờ, ngôi (○) xuống dần, luôn bên trái đường báo động. Bật 🚧 để xem tắc nghẽn.']
});

// ───────── bleedmap: bản đồ nguồn chảy máu theo thời điểm
kit('bleedmap', {
  zones: () => ({ before: [140, 170, 110, 120], after: [420, 170, 110, 120], always: [280, 312, 230, 14] }),
  init: () => ({ pick: '', hidden: false }),
  ui: () => [{ t: 'tog', k: 'hidden', label: '👀 Máu ngoài ít mà mẹ vẫn sốc' }],
  draw: s => {
    const P = (id, x, y, ic, n) => `<g transform="translate(${x} ${y})" data-set="pick=${id}"><circle r="17" fill="${s.pick === id ? C.butter : '#fff'}" stroke="${s.pick === id ? C.amber : C.redD}" stroke-width="${s.pick === id ? 4.5 : 3}"/><text y="6" text-anchor="middle" font-size="17">${ic}</text></g>` + T(x, y + 31, n, { s: 10 });
    let o = `<rect x="20" y="24" width="250" height="272" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/><rect x="290" y="24" width="250" height="272" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>` + T(145, 46, '🤰 TRƯỚC SINH', { s: 13 }) + T(415, 46, '👶 SAU SINH', { s: 13 }) + `<path d="M272 160 H288" stroke="${C.mute}" stroke-width="3" marker-end="url(#ar)" fill="none"/>`;
    o += uterusSag({ x: 145, y: 56, k: .8 }) + `<circle cx="162" cy="130" r="26" fill="url(#gSkin)" stroke="${C.skinD}" stroke-width="2.5"/><path d="M96 104 Q86 130 108 168" fill="none" stroke="${C.placD}" stroke-width="12" stroke-linecap="round"/>`;
    o += P('previa', 56, 226, '🥧', 'nhau tiền đạo') + P('abr', 232, 112, '🌩️', 'nhau bong non') + P('rupt', 232, 206, '⚡', 'vỡ tử cung') + P('cervix', 56, 276, '🩹', 'cổ TC/âm đạo');
    o += uterusSag({ x: 415, y: 56, k: .8 }) + `<path d="M415 218 V236 Q415 252 436 256 L490 258" fill="none" stroke="${C.decid}" stroke-width="22" stroke-linecap="round"/>`;
    o += P('tone', 415, 110, '💪', 'Tone: đờ') + P('trauma', 350, 266, '🩹', 'Trauma: rách') + P('tissue', 492, 200, '🧩', 'Tissue: sót') + P('thrombin', 316, 150, '🧪', 'Thrombin');
    if (s.hidden) o += `<g class="pulse"><ellipse cx="230" cy="136" rx="14" ry="30" fill="url(#gClot)"/><ellipse cx="400" cy="244" rx="30" ry="12" fill="url(#gClot)"/></g>` + T(145, 288, 'máu kín: sau nhau / ổ bụng', { s: 10.5, c: C.clotD });
    o += `<rect x="150" y="298" width="260" height="26" rx="13" fill="${C.butter}" stroke="${C.butterD}" stroke-width="2.5"/>` + T(280, 316, 'Mọi lúc: mức nặng + hồi sức song song', { s: 11.5 });
    return o;
  },
  say: s => { const M2 = { previa: 'Nhau tiền đạo: ra huyết đỏ tươi, thường không đau.', abr: 'Nhau bong non: đau, tử cung cứng; máu có thể kín sau nhau.', rupt: 'Vỡ tử cung: có thể mất máu kín vào ổ bụng, tim thai xấu.', cervix: 'Nguồn khác: cổ tử cung, âm đạo, dấu nhầy máu, vasa praevia.', tone: 'Tone: tử cung mềm, cơ không siết mạch.', trauma: 'Trauma: rách đường sinh dục, tụ máu, vỡ/lộn tử cung.', tissue: 'Tissue: sót nhau, nhau bám bất thường.', thrombin: 'Thrombin: rối loạn đông máu.' }; return s.pick ? ['happy', M2[s.pick]] : s.hidden ? ['ouch', 'Mẹ sốc mà băng ít máu → tìm máu kín: sau nhau, trong ổ bụng, khối máu tụ. Máu nhìn thấy ≠ máu đã mất.'] : ['happy', 'Bấm từng chấm tròn để xem nguồn chảy máu theo thời điểm. Trước sinh: nhau & tử cung. Sau sinh: nhớ 4T.']; }
});

// ───────── riskprep: yếu tố nguy cơ BHSS → chuẩn bị trước sinh
kit('riskprep', {
  zones: () => ({ risks: [128, 156, 104, 112], prep: [420, 156, 124, 112], watch: [280, 312, 250, 16] }),
  init: () => ({ anemia: true, stretch: false, long: false, previa: false }),
  ui: () => [],
  draw: s => {
    const R = [['anemia', '🩸', 'Thiếu máu', 'Hb thấp → kém dung nạp mất máu', '💊', 'Điều trị thiếu máu', 'từ trong thai kỳ, trước sinh'],
      ['stretch', '🍼', 'Tử cung quá căng', 'đa thai · đa ối · thai to', '💉', 'Đường truyền + thuốc co sẵn', 'cơ căng giãn → dễ đờ'],
      ['long', '⏳', 'Chuyển dạ kéo dài', 'tăng co lâu → cơ tử cung mệt', '📈', 'Theo dõi sát, không để kéo dài', 'nhận ra tắc nghẽn sớm'],
      ['previa', '🥧', 'Nhau tiền đạo / PAS', 'đoạn dưới co kém · nguy cơ PAS', '🏥', 'Máu · nhóm máu · đội can thiệp', 'sinh nơi có ngân hàng máu, mổ']];
    let o = T(128, 38, 'YẾU TỐ NGUY CƠ', { s: 11, c: C.mute }) + T(420, 38, 'CHUẨN BỊ TRƯỚC SINH', { s: 11, c: C.mute }) + T(280, 38, '👆 bấm thẻ', { s: 10, c: C.soft });
    R.forEach(([k, ic, t1, t2, ic2, a1, a2], i) => {
      const y = 50 + i * 58, on = s[k];
      o += `<g data-set="!${k}"><rect x="24" y="${y}" width="208" height="50" rx="14" fill="${on ? C.pink : '#fff'}" stroke="${on ? C.redD : C.grid}" stroke-width="1.4"/><text x="44" y="${y + 32}" text-anchor="middle" font-size="20">${ic}</text>${T(64, y + 21, t1, { a: 'start', s: 12 })}${T(64, y + 38, t2, { a: 'start', s: 9.5, c: C.mute })}${ZS.sw(198, y + 30, on, C.redD)}</g>`;
      o += `<path d="M236 ${y + 25} H292" fill="none" stroke="${on ? C.ink : C.grid}" stroke-width="${on ? 1.8 : 1.2}" ${on ? '' : 'stroke-dasharray="3 4"'} marker-end="url(#ar)"/>`;
      o += `<g opacity="${on ? 1 : .32}"><rect x="298" y="${y}" width="246" height="50" rx="14" fill="${on ? C.butter : '#f7f4fc'}" stroke="${on ? C.butterD : C.grid}" stroke-width="1.4"/><text x="318" y="${y + 32}" text-anchor="middle" font-size="19">${ic2}</text>${T(338, y + 21, a1, { a: 'start', s: 11.5 })}${T(338, y + 38, a2, { a: 'start', s: 9.5, c: C.mute })}</g>`;
    });
    const n = R.filter(([k]) => s[k]).length;
    o += `<rect x="24" y="290" width="520" height="44" rx="16" fill="${C.sky}" stroke="${C.skyD}" stroke-width="1.4"/><text x="48" y="319" text-anchor="middle" font-size="20">👀</text>` + T(70, 309, 'Theo dõi MỌI sản phụ sau sinh', { a: 'start', s: 12.5 }) + T(70, 325, n ? 'có nguy cơ: chuẩn bị thêm như trên' : 'không có nguy cơ nào — vẫn có thể băng huyết!', { a: 'start', s: 10, c: n ? C.mute : C.redD });
    return o;
  },
  say: s => { const n = ['anemia', 'stretch', 'long', 'previa'].filter(k => s[k]).length; return n === 0 ? ['worry', 'Không có yếu tố nguy cơ nào — nhưng BHSS vẫn có thể xảy ra. Vì vậy mọi sản phụ đều được theo dõi sát sau sinh.'] : s.anemia && n === 1 ? ['worry', 'Thiếu máu: dự trữ hồng cầu ít → mất cùng lượng máu nhưng sốc sớm hơn. Điều trị thiếu máu từ trước sinh.'] : ['happy', 'Mỗi nguy cơ có một việc chuẩn bị riêng: thuốc co, đường truyền, máu, đội can thiệp, nơi sinh phù hợp. Tắt hết thẻ để thấy: vẫn phải theo dõi mọi người.']; }
});
})();
