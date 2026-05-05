// ===== 业务Owner 麦肯锡风格教练 =====
let coachStepOwner = '';
let coachSubStepOwner = 0;
let chatHistoryOwner = [];
let userInputsOwner = {};

const COACH_MCKINSEY_CONFIG_OWNER = {
  steps: [
    { id: 'define', name: '界定问题' },
    { id: 'analyze', name: '结构化分析' },
    { id: 'act', name: '优先级行动' }
  ],
  dialogTree: {
    define: [
      {
        coach: '你好！我是麦肯锡风格业务Owner教练。我们用3步结构化搞定你的业务难题：\n\n① 界定问题 → ② 结构化分析 → ③ 优先级行动\n\n先说说：最近哪件事让你感受到"我只是在执行，不是真正的Owner"？（请描述：什么业务场景？你当时怎么做的？结果如何？）',
        keywords: { 'default': 'define1' }
      },
      {
        coach: 'DYNAMIC_QUESTIONS',
        keywords: { 'default': 'analyze0' }
      }
    ],
    analyze: [
      {
        coach: '明白。现在请用MECE框架拆解一下：这件事涉及哪些业务维度？\n\n比如：收入结构、利润模型、客户价值、竞争壁垒...\n请列出你看到的2-3个关键维度：',
        keywords: { 'default': 'analyze1' }
      },
      {
        coach: '收到。现在让我帮你用MECE框架梳理：\n\n【你的做法】{用户选择}\n【Owner应有的做法】主动判断ROI、承担结果、推动决策\n\n请选择你想先突破的维度：\nA. 提升收入判断（从GMV到利润）\nB. 优化业务结构（从执行到Owner视角）\nC. 加强对外经营（从内部管理到外部市场）',
        buttons: [
          { label: 'A. 收入判断', value: 'A', style: 'yes' },
          { label: 'B. 业务结构', value: 'B', style: '' },
          { label: 'C. 对外经营', value: 'C', style: 'no' }
        ],
        keywords: {
          'A|收入|B|业务|C|对外': 'act0',
          'default': 'act0'
        }
      }
    ],
    act: [
      {
        coach: '好的，你选择了维度 [{用户选择}]。现在用 Impact/Effort 矩阵，给你3个优先级行动建议：',
        keywords: { 'default': 'report' }
      }
    ]
  }
};

function startCoachOwner() {
  coachStepOwner = 'define';
  coachSubStepOwner = 0;
  chatHistoryOwner = [];
  userInputsOwner = {};
  const intro = document.getElementById('coachIntro');
  const chat = document.getElementById('coachChat');
  const report = document.getElementById('coachReport');
  if (intro) intro.style.display = 'none';
  if (chat) chat.style.display = 'block';
  if (report) report.style.display = 'none';
  updateProgressBarOwner();
  const firstMsg = COACH_MCKINSEY_CONFIG_OWNER.dialogTree.define[0].coach;
  addChatMessageOwner('coach', firstMsg);
}

function updateProgressBarOwner() {
  const steps = ['define', 'analyze', 'act'];
  steps.forEach((s, i) => {
    const el = document.getElementById(`progressStep${i+1}`);
    if (!el) return;
    if (coachStepOwner === s) { el.classList.add('active'); }
    else { el.classList.remove('active'); }
  });
}

function addChatMessageOwner(role, text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${role}`;
  const avatar = role === 'coach' ? '🎓' : '🧑💼';
  msgDiv.innerHTML = `
    <div class="chat-avatar">${avatar}</div>
    <div class="chat-bubble">${text.replace(/\n/g, '<br>')}</div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  chatHistoryOwner.push({ role, text });
  if (role === 'coach') {
    const tree = COACH_MCKINSEY_CONFIG_OWNER.dialogTree[coachStepOwner];
    const currentNode = tree ? tree[coachSubStepOwner] : null;
    if (currentNode && currentNode.buttons && currentNode.buttons.length > 0) {
      showCoachButtonsOwner(currentNode.buttons);
    } else {
      const inpArea = document.getElementById('chatInputArea');
      if (inpArea) inpArea.style.display = 'flex';
      const buttons = document.getElementById('coachButtons');
      if (buttons) buttons.style.display = 'none';
      const prompt = document.getElementById('coachPrompt');
      if (prompt) prompt.style.display = 'block';
      const inp = document.getElementById('coachInput');
      if (inp) inp.focus();
    }
  }
}

