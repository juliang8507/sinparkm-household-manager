const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { initializeDatabase } = require('./src/database/init');
const budgetRoutes = require('./src/routes/budget');
const mealRoutes = require('./src/routes/meal');
const fridgeRoutes = require('./src/routes/fridge');
const integrationRoutes = require('./src/routes/integration');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // PWA를 위해 비활성화
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/budget', budgetRoutes);
app.use('/api/meal', mealRoutes);
app.use('/api/fridge', fridgeRoutes);
app.use('/api/integration', integrationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// PWA routes
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'manifest.json'));
});

app.get('/sw.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'sw.js'));
});

// Serve main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch all other routes and serve index.html (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🏠 우리집 매니저 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
    console.log(`📱 PWA 지원: manifest.json, service worker 준비됨`);
    console.log(`🔌 API 엔드포인트: /api/budget, /api/meal, /api/fridge, /api/integration`);
  });
}).catch(err => {
  console.error('데이터베이스 초기화 실패:', err);
  process.exit(1);
});