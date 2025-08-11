/**
 * 감자토끼 가계부 - SVG Optimizer
 * SVG 스프라이트 최적화 및 압축
 */

const fs = require('fs');
const path = require('path');

class SVGOptimizer {
    constructor() {
        this.optimizationOptions = {
            removeComments: true,
            removeMetadata: true,
            removeUnusedNS: true,
            removeEmptyAttrs: true,
            removeEmptyText: true,
            removeEmptyContainers: true,
            cleanupNumericValues: {
                floatPrecision: 2
            },
            convertColors: true,
            minifyPathData: true,
            mergePaths: true
        };
    }

    /**
     * SVG 파일 최적화
     */
    async optimizeSVG(svgContent) {
        let optimized = svgContent;

        // 1. 주석 제거
        optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');

        // 2. 불필요한 메타데이터 제거
        optimized = optimized.replace(/\s*id="[^"]*"/g, (match) => {
            // 중요한 ID만 유지 (potato-, rabbit- 시작)
            if (match.includes('potato-') || match.includes('rabbit-')) {
                return match;
            }
            return '';
        });

        // 3. 빈 속성 제거
        optimized = optimized.replace(/\s*[a-zA-Z-]+=""\s*/g, ' ');

        // 4. 불필요한 네임스페이스 제거
        optimized = optimized.replace(/\s*xmlns:[a-zA-Z]*="[^"]*"/g, '');

        // 5. 숫자 정밀도 최적화
        optimized = optimized.replace(/(\d+\.\d{3,})/g, (match) => {
            return parseFloat(match).toFixed(2);
        });

        // 6. 경로 데이터 최적화
        optimized = this.optimizePathData(optimized);

        // 7. 공백 정규화
        optimized = optimized
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .trim();

        return optimized;
    }

    /**
     * SVG 경로 데이터 최적화
     */
    optimizePathData(svgContent) {
        return svgContent.replace(/d="([^"]+)"/g, (match, pathData) => {
            // 경로 명령어 간 불필요한 공백 제거
            let optimized = pathData
                .replace(/\s*,\s*/g, ',')
                .replace(/\s+/g, ' ')
                .replace(/([MLHVCSQTAZ])\s*/gi, '$1')
                .trim();

            return `d="${optimized}"`;
        });
    }

    /**
     * 중요한 캐릭터 아이콘만 추출 (Above-the-fold용)
     */
    extractCriticalIcons(svgContent) {
        const criticalIcons = [
            'potato-neutral',
            'rabbit-neutral', 
            'potato-success',
            'rabbit-success'
        ];

        let criticalSVG = '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"><defs>';

        // 정규식을 사용하여 심볼 추출 (Node.js 호환)
        const symbolRegex = /<symbol[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/symbol>/g;
        let match;

        while ((match = symbolRegex.exec(svgContent)) !== null) {
            const [fullMatch, id, content] = match;
            if (criticalIcons.includes(id)) {
                criticalSVG += fullMatch;
            }
        }

        criticalSVG += '</defs></svg>';
        return criticalSVG;
    }

    /**
     * 지연 로딩용 SVG 생성
     */
    createDeferredSVG(svgContent) {
        const criticalIcons = ['potato-neutral', 'rabbit-neutral', 'potato-success', 'rabbit-success'];
        let deferredSVG = '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"><defs>';

        // 정규식을 사용하여 심볼 추출 (Node.js 호환)
        const symbolRegex = /<symbol[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/symbol>/g;
        let match;

        while ((match = symbolRegex.exec(svgContent)) !== null) {
            const [fullMatch, id, content] = match;
            if (!criticalIcons.includes(id)) {
                deferredSVG += fullMatch;
            }
        }

        deferredSVG += '</defs></svg>';
        return deferredSVG;
    }

    /**
     * SVG 지연 로딩 스크립트 생성
     */
    generateSVGLazyLoadScript() {
        return `
    <script>
    // 🎨 SVG 스프라이트 지연 로딩
    (function() {
        function loadDeferredSVG() {
            if (document.querySelector('#deferred-svg-loaded')) return;
            
            fetch('icons-deferred.svg')
                .then(response => response.text())
                .then(svg => {
                    const container = document.createElement('div');
                    container.id = 'deferred-svg-loaded';
                    container.innerHTML = svg;
                    document.body.appendChild(container);
                })
                .catch(err => console.warn('SVG 지연 로딩 실패:', err));
        }

        // 인터랙션 이벤트 후 로딩
        const events = ['scroll', 'click', 'touchstart'];
        const loadOnce = () => {
            events.forEach(event => 
                document.removeEventListener(event, loadOnce));
            loadDeferredSVG();
        };

        events.forEach(event => 
            document.addEventListener(event, loadOnce, { passive: true }));

        // 3초 후 자동 로딩 (fallback)
        setTimeout(loadDeferredSVG, 3000);
    })();
    </script>`;
    }

    /**
     * SVG 성능 분석
     */
    analyzeSVGPerformance(originalSVG, optimizedSVG) {
        const originalSize = Buffer.byteLength(originalSVG, 'utf8');
        const optimizedSize = Buffer.byteLength(optimizedSVG, 'utf8');
        const savings = originalSize - optimizedSize;
        const savingsPercent = (savings / originalSize * 100).toFixed(1);

        return {
            original: {
                size: originalSize,
                sizeKB: (originalSize / 1024).toFixed(2)
            },
            optimized: {
                size: optimizedSize,
                sizeKB: (optimizedSize / 1024).toFixed(2)
            },
            savings: {
                bytes: savings,
                percent: savingsPercent
            }
        };
    }

    /**
     * Critical SVG 인라인 생성
     */
    generateInlineCriticalSVG(svgContent) {
        const criticalSVG = this.extractCriticalIcons(svgContent);
        const optimized = this.optimizeSVG(criticalSVG);

        return `
<!-- Critical SVG Sprites (Above-the-fold) -->
${optimized}`;
    }

    /**
     * WebP 대체 이미지 생성 (캐릭터용)
     */
    generateWebPFallbacks() {
        return `
    <script>
    // 🖼️ WebP 지원 감지 및 대체 이미지 처리
    function supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    if (!supportsWebP()) {
        document.documentElement.classList.add('no-webp');
    } else {
        document.documentElement.classList.add('webp');
    }
    </script>`;
    }

    /**
     * 최적화 실행
     */
    async processOptimization(svgFilePath) {
        try {
            const originalSVG = fs.readFileSync(svgFilePath, 'utf8');
            
            // Critical SVG 생성
            const criticalSVG = this.extractCriticalIcons(originalSVG);
            const optimizedCritical = await this.optimizeSVG(criticalSVG);
            
            // Deferred SVG 생성
            const deferredSVG = this.createDeferredSVG(originalSVG);
            const optimizedDeferred = await this.optimizeSVG(deferredSVG);

            // 성능 분석
            const analysis = this.analyzeSVGPerformance(originalSVG, optimizedCritical + optimizedDeferred);

            return {
                critical: optimizedCritical,
                deferred: optimizedDeferred,
                analysis: analysis
            };
        } catch (error) {
            console.error('SVG 최적화 실패:', error);
            throw error;
        }
    }
}

module.exports = SVGOptimizer;