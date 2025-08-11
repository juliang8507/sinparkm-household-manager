/**
 * 🛠️ axe-core 설정 - 감자토끼 가계부 한국어 컨텐츠 특화
 * 
 * 한국어 애플리케이션의 접근성 검증을 위한 맞춤형 axe-core 규칙 설정
 * - 한국어 텍스트 처리
 * - CJK(한중일) 글꼴 고려사항
 * - 한국어 스크린 리더 호환성
 * - 문화적 접근성 고려사항
 */

class AxeConfig {
    /**
     * 기본 axe-core 설정
     */
    static getConfig() {
        return {
            // 한국어 로케일 설정
            locale: 'ko',
            
            // 테스트할 규칙 세트
            tags: [
                'wcag2a',      // WCAG 2.0 Level A
                'wcag2aa',     // WCAG 2.0 Level AA
                'wcag21a',     // WCAG 2.1 Level A
                'wcag21aa',    // WCAG 2.1 Level AA
                'best-practice' // 모범 사례
            ],
            
            // 커스텀 규칙 설정
            rules: {
                // 색상 대비 규칙 - 한국어 텍스트 고려
                'color-contrast': {
                    enabled: true,
                    options: {
                        // CJK 글꼴은 일반적으로 더 굵어 보이므로 대비 기준을 조금 완화
                        noScroll: false,
                        pseudoSizeRatio: 0.8, // 한국어 글꼴 특성 고려
                        shadowOutlineEmMax: 0.1,
                        largeTextPt: 18, // 한국어는 18pt부터 large text로 간주
                        normalTextPt: 14  // 한국어 기본 텍스트 크기
                    }
                },
                
                // 언어 속성 검증
                'html-has-lang': {
                    enabled: true,
                    options: {
                        // 한국어 언어 코드 허용
                        values: ['ko', 'ko-KR', 'ko-kr']
                    }
                },
                
                // 유효한 언어 코드 검증
                'valid-lang': {
                    enabled: true,
                    options: {
                        // 한국어 관련 언어 코드들
                        values: [
                            'ko',    // 한국어
                            'ko-KR', // 한국어(대한민국)
                            'ko-kr', // 소문자 버전
                            'en',    // 영어 (혼용 가능)
                            'en-US'  // 영어(미국)
                        ]
                    }
                },
                
                // 페이지 제목 검증 - 한국어 특성 고려
                'document-title': {
                    enabled: true,
                    options: {
                        // 한국어 제목에서 일반적인 패턴 허용
                        // 예: "홈 - 감자토끼 가계부"
                        minLength: 2, // 한국어는 짧은 제목도 의미있을 수 있음
                        maxLength: 100
                    }
                },
                
                // 랜드마크 규칙
                'landmark-one-main': { enabled: true },
                'landmark-complementary-is-top-level': { enabled: true },
                'landmark-no-duplicate-banner': { enabled: true },
                'landmark-no-duplicate-contentinfo': { enabled: true },
                
                // 제목 구조 검증 - 한국어 컨텐츠 특성
                'heading-order': {
                    enabled: true,
                    options: {
                        // 한국어에서는 제목 구조가 영어와 다를 수 있음
                        allowSkippedLevels: false
                    }
                },
                
                // 링크 텍스트 검증 - 한국어
                'link-name': {
                    enabled: true,
                    options: {
                        // 한국어 링크에서 흔한 패턴들
                        minLength: 1,
                        // "더보기", "자세히", "이동" 등도 유의미한 링크 텍스트로 인정
                        allowGeneric: false
                    }
                },
                
                // 버튼 이름 검증
                'button-name': {
                    enabled: true,
                    options: {
                        // 한국어 버튼 텍스트 최소 길이
                        minLength: 1
                    }
                },
                
                // 입력 필드 레이블 검증
                'label': {
                    enabled: true,
                    options: {
                        // 한국어에서 placeholder와 label의 관계
                        requiredParent: false,
                        allowTitle: true, // title 속성도 레이블로 인정 (한국어 툴팁 고려)
                        allowPlaceholder: false // placeholder는 레이블 대체 불가
                    }
                },
                
                // 이미지 대체 텍스트 - 한국어
                'image-alt': {
                    enabled: true,
                    options: {
                        // 한국어 alt 텍스트 최소 요구사항
                        minLength: 1,
                        maxLength: 150, // 한국어는 정보 밀도가 높아서 길 수 있음
                        allowEmpty: false
                    }
                },
                
                // 키보드 접근성
                'keyboard': { enabled: true },
                'focus-order-semantics': { enabled: true },
                'tabindex': { enabled: true },
                
                // 터치 대상 크기 (모바일 접근성)
                'target-size': {
                    enabled: true,
                    options: {
                        // 한국어 텍스트를 고려한 최소 터치 대상 크기
                        minSize: 44, // 44px x 44px
                        allowOverlap: false
                    }
                },
                
                // 읽기 순서
                'reading-order': { enabled: true },
                
                // 줌 및 크기 조정
                'meta-viewport': {
                    enabled: true,
                    options: {
                        // 한국어 텍스트 확대 허용
                        scaleMaximum: 5.0,
                        scaleMinimum: 1.0,
                        allowZoom: true,
                        allowUserZoom: true
                    }
                }
            },
            
            // 특정 요소 제외 설정
            exclude: [
                // 서드파티 위젯이나 임베드 제외
                ['iframe[src*="google"]'],
                ['iframe[src*="youtube"]'],
                ['iframe[src*="kakao"]'],
                ['iframe[src*="naver"]'],
                
                // 개발 도구 제외
                ['#axe-core-debug'],
                ['.development-only'],
                
                // 숨겨진 요소 (한국어 툴팁 등 고려)
                ['[style*="display: none"]'],
                ['[hidden]']
            ],
            
            // 포함할 특정 컨텍스트
            include: [
                // 주요 컨텐츠 영역
                ['main'],
                ['[role="main"]'],
                ['#main-content'],
                
                // 네비게이션
                ['nav'],
                ['[role="navigation"]'],
                
                // 한국어 특화 영역
                ['.korean-content'],
                ['.locale-ko']
            ]
        };
    }
    
