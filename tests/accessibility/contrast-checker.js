/**
 * 🎨 색상 대비 검증기
 * 
 * WCAG 2.1 AA/AAA 기준 색상 대비 검증
 * - 3개 테마 (light, dark, hc) 지원
 * - 한국어 텍스트 특성 고려
 * - 실제 계산된 대비율 제공
 */

class ContrastChecker {
    constructor() {
        this.contrastResults = {
            violations: [],
            warnings: [],
            passes: [],
            summary: {
                total: 0,
                failed: 0,
                warning: 0,
                passed: 0,
                averageRatio: 0
            }
        };
    }

    /**
     * 특정 테마의 색상 대비 검사
     */
    static async checkTheme(page, theme) {
        const checker = new ContrastChecker();
        return await checker.checkAllElements(page, theme);
    }

    /**
     * 페이지의 모든 텍스트 요소 대비 검사
     */
    async checkAllElements(page, theme = 'light') {
        console.log(`🎨 ${theme} 테마 색상 대비 검증 중...`);

        const results = await page.evaluate((currentTheme) => {
            // RGB 값을 상대 휘도로 변환
            function getLuminance(r, g, b) {
                const [rs, gs, bs] = [r, g, b].map(c => {
                    c = c / 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
            }

            // 대비율 계산
            function getContrastRatio(color1, color2) {
                const lum1 = getLuminance(...color1);
                const lum2 = getLuminance(...color2);
                const lightest = Math.max(lum1, lum2);
                const darkest = Math.min(lum1, lum2);
                return (lightest + 0.05) / (darkest + 0.05);
            }

            // CSS 색상을 RGB로 변환
            function parseColor(colorStr) {
                const div = document.createElement('div');
                div.style.color = colorStr;
                document.body.appendChild(div);
                const color = getComputedStyle(div).color;
                document.body.removeChild(div);
                
                const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (match) {
                    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
                }
                return [0, 0, 0]; // 기본값
            }

            // 백그라운드 색상 추출 (상속 고려)
            function getBackgroundColor(element) {
                let bgColor = 'rgba(0, 0, 0, 0)';
                let currentElement = element;
                
                while (currentElement && currentElement !== document.body) {
                    const computedBg = getComputedStyle(currentElement).backgroundColor;
                    if (computedBg && computedBg !== 'rgba(0, 0, 0, 0)' && computedBg !== 'transparent') {
                        bgColor = computedBg;
                        break;
                    }
                    currentElement = currentElement.parentElement;
                }
                
                // 기본 배경색 (테마별)
                if (bgColor === 'rgba(0, 0, 0, 0)') {
                    switch(currentTheme) {
                        case 'dark':
                            bgColor = '#0E0E0E'; // 다크 테마 기본 배경
                            break;
                        case 'hc':
                            bgColor = '#FFFFFF'; // 고대비 테마 기본 배경
                            break;
                        default:
                            bgColor = '#FAF9FA'; // 라이트 테마 기본 배경
                    }
                }
                
                return bgColor;
            }

            // 텍스트 크기 분류 (WCAG 기준)
            function getTextSize(fontSize, fontWeight) {
                const size = parseFloat(fontSize);
                const weight = parseInt(fontWeight) || 400;
                
                // Large text: 18pt+ (24px+) 또는 14pt+ (18.7px+) bold
                if (size >= 24 || (size >= 18.7 && weight >= 700)) {
                    return 'large';
                }
                return 'normal';
            }

            // 한국어 텍스트 감지
            function isKoreanText(text) {
                const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
                return koreanRegex.test(text);
            }

            const textElements = Array.from(document.querySelectorAll('*'))
                .filter(el => {
                    const style = getComputedStyle(el);
                    const text = el.textContent?.trim();
                    
                    return text && 
                           text.length > 0 &&
                           style.display !== 'none' &&
                           style.visibility !== 'hidden' &&
                           style.opacity !== '0' &&
                           el.offsetWidth > 0 &&
                           el.offsetHeight > 0;
                });

            const results = {
                violations: [],
                warnings: [],
                passes: [],
                summary: { total: 0, failed: 0, warning: 0, passed: 0 }
            };

            textElements.forEach((element, index) => {
                try {
                    const style = getComputedStyle(element);
                    const text = element.textContent?.trim();
                    
                    if (!text || text.length === 0) return;

                    const textColor = style.color;
                    const backgroundColor = getBackgroundColor(element);
                    const fontSize = style.fontSize;
                    const fontWeight = style.fontWeight;
                    const textSize = getTextSize(fontSize, fontWeight);
                    const isKorean = isKoreanText(text);

                    // 색상을 RGB로 변환
                    const textRgb = parseColor(textColor);
                    const bgRgb = parseColor(backgroundColor);
                    
                    // 대비율 계산
                    const contrastRatio = getContrastRatio(textRgb, bgRgb);
                    
                    // WCAG 기준 (한국어 텍스트는 조금 더 엄격한 기준 적용)
                    const normalMinRatio = isKorean ? 4.8 : 4.5; // AA 기준
                    const largeMinRatio = isKorean ? 3.2 : 3.0;  // AA 기준
                    const normalAAARatio = isKorean ? 7.2 : 7.0; // AAA 기준
                    const largeAAARatio = isKorean ? 4.8 : 4.5;  // AAA 기준
                    
                    const requiredRatio = textSize === 'large' ? largeMinRatio : normalMinRatio;
                    const aaaRatio = textSize === 'large' ? largeAAARatio : normalAAARatio;

                    const testResult = {
                        element: {
                            tagName: element.tagName.toLowerCase(),
                            index: index,
                            text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
                            selector: this.generateSelector(element)
                        },
                        colors: {
                            textColor: textColor,
                            backgroundColor: backgroundColor,
                            textRgb: textRgb,
                            backgroundRgb: bgRgb
                        },
                        typography: {
                            fontSize: fontSize,
                            fontWeight: fontWeight,
                            textSize: textSize,
                            isKorean: isKorean
                        },
                        contrast: {
                            ratio: Math.round(contrastRatio * 100) / 100,
                            required: requiredRatio,
                            aaaRequired: aaaRatio
                        },
                        wcag: {
                            aa: contrastRatio >= requiredRatio,
                            aaa: contrastRatio >= aaaRatio
                        }
                    };

                    results.summary.total++;

                    if (contrastRatio < requiredRatio) {
                        testResult.severity = 'high';
                        testResult.issue = `대비율 부족: ${testResult.contrast.ratio}:1 (최소 ${requiredRatio}:1 필요)`;
                        results.violations.push(testResult);
                        results.summary.failed++;
                    } else if (contrastRatio < aaaRatio) {
                        testResult.severity = 'medium';
                        testResult.issue = `AA 기준은 만족하지만 AAA 기준 미달: ${testResult.contrast.ratio}:1`;
                        results.warnings.push(testResult);
                        results.summary.warning++;
                    } else {
                        testResult.severity = 'none';
                        testResult.issue = null;
                        results.passes.push(testResult);
                        results.summary.passed++;
                    }

                } catch (error) {
                    console.warn(`요소 ${index} 대비 검사 중 오류:`, error);
                }
            });

            // 평균 대비율 계산
            const allRatios = [...results.violations, ...results.warnings, ...results.passes]
                .map(result => result.contrast.ratio);
            results.summary.averageRatio = allRatios.length > 0 ? 
                Math.round((allRatios.reduce((sum, ratio) => sum + ratio, 0) / allRatios.length) * 100) / 100 : 0;

            return results;

        }, theme);

        this.contrastResults = results;
        
        console.log(`  📊 대비 검증 결과: ${results.violations.length}개 위반, ${results.warnings.length}개 경고`);
        console.log(`  📈 평균 대비율: ${results.summary.averageRatio}:1`);
        
        return results;
    }

    /**
     * CSS 셀렉터 생성
     */
    static generateSelector(element) {
        if (element.id) return `#${element.id}`;
        
        let path = [];
        let current = element;
        
        while (current && current.nodeType === Node.ELEMENT_NODE) {
            let selector = current.nodeName.toLowerCase();
            
            if (current.className) {
                selector += '.' + Array.from(current.classList).join('.');
            }
            
            // 형제 요소 중 몇 번째인지 확인
            let sibling = current;
            let nth = 1;
            while (sibling.previousElementSibling) {
                sibling = sibling.previousElementSibling;
                if (sibling.nodeName === current.nodeName) nth++;
            }
            
            if (nth > 1 || current.nextElementSibling) {
                selector += `:nth-of-type(${nth})`;
            }
            
            path.unshift(selector);
            current = current.parentNode;
            
            if (path.length > 3) break; // 너무 긴 경로 방지
        }
        
        return path.join(' > ');
    }

    /**
     * 색상 대비 개선 제안
     */
    generateImprovementSuggestions() {
        const suggestions = [];
        
        this.contrastResults.violations.forEach(violation => {
            const { colors, contrast, typography } = violation;
            
            // 현재 색상을 기반으로 개선된 색상 제안
            const improvedColors = this.suggestImprovedColors(
                colors.textRgb, 
                colors.backgroundRgb, 
                contrast.required
            );
            
            suggestions.push({
                selector: violation.element.selector,
                current: {
                    textColor: colors.textColor,
                    backgroundColor: colors.backgroundColor,
                    ratio: contrast.ratio
                },
                suggested: {
                    textColor: improvedColors.textColor,
                    backgroundColor: improvedColors.backgroundColor,
                    expectedRatio: improvedColors.ratio
                },
                cssChanges: {
                    color: improvedColors.textColor,
                    backgroundColor: improvedColors.backgroundColor
                },
                priority: this.getPriority(violation.severity, contrast.ratio),
                isKorean: typography.isKorean
            });
        });
        
        return suggestions;
    }

    /**
     * 개선된 색상 제안
     */
    suggestImprovedColors(textRgb, bgRgb, requiredRatio) {
        // 텍스트 색상을 더 어둡게/밝게 조정하여 대비 개선
        const textLum = this.getLuminance(...textRgb);
        const bgLum = this.getLuminance(...bgRgb);
        
        let newTextRgb;
        if (textLum > bgLum) {
            // 텍스트가 더 밝으면 더 밝게
            newTextRgb = this.adjustBrightness(textRgb, 1.2);
        } else {
            // 텍스트가 더 어두우면 더 어둡게
            newTextRgb = this.adjustBrightness(textRgb, 0.8);
        }
        
        const newRatio = this.getContrastRatio(newTextRgb, bgRgb);
        
        return {
            textColor: `rgb(${newTextRgb.join(', ')})`,
            backgroundColor: `rgb(${bgRgb.join(', ')})`,
            ratio: Math.round(newRatio * 100) / 100
        };
    }

    /**
     * 밝기 조정
     */
    adjustBrightness(rgb, factor) {
        return rgb.map(channel => {
            const adjusted = Math.round(channel * factor);
            return Math.min(255, Math.max(0, adjusted));
        });
    }

    /**
     * 휘도 계산
     */
    getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    /**
     * 대비율 계산
     */
    getContrastRatio(color1, color2) {
        const lum1 = this.getLuminance(...color1);
        const lum2 = this.getLuminance(...color2);
        const lightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (lightest + 0.05) / (darkest + 0.05);
    }

    /**
     * 우선순위 결정
     */
    getPriority(severity, ratio) {
        if (severity === 'high' && ratio < 2.0) return 'critical';
        if (severity === 'high') return 'high';
        if (severity === 'medium') return 'medium';
        return 'low';
    }

    /**
     * 테마별 대비 리포트 생성
     */
    generateThemeReport(theme) {
        const improvements = this.generateImprovementSuggestions();
        
        return {
            theme: theme,
            timestamp: new Date().toISOString(),
            summary: this.contrastResults.summary,
            violations: this.contrastResults.violations,
            warnings: this.contrastResults.warnings,
            passes: this.contrastResults.passes.length,
            improvements: improvements,
            statistics: {
                totalElements: this.contrastResults.summary.total,
                passRate: this.contrastResults.summary.total > 0 ? 
                    Math.round((this.contrastResults.summary.passed / this.contrastResults.summary.total) * 100) : 0,
                averageRatio: this.contrastResults.summary.averageRatio,
                koreanElements: this.contrastResults.violations.filter(v => v.typography.isKorean).length +
                               this.contrastResults.warnings.filter(w => w.typography.isKorean).length +
                               this.contrastResults.passes.filter(p => p.typography.isKorean).length
            },
            recommendations: this.generateRecommendations(theme)
        };
    }

    /**
     * 테마별 권장사항 생성
     */
    generateRecommendations(theme) {
        const recommendations = [];
        
        if (this.contrastResults.violations.length > 0) {
            recommendations.push({
                type: 'critical',
                title: '색상 대비 기준 미달 해결',
                description: `${this.contrastResults.violations.length}개 요소가 WCAG AA 기준을 충족하지 않습니다.`,
                actions: [
                    '텍스트 색상을 더 진하게 조정',
                    '배경색을 더 밝게/어둡게 조정',
                    '폰트 굵기를 bold로 변경하여 가독성 개선'
                ]
            });
        }
        
        if (theme === 'dark' && this.contrastResults.violations.length > 0) {
            recommendations.push({
                type: 'theme-specific',
                title: '다크 테마 색상 최적화',
                description: '다크 테마에서 한국어 텍스트의 가독성을 위해 더 높은 대비가 필요합니다.',
                actions: [
                    '텍스트 색상을 더 밝은 색상으로 조정',
                    '중요한 텍스트는 흰색(#FFFFFF) 사용 고려',
                    '한국어 폰트 특성을 고려한 대비 조정'
                ]
            });
        }
        
        if (theme === 'hc') {
            recommendations.push({
                type: 'accessibility',
                title: '고대비 테마 최적화',
                description: '시각 장애인을 위한 최대 대비를 제공해야 합니다.',
                actions: [
                    'WCAG AAA 기준 (7:1) 만족하도록 조정',
                    '순수 검정/흰색 조합 사용',
                    '색상이 아닌 패턴이나 텍스처로 정보 전달'
                ]
            });
        }
        
        if (this.contrastResults.summary.total > 0) {
            const koreanRatio = (this.contrastResults.violations.filter(v => v.typography.isKorean).length + 
                               this.contrastResults.warnings.filter(w => w.typography.isKorean).length) / 
                               this.contrastResults.summary.total;
            
            if (koreanRatio > 0.3) {
                recommendations.push({
                    type: 'korean-specific',
                    title: '한국어 텍스트 최적화',
                    description: '한국어 텍스트는 복잡한 글꼴 구조로 인해 더 높은 대비가 필요합니다.',
                    actions: [
                        '한국어 텍스트는 4.8:1 이상 대비 유지',
                        '명조체보다 고딕체 폰트 사용',
                        '텍스트 크기를 16px 이상으로 설정'
                    ]
                });
            }
        }
        
        return recommendations;
    }

    /**
     * CSS 수정사항 생성
     */
    generateCSS(improvements) {
        let css = `/* 색상 대비 개선 CSS - ${new Date().toISOString()} */\n\n`;
        
        improvements.forEach(improvement => {
            css += `/* ${improvement.priority} 우선순위 - 현재 대비: ${improvement.current.ratio}:1 */\n`;
            css += `${improvement.selector} {\n`;
            css += `    color: ${improvement.cssChanges.color};\n`;
            
            if (improvement.cssChanges.backgroundColor !== improvement.current.backgroundColor) {
                css += `    background-color: ${improvement.cssChanges.backgroundColor};\n`;
            }
            
            css += `}\n\n`;
        });
        
        return css;
    }
}

module.exports = ContrastChecker;