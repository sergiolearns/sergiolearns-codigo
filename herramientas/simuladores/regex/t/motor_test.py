# Motores del probador en Chromium (Pyodide y TeaVM + SlRegex) contra CPython (arnes.py) y el JDK (Arnes.java)
import asyncio, sys, json, subprocess, time, os, base64
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, H); sys.path.insert(0, os.path.join(H, '..'))
from casos import CASOS; from java_ref import entrada, D as JD
import arnes
from playwright.async_api import async_playwright
JF = {2: 'I', 8: 'M', 32: 'S', 4: 'X'}
def pyq(c): return {'re': c[0].replace('(?<', '(?P<') if '(?<' in c[0] and not c[0].startswith('(?<=') and '(?<!' not in c[0] and '(?<=' not in c[0] else c[0], 'flags': [v for k, v in JF.items() if c[1] & k], 'rep': (c[2].replace('${', '\\g<').replace('}', '>').replace('$', '\\') if c[2] else c[2]), 'text': c[3], 'retos': c[4]}
async def main(www):
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8781', '-d', www], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
    ok = bad = 0
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
            pg = await b.new_page(); await pg.goto('http://localhost:8781/eng.html')
            t0 = time.time(); r = await pg.evaluate('q=>SLRx.runPy(q)', pyq(CASOS[0])); print('Python listo en %.1f s' % (time.time() - t0))
            for c in CASOS:
                q = pyq(c); got = await pg.evaluate('q=>SLRx.runPy(q)', q); ref = arnes.sl_regex(q)
                if got.get('r') == json.loads(json.dumps(ref)): ok += 1
                else: bad += 1; print('PY DISTINTO', q['re'], json.dumps(got)[:300], '\n   ', json.dumps(ref)[:300])
            print(f'Python: {ok}/{ok+bad} iguales a CPython')
            ok2 = bad2 = 0
            for c in CASOS[:8]:
                q = {'re': c[0], 'flags': c[1], 'rep': c[2], 'text': c[3], 'retos': c[4]}
                got = await pg.evaluate('q=>SLRx.runJava(q)', q)
                ref = json.loads(subprocess.run(['java', '-Dstdout.encoding=UTF-8', '-cp', JD, 'Main'], input=entrada(*c), capture_output=True, text=True, encoding='utf-8').stdout.strip())
                if got.get('r') == ref: ok2 += 1
                else: bad2 += 1; print('JAVA DISTINTO', c[0], json.dumps(got)[:300])
            print(f'Java: {ok2}/{ok2+bad2} iguales al JDK')
            q = {'re': '(a+)+b', 'flags': [], 'rep': None, 'text': 'a' * 32 + '!', 'retos': []}
            t0 = time.time(); got = await pg.evaluate('q=>SLRx.runPy(q,3)', q); print('backtracking catastrófico en Python:', list(got.keys()), '%.1f s' % (time.time() - t0))
            got = await pg.evaluate('q=>SLRx.runPy(q)', pyq(CASOS[2])); print('Python tras reiniciar:', 'r' in got)
            await b.close()
    finally: srv.kill()
asyncio.run(main(sys.argv[1]))
