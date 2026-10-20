"""Generate voice-over for one video and build its timeline.

Usage: python3 scripts/tts.py <video_id>

Reads  src/<video_id>/script.json
Writes build/<video_id>/voice/*.mp3 and build/<video_id>/timeline.json
"""
import asyncio
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
PUNCT = "，。！？；：、…,.!?;:　 “”\"‘’'（）()《》—-~～·"


def clean(s):
    return "".join(ch for ch in s if ch not in PUNCT)


def duration(path):
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]
    )
    return float(out.strip())


async def synth(text, voice, rate, pitch, mp3_path):
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    words = []
    with open(mp3_path, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({"t": chunk["offset"] / 1e7, "d": chunk["duration"] / 1e7, "w": chunk["text"]})
    return words


def char_times(words):
    """Start time of every non-punctuation character of the spoken text."""
    out = []
    for w in words:
        cw = clean(w["w"])
        for i in range(len(cw)):
            out.append(w["t"] + w["d"] * i / max(len(cw), 1))
    return out


def word_cuts(words):
    """Cleaned-text offsets where a word starts (safe places to break a subtitle)."""
    cuts, pos = set(), 0
    for w in words:
        cuts.add(pos)
        pos += len(clean(w["w"]))
    return cuts


def split_long(phrase, base, cuts, max_len):
    """Split a phrase longer than max_len at the word boundary closest to its middle."""
    n = len(clean(phrase))
    if n <= max_len:
        return [phrase]
    # map cleaned offsets -> raw index
    raw_idx, k = [], 0
    for i, ch in enumerate(phrase):
        if ch not in PUNCT:
            raw_idx.append(i)
    best = None
    for c in range(3, n - 2):
        if (base + c) in cuts and (best is None or abs(c - n / 2) < abs(best - n / 2)):
            best = c
    if best is None:
        best = n // 2
    r = raw_idx[best]
    return split_long(phrase[:r], base, cuts, max_len) + split_long(phrase[r:], base + best, cuts, max_len)


def subtitle_chunks(text, words, seg_dur, max_len):
    parts = [p.strip() for p in re.split(r"(?<=[，。！？；：…,!?;])", text) if p.strip() and clean(p)]
    merged = []
    for p in parts:
        prev = merged[-1] if merged else ""
        join = (len(clean(p)) <= 4 and prev.endswith(("，", "、"))) or (
            prev and len(clean(prev)) <= 4 and not prev.endswith(("。", "…", "："))
        )
        if join and len(clean(prev + p)) <= max_len:
            merged[-1] += p
        else:
            merged.append(p)
    cuts = word_cuts(words)
    chunks, pos = [], 0
    for p in merged:
        for piece in split_long(p, pos, cuts, max_len):
            chunks.append((piece, pos))
            pos += len(clean(piece))
    ct = char_times(words)
    total = len(clean(text))
    result = []
    for piece, p0 in chunks:
        t0 = ct[p0] if p0 < len(ct) else seg_dur * p0 / max(total, 1)
        disp = piece.strip().rstrip("，。；：,;、")
        disp = re.sub(r"[，、；：]", " ", disp).replace("。", " ").strip()
        result.append({"text": disp, "t": round(t0, 3)})
    if result:
        result[0]["t"] = 0.0
    return result


async def main(vid):
    cfg = json.loads((ROOT / "src" / vid / "script.json").read_text("utf-8"))
    out_dir = ROOT / "build" / vid / "voice"
    out_dir.mkdir(parents=True, exist_ok=True)

    t = cfg.get("lead", 0.5)
    segs = []
    for seg in cfg["segments"]:
        voice = seg.get("voice", cfg["voice"])
        rate = seg.get("rate", cfg.get("rate", "+0%"))
        pitch = seg.get("pitch", cfg.get("pitch", "+0Hz"))
        t += seg.get("pre", 0)
        if not seg.get("text"):
            dur = seg.get("hold", 1.0)
            segs.append({"id": seg["id"], "start": round(t, 3), "end": round(t + dur, 3), "silent": True})
            t += dur + seg.get("gap", cfg.get("gap", 0.25))
            continue
        spoken = seg.get("say", seg["text"])
        key = hashlib.md5(f"{voice}|{rate}|{pitch}|{spoken}".encode()).hexdigest()[:10]
        mp3 = out_dir / f"{seg['id']}_{key}.mp3"
        meta = mp3.with_suffix(".json")
        if not mp3.exists() or not meta.exists():
            for attempt in range(5):
                try:
                    words = await synth(spoken, voice, rate, pitch, mp3)
                    if words:
                        break
                except Exception as e:  # network hiccups
                    print("retry", seg["id"], e, file=sys.stderr)
                await asyncio.sleep(2 * (attempt + 1))
            meta.write_text(json.dumps(words, ensure_ascii=False))
        words = json.loads(meta.read_text())
        dur = duration(mp3)
        if words:
            dur = min(dur, words[-1]["t"] + words[-1]["d"] + 0.25)
        segs.append(
            {
                "id": seg["id"],
                "start": round(t, 3),
                "end": round(t + dur, 3),
                "file": str(mp3.relative_to(ROOT)),
                "text": seg["text"],
                "clean": clean(spoken),
                "ct": [round(x, 3) for x in char_times(words)],
                "subs": subtitle_chunks(seg.get("sub", seg["text"]), words, dur, cfg.get("sub_max", 16)),
            }
        )
        t += dur + seg.get("gap", cfg.get("gap", 0.25))
    total = t + cfg.get("tail", 2.0)
    timeline = {"id": vid, "duration": round(total, 3), "fps": cfg.get("fps", 30), "segments": segs}
    (ROOT / "build" / vid / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1), "utf-8")
    print(f"{vid}: {total:.1f}s, {len(segs)} segments")


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1]))
