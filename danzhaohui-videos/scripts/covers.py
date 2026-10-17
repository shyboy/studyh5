"""Render covers: 3:4 (1080x1440, 小红书) and 9:16 (1080x1920, 抖音/视频号) for each video."""
import asyncio
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out" / "covers"
OUT.mkdir(parents=True, exist_ok=True)


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/local/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        for h, tag in ((1440, "3x4"), (1920, "9x16")):
            ctx = await b.new_context(viewport={"width": 1080, "height": h})
            page = await ctx.new_page()
            for i in range(1, 7):
                url = (ROOT / "src" / "covers" / "index.html").as_uri() + f"?id={i}&h={h}"
                await page.goto(url, wait_until="load")
                await page.evaluate("document.fonts.ready")
                await page.wait_for_timeout(500)
                await page.screenshot(path=str(OUT / f"cover_{i:02d}_{tag}.png"))
            await ctx.close()
        await b.close()


asyncio.run(main())
