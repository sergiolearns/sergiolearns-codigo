# Pruebas de la interfaz (Chromium; Pyodide servido en local desde www/)
import asyncio, sys, subprocess, time, re
from playwright.async_api import async_playwright
W = sys.argv[1]; OUT = sys.argv[2]; ok = []; bad = []
def chk(c, n): (ok if c else bad).append(n)
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8792', '-d', W], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
            pg = await b.new_page(viewport={'width': 1280, 'height': 900}); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            U = 'http://localhost:8792/'
            await pg.goto(U + 'sim.html'); await pg.evaluate('localStorage.clear()'); await pg.goto(U + 'sim.html')
            await pg.wait_for_selector('.sl6-av-chip', timeout=90000)
            chk('busqueda-binaria' in await pg.inner_text('.sl6-cmdl'), 'empieza con la búsqueda binaria')
            await pg.click('[data-p="run"]'); await pg.click('[data-p="run"]')   # ejecutar y pausar
            await pg.evaluate('n=>{for(let i=0;i<n;i++)document.querySelector(\"[data-p=step]\").click()}', 40)
            chk('Fin del programa' in await pg.inner_text('.sl6-av-msg'), 'llega al final')
            chk('Turno en la posición 9' in await pg.inner_text('.sl6-av-out'), 'salida de print')
            chk(await pg.inner_text('.sl6-av-chip.is-c b') == '5', '5 comparaciones (== y < de cada vuelta)')
            await pg.click('[data-p="reset"]');
            found = False
            for _ in range(22):
                await pg.click('[data-p="step"]')
                if await pg.locator('.sl6-av-col.is-o').count() > 0: found = True; break
            chk(found, 'tramo fuera de inf..sup atenuado')
            chk(await pg.locator('.sl6-av-p em', has_text='medio').count() == 1, 'puntero medio')
            # datos al azar y lista sin ordenar
            await pg.fill('[data-pi="0"]', '9, 3, 5'); await pg.wait_for_timeout(300)
            chk('ordenada' in await pg.inner_text('.sl6-av-warn'), 'aviso de lista sin ordenar')
            await pg.click('[data-a="dice"]'); await pg.wait_for_selector('.sl6:not(.is-stale)'); await pg.wait_for_timeout(200)
            chk(await pg.inner_text('.sl6-av-warn') == '', 'al azar: ordenada, sin aviso')
            # recursión: árbol
            await pg.select_option('.sl6-av-sel', 'potencia-doble'); await pg.wait_for_selector('.sl6:not(.is-stale)'); await pg.wait_for_timeout(200)
            chk(await pg.is_visible('.sl6-av-treep'), 'árbol visible en la recursión'); chk(not await pg.is_visible('.sl6-av-memp'), 'sin panel de memoria si no hay listas')
            await pg.evaluate('n=>{for(let i=0;i<n;i++)document.querySelector(\"[data-p=step]\").click()}', 200)
            chk('15 / 15' in await pg.inner_text('.sl6-av-tc'), 'las 15 llamadas de potencia(2, 8)')
            chk('256' in await pg.inner_text('.sl6-av-out'), '2^8 = 256')
            # Java
            await pg.click('[data-tab="java"]'); chk('public class Main' in await pg.inner_text('.sl6-av-code'), 'pestaña Java'); await pg.click('[data-tab="py"]')
            # editar con un error
            await pg.click('[data-a="edit"]'); await pg.fill('.sl6-av-ta', 'notas = [1, 2, 3]\nfor i in range(4):\n    print(notas[i])\n'); await pg.click('[data-a="edit"]')
            await pg.wait_for_selector('.sl6:not(.is-stale)'); await pg.wait_for_timeout(200)
            await pg.evaluate('n=>{for(let i=0;i<n;i++)document.querySelector(\"[data-p=step]\").click()}', 30)
            chk(await pg.is_visible('.sl6-av-err') and 'IndexError' in await pg.inner_text('.sl6-av-err'), 'IndexError explicado')
            chk(await pg.locator('.sl6-av-ol li.is-err').count() == 1, 'línea del error marcada')
            chk('--editado' in await pg.inner_text('.sl6-cmdl'), 'marca de editado')
            chk('solo está' in await pg.evaluate("document.querySelector('.sl6-av-jn').textContent"), 'Java desactivado si se edita')
            # compartir y recargar
            await pg.select_option('.sl6-av-sel', 'insercion'); await pg.wait_for_selector('.sl6:not(.is-stale)')
            await pg.fill('[data-pi="0"]', '4, 1, 3'); await pg.wait_for_timeout(1200); await pg.wait_for_selector('.sl6:not(.is-stale)')
            await pg.context.grant_permissions(['clipboard-read', 'clipboard-write']); await pg.click('[data-a="share"]'); await pg.wait_for_timeout(300)
            url = pg.url; chk('#sim=' in url, 'compartir pone el estado en la dirección')
            p2 = await b.new_page(); await p2.goto(U + 'sim.html'); await p2.evaluate('localStorage.clear()'); await p2.goto('about:blank'); await p2.goto(url); await p2.wait_for_selector('.sl6-av-chip', timeout=90000)
            chk('notas = [4, 1, 3]' in await p2.inner_text('.sl6-av-code'), 'el enlace abre el mismo programa'); await p2.close()
            # reto: pedir la solución, leer la respuesta y comprobarla
            await pg.wait_for_selector('[data-rr="check"]:not([disabled])', timeout=30000)
            await pg.click('[data-rr="hint"]'); await pg.click('[data-rr="sol"]'); await pg.wait_for_timeout(500)
            m = re.search(r'respuesta es (.+)\.', await pg.inner_text('.sl6-reto__msg'))
            chk(bool(m), 'la solución dice la respuesta')
            if m:
                await pg.fill('.sl6-av-rin', m.group(1)); await pg.click('[data-rr="check"]')
                chk('Exacto' in await pg.inner_text('.sl6-reto__msg'), 'reto: la respuesta correcta vale')
                await pg.fill('.sl6-av-rin', '999'); await pg.click('[data-rr="check"]'); chk(await pg.locator('.sl6-reto__msg.is-bad').count() == 1, 'reto: la mala no')
            await pg.screenshot(path=OUT + '/escritorio-es.png', full_page=True)
            # móvil, inglés, claro
            m2 = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
            await m2.goto(U + 'sim-en.html'); await m2.evaluate('localStorage.clear()'); await m2.reload(); await m2.wait_for_selector('.sl6-av-chip', timeout=90000)
            await m2.click('[data-a="theme"]'); await m2.select_option('.sl6-av-sel', 'mezcla'); await m2.wait_for_selector('.sl6:not(.is-stale)')
            await m2.evaluate('n=>{for(let i=0;i<n;i++)document.querySelector(\"[data-p=step]\").click()}', 60)
            sw = await m2.evaluate('document.documentElement.scrollWidth'); chk(sw <= 390, 'móvil sin desbordar (%d)' % sw)
            chk('merge_sort' in await m2.inner_text('.sl6-av-code'), 'ejemplo en inglés')
            await m2.screenshot(path=OUT + '/movil-en-claro.png', full_page=True)
            chk(not errs, 'sin errores JS ' + str(errs[:2]))
            await b.close()
    finally: srv.kill()
    print(f'{len(ok)}/{len(ok)+len(bad)} bien'); [print(' FALLA', x) for x in bad]
asyncio.run(main())
