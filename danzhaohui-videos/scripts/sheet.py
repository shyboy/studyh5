"""Contact sheet of preview stills: python3 scripts/sheet.py <vid> [cols] [width]"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
vid = sys.argv[1]
cols = int(sys.argv[2]) if len(sys.argv) > 2 else 4
w = int(sys.argv[3]) if len(sys.argv) > 3 else 300
files = sorted((ROOT / "build" / vid / "preview").glob("t*.png"))
h = int(w * 1920 / 1080)
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 6), rows * (h + 30)), "white")
d = ImageDraw.Draw(sheet)
font = ImageFont.truetype("/usr/share/fonts/truetype/wqy/wqy-microhei.ttc", 20)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((w, h))
    x, y = (i % cols) * (w + 6), (i // cols) * (h + 30)
    sheet.paste(im, (x, y + 26))
    d.text((x + 4, y + 2), f.stem, fill="black", font=font)
out = ROOT / "build" / vid / "sheet.png"
sheet.save(out)
print(out)
