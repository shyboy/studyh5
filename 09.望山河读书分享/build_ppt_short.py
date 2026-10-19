"""生成《望山河》前三篇读书分享 PPT（8—10 分钟图文版，所有文字字号 >= 20pt）。

用法: python3 build_ppt_short.py
依赖: pip install python-pptx pillow
"""
from common import *  # noqa: F401,F403
from common import HERE

OUT_PPTX = HERE / "《望山河》读书分享（8-10分钟版）.pptx"
OUT_SCRIPT = HERE / "讲稿（8-10分钟版）.md"

CHARS_PER_MIN = 260
SHADE_RED = (70, 10, 10)


def mins(notes, pause=0.1):
    return round(len(notes) / CHARS_PER_MIN + pause, 1)


def slide(title, notes, **kw):
    return new_slide(title, mins(notes), notes, **kw)


def cslide(title, label, notes, **kw):
    return content_slide(title, label, mins(notes), notes, **kw)


# ---------------------------------------------------------------- 1 封面
s = slide("封面", "各位老师、同学们：大家好！今天我分享的题目是《一栋楼、一幢房、一只船》。")
bg(s, RED)
rect(s, 0, 0, 13.333, 4.35, fill=GOLD)
for i, (name, label, focus) in enumerate([("honglou", "一栋楼 · 北大红楼", (0.5, 0.6)),
                                          ("yida", "一幢房 · 上海石库门", (0.5, 0.7)),
                                          ("hongchuan", "一只船 · 南湖红船", (0.42, 0.6))]):
    x = i * 4.45
    photo(s, name, x, 0, 4.433, 4.3, focus=focus, shade=("bottom", SHADE_RED, 0, 0.85, 0.45))
    text(s, x, 3.55, 4.433, 0.6, label, size=22, color=WHITE, bold=True, align="c", anchor="m")
text(s, 0.5, 4.55, 12.333, 1.0, "一栋楼、一幢房、一只船", size=54, color=WHITE, bold=True,
     align="c", anchor="m")
text(s, 0.5, 5.55, 12.333, 0.6, "——《望山河》前三篇读书分享", size=28, color=GOLD, align="c")
text(s, 0.5, 6.3, 12.333, 0.55, "分享人：周央红（学生科党支部书记）", size=22, color=WHITE, align="c")

# ---------------------------------------------------------------- 2 开场一问
s = cslide("开场一问", None,
           "先问大家一个问题：如果让你用一个物件来代表中国共产党的起点，你会想到什么？（稍作停顿）"
           "一本书里给了三个答案——一栋楼、一幢房、一只船。今天我就从这三个物件说起。\n"
           "这本书叫《望山河》，湖南人民出版社出版，陈晋主编，全书三十七篇，一个地方一篇，"
           "入选今年一、二月“中国好书”。", width=6.1)
text(s, 0.9, 2.0, 6.1, 2.2, "如果让你用**一个物件**\n来代表中国共产党的起点，\n你会想到什么？",
     size=32, bold=True, spacing=1.15)
rrect(s, 0.9, 4.55, 6.1, 2.0, fill=LIGHT_GOLD)
rect(s, 1.15, 4.75, 1.1, 1.6, fill=RED)
text(s, 1.15, 4.75, 1.1, 1.6, "望\n山\n河", size=22, color=GOLD, bold=True, font=KAI,
     align="c", anchor="m", spacing=1.0)
text(s, 2.5, 4.68, 4.4, 1.75,
     ["《望山河》", "湖南人民出版社 · 陈晋 主编", "全书37篇，一地一篇", "入选今年一、二月“中国好书”"],
     size=20, spacing=1.05, anchor="m")
