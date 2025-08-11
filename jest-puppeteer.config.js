/**
 * Puppeteer Configuration for 감자토끼 가계부
 * Korean font support and optimal browser settings
 */

module.exports = {
  launch: {
    headless: process.env.CI ? 'new' : false,
    devtools: !process.env.CI,
    slowMo: process.env.CI ? 0 : 50,
    timeout: 30000,
    
    // Korean font support
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--font-render-hinting=none',
      '--disable-font-subpixel-positioning',
      '--disable-lcd-text',
      // Korean fonts
      '--font-family=Kanit,"Malgun Gothic",Dotum,AppleGothic,sans-serif'
    ],
    
    defaultViewport: {
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: true,
      isMobile: false
    }
  },
  
  browserContext: 'default',
  
  server: {
    command: 'node server.js',
    port: 3000,
    launchTimeout: 30000,
    debug: !process.env.CI,
    
    options: {
      env: {
        NODE_ENV: 'test'
      }
    }
  }
};