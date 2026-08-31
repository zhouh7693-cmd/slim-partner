# -*- coding: utf-8 -*-
"""slim-partner 优化脚本：
1. 搭子-AI能力.html：注入互动教练对话（麦肯锡式）+ 路线图可折叠 + Checklist可勾选
2. 其余11个搭子页：教练tab注入领域定制「三阶段成长路线图 + 基本功Checklist」（可点击互动）
"""
import io, os, re, sys

BASE = os.path.dirname(os.path.abspath(__file__))

def read(f):
    with io.open(os.path.join(BASE, f), 'r', encoding='utf-8') as fp:
        return fp.read()

def write(f, s):
    with io.open(os.path.join(BASE, f), 'w', encoding='utf-8') as fp:
        fp.write(s)

# ============================================================
# Part 1: 搭子-AI能力.html
# ============================================================
def patch_ai():
    f = '搭子-AI能力.html'
    s = read(f)
    if 'id="coachIntro"' in s:
        print('[SKIP] AI页面已打过补丁')
        return

    # ---- 1a. 教练CSS（靛蓝配色，参照身体财富模板）----
    coach_css = """
  /* ===== 教练互动（参照各搭子教练 · 麦肯锡式对话）===== */
  .coach-intro { background: white; border-radius: 24px; padding: 28px 20px; margin-bottom: 14px; text-align: center; box-shadow: 0 6px 18px rgba(0,0,0,0.05); }
  .coach-intro-icon { font-size: 48px; margin-bottom: 12px; }
  .coach-intro-title { font-size: 20px; font-weight: 800; background: linear-gradient(135deg, #6366f1, #4f46e5); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 8px; }
  .coach-intro-sub { font-size: 13px; color: #6c7a89; margin-bottom: 20px; }
  .coach-method-steps { display: flex; gap: 10px; margin-bottom: 22px; }
  .method-step { flex: 1; background: #eef0fe; border-radius: 14px; padding: 12px 6px; font-size: 12px; font-weight: 700; color: #6366f1; line-height: 1.5; }
  .step-num { display: block; font-size: 18px; margin-bottom: 4px; }
  .step-desc { font-size: 10px; font-weight: 500; color: #4f46e5; }
  .coach-intro-note { font-size: 11px; color: #8f9eae; margin-top: 14px; }
  .coach-start-btn { margin-top: 16px; width: 100%; padding: 14px; border-radius: 60px; border: none; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.15s; }
  .coach-start-btn:active { transform: scale(0.97); }
  .coach-chat { background: white; border-radius: 24px; padding: 18px; margin-bottom: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.05); }
  .coach-progress-bar { display: flex; gap: 8px; margin-bottom: 18px; }
  .progress-step { flex: 1; text-align: center; font-size: 11px; font-weight: 700; color: #8f9eae; padding: 8px 4px; border-radius: 12px; background: #f5f5f5; transition: all 0.3s; line-height: 1.4; }
  .progress-step.active { background: #eef0fe; color: #6366f1; }
  .chat-messages { max-height: 380px; overflow-y: auto; margin-bottom: 16px; padding: 8px; }
  .chat-msg { margin-bottom: 16px; animation: msgIn 0.3s ease; }
  .chat-msg.coach { display: flex; gap: 8px; align-items: flex-start; }
  .chat-msg.user { display: flex; gap: 8px; align-items: flex-start; flex-direction: row-reverse; }
  .chat-avatar { font-size: 26px; flex-shrink: 0; }
  .chat-bubble { max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.6; color: #2b3a4a; }
  .chat-msg.coach .chat-bubble { background: #eef0fe; border-radius: 18px 18px 18px 4px; }
  .chat-msg.user .chat-bubble { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border-radius: 18px 18px 4px 18px; }
  .chat-input-area { display: flex; gap: 8px; align-items: flex-end; }
  .chat-input-area textarea { flex: 1; padding: 12px 16px; border-radius: 16px; border: 1.5px solid #e9edf2; font-size: 14px; resize: none; outline: none; font-family: inherit; min-height: 44px; }
  .chat-send-btn { padding: 12px 20px; border-radius: 16px; border: none; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; font-size: 14px; font-weight: 700; cursor: pointer; flex-shrink: 0; }
  .chat-send-btn:active { transform: scale(0.97); }
  .coach-prompt { text-align: center; color: #6366f1; font-size: 13px; font-weight: 600; padding: 8px; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .generating-report { text-align: center; color: #0891b2; font-size: 14px; font-weight: 600; padding: 16px; animation: blink 1.5s infinite; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .coach-buttons { padding: 12px 16px; background: #fafafa; border-top: 1px solid #e5e7eb; }
  .coach-btn-prompt { font-size: 13px; color: #6b7280; margin-bottom: 10px; text-align: center; }
  .coach-btn-list { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .coach-choice-btn { flex: 1; min-width: 120px; max-width: 180px; padding: 12px 16px; border: 2px solid #6366f1; background: white; color: #6366f1; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .coach-choice-btn:hover { background: #6366f1; color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
  .coach-choice-btn.yes { border-color: #22c55e; color: #22c55e; }
  .coach-choice-btn.yes:hover { background: #22c55e; color: white; box-shadow: 0 4px 12px rgba(34,197,94,0.3); }
  .coach-choice-btn.no { border-color: #ef4444; color: #ef4444; }
  .coach-choice-btn.no:hover { background: #ef4444; color: white; box-shadow: 0 4px 12px rgba(239,68,68,0.3); }
  .coach-report-mckinsey { background: white; border-radius: 24px; padding: 26px 18px; margin-bottom: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.05); }
  .report-header { text-align: center; margin-bottom: 24px; }
  .report-icon { font-size: 44px; margin-bottom: 12px; }
  .report-title { font-size: 19px; font-weight: 800; color: #2b3a4a; margin-bottom: 4px; }
  .report-subtitle { font-size: 12px; color: #8f9eae; }
  .report-core-conclusion { background: linear-gradient(135deg, #eef0fe, #f5f3ff); border-radius: 20px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #6366f1; }
  .report-core-conclusion h3 { font-size: 15px; font-weight: 700; color: #6366f1; margin-bottom: 8px; }
  .report-core-conclusion p { font-size: 14px; color: #2b3a4a; line-height: 1.6; }
  .report-mece-analysis { margin-bottom: 20px; }
  .report-mece-analysis h3 { font-size: 15px; font-weight: 700; color: #2b3a4a; margin-bottom: 12px; }
  .mece-dimension { background: #fdf6f0; border-radius: 16px; padding: 14px; margin-bottom: 10px; }
  .mece-dim-title { font-size: 14px; font-weight: 700; color: #6366f1; margin-bottom: 6px; }
  .mece-dim-desc { font-size: 13px; color: #6c7a89; line-height: 1.5; }
  .report-priority-actions { margin-bottom: 20px; }
  .report-priority-actions h3 { font-size: 15px; font-weight: 700; color: #2b3a4a; margin-bottom: 12px; }
  .action-item { background: white; border-radius: 16px; padding: 14px; margin-bottom: 8px; border-left: 4px solid #6366f1; }
  .action-priority { font-size: 11px; font-weight: 700; color: #6366f1; margin-bottom: 4px; }
  .action-text { font-size: 14px; color: #2b3a4a; line-height: 1.5; }
  .report-next-step { background: #eef0fe; border-radius: 16px; padding: 16px; margin-bottom: 20px; }
  .report-next-step h3 { font-size: 15px; font-weight: 700; color: #6366f1; margin-bottom: 8px; }
  .report-next-step p { font-size: 14px; color: #2b3a4a; line-height: 1.6; }
  .coach-restart-btn { width: 100%; padding: 14px; border-radius: 60px; border: 2px solid #6366f1; background: white; color: #6366f1; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 12px; }
  .coach-restart-btn:active { background: #eef0fe; }
  .report-impact-effort { background: #f0f9ff; border-radius: 16px; padding: 16px; margin-bottom: 20px; }
  .report-impact-effort h3 { font-size: 15px; font-weight: 700; color: #2b3a4a; margin-bottom: 12px; }
  .ie-item { font-size: 14px; color: #2b3a4a; margin-bottom: 8px; }
  .ie-tag { display: inline-block; padding: 2px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; margin-right: 8px; }
  .ie-p0 { background: #dcfce7; color: #166534; }
  .ie-p1 { background: #fef9c3; color: #854d0e; }
  .ie-p2 { background: #ede9fe; color: #6b21a8; }
  @keyframes msgIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  /* ===== 路线图折叠 + Checklist勾选（AI搭子专属互动）===== */
  .ai-stage { cursor: pointer; transition: transform 0.15s; }
  .ai-stage:active { transform: scale(0.98); }
  .ai-stage .ai-stage-arrow { float: right; color: #8f9eae; }
  .ai-stage.collapsed .ai-stage-body { display: none; }
  .ai-clk-item { font-size: 13px; color: #37474f; line-height: 1.6; padding: 9px 10px; border-radius: 12px; cursor: pointer; transition: background 0.15s; }
  .ai-clk-item:hover { background: #f5f5f7; }
  .ai-clk-item.done { color: #8f9eae; text-decoration: line-through; }
  .ai-clk-item .ai-clk-box { margin-right: 8px; }
"""
    assert '</style>' in s
    s = s.replace('</style>', coach_css + '</style>', 1)

    # ---- 1b. 教练HTML（插入 page-coach 顶部，原路线图内容保留在其后）----
    coach_html = """
    <!-- ===== 互动教练（麦肯锡式三步对话 · 点击开始）===== -->
    <div class="coach-intro" id="coachIntro">
      <div class="coach-intro-icon">🎓</div>
      <div class="coach-intro-title">麦肯锡风格AI能力教练</div>
      <div class="coach-intro-sub">用结构化思维，3步拆解AI学习卡点</div>
      <div class="coach-method-steps">
        <div class="method-step"><span class="step-num">①</span> 界定问题<br><span class="step-desc">明确核心卡点</span></div>
        <div class="method-step"><span class="step-num">②</span> 结构化分析<br><span class="step-desc">MECE拆解根因</span></div>
        <div class="method-step"><span class="step-num">③</span> 优先级行动<br><span class="step-desc">可执行的下一步</span></div>
      </div>
      <button class="coach-start-btn" onclick="startCoach()">开始深度对话 →</button>
      <div class="coach-intro-note">💡 免费版 · 纯前端模拟 · 麦肯锡方法论</div>
    </div>

    <div class="coach-chat" id="coachChat" style="display:none;">
      <div class="coach-progress-bar">
        <div class="progress-step active" id="progressStep1">① 界定问题</div>
        <div class="progress-step" id="progressStep2">② 结构化分析</div>
        <div class="progress-step" id="progressStep3">③ 优先级行动</div>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="coach-prompt" id="coachPrompt" style="display:none;">
        💡 请在下方输入框中回复...
      </div>
      <div class="chat-input-area" id="chatInputArea" style="display:none;">
        <textarea id="coachInput" placeholder="在这里输入你的回复..." rows="2"></textarea>
        <button class="chat-send-btn" onclick="sendCoachMsg()">发送</button>
      </div>
      <div class="coach-buttons" id="coachButtons" style="display:none;">
        <div class="coach-btn-prompt" id="coachBtnPrompt"></div>
        <div class="coach-btn-list" id="coachBtnList"></div>
      </div>
    </div>

    <div class="coach-report-mckinsey" id="coachReport" style="display:none;"></div>

    <!-- 下方为成长路线参考（点击各阶段可展开/收起，Checklist可勾选） -->
"""
    anchor = '<div id="page-coach" class="page">'
    assert anchor in s
    s = s.replace(anchor, anchor + '\n' + coach_html, 1)

    # ---- 1c. 路线图三阶段改为可点击折叠 ----
    stages = [
        ('<div style="background:#e8f5e9;border-radius:12px;padding:14px;margin-bottom:8px;">',
         '<div class="ai-stage" style="background:#e8f5e9;border-radius:12px;padding:14px;margin-bottom:8px;">',
         '<div style="font-weight:700;color:#2e7d32;margin-bottom:4px;">📌 第一阶段（1个月）</div>',
         '<div class="ai-stage-head" style="font-weight:700;color:#2e7d32;margin-bottom:4px;">📌 第一阶段（1个月） <span class="ai-stage-arrow">▾</span></div>'),
        ('<div style="background:#fff3e0;border-radius:12px;padding:14px;margin-bottom:8px;">',
         '<div class="ai-stage" style="background:#fff3e0;border-radius:12px;padding:14px;margin-bottom:8px;">',
         '<div style="font-weight:700;color:#e65100;margin-bottom:4px;">📌 第二阶段（2-3个月）</div>',
         '<div class="ai-stage-head" style="font-weight:700;color:#e65100;margin-bottom:4px;">📌 第二阶段（2-3个月） <span class="ai-stage-arrow">▾</span></div>'),
        ('<div style="background:#e8eaf6;border-radius:12px;padding:14px;">',
         '<div class="ai-stage" style="background:#e8eaf6;border-radius:12px;padding:14px;">',
         '<div style="font-weight:700;color:#3949ab;margin-bottom:4px;">📌 第三阶段（3-6个月）</div>',
         '<div class="ai-stage-head" style="font-weight:700;color:#3949ab;margin-bottom:4px;">📌 第三阶段（3-6个月） <span class="ai-stage-arrow">▾</span></div>'),
    ]
    for old_out, new_out, old_head, new_head in stages:
        assert old_out in s, 'stage outer not found: ' + old_out
        s = s.replace(old_out, new_out, 1)
        assert old_head in s, 'stage head not found: ' + old_head
        s = s.replace(old_head, new_head, 1)

    # 给三个阶段的正文 div 加 class="ai-stage-body"
    for old_body in [
        '<div style="font-size:13px;color:#37474f;line-height:1.6;">熟练使用3个核心AI工具解决日常问题',
        '<div style="font-size:13px;color:#37474f;line-height:1.6;">掌握Prompt工程+搭建AI工作流',
        '<div style="font-size:13px;color:#37474f;line-height:1.6;">把AI深度融入专业领域创造价值',
    ]:
        assert old_body in s, 'stage body not found: ' + old_body[:40]
        new_body = old_body.replace('<div ', '<div class="ai-stage-body" ', 1)
        s = s.replace(old_body, new_body, 1)

    # ---- 1d. Checklist 改为可点击勾选 ----
    old_cl = """      <div style="font-size:13px;color:#6c7a89;line-height:2;">
        ☐ 会用至少3个AI对话工具<br>
        ☐ 能写出结构化的Prompt<br>
        ☐ 会用AI进行信息搜索和分析<br>
        ☐ 了解AI Agent的基本概念<br>
        ☐ 至少搭建过一个AI工作流<br>
        ☐ 能把AI融入日常工作/学习<br>
        ☐ 持续关注AI领域动态
      </div>"""
    new_cl = """      <div id="aiClkList">
        <div class="ai-clk-item"><span class="ai-clk-box">☐</span>会用至少3个AI对话工具</div>
        <div class="ai-clk-item"><span class="ai-clk-box">☐</span>能写出结构化的Prompt</div>
        <div class="ai-clk-item"><span class="ai-clk-box">☐</span>会用AI进行信息搜索和分析</div>
        <div class="ai-clk-item"><span class="ai-clk-box">☐</span>了解AI Agent的基本概念</div>
        <div class="ai-clk-item"><span class="ai-clk-box">☐</span>至少搭建过一个AI工作流</div>
        <div class="ai-clk-item"><span class="ai-clk-box">☐</span>能把AI融入日常工作/学习</div>
        <div class="ai-clk-item"><span class="ai-clk-box">☐</span>持续关注AI领域动态</div>
      </div>
      <div style="font-size:12px;color:#8f9eae;margin-top:8px;">👆 点击条目勾选 · 已达成 <b id="aiClkCount" style="color:#6366f1;">0</b>/7 · 自动保存</div>"""
    assert old_cl in s, 'checklist not found'
    s = s.replace(old_cl, new_cl, 1)

    # ---- 1e. 引入教练JS ----
    assert '<script src="coach-AI能力.js"></script>' not in s
    s = s.replace('</body>', '<script src="coach-AI能力.js"></script>\n</body>', 1)

    write(f, s)
    print('[OK] patched', f)

