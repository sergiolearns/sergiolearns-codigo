# Pruebas contra el módulo ipaddress de Python (referencia independiente).
import json, subprocess, random, ipaddress
def js(cases):
    r = subprocess.run(['node','-e','''const f=require("./engine.js");const C=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify(C.map(c=>{const o=f(c[0],c[1]);if(!o.ok)return {err:o.err};return {n:o.n,net:f.str(o.net),bc:f.str(o.bc),first:f.str(o.first),last:f.str(o.last),hosts:o.hosts,cls:o.cls,same:o.cmp&&o.cmp.same}})))'''],
        input=json.dumps(cases), capture_output=True, text=True)
    if r.stderr: print(r.stderr)
    return json.loads(r.stdout)
known = [('10.110.7.24/24',None,'10.110.7.0','10.110.7.255',254),('10.110.7.24 255.255.0.0',None,'10.110.0.0','10.110.255.255',65534),
         ('172.30.3.5/24',None,'172.30.3.0','172.30.3.255',254),('192.168.1.130/26',None,'192.168.1.128','192.168.1.191',62),
         ('128.10.2.30 255.255.252.0',None,'128.10.0.0','128.10.3.255',1022)]
for (a,b,net,bc,h),x in zip(known, js([[a,b] for a,b,*_ in known])):
    print('OK ' if (x['net'],x['bc'],x['hosts'])==(net,bc,h) else 'MAL', a, x)
print('errores', js([['10.1.1.1/33',None],['10.1.1.1 255.0.255.0',None],['300.1.1.1/8',None],['10.1.1.1',None],['hola',None],['10.01.1.1/8',None]]))
random.seed(5); cases=[]
for _ in range(20000):
    ip = '.'.join(str(random.randrange(256)) for _ in range(4)); n = random.randint(0,32)
    if random.random()<.5: cases.append([f'{ip}/{n}', '.'.join(str(random.randrange(256)) for _ in range(4))])
    else: cases.append([f'{ip} {ipaddress.IPv4Network(f"0.0.0.0/{n}").netmask}', ip])
bad = 0
for c,x in zip(cases, js(cases)):
    ip, rest = c[0].replace('/',' ').split(' ')
    net = ipaddress.IPv4Network(f'{ip}/{rest}', strict=False)
    small = net.prefixlen >= 31
    exp = dict(n=net.prefixlen, net=str(net.network_address), bc=str(net.broadcast_address), first=str(net.network_address + (0 if small else 1)),
               last=str(net.broadcast_address - (0 if small else 1)), hosts=(net.num_addresses if small else net.num_addresses-2),
               same=ipaddress.IPv4Address(c[1]) in net)
    if net.prefixlen < 31 and net.prefixlen > 8: pass
    got = {k:x[k] for k in exp}
    if got != exp: bad += 1; print(c, got, exp) if bad<4 else None
print('aleatorios:', len(cases), 'distintos:', bad)
