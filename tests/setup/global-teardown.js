/**
 * Global Jest Teardown for 감자토끼 가계부
 * Clean up test server and resources
 */

module.exports = async () => {
  console.log('🔧 Running global teardown...');
  
  try {
    // Clean up any remaining resources
    if (global.__SERVER_PROCESS__) {
      global.__SERVER_PROCESS__.kill();
      console.log('✅ Server process terminated');
    }
    
    // Close any open browser instances
    if (global.__BROWSER_GLOBAL__) {
      await global.__BROWSER_GLOBAL__.close();
      console.log('✅ Browser instances closed');
    }
    
    console.log('✅ Global teardown completed');
    
  } catch (error) {
    console.error('❌ Global teardown error:', error);
  }
};