for i, (name, a, b, focus) in enumerate([("honglou", "一栋楼", "北大红楼", (0.5, 0.55)),
                                         ("yida", "一幢房", "上海石库门", (0.5, 0.65)),
                                         ("hongchuan", "一只船", "南湖红船", (0.4, 0.6))]):
    y = 0.35 + i * 2.15
    photo(s, name, 7.4, y, 5.6, 2.0, focus=focus, shade=("left", SHADE_RED, 0, 0.88, 0.65))
    text(s, 7.65, y + 0.35, 3.0, 0.75, a, size=32, color=WHITE, bold=True)
    text(s, 7.65, y + 1.1, 3.0, 0.5, b, size=22, color=PALE)

# ---------------------------------------------------------------- 3 三个坐标
s = cslide("三篇文章 · 三个坐标", None,
           "我选读的是前三篇：李舫写北大红楼，张军锋写上海石库门，梁衡写南湖红船。三篇连起来，"
           "正好是中国共产党从思想准备到组织诞生、再到扬帆启航的一段路。陈晋在序言中说："
           "“所谓望，就是走近历史坐标、体会历史坐标、抒写历史坐标。”今天我们就一起走近这三个坐标。")
for i, (name, t, a, b, focus) in enumerate([
        ("honglou", "1918—1920", "思想准备", "李舫 · 北大红楼", (0.5, 0.55)),
        ("yida", "1921年7月", "组织诞生", "张军锋 · 上海石库门", (0.5, 0.65)),
        ("hongchuan2", "1921年夏", "扬帆启航", "梁衡 · 南湖红船", (0.5, 0.6))]):
    x = 0.9 + i * 3.95
    photo(s, name, x, 2.0, 3.6, 2.3, focus=focus, frame=GOLD)
    rect(s, x, 2.0, 1.75, 0.5, fill=RED)
    text(s, x, 2.0, 1.75, 0.5, t, size=20, color=WHITE, bold=True, align="c", anchor="m")
    text(s, x, 4.4, 3.6, 0.6, a, size=30, color=DEEP_RED, bold=True, align="c")
    text(s, x, 5.0, 3.6, 0.5, b, size=22, color=GRAY, align="c")
rect(s, 0.9, 5.6, 11.5, 1.1, fill=RED)
text(s, 0.9, 5.62, 11.5, 1.05,
     ["所谓望，就是走近历史坐标、体会历史坐标、抒写历史坐标。", "——陈晋《望山河》序言"],
     size=26, color=WHITE, font=KAI, align="c", anchor="m", spacing=1.0)
box = s.shapes[-1].text_frame.paragraphs[1]
for r in box.runs:
    r.font.size = Pt(20)
    r.font.color.rgb = GOLD
box._p.get_or_add_endParaRPr().set("sz", "2000")

# ================================================================= 一栋楼
s = slide("一栋楼：红楼里的图书馆助理员",
          "第一节，一栋楼——北大红楼。1918年秋天，一位二十五岁的青年人走进北大红楼，在图书馆第二阅览室当助理员，"
          "每月八块大洋，工作是登记来馆读报者的姓名。他后来回忆说：“我的职位低微，大家都不理我……"
          "他们都是些大忙人，没有时间听一个图书馆助理员说南方话。”这位青年，就是毛泽东。\n"
          "也是在这栋楼里，1920年，李大钊指导成立了北京共产党小组。")
bg(s, CREAM)
photo(s, "honglou", 0, 0, 5.6, 7.5, focus=(0.42, 0.5), shade=("bottom", SHADE_RED, 0, 0.95, 0.65))
text(s, 0.6, 5.35, 4.6, 0.5, "第一节", size=22, color=PALE, bold=True)
text(s, 0.6, 5.8, 4.6, 0.9, "一栋楼", size=44, color=WHITE, bold=True)
text(s, 0.6, 6.7, 4.6, 0.5, "北大红楼", size=24, color=GOLD)
text(s, 6.1, 0.55, 6.5, 0.8, "红楼里的图书馆助理员", size=32, color=DEEP_RED, bold=True)
rect(s, 6.1, 1.42, 1.2, 0.06, fill=GOLD)
text(s, 6.1, 1.65, 6.4, 1.4,
     "1918年秋，一位**二十五岁**的青年人走进北大红楼，在图书馆第二阅览室当助理员，"
     "每月**八块大洋**，工作是登记来馆读报者的姓名。", size=22, spacing=1.2)
