/* ============================================
   减肥搭子 - 麦肯锡教练对话逻辑 (coach-weight.js)
   基于 coach.js 创业版改写，替换所有减肥相关内容
   ============================================ */

// 减肥版对话配置
var COACH_WEIGHT_CONFIG = {
  steps: [
    { id: 'define', name: '界定问题' },
    { id: 'analyze', name: '结构化分析' },
    { id: 'act', name: '优先级行动' }
  ],
  define: [
    {
      coach: '嗨！我是你的减肥教练 🎯\n\n用麦肯锡结构化思维，帮你拆解减肥卡点、找到真正能坚持的行动方案。\n\n请先描述你最近的减肥状态或挑战（比如：最近减了多少？卡在哪里了？）：',
      keywords: { 'default': 'define1' }
    },
    {
      coach: '明白了。我来帮你梳理一下。\n\n① 你觉得目前最大的拦路虎是什么？比如：\n· 应酬太多控制不住\n· 运动坚持不下来\n· 总是暴饮暴食\n· 平台期很久不掉秤\n· 不知道该怎么吃\n\n选一个或直接描述：',
      keywords: { 'default': 'analyze0' }
    }
  ],
  analyze: [
    {
      coach: '很好！现在用MECE框架帮你拆解——\n\n【热量层面】\n你目前一天的饮食大概是什么水平？（正常吃/偏多/经常大吃）\n\n【运动层面】\n你目前的运动习惯如何？（几乎不动/偶尔动/每周3次以上）\n\n【习惯层面】\n你减肥失败通常发生在什么场景？（晚上/周末/压力大/社交场合）\n\n请依次回答，或者直接说你认为最关键的问题：',
      keywords: { 'default': 'analyze1' }
    }
  ],
  act: [
    {
      coach: '好的，你提供了很好的信息！\n\n现在用 Impact/Effort 矩阵，给你3个最值得优先行动的减肥建议：\n\n请告诉我，你最想从哪个方向先突破？\n\nA. 先调整饮食（改变吃什么）\nB. 先增加运动（改变动多少）\nC. 先改善习惯（改变什么时候吃/怎么吃）',
      keywords: {
        'A|饮食|吃什么': 'act0',
        'B|运动|动多少': 'act0',
        'C|习惯|时间': 'act0',
        'default': 'act0'
      }
    }
  ]
};

// 减肥搭子教练状态变量
var coachStep = 'define';
var coachSubStep = 0;
var chatHistory = [];
var userInputs = {};
var reportData = null;

// 渲染减肥版介绍卡
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
  renderProgressBar();
}

// 开始减肥教练对话
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
  var ia = document.getElementById('chatInputArea');
  if (ia) ia.style.display = '';
  var btns = document.getElementById('coachButtons');
  if (btns) btns.style.display = 'none';
  renderProgressBar();
  var msgs = document.getElementById('chatMessages');
  if (msgs) msgs.innerHTML = '';
  // 发送教练开场白
  var config = COACH_WEIGHT_CONFIG;
  var stepData = config[coachStep][coachSubStep];
  var firstMsg = stepData ? stepData.coach : config.define[0].coach;
  addCoachMsg(firstMsg);
  var prompt = document.getElementById('coachPrompt');
  if (prompt) { prompt.style.display = 'block'; prompt.innerHTML = '💡 请在下方输入框中回复，按 Enter 发送'; }
}

// 渲染进度条（减肥版）
function renderProgressBar() {
  var config = COACH_WEIGHT_CONFIG;
  var steps = config.steps;
  var bar = document.getElementById('coachProgressBar');
  if (!bar) return;
  bar.innerHTML = '';
  for (var i = 0; i < steps.length; i++) {
    var s = steps[i];
    var el = document.createElement('div');
    el.className = 'progress-step';
    el.id = 'progressStep' + (i + 1);
    el.textContent = (i + 1) + '. ' + s.name;
    if (coachStep === s.id) el.classList.add('active');
    bar.appendChild(el);
  }
}

// 添加教练消息
function addCoachMsg(text) {
  var msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  var div = document.createElement('div');
  div.className = 'chat-msg coach';
  div.innerHTML = '<div class="chat-bubble">' + escapeHtml(text).replace(/\n/g, '<br>') + '</div>';
  msgs.appendChild(div);
  chatHistory.push({ role: 'coach', text: text });
  scrollToBottom();
}

