"""批量修复搭子HTML文件的主题色"""
import re

# 每个文件的目标主题色配置
# 格式: {文件名: {旧色: 新色}}
files_config = {
    '搭子-身体财富.html': {
        '#3a7ca5': '#3de882',  # 主色
        '#2b5a7a': '#2ed573',  # 深色变体
        '#eef6fb': '#e8f8ee',  # 浅色背景
        '#f0f7fd': '#e8f8ee',  # 选中背景
        '#eef2f5': '#f0f9f4',  # 页面背景
        'rgba(58,124,165': 'rgba(61,232,130',  # 阴影
    },
    '搭子-关系财富.html': {
        '#3a7ca5': '#66bb6a',  # 主色
        '#2b5a7a': '#43a047',  # 深色变体
        '#eef6fb': '#e8f5e9',  # 浅色背景
        '#f0f7fd': '#e8f5e9',  # 选中背景
        '#eef2f5': '#f1f8e9',  # 页面背景
        'rgba(58,124,165': 'rgba(102,187,106',  # 阴影
    },
    '搭子-财务财富.html': {
        '#3a7ca5': '#ff9800',  # 主色
        '#2b5a7a': '#f57c00',  # 深色变体
        '#eef6fb': '#fff3e0',  # 浅色背景
        '#f0f7fd': '#fff8e1',  # 选中背景
        '#eef2f5': '#fff8e1',  # 页面背景
        'rgba(58,124,165': 'rgba(255,152,0',  # 阴影
        '#2e7d52': '#ff9800',  # 错误的主色
    },
    '搭子-使命财富.html': {
        '#3a7ca5': '#7c4dff',  # 主色
        '#2b5a7a': '#651fff',  # 深色变体
        '#eef6fb': '#ede7f6',  # 浅色背景
        '#f0f7fd': '#ede7f6',  # 选中背景
        '#eef2f5': '#f3e5f5',  # 页面背景
        'rgba(58,124,165': 'rgba(124,77,255',  # 阴影
    },
    '创业搭子.html': {
        '#3949ab': '#ff6b35',  # 主色
        '#1a237e': '#e55100',  # 深色变体
        '#e8eaf6': '#fff3e0',  # 浅色背景
        '#eef2ff': '#fff8e1',  # 选中背景
        'rgba(57,73,171': 'rgba(255,107,53',  # 阴影
        '#2e7d32': '#ff6b35',  # 额外的主色
    },
}

base_path = r'c:\Users\walds\WorkBuddy\Claw\slim-checkin'

for filename, replacements in files_config.items():
    filepath = f'{base_path}\\{filename}'
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        for old_color, new_color in replacements.items():
            content = content.replace(old_color, new_color)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            changed = sum(1 for old, _ in replacements.items() for _ in re.finditer(re.escape(old), original))
            print(f'[OK] {filename}: replaced {changed} occurrences')
        else:
            print(f'[--] {filename}: no changes needed')
            
    except Exception as e:
        print(f'[ER] {filename}: error - {e}')

print('\nDone!')
