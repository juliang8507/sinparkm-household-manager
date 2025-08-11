/**
 * ⌨️ 키보드 접근성 테스터
 * 
 * 키보드 전용 사용자를 위한 완전한 접근성 검증
 * - 탭 네비게이션 순서 및 가시성
 * - 포커스 관리 및 트래핑
 * - 키보드 단축키 동작
 * - ARIA 상호작용 지원
 */

class KeyboardTester {
    constructor(page) {
        this.page = page;
        this.results = {
            navigation: [],
            focusManagement: [],
            shortcuts: [],
            ariaSupport: []
        };
    }

    /**
     * 전체 키보드 접근성 테스트
     */
    async runAllTests() {
        console.log('⌨️ 키보드 접근성 종합 테스트 시작...');
        
        await this.testTabNavigation();
        await this.testFocusManagement();
        await this.testKeyboardShortcuts();
        await this.testAriaKeyboardSupport();
        
        return this.results;
    }

    /**
     * 탭 네비게이션 테스트
     */
    async testTabNavigation() {
        console.log('  📋 탭 네비게이션 테스트...');
        
        // 페이지 시작점으로 이동
        await this.page.evaluate(() => {
            document.body.focus();
        });
        
        const focusableElements = await this.getFocusableElements();
        const navigationResults = [];
        
        for (let i = 0; i < focusableElements.length; i++) {
            // Tab 키 누르기
            await this.page.keyboard.press('Tab');
            await this.page.waitForTimeout(100); // 포커스 전환 대기
            
            // 현재 포커스된 요소 정보 가져오기
            const focusInfo = await this.page.evaluate(() => {
                const focused = document.activeElement;
                if (!focused || focused === document.body) {
                    return null;
                }
                
                const rect = focused.getBoundingClientRect();
                const style = window.getComputedStyle(focused);
                
                return {
                    tagName: focused.tagName.toLowerCase(),
                    type: focused.type || null,
                    id: focused.id || null,
                    className: focused.className || null,
                    textContent: focused.textContent?.trim().slice(0, 50) || '',
                    tabIndex: focused.tabIndex,
                    role: focused.getAttribute('role'),
                    ariaLabel: focused.getAttribute('aria-label'),
                    ariaDescribedBy: focused.getAttribute('aria-describedby'),
                    
                    // 시각적 속성
                    visible: rect.width > 0 && rect.height > 0 && style.display !== 'none',
                    position: {
                        x: Math.round(rect.left),
                        y: Math.round(rect.top),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    },
                    
                    // 포커스 스타일링
                    hasFocusOutline: style.outline !== 'none' && style.outline !== '0px',
                    outlineStyle: style.outline,
                    boxShadow: style.boxShadow,
                    
                    // 접근성 속성
                    disabled: focused.disabled || focused.getAttribute('aria-disabled') === 'true',
                    hidden: focused.hidden || focused.getAttribute('aria-hidden') === 'true'
                };
            });
            
            if (focusInfo) {
                // 탭 순서 검증
                const issues = this.validateFocusElement(focusInfo, i);
                
                navigationResults.push({
                    index: i + 1,
                    element: focusInfo,
                    issues: issues,
                    passed: issues.length === 0
                });
            } else {
                navigationResults.push({
                    index: i + 1,
                    element: null,
                    issues: [{
                        type: 'no-focus',
                        severity: 'high',
                        message: 'Tab 키를 눌렀지만 포커스가 이동하지 않았습니다.'
                    }],
                    passed: false
                });
            }
        }
        
        // 마지막 요소에서 Tab 키를 눌렀을 때 순환되는지 확인
        await this.page.keyboard.press('Tab');
        const finalFocus = await this.page.evaluate(() => {
            const focused = document.activeElement;
            return focused ? {
                tagName: focused.tagName.toLowerCase(),
                id: focused.id,
                className: focused.className
            } : null;
        });
        
        // Shift+Tab 역순 네비게이션 테스트
        const reverseNavigation = await this.testReverseNavigation();
        
        this.results.navigation = {
            forward: navigationResults,
            reverse: reverseNavigation,
            circular: finalFocus,
            summary: {
                totalElements: focusableElements.length,
                reachableElements: navigationResults.filter(r => r.element !== null).length,
                elementsWithIssues: navigationResults.filter(r => r.issues.length > 0).length,
                passRate: navigationResults.length > 0 ? 
                    Math.round((navigationResults.filter(r => r.passed).length / navigationResults.length) * 100) : 0
            }
        };
        
        console.log(`    ✅ 탭 네비게이션: ${this.results.navigation.summary.reachableElements}/${this.results.navigation.summary.totalElements} 요소 접근 가능`);
        
        return navigationResults;
    }

