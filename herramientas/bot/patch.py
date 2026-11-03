"""Parches [viejo, nuevo] para pasar del fragmento publicado al nuevo sin volver a subirlo entero.
Cada «viejo» es único en el fragmento publicado y no se solapa con otro; se aplican sobre las posiciones del original."""
import difflib, json, sys
a=open(sys.argv[1]).read().split('\n',1)[1]; b=open(sys.argv[2]).read().split('\n',1)[1]
sm=difflib.SequenceMatcher(None,a,b,autojunk=False)
ops=[o for o in sm.get_opcodes() if o[0]!='equal']
# agrupar cambios cercanos
groups=[]
for op in ops:
    if groups and op[1]-groups[-1][-1][2] < 300: groups[-1].append(op)
    else: groups.append([op])
hunks=[]
for g in groups:
    i1,j1=g[0][1],g[0][3]; i2,j2=g[-1][2],g[-1][4]
    c=24
    while a.count(a[max(0,i1-c):i2+c])!=1: c+=24
    hunks.append([max(0,i1-c), i2+c, a[max(0,i1-c):i1]+b[j1:j2]+a[i2:i2+c]])
# fusionar solapados
m=[]
for h in hunks:
    if m and h[0] < m[-1][1]:
        p=m[-1]; # recomputar desde b no trivial: rehacer con el rango combinado
        raise SystemExit('solapados: sube el umbral')
    m.append(h)
pairs=[[a[s:e],n] for s,e,n in m]
x=a
for (s,e,n) in reversed(m): x=x[:s]+n+x[e:]
assert x==b
print(json.dumps(pairs,ensure_ascii=False))
