"""Referencia independiente en Python de la calculadora de notas (notas.yaml)."""
def r2(x): return round(x*100)/100  # mismo redondeo que Math.round en positivos
import math
def r2(x): return math.floor(x*100+0.5)/100
def campos(asig, conv, modo):
    if asig=='fp1': return ['a','b','l']
    if asig=='fp2': return ['a','b','l']
    if asig=='ic1': return ['t','p'] if conv=='esp' else ['t','p','c']
    if asig=='ic2': return (['p1','p2'] if (modo=='parciales' and conv=='ord') else ['nt'])+['np','ntp','ntpa']
def final(asig, conv, v):
    if asig=='fp1':
        if v['a']>=4 and v['b']>=5: f=.1*v['a']+.65*v['b']+.25*v['l']
        else: f=min(4,.1*v['a']+.65*v['b'])
    elif asig=='fp2':
        l=v['l'] if (conv!='ord' or v['l']>=5) else 0
        raw=.2*v['a']+.55*v['b']+.25*l
        if v['a']>=5 and v['b']>=5:
            f=raw
            if (.2*v['a']+.55*v['b'])/.75>6.5: f=max(f,5)
        else: f=min(raw,4)
    elif asig=='ic1':
        raw=.6*v['t']+.4*v['p'] if conv=='esp' else .5*v['t']+.4*v['p']+.1*v['c']
        f=raw if (v['t']>=5 and v['p']>=5) else min(raw,4)
    else:
        nt=v['nt'] if 'nt' in v else .4*v['p1']+.6*v['p2']
        np_=v['np']
        if nt>=5 and np_>=5: f=.35*nt+.35*np_+.2*v['ntp']+.1*v['ntpa']
        else: f=min(nt,np_)
    return max(0,min(10,f))
