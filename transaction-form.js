/**
 * 감자토끼 거래 등록 페이지 JavaScript
 * Mobile-First Interactive Features
 */

// DOM Elements
const elements = {
    // Form elements
    transactionForm: document.getElementById('transactionForm'),
    characterElement: document.getElementById('formCharacter'),
    speechBubble: document.getElementById('speechBubble'),
    
    // Header user toggle
    userToggleButtons: document.querySelectorAll('.user-toggle .toggle-button'),
    
    // Transaction type toggle
    transactionTypeButtons: document.querySelectorAll('.toggle-option'),
    amountUnderline: document.querySelector('.amount-underline'),
    
    // Form inputs
    amountInput: document.getElementById('amountInput'),
    dateInput: document.getElementById('dateInput'),
    descriptionInput: document.getElementById('descriptionInput'),
    descriptionCounter: document.getElementById('descriptionCounter'),
    
    // Category buttons
    categoryItems: document.querySelectorAll('.category-item'),
    expenseCategories: document.querySelector('.expense-categories'),
    incomeCategories: document.querySelector('.income-categories'),
    
    // Action buttons
    saveButton: document.getElementById('saveButton'),
    cancelButton: document.getElementById('cancelButton'),
    
    // Modal and overlays
    successModal: document.getElementById('successModal'),
    errorToast: document.getElementById('errorToast'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    continueButton: document.getElementById('continueButton'),
    viewButton: document.getElementById('viewButton'),
    
    // Error messages
    amountError: document.getElementById('amountError'),
    categoryError: document.getElementById('categoryError'),
    dateError: document.getElementById('dateError')
};

// Application State
const state = {
    currentUser: 'husband',
    transactionType: 'expense',
    selectedCategory: null,
    isLoading: false,
    validationErrors: {}
};

// Character messages for different states
const characterMessages = {
    neutral: "어떤 거래를 추가할까요?",
    expense: "지출을 기록해보세요! 🥔",
    income: "수입을 기록해보세요! 🐰",
    amountFocus: "금액을 입력해주세요",
    categorySelect: "카테고리를 선택해주세요",
    dateSelect: "날짜를 선택해주세요",
    ready: "모든 정보가 준비됐어요!",
    saving: "저장하고 있어요...",
    error: "앗! 다시 확인해주세요",
    success: "성공적으로 저장했어요! 🎉"
};

/**
 * Initialize the application
 */
function init() {
    console.log('🥔🐰 감자토끼 거래 등록 페이지 초기화');
    
    setupEventListeners();
    setupInitialState();
    setupFormValidation();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    elements.dateInput.value = today;
    
    // Add character interaction
    addCharacterInteraction();
    
    console.log('✅ 초기화 완료');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // User toggle buttons (husband/wife)
    elements.userToggleButtons.forEach(button => {
        button.addEventListener('click', handleUserToggle);
    });
    
    // Transaction type buttons (income/expense)
    elements.transactionTypeButtons.forEach(button => {
        button.addEventListener('click', handleTransactionTypeToggle);
    });
    
    // Amount input
    elements.amountInput.addEventListener('input', handleAmountInput);
    elements.amountInput.addEventListener('focus', handleAmountFocus);
    elements.amountInput.addEventListener('blur', handleAmountBlur);
    
    // Category selection
    elements.categoryItems.forEach(item => {
        item.addEventListener('click', handleCategorySelection);
    });
    
    // Date input
    elements.dateInput.addEventListener('change', handleDateChange);
    
    // Description input
    elements.descriptionInput.addEventListener('input', handleDescriptionInput);
    
    // Form submission
    elements.transactionForm.addEventListener('submit', handleFormSubmit);
    
    // Action buttons
    elements.saveButton.addEventListener('click', handleSaveClick);
    elements.cancelButton.addEventListener('click', handleCancel);
    
    // Modal buttons
    elements.continueButton.addEventListener('click', handleContinue);
    elements.viewButton.addEventListener('click', handleViewTransactions);
    
    // Toast close button
    const toastClose = elements.errorToast.querySelector('.toast-close');
    if (toastClose) {
        toastClose.addEventListener('click', hideErrorToast);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Back button
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', handleBack);
    }
}

/**
 * Setup initial state
 */
function setupInitialState() {
    // Set initial user
    updateUserToggle(state.currentUser);
    
    // Set initial transaction type
    updateTransactionType(state.transactionType);
    
    // Update character
    updateCharacter('neutral');
    
    // Show expense categories by default
    showCategoriesByType('expense');
}

/**
 * Handle user toggle (husband/wife)
 */
function handleUserToggle(event) {
    const button = event.currentTarget;
    const user = button.dataset.user;
    
    if (user === state.currentUser) return;
    
    state.currentUser = user;
    updateUserToggle(user);
    
    // Add haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log(`👤 사용자 변경: ${user}`);
}

/**
 * Update user toggle buttons
 */
function updateUserToggle(user) {
    elements.userToggleButtons.forEach(button => {
        const isActive = button.dataset.user === user;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive.toString());
    });
}

