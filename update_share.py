#!/usr/bin/env python3
"""
统一所有搭子分享页面为陪读妈妈模板格式
参考文件: 陪读妈妈搭子.html (#page-share)
"""
import re
import sys

BASE = r"c:\Users\walds\WorkBuddy\Claw\slim-checkin"

# 每个文件的配置
CONFIG = {
    'index': {
        'file': 'index.html',
        'theme': '#3a7ca5',
        'theme_light': '#eef6fb',
        'theme_gradient': 'linear-gradient(135deg,#eef6fb,#dbeafe)',
        'theme_btn': '#3a7ca5',
        'theme_btn_gradient': 'linear-gradient(135deg,#3a7ca5,#2e6fa0)',
        'name': '减肥搭子',
        'emoji': '🍎',
        'desc': '陪你一起健康瘦身',
        'sub': '邀请朋友一起变瘦',
        'sop_dims': [
            ('📊', '热量控制', '#3a7ca5'),
            ('💪', '运动打卡', '#2e7d32'),
            ('🌿', '习惯养成', '#f9a825'),
            ('💬', '心态管理', '#e91e63'),
            ('✨', '自我激励', '#7b1fa2'),
        ],
        'share_url': 'index.html',
        'history_key': None,  # uses getHistory()
        'get_streak': 'getStreak()',
        'get_today': 'history.some(h => h === today) ? "✅" : "-',
        'get_total': 'history.length',
        'streak_var': 'streak',
        'today_var': 'todayChecked ? "✅" : "-',
        'total_var': 'history.length',
    },
    'owner': {
        'file': '搭子-业务Owner.html',
        'theme': '#16a34a',
        'theme_light': '#f0fdf4',
        'theme_gradient': 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
        'theme_btn': '#16a34a',
        'theme_btn_gradient': 'linear-gradient(135deg,#16a34a,#22c55e)',
        'name': '业务Owner成长搭子',
        'emoji': '🌿',
        'desc': '陪你一起做真正的Owner',
        'sub': '邀请其他业务伙伴一起成长',
        'sop_dims': [
            ('🧭', 'Owner思维', '#16a34a'),
            ('📊', '数据财务', '#0284c7'),
            ('🤝', '品牌关系', '#d97706'),
            ('💬', '汇报表达', '#7c3aed'),
            ('🌿', '自我管理', '#dc2626'),
        ],
        'share_url': '搭子-业务Owner.html',
        'history_key': 'slim_history_owner',
        'streak_var': 'continuousCount',
        'today_var': 'hasCheckedToday ? "已打卡" : "未打卡"',
        'total_var': 'history.length',
    },
    'p7p8': {
        'file': '搭子-P7-P8.html',
        'theme': '#3a5fcd',
        'theme_light': '#eef2ff',
        'theme_gradient': 'linear-gradient(135deg,#eef2ff,#dbeafe)',
        'theme_btn': '#3a5fcd',
        'theme_btn_gradient': 'linear-gradient(135deg,#3a5fcd,#2563eb)',
        'name': 'P7升P8成长搭子',
        'emoji': '🎓',
        'desc': '陪你一起迈向P8',
        'sub': '邀请搭子伙伴一起成长',
        'sop_dims': [
            ('🧭', '战略思维', '#3a5fcd'),
            ('📊', '执行力', '#0284c7'),
            ('🤝', '影响力', '#d97706'),
            ('💬', '沟通力', '#7c3aed'),
            ('🌿', '自我管理', '#dc2626'),
        ],
        'share_url': '搭子-P7-P8.html',
        'history_key': 'slim_history_p7',
        'streak_var': 'continuousCount',
        'today_var': 'hasCheckedToday ? "已打卡" : "未打卡"',
        'total_var': 'history.length',
    },
    'guanxi': {
        'file': '搭子-关系力修复.html',
        'theme': '#d97706',
        'theme_light': '#fff8f0',
        'theme_gradient': 'linear-gradient(135deg,#fff8f0,#fff4ec)',
        'theme_btn': '#d97706',
        'theme_btn_gradient': 'linear-gradient(135deg,#d97706,#b45309)',
        'name': '关系力修炼搭子',
        'emoji': '🌸',
        'desc': '陪你把每段关系都变成相互成就',
        'sub': '邀请朋友一起修炼关系力',
        'sop_dims': [
            ('👂', '倾听力', '#d97706'),
            ('💬', '表达力', '#0891b2'),
            ('🤝', '共情力', '#16a34a'),
            ('🌿', '边界感', '#7c3aed'),
            ('✨', '能量感', '#db2777'),
        ],
        'share_url': '搭子-关系力修复.html',
        'history_key': 'slim_history_guanxi',
        'streak_var': 'calcStreak(history)',
        'today_var': 'history.some(h => h.date === today && h.checkin) ? "已打卡" : "未打卡"',
        'total_var': 'history.length',
    },
}

