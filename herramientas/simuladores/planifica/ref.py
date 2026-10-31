# Referencia independiente en Python (otra forma de programarlo): simula unidad a unidad.
def ref(procs, alg, q=1):
    n=len(procs); rem=[b for _,_,b in procs]; fin=[None]*n; start=[None]*n
    t=0; queue=[]; cur=None; used=0; gantt=[]
    arrived=set()
    while any(f is None for f in fin):
        news=sorted([i for i in range(n) if procs[i][1]==t], key=lambda i:(procs[i][1],i))
        if cur is not None and rem[cur]==0:
            fin[cur]=t; cur=None
        back=None
        if alg=='rr' and cur is not None and used==q:
            back=cur
        queue+=news
        if back is not None:
            if queue: queue.append(back); cur=None
            else: used=0
        if alg=='srtf' and cur is not None and news:
            m=min(news,key=lambda i:(rem[i],procs[i][1],i))
            if rem[m]<rem[cur]: queue.append(cur); cur=None
        if cur is None and queue:
            if alg in('fcfs','rr'): cur=queue.pop(0)
            elif alg=='sjf': cur=min(queue,key=lambda i:(procs[i][2],procs[i][1],i)); queue.remove(cur)
            else: cur=min(queue,key=lambda i:(rem[i],procs[i][1],i)); queue.remove(cur)
            used=0
            if start[cur] is None: start[cur]=t
        if all(f is not None for f in fin): break
        gantt.append(cur)
        if cur is not None: rem[cur]-=1; used+=1
        t+=1
    res=[(fin[i], fin[i]-procs[i][1], fin[i]-procs[i][1]-procs[i][2], start[i]-procs[i][1]) for i in range(n)]
    return res, gantt
