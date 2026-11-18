        /* v2.8 (18 nov 2026, intensivo de MATLAB, v93): las figuras de plot, fill, quiver y plot3 se dibujan en la ventana de comandos (SVG con la paleta). */
        function slmFigSvg(F) {
          var it = F.items || [], dr = it.filter(function (x) { return /^(plot|fill|quiver|plot3|scatter|line)$/.test(x.fn); });
          if (!dr.length) return '';
          var is3 = dr.some(function (x) { return x.fn === 'plot3'; });
          function nums(v) { return v && v.re ? v.re : []; }
          function P3(x, y, z) { return [x - 0.55 * y, z - 0.32 * y]; }   // perspectiva caballera para plot3
          var pts = [];
          dr.forEach(function (x) { var a = x.args;
            if (x.fn === 'quiver') nums(a[0]).forEach(function (_, k) { pts.push([a[0].re[k], a[1].re[k]], [a[0].re[k] + a[2].re[k], a[1].re[k] + a[3].re[k]]); });
            else if (x.fn === 'plot3') nums(a[0]).forEach(function (_, k) { pts.push(P3(a[0].re[k], a[1].re[k], a[2].re[k])); });
            else if (a[1] && a[1].re) nums(a[0]).forEach(function (_, k) { pts.push([a[0].re[k], a[1].re[k]]); });
            else if (a[0] && a[0].re) nums(a[0]).forEach(function (v, k) { pts.push(a[0].im ? [v, a[0].im[k]] : [k + 1, v]); });
          });
          if (!pts.length) return '';
          var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
          pts.forEach(function (p) { if (isFinite(p[0]) && isFinite(p[1])) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); } });
          if (x1 === x0) { x0 -= 1; x1 += 1; } if (y1 === y0) { y0 -= 1; y1 += 1; }
          var pad = 0.08 * Math.max(x1 - x0, y1 - y0); x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
          var W = 520, H = 400, L0 = 56, T0 = 44, PW = W - 80, PH = H - 96, sx = PW / (x1 - x0), sy = PH / (y1 - y0);
          var eq = is3 || it.some(function (x) { return x.fn === 'axis' && (x.args || []).indexOf('equal') >= 0; });
          if (eq) { var s = Math.min(sx, sy), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; sx = sy = s; x0 = cx - PW / 2 / s; x1 = cx + PW / 2 / s; y0 = cy - PH / 2 / s; y1 = cy + PH / 2 / s; }
          function X(v) { return (L0 + (v - x0) * sx).toFixed(1); } function Y(v) { return (T0 + PH - (v - y0) * sy).toFixed(1); }
          function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
          var COL = { r: '#FF6B4A', b: '#3A4296', k: '#1E1B2E', g: '#16794B', m: '#5B4BDB', c: '#0E6E78', y: '#B8860B' }, ci = 0, CYC = ['#3A4296', '#FF6B4A', '#16794B', '#5B4BDB'];
          function sty(spec, def) { spec = typeof spec === 'string' ? spec : ''; var c = null; for (var i = 0; i < spec.length; i++) if (COL[spec[i]]) { c = COL[spec[i]]; break; } return { c: c || def || CYC[ci++ % 4], d: /--|:/.test(spec), m: /[o*x+.s]/.test(spec), l: /-/.test(spec) || !/[o*x+.s]/.test(spec) }; }
          var b = '<rect x="' + L0 + '" y="' + T0 + '" width="' + PW + '" height="' + PH + '" fill="#fff" stroke="#D8D5E6"/>';
          function ticks(a, c) { var st = Math.pow(10, Math.floor(Math.log10((c - a) / 4))); [1, 2, 5, 10].some(function (m) { if ((c - a) / (st * m) <= 7) { st *= m; return true; } }); var t = Math.ceil(a / st) * st, o = []; while (t <= c + 1e-9) { o.push(+t.toFixed(6)); t += st; } return o; }
          if (!is3) {
            ticks(x0, x1).forEach(function (t) { b += '<path d="M' + X(t) + ' ' + T0 + 'V' + (T0 + PH) + '" stroke="#F0EEF6"/><text x="' + X(t) + '" y="' + (T0 + PH + 18) + '" font-size="11" fill="#5A566E" text-anchor="middle">' + t + '</text>'; });
            ticks(y0, y1).forEach(function (t) { b += '<path d="M' + L0 + ' ' + Y(t) + 'H' + (L0 + PW) + '" stroke="#F0EEF6"/><text x="' + (L0 - 8) + '" y="' + (+Y(t) + 4) + '" font-size="11" fill="#5A566E" text-anchor="end">' + t + '</text>'; });
          }
          dr.forEach(function (x) { var a = x.args, spec = a.filter(function (v) { return typeof v === 'string'; })[0] || '';
            if (x.fn === 'fill') { var s1 = sty(spec, '#FF6B4A'); b += '<polygon points="' + nums(a[0]).map(function (v, k) { return X(v) + ',' + Y(a[1].re[k]); }).join(' ') + '" fill="' + s1.c + '" fill-opacity=".72" stroke="' + s1.c + '" stroke-width="1.6"/>'; return; }
            if (x.fn === 'quiver') { var s2 = sty(spec, '#3A4296'); nums(a[0]).forEach(function (_, k) { var xa = a[0].re[k], ya = a[1].re[k], xb = xa + a[2].re[k], yb = ya + a[3].re[k], ang = Math.atan2(+Y(yb) - +Y(ya), +X(xb) - +X(xa));
              b += '<path d="M' + X(xa) + ' ' + Y(ya) + 'L' + X(xb) + ' ' + Y(yb) + '" stroke="' + s2.c + '" stroke-width="2"/><path d="M' + X(xb) + ' ' + Y(yb) + 'l' + (-9 * Math.cos(ang - 0.4)).toFixed(1) + ' ' + (-9 * Math.sin(ang - 0.4)).toFixed(1) + 'M' + X(xb) + ' ' + Y(yb) + 'l' + (-9 * Math.cos(ang + 0.4)).toFixed(1) + ' ' + (-9 * Math.sin(ang + 0.4)).toFixed(1) + '" stroke="' + s2.c + '" stroke-width="2"/>'; }); return; }
            var xy = [];
            if (x.fn === 'plot3') nums(a[0]).forEach(function (_, k) { xy.push(P3(a[0].re[k], a[1].re[k], a[2].re[k])); });
            else if (a[1] && a[1].re) nums(a[0]).forEach(function (_, k) { xy.push([a[0].re[k], a[1].re[k]]); });
            else nums(a[0]).forEach(function (v, k) { xy.push(a[0].im ? [v, a[0].im[k]] : [k + 1, v]); });
            var s3 = sty(spec, x.fn === 'scatter' ? '#3A4296' : null);
            if (x.fn === 'scatter') s3.l = false, s3.m = true;
            if (s3.l) b += '<path d="M' + xy.map(function (p) { return X(p[0]) + ' ' + Y(p[1]); }).join('L') + '" fill="none" stroke="' + s3.c + '" stroke-width="2"' + (s3.d ? ' stroke-dasharray="6 5"' : '') + '/>';
            if (s3.m) xy.forEach(function (p) { b += '<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="4.5" fill="#fff" stroke="' + s3.c + '" stroke-width="2"/>'; });
          });
          it.forEach(function (x) { var a = x.args || [];
            if (x.fn === 'title' && typeof a[0] === 'string') b += '<text x="' + (L0 + PW / 2) + '" y="28" font-size="14" font-weight="700" fill="#1E1B2E" text-anchor="middle">' + esc(a[0]) + '</text>';
            if (x.fn === 'xlabel' && typeof a[0] === 'string') b += '<text x="' + (L0 + PW / 2) + '" y="' + (H - 12) + '" font-size="12" fill="#5A566E" text-anchor="middle">' + esc(a[0]) + '</text>';
            if (x.fn === 'ylabel' && typeof a[0] === 'string') b += '<text x="14" y="' + (T0 + PH / 2) + '" transform="rotate(-90 14 ' + (T0 + PH / 2) + ')" font-size="12" fill="#5A566E" text-anchor="middle">' + esc(a[0]) + '</text>';
            if (x.fn === 'text' && a[0] && a[0].re && a[1] && a[1].re) b += '<text x="' + X(a[0].re[0]) + '" y="' + Y(a[1].re[0]) + '" font-size="12" fill="#2E2A42">' + esc(a[2]) + '</text>';
          });
          return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:' + W + 'px;display:block;font-family:Inter,system-ui,sans-serif" role="img" aria-label="Figure">' + b + '</svg>';
        }
        function slmFigs(c) {
          if (!c || !c.figs || !c.figs.length) return;
          c.figs.forEach(function (F, k) { var s = slmFigSvg(F); if (!s) return;
            var d = el('div', 'sld-mfig'); d.style.cssText = 'margin:10px 0;padding:8px;background:#FAFAF7;border:1px solid #EEECF7;border-radius:12px;max-width:540px';
            var h = el('div', '', 'Figure ' + (k + 1)); h.style.cssText = 'font:600 12px Inter,sans-serif;color:#5A566E;margin:0 0 6px 4px'; d.appendChild(h);
            var w = document.createElement('div'); w.innerHTML = s; d.appendChild(w); con.appendChild(d); });
          c.figs = [];
        }
