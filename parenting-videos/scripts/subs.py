"""Export subtitles from the timeline.

  python3 scripts/subs.py <vid>

Writes build/<vid>/subs.srt (plain, for players / platforms) and
build/<vid>/subs.ass (styled, keywords highlighted, burned into the voiced cut).
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def cues(tl):
    segs = [s for s in tl["segments"] if s.get("subs")]
    out = []
    for i, s in enumerate(segs):
        nxt = segs[i + 1]["start"] if i + 1 < len(segs) else tl["duration"]
        seg_end = min(s["end"] + 0.15, nxt - 0.05)
        for j, c in enumerate(s["subs"]):
            a = s["start"] + c["t"]
            b = s["start"] + s["subs"][j + 1]["t"] - 0.03 if j + 1 < len(s["subs"]) else seg_end
            if a < 0.2:
                a = 0.0
            if b - a < 0.3:
                b = a + 0.3
            out.append((a, b, c["text"]))
    return out


def srt_time(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def ass_time(t):
    cs = int(round(t * 100))
    return f"{cs // 360000}:{cs // 6000 % 60:02d}:{cs // 100 % 60:02d}.{cs % 100:02d}"


def highlight(text, words, on=r"{\c&H57C8FF&}", off=r"{\c&HFFFFFF&}"):
    marks = [False] * len(text)
    for w in sorted(words, key=len, reverse=True):
        i = text.find(w)
        while i >= 0:
            if not any(marks[i:i + len(w)]):
                for k in range(i, i + len(w)):
                    marks[k] = True
            i = text.find(w, i + len(w))
    out, cur = [], False
    for ch, m in zip(text, marks):
        if m != cur:
            out.append(on if m else off)
            cur = m
        out.append(ch)
    if cur:
        out.append(off)
    return "".join(out)


ASS_HEAD = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Noto Sans CJK SC,68,&H00FFFFFF,&H00FFFFFF,&H00463542,&H66000000,-1,0,0,0,100,100,2,0,1,5.5,2,2,80,80,40,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def main(vid):
    bdir = ROOT / "build" / vid
    tl = json.loads((bdir / "timeline.json").read_text("utf-8"))
    cfg = json.loads((ROOT / "src" / vid / "script.json").read_text("utf-8"))
    cs = cues(tl)
    srt = "".join(f"{i}\n{srt_time(a)} --> {srt_time(b)}\n{t}\n\n" for i, (a, b, t) in enumerate(cs, 1))
    (bdir / "subs.srt").write_text(srt, "utf-8")
    hl = cfg.get("highlight", [])
    ass = ASS_HEAD + "".join(
        f"Dialogue: 0,{ass_time(a)},{ass_time(b)},Sub,,0,0,0,,{highlight(t, hl)}\n" for a, b, t in cs
    )
    (bdir / "subs.ass").write_text(ass, "utf-8")
    lines = [f"{cfg.get('title', vid)}  口播稿（时间码与无配音版画面对齐）", ""]
    for s in tl["segments"]:
        if s.get("text"):
            a, b = s["start"], s["end"]
            lines.append(f"[{int(a // 60)}:{a % 60:04.1f} - {int(b // 60)}:{b % 60:04.1f}]  {s['text']}")
    out = ROOT / "out"
    out.mkdir(exist_ok=True)
    (out / f"{cfg.get('filename', vid)}_口播稿.txt").write_text("\n".join(lines) + "\n", "utf-8")
    print(f"{vid}: {len(cs)} cues -> subs.srt / subs.ass / 口播稿.txt")


if __name__ == "__main__":
    main(sys.argv[1])
