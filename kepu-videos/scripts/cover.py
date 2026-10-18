"""Render covers for one video: python3 scripts/cover.py <vid>  ->  out/covers/<vid>_16x9.png, <vid>_4x3.png"""
import asyncio
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent


async def main(vid):
    out = ROOT / "out" / "covers"
    out.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/local/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        for w, tag in ((1920, "16x9"), (1440, "4x3")):
            ctx = await b.new_context(viewport={"width": w, "height": 1080})
            page = await ctx.new_page()
            await page.goto((ROOT / "src" / vid / "cover.html").as_uri() + f"?w={w}", wait_until="load")
            await page.evaluate("document.fonts.ready")
            await page.wait_for_timeout(600)
            await page.screenshot(path=str(out / f"{vid}_{tag}.png"))
            await ctx.close()
        await b.close()
    print("covers ->", out)


asyncio.run(main(sys.argv[1]))
