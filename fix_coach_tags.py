import re

# 1. P7-P8.html: 删除旧教练JS，添加script引用
with open('搭子-P7-P8.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 删除 COACH_QS_P7 注释块和 initCoach 函数
marker = '// ===== Page: 数据记录（绩效）====='
idx = content.find(marker)
if idx > 0:
    # 找前面的 // ===== 教练功能 ===== 开始位置
    prev_marker = content.rfind('// ===== 教练功能 =====', 0, idx)
    if prev_marker >= 0:
        content = content[:prev_marker] + marker + content[idx+len(marker):]
        print('P7-P8: 已删除旧教练JS块')
    else:
        print('P7-P8: 未找到教练功能标记')
else:
    print('P7-P8: 未找到数据记录标记')

# 删除switchTab里的 initCoach() 调用
content = content.replace(
    "if (tab === 'coach' && coachPg) { initCoach(); }",
    "if (tab === 'coach' && coachPg) { }"
)
print('P7-P8: 已清理switchTab中的initCoach调用')

# 添加coach-p7-p8.js引用
if 'coach-p7-p8.js' not in content:
    content = content.replace('</body>', '  <script src="coach-p7-p8.js"></script>\n</body>')
    print('P7-P8: 已添加coach-p7-p8.js引用')

with open('搭子-P7-P8.html', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. 业务Owner.html: 删除COACH_QS_OWNER数组，添加script引用
with open('搭子-业务Owner.html', 'r', encoding='utf-8') as f:
    content2 = f.read()

marker2 = '// ===== 进展页面初始化 ====='
idx2 = content2.find(marker2)
if idx2 > 0:
    prev_marker2 = content2.rfind('// ===== 教练功能 =====', 0, idx2)
    if prev_marker2 >= 0:
        content2 = content2[:prev_marker2] + marker2 + content2[idx2+len(marker2):]
        print('业务Owner: 已删除COACH_QS_OWNER数组')

with open('搭子-业务Owner.html', 'w', encoding='utf-8') as f:
    f.write(content2)

# 添加coach-business-owner.js引用
if 'coach-business-owner.js' not in content2:
    content2 = content2.replace('</body>', '  <script src="coach-business-owner.js"></script>\n</body>')
    with open('搭子-业务Owner.html', 'w', encoding='utf-8') as f:
        f.write(content2)
    print('业务Owner: 已添加coach-business-owner.js引用')

# 3. 减肥搭子index.html: 添加coach-weight.js引用
with open('index.html', 'r', encoding='utf-8') as f:
    content3 = f.read()

if 'coach-weight.js' not in content3:
    content3 = content3.replace('</body>', '  <script src="coach-weight.js"></script>\n</body>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content3)
    print('减肥搭子: 已添加coach-weight.js引用')
else:
    print('减肥搭子: coach-weight.js引用已存在')

# 4. 关系力搭子: 调整教练tab顺序（放到搭子后面），添加script引用
with open('搭子-关系力.html', 'r', encoding='utf-8') as f:
    content4 = f.read()

# 把教练tab按钮移到搭子tab后面
old_tabs_order = '切换至搭子">搭子</button>\n        <button class="tab-btn"'
new_tabs_order = '切换至搭子">搭子</button>\n        <button class="tab-btn" data-tab="coach" onclick="switchTab(\'coach\')" style="display:none;">教练</button>\n        <button class="tab-btn"'

if 'data-tab="coach"' not in content4 or content4.find('data-tab="coach"') > content4.find('data-tab="chat"'):
    # 教练tab在搭子后面，需要调整
    # 先找到并删除原来的教练tab
    content4 = re.sub(r'\n\s*<button class="tab-btn" data-tab="coach"[^>]*>教练</button>', '', content4)
    # 在搭子tab后面插入
    content4 = content4.replace(
        '切换至搭子">搭子</button>',
        '切换至搭子">搭子</button>\n        <button class="tab-btn" data-tab="coach" onclick="switchTab(\'coach\')">教练</button>'
    )
    print('关系力: 已将教练tab移到搭子后面')
else:
    print('关系力: 教练tab顺序已正确')

# 修正idxMap
content4 = content4.replace(
    "const idxMap = { chat:0, sop:1, checkin:2, data:3, progress:4, share:5, coach:6 };",
    "const idxMap = { chat:0, coach:1, sop:2, checkin:3, data:4, progress:5, share:6 };"
)
print('关系力: 已修正idxMap（教练=1）')

# 添加coach-relationship.js引用
if 'coach-relationship.js' not in content4:
    content4 = content4.replace('</body>', '  <script src="coach-relationship.js"></script>\n</body>')
    print('关系力: 已添加coach-relationship.js引用')

with open('搭子-关系力.html', 'w', encoding='utf-8') as f:
    f.write(content4)

print('\n✅ 全部处理完成')
