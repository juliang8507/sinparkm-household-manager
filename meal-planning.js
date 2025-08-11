/**
 * 감자토끼 식단 계획 페이지 JavaScript
 * Mobile-First Interactive Features
 */

// DOM Elements
const elements = {
    // Navigation
    backButton: document.querySelector('.back-button'),
    prevWeekBtn: document.getElementById('prevWeekBtn'),
    nextWeekBtn: document.getElementById('nextWeekBtn'),
    currentWeek: document.getElementById('currentWeek'),
    
    // Character Dashboard
    potatoEmoji: document.getElementById('potatoEmoji'),
    rabbitEmoji: document.getElementById('rabbitEmoji'),
    potatoMessage: document.getElementById('potatoMessage'),
    rabbitMessage: document.getElementById('rabbitMessage'),
    progressFill: document.getElementById('progressFill'),
    progressPercentage: document.getElementById('progressPercentage'),
    progressText: document.getElementById('progressText'),
    
    // States
    loadingState: document.getElementById('loadingState'),
    emptyWeekState: document.getElementById('emptyWeekState'),
    weekGrid: document.getElementById('weekGrid'),
    startPlanningBtn: document.getElementById('startPlanningBtn'),
    
    // Recipe Modal
    recipeModal: document.getElementById('recipeModal'),
    recipeForm: document.getElementById('recipeForm'),
    modalTitle: document.getElementById('modalTitle'),
    modalClose: document.querySelector('.modal-close'),
    cancelRecipeBtn: document.getElementById('cancelRecipeBtn'),
    saveRecipeBtn: document.getElementById('saveRecipeBtn'),
    
    // Form inputs
    recipeName: document.getElementById('recipeName'),
    recipeDescription: document.getElementById('recipeDescription'),
    recipeCounter: document.getElementById('recipeCounter'),
    
    // Buttons
    mealTypeButtons: document.querySelectorAll('.meal-type-button'),
    styleButtons: document.querySelectorAll('.style-button'),
    
    // Meal elements
    addMealBtns: document.querySelectorAll('.add-meal-btn'),
    mealCheckboxes: document.querySelectorAll('.meal-checkbox'),
    
    // Toasts
    successToast: document.getElementById('successToast'),
    errorToast: document.getElementById('errorToast'),
    successToastMessage: document.getElementById('successToastMessage'),
    errorToastMessage: document.getElementById('errorToastMessage'),
    
    // FAB
    fabButton: document.getElementById('fabButton')
};

// Application State
const state = {
    currentWeekStart: new Date(),
    selectedDay: null,
    selectedMealType: null,
    selectedStyle: null,
    mealData: {},
    weeklyProgress: 0,
    isLoading: false,
    modalOpen: false
};

// Character Messages
const characterMessages = {
    potato: {
        empty: '든든한 식사를 기다리고 있어요!',
        planning: '맛있는 식단을 계획해보세요!',
        progress: '좋은 계획이네요! 더 추가해볼까요?',
        complete: '든든한 한 주 식단이 완성됐어요! 🥔',
        encouraging: ['화이팅! 🥔', '든든하게 드세요!', '맛있게 드실 거예요!']
    },
    rabbit: {
        empty: '건강한 식사를 계획해보세요!',
        planning: '영양 균형을 맞춰보세요!',
        progress: '건강한 선택이에요! 계속해보세요!',
        complete: '완벽한 건강 식단이에요! 🐰',
        encouraging: ['건강하게! 🐰', '영양 만점이에요!', '몸에 좋은 선택이네요!']
    }
};

// Week days in Korean
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
const weekDaysKorean = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

/**
 * Initialize the application
 */