rrect(s, 6.1, 3.2, 6.4, 2.5, fill=LIGHT_GOLD)
photo(s, "mao_1919", 6.3, 3.4, 1.55, 1.75, focus=(0.5, 0.3), frame=GOLD, frame_w=1.5)
text(s, 6.2, 5.18, 1.75, 0.45, "1919年", size=20, color=GRAY, align="c")
text(s, 8.05, 3.3, 4.35, 2.35,
     ["“我的职位低微，大家都不理我……他们都是些大忙人，没有时间听一个图书馆助理员说南方话。”",
      "——毛泽东 回忆"],
     size=22, font=KAI, anchor="m", spacing=1.15)
s.shapes[-1].text_frame.paragraphs[1].alignment = ALIGN["r"]
text(s, 6.1, 5.85, 6.4, 0.85, "也是在这栋楼里，1920年，**李大钊指导成立了北京共产党小组**。",
     size=22, anchor="m")
page_no(s)

s = cslide("在没人留意的地方，把事做好", "第一节 · 一栋楼 · 体会与行动",
           "我的感悟是：一个后来改变中国的人，当年也有过被忽视、说不上话的时候。他没有因此停下，"
           "而是在没人留意的地方把事做好。同学们，你们现在学的每一项技能、完成的每一次实训，"
           "就像当年那位图书馆助理员登记每一个名字一样——看似不起眼，但坚持做下去，就会成为你未来的底气。\n"
           "回到我们的工作。我们学校是技工学校，不少同学在初中阶段很少被表扬，进了校门还是低着头。"
           "他们需要的不是一句鼓励，是有人真正看见他。支部的做法是党员联系学生：每名党员固定联系一到两名"
           "重点关注的同学，定期谈心谈话，问学习、问家里、问心里的打算。这类同学大多安静内敛，"
           "不会主动来找人，只有靠人去找——把话说到他心里去，帮他把自信找回来。", width=8.3)
rows = [("我的感悟", "一个后来改变中国的人，当年也有过被忽视、说不上话的时候。"
                     "他没有因此停下，而是**在没人留意的地方把事做好**。"),
        ("对同学们说", "每一项技能、每一次实训，就像登记每一个名字——看似不起眼，"
                       "**坚持做下去，就会成为你未来的底气**。"),
        ("回到工作", "他们需要的不是一句鼓励，是**有人真正看见他**。党员联系学生："
                     "每名党员固定联系1—2名重点关注的同学，问学习、问家里、问打算。")]
for i, (tag, body) in enumerate(rows):
    y = 2.0 + i * 1.4
    rrect(s, 0.9, y + 0.08, 1.65, 0.55, fill=RED)
    text(s, 0.9, y + 0.08, 1.65, 0.55, tag, size=20, color=WHITE, bold=True, align="c", anchor="m")
    text(s, 2.75, y, 6.45, 1.25, body, size=22, spacing=1.15)
    if i < 2:
        rect(s, 0.9, y + 1.32, 8.3, 0.02, fill=GOLD)
photo(s, "honglou_old", 9.55, 0.6, 3.1, 4.6, focus=(0.5, 0.5), frame=GOLD)
text(s, 9.55, 5.25, 3.1, 0.45, "早年的北大红楼", size=20, color=GRAY, align="c")

# ================================================================= 一幢房
s = slide("一幢房：望志路106号",
          "第二节，一幢房——上海石库门。1921年7月23日晚上，十三位年轻人走进上海法租界望志路106号，"
          "在一间十八平方米的客厅里开会。他们代表全国五十多名党员，平均年龄二十八岁，最小的才十九岁。"
          "会开到第八天晚上，法租界巡捕房的密探闯了进来，会议被迫中断，最后一天转移到嘉兴南湖的一条游船上。")
