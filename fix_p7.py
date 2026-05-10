import re

with open(r'c:\Users\walds\WorkBuddy\Claw\slim-checkin\搭子-P7-P8.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('STORAGE.WEIGHT', 'STORAGE.PERF'),
    ("'slim_weight_p7'", "'slim_perf_p7'"),
    ('function getWeightData(', 'function getPerfData('),
    ('function saveWeightData(', 'function savePerfData('),
    ('function addWeight(', 'function addPerf('),
    ('function drawWeightChart(', 'function drawPerfChart('),
    ('function renderWeightRecords(', 'function renderPerfRecords('),
    ('function renderWeightPage(', 'function renderPerfPage('),
    ('function renderWeeklyReport(', 'function renderPerfWeeklyReport('),
    ('function shareWeeklyReport(', 'function sharePerfWeeklyReport('),
    ('getWeightData()', 'getPerfData()'),
    ('saveWeightData(', 'savePerfData('),
    ('addWeight()', 'addPerf()'),
    ('drawWeightChart(', 'drawPerfChart('),
    ('renderWeightRecords(', 'renderPerfRecords('),
    ('renderWeightPage(', 'renderPerfPage('),
    ('renderWeeklyReport(', 'renderPerfWeeklyReport('),
    ('shareWeeklyReport(', 'sharePerfWeeklyReport('),
    ('id="chartCanvas"', 'id="perfChartCanvas"'),
    ('id="chartSub"', 'id="perfChartSub"'),
    ("'chartCanvas'", "'perfChartCanvas'"),
    ('#chartCanvas', '#perfChartCanvas'),
    ('weightInput', 'perfInput'),
    ('weightRecords', 'perfRecords'),
    ('weightSummary', 'perfSummary'),
    ('weeklyReportContent', 'perfWeeklyReportContent'),
    ('shareWeeklyBtn', 'sharePerfWeeklyBtn'),
    ('Weight 记录', '绩效记录'),
    ('Weight 曲线', '绩效曲线'),
    ('Weight 历史', '绩效历史'),
    ('体重记录', '绩效记录'),
    ('体重曲线', '绩效曲线'),
    ('体重历史', '绩效历史'),
    ('weight-input', 'perf-input'),
    ('weight-records', 'perf-records'),
]

for old, new in replacements:
    count = content.count(old)
    if count > 0:
        content = content.replace(old, new)
        print(f'Replaced {count}x: {repr(old[:50])} -> {repr(new[:50])}')
    else:
        print(f'Not found: {repr(old[:50])}')

with open(r'c:\Users\walds\WorkBuddy\Claw\slim-checkin\搭子-P7-P8.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('\nDone!')