def build_share_page_html(cfg):
    """生成分享页HTML (匹配陪读妈妈模板格式)"""
    dims = cfg['sop_dims']
    dim_html = ''
    for i, (icon, name, color) in enumerate(dims):
        if i < 4:
            dim_html += f'''        <div style="background:{cfg['theme_light']};border-radius:12px;padding:12px;text-align:center;">
          <div style="font-size:24px;">{icon}</div>
          <div style="font-size:12px;font-weight:600;color:{color};">{name}</div>
        </div>'''
        else:
            dim_html += f'''        <div style="background:{cfg['theme_light']};border-radius:12px;padding:12px;text-align:center;grid-column:span 2;">
          <div style="font-size:24px;">{icon}</div>
          <div style="font-size:12px;font-weight:600;color:{color};">{name}</div>
        </div>'''

    return f'''<!-- ===== Page: 分享 (统一模板) ===== -->
<div id="page-share" class="page">
  <div class="weight-page">
    <div class="weight-header" style="text-align:center;">
      <div class="weight-title">📣 分享</div>
      <div class="weight-sub">{cfg['sub']}</div>
    </div>

    <!-- 我的状态 -->
    <div class="sop-card" style="margin-bottom:12px;">
      <div class="chart-title">🏠 我的状态</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:12px;text-align:center;">
        <div style="background:{cfg['theme_light']};border-radius:12px;padding:12px 6px;">
          <div style="font-size:20px;font-weight:700;color:{cfg['theme']};" id="shareStreak">-</div>
          <div style="font-size:11px;color:#888;margin-top:2px;">连续天数</div>
        </div>
        <div style="background:{cfg['theme_light']};border-radius:12px;padding:12px 6px;">
          <div style="font-size:20px;font-weight:700;color:{cfg['theme']};" id="shareToday">-</div>
          <div style="font-size:11px;color:#888;margin-top:2px;">今日状态</div>
        </div>
        <div style="background:{cfg['theme_light']};border-radius:12px;padding:12px 6px;">
          <div style="font-size:20px;font-weight:700;color:{cfg['theme']};" id="shareTotal">-</div>
          <div style="font-size:11px;color:#888;margin-top:2px;">总天数</div>
        </div>
      </div>
    </div>

    <!-- 搭子介绍卡片 -->
    <div class="sop-card">
      <div class="chart-title">🌸 {cfg['name']}</div>
      <div style="margin-top:12px;background:{cfg['theme_gradient']};border-radius:16px;padding:20px 16px;text-align:center;margin-bottom:16px;">
        <div style="font-size:48px;margin-bottom:8px;">{cfg['emoji']}</div>
        <div style="font-size:16px;font-weight:700;color:{cfg['theme']};margin-bottom:4px;">{cfg['name']}</div>
        <div style="font-size:13px;color:#555;line-height:1.6;margin-bottom:8px;">{cfg['desc']}<br>每天10题自检，照见真实的自己</div>
        <div style="font-size:11px;color:{cfg['theme']};">每日打卡 · 持续成长</div>
      </div>
      <div class="chart-title" style="margin-bottom:12px;">📋 SOP 复盘维度</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
{dim_html}
      </div>
      <div class="chart-title">🔗 邀请链接</div>
      <div style="background:{cfg['theme_light']};border-radius:12px;padding:12px 14px;font-size:13px;color:#555;word-break:break-all;margin-bottom:12px;" id="shareUrlDisplay"></div>
      <button onclick="copyShareLink()" style="width:100%;padding:14px;border-radius:50px;background:{cfg['theme_btn_gradient']};color:white;border:none;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px {cfg['theme_btn']}66;">📋 复制邀请链接</button>
    </div>
  </div>
</div>
'''