bg(s, CREAM)
photo(s, "yida", 0, 0, 13.333, 3.4, focus=(0.5, 0.72), shade=("left", SHADE_RED, 0, 0.9, 0.6))
text(s, 0.7, 0.85, 6, 0.5, "第二节", size=22, color=GOLD, bold=True)
text(s, 0.7, 1.3, 6, 0.9, "一幢房", size=44, color=WHITE, bold=True)
text(s, 0.7, 2.25, 6.5, 0.55, "上海石库门 · 1921年7月23日晚", size=24, color=PALE)
for i, (n, unit, label) in enumerate([("13", "位", "出席代表"), ("18", "㎡", "客厅面积"),
                                      ("28", "岁", "平均年龄"), ("19", "岁", "最小代表")]):
    x = 0.9 + i * 2.2
    rrect(s, x, 3.7, 2.0, 1.7, fill=LIGHT_GOLD)
    rect(s, x, 3.7, 2.0, 0.08, fill=RED)
    b = text(s, x, 3.85, 2.0, 0.9, n, size=40, color=RED, bold=True, align="c", anchor="m")
    add_run(b, unit, 22, RED, bold=True)
    text(s, x, 4.8, 2.0, 0.5, label, size=20, align="c")
photo(s, "no106", 9.85, 3.7, 2.55, 1.7, focus=(0.45, 0.5), frame=GOLD)
text(s, 9.85, 5.42, 2.55, 0.42, "望志路106号", size=20, color=GRAY, align="c")
text(s, 0.9, 5.95, 10.3, 0.8,
     "代表全国五十多名党员。会开到第八天晚上，密探闯入，会议被迫中断；"
     "**最后一天转移到嘉兴南湖的一条游船上**。", size=22, anchor="m")
page_no(s)

s = cslide("日记里的五个圈", "第二节 · 一幢房",
           "何叔衡和毛泽东从长沙动身那天，何叔衡的好友谢觉哉在日记里只写了一句：“午后6时叔衡往上海，"
           "偕行者润之，赴全国○○○○○之招。”那五个圈，指的就是“共产主义者”——当时这几个字不能写出来。\n"
           "我的感悟是：一群人做着最危险的事，落笔时却连几个字都不敢写全。他们不知道前路如何，"
           "却都到了场、留了下来。信仰的分量，不在场面宏大时，而在处境艰难处。", width=6.6)
text(s, 0.9, 1.95, 6.6, 0.85, "何叔衡和毛泽东从长沙动身那天，好友谢觉哉在日记里只写了一句：",
     size=22, anchor="m")
rrect(s, 0.9, 2.95, 6.6, 1.7, fill=LIGHT_GOLD)
text(s, 0.9, 2.95, 6.6, 1.7, "“午后6时叔衡往上海，\n偕行者润之，\n赴全国**○○○○○**之招。”",
     size=26, font=KAI, align="c", anchor="m", spacing=1.1)
text(s, 0.9, 4.8, 6.6, 0.8, "○○○○○ ＝ 共产主义者", size=36, color=RED, bold=True,
     align="c", anchor="m")
text(s, 0.9, 5.65, 6.6, 0.6, "当时，这几个字**不能写出来**。", size=22, align="c", anchor="m")
photo(s, "yida_door", 7.9, 0.55, 4.5, 2.9, focus=(0.5, 0.45), frame=GOLD)
rrect(s, 7.9, 3.65, 4.5, 2.95, fill=RED)
text(s, 8.15, 3.8, 4.0, 0.5, "我的感悟", size=22, color=GOLD, bold=True)
text(s, 8.15, 4.3, 4.05, 2.2,
     "一群人做着最危险的事，落笔时却连几个字都不敢写全。\n**信仰的分量，不在场面宏大时，而在处境艰难处。**",
     size=22, color=WHITE, em=GOLD, spacing=1.2, space_after=8)

