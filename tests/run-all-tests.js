#!/usr/bin/env node

/**
 * Comprehensive Test Runner for 감자토끼 가계부
 * Executes all test suites and generates reports
 */

const { exec } = require('child_process');
const path = require('path');
const TestReporter = require('./utils/test-reporter');

class TestRunner {
  constructor() {
    this.results = {
      visual: { passed: 0, failed: 0, total: 0 },
      accessibility: { passed: 0, failed: 0, total: 0 },
      keyboard: { passed: 0, failed: 0, total: 0 },
      themes: { passed: 0, failed: 0, total: 0 }
    };
    
    this.startTime = Date.now();
  }
  
  /**
   * Run a single test suite
   */
  async runTestSuite(suiteName, pattern) {
    return new Promise((resolve, reject) => {
      console.log(`\n🧪 Running ${suiteName} tests...`);
      console.log(`─────────────────────────────────────────`);
      
      const command = `npx jest --testNamePattern="${pattern}" --verbose --json`;
      
      exec(command, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
        if (stderr && !stderr.includes('console.log') && !stderr.includes('console.warn')) {
          console.warn(`⚠️  ${suiteName} warnings:`, stderr);
        }
        
        try {
          // Try to parse JSON output from Jest
          const lines = stdout.split('\n');
          const jsonLine = lines.find(line => line.startsWith('{') && line.includes('"testResults"'));
          
          if (jsonLine) {
            const results = JSON.parse(jsonLine);
            const summary = this.parseJestResults(results, suiteName);
            resolve(summary);
          } else {
            // Fallback parsing if JSON output is not available
            const summary = this.parseTextOutput(stdout, suiteName);
            resolve(summary);
          }
        } catch (parseError) {
          console.error(`❌ Failed to parse ${suiteName} results:`, parseError.message);
          const summary = {
            suiteName,
            passed: 0,
            failed: error ? 1 : 0,
            total: 1,
            duration: 0,
            error: error?.message || parseError.message
          };
          resolve(summary);
        }
      });
    });
  }
  
  /**
   * Parse Jest JSON results
   */
  parseJestResults(results, suiteName) {
    let passed = 0;
    let failed = 0;
    let total = 0;
    let duration = 0;
    
    if (results.testResults) {
      results.testResults.forEach(testFile => {
        if (testFile.assertionResults) {
          testFile.assertionResults.forEach(test => {
            total++;
            if (test.status === 'passed') {
              passed++;
            } else {
              failed++;
            }
          });
        }
        duration += testFile.endTime - testFile.startTime;
      });
    }
    
    return {
      suiteName,
      passed,
      failed,
      total,
      duration,
      success: failed === 0
    };
  }
  
  /**
   * Parse text output as fallback
   */
  parseTextOutput(output, suiteName) {
    const lines = output.split('\n');
    let passed = 0;
    let failed = 0;
    let total = 0;
    
    // Look for Jest summary pattern
    const summaryLine = lines.find(line => 
      line.includes('Tests:') || 
      line.includes('passing') || 
      line.includes('failing')
    );
    
    if (summaryLine) {
      const passMatch = summaryLine.match(/(\d+)\s+passing/);
      const failMatch = summaryLine.match(/(\d+)\s+failing/);
      const totalMatch = summaryLine.match(/Tests:\s+(\d+)\s+passed/);
      
      if (passMatch) passed = parseInt(passMatch[1]);
      if (failMatch) failed = parseInt(failMatch[1]);
      if (totalMatch) total = parseInt(totalMatch[1]);
      
      if (total === 0) total = passed + failed;
    }
    
    // If no summary found, count individual test results
    if (total === 0) {
      const testLines = lines.filter(line => 
        line.includes('✓') || 
        line.includes('✗') || 
        line.includes('PASS') || 
        line.includes('FAIL')
      );
      
      testLines.forEach(line => {
        if (line.includes('✓') || line.includes('PASS')) {
          passed++;
        } else if (line.includes('✗') || line.includes('FAIL')) {
          failed++;
        }
      });
      
      total = passed + failed;
    }
    
    return {
      suiteName,
      passed: passed || 0,
      failed: failed || 0,
      total: total || 1,
      duration: 0,
      success: failed === 0
    };
  }
  
  /**
   * Display test results
   */
  displayResults(summary) {
    const { suiteName, passed, failed, total, duration, success, error } = summary;
    
    console.log(`\n📊 ${suiteName} Results:`);
    console.log(`   Total: ${total}`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    
    if (duration > 0) {
      console.log(`   ⏱️  Duration: ${duration}ms`);
    }
    
    if (error) {
      console.log(`   ⚠️  Error: ${error}`);
    }
    
    const status = success ? '✅ SUCCESS' : '❌ FAILED';
    console.log(`   ${status}\n`);
    
    return summary;
  }
  
  /**
   * Run all test suites
   */
  async runAllTests() {
    console.log('🥔🐰 감자토끼 가계부 - 종합 테스트 실행');
    console.log('═'.repeat(50));
    
    const testSuites = [
      { name: 'Visual Regression', pattern: 'Visual Regression' },
      { name: 'Accessibility', pattern: 'Accessibility' },
      { name: 'Keyboard Navigation', pattern: 'Keyboard Navigation' },
      { name: 'Theme Testing', pattern: 'Theme Testing' }
    ];
    
    const results = [];
    
    try {
      // Run each test suite
      for (const suite of testSuites) {
        const result = await this.runTestSuite(suite.name, suite.pattern);
        this.displayResults(result);
        results.push(result);
        
        // Update overall results
        this.results[suite.name.toLowerCase().replace(' ', '')] = {
          passed: result.passed,
          failed: result.failed,
          total: result.total
        };
        
        // Add delay between test suites to prevent resource conflicts
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Generate comprehensive report
      console.log('📊 Generating comprehensive test report...');
      const reporter = new TestReporter();
      const reportPath = await reporter.generateHtmlReport();
      
      // Display overall summary
      this.displayOverallSummary(results);
      
      console.log(`\n📄 Comprehensive report: ${reportPath}`);
      console.log(`\n🎉 All tests completed in ${Date.now() - this.startTime}ms`);
      
      // Exit with appropriate code
      const hasFailures = results.some(r => r.failed > 0);
      process.exit(hasFailures ? 1 : 0);
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    }
  }
  
  /**
   * Display overall test summary
   */
  displayOverallSummary(results) {
    console.log('\n📋 OVERALL TEST SUMMARY');
    console.log('═'.repeat(50));
    
    const totals = results.reduce((acc, result) => ({
      passed: acc.passed + result.passed,
      failed: acc.failed + result.failed,
      total: acc.total + result.total
    }), { passed: 0, failed: 0, total: 0 });
    
    const successRate = totals.total > 0 ? ((totals.passed / totals.total) * 100).toFixed(1) : '0';
    
    console.log(`📊 Test Statistics:`);
    console.log(`   Total Tests: ${totals.total}`);
    console.log(`   ✅ Passed: ${totals.passed}`);
    console.log(`   ❌ Failed: ${totals.failed}`);
    console.log(`   📈 Success Rate: ${successRate}%`);
    
    console.log(`\n🧪 Test Suite Breakdown:`);
    results.forEach(result => {
      const rate = result.total > 0 ? ((result.passed / result.total) * 100).toFixed(1) : '0';
      const status = result.failed === 0 ? '✅' : '❌';
      console.log(`   ${status} ${result.suiteName}: ${result.passed}/${result.total} (${rate}%)`);
    });
    
    const overallStatus = totals.failed === 0 ? 
      '🎉 ALL TESTS PASSED' : 
      `⚠️  ${totals.failed} TEST(S) FAILED`;
    
    console.log(`\n${overallStatus}`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;