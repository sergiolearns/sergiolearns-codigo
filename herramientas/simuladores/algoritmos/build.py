"""Mete el arnés y los ejemplos en dist/algoritmos.js (motor + interfaz). Uso: python3 build.py"""
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
subprocess.run([sys.executable, os.path.join(D, 'ejemplos.py')], check=True, stdout=subprocess.DEVNULL)
eng = open(os.path.join(D, 'engine.js'), encoding='utf-8').read()
eng = eng.replace('__PY_ARNES__', json.dumps(open(os.path.join(D, 'arnes.py'), encoding='utf-8').read(), ensure_ascii=False))
eng = eng.replace('__EJEMPLOS__', open(os.path.join(D, 'ejemplos.json'), encoding='utf-8').read())
os.makedirs(os.path.join(D, 'dist'), exist_ok=True)
open(os.path.join(D, 'dist', 'algoritmos.js'), 'w', encoding='utf-8').write(eng + '\n' + open(os.path.join(D, 'ui.js'), encoding='utf-8').read())
print('dist/algoritmos.js', os.path.getsize(os.path.join(D, 'dist', 'algoritmos.js')))
