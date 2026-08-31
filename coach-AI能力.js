// ===== 教练功能（麦肯锡风格深度对话 · AI能力搭子）=====
let coachStep = '';
let coachSubStep = 0;
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
        coach: '嗨！我是你的AI能力教练。用麦肯锡结构化思维，帮你拆解AI学习卡点、建立可持续的AI使用习惯。\n\n请先描述你最近遇到的一个AI学习/使用难题（尽量说清楚：你想用AI做什么？卡在哪里？）：',
        keywords: { 'default': 'define1' }
      },
      {
        coach: 'DYNAMIC_QUESTIONS',
        keywords: { 'default': 'analyze0' }
      }
    ],
    analyze: [
      {
        coach: '明白。现在请描述一下：在AI学习/使用上，你具体做了什么？结果如何？\n\n（尽量客观描述行为和结果，不要自责）',
        keywords: { 'default': 'analyze1' }
      },
      {
        coach: '收到。现在让我用MECE框架拆解这个问题：\n\n【你的行为模式】{用户选择}\n【AI使用反馈】待补充\n【结构性因素】工具选择/场景缺失/时间投入\n\n请选择你想先突破的维度：\nA. 改变我的使用行为（我能控制的部分）\nB. 提升AI使用反馈（建立正反馈循环）\nC. 重构学习结构（改变工具/场景/时间安排）',
        buttons: [
          { label: 'A. 改变使用行为', value: 'A', style: 'yes' },
          { label: 'B. 提升使用反馈', value: 'B', style: '' },
          { label: 'C. 重构学习结构', value: 'C', style: 'no' }
        ],
        keywords: {
          'A|改变|行为': 'act0',
          'B|反馈|感受': 'act0',
          'C|结构|环境|工具': 'act0',
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
  msgDiv.innerHTML = `<div class="chat-avatar">${avatar}</div><div class="chat-bubble">${text.replace(/\n/g, '<br>')}</div>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  chatHistory.push({ role: role, text: text });
  if (role === 'coach') {
    if (text.indexOf('生成报告') !== -1 || text.indexOf('正在为你') !== -1) {
      const inputArea = document.getElementById('chatInputArea');
      if (inputArea) inputArea.style.display = 'none';
      const buttonsEl = document.getElementById('coachButtons');
      if (buttonsEl) buttonsEl.style.display = 'none';
      const promptEl = document.getElementById('coachPrompt');
      if (promptEl) promptEl.style.display = 'none';
      const generatingMsg = document.createElement('div');
      generatingMsg.id = 'generatingReport';
      generatingMsg.className = 'generating-report';
      generatingMsg.innerHTML = '⏳ 正在生成MECE诊断报告，请稍候...';
      const chatEl = document.getElementById('coachChat');
      if (chatEl) chatEl.appendChild(generatingMsg);
      setTimeout(generateMcKinseyReport, 1800);
    } else {
      const tree = COACH_MCKINSEY_CONFIG.dialogTree[coachStep];
      const currentNode = tree ? tree[coachSubStep] : null;
      if (currentNode && currentNode.buttons && currentNode.buttons.length) {
        showCoachButtons(currentNode.buttons);
        const inputArea = document.getElementById('chatInputArea');
        if (inputArea) inputArea.style.display = 'none';
      } else {
        hideCoachButtons();
        const inputArea = document.getElementById('chatInputArea');
        if (inputArea) inputArea.style.display = 'flex';
        const promptEl = document.getElementById('coachPrompt');
        if (promptEl) promptEl.style.display = 'block';
        const input = document.getElementById('coachInput');
        if (input) input.focus();
      }
    }
  }
}

function showCoachButtons(buttons) {
  const container = document.getElementById('coachButtons');
  const btnList = document.getElementById('coachBtnList');
  const btnPrompt = document.getElementById('coachBtnPrompt');
  if (!container || !btnList) return;
  btnList.innerHTML = '';
  buttons.forEach(btn => {
    const btnEl = document.createElement('button');
    btnEl.className = `coach-choice-btn ${btn.style || ''}`;
    btnEl.textContent = btn.label;
    btnEl.onclick = () => handleCoachButtonClick(btn.value, btn.label);
    btnList.appendChild(btnEl);
  });
  if (btnPrompt) btnPrompt.textContent = '👆 选择一个最符合你情况的选项';
  container.style.display = 'block';
}

function hideCoachButtons() {
  const container = document.getElementById('coachButtons');
  if (container) container.style.display = 'none';
}

function handleCoachButtonClick(value, label) {
  addChatMessage('user', label);
  if (!userInputs[coachStep]) userInputs[coachStep] = [];
  userInputs[coachStep].push(value);
  hideCoachButtons();
  setTimeout(() => {
    generateCoachReply(value);
  }, 800);
}

function sendCoachMsg() {
  const input = document.getElementById('coachInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  document.getElementById('coachPrompt').style.display = 'none';
  const buttonsEl = document.getElementById('coachButtons');
  if (buttonsEl) buttonsEl.style.display = 'none';
  addChatMessage('user', text);
  if (!userInputs[coachStep]) userInputs[coachStep] = [];
  userInputs[coachStep].push(text);
  setTimeout(() => {
    generateCoachReply(text);
  }, 800);
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
      return `好的，我记录了你的使用模式："${userText.substring(0, 50)}..."`;
    }
    if (subStep === 1) {
      return `很好！现在我有了你的使用模式，让我用MECE框架分析：\n【你的行为模式】${userInputs.analyze?.[0] || ''}\n→ 学习层面：可能在"收集工具"而非"解决问题"\n【AI使用反馈】${userText}\n→ 结果层面：投入产出不成正比，正反馈没有建立\n【学习结构】工具选择 / 应用场景 / 时间投入\n\n现在，你想先从哪个维度突破？\nA. 调整我的使用行为（改变自己）\nB. 提升AI使用反馈（建立新感受）\nC. 重构学习结构（改变工具和场景）`;
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

  if (text.match(/prompt|提示词|指令/)) {
    questions.push('1️⃣ 在写Prompt上，你具体怎么做的？AI给出的结果差在哪？');
  } else if (text.match(/工具|kimi|deepseek|chatgpt|选/)) {
    questions.push('1️⃣ 在选择工具上，你卡在哪里？目前用过哪几个？');
  } else if (text.match(/agent|自动化|工作流|coze|dify/)) {
    questions.push('1️⃣ 在搭Agent/自动化上，你进行到哪一步了？卡在什么环节？');
  } else if (text.match(/学|入门|不会|零基础|时间/)) {
    questions.push('1️⃣ 在学习路线上，你每天/每周投入多少时间？主要用什么方式学？');
  } else if (text.match(/焦虑|淘汰|替代|跟不上/)) {
    questions.push('1️⃣ 焦虑主要来自哪里？是信息过载，还是具体任务用不上AI？');
  } else {
    questions.push('1️⃣ 当时你做了什么？AI给出的结果和你期望差在哪？');
  }

  questions.push('2️⃣ 这个问题对你的工作/学习效率有什么具体影响？');
  questions.push('3️⃣ 你最希望的改变是什么？如果问题解决，你的工作方式会有什么不同？');

  return questions.join('\n');
}

function replacePlaceholders(text, userText) {
  if (!text) return '';
  text = text.replace(/\{用户选择\}/g, userText.substring(0, 20));
  text = text.replace(/\{场景\}/g, userInputs.define?.[0]?.substring(0, 30) || '你的AI使用场景');
  text = text.replace(/\{情绪\}/g, '挫败感');
  text = text.replace(/\{核心冲突\}/g, 'AI能力期望与当前水平的差距');
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
    coreConclusion: `【核心结论】你在"${inputs.define?.[0]?.substring(0, 50) || '最近的AI学习场景'}"中，倾向于${(inputs.analyze?.[0] || '某种使用模式').substring(0, 30)}，导致AI能力提升陷入瓶颈。根本原因在于"收集工具"多于"解决场景"，正反馈循环没有建立。`,
    mece: [
      { dim: '你的使用行为模式', score: 6, desc: inputs.analyze?.[0] || '待补充', color: '#6366f1' },
      { dim: 'AI使用反馈循环', score: 5, desc: inputs.analyze?.[1] || '待补充', color: '#0891b2' },
      { dim: '学习结构（工具/场景/时间）', score: 4, desc: '工具选择 / 应用场景缺失 / 时间投入碎片化', color: '#7c3aed' }
    ],
    actions: actions,
    nextStep: `【本周试验】${inputs.analyze?.[0] ? '选定一个高频场景（如写周报/查资料），连续5天用AI完成它并记录用时' : '每天用AI做一件小事（写邮件/搜信息/整理笔记），记录节省的时间'}\n【判断标准】能在具体场景中明显感到"更快/更好"，并说出用了哪个工具、怎么用的\n【复盘时间】建议下周一找我复盘`
  };

  let html = `
    <div class="report-header">
      <div class="report-icon">📊</div>
      <div class="report-title">麦肯锡风格AI能力诊断报告</div>
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

  if (allText.match(/prompt|提示词|指令|效果|输出/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '把今天要写的一个Prompt按「角色+任务+背景+格式」四件套重写一遍，立刻对比效果',
      impact: '马上看到结构化Prompt的质量差异，建立正反馈',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/工具|kimi|deepseek|chatgpt|选择|太多/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今天就做工具减法：保留1个对话AI+1个搜索AI，其余全部移出视线',
      impact: '终结"工具收集症"，把注意力还给真实场景',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/agent|自动化|工作流|coze|dify/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '在Coze上复刻一个最简单的Bot（自动回答3个固定问题），今晚跑通',
      impact: '用最小闭环理解Agent原理，打破"不知从哪开始"',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/焦虑|淘汰|替代|跟不上|信息/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '取关所有AI资讯源，只保留3个高质量信息源，每周日集中读30分钟',
      impact: '切断信息焦虑源头，把时间用于实践',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '明天挑一件最讨厌的重复小事（写邮件/整理笔记/查资料），用AI完成并记录节省的时间',
      impact: '用一次"快赢"建立用AI的正反馈',
      effort: '低'
    });
  }

  // P1 重要
  if (allText.match(/prompt|提示词|写作|文案/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '连续7天，每天用3种不同Prompt完成同一个任务，比较输出差异并沉淀模板',
      impact: '建立个人Prompt模板库，输出质量稳定',
      effort: '中'
    });
  } else if (allText.match(/agent|自动化|工作流/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '用Coze/Dify搭一个覆盖真实工作流的Agent（如：每日资讯汇总→摘要→推送到微信）',
      impact: '从"会用工具"升级为"能搭系统"',
      effort: '中'
    });
  } else {
    actions.push({
      priority: 'P1 · 重要',
      action: '梳理你的日常工作，列出Top3高频重复任务，逐一设计AI替代方案并连续执行2周',
      impact: '把AI嵌入工作流，效率提升可量化',
      effort: '中'
    });
  }

  // P2 长期
  if (allText.match(/变现|副业|收入|商业/)) {
    actions.push({
      priority: 'P2 · 长期',
      action: '选定AI×专业领域方向（内容/开发/培训），做一个完整的小项目并对外交付',
      impact: '把AI能力转化为可展示、可变现的成果',
      effort: '高'
    });
  } else {
    actions.push({
      priority: 'P2 · 长期',
      action: '制定3-6个月AI进阶路线：3个核心工具→Prompt工程→AI工作流→AI×专业领域',
      impact: '系统化建立AI能力体系，形成长期竞争力',
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

// ===== 路线图阶段展开/收起 + Checklist 勾选（AI搭子专属互动）=====
function aiStageToggle(el) {
  el.classList.toggle('collapsed');
  var arrow = el.querySelector('.ai-stage-arrow');
  if (arrow) arrow.textContent = el.classList.contains('collapsed') ? '▸' : '▾';
}

(function initAiCoachExtras() {
  // 路线图三阶段：绑定点击折叠
  var stages = document.querySelectorAll('#page-coach .ai-stage');
  stages.forEach(function(s) { s.addEventListener('click', function() { aiStageToggle(s); }); });

  // Checklist 勾选持久化
  var KEY = 'ai_checklist_v1';
  var items = document.querySelectorAll('#aiClkList .ai-clk-item');
  if (!items.length) return;
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { state = {}; }

  function render() {
    var done = 0;
    items.forEach(function(it, i) {
      var box = it.querySelector('.ai-clk-box');
      if (state[i]) { it.classList.add('done'); box.textContent = '☑'; done++; }
      else { it.classList.remove('done'); box.textContent = '☐'; }
    });
    var cnt = document.getElementById('aiClkCount');
    if (cnt) cnt.textContent = done;
  }

  items.forEach(function(it, i) {
    it.addEventListener('click', function() {
      state[i] = !state[i];
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
      render();
    });
  });

  render();
})();
