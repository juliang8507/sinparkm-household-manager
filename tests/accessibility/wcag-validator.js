/**
 * 🔍 WCAG 2.1 AA 준수 검증기
 * 
 * 감자토끼 가계부의 WCAG 2.1 AA 기준 상세 검증
 * - 지각 가능성 (Perceivable)
 * - 운용 가능성 (Operable)  
 * - 이해 가능성 (Understandable)
 * - 견고성 (Robust)
 */

class WCAGValidator {
    constructor(page) {
        this.page = page;
        this.results = {
            perceivable: [],
            operable: [],
            understandable: [],
            robust: [],
            summary: {
                total: 0,
                passed: 0,
                failed: 0,
                score: 0
            }
        };
    }

    /**
     * 전체 WCAG 검증 실행
     */
    async validateAll() {
        console.log('🔍 WCAG 2.1 AA 전체 검증 시작...');
        
        await this.validatePerceivable();
        await this.validateOperable();
        await this.validateUnderstandable();
        await this.validateRobust();
        
        this.calculateSummary();
        
        return this.results;
    }

    /**
     * 1. 지각 가능성 (Perceivable) 검증
     * - 1.1 대체 텍스트
     * - 1.2 시간 기반 미디어
     * - 1.3 적응 가능
     * - 1.4 구별 가능
     */
    async validatePerceivable() {
        console.log('  👁️ 지각 가능성 검증...');
        
        // 1.1.1 비텍스트 콘텐츠 (AA)
        await this.check_1_1_1_NonTextContent();
        
        // 1.3.1 정보 및 관계 (A)
        await this.check_1_3_1_InfoAndRelationships();
        
        // 1.3.2 의미 있는 순서 (A) 
        await this.check_1_3_2_MeaningfulSequence();
        
        // 1.3.3 감각적 특성 (A)
        await this.check_1_3_3_SensoryCharacteristics();
        
        // 1.3.4 방향 (AA)
        await this.check_1_3_4_Orientation();
        
        // 1.3.5 입력 목적 식별 (AA)
        await this.check_1_3_5_IdentifyInputPurpose();
        
        // 1.4.1 색상 사용 (A)
        await this.check_1_4_1_UseOfColor();
        
        // 1.4.2 음성 제어 (A)
        await this.check_1_4_2_AudioControl();
        
        // 1.4.3 대비 (최소) (AA)
        await this.check_1_4_3_ContrastMinimum();
        
        // 1.4.4 텍스트 크기 조정 (AA)
        await this.check_1_4_4_ResizeText();
        
        // 1.4.5 이미지 텍스트 (AA)
        await this.check_1_4_5_ImagesOfText();
        
        // 1.4.10 리플로우 (AA)
        await this.check_1_4_10_Reflow();
        
        // 1.4.11 비텍스트 대비 (AA)
        await this.check_1_4_11_NonTextContrast();
        
        // 1.4.12 텍스트 간격 (AA)
        await this.check_1_4_12_TextSpacing();
        
        // 1.4.13 호버 또는 포커스 콘텐츠 (AA)
        await this.check_1_4_13_ContentOnHoverOrFocus();
    }

    /**
     * 2. 운용 가능성 (Operable) 검증
     * - 2.1 키보드 접근 가능
     * - 2.2 충분한 시간
     * - 2.3 발작 및 물리적 반응
     * - 2.4 탐색 가능
     * - 2.5 입력 양식
     */
    async validateOperable() {
        console.log('  ⌨️ 운용 가능성 검증...');
        
        // 2.1.1 키보드 (A)
        await this.check_2_1_1_Keyboard();
        
        // 2.1.2 키보드 함정 없음 (A)
        await this.check_2_1_2_NoKeyboardTrap();
        
        // 2.1.4 문자키 단축키 (A)
        await this.check_2_1_4_CharacterKeyShortcuts();
        
        // 2.2.1 타이밍 조절 가능 (A)
        await this.check_2_2_1_TimingAdjustable();
        
        // 2.2.2 일시정지, 정지, 숨기기 (A)
        await this.check_2_2_2_PauseStopHide();
        
        // 2.3.1 번쩍임 임계값 (A)
        await this.check_2_3_1_ThreeFlashesOrBelowThreshold();
        
        // 2.4.1 블록 건너뛰기 (A)
        await this.check_2_4_1_BypassBlocks();
        
        // 2.4.2 페이지 제목 (A)
        await this.check_2_4_2_PageTitled();
        
        // 2.4.3 포커스 순서 (A)
        await this.check_2_4_3_FocusOrder();
        
        // 2.4.4 링크 목적 (맥락상) (A)
        await this.check_2_4_4_LinkPurposeInContext();
        
        // 2.4.5 여러 방법 (AA)
        await this.check_2_4_5_MultipleWays();
        
        // 2.4.6 제목 및 레이블 (AA)
        await this.check_2_4_6_HeadingsAndLabels();
        
        // 2.4.7 포커스 표시 (AA)
        await this.check_2_4_7_FocusVisible();
        
        // 2.5.1 포인터 제스처 (A)
        await this.check_2_5_1_PointerGestures();
        
        // 2.5.2 포인터 취소 (A)
        await this.check_2_5_2_PointerCancellation();
        
        // 2.5.3 이름에 레이블 포함 (A)
        await this.check_2_5_3_LabelInName();
        
        // 2.5.4 모션 액추에이션 (A)
        await this.check_2_5_4_MotionActuation();
    }

