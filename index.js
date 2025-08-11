/**
 * 감자토끼 홈 대시보드 JavaScript
 * Mobile-First Interactive Features with SVG Sprite Animations
 */

// 애니메이션 시스템 전역 변수
let animationSystem = null;

// DOM Elements
const elements = {
    // Header elements
    settingsButton: document.querySelector('.settings-button'),
    
    // Character elements
    potatoCharacter: document.getElementById('potatoCharacter'),
    rabbitCharacter: document.getElementById('rabbitCharacter'),
    potatoMessage: document.getElementById('potatoMessage'),
    rabbitMessage: document.getElementById('rabbitMessage'),
    greetingBubble: document.getElementById('greetingBubble'),
    greetingText: document.getElementById('greetingText'),
    
    // Summary elements
    currentBalance: document.getElementById('currentBalance'),
    todayIncome: document.getElementById('todayIncome'),
    todayExpense: document.getElementById('todayExpense'),
    incomeCount: document.getElementById('incomeCount'),
    expenseCount: document.getElementById('expenseCount'),
    
    // Summary cards
    balanceCard: document.querySelector('.balance-card'),
    incomeCard: document.querySelector('.income-card'),
    expenseCard: document.querySelector('.expense-card'),
    
    // Action buttons
    addIncomeBtn: document.getElementById('addIncomeBtn'),
    addExpenseBtn: document.getElementById('addExpenseBtn'),
    viewAllBtn: document.getElementById('viewAllBtn'),
    
    // Transaction elements
    transactionsLoading: document.getElementById('transactionsLoading'),
    transactionsEmpty: document.getElementById('transactionsEmpty'),
    transactionList: document.getElementById('transactionList'),
    transactionItems: document.querySelectorAll('.transaction-item'),
    
    // Navigation
    navItems: document.querySelectorAll('.nav-item'),
    
    // Toasts
    successToast: document.getElementById('successToast'),
    errorToast: document.getElementById('errorToast'),
    successMessage: document.getElementById('successMessage'),
    errorMessage: document.getElementById('errorMessage'),
    toastCloseButtons: document.querySelectorAll('.toast-close')
};

// Application State
const state = {
    currentBalance: 1234567,
    todayIncome: 45000,
    todayExpense: 32500,
    incomeTransactionCount: 3,
    expenseTransactionCount: 5,
    isLoading: false,
    lastInteractionTime: Date.now(),
    greetingInterval: null
};

// Time-based greetings
const greetings = {
    morning: [
        "좋은 아침이에요! 오늘도 알뜰하게 관리해보세요 💪",
        "새로운 하루가 시작됐어요! 감자토끼와 함께해요 🌅",
        "상쾌한 아침이네요! 오늘의 목표를 세워보세요 ✨"
    ],
    afternoon: [
        "점심시간이네요! 식비 관리는 어떠세요? 🍽️",
        "오후도 화이팅! 지출 내역을 확인해보세요 📊",
        "하루 반이 지났어요! 예산은 잘 지키고 있나요? 💡"
    ],
    evening: [
        "저녁시간이에요! 하루 마무리 정산은 어떠세요? 🌙",
        "오늘 하루도 수고했어요! 가계부를 정리해볼까요? 📝",
        "하루 종료까지 얼마 남지 않았어요! 마지막 점검 🕐"
    ],
    night: [
        "밤늦게까지 고생이 많아요! 내일 계획은 세우셨나요? 🌟",
        "오늘도 알찬 하루였나요? 내일을 위해 준비해요 🛌",
        "이제 잠들 시간이에요! 좋은 꿈 꾸세요 💤"
    ]
};

// Character messages based on financial status
const characterMessages = {
    potato: {
        positive: "든든한 잔액이네요! 계속 유지해보세요! 🥔",
        neutral: "든든한 하루 시작이에요!",
        negative: "조금 더 절약해볼까요? 감자가 도울게요!",
        encouraging: [
            "화이팅! 🥔", 
            "든든하게 관리해요!", 
            "절약왕 감자가 응원해요!",
            "알뜰살뜰이 최고예요!"
        ]
    },
    rabbit: {
        positive: "훌륭한 관리네요! 토끼도 기뻐해요! 🐰",
        neutral: "건강한 소비 습관을 만들어요!",
        negative: "괜찮아요! 토끼와 함께 계획을 세워봐요!",
        encouraging: [
            "파이팅! 🐰", 
            "건강한 소비해요!", 
            "알뜰토끼가 응원해요!",
            "계획적인 소비가 최고!"
        ]
    }
};

