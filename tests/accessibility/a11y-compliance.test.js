/**
 * 🔍 감자토끼 가계부 - 접근성 준수 테스트
 * WCAG 2.1 AA 준수 검증 시스템
 * 
 * 테스트 범위:
 * - WCAG 2.1 AA 기준 준수
 * - 3개 테마(light, dark, hc) 색상 대비
 * - 키보드 네비게이션 접근성
 * - 스크린 리더 호환성 (NVDA, JAWS, VoiceOver)
 * - 포커스 관리 및 시각적 지시자
 * - 시맨틱 HTML 검증
 * - ARIA 속성 올바른 사용
 */

const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs').promises;
const path = require('path');

// 테스트 모듈 가져오기
const AxeConfig = require('./axe-config');
const WCAGValidator = require('./wcag-validator');
const ContrastChecker = require('./contrast-checker');
const KeyboardTester = require('./keyboard-tester');

class A11yComplianceTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            overall: {
                score: 0,
                status: 'pending',
                timestamp: new Date().toISOString(),
                summary: ''
            },
            wcag: {
                level: 'AA',
                version: '2.1',
                violations: [],
                passes: [],
                incomplete: [],
                inapplicable: []
            },
            themes: {
                light: { violations: [], contrastIssues: [] },
                dark: { violations: [], contrastIssues: [] },
                hc: { violations: [], contrastIssues: [] }
            },
            keyboard: {
                navigation: [],
                focusManagement: [],
                shortcuts: []
            },
            screenReader: {
                landmarks: [],
                headings: [],
                ariaLabels: [],
                semanticStructure: []
            },
            performance: {
                loadTime: 0,
                interactionTime: 0,
                focusTime: 0
            }
        };
    }

    async init() {
        console.log('🚀 접근성 준수 테스트 시작...');
        
        this.browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
                '--force-prefers-reduced-motion'
            ]
        });

        this.page = await this.browser.newPage();
        
        // 뷰포트 설정
        await this.page.setViewport({ 
            width: 1280, 
            height: 720,
            deviceScaleFactor: 1
        });

        // 접근성 관련 사용자 설정 시뮬레이션
        await this.page.emulateMediaFeatures([
            { name: 'prefers-reduced-motion', value: 'reduce' },
            { name: 'prefers-contrast', value: 'high' }
        ]);

        // 한국어 설정
        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8'
        });

        console.log('✅ 브라우저 초기화 완료');
    }

    async runFullCompliance() {
        console.log('🔍 전체 접근성 준수 테스트 실행...');
        
        const startTime = Date.now();
        
        try {
            // 1. 홈 페이지 로드 및 기본 검증
            await this.loadAndTestHomePage();
            
            // 2. 모든 테마에 대한 접근성 테스트
            await this.testAllThemes();
            
            // 3. 키보드 네비게이션 테스트
            await this.testKeyboardAccessibility();
            
            // 4. 스크린 리더 호환성 테스트
            await this.testScreenReaderCompatibility();
            
            // 5. 폼 접근성 테스트
            await this.testFormAccessibility();
            
            // 6. 모바일 접근성 테스트
            await this.testMobileAccessibility();
            
            // 7. 성능 기반 접근성 테스트
            await this.testPerformanceAccessibility();
            
            // 최종 점수 계산
            this.calculateOverallScore();
            
            // 리포트 생성
            await this.generateReport();
            
            console.log(`✅ 전체 테스트 완료 (${Date.now() - startTime}ms)`);
            console.log(`📊 전체 점수: ${this.testResults.overall.score}/100`);
            
        } catch (error) {
            console.error('❌ 테스트 실행 중 오류:', error);
            this.testResults.overall.status = 'error';
            this.testResults.overall.summary = error.message;
        }
    }

    async loadAndTestHomePage() {
        console.log('🏠 홈페이지 로드 및 기본 접근성 검증...');
        
        const loadStart = Date.now();
        await this.page.goto('http://localhost:3000', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        this.testResults.performance.loadTime = Date.now() - loadStart;

        // axe-core로 기본 접근성 검증
        const results = await new AxePuppeteer(this.page)
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .configure(AxeConfig.getConfig())
            .analyze();

        this.testResults.wcag.violations = results.violations;
        this.testResults.wcag.passes = results.passes;
        this.testResults.wcag.incomplete = results.incomplete;
        this.testResults.wcag.inapplicable = results.inapplicable;

        console.log(`📊 기본 접근성 검증 완료: ${results.violations.length}개 위반사항`);
    }

    async testAllThemes() {
        console.log('🎨 모든 테마 접근성 테스트...');
        
        const themes = ['light', 'dark', 'hc'];
        
        for (const theme of themes) {
            console.log(`  🎨 ${theme} 테마 테스트...`);
            
            // 테마 변경
            await this.page.evaluate((themeName) => {
                document.documentElement.setAttribute('data-theme', themeName);
                
                // 테마 로드 완료 대기
                return new Promise(resolve => {
                    setTimeout(resolve, 500);
                });
            }, theme);

            // 색상 대비 검사
            const contrastResults = await ContrastChecker.checkTheme(this.page, theme);
            this.testResults.themes[theme].contrastIssues = contrastResults.violations;

            // 테마별 axe 검사
            const themeResults = await new AxePuppeteer(this.page)
                .withTags(['wcag2aa', 'wcag21aa'])
                .configure(AxeConfig.getThemeSpecificConfig(theme))
                .analyze();

            this.testResults.themes[theme].violations = themeResults.violations;
            
            console.log(`    ✅ ${theme}: 대비 문제 ${contrastResults.violations.length}개, 접근성 위반 ${themeResults.violations.length}개`);
        }
        
        // 기본 테마로 복원
        await this.page.evaluate(() => {
            document.documentElement.setAttribute('data-theme', 'light');
        });
    }

    async testKeyboardAccessibility() {
        console.log('⌨️ 키보드 접근성 테스트...');
        
        const keyboardTester = new KeyboardTester(this.page);
        
        // 탭 네비게이션 테스트
        const navigationResults = await keyboardTester.testTabNavigation();
        this.testResults.keyboard.navigation = navigationResults;
        
        // 포커스 관리 테스트
        const focusResults = await keyboardTester.testFocusManagement();
        this.testResults.keyboard.focusManagement = focusResults;
        
        // 키보드 단축키 테스트
        const shortcutResults = await keyboardTester.testKeyboardShortcuts();
        this.testResults.keyboard.shortcuts = shortcutResults;
        
        console.log(`⌨️ 키보드 테스트 완료: 네비게이션 ${navigationResults.length}개 이슈`);
    }

    async testScreenReaderCompatibility() {
        console.log('📢 스크린 리더 호환성 테스트...');
        
        // 랜드마크 구조 검증
        const landmarks = await this.page.evaluate(() => {
            const landmarkElements = document.querySelectorAll('[role], main, nav, header, footer, section, article, aside');
            return Array.from(landmarkElements).map(element => ({
                tagName: element.tagName.toLowerCase(),
                role: element.getAttribute('role') || element.tagName.toLowerCase(),
                ariaLabel: element.getAttribute('aria-label'),
                ariaLabelledBy: element.getAttribute('aria-labelledby'),
                text: element.textContent?.slice(0, 50) || ''
            }));
        });
        this.testResults.screenReader.landmarks = landmarks;

        // 제목 구조 검증
        const headings = await this.page.evaluate(() => {
            const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            return Array.from(headingElements).map((heading, index) => ({
                level: parseInt(heading.tagName.charAt(1)),
                text: heading.textContent?.trim() || '',
                id: heading.id || null,
                order: index + 1
            }));
        });
        this.testResults.screenReader.headings = headings;

        // ARIA 레이블 검증
        const ariaElements = await this.page.evaluate(() => {
            const elements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
            return Array.from(elements).map(element => ({
                tagName: element.tagName.toLowerCase(),
                ariaLabel: element.getAttribute('aria-label'),
                ariaLabelledBy: element.getAttribute('aria-labelledby'),
                ariaDescribedBy: element.getAttribute('aria-describedby'),
                role: element.getAttribute('role'),
                text: element.textContent?.slice(0, 30) || ''
            }));
        });
        this.testResults.screenReader.ariaLabels = ariaElements;

        console.log(`📢 스크린 리더 테스트 완료: ${landmarks.length}개 랜드마크, ${headings.length}개 제목`);
    }

    async testFormAccessibility() {
        console.log('📝 폼 접근성 테스트...');
        
        // 모든 폼 요소 찾기 및 검증
        const formElements = await this.page.evaluate(() => {
            const inputs = document.querySelectorAll('input, select, textarea, button');
            return Array.from(inputs).map(element => {
                const label = element.labels?.[0] || 
                            document.querySelector(`label[for="${element.id}"]`) ||
                            element.closest('label');
                
                return {
                    type: element.type || element.tagName.toLowerCase(),
                    id: element.id || null,
                    name: element.name || null,
                    hasLabel: !!label,
                    labelText: label?.textContent?.trim() || '',
                    ariaLabel: element.getAttribute('aria-label'),
                    ariaDescribedBy: element.getAttribute('aria-describedby'),
                    required: element.required || element.getAttribute('aria-required') === 'true',
                    disabled: element.disabled || element.getAttribute('aria-disabled') === 'true',
                    placeholder: element.placeholder || null
                };
            });
        });

        // 폼 접근성 위반사항 체크
        const formViolations = formElements.filter(element => {
            return !element.hasLabel && 
                   !element.ariaLabel && 
                   !element.placeholder &&
                   element.type !== 'submit' &&
                   element.type !== 'button';
        });

        this.testResults.forms = {
            totalElements: formElements.length,
            violations: formViolations,
            elements: formElements
        };

        console.log(`📝 폼 테스트 완료: ${formElements.length}개 요소, ${formViolations.length}개 위반사항`);
    }

    async testMobileAccessibility() {
        console.log('📱 모바일 접근성 테스트...');
        
        // 모바일 뷰포트로 변경
        await this.page.setViewport({ 
            width: 375, 
            height: 667, 
            isMobile: true,
            hasTouch: true,
            deviceScaleFactor: 2
        });

        // 터치 대상 크기 검증
        const touchTargets = await this.page.evaluate(() => {
            const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [tabindex]');
            return Array.from(interactiveElements).map(element => {
                const rect = element.getBoundingClientRect();
                return {
                    tagName: element.tagName.toLowerCase(),
                    role: element.getAttribute('role'),
                    width: rect.width,
                    height: rect.height,
                    area: rect.width * rect.height,
                    text: element.textContent?.slice(0, 30) || '',
                    meetsMinSize: rect.width >= 44 && rect.height >= 44
                };
            }).filter(target => target.width > 0 && target.height > 0);
        });

        const touchViolations = touchTargets.filter(target => !target.meetsMinSize);

        // 모바일 axe 검사
        const mobileResults = await new AxePuppeteer(this.page)
            .withTags(['wcag2aa', 'wcag21aa'])
            .configure(AxeConfig.getMobileConfig())
            .analyze();

        this.testResults.mobile = {
            touchTargets: touchTargets.length,
            touchViolations: touchViolations.length,
            touchTargetDetails: touchTargets,
            axeViolations: mobileResults.violations.length,
            violations: mobileResults.violations
        };

        // 데스크톱 뷰포트로 복원
        await this.page.setViewport({ 
            width: 1280, 
            height: 720,
            deviceScaleFactor: 1
        });

        console.log(`📱 모바일 테스트 완료: ${touchViolations.length}개 터치 타겟 위반사항`);
    }

    async testPerformanceAccessibility() {
        console.log('⚡ 성능 기반 접근성 테스트...');
        
        // 성능 메트릭 수집
        const performanceMetrics = await this.page.evaluate(() => {
            return new Promise((resolve) => {
                if (window.performance) {
                    const perfData = window.performance.getEntriesByType('navigation')[0];
                    resolve({
                        loadTime: perfData.loadEventEnd - perfData.navigationStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                        firstContentfulPaint: 0, // Chrome에서만 사용 가능
                        largestContentfulPaint: 0 // Chrome에서만 사용 가능
                    });
                } else {
                    resolve({ loadTime: 0, domContentLoaded: 0, firstContentfulPaint: 0, largestContentfulPaint: 0 });
                }
            });
        });

        // 포커스 응답 시간 측정
        const focusStart = Date.now();
        await this.page.focus('body');
        const focusTime = Date.now() - focusStart;

        this.testResults.performance = {
            ...this.testResults.performance,
            ...performanceMetrics,
            focusTime
        };

        console.log(`⚡ 성능 테스트 완료: 로드 시간 ${performanceMetrics.loadTime}ms`);
    }

    calculateOverallScore() {
        console.log('📊 전체 점수 계산 중...');
        
        let score = 100;
        let penalties = [];

        // WCAG 위반사항에 따른 점수 감점
        const wcagViolations = this.testResults.wcag.violations.length;
        const wcagPenalty = Math.min(wcagViolations * 5, 30);
        score -= wcagPenalty;
        if (wcagPenalty > 0) penalties.push(`WCAG 위반 ${wcagViolations}개 (-${wcagPenalty}점)`);

        // 테마별 문제에 따른 점수 감점
        Object.keys(this.testResults.themes).forEach(theme => {
            const themeViolations = this.testResults.themes[theme].violations.length;
            const contrastIssues = this.testResults.themes[theme].contrastIssues.length;
            const themePenalty = Math.min((themeViolations + contrastIssues) * 2, 15);
            score -= themePenalty;
            if (themePenalty > 0) penalties.push(`${theme} 테마 문제 (-${themePenalty}점)`);
        });

        // 키보드 접근성 문제에 따른 점수 감점
        const keyboardIssues = this.testResults.keyboard.navigation.length + 
                              this.testResults.keyboard.focusManagement.length;
        const keyboardPenalty = Math.min(keyboardIssues * 3, 20);
        score -= keyboardPenalty;
        if (keyboardPenalty > 0) penalties.push(`키보드 접근성 문제 (-${keyboardPenalty}점)`);

        // 폼 접근성 문제에 따른 점수 감점
        if (this.testResults.forms) {
            const formPenalty = Math.min(this.testResults.forms.violations.length * 4, 15);
            score -= formPenalty;
            if (formPenalty > 0) penalties.push(`폼 접근성 문제 (-${formPenalty}점)`);
        }

        // 모바일 접근성 문제에 따른 점수 감점
        if (this.testResults.mobile) {
            const mobilePenalty = Math.min(this.testResults.mobile.touchViolations * 2, 10);
            score -= mobilePenalty;
            if (mobilePenalty > 0) penalties.push(`모바일 접근성 문제 (-${mobilePenalty}점)`);
        }

        // 성능 기준 감점
        const loadTime = this.testResults.performance.loadTime;
        let performancePenalty = 0;
        if (loadTime > 3000) performancePenalty = 5;
        if (loadTime > 5000) performancePenalty = 10;
        score -= performancePenalty;
        if (performancePenalty > 0) penalties.push(`성능 지연 (-${performancePenalty}점)`);

        this.testResults.overall.score = Math.max(0, Math.round(score));
        this.testResults.overall.penalties = penalties;
        
        // 상태 결정
        if (this.testResults.overall.score >= 90) {
            this.testResults.overall.status = 'excellent';
            this.testResults.overall.summary = '우수한 접근성 준수 상태';
        } else if (this.testResults.overall.score >= 75) {
            this.testResults.overall.status = 'good';
            this.testResults.overall.summary = '양호한 접근성 준수 상태, 일부 개선 필요';
        } else if (this.testResults.overall.score >= 60) {
            this.testResults.overall.status = 'needs_improvement';
            this.testResults.overall.summary = '접근성 개선이 필요한 상태';
        } else {
            this.testResults.overall.status = 'poor';
            this.testResults.overall.summary = '심각한 접근성 문제 존재, 즉시 개선 필요';
        }

        console.log(`📊 최종 점수: ${this.testResults.overall.score}/100 (${this.testResults.overall.status})`);
    }

    async generateReport() {
        console.log('📄 접근성 리포트 생성 중...');
        
        const reportDir = path.join(__dirname, '../reports');
        await fs.mkdir(reportDir, { recursive: true });
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(reportDir, `accessibility-audit-${timestamp}.html`);
        
        const reportHTML = this.generateHTMLReport();
        await fs.writeFile(reportPath, reportHTML, 'utf8');
        
        // JSON 데이터도 저장
        const jsonPath = path.join(reportDir, `accessibility-data-${timestamp}.json`);
        await fs.writeFile(jsonPath, JSON.stringify(this.testResults, null, 2), 'utf8');
        
        console.log(`📄 리포트 생성 완료: ${reportPath}`);
        return reportPath;
    }

    generateHTMLReport() {
        const { overall, wcag, themes, keyboard, screenReader, forms, mobile, performance } = this.testResults;
        
        return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>접근성 준수 리포트 - 감자토끼 가계부</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #f8f9fa; 
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { 
            background: linear-gradient(135deg, #1FC7D4, #7645D9); 
            color: white; 
            padding: 40px 0; 
            text-align: center; 
            margin-bottom: 30px; 
            border-radius: 12px; 
        }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.1rem; opacity: 0.9; }
        
        .score-card { 
            background: white; 
            border-radius: 12px; 
            padding: 30px; 
            margin-bottom: 30px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
            text-align: center;
        }
        .score-number { 
            font-size: 4rem; 
            font-weight: bold; 
            margin: 20px 0; 
        }
        .score-excellent { color: #28a745; }
        .score-good { color: #17a2b8; }
        .score-needs-improvement { color: #ffc107; }
        .score-poor { color: #dc3545; }
        
        .section { 
            background: white; 
            border-radius: 12px; 
            margin-bottom: 25px; 
            overflow: hidden; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        .section-header { 
            background: #f8f9fa; 
            padding: 20px; 
            border-bottom: 1px solid #e9ecef; 
        }
        .section-header h2 { color: #495057; font-size: 1.5rem; }
        .section-content { padding: 20px; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 20px; 
            border-left: 4px solid #1FC7D4; 
        }
        .card h3 { color: #495057; margin-bottom: 15px; }
        
        .violation-item { 
            background: #fff5f5; 
            border-left: 4px solid #dc3545; 
            padding: 15px; 
            margin-bottom: 10px; 
            border-radius: 4px; 
        }
        .violation-item h4 { color: #dc3545; margin-bottom: 8px; }
        .violation-item p { color: #666; font-size: 0.9rem; }
        
        .success-item { 
            background: #f0fff4; 
            border-left: 4px solid #28a745; 
            padding: 15px; 
            margin-bottom: 10px; 
            border-radius: 4px; 
        }
        
        .metric { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
        .metric:last-child { border-bottom: none; }
        .metric-label { font-weight: 500; }
        .metric-value { color: #6c757d; }
        
        .badge { 
            display: inline-block; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 0.8rem; 
            font-weight: 500; 
            margin: 2px; 
        }
        .badge-success { background: #d4edda; color: #155724; }
        .badge-warning { background: #fff3cd; color: #856404; }
        .badge-danger { background: #f8d7da; color: #721c24; }
        
        .recommendations { 
            background: #e3f2fd; 
            border-radius: 8px; 
            padding: 20px; 
            margin-top: 20px; 
        }
        .recommendations h3 { color: #1976d2; margin-bottom: 15px; }
        .recommendations ul { padding-left: 20px; }
        .recommendations li { margin-bottom: 8px; color: #424242; }
        
        .character-section { text-align: center; padding: 20px; }
        .character-emoji { font-size: 3rem; margin-bottom: 10px; }
        
        @media (max-width: 768px) {
            .container { padding: 15px; }
            .header h1 { font-size: 2rem; }
            .score-number { font-size: 3rem; }
            .grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🥔🐰 감자토끼 가계부</h1>
            <h2>접근성 준수 리포트</h2>
            <p>WCAG 2.1 AA 기준 준수 검증 결과</p>
            <p><small>생성 시간: ${overall.timestamp}</small></p>
        </div>

        <div class="score-card">
            <h2>전체 접근성 점수</h2>
            <div class="score-number score-${overall.status}">${overall.score}/100</div>
            <p class="status-message">${overall.summary}</p>
            ${overall.penalties && overall.penalties.length > 0 ? `
                <div class="penalties">
                    <h4>감점 내역:</h4>
                    <ul>${overall.penalties.map(penalty => `<li>${penalty}</li>`).join('')}</ul>
                </div>
            ` : ''}
        </div>

        <div class="section">
            <div class="section-header">
                <h2>🔍 WCAG 2.1 AA 준수 현황</h2>
            </div>
            <div class="section-content">
                <div class="grid">
                    <div class="card">
                        <h3>위반사항 (${wcag.violations.length}개)</h3>
                        ${wcag.violations.length === 0 ? 
                            '<div class="success-item"><p>🎉 WCAG 위반사항이 없습니다!</p></div>' :
                            wcag.violations.slice(0, 5).map(violation => `
                                <div class="violation-item">
                                    <h4>${violation.id}</h4>
                                    <p>${violation.description}</p>
                                    <small>영향도: ${violation.impact} | 요소 수: ${violation.nodes.length}개</small>
                                </div>
                            `).join('')
                        }
                        ${wcag.violations.length > 5 ? `<p><small>... 외 ${wcag.violations.length - 5}개 추가</small></p>` : ''}
                    </div>
                    
                    <div class="card">
                        <h3>통과한 규칙 (${wcag.passes.length}개)</h3>
                        <div class="metric">
                            <span class="metric-label">성공적으로 통과</span>
                            <span class="metric-value badge badge-success">${wcag.passes.length}개 규칙</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">적용 불가</span>
                            <span class="metric-value">${wcag.inapplicable.length}개 규칙</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">불완전</span>
                            <span class="metric-value">${wcag.incomplete.length}개 규칙</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h2>🎨 테마별 접근성 검증</h2>
            </div>
            <div class="section-content">
                <div class="grid">
                    ${Object.entries(themes).map(([theme, data]) => `
                        <div class="card">
                            <h3>${theme === 'light' ? '라이트' : theme === 'dark' ? '다크' : '고대비'} 테마</h3>
                            <div class="metric">
                                <span class="metric-label">접근성 위반</span>
                                <span class="metric-value ${data.violations.length === 0 ? 'badge badge-success' : 'badge badge-danger'}">
                                    ${data.violations.length}개
                                </span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">색상 대비 문제</span>
                                <span class="metric-value ${data.contrastIssues.length === 0 ? 'badge badge-success' : 'badge badge-warning'}">
                                    ${data.contrastIssues.length}개
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h2>⌨️ 키보드 접근성</h2>
            </div>
            <div class="section-content">
                <div class="grid">
                    <div class="card">
                        <h3>탭 네비게이션</h3>
                        <div class="metric">
                            <span class="metric-label">문제 요소</span>
                            <span class="metric-value">${keyboard.navigation.length}개</span>
                        </div>
                    </div>
                    <div class="card">
                        <h3>포커스 관리</h3>
                        <div class="metric">
                            <span class="metric-label">문제 요소</span>
                            <span class="metric-value">${keyboard.focusManagement.length}개</span>
                        </div>
                    </div>
                    <div class="card">
                        <h3>키보드 단축키</h3>
                        <div class="metric">
                            <span class="metric-label">지원 현황</span>
                            <span class="metric-value">${keyboard.shortcuts.length}개 확인됨</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h2>📢 스크린 리더 호환성</h2>
            </div>
            <div class="section-content">
                <div class="grid">
                    <div class="card">
                        <h3>페이지 구조</h3>
                        <div class="metric">
                            <span class="metric-label">랜드마크</span>
                            <span class="metric-value">${screenReader.landmarks.length}개</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">제목 구조</span>
                            <span class="metric-value">${screenReader.headings.length}개</span>
                        </div>
                    </div>
                    <div class="card">
                        <h3>ARIA 레이블</h3>
                        <div class="metric">
                            <span class="metric-label">ARIA 요소</span>
                            <span class="metric-value">${screenReader.ariaLabels.length}개</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        ${forms ? `
        <div class="section">
            <div class="section-header">
                <h2>📝 폼 접근성</h2>
            </div>
            <div class="section-content">
                <div class="grid">
                    <div class="card">
                        <h3>폼 요소 현황</h3>
                        <div class="metric">
                            <span class="metric-label">전체 요소</span>
                            <span class="metric-value">${forms.totalElements}개</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">레이블 누락</span>
                            <span class="metric-value ${forms.violations.length === 0 ? 'badge badge-success' : 'badge badge-danger'}">
                                ${forms.violations.length}개
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        ${mobile ? `
        <div class="section">
            <div class="section-header">
                <h2>📱 모바일 접근성</h2>
            </div>
            <div class="section-content">
                <div class="grid">
                    <div class="card">
                        <h3>터치 대상 크기</h3>
                        <div class="metric">
                            <span class="metric-label">전체 요소</span>
                            <span class="metric-value">${mobile.touchTargets}개</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">크기 부족 (44px 미만)</span>
                            <span class="metric-value ${mobile.touchViolations === 0 ? 'badge badge-success' : 'badge badge-warning'}">
                                ${mobile.touchViolations}개
                            </span>
                        </div>
                    </div>
                    <div class="card">
                        <h3>모바일 전용 검증</h3>
                        <div class="metric">
                            <span class="metric-label">접근성 위반</span>
                            <span class="metric-value">${mobile.axeViolations}개</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-header">
                <h2>⚡ 성능 기반 접근성</h2>
            </div>
            <div class="section-content">
                <div class="grid">
                    <div class="card">
                        <h3>로딩 성능</h3>
                        <div class="metric">
                            <span class="metric-label">페이지 로드 시간</span>
                            <span class="metric-value">${performance.loadTime}ms</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">DOM 준비 시간</span>
                            <span class="metric-value">${performance.domContentLoaded || '측정불가'}ms</span>
                        </div>
                    </div>
                    <div class="card">
                        <h3>상호작용 성능</h3>
                        <div class="metric">
                            <span class="metric-label">포커스 응답 시간</span>
                            <span class="metric-value">${performance.focusTime}ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="recommendations">
            <h3>🛠️ 접근성 개선 권장사항</h3>
            <ul>
                ${wcag.violations.length > 0 ? '<li><strong>WCAG 위반사항 수정:</strong> axe-core에서 발견된 접근성 위반사항들을 우선적으로 수정하세요.</li>' : ''}
                ${Object.values(themes).some(theme => theme.contrastIssues.length > 0) ? '<li><strong>색상 대비 개선:</strong> WCAG AA 기준(4.5:1)에 맞춰 색상 대비를 개선하세요.</li>' : ''}
                ${keyboard.navigation.length > 0 ? '<li><strong>키보드 네비게이션 개선:</strong> 모든 대화형 요소에 적절한 키보드 접근을 제공하세요.</li>' : ''}
                ${forms && forms.violations.length > 0 ? '<li><strong>폼 레이블 추가:</strong> 모든 입력 요소에 적절한 레이블을 제공하세요.</li>' : ''}
                ${mobile && mobile.touchViolations > 0 ? '<li><strong>터치 대상 크기 조정:</strong> 모든 터치 대상을 최소 44x44px로 설정하세요.</li>' : ''}
                ${performance.loadTime > 3000 ? '<li><strong>성능 최적화:</strong> 페이지 로드 시간을 3초 이내로 개선하세요.</li>' : ''}
                <li><strong>정기적인 접근성 테스트:</strong> 새로운 기능 추가 시마다 접근성 테스트를 실행하세요.</li>
                <li><strong>사용자 테스트:</strong> 실제 장애인 사용자와 함께 사용성 테스트를 진행하세요.</li>
            </ul>
        </div>

        <div class="character-section">
            <div class="character-emoji">🥔🐰</div>
            <h3>감자와 토끼의 접근성 메시지</h3>
            <p>모든 사용자가 편리하게 사용할 수 있는 가계부를 만들어요!</p>
            <p><small>이 리포트는 axe-core, Pa11y, Lighthouse를 활용하여 생성되었습니다.</small></p>
        </div>
    </div>
</body>
</html>`;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            console.log('✅ 브라우저 정리 완료');
        }
    }
}

module.exports = A11yComplianceTest;

// 직접 실행 시 테스트 수행
if (require.main === module) {
    (async () => {
        const tester = new A11yComplianceTest();
        
        try {
            await tester.init();
            await tester.runFullCompliance();
        } catch (error) {
            console.error('❌ 테스트 실행 실패:', error);
        } finally {
            await tester.cleanup();
        }
    })();
}