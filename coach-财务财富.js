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
        coach: '嗨！我是你的财务财富教练。用麦肯锡结构化思维，帮你拆解财务管理难题、建立可持续的财富积累习惯。\n\n请先描述你最近遇到的一个具体财务难题（尽量说清楚背景、你的目标、卡在哪里）：',
        keywords: { 'default': 'define1' }
      },
      {
        coach: 'DYNAMIC_QUESTIONS',
        keywords: { 'default': 'analyze0' }
      }
    ],
    analyze: [
      {
        coach: '明白。现在请描述一下：在这个财务场景中，你具体做了什么决策、结果如何？\n\n（尽量客观描述行为和结果，不要带评判）',
        keywords: { 'default': 'analyze1' }
      },
      {
        coach: '收到。现在让我用MECE框架拆解一下这个问题：\n\n【你的决策模式】{用户选择}\n【财务反馈】待补充\n【结构因素】收入结构/支出习惯/环境因素\n\n请选择你想先突破的维度：\nA. 改变我的决策模式（我能控制的部分）\nB. 改善财务反馈（建立新的财富感受）\nC. 调整结构因素（改变环境/流程/支持系统）',
        buttons: [
          { label: 'A. 改变我的决策', value: 'A', style: 'yes' },
          { label: 'B. 改善财务反馈', value: 'B', style: '' },
          { label: 'C. 调整结构因素', value: 'C', style: 'no' }
        ],
        keywords: {
          'A|改变|决策': 'act0',
          'B|改善|反馈|财务': 'act0',
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
      var chatEl = document.getElementById('coachChat');
      if (chatEl) chatEl.appendChild(generatingMsg);
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
      return '好的，我记录了你的决策模式："' + displayText2 + '"';
    }
    if (subStep === 1) {
      return '很好！现在我有了你的决策模式，让我用MECE框架分析：\n【你的决策模式】' + (userInputs.analyze ? userInputs.analyze[0] : '') + '\n→ 让财务感受到：你可能太急了\n【财务的反馈】' + userText + '\n→ 让财富管理陷入：你说你的，财务做它的\n【管理结构】收入结构 / 支出习惯 / 环境因素\n\n现在，你想先从哪个维度突破？\nA. 调整我的决策模式（改变自己）\nB. 引导财务的反馈（影响财富感受）\nC. 重构管理结构（改变互动规则）';
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

  if (text.match(/花钱|消费|剁手|买买买/)) {
    questions.push('1️⃣ 在消费决策上，你说了什么或做了什么？财务数据如何回应？');
  } else if (text.match(/存钱|储蓄|攒钱/)) {
    questions.push('1️⃣ 在储蓄计划上，你说了什么或做了什么？存款数据如何回应？');
  } else if (text.match(/投资|理财|股票|基金/)) {
    questions.push('1️⃣ 在投资决策上，你说了什么或做了什么？投资回报如何回应？');
  } else if (text.match(/债务|信用卡|贷款/)) {
    questions.push('1️⃣ 在债务管理上，你说了什么或做了什么？债务数据如何回应？');
  } else {
    questions.push('1️⃣ 当时你说了什么或做了什么？财务有什么反应？');
  }

  questions.push('2️⃣ 这个问题对你的财富/财务状态有什么具体影响？');
  questions.push('3️⃣ 你最希望的改变是什么？如果问题解决，你的财务状况会有什么不同？');

  return questions.join('\n');
}

function replacePlaceholders(text, userText) {
  if (!text) return '';
  text = text.replace(/\{用户选择\}/g, userText.substring(0, 20));
  text = text.replace(/\{场景\}/g, (userInputs.define ? userInputs.define[0] : '你的财务场景') ? (userInputs.define ? userInputs.define[0].substring(0, 30) : '你的财务场景') : '你的财务场景');
  text = text.replace(/\{情绪\}/g, '不舒服');
  text = text.replace(/\{核心冲突\}/g, '财务期望与现实的差距');
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

  var coreText = (inputs.define ? inputs.define[0] : '最近的财务场景') ? (inputs.define ? inputs.define[0].substring(0, 50) : '最近的财务场景') : '最近的财务场景';
  var behaviorText = (inputs.analyze ? inputs.analyze[0] : '某种决策模式') ? (inputs.analyze ? inputs.analyze[0].substring(0, 30) : '某种决策模式') : '某种决策模式';

  var html = '<div class="report-header">'
    + '<div class="report-icon">📊</div>'
    + '<div class="report-title">麦肯锡风格财务财富诊断报告</div>'
    + '<div class="report-subtitle">基于结构化分析框架 · MECE原则 · 行动导向</div>'
    + '</div>'

    + '<div class="report-core-conclusion">'
    + '<h3>🎯 核心结论（金字塔顶端）</h3>'
    + '<p>【核心结论】你在"' + coreText + '"中，倾向于' + behaviorText + '，导致财富管理陷入僵局。根本原因在于决策模式形成了负向循环。</p>'
    + '</div>'

    + '<div class="report-mece-analysis">'
    + '<h3>📋 MECE结构化分析</h3>'
    + '<div class="mece-dimension"><div class="mece-dim-title">你的决策模式 <span style="color:#2e7d52">6/10</span></div><div class="mece-dim-desc">' + (inputs.analyze ? inputs.analyze[0] : '待补充') + '</div></div>'
    + '<div class="mece-dimension"><div class="mece-dim-title">财务的反馈模式 <span style="color:#0891b2">5/10</span></div><div class="mece-dim-desc">' + (inputs.analyze ? inputs.analyze[1] : '待补充') + '</div></div>'
    + '<div class="mece-dimension"><div class="mece-dim-title">财富管理结构 <span style="color:#7c3aed">4/10</span></div><div class="mece-dim-desc">收入结构 / 支出习惯 / 环境因素</div></div>'
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
    + '<p>' + (inputs.analyze && inputs.analyze[0] ? '【本周试验】调整你的决策方式，先倾听财务的感受' : '【本周试验】主动记录财务反应，不只在账单出来时才关注') + '<br>【判断标准】财务回应变得更正向（存款增加、投资回报稳定）<br>【复盘时间】建议下周一找我复盘</p>'
    + '</div>'

    + '<button class="coach-restart-btn" onclick="restartCoach()">🔄 重新对话</button>';

  if (reportEl) reportEl.innerHTML = html;
  if (reportEl) reportEl.scrollTop = 0;
}

function buildDynamicActions(inputs) {
  var defineText = (inputs.define ? inputs.define[0] : '').toLowerCase();
  var analyzeText = (inputs.analyze ? inputs.analyze[0] : '').toLowerCase();
  var allText = defineText + ' ' + analyzeText;
  var actions = [];

  // P0 快赢
  var p0Added = false;

  if (allText.match(/花钱|消费|剁手|买买买/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '明天消费前先问自己："这个消费让我离目标更近还是更远？"',
      impact: '建立消费意识，打破冲动循环',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/存钱|储蓄|攒钱/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今天把储蓄目标写在显眼地方（手机壁纸/冰箱贴）',
      impact: '用视觉提醒强化储蓄意愿',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/投资|理财|股票|基金/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今晚睡前把明天的投资观察清单写下来（具体标的和原因）',
      impact: '减少情绪化投资决策',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今晚花10分钟记录今天的每一笔支出（用APP或纸条）',
      impact: '用数据意识快速改善财务行为',
      effort: '低'
    });
  }

  // P1 重要
  if (allText.match(/花钱|消费|剁手/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '连续7天记录支出（用拍照或APP），分析哪类消费最容易失控',
      impact: '找到消费失控的关键场景，针对性设计',
      effort: '中'
    });
  } else if (allText.match(/投资|理财/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '制定每周1次、每次30分钟的投资学习计划（固定时间固定内容）',
      impact: '建立稳定投资能力，不靠运气',
      effort: '中'
    });
  } else {
    actions.push({
      priority: 'P1 · 重要',
      action: '做一次财富盘点：收入/支出/资产/负债，列出"做得好的"和"需要改变的"',
      impact: '明确财富现状，指导未来行动',
      effort: '中'
    });
  }

  // P2 长期
  if (allText.match(/投资|理财|股票|基金/)) {
    actions.push({
      priority: 'P2 · 长期',
      action: '读《穷查理宝典》或《聪明的投资者》，每周1-2章，刻意练习书中的投资思维',
      impact: '建立系统性财富认知',
      effort: '高'
    });
  } else {
    actions.push({
      priority: 'P2 · 长期',
      action: '参加财富管理课程/工作坊（线上或线下），系统提升财富管理能力',
      impact: '全面提升财富管理质量',
      effort: '高'
    });
  }

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
