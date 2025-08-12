/**
 * 🥔🐰 감자토끼 가계부 - Netlify 빌드 최적화 스크립트
 * 정적 파일 최적화 및 배포 준비
 */

const fs = require('fs').promises;
const path = require('path');

class NetlifyBuildOptimizer {
    constructor() {
        this.rootDir = process.cwd();
        this.optimizedFiles = [];
    }

    async optimize() {
        console.log('🚀 Netlify 빌드 최적화 시작...');
        
        try {
            // 1. _redirects 파일 생성
            await this.createRedirectsFile();
            
            // 2. _headers 파일 생성  
            await this.createHeadersFile();
            
            // 3. 불필요한 파일 제거
            await this.cleanupUnnecessaryFiles();
            
            // 4. manifest.json 최적화
            await this.optimizeManifest();
            
            // 5. HTML 파일들 최적화
            await this.optimizeHtmlFiles();
            
            console.log('✅ Netlify 빌드 최적화 완료!');
            console.log(`📁 최적화된 파일: ${this.optimizedFiles.length}개`);
            
        } catch (error) {
            console.error('❌ 빌드 최적화 실패:', error);
            process.exit(1);
        }
    }

    async createRedirectsFile() {
        const redirects = `# 🥔🐰 감자토끼 가계부 - Netlify Redirects

# SPA 라우팅 지원
/transaction-history  /transaction-history.html  200
/transaction-form     /transaction-form.html     200  
/meal-planning        /meal-planning.html        200

# 레거시 경로 리다이렉트
/transactions         /transaction-history.html  301
/add-transaction      /transaction-form.html     301
/meals                /meal-planning.html        301

# API 프록시 (향후 백엔드 연동시)
/api/*                https://your-api.com/api/:splat  200

# 404 페이지
/*                    /index.html                200
`;

        await fs.writeFile('_redirects', redirects, 'utf8');
        this.optimizedFiles.push('_redirects');
        console.log('📄 _redirects 파일 생성 완료');
    }

    async createHeadersFile() {
        const headers = `# 🥔🐰 감자토끼 가계부 - Netlify Headers

# 보안 헤더
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains

# 정적 리소스 캐싱
*.css
  Cache-Control: public, max-age=31536000, immutable
  
*.js  
  Cache-Control: public, max-age=31536000, immutable
  
*.png
  Cache-Control: public, max-age=31536000, immutable
  
*.jpg
  Cache-Control: public, max-age=31536000, immutable
  
*.svg
  Cache-Control: public, max-age=31536000, immutable

# PWA 파일
/manifest.json
  Content-Type: application/json
  Cache-Control: public, max-age=0, must-revalidate

/sw.js
  Content-Type: application/javascript  
  Cache-Control: no-cache
`;

        await fs.writeFile('_headers', headers, 'utf8');
        this.optimizedFiles.push('_headers');
        console.log('📄 _headers 파일 생성 완료');
    }

    async cleanupUnnecessaryFiles() {
        const filesToRemove = [
            'server.js',
            'jest.config.js',
            'jest.config.simple.js',
            'jest-puppeteer.config.js',
            'playwright.config.js',
            'take-screenshots.js',
            'manual-qa-test.js',
            'accessibility-qa-test.js',
            'generate-qa-report.js',
            'performance-qa-test.js'
        ];

        const dirsToRemove = [
            'node_modules',
            'tests',
            'test-report',
            'playwright-report',
            '.git'
        ];

        // 파일 제거 (존재하는 경우에만)
        for (const file of filesToRemove) {
            try {
                await fs.access(file);
                await fs.unlink(file);
                console.log(`🗑️ 제거됨: ${file}`);
            } catch {
                // 파일이 없으면 무시
            }
        }

        // 디렉토리 제거 (존재하는 경우에만)
        for (const dir of dirsToRemove) {
            try {
                await fs.access(dir);
                await fs.rm(dir, { recursive: true, force: true });
                console.log(`🗂️ 제거됨: ${dir}/`);
            } catch {
                // 디렉토리가 없으면 무시
            }
        }

        console.log('🧹 불필요한 파일 정리 완료');
    }

    async optimizeManifest() {
        try {
            const manifestPath = 'manifest.json';
            const manifestContent = await fs.readFile(manifestPath, 'utf8');
            const manifest = JSON.parse(manifestContent);

            // 최적화된 매니페스트
            const optimizedManifest = {
                ...manifest,
                start_url: "/",
                scope: "/",
                display: "standalone",
                orientation: "portrait",
                categories: ["finance", "productivity", "lifestyle"],
                shortcuts: [
                    {
                        name: "거래 내역",
                        short_name: "내역",
                        description: "거래 내역 확인",
                        url: "/transaction-history.html",
                        icons: [{ src: "potato-rabbit-icons/potato-neutral.svg", sizes: "any" }]
                    },
                    {
                        name: "거래 등록",  
                        short_name: "등록",
                        description: "새 거래 등록",
                        url: "/transaction-form.html",
                        icons: [{ src: "potato-rabbit-icons/rabbit-neutral.svg", sizes: "any" }]
                    },
                    {
                        name: "식단 계획",
                        short_name: "식단",
                        description: "식단 계획 관리",
                        url: "/meal-planning.html", 
                        icons: [{ src: "potato-rabbit-icons/potato-success.svg", sizes: "any" }]
                    }
                ]
            };

            await fs.writeFile(manifestPath, JSON.stringify(optimizedManifest, null, 2), 'utf8');
            this.optimizedFiles.push(manifestPath);
            console.log('📱 manifest.json 최적화 완료');
            
        } catch (error) {
            console.warn('⚠️ manifest.json 최적화 건너뜀:', error.message);
        }
    }

    async optimizeHtmlFiles() {
        const htmlFiles = ['index.html', 'transaction-history.html', 'transaction-form.html', 'meal-planning.html'];
        
        for (const file of htmlFiles) {
            try {
                await this.optimizeHtmlFile(file);
            } catch (error) {
                console.warn(`⚠️ ${file} 최적화 건너뜀:`, error.message);
            }
        }
    }

    async optimizeHtmlFile(filename) {
        const content = await fs.readFile(filename, 'utf8');
        
        // HTML 최적화
        let optimized = content
            // 불필요한 주석 제거 (중요한 주석은 보존)
            .replace(/<!--(?!\s*감자토끼)[\s\S]*?-->/g, '')
            // 여러 공백을 하나로
            .replace(/\s+/g, ' ')
            // 태그 간 불필요한 공백 제거
            .replace(/>\s+</g, '><')
            // 줄바꿈 정리
            .trim();

        // 성능 최적화 메타 태그 추가
        const optimizedMeta = `
    <!-- Netlify 배포 최적화 -->
    <meta name="theme-color" content="#1FC7D4">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    `;

        // head 태그 안에 메타 태그 추가
        optimized = optimized.replace('</head>', `${optimizedMeta}</head>`);

        await fs.writeFile(filename, optimized, 'utf8');
        this.optimizedFiles.push(filename);
        console.log(`📄 ${filename} 최적화 완료`);
    }
}

// 스크립트 실행
if (require.main === module) {
    const optimizer = new NetlifyBuildOptimizer();
    optimizer.optimize();
}

module.exports = NetlifyBuildOptimizer;