// 添加用户消息
function addUserMsg(text) {
  var msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  var div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = '<div class="chat-bubble">' + escapeHtml(text) + '</div>';
  msgs.appendChild(div);
  chatHistory.push({ role: 'user', text: text });
  scrollToBottom();
}

// 发送消息（减肥版）
function sendCoachMsg() {
  var input = document.getElementById('coachInput');
  if (!input) return;
  var text = input.value.trim();
  if (!text) return;
  addUserMsg(text);
  input.value = '';
  // 保存用户输入
  if (!userInputs[coachStep]) userInputs[coachStep] = [];
  userInputs[coachStep].push(text);
  // 隐藏输入区，显示加载
  var ia = document.getElementById('chatInputArea');
  if (ia) ia.style.display = 'none';
  var gen = document.getElementById('generatingReport');
  if (gen) gen.style.display = '';
  var btns = document.getElementById('coachButtons');
  if (btns) btns.style.display = 'none';
  setTimeout(function() {
    processCoachInput(text);
  }, 1200);
}

// 处理教练输入（减肥版）
function processCoachInput(userText) {
  var gen = document.getElementById('generatingReport');
  if (gen) gen.style.display = 'none';
  var config = COACH_WEIGHT_CONFIG;
  var step = coachStep;
  var isLastInStep = coachSubStep >= config[step].length - 1;

  if (step === 'define') {
    if (isLastInStep) {
      coachStep = 'analyze';
      coachSubStep = 0;
    } else {
      coachSubStep++;
    }
  } else if (step === 'analyze') {
    if (isLastInStep) {
      coachStep = 'act';
      coachSubStep = 0;
    } else {
      coachSubStep++;
    }
  } else if (step === 'act') {
    if (isLastInStep) {
      showWeightReport();
      return;
    } else {
      coachSubStep++;
    }
  }

  var stepData = config[coachStep][coachSubStep];
  var response = '';
  if (step === 'act' && coachSubStep === 0) {
    // 提取用户选择
    var choice = userText.toUpperCase();
    userInputs.act = userInputs.act || [];
    userInputs.act.push(userText);
    var choiceText = choice.includes('A') ? '调整饮食（改变吃什么）' :
                      choice.includes('B') ? '增加运动（改变动多少）' :
                      choice.includes('C') ? '改善习惯（改变什么时候吃/怎么吃）' : userText;
    response = buildWeightActResponse(choiceText);
  } else if (stepData) {
    response = stepData.coach;
  }
  addCoachMsg(response);
  var ia = document.getElementById('chatInputArea');
  if (ia) ia.style.display = '';
  renderProgressBar();
}

// 构建行动响应（减肥版）
function buildWeightActResponse(userText) {
  return '你选择了：' + userText + '。\n\n接下来我给你3个根据你的情况定制的行动建议，这些都来自 Impact/Effort 矩阵，优先做高影响、低投入的行动！\n\n（正在为你生成个性化报告...）';
}

// 生成减肥诊断报告
function showWeightReport() {
  var chatEl = document.getElementById('coachChat');
  if (chatEl) chatEl.style.display = 'none';
  var progressBar = document.getElementById('coachProgressBar');
  if (progressBar) progressBar.style.display = 'none';
  var report = buildWeightReport();
  var reportEl = document.getElementById('coachReport');
  if (reportEl) {
    reportEl.innerHTML = report;
    reportEl.style.display = '';
  }
}