/**
 * Initialize the application
 */
function init() {
    console.log('🥔🐰 감자토끼 홈 대시보드 초기화');
    
    // 애니메이션 시스템 초기화 대기
    if (typeof spriteAnimations !== 'undefined') {
        animationSystem = spriteAnimations;
        console.log('🎬 애니메이션 시스템 연결됨');
    }
    
    setupEventListeners();
    updateGreeting();
    updateCharacterMessages();
    animateNumbers();
    startPeriodicUpdates();
    setupAccessibility();
    
    // 캐릭터 초기 애니메이션 (입장 효과)
    playInitialAnimations();
    
    // Simulate loading transactions
    loadTransactions();
    
    console.log('✅ 초기화 완료');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Settings button
    elements.settingsButton?.addEventListener('click', handleSettings);
    
    // Character interactions
    elements.potatoCharacter?.addEventListener('click', () => handleCharacterClick('potato'));
    elements.rabbitCharacter?.addEventListener('click', () => handleCharacterClick('rabbit'));
    
    // Summary card clicks
    elements.balanceCard?.addEventListener('click', handleBalanceClick);
    elements.incomeCard?.addEventListener('click', handleIncomeClick);
    elements.expenseCard?.addEventListener('click', handleExpenseClick);
    
    // Action buttons
    elements.addIncomeBtn?.addEventListener('click', handleAddIncome);
    elements.addExpenseBtn?.addEventListener('click', handleAddExpense);
    elements.viewAllBtn?.addEventListener('click', handleViewAll);
    
    // Transaction item clicks
    elements.transactionItems.forEach(item => {
        item.addEventListener('click', handleTransactionClick);
    });
    
    // Toast close buttons
    elements.toastCloseButtons.forEach(btn => {
        btn.addEventListener('click', closeToast);
    });
    
    // Navigation items
    elements.navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Touch gestures for mobile
    setupTouchGestures();
    
    // Visibility change handling
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Online/offline status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
}

/**
 * Update greeting based on current time
 */
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    
    let timeCategory;
    if (hour >= 6 && hour < 12) {
        timeCategory = 'morning';
    } else if (hour >= 12 && hour < 17) {
        timeCategory = 'afternoon';
    } else if (hour >= 17 && hour < 22) {
        timeCategory = 'evening';
    } else {
        timeCategory = 'night';
    }
    
    const messages = greetings[timeCategory];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    if (elements.greetingText) {
        elements.greetingText.textContent = randomMessage;
        
        // Add animation
        elements.greetingBubble?.style.setProperty('animation', 'bubble-appear 1s ease-out');
    }
}

/**
 * Update character messages based on financial status
 */
function updateCharacterMessages() {
    const netBalance = state.currentBalance;
    const todayNet = state.todayIncome - state.todayExpense;
    
    let status;
    if (todayNet > 0) {
        status = 'positive';
    } else if (todayNet < -50000) {
        status = 'negative';
    } else {
        status = 'neutral';
    }
    
    if (elements.potatoMessage) {
        elements.potatoMessage.textContent = characterMessages.potato[status];
    }
    
    if (elements.rabbitMessage) {
        elements.rabbitMessage.textContent = characterMessages.rabbit[status];
    }
}

/**
 * Animate numbers with count-up effect
 */
function animateNumbers() {
    animateNumber(elements.currentBalance?.querySelector('.amount-number'), state.currentBalance);
    animateNumber(elements.todayIncome?.querySelector('.amount-number'), state.todayIncome);
    animateNumber(elements.todayExpense?.querySelector('.amount-number'), state.todayExpense);
    animateNumber(elements.incomeCount, state.incomeTransactionCount);
    animateNumber(elements.expenseCount, state.expenseTransactionCount);
}

/**
 * Animate individual number with count-up effect
 */
function animateNumber(element, targetValue, duration = 1000) {
    if (!element) return;
    
    const startValue = 0;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
        
        if (typeof targetValue === 'number' && targetValue > 999) {
            element.textContent = currentValue.toLocaleString('ko-KR');
        } else {
            element.textContent = currentValue;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = typeof targetValue === 'number' && targetValue > 999 
                ? targetValue.toLocaleString('ko-KR') 
                : targetValue;
        }
    }
    
    requestAnimationFrame(updateValue);
}

/**
 * Handle character click interactions
 */
