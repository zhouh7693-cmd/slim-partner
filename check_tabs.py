import os, re, sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

files = [f for f in os.listdir('.') if f.endswith('.html')]
ok = True

for fname in sorted(files):
    content = open(fname, encoding='utf-8', errors='ignore').read()
    
    # 找 tabs 数组
    tabs_match = re.search(r"const tabs = \[([^\]]+)\]", content)
    if not tabs_match:
        continue
    tabs_str = tabs_match.group(1)
    tabs_arr = [t.strip().strip("'\"") for t in tabs_str.split(',')]
    
    # 找 tab-bar 块 - 用 class="tab-bar" 开始到 </div> 结束
    lines = content.split('\n')
    in_tabbar = False
    depth = 0
    dom_order = []
    for line in lines:
        if 'class="tab-bar"' in line:
            in_tabbar = True
            depth = 1
            continue
        if in_tabbar:
            depth += line.count('<div') - line.count('</div')
            m = re.search(r"switchTab\('(\w+)'\)", line)
            if m:
                dom_order.append(m.group(1))
            if depth <= 0:
                in_tabbar = False
    
    if not dom_order:
        print(f"\n-- {fname}: 未找到 tab-bar 内容")
        continue
    
    mismatch = (tabs_arr != dom_order)
    status = 'OK' if not mismatch else 'MISMATCH'
    print(f"\n[{status}] {fname}")
    print(f"  tabs array : {tabs_arr}")
    print(f"  tab DOM    : {dom_order}")
    if mismatch:
        ok = False
        print(f"  !! 需要修复 tabs array !!")

print("\n" + ("全部一致" if ok else "存在不一致，需修复"))
