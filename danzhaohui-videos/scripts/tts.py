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
                words.append(
                    {
                        "t": chunk["offset"] / 1e7,
                        "d": chunk["duration"] / 1e7,
                        "w": chunk["text"],
                    }
                )
    return words


def subtitle_chunks(text, words, seg_dur, max_len=14):
    """Split text into display chunks and time them using word boundaries."""
    parts = [p for p in re.split(r"(?<=[，。！？；：…,!?;])|\n", text) if p and p.strip()]
    chunks = []
    for p in parts:
        p = p.strip()
        while len(p) > max_len + 4:
            cut = max_len
            chunks.append(p[:cut])
            p = p[cut:]
        if p:
            chunks.append(p)

    def clean(s):
        return "".join(ch for ch in s if ch not in PUNCT)

    # character offset (in cleaned text) -> time
    char_times = []
    for w in words:
        cw = clean(w["w"])
        n = max(len(cw), 1)
        for i in range(len(cw)):
            char_times.append(w["t"] + w["d"] * i / n)
    total_clean = len(clean(text))
    result = []
    pos = 0
    for c in chunks:
        if pos < len(char_times):
            t0 = char_times[pos]
        else:
            t0 = seg_dur * pos / max(total_clean, 1)
        result.append({"text": c.strip("，。；：,;"), "t": round(t0, 3)})
        pos += len(clean(c))
    if result:
        result[0]["t"] = 0.0
    return result


async def main(vid):
    src = ROOT / "src" / vid / "script.json"
    cfg = json.loads(src.read_text("utf-8"))
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
            t += dur + seg.get("gap", 0)
            continue
        spoken = seg.get("say", seg["text"])
        key = hashlib.md5(f"{voice}|{rate}|{pitch}|{spoken}".encode()).hexdigest()[:10]
        mp3 = out_dir / f"{seg['id']}_{key}.mp3"
        meta = mp3.with_suffix(".json")
        if not mp3.exists() or not meta.exists():
            for attempt in range(4):
                try:
                    words = await synth(spoken, voice, rate, pitch, mp3)
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
                "voice": voice,
                "text": seg["text"],
                "subs": subtitle_chunks(seg.get("sub", seg["text"]), words, dur, cfg.get("sub_max", 14)),
            }
        )
        t += dur + seg.get("gap", cfg.get("gap", 0.25))
    total = t + cfg.get("tail", 2.0)
    timeline = {"id": vid, "duration": round(total, 3), "fps": cfg.get("fps", 30), "segments": segs}
    (ROOT / "build" / vid / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1), "utf-8")
    print(f"{vid}: {total:.1f}s, {len(segs)} segments")


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1]))
