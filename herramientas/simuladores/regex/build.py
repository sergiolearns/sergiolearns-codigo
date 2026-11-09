# Rellena engine.js con los arneses y SlRegex.java comprimido -> dist/regex.js (sin minificar) para las pruebas y el fragmento
import json, gzip, base64, os
D = os.path.dirname(os.path.abspath(__file__))
r = lambda f: open(os.path.join(D, f), encoding='utf-8').read()
gz = base64.b64encode(gzip.compress(open(os.path.join(D, 'motor-java', 'SlRegex.java'), encoding='utf-8').read().encode('utf-8'), 9, mtime=0)).decode()
e = r('engine.js')
for k, v in (('__PY_ARNES__', json.dumps(r('arnes.py'))), ('__JAVA_ARNES__', json.dumps(r('Arnes.java'))), ('__JAVA_GZ__', json.dumps(gz))):
    assert e.count(k) == 1, k
    e = e.replace(k, v)
os.makedirs(os.path.join(D, 'dist'), exist_ok=True)
ui = r('ui.js') if os.path.exists(os.path.join(D, 'ui.js')) else ''
open(os.path.join(D, 'dist', 'regex.js'), 'w', encoding='utf-8').write(e + '\n' + ui)
print('dist/regex.js', len(e + ui), 'bytes (SlRegex gz+b64:', len(gz), ')')
