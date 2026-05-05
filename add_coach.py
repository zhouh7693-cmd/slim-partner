#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""为搭子页面添加教练功能（麦肯锡风格深度对话教练）"""

import re
import sys

def add_coach_to_file(filepath, theme_color, theme_color_dark, page_title, coach_name, dialog_config_js):
    """
    为指定的HTML文件添加教练功能
    
    Args:
        filepath: HTML文件路径
        theme_color: 主题色（如 #ff6b35）
        theme_color_dark: 主题色深色（如 #e65100）
        page_title: 页面标题（如 "创业搭子"）
        coach_name: 教练名称（如 "麦肯锡风格创业教练"）
        dialog_config_js: COACH_MCKINSEY_CONFIG 的JS代码字符串
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 在 </style> 之前插入教练CSS
    coach_css = f"""
    /* ── 教练Tab（麦肯锡风格） ── */
    .coach-page {{ max-width: 420px; margin: 0 auto; }}

    /* 教练介绍页 */
    .coach-intro {{ background: white; border-radius: 32px; padding: 32px 24px; margin-bottom: 16px; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }}
    .coach-intro-icon {{ font-size: 56px; margin-bottom: 16px; }}
    .coach-intro-title {{ font-size: 22px; font-weight: 800; background: linear-gradient(135deg, {theme_color}, {theme_color_dark}); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 8px; }}
    .coach-intro-sub {{ font-size: 14px; color: #6c7a89; margin-bottom: 24px; }}
    .coach-method-steps {{ display: flex; gap: 12px; margin-bottom: 28px; }}
    .method-step {{ flex: 1; background: #fff8f0; border-radius: 16px; padding: 14px 8px; font-size: 13px; font-weight: 700; color: {theme_color}; line-height: 1.5; }}
    .step-num {{ display: block; font-size: 20px; margin-bottom: 4px; }}
    .step-desc {{ font-size: 11px; font-weight: 500; color: {theme_color_dark}; }}
    .coach-intro-note {{ font-size: 11px; color: #8f9eae; margin-top: 16px; }}
    .coach-start-btn {{ margin-top: 18px; width: 100%; padding: 14px; border-radius: 60px; border: none; background: linear-gradient(135deg, {theme_color}, {theme_color_dark}); color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.15s; }}
    .coach-start-btn:active {{ transform: scale(0.97); }}

    /* 对话界面 */
    .coach-chat {{ background: white; border-radius: 32px; padding: 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }}
    .coach-progress-bar {{ display: flex; gap: 8px; margin-bottom: 20px; }}
    .progress-step {{ flex: 1; text-align: center; font-size: 11px; font-weight: 700; color: #8f9eae; padding: 8px 4px; border-radius: 12px; background: #f5f5f5; transition: all 0.3s; line-height: 1.4; }}
    .progress-step.active {{ background: #fff8f0; color: {theme_color}; }}
    .chat-messages {{ max-height: 380px; overflow-y: auto; margin-bottom: 16px; padding: 8px; }}
    .chat-msg {{ margin-bottom: 16px; animation: msgIn 0.3s ease; }}
    .chat-msg.coach {{ display: flex; gap: 8px; align-items: flex-start; }}
    .chat-msg.user {{ display: flex; gap: 8px; align-items: flex-start; flex-direction: row-reverse; }}
    .chat-avatar {{ font-size: 28px; flex-shrink: 0; }}
    .chat-bubble {{ max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.6; color: #2b3a4a; }}
    .chat-msg.coach .chat-bubble {{ background: #fff8f0; border-radius: 18px 18px 18px 4px; }}
    .chat-msg.user .chat-bubble {{ background: linear-gradient(135deg, {theme_color}, {theme_color_dark}); color: white; border-radius: 18px 18px 4px 18px; }}
    .chat-input-area {{ display: flex; gap: 8px; align-items: flex-end; }}
    .chat-input-area textarea {{ flex: 1; padding: 12px 16px; border-radius: 16px; border: 1.5px solid #e9edf2; font-size: 14px; resize: none; outline: none; font-family: inherit; min-height: 44px; }}
    .chat-send-btn {{ padding: 12px 20px; border-radius: 16px; border: none; background: linear-gradient(135deg, {theme_color}, {theme_color_dark}); color: white; font-size: 14px; font-weight: 700; cursor: pointer; flex-shrink: 0; }}
    .chat-send-btn:active {{ transform: scale(0.97); }}
    .coach-prompt {{ text-align: center; color: {theme_color}; font-size: 13px; font-weight: 600; padding: 8px; animation: pulse 2s infinite; }}
    @keyframes pulse {{ 0%,100% {{ opacity: 1; }} 50% {{ opacity: 0.5; }} }}
    .generating-report {{ text-align: center; color: #0891b2; font-size: 14px; font-weight: 600; padding: 16px; animation: blink 1.5s infinite; }}
    @keyframes blink {{ 0%,100% {{ opacity: 1; }} 50% {{ opacity: 0.3; }} }}
    /* 按钮式问答样式 */
    .coach-buttons {{ padding: 12px 16px; background: #fafafa; border-top: 1px solid #e5e7eb; }}
    .coach-btn-prompt {{ font-size: 13px; color: #6b7280; margin-bottom: 10px; text-align: center; }}
    .coach-btn-list {{ display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }}
    .coach-choice-btn {{ flex: 1; min-width: 120px; max-width: 180px; padding: 12px 16px; border: 2px solid {theme_color}; background: white; color: {theme_color}; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }}
    .coach-choice-btn:hover {{ background: {theme_color}; color: white; transform: translateY(-2px); box-shadow: 0 4px 12px {theme_color}44; }}
    .coach-choice-btn.yes {{ border-color: #22c55e; color: #22c55e; }}
    .coach-choice-btn.yes:hover {{ background: #22c55e; color: white; box-shadow: 0 4px 12px rgba(34,197,94,0.3); }}
    .coach-choice-btn.no {{ border-color: #ef4444; color: #ef4444; }}
    .coach-choice-btn.no:hover {{ background: #ef4444; color: white; box-shadow: 0 4px 12px rgba(239,68,68,0.3); }}

    /* 麦肯锡诊断报告 */
    .coach-report-mckinsey {{ background: white; border-radius: 32px; padding: 28px 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }}
    .report-header {{ text-align: center; margin-bottom: 24px; }}
    .report-icon {{ font-size: 48px; margin-bottom: 12px; }}
    .report-title {{ font-size: 20px; font-weight: 800; color: #2b3a4a; margin-bottom: 4px; }}
    .report-subtitle {{ font-size: 12px; color: #8f9eae; }}
    .report-core-conclusion {{ background: linear-gradient(135deg, #fff8f0, #fff4ec); border-radius: 20px; padding: 20px; margin-bottom: 20px; border-left: 4px solid {theme_color}; }}
    .report-core-conclusion h3 {{ font-size: 15px; font-weight: 700; color: {theme_color}; margin-bottom: 8px; }}
    .report-core-conclusion p {{ font-size: 14px; color: #2b3a4a; line-height: 1.6; }}
    .report-mece-analysis {{ margin-bottom: 20px; }}
    .report-mece-analysis h3 {{ font-size: 15px; font-weight: 700; color: #2b3a4a; margin-bottom: 12px; }}
    .mece-dimension {{ background: #fdf6f0; border-radius: 16px; padding: 14px; margin-bottom: 10px; }}
    .mece-dim-title {{ font-size: 14px; font-weight: 700; color: {theme_color}; margin-bottom: 6px; }}
    .mece-dim-score {{ font-size: 12px; color: #8f9eae; margin-bottom: 6px; }}
    .mece-dim-desc {{ font-size: 13px; color: #6c7a89; line-height: 1.5; }}
    .report-priority-actions {{ margin-bottom: 20px; }}
    .report-priority-actions h3 {{ font-size: 15px; font-weight: 700; color: #2b3a4a; margin-bottom: 12px; }}
    .action-item {{ background: white; border-radius: 16px; padding: 14px; margin-bottom: 8px; border-left: 4px solid {theme_color}; }}
    .action-priority {{ font-size: 11px; font-weight: 700; color: {theme_color}; margin-bottom: 4px; }}
    .action-text {{ font-size: 14px; color: #2b3a4a; line-height: 1.5; }}
    .report-next-step {{ background: #fff8f0; border-radius: 16px; padding: 16px; margin-bottom: 20px; }}
    .report-next-step h3 {{ font-size: 15px; font-weight: 700; color: {theme_color}; margin-bottom: 8px; }}
    .report-next-step p {{ font-size: 14px; color: #2b3a4a; line-height: 1.6; }}
    .coach-restart-btn {{ width: 100%; padding: 14px; border-radius: 60px; border: 2px solid {theme_color}; background: white; color: {theme_color}; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 12px; }}
    .coach-restart-btn:active {{ background: #fff8f0; }}
    .report-impact-effort {{ background: #f0f9ff; border-radius: 16px; padding: 16px; margin-bottom: 20px; }}
    .report-impact-effort h3 {{ font-size: 15px; font-weight: 700; color: #2b3a4a; margin-bottom: 12px; }}
    .ie-item {{ font-size: 14px; color: #2b3a4a; margin-bottom: 8px; }}
    .ie-tag {{ display: inline-block; padding: 2px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; margin-right: 8px; }}
    .ie-p0 {{ background: #dcfce7; color: #166534; }}
    .ie-p1 {{ background: #fef9c3; color: #854d0e; }}
    .ie-p2 {{ background: #ede9fe; color: #6b21a8; }}

    @keyframes msgIn {{ from {{ opacity: 0; transform: translateY(10px); }} to {{ opacity: 1; transform: translateY(0); }} }}
    """
    
    # 在 </style> 之前插入CSS
    content = content.replace('  </style>', coach_css + '  </style>', 1)
    
    # 2. 在页面容器中添加教练页面HTML（在 </body> 之前）
    coach_html = f"""
<!-- 教练页 · 麦肯锡风格深度对话教练 -->
<div class="page" id="coachPage">
  <div class="coach-page" id="coachPageContent">
    <!-- 教练介绍页 -->
    <div class="coach-intro" id="coachIntro">
      <div class="coach-intro-icon">🎓</div>
      <div class="coach-intro-title">{coach_name}</div>
      <div class="coach-intro-sub">用结构化思维，3步搞定{page_title}难题</div>
      <div class="coach-method-steps">
        <div class="method-step"><span class="step-num">①</span> 界定问题<br><span class="step-desc">明确核心冲突</span></div>
        <div class="method-step"><span class="step-num">②</span> 结构化分析<br><span class="step-desc">MECE拆解根因</span></div>
        <div class="method-step"><span class="step-num">③</span> 优先级行动<br><span class="step-desc">可执行的下一步</span></div>
      </div>
      <button class="coach-start-btn" onclick="startCoach()">开始深度对话 →</button>
      <div class="coach-intro-note">💡 免费版 · 纯前端模拟 · 麦肯锡方法论</div>
    </div>

    <!-- 对话界面 -->
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
      <div class="chat-input-area" id="chatInputArea">
        <textarea id="coachInput" placeholder="在这里输入你的回复..." rows="2"></textarea>
        <button class="chat-send-btn" onclick="sendCoachMsg()">发送</button>
      </div>
      <!-- 按钮式问答容器 -->
      <div class="coach-buttons" id="coachButtons" style="display:none;">
        <div class="coach-btn-prompt" id="coachBtnPrompt"></div>
        <div class="coach-btn-list" id="coachBtnList"></div>
      </div>
    </div>

    <!-- 诊断报告页 -->
    <div class="coach-report-mckinsey" id="coachReport" style="display:none;">
      <div class="report-header">
        <div class="report-icon">📊</div>
        <div class="report-title">{coach_name}诊断报告</div>
        <div class="report-subtitle">基于结构化分析框架 · MECE原则 · 行动导向</div>
      </div>
      <div class="report-core-conclusion" id="reportCoreConclusion"></div>
      <div class="report-mece-analysis" id="reportMECE"></div>
      <div class="report-priority-actions" id="reportActions"></div>
      <div class="report-next-step" id="reportNextStep"></div>
      <button class="coach-restart-btn" onclick="restartCoach()">🔄 重新对话</button>
    </div>
  </div>
</div>
"""
    
    # 在 </body> 之前插入教练HTML
    content = content.replace('</body>', coach_html + '</body>', 1)
    
    # 3. 在Tab Bar中添加教练tab（在最后一个tab之后，在 </div> 之前）
    # 需要找到Tab Bar的结构并添加教练tab
    # 匹配模式：<div class="tab-item" onclick="switchTab('share')">...</div>\n  </div>
    # 替换为：... + 教练tab + </div>
    coach_tab = f"""
  <div class="tab-item" onclick="switchTab('coach')">
    <div class="tab-icon">🎓</div><div class="tab-label">教练</div>
  </div>
"""
    # 使用正则匹配最后一个tab-item之后的</div>（Tab Bar的结束标签）
    # 更简单的方法：匹配 "出发" 或 "share" 的tab，在其后插入
    tab_pattern = r"(<div class=\"tab-item\" onclick=\"switchTab\('share'\)\">[\s\S]*?</div>\n  </div>)"
    tab_replacement = r"\1" + coach_tab + "  </div>"
    content = re.sub(tab_pattern, tab_replacement, content, count=1)
    
    # 4. 在 </script> 之前插入教练JS函数和变量
    coach_js = f"""
// ===== 教练功能（麦肯锡风格深度对话） =====
let coachStep = '';       // 当前步骤：define / analyze / act / report
let coachSubStep = 0;    // 当前子步骤索引
let pendingNextStep = null; // 待应用的下一步（防止步骤推进bug）
let pendingNextSub = 0;
let chatHistory = [];     // 对话历史
let userInputs = {{}};      // 用户在各步骤的输入

function startCoach() {{
  coachStep = 'define';
  coachSubStep = 0;
  chatHistory = [];
  userInputs = {{}};
  document.getElementById('coachIntro').style.display = 'none';
  document.getElementById('coachChat').style.display = 'block';
  document.getElementById('coachReport').style.display = 'none';
  updateProgressBar();
  // 发送教练第一条消息
  const firstMsg = COACH_MCKINSEY_CONFIG.dialogTree.define[0].coach;
  addChatMessage('coach', firstMsg);
}}

function updateProgressBar() {{
  const steps = ['define', 'analyze', 'act'];
  steps.forEach((s, i) => {{
    const el = document.getElementById(`progressStep${{i+1}}`);
    if (!el) return;
    if (coachStep === s) {{ el.classList.add('active'); }}
    else {{ el.classList.remove('active'); }}
  }});
}}

function addChatMessage(role, text) {{
  const container = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${{role}}`;
  const avatar = role === 'coach' ? '🎓' : '🧑';
  msgDiv.innerHTML = `
    <div class="chat-avatar">${{avatar}}</div>
    <div class="chat-bubble">${{text.replace(/\\n/g, '<br>')}}</div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  // 记录历史
  chatHistory.push({{ role, text }});
  // 如果是教练消息
  if (role === 'coach') {{
    // 检查是否是"生成报告中"的消息
    if (text.includes('生成报告') || text.includes('正在为你')) {{
      // 隐藏输入框和按钮，显示"生成中"提示
      document.getElementById('chatInputArea').style.display = 'none';
      document.getElementById('coachButtons').style.display = 'none';
      document.getElementById('coachPrompt').style.display = 'none';
      // 显示生成提示
      const generatingMsg = document.createElement('div');
      generatingMsg.id = 'generatingReport';
      generatingMsg.className = 'generating-report';
      generatingMsg.innerHTML = '⏳ 正在生成MECE诊断报告，请稍候...';
      document.getElementById('coachChat').appendChild(generatingMsg);
    }} else {{
      // 获取当前节点，检查是否有按钮配置
      const tree = COACH_MCKINSEY_CONFIG.dialogTree[coachStep];
      const currentNode = tree ? tree[coachSubStep] : null;
      if (currentNode && currentNode.buttons && currentNode.buttons.length > 0) {{
        // 显示按钮，隐藏输入框
        showCoachButtons(currentNode.buttons);
      }} else {{
        // 显示输入框，隐藏按钮
        document.getElementById('chatInputArea').style.display = 'flex';
        document.getElementById('coachButtons').style.display = 'none';
        document.getElementById('coachPrompt').style.display = 'block';
        document.getElementById('coachInput').focus();
      }}
    }}
  }}
}}

// 显示教练按钮
function showCoachButtons(buttons) {{
  const container = document.getElementById('coachButtons');
  const btnList = document.getElementById('coachBtnList');
  const btnPrompt = document.getElementById('coachBtnPrompt');
  btnPrompt.textContent = '请选择：';
  btnList.innerHTML = '';
  buttons.forEach(btn => {{
    const btnEl = document.createElement('button');
    btnEl.className = `coach-choice-btn ${{btn.style || ''}}`;
    btnEl.textContent = btn.label;
    btnEl.onclick = () => handleCoachButtonClick(btn.value, btn.label);
    btnList.appendChild(btnEl);
  }});
  container.style.display = 'block';
  document.getElementById('chatInputArea').style.display = 'none';
  document.getElementById('coachPrompt').style.display = 'none';
}}

// 处理按钮点击
function handleCoachButtonClick(value, label) {{
  // 显示用户选择的按钮
  addChatMessage('user', label);
  // 保存用户输入
  if (!userInputs[coachStep]) userInputs[coachStep] = [];
  userInputs[coachStep].push(value);
  // 生成教练回复
  setTimeout(() => generateCoachReply(value), 800);
}}

function sendCoachMsg() {{
  const input = document.getElementById('coachInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  // 隐藏提示和按钮
  document.getElementById('coachPrompt').style.display = 'none';
  document.getElementById('coachButtons').style.display = 'none';
  // 显示用户消息
  addChatMessage('user', text);
  // 保存用户输入
  if (!userInputs[coachStep]) userInputs[coachStep] = [];
  userInputs[coachStep].push(text);
  // 生成教练回复（模拟延迟）
  setTimeout(() => generateCoachReply(text), 800);
}}

function generateCoachReply(userText) {{
  // 获取当前节点（用户刚回答完的节点）
  const tree = COACH_MCKINSEY_CONFIG.dialogTree[coachStep];
  if (!tree) {{ generateMcKinseyReport(); return; }}
  const currentNode = tree[coachSubStep];
  if (!currentNode) {{ generateMcKinseyReport(); return; }}

  // ① 生成确认语（基于当前节点和用户回复）
  let ack = buildAck(coachStep, coachSubStep, userText);

  // ② 关键词匹配，决定下一个节点
  let nextStep = coachStep;
  let nextSub = coachSubStep + 1;
  let jumped = false;

  if (currentNode.keywords) {{
    let matched = false;
    for (const [kw, target] of Object.entries(currentNode.keywords)) {{
      if (kw === 'default') continue;
      const regex = new RegExp(kw, 'i');
      if (regex.test(userText)) {{
        matched = true;
        const m = target.match(/^([a-z]+)(\\d+)$/);
        if (m) {{
          nextStep = m[1];
          nextSub = parseInt(m[2]);
        }}
        jumped = true;
        break;
      }}
    }}
    if (!matched && currentNode.keywords.default) {{
      const target = currentNode.keywords.default;
      const m = target.match(/^([a-z]+)(\\d+)$/);
      if (m) {{
        nextStep = m[1];
        nextSub = parseInt(m[2]);
      }}
      jumped = true;
    }}
  }}

  // ③ 如果没跳转，顺序推进；如果超出当前步骤长度，进入下一个大步骤
  if (!jumped) {{
    const curTree = COACH_MCKINSEY_CONFIG.dialogTree[coachStep];
    if (!curTree || nextSub >= curTree.length) {{
      const stepIdx = COACH_MCKINSEY_CONFIG.steps.findIndex(s => s.id === coachStep);
      if (stepIdx < COACH_MCKINSEY_CONFIG.steps.length - 1) {{
        nextStep = COACH_MCKINSEY_CONFIG.steps[stepIdx + 1].id;
        nextSub = 0;
        updateProgressBar();
      }} else {{
        // 所有步骤已完成，直接生成报告
        addChatMessage('coach', ack);
        // 直接生成报告，无需等待（纯前端生成，瞬间完成）
        generateMcKinseyReport();
        return;
      }}
    }}
  }}

  // ④ 获取下一个节点，把"提问"附加到确认语末尾
  const nextNode = COACH_MCKINSEY_CONFIG.dialogTree[nextStep]?.[nextSub];
  if (!nextNode) {{
    addChatMessage('coach', ack);
    // 直接生成报告，无需等待
    generateMcKinseyReport();
    return;
  }}

  let nextQ = nextNode.coach || '';
  let reply = ack;

  // 如果是动态问题标记，调用 generateDynamicQuestions 生成具体问题
  if (nextQ === 'DYNAMIC_QUESTIONS') {{
    nextQ = generateDynamicQuestions(userText);
    reply = ack + '\\n\\n' + nextQ;
  }} else if (nextQ) {{
    reply += '\\n\\n' + nextQ;
  }}
  reply = replacePlaceholders(reply, userText);

  // ⑤ 更新全局状态（在显示回复后更新）
  coachStep = nextStep;
  coachSubStep = nextSub;

  addChatMessage('coach', reply);
}}

function buildAck(step, subStep, userText) {{
  // 根据当前步骤和子步骤，生成简短确认语
  if (step === 'define') {{
    if (subStep === 0) {{
      // 用户刚描述完场景，生成具体问题
      return `收到！"${{userText.substring(0, 50)}}${{userText.length > 50 ? '...' : ''}}"。让我确认几个关键点：`;
    }}
    if (subStep === 1) {{
      // 用户回答了具体问题
      return `明白，我记录了这些信息。让我总结一下你的核心问题：`;
    }}
  }}
  if (step === 'analyze') {{
    if (subStep === 0) {{
      return `好的，我记录了你的行为模式："${{userText.substring(0, 50)}}..."`;
    }}
    if (subStep === 1) {{
      return `很好！现在我有了双方的行为模式，让我用MECE框架分析：\\n【你的行为模式】${{userInputs.analyze?.[0] || ''}}\\n→ 让对方感受到：你可能太急了\\n【对方的反应模式】${{userText}}\\n→ 让关系陷入：你说你的，我做我的\\n【关系结构】权力动态偏单向 / 信息流动不充分 / 情绪账户透支\\n\\n现在，你想先从哪个维度突破？\\nA. 调整我的行为模式（改变自己）\\nB. 引导对方的反应（影响对方）\\nC. 重构关系结构（改变互动规则）`;
    }}
  }}
  if (step === 'act') {{
    return `你选择了：'${{userText}}'。现在用 Impact/Effort 矩阵给你3个行动建议：`;
  }}
  return `收到，谢谢分享。`;
}}

function generateDynamicQuestions(userText) {{
  // 基于用户输入，生成3个具体问题让用户回答
  const text = userText.toLowerCase();
  let questions = [];

  // 问题1：你当时具体做了什么？
  if (text.match(/吵|冲突|争执|生气|愤怒/)) {{
    questions.push('1️⃣ 吵架时，你说了什么或做了什么？');
  }} else if (text.match(/不理|冷漠|沉默|不回应/)) {{
    questions.push('1️⃣ 对方不理你的时候，你是怎么做的？');
  }} else if (text.match(/拒绝|反对|不同意/)) {{
    questions.push('1️⃣ 对方拒绝你的时候，你说了什么？');
  }} else if (text.match(/控制|管|唠叨/)) {{
    questions.push('1️⃣ 对方管你/唠叨你的时候，你是怎么回应的？');
  }} else {{
    questions.push('1️⃣ 当时你说了什么或做了什么？');
  }}

  // 问题2：对方怎么反应的？
  if (text.match(/吵|冲突|争执|生气|愤怒/)) {{
    questions.push('2️⃣ 对方当时的反应是什么？（比如：跟你吵 / 沉默 / 摔门走 / 冷战...）');
  }} else if (text.match(/不理|冷漠|沉默/)) {{
    questions.push('2️⃣ 对方是怎么表现冷漠的？（比如：不回消息 / 敷衍 / 叹气...）');
  }} else if (text.match(/拒绝|反对/)) {{
    questions.push('2️⃣ 对方拒绝的理由是什么？（比如：忙、不需要、说没时间...）');
  }} else {{
    questions.push('2️⃣ 对方当时的反应是什么？');
  }}

  // 问题3：根据关键词动态生成
  if (text.match(/同事|老板|工作/)) {{
    questions.push('3️⃣ 这次事件之后，你们的工作配合变了吗？');
  }} else if (text.match(/老公|老婆|伴侣|恋爱/)) {{
    questions.push('3️⃣ 这次之后，你们之间的关系有没有变化？');
  }} else if (text.match(/孩子|女儿|儿子/)) {{
    questions.push('3️⃣ 这件事对孩子有什么影响吗？');
  }} else if (text.match(/朋友|闺蜜|兄弟/)) {{
    questions.push('3️⃣ 这次之后，你们的联系变少了吗？');
  }} else {{
    questions.push('3️⃣ 你最希望的结果是什么？');
  }}

  return questions.join('\\n');
}}

function replacePlaceholders(text, userText) {{
  if (!text) return '';
  // 简化版占位符替换
  text = text.replace(/{{用户选择}}/g, userText.substring(0, 20));
  text = text.replace(/{{场景}}/g, userInputs.define?.[0]?.substring(0, 30) || '你的关系场景');
  text = text.replace(/{{情绪}}/g, '不舒服');
  text = text.replace(/{{核心冲突}}/g, '需求和现实的差距');
  return text;
}}

function generateMcKinseyReport() {{
  // 清除生成提示
  const genEl = document.getElementById('generatingReport');
  if (genEl) genEl.remove();

  document.getElementById('coachChat').style.display = 'none';
  const reportEl = document.getElementById('coachReport');
  reportEl.style.display = 'block';

  const inputs = userInputs;
  const actions = buildDynamicActions(inputs);

  const report = {{
    coreConclusion: `【核心结论】你在"${{inputs.define?.[0]?.substring(0, 50) || '最近的场景'}}"中，倾向于${{(inputs.analyze?.[0] || '某种行为模式').substring(0, 30)}}，导致关系陷入僵局。根本原因在于双方的行为模式形成了负向循环。`,
    mece: [
      {{ dim: '你的行为模式', score: 6, desc: inputs.analyze?.[0] || '待补充', color: '{theme_color}' }},
      {{ dim: '对方的反应模式', score: 5, desc: inputs.analyze?.[1] || '待补充', color: '#0891b2' }},
      {{ dim: '关系结构', score: 4, desc: '权力动态偏单向 / 信息流动不充分 / 情绪账户透支', color: '#7c3aed' }}
    ],
    actions: actions,
    nextStep: `【本周试验】${{inputs.analyze?.[0] ? '调整你的互动方式，先倾听再表达' : '主动问候对方，不只在有问题时才联系'}}\\n【判断标准】对方回应变得更开放（主动说更多信息）\\n【复盘时间】建议下周一找我复盘`
  }};

  let html = `
    <div class="report-header">
      <div class="report-icon">📊</div>
      <div class="report-title">{coach_name}诊断报告</div>
      <div class="report-subtitle">基于结构化分析框架 · MECE原则 · 行动导向</div>
    </div>

    <div class="report-core-conclusion">
      <h3>🎯 核心结论（金字塔顶端）</h3>
      <p>${{report.coreConclusion}}</p>
    </div>

    <div class="report-mece-analysis">
      <h3>📋 MECE结构化分析</h3>
      ${{report.mece.map(m => `
        <div class="mece-dimension">
          <div class="mece-dim-title">${{m.dim}} <span style="color:${{m.color}}">${{m.score}}/10</span></div>
          <div class="mece-dim-desc">${{m.desc}}</div>
        </div>
      `).join('')}}
    </div>

    <div class="report-impact-effort">
      <h3>📊 Impact/Effort 矩阵说明</h3>
      <div class="ie-item"><span class="ie-tag ie-p0">P0 · 快赢</span>高影响 + 低投入 → 立即可做，快速见效</div>
      <div class="ie-item"><span class="ie-tag ie-p1">P1 · 重要</span>高影响 + 高投入 → 值得规划，中期突破</div>
      <div class="ie-item"><span class="ie-tag ie-p2">P2 · 长期</span>中影响 + 高投入 → 系统变革，长期收益</div>
    </div>

    <div class="report-priority-actions">
      <h3>🚀 优先级行动（Impact/Effort矩阵）</h3>
      ${{report.actions.map(a => `
        <div class="action-item">
          <div class="action-priority">${{a.priority}}</div>
          <div class="action-text"><strong>行动：</strong>${{a.action}}<br><strong>影响：</strong>${{a.impact}} | <strong>投入：</strong>${{a.effort}}</div>
        </div>
      `).join('')}}
    </div>

    <div class="report-next-step">
      <h3>👣 下一步行动（actionable）</h3>
      <p>${{report.nextStep.replace(/\\n/g, '<br>')}}</p>
    </div>

    <button class="coach-restart-btn" onclick="restartCoach()">🔄 重新对话</button>
  `;

  reportEl.innerHTML = html;
  reportEl.scrollTop = 0;
}}

function buildDynamicActions(inputs) {{
  const defineText = (inputs.define?.[0] || '').toLowerCase();
  const analyzeText = (inputs.analyze?.[0] || '').toLowerCase();
  const allText = defineText + ' ' + analyzeText;
  const actions = [];

  // ===== P0 快赢（高影响 + 低投入）=====
  let p0Added = false;

  // 冲突/争吵类
  if (allText.match(/吵|冲突|争执|对立|矛盾|不爽|生气|愤怒|发火/)) {{
    actions.push({{
      priority: 'P0 · 快赢',
      action: '下次感觉要吵起来时，说"我需要冷静一下，10分钟后再聊"',
      impact: '避免冲动发言伤害关系',
      effort: '低'
    }});
    p0Added = true;
  }}

  // 沟通不畅/沉默类
  if (!p0Added && allText.match(/不说话|沉默|回避|冷暴力|不理我|没回应|敷衍/)) {{
    actions.push({{
      priority: 'P0 · 快赢',
      action: '发一条破冰消息："最近在想我们之间的事，想和你聊聊"',
      impact: '打破沉默僵局',
      effort: '低'
    }});
    p0Added = true;
  }}

  // 讨好/委屈自己类
  if (!p0Added && allText.match(/讨好|妥协|让步|不敢|怕冲突|委屈|忍|迁就/)) {{
    actions.push({{
      priority: 'P0 · 快赢',
      action: '今天找一件小事练习说"不"（例如"我更想去A而不是B"）',
      impact: '建立边界感，停止过度讨好',
      effort: '低'
    }});
    p0Added = true;
  }}

  // 缺乏信任/欺骗类
  if (!p0Added && allText.match(/不信任|骗|隐瞒|秘密|怀疑|猜忌|撒谎/)) {{
    actions.push({{
      priority: 'P0 · 快赢',
      action: '主动分享一件你之前没说的事（例如"我最近压力挺大的"）',
      impact: '用透明化重建信任',
      effort: '低'
    }});
    p0Added = true;
  }}

  // 控制/被控制类
  if (!p0Added && allText.match(/控制|管我|唠叨|催|逼|压力|说教/)) {{
    actions.push({{
      priority: 'P0 · 快赢',
      action: '下次对方开始说教时，说"我听到了，让我自己试试看"',
      impact: '建立平等对话模式',
      effort: '低'
    }});
    p0Added = true;
  }}

  // 默认P0（通用）
  if (!p0Added) {{
    actions.push({{
      priority: 'P0 · 快赢',
      action: '今晚找对方聊10分钟，你只问"你最近怎么样？"然后闭嘴听',
      impact: '用深度倾听快速改善关系',
      effort: '低'
    }});
  }}

  // ===== P1 重要（高影响 + 中投入）=====
  let p1Added = false;

  // 职场关系
  if (allText.match(/同事|老板|上级|下属|客户|开会|工作|职场|公司|商务/)) {{
    actions.push({{
      priority: 'P1 · 重要',
      action: '每周找1位关键同事聊15分钟（不聊工作），问"你最近在忙什么？"',
      impact: '建立职场人情账户',
      effort: '中'
    }});
    p1Added = true;
  }}

  // 亲密关系
  if (!p1Added && allText.match(/老公|老婆|伴侣|对象|男朋友|女朋友|恋爱|婚姻|夫妻/)) {{
    actions.push({{
      priority: 'P1 · 重要',
      action: '每周设立30分钟"无手机时间"，只聊感受不聊事务',
      impact: '重建亲密感',
      effort: '中'
    }});
    p1Added = true;
  }}

  // 亲子关系
  if (!p1Added && allText.match(/孩子|女儿|儿子|育儿|陪读|妈妈|爸爸|家庭/)) {{
    actions.push({{
      priority: 'P1 · 重要',
      action: '每周做一次"只夸不教"对话，孩子说什么都不批评',
      impact: '建立孩子的表达安全感',
      effort: '中'
    }});
    p1Added = true;
  }}

  // 朋友关系
  if (!p1Added && allText.match(/朋友|闺蜜|兄弟|社交|人脉/)) {{
    actions.push({{
      priority: 'P1 · 重要',
      action: '主动约一次"无目的聚会"（纯吃饭/散步，不聊吐槽）',
      impact: '加深朋友连接',
      effort: '中'
    }});
    p1Added = true;
  }}

  // 默认P1（通用）
  if (!p1Added) {{
    actions.push({{
      priority: 'P1 · 重要',
      action: '做一次关系盘点：列出3个重要关系，写下"我最近存入了什么？取走了什么？"',
      impact: '明确关系现状，指导未来行动',
      effort: '中'
    }});
  }}

  // ===== P2 长期（系统变革）=====

  // 根据问题类型推荐不同的学习资源
  if (allText.match(/冲突|争吵|沟通|不说话|沉默/)) {{
    actions.push({{
      priority: 'P2 · 长期',
      action: '读《非暴力沟通》或《关键对话》，每周1-2章，刻意练习书中的句式',
      impact: '建立系统性沟通能力',
      effort: '高'
    }});
  }} else if (allText.match(/讨好|边界|不敢|委屈|控制/)) {{
    actions.push({{
      priority: 'P2 · 长期',
      action: '读《边界》或《不再讨好》，做笔记记录"我的边界在哪里"',
      impact: '从讨好/控制模式切换到平等模式',
      effort: '高'
    }});
  }} else if (allText.match(/信任|骗|隐瞒|怀疑/)) {{
    actions.push({{
      priority: 'P2 · 长期',
      action: '读《信任的速度》或《亲密关系》，理解信任的建立/破坏机制',
      impact: '建立健康的信任模式',
      effort: '高'
    }});
  }} else {{
    actions.push({{
      priority: 'P2 · 长期',
      action: '参加关系力课程/工作坊（线上或线下），系统提升关系能力',
      impact: '全面提升关系力',
      effort: '高'
    }});
  }}

  return actions;
}}

function restartCoach() {{
  document.getElementById('coachReport').style.display = 'none';
  document.getElementById('coachChat').style.display = 'none';
  document.getElementById('coachIntro').style.display = 'block';
  document.getElementById('chatMessages').innerHTML = '';
}}

// ===== 修改 switchTab 函数 =====
// 需要在 switchTab 函数中添加 coach 页面的处理
// 这个会在后面的步骤中单独处理
"""
    
    # 在 </script> 之前插入教练JS
    content = content.replace('  </script>', coach_js + '  </script>', 1)
    
    # 5. 修改 switchTab 函数，添加 coach 页面处理
    # 先找到 switchTab 函数，然后在其中添加 coach 页面的处理逻辑
    # 匹配 switchTab 函数的大致范围
    # 更简单的方法：在 switchTab 函数中添加一行：if (tab === 'coach') XXX();
    # 我们可以在 switchTab 函数末尾的 window.scrollTo 之前插入
    coach_switch_tab = f"""
  if (tab === 'coach') {{
    document.getElementById('coachIntro').style.display = 'block';
    document.getElementById('coachChat').style.display = 'none';
    document.getElementById('coachReport').style.display = 'none';
  }}
"""
    # 在 window.scrollTo(0, 0); 之前插入
    content = content.replace('  window.scrollTo(0, 0);\n}', coach_switch_tab + '  window.scrollTo(0, 0);\n}', 1)
    
    # 6. 添加 COACH_MCKINSEY_CONFIG 配置（在 </script> 之前）
    # 先读取 dialog_config_js，然后插入
    config_js = f"""
const COACH_MCKINSEY_CONFIG = {{
  steps: [
    {{ id: 'define', name: '界定问题' }},
    {{ id: 'analyze', name: '结构化分析' }},
    {{ id: 'act', name: '优先级行动' }}
  ],
  dialogTree: {{
    define: [
      {{
        coach: '嗨！我是你的{page_title}教练。用麦肯锡结构化思维，帮你拆解难题、找到可执行的下一步。\\n\\n请先描述你最近遇到的一个具体难题或挑战（尽量说清楚背景、你的目标、卡在哪里）：',
        keywords: {{
          'default': 'define1'
        }}
      }},
      {{
        coach: 'DYNAMIC_QUESTIONS',
        keywords: {{
          'default': 'analyze0'
        }}
      }}
    ],
    analyze: [
      {{
        coach: '明白。现在请描述一下：在这个场景中，你具体做了什么、对方怎么反应的？\\n\\n（尽量客观描述行为和反应，不要带评判）',
        keywords: {{
          'default': 'analyze1'
        }}
      }},
      {{
        coach: '收到。现在让我用MECE框架拆解一下这个问题：\\n\\n【你的视角】{{用户选择}}\\n【对方视角】待补充\\n【结构因素】环境/资源/时间压力\\n\\n请选择你想先突破的维度：\\nA. 改变我的行为（我能控制的部分）\\nB. 影响对方的反应（建立新的互动模式）\\nC. 调整结构因素（改变环境/流程/资源）',
        buttons: [
          {{ label: 'A. 改变我的行为', value: 'A', style: 'yes' }},
          {{ label: 'B. 影响对方', value: 'B', style: '' }},
          {{ label: 'C. 调整结构', value: 'C', style: 'no' }}
        ],
        keywords: {{
          'A|改变': 'act0',
          'B|影响': 'act0',
          'C|调整': 'act0',
          'default': 'act0'
        }}
      }}
    ],
    act: [
      {{
        coach: '好的，你选择了维度 [{{用户选择}}]。现在用 Impact/Effort 矩阵，给你3个优先级行动建议：',
        keywords: {{
          'default': 'report'
        }}
      }}
    ]
  }}
}};
"""
    # 在 </script> 之前插入配置
    content = content.replace('  </script>', config_js + '  </script>', 1)
    
    # 写回文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✅ 已为 {filepath} 添加教练功能')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python add_coach.py <filepath>')
        sys.exit(1)
    
    filepath = sys.argv[1]
    theme_color = sys.argv[2] if len(sys.argv) > 2 else '#ff6b35'
    theme_color_dark = sys.argv[3] if len(sys.argv) > 3 else '#e65100'
    page_title = sys.argv[4] if len(sys.argv) > 4 else '创业搭子'
    coach_name = sys.argv[5] if len(sys.argv) > 5 else '麦肯锡风格创业教练'
    
    add_coach_to_file(filepath, theme_color, theme_color_dark, page_title, coach_name, '')
    print('完成！')
