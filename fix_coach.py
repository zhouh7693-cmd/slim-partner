import re

# ===== 1. P7-P8：清除旧教练JS，添加新JS引用 =====
with open('搭子-P7-P8.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 删除 COACH_QS_P7 数组
c = re.sub(r'var COACH_QS_P7\s*=\s*\[.*?\];', '', c, flags=re.DOTALL)
# 删除 coachStateP7
c = re.sub(r'var coachStateP7\s*=\s*\{.*?\};', '', c, flags=re.DOTALL)
# 删除 initCoach 函数
c = re.sub(r'function initCoach\(\)\s*\{.*?\n\}', '', c, flags=re.DOTALL)
# 删除注释行
c = re.sub(r'// ==.*?教练.*?\n', '', c)
# 添加 script 标签（在 </body> 前）
if '<script src="coach-P7-P8.js"></script>' not in c:
    c = c.replace('</body>', '<script src="coach-P7-P8.js"></script>\n</body>')

with open('搭子-P7-P8.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('P7-P8 处理完成')

# ===== 2. 业务Owner：添加教练CSS + 替换教练页面HTML + 添加JS引用 =====
with open('搭子-业务Owner.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 添加教练CSS（绿色主题 #16a34a）
coach_css = """
  /* ===== 教练页面（麦肯锡风格） ===== */
  .coach-intro { background: white; border-radius: 32px; padding: 32px 24px; margin-bottom: 16px; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .coach-intro-icon { font-size: 56px; margin-bottom: 16px; }
  .coach-intro-title { font-size: 22px; font-weight: 800; background: linear-gradient(135deg, #16a34a, #15803d); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 8px; }
  .coach-intro-sub { font-size: 14px; color: #6c7a89; margin-bottom: 24px; }
  .coach-method-steps { display: flex; gap: 12px; margin-bottom: 28px; }
  .method-step { flex: 1; background: #f0fdf4; border-radius: 16px; padding: 14px 8px; font-size: 13px; font-weight: 700; color: #16a34a; line-height: 1.5; }
  .step-num { display: block; font-size: 20px; margin-bottom: 4px; }
  .step-desc { font-size: 11px; font-weight: 500; color: #15803d; }
  .coach-intro-note { font-size: 11px; color: #8f9eae; margin-top: 16px; }
  .coach-start-btn { margin-top: 18px; width: 100%; padding: 14px; border-radius: 60px; border: none; background: linear-gradient(135deg, #16a34a, #15803d); color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.15s; }
  .coach-start-btn:active { transform: scale(0.97); }
  .coach-chat { background: white; border-radius: 32px; padding: 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .coach-progress-bar { display: flex; gap: 8px; margin-bottom: 20px; }
  .progress-step { flex: 1; text-align: center; font-size: 11px; font-weight: 700; color: #8f9eae; padding: 8px 4px; border-radius: 12px; background: #f5f5f5; transition: all 0.3s; line-height: 1.4; }
  .progress-step.active { background: #f0fdf4; color: #16a34a; }
  .chat-messages { max-height: 380px; overflow-y: auto; margin-bottom: 16px; padding: 8px; }
  .chat-msg { margin-bottom: 16px; animation: msgIn 0.3s ease; }
  .chat-msg.coach { display: flex; gap: 8px; align-items: flex-start; }
  .chat-msg.user { display: flex; gap: 8px; align-items: flex-start; flex-direction: row-reverse; }
  .chat-avatar { font-size: 28px; flex-shrink: 0; }
  .chat-bubble { max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.6; color: #2b3a4a; }
  .chat-msg.coach .chat-bubble { background: #f0fdf4; border-radius: 18px 18px 18px 4px; }
  .chat-msg.user .chat-bubble { background: linear-gradient(135deg, #16a34a, #15803d); color: white; border-radius: 18px 18px 4px 18px; }
  .chat-input-area { display: flex; gap: 8px; align-items: flex-end; }
  .chat-input-area textarea { flex: 1; padding: 12px 16px; border-radius: 16px; border: 1.5px solid #e9edf2; font-size: 14px; resize: none; outline: none; font-family: inherit; min-height: 44px; }
  .chat-send-btn { padding: 12px 20px; border-radius: 16px; border: none; background: linear-gradient(135deg, #16a34a, #15803d); color: white; font-size: 14px; font-weight: 700; cursor: pointer; flex-shrink: 0; }
  .chat-send-btn:active { transform: scale(0.97); }
  .coach-prompt { text-align: center; color: #16a34a; font-size: 13px; font-weight: 600; padding: 8px; animation: coachPulse 2s infinite; }
  @keyframes coachPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .generating-report { text-align: center; color: #0891b2; font-size: 14px; font-weight: 600; padding: 16px; animation: coachBlink 1.5s infinite; }
  @keyframes coachBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .coach-buttons { padding: 12px 16px; background: #fafafa; border-top: 1px solid #e5e7eb; }
  .coach-btn-prompt { font-size: 13px; color: #6b7280; margin-bottom: 10px; text-align: center; }
  .coach-btn-list { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .coach-choice-btn { flex: 1; min-width: 120px; max-width: 180px; padding: 12px 16px; border: 2px solid #16a34a; background: white; color: #16a34a; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .coach-choice-btn:hover { background: #16a34a; color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(22,163,74,0.3); }
  .coach-report-mckinsey { background: white; border-radius: 32px; padding: 28px 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .report-header { text-align: center; margin-bottom: 24px; }
  .report-icon { font-size: 48px; margin-bottom: 12px; }
  .report-title { font-size: 20px; font-weight: 800; color: #2b3a4a; margin-bottom: 4px; }
  .report-subtitle { font-size: 12px; color: #8f9eae; }
  .report-core-conclusion { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 20px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #16a34a; }
  .report-core-conclusion h3 { font-size: 15px; font-weight: 700; color: #16a34a; margin-bottom: 8px; }
  .report-core-conclusion p { font-size: 14px; color: #2b3a4a; line-height: 1.6; }
  .report-mece-analysis { margin-bottom: 20px; }
  .report-mece-analysis h3 { font-size: 15px; font-weight: 700; color: #2b3a4a; margin-bottom: 12px; }
  .mece-dimension { background: #f0fdf4; border-radius: 16px; padding: 14px; margin-bottom: 10px; }
  .mece-dim-title { font-size: 14px; font-weight: 700; color: #16a34a; margin-bottom: 6px; }
  .mece-dim-desc { font-size: 13px; color: #6c7a89; line-height: 1.5; }
  .report-priority-actions { margin-bottom: 20px; }
  .report-priority-actions h3 { font-size: 15px; font-weight: 700; color: #2b3a4a; margin-bottom: 12px; }
  .action-item { background: white; border-radius: 16px; padding: 14px; margin-bottom: 8px; border-left: 4px solid #16a34a; }
  .action-priority { font-size: 11px; font-weight: 700; color: #16a34a; margin-bottom: 4px; }
  .action-text { font-size: 14px; color: #2b3a4a; line-height: 1.5; }
  .report-next-step { background: #f0fdf4; border-radius: 16px; padding: 16px; margin-bottom: 20px; }
  .report-next-step h3 { font-size: 15px; font-weight: 700; color: #16a34a; margin-bottom: 8px; }
  .report-next-step p { font-size: 14px; color: #2b3a4a; line-height: 1.6; }
  .coach-restart-btn { width: 100%; padding: 14px; border-radius: 60px; border: 2px solid #16a34a; background: white; color: #16a34a; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 12px; }
  .coach-restart-btn:active { background: #f0fdf4; }
  @keyframes msgIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
"""
if '</style>' in c and coach_css.strip() not in c:
    c = c.replace('</style>', coach_css + '\n  </style>')

# 替换教练页面 HTML
old_coach_html = '''<!-- ===== 教练页面 ===== -->\n<div class="page" id="coachPage" style="display:none;">\n  <div class="coach-container" id="coachChat">\n    <div class="chat-messages" id="chatMessages"></div>\n    <div class="coach-progress-bar" id="coachProgressBar" style="display:none;"><div class="coach-progress-fill" id="coachProgressFill"></div></div>\n    <div class="chat-input-area" id="chatInputArea" style="display:none;">\n      <input class="chat-input" id="coachInput" placeholder="输入你的回答..." onkeydown="if(event.key===\'Enter\')sendCoachMsg()">\n      <button class="chat-send-btn" onclick="sendCoachMsg()">发送</button>\n    </div>\n  </div>\n  <div class="coach-report" id="coachReport" style="display:none;"></div>\n</div>'''

new_coach_html = '''<!-- ===== 教练页面（麦肯锡风格） ===== -->\n<div class="page" id="coachPage" style="display:none;">\n  <div class="coach-page" id="coachPageContent">\n    <!-- 教练介绍页 -->\n    <div class="coach-intro" id="coachIntro">\n      <div class="coach-intro-icon">🎓</div>\n      <div class="coach-intro-title">麦肯锡风格业务Owner教练</div>\n      <div class="coach-intro-sub">用结构化思维，3步搞定业务难题</div>\n      <div class="coach-method-steps">\n        <div class="method-step"><span class="step-num">①</span> 界定问题<br><span class="step-desc">明确核心冲突</span></div>\n        <div class="method-step"><span class="step-num">②</span> 结构化分析<br><span class="step-desc">MECE拆解根因</span></div>\n        <div class="method-step"><span class="step-num">③</span> 优先级行动<br><span class="step-desc">可执行的下一步</span></div>\n      </div>\n      <button class="coach-start-btn" onclick="startCoachOwner()">开始深度对话 →</button>\n      <div class="coach-intro-note">💡 免费版 · 纯前端模拟 · 麦肯锡方法论</div>\n    </div>\n    <!-- 对话界面 -->\n    <div class="coach-chat" id="coachChat" style="display:none;">\n      <div class="coach-progress-bar">\n        <div class="progress-step active" id="progressStep1">① 界定问题</div>\n        <div class="progress-step" id="progressStep2">② 结构化分析</div>\n        <div class="progress-step" id="progressStep3">③ 优先级行动</div>\n      </div>\n      <div class="chat-messages" id="chatMessages"></div>\n      <div class="coach-prompt" id="coachPrompt" style="display:none;">\n        💡 请在下方输入框中回复...\n      </div>\n      <div class="chat-input-area" id="chatInputArea">\n        <textarea id="coachInput" placeholder="在这里输入你的回复..." rows="2"></textarea>\n        <button class="chat-send-btn" onclick="sendCoachMsgOwner()">发送</button>\n      </div>\n      <div class="coach-buttons" id="coachButtons" style="display:none;">\n        <div class="coach-btn-prompt" id="coachBtnPrompt"></div>\n        <div class="coach-btn-list" id="coachBtnList"></div>\n      </div>\n    </div>\n    <!-- 诊断报告页 -->\n    <div class="coach-report-mckinsey" id="coachReport" style="display:none;">\n      <div class="report-header">\n        <div class="report-icon">📊</div>\n        <div class="report-title">麦肯锡风格业务Owner诊断报告</div>\n        <div class="report-subtitle">基于结构化分析框架 · MECE原则 · 行动导向</div>\n      </div>\n      <div class="report-core-conclusion" id="reportCoreConclusion"></div>\n      <div class="report-mece-analysis" id="reportMECE"></div>\n      <div class="report-priority-actions" id="reportActions"></div>\n      <div class="report-next-step" id="reportNextStep"></div>\n      <button class="coach-restart-btn" onclick="restartCoachOwner()">🔄 重新对话</button>\n    </div>\n  </div>\n</div>'''

if old_coach_html in c:
    c = c.replace(old_coach_html, new_coach_html)
    print('业务Owner 教练HTML已替换')
else:
    print('WARNING: 业务Owner 旧教练HTML未找到')

# 删除旧教练JS
c = re.sub(r'var COACH_QS_OWNER\s*=\s*\[.*?\];', '', c, flags=re.DOTALL)
c = re.sub(r'var coachStateOwner\s*=\s*\{.*?\};', '', c, flags=re.DOTALL)
c = re.sub(r'function startCoachDialogOwner\(\)\s*\{.*?\n\}', '', c, flags=re.DOTALL)
c = re.sub(r'function showCoachBubbleOwner\(.*?\n\}', '', c, flags=re.DOTALL)
c = re.sub(r'function sendCoachMsg\(\)\s*\{.*?\n\}', '', c, flags=re.DOTALL)
c = re.sub(r'function showCoachReportOwner\(\)\s*\{.*?\n\}', '', c, flags=re.DOTALL)
# 添加 script 标签
if '<script src="coach-业务Owner.js"></script>' not in c:
    c = c.replace('</body>', '<script src="coach-业务Owner.js"></script>\n</body>')

with open('搭子-业务Owner.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('业务Owner 处理完成')
