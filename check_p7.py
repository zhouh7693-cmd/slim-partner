import re
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open(r'D:\WorkBuddy\Claw\slim-checkin\搭子-P7-P8.html', 'r', encoding='utf-8') as f:
    content = f.read()

checks = [
    ('绩效标签', r'<div class="tab-label">绩效</div>'),
    ('P7绩效记录标题', r'📊 P7绩效记录'),
    ('绩效曲线', r'📈 绩效曲线'),
    ('管理突破副标题', r'记录你的每一次管理突破'),
    ('确认搭子按钮', r'确认搭子 →'),
    ('麦肯锡P7教练', r'麦肯锡风格P7管理教练'),
    ('P7升P8成长搭子', r'🎓 P7升P8成长搭子'),
    ('perfChartCanvas ID', r'id="perfChartCanvas"'),
    ('perfInput ID', r'id="perfInput"'),
    ('getPerfData函数', r'function getPerfData\('),
    ('addPerf函数', r'function addPerf\('),
    ('renderPerfPage函数', r'function renderPerfPage\('),
    ('drawPerfChart函数', r'function drawPerfChart\('),
    ('renderPerfRecords函数', r'function renderPerfRecords\('),
    ('STORAGE.PERF', r'STORAGE\.PERF'),
    ('slimConfirmPartner函数', r'function slimConfirmPartner\('),
    ('selectPartner函数', r'function selectPartner\('),
    ('砺行搭子卡片', r'砺行'),
    ('P7管理教练副标题', r'帮你照见管理盲区'),
]

all_ok = True
for name, pattern in checks:
    if re.search(pattern, content):
        print(f'✅ {name}')
    else:
        print(f'❌ {name} - 未找到')
        all_ok = False

print()
print('=' * 40)
if all_ok:
    print('✅ 所有16项检查通过！')
else:
    print('❌ 有检查未通过')