// 构建减肥报告HTML
function buildWeightReport() {
  var inputs = userInputs;
  var defineText = inputs.define ? inputs.define.join(' ') : '';
  var analyzeText = inputs.analyze ? inputs.analyze.join(' ') : '';
  var actChoice = inputs.act ? inputs.act[inputs.act.length - 1] : '';
  var actions = buildWeightActions(inputs);
  var themeColor = '#3a7ca5';

  var core = '【核心发现】你在减肥中主要卡在：' + getMainBlock(inputs) + '。' +
    '根本原因往往不是"意志力不够"，而是策略不对或环境设计不合理。';

  var analyses = [
    { title: '热量平衡', score: 6, desc: getHeatDesc(inputs), color: '#ef4444' },
    { title: '运动习惯', score: 4, desc: getExerciseDesc(inputs), color: '#3b82f6' },
    { title: '习惯设计', score: 5, desc: getHabitDesc(inputs), color: '#10b981' }
  ];

  return `<div class="report-title">麦肯锡风格减肥诊断报告</div>
<div class="report-subtitle">基于结构化分析框架 · MECE原则 · 行动导向</div>
<div class="report-core-conclusion">${core}</div>
<h3>📋 MECE结构化分析</h3>
<div class="report-analysis-grid">
${analyses.map(function(a) {
  var stars = '★'.repeat(a.score) + '☆'.repeat(10 - a.score);
  return '<div class="analysis-dim"><div class="dim-name">' + a.title + '</div><div class="dim-stars" style="color:' + a.color + '">' + stars + '</div><div class="dim-desc">' + a.desc + '</div></div>';
}).join('')}
</div>
<div class="report-impact-effort">
<h3>📊 Impact/Effort 矩阵说明</h3>
<div style="font-size:12px;color:#666;line-height:1.8;">
<div>🟢 <strong>高影响+低投入</strong> = 立即做 | 🔵 <strong>高影响+高投入</strong> = 规划做 | ⚪ <strong>低影响+低投入</strong> = 随手做 | 🔴 <strong>低影响+高投入</strong> = 跳过</div>
</div>
</div>
<div class="report-priority-actions">
<h3>🚀 优先级行动（Impact/Effort矩阵）</h3>
${actions.map(function(a) {
  return '<div class="action-item"><div class="action-priority" style="color:' + a.color + '">' + a.label + '</div><div class="action-text"><strong>行动：</strong>' + a.action + '<br><strong>影响：</strong>' + a.impact + ' | <strong>投入：</strong>' + a.effort + '</div></div>';
}).join('')}
</div>
<h3>👣 下一步行动（actionable）</h3>
<div class="report-next-step">
<div>【本周试验】${getNextStep(inputs)}</div>
<div style="margin-top:8px;font-size:12px;color:#888;">【判断标准】${getJudgment(inputs)}</div>
<div style="margin-top:8px;font-size:12px;color:#888;">【复盘时间】建议3天后回来复盘，我会问你：这3天执行得怎么样？</div>
</div>
<button class="coach-restart-btn" onclick="restartCoach()">🔄 重新开始教练对话</button>`;
}

// 获取主要卡点
function getMainBlock(inputs) {
  var text = (inputs.define || []).join(' ');
  if (text.includes('暴食') || text.includes('控制不住')) return '饮食控制';
  if (text.includes('运动') || text.includes('坚持')) return '运动习惯';
  if (text.includes('平台') || text.includes('不掉')) return '减脂瓶颈';
  if (text.includes('不知道') || text.includes('怎么吃')) return '饮食结构';
  return '综合卡点（需要全面调整）';
}

// 热量描述
function getHeatDesc(inputs) {
  var text = (inputs.analyze || []).join(' ');
  if (text.includes('多') || text.includes('大')) return '热量摄入偏高，需要先做减法';
  if (text.includes('正常')) return '热量基本合理，突破口在结构';
  return '需要记录3天饮食，找出血糖峰值食物';
}

// 运动描述
function getExerciseDesc(inputs) {
  var text = (inputs.analyze || []).join(' ');
  if (text.includes('几乎不动')) return '运动量为零，先从每天5分钟开始';
  if (text.includes('偶尔')) return '运动不规律，需要建立固定习惯';
  return '运动习惯良好，瓶颈可能在强度';
}

// 习惯描述
function getHabitDesc(inputs) {
  var text = (inputs.analyze || []).join(' ');
  if (text.includes('晚上')) return '夜间进食是主要漏洞，优化晚餐结构';
  if (text.includes('压力')) return '情绪性进食，需要找到替代出口';
  if (text.includes('社交')) return '社交场景进食，设计"提前吃饱"策略';
  if (text.includes('周末')) return '周末自律放松，需要提前设计周末方案';
  return '习惯层面需要具体场景的具体设计';
}

// 获取下一步
function getNextStep(inputs) {
  var text = (inputs.act || []).join('');
  if (text.includes('A') || text.includes('饮食')) return '今天开始记录饮食，不评判，只是观察';
  if (text.includes('B') || text.includes('运动')) return '今天做一次5分钟运动，不追求强度，只建立连接';
  return '选择一个最容易突破的场景，今天设计一个"不费意志力"的解决方案';
}

