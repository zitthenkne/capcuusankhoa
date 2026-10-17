'use strict';
/* ▶ Xem mẫu: tự tìm chuỗi thao tác ngắn nhất đưa một trang tí hon tới đích (thanh kéo, công tắc, nút chọn, chỗ chạm),
   để app cho "bàn tay ma" làm lại trên hình thật. Thuần hàm trên state của kit → dùng được cả trong qa/scenes-check.cjs. */
(() => {
const ZS = window.ZS;
const specs = (svg, re) => [...svg.matchAll(re)].map(m => m[1]);
const parse = (r, S) => { if (r[0] === '!') { const k = r.slice(1); return { [k]: !S[k] }; } const [k, v] = r.split('='); return { [k]: v === 'true' ? true : v === 'false' ? false : isNaN(+v) ? v : +v }; };
ZS.plan = (kit, bt, lesson) => {
  const goal = bt.goal || kit.goal, init = () => Object.assign({}, kit.init(bt));
  const apply = (s, st) => { if (st.t === 'tap') { const v = parse(st.raw, s); Object.assign(s, v); kit.after?.(s, Object.keys(v)[0], bt); } else if (st.t === 'drag') { s[st.k + 'x'] = st.x; s[st.k + 'y'] = st.y; kit.after?.(s, st.k + 'x', bt); } else { s[st.k] = st.v; kit.after?.(s, st.k, bt); } };
  const reach = steps => { const s = init(); try { steps.forEach(st => apply(s, st)); } catch (e) { return false; } return goal ? !!goal(s, bt) : steps.length > 0; };
  // kit có sẵn lời giải (vd. hỏi nhanh Đúng/Sai: trả lời đúng từng câu) → dùng luôn, không dò
  if (kit.solution) { const st = kit.solution(bt).map(raw => ({ t: 'tap', raw })); return reach(st) ? st : []; }
  let s = init(); const steps = [], done = () => goal ? !!goal(s, bt) : steps.length > 0;
  const setc = (c, v) => { if (s[c.k] === v) return; s[c.k] = v; kit.after?.(s, c.k, bt); steps.push({ t: c.t, k: c.k, v }); };
  const ui = kit.ui(s, bt), vals = ui.map(c => c.t === 'range' ? [...Array(7)].map((_, i) => Math.round((c.min + (c.max - c.min) * i / 6) / (c.step || 1)) * (c.step || 1)) : c.t === 'tog' ? [true, false] : c.t === 'seg' ? c.opts.map(o => o[0]) : c.t === 'btn' ? [c.v] : []);
  let combos = [[]]; for (const vs of vals) combos = combos.flatMap(cb => vs.map(v => [...cb, v])); combos = combos.slice(0, 400);
  const sweep = list => { for (const cb of list) { if (done()) return; for (let pass = 0; pass < 2; pass++) { cb.forEach((v, i) => { const c = kit.ui(s, bt)[i]; if (c) setc(c, v); }); if (done()) return; } } };
  if (!goal && ui.length) { const c = ui[0]; setc(c, c.t === 'range' ? c.max : c.t === 'tog' ? true : c.t === 'seg' ? c.opts[0][0] : c.v); }
  else { sweep(combos); if (!done()) sweep(combos.slice().reverse()); }
  const seen = new Set(); let guard = 0;
  while (!done() && guard++ < 12) {
    const rs = [...kit.draw(s, bt, lesson).matchAll(/data-set="([^"]+)"/g)].map(m => m[1]).filter(r => !seen.has(r)); if (!rs.length) break;
    for (const r of rs) { seen.add(r); const v = parse(r, s); if (r[0] === '!' && s[r.slice(1)]) continue; Object.assign(s, v); kit.after?.(s, Object.keys(v)[0], bt); steps.push({ t: 'tap', raw: r }); if (done()) break; }
  }
  // kéo số / kéo điểm trong hình: thử cực trị, giữ bước tới đích
  for (let g2 = 0; g2 < 3 && !done(); g2++) {
    for (const spec of specs(kit.draw(s, bt, lesson), /data-scrub="([^"]+)"/g)) { const [k, mn, mx] = spec.split(':'); for (const v of [+mx, +mn, Math.round((+mn + +mx) / 2)]) { if (done()) break; if (s[k] === v) continue; apply(s, { t: 'scrub', k, v }); steps.push({ t: 'scrub', k, v }); } }
    for (const spec of specs(kit.draw(s, bt, lesson), /data-drag="([^"]+)"/g)) { const [k, x0, y0, x1, y1] = spec.split(':').map((v, i) => i ? +v : v); for (const [x, y] of [[x1, y1], [x0, y0], [x1, y0], [x0, y1], [Math.round((x0 + x1) / 2), Math.round((y0 + y1) / 2)]]) { if (done()) break; apply(s, { t: 'drag', k, x, y }); steps.push({ t: 'drag', k, x, y }); } }
  }
  if (!goal && !steps.length) { const rs = [...kit.draw(init(), bt, lesson).matchAll(/data-set="([^"]+)"/g)].map(m => m[1]); if (rs.length) steps.push({ t: 'tap', raw: rs[0] }); }
  if (!reach(steps)) return [];
  // rút gọn: bỏ từng bước thừa (vẫn phải tới đích), rồi gộp các lần kéo liên tiếp trên cùng một thanh
  for (let i = 0; i < steps.length;) { const t = steps.slice(0, i).concat(steps.slice(i + 1)); if (t.length && reach(t)) steps.splice(i, 1); else i++; }
  for (let i = 0; i < steps.length - 1;) { const a = steps[i], b = steps[i + 1]; if (a.t === 'range' && b.t === 'range' && a.k === b.k && reach(steps.slice(0, i).concat(steps.slice(i + 1)))) steps.splice(i, 1); else i++; }
  return steps;
};
// trạng thái đã giải xong (để lấy câu "à ra vậy" cuối cùng, kể cả khi người học đã làm từ phiên trước)
ZS.solve = (kit, bt, lesson) => { const s = Object.assign({}, kit.init(bt)), steps = ZS.plan(kit, bt, lesson);
  steps.forEach(st => { if (st.t === 'tap') { const v = parse(st.raw, s); Object.assign(s, v); kit.after?.(s, Object.keys(v)[0], bt); } else if (st.t === 'drag') { s[st.k + 'x'] = st.x; s[st.k + 'y'] = st.y; kit.after?.(s, st.k + 'x', bt); } else { s[st.k] = st.v; kit.after?.(s, st.k, bt); } });
  return s; };
})();