function showCoachButtonsOwner(buttons) {
  const container = document.getElementById('coachButtons');
  const btnList = document.getElementById('coachBtnList');
  const btnPrompt = document.getElementById('coachBtnPrompt');
  if (btnPrompt) btnPrompt.textContent = '请选择：';
  if (btnList) btnList.innerHTML = '';
  buttons.forEach(btn => {
    const btnEl = document.createElement('button');
    btnEl.className = `coach-choice-btn ${btn.style || ''}`;
    btnEl.textContent = btn.label;
    btnEl.onclick = () => handleCoachButtonClickOwner(btn.value, btn.label);
    if (btnList) btnList.appendChild(btnEl);
  });
  if (container) container.style.display = 'block';
  const inpArea = document.getElementById('chatInputArea');
  if (inpArea) inpArea.style.display = 'none';
  const prompt = document.getElementById('coachPrompt');
  if (prompt) prompt.style.display = 'none';
}

function handleCoachButtonClickOwner(value, label) {
  addChatMessageOwner('user', label);
  if (!userInputsOwner[coachStepOwner]) userInputsOwner[coachStepOwner] = [];
  userInputsOwner[coachStepOwner].push(value);
  setTimeout(() => generateCoachReplyOwner(value), 800);
}

function sendCoachMsgOwner() {
  const input = document.getElementById('coachInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  const prompt = document.getElementById('coachPrompt');
  if (prompt) prompt.style.display = 'none';
  const buttons = document.getElementById('coachButtons');
  if (buttons) buttons.style.display = 'none';
  addChatMessageOwner('user', text);
  if (!userInputsOwner[coachStepOwner]) userInputsOwner[coachStepOwner] = [];
  userInputsOwner[coachStepOwner].push(text);
  setTimeout(() => generateCoachReplyOwner(text), 800);
}

function generateCoachReplyOwner(userText) {
  const tree = COACH_MCKINSEY_CONFIG_OWNER.dialogTree[coachStepOwner];
  if (!tree) { generateMcKinseyReportOwner(); return; }
  const currentNode = tree[coachSubStepOwner];
  if (!currentNode) { generateMcKinseyReportOwner(); return; }

  let nextStep = coachStepOwner;
  let nextSub = coachSubStepOwner + 1;
  let jumped = false;

  if (currentNode.keywords) {
    let matched = false;
    for (const [kw, target] of Object.entries(currentNode.keywords)) {
      if (kw === 'default') continue;
      const regex = new RegExp(kw, 'i');
      if (regex.test(userText)) {
        matched = true;
        const m = target.match(/^([a-z]+)(\d+)$/);
        if (m) {
          nextStep = m[1];
          nextSub = parseInt(m[2]);
        }
        jumped = true;
        break;
      }
    }
    if (!matched && currentNode.keywords.default) {
      const target = currentNode.keywords.default;
      const m = target.match(/^([a-z]+)(\d+)$/);
      if (m) {
        nextStep = m[1];
        nextSub = parseInt(m[2]);
      }
      jumped = true;
    }
  }

  if (!jumped) {
    const curTree = COACH_MCKINSEY_CONFIG_OWNER.dialogTree[coachStepOwner];
    if (!curTree || nextSub >= curTree.length) {
      const stepIdx = COACH_MCKINSEY_CONFIG_OWNER.steps.findIndex(s => s.id === coachStepOwner);
      if (stepIdx < COACH_MCKINSEY_CONFIG_OWNER.steps.length - 1) {
        nextStep = COACH_MCKINSEY_CONFIG_OWNER.steps[stepIdx + 1].id;
        nextSub = 0;
        updateProgressBarOwner();
      } else {
        generateMcKinseyReportOwner();
        return;
      }
    }
  }

  const nextNode = COACH_MCKINSEY_CONFIG_OWNER.dialogTree[nextStep]?.[nextSub];
  if (!nextNode) {
    generateMcKinseyReportOwner();
    return;
  }

  let nextQ = nextNode.coach || '';
  if (nextQ === 'DYNAMIC_QUESTIONS') {
    nextQ = generateDynamicQuestionsOwner(userText);
  }
  nextQ = replacePlaceholdersOwner(nextQ, userText);

  coachStepOwner = nextStep;
  coachSubStepOwner = nextSub;

  addChatMessageOwner('coach', nextQ);
}

function generateDynamicQuestionsOwner(userText) {
  const text = userText.toLowerCase();
  let questions = [];
  if (text.match(/收入|GMV|销售|营收/)) {
    questions.push('1️⃣ 在收入增长上，你当时做了什么判断？结果如何？');
  } else if (text.match(/利润|毛利|成本|ROI/)) {
    questions.push('1️⃣ 在利润管控上，你做了什么决策？数据如何？');
  } else {
    questions.push('1️⃣ 当时你具体做了什么业务判断？结果如何？');
  }
  questions.push('2️⃣ 这件事反映出你的业务Owner思维在哪个维度有差距？（收入/利润/客户/竞争）');
  questions.push('3️⃣ 如果重来一次，你会做哪些不同的业务决策？');
  return questions.join('\n');
}

function replacePlaceholdersOwner(text, userText) {
  if (!text) return '';
  text = text.replace(/\{用户选择\}/g, userText.substring(0, 20));
  return text;
}

function generateMcKinseyReportOwner() {
  const reportEl = document.getElementById('coachReport');
  const chatEl = document.getElementById('coachChat');
  if (chatEl) chatEl.style.display = 'none';
  if (reportEl) reportEl.style.display = 'block';

  const inputs = userInputsOwner;
  const defineText = (inputs.define || []).join(' ');
  const analyzeText = (inputs.analyze || []).join(' ');

  let html = `
    <div class="report-header">
      <div class="report-icon">📊</div>
      <div class="report-title">麦肯锡风格业务Owner教练诊断报告</div>
      <div class="report-subtitle">基于结构化分析框架 · MECE原则 · 行动导向</div>
    </div>
    <div class="report-core-conclusion">
      <h3>🎯 核心结论（金字塔顶端）</h3>
      <p>你在"${defineText.substring(0, 50) || '最近的业务场景'}"中，尚未完全建立Owner思维。根本原因在于：仍然在用执行者思维做业务，而不是用Owner视角判断ROI、承担结果。</p>
    </div>
    <div class="report-mece-analysis">
      <h3>📋 MECE结构化分析</h3>
      <div class="mece-dimension">
        <div class="mece-dim-title">收入判断 <span style="color:#16a34a">6/10</span></div>
        <div class="mece-dim-desc">${analyzeText ? analyzeText.substring(0, 60) : '待补充：你是否在关注GMV的同时，也关注利润和单位经济模型？'}</div>
      </div>
      <div class="mece-dimension">
        <div class="mece-dim-title">业务结构 <span style="color:#0891b2">5/10</span></div>
        <div class="mece-dim-desc">你的业务是否依赖单一收入来源？是否有多元化的Owner视角？</div>
      </div>
      <div class="mece-dimension">
        <div class="mece-dim-title">对外经营 <span style="color:#7c3aed">5/10</span></div>
        <div class="mece-dim-desc">你花多少时间在客户/市场/竞争分析上？还是只在内部运营？</div>
      </div>
    </div>
    <div class="report-priority-actions">
      <h3>🚀 优先级行动（Impact/Effort矩阵）</h3>
      <div class="action-item">
        <div class="action-priority">P0 · 快赢</div>
        <div class="action-text">今天找一件事，用Owner视角重新判断："这件事的利润影响是什么？"而不是"这件事的GMV影响是什么？"</div>
      </div>
      <div class="action-item">
        <div class="action-priority">P1 · 重要</div>
        <div class="action-text">列出3件"只有Owner才能做、管理者不用做"的事，本周主动做其中1件</div>
      </div>
      <div class="action-item">
        <div class="action-priority">P2 · 长期</div>
        <div class="action-text">读《麦肯锡利润管理》或《OWNER思维》，建立系统性业务Owner框架</div>
      </div>
    </div>
    <div class="report-next-step">
      <h3>👣 下一步行动（actionable）</h3>
      <p>【本周试验】主动做1次业务判断，不等待上级指令<br>【判断标准】上级是否回来问你"你的建议是什么"而不是"你做了什么"<br>【复盘时间】建议下周一找我复盘</p>
    </div>
    <button class="coach-restart-btn" onclick="restartCoachOwner()">🔄 重新对话</button>
  `;

  if (reportEl) reportEl.innerHTML = html;
  if (reportEl) reportEl.scrollTop = 0;
}

function restartCoachOwner() {
  const reportEl = document.getElementById('coachReport');
  const chatEl = document.getElementById('coachChat');
  const introEl = document.getElementById('coachIntro');
  if (reportEl) reportEl.style.display = 'none';
  if (chatEl) { chatEl.style.display = 'none'; chatEl.innerHTML = ''; }
  if (introEl) introEl.style.display = 'block';
  const msgs = document.getElementById('chatMessages');
  if (msgs) msgs.innerHTML = '';
}
