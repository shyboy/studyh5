# 横版科普长视频

1920×1080 横屏科普视频。画面是 HTML 动画，用无头 Chrome 逐帧渲染；配音由 edge-tts 生成；音效和配乐用 numpy 合成，没有版权素材。
流程沿用 `danzhaohui-videos/`，改成横版，并加了按台词词语对齐动画（`E.when(段落id, "词语")`）。

| 视频 | 目录 | 成片 | 发布文案 |
|------|------|------|----------|
| 不催也能自己动：给5岁孩子建立规则感的6个方法（7分14秒） | `src/self_rules/` | `out/不催也能自己动_给5岁孩子建立规则感的6个方法.mp4` | `发布文案_self_rules.md` |

封面在 `out/covers/`：`_16x9` 用于 B站、视频号、抖音、西瓜；`_4x3` 用于 B站动态封面裁切；`_3x4`（1080×1440）用于小红书和视频号竖版封面。

## 依赖

- Python 3：`pip install playwright edge-tts pillow numpy`
- Google Chrome（`/usr/local/bin/google-chrome`）、ffmpeg
- 字体（放到 `~/.fonts`）：Noto Sans CJK SC、ZCOOL KuaiLe、霞鹜文楷 LXGW WenKai、Bebas Neue、Noto Color Emoji

## 制作一条视频

```bash
python3 scripts/tts.py self_rules                          # 配音 + 时间轴 -> build/self_rules/timeline.json
python3 scripts/render.py self_rules --preview 0,3,60      # 预览静帧 -> build/self_rules/preview/
python3 scripts/sheet.py self_rules                        # 预览静帧拼成一张图
python3 scripts/render.py self_rules --jobs 3              # 并行渲染无声视频
python3 scripts/audio.py self_rules                        # 混音并封装 -> out/*.mp4
python3 scripts/cover.py self_rules                        # 封面 -> out/covers/
```

每条视频的目录：`script.json` 是台词、配音和配乐设置；`index.html` 引入 `scenes.js` / `methods.js` / `finale.js`（画面）和 `style.css`。
动画都按台词时间写（`S(id)`、`End(id)`、`when(id, "词语")`），改台词后重新跑 `tts.py`，画面会自动对齐新的配音。

`script.json` 里的 `music_start` 可以让配乐从某一段开始：本片开头 3 秒只用时钟滴答声和气泡音效，配乐从第二句开始。
