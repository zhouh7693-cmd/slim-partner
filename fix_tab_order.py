# -*- coding: utf-8 -*-
import re
import os

def fix_tab_order(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 查找tab-bar section
    pattern = r'(<!-- ===== Tab Bar ===== -->\s*<div class="tab-bar">)(.*?)(</div>\s*<!-- ===== Page:)'

    def reorder_tabs(match):
        prefix = match.group(1)
        tabs_content = match.group(2)
        suffix = match.group(3)

        # 提取各个tab
        checkin = re.search(r'<div class="tab-item"[^>]*onclick="switchTab\(\'checkin\'\)">.*?</div>\s*</div>', tabs_content, re.DOTALL)
        sop = re.search(r'<div class="tab-item"[^>]*onclick="switchTab\(\'sop\'\)">.*?</div>\s*</div>', tabs_content, re.DOTALL)
        share = re.search(r'<div class="tab-item"[^>]*onclick="switchTab\(\'share\'\)">.*?</div>\s*</div>', tabs_content, re.DOTALL)
        coach = re.search(r'<div class="tab-item"[^>]*onclick="switchTab\(\'coach\'\)">.*?</div>\s*</div>', tabs_content, re.DOTALL)

        # 按新顺序重组：打卡 → SOP → 教练 → 分享
        new_tabs = ''
        if checkin:
            new_tabs += checkin.group(0) + '\n  '
        if sop:
            new_tabs += sop.group(0) + '\n  '
        if coach:
            new_tabs += coach.group(0) + '\n  '
        if share:
            new_tabs += share.group(0)

        return prefix + '\n  ' + new_tabs + suffix

    new_content = re.sub(pattern, reorder_tabs, content, flags=re.DOTALL)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"OK: {os.path.basename(file_path)}")
        return True
    else:
        print(f"--: {os.path.basename(file_path)} (no change)")
        return False

# 文件列表
files = [
    r'D:\WorkBuddy\Claw\slim-checkin\搭子-精神财富.html',
    r'D:\WorkBuddy\Claw\slim-checkin\搭子-关系财富.html',
    r'D:\WorkBuddy\Claw\slim-checkin\搭子-身体财富.html',
    r'D:\WorkBuddy\Claw\slim-checkin\搭子-财务财富.html',
    r'D:\WorkBuddy\Claw\slim-checkin\搭子-使命财富.html',
    r'D:\WorkBuddy\Claw\slim-checkin\创业搭子.html',
    r'D:\WorkBuddy\Claw\slim-checkin\陪读妈妈搭子.html',
    r'D:\WorkBuddy\Claw\slim-checkin\搭子-P7管理成长.html',
    r'D:\WorkBuddy\Claw\slim-checkin\搭子-业务Owner.html',
]

print("=== Tab顺序调整：分享 -> 最右边 ===\n")

count = 0
for f in files:
    if os.path.exists(f):
        if fix_tab_order(f):
            count += 1
    else:
        print(f"XX: {f} not found")

print(f"\nDone. {count} files modified.")
