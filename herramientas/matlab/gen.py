import random, json, sympy as sp, numpy as np
random.seed(7); cases=[]
for t in range(400):
    m=random.randint(1,5); n=random.randint(1,5)
    A=[[random.randint(-6,6) for _ in range(n)] for _ in range(m)]
    if random.random()<0.3 and m>1: A[-1]=[A[0][j]*2-A[1 if m>2 else 0][j] for j in range(n)]
    S=sp.Matrix(A); R,piv=S.rref()
    c={'A':A,'rank':S.rank(),'rref':[[float(x) for x in row] for row in R.tolist()],'piv':[p+1 for p in piv]}
    N=S.nullspace()
    # null 'r' de MATLAB: columnas con 1 en la libre
    c['nullr']=[[float(v) for v in vec] for vec in N]
    if m==n:
        c['det']=float(S.det())
        if S.det()!=0: c['inv']=[[float(x) for x in row] for row in S.inv().tolist()]
        ev=np.linalg.eigvals(np.array(A,float)); c['eig']=sorted([[float(z.real),float(z.imag)] for z in ev])
    b=[random.randint(-5,5) for _ in range(m)]; c['b']=b
    An=np.array(A,float)
    if m==n and S.det()!=0: c['x']=list(np.linalg.solve(An,np.array(b,float)))
    elif m>n and S.rank()==n: c['x']=list(np.linalg.lstsq(An,np.array(b,float),rcond=None)[0])
    cases.append(c)
json.dump(cases,open('cases.json','w'))
print(len(cases))
