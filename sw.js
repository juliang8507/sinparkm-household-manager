/**
 * 감자토끼 가계부 - Service Worker
 * PWA 기능을 위한 캐싱, 오프라인 지원, 테마 동기화 Service Worker
 */

const CACHE_NAME = 'potato-rabbit-budget-v1.0.0';
const CACHE_STRATEGY_VERSION = '1.0.0';

// 핵심 캐시 파일 (앱 셸)
const CORE_CACHE = [
  '/',
  '/index.html',
  '/transaction-form.html',
  '/transaction-history.html',
  '/meal-planning.html',
  '/manifest.json',
  '/css/tokens.css',
  '/css/accessibility.css',
  '/css/token-integration.css',
  '/css/icon-system.css',
  '/css/svg-sprite-animations.css',
  '/css/theme-switcher.css',
  '/js/theme-switcher.js',
  '/js/sprite-animation-helpers.js',
  '/js/icon-helpers.js',
  '/icons.svg',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// 페이지별 리소스 (지연 캐시)
const PAGE_CACHE = [
  '/index.css',
  '/index.js',
  '/transaction-form.css',
  '/transaction-form.js',
  '/transaction-history.css',
  '/transaction-history.js',
  '/meal-planning.css',
  '/meal-planning.js',
  '/style-guide.html',
  '/css/styleguide.css',
  '/css/styleguide.js'
];

// 외부 리소스 (폰트 등)
const EXTERNAL_CACHE = [
  'https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Comic+Neue:wght@400;700&display=swap',
  'https://fonts.gstatic.com/s/kanit/v13/nKKX-Go6G5tXcrhPwPKrVAg.woff2',
  'https://fonts.gstatic.com/s/nunito/v25/XRXI3I6Li01BKofAjsOUb_A.woff2'
];

/**
 * Service Worker 설치
 */
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker 설치 중...');
  
  event.waitUntil(
    (async () => {
      try {
        // 핵심 캐시 설치
        const cache = await caches.open(CACHE_NAME);
        console.log('📦 핵심 리소스 캐싱...');
        await cache.addAll(CORE_CACHE);
        
        // 즉시 활성화
        self.skipWaiting();
        console.log('✅ Service Worker 설치 완료');
        
      } catch (error) {
        console.error('❌ Service Worker 설치 실패:', error);
      }
    })()
  );
});

/**
 * Service Worker 활성화
 */
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker 활성화 중...');
  
  event.waitUntil(
    (async () => {
      try {
        // 이전 캐시 정리
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log(`🗑️ 이전 캐시 삭제: ${cacheName}`);
              return caches.delete(cacheName);
            })
        );
        
        // 모든 클라이언트 제어
        await self.clients.claim();
        
        // 백그라운드 페이지 캐싱
        await cachePageResources();
        
        console.log('✅ Service Worker 활성화 완료');
        
      } catch (error) {
        console.error('❌ Service Worker 활성화 실패:', error);
      }
    })()
  );
});

/**
 * 페이지별 리소스 백그라운드 캐싱
 */
async function cachePageResources() {
  try {
    const cache = await caches.open(CACHE_NAME);
    console.log('📦 페이지 리소스 백그라운드 캐싱...');
    
    // 페이지 리소스를 하나씩 시도 (실패해도 계속)
    for (const resource of PAGE_CACHE) {
      try {
        await cache.add(resource);
      } catch (err) {
        console.warn(`⚠️ 리소스 캐싱 실패 (계속 진행): ${resource}`);
      }
    }
    
    // 외부 리소스 캐싱 (별도로 처리)
    await cacheExternalResources();
    
  } catch (error) {
    console.warn('⚠️ 페이지 리소스 캐싱 부분 실패:', error);
  }
}

/**
 * 외부 리소스 캐싱
 */
async function cacheExternalResources() {
  try {
    const cache = await caches.open(CACHE_NAME + '-external');
    console.log('🌐 외부 리소스 캐싱...');
    
    for (const resource of EXTERNAL_CACHE) {
      try {
        const response = await fetch(resource, { 
          mode: 'cors',
          cache: 'force-cache'
        });
        if (response.ok) {
          await cache.put(resource, response);
        }
      } catch (err) {
        console.warn(`⚠️ 외부 리소스 캐싱 실패: ${resource}`);
      }
    }
    
  } catch (error) {
    console.warn('⚠️ 외부 리소스 캐싱 실패:', error);
  }
}

/**
 * Fetch 이벤트 (네트워크 요청 가로채기)
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // HTML 페이지 요청
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // 정적 리소스 요청
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
});

/**
 * 네비게이션 요청 처리 (HTML 페이지)
 */
