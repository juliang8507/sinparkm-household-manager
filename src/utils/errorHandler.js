/**
 * Error handling utilities for Supabase integration
 * Provides comprehensive error handling, user feedback, and debugging support
 */

/**
 * Error types for categorization
 */
export const ERROR_TYPES = {
  NETWORK: 'network',
  AUTH: 'auth',
  DATABASE: 'database',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  RATE_LIMIT: 'rate_limit',
  UNKNOWN: 'unknown'
};

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Categorize error based on message and context
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred
 * @returns {Object} Error categorization
 */
export const categorizeError = (error, context = 'unknown') => {
  const message = error.message?.toLowerCase() || '';
  const code = error.code || error.status;

  // Network errors
  if (message.includes('network') || message.includes('fetch') || 
      message.includes('connection') || code === 'ECONNREFUSED') {
    return {
      type: ERROR_TYPES.NETWORK,
      severity: ERROR_SEVERITY.HIGH,
      userMessage: '네트워크 연결을 확인해주세요.',
      retryable: true
    };
  }

  // Authentication errors
  if (message.includes('auth') || message.includes('unauthorized') || 
      message.includes('token') || code === 401) {
    return {
      type: ERROR_TYPES.AUTH,
      severity: ERROR_SEVERITY.HIGH,
      userMessage: '로그인이 필요합니다.',
      retryable: false
    };
  }

  // Permission errors
  if (message.includes('permission') || message.includes('forbidden') || 
      code === 403) {
    return {
      type: ERROR_TYPES.PERMISSION,
      severity: ERROR_SEVERITY.MEDIUM,
      userMessage: '접근 권한이 없습니다.',
      retryable: false
    };
  }

  // Database errors
  if (message.includes('database') || message.includes('postgres') || 
      message.includes('duplicate') || message.includes('constraint')) {
    return {
      type: ERROR_TYPES.DATABASE,
      severity: ERROR_SEVERITY.MEDIUM,
      userMessage: '데이터 저장 중 오류가 발생했습니다.',
      retryable: true
    };
  }

  // Validation errors
  if (message.includes('validation') || message.includes('invalid') || 
      message.includes('required') || code === 400) {
    return {
      type: ERROR_TYPES.VALIDATION,
      severity: ERROR_SEVERITY.LOW,
      userMessage: '입력한 정보를 다시 확인해주세요.',
      retryable: false
    };
  }

  // Rate limiting
  if (message.includes('rate') || message.includes('limit') || code === 429) {
    return {
      type: ERROR_TYPES.RATE_LIMIT,
      severity: ERROR_SEVERITY.MEDIUM,
      userMessage: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
      retryable: true
    };
  }

  // Unknown errors
  return {
    type: ERROR_TYPES.UNKNOWN,
    severity: ERROR_SEVERITY.MEDIUM,
    userMessage: '알 수 없는 오류가 발생했습니다.',
    retryable: true
  };
};

/**
 * Format error for user display
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred
 * @returns {Object} Formatted error information
 */
export const formatErrorForUser = (error, context = 'operation') => {
  const categorized = categorizeError(error, context);
  
  return {
    id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: getErrorTitle(categorized.type),
    message: categorized.userMessage,
    type: categorized.type,
    severity: categorized.severity,
    retryable: categorized.retryable,
    timestamp: new Date(),
    context,
    originalError: error.message
  };
};

/**
 * Get user-friendly error title
 * @param {string} errorType - Error type
 * @returns {string} Error title
 */
const getErrorTitle = (errorType) => {
  const titles = {
    [ERROR_TYPES.NETWORK]: '네트워크 오류',
    [ERROR_TYPES.AUTH]: '인증 오류',
    [ERROR_TYPES.DATABASE]: '데이터베이스 오류',
    [ERROR_TYPES.VALIDATION]: '입력 오류',
    [ERROR_TYPES.PERMISSION]: '권한 오류',
    [ERROR_TYPES.RATE_LIMIT]: '요청 제한',
    [ERROR_TYPES.UNKNOWN]: '시스템 오류'
  };

  return titles[errorType] || '오류';
};

/**
 * Log error for debugging and monitoring
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred
 * @param {Object} metadata - Additional metadata
 */