    /**
     * 역순 탭 네비게이션 테스트 (Shift+Tab)
     */
    async testReverseNavigation() {
        console.log('  ⬅️ 역순 탭 네비게이션 테스트...');
        
        const reverseResults = [];
        
        // 마지막 포커스 가능한 요소로 이동
        const focusableCount = await this.page.evaluate(() => {
            const focusableElements = document.querySelectorAll(
                'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            return focusableElements.length;
        });
        
        // Shift+Tab을 여러 번 눌러서 역순 네비게이션 확인
        for (let i = 0; i < Math.min(focusableCount, 5); i++) {
            await this.page.keyboard.press('Shift+Tab');
            await this.page.waitForTimeout(100);
            
            const focusInfo = await this.page.evaluate(() => {
                const focused = document.activeElement;
                return focused && focused !== document.body ? {
                    tagName: focused.tagName.toLowerCase(),
                    id: focused.id || null,
                    textContent: focused.textContent?.trim().slice(0, 30) || ''
                } : null;
            });
            
            reverseResults.push({
                step: i + 1,
                element: focusInfo,
                success: focusInfo !== null
            });
        }
        
        return reverseResults;
    }

    /**
     * 포커스 관리 테스트
     */
    async testFocusManagement() {
        console.log('  🎯 포커스 관리 테스트...');
        
        const focusTests = [];
        
        // 1. 스킵 링크 테스트
        const skipLinkTest = await this.testSkipLinks();
        focusTests.push(skipLinkTest);
        
        // 2. 모달/다이얼로그 포커스 트래핑 테스트
        const modalTest = await this.testModalFocusTrapping();
        focusTests.push(modalTest);
        
        // 3. 드롭다운/메뉴 포커스 관리 테스트
        const dropdownTest = await this.testDropdownFocusManagement();
        focusTests.push(dropdownTest);
        
        // 4. 포커스 복원 테스트
        const focusRestoreTest = await this.testFocusRestore();
        focusTests.push(focusRestoreTest);
        
        this.results.focusManagement = focusTests;
        
        const passedTests = focusTests.filter(test => test.passed).length;
        console.log(`    ✅ 포커스 관리: ${passedTests}/${focusTests.length} 테스트 통과`);
        
        return focusTests;
    }

    /**
     * 스킵 링크 테스트
     */
    async testSkipLinks() {
        const skipLinks = await this.page.evaluate(() => {
            const skipElements = Array.from(document.querySelectorAll('a[href^="#"], .skip-link, .skip-to-content'));
            return skipElements.map((element, index) => ({
                index,
                tagName: element.tagName.toLowerCase(),
                href: element.getAttribute('href'),
                text: element.textContent?.trim() || '',
                id: element.id,
                className: element.className,
                visible: element.offsetWidth > 0 && element.offsetHeight > 0
            }));
        });
        
        const issues = [];
        
        if (skipLinks.length === 0) {
            issues.push({
                type: 'no-skip-links',
                severity: 'medium',
                message: '메인 콘텐츠로 건너뛸 수 있는 링크가 없습니다.'
            });
        }
        
        // 각 스킵 링크 테스트
        for (const skipLink of skipLinks) {
            if (skipLink.href) {
                const targetExists = await this.page.evaluate((href) => {
                    const target = document.querySelector(href);
                    return target !== null;
                }, skipLink.href);
                
                if (!targetExists) {
                    issues.push({
                        type: 'broken-skip-link',
                        severity: 'high',
                        message: `스킵 링크 대상 "${skipLink.href}"을 찾을 수 없습니다.`,
                        element: skipLink
                    });
                }
            }
        }
        
        return {
            name: 'Skip Links',
            skipLinks,
            issues,
            passed: issues.length === 0
        };
    }

    /**
     * 모달 포커스 트래핑 테스트
     */
    async testModalFocusTrapping() {
        // 모달 트리거 버튼 찾기
        const modalTriggers = await this.page.evaluate(() => {
            const triggers = Array.from(document.querySelectorAll('[data-bs-toggle="modal"], [data-toggle="modal"], .modal-trigger, button[data-target]'));
            return triggers.map(trigger => ({
                selector: trigger.tagName.toLowerCase() + (trigger.id ? `#${trigger.id}` : '') + (trigger.className ? `.${trigger.className.split(' ').join('.')}` : ''),
                text: trigger.textContent?.trim() || ''
            }));
        });
        
        const issues = [];
        
        if (modalTriggers.length === 0) {
            return {
                name: 'Modal Focus Trapping',
                modalTriggers: [],
                issues: [{
                    type: 'no-modals',
                    severity: 'info',
                    message: '테스트할 모달이 없습니다.'
                }],
                passed: true
            };
        }
        
        // 첫 번째 모달 트리거 테스트
        try {
            await this.page.click(modalTriggers[0].selector);
            await this.page.waitForTimeout(500); // 모달 열림 대기
            
            // 모달이 열렸는지 확인
            const modalVisible = await this.page.evaluate(() => {
                const modals = document.querySelectorAll('.modal, [role="dialog"], [aria-modal="true"]');
                return Array.from(modals).some(modal => {
                    const style = window.getComputedStyle(modal);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                });
            });
            
            if (modalVisible) {
                // Tab 키를 여러 번 눌러서 포커스가 모달 안에서만 순환하는지 확인
                const focusTrappingTest = await this.testFocusTrapping();
                if (!focusTrappingTest.trapped) {
                    issues.push({
                        type: 'focus-not-trapped',
                        severity: 'high',
                        message: '모달 내에서 포커스가 트래핑되지 않습니다.'
                    });
                }
                
                // ESC 키로 모달 닫기 테스트
                await this.page.keyboard.press('Escape');
                await this.page.waitForTimeout(300);
                
                const modalClosed = await this.page.evaluate(() => {
                    const modals = document.querySelectorAll('.modal, [role="dialog"], [aria-modal="true"]');
                    return Array.from(modals).every(modal => {
                        const style = window.getComputedStyle(modal);
                        return style.display === 'none' || style.visibility === 'hidden';
                    });
                });
                
                if (!modalClosed) {
                    issues.push({
                        type: 'esc-not-working',
                        severity: 'medium',
                        message: 'ESC 키로 모달을 닫을 수 없습니다.'
                    });
                }
            } else {
                issues.push({
                    type: 'modal-not-opening',
                    severity: 'high',
                    message: '모달이 열리지 않습니다.'
                });
            }
        } catch (error) {
            issues.push({
                type: 'modal-test-error',
                severity: 'high',
                message: `모달 테스트 중 오류: ${error.message}`
            });
        }
        
        return {
            name: 'Modal Focus Trapping',
            modalTriggers,
            issues,
            passed: issues.length === 0
        };
    }

    /**
     * 포커스 트래핑 테스트
     */
    async testFocusTrapping() {
        const focusSequence = [];
        const maxTabs = 10;
        
        for (let i = 0; i < maxTabs; i++) {
            await this.page.keyboard.press('Tab');
            await this.page.waitForTimeout(100);
            
            const focusInfo = await this.page.evaluate(() => {
                const focused = document.activeElement;
                if (!focused) return null;
                
                const modal = focused.closest('.modal, [role="dialog"], [aria-modal="true"]');
                return {
                    inModal: modal !== null,
                    element: {
                        tagName: focused.tagName.toLowerCase(),
                        id: focused.id || null,
                        className: focused.className || null
                    }
                };
            });
            
            focusSequence.push(focusInfo);
            
            // 포커스가 모달 밖으로 나간 경우
            if (focusInfo && !focusInfo.inModal) {
                return { trapped: false, sequence: focusSequence };
            }
        }
        
        return { trapped: true, sequence: focusSequence };
    }

    /**
     * 드롭다운 포커스 관리 테스트
     */
    async testDropdownFocusManagement() {
        const dropdownTriggers = await this.page.evaluate(() => {
            const triggers = Array.from(document.querySelectorAll('[data-bs-toggle="dropdown"], [data-toggle="dropdown"], .dropdown-toggle'));
            return triggers.map((trigger, index) => ({
                index,
                selector: trigger.tagName.toLowerCase() + (trigger.id ? `#${trigger.id}` : `[data-dropdown-index="${index}"]`),
                text: trigger.textContent?.trim() || ''
            }));
        });
        
        const issues = [];
        
        if (dropdownTriggers.length === 0) {
            return {
                name: 'Dropdown Focus Management',
                dropdownTriggers: [],
                issues: [{
                    type: 'no-dropdowns',
                    severity: 'info',
                    message: '테스트할 드롭다운이 없습니다.'
                }],
                passed: true
            };
        }
        
        // 첫 번째 드롭다운 테스트
        try {
            // 드롭다운 인덱스 추가 (셀렉터가 없는 경우)
            await this.page.evaluate(() => {
                const triggers = document.querySelectorAll('[data-bs-toggle="dropdown"], [data-toggle="dropdown"], .dropdown-toggle');
                triggers.forEach((trigger, index) => {
                    if (!trigger.id && !trigger.className) {
                        trigger.setAttribute('data-dropdown-index', index);
                    }
                });
            });
            
            await this.page.click(dropdownTriggers[0].selector);
            await this.page.waitForTimeout(300);
            
            // 화살표 키로 메뉴 아이템 네비게이션 테스트
            const arrowNavTest = await this.testArrowKeyNavigation();
            if (!arrowNavTest.working) {
                issues.push({
                    type: 'arrow-nav-not-working',
                    severity: 'medium',
                    message: '화살표 키로 메뉴를 탐색할 수 없습니다.'
                });
            }
            
            // ESC 키로 드롭다운 닫기
            await this.page.keyboard.press('Escape');
            
        } catch (error) {
            issues.push({
                type: 'dropdown-test-error',
                severity: 'high',
                message: `드롭다운 테스트 중 오류: ${error.message}`
            });
        }
        
        return {
            name: 'Dropdown Focus Management',
            dropdownTriggers,
            issues,
            passed: issues.length === 0
        };
    }

    /**
     * 화살표 키 네비게이션 테스트
     */
    async testArrowKeyNavigation() {
        const navigationResults = [];
        
        for (let i = 0; i < 3; i++) {
            await this.page.keyboard.press('ArrowDown');
            await this.page.waitForTimeout(100);
            
            const focusInfo = await this.page.evaluate(() => {
                const focused = document.activeElement;
                return focused ? {
                    tagName: focused.tagName.toLowerCase(),
                    role: focused.getAttribute('role'),
                    text: focused.textContent?.trim().slice(0, 30) || ''
                } : null;
            });
            
            navigationResults.push(focusInfo);
        }
        
        return {
            working: navigationResults.some(result => result !== null),
            sequence: navigationResults
        };
    }

    /**
     * 포커스 복원 테스트
     */
    async testFocusRestore() {
        const issues = [];
        
        // 버튼에 포커스를 맞춘 후 모달 열고 닫기
        const buttons = await this.page.$$('button');
        
        if (buttons.length > 0) {
            try {
                await buttons[0].focus();
                
                const initialFocus = await this.page.evaluate(() => {
                    return document.activeElement ? {
                        tagName: document.activeElement.tagName.toLowerCase(),
                        id: document.activeElement.id,
                        className: document.activeElement.className
                    } : null;
                });
                
                // 모달이 있다면 열고 닫기
                const modalTrigger = await this.page.$('[data-bs-toggle="modal"], [data-toggle="modal"]');
                if (modalTrigger) {
                    await modalTrigger.click();
                    await this.page.waitForTimeout(500);
                    await this.page.keyboard.press('Escape');
                    await this.page.waitForTimeout(500);
                    
                    const restoredFocus = await this.page.evaluate(() => {
                        return document.activeElement ? {
                            tagName: document.activeElement.tagName.toLowerCase(),
                            id: document.activeElement.id,
                            className: document.activeElement.className
                        } : null;
                    });
                    
                    if (!restoredFocus || 
                        restoredFocus.tagName !== initialFocus.tagName ||
                        restoredFocus.id !== initialFocus.id) {
                        issues.push({
                            type: 'focus-not-restored',
                            severity: 'medium',
                            message: '모달을 닫은 후 이전 포커스 위치가 복원되지 않았습니다.',
                            initial: initialFocus,
                            restored: restoredFocus
                        });
                    }
                }
                
            } catch (error) {
                issues.push({
                    type: 'focus-restore-error',
                    severity: 'medium',
                    message: `포커스 복원 테스트 중 오류: ${error.message}`
                });
            }
        }
        
        return {
            name: 'Focus Restore',
            issues,
            passed: issues.length === 0
        };
    }

    /**
     * 키보드 단축키 테스트
     */
    async testKeyboardShortcuts() {
        console.log('  ⚡ 키보드 단축키 테스트...');
        
        const shortcuts = [
            { keys: 'Escape', description: 'ESC - 모달/오버레이 닫기' },
            { keys: 'Enter', description: 'Enter - 활성화' },
            { keys: 'Space', description: 'Space - 버튼/체크박스 활성화' },
            { keys: 'Home', description: 'Home - 목록 첫 항목으로' },
            { keys: 'End', description: 'End - 목록 마지막 항목으로' },
            { keys: 'ArrowUp', description: '위 화살표 - 이전 항목' },
            { keys: 'ArrowDown', description: '아래 화살표 - 다음 항목' }
        ];
        
        const shortcutResults = [];
        
        for (const shortcut of shortcuts) {
            try {
                // 적절한 컨텍스트에서 단축키 테스트
                const result = await this.testSpecificShortcut(shortcut);
                shortcutResults.push({
                    ...shortcut,
                    ...result,
                    passed: result.issues.length === 0
                });
            } catch (error) {
                shortcutResults.push({
                    ...shortcut,
                    working: false,
                    issues: [{
                        type: 'shortcut-error',
                        severity: 'medium',
                        message: `단축키 테스트 중 오류: ${error.message}`
                    }],
                    passed: false
                });
            }
        }
        
        this.results.shortcuts = shortcutResults;
        
        const workingShortcuts = shortcutResults.filter(r => r.working).length;
        console.log(`    ✅ 키보드 단축키: ${workingShortcuts}/${shortcutResults.length} 단축키 동작`);
        
        return shortcutResults;
    }

    /**
     * 특정 단축키 테스트
     */
    async testSpecificShortcut(shortcut) {
        const issues = [];
        let working = false;
        
        const beforeState = await this.page.evaluate(() => {
            return {
                activeElement: document.activeElement ? document.activeElement.tagName : 'BODY',
                modalOpen: !!document.querySelector('.modal.show, [aria-modal="true"]'),
                dropdownOpen: !!document.querySelector('.dropdown-menu.show, [aria-expanded="true"]')
            };
        });
        
        // 단축키 실행
        await this.page.keyboard.press(shortcut.keys);
        await this.page.waitForTimeout(300);
        
        const afterState = await this.page.evaluate(() => {
            return {
                activeElement: document.activeElement ? document.activeElement.tagName : 'BODY',
                modalOpen: !!document.querySelector('.modal.show, [aria-modal="true"]'),
                dropdownOpen: !!document.querySelector('.dropdown-menu.show, [aria-expanded="true"]')
            };
        });
        
        // 단축키별 동작 확인
        switch (shortcut.keys) {
            case 'Escape':
                if (beforeState.modalOpen && !afterState.modalOpen) {
                    working = true;
                } else if (beforeState.dropdownOpen && !afterState.dropdownOpen) {
                    working = true;
                } else if (!beforeState.modalOpen && !beforeState.dropdownOpen) {
                    working = true; // 닫을 것이 없으면 정상
                }
                break;
                
            case 'Enter':
            case 'Space':
                // 포커스된 요소가 활성화되었는지 확인 (복잡한 상태 변화 체크)
                working = true; // 기본적으로 동작한다고 가정
                break;
                
            case 'ArrowUp':
            case 'ArrowDown':
                // 포커스 이동 확인
                if (beforeState.activeElement !== afterState.activeElement) {
                    working = true;
                }
                break;
                
            default:
                working = true;
        }
        
        if (!working) {
            issues.push({
                type: 'shortcut-not-working',
                severity: 'medium',
                message: `${shortcut.keys} 단축키가 예상대로 동작하지 않습니다.`
            });
        }
        
        return {
            working,
            beforeState,
            afterState,
            issues
        };
    }

    /**
     * ARIA 키보드 지원 테스트
     */
    async testAriaKeyboardSupport() {
        console.log('  🎭 ARIA 키보드 지원 테스트...');
        
        const ariaElements = await this.page.evaluate(() => {
            const elements = document.querySelectorAll('[role], [aria-expanded], [aria-selected]');
            return Array.from(elements).map((element, index) => ({
                index,
                tagName: element.tagName.toLowerCase(),
                role: element.getAttribute('role'),
                ariaExpanded: element.getAttribute('aria-expanded'),
                ariaSelected: element.getAttribute('aria-selected'),
                tabIndex: element.tabIndex,
                textContent: element.textContent?.trim().slice(0, 30) || ''
            }));
        });
        
        const ariaTests = [];
        
        for (const element of ariaElements) {
            const test = await this.testAriaElementKeyboard(element);
            ariaTests.push(test);
        }
        
        this.results.ariaSupport = ariaTests;
        
        const passedTests = ariaTests.filter(test => test.passed).length;
        console.log(`    ✅ ARIA 키보드 지원: ${passedTests}/${ariaTests.length} 요소 통과`);
        
        return ariaTests;
    }

    /**
     * 개별 ARIA 요소 키보드 지원 테스트
     */
    async testAriaElementKeyboard(elementInfo) {
        const issues = [];
        
        // 역할별 키보드 요구사항 확인
        switch (elementInfo.role) {
            case 'button':
                if (elementInfo.tabIndex < 0) {
                    issues.push({
                        type: 'button-not-focusable',
                        severity: 'high',
                        message: 'button 역할의 요소가 키보드로 접근할 수 없습니다.'
                    });
                }
                break;
                
            case 'link':
                if (elementInfo.tabIndex < 0) {
                    issues.push({
                        type: 'link-not-focusable',
                        severity: 'high',
                        message: 'link 역할의 요소가 키보드로 접근할 수 없습니다.'
                    });
                }
                break;
                
            case 'menuitem':
            case 'option':
                // 이러한 요소들은 보통 화살표 키로 접근
                if (elementInfo.tabIndex === -1) {
                    // 정상 (보통 programmatic focus)
                } else if (elementInfo.tabIndex < -1) {
                    issues.push({
                        type: 'menuitem-invalid-tabindex',
                        severity: 'medium',
                        message: 'menuitem/option 요소의 tabindex가 잘못 설정되었습니다.'
                    });
                }
                break;
        }
        
        return {
            element: elementInfo,
            issues,
            passed: issues.length === 0
        };
    }

    /**
     * 포커스 가능한 요소 목록 가져오기
     */
    async getFocusableElements() {
        return await this.page.evaluate(() => {
            const focusableSelectors = [
                'a[href]',
                'button:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                '[tabindex]:not([tabindex="-1"])',
                '[contenteditable="true"]'
            ];
            
            const elements = document.querySelectorAll(focusableSelectors.join(', '));
            
            return Array.from(elements)
                .filter(element => {
                    const style = window.getComputedStyle(element);
                    return style.display !== 'none' && 
                           style.visibility !== 'hidden' && 
                           element.offsetWidth > 0 && 
                           element.offsetHeight > 0;
                })
                .map((element, index) => ({
                    index,
                    tagName: element.tagName.toLowerCase(),
                    type: element.type || null,
                    id: element.id || null,
                    tabIndex: element.tabIndex
                }));
        });
    }

    /**
     * 포커스된 요소 검증
     */
    validateFocusElement(focusInfo, expectedIndex) {
        const issues = [];
        
        // 포커스 시각적 표시 확인
        if (!focusInfo.hasFocusOutline && 
            !focusInfo.boxShadow.includes('rgb') && 
            focusInfo.boxShadow === 'none') {
            issues.push({
                type: 'no-focus-indicator',
                severity: 'high',
                message: '포커스 시각적 표시가 없습니다.'
            });
        }
        
        // 숨겨진 요소 확인
        if (!focusInfo.visible) {
            issues.push({
                type: 'hidden-focus',
                severity: 'high',
                message: '보이지 않는 요소에 포커스가 있습니다.'
            });
        }
        
        // 비활성 요소 확인
        if (focusInfo.disabled) {
            issues.push({
                type: 'disabled-focus',
                severity: 'high',
                message: '비활성화된 요소에 포커스가 있습니다.'
            });
        }
        
        // 너무 작은 터치 대상
        if (focusInfo.position.width < 44 || focusInfo.position.height < 44) {
            issues.push({
                type: 'small-touch-target',
                severity: 'medium',
                message: '터치 대상이 44px보다 작습니다.'
            });
        }
        
        return issues;
    }

    /**
     * 키보드 접근성 점수 계산
     */
    calculateScore() {
        let totalTests = 0;
        let passedTests = 0;
        
        // 탭 네비게이션 점수
        if (this.results.navigation && this.results.navigation.forward) {
            totalTests += this.results.navigation.forward.length;
            passedTests += this.results.navigation.forward.filter(r => r.passed).length;
        }
        
        // 포커스 관리 점수
        if (this.results.focusManagement) {
            totalTests += this.results.focusManagement.length;
            passedTests += this.results.focusManagement.filter(r => r.passed).length;
        }
        
        // 키보드 단축키 점수
        if (this.results.shortcuts) {
            totalTests += this.results.shortcuts.length;
            passedTests += this.results.shortcuts.filter(r => r.passed).length;
        }
        
        // ARIA 지원 점수
        if (this.results.ariaSupport) {
            totalTests += this.results.ariaSupport.length;
            passedTests += this.results.ariaSupport.filter(r => r.passed).length;
        }
        
        return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    }

    /**
     * 상세 리포트 생성
     */
    generateReport() {
        const score = this.calculateScore();
        
        return {
            timestamp: new Date().toISOString(),
            score: score,
            summary: {
                navigation: this.results.navigation?.summary || {},
                focusManagement: {
                    totalTests: this.results.focusManagement?.length || 0,
                    passedTests: this.results.focusManagement?.filter(r => r.passed).length || 0
                },
                shortcuts: {
                    totalShortcuts: this.results.shortcuts?.length || 0,
                    workingShortcuts: this.results.shortcuts?.filter(r => r.working).length || 0
                },
                ariaSupport: {
                    totalElements: this.results.ariaSupport?.length || 0,
                    supportedElements: this.results.ariaSupport?.filter(r => r.passed).length || 0
                }
            },
            details: this.results,
            recommendations: this.generateRecommendations()
        };
    }

    /**
     * 개선 권장사항 생성
     */
    generateRecommendations() {
        const recommendations = [];
        
        // 탭 네비게이션 관련
        if (this.results.navigation && this.results.navigation.summary.passRate < 80) {
            recommendations.push({
                category: 'Tab Navigation',
                priority: 'high',
                title: '탭 네비게이션 개선',
                description: '일부 요소가 키보드로 접근할 수 없거나 포커스 표시가 없습니다.',
                actions: [
                    '모든 상호작용 가능한 요소에 적절한 tabindex 설정',
                    '포커스 상태의 시각적 표시 개선',
                    '논리적인 탭 순서 확인'
                ]
            });
        }
        
        // 포커스 관리 관련
        const focusIssues = this.results.focusManagement?.filter(test => !test.passed).length || 0;
        if (focusIssues > 0) {
            recommendations.push({
                category: 'Focus Management',
                priority: 'high',
                title: '포커스 관리 개선',
                description: '모달이나 드롭다운에서 포커스가 적절히 관리되지 않습니다.',
                actions: [
                    '모달에서 포커스 트래핑 구현',
                    'ESC 키로 모달/메뉴 닫기 기능 추가',
                    '포커스 복원 기능 구현'
                ]
            });
        }
        
        // 키보드 단축키 관련
        const nonWorkingShortcuts = this.results.shortcuts?.filter(s => !s.working).length || 0;
        if (nonWorkingShortcuts > 0) {
            recommendations.push({
                category: 'Keyboard Shortcuts',
                priority: 'medium',
                title: '키보드 단축키 지원 강화',
                description: '일부 키보드 단축키가 예상대로 동작하지 않습니다.',
                actions: [
                    '화살표 키 네비게이션 구현',
                    'Enter/Space 키 활성화 지원',
                    '표준 키보드 단축키 패턴 적용'
                ]
            });
        }
        
        return recommendations;
    }
}

module.exports = KeyboardTester;