s = cslide("做工作的人，要一个一个到场", "第二节 · 一幢房 · 体会与行动",
           "同学们，你们在学校里也会遇到难的时候——考试没过、技能练不好、跟同学闹了别扭。"
           "这些时候能不能沉住气、不放弃，往往决定了你能走多远。\n"
           "放在学生科的工作上，这份分量就是帮扶台账不能只挂个名字，要动态更新、摸排到人。"
           "我们支部有一项做法叫“行走的党日”，就是不在会议室里关起门搞，把党日放到学生中间去："
           "学生报到、宿舍走访、考前和实习前的谈心，这些日常场景里，党员该在的时候要在。"
           "学生的困难是一件一件解决的，做工作的人也得一个一个到场。")
rrect(s, 0.9, 2.0, 5.0, 4.05, fill=LIGHT_GOLD)
text(s, 1.2, 2.12, 4.4, 0.5, "对同学们说", size=24, color=RED, bold=True)
text(s, 1.2, 2.62, 4.4, 0.45, "难的时候——", size=22)
for i, t in enumerate(["考试没过", "技能练不好", "跟同学闹了别扭"]):
    y = 3.15 + i * 0.65
    rrect(s, 1.2, y, 4.4, 0.55, fill=WHITE, line=GOLD, line_w=1)
    text(s, 1.2, y, 4.4, 0.55, t, size=22, color=RED, bold=True, align="c", anchor="m")
text(s, 1.2, 5.1, 4.4, 0.9, "能不能沉住气、不放弃，往往决定了你能走多远。", size=22,
     color=DEEP_RED, bold=True, anchor="m", spacing=1.1)
text(s, 6.2, 2.0, 6.2, 0.5, "回到工作", size=24, color=RED, bold=True)
rrect(s, 6.2, 2.6, 6.2, 1.15, fill=LIGHT_GOLD)
text(s, 6.4, 2.6, 5.85, 1.15, "**帮扶台账：**不能只挂个名字，要动态更新、摸排到人。",
     size=22, anchor="m", spacing=1.15)
rrect(s, 6.2, 3.9, 6.2, 2.15, fill=LIGHT_GOLD)
text(s, 6.4, 3.98, 5.85, 0.85, "**行走的党日：**不在会议室里关起门搞，把党日放到学生中间去",
     size=22, anchor="m", spacing=1.1)
