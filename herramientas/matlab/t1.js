const S=require('./slmat.js');
function R(src){const c=new S.Ctx();try{S.run(src,c);}catch(e){c.outBuf+='ERROR'+(e.line?' (línea '+e.line+')':'')+': '+e.message+'\n'+(e.isM?'':e.stack);}return c.outBuf;}
const t=process.argv[2]; console.log(R(require('fs').readFileSync(t,'utf8')));