async function handleNavigationRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // 온라인 상태에서는 네트워크 우선
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // 캐시에 저장
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('네트워크 응답 실패');
    
  } catch (error) {
    console.log('📱 오프라인 모드: 캐시에서 페이지 제공');
    
    // 캐시에서 찾기
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 특정 페이지에 대한 폴백
    const pageFallbacks = {
      '/transaction-form.html': await caches.match('/transaction-form.html'),
      '/transaction-history.html': await caches.match('/transaction-history.html'),
      '/meal-planning.html': await caches.match('/meal-planning.html')
    };
    
    if (pageFallbacks[pathname]) {
      return pageFallbacks[pathname];
    }
    
    // 기본 폴백: 홈 페이지
    return await caches.match('/index.html') || new Response(
      getOfflinePage(),
      { 
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
}

/**
 * 정적 리소스 요청 처리
 */
async function handleStaticRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 캐시 우선 전략 (정적 리소스)
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // 백그라운드에서 업데이트 시도
      updateCacheInBackground(request);
      return cachedResponse;
    }
    
    // 캐시에 없으면 네트워크에서 가져오기
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // 캐시에 저장
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('네트워크 응답 실패');
    
  } catch (error) {
    console.warn(`⚠️ 리소스 요청 실패: ${url.pathname}`);
    
    // 이미지나 폰트의 경우 기본 응답
    if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp|woff2|woff)$/)) {
      return new Response('', { status: 204 });
    }
    
    // 기타 리소스의 경우 오류 응답
    return new Response('오프라인 상태입니다', { status: 503 });
  }
}

/**
 * 백그라운드 캐시 업데이트
 */
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    // 백그라운드 업데이트 실패는 조용히 무시
  }
}

/**
 * 메시지 처리 (테마 변경 등)
 */
self.addEventListener('message', (event) => {
  const { data } = event;
  
  if (data.type === 'UPDATE_THEME_COLORS') {
    handleThemeUpdate(data);
  } else if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (data.type === 'GET_CACHE_STATUS') {
    getCacheStatus().then(status => {
      event.ports[0].postMessage(status);
    });
  }
});

/**
 * PWA 테마 업데이트 처리
 */
async function handleThemeUpdate(themeData) {
  try {
    console.log(`🎨 PWA 테마 업데이트: ${themeData.theme}`);
    
    // 모든 클라이언트에게 테마 변경 알림
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'THEME_UPDATED',
        theme: themeData.theme,
        colors: {
          themeColor: themeData.themeColor,
          backgroundColor: themeData.backgroundColor
        }
      });
    });
    
  } catch (error) {
    console.error('❌ 테마 업데이트 실패:', error);
  }
}

/**
 * 캐시 상태 조회
 */
async function getCacheStatus() {
  try {
    const cacheNames = await caches.keys();
    const cacheDetails = [];
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      cacheDetails.push({
        name: cacheName,
        size: keys.length,
        resources: keys.map(key => key.url)
      });
    }
    
    return {
      version: CACHE_STRATEGY_VERSION,
      caches: cacheDetails,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ 캐시 상태 조회 실패:', error);
    return { error: error.message };
  }
}

/**
 * 오프라인 페이지 HTML 생성
 */
function getOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>오프라인 - 감자토끼 가계부</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Kanit', sans-serif;
          background: linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #280D5F;
        }
        
        .offline-container {
          text-align: center;
          padding: 2rem;
          max-width: 400px;
        }
        
        .character-container {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .offline-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1FC7D4;
        }
        
        .offline-message {
          font-size: 1rem;
          margin-bottom: 2rem;
          line-height: 1.5;
        }
        
        .retry-button {
          background: #1FC7D4;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .retry-button:hover {
          background: #0098A1;
        }
        
        @media (prefers-color-scheme: dark) {
          body {
            background: #0E0E0E;
            color: #FFFFFF;
          }
          
          .offline-title {
            color: #33E1ED;
          }
          
          .retry-button {
            background: #33E1ED;
            color: #0E0E0E;
          }
          
          .retry-button:hover {
            background: #1FC7D4;
          }
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="character-container">🥔🐰</div>
        <h1 class="offline-title">오프라인 상태</h1>
        <p class="offline-message">
          인터넷 연결을 확인하고<br>
          다시 시도해주세요
        </p>
        <button class="retry-button" onclick="window.location.reload()">
          다시 시도
        </button>
      </div>
    </body>
    </html>
  `;
}

/**
 * 푸시 알림 처리
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || '새로운 알림이 있습니다',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-96x96.png',
    data: data.data || {},
    actions: [
      {
        action: 'open',
        title: '앱 열기'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || '감자토끼 가계부',
      options
    )
  );
});

/**
 * 알림 클릭 처리
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('✅ Service Worker 로드 완료: 감자토끼 가계부 PWA');