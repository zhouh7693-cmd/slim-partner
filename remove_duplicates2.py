with open('搭子-业务Owner.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'总行数: {len(lines)}')

# 重复内容在第2643-2684行（1-indexed），即 2642-2683（0-indexed）
# 删除这些行
start = 2642  # 0-indexed (第2643行)
end = 2684     # 0-indexed (第2685行之前，即2684)
del lines[start:end]

print(f'删除后行数: {len(lines)}')

with open('搭子-业务Owner.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('✅ 已删除重复函数（第2643-2684行）')
