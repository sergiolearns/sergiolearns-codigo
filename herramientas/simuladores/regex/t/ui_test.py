# Pruebas de la interfaz: reto en Python y Java, Java con OpenJDK (la IP), móvil, claro, inglés, compartir y recargar
import asyncio, sys, subprocess, time
from playwright.async_api import async_playwright
W=sys.argv[1]; OUT=sys.argv[2]; ok=[]; bad=[]
def chk(c,n): (ok if c else bad).append(n)
async def main():
    srv=subprocess.Popen([sys.executable,'-m','http.server','8784','-d',W],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
            pg=await b.new_page(viewport={'width':1280,'height':900}); errs=[]
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto('http://localhost:8784/sim.html'); await pg.wait_for_selector('.sl6-rx-m', timeout=60000)
            chk(await pg.locator('.sl6-rx-m').count()==3,'3 IP marcadas en Python')
            await pg.fill('.sl6-rx-rin','\\d{8}[A-Z]'); await pg.click('[data-rr="check"]'); await pg.wait_for_selector('.sl6-reto__msg.is-bad',timeout=20000)
            chk(await pg.locator('.sl6-rx-ul li.is-bad').count()==1,'reto Python: solo falla 12345678I')
            await pg.fill('.sl6-rx-rin','\\d{8}[A-HJ-NP-TV-Z]'); await pg.click('[data-rr="check"]'); await pg.wait_for_selector('.sl6-reto__msg.is-ok',timeout=20000); chk(True,'reto Python resuelto')
            await pg.click('[data-l="java"]'); await pg.wait_for_selector('.sl6.is-jvok', timeout=90000); await pg.wait_for_timeout(300)
            chk(await pg.locator('.sl6-rx-m').count()==3,'Java (OpenJDK) marca las 3 IP, también 192.168.1.20')
            chk('192.168.1.20' in await pg.inner_text('.sl6-rx-view'),'texto con la IP')
            await pg.click('[data-fn="split"]'); chk('Arrays.toString(patron.split' in await pg.inner_text('.sl6-rx-code'),'código de split en Java')
            chk('\\\\d{1,3}(?:\\\\.\\\\d{1,3}){3}' in await pg.inner_text('.sl6-rx-code'),'barras dobles en el código Java')
            await pg.fill('.sl6-rx-rin','\\d{8}[A-HJ-NP-TV-Z]'); await pg.click('[data-rr="check"]'); await pg.wait_for_selector('.sl6-reto__msg.is-ok',timeout=60000); chk(True,'reto Java resuelto')
            await pg.click('[data-rr="sol"]'); await pg.wait_for_timeout(5000); await pg.wait_for_selector('.sl6:not(.is-stale)',timeout=60000)
            chk(await pg.locator('.sl6-rx-m').count()==2,'la solución en el simulador marca las 2 líneas buenas')
            await pg.screenshot(path=OUT+'/java-reto.png', full_page=False)
            # compartir y recargar
            await pg.goto('http://localhost:8784/sim.html'); await pg.wait_for_selector('.sl6.is-jvok', timeout=90000)
            chk(await pg.get_attribute('[data-l="java"]','aria-pressed')=='true','al recargar sigue en Java (localStorage)')
            # móvil, claro, inglés
            m=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
            await m.goto('http://localhost:8784/sim-en.html'); await m.evaluate("localStorage.clear()"); await m.reload(); await m.wait_for_selector('.sl6-rx-m', timeout=60000)
            await m.click('[data-a="theme"]'); await m.select_option('.sl6-sel','fecha'); await m.wait_for_timeout(600); await m.click('[data-p="step"]'); await m.wait_for_timeout(300)
            sw=await m.evaluate("document.documentElement.scrollWidth"); chk(sw<=390,'móvil sin desbordar (%d)'%sw)
            chk('year' in await m.inner_text('.sl6-rx-grp'),'grupos con nombre en inglés')
            await m.screenshot(path=OUT+'/movil-en-claro.png', full_page=True)
            chk(not errs,'sin errores JS '+str(errs[:2]))
            await b.close()
    finally: srv.kill()
    print(f'{len(ok)}/{len(ok)+len(bad)} bien'); [print(' FALLA',x) for x in bad]
asyncio.run(main())
