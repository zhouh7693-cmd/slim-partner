import re

with open('搭子-P7-P8.html', encoding='utf-8') as f:
    content = f.read()

# Find all function definitions
funcs = re.findall(r'function\s+(\w+)\s*\(', content)
print('DEFINED FUNCTIONS:')
for fn in sorted(set(funcs)):
    print('  ' + fn)

# Check for autoCloseSOPGuide specifically
print('\nautoCloseSOPGuide defined:', 'autoCloseSOPGuide' in set(funcs))
print('renderShare defined:', 'renderShare' in set(funcs))
print('renderPerf defined:', 'renderPerf' in set(funcs))
print('initProgressPage defined:', 'initProgressPage' in set(funcs))
print('renderPerfPage defined:', 'renderPerfPage' in set(funcs))
print('copyShareLink defined:', 'copyShareLink' in set(funcs))

# Check for potential syntax issues - unclosed strings
lines = content.split('\n')
for i, line in enumerate(lines):
    # Check for odd number of unescaped single quotes in a line
    stripped = line.strip()
    if stripped.startswith('//') or stripped.startswith('*'):
        continue
