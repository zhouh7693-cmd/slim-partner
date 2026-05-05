// ===== 教练功能（麦肯锡风格深度对话） =====
let coachStep = '';
let coachSubStep = 0;
let pendingNextStep = null;
let pendingNextSub = 0;
let chatHistory = [];
let userInputs = {};

const COACH_MCKINSEY_CONFIG = {
  steps: [
    { id: 'define', name: '界定问题' },
    { id: 'analyze', name: '结构化分析' },
    { id: 'act', name: '优先级行动' }
  ],
  dialogTree: {
    define: [
      {
        coach: '嗨！我是你的创业教练。用麦肯锡结构化思维，帮你拆解难题、找到可执行的下一步。\n\n请先描述你最近遇到的一个具体创业难题或挑战（尽量说清楚背景、你的目标、卡在哪里）：',
        keywords: { 'default': 'define1' }
      },
      {
        coach: 'DYNAMIC_QUESTIONS',
        keywords: { 'default': 'analyze0' }
      }
    ],
    analyze: [
      {
        coach: '明白。现在请描述一下：在这个场景中，你具体做了什么、团队/合伙人的反应如何？\n\n（尽量客观描述行为和反应，不要带评判）',
        keywords: { 'default': 'analyze1' }
      },
      {
        coach: '收到。现在让我用MECE框架拆解一下这个问题：\n\n【你的视角】{用户选择}\n【团队/市场视角】待补充\n【结构因素】资源/时间/竞争压力\n\n请选择你想先突破的维度：\nA. 改变我的行为（我能控制的部分）\nB. 影响团队/合伙人的反应（建立新的互动模式）\nC. 调整结构因素（改变环境/流程/资源）',
        buttons: [
          { label: 'A. 改变我的行为', value: 'A', style: 'yes' },
          { label: 'B. 影响团队/合伙人', value: 'B', style: '' },
          { label: 'C. 调整结构', value: 'C', style: 'no' }
        ],
        keywords: {
          'A|改变': 'act0',
          'B|影响': 'act0',
          'C|调整': 'act0',
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

function startCoach() {
  coachStep = 'define';
  coachSubStep = 0;
  chatHistory = [];
  userInputs = {};
  document.getElementById('coachIntro').style.display = 'none';
  document.getElementById('coachChat').style.display = 'block';
  document.getElementById('coachReport').style.display = 'none';
  updateProgressBar();
  const firstMsg = COACH_MCKINSEY_CONFIG.dialogTree.define[0].coach;
  addChatMessage('coach', firstMsg);
}

function updateProgressBar() {
  const steps = ['define', 'analyze', 'act'];
  steps.forEach((s, i) => {
    const el = document.getElementById(`progressStep${i+1}`);
    if (!el) return;
    if (coachStep === s) { el.classList.add('active'); }
    else { el.classList.remove('active'); }
  });
}

function addChatMessage(role, text) {
  const container = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${role}`;
  const avatar = role === 'coach' ? '🎓' : '🧑';
  msgDiv.innerHTML = `
    <div class="chat-avatar">${avatar}</div>
    <div class="chat-bubble">${text.replace(/\n/g, '<br>')}</div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  chatHistory.push({ role, text });
  if (role === 'coach') {
    if (text.includes('生成报告') || text.includes('正在为你')) {
      document.getElementById('chatInputArea').style.display = 'none';
      document.getElementById('coachButtons').style.display = 'none';
      document.getElementById('coachPrompt').style.display = 'none';
      const generatingMsg = document.createElement('div');
      generatingMsg.id = 'generatingReport';
      generatingMsg.className = 'generating-report';
      generatingMsg.innerHTML = '⏳ 正在生成MECE诊断报告，请稍候...';
      document.getElementById('coachChat').appendChild(generatingMsg);
    } else {
      const tree = COACH_MCKINSEY_CONFIG.dialogTree[coachStep];
      const currentNode = tree ? tree[coachSubStep] : null;
      if (currentNode && currentNode.buttons && currentNode.buttons.length > 0) {
        showCoachButtons(currentNode.buttons);
      } else {
        document.getElementById('chatInputArea').style.display = 'flex';
        document.getElementById('coachButtons').style.display = 'none';
        document.getElementById('coachPrompt').style.display = 'block';
        document.getElementById('coachInput').focus();
      }
    }
  }
}

function showCoachButtons(buttons) {
  const container = document.getElementById('coachButtons');
  const btnList = document.getElementById('coachBtnList');
  const btnPrompt = document.getElementById('coachBtnPrompt');
  btnPrompt.textContent = '请选择：';
  btnList.innerHTML = '';
  buttons.forEach(btn => {
    const btnEl = document.createElement('button');
    btnEl.className = `coach-choice-btn ${btn.style || ''}`;
    btnEl.textContent = btn.label;
    btnEl.onclick = () => handleCoachButtonClick(btn.value, btn.label);
    btnList.appendChild(btnEl);
  });
  container.style.display = 'block';
  document.getElementById('chatInputArea').style.display = 'none';
  document.getElementById('coachPrompt').style.display = 'none';
}

function handleCoachButtonClick(value, label) {
  addChatMessage('user', label);
  if (!userInputs[coachStep]) userInputs[coachStep] = [];
  userInputs[coachStep].push(value);
  setTimeout(() => generateCoachReply(value), 800);
}

function sendCoachMsg() {
  const input = document.getElementById('coachInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  document.getElementById('coachPrompt').style.display = 'none';
  document.getElementById('coachButtons').style.display = 'none';
  addChatMessage('user', text);
  if (!userInputs[coachStep]) userInputs[coachStep] = [];
  userInputs[coachStep].push(text);
  setTimeout(() => generateCoachReply(text), 800);
}

function generateCoachReply(userText) {
  const tree = COACH_MCKINSEY_CONFIG.dialogTree[coachStep];
  if (!tree) { generateMcKinseyReport(); return; }
  const currentNode = tree[coachSubStep];
  if (!currentNode) { generateMcKinseyReport(); return; }

  let ack = buildAck(coachStep, coachSubStep, userText);
  let nextStep = coachStep;
  let nextSub = coachSubStep + 1;
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
    const curTree = COACH_MCKINSEY_CONFIG.dialogTree[coachStep];
    if (!curTree || nextSub >= curTree.length) {
      const stepIdx = COACH_MCKINSEY_CONFIG.steps.findIndex(s => s.id === coachStep);
      if (stepIdx < COACH_MCKINSEY_CONFIG.steps.length - 1) {
        nextStep = COACH_MCKINSEY_CONFIG.steps[stepIdx + 1].id;
        nextSub = 0;
        updateProgressBar();
      } else {
        addChatMessage('coach', ack);
        generateMcKinseyReport();
        return;
      }
    }
  }

  const nextNode = COACH_MCKINSEY_CONFIG.dialogTree[nextStep]?.[nextSub];
  if (!nextNode) {
    addChatMessage('coach', ack);
    generateMcKinseyReport();
    return;
  }

  let nextQ = nextNode.coach || '';
  let reply = ack;

  if (nextQ === 'DYNAMIC_QUESTIONS') {
    nextQ = generateDynamicQuestions(userText);
    reply = ack + '\n\n' + nextQ;
  } else if (nextQ) {
    reply += '\n\n' + nextQ;
  }
  reply = replacePlaceholders(reply, userText);

  coachStep = nextStep;
  coachSubStep = nextSub;

  addChatMessage('coach', reply);
}

function buildAck(step, subStep, userText) {
  if (step === 'define') {
    if (subStep === 0) {
      return `收到！"${userText.substring(0, 50)}${userText.length > 50 ? '...' : ''}"。让我确认几个关键点：`;
    }
    if (subStep === 1) {
      return `明白，我记录了这些信息。让我总结一下你的核心问题：`;
    }
  }
  if (step === 'analyze') {
    if (subStep === 0) {
      return `好的，我记录了你的行为模式："${userText.substring(0, 50)}..."`;
    }
    if (subStep === 1) {
      return `很好！现在我有了双方的行为模式，让我用MECE框架分析：\n【你的行为模式】${userInputs.analyze?.[0] || ''}\n→ 让团队感受到：你可能太急了\n【对方的反应模式】${userText}\n→ 让创业陷入：你说你的，我做我的\n【创业结构】资源限制 / 时间压力 / 角色模糊\n\n现在，你想先从哪个维度突破？\nA. 调整我的行为模式（改变自己）\nB. 引导团队/合伙人的反应（影响对方）\nC. 重构创业结构（改变互动规则）`;
    }
  }
  if (step === 'act') {
    return `你选择了：'${userText}'。现在用 Impact/Effort 矩阵给你3个行动建议：`;
  }
  return `收到，谢谢分享。`;
}

function generateDynamicQuestions(userText) {
  const text = userText.toLowerCase();
  let questions = [];

  if (text.match(/焦虑|迷茫|不确定|方向/)) {
    questions.push('1️⃣ 这种焦虑感最早是什么时候出现的？当时发生了什么？');
  } else if (text.match(/吵架|冲突|争执|分歧/)) {
    questions.push('1️⃣ 冲突时，你说了什么或做了什么？对方如何回应的？');
  } else if (text.match(/累|疲惫|撑不住|压力/)) {
    questions.push('1️⃣ 这种疲惫感持续多久了？最耗你能量的事情是什么？');
  } else {
    questions.push('1️⃣ 当时你说了什么或做了什么？');
  }

  questions.push('2️⃣ 这个问题对你的创业项目有什么具体影响？（收入/团队/产品/用户）');
  questions.push('3️⃣ 你最希望的改变是什么？如果问题解决，会发生什么不同？');

  return questions.join('\n');
}

function replacePlaceholders(text, userText) {
  if (!text) return '';
  text = text.replace(/\{用户选择\}/g, userText.substring(0, 20));
  text = text.replace(/\{场景\}/g, userInputs.define?.[0]?.substring(0, 30) || '你的创业场景');
  text = text.replace(/\{情绪\}/g, '不舒服');
  text = text.replace(/\{核心冲突\}/g, '需求和现实的差距');
  return text;
}

function generateMcKinseyReport() {
  const genEl = document.getElementById('generatingReport');
  if (genEl) genEl.remove();

  document.getElementById('coachChat').style.display = 'none';
  const reportEl = document.getElementById('coachReport');
  reportEl.style.display = 'block';

  const inputs = userInputs;
  const actions = buildDynamicActions(inputs);

  const report = {
    coreConclusion: `【核心结论】你在"${inputs.define?.[0]?.substring(0, 50) || '最近的创业场景'}"中，倾向于${(inputs.analyze?.[0] || '某种行为模式').substring(0, 30)}，导致创业陷入僵局。根本原因在于行为模式形成了负向循环。`,
    mece: [
      { dim: '你的行为模式', score: 6, desc: inputs.analyze?.[0] || '待补充', color: '#ff6b35' },
      { dim: '团队/合伙人反应', score: 5, desc: inputs.analyze?.[1] || '待补充', color: '#0891b2' },
      { dim: '创业结构', score: 4, desc: '资源限制 / 时间压力 / 角色模糊', color: '#7c3aed' }
    ],
    actions: actions,
    nextStep: `【本周试验】${inputs.analyze?.[0] ? '调整你的互动方式，先倾听再表达' : '主动和团队沟通，不只在有问题时才找他们'}\n【判断标准】团队回应变得更开放（主动说更多信息）\n【复盘时间】建议下周一找我复盘`
  };

  let html = `
    <div class="report-header">
      <div class="report-icon">📊</div>
      <div class="report-title">麦肯锡风格创业诊断报告</div>
      <div class="report-subtitle">基于结构化分析框架 · MECE原则 · 行动导向</div>
    </div>

    <div class="report-core-conclusion">
      <h3>🎯 核心结论（金字塔顶端）</h3>
      <p>${report.coreConclusion}</p>
    </div>

    <div class="report-mece-analysis">
      <h3>📋 MECE结构化分析</h3>
      ${report.mece.map(m => `
        <div class="mece-dimension">
          <div class="mece-dim-title">${m.dim} <span style="color:${m.color}">${m.score}/10</span></div>
          <div class="mece-dim-desc">${m.desc}</div>
        </div>
      `).join('')}
    </div>

    <div class="report-impact-effort">
      <h3>📊 Impact/Effort 矩阵说明</h3>
      <div class="ie-item"><span class="ie-tag ie-p0">P0 · 快赢</span>高影响 + 低投入 → 立即可做，快速见效</div>
      <div class="ie-item"><span class="ie-tag ie-p1">P1 · 重要</span>高影响 + 高投入 → 值得规划，中期突破</div>
      <div class="ie-item"><span class="ie-tag ie-p2">P2 · 长期</span>中影响 + 高投入 → 系统变革，长期收益</div>
    </div>

    <div class="report-priority-actions">
      <h3>🚀 优先级行动（Impact/Effort矩阵）</h3>
      ${report.actions.map(a => `
        <div class="action-item">
          <div class="action-priority">${a.priority}</div>
          <div class="action-text"><strong>行动：</strong>${a.action}<br><strong>影响：</strong>${a.impact} | <strong>投入：</strong>${a.effort}</div>
        </div>
      `).join('')}
    </div>

    <div class="report-next-step">
      <h3>👣 下一步行动（actionable）</h3>
      <p>${report.nextStep.replace(/\n/g, '<br>')}</p>
    </div>

    <button class="coach-restart-btn" onclick="restartCoach()">🔄 重新对话</button>
  `;

  reportEl.innerHTML = html;
  reportEl.scrollTop = 0;
}

function buildDynamicActions(inputs) {
  const defineText = (inputs.define?.[0] || '').toLowerCase();
  const analyzeText = (inputs.analyze?.[0] || '').toLowerCase();
  const allText = defineText + ' ' + analyzeText;
  const actions = [];

  // P0 快赢
  let p0Added = false;

  if (allText.match(/焦虑|迷茫|不确定|方向/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今天找一位你信任的创业者或导师，问"我这个项目现在最大的问题是什么？"然后闭嘴听',
      impact: '用外部视角快速校准方向',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/吵架|冲突|争执|分歧/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '下次感觉要吵起来时，说"我需要冷静一下，10分钟后再聊"',
      impact: '避免冲动发言伤害合作关系',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/累|疲惫|撑不住|压力/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今晚强制22点下线，睡够7小时。创业是马拉松，不是冲刺',
      impact: '恢复精力，提升决策质量',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今晚找一位核心团队成员聊10分钟，你只问"你最近怎么样？"然后闭嘴听',
      impact: '用深度倾听快速改善团队关系',
      effort: '低'
    });
  }

  // P1 重要
  let p1Added = false;

  if (allText.match(/产品|开发|技术/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '每周做3个深度用户访谈，问"你最痛的是什么？愿意付多少钱解决这个问题？"',
      impact: '找到真正的产品市场契合点',
      effort: '中'
    });
    p1Added = true;
  }

  if (!p1Added && allText.match(/团队|招聘|管理/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '每周和一位核心团队成员1对1聊30分钟（不聊工作进度，只聊感受和困惑）',
      impact: '建立团队信任，提前发现问题',
      effort: '中'
    });
    p1Added = true;
  }

  if (!p1Added) {
    actions.push({
      priority: 'P1 · 重要',
      action: '做一次创业复盘：写下"我最近存入了什么？取走了什么？"包括自己、团队、用户三个维度',
      impact: '明确现状，指导未来行动',
      effort: '中'
    });
  }

  // P2 长期
  if (allText.match(/焦虑|迷茫|不确定|方向/)) {
    actions.push({
      priority: 'P2 · 长期',
      action: '读《精益创业》或《四步创业法》，用科学方法验证假设，减少盲目探索',
      impact: '建立系统性创业方法论',
      effort: '高'
    });
  } else if (allText.match(/团队|招聘|管理/)) {
    actions.push({
      priority: 'P2 · 长期',
      action: '读《赋能》或《团队协作的五大障碍》，系统提升团队管理能力',
      impact: '从技术创始人转型为真正的CEO',
      effort: '高'
    });
  } else {
    actions.push({
      priority: 'P2 · 长期',
      action: '参加Y Combinator或类似创业加速营，系统提升创业能力',
      impact: '全面提升创业成功率',
      effort: '高'
    });
  }

  return actions;
}

function restartCoach() {
  document.getElementById('coachReport').style.display = 'none';
  document.getElementById('coachChat').style.display = 'none';
  document.getElementById('coachIntro').style.display = 'block';
  document.getElementById('chatMessages').innerHTML = '';
}
