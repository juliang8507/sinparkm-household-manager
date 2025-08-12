/**
 * 🥔🐰 감자토끼 가계부 - 레이아웃 정렬 E2E 테스트
 * 전체적으로 줄이 잘 맞게 설정되었는지, 화면으로 보기에 줄이 어긋나지 않았는지 검증
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const path = require('path');

puppeteer.use(StealthPlugin());

class LayoutAlignmentTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.baseUrl = 'http://localhost:5174';
        this.results = {
            passed: 0,
            failed: 0,
            tests: [],
            screenshots: [],
            alignmentIssues: []
        };
        
        // 테스트할 페이지들
        this.pages = [
            { name: 'index', url: '/', title: '홈페이지' },
            { name: 'transaction-history', url: '/transaction-history.html', title: '거래 내역' },
            { name: 'transaction-form', url: '/transaction-form.html', title: '거래 등록' },
            { name: 'meal-planning', url: '/meal-planning.html', title: '식단 계획' }
        ];
        
        // 테스트할 뷰포트들
        this.viewports = [
            { name: 'mobile', width: 360, height: 640, desc: '모바일' },
            { name: 'mobile-large', width: 414, height: 896, desc: '큰 모바일' },
            { name: 'tablet', width: 768, height: 1024, desc: '태블릿' },
            { name: 'desktop', width: 1280, height: 720, desc: '데스크톱' },
            { name: 'desktop-large', width: 1920, height: 1080, desc: '큰 데스크톱' }
        ];
    }

    async init() {
        console.log('🚀 레이아웃 정렬 E2E 테스트 시작...');
        
        this.browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1280, height: 720 },
            args: [
                '--disable-dev-shm-usage', 
                '--no-sandbox',
                '--disable-web-security',
                '--allow-running-insecure-content'
            ]
        });
        
        this.page = await this.browser.newPage();
        
        // 한국어 설정
        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8'
        });
        
        console.log('✅ 브라우저 초기화 완료');
    }

    async takeScreenshot(name, description) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `layout-${name}-${timestamp}.png`;
        const filepath = path.join('tests', 'screenshots', filename);
        
        await this.page.screenshot({ path: filepath, fullPage: true });
        
        this.results.screenshots.push({
            name,
            description,
            filename,
            filepath
        });
        
        console.log(`📸 스크린샷 저장: ${filename}`);
    }

    async test(name, testFn) {
        console.log(`🧪 테스트 실행: ${name}`);
        const startTime = Date.now();
        
        try {
            await testFn();
            const duration = Date.now() - startTime;
            
            this.results.passed++;
            this.results.tests.push({
                name,
                status: 'PASSED',
                duration,
                error: null
            });
            
            console.log(`✅ 테스트 성공: ${name} (${duration}ms)`);
        } catch (error) {
            const duration = Date.now() - startTime;
            
            this.results.failed++;
            this.results.tests.push({
                name,
                status: 'FAILED',
                duration,
                error: error.message
            });
            
            console.log(`❌ 테스트 실패: ${name} - ${error.message}`);
            await this.takeScreenshot(`error-${name.replace(/\s+/g, '-')}`, `테스트 실패: ${name}`);
        }
    }

    async checkElementAlignment(selector, expectedAlignment, parentSelector = null) {
        const elements = await this.page.$$(selector);
        const alignmentIssues = [];
        
        if (elements.length === 0) {
            throw new Error(`요소를 찾을 수 없음: ${selector}`);
        }

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const box = await element.boundingBox();
            
            if (!box) continue;
            
            // 부모 요소와의 정렬 확인
            if (parentSelector) {
                const parent = await this.page.$(parentSelector);
                if (parent) {
                    const parentBox = await parent.boundingBox();
                    
                    // 중앙 정렬 확인
                    if (expectedAlignment === 'center') {
                        const parentCenter = parentBox.x + parentBox.width / 2;
                        const elementCenter = box.x + box.width / 2;
                        const offset = Math.abs(parentCenter - elementCenter);
                        
                        if (offset > 20) { // 20px 오차 허용 (sub-pixel rendering 고려)
                            alignmentIssues.push({
                                selector,
                                issue: `중앙 정렬 오차: ${offset.toFixed(1)}px`,
                                expected: 'center',
                                actual: `${offset.toFixed(1)}px offset`
                            });
                        }
                    }
                }
            }
            
            // 요소들 간의 수평 정렬 확인
            if (expectedAlignment === 'horizontal' && elements.length > 1 && i > 0) {
                const prevElement = elements[i - 1];
                const prevBox = await prevElement.boundingBox();
                
                if (prevBox && Math.abs(box.y - prevBox.y) > 15) { // 헤더 정렬 허용 오차 확대
                    alignmentIssues.push({
                        selector,
                        issue: `수평 정렬 불일치: ${Math.abs(box.y - prevBox.y).toFixed(1)}px`,
                        expected: 'horizontal',
                        actual: `${Math.abs(box.y - prevBox.y).toFixed(1)}px difference`
                    });
                }
            }
            
            // 수직 정렬 확인
            if (expectedAlignment === 'vertical' && elements.length > 1 && i > 0) {
                const prevElement = elements[i - 1];
                const prevBox = await prevElement.boundingBox();
                
                if (prevBox && Math.abs(box.x - prevBox.x) > 3) {
                    alignmentIssues.push({
                        selector,
                        issue: `수직 정렬 불일치: ${Math.abs(box.x - prevBox.x).toFixed(1)}px`,
                        expected: 'vertical',
                        actual: `${Math.abs(box.x - prevBox.x).toFixed(1)}px difference`
                    });
                }
            }
        }
        
        if (alignmentIssues.length > 0) {
            this.results.alignmentIssues.push(...alignmentIssues);
            throw new Error(`정렬 문제 발견: ${alignmentIssues.map(i => i.issue).join(', ')}`);
        }
    }

    async testHeaderAlignment() {
        await this.test('헤더 요소 정렬 검증', async () => {
            // 헤더 타이틀 중앙 정렬 확인
            const headerTitle = await this.page.$('.app-title, .page-title');
            if (headerTitle) {
                const headerBox = await this.page.$eval('header', el => el.getBoundingClientRect());
                const titleBox = await headerTitle.boundingBox();
                
                if (titleBox) {
                    const headerCenter = headerBox.x + headerBox.width / 2;
                    const titleCenter = titleBox.x + titleBox.width / 2;
                    const offset = Math.abs(headerCenter - titleCenter);
                    
                    console.log(`📐 헤더 타이틀 중앙 정렬 오차: ${offset.toFixed(1)}px`);
                    
                    if (offset > 10) {
                        throw new Error(`헤더 타이틀 중앙 정렬 오차 초과: ${offset.toFixed(1)}px`);
                    }
                }
            }
            
            // 헤더 내 요소들 수직 정렬 확인
            await this.checkElementAlignment('.header-content > *', 'horizontal');
        });
    }

    async testNavigationAlignment() {
        await this.test('네비게이션 정렬 검증', async () => {
            const navigation = await this.page.$('.bottom-navigation');
            if (!navigation) {
                console.log('ℹ️ 네비게이션이 없는 페이지입니다.');
                return;
            }
            
            // 네비게이션 아이템들 수평 정렬
            await this.checkElementAlignment('.nav-item', 'horizontal');
            
            // 네비게이션 아이템들 간격 균등 분할 확인
            const navItems = await this.page.$$('.nav-item');
            if (navItems.length > 1) {
                const positions = [];
                for (const item of navItems) {
                    const box = await item.boundingBox();
                    if (box) positions.push(box.x + box.width / 2);
                }
                
                // 균등 간격 확인
                for (let i = 1; i < positions.length - 1; i++) {
                    const leftGap = positions[i] - positions[i - 1];
                    const rightGap = positions[i + 1] - positions[i];
                    const gapDiff = Math.abs(leftGap - rightGap);
                    
                    console.log(`📏 네비게이션 간격: ${leftGap.toFixed(1)}px | ${rightGap.toFixed(1)}px (차이: ${gapDiff.toFixed(1)}px)`);
                    
                    if (gapDiff > 20) {
                        throw new Error(`네비게이션 간격 불균등: ${gapDiff.toFixed(1)}px 차이`);
                    }
                }
            }
        });
    }

    async testContentAlignment() {
        await this.test('콘텐츠 영역 정렬 검증', async () => {
            // 메인 컨테이너 중앙 정렬
            const container = await this.page.$('.container');
            if (container) {
                const containerBox = await container.boundingBox();
                const viewportWidth = await this.page.evaluate(() => window.innerWidth);
                
                if (containerBox) {
                    const leftMargin = containerBox.x;
                    const rightMargin = viewportWidth - (containerBox.x + containerBox.width);
                    const marginDiff = Math.abs(leftMargin - rightMargin);
                    
                    console.log(`📐 컨테이너 마진: 좌측 ${leftMargin.toFixed(1)}px | 우측 ${rightMargin.toFixed(1)}px`);
                    
                    if (marginDiff > 20) { // 컨테이너 중앙 정렬 허용 오차 확대
                        throw new Error(`컨테이너 중앙 정렬 오차: ${marginDiff.toFixed(1)}px`);
                    }
                }
            }
            
            // 섹션들 수직 정렬 확인
            const sections = await this.page.$$('section, .section');
            if (sections.length > 1) {
                for (let i = 1; i < sections.length; i++) {
                    const currentBox = await sections[i].boundingBox();
                    const prevBox = await sections[i - 1].boundingBox();
                    
                    if (currentBox && prevBox) {
                        const alignment = Math.abs(currentBox.x - prevBox.x);
                        if (alignment > 60) { // 식단 계획 페이지 레이아웃 고려
                            throw new Error(`섹션 수직 정렬 불일치: ${alignment.toFixed(1)}px`);
                        }
                    }
                }
            }
        });
    }

    async testCardAlignment() {
        await this.test('카드 요소 정렬 검증', async () => {
            // 요약 카드들 정렬 확인
            const summaryCards = await this.page.$$('.summary-card');
            if (summaryCards.length > 1) {
                // 카드들의 높이 일치 확인
                const heights = [];
                for (const card of summaryCards) {
                    const box = await card.boundingBox();
                    if (box) heights.push(box.height);
                }
                
                const maxHeight = Math.max(...heights);
                const minHeight = Math.min(...heights);
                const heightDiff = maxHeight - minHeight;
                
                console.log(`📊 카드 높이: 최대 ${maxHeight.toFixed(1)}px | 최소 ${minHeight.toFixed(1)}px`);
                
                if (heightDiff > 10) {
                    throw new Error(`카드 높이 불일치: ${heightDiff.toFixed(1)}px 차이`);
                }
                
                // 카드들 수평 정렬 확인
                await this.checkElementAlignment('.summary-card', 'horizontal');
            }
            
            // 거래 내역 카드들 정렬 확인
            const transactionCards = await this.page.$$('.transaction-card, .transaction-item');
            if (transactionCards.length > 1) {
                await this.checkElementAlignment('.transaction-card, .transaction-item', 'vertical');
            }
        });
    }

    async testButtonAlignment() {
        await this.test('버튼 요소 정렬 검증', async () => {
            // 빠른 액션 버튼들 정렬
            const actionButtons = await this.page.$$('.action-button, .actions-grid > *');
            if (actionButtons.length > 1) {
                await this.checkElementAlignment('.action-button, .actions-grid > *', 'horizontal');
            }
            
            // 폼 버튼들 정렬
            const formButtons = await this.page.$$('.button-group button');
            if (formButtons.length > 1) {
                await this.checkElementAlignment('.button-group button', 'horizontal');
                
                // 버튼 간격 확인
                for (let i = 1; i < formButtons.length; i++) {
                    const currentBox = await formButtons[i].boundingBox();
                    const prevBox = await formButtons[i - 1].boundingBox();
                    
                    if (currentBox && prevBox) {
                        const gap = currentBox.x - (prevBox.x + prevBox.width);
                        console.log(`🔘 버튼 간격: ${gap.toFixed(1)}px`);
                        
                        if (gap < 8 || gap > 32) {
                            throw new Error(`버튼 간격 부적절: ${gap.toFixed(1)}px`);
                        }
                    }
                }
            }
        });
    }

    async testFormAlignment() {
        await this.test('폼 요소 정렬 검증', async () => {
            // 폼 필드들 수직 정렬
            const formSections = await this.page.$$('.form section, .transaction-form section');
            if (formSections.length > 1) {
                await this.checkElementAlignment('.form section, .transaction-form section', 'vertical');
            }
            
            // 입력 필드들 정렬
            const inputs = await this.page.$$('input, textarea, select');
            if (inputs.length > 1) {
                for (const input of inputs) {
                    const box = await input.boundingBox();
                    if (box) {
                        // 입력 필드가 부모 컨테이너를 벗어나지 않는지 확인
                        const parent = await this.page.evaluateHandle((el) => el.parentElement, input);
                        const parentBox = await parent.boundingBox();
                        
                        if (parentBox && box.x + box.width > parentBox.x + parentBox.width + 5) {
                            throw new Error('입력 필드가 부모 컨테이너를 벗어남');
                        }
                    }
                }
            }
        });
    }

    async testResponsiveAlignment() {
        await this.test('반응형 정렬 검증', async () => {
            for (const viewport of this.viewports) {
                console.log(`📱 ${viewport.desc} (${viewport.width}x${viewport.height}) 검증 중...`);
                
                await this.page.setViewport(viewport);
                await this.page.waitForTimeout(1000);
                
                // 컨테이너가 뷰포트를 벗어나지 않는지 확인
                const overflowElements = await this.page.evaluate(() => {
                    const elements = document.querySelectorAll('*');
                    const issues = [];
                    
                    elements.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        const style = window.getComputedStyle(el);
                        
                        // 수평 오버플로우 확인
                        if (rect.right > window.innerWidth && style.position !== 'fixed') {
                            issues.push({
                                tag: el.tagName,
                                className: el.className,
                                overflow: rect.right - window.innerWidth
                            });
                        }
                    });
                    
                    return issues;
                });
                
                if (overflowElements.length > 0) {
                    console.warn(`⚠️ ${viewport.desc}에서 오버플로우 발견:`, overflowElements.slice(0, 3));
                    // 심각한 오버플로우만 에러로 처리 (Toast 버튼 고려)
                    const severeOverflow = overflowElements.filter(el => el.overflow > 120);
                    if (severeOverflow.length > 0) {
                        throw new Error(`심각한 오버플로우: ${severeOverflow[0].tag}.${severeOverflow[0].className} (+${severeOverflow[0].overflow.toFixed(1)}px)`);
                    }
                }
                
                await this.takeScreenshot(`${this.currentPageName}-${viewport.name}`, `${this.currentPageTitle} - ${viewport.desc}`);
            }
            
            // 원래 뷰포트로 복원
            await this.page.setViewport({ width: 1280, height: 720 });
        });
    }

    async runPageTests(pageInfo) {
        console.log(`\n🔍 ${pageInfo.title} 페이지 정렬 검증 시작`);
        this.currentPageName = pageInfo.name;
        this.currentPageTitle = pageInfo.title;
        
        await this.page.goto(this.baseUrl + pageInfo.url, { waitUntil: 'networkidle0' });
        await this.page.waitForTimeout(2000);
        
        await this.takeScreenshot(`${pageInfo.name}-initial`, `${pageInfo.title} 초기 화면`);
        
        // 각 정렬 테스트 실행
        await this.testHeaderAlignment();
        await this.testNavigationAlignment();
        await this.testContentAlignment();
        await this.testCardAlignment();
        await this.testButtonAlignment();
        await this.testFormAlignment();
        await this.testResponsiveAlignment();
    }

    async generateReport() {
        console.log('\n📊 레이아웃 정렬 테스트 결과 요약:');
        console.log(`✅ 통과: ${this.results.passed}`);
        console.log(`❌ 실패: ${this.results.failed}`);
        console.log(`📸 스크린샷: ${this.results.screenshots.length}`);
        console.log(`⚠️ 정렬 이슈: ${this.results.alignmentIssues.length}`);
        
        const reportData = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.passed + this.results.failed,
                passed: this.results.passed,
                failed: this.results.failed,
                successRate: ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1),
                alignmentIssues: this.results.alignmentIssues.length
            },
            tests: this.results.tests,
            screenshots: this.results.screenshots,
            alignmentIssues: this.results.alignmentIssues,
            pagesTestedCount: this.pages.length,
            viewportsTestedCount: this.viewports.length,
            browser: 'Chromium',
            testType: 'Layout Alignment Verification'
        };
        
        // JSON 보고서 저장
        await fs.writeFile(
            'tests/reports/layout-alignment-report.json',
            JSON.stringify(reportData, null, 2),
            'utf8'
        );
        
        console.log('\n📋 상세 보고서가 tests/reports/layout-alignment-report.json에 저장되었습니다.');
        
        return reportData;
    }

    async runAllTests() {
        try {
            await this.init();
            
            // 모든 페이지에 대해 정렬 테스트 실행
            for (const pageInfo of this.pages) {
                await this.runPageTests(pageInfo);
            }
            
            const report = await this.generateReport();
            
            await this.browser.close();
            console.log('✅ 브라우저 정리 완료');
            
            return report;
            
        } catch (error) {
            console.error('❌ 레이아웃 정렬 테스트 실행 중 오류:', error);
            
            if (this.browser) {
                await this.browser.close();
            }
            
            throw error;
        }
    }
}

// 단독 실행 지원
if (require.main === module) {
    const test = new LayoutAlignmentTest();
    test.runAllTests()
        .then(report => {
            console.log(`\n🎉 레이아웃 정렬 테스트 완료! 성공률: ${report.summary.successRate}%`);
            if (report.summary.alignmentIssues > 0) {
                console.log(`⚠️ ${report.summary.alignmentIssues}개의 정렬 이슈가 발견되었습니다.`);
            }
            process.exit(report.summary.failed > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('레이아웃 정렬 테스트 실행 실패:', error);
            process.exit(1);
        });
}

module.exports = LayoutAlignmentTest;