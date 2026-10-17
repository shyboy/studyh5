"""Capture real mobile screenshots of the site for use inside the videos."""
import asyncio
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE = "https://danzhaohui.com/"
OUT = Path(__file__).resolve().parent.parent / "shots"
OUT.mkdir(exist_ok=True)

HIDE_ADS = """
ins.adsbygoogle, iframe, .adsbygoogle { display:none !important; }
.reveal { opacity:1 !important; transform:none !important; transition:none !important; }
html { scroll-behavior:auto !important; }
"""

PAGES = [
    ("home", ""),
    ("hunan", "hunan.html"),
    ("guide", "hunan/guide.html"),
    ("registration", "hunan/registration-2027.html"),
    ("popular", "hunan/popular-majors.html"),
    ("map", "hunan/schools-map.html"),
    ("category", "hunan/category-guide.html"),
    ("scores", "hunan/scores-guide.html"),
    ("vs", "hunan/vs-gaokao.html"),
    ("school", "schools/changsha-minzheng.html"),
]


async def prep(page):
    await page.add_style_tag(content=HIDE_ADS)
    await page.wait_for_timeout(600)


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/usr/local/bin/google-chrome", args=["--no-sandbox"])
        ctx = await browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
            locale="zh-CN",
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        )
        page = await ctx.new_page()
        for name, path in PAGES:
            await page.goto(BASE + path, wait_until="networkidle", timeout=60000)
            await prep(page)
            await page.screenshot(path=str(OUT / f"{name}_top.png"))
            await page.screenshot(path=str(OUT / f"{name}_full.png"), full_page=True)
            print("ok", name, file=sys.stderr)

        await page.goto(BASE + "hunan/majors.html", wait_until="networkidle", timeout=60000)
        await prep(page)
        await page.screenshot(path=str(OUT / "majors_top.png"))
        await page.fill("#mq", "护理")
        await page.wait_for_timeout(1200)
        await page.screenshot(path=str(OUT / "majors_search.png"))
        await page.screenshot(path=str(OUT / "majors_search_full.png"), full_page=True)

        await page.goto(BASE + "hunan.html", wait_until="networkidle", timeout=60000)
        await prep(page)
        el = await page.query_selector("#schools")
        if el:
            await el.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await page.screenshot(path=str(OUT / "hunan_schools.png"))
        await page.fill("#q", "软件技术")
        await page.wait_for_timeout(1200)
        await page.screenshot(path=str(OUT / "hunan_search.png"))

        desk = await browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=2, locale="zh-CN")
        dp = await desk.new_page()
        await dp.goto(BASE, wait_until="networkidle", timeout=60000)
        await prep(dp)
        await dp.screenshot(path=str(OUT / "desktop_home.png"))
        await browser.close()


asyncio.run(main())
