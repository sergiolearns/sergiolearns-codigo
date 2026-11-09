import random,sys
random.seed(int(sys.argv[1])); N=int(sys.argv[2])
atoms=['a','b','1','\\d','\\w','\\s','.','[ab]','[^a]','[a-c1]','x','\\.','-','[\\d.]']
def q(): return random.choice(['','','*','+','?','{1,3}','{2}','{0,2}','*?','+?','??','{1,3}?','*+','++','?+','{2,}'])
def rx(d=0):
    parts=[]
    for _ in range(random.randint(1,4)):
        r=random.random()
        if d<2 and r<0.25:
            k=random.choice(['(','(?:','(?<g%d>'%random.randint(0,99),'(?=','(?!','(?<=','(?>'])
            inner=rx(d+1)
            if k=='(?<=': inner=random.choice(atoms)  # lookbehind acotado
            if random.random()<0.3: inner+='|'+rx(d+1)
            parts.append(k+inner+')'+(q() if k in('(','(?:','(?>') or k.startswith('(?<g') else ''))
        elif r<0.3: parts.append(random.choice(['^','$','\\b','\\B']))
        else: parts.append(random.choice(atoms)+q())
    return ''.join(parts)
def js(s): return '"'+s.replace('\\','\\\\').replace('"','\\"').replace('\n','\\n')+'"'
cases=[]
for i in range(N):
    r=rx()
    if random.random()<0.15: r='('+r+')\\1'
    s=''.join(random.choice('aab1 .-x1b\n') for _ in range(random.randint(0,12)))
    cases.append((r,s))
print('import java.util.regex.*;\npublic class Main {\n static void t(int i,String r,String s){ StringBuilder o=new StringBuilder(i+": ");')
print('  try{ Pattern p=Pattern.compile(r, (i%5==0)?Pattern.MULTILINE:0); Matcher m=p.matcher(s); o.append(p.matcher(s).matches()?"M ":"- "); int k=0; while(m.find() && k<20){ k++; o.append("[").append(m.start()).append(",").append(m.end()); for(int g=1;g<=m.groupCount();g++) o.append(" ").append(m.group(g)==null?"~":m.start(g)+":"+m.end(g)); o.append("]"); }')
print('   o.append(" R=").append(p.matcher(s).replaceAll("<$0>").replace("\\n","/")); o.append(" S=").append(p.split(s,-1).length);')
print('  }catch(PatternSyntaxException e){ o.append("SYN ").append(e.getDescription()).append(" @").append(e.getIndex()); }catch(Throwable e){ o.append("EXC ").append(e.getClass().getSimpleName()); } System.out.println(o); }')
print(' public static void main(String[] a){')
for i,(r,s) in enumerate(cases): print(f'  t({i},{js(r)},{js(s)});')
print(' }\n}')
