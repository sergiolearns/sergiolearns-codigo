const S=require('./slmat.js'); const cases=require('./cases.json'); let bad=0, n=0;
function ev(src){const c=new S.Ctx();S.run(src,c);return c;}
function mat(A){return '['+A.map(r=>r.join(' ')).join(';')+']';}
function rows(v){const o=[];for(let i=0;i<v.r;i++){const r=[];for(let j=0;j<v.c;j++)r.push(v.re[j*v.r+i]);o.push(r);}return o;}
function close(a,b,tol=1e-9){return Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b));}
function chk(name,ok,info){n++;if(!ok){bad++;if(bad<15)console.log('FALLA',name,JSON.stringify(info).slice(0,300));}}
for(const c of cases){
  const ctx=ev('A='+mat(c.A)+';b='+mat(c.b.map(x=>[x]))+';r=rank(A);[R,p]=rref(A);N=null(A,\'r\');');
  const g=k=>ctx.vars.get(k);
  chk('rank',g('r').re[0]===c.rank,{A:c.A});
  const R=rows(g('R')); chk('rref',R.every((row,i)=>row.every((x,j)=>close(x,c.rref[i][j],1e-9))),{A:c.A,R,want:c.rref});
  chk('piv',JSON.stringify(Array.from(g('p').re))===JSON.stringify(c.piv),{A:c.A});
  const N=g('N'); const cols=[];for(let j=0;j<N.c;j++){const v=[];for(let i=0;i<N.r;i++)v.push(N.re[j*N.r+i]);cols.push(v);}
  chk('nullr',cols.length===c.nullr.length&&cols.every((v,k)=>v.every((x,i)=>close(x,c.nullr[k][i],1e-9))),{A:c.A,cols,want:c.nullr});
  if(c.det!==undefined){const d=ev('A='+mat(c.A)+';d=det(A);').vars.get('d').re[0]; chk('det',close(d,c.det,1e-9),{A:c.A,d,want:c.det});
    if(c.inv){const I=rows(ev('A='+mat(c.A)+';X=inv(A);').vars.get('X'));chk('inv',I.every((row,i)=>row.every((x,j)=>close(x,c.inv[i][j],1e-8))),{A:c.A});}
    const E=ev('A='+mat(c.A)+';e=eig(A);').vars.get('e'); const got=[];for(let i=0;i<E.re.length;i++)got.push([E.re[i],E.im?E.im[i]:0]);got.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    chk('eig',got.every((z,i)=>Math.hypot(z[0]-c.eig[i][0],z[1]-c.eig[i][1])<1e-6*Math.max(1,Math.hypot(...c.eig[i]))),{A:c.A,got,want:c.eig});}
  if(c.x){const x=ev('A='+mat(c.A)+';b='+mat(c.b.map(x=>[x]))+';x=A\\b;').vars.get('x');chk('mldivide',Array.from(x.re).every((v,i)=>close(v,c.x[i],1e-8)),{A:c.A,b:c.b,x:Array.from(x.re),want:c.x});}
}
console.log('pruebas',n,'fallos',bad);
