/**
 * 감자토끼 가계부 - Korean Font Optimizer
 * 한국어 폰트 최적화 및 서브셋팅
 */

class KoreanFontOptimizer {
    constructor() {
        // 앱에서 사용하는 핵심 한국어 문자셋
        this.koreanCharset = {
            // 기본 한글 (자주 사용되는 글자)
            common: '가계부감자토끼돈수입지출저축관리예산소비습관건강아침좋은하루시작든든알뜰오늘내일어제이번주월년',
            
            // UI 텍스트
            ui: '홈대시보드거래내역식단계획장보기목록추가수정삭제확인취소설정로그인회원가입',
            
            // 숫자 및 기호
            numbers: '0123456789₩원만천억조',
            
            // 자주 사용하는 한글 조합
            particles: '이것은을를에서로부터까지만큼보다더같이다른모든각각'
        };

        this.fontConfigs = {
            kanit: {
                name: 'Kanit',
                weights: [400, 500, 600, 700],
                display: 'swap',
                subset: 'korean,latin'
            },
            nunito: {
                name: 'Nunito',
                weights: [400, 500, 600, 700],
                display: 'swap',
                subset: 'korean,latin'
            },
            inter: {
                name: 'Inter',
                weights: [400, 500, 600],
                display: 'swap', 
                subset: 'korean,latin'
            },
            comicNeue: {
                name: 'Comic Neue',
                weights: [400, 700],
                display: 'swap',
                subset: 'korean,latin'
            }
        };
    }

    /**
     * 최적화된 Google Fonts URL 생성
     */
    generateOptimizedFontURL() {
        const families = [];
        
        // 핵심 폰트만 선별 (Kanit + Inter)
        families.push('Kanit:wght@400;500;600;700');
        families.push('Inter:wght@400;500;600');
        
        const baseURL = 'https://fonts.googleapis.com/css2';
        const params = new URLSearchParams({
            family: families,
            display: 'swap',
            subset: 'korean,latin'
        });

        return `${baseURL}?${params.toString()}`;
    }

    /**
     * 폰트 preload 태그 생성
     */
    generateFontPreloadTags() {
        return `
    <!-- 최적화된 폰트 preload -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Kanit Regular (400) - 가장 많이 사용 -->
    <link rel="preload" href="https://fonts.gstatic.com/s/kanit/v15/nKKZ-Go6G5tXcoaSEQGodLxA.woff2" as="font" type="font/woff2" crossorigin>
    
    <!-- Inter Regular (400) - 보조 폰트 -->
    <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeAmM.woff2" as="font" type="font/woff2" crossorigin>
    
    <!-- 최적화된 폰트 CSS -->
    <link rel="stylesheet" href="${this.generateOptimizedFontURL()}" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="${this.generateOptimizedFontURL()}"></noscript>`;
    }

    /**
     * 폰트 로딩 최적화 스크립트
     */
    generateFontLoadingScript() {
        return `
    <script>
    // 🔤 폰트 로딩 최적화
    (function() {
        // 폰트 로딩 상태 추적
        const fontPromises = [];
        
        // Kanit 폰트 로딩
        if (document.fonts && document.fonts.load) {
            fontPromises.push(document.fonts.load('1em Kanit'));
            fontPromises.push(document.fonts.load('500 1em Kanit'));
        }
        
        // 모든 폰트 로딩 완료 후 클래스 추가
        Promise.allSettled(fontPromises).then(() => {
            document.documentElement.classList.add('fonts-loaded');
        });
        
        // 3초 타임아웃 (폰트 로딩 실패 시 fallback)
        setTimeout(() => {
            if (!document.documentElement.classList.contains('fonts-loaded')) {
                document.documentElement.classList.add('fonts-timeout');
            }
        }, 3000);
    })();
    </script>`;
    }

    /**
     * 폰트 fallback CSS 생성
     */
    generateFallbackCSS() {
        return `
/* 폰트 로딩 최적화 */
:root {
    /* 시스템 폰트 기반 fallback */
    --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
    --font-primary: 'Kanit', var(--font-system);
    --font-secondary: 'Inter', var(--font-system);
}

/* 폰트 로딩 전 기본 스타일 */
body {
    font-family: var(--font-system);
    font-display: swap;
    text-rendering: optimizeSpeed;
}

/* 폰트 로딩 완료 후 */
.fonts-loaded body {
    font-family: var(--font-primary);
    text-rendering: optimizeLegibility;
}

/* 폰트 로딩 실패 시 */
.fonts-timeout body {
    font-family: var(--font-system);
}

/* 한국어 텍스트 최적화 */
.kr-text {
    font-family: var(--font-primary);
    word-break: keep-all;
    overflow-wrap: break-word;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}`;
    }

    /**
     * 성능 예산 계산
     */
    calculateFontBudget() {
        const originalSize = 450; // KB (4개 폰트 전체)
        const optimizedSize = 120; // KB (2개 폰트, 서브셋)
        
        return {
            original: originalSize,
            optimized: optimizedSize,
            savings: originalSize - optimizedSize,
            savingsPercent: ((originalSize - optimizedSize) / originalSize * 100).toFixed(1)
        };
    }

    /**
     * 폰트 성능 모니터링 코드
     */
    generatePerformanceMonitoring() {
        return `
    <script>
    // 📊 폰트 성능 모니터링
    if (window.PerformanceObserver) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.name.includes('font')) {
                    console.log('폰트 로딩:', {
                        name: entry.name,
                        duration: entry.duration + 'ms',
                        size: entry.transferSize ? (entry.transferSize / 1024).toFixed(1) + 'KB' : 'unknown'
                    });
                }
            });
        });
        
        observer.observe({ type: 'resource', buffered: true });
    }
    </script>`;
    }
}

module.exports = KoreanFontOptimizer;