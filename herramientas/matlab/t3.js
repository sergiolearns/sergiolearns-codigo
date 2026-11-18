const S=require('./slmat.js'); let bad=0,n=0;
function ev(src){const c=new S.Ctx();S.run(src,c);return c;}
const tests=[];
for(let t=0;t<300;t++){const m=1+Math.floor(Math.random()*5),k=1+Math.floor(Math.random()*5),sym=Math.random()<.4;
 let A=[];for(let i=0;i<m;i++){A.push([]);for(let j=0;j<k;j++)A[i].push(Math.floor(Math.random()*13)-6);}
 if(sym){const nn=m;A=[];for(let i=0;i<nn;i++){A.push([]);for(let j=0;j<nn;j++)A[i].push(0);}for(let i=0;i<nn;i++)for(let j=0;j<=i;j++){const v=Math.floor(Math.random()*13)-6;A[i][j]=v;A[j][i]=v;}}
 const M='['+A.map(r=>r.join(' ')).join(';')+']'; const sq=A.length===A[0].length;
 const src='A='+M+';[L,U,P]=lu(A);e1=norm(P*A-L*U);[Q,R]=qr(A);e2=norm(Q*R-A)+norm(Q\'*Q-eye(size(Q,1)));N=null(A);e3=norm(A*N)+norm(N\'*N-eye(size(N,2)));[Us,Ss,Vs]=svd(A);e4=norm(Us*Ss*Vs\'-A);'+(sq?'[V,D]=eig(A);e5=norm(A*V-V*D)/max(1,norm(A));':'e5=0;');
 let c; try{c=ev(src);}catch(e){bad++;console.log('ERR',M,e.message);continue;}
 for(const k of ['e1','e2','e3','e4','e5']){n++;const v=c.vars.get(k).re[0];if(!(v<1e-6)){bad++;if(bad<10)console.log(k,v,M);}}
}
console.log('pruebas',n,'fallos',bad);
