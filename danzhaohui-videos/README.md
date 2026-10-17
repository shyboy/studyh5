# 单招汇宣传短视频

为 danzhaohui.com 制作的 6 条竖屏短视频（小红书 / 抖音 / 视频号）。发布文案见 `发布文案.md`。

画面是 HTML 动画，用无头 Chrome 逐帧渲染；配音由 edge-tts 生成；音效和配乐用 numpy 合成，没有版权素材。

## 依赖

- Python 3：`pip install playwright edge-tts pillow numpy`
- Google Chrome（`/usr/local/bin/google-chrome`）、ffmpeg
- 字体（放到 `~/.fonts`）：Noto Sans/Serif CJK SC、霞鹜文楷 LXGW WenKai、Ma Shan Zheng、Bebas Neue、Noto Color Emoji

## 制作一条视频

```bash
python3 scripts/capture_site.py          # 截取网站真实画面到 shots/（一次即可）
python3 scripts/tts.py v4_deadline       # 配音 + 时间轴 -> build/v4_deadline/timeline.json
python3 scripts/render.py v4_deadline --preview 3,10,20   # 预览静帧
python3 scripts/sheet.py v4_deadline     # 拼成一张预览图
python3 scripts/render.py v4_deadline    # 渲染无声视频
python3 scripts/audio.py v4_deadline     # 混音并封装 -> out/*.mp4
python3 scripts/covers.py                # 封面 -> out/covers/
```

每条视频的目录在 `src/<id>/`：`script.json` 是台词和配乐设置，`index.html` 是画面。改台词后重新跑 `tts.py`，画面会自动对齐新的配音时间。
