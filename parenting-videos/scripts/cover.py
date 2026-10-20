"""Render covers: python3 scripts/cover.py <vid>

Writes out/<filename>_封面.jpg (16:9, 1920x1080) and
out/<filename>_封面_3x4.jpg (3:4, rendered at 2160x2880).
"""
import asyncio
import json
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
COVERS = [
    ("cover.html", 1920, 1080, 1, "封面"),
    ("cover34.html", 1080, 1440, 2, "封面_3x4"),
]


async def main(vid):
    cfg = json.loads((ROOT / "src" / vid / "script.json").read_text("utf-8"))
    out_dir = ROOT / "out"
    out_dir.mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/usr/local/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        for page_name, w, h, scale, suffix in COVERS:
            page_path = ROOT / "src" / vid / page_name
            if not page_path.exists():
                continue
            page = await browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=scale)
            await page.goto(page_path.as_uri(), wait_until="load")
            await page.evaluate("Promise.all(['40px \"ZCOOL KuaiLe\"','900 40px \"Noto Sans CJK SC\"'].map(f => document.fonts.load(f, '越哄越哭')))")
            await page.evaluate("document.fonts.ready")
            out = out_dir / f"{cfg.get('filename', vid)}_{suffix}.jpg"
            await page.screenshot(path=str(out), type="jpeg", quality=92)
            await page.close()
            print("wrote", out)
        await browser.close()


asyncio.run(main(sys.argv[1]))