/**
 * Handle transaction type toggle (income/expense)
 */
function handleTransactionTypeToggle(event) {
    const button = event.currentTarget;
    const type = button.dataset.type;
    
    if (type === state.transactionType) return;
    
    state.transactionType = type;
    state.selectedCategory = null; // Reset category selection
    
    updateTransactionType(type);
    updateCharacter(type);
    showCategoriesByType(type);
    clearCategorySelection();
    
    console.log(`💰 거래 유형 변경: ${type}`);
}

/**
 * Update transaction type buttons and styling
 */
function updateTransactionType(type) {
    elements.transactionTypeButtons.forEach(button => {
        const isActive = button.dataset.type === type;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive.toString());
    });
    
    // Update amount underline color
    elements.amountUnderline.className = `amount-underline ${type}`;
    
    // Update character emoji
    const characterEmoji = type === 'expense' ? '🥔' : '🐰';
    elements.characterElement.textContent = characterEmoji;
    elements.characterElement.className = `character ${type}`;
}

/**
 * Show categories by transaction type
 */
function showCategoriesByType(type) {
    if (type === 'expense') {
        elements.expenseCategories.style.display = 'grid';
        elements.incomeCategories.style.display = 'none';
    } else {
        elements.expenseCategories.style.display = 'none';
        elements.incomeCategories.style.display = 'grid';
    }
}

/**
 * Clear category selection
 */
function clearCategorySelection() {
    elements.categoryItems.forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-pressed', 'false');
    });
}

/**
 * Handle amount input
 */
function handleAmountInput(event) {
    const value = event.target.value;
    
    // Format number with commas for better readability
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue) {
        const formatted = Number(numericValue).toLocaleString('ko-KR');
        // Only update if different to avoid cursor jumping
        if (event.target.value !== formatted) {
            event.target.value = formatted;
        }
    }
    
    // Clear amount error
    clearFieldError('amount');
    
    // Update character based on amount
    if (numericValue) {
        updateCharacter('categorySelect');
    }
}

/**
 * Handle amount focus
 */
function handleAmountFocus() {
    elements.amountUnderline.classList.add('focused');
    updateCharacter('amountFocus');
}

/**
 * Handle amount blur
 */
function handleAmountBlur() {
    elements.amountUnderline.classList.remove('focused');
}

/**
 * Handle category selection
 */
function handleCategorySelection(event) {
    const item = event.currentTarget;
    const category = item.dataset.category;
    
    // Remove active class from all categories
    clearCategorySelection();
    
    // Add active class to selected category
    item.classList.add('active');
    item.setAttribute('aria-pressed', 'true');
    
    state.selectedCategory = category;
    
    // Clear category error
    clearFieldError('category');
    
    // Update character
    updateCharacter('dateSelect');
    
    // Add animation to character
    elements.characterElement.classList.add('happy');
    setTimeout(() => {
        elements.characterElement.classList.remove('happy');
    }, 1000);
    
    console.log(`🏷️ 카테고리 선택: ${category}`);
}

/**
 * Handle date change
 */
function handleDateChange(event) {
    clearFieldError('date');
    updateCharacter('ready');
}

/**
 * Handle description input
 */
function handleDescriptionInput(event) {
    const value = event.target.value;
    const maxLength = 200;
    const remaining = maxLength - value.length;
    
    elements.descriptionCounter.textContent = `${value.length}/${maxLength}`;
    
    // Update character when description is added
    if (value.length > 0) {
        updateCharacter('ready');
    }
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();
    handleSaveClick();
}

/**
 * Handle save button click
 */
async function handleSaveClick() {
    if (state.isLoading) return;
    
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
        updateCharacter('error');
        return;
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Show loading state
    showLoadingState();
    updateCharacter('saving');
    
    try {
        // Simulate API call
        await saveTransaction(formData);
        
        // Show success modal
        hideLoadingState();
        showSuccessModal();
        updateCharacter('success');
        
    } catch (error) {
        console.error('거래 저장 실패:', error);
        hideLoadingState();
        showErrorToast('거래 저장에 실패했습니다. 다시 시도해주세요.');
        updateCharacter('error');
    }
}

