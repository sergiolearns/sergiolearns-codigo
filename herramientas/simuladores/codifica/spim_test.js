const fs=require('fs'),M=process.argv[2];const Spim=require(M+'/fuentes/sl-mips-core.js');const S=require('./engine.js');
const sp=new Spim(new WebAssembly.Module(fs.readFileSync(M+'/sl-spim.wasm')));
const RG=S.REG.filter(r=>r!=='$at'&&r!=='$k0'&&r!=='$k1');const R=()=>RG[Math.floor(Math.random()*RG.length)];const I=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function gen(n){const k=Math.random();
 if(k<.25)return `${['add','addu','sub','subu','and','or','xor','nor','slt','sltu'][I(0,9)]} ${R()}, ${R()}, ${R()}`;
 if(k<.33)return `${['sll','srl','sra'][I(0,2)]} ${R()}, ${R()}, ${I(0,31)}`;
 if(k<.37)return `${['sllv','srlv','srav'][I(0,2)]} ${R()}, ${R()}, ${R()}`;
 if(k<.4)return `${['mult','div','multu','divu'][I(0,3)]} ${R()}, ${R()}`;
 if(k<.43)return `${['mfhi','mflo'][I(0,1)]} ${R()}`;
 if(k<.46)return `jr ${R()}`;
 if(k<.56)return `${['addi','addiu','slti','sltiu'][I(0,3)]} ${R()}, ${R()}, ${I(-32768,32767)}`;
 if(k<.62)return `${['andi','ori','xori'][I(0,2)]} ${R()}, ${R()}, ${I(0,65535)}`;
 if(k<.65)return `lui ${R()}, ${I(0,65535)}`;
 if(k<.76)return `${['lb','lh','lw','lbu','lhu','sb','sh','sw'][I(0,7)]} ${R()}, ${I(-32768,32767)}(${R()})`;
 if(k<.88)return `${['beq','bne'][I(0,1)]} ${R()}, ${R()}, L${I(0,n-1)}`;
 if(k<.92)return `${['blez','bgtz','bltz','bgez'][I(0,3)]} ${R()}, L${I(0,n-1)}`;
 if(k<.96)return `syscall`;
 return `${['j','jal'][I(0,1)]} L${I(0,n-1)}`;}
let tot=0,bad=0,skip=0;
for(let p=0;p<250;p++){const n=I(3,14),L=[];for(let i=0;i<n;i++)L.push(`L${i}: ${gen(n)}`);
 const r=sp.load('.text\nmain:\n'+L.join('\n')+'\n');if(!r.ok){skip++;continue;}
 const base=sp.sym('main');const ok=!/<none>/.test(sp.inst(base+4*(n-1)))&&/<none>/.test(sp.inst(base+4*n));if(!ok){skip++;continue;}
 const o=S.assemble(L,base,'qtspim');
 o.rows.forEach((row,i)=>{tot++;const w=parseInt(/0x([0-9a-f]{8})/.exec(sp.inst(base+4*i).split(']')[1])[1],16)>>>0;
  if(row.err||row.w!==w){bad++;if(bad<6)console.log('MAL',L[i],row.err,row.w&&row.w.toString(16),w.toString(16),sp.inst(base+4*i));}
  else{const d=S.decode(w,base+4*i,'qtspim');const back=S.enc(d.txt,base+4*i,{},'qtspim');if(S.word(back)!==w){bad++;console.log('IDA Y VUELTA',L[i],d.txt);}}});}
console.log('instrucciones',tot,'distintas',bad,'programas saltados',skip);