function handleCharacterClick(character) {
    const characterElement = character === 'potato' ? elements.potatoCharacter : elements.rabbitCharacter;
    const messageElement = character === 'potato' ? elements.potatoMessage : elements.rabbitMessage;
    
    if (!characterElement || !messageElement) return;
    
    // Play celebration animation
    characterElement.style.animation = 'celebration 0.8s ease-out';
    
    // Show encouraging message
    const encouragingMessages = characterMessages[character].encouraging;
    const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    const originalMessage = messageElement.textContent;
    
    messageElement.textContent = randomMessage;
    
    // Haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    // Restore original message and animation
    setTimeout(() => {
        messageElement.textContent = originalMessage;
        characterElement.style.animation = character === 'potato' ? 'potato-idle 4s ease-in-out infinite' : 'rabbit-idle 3.5s ease-in-out infinite';
    }, 2000);
    
    // Update last interaction time
    state.lastInteractionTime = Date.now();
    
    console.log(`🎉 ${character} 캐릭터 상호작용`);
}

/**
 * Handle summary card clicks
 */
function handleBalanceClick() {
    showToast('현재 잔액: ₩' + state.currentBalance.toLocaleString('ko-KR'), 'success');
    // Navigate to detailed balance view
    console.log('📊 잔액 상세 보기');
}

function handleIncomeClick() {
    showToast(`오늘 수입: +₩${state.todayIncome.toLocaleString('ko-KR')} (${state.incomeTransactionCount}건)`, 'success');
    // Navigate to income transactions
    console.log('📈 수입 내역 보기');
}

function handleExpenseClick() {
    showToast(`오늘 지출: -₩${state.todayExpense.toLocaleString('ko-KR')} (${state.expenseTransactionCount}건)`, 'success');
    // Navigate to expense transactions
    console.log('📉 지출 내역 보기');
}

/**
 * Handle action button clicks
 */
function handleAddIncome() {
    // Show rabbit celebration
    if (elements.rabbitCharacter) {
        elements.rabbitCharacter.style.animation = 'celebration 0.6s ease-out';
        setTimeout(() => {
            elements.rabbitCharacter.style.animation = 'rabbit-idle 3.5s ease-in-out infinite';
        }, 600);
    }
    
    // Navigate to transaction form with income type
    window.location.href = 'transaction-form.html?type=income';
    
    console.log('🐰 수입 추가 버튼 클릭');
}

function handleAddExpense() {
    // Show potato celebration
    if (elements.potatoCharacter) {
        elements.potatoCharacter.style.animation = 'celebration 0.6s ease-out';
        setTimeout(() => {
            elements.potatoCharacter.style.animation = 'potato-idle 4s ease-in-out infinite';
        }, 600);
    }
    
    // Navigate to transaction form with expense type
    window.location.href = 'transaction-form.html?type=expense';
    
    console.log('🥔 지출 추가 버튼 클릭');
}

function handleViewAll() {
    // Navigate to transaction history
    window.location.href = 'transaction-history.html';
    
    console.log('📋 전체 거래 내역 보기');
}

/**
 * Handle transaction item clicks
 */
function handleTransactionClick(event) {
    const transactionItem = event.currentTarget;
    const title = transactionItem.querySelector('.transaction-title')?.textContent;
    const amount = transactionItem.querySelector('.transaction-amount')?.textContent;
    
    showToast(`${title}: ${amount}`, 'success');
    
    // Navigate to transaction detail (if implemented)
    console.log(`🧾 거래 상세: ${title}`);
}

/**
 * Load transactions (simulate API call)
 */
function loadTransactions() {
    // Show loading state
    showLoadingState();
    
    // Simulate API delay
    setTimeout(() => {
        hideLoadingState();
        
        // Check if there are transactions
        const hasTransactions = elements.transactionList?.children.length > 0;
        
        if (hasTransactions) {
            showTransactionList();
        } else {
            showEmptyState();
        }
        
        console.log('📋 거래 내역 로드 완료');
    }, 1200);
}

/**
 * Show loading state for transactions
 */
function showLoadingState() {
    elements.transactionsLoading?.setAttribute('aria-hidden', 'false');
    elements.transactionsLoading?.classList.add('show');
    elements.transactionsEmpty?.setAttribute('aria-hidden', 'true');
    elements.transactionList?.setAttribute('aria-hidden', 'true');
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    elements.transactionsLoading?.setAttribute('aria-hidden', 'true');
    elements.transactionsLoading?.classList.remove('show');
}

