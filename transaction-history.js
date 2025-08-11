/**
 * 감자토끼 거래 내역 페이지 JavaScript
 * Mobile-First Interactive Features
 */

// DOM Elements
const elements = {
    filterButtons: document.querySelectorAll('.filter-button'),
    userFilterButtons: document.querySelectorAll('.user-filter-button'),
    transactionCards: document.querySelectorAll('.transaction-card'),
    transactionList: document.getElementById('transactionList'),
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState'),
    errorState: document.getElementById('errorState'),
    loadMoreButton: document.querySelector('.load-more-button'),
    floatingAddButton: document.querySelector('.floating-add-button'),
    addTransactionButton: document.querySelector('.add-transaction-button'),
    retryButton: document.querySelector('.retry-button')
};

// Application State
const state = {
    currentFilter: 'all',
    currentUserFilter: 'all',
    transactions: [],
    isLoading: false,
    hasError: false,
    page: 1,
    hasMore: true
};

// Mock Transaction Data for Demo
const mockTransactions = [
    {
        id: 1,
        amount: 50000,
        type: 'income',
        description: '용돈',
        category: '기타',
        user: 'husband',
        date: new Date(),
        time: '14:30'
    },
    {
        id: 2,
        amount: -15000,
        type: 'expense',
        description: '점심 식사',
        category: '식비',
        user: 'wife',
        date: new Date(),
        time: '13:00'
    },
    {
        id: 3,
        amount: -5500,
        type: 'expense',
        description: '아메리카노',
        category: '카페',
        user: 'husband',
        date: new Date(),
        time: '10:30'
    },
    {
        id: 4,
        amount: -32000,
        type: 'expense',
        description: '생필품 구매',
        category: '생활용품',
        user: 'wife',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        time: '19:20'
    },
    {
        id: 5,
        amount: -1300,
        type: 'expense',
        description: '지하철',
        category: '교통비',
        user: 'husband',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        time: '09:00'
    },
    {
        id: 6,
        amount: 200000,
        type: 'income',
        description: '프리랜서 급여',
        category: '급여',
        user: 'husband',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        time: '11:00'
    }
];

/**
 * Initialize the application
 */
function init() {
    console.log('🥔🐰 감자토끼 거래 내역 페이지 초기화');
    
    setupEventListeners();
    loadTransactions();
    handleInitialState();
    
    // Add loading animation to characters
    animateCharacters();
    
    // Handle page visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Filter buttons
    elements.filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterChange);
    });
    
    // User filter buttons
    elements.userFilterButtons.forEach(button => {
        button.addEventListener('click', handleUserFilterChange);
    });
    
    // Transaction cards (for interaction)
    elements.transactionCards.forEach(card => {
        card.addEventListener('click', handleTransactionClick);
        card.addEventListener('keydown', handleTransactionKeydown);
    });
    
    // Load more button
    if (elements.loadMoreButton) {
        elements.loadMoreButton.addEventListener('click', loadMoreTransactions);
    }
    
    // Floating add button
    if (elements.floatingAddButton) {
        elements.floatingAddButton.addEventListener('click', handleAddTransaction);
    }
    
    // Add transaction button (empty state)
    if (elements.addTransactionButton) {
        elements.addTransactionButton.addEventListener('click', handleAddTransaction);
    }
    
    // Retry button (error state)
    if (elements.retryButton) {
        elements.retryButton.addEventListener('click', handleRetry);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleGlobalKeydown);
    
    // Touch gestures for mobile
    setupTouchGestures();
}

/**
 * Handle filter button changes
 */
function handleFilterChange(event) {
    const button = event.currentTarget;
    const filter = button.dataset.filter;
    
    if (filter === state.currentFilter) return;
    
    // Update button states
    elements.filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    
    // Update state
    state.currentFilter = filter;
    
    // Apply filter with animation
    applyFilters();
    
    // Add haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log(`🔍 필터 변경: ${filter}`);
}

/**
 * Handle user filter button changes
 */
function handleUserFilterChange(event) {
    const button = event.currentTarget;
    const userFilter = button.dataset.user;
    
    if (userFilter === state.currentUserFilter) return;
    
    // Update button states
    elements.userFilterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    
    // Update state
    state.currentUserFilter = userFilter;
    
    // Apply filter with animation
    applyFilters();
    
    console.log(`👤 사용자 필터 변경: ${userFilter}`);
}

