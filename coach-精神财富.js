// ===== 教练功能（麦肯锡风格深度对话）=====
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
        coach: '嗨！我是你的精神财富教练。用麦肯锡结构化思维，帮你拆解精神/心理健康难题、建立内在平静与力量。\n\n请先描述你最近遇到的一个具体精神/情绪难题（尽量说清楚背景、你的状态、卡在哪里）：',
        keywords: { 'default': 'define1' }
      },
      {
        coach: 'DYNAMIC_QUESTIONS',
        keywords: { 'default': 'analyze0' }
      }
    ],
    analyze: [
      {
        coach: '明白。现在请描述一下：在这个精神/情绪场景中，你具体在想什么、感受如何？\n\n（尽量客观描述想法和感受，不要带评判）',
        keywords: { 'default': 'analyze1' }
      },
      {
        coach: '收到。现在让我用MECE框架拆解一下这个问题：\n\n【你的思维模式】{用户选择}\n【情绪/精神反馈】待补充\n【结构因素】工作压力/人际关系/生活节奏\n\n请选择你想先突破的维度：\nA. 改变我的思维模式（我能控制的部分）\nB. 改善情绪反馈（建立新的精神感受）\nC. 调整结构因素（改变环境/流程/支持系统）',
        buttons: [
          { label: 'A. 改变我的思维', value: 'A', style: 'yes' },
          { label: 'B. 改善情绪反馈', value: 'B', style: '' },
          { label: 'C. 调整结构因素', value: 'C', style: 'no' }
        ],
        keywords: {
          'A|改变|思维': 'act0',
          'B|改善|情绪|反馈': 'act0',
          'C|调整|结构': 'act0',
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
  var introEl = document.getElementById('coachIntro');
  if (introEl) introEl.style.display = 'none';
  var chatEl = document.getElementById('coachChat');
  if (chatEl) chatEl.style.display = 'block';
  var reportEl = document.getElementById('coachReport');
  if (reportEl) reportEl.style.display = 'none';
  updateProgressBar();
  var firstMsg = COACH_MCKINSEY_CONFIG.dialogTree.define[0].coach;
  addChatMessage('coach', firstMsg);
}

function updateProgressBar() {
  var steps = ['define', 'analyze', 'act'];
  steps.forEach(function(s, i) {
    var el = document.getElementById('progressStep' + (i+1));
    if (!el) return;
    if (coachStep === s) { el.classList.add('active'); }
    else { el.classList.remove('active'); }
  });
}

function addChatMessage(role, text) {
  var container = document.getElementById('chatMessages');
  if (!container) return;
  var msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg ' + role;
  var avatar = role === 'coach' ? '🎓' : '🧑';
  msgDiv.innerHTML = '<div class="chat-avatar">' + avatar + '</div><div class="chat-bubble">' + text.replace(/\n/g, '<br>') + '</div>';
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  chatHistory.push({ role: role, text: text });
  if (role === 'coach') {
    if (text.indexOf('生成报告') !== -1 || text.indexOf('正在为你') !== -1) {
      var inputArea = document.getElementById('chatInputArea');
      if (inputArea) inputArea.style.display = 'none';
      var buttonsEl = document.getElementById('coachButtons');
      if (buttonsEl) buttonsEl.style.display = 'none';
      var promptEl = document.getElementById('coachPrompt');
      if (promptEl) promptEl.style.display = 'none';
      var generatingMsg = document.createElement('div');
      generatingMsg.id = 'generatingReport';
      generatingMsg.className = 'generating-report';
      generatingMsg.innerHTML = '⏳ 正在生成MECE诊断报告，请稍候...';
      var chatEl2 = document.getElementById('coachChat');
      if (chatEl2) chatEl2.appendChild(generatingMsg);
    } else {
      var tree = COACH_MCKINSEY_CONFIG.dialogTree[coachStep];
      var currentNode = tree ? tree[coachSubStep] : null;
      if (currentNode && currentNode.buttons && currentNode.buttons.length > 0) {
        showCoachButtons(currentNode.buttons);
      } else {
        var inputArea2 = document.getElementById('chatInputArea');
        if (inputArea2) inputArea2.style.display = 'flex';
        var buttonsEl2 = document.getElementById('coachButtons');
        if (buttonsEl2) buttonsEl2.style.display = 'none';
        var promptEl2 = document.getElementById('coachPrompt');
        if (promptEl2) promptEl2.style.display = 'block';
        var input = document.getElementById('coachInput');
        if (input) input.focus();
      }
    }
  }
}

function showCoachButtons(buttons) {
  var container = document.getElementById('coachButtons');
  var btnList = document.getElementById('coachBtnList');
  var btnPrompt = document.getElementById('coachBtnPrompt');
  if (btnPrompt) btnPrompt.textContent = '请选择：';
  if (btnList) btnList.innerHTML = '';
  buttons.forEach(function(btn) {
    var btnEl = document.createElement('button');
    btnEl.className = 'coach-choice-btn ' + (btn.style || '');
    btnEl.textContent = btn.label;
    btnEl.onclick = function() { handleCoachButtonClick(btn.value, btn.label); };
    if (btnList) btnList.appendChild(btnEl);
  });
  if (container) container.style.display = 'block';
  var inputArea = document.getElementById('chatInputArea');
  if (inputArea) inputArea.style.display = 'none';
  var promptEl = document.getElementById('coachPrompt');
  if (promptEl) promptEl.style.display = 'none';
}

function handleCoachButtonClick(value, label) {
  addChatMessage('user', label);
  if (!userInputs[coachStep]) userInputs[coachStep] = [];
  userInputs[coachStep].push(value);
  setTimeout(function() { generateCoachReply(value); }, 800);
}

function sendCoachMsg() {
  var input = document.getElementById('coachInput');
  if (!input) return;
  var text = input.value.trim();
  if (!text) return;
  input.value = '';
  var promptEl = document.getElementById('coachPrompt');
  if (promptEl) promptEl.style.display = 'none';
  var buttonsEl = document.getElementById('coachButtons');
  if (buttonsEl) buttonsEl.style.display = 'none';
  addChatMessage('user', text);
  if (!userInputs[coachStep]) userInputs[coachStep] = [];
  userInputs[coachStep].push(text);
  setTimeout(function() { generateCoachReply(text); }, 800);
}

function generateCoachReply(userText) {
  var tree = COACH_MCKINSEY_CONFIG.dialogTree[coachStep];
  if (!tree) { generateMcKinseyReport(); return; }
  var currentNode = tree[coachSubStep];
  if (!currentNode) { generateMcKinseyReport(); return; }

  var ack = buildAck(coachStep, coachSubStep, userText);
  var nextStep = coachStep;
  var nextSub = coachSubStep + 1;
  var jumped = false;

  if (currentNode.keywords) {
    var matched = false;
    var entries = Object.entries(currentNode.keywords);
    for (var i = 0; i < entries.length; i++) {
      var kw = entries[i][0];
      var target = entries[i][1];
      if (kw === 'default') continue;
      var regex = new RegExp(kw, 'i');
      if (regex.test(userText)) {
        matched = true;
        var m = target.match(/^([a-z]+)(\d+)$/);
        if (m) {
          nextStep = m[1];
          nextSub = parseInt(m[2]);
        }
        jumped = true;
        break;
      }
    }
    if (!matched && currentNode.keywords.default) {
      var target2 = currentNode.keywords.default;
      var m2 = target2.match(/^([a-z]+)(\d+)$/);
      if (m2) {
        nextStep = m2[1];
        nextSub = parseInt(m2[2]);
      }
      jumped = true;
    }
  }

  if (!jumped) {
    var curTree = COACH_MCKINSEY_CONFIG.dialogTree[coachStep];
    if (!curTree || nextSub >= curTree.length) {
      var stepIdx = -1;
      for (var j = 0; j < COACH_MCKINSEY_CONFIG.steps.length; j++) {
        if (COACH_MCKINSEY_CONFIG.steps[j].id === coachStep) { stepIdx = j; break; }
      }
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

  var nextNode = COACH_MCKINSEY_CONFIG.dialogTree[nextStep] ? COACH_MCKINSEY_CONFIG.dialogTree[nextStep][nextSub] : null;
  if (!nextNode) {
    addChatMessage('coach', ack);
    generateMcKinseyReport();
    return;
  }

  var nextQ = nextNode.coach || '';
  var reply = ack;

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
      var displayText = userText.length > 50 ? userText.substring(0, 50) + '...' : userText;
      return '收到！"' + displayText + '"。让我确认几个关键点：';
    }
    if (subStep === 1) {
      return '明白，我记录了这些信息。让我总结一下你的核心问题：';
    }
  }
  if (step === 'analyze') {
    if (subStep === 0) {
      var displayText2 = userText.length > 50 ? userText.substring(0, 50) + '...' : userText;
      return '好的，我记录了你的思维模式："' + displayText2 + '"';
    }
    if (subStep === 1) {
      return '很好！现在我有了你的思维模式，让我用MECE框架分析：\n【你的思维模式】' + (userInputs.analyze ? userInputs.analyze[0] : '') + '\n→ 精神上感受到：你可能太急了\n【情绪/精神反馈】' + userText + '\n→ 让精神管理陷入：你说你的，精神做它的\n【管理结构】工作压力 / 人际关系 / 生活节奏\n\n现在，你想先从哪个维度突破？\nA. 调整我的思维模式（改变自己）\nB. 引导情绪/精神的反馈（影响感受）\nC. 重构管理结构（改变互动规则）';
    }
  }
  if (step === 'act') {
    return '你选择了：' + userText + '。现在用 Impact/Effort 矩阵给你3个行动建议：';
  }
  return '收到，谢谢分享。';
}

function generateDynamicQuestions(userText) {
  var text = userText.toLowerCase();
  var questions = [];

  if (text.match(/焦虑|紧张|压力大/)) {
    questions.push('1️⃣ 在焦虑/压力场景中，你在想什么？身体有什么反应？');
  } else if (text.match(/失眠|睡不着|熬夜/)) {
    questions.push('1️⃣ 在失眠/睡眠问题上，你在想什么？睡前习惯是什么？');
  } else if (text.match(/情绪|脾气|发脾气/)) {
    questions.push('1️⃣ 在情绪失控时，你在想什么？情绪爆发前有什么信号？');
  } else if (text.match(/空虚|迷茫|没意义/)) {
    questions.push('1️⃣ 在感到空虚/迷茫时，你在想什么？做什么来填补？');
  } else {
    questions.push('1️⃣ 当时你在想什么？有什么身体感受？');
  }

  questions.push('2️⃣ 这个问题对你的精神/情绪状态有什么具体影响？');
  questions.push('3️⃣ 你最希望的改变是什么？如果问题解决，你会是什么状态？');

  return questions.join('\n');
}

function replacePlaceholders(text, userText) {
  if (!text) return '';
  text = text.replace(/\{用户选择\}/g, userText.substring(0, 20));
  text = text.replace(/\{场景\}/g, userInputs.define ? (userInputs.define[0] ? userInputs.define[0].substring(0, 30) : '你的精神场景') : '你的精神场景');
  text = text.replace(/\{情绪\}/g, '不舒服');
  text = text.replace(/\{核心冲突\}/g, '内心期望与现实感受的差距');
  return text;
}

function generateMcKinseyReport() {
  var genEl = document.getElementById('generatingReport');
  if (genEl) genEl.remove();

  var chatEl = document.getElementById('coachChat');
  if (chatEl) chatEl.style.display = 'none';
  var reportEl = document.getElementById('coachReport');
  if (reportEl) reportEl.style.display = 'block';

  var inputs = userInputs;
  var actions = buildDynamicActions(inputs);

  var coreText = inputs.define ? (inputs.define[0] ? inputs.define[0].substring(0, 50) : '最近的精神场景') : '最近的精神场景';
  var behaviorText = inputs.analyze ? (inputs.analyze[0] ? inputs.analyze[0].substring(0, 30) : '某种思维模式') : '某种思维模式';

  var html = '<div class="report-header">'
    + '<div class="report-icon">📊</div>'
    + '<div class="report-title">麦肯锡风格精神财富诊断报告</div>'
    + '<div class="report-subtitle">基于结构化分析框架 · MECE原则 · 行动导向</div>'
    + '</div>'

    + '<div class="report-core-conclusion">'
    + '<h3>🎯 核心结论（金字塔顶端）</h3>'
    + '<p>【核心结论】你在"' + coreText + '"中，倾向于' + behaviorText + '，导致精神管理陷入僵局。根本原因在于思维模式形成了负向循环。</p>'
    + '</div>'

    + '<div class="report-mece-analysis">'
    + '<h3>📋 MECE结构化分析</h3>'
    + '<div class="mece-dimension"><div class="mece-dim-title">你的思维模式 <span style="color:#7e57c2">6/10</span></div><div class="mece-dim-desc">' + (inputs.analyze ? inputs.analyze[0] : '待补充') + '</div></div>'
    + '<div class="mece-dimension"><div class="mece-dim-title">情绪/精神反馈 <span style="color:#0891b2">5/10</span></div><div class="mece-dim-desc">' + (inputs.analyze ? inputs.analyze[1] : '待补充') + '</div></div>'
    + '<div class="mece-dimension"><div class="mece-dim-title">精神管理结构 <span style="color:#7c3aed">4/10</span></div><div class="mece-dim-desc">工作压力 / 人际关系 / 生活节奏</div></div>'
    + '</div>'

    + '<div class="report-impact-effort">'
    + '<h3>📊 Impact/Effort 矩阵说明</h3>'
    + '<div class="ie-item"><span class="ie-tag ie-p0">P0 · 快赢</span>高影响 + 低投入 → 立即可做，快速见效</div>'
    + '<div class="ie-item"><span class="ie-tag ie-p1">P1 · 重要</span>高影响 + 高投入 → 值得规划，中期突破</div>'
    + '<div class="ie-item"><span class="ie-tag ie-p2">P2 · 长期</span>中影响 + 高投入 → 系统变革，长期收益</div>'
    + '</div>'

    + '<div class="report-priority-actions">'
    + '<h3>🚀 优先级行动（Impact/Effort矩阵）</h3>'
    + actions.map(function(a) {
        return '<div class="action-item"><div class="action-priority">' + a.priority + '</div>'
          + '<div class="action-text"><strong>行动：</strong>' + a.action + '<br><strong>影响：</strong>' + a.impact + ' | <strong>投入：</strong>' + a.effort + '</div></div>';
      }).join('')
    + '</div>'

    + '<div class="report-next-step">'
    + '<h3>👣 下一步行动（actionable）</h3>'
    + '<p>' + (inputs.analyze && inputs.analyze[0] ? '【本周试验】调整你的思维方式，先观察再评判' : '【本周试验】主动记录情绪反应，不只在情绪爆发时才关注') + '<br>【判断标准】情绪回应变得更平稳（不易被触发）<br>【复盘时间】建议下周一找我复盘</p>'
    + '</div>'

    + '<button class="coach-restart-btn" onclick="restartCoach()">🔄 重新对话</button>';

  if (reportEl) reportEl.innerHTML = html;
  if (reportEl) reportEl.scrollTop = 0;
}

function buildDynamicActions(inputs) {
  var defineText = (inputs.define ? (inputs.define[0] || '') : '').toLowerCase();
  var analyzeText = (inputs.analyze ? (inputs.analyze[0] || '') : '').toLowerCase();
  var allText = defineText + ' ' + analyzeText;
  var actions = [];

  // P0 快赢
  var p0Added = false;

  if (allText.match(/焦虑|紧张|压力大/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '下次感到焦虑时，说"我现在感到焦虑，暂停3秒再说话"',
      impact: '打断焦虑循环，建立觉察能力',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/失眠|睡不着|熬夜/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今晚睡前把手机放到另一个房间（用闹钟代替）',
      impact: '减少蓝光刺激，提高睡眠质量',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/情绪|脾气|发脾气/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '发一条破冰消息："我需要冷静一下，10分钟后再聊"',
      impact: '避免情绪化发言伤害关系',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今晚睡前写3件今天让你感恩的事（具体的人/事）',
      impact: '用积极情绪抵消负面思维',
      effort: '低'
    });
  }

  // P1 重要
  if (allText.match(/焦虑|紧张|压力大/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '每周3次、每次10分钟的正念呼吸练习（用APP引导）',
      impact: '建立情绪调节能力，降低焦虑基线',
      effort: '中'
    });
  } else if (allText.match(/失眠|睡眠/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '制定睡前1小时"无屏幕时间" ritual（阅读/冥想/伸展）',
      impact: '重建健康睡眠节奏',
      effort: '中'
    });
  } else {
    actions.push({
      priority: 'P1 · 重要',
      action: '做一次精神盘点：压力源/情绪模式/能量来源，列出"消耗我的"和"滋养我的"',
      impact: '明确精神现状，指导未来行动',
      effort: '中'
    });
  }

  // P2 长期
  actions.push({
    priority: 'P2 · 长期',
    action: '读《情绪急救手册》或《穿越情绪风暴》，做笔记记录"我的情绪触发点在哪里"',
    impact: '从情绪失控模式切换到稳定模式',
    effort: '高'
  });

  return actions;
}

function restartCoach() {
  var reportEl = document.getElementById('coachReport');
  if (reportEl) reportEl.style.display = 'none';
  var chatEl = document.getElementById('coachChat');
  if (chatEl) chatEl.style.display = 'none';
  var introEl = document.getElementById('coachIntro');
  if (introEl) introEl.style.display = 'block';
  var msgEl = document.getElementById('chatMessages');
  if (msgEl) msgEl.innerHTML = '';
}
