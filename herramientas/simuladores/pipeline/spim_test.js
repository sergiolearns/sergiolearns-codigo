const fs=require('fs'),M=process.argv[2];const Spim=require(M+'/fuentes/sl-mips-core.js');const P=require('./engine.js');const T=require('./trace.js');
const mod=new WebAssembly.Module(fs.readFileSync(M+'/sl-spim.wasm'));const s=new Spim(mod);
const D='        .data\nt: .word 120, 85\n        .text\nmain:   la $s0, t\n        li $s1, 30\n';
const caja=D+'        lw  $t0, 0($s0)\n        lw  $t1, 4($s0)\n        add $t2, $t0, $t1\n        sub $t3, $t2, $s1\n        sw  $t3, 8($s0)\n        addi $s2, $s2, 1\n        li $v0, 10\n        syscall\n';
let ok=0,bad=0;const chk=(n,a,b)=>{if(a===b)ok++;else{bad++;console.log('MAL',n,a,b)}};
// solo las 6 de la caja (quitando la, li y el syscall de salida) para comparar con el artículo
let r=T(s,caja,{});const body=r.trace.filter(e=>!e.exit).slice(3);
chk('caja n',body.length,6);
chk('caja sin',P.total(P.schedule(body,{fwd:false})),16);
chk('caja con',P.total(P.schedule(body,{fwd:true})),11);
const re=D+'        lw  $t0, 0($s0)\n        lw  $t1, 4($s0)\n        addi $s2, $s2, 1\n        add $t2, $t0, $t1\n        sub $t3, $t2, $s1\n        sw  $t3, 8($s0)\n        li $v0, 10\n        syscall\n';
r=T(s,re,{});chk('reord',P.total(P.schedule(r.trace.filter(e=>!e.exit).slice(3),{fwd:true})),10);
chk('caja t3',r.regs[11],175);
// bucle: 2 vueltas, el bne salta 1 vez
const bu='        .data\nv: .word 3, 4\n        .text\nmain:   la $t0, v\n        li $s3, 2\nLoop:   lw $t1, 0($t0)\n        add $t2, $t2, $t1\n        addi $t0, $t0, 4\n        addi $s3, $s3, -1\n        bne $s3, $zero, Loop\n        jr $ra\n';
r=T(s,bu,{});chk('bucle fin',r.end,'ret');chk('bucle n',r.trace.length,13);chk('tk',r.trace.filter(e=>e.taken).length,1);chk('t2',r.regs[10],7);
console.log(r.trace.map(e=>e.txt+(e.taken?' (salta)':'')).join(' | '));
const rows=P.schedule(r.trace,{fwd:true,ctrl:'nosaltar'});console.log('ciclos',P.total(rows),P.stalls(rows));
// entrada por teclado
const rd='        .text\nmain:   li $v0, 5\n        syscall\n        addi $t0, $v0, 1\n        li $v0, 10\n        syscall\n';
r=T(s,rd,{input:'41'});chk('read',r.regs[8],42);const rr=P.schedule(r.trace,{fwd:true});chk('read dep',rr[2].src[0]&&rr[2].src[0].r,'$v0');
// error de ensamblado
r=T(s,'main: add $t0, $t1\n',{});chk('err',r.ok,false);console.log(JSON.stringify(r.msg).slice(0,200));
r=T(s,'.text\nfoo: nop\n',{});chk('nomain',r.msg,'nomain');
// bucle infinito
r=T(s,'.text\nmain: j main\n',{max:50,limit:3000});chk('inf',r.end,'lim');chk('cut',r.cut,true);
console.log('ok',ok,'mal',bad);