/**
 * Apply filters to transaction list
 */
function applyFilters() {
    const cards = document.querySelectorAll('.transaction-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const cardType = card.classList.contains('income') ? 'income' : 'expense';
        const cardUser = card.dataset.user || 'husband'; // Default fallback
        
        const typeMatch = state.currentFilter === 'all' || state.currentFilter === cardType;
        const userMatch = state.currentUserFilter === 'all' || state.currentUserFilter === cardUser;
        
        if (typeMatch && userMatch) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInUp 0.3s ease-out forwards';
            visibleCount++;
        } else {
            card.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (!typeMatch || !userMatch) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Show/hide empty state based on visible transactions
    updateEmptyState(visibleCount === 0);
    
    // Update date group headers visibility
    updateDateGroupVisibility();
}

/**
 * Update date group visibility based on filtered transactions
 */
function updateDateGroupVisibility() {
    const dateGroups = document.querySelectorAll('.date-group');
    
    dateGroups.forEach(group => {
        const visibleCards = group.querySelectorAll('.transaction-card[style*="display: flex"], .transaction-card:not([style*="display: none"])');
        
        if (visibleCards.length === 0) {
            group.style.display = 'none';
        } else {
            group.style.display = 'block';
        }
    });
}

/**
 * Handle transaction card click
 */
function handleTransactionClick(event) {
    const card = event.currentTarget;
    const transactionId = card.dataset.transactionId;
    
    // Add click animation
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
        card.style.transform = '';
    }, 150);
    
    // Handle transaction details (could open modal, navigate, etc.)
    console.log(`💳 거래 클릭: ${transactionId}`);
    
    // For demo, just highlight the card
    card.style.background = 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(139, 69, 19, 0.05) 100%)';
    setTimeout(() => {
        card.style.background = '';
    }, 1000);
}

/**
 * Handle keyboard navigation on transaction cards
 */
function handleTransactionKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleTransactionClick(event);
    }
}

/**
 * Handle global keyboard shortcuts
 */
function handleGlobalKeydown(event) {
    // Alt + 1-3 for filter shortcuts
    if (event.altKey) {
        switch (event.key) {
            case '1':
                event.preventDefault();
                document.querySelector('[data-filter="all"]').click();
                break;
            case '2':
                event.preventDefault();
                document.querySelector('[data-filter="income"]').click();
                break;
            case '3':
                event.preventDefault();
                document.querySelector('[data-filter="expense"]').click();
                break;
        }
    }
    
    // R for refresh
    if (event.key === 'r' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleRetry();
    }
}

/**
 * Setup touch gestures for mobile
 */
function setupTouchGestures() {
    let startY = 0;
    let startTime = 0;
    
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        const diffY = startY - endY;
        const timeDiff = endTime - startTime;
        
        // Pull to refresh gesture
        if (diffY < -100 && timeDiff < 500 && window.scrollY === 0) {
            handleRetry();
        }
    }, { passive: true });
}

/**
 * Load transactions (simulate API call)
 */
async function loadTransactions() {
    showLoadingState();
    
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo, we'll use mock data
        state.transactions = mockTransactions;
        state.hasError = false;
        
        showTransactionList();
        
    } catch (error) {
        console.error('거래 내역 로드 실패:', error);
        state.hasError = true;
        showErrorState();
    }
}

/**
 * Load more transactions
 */
