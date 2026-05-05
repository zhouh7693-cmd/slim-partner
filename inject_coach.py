#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""为关系财富和使命财富注入教练功能"""
import sys
sys.path.insert(0, r'D:\WorkBuddy\Claw\slim-checkin')
import add_coach

# 关系财富
add_coach.add_coach_to_file(
    filepath=r'D:\WorkBuddy\Claw\slim-checkin\搭子-关系财富.html',
    theme_color='#66bb6a',
    theme_color_dark='#2e7d32',
    page_title='关系财富搭子',
    coach_name='麦肯锡风格关系财富教练',
    dialog_config_js=''  # 使用默认麦肯锡对话树
)

# 使命财富
add_coach.add_coach_to_file(
    filepath=r'D:\WorkBuddy\Claw\slim-checkin\搭子-使命财富.html',
    theme_color='#7c4dff',
    theme_color_dark='#6a1b9a',
    page_title='使命财富搭子',
    coach_name='麦肯锡风格使命财富教练',
    dialog_config_js=''  # 使用默认麦肯锡对话树
)

print('教练功能注入完成！')
