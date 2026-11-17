"""Pruebas del motor de ME1 contra SciPy (misma convención que R)."""
import json, subprocess, random
from scipy import stats
import numpy as np
random.seed(7)
cases=[]
def add(k,P,xs,ps): cases.append(dict(k=k,P=P,xs=xs,ps=ps))
for _ in range(60):
    n=random.randint(1,60); p=round(random.uniform(.01,.99),2); add('binom',dict(size=n,prob=p),list(range(-1,n+2)),[.01,.1,.3,.5,.7,.9,.99])
    l=round(random.uniform(.1,30),1); add('pois',dict(**{'lambda':l}),list(range(0,int(l*3)+10)),[.01,.25,.5,.75,.975])
    p=round(random.uniform(.02,.98),2); add('geom',dict(prob=p),list(range(0,30)),[.05,.5,.95])
    m,nn=random.randint(1,40),random.randint(1,40); k=random.randint(1,m+nn); add('hyper',dict(m=m,n=nn,k=k),list(range(0,k+1)),[.05,.5,.95])
    a=round(random.uniform(-10,10),1); add('unif',dict(min=a,max=a+round(random.uniform(.5,20),1)),[a-1,a+.3,a+2,a+50],[.1,.5,.9])
    r=round(random.uniform(.02,5),2); add('exp',dict(rate=r),[0,.1,1,3,10,40],[.01,.5,.99])
    sh=round(random.uniform(.2,30),1); r=round(random.uniform(.05,5),2); add('gamma',dict(shape=sh,rate=r),[.01,.5,1,5,20,60],[.01,.1,.5,.9,.99])
    mu=round(random.uniform(-20,50),1); sd=round(random.uniform(.1,30),1); add('norm',dict(mean=mu,sd=sd),[mu-5*sd,mu-sd,mu,mu+.3*sd,mu+4*sd],[.001,.025,.5,.95,.999])
    df=random.randint(1,60); add('chisq',dict(df=df),[.1,1,df,2*df,4*df],[.01,.05,.5,.95,.99])
    df=random.randint(1,120); add('t',dict(df=df),[-6,-2,-.5,0,1,2.5,8],[.005,.025,.5,.975,.995])
    d1,d2=random.randint(1,60),random.randint(1,120); add('f',dict(df1=d1,df2=d2),[.05,.5,1,2,5],[.05,.5,.95])
js=r"""const S=require('./engine.js');const C=JSON.parse(require('fs').readFileSync(0,'utf8'));
console.log(JSON.stringify(C.map(c=>{const D=S.DIST[c.k],P=S.params(c.k,c.P);return {P,d:c.xs.map(x=>D.pdf(x,P)),p:c.xs.map(x=>D.cdf(x,P)),u:c.xs.map(x=>D.up(x,P)),q:c.ps.map(p=>D.q(p,P))}})))"""
out=json.loads(subprocess.run(['node','-e',js],input=json.dumps(cases),capture_output=True,text=True,check=True,cwd='.').stdout)
def ref(k,P):
    return {'binom':lambda:stats.binom(P['size'],P['prob']),'pois':lambda:stats.poisson(P['lambda']),'geom':lambda:stats.geom(P['prob'],loc=-1),'hyper':lambda:stats.hypergeom(P['m']+P['n'],P['m'],P['k']),
     'unif':lambda:stats.uniform(P['min'],P['max']-P['min']),'exp':lambda:stats.expon(scale=1/P['rate']),'gamma':lambda:stats.gamma(P['shape'],scale=1/P['rate']),'norm':lambda:stats.norm(P['mean'],P['sd']),
     'chisq':lambda:stats.chi2(P['df']),'t':lambda:stats.t(P['df']),'f':lambda:stats.f(P['df1'],P['df2'])}[k]()
bad=0;tot=0;worst={}
def close(a,b,rel=1e-8,ab=1e-11):
    if np.isinf(b) or np.isinf(a): return a==b
    return abs(a-b)<=ab+rel*abs(b)
for c,o in zip(cases,out):
    R=ref(c['k'],o['P']); disc=c['k'] in('binom','pois','geom','hyper')
    for x,d,p,u in zip(c['xs'],o['d'],o['p'],o['u']):
        rd=R.pmf(x) if disc else R.pdf(x); rp=R.cdf(x); ru=R.sf(x)
        for a,b,nm in((d,rd,'d'),(p,rp,'p'),(u,ru,'u')):
            tot+=1
            if not close(a,b,1e-7,1e-12): bad+=1; worst.setdefault(c['k']+nm,[]).append((o['P'],x,a,b))
    for pp,q in zip(c['ps'],o['q']):
        rq=R.ppf(pp); tot+=1
        if disc:
            ok= q==rq
        else: ok=close(q,rq,1e-7,1e-9)
        if not ok: bad+=1; worst.setdefault(c['k']+'q',[]).append((o['P'],pp,q,rq))
print('casos',tot,'fallos',bad)
for k,v in worst.items(): print(k,len(v),v[:3])
