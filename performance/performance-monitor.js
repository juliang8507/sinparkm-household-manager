/**
 * 감자토끼 가계부 - Performance Monitor
 * 실시간 성능 모니터링 및 예산 검증
 */

class PerformanceMonitor {
    constructor() {
        this.budgets = {
            css: {
                critical: 15,      // KB
                total: 60,         // KB
                fonts: 120         // KB
            },
            lcp: 2500,            // ms
            cls: 0.1,             // score
            fid: 100,             // ms
            fcp: 1500             // ms
        };

        this.metrics = {};
        this.observers = [];
    }

    /**
     * Core Web Vitals 모니터링 초기화
     */
    initializeCoreWebVitals() {
        // LCP (Largest Contentful Paint) 모니터링
        this.observeLCP();
        
        // CLS (Cumulative Layout Shift) 모니터링
        this.observeCLS();
        
        // FID (First Input Delay) 모니터링  
        this.observeFID();
        
        // FCP (First Contentful Paint) 모니터링
        this.observeFCP();
    }

    /**
     * LCP 모니터링
     */
    observeLCP() {
        if (!window.PerformanceObserver) return;

        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.metrics.lcp = {
                value: lastEntry.startTime,
                element: lastEntry.element?.tagName || 'unknown',
                withinBudget: lastEntry.startTime <= this.budgets.lcp,
                timestamp: Date.now()
            };

            this.reportMetric('LCP', this.metrics.lcp);
        });

        try {
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
            this.observers.push(observer);
        } catch (e) {
            console.warn('LCP 모니터링 실패:', e);
        }
    }

    /**
     * CLS 모니터링
     */
    observeCLS() {
        if (!window.PerformanceObserver) return;

        let clsValue = 0;
        let clsEntries = [];

        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push(entry);
                }
            }

            this.metrics.cls = {
                value: clsValue,
                withinBudget: clsValue <= this.budgets.cls,
                entries: clsEntries.length,
                timestamp: Date.now()
            };

            this.reportMetric('CLS', this.metrics.cls);
        });

        try {
            observer.observe({ type: 'layout-shift', buffered: true });
            this.observers.push(observer);
        } catch (e) {
            console.warn('CLS 모니터링 실패:', e);
        }
    }

    /**
     * FID 모니터링
     */
    observeFID() {
        if (!window.PerformanceObserver) return;

        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                this.metrics.fid = {
                    value: entry.processingStart - entry.startTime,
                    withinBudget: (entry.processingStart - entry.startTime) <= this.budgets.fid,
                    timestamp: Date.now()
                };

                this.reportMetric('FID', this.metrics.fid);
            }
        });

        try {
            observer.observe({ type: 'first-input', buffered: true });
            this.observers.push(observer);
        } catch (e) {
            console.warn('FID 모니터링 실패:', e);
        }
    }

    /**
     * FCP 모니터링
     */
    observeFCP() {
        if (!window.PerformanceObserver) return;

        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            for (const entry of entries) {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = {
                        value: entry.startTime,
                        withinBudget: entry.startTime <= this.budgets.fcp,
                        timestamp: Date.now()
                    };

                    this.reportMetric('FCP', this.metrics.fcp);
                }
            }
        });

        try {
            observer.observe({ type: 'paint', buffered: true });
            this.observers.push(observer);
        } catch (e) {
            console.warn('FCP 모니터링 실패:', e);
        }
    }

    /**
     * 리소스 로딩 모니터링
     */
    monitorResourceLoading() {
        if (!window.PerformanceObserver) return;

        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.initiatorType === 'css' || entry.name.includes('.css')) {
                    this.trackCSSLoading(entry);
                } else if (entry.name.includes('font')) {
                    this.trackFontLoading(entry);
                }
            });
        });

        try {
            observer.observe({ type: 'resource', buffered: true });
            this.observers.push(observer);
        } catch (e) {
            console.warn('리소스 모니터링 실패:', e);
        }
    }

    /**
     * CSS 로딩 추적
     */
    trackCSSLoading(entry) {
        const sizeKB = entry.transferSize ? (entry.transferSize / 1024).toFixed(2) : 'unknown';
        const isWithinBudget = entry.transferSize ? (entry.transferSize / 1024) <= this.budgets.css.total : true;

        console.log(`📄 CSS 로딩: ${entry.name}`, {
            size: `${sizeKB}KB`,
            duration: `${entry.duration.toFixed(2)}ms`,
            withinBudget: isWithinBudget
        });

        // 예산 초과 경고
        if (!isWithinBudget) {
            console.warn(`⚠️ CSS 예산 초과: ${sizeKB}KB > ${this.budgets.css.total}KB`);
        }
    }

    /**
     * 폰트 로딩 추적
     */
    trackFontLoading(entry) {
        const sizeKB = entry.transferSize ? (entry.transferSize / 1024).toFixed(2) : 'unknown';
        
        console.log(`🔤 폰트 로딩: ${entry.name}`, {
            size: `${sizeKB}KB`,
            duration: `${entry.duration.toFixed(2)}ms`
        });
    }

    /**
     * 성능 메트릭 리포트
     */
    reportMetric(name, metric) {
        const status = metric.withinBudget ? '✅' : '❌';
        const unit = name === 'CLS' ? '' : 'ms';
        
        console.log(`${status} ${name}: ${metric.value.toFixed(2)}${unit}`, metric);

        // 예산 초과 시 개선 제안
        if (!metric.withinBudget) {
            this.suggestImprovement(name, metric);
        }
    }

    /**
     * 성능 개선 제안
     */
    suggestImprovement(metricName, metric) {
        const suggestions = {
            LCP: [
                '🖼️ 이미지 최적화 (WebP 형식 사용)',
                '📄 Critical CSS 인라인화',
                '🔤 폰트 preload 추가',
                '⚡ 서버 응답 시간 개선'
            ],
            CLS: [
                '📐 이미지에 width/height 속성 추가',
                '🔤 폰트 로딩 최적화 (font-display: swap)',
                '📦 동적 콘텐츠 공간 미리 확보',
                '🎨 광고/임베드 콘텐츠 크기 고정'
            ],
            FID: [
                '⚡ JavaScript 실행 시간 최적화',
                '🔄 코드 스플리팅 적용',
                '⏱️ 긴 작업을 작은 청크로 분할',
                '🎯 이벤트 리스너 최적화'
            ],
            FCP: [
                '📄 Critical CSS 인라인화',
                '🔤 폰트 preload',
                '⚡ 서버 응답 시간 개선',
                '📦 리소스 우선순위 최적화'
            ]
        };

        console.group(`💡 ${metricName} 개선 제안:`);
        suggestions[metricName]?.forEach(suggestion => {
            console.log(suggestion);
        });
        console.groupEnd();
    }

    /**
     * 성능 예산 검증
     */
    validatePerformanceBudgets() {
        const results = {
            passed: 0,
            failed: 0,
            total: 0,
            details: {}
        };

        Object.keys(this.budgets).forEach(metric => {
            if (this.metrics[metric]) {
                const withinBudget = this.metrics[metric].withinBudget;
                results.details[metric] = {
                    value: this.metrics[metric].value,
                    budget: this.budgets[metric],
                    withinBudget: withinBudget
                };
                
                if (withinBudget) {
                    results.passed++;
                } else {
                    results.failed++;
                }
                results.total++;
            }
        });

        return results;
    }

    /**
     * 성능 대시보드 표시
     */
    displayPerformanceDashboard() {
        if (!document.getElementById('performance-dashboard')) {
            this.createPerformanceDashboard();
        }

        const dashboard = document.getElementById('performance-dashboard');
        const validation = this.validatePerformanceBudgets();

        dashboard.innerHTML = `
            <div class="perf-summary">
                <h3>⚡ 성능 대시보드</h3>
                <div class="perf-score">${validation.passed}/${validation.total} 통과</div>
            </div>
            <div class="perf-metrics">
                ${Object.entries(validation.details).map(([metric, data]) => `
                    <div class="perf-metric ${data.withinBudget ? 'pass' : 'fail'}">
                        <span class="metric-name">${metric.toUpperCase()}</span>
                        <span class="metric-value">${data.value.toFixed(2)}</span>
                        <span class="metric-budget">/${data.budget}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * 성능 대시보드 UI 생성
     */
    createPerformanceDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'performance-dashboard';
        dashboard.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #1FC7D4;
            border-radius: 8px;
            padding: 16px;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 200px;
        `;

        // 개발 환경에서만 표시
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            document.body.appendChild(dashboard);
        }
    }

    /**
     * 모니터링 시작
     */
    start() {
        console.log('🚀 성능 모니터링 시작');
        
        this.initializeCoreWebVitals();
        this.monitorResourceLoading();

        // 3초 후 대시보드 표시
        setTimeout(() => {
            this.displayPerformanceDashboard();
        }, 3000);

        // 30초마다 업데이트
        setInterval(() => {
            this.displayPerformanceDashboard();
        }, 30000);
    }

    /**
     * 정리
     */
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        
        const dashboard = document.getElementById('performance-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
    }
}

// 자동 초기화 (개발 환경)
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    const monitor = new PerformanceMonitor();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => monitor.start());
    } else {
        monitor.start();
    }
}

module.exports = PerformanceMonitor;