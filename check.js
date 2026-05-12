const fs = require('fs');
const c = fs.readFileSync('D:/WorkBuddy/Claw/slim-checkin/搭子-P7-P8.html', 'utf8');
const lines = c.split('\n');
const out = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes('confirmPartner') || l.includes('slimConfirmPartner') || l.includes('partnerSelector') || l.includes('sopGuideOverlay')) {
    out.push((i+1) + ': ' + l.trim());
  }
}
console.log(out.join('\n'));