function init() {
    console.log('🥔🐰 감자토끼 식단 계획 페이지 초기화');
    
    setupEventListeners();
    initializeWeek();
    loadMealData();
    setupCharacterInteractions();
    updateWeekDisplay();
    
    console.log('✅ 초기화 완료');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Navigation
    elements.backButton?.addEventListener('click', handleBack);
    elements.prevWeekBtn.addEventListener('click', () => navigateWeek(-1));
    elements.nextWeekBtn.addEventListener('click', () => navigateWeek(1));
    
    // Start planning button
    elements.startPlanningBtn.addEventListener('click', handleStartPlanning);
    
    // Add meal buttons
    elements.addMealBtns.forEach(btn => {
        btn.addEventListener('click', handleAddMeal);
    });
    
    // Meal checkboxes
    elements.mealCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleMealComplete);
    });
    
    // Modal controls
    elements.modalClose?.addEventListener('click', closeRecipeModal);
    elements.cancelRecipeBtn?.addEventListener('click', closeRecipeModal);
    elements.saveRecipeBtn?.addEventListener('click', handleSaveRecipe);
    elements.fabButton?.addEventListener('click', openRecipeModal);
    
    // Form controls
    elements.mealTypeButtons.forEach(btn => {
        btn.addEventListener('click', handleMealTypeSelection);
    });
    
    elements.styleButtons.forEach(btn => {
        btn.addEventListener('click', handleStyleSelection);
    });
    
    // Form inputs
    elements.recipeDescription?.addEventListener('input', updateCharacterCounter);
    elements.recipeForm?.addEventListener('submit', handleFormSubmit);
    
    // Toast close buttons
    document.querySelectorAll('.toast-close').forEach(btn => {
        btn.addEventListener('click', closeToast);
    });
    
    // Character interactions
    elements.potatoEmoji?.addEventListener('click', () => showCharacterReaction('potato'));
    elements.rabbitEmoji?.addEventListener('click', () => showCharacterReaction('rabbit'));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Modal overlay click
    elements.recipeModal?.addEventListener('click', handleModalOverlayClick);
}

/**
 * Initialize current week
 */
function initializeWeek() {
    const today = new Date();
    // Get Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    state.currentWeekStart = monday;
}

/**
 * Navigate to different week
 */
