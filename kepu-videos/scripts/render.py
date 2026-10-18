"""Render a video page frame-by-frame with headless Chrome.

  python3 scripts/render.py <vid> --preview 1.0,5.5,12   # PNG stills for review
  python3 scripts/render.py <vid> --jobs 3               # full silent mp4 + sfx.json (parallel parts, concatenated)
  python3 scripts/render.py <vid> --part 0/3             # render one part only
"""
import argparse
import asyncio
import json
import subprocess
import sys
import time
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
FONTS = [
    '900 40px "Noto Sans CJK SC"', '700 40px "Noto Sans CJK SC"', '500 40px "Noto Sans CJK SC"', '400 40px "Noto Sans CJK SC"',
    '900 40px "Noto Serif CJK SC"', '40px "ZCOOL KuaiLe"', '40px "Bebas Neue"', '40px "Noto Color Emoji"',
    '40px "LXGW WenKai"', '500 40px "LXGW WenKai"',
]


async def open_page(p, vid, tl):
    w, h = tl.get("size", [1920, 1080])
    browser = await p.chromium.launch(
        executable_path="/usr/local/bin/google-chrome",
        args=["--no-sandbox", "--allow-file-access-from-files", "--font-render-hinting=none", "--disable-gpu-vsync"],
    )
    ctx = await browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=1)
    page = await ctx.new_page()
    page.on("console", lambda m: print("console:", m.text, file=sys.stderr))
    page.on("pageerror", lambda e: print("PAGE ERROR:", e, file=sys.stderr))
    await page.add_init_script(f"window.__TL = {json.dumps(tl, ensure_ascii=False)};")
    await page.goto((ROOT / "src" / vid / "index.html").as_uri(), wait_until="load")
    await page.evaluate(f"Promise.all({json.dumps(FONTS)}.map(f => document.fonts.load(f, '规则孩子0A👟')))")
    await page.evaluate("document.fonts.ready")
    await page.evaluate("Promise.all(Array.from(document.images).map(i => i.decode().catch(()=>0)))")
    await page.evaluate("seek(0)")
    await page.wait_for_timeout(300)
    return browser, page


async def render_part(vid, tl, k, n, target):
    fps = tl.get("fps", 30)
    n_frames = int(round(tl["duration"] * fps))
    lo, hi = n_frames * k // n, n_frames * (k + 1) // n
    async with async_playwright() as p:
        browser, page = await open_page(p, vid, tl)
        ff = subprocess.Popen(
            ["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "mjpeg", "-i", "-",
             "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-tune", "animation", "-pix_fmt", "yuv420p", "-r", str(fps), str(target)],
            stdin=subprocess.PIPE,
        )
        t0 = time.time()
        for i in range(lo, hi):
            await page.evaluate(f"seek({i / fps})")
            buf = await page.screenshot(type="jpeg", quality=92)
            ff.stdin.write(buf)
            if (i - lo) % 300 == 0:
                print(f"{vid} part {k}: frame {i - lo}/{hi - lo} {time.time() - t0:.0f}s", file=sys.stderr)
        ff.stdin.close()
        ff.wait()
        await browser.close()
    print(f"{vid} part {k}: rendered {hi - lo} frames in {time.time() - t0:.0f}s -> {target}", file=sys.stderr)


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("vid")
    ap.add_argument("--preview")
    ap.add_argument("--part")
    ap.add_argument("--jobs", type=int, default=1)
    args = ap.parse_args()
    out_dir = ROOT / "build" / args.vid
    tl = json.loads((out_dir / "timeline.json").read_text("utf-8"))

    if args.part:
        k, n = map(int, args.part.split("/"))
        await render_part(args.vid, tl, k, n, out_dir / f"silent_{k}.mp4")
        return

    async with async_playwright() as p:
        browser, page = await open_page(p, args.vid, tl)
        sfx = await page.evaluate("window.__sfx")
        (out_dir / "sfx.json").write_text(json.dumps(sfx, ensure_ascii=False))
        if args.preview:
            prev = out_dir / "preview"
            prev.mkdir(exist_ok=True)
            for old in prev.glob("t*.png"):
                old.unlink()
            for ts in args.preview.split(","):
                await page.evaluate(f"seek({float(ts)})")
                await page.screenshot(path=str(prev / f"t{float(ts):07.2f}.png"))
            print("preview done", file=sys.stderr)
        await browser.close()
    if args.preview:
        return

    n = args.jobs
    procs = [subprocess.Popen([sys.executable, __file__, args.vid, "--part", f"{k}/{n}"]) for k in range(n)]
    if any(pr.wait() for pr in procs):
        sys.exit("a render part failed")
    lst = out_dir / "parts.txt"
    lst.write_text("".join(f"file 'silent_{k}.mp4'\n" for k in range(n)))
    subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(out_dir / "silent.mp4")])
    print(f"{args.vid}: -> {out_dir / 'silent.mp4'}", file=sys.stderr)


asyncio.run(main())
