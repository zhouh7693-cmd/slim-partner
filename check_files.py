import os

files = [
    r"c:\Users\walds\WorkBuddy\Claw\slim-checkin\搭子-精神财富.html",
    r"c:\Users\walds\WorkBuddy\Claw\slim-checkin\陪读妈妈搭子.html",
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
        size = len(content)
        print(f"=== {os.path.basename(f)} ({size} bytes) ===")
        # Check for key patterns
        has_coach = 'coach' in content.lower()
        has_tab_bar = 'tab-bar' in content
        has_sop = 'sop-page' in content
        has_script = '<script' in content
        print(f"  coach: {has_coach}, tab-bar: {has_tab_bar}, sop: {has_sop}, script: {has_script}")
        # Print last 200 chars
        print(f"  LAST 200 CHARS: {repr(content[-200:])}")
        print()
