const G=require('./engine-gj.js'); const S=G.str; const fm=A=>G.fromNums(A);
const show=M=>M.map(r=>r.map(S).join(' ')).join(' ; ');
let ok=0,bad=0; const t=(n,a,b)=>{ if(JSON.stringify(a)===JSON.stringify(b)) ok++; else {bad++; console.log('MAL',n,a,b);} };
// batido
let M=fm([[4,6,1,15],[18,10,24,70],[2,3,0,7]]); let R=G.solve(M,{sep:3,jordan:true});
t('batido', show(R.M), '1 0 0 2 ; 0 1 0 1 ; 0 0 1 1'); t('batido rouche', G.rouche(R.M,3).kind,'CD');
t('det batido', S(G.det(fm([[4,6,1],[18,10,24],[2,3,0]]))), '34');
// requesón
M=fm([[4,6,1,8,15],[18,10,24,2,70],[2,3,0,4,7]]); R=G.solve(M,{sep:4,jordan:true}); let P=G.param(R.M,4);
t('req kind',P.kind,'CI'); t('req', P.vals.map(v=>S(v.c)+'+'+v.t.map(S).join(',')), ['2+1','1+-2','1+0','0+1']);
// imposible
M=fm([[4,6,15],[2,3,7]]); R=G.solve(M,{sep:2}); t('imp',G.rouche(R.M,2).kind,'I');
// CI 14
M=fm([[4,6,14],[2,3,7]]); R=G.solve(M,{sep:2,jordan:true}); t('ci',G.rouche(R.M,2).kind,'CI');
// inversa K3
let I=G.inverse(fm([[1,1,1],[0,1,1],[-2,-1,0]])); t('inv', show(I.inv), '1 -1 0 ; -2 2 -1 ; 2 -1 1');
t('detK3', S(G.det(fm([[1,1,1],[0,1,1],[-2,-1,0]]))), '1');
t('detD', S(G.det(fm([[2,0,1,3],[1,-1,0,2],[0,3,1,-1],[1,2,0,1]]))), '-1');
t('K', show(G.inverse(fm([[2,1],[5,3]])).inv), '3 -1 ; -5 2');
t('Kmal', G.inverse(fm([[2,4],[1,2]])).ok, false);
t('parse', [G.parse('-2/5'),G.parse('1,5'),G.parse('−4'),G.parse('a'),G.parse('3/0')].map(x=>x?S(x):null), ['-2/5','3/2','-4',null,null]);
// homogéneo ejercicio T2: rank & params
// random check det vs cofactor-free: compare det to product formula via fraction gauss with unit
for(let k=0;k<300;k++){ const n=1+Math.floor(Math.random()*4); const A=[...Array(n)].map(()=>[...Array(n)].map(()=>Math.floor(Math.random()*9)-4));
 const lap=a=>a.length===1?a[0][0]:a[0].reduce((s,x,j)=>s+(j%2?-1:1)*x*lap(a.slice(1).map(r=>r.filter((_,c)=>c!==j))),0);
 const d=G.det(fm(A)); if(G.num(d)!==lap(A)) {bad++; console.log('det',A,S(d),lap(A));} else ok++;
 const R2=G.solve(fm(A),{jordan:true,unit:true}); const d2=G.div(G.ONE,R2.f); if(R2.piv.length===n && G.num(d2)!==lap(A)){bad++;console.log('detGJ',A);} 
 const iv=G.inverse(fm(A)); if(iv.ok!==(lap(A)!==0)){bad++;console.log('inv',A);} }
console.log('ok',ok,'mal',bad);
