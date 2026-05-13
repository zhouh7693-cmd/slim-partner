const fs = require('fs');
const p7 = fs.readFileSync('搭子-P7-P8.html', 'utf8');
const owner = fs.readFileSync('搭子-业务Owner.html', 'utf8');

console.log('=== 搭子 Tab ===');
console.log('P7 renderChat函数:', p7.includes('function renderChat'));
console.log('Owner renderChat函数:', owner.includes('function renderChat'));
console.log('P7 onclick绑定:', (p7.match(/onclick=.renderChat\(/g) || []).length);
console.log('Owner onclick绑定:', (owner.match(/onclick=.renderChat\(/g) || []).length);
console.log('P7 quick-btn:', (p7.match(/quick-btn/g) || []).length);
console.log('Owner quick-btn:', (owner.match(/quick-btn/g) || []).length);

console.log('\n=== 自检 Tab ===');
console.log('P7 page-sop:', p7.includes('page-sop'));
console.log('Owner page-sop:', owner.includes('page-sop'));

console.log('\n=== P7 弹窗相关 ===');
console.log('P7 has openModal:', p7.includes('function openModal'));
console.log('P7 has closeModal:', p7.includes('function closeModal'));
console.log('P7 has modal-overlay:', p7.includes('modal-overlay'));
console.log('Owner has openModal:', owner.includes('function openModal'));
console.log('Owner has closeModal:', owner.includes('function closeModal'));
console.log('Owner has modal-overlay:', owner.includes('modal-overlay'));