/**
 * Validate form data
 */
function validateForm() {
    let isValid = true;
    state.validationErrors = {};
    
    // Validate amount
    const amount = elements.amountInput.value.replace(/[^\d]/g, '');
    if (!amount || parseInt(amount) <= 0) {
        showFieldError('amount', '올바른 금액을 입력해주세요');
        isValid = false;
    }
    
    // Validate category
    if (!state.selectedCategory) {
        showFieldError('category', '카테고리를 선택해주세요');
        isValid = false;
    }
    
    // Validate date
    if (!elements.dateInput.value) {
        showFieldError('date', '날짜를 선택해주세요');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    const errorElement = elements[`${field}Error`];
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    // Add error class to field wrapper
    const fieldWrapper = elements[`${field}Input`]?.closest('.form-field') || 
                        elements[`${field}Input`]?.closest('section');
    if (fieldWrapper) {
        fieldWrapper.classList.add('error');
    }
    
    state.validationErrors[field] = message;
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    const errorElement = elements[`${field}Error`];
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    // Remove error class from field wrapper
    const fieldWrapper = elements[`${field}Input`]?.closest('.form-field') || 
                        elements[`${field}Input`]?.closest('section');
    if (fieldWrapper) {
        fieldWrapper.classList.remove('error');
    }
    
    delete state.validationErrors[field];
}

/**
 * Collect form data
 */
function collectFormData() {
    const amount = parseInt(elements.amountInput.value.replace(/[^\d]/g, ''));
    
    return {
        id: Date.now(), // Simple ID generation
        amount: state.transactionType === 'expense' ? -amount : amount,
        type: state.transactionType,
        category: state.selectedCategory,
        description: elements.descriptionInput.value.trim() || getDefaultDescription(),
        date: elements.dateInput.value,
        user: state.currentUser,
        time: new Date().toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        createdAt: new Date().toISOString()
    };
}

/**
 * Get default description based on category
 */
function getDefaultDescription() {
    const categoryLabels = {
        'food': '식비',
        'transport': '교통비',
        'shopping': '쇼핑',
        'bills': '공과금',
        'entertainment': '오락비',
        'healthcare': '의료비',
        'education': '교육비',
        'salary': '급여',
        'freelance': '부업',
        'investment': '투자수익',
        'gift': '용돈',
        'refund': '환급',
        'bonus': '보너스'
    };
    
    return categoryLabels[state.selectedCategory] || '거래';
}

/**
 * Save transaction (simulate API call)
 */
async function saveTransaction(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate random failure for demo (5% chance)
    if (Math.random() < 0.05) {
        throw new Error('Network error');
    }
    
    // Log transaction for demo
    console.log('💾 거래 저장됨:', formData);
    
    // In real app, would make API call here
    // const response = await fetch('/api/transactions', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
    
    return formData;
}

/**
 * Show loading state
 */
function showLoadingState() {
    state.isLoading = true;
    elements.loadingOverlay.classList.add('show');
    elements.loadingOverlay.setAttribute('aria-hidden', 'false');
    elements.saveButton.classList.add('loading');
    elements.saveButton.disabled = true;
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    state.isLoading = false;
    elements.loadingOverlay.classList.remove('show');
    elements.loadingOverlay.setAttribute('aria-hidden', 'true');
    elements.saveButton.classList.remove('loading');
    elements.saveButton.disabled = false;
}

/**
 * Show success modal
 */
function showSuccessModal() {
    elements.successModal.classList.add('show');
    elements.successModal.setAttribute('aria-hidden', 'false');
    
    // Focus first button for accessibility
    setTimeout(() => {
        elements.continueButton.focus();
    }, 300);
    
    // Add celebration animation to character
    elements.characterElement.classList.add('celebrating');
    setTimeout(() => {
        elements.characterElement.classList.remove('celebrating');
    }, 1500);
}

/**
 * Hide success modal
 */
function hideSuccessModal() {
    elements.successModal.classList.remove('show');
    elements.successModal.setAttribute('aria-hidden', 'true');
}

/**
 * Show error toast
 */
function showErrorToast(message) {
    const messageElement = elements.errorToast.querySelector('#errorToastMessage');
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    elements.errorToast.classList.add('show');
    elements.errorToast.setAttribute('aria-hidden', 'false');
    
    // Auto hide after 5 seconds
    setTimeout(hideErrorToast, 5000);
}

/**
 * Hide error toast
 */
function hideErrorToast() {
    elements.errorToast.classList.remove('show');
    elements.errorToast.setAttribute('aria-hidden', 'true');
}

/**
 * Handle continue button (add another transaction)
 */
function handleContinue() {
    hideSuccessModal();
    resetForm();
    updateCharacter('neutral');
    
    // Focus amount input
    setTimeout(() => {
        elements.amountInput.focus();
    }, 100);
}

/**
 * Handle view transactions button
 */
function handleViewTransactions() {
    hideSuccessModal();
    // Navigate to transaction history page
    window.location.href = 'transaction-history.html';
}

/**
 * Handle cancel button
 */
function handleCancel() {
    if (confirm('입력한 내용이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
        resetForm();
        handleBack();
    }
}

/**
 * Handle back button
 */
function handleBack() {
    // Navigate back to previous page
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'transaction-history.html';
    }
}

/**
 * Reset form to initial state
 */
function resetForm() {
    // Reset form inputs
    elements.transactionForm.reset();
    
    // Reset state
    state.selectedCategory = null;
    state.validationErrors = {};
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    elements.dateInput.value = today;
    
    // Reset UI state
    setupInitialState();
    clearAllFieldErrors();
    
    // Reset description counter
    elements.descriptionCounter.textContent = '0/200';
}

/**
 * Clear all field errors
 */
function clearAllFieldErrors() {
    ['amount', 'category', 'date'].forEach(field => {
        clearFieldError(field);
    });
}

/**
 * Update character and speech bubble
 */
function updateCharacter(state) {
    const message = characterMessages[state];
    if (message) {
        const bubbleText = elements.speechBubble.querySelector('.bubble-text');
        if (bubbleText) {
            bubbleText.textContent = message;
        }
        
        // Add animation to speech bubble
        elements.speechBubble.style.animation = 'none';
        setTimeout(() => {
            elements.speechBubble.style.animation = 'fadeInBubble 0.5s ease-out forwards';
        }, 50);
    }
}

/**
 * Add character interaction
 */
function addCharacterInteraction() {
    elements.characterElement.addEventListener('click', () => {
        // Random encouraging messages
        const encouragingMessages = [
            "화이팅! 🥔",
            "잘하고 있어요! 🐰",
            "감자토끼가 응원해요! 💪",
            "정확하게 기록해보세요! ✨"
        ];
        
        const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
        const bubbleText = elements.speechBubble.querySelector('.bubble-text');
        
        if (bubbleText) {
            const originalText = bubbleText.textContent;
            bubbleText.textContent = randomMessage;
            
            // Add bounce animation
            elements.characterElement.classList.add('happy');
            
            // Restore original message after 2 seconds
            setTimeout(() => {
                bubbleText.textContent = originalText;
                elements.characterElement.classList.remove('happy');
            }, 2000);
        }
    });
}

/**
 * Setup form validation with real-time feedback
 */
function setupFormValidation() {
    // Real-time amount validation
    elements.amountInput.addEventListener('blur', () => {
        const amount = elements.amountInput.value.replace(/[^\d]/g, '');
        if (amount && parseInt(amount) > 999999999) {
            showFieldError('amount', '금액이 너무 큽니다');
        }
    });
    
    // Date validation
    elements.dateInput.addEventListener('change', () => {
        const selectedDate = new Date(elements.dateInput.value);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        if (selectedDate > today) {
            showFieldError('date', '미래 날짜는 선택할 수 없습니다');
        } else if (selectedDate < oneYearAgo) {
            showFieldError('date', '너무 오래된 날짜입니다');
        }
    });
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + S to save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSaveClick();
    }
    
    // Escape to cancel
    if (event.key === 'Escape') {
        if (elements.successModal.classList.contains('show')) {
            hideSuccessModal();
        } else if (elements.errorToast.classList.contains('show')) {
            hideErrorToast();
        } else {
            handleCancel();
        }
    }
    
    // Tab navigation enhancement
    if (event.key === 'Tab') {
        // Ensure proper focus management within modal
        if (elements.successModal.classList.contains('show')) {
            const focusableElements = elements.successModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
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
        collectFormData,
        validateForm
    };
}

console.log('🥔🐰 감자토끼 거래 등록 JavaScript 로드 완료!');