"""Synthesized SFX + background music (no copyrighted audio), voice mixing and muxing.

  python3 scripts/audio.py <vid>      # mix build/<vid>/mix.wav and mux into out/<vid>.mp4
"""
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
    sp = np.zeros(int(SR * 1.0))
    for k, m in enumerate((88, 91, 95, 100, 103)):
        b = (sine(midi(m), 0.6) + 0.3 * sine(midi(m) * 2.76, 0.6)) * env(int(SR * 0.6), 0.001, d=0.15)
        place(sp, b, k * 0.055, 0.35)
    S["sparkle"] = sp * 0.6
    bell = sum(sine(midi(76) * r, 1.6) * g * np.exp(-t_axis(1.6) * dd) for r, g, dd in ((1, 1, 2.2), (2.0, 0.35, 3.5), (2.76, 0.25, 5), (5.4, 0.08, 8)))
    S["bell"] = bell * env(len(bell), 0.002) * 0.4
    S["flip"] = hp_fast(noise(0.14, 31), 1500) * env(int(SR * 0.14), 0.002, d=0.03) * 0.6
    return S


# ---------------------------------------------------------------- MUSIC
def kick(d=0.35):
    return sine(lambda t: 45 + 120 * np.exp(-t * 30), d) * env(int(SR * d), 0.001, d=0.09)


def snare(d=0.25, seed=0):
    return (hp_fast(noise(d, seed), 1200) * env(int(SR * d), 0.001, d=0.05) * 0.7 + sine(190, d) * env(int(SR * d), 0.001, d=0.04) * 0.4)


def hat(d=0.06, seed=0):
    return hp_fast(noise(d, seed), 7000) * env(int(SR * d), 0.0005, d=0.012)


def place(buf, sig, t, gain=1.0):
    o = int(t * SR)
    if o >= len(buf):
        return
    e = min(len(buf), o + len(sig))
    buf[o:e] += sig[: e - o] * gain


def chord_notes(root, kind):
    return [root + i for i in {"maj": (0, 4, 7), "min": (0, 3, 7), "maj7": (0, 4, 7, 11), "m7": (0, 3, 7, 10), "sus": (0, 5, 7)}[kind]]


