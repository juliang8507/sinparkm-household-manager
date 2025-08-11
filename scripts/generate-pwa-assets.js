/**
 * 감자토끼 가계부 - PWA 아이콘 및 스플래시 스크린 자동 생성 스크립트
 * Node.js 스크립트로 다양한 크기의 PWA 아이콘과 스플래시 이미지를 생성합니다.
 */

const fs = require('fs');
const path = require('path');

// 필요한 의존성 확인 및 설치 안내
const checkDependencies = () => {
  const requiredPackages = ['canvas', 'sharp'];
  const missingPackages = [];

  requiredPackages.forEach(pkg => {
    try {
      require.resolve(pkg);
    } catch (e) {
      missingPackages.push(pkg);
    }
  });

  if (missingPackages.length > 0) {
    console.log('❌ 필요한 패키지가 없습니다. 다음 명령어로 설치하세요:');
    console.log(`npm install ${missingPackages.join(' ')}`);
    process.exit(1);
  }
};

// 의존성 확인
checkDependencies();

const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

class PWAAssetGenerator {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
    this.assetsDir = path.join(this.baseDir, 'assets');
    this.iconsDir = path.join(this.assetsDir, 'icons');
    this.splashDir = path.join(this.assetsDir, 'splash');
    
    // PWA 아이콘 크기 정의
    this.iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    
    // 스플래시 스크린 크기 정의 (iOS 및 Android)
    this.splashSizes = [
      { width: 320, height: 568, name: 'iphone5' },      // iPhone 5/SE
      { width: 375, height: 667, name: 'iphone6' },      // iPhone 6/7/8
      { width: 414, height: 736, name: 'iphone6plus' },  // iPhone 6/7/8 Plus
      { width: 375, height: 812, name: 'iphonex' },      // iPhone X/XS
      { width: 414, height: 896, name: 'iphonexr' },     // iPhone XR/11
      { width: 768, height: 1024, name: 'ipad' },        // iPad
      { width: 1024, height: 1366, name: 'ipadpro' },    // iPad Pro
      { width: 360, height: 640, name: 'android-small' }, // Android Small
      { width: 412, height: 732, name: 'android-medium' }, // Android Medium
      { width: 360, height: 780, name: 'android-large' }  // Android Large
    ];

