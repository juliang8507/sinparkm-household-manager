import { useState, useEffect, useCallback, useRef } from 'react';
import { categoryDB } from '../utils/database.js';

/**
 * Custom hook for managing categories with user-specific filtering
 * @param {Object} options - Hook options
 * @param {'husband'|'wife'|'both'} options.userType - Filter by user type
 * @param {boolean} options.autoLoad - Auto-load data on mount
 * @param {boolean} options.includeCustom - Include custom user categories
 * @returns {Object} Hook state and methods
 */
const useCategories = ({
  userType = 'both',
  autoLoad = true,
  includeCustom = true
} = {}) => {
  // State management
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache management
  const [lastFetched, setLastFetched] = useState(null);
  const cacheRef = useRef(new Map());

  /**
   * Check if cache is stale (older than 30 minutes)
   * Categories don't change often, so longer cache time
   */
  const isCacheStale = useCallback((timestamp) => {
    return !timestamp || Date.now() - timestamp > 30 * 60 * 1000;
  }, []);

  /**
   * Load categories from database
   */
  const loadCategories = useCallback(async (loadUserType = userType, useCache = true) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Check cache first
      const cacheKey = `categories-${loadUserType}`;
      const cached = cacheRef.current.get(cacheKey);
      
      if (useCache && cached && !isCacheStale(cached.timestamp)) {
        setCategories(cached.data);
        setLastFetched(new Date(cached.timestamp));
        setIsLoading(false);
        return cached.data;
      }

      // Fetch from database
      const data = await categoryDB.getCategories(loadUserType);

      // Update state
      setCategories(data);
      setLastFetched(new Date());

      // Update cache
      cacheRef.current.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (err) {
      console.error('Failed to load categories:', err);
      setIsError(true);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userType, isCacheStale]);

  /**
   * Get categories filtered by transaction type
   */
  const getCategoriesByType = useCallback((transactionType) => {
    return categories.filter(category => 
      category.type === transactionType || category.type === 'both'
    );
  }, [categories]);

  /**
   * Get income categories
   */
  const getIncomeCategories = useCallback(() => {
    return getCategoriesByType('income');
  }, [getCategoriesByType]);

  /**
   * Get expense categories
   */
  const getExpenseCategories = useCallback(() => {
    return getCategoriesByType('expense');
  }, [getCategoriesByType]);

  /**
   * Get default categories (system-provided)
   */
  const getDefaultCategories = useCallback(() => {
    return categories.filter(category => category.is_default);
  }, [categories]);

  /**
   * Get custom categories (user-created)
   */
  const getCustomCategories = useCallback(() => {
    return categories.filter(category => !category.is_default);
  }, [categories]);

  /**
   * Create new custom category
   */
  const createCategory = useCallback(async (categoryData) => {
    try {
      setIsLoading(true);
      
      const result = await categoryDB.createCategory(categoryData);

      if (result.error) {
        throw new Error(result.error);
      }

      // Add to current categories
      setCategories(prev => [...prev, result.data]);

      // Clear cache to force refresh
      cacheRef.current.clear();

      return result;
    } catch (err) {
      console.error('Failed to create category:', err);
      setIsError(true);
      setError(err.message);
      return { data: null, error: err.message, success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Find category by ID
   */
  const findCategoryById = useCallback((id) => {
    return categories.find(category => category.id === id);
  }, [categories]);

  /**
   * Find category by name
   */
  const findCategoryByName = useCallback((name) => {
    return categories.find(category => 
      category.name.toLowerCase() === name.toLowerCase()
    );
  }, [categories]);

  /**
   * Get categories grouped by type
   */
  const getCategoriesGrouped = useCallback(() => {
    return {
      income: getIncomeCategories(),
      expense: getExpenseCategories(),
      all: categories
    };
  }, [categories, getIncomeCategories, getExpenseCategories]);

  /**
   * Refresh categories (force reload without cache)
   */
  const refresh = useCallback(async () => {
    cacheRef.current.clear();
    return await loadCategories(userType, false);
  }, [loadCategories, userType]);

  /**
   * Get default categories for specific user type and transaction type
   * This is useful for forms where you want to show relevant categories
   */
  const getRelevantCategories = useCallback((transactionType, targetUserType = userType) => {
    return categories.filter(category => {
      const matchesTransactionType = category.type === transactionType || category.type === 'both';
      const matchesUserType = category.user_type === targetUserType || 
                              category.user_type === 'both' ||
                              targetUserType === 'both';
      
      return matchesTransactionType && matchesUserType;
    });
  }, [categories, userType]);

  /**
   * Get category statistics (count by type, user_type, etc.)
   */
  const getCategoryStats = useCallback(() => {
    const stats = {
      total: categories.length,
      income: 0,
      expense: 0,
      husband: 0,
      wife: 0,
      both: 0,
      custom: 0,
      default: 0
    };

    categories.forEach(category => {
      // Count by transaction type
      if (category.type === 'income') stats.income++;
      else if (category.type === 'expense') stats.expense++;

      // Count by user type
      if (category.user_type === 'husband') stats.husband++;
      else if (category.user_type === 'wife') stats.wife++;
      else if (category.user_type === 'both') stats.both++;

      // Count by custom/default
      if (category.is_default) stats.default++;
      else stats.custom++;
    });

    return stats;
  }, [categories]);

  /**
   * Initial data loading
   */
  useEffect(() => {
    if (autoLoad) {
      loadCategories();
    }
  }, [autoLoad, loadCategories]);

  // Update categories when userType changes
  useEffect(() => {
    if (categories.length > 0) {
      loadCategories(userType);
    }
  }, [userType, loadCategories]);

  // Calculate derived state
  const isEmpty = !isLoading && categories.length === 0;
  const isSuccess = !isLoading && !isError;
  const isStale = lastFetched ? isCacheStale(lastFetched.getTime()) : true;

  return {
    // Data
    categories,
    isEmpty,

    // Loading states
    isLoading,
    isError,
    isSuccess,
    error,

    // Cache info
    lastFetched,
    isStale,

    // Filtered getters
    getCategoriesByType,
    getIncomeCategories,
    getExpenseCategories,
    getDefaultCategories,
    getCustomCategories,
    getCategoriesGrouped,
    getRelevantCategories,

    // Utility methods
    findCategoryById,
    findCategoryByName,
    getCategoryStats,

    // Actions
    refresh,
    createCategory,
    loadCategories
  };
};

export default useCategories;