import { useState, useCallback, useRef } from 'react';
import { handleAsyncError, retryWithBackoff } from '../utils/errorHandler.js';

/**
 * Custom hook for managing loading states with error handling and retry logic
 * @param {Object} options - Hook options
 * @param {boolean} options.showUserError - Show user-friendly error messages
 * @param {number} options.timeout - Operation timeout in milliseconds
 * @param {Object} options.retryOptions - Retry configuration
 * @returns {Object} Loading state and utilities
 */
const useLoadingState = (options = {}) => {
  const {
    showUserError = true,
    timeout = 30000, // 30 seconds default timeout
    retryOptions = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 10000
    }
  } = options;

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  // Track operation state
  const [operationId, setOperationId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs for cleanup
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setIsSuccess(false);
    setProgress(0);
    setOperationId(null);
    setStartTime(null);
    setRetryCount(0);

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Abort ongoing operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Set loading state
   */
  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
    if (loading) {
      setIsError(false);
      setError(null);
      setIsSuccess(false);
      setStartTime(Date.now());
      setOperationId(`op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      
      // Set timeout
      if (timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsError(true);
          setError({
            type: 'timeout',
            message: '요청 시간이 초과되었습니다.',
            userMessage: '작업이 너무 오래 걸리고 있습니다. 다시 시도해주세요.'
          });
          setIsLoading(false);
        }, timeout);
      }
    } else {
      setStartTime(null);
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [timeout]);

  /**
   * Set success state
   */
  const setSuccess = useCallback((successData = null) => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setIsSuccess(true);
    setProgress(100);

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return successData;
  }, []);

  /**
   * Set error state
   */
  const setErrorState = useCallback((errorData) => {
    setIsLoading(false);
    setIsError(true);
    setError(errorData);
    setIsSuccess(false);

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Execute async operation with loading states
   */
  const executeAsync = useCallback(async (asyncFn, context = 'operation') => {
    reset();
    setLoading(true);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    const result = await handleAsyncError(
      () => asyncFn(abortControllerRef.current.signal),
      {
        context,
        showUserError,
        onError: setErrorState,
        retryOptions: {
          ...retryOptions,
          onRetry: (attempt, delay, error) => {
            setRetryCount(attempt);
            console.log(`Retrying ${context} (attempt ${attempt})`);
          }
        }
      }
    );

    if (result.error) {
      return result;
    } else {
      return setSuccess(result.data);
    }
  }, [reset, setLoading, setSuccess, setErrorState, showUserError, retryOptions]);

  /**
   * Execute with manual retry
   */
  const executeWithRetry = useCallback(async (asyncFn, context = 'operation', customRetryOptions = {}) => {
    const mergedRetryOptions = { ...retryOptions, ...customRetryOptions };
    
    return executeAsync(
      (signal) => retryWithBackoff(
        () => asyncFn(signal),
        {
          ...mergedRetryOptions,
          onRetry: (attempt, delay, error) => {
            setRetryCount(attempt);
            if (mergedRetryOptions.onRetry) {
              mergedRetryOptions.onRetry(attempt, delay, error);
            }
          }
        }
      ),
      context
    );
  }, [executeAsync, retryOptions]);

  /**
   * Update progress manually
   */
  const updateProgress = useCallback((progressValue) => {
    setProgress(Math.max(0, Math.min(100, progressValue)));
  }, []);

  /**
   * Cancel current operation
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setIsLoading(false);
    setError({
      type: 'cancelled',
      message: '작업이 취소되었습니다.',
      userMessage: '사용자가 작업을 취소했습니다.'
    });
  }, []);

  /**
   * Get operation duration
   */
  const getOperationDuration = useCallback(() => {
    if (!startTime) return 0;
    return Date.now() - startTime;
  }, [startTime]);

  /**
   * Get loading state summary
   */
  const getStateSummary = useCallback(() => {
    return {
      isLoading,
      isError,
      isSuccess,
      error,
      progress,
      operationId,
      retryCount,
      duration: getOperationDuration(),
      canRetry: isError && error?.retryable !== false
    };
  }, [isLoading, isError, isSuccess, error, progress, operationId, retryCount, getOperationDuration]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    // State
    isLoading,
    isError,
    isSuccess,
    error,
    progress,
    operationId,
    retryCount,

    // Computed state
    canRetry: isError && error?.retryable !== false,
    duration: getOperationDuration(),
    stateSummary: getStateSummary(),

    // Actions
    reset,
    setLoading,
    setSuccess,
    setErrorState,
    updateProgress,
    cancel,
    cleanup,

    // Async execution
    executeAsync,
    executeWithRetry,

    // Utilities
    getOperationDuration,
    getStateSummary
  };
};

export default useLoadingState;