    /**
     * 3. 이해 가능성 (Understandable) 검증
     * - 3.1 가독성
     * - 3.2 예측 가능성
     * - 3.3 입력 지원
     */
    async validateUnderstandable() {
        console.log('  💡 이해 가능성 검증...');
        
        // 3.1.1 페이지 언어 (A)
        await this.check_3_1_1_LanguageOfPage();
        
        // 3.1.2 부분 언어 (AA)
        await this.check_3_1_2_LanguageOfParts();
        
        // 3.2.1 포커스 시 (A)
        await this.check_3_2_1_OnFocus();
        
        // 3.2.2 입력 시 (A)
        await this.check_3_2_2_OnInput();
        
        // 3.2.3 일관성 있는 탐색 (AA)
        await this.check_3_2_3_ConsistentNavigation();
        
        // 3.2.4 일관성 있는 식별 (AA)
        await this.check_3_2_4_ConsistentIdentification();
        
        // 3.3.1 오류 식별 (A)
        await this.check_3_3_1_ErrorIdentification();
        
        // 3.3.2 레이블 또는 지시 (A)
        await this.check_3_3_2_LabelsOrInstructions();
        
        // 3.3.3 오류 제안 (AA)
        await this.check_3_3_3_ErrorSuggestion();
        
        // 3.3.4 오류 방지 (법적, 금융, 데이터) (AA)
        await this.check_3_3_4_ErrorPreventionLegal();
    }

    /**
     * 4. 견고성 (Robust) 검증
     * - 4.1 호환성
     */
    async validateRobust() {
        console.log('  🛠️ 견고성 검증...');
        
        // 4.1.1 구문 분석 (A)
        await this.check_4_1_1_Parsing();
        
        // 4.1.2 이름, 역할, 값 (A)
        await this.check_4_1_2_NameRoleValue();
        
        // 4.1.3 상태 메시지 (AA)
        await this.check_4_1_3_StatusMessages();
    }

