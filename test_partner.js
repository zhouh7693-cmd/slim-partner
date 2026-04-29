const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' });
  const context = await browser.newContext();
  const page = await context.newPage();

  const pages = [
    'index.html',
    '陪读妈妈搭子.html',
    '搭子-身体财富.html',
    '搭子-财务财富.html',
    '搭子-精神财富.html',
    '搭子-关系财富.html',
    '搭子-使命财富.html',
  ];

  for (const filename of pages) {
    await page.goto(`http://localhost:7788/${filename}`);
    await page.waitForTimeout(500);

    // Find the partner tab button
    const tabs = await page.$$('.tab-item');
    const tabCount = tabs.length;
    
    // Click partner tab (try to find it by text or index)
    let partnerTabIndex = -1;
    for (let i = 0; i < tabs.length; i++) {
      const text = await tabs[i].textContent();
      if (text && text.includes('搭子')) {
        partnerTabIndex = i;
        break;
      }
    }

    if (partnerTabIndex === -1) {
      console.log(`[${filename}] No partner tab found (${tabCount} tabs total)`);
      continue;
    }

    await tabs[partnerTabIndex].click();
    await page.waitForTimeout(1000);

    // Check if page-partner is visible
    const pagePartner = await page.$('#page-partner');
    if (!pagePartner) {
      console.log(`[${filename}] No #page-partner element`);
      continue;
    }

    const display = await pagePartner.evaluate(el => el.style.display);
    const hasActive = await pagePartner.evaluate(el => el.classList.contains('active'));
    const rect = await pagePartner.boundingBox();
    
    const partnerChatArea = await page.$('#partnerChatArea');
    const chatHtml = partnerChatArea ? await partnerChatArea.innerHTML() : 'NOT FOUND';
    
    console.log(`[${filename}] partner tab #${partnerTabIndex}/${tabCount} | display=${display} active=${hasActive} visible=${rect ? 'YES' : 'NO (rect=null)'} | chatArea=${chatHtml.slice(0, 80)}`);
  }

  await browser.close();
})();
