const S=require('./slmat.js'),fs=require('fs');
const [,,m,real]=process.argv; const c=new S.Ctx(); try{S.run(fs.readFileSync(m,'utf8'),c);}catch(e){c.outBuf+='ERROR: '+e.message+'\n';}
let want=fs.readFileSync(real,'utf8').replace(/\r/g,'').replace(/<a [^>]*>([^<]*)<\/a>/g,'$1');
const got=c.outBuf; fs.writeFileSync('/tmp/got.txt',got); fs.writeFileSync('/tmp/want.txt',want);