    // 테마별 색상 정의
    this.themes = {
      light: {
        primary: '#1FC7D4',
        background: '#FAF9FA',
        text: '#280D5F'
      },
      dark: {
        primary: '#33E1ED', 
        background: '#0E0E0E',
        text: '#FFFFFF'
      },
      hc: {
        primary: '#0066CC',
        background: '#FFFFFF',
        text: '#000000'
      }
    };
  }

  async initialize() {
    // 디렉토리 생성
    await this.ensureDirectories();
    console.log('✅ 디렉토리 구조 생성 완료');
  }

  async ensureDirectories() {
    const dirs = [this.assetsDir, this.iconsDir, this.splashDir];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 디렉토리 생성: ${path.relative(this.baseDir, dir)}`);
      }
    }
  }

  /**
   * 감자토끼 캐릭터 아이콘 생성 (Canvas 기반)
   */
  async generateCharacterIcon(size, theme = 'light') {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const colors = this.themes[theme];

    // 배경 원형
    const center = size / 2;
    const radius = size * 0.4;

    // 그라디언트 배경
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, this.lightenColor(colors.primary, 20));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();

    // 감자 캐릭터 (좌측)
    const potatoSize = size * 0.15;
    ctx.fillStyle = '#D4A574'; // 감자 색상
    ctx.beginPath();
    ctx.ellipse(center - size * 0.12, center - size * 0.05, potatoSize, potatoSize * 0.8, 0, 0, 2 * Math.PI);
    ctx.fill();

    // 토끼 캐릭터 (우측)  
    const rabbitSize = size * 0.15;
    ctx.fillStyle = '#F0F0F0'; // 토끼 색상
    ctx.beginPath();
    ctx.ellipse(center + size * 0.12, center - size * 0.05, rabbitSize, rabbitSize * 0.8, 0, 0, 2 * Math.PI);
    ctx.fill();

    // 토끼 귀
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath();
    ctx.ellipse(center + size * 0.08, center - size * 0.15, size * 0.03, size * 0.08, -0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(center + size * 0.16, center - size * 0.15, size * 0.03, size * 0.08, 0.3, 0, 2 * Math.PI);
    ctx.fill();

    // 웃는 표정 추가 (간단한 점)
    ctx.fillStyle = colors.text;
    // 감자 눈
    ctx.beginPath();
    ctx.arc(center - size * 0.15, center - size * 0.08, size * 0.01, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(center - size * 0.09, center - size * 0.08, size * 0.01, 0, 2 * Math.PI);
    ctx.fill();

    // 토끼 눈  
    ctx.beginPath();
    ctx.arc(center + size * 0.09, center - size * 0.08, size * 0.01, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(center + size * 0.15, center - size * 0.08, size * 0.01, 0, 2 * Math.PI);
    ctx.fill();

    // 하단 텍스트 (크기가 클 때만)
    if (size >= 128) {
      ctx.fillStyle = colors.text;
      ctx.font = `bold ${size * 0.08}px 'Kanit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('가계부', center, center + size * 0.25);
    }

    return canvas;
  }

  /**
   * PWA 아이콘 생성
   */
  async generateIcons() {
    console.log('🎨 PWA 아이콘 생성 중...');
    
    for (const size of this.iconSizes) {
      const canvas = await this.generateCharacterIcon(size, 'light');
      const buffer = canvas.toBuffer('image/png');
      const filename = `icon-${size}x${size}.png`;
      const filepath = path.join(this.iconsDir, filename);
      
      fs.writeFileSync(filepath, buffer);
      console.log(`✅ 생성: ${filename}`);
    }

    // 파비콘도 생성 (16x16, 32x32)
    const faviconSizes = [16, 32];
    for (const size of faviconSizes) {
      const canvas = await this.generateCharacterIcon(size, 'light');
      const buffer = canvas.toBuffer('image/png');
      const filename = `favicon-${size}x${size}.png`;
      const filepath = path.join(this.iconsDir, filename);
      
      fs.writeFileSync(filepath, buffer);
      console.log(`✅ 생성: ${filename}`);
    }
  }

  /**
   * 스플래시 스크린 생성
   */
  async generateSplashScreens() {
    console.log('🎨 스플래시 스크린 생성 중...');

    for (const theme of Object.keys(this.themes)) {
      console.log(`📱 ${theme} 테마 스플래시 스크린 생성...`);
      
      for (const size of this.splashSizes) {
        const canvas = await this.generateSplashScreen(size.width, size.height, theme);
        const buffer = canvas.toBuffer('image/png');
        const filename = `splash-${size.name}-${theme}.png`;
        const filepath = path.join(this.splashDir, filename);
        
        fs.writeFileSync(filepath, buffer);
        console.log(`✅ 생성: ${filename}`);
      }
    }
  }

  /**
   * 스플래시 스크린 Canvas 생성
   */
  async generateSplashScreen(width, height, theme = 'light') {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const colors = this.themes[theme];

    // 배경 그라디언트
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, colors.background);
    gradient.addColorStop(1, this.lightenColor(colors.background, theme === 'dark' ? -10 : 10));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 중앙 아이콘 영역
    const centerX = width / 2;
    const centerY = height / 2 - height * 0.1;
    const iconSize = Math.min(width, height) * 0.2;

    // 아이콘 배경 원형
    const iconRadius = iconSize * 0.6;
    const iconGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, iconRadius);
    iconGradient.addColorStop(0, colors.primary);
    iconGradient.addColorStop(1, this.lightenColor(colors.primary, 20));

    ctx.fillStyle = iconGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, iconRadius, 0, 2 * Math.PI);
    ctx.fill();

    // 캐릭터 그리기 (간소화)
    const charSize = iconSize * 0.15;
    
    // 감자 (좌측)
    ctx.fillStyle = '#D4A574';
    ctx.beginPath();
    ctx.ellipse(centerX - iconSize * 0.12, centerY - iconSize * 0.05, charSize, charSize * 0.8, 0, 0, 2 * Math.PI);
    ctx.fill();

    // 토끼 (우측)
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath();
    ctx.ellipse(centerX + iconSize * 0.12, centerY - iconSize * 0.05, charSize, charSize * 0.8, 0, 0, 2 * Math.PI);
    ctx.fill();

    // 토끼 귀
    ctx.beginPath();
    ctx.ellipse(centerX + iconSize * 0.08, centerY - iconSize * 0.15, iconSize * 0.03, iconSize * 0.08, -0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + iconSize * 0.16, centerY - iconSize * 0.15, iconSize * 0.03, iconSize * 0.08, 0.3, 0, 2 * Math.PI);
    ctx.fill();

    // 앱 제목
    const titleSize = Math.min(width, height) * 0.06;
    ctx.fillStyle = colors.text;
    ctx.font = `bold ${titleSize}px 'Kanit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('감자토끼 가계부', centerX, centerY + iconSize * 0.8);

    // 부제목
    const subtitleSize = Math.min(width, height) * 0.035;
    ctx.font = `${subtitleSize}px 'Kanit', sans-serif`;
    ctx.fillStyle = this.lightenColor(colors.text, theme === 'dark' ? 40 : -40);
    ctx.fillText('Potato & Rabbit Budget', centerX, centerY + iconSize * 1.1);

    // 로딩 인디케이터
    const loadingY = height * 0.85;
    const dotSize = Math.min(width, height) * 0.01;
    const dotSpacing = dotSize * 4;
    
    ctx.fillStyle = colors.primary;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX + (i - 1) * dotSpacing, loadingY, dotSize, 0, 2 * Math.PI);
      ctx.fill();
    }

    return canvas;
  }

  /**
   * 숏컷 아이콘 생성
   */
  async generateShortcutIcons() {
    console.log('🔗 앱 숏컷 아이콘 생성 중...');

    const shortcuts = [
      { name: 'income', character: 'rabbit', color: '#31D0AA', symbol: '+' },
      { name: 'expense', character: 'potato', color: '#FFB237', symbol: '-' },
      { name: 'history', character: 'both', color: '#7645D9', symbol: '📊' }
    ];

    for (const shortcut of shortcuts) {
      const canvas = await this.generateShortcutIcon(96, shortcut);
      const buffer = canvas.toBuffer('image/png');
      const filename = `shortcut-${shortcut.name}.png`;
      const filepath = path.join(this.iconsDir, filename);
      
      fs.writeFileSync(filepath, buffer);
      console.log(`✅ 생성: ${filename}`);
    }
  }

  async generateShortcutIcon(size, config) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    const center = size / 2;
    const radius = size * 0.4;

    // 배경 원형
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, config.color);
    gradient.addColorStop(1, this.lightenColor(config.color, 20));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();

    // 캐릭터 기반 디자인
    if (config.character === 'rabbit') {
      // 토끼
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath();
      ctx.ellipse(center, center - size * 0.05, size * 0.15, size * 0.12, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // 귀
      ctx.beginPath();
      ctx.ellipse(center - size * 0.08, center - size * 0.15, size * 0.03, size * 0.08, -0.3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(center + size * 0.08, center - size * 0.15, size * 0.03, size * 0.08, 0.3, 0, 2 * Math.PI);
      ctx.fill();
      
    } else if (config.character === 'potato') {
      // 감자
      ctx.fillStyle = '#D4A574';
      ctx.beginPath();
      ctx.ellipse(center, center - size * 0.05, size * 0.15, size * 0.12, 0, 0, 2 * Math.PI);
      ctx.fill();
      
    } else {
      // 둘 다 (작게)
      ctx.fillStyle = '#D4A574';
      ctx.beginPath();
      ctx.ellipse(center - size * 0.06, center - size * 0.05, size * 0.08, size * 0.06, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath();
      ctx.ellipse(center + size * 0.06, center - size * 0.05, size * 0.08, size * 0.06, 0, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 심볼
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${size * 0.15}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(config.symbol, center, center + size * 0.2);

    return canvas;
  }

  /**
   * 색상 밝기 조절 유틸리티
   */
  lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }

  /**
   * HTML 파일들에 매니페스트 링크 추가
   */
  async updateHTMLFiles() {
    console.log('📝 HTML 파일 매니페스트 링크 업데이트...');
    
    const htmlFiles = ['index.html', 'transaction-form.html', 'transaction-history.html', 'meal-planning.html'];
    
    for (const filename of htmlFiles) {
      const filepath = path.join(this.baseDir, filename);
      
      if (fs.existsSync(filepath)) {
        let content = fs.readFileSync(filepath, 'utf8');
        
        // 매니페스트 링크가 없으면 추가
        if (!content.includes('rel="manifest"')) {
          const manifestLink = '    <link rel="manifest" href="manifest.json">\n';
          content = content.replace('</head>', manifestLink + '</head>');
          fs.writeFileSync(filepath, content);
          console.log(`✅ 업데이트: ${filename}`);
        }
      }
    }
  }

  /**
   * 전체 생성 프로세스 실행
   */
  async generateAll() {
    console.log('🚀 PWA 에셋 생성 시작...\n');
    
    try {
      await this.initialize();
      await this.generateIcons();
      await this.generateSplashScreens();
      await this.generateShortcutIcons();
      await this.updateHTMLFiles();
      
      console.log('\n✅ PWA 에셋 생성 완료!');
      console.log('📁 생성된 파일:');
      console.log(`   - 아이콘: ${this.iconsDir}`);
      console.log(`   - 스플래시: ${this.splashDir}`);
      console.log(`   - 매니페스트: ${path.join(this.baseDir, 'manifest.json')}`);
      
    } catch (error) {
      console.error('❌ 에셋 생성 중 오류 발생:', error);
      process.exit(1);
    }
  }
}

// 스크립트가 직접 실행될 때 자동 실행
if (require.main === module) {
  const generator = new PWAAssetGenerator();
  generator.generateAll();
}

module.exports = PWAAssetGenerator;