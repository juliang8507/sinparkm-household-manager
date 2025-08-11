/**
 * 감자토끼 가계부 - Critical CSS Extractor
 * 성능 최적화를 위한 Above-the-fold CSS 추출기
 */

const fs = require('fs');
const path = require('path');

class CriticalCSSExtractor {
    constructor() {
        this.cssFiles = [
            '../css/tokens.css',
            '../css/accessibility.css', 
            '../css/token-integration.css',
            '../css/icon-system.css',
            '../css/svg-sprite-animations.css',
            '../css/theme-switcher.css'
        ];
        
        // Above-the-fold 컴포넌트 정의
        this.criticalSelectors = {
            // 페이지별 핵심 셀렉터
            homepage: [
                // 기본 레이아웃
                'html', 'body', '*', ':root',
                '.app-header', '.header-content', '.app-title', '.title-icon',
                '.character-greeting', '.greeting-container', '.character-section',
                '.character-card', '.character-emoji', '.character-info', '.character-name',
                '.greeting-bubble', '.bubble-tail', '.greeting-text',
                '.todays-summary', '.summary-grid', '.summary-card', '.card-header', '.card-content',
                '.balance-card', '.income-card', '.expense-card',
                '.skip-to-content', '.container', '.section-title',
                // 아이콘 시스템 (핵심만)
                '.icon', '.icon-sm', '.icon-2xl', '.icon-potato', '.icon-rabbit',
                // 폰트 및 타이포그래피
                '--font-family-primary', '--font-family-fallback',
                '--font-size-sm', '--font-size-md', '--font-size-lg', '--font-size-xl',
                // 핵심 컬러 변수 (라이트 테마)
                '--color-primary', '--color-background-default', '--color-background-paper',
                '--color-text-primary', '--color-text-secondary',
                '--color-potato', '--color-rabbit', '--color-potato-accent', '--color-rabbit-accent'
            ],
            
            shared: [
                // 모든 페이지 공통 스타일
                'html', 'body', '*', ':root',
                '.skip-to-content', '.container', '.app-header', '.header-content',
                // 접근성 필수
                '.visually-hidden', '[aria-live]', '[role]',
                // 아이콘 시스템 기본
                '.icon', '.icon-sm', '.icon-md', '.icon-lg'
            ]
        };
    }

    /**
     * CSS 파일 읽기 및 파싱
     */
    async readCSSFile(filePath) {
        try {
            const fullPath = path.join(process.cwd(), filePath);
            return fs.readFileSync(fullPath, 'utf8');
        } catch (error) {
            console.error(`Error reading ${filePath}:`, error);
            return '';
        }
    }

    /**
     * Critical CSS 추출
     */
    extractCriticalCSS(cssContent, selectors) {
        const lines = cssContent.split('\n');
        let criticalCSS = '';
        let insideRule = false;
        let currentRule = '';
        let braceCount = 0;

        for (let line of lines) {
            // CSS 변수와 :root 규칙은 항상 포함
            if (line.includes(':root') || line.includes('--')) {
                criticalCSS += line + '\n';
                continue;
            }

            // @import 제거 (인라인에서는 불필요)
            if (line.trim().startsWith('@import')) {
                continue;
            }

            // 미디어 쿼리 처리 (모바일 퍼스트만)
            if (line.includes('@media') && !line.includes('max-width: 768px')) {
                continue;
            }

            // 셀렉터 매칭 확인
            const isCritical = selectors.some(selector => {
                return line.includes(selector) || 
                       line.includes(selector.replace('.', '')) ||
                       line.includes(selector.replace('#', ''));
            });

            if (isCritical || insideRule) {
                currentRule += line + '\n';
                
                // 중괄호 카운팅
                braceCount += (line.match(/\{/g) || []).length;
                braceCount -= (line.match(/\}/g) || []).length;

                if (braceCount === 0 && insideRule) {
                    criticalCSS += currentRule;
                    currentRule = '';
                    insideRule = false;
                } else if (braceCount > 0) {
                    insideRule = true;
                }
            }
        }

        return criticalCSS;
    }

    /**
     * 폰트 최적화를 위한 preload 태그 생성
     */
    generateFontPreloadTags() {
        return `
    <!-- Optimized Korean Font Preloads -->
    <link rel="preload" href="https://fonts.gstatic.com/s/kanit/v15/nKKZ-Go6G5tXcoaSEQGodLxA.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="https://fonts.gstatic.com/s/kanit/v15/nKKU-Go6G5tXcraQI2GKd8kBg.woff2" as="font" type="font/woff2" crossorigin>`;
    }

    /**
     * 최적화된 CSS 로딩 스크립트 생성
     */
    generateAsyncCSSLoader() {
        return `
    <script>
    // 🚀 고성능 CSS 지연 로딩
    (function() {
        const cssFiles = [
            'css/animation-utilities.css',
            'css/styleguide.css',
            'css/theme-controls.css'
        ];
        
        function loadCSS(href) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print';
            link.onload = function() { this.media = 'all'; };
            document.head.appendChild(link);
        }
        
        // 페이지 로드 완료 후 지연 CSS 로딩
        if (document.readyState === 'complete') {
            cssFiles.forEach(loadCSS);
        } else {
            window.addEventListener('load', () => cssFiles.forEach(loadCSS));
        }
    })();
    </script>`;
    }

    /**
     * 페이지별 Critical CSS 생성
     */
    async generateCriticalCSSForPage(pageName) {
        let allCriticalCSS = '';
        const selectors = this.criticalSelectors[pageName] || this.criticalSelectors.shared;

        for (const cssFile of this.cssFiles) {
            const cssContent = await this.readCSSFile(cssFile);
            const criticalCSS = this.extractCriticalCSS(cssContent, selectors);
            allCriticalCSS += criticalCSS;
        }

        // CSS 압축 (기본)
        allCriticalCSS = allCriticalCSS
            .replace(/\/\*[\s\S]*?\*\//g, '') // 주석 제거
            .replace(/\s+/g, ' ')            // 공백 정규화
            .replace(/;\s*}/g, '}')         // 마지막 세미콜론 제거
            .trim();

        return allCriticalCSS;
    }

    /**
     * 성능 예산 검증
     */
    validatePerformanceBudget(cssContent) {
        const sizeKB = Buffer.byteLength(cssContent, 'utf8') / 1024;
        const budget = 15; // Critical CSS 예산: 15KB
        
        return {
            size: sizeKB,
            budget: budget,
            withinBudget: sizeKB <= budget,
            savings: `${((243.4 - sizeKB) / 243.4 * 100).toFixed(1)}%`
        };
    }
}

module.exports = CriticalCSSExtractor;