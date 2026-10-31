# Pruebas: ejemplo del artículo «Modelos OSI y TCP/IP» y referencia independiente en Python (struct + suma de comprobación).
import json, subprocess, random, struct, socket
def js(cases):
    r = subprocess.run(['node','-e','''const f=require("./engine.js");const C=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify(C.map(c=>{const o=f(c);return {total:o.total,rows:o.rows.map(r=>[r.sec,r.data,r.seg,r.dgram,r.pad,r.frame,r.off,r.mf,r.sums[0],r.sums[1]])}})))'''],
        input=json.dumps(cases), capture_output=True, text=True)
    if r.stderr: print(r.stderr)
    return json.loads(r.stdout)
x = js([{'datos':3000,'mss':1460,'proto':'tcp'}])[0]
print('artículo', 'OK' if x['total']==3174 and [r[:6] for r in x['rows']]==[[1,1460,1480,1500,0,1518],[1461,1460,1480,1500,0,1518],[2921,80,100,120,0,138]] else 'MAL', x)
def csum(h):
    s = sum(struct.unpack('!10H', h))
    while s >> 16: s = (s & 0xffff) + (s >> 16)
    return ~s & 0xffff
def ref(datos, mss, proto, ttl=64):
    out, total = [], 0
    src, dst = socket.inet_aton('10.110.7.24'), socket.inet_aton('10.200.1.80')
    def add(sec, data, seg, idn, ff, off, mf):
        nonlocal total
        dg = seg + 20; pad = max(0, 46 - dg); fr = 14 + dg + pad + 4; total += fr
        sums = [csum(struct.pack('!BBHHHBBH4s4s', 0x45, 0, dg, idn, ff, t, 6 if proto=='tcp' else 17, 0, src, dst)) for t in (ttl, ttl-1)]
        out.append([sec, data, seg, dg, pad, fr, off, mf] + sums)
    if proto == 'tcp':
        sec = 1; i = 0
        while sec <= datos:
            d = min(mss, datos - sec + 1); add(sec, d, d + 20, 0x2a10 + i, 0x4000, 0, 0); sec += d; i += 1
    else:
        u = datos + 8; o = 0
        while o < u:
            p = min(1480, u - o); mf = 1 if o + p < u else 0
            add(None, p - 8 if o == 0 else p, p, 0x2a10, (mf << 13) | (o // 8), o // 8, mf); o += p
    return total, out
random.seed(3); cases = []
for _ in range(3000):
    pr = random.choice(['tcp','udp'])
    cases.append({'datos': random.randint(1, 20000 if pr=='tcp' else 9000), 'mss': random.randint(88,1460), 'proto': pr})
bad = 0
for c, x in zip(cases, js(cases)):
    t, rows = ref(c['datos'], c['mss'], c['proto'])
    if t != x['total'] or rows != x['rows']: bad += 1; print(c, x, rows) if bad < 3 else None
print('aleatorios:', len(cases), 'distintos:', bad)
# comprobación externa de la suma: una cabecera con su suma puesta da 0 al volver a sumar
h = struct.pack('!BBHHHBBH4s4s', 0x45,0,1500,0x2a10,0x4000,64,6,0,socket.inet_aton('10.110.7.24'),socket.inet_aton('10.200.1.80'))
s = csum(h); h2 = h[:10]+struct.pack('!H',s)+h[12:]
print('suma IP', hex(s), 'verifica' if csum(h2)==0 else 'MAL', 'motor', hex(js([{'datos':3000,'mss':1460,'proto':'tcp'}])[0]['rows'][0][8]))