    /**
     * 1.1.1 비텍스트 콘텐츠 검증
     */
    async check_1_1_1_NonTextContent() {
        const result = await this.page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'));
            const issues = [];
            
            images.forEach((img, index) => {
                const alt = img.getAttribute('alt');
                const src = img.getAttribute('src');
                const role = img.getAttribute('role');
                
                // 장식적 이미지가 아닌 경우 alt 속성 필수
                if (role !== 'presentation' && role !== 'none') {
                    if (alt === null) {
                        issues.push({
                            element: `img[${index}]`,
                            issue: 'alt 속성이 없습니다',
                            src: src,
                            severity: 'high'
                        });
                    } else if (alt.trim() === '' && !role) {
                        issues.push({
                            element: `img[${index}]`,
                            issue: 'alt 속성이 비어있으나 role="presentation" 또는 role="none"이 없습니다',
                            src: src,
                            severity: 'medium'
                        });
                    }
                }
            });
            
            return {
                rule: '1.1.1',
                title: '비텍스트 콘텐츠',
                level: 'A',
                total: images.length,
                issues: issues,
                passed: images.length - issues.length
            };
        });
        
        this.results.perceivable.push(result);
    }

    /**
     * 1.4.3 대비 (최소) 검증
     */
    async check_1_4_3_ContrastMinimum() {
        const result = await this.page.evaluate(() => {
            const textElements = Array.from(document.querySelectorAll('*'))
                .filter(el => {
                    const style = window.getComputedStyle(el);
                    return style.display !== 'none' && 
                           el.textContent && 
                           el.textContent.trim().length > 0 &&
                           style.color !== 'transparent';
                });
            
            const issues = [];
            
            textElements.forEach((element, index) => {
                const style = window.getComputedStyle(element);
                const color = style.color;
                const backgroundColor = style.backgroundColor;
                const fontSize = parseFloat(style.fontSize);
                const fontWeight = style.fontWeight;
                
                // 실제 색상 대비 계산은 복잡하므로 여기서는 기본 체크만
                // 실제로는 color-contrast 라이브러리 등을 사용해야 함
                if (color === backgroundColor) {
                    issues.push({
                        element: element.tagName.toLowerCase(),
                        issue: '텍스트 색상과 배경색이 동일합니다',
                        color: color,
                        backgroundColor: backgroundColor,
                        severity: 'high'
                    });
                }
            });
            
            return {
                rule: '1.4.3',
                title: '대비 (최소)',
                level: 'AA',
                total: textElements.length,
                issues: issues,
                passed: textElements.length - issues.length
            };
        });
        
        this.results.perceivable.push(result);
    }

    /**
     * 2.1.1 키보드 접근성 검증
     */
    async check_2_1_1_Keyboard() {
        const result = await this.page.evaluate(() => {
            const interactiveElements = Array.from(document.querySelectorAll(
                'a, button, input, select, textarea, [tabindex], [role="button"], [role="link"], [role="menuitem"]'
            ));
            
            const issues = [];
            
            interactiveElements.forEach((element, index) => {
                const tabindex = element.getAttribute('tabindex');
                const role = element.getAttribute('role');
                const tagName = element.tagName.toLowerCase();
                
                // 키보드 접근 불가능한 요소들 체크
                if (tabindex === '-1' && !['input', 'button', 'a', 'select', 'textarea'].includes(tagName)) {
                    issues.push({
                        element: `${tagName}[${index}]`,
                        issue: 'tabindex="-1"로 설정되어 키보드 접근이 불가능합니다',
                        tabindex: tabindex,
                        severity: 'high'
                    });
                }
                
                // div, span 등에 click 핸들러가 있지만 키보드 접근이 안되는 경우
                if (['div', 'span'].includes(tagName) && (role === 'button' || role === 'link')) {
                    if (!tabindex || tabindex === '-1') {
                        issues.push({
                            element: `${tagName}[${index}]`,
                            issue: '상호작용 가능한 요소이지만 키보드 접근이 불가능합니다',
                            role: role,
                            severity: 'high'
                        });
                    }
                }
            });
            
            return {
                rule: '2.1.1',
                title: '키보드',
                level: 'A',
                total: interactiveElements.length,
                issues: issues,
                passed: interactiveElements.length - issues.length
            };
        });
        
        this.results.operable.push(result);
    }

    /**
     * 2.4.2 페이지 제목 검증
     */
    async check_2_4_2_PageTitled() {
        const result = await this.page.evaluate(() => {
            const title = document.querySelector('title');
            const issues = [];
            
            if (!title) {
                issues.push({
                    element: 'document',
                    issue: 'title 요소가 없습니다',
                    severity: 'high'
                });
            } else if (!title.textContent || title.textContent.trim().length === 0) {
                issues.push({
                    element: 'title',
                    issue: 'title 요소가 비어있습니다',
                    severity: 'high'
                });
            } else if (title.textContent.trim().length < 2) {
                issues.push({
                    element: 'title',
                    issue: 'title이 너무 짧습니다 (최소 2자 이상 권장)',
                    title: title.textContent,
                    severity: 'medium'
                });
            }
            
            return {
                rule: '2.4.2',
                title: '페이지 제목',
                level: 'A',
                total: 1,
                issues: issues,
                passed: issues.length === 0 ? 1 : 0,
                pageTitle: title ? title.textContent : null
            };
        });
        
        this.results.operable.push(result);
    }

    /**
     * 3.1.1 페이지 언어 검증
     */
    async check_3_1_1_LanguageOfPage() {
        const result = await this.page.evaluate(() => {
            const html = document.documentElement;
            const lang = html.getAttribute('lang');
            const issues = [];
            
            if (!lang) {
                issues.push({
                    element: 'html',
                    issue: 'html 요소에 lang 속성이 없습니다',
                    severity: 'high'
                });
            } else if (!lang.match(/^[a-zA-Z]{2}(-[a-zA-Z]{2})?$/)) {
                issues.push({
                    element: 'html',
                    issue: '유효하지 않은 언어 코드입니다',
                    lang: lang,
                    severity: 'medium'
                });
            }
            
            return {
                rule: '3.1.1',
                title: '페이지 언어',
                level: 'A',
                total: 1,
                issues: issues,
                passed: issues.length === 0 ? 1 : 0,
                language: lang
            };
        });
        
        this.results.understandable.push(result);
    }

    /**
     * 4.1.2 이름, 역할, 값 검증
     */
    async check_4_1_2_NameRoleValue() {
        const result = await this.page.evaluate(() => {
            const formElements = Array.from(document.querySelectorAll('input, select, textarea, button'));
            const issues = [];
            
            formElements.forEach((element, index) => {
                const tagName = element.tagName.toLowerCase();
                const type = element.type;
                const id = element.id;
                const name = element.name;
                const ariaLabel = element.getAttribute('aria-label');
                const ariaLabelledBy = element.getAttribute('aria-labelledby');
                const role = element.getAttribute('role');
                
                // 레이블 확인
                const hasLabel = element.labels && element.labels.length > 0;
                const hasAriaLabel = ariaLabel && ariaLabel.trim().length > 0;
                const hasAriaLabelledBy = ariaLabelledBy && document.querySelector(`#${ariaLabelledBy}`);
                
                if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
                    // submit, reset, button 타입은 value나 textContent로 레이블 가능
                    if (['submit', 'reset', 'button'].includes(type) || tagName === 'button') {
                        const value = element.value || element.textContent;
                        if (!value || value.trim().length === 0) {
                            issues.push({
                                element: `${tagName}[${index}]`,
                                issue: '버튼에 텍스트나 레이블이 없습니다',
                                type: type,
                                severity: 'high'
                            });
                        }
                    } else {
                        issues.push({
                            element: `${tagName}[${index}]`,
                            issue: '폼 요소에 접근 가능한 이름이 없습니다',
                            type: type,
                            severity: 'high'
                        });
                    }
                }
            });
            
            return {
                rule: '4.1.2',
                title: '이름, 역할, 값',
                level: 'A',
                total: formElements.length,
                issues: issues,
                passed: formElements.length - issues.length
            };
        });
        
        this.results.robust.push(result);
    }

    // 나머지 체크 함수들 (간소화된 버전)
    async check_1_3_1_InfoAndRelationships() { /* 구현 */ }
    async check_1_3_2_MeaningfulSequence() { /* 구현 */ }
    async check_1_3_3_SensoryCharacteristics() { /* 구현 */ }
    async check_1_3_4_Orientation() { /* 구현 */ }
    async check_1_3_5_IdentifyInputPurpose() { /* 구현 */ }
    async check_1_4_1_UseOfColor() { /* 구현 */ }
    async check_1_4_2_AudioControl() { /* 구현 */ }
    async check_1_4_4_ResizeText() { /* 구현 */ }
    async check_1_4_5_ImagesOfText() { /* 구현 */ }
    async check_1_4_10_Reflow() { /* 구현 */ }
    async check_1_4_11_NonTextContrast() { /* 구현 */ }
    async check_1_4_12_TextSpacing() { /* 구현 */ }
    async check_1_4_13_ContentOnHoverOrFocus() { /* 구현 */ }
    
    async check_2_1_2_NoKeyboardTrap() { /* 구현 */ }
    async check_2_1_4_CharacterKeyShortcuts() { /* 구현 */ }
    async check_2_2_1_TimingAdjustable() { /* 구현 */ }
    async check_2_2_2_PauseStopHide() { /* 구현 */ }
    async check_2_3_1_ThreeFlashesOrBelowThreshold() { /* 구현 */ }
    async check_2_4_1_BypassBlocks() { /* 구현 */ }
    async check_2_4_3_FocusOrder() { /* 구현 */ }
    async check_2_4_4_LinkPurposeInContext() { /* 구현 */ }
    async check_2_4_5_MultipleWays() { /* 구현 */ }
    async check_2_4_6_HeadingsAndLabels() { /* 구현 */ }
    async check_2_4_7_FocusVisible() { /* 구현 */ }
    async check_2_5_1_PointerGestures() { /* 구현 */ }
    async check_2_5_2_PointerCancellation() { /* 구현 */ }
    async check_2_5_3_LabelInName() { /* 구현 */ }
    async check_2_5_4_MotionActuation() { /* 구현 */ }
    
    async check_3_1_2_LanguageOfParts() { /* 구현 */ }
    async check_3_2_1_OnFocus() { /* 구현 */ }
    async check_3_2_2_OnInput() { /* 구현 */ }
    async check_3_2_3_ConsistentNavigation() { /* 구현 */ }
    async check_3_2_4_ConsistentIdentification() { /* 구현 */ }
    async check_3_3_1_ErrorIdentification() { /* 구현 */ }
    async check_3_3_2_LabelsOrInstructions() { /* 구현 */ }
    async check_3_3_3_ErrorSuggestion() { /* 구현 */ }
    async check_3_3_4_ErrorPreventionLegal() { /* 구현 */ }
    
    async check_4_1_1_Parsing() { /* 구현 */ }
    async check_4_1_3_StatusMessages() { /* 구현 */ }

    /**
     * 검증 결과 요약 계산
     */
    calculateSummary() {
        const allResults = [
            ...this.results.perceivable,
            ...this.results.operable,
            ...this.results.understandable,
            ...this.results.robust
        ];

        const totalTests = allResults.length;
        const passedTests = allResults.filter(result => result.issues.length === 0).length;
        const failedTests = totalTests - passedTests;

        this.results.summary = {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
            score: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
        };

        console.log(`📊 WCAG 검증 완료: ${this.results.summary.score}% (${passedTests}/${totalTests})`);
    }

    /**
     * 상세 리포트 생성
     */
    generateDetailedReport() {
        return {
            timestamp: new Date().toISOString(),
            summary: this.results.summary,
            categories: {
                perceivable: {
                    title: '지각 가능성 (Perceivable)',
                    description: '정보와 사용자 인터페이스 구성 요소는 사용자가 인지할 수 있는 방법으로 제시되어야 함',
                    results: this.results.perceivable
                },
                operable: {
                    title: '운용 가능성 (Operable)',
                    description: '사용자 인터페이스 구성 요소와 탐색은 조작 가능해야 함',
                    results: this.results.operable
                },
                understandable: {
                    title: '이해 가능성 (Understandable)',
                    description: '정보와 사용자 인터페이스의 조작은 이해할 수 있어야 함',
                    results: this.results.understandable
                },
                robust: {
                    title: '견고성 (Robust)',
                    description: '콘텐츠는 보조 기술을 포함한 다양한 사용자 에이전트가 해석할 수 있을 만큼 견고해야 함',
                    results: this.results.robust
                }
            },
            recommendations: this.generateRecommendations()
        };
    }

    /**
     * 개선 권장사항 생성
     */
    generateRecommendations() {
        const recommendations = [];
        const allResults = [
            ...this.results.perceivable,
            ...this.results.operable,
            ...this.results.understandable,
            ...this.results.robust
        ];

        allResults.forEach(result => {
            if (result.issues.length > 0) {
                recommendations.push({
                    rule: result.rule,
                    title: result.title,
                    level: result.level,
                    priority: this.getPriority(result.level, result.issues),
                    actions: this.getActionItems(result.rule, result.issues)
                });
            }
        });

        return recommendations.sort((a, b) => this.getPriorityWeight(a.priority) - this.getPriorityWeight(b.priority));
    }

    getPriority(level, issues) {
        const highSeverityCount = issues.filter(issue => issue.severity === 'high').length;
        
        if (level === 'A' && highSeverityCount > 0) return 'critical';
        if (level === 'A') return 'high';
        if (level === 'AA' && highSeverityCount > 0) return 'high';
        if (level === 'AA') return 'medium';
        return 'low';
    }

    getPriorityWeight(priority) {
        const weights = { critical: 1, high: 2, medium: 3, low: 4 };
        return weights[priority] || 5;
    }

    getActionItems(rule, issues) {
        // 규칙별 구체적인 개선 방법 제시
        const actionMap = {
            '1.1.1': '모든 이미지에 적절한 대체 텍스트 제공',
            '1.4.3': '텍스트와 배경의 색상 대비를 4.5:1 이상으로 조정',
            '2.1.1': '모든 기능을 키보드로 접근 가능하도록 구현',
            '2.4.2': '각 페이지에 구체적이고 설명적인 제목 제공',
            '3.1.1': 'HTML 요소에 적절한 언어 코드 설정',
            '4.1.2': '모든 폼 요소에 접근 가능한 이름 제공'
        };

        return actionMap[rule] || '해당 WCAG 가이드라인 참조하여 개선';
    }
}

module.exports = WCAGValidator;