// 获取判断标准
function getJudgment(inputs) {
  return '连续3天做到→本周成功 | 做不到→复盘原因，下周调整方案而不是放弃目标';
}

// 构建动态行动（减肥版）
function buildWeightActions(inputs) {
  var actText = (inputs.act || []).join('');
  var defineText = (inputs.define || []).join(' ').toLowerCase();
  var analyzeText = (inputs.analyze || []).join(' ').toLowerCase();
  var allText = defineText + ' ' + analyzeText + ' ' + actText;
  var actions = [];

  if (allText.includes('暴') || allText.includes('控制')) {
    actions.push({
      label: '🟢 高影响·低投入', color: '#22c55e',
      action: '每餐先吃300g绿叶蔬菜，再吃蛋白质，最后吃主食。蔬菜先填胃，自然减少主食量',
      impact: '显著降低餐后血糖峰值，减少饥饿感', effort: '5分钟/每餐'
    });
    actions.push({
      label: '🔵 高影响·高投入', color: '#3b82f6',
      action: '连续3天记录所有入口食物（不用算热量，只需记录品类），找出最高频的"血糖刺客"',
      impact: '建立饮食觉知，找出真正需要戒断的食物', effort: '10分钟/天'
    });
    actions.push({
      label: '⚪ 低影响·低投入', color: '#6b7280',
      action: '把家里的零食换成：小番茄、黄瓜、低糖酸奶。没有 willpower 问题，因为根本没买',
      impact: '减少冲动进食机会，降低环境触发', effort: '5分钟'
    });
  } else if (allText.includes('运动') || allText.includes('坚持')) {
    actions.push({
      label: '🟢 高影响·低投入', color: '#22c55e',
      action: '找一个"5分钟就够"的运动（拉伸、原地跑、爬楼梯），设计成"做完才洗澡"的触发仪式',
      impact: '消除运动的心理门槛，建立微习惯', effort: '5分钟/天'
    });
    actions.push({
      label: '🔵 高影响·高投入', color: '#3b82f6',
      action: '每周找一个固定时间段运动（不要靠意志力，要靠日程表），连续4周后形成生物钟',
      impact: '运动从"要做"变成"到点就做"', effort: '30分钟×3次/周'
    });
    actions.push({
      label: '⚪ 低影响·低投入', color: '#6b7280',
      action: '用站立开会、走路接电话、饭后散步5分钟等"不需要换衣服"的运动填充碎片时间',
      impact: '增加日常消耗，减少久坐危害', effort: '随时可做'
    });
  } else {
    // 默认综合行动
    actions.push({
      label: '🟢 高影响·低投入', color: '#22c55e',
      action: '每餐前喝一杯300ml水，等待2分钟再开始吃。这一步看起来简单，但对控制总量极其有效',
      impact: '减少约15%的总摄入量，无额外成本', effort: '2分钟/天3次'
    });
    actions.push({
      label: '🔵 高影响·高投入', color: '#3b82f6',
      action: '今晚早睡30分钟。睡眠不足是减肥失败的第一大隐形原因（影响饥饿素和瘦素）',
      impact: '改善激素环境，第二天自然减少零食摄入', effort: '提前30分钟上床'
    });
    actions.push({
      label: '⚪ 低影响·低投入', color: '#6b7280',
      action: '吃饭时放下手机，用筷子而不是勺子吃（减慢速度），每口咀嚼20次以上',
      impact: '增加饱腹感，减少不知不觉吃多的情况', effort: '随时可做'
    });
  }
  return actions;
}

// 重启教练
function restartCoach() {
  coachStep = 'define';
  coachSubStep = 0;
  chatHistory = [];
  userInputs = {};
  var reportEl = document.getElementById('coachReport');
  if (reportEl) reportEl.style.display = 'none';
  var chatEl = document.getElementById('coachChat');
  if (chatEl) chatEl.style.display = 'block';
  var progressBar = document.getElementById('coachProgressBar');
  if (progressBar) progressBar.style.display = '';
  var msgs = document.getElementById('chatMessages');
  if (msgs) msgs.innerHTML = '';
  initCoach();
}

// 辅助函数
function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function scrollToBottom() {
  var msgs = document.getElementById('chatMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}
