"""Tile preview stills into one contact sheet.

  python3 scripts/sheet.py <vid> [out.png] [cols]
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
vid = sys.argv[1]
out = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "build" / vid / "sheet.png"
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
files = sorted((ROOT / "build" / vid / "preview").glob("t*.png"))
tw, th = 640, 360
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw, rows * (th + 34)), "white")
draw = ImageDraw.Draw(sheet)
font = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", 24)
for i, f in enumerate(files):
    x, y = (i % cols) * tw, (i // cols) * (th + 34)
    sheet.paste(Image.open(f).convert("RGB").resize((tw, th), Image.LANCZOS), (x, y + 34))
    draw.text((x + 8, y + 2), f.stem[1:] + "s", fill="black", font=font)
sheet.save(out)
print(out)
