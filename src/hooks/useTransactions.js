import { useState, useEffect, useCallback, useRef } from 'react';
import { transactionDB } from '../utils/database.js';
import { CHANNELS, dbHelpers } from '../lib/supabase.js';

/**
 * Custom hook for managing transactions with real-time updates and caching
 * @param {Object} options - Hook options
 * @param {import('../types/index.js').TransactionFilters} options.filters - Initial filters
 * @param {Object} options.pagination - Pagination options
 * @param {boolean} options.realtime - Enable real-time subscriptions
 * @param {boolean} options.autoLoad - Auto-load data on mount
 * @returns {Object} Hook state and methods
 */
const useTransactions = ({
  filters = {},
  pagination = { page: 0, limit: 50 },
  realtime = true,
  autoLoad = true
} = {}) => {
  // State management
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cache and subscription management
  const [lastFetched, setLastFetched] = useState(null);
  const [currentFilters, setCurrentFilters] = useState(filters);
  const [currentPagination, setCurrentPagination] = useState(pagination);
  const subscriptionRef = useRef(null);
  const cacheRef = useRef(new Map());

  // Statistics state
  const [stats, setStats] = useState({
    total_income: 0,
    total_expense: 0,
    net_amount: 0,
    transaction_count: 0,
    category_breakdown: {},
    monthly_trends: {}
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  /**
   * Generate cache key based on filters and pagination
   */
  const getCacheKey = useCallback((filters, pagination) => {
    return JSON.stringify({ filters, pagination });
  }, []);

  /**
   * Check if cache is stale (older than 5 minutes)
   */
  const isCacheStale = useCallback((timestamp) => {
    return !timestamp || Date.now() - timestamp > 5 * 60 * 1000;
  }, []);

  /**
   * Load transactions from database
   */
  const loadTransactions = useCallback(async (
    loadFilters = currentFilters,
    loadPagination = currentPagination,
    useCache = true
  ) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Check cache first
      const cacheKey = getCacheKey(loadFilters, loadPagination);
      const cached = cacheRef.current.get(cacheKey);
      
      if (useCache && cached && !isCacheStale(cached.timestamp)) {
        setTransactions(cached.data);
        setTotalCount(cached.count);
        setLastFetched(new Date(cached.timestamp));
        setIsLoading(false);
        return { data: cached.data, count: cached.count };
      }

      // Fetch from database
      const result = await transactionDB.getTransactions({
        filters: loadFilters,
        pagination: loadPagination,
        orderBy: 'transaction_date',
        ascending: false
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Update state
      setTransactions(result.data);
      setTotalCount(result.count);
      setLastFetched(new Date());

      // Update cache
      cacheRef.current.set(cacheKey, {
        data: result.data,
        count: result.count,
        timestamp: Date.now()
      });

      return result;
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setIsError(true);
      setError(err.message);
      return { data: [], count: 0, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters, currentPagination, getCacheKey, isCacheStale]);

  /**
   * Load transaction statistics
   */
  const loadStats = useCallback(async (statsFilters = currentFilters) => {
    try {
      setIsLoadingStats(true);
      const result = await transactionDB.getTransactionStats(statsFilters);
      setStats(result);
      return result;
    } catch (err) {
      console.error('Failed to load transaction stats:', err);
      return stats; // Return current stats on error
    } finally {
      setIsLoadingStats(false);
    }
  }, [currentFilters, stats]);

  /**
   * Create new transaction with optimistic update
   */
  const createTransaction = useCallback(async (transactionData) => {
    try {
      setIsLoading(true);
      
      // Optimistic update - add temporary transaction
      const tempTransaction = {
        id: `temp-${Date.now()}`,
        ...transactionData,
        amount: parseInt(transactionData.amount),
        created_at: new Date(),
        user: { name: transactionData.user_type === 'wife' ? '영희' : '철수' }
      };

      setTransactions(prev => [tempTransaction, ...prev]);

      // Create in database
      const result = await transactionDB.createTransaction(transactionData);

      if (result.error) {
        // Revert optimistic update on error
        setTransactions(prev => prev.filter(t => t.id !== tempTransaction.id));
        throw new Error(result.error);
      }

      // Replace temporary transaction with real one
      setTransactions(prev => 
        prev.map(t => t.id === tempTransaction.id ? result.data : t)
      );

      // Clear cache to force refresh
      cacheRef.current.clear();

      // Refresh stats
      await loadStats();

      return result;
    } catch (err) {
      console.error('Failed to create transaction:', err);
      setIsError(true);
      setError(err.message);
      return { data: null, error: err.message, success: false };
    } finally {
      setIsLoading(false);
    }
  }, [loadStats]);

  /**
   * Update existing transaction
   */
  const updateTransaction = useCallback(async (id, updateData) => {
    try {
      setIsLoading(true);

      // Optimistic update
      const originalTransaction = transactions.find(t => t.id === id);
      setTransactions(prev =>
        prev.map(t => 
          t.id === id 
            ? { ...t, ...updateData, amount: parseInt(updateData.amount || t.amount) }
            : t
        )
      );

      // Update in database
      const result = await transactionDB.updateTransaction(id, updateData);

      if (result.error) {
        // Revert optimistic update on error
        setTransactions(prev =>
          prev.map(t => t.id === id ? originalTransaction : t)
        );
        throw new Error(result.error);
      }

      // Update with real data
      setTransactions(prev =>
        prev.map(t => t.id === id ? result.data : t)
      );

      // Clear cache
      cacheRef.current.clear();

      // Refresh stats
      await loadStats();

      return result;
    } catch (err) {
      console.error('Failed to update transaction:', err);
      setIsError(true);
      setError(err.message);
      return { data: null, error: err.message, success: false };
    } finally {
      setIsLoading(false);
    }
  }, [transactions, loadStats]);

  /**
   * Delete transaction with optimistic update
   */
  const deleteTransaction = useCallback(async (id) => {
    try {
      setIsLoading(true);

      // Optimistic update - remove transaction
      const originalTransactions = [...transactions];
      setTransactions(prev => prev.filter(t => t.id !== id));

      // Delete from database
      const result = await transactionDB.deleteTransaction(id);

      if (result.error) {
        // Revert optimistic update on error
        setTransactions(originalTransactions);
        throw new Error(result.error);
      }

      // Clear cache
      cacheRef.current.clear();

      // Refresh stats
      await loadStats();

      return result;
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      setIsError(true);
      setError(err.message);
      // Revert on error
      setTransactions(transactions);
      return { data: null, error: err.message, success: false };
    } finally {
      setIsLoading(false);
    }
  }, [transactions, loadStats]);

  /**
   * Refresh data (force reload without cache)
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Clear cache
      cacheRef.current.clear();
      
      // Reload data
      await Promise.all([
        loadTransactions(currentFilters, currentPagination, false),
        loadStats(currentFilters)
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadTransactions, loadStats, currentFilters, currentPagination]);

  /**
   * Update filters
   */
  const updateFilters = useCallback(async (newFilters) => {
    setCurrentFilters(newFilters);
    setCurrentPagination({ page: 0, limit: currentPagination.limit });
    await loadTransactions(newFilters, { page: 0, limit: currentPagination.limit });
    await loadStats(newFilters);
  }, [loadTransactions, loadStats, currentPagination.limit]);

  /**
   * Load more data (pagination)
   */
  const loadMore = useCallback(async () => {
    if (isLoading || transactions.length >= totalCount) return;

    const nextPagination = {
      ...currentPagination,
      page: currentPagination.page + 1
    };

    const result = await loadTransactions(currentFilters, nextPagination);
    
    if (result.data.length > 0) {
      setTransactions(prev => [...prev, ...result.data]);
      setCurrentPagination(nextPagination);
    }
  }, [isLoading, transactions.length, totalCount, currentPagination, loadTransactions, currentFilters]);

  /**
   * Set up real-time subscription
   */
  useEffect(() => {
    if (!realtime) return;

    const handleRealtimeUpdate = (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      switch (eventType) {
        case 'INSERT':
          setTransactions(prev => {
            // Avoid duplicates
            if (prev.some(t => t.id === newRecord.id)) return prev;
            return [newRecord, ...prev];
          });
          setTotalCount(prev => prev + 1);
          break;

        case 'UPDATE':
          setTransactions(prev =>
            prev.map(t => t.id === newRecord.id ? newRecord : t)
          );
          break;

        case 'DELETE':
          setTransactions(prev => prev.filter(t => t.id !== oldRecord.id));
          setTotalCount(prev => Math.max(0, prev - 1));
          break;

        default:
          break;
      }

      // Clear cache on any change
      cacheRef.current.clear();
    };

    subscriptionRef.current = dbHelpers.createRealtimeSubscription(
      'transactions',
      handleRealtimeUpdate
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [realtime]);

  /**
   * Initial data loading
   */
  useEffect(() => {
    if (autoLoad) {
      loadTransactions();
      loadStats();
    }
  }, [autoLoad, loadTransactions, loadStats]);

  // Calculate derived state
  const hasMore = transactions.length < totalCount;
  const isEmpty = !isLoading && transactions.length === 0;
  const isSuccess = !isLoading && !isError;

  return {
    // Data
    transactions,
    totalCount,
    stats,
    isEmpty,
    hasMore,

    // Loading states
    isLoading,
    isRefreshing,
    isLoadingStats,
    isError,
    isSuccess,
    error,

    // Cache info
    lastFetched,
    isStale: lastFetched ? isCacheStale(lastFetched.getTime()) : true,

    // Filters and pagination
    currentFilters,
    currentPagination,

    // Methods
    refresh,
    loadMore,
    updateFilters,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loadStats
  };
};

export default useTransactions;