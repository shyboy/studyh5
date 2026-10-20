# 育儿科普横版视频

16:9 横版长视频（1920×1080，30fps）。第一期：`meltdown` ——《孩子越哄越崩溃？3 个字接住情绪爆发期》。成片、字幕、封面在 `out/`，发布文案见 `发布文案.md`。

画面是 HTML 动画，用无头 Chrome 逐帧渲染；配音由 edge-tts 生成；配乐和音效用 numpy 合成，插画是手写 SVG，没有版权素材。

## 依赖

- Python 3：`pip install playwright edge-tts pillow numpy`
- Google Chrome（`/usr/local/bin/google-chrome`）、带 libass 的 ffmpeg
- 字体：Noto Sans CJK SC、Noto Color Emoji（`apt install fonts-noto-cjk fonts-noto-color-emoji`），霞鹜文楷 LXGW WenKai、站酷快乐体 ZCOOL KuaiLe（放到 `~/.fonts`）

## 制作流程

```bash
python3 scripts/tts.py meltdown                       # 配音 + 时间轴 -> build/meltdown/timeline.json
python3 scripts/subs.py meltdown                      # 字幕 subs.srt / subs.ass + out/*_口播稿.txt
python3 scripts/render.py meltdown --preview 1,30,90  # 预览静帧 -> build/meltdown/preview/
python3 scripts/sheet.py meltdown                     # 预览静帧拼图
for k in 0 1 2; do python3 scripts/render.py meltdown --part $k/3 & done; wait
python3 scripts/render.py meltdown --concat 3         # 无声画面 -> build/meltdown/silent.mp4
python3 scripts/audio.py meltdown                     # 配音版（烧录字幕）+ 无配音版（附 .srt）-> out/
python3 scripts/cover.py meltdown                     # 封面 -> out/*_封面.jpg（16:9）和 *_封面_3x4.jpg（3:4）
```

`src/<id>/script.json` 是台词、配乐和字幕高亮词；`src/<id>/index.html` 是画面。画面元素用 `W(段落id, "词")` 对齐到口播里某个词出现的时刻，所以改台词后重新跑 `tts.py`，画面会自动跟上新的配音时间。

无配音版沿用配音版的时间轴，画面节奏不变，配套的 `.srt` 与视频同名，可直接外挂或导入剪辑软件。