export const logError = (error, context = 'unknown', metadata = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    code: error.code || error.status,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...metadata
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Details');
    console.error('Error:', error);
    console.info('Context:', context);
    console.info('Metadata:', metadata);
    console.info('Full Error Info:', errorInfo);
    console.groupEnd();
  }

  // In production, you might want to send to an error tracking service
  // Example: Sentry.captureException(error, { extra: errorInfo });

  return errorInfo;
};

/**
 * Create error boundary handler
 * @param {Function} onError - Error handler function
 * @returns {Function} Error boundary handler
 */
export const createErrorBoundary = (onError) => {
  return (error, errorInfo) => {
    const formattedError = formatErrorForUser(error, 'component');
    logError(error, 'error-boundary', errorInfo);
    
    if (onError) {
      onError(formattedError);
    }
  };
};

/**
 * Retry mechanism with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Promise that resolves with function result
 */
export const retryWithBackoff = async (fn, options = {}) => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    onRetry = () => {}
  } = options;

  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      const categorized = categorizeError(error);
      
      // Don't retry if error is not retryable
      if (!categorized.retryable || attempt === maxAttempts) {
        throw error;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt - 1) + Math.random() * 1000,
        maxDelay
      );

      logError(error, `retry-attempt-${attempt}`, { delay, maxAttempts });
      onRetry(attempt, delay, error);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Handle async errors with user feedback
 * @param {Function} asyncFn - Async function to execute
 * @param {Object} options - Error handling options
 * @returns {Promise} Promise with error handling
 */
export const handleAsyncError = async (asyncFn, options = {}) => {
  const {
    context = 'async-operation',
    showUserError = true,
    onError = null,
    retryOptions = null
  } = options;

  try {
    const executeFn = retryOptions ? 
      () => retryWithBackoff(asyncFn, retryOptions) : 
      asyncFn;

    const result = await executeFn();
    return { data: result, error: null };
  } catch (error) {
    const formattedError = formatErrorForUser(error, context);
    logError(error, context);

    if (onError) {
      onError(formattedError);
    }

    return { data: null, error: formattedError };
  }
};

/**
 * Validation error helper
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result
 */
export const validateData = (data, schema) => {
  const errors = [];

  Object.entries(schema).forEach(([field, rules]) => {
    const value = data[field];

    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push({
        field,
        message: `${rules.label || field}은(는) 필수 항목입니다.`
      });
    }

    if (value && rules.type) {
      const type = typeof value;
      if (type !== rules.type) {
        errors.push({
          field,
          message: `${rules.label || field}의 형식이 올바르지 않습니다.`
        });
      }
    }

    if (value && rules.min && value < rules.min) {
      errors.push({
        field,
        message: `${rules.label || field}은(는) ${rules.min} 이상이어야 합니다.`
      });
    }

    if (value && rules.max && value > rules.max) {
      errors.push({
        field,
        message: `${rules.label || field}은(는) ${rules.max} 이하여야 합니다.`
      });
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      errors.push({
        field,
        message: `${rules.label || field}은(는) ${rules.minLength}자 이상이어야 합니다.`
      });
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors.push({
        field,
        message: `${rules.label || field}은(는) ${rules.maxLength}자 이하여야 합니다.`
      });
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors.push({
        field,
        message: rules.patternMessage || `${rules.label || field}의 형식이 올바르지 않습니다.`
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    formattedErrors: errors.reduce((acc, error) => {
      acc[error.field] = error.message;
      return acc;
    }, {})
  };
};

/**
 * Default error messages for common scenarios
 */
export const DEFAULT_ERROR_MESSAGES = {
  NETWORK_ERROR: '인터넷 연결을 확인하고 다시 시도해주세요.',
  AUTH_REQUIRED: '로그인이 필요한 서비스입니다.',
  PERMISSION_DENIED: '이 작업을 수행할 권한이 없습니다.',
  DATA_NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
  VALIDATION_FAILED: '입력한 정보에 오류가 있습니다.',
  SERVER_ERROR: '서버에 일시적인 문제가 발생했습니다.',
  RATE_LIMITED: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.'
};

export default {
  ERROR_TYPES,
  ERROR_SEVERITY,
  categorizeError,
  formatErrorForUser,
  logError,
  createErrorBoundary,
  retryWithBackoff,
  handleAsyncError,
  validateData,
  DEFAULT_ERROR_MESSAGES
};