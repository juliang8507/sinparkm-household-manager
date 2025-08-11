const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const viewports = [
    { name: '360px', width: 360, height: 640 },
    { name: '414px', width: 414, height: 896 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1280px', width: 1280, height: 720 },
    { name: '1920px', width: 1920, height: 1080 }
  ];
  
  const themes = ['light', 'dark'];
  
  console.log('📸 Taking final validation screenshots...');
  
  for (const viewport of viewports) {
    await page.setViewport(viewport);
    await page.goto('http://localhost:5173/index.html', { waitUntil: 'networkidle0' });
    
    for (const theme of themes) {
      // Switch theme
      await page.evaluate((themeName) => {
        document.documentElement.setAttribute('data-theme', themeName);
      }, theme);
      
      await page.waitForTimeout(500); // Theme transition
      
      const filename = `final-validation-${viewport.name}-${theme}.png`;
      await page.screenshot({ 
        path: path.join('tests', 'screenshots', filename),
        fullPage: true 
      });
      
      console.log(`✅ ${filename}`);
    }
  }
  
  await browser.close();
  console.log('📸 Screenshot validation complete');
})().catch(console.error);