"""Render the 16:9 cover of a video: python3 scripts/cover.py <vid>  ->  out/<filename>_封面.jpg"""
import asyncio
import json
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent


async def main(vid):
    cfg = json.loads((ROOT / "src" / vid / "script.json").read_text("utf-8"))
    out = ROOT / "out" / f"{cfg.get('filename', vid)}_封面.jpg"
    out.parent.mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/usr/local/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        await page.goto((ROOT / "src" / vid / "cover.html").as_uri(), wait_until="load")
        await page.evaluate("Promise.all(['40px \"ZCOOL KuaiLe\"','900 40px \"Noto Sans CJK SC\"'].map(f => document.fonts.load(f, '越哄越哭')))")
        await page.evaluate("document.fonts.ready")
        await page.screenshot(path=str(out), type="jpeg", quality=92)
        await browser.close()
    print("wrote", out)


asyncio.run(main(sys.argv[1]))