for i, t in enumerate(["学生报到", "宿舍走访", "考前谈心", "实习前谈心"]):
    x = 6.4 + (i % 2) * 2.95
    y = 4.88 + (i // 2) * 0.58
    rrect(s, x, y, 2.8, 0.5, fill=RED)
    text(s, x, y, 2.8, 0.5, t, size=20, color=WHITE, bold=True, align="c", anchor="m")
text(s, 0.9, 6.2, 10.4, 0.55, "学生的困难是一件一件解决的，做工作的人也得**一个一个到场**。",
     size=22, align="c", anchor="m")

# ================================================================= 一只船
s = slide("一只船：梁衡站在船边",
          "第三节，一只船——南湖红船。梁衡专程赶到嘉兴南湖，站在船边写下：“这是一只多么小的船啊，"
          "要低头弯腰才能进入舱内，刚能容下十几个人促膝侧坐。”他又问：“我真不敢想，我们轰轰烈烈、"
          "排山倒海的八十年就是从这条船舱里倾泻出来的吗？”")
bg(s, DEEP_RED)
photo(s, "hongchuan", 0, 0, 13.333, 4.75, focus=(0.5, 0.55), shade=("bottom", (122, 18, 18), 0, 1.0, 0.4))
text(s, 0.9, 3.95, 11.5, 0.8, "第三节 · 一只船 · 南湖红船", size=40, color=WHITE, bold=True)
text(s, 0.9, 4.78, 11.5, 0.85,
     "“这是一只多么小的船啊，要低头弯腰才能进入舱内，刚能容下十几个人促膝侧坐。”",
     size=24, color=WHITE, font=KAI, spacing=1.1)
text(s, 0.9, 5.62, 11.5, 0.85,
     "“我真不敢想，我们轰轰烈烈、排山倒海的八十年就是从这条船舱里倾泻出来的吗？”",
     size=24, color=WHITE, font=KAI, spacing=1.1)
text(s, 0.9, 6.47, 10.4, 0.45, "——梁衡", size=20, color=GOLD, align="r")
page_no(s, PALE)

s = cslide("船头放哨的人", "第三节 · 一只船",
           "当时在船头放哨的是李达的夫人王会悟，她是嘉兴人，把会议转移到南湖就是她的提议。那天下午湖面驶过"
           "一条汽艇，她疑心是警情，赶紧发暗号，船舱里立刻响起一片麻将声。\n"
           "我的感悟是：那么大的事，是从一条小船里开始的，是从一个放哨的人、一个提议的人开始的。"
           "各人做好自己那一份，事情才成。育人也是一样：学生的成长，靠的不是一次大会、一场活动，"
           "而是班级、宿舍这些最小单元里一次次的关注。", x0=4.3, width=8.1)
photo(s, "wanghuiwu", 0.9, 0.6, 2.9, 4.25, focus=(0.5, 0.15), frame=GOLD)
text(s, 0.9, 4.95, 2.9, 0.5, "王会悟", size=24, color=DEEP_RED, bold=True, align="c")
text(s, 0.9, 5.45, 2.9, 0.45, "李达夫人 · 嘉兴人", size=20, color=GRAY, align="c")
text(s, 4.3, 1.95, 8.1, 1.4,
     "把会议转移到南湖，就是她的提议。她在船头放哨，一条汽艇驶过，她疑心是警情，"
     "赶紧发暗号——船舱里立刻响起**一片麻将声**。", size=22, spacing=1.2)
rrect(s, 4.3, 3.4, 8.1, 2.1, fill=RED)
text(s, 4.55, 3.5, 7.6, 0.45, "我的感悟", size=20, color=GOLD, bold=True)
text(s, 4.55, 3.95, 7.65, 1.45,
     "那么大的事，是从一条小船里开始的，是从一个放哨的人、一个提议的人开始的。"
     "**各人做好自己那一份，事情才成。**", size=24, color=WHITE, em=GOLD, spacing=1.1)
text(s, 4.3, 5.6, 8.1, 1.05,
     "育人也是一样：学生的成长，靠的不是一次大会、一场活动，"
     "而是**班级、宿舍这些最小单元里一次次的关注**。", size=22, anchor="m", spacing=1.15)

s = slide("做那个“放哨的人”",
          "同学们，你们每个人在班级里、在宿舍里，也可以成为那个“放哨的人”——看到同学情绪不对，主动问一句；"
          "看到室友遇到困难，伸手帮一把。大事往往就是从这些小事里长出来的。\n"
          "回到我们的工作，育人说到底要走心。支部重点抓两件事：一是“行走的党日”，让学生在日常场景里看得见党员；"
          "二是党员联系学生，谈心谈话落到人头上，每次谈完有记录、有跟进，不走过场。我自己也带个头，"
          "支部的学习体会先在党员中交流，用得上的班会素材再整理出来，不另起一套。")
bg(s, CREAM)
photo(s, "hongchuan_shore", 0, 0, 4.7, 7.5, focus=(0.3, 0.5), shade=("bottom", SHADE_RED, 0, 0.88, 0.4))
text(s, 0.5, 5.55, 4.0, 0.5, "做那个", size=24, color=PALE)
text(s, 0.5, 6.0, 4.0, 0.8, "“放哨的人”", size=36, color=WHITE, bold=True)
text(s, 5.2, 0.42, 7.2, 0.45, "第三节 · 一只船 · 体会与行动", size=20, color=GOLD, bold=True)
text(s, 5.2, 0.82, 7.2, 0.85, "大事从小事里长出来", size=32, color=DEEP_RED, bold=True)
rect(s, 5.2, 1.72, 1.2, 0.06, fill=GOLD)
for i, (a, b) in enumerate([("看到同学情绪不对", "主动问一句"), ("看到室友遇到困难", "伸手帮一把")]):
    y = 2.0 + i * 1.05
    rrect(s, 5.2, y, 3.6, 0.85, fill=LIGHT_GOLD)
    text(s, 5.2, y, 3.6, 0.85, a, size=22, align="c", anchor="m")
    arrow(s, 8.95, y + 0.22, 0.55, 0.42)
    rrect(s, 9.65, y, 2.75, 0.85, fill=RED)
    text(s, 9.65, y, 2.75, 0.85, b, size=24, color=WHITE, bold=True, align="c", anchor="m")
text(s, 5.2, 4.1, 7.2, 0.6, "大事往往就是从这些小事里长出来的。", size=24, color=DEEP_RED,
     bold=True, align="c", anchor="m")
rrect(s, 5.2, 4.9, 7.2, 1.8, fill=LIGHT_GOLD)
text(s, 5.45, 4.98, 6.8, 0.45, "回到工作：育人说到底要走心", size=22, color=RED, bold=True)
text(s, 5.45, 5.45, 6.8, 1.2,
     "行走的党日，让学生看得见党员；党员联系学生，谈心有记录、有跟进，不走过场。"
     "我带头：学习体会先在党员中交流，不另起一套。", size=22, spacing=1.1)
page_no(s)

# ================================================================= 结语
s = slide("山河在望，坐标在心",
          "山河在望，坐标在心。陈晋在序言中说：“所谓望，就是走近历史坐标、体会历史坐标、抒写历史坐标。”"
          "今天我们走近了红楼、石库门和红船这三个坐标，接下来要做的，就是在自己的坐标上写好属于我们这一代人的"
          "那一笔。同学们在校园里认真实训、彼此包容、直面挫折，老师们把每一件小事做细做实，守好自己那一份"
          "——这就是对红色精神最好的传承。\n"
          "我的分享就到这里。这三个坐标里，哪一个最触动你？欢迎分享结束后一起交流。谢谢大家。")
bg(s, RED)
for i, (name, focus) in enumerate([("honglou", (0.5, 0.55)), ("yida", (0.5, 0.65)),
                                   ("hongchuan2", (0.5, 0.6))]):
    photo(s, name, i * 4.45, 0, 4.433, 2.9, focus=focus, shade=("bottom", (158, 27, 27), 0, 1.0, 0.55))
text(s, 0.5, 2.85, 12.333, 1.0, "山河在望  坐标在心", size=54, color=GOLD, bold=True, font=KAI,
     align="c", anchor="m")
text(s, 0.5, 3.9, 12.333, 0.6, "在自己的坐标上，写好属于我们这一代人的那一笔", size=26, color=WHITE,
     align="c", anchor="m")
text(s, 0.5, 4.6, 12.333, 0.9,
     ["同学们：认真实训 · 彼此包容 · 直面挫折", "老师们：把每一件小事做细做实，守好自己那一份"],
     size=22, color=PALE, align="c", anchor="m", spacing=1.1)
text(s, 0.5, 5.7, 12.333, 0.6, "这三个坐标里，哪一个最触动你？", size=26, color=GOLD, bold=True,
     align="c", anchor="m")
text(s, 0.5, 6.35, 12.333, 0.65, "谢谢大家", size=30, color=WHITE, bold=True, align="c", anchor="m")

credits_slide()
save(OUT_PPTX, OUT_SCRIPT, "《望山河》前三篇读书分享 · 讲稿（8—10 分钟版）")
