import asyncio, sys, subprocess, time
from playwright.async_api import async_playwright
W=sys.argv[1]; OUT=sys.argv[2]
async def main():
    srv=subprocess.Popen([sys.executable,'-m','http.server','8783','-d',W],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
            pg=await b.new_page(viewport={'width':1280,'height':900}); errs=[]
            pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None); pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto('http://localhost:8783/sim.html'); await pg.wait_for_selector('.sl6-rx-m', timeout=60000)
            await pg.screenshot(path=OUT+'/py-es.png', full_page=True)
            await pg.click('[data-p="step"]'); await pg.click('[data-p="step"]'); await pg.wait_for_timeout(300)
            await pg.locator('.sl6-rx-top').screenshot(path=OUT+'/py-step.png')
            await pg.select_option('.sl6-sel','fecha'); await pg.wait_for_timeout(800)
            await pg.click('[data-l="java"]'); await pg.wait_for_selector('.sl6.is-jvok', timeout=90000); await pg.wait_for_timeout(500)
            await pg.screenshot(path=OUT+'/java-es.png', full_page=True)
            print('st:', await pg.inner_text('.sl6-rx-st')); print('conv:', await pg.inner_text('.sl6-rx-conv'))
            await pg.fill('.sl6-rx-in', '(?<dia>\\d{1,2})/(?<mes>\\d{1,2}'); await pg.wait_for_timeout(4500)
            await pg.locator('.sl6-rx-top').screenshot(path=OUT+'/java-err.png')
            print('err:', (await pg.inner_text('.sl6-rx-err'))[:300])
            print('errores consola:', errs[:5]); await b.close()
    finally: srv.kill()
asyncio.run(main())
