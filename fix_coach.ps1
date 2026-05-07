# fix_coach.ps1 - 用PowerShell修复教练页面

$enc = 'UTF8'

# ===== 1. P7-P8：删除旧教练JS =====
$p7file = "搭子-P7-P8.html"
$content = Get-Content $p7file -Raw -Encoding UTF8

# 删除 COACH_QS_P7 数组
$content = $content -replace 'var COACH_QS_P7\s*=\s*\[.*?\];', ''

# 删除 coachStateP7
$content = $content -replace 'var coachStateP7\s*=\s*\{.*?\};', ''

# 删除 initCoach 函数（含换行）
$content = $content -replace 'function initCoach\(\)\s*\{.*?var r = document\.getElementById\(['']coachReport['']\);', 'var r = document.getElementById(''coachReport')'

# 添加 script 标签（在 </body> 前）
if ($content -notmatch 'coach-P7-P8.js') {
    $content = $content -replace '</body>', '<script src="coach-P7-P8.js"></script>' + "`n" + '</body>'
}

Set-Content $p7file -Value $content -Encoding UTF8
Write-Host "P7-P8 处理完成"

# ===== 2. 业务Owner：添加教练CSS + 替换HTML + 删除旧JS + 添加script =====
$owFile = "搭子-业务Owner.html"
$content = Get-Content $owFile -Raw -Encoding UTF8