/**
 * Show empty state for transactions
 */
function showEmptyState() {
    elements.transactionsEmpty?.setAttribute('aria-hidden', 'false');
    elements.transactionsEmpty?.classList.add('show');
    elements.transactionList?.setAttribute('aria-hidden', 'true');
}

/**
 * Show transaction list
 */
function showTransactionList() {
    elements.transactionList?.setAttribute('aria-hidden', 'false');
    elements.transactionList?.classList.add('show');
    elements.transactionsEmpty?.setAttribute('aria-hidden', 'true');
}

/**
 * Handle settings button
 */
function handleSettings() {
    showToast('설정 페이지는 준비 중입니다', 'success');
    console.log('⚙️ 설정 버튼 클릭');
}

/**
 * Handle navigation clicks
 */
function handleNavigation(event) {
    const navItem = event.currentTarget;
    const href = navItem.getAttribute('href');
    
    // Don't prevent navigation for valid links
    if (href && href !== '#') {
        console.log(`🧭 네비게이션: ${href}`);
        return;
    }
    
    // Handle placeholder navigation items
    event.preventDefault();
    showToast('이 페이지는 준비 중입니다', 'success');
}

/**
 * Show toast message
 */
function showToast(message, type = 'success') {
    const toast = type === 'success' ? elements.successToast : elements.errorToast;
    const messageElement = type === 'success' ? elements.successMessage : elements.errorMessage;
    
    if (!toast || !messageElement) return;
    
    messageElement.textContent = message;
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        closeToast({ currentTarget: toast });
    }, 3000);
}

/**
 * Close toast message
 */
function closeToast(event) {
    const toast = event.currentTarget.closest('.toast') || event.currentTarget;
    if (toast) {
        toast.classList.remove('show');
        toast.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
    // Quick actions with keyboard
    if (event.altKey) {
        switch (event.key) {
            case '1':
                event.preventDefault();
                handleAddIncome();
                break;
            case '2':
                event.preventDefault();
                handleAddExpense();
                break;
            case '3':
                event.preventDefault();
                handleViewAll();
                break;
        }
    }
    
    // Character interactions
    if (event.key === 'p' && event.ctrlKey) {
        event.preventDefault();
        handleCharacterClick('potato');
    }
    
    if (event.key === 'r' && event.ctrlKey) {
        event.preventDefault();
        handleCharacterClick('rabbit');
    }
    
    // Close toasts with Escape
    if (event.key === 'Escape') {
        const visibleToast = document.querySelector('.toast.show');
        if (visibleToast) {
            closeToast({ currentTarget: visibleToast });
        }
    }
}

/**
 * Setup touch gestures for mobile
 */
function setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    // Swipe gestures for character interactions
    [elements.potatoCharacter, elements.rabbitCharacter].forEach(character => {
        if (!character) return;
        
        character.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        character.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // If it's a tap (minimal movement)
            if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                const characterType = character === elements.potatoCharacter ? 'potato' : 'rabbit';
                handleCharacterClick(characterType);
            }
        });
    });
}

/**
 * Start periodic updates
 */
function startPeriodicUpdates() {
    // Update greeting every 30 minutes
    state.greetingInterval = setInterval(() => {
        updateGreeting();
        updateCharacterMessages();
    }, 30 * 60 * 1000);
    
    // Auto-update character messages based on inactivity
    setInterval(() => {
        const timeSinceLastInteraction = Date.now() - state.lastInteractionTime;
        const idleMinutes = timeSinceLastInteraction / (1000 * 60);
        
        if (idleMinutes > 5) {
            // Show idle message
            const characters = ['potato', 'rabbit'];
            const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
            const messageElement = randomCharacter === 'potato' ? elements.potatoMessage : elements.rabbitMessage;
            
            if (messageElement && idleMinutes > 5 && idleMinutes < 6) {
                const originalMessage = messageElement.textContent;
                messageElement.textContent = "잠깐, 어디 가셨나요? 👀";
                
                setTimeout(() => {
                    messageElement.textContent = originalMessage;
                }, 3000);
            }
        }
    }, 60000); // Check every minute
}

/**
 * Setup accessibility features
 */
function setupAccessibility() {
    // Announce important changes to screen readers
    const announceChange = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
    
    // Announce balance updates
    const originalUpdateNumbers = animateNumbers;
    window.animateNumbers = function() {
        originalUpdateNumbers.call(this);
        announceChange(`현재 잔액 ${state.currentBalance.toLocaleString('ko-KR')}원으로 업데이트됨`);
    };
}

