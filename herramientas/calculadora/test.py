import json, random, subprocess, sys
from ref import campos, final
random.seed(31)
cases=[]
for i in range(40000):
    asig=random.choice(['fp1','fp2','ic1','ic2'])
    conv=random.choice({'fp1':['ord','ext','esp'],'fp2':['ord','ext','esp'],'ic1':['ord','ext','esp'],'ic2':['ord','ext']}[asig])
    modo=random.choice(['nt','parciales'])
    cs=campos(asig,conv,modo)
    v={c:random.choice([random.randint(0,100)/10, random.randint(0,1000)/100, 5, 4, 0, 10, 6.5]) for c in cs}
    pend=[c for c in cs if random.random()<.3]
    vals={c:(None if c in pend else v[c]) for c in cs}
    obj=random.choice([5,7,9])
    cases.append(dict(asig=asig,conv=conv,modo=modo,v=v,vals=vals,obj=obj,pend=pend))
js=r"""
const E=require('./engine.js');const cs=JSON.parse(require('fs').readFileSync(0,'utf8'));
console.log(JSON.stringify(cs.map(c=>({f:E.evalua(c.asig,c.conv,c.modo,c.v).exacta,n:E.necesita(c.asig,c.conv,c.modo,c.vals,c.obj)}))));"""
out=json.loads(subprocess.run(['node','-e',js],input=json.dumps(cases),capture_output=True,text=True,cwd='.').stdout)
bad=0
for c,o in zip(cases,out):
    f=final(c['asig'],c['conv'],c['v'])
    if abs(f-o['f'])>1e-9: bad+=1; print('final',c,f,o['f']) if bad<5 else None
    n=o['n']
    if not c['pend']:
        assert n['estado']=='completo'; continue
    def fx(x): return final(c['asig'],c['conv'],{k:(x if k in c['pend'] else c['v'][k]) for k in c['v']})
    xs=[k/100 for k in range(1001)]
    ok=[x for x in xs if fx(x)>=c['obj']-1e-9]
    exp = 'imposible' if not ok else ('asegurado' if ok[0]==0 else 'necesitas')
    if exp!=n['estado'] or (exp=='necesitas' and abs(ok[0]-n['x'])>1e-9):
        bad+=1; print('nec',c,exp,ok[:1],n) if bad<5 else None
    # monotonía: si x sirve, todo lo mayor también
    if ok and any(fx(x)<c['obj']-1e-9 for x in xs if x>ok[0]): bad+=1; print('no monótona',c)
print(len(cases),'casos, fallos:',bad)
# ejemplos a mano
import subprocess as sp
# Ejemplos a mano (los de la página)
js2=r"""const E=require('./engine.js');const o=[
E.necesita('fp1','ord','',{a:6.5,b:null,l:8},5),
E.evalua('fp2','ord','',{a:6,b:6.8,l:3}),
E.evalua('ic1','esp','',{t:6,p:5}),
E.evalua('ic2','ord','parciales',{p1:6,p2:4,np:7,ntp:8,ntpa:9}),
E.evalua('ic2','ord','',{nt:4.2,np:3.1,ntp:10,ntpa:10}),
E.necesita('ic2','ord','parciales',{p1:6,p2:null,np:7,ntp:8,ntpa:9},5)];console.log(JSON.stringify(o.map(r=>[r.estado,r.x,(r.res||r).final,(r.res||r).notas])))"""
print(subprocess.run(['node','-e',js2],capture_output=True,text=True).stdout)