function navigateWeek(direction) {
    const newDate = new Date(state.currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    state.currentWeekStart = newDate;
    
    updateWeekDisplay();
    loadMealData();
    
    // Add animation
    elements.currentWeek.style.animation = 'none';
    setTimeout(() => {
        elements.currentWeek.style.animation = 'fadeInBubble 0.3s ease-out';
    }, 50);
}

/**
 * Update week display
 */
function updateWeekDisplay() {
    const startDate = new Date(state.currentWeekStart);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    
    const weekText = startMonth === endMonth 
        ? `${startMonth}월 ${startDay}일 ~ ${endDay}일`
        : `${startMonth}월 ${startDay}일 ~ ${endMonth}월 ${endDay}일`;
    
    elements.currentWeek.textContent = weekText;
    
    // Update day cards dates
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach((card, index) => {
        const cardDate = new Date(startDate);
        cardDate.setDate(startDate.getDate() + index);
        const dateElement = card.querySelector('.day-date');
        if (dateElement) {
            dateElement.textContent = `${cardDate.getDate()}일`;
        }
    });
}

/**
 * Load meal data for current week
 */
function loadMealData() {
    showLoadingState();
    
    // Simulate API call
    setTimeout(() => {
        // For demo, check if there's any meal data
        const hasMeals = Object.keys(state.mealData).length > 0;
        
        hideLoadingState();
        
        if (hasMeals) {
            showWeekGrid();
            updateProgressDisplay();
        } else {
            showEmptyState();
        }
        
        updateCharacterMessages();
    }, 800);
}

/**
 * Handle start planning button
 */
function handleStartPlanning() {
    hideEmptyState();
    showWeekGrid();
    
    // Focus first add meal button
    const firstAddBtn = elements.addMealBtns[0];
    if (firstAddBtn) {
        firstAddBtn.focus();
    }
    
    updateCharacterMessages('planning');
}

/**
 * Handle add meal button click
 */
function handleAddMeal(event) {
    const btn = event.currentTarget;
    const mealCard = btn.closest('.meal-card');
    const dayCard = btn.closest('.day-card');
    
    if (mealCard && dayCard) {
        state.selectedDay = dayCard.dataset.day;
        state.selectedMealType = mealCard.dataset.meal;
        
        openRecipeModal();
    }
}

/**
 * Handle meal completion checkbox
 */
function handleMealComplete(event) {
    const checkbox = event.currentTarget;
    const mealCard = checkbox.closest('.meal-card');
    const dayCard = checkbox.closest('.day-card');
    
    if (mealCard && dayCard) {
        const day = dayCard.dataset.day;
        const meal = mealCard.dataset.meal;
        const isCompleted = checkbox.checked;
        
        // Update meal card styling
        mealCard.classList.toggle('completed', isCompleted);
        
        // Store completion state
        const mealKey = `${day}-${meal}`;
        if (state.mealData[mealKey]) {
            state.mealData[mealKey].completed = isCompleted;
        }
        
        // Update progress
        updateProgressDisplay();
        updateCharacterMessages();
        
        // Show toast
        const message = isCompleted 
            ? `${getMealTypeText(meal)} 식사를 완료했어요! 🎉`
            : `${getMealTypeText(meal)} 식사 완료를 취소했어요`;
        
        showSuccessToast(message);
        
        // Character reaction
        if (isCompleted) {
            showCharacterReaction(Math.random() > 0.5 ? 'potato' : 'rabbit');
        }
    }
}

/**
 * Open recipe modal
 */
function openRecipeModal() {
    state.modalOpen = true;
    elements.recipeModal.classList.add('show');
    elements.recipeModal.setAttribute('aria-hidden', 'false');
    
    // Reset form
    resetRecipeForm();
    
    // Update modal title
    if (state.selectedDay && state.selectedMealType) {
        const dayText = getDayText(state.selectedDay);
        const mealText = getMealTypeText(state.selectedMealType);
        elements.modalTitle.textContent = `${dayText} ${mealText} 추가`;
        
        // Pre-select meal type
        selectMealType(state.selectedMealType);
    } else {
        elements.modalTitle.textContent = '새 식사 추가';
    }
    
    // Focus first input
    setTimeout(() => {
        elements.recipeName?.focus();
    }, 300);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Close recipe modal
 */
function closeRecipeModal() {
    state.modalOpen = false;
    elements.recipeModal.classList.remove('show');
    elements.recipeModal.setAttribute('aria-hidden', 'true');
    
    // Reset state
    state.selectedDay = null;
    state.selectedMealType = null;
    state.selectedStyle = null;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Reset form
    resetRecipeForm();
}

/**
 * Handle modal overlay click
 */
function handleModalOverlayClick(event) {
    if (event.target === elements.recipeModal) {
        closeRecipeModal();
    }
}

/**
 * Handle meal type selection
 */
function handleMealTypeSelection(event) {
    const btn = event.currentTarget;
    const mealType = btn.dataset.type;
    
    selectMealType(mealType);
}

/**
 * Select meal type
 */
function selectMealType(mealType) {
    elements.mealTypeButtons.forEach(btn => {
        const isSelected = btn.dataset.type === mealType;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-pressed', isSelected.toString());
    });
    
    state.selectedMealType = mealType;
}

/**
 * Handle style selection
 */
function handleStyleSelection(event) {
    const btn = event.currentTarget;
    const style = btn.dataset.style;
    
    elements.styleButtons.forEach(button => {
        const isSelected = button.dataset.style === style;
        button.classList.toggle('active', isSelected);
        button.setAttribute('aria-pressed', isSelected.toString());
    });
    
    state.selectedStyle = style;
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();
    handleSaveRecipe();
}

/**
 * Handle save recipe
 */
function handleSaveRecipe() {
    const recipeName = elements.recipeName?.value.trim();
    
    if (!recipeName) {
        showErrorToast('음식 이름을 입력해주세요');
        elements.recipeName?.focus();
        return;
    }
    
    if (!state.selectedMealType) {
        showErrorToast('식사 시간을 선택해주세요');
        return;
    }
    
    // Create meal data
    const mealData = {
        id: Date.now(),
        name: recipeName,
        description: elements.recipeDescription?.value.trim() || '',
        mealType: state.selectedMealType,
        style: state.selectedStyle || 'balanced',
        day: state.selectedDay,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Save meal
    saveMeal(mealData);
    
    // Close modal
    closeRecipeModal();
    
    // Show success
    showSuccessToast('식사가 추가되었습니다! 🎉');
    
    // Update display
    setTimeout(() => {
        hideEmptyState();
        showWeekGrid();
        updateProgressDisplay();
        updateCharacterMessages('progress');
    }, 500);
}

/**
 * Save meal data
 */
function saveMeal(mealData) {
    const mealKey = `${mealData.day}-${mealData.mealType}`;
    state.mealData[mealKey] = mealData;
    
    // Update UI
    updateMealCard(mealData);
    
    console.log('🍽️ 식사 저장됨:', mealData);
}

/**
 * Update meal card with data
 */
function updateMealCard(mealData) {
    const dayCard = document.querySelector(`[data-day="${mealData.day}"]`);
    const mealCard = dayCard?.querySelector(`[data-meal="${mealData.mealType}"]`);
    
    if (mealCard) {
        const mealContent = mealCard.querySelector('.meal-content');
        const addBtn = mealCard.querySelector('.add-meal-btn');
        
        if (mealContent && addBtn) {
            // Replace add button with meal info
            mealContent.classList.remove('empty');
            mealContent.innerHTML = `
                <div class="meal-info">
                    <div class="meal-name">${mealData.name}</div>
                    ${mealData.description ? `<div class="meal-description">${mealData.description}</div>` : ''}
                    <div class="meal-style">
                        ${getStyleIcon(mealData.style)} ${getStyleText(mealData.style)}
                    </div>
                </div>
                <button class="edit-meal-btn" aria-label="식사 수정">
                    <span class="edit-icon">✏️</span>
                </button>
            `;
            
            // Add edit functionality
            const editBtn = mealContent.querySelector('.edit-meal-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => editMeal(mealData));
            }
        }
    }
}

/**
 * Edit existing meal
 */
function editMeal(mealData) {
    state.selectedDay = mealData.day;
    state.selectedMealType = mealData.mealType;
    state.selectedStyle = mealData.style;
    
    // Pre-fill form
    if (elements.recipeName) elements.recipeName.value = mealData.name;
    if (elements.recipeDescription) elements.recipeDescription.value = mealData.description || '';
    
    openRecipeModal();
    
    // Update character counter
    updateCharacterCounter();
}

/**
 * Update character counter
 */
function updateCharacterCounter() {
    if (elements.recipeDescription && elements.recipeCounter) {
        const length = elements.recipeDescription.value.length;
        elements.recipeCounter.textContent = `${length}/200`;
    }
}

/**
 * Reset recipe form
 */
function resetRecipeForm() {
    if (elements.recipeForm) {
        elements.recipeForm.reset();
    }
    
    // Reset button states
    elements.mealTypeButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    elements.styleButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    // Reset counter
    if (elements.recipeCounter) {
        elements.recipeCounter.textContent = '0/200';
    }
}

/**
 * Update progress display
 */
function updateProgressDisplay() {
    const totalMeals = 21; // 7 days * 3 meals
    const completedMeals = Object.values(state.mealData).filter(meal => meal.completed).length;
    const plannedMeals = Object.keys(state.mealData).length;
    
    const progress = Math.round((completedMeals / totalMeals) * 100);
    const planningProgress = Math.round((plannedMeals / totalMeals) * 100);
    
    state.weeklyProgress = progress;
    
    // Update progress bar
    if (elements.progressFill) {
        elements.progressFill.style.width = `${planningProgress}%`;
    }
    
    // Update progress text
    if (elements.progressPercentage) {
        elements.progressPercentage.textContent = `${progress}%`;
    }
    
    if (elements.progressText) {
        elements.progressText.textContent = `주간 식단 완료률 (${completedMeals}/${totalMeals})`;
    }
}

/**
 * Update character messages based on state
 */
function updateCharacterMessages(context = null) {
    const plannedCount = Object.keys(state.mealData).length;
    const completedCount = Object.values(state.mealData).filter(meal => meal.completed).length;
    
    let potatoMessage, rabbitMessage;
    
    if (context === 'planning') {
        potatoMessage = characterMessages.potato.planning;
        rabbitMessage = characterMessages.rabbit.planning;
    } else if (plannedCount === 0) {
        potatoMessage = characterMessages.potato.empty;
        rabbitMessage = characterMessages.rabbit.empty;
    } else if (completedCount >= 15) {
        potatoMessage = characterMessages.potato.complete;
        rabbitMessage = characterMessages.rabbit.complete;
    } else {
        potatoMessage = characterMessages.potato.progress;
        rabbitMessage = characterMessages.rabbit.progress;
    }
    
    if (elements.potatoMessage) elements.potatoMessage.textContent = potatoMessage;
    if (elements.rabbitMessage) elements.rabbitMessage.textContent = rabbitMessage;
}

/**
 * Show character reaction
 */
function showCharacterReaction(character) {
    const messages = characterMessages[character].encouraging;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const emojiElement = character === 'potato' ? elements.potatoEmoji : elements.rabbitEmoji;
    const messageElement = character === 'potato' ? elements.potatoMessage : elements.rabbitMessage;
    
    if (emojiElement && messageElement) {
        const originalMessage = messageElement.textContent;
        
        // Show encouraging message
        messageElement.textContent = randomMessage;
        
        // Add bounce animation
        emojiElement.style.animation = 'gentle-float 0.5s ease-out';
        
        // Restore original message
        setTimeout(() => {
            messageElement.textContent = originalMessage;
            emojiElement.style.animation = '';
        }, 2000);
    }
}

/**
 * Setup character interactions
 */
function setupCharacterInteractions() {
    // Add hover effects
    if (elements.potatoEmoji) {
        elements.potatoEmoji.addEventListener('mouseenter', () => {
            elements.potatoEmoji.style.transform = 'scale(1.1)';
        });
        
        elements.potatoEmoji.addEventListener('mouseleave', () => {
            elements.potatoEmoji.style.transform = '';
        });
    }
    
    if (elements.rabbitEmoji) {
        elements.rabbitEmoji.addEventListener('mouseenter', () => {
            elements.rabbitEmoji.style.transform = 'scale(1.1)';
        });
        
        elements.rabbitEmoji.addEventListener('mouseleave', () => {
            elements.rabbitEmoji.style.transform = '';
        });
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    state.isLoading = true;
    elements.loadingState?.setAttribute('aria-hidden', 'false');
    elements.loadingState?.classList.add('show');
    elements.emptyWeekState?.setAttribute('aria-hidden', 'true');
    elements.weekGrid?.setAttribute('aria-hidden', 'true');
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    state.isLoading = false;
    elements.loadingState?.setAttribute('aria-hidden', 'true');
    elements.loadingState?.classList.remove('show');
}

/**
 * Show empty state
 */
function showEmptyState() {
    elements.emptyWeekState?.setAttribute('aria-hidden', 'false');
    elements.emptyWeekState?.classList.add('show');
    elements.weekGrid?.setAttribute('aria-hidden', 'true');
    elements.weekGrid?.classList.remove('show');
}

/**
 * Hide empty state
 */
function hideEmptyState() {
    elements.emptyWeekState?.setAttribute('aria-hidden', 'true');
    elements.emptyWeekState?.classList.remove('show');
}

/**
 * Show week grid
 */
function showWeekGrid() {
    elements.weekGrid?.setAttribute('aria-hidden', 'false');
    elements.weekGrid?.classList.add('show');
    elements.emptyWeekState?.setAttribute('aria-hidden', 'true');
}

/**
 * Show success toast
 */
function showSuccessToast(message) {
    if (elements.successToastMessage) {
        elements.successToastMessage.textContent = message;
    }
    
    elements.successToast?.classList.add('show');
    elements.successToast?.setAttribute('aria-hidden', 'false');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        closeToast(elements.successToast);
    }, 3000);
}

/**
 * Show error toast
 */
function showErrorToast(message) {
    if (elements.errorToastMessage) {
        elements.errorToastMessage.textContent = message;
    }
    
    elements.errorToast?.classList.add('show');
    elements.errorToast?.setAttribute('aria-hidden', 'false');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        closeToast(elements.errorToast);
    }, 5000);
}

