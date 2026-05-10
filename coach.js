// ===== 教练功能（麦肯锡风格深度对话 · 减肥搭子）=====
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
        coach: '嗨！我是你的减肥教练。用麦肯锡结构化思维，帮你拆解减肥卡点、建立可持续的饮食与运动习惯。\n\n请先描述你最近遇到的减肥卡点（尽量说清楚：你在什么情况下减不下去了？卡在哪里？）：',
        keywords: { 'default': 'define1' }
      },
      {
        coach: 'DYNAMIC_QUESTIONS',
        keywords: { 'default': 'analyze0' }
      }
    ],
    analyze: [
      {
        coach: '明白。现在请描述一下：在这个卡点场景里，你具体做了什么？身体/体重有什么反应？\n\n（尽量客观描述行为和结果，不要自责）',
        keywords: { 'default': 'analyze1' }
      },
      {
        coach: '收到。现在让我用MECE框架拆解这个问题：\n\n【你的行为模式】{用户选择}\n【身体的反馈】待补充\n【结构性因素】压力来源/时间节奏/环境触发\n\n请选择你想先突破的维度：\nA. 改变我的行为模式（我能控制的部分）\nB. 引导身体的正向反馈（建立新感受）\nC. 重构结构因素（改变环境/时间/触发链条）',
        buttons: [
          { label: 'A. 改变行为模式', value: 'A', style: 'yes' },
          { label: 'B. 引导身体反馈', value: 'B', style: '' },
          { label: 'C. 重构结构因素', value: 'C', style: 'no' }
        ],
        keywords: {
          'A|改变|行为': 'act0',
          'B|身体|反馈|感受': 'act0',
          'C|结构|环境|触发': 'act0',
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

function initCoach() {
  var ci = document.getElementById('coachIntro');
  var cc = document.getElementById('coachChat');
  var msgs = document.getElementById('chatMessages');
  var r = document.getElementById('coachReport');
  var pBar = document.getElementById('coachProgressBar');
  var ia = document.getElementById('chatInputArea');
  var btns = document.getElementById('coachButtons');
  var promptEl = document.getElementById('coachPrompt');
  if (ci) ci.style.display = 'block';
  if (cc) cc.style.display = 'none';
  if (msgs) msgs.innerHTML = '';
  if (r) r.style.display = 'none';
  if (pBar) pBar.style.display = '';
  if (ia) ia.style.display = 'none';
  if (btns) btns.style.display = 'none';
  if (promptEl) promptEl.style.display = 'none';
}

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
        if (input) { input.value = ''; input.focus(); }
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
      return '明白，我记录了这些信息。让我总结一下你的核心卡点：';
    }
  }
  if (step === 'analyze') {
    if (subStep === 0) {
      var displayText2 = userText.length > 50 ? userText.substring(0, 50) + '...' : userText;
      return '好的，我记录了你的行为模式："' + displayText2 + '"';
    }
    if (subStep === 1) {
      return '很好！现在我有了你的行为模式，让我用MECE框架分析：\n【你的行为模式】' + (userInputs.analyze ? userInputs.analyze[0] : '') + '\n→ 让你感受到：你可能太急了\n【身体的反馈】' + userText + '\n→ 让减肥陷入：努力了但看不到效果\n【结构性因素】压力来源 / 时间节奏 / 环境触发\n\n现在，你想先从哪个维度突破？\nA. 改变我的行为模式（改变自己）\nB. 引导身体的正向反馈（建立新感受）\nC. 重构结构因素（改变环境/触发链条）';
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

  if (text.match(/暴饮暴食|暴食|失控|吃多了/)) {
    questions.push('1️⃣ 暴饮暴食的时候，你吃了什么？大概多少量？');
  } else if (text.match(/平台期|卡住了|减不下去|没效果/)) {
    questions.push('1️⃣ 平台期持续多久了？之前减了多少？');
  } else if (text.match(/不运动|懒得动|不想动|没时间/)) {
    questions.push('1️⃣ 你上次运动是什么时候？是什么让你放弃了？');
  } else if (text.match(/情绪|压力大|焦虑|无聊/)) {
    questions.push('1️⃣ 情绪性进食时，你一般吃什么？吃完后的感受是什么？');
  } else if (text.match(/控制不住|诱惑|朋友|聚餐/)) {
    questions.push('1️⃣ 遇到诱惑时，你说了什么或做了什么？');
  } else {
    questions.push('1️⃣ 当时你吃了什么？大概多少量？');
  }

  questions.push('2️⃣ 吃完/没运动之后，你的感受是什么？（内疚/无所谓/后悔？）');
  questions.push('3️⃣ 如果你做了不一样的选择，你希望结果有什么不同？');

  return questions.join('\n');
}

function replacePlaceholders(text, userText) {
  if (!text) return '';
  text = text.replace(/\{用户选择\}/g, userText.substring(0, 20));
  text = text.replace(/\{场景\}/g, (userInputs.define ? userInputs.define[0] : '你的减肥场景') ? (userInputs.define ? userInputs.define[0].substring(0, 30) : '你的减肥场景') : '你的减肥场景');
  text = text.replace(/\{情绪\}/g, '不舒服');
  text = text.replace(/\{核心冲突\}/g, '减肥目标与现实的差距');
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

  var coreText = (inputs.define ? inputs.define[0] : '最近的减肥场景') ? (inputs.define ? inputs.define[0].substring(0, 50) : '最近的减肥场景') : '最近的减肥场景';
  var behaviorText = (inputs.analyze ? inputs.analyze[0] : '某种行为模式') ? (inputs.analyze ? inputs.analyze[0].substring(0, 30) : '某种行为模式') : '某种行为模式';

  var html = '<div class="report-header">'
    + '<div class="report-icon">📊</div>'
    + '<div class="report-title">麦肯锡风格减肥诊断报告</div>'
    + '<div class="report-subtitle">基于结构化分析框架 · MECE原则 · 行动导向</div>'
    + '</div>'

    + '<div class="report-core-conclusion">'
    + '<h3>🎯 核心结论（金字塔顶端）</h3>'
    + '<p>【核心结论】你在"' + coreText + '"中，倾向于' + behaviorText + '，导致减肥陷入僵局。根本原因在于行为模式形成了负向循环。</p>'
    + '</div>'

    + '<div class="report-mece-analysis">'
    + '<h3>📋 MECE结构化分析</h3>'
    + '<div class="mece-dimension"><div class="mece-dim-title">你的行为模式 <span style="color:#2e7d52">6/10</span></div><div class="mece-dim-desc">' + (inputs.analyze ? inputs.analyze[0] : '待补充') + '</div></div>'
    + '<div class="mece-dimension"><div class="mece-dim-title">身体的反馈模式 <span style="color:#0891b2">5/10</span></div><div class="mece-dim-desc">' + (inputs.analyze ? inputs.analyze[1] : '待补充') + '</div></div>'
    + '<div class="mece-dimension"><div class="mece-dim-title">结构性因素 <span style="color:#7c3aed">4/10</span></div><div class="mece-dim-desc">压力来源 / 时间节奏 / 环境触发</div></div>'
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
    + '<p>' + (inputs.analyze && inputs.analyze[0] ? '【本周试验】找到你的替代减压活动，记录每次情绪性进食的触发点' : '【本周试验】记录每天的饮食和情绪，不评判只观察') + '<br>【判断标准】情绪性进食次数减少，或精力水平提升<br>【复盘时间】建议下周一找我复盘</p>'
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

  if (allText.match(/暴饮暴食|暴食|失控|吃多了/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '找一个替代性减压活动（散步/拉伸/冷水洗脸），记在手机备忘录，下次想暴食时立刻做这件事',
      impact: '打破"压力→暴食"的条件反射',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/平台期|卡住了|减不下去/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今天换一个小指标：不是体重，而是"今天走了几步"或"喝了几杯水"',
      impact: '打破对体重的执念，建立正向反馈',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/不运动|懒得动|不想动/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今天做1个俯卧撑或站起来伸展30秒——目标小到不可能失败',
      impact: '打破"要么全有要么全无"的思维',
      effort: '极低'
    });
    p0Added = true;
  }

  if (!p0Added && allText.match(/情绪|压力大|焦虑|无聊/)) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今天找一个"5分钟情绪释放"活动（听歌/写日记/深呼吸10次），不和食物绑定',
      impact: '建立情绪调节和进食之间的防火墙',
      effort: '低'
    });
    p0Added = true;
  }

  if (!p0Added) {
    actions.push({
      priority: 'P0 · 快赢',
      action: '今晚睡前花5分钟记录今天吃的所有东西，不评判只记录',
      impact: '用数据意识快速改善饮食行为',
      effort: '低'
    });
  }

  // P1 重要
  if (allText.match(/暴饮暴食|暴食|失控|吃多了/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '连续7天记录每次暴食的触发点（前因/行为/后果），找规律',
      impact: '找到暴食的核心触发链条，针对性切断',
      effort: '中'
    });
  } else if (allText.match(/平台期|减不下去/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '把"减体重"改成"增肌/增精力"——增加蛋白质摄入，提升运动强度',
      impact: '打破平台期的能量平衡僵局',
      effort: '中'
    });
  } else if (allText.match(/情绪|压力大/)) {
    actions.push({
      priority: 'P1 · 重要',
      action: '每周做一次"情绪-饮食"日志，分析哪些情绪最容易触发暴食',
      impact: '建立情绪调节的系统性方法',
      effort: '中'
    });
  } else {
    actions.push({
      priority: 'P1 · 重要',
      action: '每餐必须有蛋白质+蔬菜，减少精制碳水，减少对血糖的刺激',
      impact: '改善饮食结构，从根本上减少暴食冲动',
      effort: '中'
    });
  }

  // P2 长期
  if (allText.match(/平台期|减不下去/)) {
    actions.push({
      priority: 'P2 · 长期',
      action: '设定非体重指标（精力水平/睡眠质量/衣服松紧度/体能表现），建立多元成功定义',
      impact: '从"体重焦虑"切换到"健康感受"',
      effort: '高'
    });
  } else if (allText.match(/暴食|失控/)) {
    actions.push({
      priority: 'P2 · 长期',
      action: '读《自控力》或《饥饿的大脑》，了解意志力的运作机制，不再把暴食归因于"意志力不够"',
      impact: '建立对大脑和行为的系统性认知',
      effort: '高'
    });
  } else {
    actions.push({
      priority: 'P2 · 长期',
      action: '找到比"瘦"更持久的内在动机：精力充沛/陪伴孩子/职业形象/远离慢性病',
      impact: '从外驱切换到内驱，减肥从任务变成生活方式',
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