# ============================================================
# Part 2: 其余11个搭子页注入「三阶段成长路线 + 基本功Checklist」
# ============================================================
PARTNERS = [
    # (file, key, name, accent, lightbg, stage-light-bgs, [(阶段标题, 正文), ...], [checklist...])
    dict(file='index.html', key='weight', name='减肥', accent='#66bb6a', bg='rgba(102,187,106,0.10)',
         stages=[
             ('第1个月 · 建立基础习惯', '规律三餐不节食，只在七八分饱时停筷<br>• 每天步行7000步起步，不追求强度<br>• 每周固定2次称重并记录，只记录不评价'),
             ('第2-3个月 · 饮食运动系统化', '学会看营养成分表，控制隐形热量<br>• 每周3次30分钟有氧 + 2次力量训练<br>• 睡眠保证7小时，睡前1小时不进食'),
             ('第4-6个月 · 维持与巩固', '加入力量训练，提升基础代谢<br>• 建立压力性进食的应对清单<br>• 设定体重反弹预警线（+3kg即干预）'),
         ],
         checks=['连续7天记录饮食', '每周运动≥3次', '会看营养成分表', '戒掉含糖饮料', '平均睡眠7小时以上', '体重稳定下降不反弹', '有一套自己的减脂餐模板']),
    dict(file='陪读妈妈搭子.html', key='peidu', name='陪读妈妈', accent='#4f8ef7', bg='rgba(79,142,247,0.10)',
         stages=[
             ('第1个月 · 先稳住自己', '每天写情绪日记，识别爆发触发点<br>• 每天留30分钟完全属于自己的时间<br>• 把"一次辅导只解决一个问题"设为底线'),
             ('第2-3个月 · 改善亲子沟通', '练习先倾听再建议，忍住不评判<br>• 用"我感到…我希望…"替代指责表达<br>• 与老师建立同盟，同步而非对立'),
             ('第4-6个月 · 共同成长', '从"盯作业"转向"教学习方法"<br>• 逐步放手，让孩子承担自然结果<br>• 重启自己的兴趣或事业，做孩子的榜样'),
         ],
         checks=['能觉察自己情绪爆发的信号', '每天有非学习话题的亲子对话', '冲突后能主动修复关系', '不拿孩子和别人比较', '每天有独处充电时间', '孩子会主动分享学校的事', '家庭有固定的轻松时刻']),
    dict(file='创业搭子.html', key='startup', name='创业', accent='#f97316', bg='rgba(249,115,22,0.10)',
         stages=[
             ('第1个月 · 验证方向', '深度访谈10个目标用户，只问不推<br>• 一句话讲清价值主张（给谁解决什么痛）<br>• 定义最小可行产品MVP范围，砍到不能再砍'),
             ('第2-3个月 · 跑通闭环', 'MVP上线，快速收集真实反馈<br>• 找到第一批愿意付费的用户<br>• 建立关键指标看板（留存/转化/复购）'),
             ('第4-6个月 · 复制增长', '验证至少一条可复制的获客渠道<br>• 搭建最小团队，明确分工与节奏<br>• 规划现金流转正路径，留足安全垫'),
         ],
         checks=['访谈过10个目标用户', '能一句话讲清产品价值', '有用户愿意付费', '每周看一次核心数据', '有明确的北极星指标', '现金流能支撑12个月', '团队分工清晰不重叠']),
    dict(file='搭子-P7-P8.html', key='p7p8', name='P7→P8晋升', accent='#8b5cf6', bg='rgba(139,92,246,0.10)',
         stages=[
             ('第1个月 · 建立战略视野', '从执行视角切换到业务视角看问题<br>• 拆解上级战略意图，主动对齐目标<br>• 建立2-3个高质量行业信息输入源'),
             ('第2-3个月 · 跨团队协同', '主导一次跨部门项目并拿到结果<br>• 经营横向影响力网络（非职权影响）<br>• 用数据和业务语言讲故事，不堆形容词'),
             ('第4-6个月 · 体系化影响力', '沉淀可复制的方法论并在内部宣讲<br>• 识别并培养能独当一面的接班人<br>• 在公司层面建立专业口碑与能见度'),
         ],
         checks=['能说清部门战略与自己的关系', '主导过跨部门项目', '每月有高质量行业输入', '有可复用的方法论沉淀', '带出过能独当一面的人', '汇报用数据不用形容词', '被其他团队主动求助过']),
    dict(file='搭子-业务Owner.html', key='owner', name='业务Owner', accent='#16a34a', bg='rgba(22,163,74,0.10)',
         stages=[
             ('第1个月 · 吃透客户价值', '访谈5个核心客户，听原话不做翻译<br>• 画出客户旅程地图，找到卡点环节<br>• 定义北极星指标，全员对齐'),
             ('第2-3个月 · 数据驱动迭代', '建立周数据复盘机制，用数据决策<br>• 用"假设-实验-验证"推进产品迭代<br>• 砍掉不创造客户价值的功能'),
             ('第4-6个月 · 带团队拿结果', '明确团队分工、目标与激励<br>• 建立跨团队协作SOP与接口人<br>• 做完整复盘，沉淀可迁移的方法'),
         ],
         checks=['访谈过5个真实客户', '有清晰的北极星指标', '每周看数据做决策', '砍掉过一个"好看没用"的功能', '团队目标人人清楚', '能协同3个以上团队', '做过完整复盘并沉淀文档']),
    dict(file='搭子-关系力修复-RESTORED.html', key='relation', name='关系力修炼', accent='#e05c97', bg='rgba(224,92,151,0.10)',
         stages=[
             ('第1个月 · 向内觉察', '记录情绪触发点，画出自己的"雷区图"<br>• 练习区分"事实"与"我的解读"<br>• 觉察自己在冲突中的沟通姿态'),
             ('第2-3个月 · 向外练习', '每天一次专注倾听，忍住不打断<br>• 用"我感受…我需要…"表达需求<br>• 练习温和而坚定地设立边界'),
             ('第4-6个月 · 关系升级', '主动修复一段重要的紧张关系<br>• 建立深度连接的日常仪式<br>• 从"求助者"成长为"支持者"'),
         ],
         checks=['能说出自己的情绪触发点', '倾听时能忍住不给建议', '会用"我感受…我需要…"表达', '拒绝过一次不合理请求', '修复过一段紧张关系', '每周有深度对话时刻', '社交后能量大于消耗']),
    dict(file='搭子-身体财富.html', key='body', name='身体财富', accent='#66bb6a', bg='rgba(102,187,106,0.10)',
         stages=[
             ('第1个月 · 动起来', '每天20分钟快走或拉伸，先建立频率<br>• 固定睡眠时间，误差不超过30分钟<br>• 每天喝够1500ml水，用手环/APP提醒'),
             ('第2-3个月 · 系统训练', '每周3次有氧 + 2次力量训练<br>• 学会基础拉伸与放松，练后必做<br>• 每周留1个恢复日，不硬撑'),
             ('第4-6个月 · 长期体质', '复查体检指标，对比基线看改善<br>• 加入运动社群或找固定运动搭子<br>• 把压力管理（呼吸/冥想）纳入日常'),
         ],
         checks=['每周运动≥3次', '平均睡眠7小时以上', '每天喝够1500ml水', '做过年度体检并读懂报告', '有固定运动搭子或社群', '掌握基础力量训练动作', '静息心率或体脂有改善']),
    dict(file='搭子-财务财富.html', key='finance', name='财务财富', accent='#f59e0b', bg='rgba(245,158,11,0.10)',
         stages=[
             ('第1个月 · 看清现状', '记录每一笔支出，坚持30天<br>• 盘点资产与负债，算清净资产<br>• 算出每月真实结余与储蓄率'),
             ('第2-3个月 · 建立系统', '发薪日自动转存，先储蓄后消费<br>• 建立3-6个月生活费的应急金<br>• 学会基础记账分类，月度回顾'),
             ('第4-6个月 · 让钱生钱', '开通指数基金定投，长期不中断<br>• 配置基础保障（医疗/意外/重疾）<br>• 建立个人年度财务复盘机制'),
         ],
         checks=['连续30天记账', '储蓄率≥20%', '有3-6个月应急金', '没有高息负债', '有指数基金定投', '配置了基础保障保险', '每月看一次财务报表']),
    dict(file='搭子-精神财富.html', key='spirit', name='精神财富', accent='#7c3aed', bg='rgba(124,58,237,0.10)',
         stages=[
             ('第1个月 · 安静下来', '每天10分钟冥想或静坐<br>• 睡前30分钟远离手机<br>• 每天记录3件值得感恩的小事'),
             ('第2-3个月 · 深度输入', '每月读完1本书并做结构化笔记<br>• 建立个人知识库（flomo/Notion均可）<br>• 找到一项能进入心流的活动'),
             ('第4-6个月 · 知行合一', '把所学输出：写作、分享或教别人<br>• 整理自己的原则清单（做人做事）<br>• 每月留半天独处思考，校准方向'),
         ],
         checks=['连续21天冥想或静坐', '每月读完1本书', '有自己的知识库系统', '每天记录感恩或复盘', '有能进入心流的爱好', '公开输出过内容', '有自己的原则清单']),
    dict(file='搭子-关系财富.html', key='family', name='关系财富', accent='#ec4899', bg='rgba(236,72,153,0.10)',
         stages=[
             ('第1个月 · 高质量陪伴', '每周一次不受打扰的家庭日<br>• 每天放下手机专注陪家人30分钟<br>• 记住重要的人的生日与纪念日'),
             ('第2-3个月 · 深度连接', '每月与一位重要的人深度对话<br>• 主动联系久未见面的老朋友<br>• 修复一段疏远或紧张的关系'),
             ('第4-6个月 · 爱的能力', '学会家人主要的"爱的语言"并实践<br>• 成为家族聚会的发起者与连接者<br>• 每月做一次不求回报的帮助'),
         ],
         checks=['每周有固定家庭日', '每天有专注陪伴时间', '记得重要家人的纪念日', '主动联系过久未见的朋友', '修复过一段疏远的关系', '知道家人的爱的语言', '每月有一次深度对话']),
    dict(file='搭子-使命财富.html', key='mission', name='使命财富', accent='#0ea5e9', bg='rgba(14,165,233,0.10)',
         stages=[
             ('第1个月 · 向内探索', '写下人生高光与低谷时刻，找规律<br>• 识别反复出现的核心价值观<br>• 做一次优势测评（如盖洛普）'),
             ('第2-3个月 · 定义使命', '写出一段个人使命宣言并打磨<br>• 设定3年愿景，画面越具体越好<br>• 找到使命与当下工作的连接点'),
             ('第4-6个月 · 付诸贡献', '每月做一次利他行动并记录感受<br>• 把使命融入日常工作的小选择<br>• 影响至少3个人共同行动'),
         ],
         checks=['写过个人使命宣言', '能说清自己的Top3价值观', '设定了3年愿景', '每月有利他行动', '工作和使命有连接点', '定期复盘人生方向', '影响过他人变得更好']),
]