/**
 * Close toast
 */
function closeToast(toast) {
    if (toast) {
        toast.classList.remove('show');
        toast.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
    // ESC to close modal
    if (event.key === 'Escape' && state.modalOpen) {
        closeRecipeModal();
    }
    
    // Ctrl/Cmd + Enter to save in modal
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && state.modalOpen) {
        event.preventDefault();
        handleSaveRecipe();
    }
    
    // Arrow keys for week navigation (when not in modal)
    if (!state.modalOpen) {
        if (event.key === 'ArrowLeft') {
            navigateWeek(-1);
        } else if (event.key === 'ArrowRight') {
            navigateWeek(1);
        }
    }
}

/**
 * Handle back button
 */
function handleBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'transaction-history.html';
    }
}

/**
 * Utility functions
 */
function getDayText(day) {
    const dayMap = {
        'monday': '월요일',
        'tuesday': '화요일',
        'wednesday': '수요일',
        'thursday': '목요일',
        'friday': '금요일',
        'saturday': '토요일',
        'sunday': '일요일'
    };
    return dayMap[day] || day;
}

function getMealTypeText(meal) {
    const mealMap = {
        'breakfast': '아침',
        'lunch': '점심',
        'dinner': '저녁'
    };
    return mealMap[meal] || meal;
}

function getStyleText(style) {
    const styleMap = {
        'hearty': '든든함',
        'healthy': '건강함',
        'balanced': '균형잡힘'
    };
    return styleMap[style] || style;
}

function getStyleIcon(style) {
    const iconMap = {
        'hearty': '🥔',
        'healthy': '🐰',
        'balanced': '🥔🐰'
    };
    return iconMap[style] || '🥔🐰';
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        state,
        navigateWeek,
        saveMeal,
        updateProgressDisplay
    };
}

console.log('🥔🐰 감자토끼 식단 계획 JavaScript 로드 완료!');