    /**
     * 테마별 특화 설정
     */
    static getThemeSpecificConfig(theme) {
        const baseConfig = this.getConfig();
        
        switch (theme) {
            case 'dark':
                return {
                    ...baseConfig,
                    rules: {
                        ...baseConfig.rules,
                        'color-contrast': {
                            ...baseConfig.rules['color-contrast'],
                            options: {
                                ...baseConfig.rules['color-contrast'].options,
                                // 다크테마에서 한국어 텍스트 가독성 고려
                                contrastRatio: {
                                    normal: 4.5,
                                    large: 3.0,
                                    // 한국어는 복잡한 글꼴이므로 약간 높은 대비 요구
                                    korean: 5.0
                                }
                            }
                        }
                    }
                };
                
            case 'hc': // 고대비 테마
                return {
                    ...baseConfig,
                    rules: {
                        ...baseConfig.rules,
                        'color-contrast': {
                            ...baseConfig.rules['color-contrast'],
                            options: {
                                ...baseConfig.rules['color-contrast'].options,
                                // 고대비 테마의 WCAG AAA 기준
                                contrastRatio: {
                                    normal: 7.0,  // AAA 기준
                                    large: 4.5,   // AAA 기준
                                    korean: 7.5   // 한국어는 더 높은 대비
                                }
                            }
                        }
                    }
                };
                
            default: // light 테마
                return baseConfig;
        }
    }
    