# 添加教练CSS（在 </style> 前）
$coachCss = @"
  /* ===== 教练页面（麦肯锡风格） ===== */
  .coach-intro { background: white; border-radius: 32px; padding: 32px 24px; margin-bottom: 16px; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .coach-intro-icon { font-size: 56px; margin-bottom: 16px; }
  .coach-intro-title { font-size: 22px; font-weight: 800; background: linear-gradient(135deg, #16a34a, #15803d); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 8px; }
  .coach-intro-sub { font-size: 14px; color: #6c7a89; margin-bottom: 24px; }
  .coach-method-steps { display: flex; gap: 12px; margin-bottom: 28px; }
  .method-step { flex: 1; background: #f0fdf4; border-radius: 16px; padding: 14px 8px; font-size: 13px; font-weight: 700; color: #16a34a; line-height: 1.5; }
  .step-num { display: block; font-size: 20px; margin-bottom: 4px; }
  .step-desc { font-size: 11px; font-weight: 500; color: #15803d; }
  .coach-intro-note { font-size: 11px; color: #8f9eae; margin-top: 16px; }
  .coach-start-btn { margin-top: 18px; width: 100%; padding: 14px; border-radius: 60px; border: none; background: linear-gradient(135deg, #16a34a, #15803d); color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.15s; }
  .coach-start-btn:active { transform: scale(0.97); }
  .coach-chat { background: white; border-radius: 32px; padding: 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .coach-progress-bar { display: flex; gap: 8px; margin-bottom: 20px; }
  .progress-step { flex: 1; text-align: center; font-size: 11px; font-weight: 700; color: #8f9eae; padding: 8px 4px; border-radius: 12px; background: #f5f5f5; transition: all 0.3s; line-height: 1.4; }
  .progress-step.active { background: #f0fdf4; color: #16a34a; }
  .chat-messages { max-height: 380px; overflow-y: auto; margin-bottom: 16px; padding: 8px; }
  .chat-msg { margin-bottom: 16px; animation: msgIn 0.3s ease; }
  .chat-msg.coach { display: flex; gap: 8px; align-items: flex-start; }
  .chat-msg.user { display: flex; gap: 8px; align-items: flex-start; flex-direction: row-reverse; }
  .chat-avatar { font-size: 28px; flex-shrink: 0; }
  .chat-bubble { max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.6; color: #2b3a4a; }
  .chat-msg.coach .chat-bubble { background: #f0fdf4; border-radius: 18px 18px 18px 4px; }
  .chat-msg.user .chat-bubble { background: linear-gradient(135deg, #16a34a, #15803d); color: white; border-radius: 18px 18px 4px 18px; }
  .chat-input-area { display: flex; gap: 8px; align-items: flex-end; }
  .chat-input-area textarea { flex: 1; padding: 12px 16px; border-radius: 16px; border: 1.5px solid #e9edf2; font-size: 14px; resize: none; outline: none; font-family: inherit; min-height: 44px; }
  .chat-send-btn { padding: 12px 20px; border-radius: 16px; border: none; background: linear-gradient(135deg, #16a34a, #15803d); color: white; font-size: 14px; font-weight: 700; cursor: pointer; flex-shrink: 0; }
  .chat-send-btn:active { transform: scale(0.97); }
  .coach-prompt { text-align: center; color: #16a34a; font-size: 13px; font-weight: 600; padding: 8px; animation: coachPulse 2s infinite; }
  @keyframes coachPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .generating-report { text-align: center; color: #0891b2; font-size: 14px; font-weight: 600; padding: 16px; animation: coachBlink 1.5s infinite; }
  @keyframes coachBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .coach-buttons { padding: 12px 16px; background: #fafafa; border-top: 1px solid #e5e7eb; }
  .coach-btn-prompt { font-size: 13px; color: #6b7280; margin-bottom: 10px; text-align: center; }
  .coach-btn-list { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .coach-choice-btn { flex: 1; min-width: 120px; max-width: 180px; padding: 12px 16px; border: 2px solid #16a34a; background: white; color: #16a34a; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .coach-choice-btn:hover { background: #16a34a; color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(22,163,74,0.3); }
  .coach-choice-btn.yes { border-color: #22c55e; color: #22c55e; }
  .coach-choice-btn.yes:hover { background: #22c55e; color: white; }
  .coach-choice-btn.no { border-color: #ef4444; color: #ef4444; }
  .coach-choice-btn.no:hover { background: #ef4444; color: white; }
  .coach-report-mckinsey { background: white; border-radius: 32px; padding: 28px 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .report-header { text-align: center; margin-bottom: 24px; }
  .report-icon { font-size: 48px; margin-bottom: 12px; }
  .report-title { font-size: 20px; font-weight: 800; color: #2b3a4a; margin-bottom: 4px; }
  .report-subtitle { font-size: 12px; color: #8f9eae; }
  .report-core-conclusion { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 20px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #16a34a; }
  .report-core-conclusion h3 { font-size: 15px; font-weight: 700; color: #16a34a; margin-bottom: 8px; }
  .report-core-conclusion p { font-size: 14px; color: #2b3a4a; line-height: 1.6; }
  .report-mece-analysis { margin-bottom: 20px; }
  .report-mece-analysis h3 { font-size: 15px; font-weight: 700; color: #2b3a4a; margin-bottom: 12px; }
  .mece-dimension { background: #f0fdf4; border-radius: 16px; padding: 14px; margin-bottom: 10px; }
  .mece-dim-title { font-size: 14px; font-weight: 700; color: #16a34a; margin-bottom: 6px; }
  .mece-dim-desc { font-size: 13px; color: #6c7a89; line-height: 1.5; }
  .report-priority-actions { margin-bottom: 20px; }
  .report-priority-actions h3 { font-size: 15px; font-weight: 700; color: #2b3a4a; margin-bottom: 12px; }
  .action-item { background: white; border-radius: 16px; padding: 14px; margin-bottom: 8px; border-left: 4px solid #16a34a; }
  .action-priority { font-size: 11px; font-weight: 700; color: #16a34a; margin-bottom: 4px; }
  .action-text { font-size: 14px; color: #2b3a4a; line-height: 1.5; }
  .report-next-step { background: #f0fdf4; border-radius: 16px; padding: 16px; margin-bottom: 20px; }
  .report-next-step h3 { font-size: 15px; font-weight: 700; color: #16a34a; margin-bottom: 8px; }
  .report-next-step p { font-size: 14px; color: #2b3a4a; line-height: 1.6; }
  .coach-restart-btn { width: 100%; padding: 14px; border-radius: 60px; border: 2px solid #16a34a; background: white; color: #16a34a; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 12px; }
  .coach-restart-btn:active { background: #f0fdf4; }
  @keyframes msgIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
"@

if ($content -match '</style>' -and $content -notmatch 'coach-intro') {
    $content = $content -replace '</style>', ($coachCss + "`n  </style>")
}

# 替换教练页面 HTML
$oldCoachHtml = '<!-- ===== 教练页面 ===== -->'
$newCoachHtml = '<!-- ===== 教练页面（麦肯锡风格） ===== -->'
$content = $content -replace $oldCoachHtml, $newCoachHtml

# 删除旧教练JS
$content = $content -replace 'var COACH_QS_OWNER\s*=\s*\[.*?\];', ''
$content = $content -replace 'var coachStateOwner\s*=\s*\{.*?\};', ''
$content = $content -replace 'function startCoachDialogOwner\(\)\s*\{.*?\}', ''
$content = $content -replace 'function showCoachBubbleOwner\(.*?\}', ''
$content = $content -replace 'function sendCoachMsg\(\)\s*\{.*?\}', ''
$content = $content -replace 'function showCoachReportOwner\(\)\s*\{.*?\}', ''

# 添加 script 标签
if ($content -notmatch 'coach-业务Owner.js') {
    $content = $content -replace '</body>', '<script src="coach-业务Owner.js"></script>' + "`n" + '</body>'
}

Set-Content $owFile -Value $content -Encoding UTF8
Write-Host "业务Owner 处理完成"

Write-Host "全部处理完成！"