/**
 * Handle visibility changes (page focus/blur)
 */
function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
        // Page became visible - update greeting and data
        updateGreeting();
        updateCharacterMessages();
        state.lastInteractionTime = Date.now();
        
        console.log('👁️ 페이지 활성화');
    } else {
        // Page became hidden
        console.log('🫣 페이지 비활성화');
    }
}

/**
 * Handle online status changes
 */
function handleOnline() {
    showToast('인터넷 연결이 복원되었습니다', 'success');
    // Sync data if needed
    console.log('🌐 온라인 상태');
}

function handleOffline() {
    showToast('인터넷 연결이 끊어졌습니다', 'error');
    console.log('📴 오프라인 상태');
}

/**
 * 초기 캐릭터 애니메이션 실행
 */
function playInitialAnimations() {
    if (!animationSystem) return;
    
    // 캐릭터 등장 애니메이션 (스태거드)
    const titleIcons = document.querySelectorAll('.title-icon');
    if (titleIcons.length > 0) {
        setTimeout(() => {
            playStaggeredReaction(titleIcons, 'enter', { stagger: 300 });
        }, 500);
    }
    
    // 요약 카드들 순차 등장
    const summaryCards = document.querySelectorAll('.summary-card');
    if (summaryCards.length > 0) {
        setTimeout(() => {
            summaryCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('stagger-enter');
                }, index * 150);
            });
        }, 1000);
    }
}

/**
 * 캐릭터 클릭 애니메이션 강화
 */
function handleCharacterClick(character) {
    const characterElement = character === 'potato' ? 
        elements.potatoCharacter : elements.rabbitCharacter;
    
    if (!characterElement || !animationSystem) return;
    
    // 랜덤 캐릭터별 애니메이션
    const animations = {
        potato: ['potato-happy', 'success', 'celebration'],
        rabbit: ['rabbit-hop', 'success', 'celebration']
    };
    
    const randomAnimation = animations[character][
        Math.floor(Math.random() * animations[character].length)
    ];
    
    // 캐릭터 아이콘 찾기
    const iconElement = characterElement.querySelector('.icon') || 
                       characterElement.querySelector('[class*="icon"]');
    
    if (iconElement) {
        playReaction(randomAnimation, iconElement, {
            character: character,
            enableSound: true,
            onComplete: () => {
                // 메시지 업데이트
                updateCharacterMessages();
                
                // 격려 메시지 표시
                const encouragingMessages = characterMessages[character].encouraging;
                const randomMessage = encouragingMessages[
                    Math.floor(Math.random() * encouragingMessages.length)
                ];
                showToast(randomMessage, 'success');
            }
        });
    }
    
    state.lastInteractionTime = Date.now();
}

/**
 * 거래 추가 버튼 애니메이션 강화
 */
function handleAddIncome() {
    const button = elements.addIncomeBtn;
    const icon = button?.querySelector('.character-icon');
    
    if (icon && animationSystem) {
        // 성공 애니메이션과 표정 변경
        playReaction('transaction-success', icon, {
            character: 'rabbit',
            enableSound: true,
            onComplete: () => {
                // 토끼를 기쁜 표정으로 변경
                changeCharacterExpression(icon, 'rabbit-success', { smooth: true });
                showToast('수입이 추가되었습니다! 🎉', 'success');
            }
        });
    }
    
    // 원래 로직 유지
    showToast('수입 추가 페이지로 이동합니다', 'success');
    setTimeout(() => {
        window.location.href = 'transaction-form.html?type=income';
    }, 1000);
}

function handleAddExpense() {
    const button = elements.addExpenseBtn;
    const icon = button?.querySelector('.character-icon');
    
    if (icon && animationSystem) {
        // 경고 애니메이션
        playReaction('warning', icon, {
            character: 'potato',
            enableSound: true,
            onComplete: () => {
                // 감자를 주의 표정으로 변경
                changeCharacterExpression(icon, 'potato-warning', { smooth: true });
                showToast('지출을 신중하게 추가해보세요 💰', 'success');
            }
        });
    }
    
    showToast('지출 추가 페이지로 이동합니다', 'success');
    setTimeout(() => {
        window.location.href = 'transaction-form.html?type=expense';
    }, 1000);
}

/**
 * 거래 항목 클릭 애니메이션
 */