def music(style, dur):
    buf = np.zeros(int(SR * (dur + 2)))
    if style == "chat":
        bpm = 100
        beat = 60 / bpm
        prog = [(60, "maj"), (67, "maj"), (69, "min"), (65, "maj")]
        bar = 0
        t = 0.0
        cache = {}
        while t < dur:
            root, kind = prog[bar % 4]
            notes = chord_notes(root, kind)
            pattern = [0, 1, 2, 1, 0, 2, 1, 2]
            for i, p in enumerate(pattern):
                m = notes[p % len(notes)] + (12 if i in (2, 5) else 0)
                key = (m,)
                if key not in cache:
                    cache[key] = ks_pluck(midi(m), 0.9, 0.6, seed=m)
                place(buf, cache[key] * env(len(cache[key]), 0.001, d=0.35), t + i * beat / 2, 0.22)
            place(buf, sine(midi(root - 24), beat * 3.5) * env(int(SR * beat * 3.5), 0.01, d=0.8), t, 0.28)
            for b in range(4):
                place(buf, kick(), t + b * beat, 0.35 if b in (0, 2) else 0.0)
                place(buf, hat(0.05, b), t + b * beat + beat / 2, 0.12)
                if b in (1, 3):
                    place(buf, hp_fast(noise(0.12, b + bar), 3000) * env(int(SR * 0.12), 0.001, d=0.03), t + b * beat, 0.18)
            t += beat * 4
            bar += 1
    elif style == "data":
        bpm = 112
        beat = 60 / bpm
        prog = [(57, "min"), (53, "maj"), (60, "maj"), (55, "maj")]
        t, bar = 0.0, 0
        while t < dur:
            root, kind = prog[bar % 4]
            notes = chord_notes(root, kind)
            L = beat * 4
            pad = sum(saw(midi(n) * det, L) for n in notes for det in (0.997, 1.003))
            pad = lp_fast(pad, 900) * env(int(SR * L), 0.4, r=0.4) * 0.05
            place(buf, pad, t)
            for i in range(16):
                m = notes[i % len(notes)] + 12 * (1 + (i // 3) % 2)
                s = tri(midi(m), beat / 4) * env(int(SR * beat / 4), 0.002, d=0.07)
                place(buf, s, t + i * beat / 4, 0.12)
            for b in range(4):
                place(buf, kick(0.4), t + b * beat, 0.5)
                place(buf, hat(0.05, b), t + b * beat + beat / 2, 0.15)
            place(buf, sine(midi(root - 24), L) * env(int(SR * L), 0.01, r=0.2), t, 0.2)
            t += L
            bar += 1
    elif style == "chip":
        bpm = 150
        beat = 60 / bpm
        melody = [72, 76, 79, 76, 81, 79, 76, 74, 72, 74, 76, 79, 77, 76, 74, 72,
                  69, 72, 76, 72, 74, 76, 79, 81, 79, 76, 74, 72, 74, 72, 67, None]
        bass = [48, 48, 55, 55, 57, 57, 53, 53]
        t, i = 0.0, 0
        while t < dur:
            m = melody[i % len(melody)]
            if m:
                s = square(midi(m), beat / 2 * 0.9, 0.25) * env(int(SR * beat / 2 * 0.9), 0.002, d=0.25)
                place(buf, s, t, 0.08)
            if i % 2 == 0:
                bm = bass[(i // 4) % len(bass)]
                place(buf, tri(midi(bm - 12), beat * 0.9) * env(int(SR * beat * 0.9), 0.002, r=0.05), t, 0.22)
                place(buf, kick(0.2) if (i // 2) % 2 == 0 else hp_fast(noise(0.1, i), 2000) * env(int(SR * 0.1), 0.001, d=0.03), t, 0.35 if (i // 2) % 2 == 0 else 0.25)
            place(buf, hp_fast(noise(0.03, i), 8000) * env(int(SR * 0.03), 0.0005, d=0.008), t, 0.1)
            t += beat / 2
            i += 1
    elif style == "urgent":
        bpm = 124
        beat = 60 / bpm
        prog = [(50, "min"), (50, "min"), (46, "maj"), (48, "maj")]
        t, bar = 0.0, 0
        while t < dur:
            root, kind = prog[bar % 4]
            L = beat * 4
            for i in range(8):
                s = saw(midi(root - 12), beat / 2 * 0.8)
                s = lp_fast(s, 500) * env(len(s), 0.003, d=0.12)
                place(buf, s, t + i * beat / 2, 0.35)
            pad = sum(saw(midi(n), L) for n in chord_notes(root + 12, kind))
            place(buf, lp_fast(pad, 1400) * env(int(SR * L), 0.3, r=0.3), t, 0.03)
            for b in range(4):
                place(buf, kick(0.35), t + b * beat, 0.5)
                place(buf, S_TICK, t + b * beat + beat / 2, 0.25)
                place(buf, S_TOCK, t + b * beat, 0.15)
            t += L
            bar += 1
    elif style == "quiz":
        bpm = 128
        beat = 60 / bpm
        prog = [(60, "maj"), (57, "min"), (65, "maj"), (67, "maj")]
        t, bar = 0.0, 0
        cache = {}
        while t < dur:
            root, kind = prog[bar % 4]
            notes = chord_notes(root, kind)
            for i, step in enumerate([0, None, 2, 1, None, 2, 0, 1]):
                if step is None:
                    continue
                m = notes[step] + 12
                if m not in cache:
                    cache[m] = ks_pluck(midi(m), 0.4, 0.9, seed=m)
                place(buf, cache[m] * env(len(cache[m]), 0.001, d=0.12), t + i * beat / 2, 0.25)
            for b in range(4):
                bm = notes[0] - 24 + (7 if b % 2 else 0)
                place(buf, tri(midi(bm), beat * 0.45) * env(int(SR * beat * 0.45), 0.002, d=0.15), t + b * beat, 0.4)
                place(buf, kick(0.3), t + b * beat, 0.45 if b in (0, 2) else 0)
                if b in (1, 3):
                    place(buf, snare(0.2, b), t + b * beat, 0.3)
                place(buf, hat(0.04, b), t + b * beat + beat / 2, 0.15)
            t += beat * 4
            bar += 1
    elif style == "warm":
        bpm = 92
        beat = 60 / bpm
        progs = [[(60, "maj"), (55, "maj"), (57, "min"), (53, "maj")], [(53, "maj"), (55, "maj"), (52, "min"), (57, "min")]]
        mel = [[76, None, 79, 76, 74, None, 72, None], [74, None, 76, 79, 81, None, 79, None], [72, None, 76, 72, 69, None, 72, None], [69, None, 72, 74, 72, None, None, None]]
        t, bar = 0.0, 0
        cache = {}

        def pl(m, d=1.2, br=0.45):
            if (m, d) not in cache:
                cache[(m, d)] = ks_pluck(midi(m), d, br, seed=m) * env(int(SR * d), 0.001, r=0.1)
            return cache[(m, d)]

        def glock(m, d=1.0):
            f = midi(m)
            return (sine(f, d) + 0.25 * sine(f * 2.76, d) * np.exp(-t_axis(d) * 6)) * env(int(SR * d), 0.001, d=0.35)

        while t < dur:
            sect = (bar // 8) % 2
            root, kind = progs[sect][bar % 4]
            notes = chord_notes(root, kind)
            L = beat * 4
            for i, p in enumerate([0, 2, 1, 2, 0, 2, 1, 2]):
                m = notes[p] + (12 if i % 4 == 2 else 0)
                place(buf, pl(m), t + i * beat / 2, 0.16 if i % 2 == 0 else 0.11)
            place(buf, sine(midi(root - 24), L) * env(int(SR * L), 0.02, d=1.4), t, 0.26)
            place(buf, sine(midi(root - 24 + 7), beat) * env(int(SR * beat), 0.02, d=0.5), t + beat * 2.5, 0.12)
            for b in range(4):
                if b in (0, 2):
                    place(buf, kick(0.3), t + b * beat, 0.22)
                for h in range(2):
                    place(buf, hp_fast(noise(0.07, b * 2 + h + bar), 5000) * env(int(SR * 0.07), 0.01, d=0.02), t + b * beat + h * beat / 2, 0.05 if h else 0.03)
            if bar % 16 >= 8:
                for i, m in enumerate(mel[bar % 4]):
                    if m:
                        place(buf, glock(m + 12), t + i * beat / 2, 0.05)
            t += L
            bar += 1
    elif style == "lofi":
        bpm = 84
        beat = 60 / bpm
        prog = [(65, "maj7"), (64, "m7"), (62, "m7"), (60, "maj7")]
        t, bar = 0.0, 0
        while t < dur:
            root, kind = prog[bar % 4]
            L = beat * 4
            ch = np.zeros(int(SR * L))
            for n in chord_notes(root - 12, kind):
                f = midi(n)
                s = sine(f, L) + 0.3 * sine(2 * f, L) * np.exp(-t_axis(L) * 3)
                ch += s
            ch *= env(int(SR * L), 0.01, d=1.6) * (1 + 0.15 * np.sin(2 * np.pi * 4.5 * t_axis(L)))
            place(buf, ch, t, 0.06)
            place(buf, ch[: int(SR * beat * 1.5)] * np.linspace(1, 0, int(SR * beat * 1.5)), t + beat * 2.5, 0.04)
            place(buf, sine(midi(root - 24), L) * env(int(SR * L), 0.02, d=1.2), t, 0.22)
            for b in range(4):
                if b in (0, 2) or (b == 3 and bar % 2):
                    place(buf, kick(0.4), t + b * beat + (beat / 2 if b == 3 else 0), 0.45)
                if b in (1, 3):
                    place(buf, lp_fast(snare(0.3, b + bar), 4000), t + b * beat, 0.22)
                for h in range(2):
                    place(buf, hat(0.04, b * 2 + h), t + b * beat + h * beat / 2 + (0.03 if h else 0), 0.07)
            t += L
            bar += 1
        crackle = np.zeros_like(buf)
        rng = np.random.default_rng(5)
        idx = rng.integers(0, len(buf), int(dur * 25))
        crackle[idx] = rng.uniform(-1, 1, len(idx))
        buf += lp_fast(crackle, 5000) * 0.05 + lp_fast(noise(len(buf) / SR, 6), 2000)[: len(buf)] * 0.006
    buf = buf[: int(SR * dur)]
    fade = int(SR * 1.5)
    buf[-fade:] *= np.linspace(1, 0, fade)
    buf[: int(SR * 0.3)] *= np.linspace(0, 1, int(SR * 0.3))
    return buf / (np.max(np.abs(buf)) + 1e-9)


def load_audio(path):
    raw = subprocess.check_output(["ffmpeg", "-nostdin", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


S_TICK = None
S_TOCK = None


def main(vid):
    global S_TICK, S_TOCK
    sfx_lib = make_sfx()
    S_TICK, S_TOCK = sfx_lib["tick"], sfx_lib["tock"]
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
        a = a * (0.16 / rms)
        a *= cfg.get("voice_gain", {}).get(s["id"], 1.0)
        place(voice, a, s["start"])
        o, e = int(s["start"] * SR), int((s["start"] + len(a) / SR) * SR)
        active[o:e] = 1
    sfx = np.zeros(n + SR)
    for ev in json.loads((bdir / "sfx.json").read_text()):
        if ev["name"] in sfx_lib:
            place(sfx, sfx_lib[ev["name"]], ev["t"], ev["gain"] * cfg.get("sfx_gain", 0.5))
        else:
            print("missing sfx", ev["name"], file=sys.stderr)
    style = cfg.get("music", "chat")
    bgm = np.zeros(n + SR)
    m0 = 0.0
    if cfg.get("music_start"):
        m0 = next(sg["start"] for sg in tl["segments"] if sg["id"] == cfg["music_start"]) + cfg.get("music_offset", 0)
    m = music(style, dur - m0)
    o = int(SR * m0)
    bgm[o: o + len(m)] = m
    k = int(0.25 * SR)
    duck = np.convolve(active, np.ones(k) / k, mode="same")
    duck = np.clip(duck * 1.5, 0, 1)
    g_hi, g_lo = cfg.get("bgm_gain", 0.22), cfg.get("bgm_duck", 0.09)
    bgm *= g_hi - (g_hi - g_lo) * duck
    mix = voice + sfx + bgm
    mix = mix[:n]
    peak = np.max(np.abs(mix))
    mix = np.tanh(mix / max(peak, 1e-6) * 1.3) / np.tanh(1.3) * 0.89
    pcm = (mix * 32767).astype(np.int16)
    wav = bdir / "mix.wav"
    import wave
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    out = ROOT / "out"
    out.mkdir(exist_ok=True)
    final = out / f"{cfg.get('filename', vid)}.mp4"
    subprocess.check_call(["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", str(bdir / "silent.mp4"), "-i", str(wav),
                           "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "44100",
                           "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-shortest", "-movflags", "+faststart", str(final)])
    print("wrote", final)


if __name__ == "__main__":
    main(sys.argv[1])
