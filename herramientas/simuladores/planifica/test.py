import json,subprocess,random
from ref import ref
def js(cases):
    r=subprocess.run(['node','-e','''const f=require("./engine.js");const C=JSON.parse(require("fs").readFileSync(0));
console.log(JSON.stringify(C.map(c=>{const o=f(c.p.map(x=>({n:x[0],a:x[1],b:x[2]})),c.alg,c.q);return {res:o.res.map(r=>[r.fin,r.ret,r.esp,r.resp]),avg:o.avg,sl:o.slices}})))'''],input=json.dumps(cases),capture_output=True,text=True)
    if r.stderr: print(r.stderr)
    return json.loads(r.stdout)
noche=[['onedrive',0,8],['gcc',1,4],['campus',2,9],['spotify',3,2]]
P3=[['P1',0,15],['P2',0,4],['P3',0,3]]
F=[['P1',0,9],['P2',0,4],['P3',0,2]]
S=[['P1',0,7],['P2',2,4],['P3',4,1],['P4',5,4]]
known=[(F,'fcfs',1,7.333,12.333),(S,'sjf',1,4,None),(S,'srtf',1,3,None),(P3,'rr',4,6.333,13.667),(P3,'rr',2,7,14.333),(P3,'rr',1,6.667,14),
       (noche,'rr',3,10,15.75),(noche,'srtf',1,5,10.75)]
out=js([{'p':p,'alg':a,'q':q} for p,a,q,_,_ in known])
for (p,a,q,e,r),o in zip(known,out):
    ok=abs(o['avg']['esp']-e)<0.01 and (r is None or abs(o['avg']['ret']-r)<0.01)
    print('OK ' if ok else 'MAL',a,q,round(o['avg']['esp'],3),round(o['avg']['ret'],3),o['avg']['resp'],[ (s['p'],s['s'],s['e']) for s in o['sl']])
# aleatorios
random.seed(7); cases=[]
for _ in range(4000):
    n=random.randint(1,8); p=[['p%d'%i,random.randint(0,15),random.randint(1,12)] for i in range(n)]
    cases.append({'p':p,'alg':random.choice(['fcfs','sjf','srtf','rr']),'q':random.randint(1,6)})
o=js(cases); bad=0
for c,x in zip(cases,o):
    r,g=ref([tuple(v) for v in c['p']],c['alg'],c['q'])
    if [list(v) for v in r]!=x['res']: bad+=1; 
    # el Gantt de slices coincide con el de unidades
    G=[None]*len(g)
    for s in x['sl']:
        for k in range(s['s'],s['e']): G[k]=c['p'][s['p']] and s['p']
    if G!=g: bad+=1
print('aleatorios:',len(cases),'distintos:',bad)
