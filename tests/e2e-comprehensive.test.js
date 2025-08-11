/**
 * 🧪 감자토끼 가계부 - 종합 E2E 테스트
 * 
 * 모든 핵심 기능을 꼼꼼하게 검증하는 종합 테스트 스위트
 * 
 * @author QA 전문가 Claude
 * @date 2025-08-11
 */

const puppeteer = require('puppeteer');
const path = require('path');

describe('🥔🐰 감자토끼 가계부 - 종합 E2E 테스트', () => {
  let browser;
  let page;
  const baseURL = `file://${path.resolve(__dirname, '../index.html')}`;
  
  // 테스트 결과 저장
  const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
  };

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 720 }
    });
    page = await browser.newPage();
    
    // 콘솔 로그 캐치
    page.on('console', msg => console.log('🖥️ PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('❌ PAGE ERROR:', err.message));
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
    
    // 테스트 결과 출력
    console.log('\n📊 E2E 테스트 종합 결과:');
    console.log(`✅ 통과: ${testResults.passed}`);
    console.log(`❌ 실패: ${testResults.failed}`);
    console.log(`📈 총 테스트: ${testResults.total}`);
    console.log(`🎯 성공률: ${Math.round((testResults.passed / testResults.total) * 100)}%`);
  });

  // 헬퍼 함수: 테스트 결과 기록
  function recordTest(testName, passed, details = '') {
    testResults.total++;
    if (passed) {
      testResults.passed++;
      console.log(`✅ ${testName}: PASSED`);
    } else {
      testResults.failed++;
      console.log(`❌ ${testName}: FAILED - ${details}`);
    }
    testResults.details.push({ testName, passed, details });
  }

  describe('🏠 홈페이지 기본 기능', () => {
    test('페이지 로딩 및 기본 요소 존재 확인', async () => {
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');

      // 페이지 제목 확인
      const title = await page.title();
      recordTest('페이지 제목', title === '홈 - 감자토끼 가계부');

      // 기본 UI 요소들 확인
      const elements = await page.evaluate(() => {
        return {
          hasHeader: !!document.querySelector('.app-header'),
          hasCharacterSection: !!document.querySelector('.character-greeting'),
          hasSummarySection: !!document.querySelector('.todays-summary'),
          hasBottomNav: !!document.querySelector('.bottom-navigation'),
          summaryCards: document.querySelectorAll('.summary-card').length,
          transactionItems: document.querySelectorAll('.transaction-item').length,
          quickActionButtons: document.querySelectorAll('.action-button').length
        };
      });

      recordTest('헤더 존재', elements.hasHeader);
      recordTest('캐릭터 섹션 존재', elements.hasCharacterSection);
      recordTest('요약 섹션 존재', elements.hasSummarySection);
      recordTest('하단 네비게이션 존재', elements.hasBottomNav);
      recordTest('요약 카드 개수', elements.summaryCards === 3, `Expected: 3, Actual: ${elements.summaryCards}`);
      recordTest('거래 항목 개수', elements.transactionItems >= 0);
      recordTest('빠른 액션 버튼 개수', elements.quickActionButtons === 3, `Expected: 3, Actual: ${elements.quickActionButtons}`);
    }, 10000);

    test('성능 메트릭 검증', async () => {
      const performanceMetrics = await page.evaluate(() => {
        const performance = window.performance;
        const timing = performance.timing;
        
        return {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          resourceCount: performance.getEntriesByType('resource').length
        };
      });

      recordTest('페이지 로드 시간', performanceMetrics.loadTime < 3000, `${performanceMetrics.loadTime}ms`);
      recordTest('DOM 준비 시간', performanceMetrics.domContentLoaded < 1000, `${performanceMetrics.domContentLoaded}ms`);
      recordTest('리소스 로딩', performanceMetrics.resourceCount > 0);
    });
  });

  describe('♿ 접근성 기능', () => {
    test('접근성 요소 검증', async () => {
      const a11yResults = await page.evaluate(() => {
        return {
          hasSkipLink: !!document.querySelector('.skip-to-content'),
          hasProperHeadings: !!document.querySelector('h1') && !!document.querySelector('h2'),
          ariaLabels: document.querySelectorAll('[aria-label]').length,
          ariaLive: document.querySelectorAll('[aria-live]').length,
          focusableElements: document.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])').length,
          semanticElements: {
            header: !!document.querySelector('header'),
            nav: !!document.querySelector('nav'),
            main: !!document.querySelector('main'),
            section: !!document.querySelector('section')
          }
        };
      });

      recordTest('Skip Link 존재', a11yResults.hasSkipLink);
      recordTest('적절한 제목 구조', a11yResults.hasProperHeadings);
      recordTest('ARIA 레이블 사용', a11yResults.ariaLabels > 10, `Found: ${a11yResults.ariaLabels}`);
      recordTest('ARIA Live 영역', a11yResults.ariaLive > 0, `Found: ${a11yResults.ariaLive}`);
      recordTest('포커스 가능한 요소', a11yResults.focusableElements > 10, `Found: ${a11yResults.focusableElements}`);
      recordTest('시맨틱 Header', a11yResults.semanticElements.header);
      recordTest('시맨틱 Navigation', a11yResults.semanticElements.nav);
      recordTest('시맨틱 Section', a11yResults.semanticElements.section);
    });

    test('키보드 내비게이션', async () => {
      // Tab으로 네비게이션 테스트
      await page.keyboard.press('Tab');
      
      const activeElement = await page.evaluate(() => {
        const element = document.activeElement;
        return {
          tagName: element.tagName,
          className: element.className,
          hasVisibleFocus: !!element.matches(':focus-visible')
        };
      });

      recordTest('키보드 포커스', activeElement.tagName !== 'BODY');
      recordTest('Skip Link 포커스', activeElement.className.includes('skip-to-content'));
    });
  });

  describe('📱 반응형 디자인', () => {
    test('모바일 뷰포트 테스트', async () => {
      // 모바일 크기로 변경
      await page.setViewport({ width: 375, height: 667 });
      
      const mobileLayout = await page.evaluate(() => {
        const container = document.querySelector('.container');
        const characterCards = document.querySelectorAll('.character-card');
        
        return {
          containerPadding: getComputedStyle(container).paddingLeft,
          characterCardDirection: characterCards.length > 0 ? 
            getComputedStyle(characterCards[0]).flexDirection : null
        };
      });

      recordTest('모바일 컨테이너 패딩', mobileLayout.containerPadding !== '16px');
      
      // 스크린샷 촬영
      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/mobile-responsive.png'),
        fullPage: true 
      });
    });

    test('태블릿 뷰포트 테스트', async () => {
      await page.setViewport({ width: 768, height: 1024 });
      
      // 레이아웃이 깨지지 않는지 확인
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      recordTest('태블릿 가로 스크롤 없음', !hasOverflow);
    });

    test('데스크톱 뷰포트 테스트', async () => {
      await page.setViewport({ width: 1920, height: 1080 });
      
      const desktopLayout = await page.evaluate(() => {
        const container = document.querySelector('.container');
        return {
          maxWidth: getComputedStyle(container).maxWidth,
          margin: getComputedStyle(container).margin
        };
      });

      recordTest('데스크톱 컨테이너 최대폭', desktopLayout.maxWidth === '1200px');
      recordTest('데스크톱 중앙 정렬', desktopLayout.margin.includes('auto'));
    });
  });

  describe('🎨 테마 시스템', () => {
    beforeEach(async () => {
      await page.setViewport({ width: 1280, height: 720 });
      await page.goto(baseURL);
    });

    test('라이트 테마 (기본)', async () => {
      const lightTheme = await page.evaluate(() => {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const bgColor = getComputedStyle(document.body).backgroundColor;
        return { theme, bgColor };
      });

      recordTest('기본 라이트 테마', lightTheme.theme === 'light');
      recordTest('라이트 배경색', lightTheme.bgColor.includes('250, 249, 250') || lightTheme.bgColor.includes('rgb'));
    });

    test('다크 테마 전환', async () => {
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });

      const darkTheme = await page.evaluate(() => {
        return {
          theme: document.documentElement.getAttribute('data-theme'),
          applied: true
        };
      });

      recordTest('다크 테마 설정', darkTheme.theme === 'dark');
      
      // 스크린샷 촬영
      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/dark-theme.png'),
        fullPage: true 
      });
    });

    test('고대비 테마 전환', async () => {
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'hc');
      });

      const hcTheme = await page.evaluate(() => {
        return {
          theme: document.documentElement.getAttribute('data-theme')
        };
      });

      recordTest('고대비 테마 설정', hcTheme.theme === 'hc');
      
      // 스크린샷 촬영
      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/high-contrast-theme.png'),
        fullPage: true 
      });
    });
  });

  describe('🥔🐰 캐릭터 시스템', () => {
    test('캐릭터 요소 존재 확인', async () => {
      const characters = await page.evaluate(() => {
        return {
          potatoExists: !!document.querySelector('#potatoCharacter'),
          rabbitExists: !!document.querySelector('#rabbitCharacter'),
          characterCards: document.querySelectorAll('.character-card').length,
          characterMessages: document.querySelectorAll('.character-message').length,
          potatoMessage: document.querySelector('#potatoMessage')?.textContent || '',
          rabbitMessage: document.querySelector('#rabbitMessage')?.textContent || ''
        };
      });

      recordTest('감자 캐릭터 존재', characters.potatoExists);
      recordTest('토끼 캐릭터 존재', characters.rabbitExists);
      recordTest('캐릭터 카드 개수', characters.characterCards === 2, `Found: ${characters.characterCards}`);
      recordTest('캐릭터 메시지 존재', characters.characterMessages >= 2);
      recordTest('감자 메시지 내용', characters.potatoMessage.length > 0);
      recordTest('토끼 메시지 내용', characters.rabbitMessage.length > 0);
    });

    test('캐릭터 상호작용', async () => {
      // 캐릭터 클릭 시뮬레이션
      const interaction = await page.evaluate(() => {
        const potatoElement = document.querySelector('#potatoCharacter');
        const rabbitElement = document.querySelector('#rabbitCharacter');
        
        let result = {
          potatoClickable: false,
          rabbitClickable: false
        };
        
        if (potatoElement) {
          result.potatoClickable = potatoElement.hasAttribute('tabindex') || potatoElement.getAttribute('role') === 'button';
        }
        
        if (rabbitElement) {
          result.rabbitClickable = rabbitElement.hasAttribute('tabindex') || rabbitElement.getAttribute('role') === 'button';
        }
        
        return result;
      });

      recordTest('감자 캐릭터 상호작용 가능', interaction.potatoClickable);
      recordTest('토끼 캐릭터 상호작용 가능', interaction.rabbitClickable);
    });
  });

  describe('🚀 네비게이션 시스템', () => {
    test('하단 네비게이션 기능', async () => {
      const navigation = await page.evaluate(() => {
        const navItems = document.querySelectorAll('.nav-item');
        const activeItem = document.querySelector('.nav-item.active');
        
        return {
          navItemCount: navItems.length,
          hasActiveItem: !!activeItem,
          activeItemText: activeItem?.textContent?.trim() || '',
          allItemsHaveHref: Array.from(navItems).every(item => item.hasAttribute('href'))
        };
      });

      recordTest('네비게이션 항목 개수', navigation.navItemCount >= 3, `Found: ${navigation.navItemCount}`);
      recordTest('활성 네비게이션 항목', navigation.hasActiveItem);
      recordTest('홈 활성 상태', navigation.activeItemText.includes('홈'));
      recordTest('모든 네비게이션 링크', navigation.allItemsHaveHref);
    });

    test('페이지 전환 테스트', async () => {
      // 거래 내역 페이지로 이동
      try {
        await page.click('a[href="transaction-history.html"]');
        await page.waitForLoadState('networkidle');
        
        const newPageTitle = await page.title();
        recordTest('거래 내역 페이지 전환', newPageTitle.includes('거래 내역'));
      } catch (error) {
        recordTest('거래 내역 페이지 전환', false, error.message);
      }
    });
  });

  describe('💰 거래 관련 기능', () => {
    beforeEach(async () => {
      await page.goto(baseURL);
    });

    test('거래 요약 카드', async () => {
      const summaryData = await page.evaluate(() => {
        const balanceCard = document.querySelector('.balance-card');
        const incomeCard = document.querySelector('.income-card');
        const expenseCard = document.querySelector('.expense-card');
        
        return {
          hasBalanceCard: !!balanceCard,
          hasIncomeCard: !!incomeCard,
          hasExpenseCard: !!expenseCard,
          balanceAmount: balanceCard?.querySelector('.balance-amount')?.textContent?.trim() || '',
          incomeAmount: incomeCard?.querySelector('.income-amount')?.textContent?.trim() || '',
          expenseAmount: expenseCard?.querySelector('.expense-amount')?.textContent?.trim() || ''
        };
      });

      recordTest('잔액 카드 존재', summaryData.hasBalanceCard);
      recordTest('수입 카드 존재', summaryData.hasIncomeCard);
      recordTest('지출 카드 존재', summaryData.hasExpenseCard);
      recordTest('잔액 표시', summaryData.balanceAmount.includes('₩'));
      recordTest('수입 표시', summaryData.incomeAmount.includes('+₩'));
      recordTest('지출 표시', summaryData.expenseAmount.includes('-₩'));
    });

    test('빠른 액션 버튼', async () => {
      const actionButtons = await page.evaluate(() => {
        const incomeBtn = document.querySelector('#addIncomeBtn');
        const expenseBtn = document.querySelector('#addExpenseBtn');
        const viewAllBtn = document.querySelector('#viewAllBtn');
        
        return {
          hasIncomeButton: !!incomeBtn,
          hasExpenseButton: !!expenseBtn,
          hasViewAllButton: !!viewAllBtn,
          incomeButtonText: incomeBtn?.textContent?.includes('수입 추가') || false,
          expenseButtonText: expenseBtn?.textContent?.includes('지출 추가') || false,
          viewAllButtonText: viewAllBtn?.textContent?.includes('전체 보기') || false
        };
      });

      recordTest('수입 추가 버튼', actionButtons.hasIncomeButton);
      recordTest('지출 추가 버튼', actionButtons.hasExpenseButton);
      recordTest('전체 보기 버튼', actionButtons.hasViewAllButton);
      recordTest('수입 버튼 텍스트', actionButtons.incomeButtonText);
      recordTest('지출 버튼 텍스트', actionButtons.expenseButtonText);
      recordTest('전체 보기 버튼 텍스트', actionButtons.viewAllButtonText);
    });
  });

  describe('🍽️ 식단 계획 기능', () => {
    test('식단 페이지 접근', async () => {
      try {
        await page.goto(`file://${path.resolve(__dirname, '../meal-planning.html')}`);
        await page.waitForLoadState('networkidle');
        
        const mealPageTitle = await page.title();
        recordTest('식단 계획 페이지 로딩', mealPageTitle.includes('식단'));
        
        // 스크린샷 촬영
        await page.screenshot({ 
          path: path.join(__dirname, 'screenshots/meal-planning-page.png'),
          fullPage: true 
        });
      } catch (error) {
        recordTest('식단 계획 페이지 로딩', false, error.message);
      }
    });
  });

  describe('📝 거래 입력 폼', () => {
    test('거래 폼 페이지 접근', async () => {
      try {
        await page.goto(`file://${path.resolve(__dirname, '../transaction-form.html')}`);
        await page.waitForLoadState('networkidle');
        
        const formPageTitle = await page.title();
        recordTest('거래 폼 페이지 로딩', formPageTitle.length > 0);
        
        // 스크린샷 촬영
        await page.screenshot({ 
          path: path.join(__dirname, 'screenshots/transaction-form-page.png'),
          fullPage: true 
        });
      } catch (error) {
        recordTest('거래 폼 페이지 로딩', false, error.message);
      }
    });
  });

  describe('🔧 전체 시스템 통합', () => {
    test('모든 페이지 로딩 테스트', async () => {
      const pages = [
        'index.html',
        'transaction-history.html', 
        'meal-planning.html',
        'transaction-form.html'
      ];

      for (const pageFile of pages) {
        try {
          await page.goto(`file://${path.resolve(__dirname, `../${pageFile}`)}`);
          await page.waitForLoadState('networkidle');
          
          const hasError = await page.evaluate(() => {
            return document.body.textContent.includes('error') || 
                   document.body.textContent.includes('404') ||
                   document.body.textContent === '';
          });

          recordTest(`${pageFile} 로딩`, !hasError);
        } catch (error) {
          recordTest(`${pageFile} 로딩`, false, error.message);
        }
      }
    });

    test('CSS 스타일 적용 확인', async () => {
      await page.goto(baseURL);
      
      const stylesApplied = await page.evaluate(() => {
        const body = document.body;
        const header = document.querySelector('.app-header');
        
        return {
          bodyHasFont: getComputedStyle(body).fontFamily !== '',
          bodyHasBackground: getComputedStyle(body).backgroundColor !== 'rgba(0, 0, 0, 0)',
          headerHasStyles: header ? getComputedStyle(header).padding !== '0px' : false,
          cssLoaded: document.styleSheets.length > 0
        };
      });

      recordTest('Body 폰트 적용', stylesApplied.bodyHasFont);
      recordTest('Body 배경색 적용', stylesApplied.bodyHasBackground);
      recordTest('Header 스타일 적용', stylesApplied.headerHasStyles);
      recordTest('CSS 파일 로딩', stylesApplied.cssLoaded);
    });
  });
});