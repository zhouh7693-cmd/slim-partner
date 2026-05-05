#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复教练HTML ID问题，并为缺失的文件创建coach JS"""

import os

BASE = r'c:\Users\walds\WorkBuddy\Claw\slim-checkin'

# 1. 修复搭子-精神财富.html 的 coach 区域 ID
f = os.path.join(BASE, '搭子-精神财富.html')
with open(f, 'r', encoding='utf-8') as fh:
    c = fh.read()

# 替换 coach 区域
old_chat = '''    <div id="coachChatArea" class="coach-chat" style="display:none;">
      <div class="coach-progress-bar" id="coachProgressBar"></div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-input-area" id="coachInputArea" style="display:flex;">
        <textarea id="coachInput" placeholder="输入你的想法…" rows="1"></textarea>
        <button class="chat-send-btn" onclick="sendCoachMessage()">发送</button>
      </div>
      <div class="coach-prompt" id="coachPrompt" style="display:none;"></div>
      <div class="coach-buttons" id="coachButtons" style="display:none;"></div>
      <div class="generating-report" id="generatingReport" style="display:none;">📊 正在生成麦肯锡式行动报告…</div>
      <div id="coachReportArea" style="display:none;"></div>
    </div>'''

new_chat = '''    <div id="coachChat" class="coach-chat" style="display:none;">
      <div class="coach-progress-bar" id="coachProgressBar"></div>
      <div class="chat-messages" id="chatMessages"></div>
      <div id="chatInputArea" class="chat-input-area" style="display:flex;">
        <textarea id="coachInput" placeholder="输入你的想法…" rows="1"></textarea>
        <button class="chat-send-btn" onclick="sendCoachMsg()">发送</button>
      </div>
      <div class="coach-prompt" id="coachPrompt" style="display:none;"></div>
      <div id="coachButtons" class="coach-buttons" style="display:none;">
        <div class="coach-btn-prompt" id="coachBtnPrompt"></div>
        <div class="coach-btn-list" id="coachBtnList"></div>
      </div>
      <div class="generating-report" id="generatingReport" style="display:none;">📊 正在生成麦肯锡式行动报告…</div>
    </div>
    <div id="coachReport" class="coach-report-mckinsey" style="display:none;"></div>'''

if old_chat in c:
    c = c.replace(old_chat, new_chat)
    with open(f, 'w', encoding='utf-8') as fh:
        fh.write(c)
    print('✅ 修复了 搭子-精神财富.html 的 coach ID')
else:
    print('❌ 搭子-精神财富.html 未找到目标字符串，跳过')
    # 尝试更宽松的匹配
    import re
    # 替换 id="coachChatArea" → id="coachChat"
    c2 = c.replace('id="coachChatArea"', 'id="coachChat"')
    c2 = c2.replace('id="chatMessages"', 'id="chatMessages"')  # 保持不变
    c2 = c2.replace('id="coachInputArea"', 'id="chatInputArea"')
    c2 = c2.replace('onclick="sendCoachMessage()"', 'onclick="sendCoachMsg()"')
    c2 = c2.replace('id="coachReportArea"', 'id="coachReport"')
    c2 = c2.replace('</div>\n    </div>\n  </div>\n\n  <script src="coach-精神财富.js">', '</div>\n    </div>\n    <div id="coachReport" class="coach-report-mckinsey" style="display:none;"></div>\n  </div>\n\n  <script src="coach-精神财富.js">')
    if c2 != c:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(c2)
        print('✅ 用宽松匹配修复了 搭子-精神财富.html')
    else:
        print('❌ 无法修复')

print('Done.')
