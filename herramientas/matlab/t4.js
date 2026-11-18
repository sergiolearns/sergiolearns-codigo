// 18 nov 2026: pruebas de complejos (z^n exacto, polyval, format rat, notación científica, trigonometría, conv/deconv, nthroot…)
const S=require('./slmat.js'); let bad=0,n=0;
function R(src){const c=new S.Ctx();try{S.run(src,c);}catch(e){return 'ERR '+e.message;}return c.outBuf.replace(/\n+/g,'|');}
function ok(src,want){n++;const got=R(src);if(!got.includes(want)){bad++;console.log('FALLA',src,'→',got,'| quería',want);}}
ok('c=1i^2','c =|    -1|'); ok('d=(1+1i)^8','d =|    16|'); ok('e=(1+1i)^-2','0.0000 - 0.5000i');
ok('p=polyval([1 0 1],[1i 2])','0     5'); ok('p=polyval([1 -3 7 -5],1+2i)','p =|     0|'); ok('p=polyval([1 0],2+3i)','2.0000 + 3.0000i');
ok('format rat; w=(1+2i)/(3-4i)','-1/5 + 2/5i'); ok('x=1e5*(1+2i)','1.0000e+05 + 2.0000e+05i'); ok('y=1e-4i','0.0000e+00 + 1.0000e-04i');
ok('a=asin(2)','1.5708 - 1.3170i'); ok('a=acos(2)','0.0000 + 1.3170i'); ok('a=atan(1+1i)','1.0172 + 0.4024i'); ok('a=sin(1i)','0.0000 + 1.1752i');
ok('a=log10(-100)','2.0000 + 1.3644i'); ok('a=round(2.5-3.5i)','3.0000 - 4.0000i'); ok('a=sign(3+4i)','0.6000 + 0.8000i');
ok('r=nthroot(-27,3)','-3'); ok('r=nthroot(16,4)','     2'); ok('r=nthroot(-16,4)','ERR'); ok('r=rad2deg(pi)','180'); ok('r=deg2rad(180)','3.1416');
ok('r=acosd(0.5)','60.0000'); ok('r=asind(1)','90'); ok('r=atan2d(1,-1)','135');
ok('[t,r]=cart2pol(1,1)','0.7854'); ok('[x,y]=pol2cart(pi/2,2)','y =|     2|'); ok('c=conv([1 2],[1 -2])','1     0    -4'); ok('c=conv([1 1i],[1 -1i])','1     0     1');
ok('[q,r]=deconv([1 -3 7 -5],[1 -2 5])','q =|     1    -1|'); ok('z=sqrt(3)+1i; [abs(z) angle(z)*180/pi]','2.0000   30.0000');
ok('z=2*exp(1i*pi/6)','1.7321 + 1.0000i'); ok('r=(-8i)^(1/3)','1.7321 - 1.0000i'); ok('compass(1+1i)','ERR');
console.log('pruebas',n,'fallos',bad);