def build_block(p):
    key, name, accent, bg = p['key'], p['name'], p['accent'], p['bg']
    n = len(p['checks'])
    stage_html = ''
    stage_bgs = ['#e8f5e9', '#fff3e0', '#e8eaf6']
    stage_colors = ['#2e7d32', '#e65100', '#3949ab']
    for i, (title, body) in enumerate(p['stages']):
        stage_html += (
            '    <div class="crp-stage" style="background:%s;">\n'
            '      <div class="crp-stage-head" style="color:%s;">📌 第%d阶段 · %s <span class="crp-arrow">▾</span></div>\n'
            '      <div class="crp-stage-body">%s</div>\n'
            '    </div>\n' % (stage_bgs[i], stage_colors[i], i + 1, title, body)
        )
    items_html = '\n'.join(
        '      <div class="crp-item"><span class="crp-box">☐</span>%s</div>' % c for c in p['checks']
    )
    js = """
  <script>
  (function(){
    var KEY='crp_checklist_%s';
    var wrap=document.getElementById('crpWrap_%s'); if(!wrap) return;
    wrap.querySelectorAll('.crp-stage').forEach(function(s){
      s.addEventListener('click',function(){
        s.classList.toggle('collapsed');
        var a=s.querySelector('.crp-arrow'); if(a) a.textContent=s.classList.contains('collapsed')?'▸':'▾';
      });
    });
    var items=wrap.querySelectorAll('.crp-item');
    var state={}; try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
    function render(){
      var d=0;
      items.forEach(function(it,i){
        var b=it.querySelector('.crp-box');
        if(state[i]){it.classList.add('done');b.textContent='☑';d++;}
        else{it.classList.remove('done');b.textContent='☐';}
      });
      var c=document.getElementById('crpCnt_%s'); if(c) c.textContent=d;
    }
    items.forEach(function(it,i){
      it.addEventListener('click',function(){
        state[i]=!state[i];
        try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}
        render();
      });
    });
    render();
  })();
  </script>""" % (key, key, key)
    block = """
<!-- ===== 成长路线 & 基本功 Checklist（参照AI搭子优化 · 可点击互动）===== -->
<div id="crpWrap_%s" class="crp-wrap" style="max-width:420px;margin:0 auto 4px;">
  <style>
    #crpWrap_%s .crp-card { background:#fff; border-radius:24px; padding:18px 16px; margin-bottom:14px; box-shadow:0 6px 18px rgba(0,0,0,0.05); }
    #crpWrap_%s .crp-title { font-size:15px; font-weight:800; color:#2b3a4a; margin-bottom:12px; }
    #crpWrap_%s .crp-tip { font-size:11px; font-weight:500; color:#8f9eae; margin-left:6px; }
    #crpWrap_%s .crp-stage { border-radius:14px; padding:12px 14px; margin-bottom:8px; cursor:pointer; transition:transform .15s; }
    #crpWrap_%s .crp-stage:active { transform:scale(.98); }
    #crpWrap_%s .crp-stage-head { font-weight:700; font-size:13px; }
    #crpWrap_%s .crp-arrow { float:right; color:#8f9eae; }
    #crpWrap_%s .crp-stage-body { font-size:13px; line-height:1.7; margin-top:6px; color:#37474f; }
    #crpWrap_%s .crp-stage.collapsed .crp-stage-body { display:none; }
    #crpWrap_%s .crp-item { font-size:13px; color:#37474f; line-height:1.6; padding:9px 10px; border-radius:12px; cursor:pointer; transition:background .15s; }
    #crpWrap_%s .crp-item:hover { background:#f5f5f7; }
    #crpWrap_%s .crp-item.done { color:#8f9eae; text-decoration:line-through; }
    #crpWrap_%s .crp-box { margin-right:8px; }
  </style>
  <div class="crp-card">
    <div class="crp-title">🗺️ %s三阶段成长路线<span class="crp-tip">👆 点击阶段展开/收起</span></div>
%s  </div>
  <div class="crp-card">
    <div class="crp-title">📋 %s基本功 Checklist<span class="crp-tip">👆 点击勾选 · 已达成 <b id="crpCnt_%s" style="color:%s;">0</b>/%d · 自动保存</span></div>
    <div>
%s
    </div>
  </div>%s
</div>
""" % ((key,) * 14 + (name, stage_html, name, key, accent, n, items_html, js))
    return block

def inject_partner(p):
    f = p['file']
    s = read(f)
    marker = '<!-- ===== 成长路线 & 基本功 Checklist（参照AI搭子优化 · 可点击互动）===== -->'
    if marker in s:
        print('[SKIP] already patched:', f)
        return
    block = build_block(p)
    if f == '搭子-业务Owner.html':
        anchor = '<div class="page" id="coachPage">'
        assert anchor in s, 'coachPage anchor not found in ' + f
        s = s.replace(anchor, anchor + '\n' + block, 1)
    else:
        anchor = '<div class="coach-intro" id="coachIntro">'
        assert anchor in s, 'coachIntro anchor not found in ' + f
        s = s.replace(anchor, block + '\n    ' + anchor, 1)
    write(f, s)
    print('[OK] patched', f)

if __name__ == '__main__':
    patch_ai()
    for p in PARTNERS:
        inject_partner(p)
    print('ALL DONE')
