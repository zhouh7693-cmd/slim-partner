import re

with open('搭子-业务Owner.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到第2643行附近的重复函数并删除
# 重复内容从第2643行开始：function confirmPartner() {
# 到第2684行结束：}

# 使用精确匹配删除重复部分
duplicate = '''
function confirmPartner() {
  if (!currentPartner) { alert('请先选一个搭子'); return; }
  localStorage.setItem(STORAGE.PARTNER, JSON.stringify(currentPartner));
  document.getElementById('partnerSelector').style.display = 'none';
  document.getElementById('partnerSelectorMask').style.display = 'none';
  document.getElementById('tabBar').style.display = 'flex';
  initDashboard();
  renderSOP();
  autoCloseSOPGuide();
  switchTabDirect('chat');
  setTimeout(function() {
    appendPartnerMsg(currentPartner.emoji + ' ' + currentPartner.intro, true);
  }, 600);
}

function initDashboard() {
  if (!currentPartner) return;
  document.getElementById('partnerBadge').innerText = currentPartner.emoji + ' ' + currentPartner.name;
  var history = [];
  try { history = JSON.parse(localStorage.getItem(STORAGE.HISTORY) || '[]'); } catch(e) {}
  var today = new Date().toLocaleDateString();
  hasCheckedToday = history.some(function(d) { return d === today; });

  // calculate continuous count
  continuousCount = 0;
  var d = new Date();
  while (true) {
    var dateStr = d.toLocaleDateString();
    if (history.indexOf(dateStr) >= 0) {
      continuousCount++;
      d.setDate(d.getDate() - 1);
    } else { break; }
  }
  if (!hasCheckedToday) { continuousCount = Math.max(0, continuousCount); }

  document.getElementById('continuousCount').innerText = continuousCount;
  if (hasCheckedToday) {
    document.getElementById('checkinStatus').innerText = '✅ 已打卡';
    document.getElementById('checkinSub').innerText = '今日任务完成';
  }
  renderWeek(history);
}
'''

if duplicate in content:
    content = content.replace(duplicate, '\n', 1)  # 只替换第一次出现
    print('✅ 已删除重复函数')
else:
    print('⚠️ 未找到精确匹配，尝试模糊匹配')
    # 尝试删除第一个 confirmPartner 函数（保留第二个）
    # 找到两个 confirmPartner 的位置
    positions = [m.start() for m in re.finditer(r'function confirmPartner\(\)', content)]
    if len(positions) >= 2:
        # 删除第一个（从 positions[0] 到第二个 confirmPartner 之前）
        # 找到第一个 initDashboard 结束的位置
        pos1 = positions[0]
        # 找到第一个 initDashboard 后面的 renderWeek 函数开始位置（即重复块的结束）
        # 简化：删除从第一个 confirmPartner 到第二个 confirmPartner 之间的内容
        pos2 = positions[1]
        # 但这样会删太多... 实际上我们应该保留第一个，删除第二个
        # 重新思考：我们应该删除第二个 confirmPartner 和第二个 initDashboard
        pos1 = positions[0]  # 第一个 confirmPartner
        pos2 = positions[1]  # 第二个 confirmPartner
        print(f'找到两个 confirmPartner: {pos1} 和 {pos2}')

with open('搭子-业务Owner.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('完成')
