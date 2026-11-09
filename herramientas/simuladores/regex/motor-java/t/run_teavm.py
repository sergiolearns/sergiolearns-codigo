import asyncio, sys, json, subprocess, time
from playwright.async_api import async_playwright
src=open(sys.argv[1]).read()
async def main():
    srv=subprocess.Popen([sys.executable,'-m','http.server','8777','-d','www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
            pg=await b.new_page(); await pg.goto('http://localhost:8777/index.html')
            r=pg.set_default_timeout(0); r=None
            r=await pg.evaluate('(s)=>runJava(s)',src)
            print(json.dumps({k:r.get(k) for k in ['ok','exitCode','compileMs','generateMs','runMs']}))
            print(r.get('stdout')); print('ERR:',r.get('stderr') or r.get('error'))
            await b.close()
    finally: srv.kill()
asyncio.run(main())