    /**
     * 모바일 전용 설정
     */
    static getMobileConfig() {
        const baseConfig = this.getConfig();
        
        return {
            ...baseConfig,
            rules: {
                ...baseConfig.rules,
                
                // 모바일 터치 대상 크기 강화
                'target-size': {
                    enabled: true,
                    options: {
                        minSize: 44, // 44dp 최소 크기
                        allowOverlap: false,
                        // 한국어 텍스트 버튼 고려
                        minTextSize: 16 // 16px 최소 텍스트 크기
                    }
                },
                
                // 모바일 뷰포트 설정
                'meta-viewport': {
                    enabled: true,
                    options: {
                        scaleMaximum: 10.0, // 모바일에서 더 큰 확대 허용
                        scaleMinimum: 1.0,
                        allowZoom: true,
                        allowUserZoom: true,
                        // 한국어 입력 시 자동 줌 비활성화 방지
                        preventAutoZoom: false
                    }
                },
                
                // 모바일 방향 전환
                'css-orientation-lock': {
                    enabled: true,
                    options: {
                        // 한국어 입력 시 가로/세로 모두 지원
                        allowOrientationLock: false
                    }
                },
                
                // 스크롤 가능한 영역
                'scrollable-region-focusable': {
                    enabled: true,
                    options: {
                        // 모바일에서 스크롤 영역 키보드 접근성
                        requireFocus: true
                    }
                }
            }
        };
    }
    
    /**
     * 성능 최적화된 설정 (빠른 테스트용)
     */
    static getFastConfig() {
        return {
            locale: 'ko',
            tags: ['wcag2aa'], // 필수 규칙만
            rules: {
                'color-contrast': { enabled: true },
                'keyboard': { enabled: true },
                'label': { enabled: true },
                'image-alt': { enabled: true },
                'landmark-one-main': { enabled: true }
            },
            exclude: [
                ['iframe'],
                ['[style*="display: none"]'],
                ['[hidden]']
            ]
        };
    }
    
    /**
     * 개발 환경용 설정 (상세한 디버깅)
     */
    static getDebugConfig() {
        const baseConfig = this.getConfig();
        
        return {
            ...baseConfig,
            
            // 개발 중 유용한 추가 규칙들
            rules: {
                ...baseConfig.rules,
                
                // 개발자 도구 친화적 규칙들
                'duplicate-id': { enabled: true },
                'duplicate-id-aria': { enabled: true },
                'duplicate-id-active': { enabled: true },
                
                // HTML 유효성 검사
                'valid-lang': { enabled: true },
                'html-has-lang': { enabled: true },
                'html-lang-valid': { enabled: true },
                
                // ARIA 사용법 검증
                'aria-valid-attr': { enabled: true },
                'aria-valid-attr-value': { enabled: true },
                'aria-allowed-attr': { enabled: true },
                'aria-required-attr': { enabled: true },
                'aria-required-children': { enabled: true },
                'aria-required-parent': { enabled: true },
                
                // 한국어 개발에서 자주 놓치는 부분들
                'page-has-heading-one': { enabled: true },
                'bypass': { enabled: true },
                'skip-link': { enabled: true }
            },
            
            // 개발 시에는 제외 항목 최소화
            exclude: [
                ['#development-tools'],
                ['#debug-panel']
            ]
        };
    }
    
    /**
     * 커스텀 규칙: 한국어 컨텐츠 검증
     */
    static getKoreanContentRules() {
        return {
            'korean-text-spacing': {
                enabled: true,
                options: {
                    // 한국어와 영어/숫자 사이 간격 검증
                    checkSpacing: true,
                    allowMixedContent: true
                }
            },
            
            'korean-font-size': {
                enabled: true,
                options: {
                    // 한국어 최소 글꼴 크기
                    minSize: 14, // 14px 이상
                    recommendedSize: 16, // 권장 크기
                    mobileMinSize: 16 // 모바일 최소 크기
                }
            },
            
            'korean-line-height': {
                enabled: true,
                options: {
                    // 한국어 텍스트 줄간격
                    minLineHeight: 1.4, // 최소 1.4
                    recommendedLineHeight: 1.6 // 권장 1.6
                }
            }
        };
    }
}

module.exports = AxeConfig;