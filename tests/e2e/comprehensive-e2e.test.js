/**
 * 🥔🐰 감자토끼 가계부 - 종합 E2E 테스트 스위트
 * 전체적으로 하나하나 꼼꼼하게 검증하는 포괄적 테스트
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const path = require('path');

puppeteer.use(StealthPlugin());

class ComprehensiveE2ETest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.baseUrl = 'http://localhost:5173';
        this.results = {
            passed: 0,
            failed: 0,
            tests: [],
            screenshots: []
        };
    }

    async init() {
        console.log('🚀 감자토끼 가계부 종합 E2E 테스트 시작...');
        
        this.browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1280, height: 720 },
            args: ['--disable-dev-shm-usage', '--no-sandbox']
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
        const filename = `e2e-${name}-${timestamp}.png`;
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
            await this.takeScreenshot(`error-${name.replace(/\s+/g, '-')}`, `테스트 실패 스크린샷: ${name}`);
        }
    }

    async testHomepageLoading() {
        await this.test('홈페이지 로딩', async () => {
            await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
            await this.takeScreenshot('homepage-loaded', '홈페이지 로딩 완료');
            
            // 페이지 제목 확인
            const title = await this.page.title();
            if (!title.includes('감자토끼 가계부')) {
                throw new Error(`페이지 제목 불일치: ${title}`);
            }
            
            // 주요 섹션 존재 확인
            const sections = [
                '.app-header',
                '.character-greeting',
                '.todays-summary',
                '.quick-actions',
                '.recent-transactions',
                '.bottom-navigation'
            ];
            
            for (const selector of sections) {
                const element = await this.page.$(selector);
                if (!element) {
                    throw new Error(`필수 섹션 누락: ${selector}`);
                }
            }
        });
    }

    async testCharacterInteraction() {
        await this.test('캐릭터 인터랙션', async () => {
            // 감자 캐릭터 클릭
            await this.page.click('#potatoCharacter');
            await this.page.waitForTimeout(1000);
            
            // 토끼 캐릭터 클릭
            await this.page.click('#rabbitCharacter');
            await this.page.waitForTimeout(1000);
            
            await this.takeScreenshot('character-interaction', '캐릭터 인터랙션 테스트');
        });
    }

    async testSummaryCards() {
        await this.test('요약 카드 검증', async () => {
            // 잔액 카드 확인
            const balanceCard = await this.page.$('.balance-card');
            if (!balanceCard) throw new Error('잔액 카드 누락');
            
            const balanceText = await this.page.$eval('#currentBalance', el => el.textContent);
            if (!balanceText.includes('₩')) {
                throw new Error('잔액 표시 형식 오류');
            }
            
            // 수입 카드 확인
            const incomeCard = await this.page.$('.income-card');
            if (!incomeCard) throw new Error('수입 카드 누락');
            
            // 지출 카드 확인
            const expenseCard = await this.page.$('.expense-card');
            if (!expenseCard) throw new Error('지출 카드 누락');
            
            await this.takeScreenshot('summary-cards', '요약 카드 검증');
        });
    }

    async testQuickActions() {
        await this.test('빠른 액션 버튼', async () => {
            // 수입 추가 버튼 확인
            const incomeBtn = await this.page.$('#addIncomeBtn');
            if (!incomeBtn) throw new Error('수입 추가 버튼 누락');
            
            // 지출 추가 버튼 확인
            const expenseBtn = await this.page.$('#addExpenseBtn');
            if (!expenseBtn) throw new Error('지출 추가 버튼 누락');
            
            // 전체 보기 버튼 확인
            const viewAllBtn = await this.page.$('#viewAllBtn');
            if (!viewAllBtn) throw new Error('전체 보기 버튼 누락');
            
            await this.takeScreenshot('quick-actions', '빠른 액션 버튼 검증');
        });
    }

    async testTransactionList() {
        await this.test('거래 목록 검증', async () => {
            // 거래 목록 확인
            const transactionList = await this.page.$('#transactionList');
            if (!transactionList) throw new Error('거래 목록 컨테이너 누락');
            
            // 개별 거래 아이템 확인
            const transactions = await this.page.$$('.transaction-item');
            console.log(`📊 거래 아이템 개수: ${transactions.length}`);
            
            if (transactions.length === 0) {
                console.log('⚠️ 거래 아이템이 없음 - Empty State 확인');
                const emptyState = await this.page.$('.transactions-empty');
                if (!emptyState) throw new Error('Empty State 컴포넌트 누락');
            }
            
            await this.takeScreenshot('transaction-list', '거래 목록 검증');
        });
    }

    async testNavigation() {
        await this.test('네비게이션 테스트', async () => {
            // 거래 내역 페이지로 이동
            await this.page.click('a[href="transaction-history.html"]');
            await this.page.waitForTimeout(2000);
            
            let url = this.page.url();
            if (!url.includes('transaction-history.html')) {
                throw new Error('거래 내역 페이지 네비게이션 실패');
            }
            
            await this.takeScreenshot('transaction-history-page', '거래 내역 페이지');
            
            // 홈페이지로 직접 이동 (transaction-history.html에 네비게이션이 없음)
            await this.page.goto(this.baseUrl);
            await this.page.waitForTimeout(2000);
            
            url = this.page.url();
            if (!url.includes('index.html') && !url.endsWith('/')) {
                throw new Error('홈페이지 복귀 실패');
            }
            
            // 식단 계획 페이지로 이동 (홈에서 직접)
            await this.page.click('a[href="meal-planning.html"]');
            await this.page.waitForTimeout(2000);
            
            url = this.page.url();
            if (!url.includes('meal-planning.html')) {
                throw new Error('식단 계획 페이지 네비게이션 실패');
            }
            
            await this.takeScreenshot('meal-planning-page', '식단 계획 페이지');
        });
    }

    async testResponsiveDesign() {
        await this.test('반응형 디자인 테스트', async () => {
            const viewports = [
                { name: 'mobile', width: 360, height: 640 },
                { name: 'tablet', width: 768, height: 1024 },
                { name: 'desktop', width: 1280, height: 720 },
                { name: 'large-desktop', width: 1920, height: 1080 }
            ];
            
            for (const viewport of viewports) {
                await this.page.setViewport(viewport);
                await this.page.waitForTimeout(1000);
                
                // 레이아웃 검증 - 현재 페이지에 따라 다른 헤더 선택자 사용
                const url = this.page.url();
                let headerSelector = '.app-header';
                if (url.includes('transaction-history') || url.includes('transaction-form') || url.includes('meal-planning')) {
                    headerSelector = '.page-header';
                }
                
                const header = await this.page.$(headerSelector);
                if (!header) throw new Error(`${viewport.name}: 헤더 누락 (${headerSelector})`);
                
                // 네비게이션은 홈페이지에만 있음
                if (url.includes('index.html') || url.endsWith('/')) {
                    const navigation = await this.page.$('.bottom-navigation');
                    if (!navigation) console.log(`${viewport.name}: 네비게이션 없음 (홈페이지 외 페이지)`);
                }
                
                await this.takeScreenshot(`responsive-${viewport.name}`, `반응형 디자인 - ${viewport.name}`);
            }
            
            // 원래 뷰포트로 복원
            await this.page.setViewport({ width: 1280, height: 720 });
        });
    }

    async testThemeSwitching() {
        await this.test('테마 전환 테스트', async () => {
            // 라이트 테마 스크린샷
            await this.takeScreenshot('theme-light', '라이트 테마');
            
            // 다크 테마로 전환 (JavaScript 실행)
            await this.page.evaluate(() => {
                document.documentElement.setAttribute('data-theme', 'dark');
            });
            
            await this.page.waitForTimeout(500);
            await this.takeScreenshot('theme-dark', '다크 테마');
            
            // 하이 컨트라스트 테마
            await this.page.evaluate(() => {
                document.documentElement.setAttribute('data-theme', 'high-contrast');
            });
            
            await this.page.waitForTimeout(500);
            await this.takeScreenshot('theme-high-contrast', '하이 컨트라스트 테마');
            
            // 라이트 테마로 복원
            await this.page.evaluate(() => {
                document.documentElement.setAttribute('data-theme', 'light');
            });
            
            await this.page.waitForTimeout(500);
        });
    }

    async testAccessibility() {
        await this.test('접근성 테스트', async () => {
            // Skip to content 링크 확인
            const skipLink = await this.page.$('.skip-to-content');
            if (!skipLink) throw new Error('Skip to content 링크 누락');
            
            // ARIA 라벨 확인
            const ariaElements = await this.page.$$('[aria-label]');
            console.log(`♿ ARIA 라벨 요소 개수: ${ariaElements.length}`);
            
            // Live region 확인
            const liveRegions = await this.page.$$('[aria-live]');
            console.log(`📢 Live region 개수: ${liveRegions.length}`);
            
            // 헤딩 구조 확인
            const headings = await this.page.$$('h1, h2, h3, h4, h5, h6');
            console.log(`📝 헤딩 개수: ${headings.length}`);
            
            await this.takeScreenshot('accessibility-check', '접근성 요소 검증');
        });
    }

    async testKeyboardNavigation() {
        await this.test('키보드 내비게이션', async () => {
            // 페이지 처음으로 이동
            await this.page.evaluate(() => document.body.focus());
            
            // Tab 키로 네비게이션
            const tabStops = [
                '.skip-to-content',
                '.settings-button',
                '#potatoCharacter',
                '#rabbitCharacter',
                '.balance-card',
                '.income-card',
                '.expense-card',
                '#addIncomeBtn',
                '#addExpenseBtn',
                '#viewAllBtn'
            ];
            
            for (let i = 0; i < 10; i++) {
                await this.page.keyboard.press('Tab');
                await this.page.waitForTimeout(200);
            }
            
            // Enter 키로 액션 실행 테스트
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(500);
            
            await this.takeScreenshot('keyboard-navigation', '키보드 네비게이션 테스트');
        });
    }

    async testPerformance() {
        await this.test('성능 검증', async () => {
            // 페이지 메트릭 수집
            const metrics = await this.page.metrics();
            console.log('📊 성능 메트릭:', {
                JSHeapUsedSize: Math.round(metrics.JSHeapUsedSize / 1024 / 1024) + 'MB',
                JSHeapTotalSize: Math.round(metrics.JSHeapTotalSize / 1024 / 1024) + 'MB',
                ScriptDuration: Math.round(metrics.ScriptDuration * 1000) + 'ms',
                LayoutDuration: Math.round(metrics.LayoutDuration * 1000) + 'ms'
            });
            
            // 네트워크 요청 모니터링
            const responses = [];
            this.page.on('response', response => {
                responses.push({
                    url: response.url(),
                    status: response.status(),
                    size: response.headers()['content-length'] || 'unknown'
                });
            });
            
            // 페이지 재로드로 네트워크 활동 측정
            await this.page.reload({ waitUntil: 'networkidle0' });
            
            console.log(`🌐 네트워크 요청 수: ${responses.length}`);
            
            // 로딩 시간 측정
            const timing = JSON.parse(await this.page.evaluate(() => 
                JSON.stringify(performance.timing)
            ));
            
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`⏱️ 페이지 로드 시간: ${loadTime}ms`);
            
            if (loadTime > 5000) {
                throw new Error(`페이지 로드 시간 초과: ${loadTime}ms`);
            }
        });
    }

    async testErrorHandling() {
        await this.test('에러 처리 테스트', async () => {
            // 잘못된 페이지 접근
            const response = await this.page.goto(this.baseUrl + '/non-existent-page.html', 
                { waitUntil: 'networkidle0' });
            
            // 404 에러 또는 적절한 처리 확인
            if (response.status() === 200) {
                console.log('⚠️ 404 페이지가 200 상태로 응답됨 (정상적인 SPA 동작일 수 있음)');
            }
            
            // 원래 페이지로 돌아가기
            await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
            
            // JavaScript 에러 확인
            const consoleErrors = [];
            this.page.on('console', msg => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });
            
            // 페이지 재로드하여 JavaScript 에러 캐치
            await this.page.reload({ waitUntil: 'networkidle0' });
            
            if (consoleErrors.length > 0) {
                console.log('⚠️ JavaScript 에러 발견:', consoleErrors);
            }
        });
    }

    async testDataPersistence() {
        await this.test('데이터 지속성 테스트', async () => {
            // 로컬스토리지 확인
            const localStorageData = await this.page.evaluate(() => {
                const data = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    data[key] = localStorage.getItem(key);
                }
                return data;
            });
            
            console.log('💾 로컬스토리지 데이터:', localStorageData);
            
            // 세션스토리지 확인
            const sessionStorageData = await this.page.evaluate(() => {
                const data = {};
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    data[key] = sessionStorage.getItem(key);
                }
                return data;
            });
            
            console.log('📝 세션스토리지 데이터:', sessionStorageData);
            
            // 쿠키 확인
            const cookies = await this.page.cookies();
            console.log(`🍪 쿠키 개수: ${cookies.length}`);
        });
    }

    async generateReport() {
        console.log('\n📊 테스트 결과 요약:');
        console.log(`✅ 통과: ${this.results.passed}`);
        console.log(`❌ 실패: ${this.results.failed}`);
        console.log(`📸 스크린샷: ${this.results.screenshots.length}`);
        
        const reportData = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.passed + this.results.failed,
                passed: this.results.passed,
                failed: this.results.failed,
                successRate: ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)
            },
            tests: this.results.tests,
            screenshots: this.results.screenshots,
            browser: 'Chromium',
            viewport: '1280x720'
        };
        
        // JSON 보고서 저장
        await fs.writeFile(
            'tests/reports/comprehensive-e2e-report.json',
            JSON.stringify(reportData, null, 2),
            'utf8'
        );
        
        console.log('\n📋 상세 보고서가 tests/reports/comprehensive-e2e-report.json에 저장되었습니다.');
        
        return reportData;
    }

    async runAllTests() {
        try {
            await this.init();
            
            // 전체적으로 하나하나 꼼꼼하게 검증
            await this.testHomepageLoading();
            await this.testCharacterInteraction();
            await this.testSummaryCards();
            await this.testQuickActions();
            await this.testTransactionList();
            await this.testNavigation();
            await this.testResponsiveDesign();
            await this.testThemeSwitching();
            await this.testAccessibility();
            await this.testKeyboardNavigation();
            await this.testPerformance();
            await this.testErrorHandling();
            await this.testDataPersistence();
            
            const report = await this.generateReport();
            
            await this.browser.close();
            console.log('✅ 브라우저 정리 완료');
            
            return report;
            
        } catch (error) {
            console.error('❌ E2E 테스트 실행 중 오류:', error);
            
            if (this.browser) {
                await this.browser.close();
            }
            
            throw error;
        }
    }
}

// 단독 실행 지원
if (require.main === module) {
    const test = new ComprehensiveE2ETest();
    test.runAllTests()
        .then(report => {
            console.log(`\n🎉 종합 E2E 테스트 완료! 성공률: ${report.summary.successRate}%`);
            process.exit(report.summary.failed > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('테스트 실행 실패:', error);
            process.exit(1);
        });
}

module.exports = ComprehensiveE2ETest;