def update_file(cfg_key):
    cfg = CONFIG[cfg_key]
    fpath = rf"{BASE}\{cfg['file']}"
    print(f"\n{'='*60}")
    print(f"处理: {cfg['file']}")
    print(f"  主题色: {cfg['theme']}")

    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_len = len(content)

    # ===== 1. 替换分享页 HTML =====
    new_share_html = build_share_page_html(cfg)

    # 找到旧的分享页并替换
    # 模式: 从 <!-- ===== Page: 分享 ===== --> 或 <div id="sharePage" 或 <div id="page-share" 开始
    # 到下一个 <!-- ===== 或 </body> 或 </html> 结束

    share_markers = [
        '<!-- ===== Page: 分享 ===== -->',
        '<!-- ===== 分享页 ===== -->',
        '<div id="sharePage"',
        '<div id="page-share"',
    ]

    start_marker = None
    start_pos = -1
    for marker in share_markers:
        pos = content.find(marker)
        if pos >= 0:
            start_marker = marker
            start_pos = pos
            print(f"  ✓ 找到分享页起始标记: {marker[:40]}")
            break

    if start_pos < 0:
        print(f"  ❌ 无法找到分享页起始标记!")
        return False

    # 找到分享页结束位置
    rest = content[start_pos:]
    end_patterns = ['<!-- =====', '<div id="', '<script>', '</body>', '</html>']

    best_end = len(content)
    for pat in end_patterns:
        p = content.find(pat, start_pos + len(start_marker))
        if p >= 0 and p < best_end:
            # 确保不是分享页内部的内容
            # 检查这个pat之前有多少个未闭合的div（通过简单启发式）
            chunk = content[start_pos:p]
            if '<!--' in pat or pat == '</body>' or pat == '</html>':
                best_end = p
            elif pat == '<div id="':
                # 只有当这个div看起来是新的page时才算结束
                # 检查是否包含 "class="page""
                check = content[p:p+50]
                if 'page' in check and 'class' in check:
                    if p < best_end:
                        best_end = p

    # 如果没找到合适的结束点，就用下一个<!-- 或 </body>
    if best_end == len(content):
        for pat in ['<!-- =====', '</body>', '</html>']:
            p = content.find(pat, start_pos + 10)
            if p >= 0:
                best_end = p
                break

    if best_end < len(content):
        old_share = content[start_pos:best_end]
        print(f"  ✓ 找到旧分享页: {len(old_share)} 字符")
        content = content[:start_pos] + new_share_html + content[best_end:]
        print(f"  ✓ 已替换分享页 HTML")
    else:
        print(f"  ❌ 无法找到分享页结束位置!")
        # 尝试在文件末尾的 <script> 或 </body> 前插入
        # 先找 </body>
        body_pos = content.rfind('</body>')
        if body_pos >= 0:
            content = content[:body_pos] + new_share_html + '\n' + content[body_pos:]
            print(f"  ✓ 已在 </body> 前插入新分享页")
        else:
            print(f"  ❌ 无法插入分享页!")
            return False

    # ===== 2. 确保 JS 函数存在 =====
    has_render = 'function renderSharePage(' in content
    has_copy = 'function copyShareLink(' in content
    has_open = 'function openSharePage(' in content

    print(f"  JS函数: renderSharePage={has_render}, copyShareLink={has_copy}, openSharePage={has_open}")

    # 生成JS函数代码
    render_fn = f'''
// ==================== 分享页 ====================
function renderSharePage() {{
    let url = getSiteUrl() + '{cfg['share_url']}';
    let urlEl = document.getElementById('shareUrlDisplay');
    if (urlEl) urlEl.textContent = url;

    // 我的状态
    let streak = 0, total = 0, todayStr = '-';
    try {{
        let history = [];
        try {{
            history = JSON.parse(localStorage.getItem('{cfg['history_key']}')) || [];
        }} catch(e) {{ history = []; }}

        total = history.length;

        // 计算连续天数
        let d = new Date();
        let c = 0;
        for (let i = 0; i < 365; i++) {{
            let key = d.toISOString().slice(0, 10);
            let checked = history.some(h => {{
                if (typeof h === 'string') return h === key;
                if (h && h.date) return h.date === key;
                if (h && h.checkin) return true;
                return false;
            }});
            if (checked) {{
                c++;
                d.setDate(d.getDate() - 1);
            }} else {{
                if (i > 0) break;
                d.setDate(d.getDate() - 1);
            }}
        }}
        streak = c;

        // 今日状态
        let today = new Date().toISOString().slice(0, 10);
        let todayChecked = history.some(h => {{
            if (typeof h === 'string') return h === today;
            if (h && h.date) return h.date === today;
            if (h && h.checkin) return h.checkin;
            return false;
        }});
        todayStr = todayChecked ? '已打卡' : '未打卡';
    }} catch(e) {{
        console.error('renderSharePage error:', e);
    }}

    let elS = document.getElementById('shareStreak');
    let elT = document.getElementById('shareToday');
    let elTot = document.getElementById('shareTotal');
    if (elS) elS.textContent = streak + '天';
    if (elT) elT.textContent = todayStr;
    if (elTot) elTot.textContent = total;
}}

function copyShareLink() {{
    let url = getSiteUrl() + '{cfg['share_url']}';
    if (navigator.clipboard) {{
        navigator.clipboard.writeText(url).then(() => showToast('✅ 链接已复制！'));
    }} else {{
        let ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('✅ 链接已复制！');
    }}
}}

function openSharePage() {{
    let url = getSiteUrl() + '{cfg['share_url']}';
    window.open(url, '_blank');
}}
'''

    # 需要添加的函数
    fns_to_add = []
    if not has_render or not has_copy or not has_open:
        if not has_render:
            fns_to_add.append('renderSharePage()')
        if not has_copy:
            fns_to_add.append('copyShareLink()')
        if not has_open:
            fns_to_add.append('openSharePage()')
        print(f"  需要添加函数: {', '.join(fns_to_add)}")

        # 在最后一个 </script> 前插入函数
        last_script = content.rfind('</script>')
        if last_script >= 0:
            # 检查是否已存在getSiteUrl函数
            if 'function getSiteUrl(' not in content:
                get_site_url = '''
function getSiteUrl() {{
    return window.location.href.replace(/#.*$/, '').replace(/\/[^/]*$/, '/');
}}
'''
                content = content[:last_script] + get_site_url + '\n' + content[last_script:]

            content = content[:last_script] + render_fn + '\n' + content[last_script:]
            print(f"  ✓ 已添加JS函数到最后一个 </script> 前")
        else:
            print(f"  ❌ 找不到 </script> 标签!")
    else:
        print(f"  ✓ JS函数已存在")

    # ===== 3. 更新 switchTab 函数 =====
    # 确保 switchTab 中 tab === 'share' 时调用 renderSharePage
    if "tab === 'share'" in content and 'renderSharePage' in content:
        # 检查是否已经有调用
        if 'renderSharePage()' in content:
            print(f"  ✓ switchTab 中已包含 renderSharePage 调用")
        else:
            # 在 switchTab 中添加调用
            # 查找 switchTab 函数体
            # 简单处理：在 tab === 'progress' 后面加一行
            content = content.replace(
                "if (tab === 'progress') renderProgressPage();",
                "if (tab === 'progress') renderProgressPage();\n  if (tab === 'share') renderSharePage();"
            )
            print(f"  ✓ 已添加 renderSharePage 调用到 switchTab")
    else:
        print(f"  ⚠ 需要手动在 switchTab 中添加 renderSharePage 调用")

    # ===== 4. 写回文件 =====
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  ✓ 已写回文件 ({len(content)} 字符, 原 {original_len})")
    return True


def main():
    print("="*60)
    print("统一分享页面为陪读妈妈模板格式")
    print("="*60)

    results = {}
    for key in ['index', 'owner', 'p7p8', 'guanxi']:
        try:
            ok = update_file(key)
            results[key] = ok
        except Exception as e:
            print(f"  ❌ 错误: {e}")
            import traceback
            traceback.print_exc()
            results[key] = False

    print("\n" + "="*60)
    print("汇总:")
    for k, v in results.items():
        print(f"  {CONFIG[k]['file']}: {'✓ 成功' if v else '❌ 失败'}")
    print("="*60)


if __name__ == '__main__':
    main()
