"""Synthesized SFX + original background music (no copyrighted audio), mixing and muxing.

  python3 scripts/audio.py <vid>            # both cuts
  python3 scripts/audio.py <vid> voice      # voiced cut with burned-in subtitles
  python3 scripts/audio.py <vid> novoice    # music-only cut + matching .srt

Needs build/<vid>/silent.mp4, sfx.json, timeline.json, subs.ass, subs.srt.
"""
import shutil
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 44100


def t_axis(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.005, r=None, d=None):
    """Attack + exponential decay envelope of length n samples."""
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    if d:
        e = e * np.exp(-t / d)
    if r:
        tail = int(r * SR)
        if tail < n:
            e[-tail:] *= np.linspace(1, 0, tail)
    return e


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def lp_fast(x, cutoff):
    """FFT brick-ish lowpass with soft rolloff (fast for long signals)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def hp_fast(x, cutoff):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (cutoff / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x))


def noise(d, seed=0):
    return np.random.default_rng(seed).uniform(-1, 1, int(SR * d))


def sine(f, d, phase=0):
    t = t_axis(d)
    if callable(f):
        ph = 2 * np.pi * np.cumsum(f(t)) / SR
        return np.sin(ph + phase)
    return np.sin(2 * np.pi * f * t + phase)


def square(f, d, duty=0.5):
    t = t_axis(d)
    return np.where((t * f) % 1 < duty, 1.0, -1.0)


def tri(f, d):
    t = t_axis(d)
    return 2 * np.abs(2 * ((t * f) % 1) - 1) - 1


def saw(f, d):
    t = t_axis(d)
    return 2 * ((t * f) % 1) - 1


def ks_pluck(f, d, bright=0.5, seed=1):
    """Karplus-Strong plucked string."""
    n = int(SR * d)
    p = max(2, int(SR / f))
    buf = np.random.default_rng(seed).uniform(-1, 1, p)
    buf = lowpass(buf, 2000 + 6000 * bright)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return out


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- SFX
def make_sfx():
    S = {}
    d = 0.09
    S["pop"] = sine(lambda t: 500 + 1400 * t / d, d) * env(int(SR * d), 0.002, d=0.03) * 0.8
    a = sine(1318.5, 0.6) * 0.6 + sine(2637, 0.6) * 0.15
    b = sine(1046.5, 0.8) * 0.6 + sine(2093, 0.8) * 0.15
    ding = np.zeros(int(SR * 1.0))
    ding[: len(a)] += a * env(len(a), 0.003, d=0.18)
    off = int(SR * 0.12)
    ding[off: off + len(b)] += b * env(len(b), 0.003, d=0.3)
    S["ding"] = ding * 0.55
    n = noise(0.45, 3)
    sweep = hp_fast(lp_fast(n, 3000), 300)
    S["whoosh"] = sweep * np.sin(np.linspace(0, np.pi, len(n))) ** 2 * 0.9
    S["tick"] = (sine(2200, 0.03) * env(int(SR * 0.03), 0.0005, d=0.006) + noise(0.03, 5) * env(int(SR * 0.03), 0.0005, d=0.003) * 0.4) * 0.8
    S["tock"] = (sine(1400, 0.04) * env(int(SR * 0.04), 0.0005, d=0.01)) * 0.8
    c = np.concatenate([sine(midi(m), 0.11) * env(int(SR * 0.11), 0.002, d=0.08) for m in (84, 88, 91)])
    c = np.concatenate([c, sine(midi(96), 0.5) * env(int(SR * 0.5), 0.002, d=0.18)])
    S["correct"] = c * 0.6
    w = (square(150, 0.5) * 0.5 + square(155, 0.5) * 0.5) * env(int(SR * 0.5), 0.005, r=0.1)
    S["wrong"] = lp_fast(w, 1800) * 0.45
    th = sine(lambda t: 40 + 110 * np.exp(-t * 18), 0.6) * env(int(SR * 0.6), 0.001, d=0.16)
    nz = lp_fast(noise(0.6, 9), 1500) * env(int(SR * 0.6), 0.001, d=0.05)
    S["stamp"] = (th * 1.0 + nz * 0.9) * 0.95
    S["impact"] = (sine(lambda t: 35 + 90 * np.exp(-t * 10), 1.4) * env(int(SR * 1.4), 0.001, d=0.4) + lp_fast(noise(1.4, 4), 900) * env(int(SR * 1.4), 0.001, d=0.25) * 0.8) * 0.9
    keys = np.zeros(int(SR * 1.0))
    rng = np.random.default_rng(2)
    for k in range(13):
        o = int(SR * (k * 0.065 + rng.uniform(0, 0.012)))
        cl = (noise(0.025, k) * env(int(SR * 0.025), 0.0005, d=0.004)) * rng.uniform(0.5, 1)
        cl = hp_fast(np.pad(cl, (0, 2000)), 1500)[: len(cl)]
        keys[o: o + len(cl)] += cl
    S["type"] = keys * 0.9
    S["tap"] = (sine(900, 0.05) * env(int(SR * 0.05), 0.0005, d=0.01) * 0.6 + noise(0.05, 1) * env(int(SR * 0.05), 0.0005, d=0.004) * 0.3)
    coin = np.concatenate([square(midi(83), 0.07), square(midi(88), 0.35) * env(int(SR * 0.35), 0.001, d=0.12)])
    S["coin"] = coin * 0.22
    lv = np.concatenate([square(midi(m), 0.08) * 0.8 for m in (72, 76, 79, 84, 88, 91)] + [square(midi(96), 0.4) * env(int(SR * 0.4), 0.001, d=0.15)])
    S["levelup"] = lv * 0.2
    S["hit"] = (lp_fast(noise(0.25, 7), 2500) * env(int(SR * 0.25), 0.001, d=0.05) + square(80, 0.25) * env(int(SR * 0.25), 0.001, d=0.06) * 0.5) * 0.6
    r = noise(1.2, 8)
    rr = hp_fast(r, 800) * np.linspace(0, 1, len(r)) ** 2
    S["riser"] = (rr * 0.6 + sine(lambda t: 200 + 900 * (t / 1.2) ** 2, 1.2) * np.linspace(0, 1, len(r)) ** 2 * 0.25)
    al = np.concatenate([sine(880, 0.16), np.zeros(int(SR * 0.04)), sine(660, 0.16), np.zeros(int(SR * 0.04))] * 2)
    S["alarm"] = al * 0.35
    S["swish"] = S["whoosh"][::2].copy() * 0.8
    bl = sine(lambda t: 300 + 500 * t, 0.12) * env(int(SR * 0.12), 0.002, d=0.04)
    S["blip"] = bl * 0.5
    S["count"] = (sine(1760, 0.12) * env(int(SR * 0.12), 0.001, d=0.05)) * 0.5
    S["go"] = (sine(1760, 0.5) + 0.5 * sine(2640, 0.5)) * env(int(SR * 0.5), 0.001, d=0.18) * 0.45
    sc = noise(1.0, 21)
    am = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 7 * t_axis(1.0) + 2 * np.sin(2 * np.pi * 1.3 * t_axis(1.0))))
    S["scribble"] = hp_fast(lp_fast(sc, 5000), 1800) * am * env(len(sc), 0.03, r=0.25) * 0.35
    pg = noise(0.5, 22)
    S["page"] = hp_fast(lp_fast(pg, 6000), 500) * np.sin(np.linspace(0, np.pi, len(pg))) ** 3 * 0.8
    cam = noise(0.18, 12)
    S["shutter"] = hp_fast(cam, 2000) * env(len(cam), 0.0005, d=0.02) * 0.8
    return S


def make_sfx_all():
    S = make_sfx()
    d = 0.32
    S["boing"] = sine(lambda t: 220 + 320 * np.exp(-t * 9) * (1 + 0.25 * np.sin(2 * np.pi * 18 * t)), d) * env(int(SR * d), 0.003, d=0.12) * 0.7
    return S


# ---------------------------------------------------------------- MUSIC
def kick(d=0.35):
    return sine(lambda t: 45 + 110 * np.exp(-t * 30), d) * env(int(SR * d), 0.001, d=0.08)


def place(buf, sig, t, gain=1.0):
    o = int(t * SR)
    if o >= len(buf):
        return
    e = min(len(buf), o + len(sig))
    buf[o:e] += sig[: e - o] * gain


def chord_notes(root, kind):
    return [root + i for i in {"maj7": (0, 4, 7, 11), "m7": (0, 3, 7, 10), "add9": (0, 4, 7, 14), "sus": (0, 5, 7)}[kind]]


def epiano(f, d):
    t = t_axis(d)
    s = sine(f, d) + 0.35 * sine(2 * f, d) * np.exp(-t * 2.5) + 0.12 * sine(3 * f, d) * np.exp(-t * 5)
    return s * env(len(t), 0.01, d=1.8) * (1 + 0.12 * np.sin(2 * np.pi * 4.2 * t))


def music_warm(dur):
    """Gentle original bed: e-piano chords, music-box arpeggio, soft bass and shaker."""
    buf = np.zeros(int(SR * (dur + 3)))
    bpm = 78
    beat = 60 / bpm
    bar_len = beat * 4
    prog = [(65, "maj7"), (69, "m7"), (62, "m7"), (70, "add9"), (65, "maj7"), (69, "m7"), (70, "maj7"), (72, "sus")]
    box_cache, ep_cache = {}, {}
    rng = np.random.default_rng(11)
    patterns = [
        [0, None, 2, 1, 3, None, 2, None],
        [0, 2, None, 3, None, 2, 1, None],
        [None, 1, 2, None, 3, 2, None, 1],
        [0, None, 1, 2, None, 3, None, None],
    ]
    t, bar = 0.0, 0
    while t < dur:
        root, kind = prog[bar % len(prog)]
        notes = chord_notes(root, kind)
        for n in notes:
            m = n - 12
            if m not in ep_cache:
                ep_cache[m] = epiano(midi(m), bar_len + 0.6)
            place(buf, ep_cache[m], t, 0.055)
        place(buf, sine(midi(root - 24), bar_len) * env(int(SR * bar_len), 0.02, d=1.6), t, 0.22)
        place(buf, sine(midi(root - 24 + 7), beat * 1.6) * env(int(SR * beat * 1.6), 0.02, d=0.6), t + beat * 2.5, 0.12)
        pat = patterns[(bar // 2) % len(patterns)]
        for i, step in enumerate(pat):
            if step is None:
                continue
            m = notes[step % len(notes)] + 12
            if m not in box_cache:
                box_cache[m] = ks_pluck(midi(m), 1.2, 0.85, seed=m) * env(int(SR * 1.2), 0.001, d=0.45)
            place(buf, box_cache[m], t + i * beat / 2 + rng.uniform(0, 0.008), 0.15)
        if bar >= 2:
            for b in range(4):
                if b in (0, 2):
                    place(buf, kick(0.3), t + b * beat, 0.16)
                for h in range(2):
                    sh = hp_fast(noise(0.07, b * 2 + h + bar), 6000) * env(int(SR * 0.07), 0.01, d=0.02)
                    place(buf, sh, t + b * beat + h * beat / 2, 0.05 if h else 0.03)
        t += bar_len
        bar += 1
    buf = buf[: int(SR * dur)]
    fade = int(SR * 2.5)
    buf[-fade:] *= np.linspace(1, 0, fade)
    buf[: int(SR * 0.15)] *= np.linspace(0, 1, int(SR * 0.15))
    return buf / (np.max(np.abs(buf)) + 1e-9)


def load_audio(path):
    raw = subprocess.check_output(["ffmpeg", "-nostdin", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def write_wav(path, mix):
    import wave
    peak = np.max(np.abs(mix))
    mix = np.tanh(mix / max(peak, 1e-6) * 1.3) / np.tanh(1.3) * 0.89
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype(np.int16).tobytes())


def mux(video, wav, out, vf=None):
    cmd = ["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", str(video), "-i", str(wav)]
    if vf:
        cmd += ["-vf", vf]
    cmd += ["-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p", "-tune", "animation",
            "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "44100", "-c:a", "aac", "-b:a", "192k", "-ac", "2",
            "-shortest", "-movflags", "+faststart", str(out)]
    subprocess.check_call(cmd)
    print("wrote", out)


def main(vid, only=None):
    sfx_lib = make_sfx_all()
    bdir = ROOT / "build" / vid
    tl = json.loads((bdir / "timeline.json").read_text("utf-8"))
    cfg = json.loads((ROOT / "src" / vid / "script.json").read_text("utf-8"))
    dur = tl["duration"]
    n = int(SR * dur)
    voice = np.zeros(n + SR)
    active = np.zeros(n + SR)
    for s in tl["segments"]:
        if s.get("silent"):
            continue
        a = load_audio(ROOT / s["file"])
        rms = np.sqrt(np.mean(a[np.abs(a) > 0.01] ** 2) + 1e-12)
        place(voice, a * (0.16 / rms), s["start"])
        o, e = int(s["start"] * SR), int((s["start"] + len(a) / SR) * SR)
        active[o:e] = 1
    sfx = np.zeros(n + SR)
    for ev in json.loads((bdir / "sfx.json").read_text()):
        if ev["name"] in sfx_lib:
            place(sfx, sfx_lib[ev["name"]], ev["t"], ev["gain"] * cfg.get("sfx_gain", 0.5))
        else:
            print("missing sfx", ev["name"], file=sys.stderr)
    bgm = np.zeros(n + SR)
    m = music_warm(dur)
    bgm[: len(m)] = m
    k = int(0.3 * SR)
    duck = np.clip(np.convolve(active, np.ones(k) / k, mode="same") * 1.5, 0, 1)
    g_hi, g_lo = cfg.get("bgm_gain", 0.22), cfg.get("bgm_duck", 0.08)

    out = ROOT / "out"
    out.mkdir(exist_ok=True)
    name = cfg.get("filename", vid)
    if only in (None, "voice"):
        write_wav(bdir / "mix_voice.wav", (voice + sfx + bgm * (g_hi - (g_hi - g_lo) * duck))[:n])
        ass = str(bdir / "subs.ass").replace(":", r"\:")
        mux(bdir / "silent.mp4", bdir / "mix_voice.wav", out / f"{name}_配音版.mp4", vf=f"ass='{ass}'")
    if only in (None, "novoice"):
        write_wav(bdir / "mix_novoice.wav", (sfx * 0.8 + bgm * cfg.get("bgm_gain_novoice", 0.4))[:n])
        mux(bdir / "silent.mp4", bdir / "mix_novoice.wav", out / f"{name}_无配音版.mp4")
        shutil.copyfile(bdir / "subs.srt", out / f"{name}_无配音版.srt")
        print("wrote", out / f"{name}_无配音版.srt")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
