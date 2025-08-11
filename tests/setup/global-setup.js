/**
 * Global Jest Setup for 감자토끼 가계부
 * Initialize test server and create necessary directories
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

let serverProcess = null;

module.exports = async () => {
  console.log('🚀 Starting global test setup...');
  
  try {
    // Create test directories
    const testDirs = [
      'tests/screenshots',
      'tests/screenshots/baseline',
      'tests/screenshots/current',
      'tests/screenshots/diffs',
      'tests/reports',
      'tests/accessibility-reports',
      'tests/coverage'
    ];
    
    for (const dir of testDirs) {
      const dirPath = path.join(process.cwd(), dir);
      try {
        await fs.access(dirPath);
      } catch {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    }
    
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Global setup completed');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
};