async function loadMoreTransactions() {
    if (state.isLoading || !state.hasMore) return;
    
    const button = elements.loadMoreButton;
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span class="button-icon">🔄</span> 로딩 중...';
    button.disabled = true;
    
    try {
        // Simulate loading more data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demo, just show message that no more data
        state.hasMore = false;
        button.innerHTML = '<span class="button-icon">✅</span> 모든 거래를 확인했습니다';
        
        setTimeout(() => {
            button.style.display = 'none';
        }, 2000);
        
    } catch (error) {
        button.innerHTML = originalText;
        button.disabled = false;
        console.error('추가 데이터 로드 실패:', error);
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    state.isLoading = true;
    
    elements.loadingState.style.display = 'block';
    elements.loadingState.setAttribute('aria-hidden', 'false');
    
    elements.transactionList.style.display = 'none';
    elements.emptyState.style.display = 'none';
    elements.emptyState.setAttribute('aria-hidden', 'true');
    elements.errorState.style.display = 'none';
    elements.errorState.setAttribute('aria-hidden', 'true');
}

/**
 * Show transaction list
 */
function showTransactionList() {
    state.isLoading = false;
    
    elements.loadingState.style.display = 'none';
    elements.loadingState.setAttribute('aria-hidden', 'true');
    
    elements.transactionList.style.display = 'block';
    elements.emptyState.style.display = 'none';
    elements.emptyState.setAttribute('aria-hidden', 'true');
    elements.errorState.style.display = 'none';
    elements.errorState.setAttribute('aria-hidden', 'true');
    
    // Apply current filters
    applyFilters();
}

/**
 * Show empty state
 */
function showEmptyState() {
    elements.loadingState.style.display = 'none';
    elements.loadingState.setAttribute('aria-hidden', 'true');
    
    elements.transactionList.style.display = 'none';
    elements.emptyState.style.display = 'block';
    elements.emptyState.setAttribute('aria-hidden', 'false');
    elements.errorState.style.display = 'none';
    elements.errorState.setAttribute('aria-hidden', 'true');
}

/**
 * Show error state
 */
function showErrorState() {
    state.isLoading = false;
    
    elements.loadingState.style.display = 'none';
    elements.loadingState.setAttribute('aria-hidden', 'true');
    
    elements.transactionList.style.display = 'none';
    elements.emptyState.style.display = 'none';
    elements.emptyState.setAttribute('aria-hidden', 'true');
    elements.errorState.style.display = 'block';
    elements.errorState.setAttribute('aria-hidden', 'false');
}

/**
 * Update empty state visibility based on filter results
 */
function updateEmptyState(isEmpty) {
    if (isEmpty && !state.isLoading && !state.hasError) {
        // Update empty state message based on current filter
        const emptyTitle = elements.emptyState.querySelector('.empty-state-title');
        const emptyDescription = elements.emptyState.querySelector('.empty-state-description');
        
        if (state.currentFilter !== 'all' || state.currentUserFilter !== 'all') {
            emptyTitle.textContent = '조건에 맞는 거래가 없어요!';
            emptyDescription.innerHTML = '다른 필터를 선택해서<br>다른 거래들을 확인해보세요';
        } else {
            emptyTitle.textContent = '아직 거래 내역이 없어요!';
            emptyDescription.innerHTML = '첫 번째 거래를 추가해서<br>감자토끼와 함께 가계부를 시작해보세요';
        }
        
        showEmptyState();
    } else if (!isEmpty && elements.emptyState.style.display !== 'none') {
        elements.emptyState.style.display = 'none';
        elements.emptyState.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Handle add transaction button click
 */
function handleAddTransaction() {
    console.log('➕ 새 거래 추가');
    
    // Add visual feedback
    const button = event.currentTarget;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Here you would typically open a modal or navigate to add transaction page
    alert('새 거래 추가 기능이 곧 추가됩니다! 🥔🐰');
}

/**
 * Handle retry button click
 */
function handleRetry() {
    console.log('🔄 다시 시도');
    loadTransactions();
}

/**
 * Handle page visibility change
 */
function handleVisibilityChange() {
    if (!document.hidden && state.hasError) {
        // Automatically retry when page becomes visible after error
        setTimeout(handleRetry, 500);
    }
}

/**
 * Handle initial state based on data
 */
function handleInitialState() {
    // Check if we should show empty state initially
    if (state.transactions.length === 0 && !state.isLoading) {
        showEmptyState();
    }
}

/**
 * Animate characters with subtle movements
 */
function animateCharacters() {
    const characters = document.querySelectorAll('.title-icon, .icon-character');
    
    characters.forEach((char, index) => {
        // Add subtle random animations
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance
                char.style.animation = 'none';
                setTimeout(() => {
                    char.style.animation = '';
                }, 50);
            }
        }, 3000 + (index * 500)); // Stagger the intervals
    });
}

/**
 * Format currency for display
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.abs(amount));
}

/**
 * Get relative time string
 */
function getRelativeTimeString(date) {
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    
    return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short'
    });
}

/**
 * Add CSS animations dynamically
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.95);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add animation styles
addAnimationStyles();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        state,
        formatCurrency,
        getRelativeTimeString
    };
}

console.log('🥔🐰 감자토끼 거래 내역 JavaScript 로드 완료!');