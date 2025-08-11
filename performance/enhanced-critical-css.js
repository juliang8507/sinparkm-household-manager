/**
 * 감자토끼 가계부 - Enhanced Critical CSS Generator
 * 15KB 예산 준수를 위한 고도 최적화
 */

const fs = require('fs');

class EnhancedCriticalCSS {
    constructor() {
        // 절대 필수 셀렉터만 (Above-the-fold만)
        this.minimalSelectors = {
            // 기본 레이아웃 (필수)
            core: [
                'html', 'body', '*', ':root',
                '.app-header', '.header-content', '.app-title',
                '.character-greeting', '.character-card', '.greeting-bubble',
                '.todays-summary', '.summary-card', '.container'
            ],
            
            // 필수 색상 변수만
            colors: [
                '--color-primary', '--color-background-default', '--color-background-paper',
                '--color-text-primary', '--color-potato', '--color-rabbit'
            ],
            
            // 필수 폰트만
            fonts: [
                '--font-family-primary', '--font-size-md', '--font-size-lg'
            ],
            
            // 필수 아이콘
            icons: [
                '.icon', '.icon-sm', '.icon-2xl'
            ]
        };
    }

    /**
     * 초경량 Critical CSS 생성
     */
    async generateUltraLightCSS() {
        const essentialCSS = `
/* 🚀 Ultra-Light Critical CSS - 감자토끼 가계부 */
:root{
  --color-primary:#1FC7D4;
  --color-background-default:#FAF9FA;
  --color-background-paper:#FFF;
  --color-text-primary:#280D5F;
  --color-potato:#DEB887;
  --color-rabbit:#F8F8FF;
  --font-family-primary:'Kanit',system-ui,sans-serif;
  --font-size-md:16px;
  --font-size-lg:20px;
}

*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--font-family-primary);font-size:var(--font-size-md);line-height:1.5;color:var(--color-text-primary);background:var(--color-background-default)}

.container{max-width:1200px;margin:0 auto;padding:0 1rem}
.app-header{background:var(--color-background-paper);padding:1rem 0;box-shadow:0 2px 4px rgba(0,0,0,.1)}
.header-content{display:flex;align-items:center;justify-content:space-between}
.app-title{font-size:var(--font-size-lg);font-weight:600;display:flex;align-items:center;gap:.5rem}

.character-greeting{padding:2rem 0}
.character-card{background:var(--color-background-paper);border-radius:16px;padding:1.5rem;display:flex;align-items:center;gap:1rem;box-shadow:0 4px 12px rgba(0,0,0,.1)}
.greeting-bubble{background:var(--color-primary);color:white;padding:1rem 1.5rem;border-radius:20px;position:relative;margin:1rem 0}

.todays-summary{padding:1rem 0}
.summary-card{background:var(--color-background-paper);border-radius:12px;padding:1.5rem;box-shadow:0 2px 8px rgba(0,0,0,.1)}

.icon{display:inline-flex;align-items:center;justify-content:center}
.icon-sm{width:1.25rem;height:1.25rem}
.icon-2xl{width:3rem;height:3rem}

.skip-to-content{position:absolute;top:-40px;left:6px;background:#000;color:#fff;padding:8px;text-decoration:none;z-index:100}
.skip-to-content:focus{top:6px}

/* 반응형 (모바일만) */
@media(max-width:768px){
  .container{padding:0 .75rem}
  .app-title{font-size:18px}
  .character-card{padding:1rem;flex-direction:column;text-align:center}
  .summary-card{padding:1rem}
}`;

        // CSS 압축 및 최적화
        const compressedCSS = essentialCSS
            .replace(/\/\*[\s\S]*?\*\//g, '') // 주석 제거
            .replace(/\s+/g, ' ')            // 공백 정규화
            .replace(/;\s*}/g, '}')         // 마지막 세미콜론 제거
            .replace(/\s*{\s*/g, '{')       // 중괄호 공백 제거
            .replace(/;\s*/g, ';')          // 세미콜론 공백 제거
            .replace(/,\s*/g, ',')          // 쉼표 공백 제거
            .trim();

        return compressedCSS;
    }

    /**
     * 페이지별 추가 스타일 생성 (지연 로딩용)
     */
    generatePageSpecificCSS(pageName) {
        const pageStyles = {
            homepage: `
/* 홈페이지 추가 스타일 */
.greeting-container{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem}
.summary-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;margin-top:1.5rem}
.balance-amount{font-size:2rem;font-weight:700;color:var(--color-primary)}
@media(max-width:768px){.greeting-container{grid-template-columns:1fr;gap:1rem}.summary-grid{grid-template-columns:1fr}}`,
            
            'meal-planning': `
/* 식단 계획 페이지 스타일 */
.meal-calendar{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:#e0e0e0;border-radius:8px;overflow:hidden}
.meal-day{background:white;padding:1rem;min-height:120px}`,
            
            'transaction-form': `
/* 거래 입력 폼 스타일 */
.form-group{margin-bottom:1.5rem}
.form-input{width:100%;padding:0.75rem;border:2px solid #e0e0e0;border-radius:8px;font-size:1rem}
.btn-primary{background:var(--color-primary);color:white;border:none;padding:0.75rem 2rem;border-radius:8px;cursor:pointer}`,
            
            'transaction-history': `
/* 거래 내역 스타일 */
.transaction-list{display:flex;flex-direction:column;gap:0.75rem}
.transaction-item{background:white;padding:1rem;border-radius:8px;display:flex;justify-content:space-between;align-items:center}`
        };

        return pageStyles[pageName] || '';
    }

    /**
     * 성능 예산 검증
     */
    validateBudget(css) {
        const sizeKB = Buffer.byteLength(css, 'utf8') / 1024;
        return {
            size: sizeKB,
            budget: 15,
            withinBudget: sizeKB <= 15,
            efficiency: `${(sizeKB / 15 * 100).toFixed(1)}%`
        };
    }

    /**
     * 전체 최적화 실행
     */
    async optimize() {
        console.log('🎯 Ultra-Light Critical CSS 생성 중...');
        
        // 핵심 CSS 생성
        const criticalCSS = await this.generateUltraLightCSS();
        const validation = this.validateBudget(criticalCSS);
        
        console.log(`✅ Critical CSS: ${validation.size.toFixed(2)}KB (${validation.efficiency} of budget)`);
        
        if (!validation.withinBudget) {
            console.warn('⚠️ 여전히 예산 초과 - 추가 최적화 필요');
        }
        
        // 파일 저장
        fs.writeFileSync('ultra-critical.css', criticalCSS, 'utf8');
        
        // 페이지별 지연 CSS 생성
        const pages = ['homepage', 'meal-planning', 'transaction-form', 'transaction-history'];
        for (const page of pages) {
            const pageCSS = this.generatePageSpecificCSS(page);
            if (pageCSS) {
                fs.writeFileSync(`deferred-${page}.css`, pageCSS, 'utf8');
            }
        }
        
        return {
            critical: {
                size: validation.size,
                withinBudget: validation.withinBudget,
                content: criticalCSS
            },
            pages: pages.map(page => ({
                name: page,
                deferredCSS: this.generatePageSpecificCSS(page)
            }))
        };
    }
}

// CLI 실행
if (require.main === module) {
    const optimizer = new EnhancedCriticalCSS();
    optimizer.optimize().catch(console.error);
}

module.exports = EnhancedCriticalCSS;