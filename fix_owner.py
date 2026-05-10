# -*- coding: utf-8 -*-
import codecs

# Read with explicit UTF-8
with codecs.open('搭子-业务Owner.html', 'r', 'utf-8') as f:
    lines = f.readlines()

print(f'Before: {len(lines)} lines')

# Lines 2643-2684 in 1-indexed = 2642-2683 in 0-indexed
# Delete those lines (keep everything else)
new_lines = lines[:2642] + lines[2684:]

print(f'After: {len(new_lines)} lines')

with codecs.open('搭子-业务Owner.html', 'w', 'utf-8') as f:
    f.writelines(new_lines)

print('Done')
