'use strict';
/* Lõi vẽ hình v2: sơ đồ giải phẫu/sinh lý + đồ thị số liệu (kiểu hoc-ctg, hocsando). Khung 560×350.
   Mỗi "cảnh" (kit) = {zones, init, ui, draw, say}. Hình KHÔNG dùng mặt cười trên cơ quan; số liệu đổi theo thanh kéo. */
(() => {
const ZS = window.ZS = { kits: {}, spec: {} };
const C = ZS.C = { ink: '#4a3f63', soft: '#7b6ba3', mute: '#8c80a6', grid: '#e7e1f2', paper: '#fffdfa',
  pink: '#ffe0ec', pinkD: '#ffb5d0', peach: '#ffe6d5', peachD: '#ffc39c', butter: '#fff3c4', butterD: '#f6d873', mint: '#d6f4e6', mintD: '#95dbbb', sky: '#dbeeff', skyD: '#9ecdf7', lav: '#ebe4ff', lavD: '#c3b0fb',
  red: '#e5484d', redD: '#b8323a', blood: '#d94452', art: '#e5484d', ven: '#6c63c9', cap: '#4f9be0', myo: '#f3a7ba', myoD: '#cf6f8c', decid: '#fbd3df', plac: '#e66d78', placD: '#b9424f', clot: '#7d4f7e', clotD: '#5a3459', ser: '#cbbcf7', bone: '#f1e5cd', boneD: '#cdb98f', skin: '#ffdcc4', skinD: '#e9ab84', bladder: '#cfe6ff', green: '#2fa376', amber: '#e29a1c' };
ZS.kit = (name, k) => (ZS.kits[name] = k);
const clamp = ZS.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const T = ZS.T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.s || 12}" font-weight="${o.w || 800}" fill="${o.c || C.ink}"${o.x ? ' ' + o.x : ''}>${t}</text>`;
ZS.wrap = (txt, n) => { const out = []; let cur = ''; for (const w of String(txt).split(' ')) { if ((cur + ' ' + w).trim().length > n && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } if (cur) out.push(cur); return out; };
// chú thích có đường dẫn: nhãn + đoạn thẳng chỉ vào cấu trúc
ZS.lab = (x, y, tx, ty, text, o = {}) => `<path d="M${x} ${y} L${tx} ${ty}" stroke="${o.c || C.soft}" stroke-width="1.6" fill="none"/><circle cx="${x}" cy="${y}" r="2.6" fill="${o.c || C.soft}"/>${T(tx, ty + (o.dy ?? 4), text, { a: o.a || 'start', s: o.s || 11.5, c: o.tc || C.ink })}`;
ZS.pill = (x, y, text, o = {}) => { const w = (o.w || (String(text).length * 6.4 + 14)); return `<rect x="${x - w / 2}" y="${y - 11}" width="${w}" height="20" rx="10" fill="#fff" opacity=".92" stroke="${o.c || C.grid}" stroke-width="1.6"/>` + T(x, y + 3.6, text, { s: o.s || 10.5, c: o.tc || C.ink }); };
ZS.arrow = (d, col = C.ink, w = 3, dash = '') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${Math.min(2.6, Math.max(1.6, w * .5)).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''} marker-end="url(#${col === C.red || col === C.redD || col === C.blood ? 'arR' : col === C.green || col === C.mintD ? 'arG' : 'ar'})"/>`;
ZS.bar = (x, y, w, v, col, label, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${o.h || 9}" rx="4.5" fill="#f4f0fb" stroke="none"/><rect x="${x}" y="${y}" width="${Math.max(0, Math.min(1, v / 100)) * w}" height="${o.h || 9}" rx="4.5" fill="${col}"/>${label ? T(x, y - 5, label, { a: 'start', s: 11, c: C.mute }) : ''}`;
ZS.drop = (x, y, k = 1, cls = '') => `<g transform="translate(${x} ${y}) scale(${k})"><g class="${cls}"><path d="M0 -14 C0 -14 -9 -2 -9 4 a9 9 0 0 0 18 0 C9 -2 0 -14 0 -14Z" fill="${C.red}" stroke="${C.redD}" stroke-width=".9"/><ellipse cx="-3.5" cy="3" rx="1.8" ry="3" fill="#fff" opacity=".55"/></g></g>`;
ZS.sticker = (x, y, w, h, fill, stroke, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 16}" fill="${fill}" stroke="${stroke}" stroke-width="${o.sw || 2.5}"/>`;
// chú giải đường cong: đoạn kẻ đúng màu/kiểu nét + tên đại lượng (không ghi "(đỏ)", "(xanh)")
ZS.legend = (x, y, items, o = {}) => { const fs = o.s || 10.5, sw = 16; let cx = x, cy = y, out = '';
  items.forEach(([col, label, dash]) => { const w = sw + 5 + String(label).length * fs * .56; if (o.w && cx > x && cx + w > x + o.w) { cx = x; cy += fs + 7; }
    out += `<path d="M${cx} ${cy} h${sw}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>` + T(cx + sw + 5, cy + 3.6, label, { a: 'start', s: fs, c: C.ink, w: 700 }); cx += w + 12; });
  return out; };
// ───── hoạt hình chuyển trạng thái (SMIL chạy lại mỗi lần vẽ vì <svg> gốc được tạo mới): s._p = trạng thái trước, s._k = khóa vừa đổi
const EZ = 'calcMode="spline" keyTimes="0;1" keySplines=".25 .9 .3 1"';
ZS.tw = (attr, from, to, d = .55) => from == null || +from === +to ? '' : `<animate attributeName="${attr}" from="${from}" to="${to}" dur="${d}s" fill="freeze" ${EZ}/>`;
ZS.twRot = (from, to, cx, cy, d = .6) => from == null || +from === +to ? '' : `<animateTransform attributeName="transform" type="rotate" from="${from} ${cx} ${cy}" to="${to} ${cx} ${cy}" dur="${d}s" fill="freeze" ${EZ}/>`;
// nét tự vẽ ra (mũi tên, đường chỉ): thêm vào <path> có pathLength=1
ZS.drawIn = (svg, d = .5) => svg.replace(/<path ([^>]*?)\/>/g, (m, a) => /stroke-dasharray/.test(a) ? m : `<path pathLength="1" stroke-dasharray="1" ${a}><animate attributeName="stroke-dashoffset" from="1" to="0" dur="${d}s" fill="freeze" ${EZ}/></path>`);
// vừa xuất hiện? (so với trạng thái trước; lần vẽ đầu cũng tính là mới → có hiệu ứng mở màn)
ZS.fresh = (s, f) => f(s) && !(s._p && f(s._p));
ZS.fade = (svg, on = true) => on ? `<g class="fadein">${svg}</g>` : svg;
// công tắc mini: dấu hiệu "thẻ này bấm được" ngay trong hình
ZS.sw = (x, y, on, col) => `<rect x="${x}" y="${y}" width="26" height="14" rx="7" fill="${on ? (col || C.green) : '#d9d2ea'}"/><circle cx="${on ? x + 19 : x + 7}" cy="${y + 7}" r="5" fill="#fff"/>`;
// ───── đồ thị: trục, lưới, dải màu, đường cong, ngưỡng, điểm đánh dấu
ZS.plot = o => {
  const { x = 0, y = 0, w = 200, h = 120, xr, yr, xl = '', yl = '', curves = [], hl = [], vl = [], bands = [], pts = [], xt = 5, yt = 4, fx = v => v, fy = v => v, title = '', ticks = true } = o;
  const X = v => x + (v - xr[0]) / (xr[1] - xr[0]) * w, Y = v => y + h - (v - yr[0]) / (yr[1] - yr[0]) * h;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff" stroke="${C.grid}" stroke-width="1.1"/>`;
  bands.forEach(b => s += `<rect x="${X(b.x0)}" y="${y}" width="${X(b.x1) - X(b.x0)}" height="${h}" fill="${b.fill}" opacity="${b.op ?? .55}"/>` + (b.label ? T((X(b.x0) + X(b.x1)) / 2, y + 12, b.label, { s: 10.5, c: b.tc || C.mute }) : ''));
  for (let i = 0; i <= xt; i++) { const v = xr[0] + (xr[1] - xr[0]) * i / xt; s += `<path d="M${X(v)} ${y} V${y + h}" stroke="${C.grid}" stroke-width=".7"/>` + (ticks ? T(X(v), y + h + 13, fx(v), { s: 10, c: C.mute, w: 700 }) : ''); }
  for (let i = 0; i <= yt; i++) { const v = yr[0] + (yr[1] - yr[0]) * i / yt; s += `<path d="M${x} ${Y(v)} H${x + w}" stroke="${C.grid}" stroke-width=".7"/>` + (ticks ? T(x - 5, Y(v) + 3.5, fy(v), { a: 'end', s: 10, c: C.mute, w: 700 }) : ''); }
  hl.forEach(l => s += `<path d="M${x} ${Y(l.y)} H${x + w}" stroke="${l.c || C.amber}" stroke-width="1.2" stroke-dasharray="5 4"/>` + (l.label ? T(l.lpos === 'left' ? x + 6 : x + w - 4, Y(l.y) - 4, l.label, { a: l.lpos === 'left' ? 'start' : 'end', s: 10.5, c: l.c || C.amber }) : ''));
  vl.forEach(l => s += `<path d="M${X(l.x)} ${y} V${y + h}" stroke="${l.c || C.red}" stroke-width="${(l.w || 2.2) * .6}" ${l.dash ? 'stroke-dasharray="5 4"' : ''}/>` + (l.label ? T(X(l.x), y - 4, l.label, { s: 10.5, c: l.c || C.red }) : ''));
  curves.forEach(c => { const n = c.n || 70, p = []; for (let i = 0; i <= n; i++) { const v = xr[0] + (xr[1] - xr[0]) * i / n, yy = c.f(v); if (yy == null || isNaN(yy)) continue; p.push(`${p.length ? 'L' : 'M'}${X(v).toFixed(1)} ${Y(clamp(yy, yr[0], yr[1])).toFixed(1)}`); }
    if (c.area) s += `<path d="${p.join(' ')} L${X(xr[1])} ${Y(yr[0])} L${X(xr[0])} ${Y(yr[0])}Z" fill="${c.col}" opacity=".12"/>`;
    s += `<path d="${p.join(' ')}" fill="none" stroke="${c.col}" stroke-width="${((c.w || 3) * .62).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" ${c.dash ? `stroke-dasharray="${c.dash}"` : ''}/>`; });
  pts.forEach(p => s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${(p.r || 5.5) * .75}" fill="${p.col || C.red}" stroke="#fff" stroke-width="1.4"/>` + (p.label ? T(X(p.x) + (p.dx ?? 9), Y(p.y) + (p.dy ?? -7), p.label, { a: p.a || 'start', s: 11, c: p.col || C.red }) : ''));
  if (xl) s += T(x + w / 2, y + h + 27, xl, { s: 10.5, c: C.mute });
  if (yl) s += T(x - 30, y + h / 2, yl, { s: 10.5, c: C.mute, x: `transform="rotate(-90 ${x - 30} ${y + h / 2})"` });
  if (title) s += T(x + 8, y + 15, title, { a: 'start', s: 11.5, c: C.ink });
  if (o.legend) s += ZS.legend(x + 4, y - 10, o.legend, { w });
  return { svg: s, X, Y };
};
// ───── hình giải phẫu dùng chung
// đáy chậu/tử cung nhìn dọc (sagittal) nhẹ nhàng: thân, đoạn dưới, cổ tử cung. o: {x,y,k}
ZS.uterusSag = (o = {}) => { const { x = 280, y = 30, k = 1, cav = '#fffafc' } = o; return `<g transform="translate(${x} ${y}) scale(${k}) translate(-130 0)"><path d="M26 118 Q18 18 130 10 Q242 18 234 118 Q230 190 168 226 L164 262 H96 L92 226 Q30 190 26 118Z" fill="url(#gMyo)" stroke="${C.myoD}" stroke-width="2.5" stroke-linejoin="round"/><path d="M52 118 Q46 40 130 34 Q214 40 208 118 Q204 176 156 208 L152 262 H108 L104 208 Q56 176 52 118Z" fill="${cav}" stroke="${C.decid}" stroke-width="5" stroke-linejoin="round"/></g>`; };
ZS.defs = `<defs>
<linearGradient id="gMyo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9bdcb"/><stop offset="1" stop-color="#ee94ad"/></linearGradient>
<linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8f93"/><stop offset="1" stop-color="#e5484d"/></linearGradient>
<linearGradient id="gPlac" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4838d"/><stop offset="1" stop-color="#d9525f"/></linearGradient>
<linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9e5ff"/><stop offset="1" stop-color="#86bdf0"/></linearGradient>
<linearGradient id="gClot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a47aa5"/><stop offset="1" stop-color="#6f4670"/></linearGradient>
<linearGradient id="gBone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8efdc"/><stop offset="1" stop-color="#e6d6b4"/></linearGradient>
<linearGradient id="gSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7d6"/><stop offset="1" stop-color="#ffcfae"/></linearGradient>
<linearGradient id="gSer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcd2fb"/><stop offset="1" stop-color="#b9a7f3"/></linearGradient>
<filter id="blr"><feGaussianBlur stdDeviation="3.2"/></filter>
<marker id="ar" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto"><path d="M2.5 2.5L10 7L2.5 11.5" fill="none" stroke="${C.ink}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></marker>
<marker id="arR" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto"><path d="M2.5 2.5L10 7L2.5 11.5" fill="none" stroke="${C.redD}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></marker>
<marker id="arG" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto"><path d="M2.5 2.5L10 7L2.5 11.5" fill="none" stroke="#2fa376" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`;
})();
