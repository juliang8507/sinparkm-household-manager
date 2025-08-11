/**
 * Simple HTTP server for testing purposes
 * Serves static files for QA testing
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins during testing
app.use(cors());

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));

// Handle specific routes for HTML pages
const pages = ['index.html', 'transaction-form.html', 'transaction-history.html', 'meal-planning.html'];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, page));
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: 'test-1.0.0'
  });
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🧪 Test server running at http://localhost:${PORT}`);
  console.log(`📄 Serving static files from: ${__dirname}`);
  console.log(`✅ Ready for QA testing`);
});