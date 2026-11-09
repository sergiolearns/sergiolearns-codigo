import re
order=['Pattern','Matcher','MatchResult','PatternSyntaxException','ASCII','CharPredicates','IntHashSet','Grapheme']
asc=re.findall(r'static (?:final )?\w+ (\w+)\s*[=(]', open('slre/ASCII.java').read())
imports=set(); bodies=[]
for n in order:
    s=open(f'slre/{n}.java').read()
    s=re.sub(r'/\*.*?\*/','',s,count=1,flags=re.S)
    s=re.sub(r'^package [^;]+;\n','',s,flags=re.M)
    static_ascii = 'import static slre.ASCII.*;' in s
    for m in re.findall(r'^import [^;]+;\n',s,flags=re.M):
        if 'slre' not in m: imports.add(m.strip())
    s=re.sub(r'^import [^;]+;\n','',s,flags=re.M)
    s=re.sub(r'^public (final |abstract )?(class|interface) ',lambda m:(m.group(1) or '')+m.group(2)+' ',s,flags=re.M)
    s=s.replace('slre.','')
    if n=='CharPredicates':
        s=re.sub(r'(?<![\w.])(Bmp)?CharPredicate(?!s)\b',lambda m:'Pattern.'+m.group(0),s)
    if static_ascii:
        for name in asc:
            s=re.sub(r'(?<![\w.])'+name+r'\b(?=\s*\()',f'ASCII.{name}',s)
            s=re.sub(r'(?<![\w.])'+name+r'\b(?!\s*\()',f'ASCII.{name}',s) if name.isupper() else s
    bodies.append(s)
src='\n'.join(sorted(imports))+'\n'+'\n'.join(bodies)
open('SlRegex.java','w').write(src)
print(len(src.splitlines()),'lines',len(src),'bytes')

# --- parches para la biblioteca de TeaVM ---
s=open('SlRegex.java').read()
s=s.replace('import java.text.Normalizer.Form;\n','').replace('import java.text.Normalizer;\n','')
s=re.sub(r'^\s*@java\.io\.Serial\s*\n','\n',s,flags=re.M)
i=s.index('private void readObject(java.io.ObjectInputStream s)')
j=s.index('{',i); d=0; k=j
while True:
    if s[k]=='{': d+=1
    elif s[k]=='}':
        d-=1
        if d==0: break
    k+=1
s=s[:i]+'// SL: sin serialización\n'+s[k+1:]
s=re.sub(r'Normalizer\.normalize\(',r'SlNorm.normalize(',s)
s=re.sub(r'(Normalizer\.)?Form\.NF[CD]','null',s)
s+='\nfinal class SlNorm { static String normalize(CharSequence s, Object f){ return s.toString(); } } // SL: CANON_EQ no disponible\n'
open('SlRegex.java','w').write(s)
print('parcheado',len(s.splitlines()))

# --- propiedades Unicode que TeaVM no trae: error claro, nunca un resultado falso ---
s=open('SlRegex.java').read()
s=s.replace('return Character.codePointOf(name);','throw new IllegalArgumentException(); // SL: \\N{...} no disponible')
s=s.replace('throw error("Unknown character name [" + name + "]");','throw error("SL_NO_DISPONIBLE \\\\N{" + name + "}");')
i=s.index('static Pattern.CharPredicate forUnicodeScript(String name) {')
j=s.index('\n    }\n',i)
s=s[:i]+'static Pattern.CharPredicate forUnicodeScript(String name) {\n        return null; // SL: escrituras Unicode (\\\\p{IsLatin}) no disponibles en TeaVM\n'+s[j+1:]
for m in ['isIdeographic','isMirrored','isEmoji','isEmojiPresentation','isEmojiModifier','isEmojiModifierBase','isEmojiComponent','isExtendedPictographic']:
    s=s.replace('Character::'+m+';','SlNorm.no("'+m+'");')
s=s.replace('final class SlNorm {','final class SlNorm {\n  static Pattern.CharPredicate no(String q){ return ch -> { throw new UnsupportedOperationException("SL_NO_DISPONIBLE " + q); }; }')
open('SlRegex.java','w').write(s)
print('unicode', s.count('SL_NO_DISPONIBLE'))

# --- sin comentarios (el aviso de licencia va al principio) ---
s=open('SlRegex.java').read()
out=[];i=0;n=len(s)
while i<n:
    c=s[i]
    if c=='"' :
        if s.startswith('"""',i):
            j=s.index('"""',i+3)+3; out.append(s[i:j]); i=j; continue
        j=i+1
        while s[j]!='"': j+= 2 if s[j]=='\\' else 1
        out.append(s[i:j+1]); i=j+1; continue
    if c=="'":
        j=i+1
        while s[j]!="'": j+= 2 if s[j]=='\\' else 1
        out.append(s[i:j+1]); i=j+1; continue
    if s.startswith('/*',i): i=s.index('*/',i+2)+2; continue
    if s.startswith('//',i):
        j=s.find('\n',i); i=n if j<0 else j; continue
    out.append(c); i+=1
s=''.join(out)
s='\n'.join(l.rstrip() for l in s.split('\n') if l.strip())
lic=open('LICENCIA-OPENJDK.txt').read().strip()
s=lic+'\n/* SergioLearns: java.util.regex de OpenJDK 21 (jdk21u) aplanado en una unidad para TeaVM.\n * Cambios: paquete por defecto, sin serialización, sin Normalizer (CANON_EQ),\n * sin \\N{...}, escrituras \\p{IsLatin} ni propiedades de emoji/ideogramas (dan error, nunca un resultado falso). */\n'+s+'\n'
open('SlRegex.java','w').write(s)
print('final',len(s.splitlines()),'líneas',len(s),'bytes')
