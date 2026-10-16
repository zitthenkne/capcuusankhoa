'use strict';
/* Họ 7: đối thoại tư vấn (talk) — chọn câu nói đúng, bệnh nhân phản ứng, thanh "hiểu & tin tưởng" tăng. */
(() => {
const { C, T, kit, wrap, bar, pill } = window.ZS;
const lines = (x, y, text, n, o = {}) => wrap(text, n).map((t, i) => T(x, y + i * (o.lh || 14), t, { a: o.a || 'start', s: o.s || 11, c: o.c, w: o.w || 700 })).join('');
kit('talk', {
  zones: () => ({ t0: [465, 43, 16, 8], t1: [497, 43, 16, 8], t2: [529, 43, 16, 8] }),
  init: sp => ({ turn: 0, pick: -1, ok: [false, false, false], done: false }),
  ui: () => [],
  after: (s, k, sp) => { if (k === 'pick') { const o = sp.turns[s.turn].opts[s.pick]; if (o.ok) s.ok[s.turn] = true; } else if (k === 'go') { s.turn = Math.min(2, s.turn + 1); s.pick = -1; s.go = 0; } else if (k === 'fin') { s.done = true; s.fin = 0; } },
  draw: (s, sp) => {
    const tr = sp.turns[s.turn], trust = s.ok.filter(Boolean).length * 33 + (s.done ? 1 : 0);
    let o = `<rect x="20" y="24" width="106" height="300" rx="18" fill="#fff" stroke="${C.grid}" stroke-width="2.5"/>`;
    o += `<text x="73" y="96" text-anchor="middle" font-size="46">${trust >= 99 ? '😊' : trust >= 66 ? '🙂' : trust >= 33 ? '😐' : '😟'}</text>` + T(73, 126, sp.who || 'Người bệnh', { s: 11.5 }) + T(73, 160, 'hiểu & tin tưởng', { s: 10, c: C.mute }) + `<rect x="54" y="170" width="38" height="110" rx="14" fill="#f4f0fb"/><rect x="54" y="${170 + 110 * (1 - trust / 100)}" width="38" height="${110 * trust / 100}" rx="14" fill="${trust >= 99 ? C.green : trust >= 66 ? C.amber : C.red}"/>` + T(73, 304, trust + '%', { s: 14 });
    // bong bóng bệnh nhân
    o += `<rect x="140" y="24" width="410" height="${sp.pH || 70}" rx="20" fill="${C.sky}" stroke="${C.skyD}" stroke-width="2.5"/>` + T(154, 44, `${tr.step}`, { a: 'start', s: 10.5, c: C.mute }) + [0, 1, 2].map(i => `<rect x="${452 + i * 32}" y="40" width="26" height="5" rx="2.5" fill="${s.ok[i] ? C.green : i === s.turn ? C.butterD : C.grid}"/>`).join('') + lines(154, 62, '“' + tr.say + '”', 62, { s: 11.5 });
    const y0 = 24 + (sp.pH || 70) + 12;
    tr.opts.forEach((op, i) => {
      const y = y0 + i * 58, sel = s.pick === i, good = sel && op.ok, bad = sel && !op.ok;
      o += `<g transform="translate(140 ${y})" data-set="pick=${i}" ${s.ok[s.turn] ? 'style="pointer-events:none"' : ''}><rect width="410" height="52" rx="16" fill="${good ? C.mint : bad ? C.pink : '#fff'}" stroke="${good ? C.mintD : bad ? C.pinkD : C.grid}" stroke-width="${sel ? 3.5 : 2.5}"/><circle cx="22" cy="26" r="12" fill="${C.lav}"/>${T(22, 31, 'ABC'[i], { s: 13 })}${lines(46, 21, op.t, 64, { s: 10.8 })}</g>`;
    });
    const fb = s.pick >= 0 ? tr.opts[s.pick] : null;
    if (fb) o += ` <rect x="140" y="${y0 + 178}" width="300" height="48" rx="14" fill="${fb.ok ? C.mint : C.peach}" stroke="${C.soft}" stroke-width="2"/>` + lines(150, y0 + 194, (fb.ok ? '✓ ' : '✗ ') + fb.fb, 52, { s: 10 });
    if (s.ok[s.turn] && s.turn < 2) o += `<g transform="translate(450 ${y0 + 188})" data-set="go=1"><rect width="100" height="28" rx="14" fill="${C.red}"/>${T(50, 19, 'Lượt tiếp ▶', { s: 11.5, c: '#fff' })}</g>`;
    if (s.ok[s.turn] && s.turn === 2 && !s.done) o += `<g transform="translate(450 ${y0 + 188})" data-set="fin=1"><rect width="100" height="28" rx="14" fill="${C.green}"/>${T(50, 19, 'Hoàn tất ✓', { s: 11.5, c: '#fff' })}</g>`;
    return o;
  },
  say: (s, sp) => s.done ? ['happy', sp.endSay] : s.pick >= 0 ? [sp.turns[s.turn].opts[s.pick].ok ? 'happy' : 'worry', sp.turns[s.turn].opts[s.pick].ok ? 'Đúng hướng! Bấm “Lượt tiếp” để tiếp tục.' : 'Chưa phải cách tốt nhất — đọc phản hồi rồi chọn lại.'] : ['happy', sp.hint]
});
})();