function handleTransactionClick(event) {
    const item = event.currentTarget;
    const isIncome = item.classList.contains('income');
    const icon = item.querySelector('.icon-character .icon') || 
                item.querySelector('.icon');
    
    if (icon && animationSystem) {
        const animationType = isIncome ? 'success' : 'info';
        playReaction(animationType, icon, {
            character: 'auto',
            onComplete: () => {
                // 항목 상세 정보 표시 (예시)
                const title = item.querySelector('.transaction-title')?.textContent;
                const amount = item.querySelector('.amount-value')?.textContent;
                showToast(`${title}: ${amount}원`, 'success');
            }
        });
    }
    
    // 리플 효과
    createRippleEffect(event);
    
    // 접근성 알림
    const title = item.querySelector('.transaction-title')?.textContent;
    const category = item.querySelector('.transaction-category')?.textContent;
    const amount = item.querySelector('.amount-value')?.textContent;
    
    announceChange(`선택됨: ${title}, ${category}, ${amount}원`);
}

/**
 * 토스트 메시지 애니메이션 강화
 */
function showToast(message, type = 'success') {
    const toast = type === 'success' ? elements.successToast : elements.errorToast;
    const messageElement = type === 'success' ? elements.successMessage : elements.errorMessage;
    const iconElement = toast?.querySelector('.toast-icon .icon');
    
    if (!toast || !messageElement) return;
    
    messageElement.textContent = message;
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');
    
    // 토스트 아이콘 애니메이션
    if (iconElement && animationSystem) {
        playReaction(type, iconElement, {
            character: type === 'success' ? 'rabbit' : 'potato',
            onComplete: () => {
                // 애니메이션 완료 후 부드럽게 원래 표정으로
                setTimeout(() => {
                    const neutralIcon = type === 'success' ? 'rabbit-neutral' : 'potato-neutral';
                    changeCharacterExpression(iconElement, neutralIcon, { smooth: true });
                }, 1500);
            }
        });
    }
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        toast.setAttribute('aria-hidden', 'true');
    }, 3000);
}

/**
 * 리플 효과 생성 (버튼 클릭시)
 */
function createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation var(--dur-md) ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    if (button.style.position !== 'absolute' && button.style.position !== 'relative') {
        button.style.position = 'relative';
    }
    button.style.overflow = 'hidden';
    
    button.appendChild(ripple);
    
    // 애니메이션 후 제거
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

/**
 * 주기적 캐릭터 애니메이션 (idle 상태)
 */
function startPeriodicAnimations() {
    // 5초마다 랜덤 캐릭터가 자연스러운 애니메이션
    setInterval(() => {
        if (Date.now() - state.lastInteractionTime > 30000) { // 30초 비활성화 시
            const characters = document.querySelectorAll('.character-icon .icon');
            if (characters.length > 0 && animationSystem) {
                const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
                const animations = ['react-potato-idle', 'react-rabbit-alert'];
                const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
                
                // 부드러운 idle 애니메이션
                randomCharacter.classList.add(randomAnimation);
                setTimeout(() => {
                    randomCharacter.classList.remove(randomAnimation);
                }, 3000);
            }
        }
    }, 15000);
}

/**
 * 성능 모니터링 및 최적화
 */
function monitorAnimationPerformance() {
    if (animationSystem && typeof animationSystem.getPerformanceMetrics === 'function') {
        const metrics = animationSystem.getPerformanceMetrics();
        
        if (metrics.activeAnimations > 10) {
            console.warn('⚠️ 너무 많은 활성 애니메이션:', metrics.activeAnimations);
            // 일부 애니메이션 비활성화 또는 정리
        }
        
        // 메모리 사용량 모니터링
        if (metrics.memoryUsage && metrics.memoryUsage.used > 100) {
            console.warn('⚠️ 높은 메모리 사용량:', metrics.memoryUsage.used + 'MB');
        }
    }
}

/**
 * Cleanup function
 */
function cleanup() {
    if (state.greetingInterval) {
        clearInterval(state.greetingInterval);
    }
    
    // 애니메이션 시스템 정리
    if (animationSystem && typeof animationSystem.destroy === 'function') {
        animationSystem.destroy();
    }
    
    console.log('🧹 정리 완료');
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        state,
        handleCharacterClick,
        showToast,
        updateGreeting
    };
}

console.log('🥔🐰 감자토끼 홈 대시보드 JavaScript 로드 완료!');