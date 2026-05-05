// ===== P7-P8 麦肯锡风格管理教练 =====
let coachStepP7 = '';
let coachSubStepP7 = 0;
let chatHistoryP7 = [];
let userInputsP7 = {};

const COACH_MCKINSEY_CONFIG_P7 = {
  steps: [
    { id: 'define', name: '界定问题' },
    { id: 'analyze', name: '结构化分析' },
    { id: 'act', name: '优先级行动' }
  ],
  dialogTree: {
    define: [
      {
        coach: '你好！我是麦肯锡风格P7管理教练。我们用3步结构化搞定你的管理难题：\n\n① 界定问题 → ② 结构化分析 → ③ 优先级行动\n\n先说说：最近哪件事让你感受到"我还只是个执行者，不是真正的Owner"？（请描述：什么场景？你当时怎么做的？结果如何？）',
        keywords: { 'default': 'define1' }
      },
      {
        coach: 'DYNAMIC_QUESTIONS',
        keywords: { 'default': 'analyze0' }
      }
    ],
    analyze: [
      {
        coach: '明白。现在请用MECE框架拆解一下：这件事涉及哪些维度？\n\n比如：业务判断、团队管理、向上沟通、资源协调...\n请列出你看到的2-3个关键维度：',
        keywords: { 'default': 'analyze1' }
      },
      {
        coach: '收到。现在让我帮你用MECE框架梳理：\n\n【你的行为】{用户选择}\n【观察到的差距】待补充\n【Owner应有的行为】主动判断、承担结果、推动决策\n\n请选择你想先突破的维度：\nA. 提升业务判断能力（从执行到决策）\nB. 改善团队管理方式（从管控到赋能）\nC. 加强向上沟通（从等待指令到主动建议）',
        buttons: [
          { label: 'A. 业务判断', value: 'A', style: 'yes' },
          { label: 'B. 团队管理', value: 'B', style: '' },
          { label: 'C. 向上沟通', value: 'C', style: 'no' }
        ],
        keywords: {
          'A|业务|B|团队|C|向上': 'act0',
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

function startCoachP7() {
  coachStepP7 = 'define';
  coachSubStepP7 = 0;
  chatHistoryP7 = [];
  userInputsP7 = {};
  document.getElementById('coachIntro').style.display = 'none';
  document.getElementById('coachChat').style.display = 'block';
  document.getElementById('coachReport').style.display = 'none';
  updateProgressBarP7();
  const firstMsg = COACH_MCKINSEY_CONFIG_P7.dialogTree.define[0].coach;
  addChatMessageP7('coach', firstMsg);
}

function updateProgressBarP7() {
  const steps = ['define', 'analyze', 'act'];
  steps.forEach((s, i) => {
    const el = document.getElementById(`progressStep${i+1}`);
    if (!el) return;
    if (coachStepP7 === s) { el.classList.add('active'); }
    else { el.classList.remove('active'); }
  });
}

function addChatMessageP7(role, text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${role}`;
  const avatar = role === 'coach' ? '🎓' : '🧑';
  msgDiv.innerHTML = `
    <div class="chat-avatar">${avatar}</div>
    <div class="chat-bubble">${text.replace(/\n/g, '<br>')}</div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  chatHistoryP7.push({ role, text });
  if (role === 'coach') {
    const tree = COACH_MCKINSEY_CONFIG_P7.dialogTree[coachStepP7];
    const currentNode = tree ? tree[coachSubStepP7] : null;
    if (currentNode && currentNode.buttons && currentNode.buttons.length > 0) {
      showCoachButtonsP7(currentNode.buttons);
    } else {
      document.getElementById('chatInputArea').style.display = 'flex';
      document.getElementById('coachButtons').style.display = 'none';
      document.getElementById('coachPrompt').style.display = 'block';
      const inp = document.getElementById('coachInput');
      if (inp) inp.focus();
    }
  }
}

function showCoachButtonsP7(buttons) {
  const container = document.getElementById('coachButtons');
  const btnList = document.getElementById('coachBtnList');
  const btnPrompt = document.getElementById('coachBtnPrompt');
  if (btnPrompt) btnPrompt.textContent = '请选择：';
  if (btnList) btnList.innerHTML = '';
  buttons.forEach(btn => {
    const btnEl = document.createElement('button');
    btnEl.className = `coach-choice-btn ${btn.style || ''}`;
    btnEl.textContent = btn.label;
    btnEl.onclick = () => handleCoachButtonClickP7(btn.value, btn.label);
    if (btnList) btnList.appendChild(btnEl);
  });
  if (container) container.style.display = 'block';
  const inpArea = document.getElementById('chatInputArea');
  if (inpArea) inpArea.style.display = 'none';
  const prompt = document.getElementById('coachPrompt');
  if (prompt) prompt.style.display = 'none';
}

function handleCoachButtonClickP7(value, label) {
  addChatMessageP7('user', label);
  if (!userInputsP7[coachStepP7]) userInputsP7[coachStepP7] = [];
  userInputsP7[coachStepP7].push(value);
  setTimeout(() => generateCoachReplyP7(value), 800);
}

function sendCoachMsgP7() {
  const input = document.getElementById('coachInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  const prompt = document.getElementById('coachPrompt');
  if (prompt) prompt.style.display = 'none';
  const buttons = document.getElementById('coachButtons');
  if (buttons) buttons.style.display = 'none';
  addChatMessageP7('user', text);
  if (!userInputsP7[coachStepP7]) userInputsP7[coachStepP7] = [];
  userInputsP7[coachStepP7].push(text);
  setTimeout(() => generateCoachReplyP7(text), 800);
}

function generateCoachReplyP7(userText) {
  const tree = COACH_MCKINSEY_CONFIG_P7.dialogTree[coachStepP7];
  if (!tree) { generateMcKinseyReportP7(); return; }
  const currentNode = tree[coachSubStepP7];
  if (!currentNode) { generateMcKinseyReportP7(); return; }

  let nextStep = coachStepP7;
  let nextSub = coachSubStepP7 + 1;
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
    const curTree = COACH_MCKINSEY_CONFIG_P7.dialogTree[coachStepP7];
    if (!curTree || nextSub >= curTree.length) {
      const stepIdx = COACH_MCKINSEY_CONFIG_P7.steps.findIndex(s => s.id === coachStepP7);
      if (stepIdx < COACH_MCKINSEY_CONFIG_P7.steps.length - 1) {
        nextStep = COACH_MCKINSEY_CONFIG_P7.steps[stepIdx + 1].id;
        nextSub = 0;
        updateProgressBarP7();
      } else {
        generateMcKinseyReportP7();
        return;
      }
    }
  }

  const nextNode = COACH_MCKINSEY_CONFIG_P7.dialogTree[nextStep]?.[nextSub];
  if (!nextNode) {
    generateMcKinseyReportP7();
    return;
  }

  let nextQ = nextNode.coach || '';
  let reply = '';

  if (nextQ === 'DYNAMIC_QUESTIONS') {
    nextQ = generateDynamicQuestionsP7(userText);
    reply = nextQ;
  } else if (nextQ) {
    reply = nextQ;
  }
  reply = replacePlaceholdersP7(reply, userText);

  coachStepP7 = nextStep;
  coachSubStepP7 = nextSub;

  addChatMessageP7('coach', reply);
}

function generateDynamicQuestionsP7(userText) {
  const text = userText.toLowerCase();
  let questions = [];
  if (text.match(/团队|下属|员工|管理/)) {
    questions.push('1️⃣ 在团队管理上，你当时做了什么？下属如何反应的？');
  } else if (text.match(/上级|老板|领导|汇报/)) {
    questions.push('1️⃣ 在向上沟通上，你说了什么或做了什么？上级如何反应的？');
  } else if (text.match(/业务|项目|决策|判断/)) {
    questions.push('1️⃣ 在业务决策上，你做了什么判断？结果如何？');
  } else {
    questions.push('1️⃣ 当时你具体做了什么？结果如何？');
  }
  questions.push('2️⃣ 这件事反映出你在哪个管理维度上还有差距？（业务判断/团队管理/向上沟通/资源协调）');
  questions.push('3️⃣ 如果重来一次，你会怎么做不同的决定？');
  return questions.join('\n');
}

function replacePlaceholdersP7(text, userText) {
  if (!text) return '';
  text = text.replace(/\{用户选择\}/g, userText.substring(0, 20));
  return text;
}

function generateMcKinseyReportP7() {
  const reportEl = document.getElementById('coachReport');
  const chatEl = document.getElementById('coachChat');
  if (chatEl) chatEl.style.display = 'none';
  if (reportEl) reportEl.style.display = 'block';

  const inputs = userInputsP7;
  const defineText = (inputs.define || []).join(' ');
  const analyzeText = (inputs.analyze || []).join(' ');

  let html = `
    <div class="report-header">
      <div class="report-icon">📊</div>
      <div class="report-title">麦肯锡风格P7管理教练诊断报告</div>
      <div class="report-subtitle">基于结构化分析框架 · MECE原则 · 行动导向</div>
    </div>
    <div class="report-core-conclusion">
      <h3>🎯 核心结论（金字塔顶端）</h3>
      <p>你在"${defineText.substring(0, 50) || '最近的管理场景'}"中，尚未完全建立Owner思维。根本原因在于：仍然在等待指令，而不是主动做判断、承担结果。</p>
    </div>
    <div class="report-mece-analysis">
      <h3>📋 MECE结构化分析</h3>
      <div class="mece-dimension">
        <div class="mece-dim-title">业务判断 <span style="color:#3a5fcd">6/10</span></div>
        <div class="mece-dim-desc">${analyzeText ? analyzeText.substring(0, 60) : '待补充：你是否主动做了业务判断？还是等上级拍板？'}</div>
      </div>
      <div class="mece-dimension">
        <div class="mece-dim-title">团队管理 <span style="color:#0891b2">5/10</span></div>
        <div class="mece-dim-desc">你是否给了下属判断的机会，还是直接告诉他们答案？</div>
      </div>
      <div class="mece-dimension">
        <div class="mece-dim-title">向上沟通 <span style="color:#7c3aed">5/10</span></div>
        <div class="mece-dim-desc">你是只汇报事实，还是带着建议去汇报？</div>
      </div>
    </div>
    <div class="report-priority-actions">
      <h3>🚀 优先级行动（Impact/Effort矩阵）</h3>
      <div class="action-item">
        <div class="action-priority">P0 · 快赢</div>
        <div class="action-text">明天找一件事，主动做判断（哪怕错了），然后向老板汇报："我的判断是X，理由是Y，请您确认"</div>
      </div>
      <div class="action-item">
        <div class="action-priority">P1 · 重要</div>
        <div class="action-text">列出3件"只有P8才能做、P7不用做"的事，本周主动做其中1件</div>
      </div>
      <div class="action-item">
        <div class="action-priority">P2 · 长期</div>
        <div class="action-text">读《麦肯锡决策思维》或《赋能：打造应对不确定性的敏捷团队》，建立系统化管理思维</div>
      </div>
    </div>
    <div class="report-next-step">
      <h3>👣 下一步行动（actionable）</h3>
      <p>【本周试验】主动做1次业务判断，不等待上级指令<br>【判断标准】上级是否回来问你"你怎么看"而不是"你做了什么"<br>【复盘时间】建议下周一找我复盘</p>
    </div>
    <button class="coach-restart-btn" onclick="restartCoachP7()">🔄 重新对话</button>
  `;

  if (reportEl) reportEl.innerHTML = html;
  if (reportEl) reportEl.scrollTop = 0;
}

function restartCoachP7() {
  const reportEl = document.getElementById('coachReport');
  const chatEl = document.getElementById('coachChat');
  const introEl = document.getElementById('coachIntro');
  if (reportEl) reportEl.style.display = 'none';
  if (chatEl) { chatEl.style.display = 'none'; chatEl.innerHTML = ''; }
  if (introEl) introEl.style.display = 'block';
  const msgs = document.getElementById('chatMessages');
  if (msgs) msgs.innerHTML = '';
}
