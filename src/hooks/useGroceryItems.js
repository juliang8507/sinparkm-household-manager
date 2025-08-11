import { useState, useEffect, useCallback, useRef } from 'react';
import { groceryDB } from '../utils/database.js';
import { dbHelpers } from '../lib/supabase.js';

/**
 * Custom hook for managing grocery items with real-time updates and optimistic UI
 * @param {Object} options - Hook options
 * @param {import('../types/index.js').GroceryFilters} options.filters - Initial filters
 * @param {boolean} options.realtime - Enable real-time subscriptions
 * @param {boolean} options.autoLoad - Auto-load data on mount
 * @param {boolean} options.groupByStore - Group items by store
 * @returns {Object} Hook state and methods
 */
const useGroceryItems = ({
  filters = {},
  realtime = true,
  autoLoad = true,
  groupByStore = true
} = {}) => {
  // State management
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cache and subscription management
  const [lastFetched, setLastFetched] = useState(null);
  const [currentFilters, setCurrentFilters] = useState(filters);
  const subscriptionRef = useRef(null);
  const cacheRef = useRef(new Map());
  const optimisticUpdatesRef = useRef(new Set());

  /**
   * Generate cache key based on filters
   */
  const getCacheKey = useCallback((filters) => {
    return `grocery-${JSON.stringify(filters)}`;
  }, []);

  /**
   * Check if cache is stale (older than 2 minutes for grocery items)
   */
  const isCacheStale = useCallback((timestamp) => {
    return !timestamp || Date.now() - timestamp > 2 * 60 * 1000;
  }, []);

  /**
   * Load grocery items from database
   */
  const loadItems = useCallback(async (
    loadFilters = currentFilters,
    useCache = true
  ) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Check cache first
      const cacheKey = getCacheKey(loadFilters);
      const cached = cacheRef.current.get(cacheKey);
      
      if (useCache && cached && !isCacheStale(cached.timestamp)) {
        setItems(cached.data);
        setLastFetched(new Date(cached.timestamp));
        setIsLoading(false);
        return cached.data;
      }

      // Fetch from database
      const data = await groceryDB.getGroceryItems(loadFilters);

      // Update state
      setItems(data);
      setLastFetched(new Date());

      // Update cache
      cacheRef.current.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (err) {
      console.error('Failed to load grocery items:', err);
      setIsError(true);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters, getCacheKey, isCacheStale]);

  /**
   * Create new grocery item with optimistic update
   */
  const createItem = useCallback(async (itemData) => {
    try {
      const tempId = `temp-${Date.now()}`;
      
      // Optimistic update - add temporary item
      const tempItem = {
        id: tempId,
        name: itemData.name,
        quantity: itemData.quantity || '1개',
        category: itemData.category || 'household',
        estimated_price: parseInt(itemData.estimated_price || 0),
        priority: itemData.priority || 'medium',
        store: itemData.store || '이마트',
        notes: itemData.notes || null,
        is_completed: false,
        sort_order: 0,
        created_at: new Date(),
        user: { name: '철수', user_type: 'husband' } // Default user
      };

      // Add optimistic update tracking
      optimisticUpdatesRef.current.add(tempId);

      setItems(prev => [tempItem, ...prev]);

      // Create in database
      const result = await groceryDB.createGroceryItem(itemData);

      // Remove from optimistic updates
      optimisticUpdatesRef.current.delete(tempId);

      if (result.error) {
        // Revert optimistic update on error
        setItems(prev => prev.filter(item => item.id !== tempId));
        throw new Error(result.error);
      }

      // Replace temporary item with real one
      setItems(prev => 
        prev.map(item => item.id === tempId ? result.data : item)
      );

      // Clear cache
      cacheRef.current.clear();

      return result;
    } catch (err) {
      console.error('Failed to create grocery item:', err);
      setIsError(true);
      setError(err.message);
      return { data: null, error: err.message, success: false };
    }
  }, []);

  /**
   * Toggle item completion with optimistic update
   */
  const toggleItem = useCallback(async (id, isCompleted) => {
    try {
      // Find original item for rollback
      const originalItem = items.find(item => item.id === id);
      if (!originalItem) return;

      // Optimistic update
      setItems(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                is_completed: isCompleted,
                completed_at: isCompleted ? new Date() : null
              }
            : item
        )
      );

      // Update in database
      const result = await groceryDB.toggleGroceryItem(id, isCompleted);

      if (result.error) {
        // Revert optimistic update on error
        setItems(prev =>
          prev.map(item => item.id === id ? originalItem : item)
        );
        throw new Error(result.error);
      }

      // Update with real data from server
      setItems(prev =>
        prev.map(item => item.id === id ? result.data : item)
      );

      // Clear cache
      cacheRef.current.clear();

      return result;
    } catch (err) {
      console.error('Failed to toggle grocery item:', err);
      setIsError(true);
      setError(err.message);
      return { data: null, error: err.message, success: false };
    }
  }, [items]);

  /**
   * Delete item with optimistic update
   */
  const deleteItem = useCallback(async (id) => {
    try {
      // Store original items for rollback
      const originalItems = [...items];
      
      // Optimistic update - remove item
      setItems(prev => prev.filter(item => item.id !== id));

      // Delete from database
      const result = await groceryDB.deleteGroceryItem(id);

      if (result.error) {
        // Revert optimistic update on error
        setItems(originalItems);
        throw new Error(result.error);
      }

      // Clear cache
      cacheRef.current.clear();

      return result;
    } catch (err) {
      console.error('Failed to delete grocery item:', err);
      setIsError(true);
      setError(err.message);
      // Revert on error
      setItems(items);
      return { data: null, error: err.message, success: false };
    }
  }, [items]);

  /**
   * Update filters
   */
  const updateFilters = useCallback(async (newFilters) => {
    setCurrentFilters(newFilters);
    return await loadItems(newFilters);
  }, [loadItems]);

  /**
   * Refresh data (force reload without cache)
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Clear cache
      cacheRef.current.clear();
      
      // Reload data
      return await loadItems(currentFilters, false);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadItems, currentFilters]);

  /**
   * Get filtered items based on current filters
   */
  const getFilteredItems = useCallback(() => {
    let filtered = items;

    if (currentFilters.status === 'remaining') {
      filtered = filtered.filter(item => !item.is_completed);
    } else if (currentFilters.status === 'completed') {
      filtered = filtered.filter(item => item.is_completed);
    }

    if (currentFilters.category) {
      filtered = filtered.filter(item => item.category === currentFilters.category);
    }

    if (currentFilters.priority) {
      filtered = filtered.filter(item => item.priority === currentFilters.priority);
    }

    if (currentFilters.store) {
      filtered = filtered.filter(item => item.store === currentFilters.store);
    }

    return filtered;
  }, [items, currentFilters]);

  /**
   * Group items by store
   */
  const getItemsGroupedByStore = useCallback(() => {
    const filtered = getFilteredItems();
    
    const grouped = filtered.reduce((acc, item) => {
      const store = item.store || '기타';
      if (!acc[store]) {
        acc[store] = [];
      }
      acc[store].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([store, items]) => ({
      store,
      items,
      totalPrice: items.reduce((sum, item) => sum + (item.estimated_price || 0), 0),
      completedCount: items.filter(item => item.is_completed).length,
      totalCount: items.length
    }));
  }, [getFilteredItems]);

  /**
   * Get grocery statistics
   */
  const getStats = useCallback(() => {
    const filtered = getFilteredItems();
    
    const stats = {
      total: filtered.length,
      completed: filtered.filter(item => item.is_completed).length,
      remaining: filtered.filter(item => !item.is_completed).length,
      totalPrice: filtered.reduce((sum, item) => sum + (item.estimated_price || 0), 0),
      completedPrice: filtered
        .filter(item => item.is_completed)
        .reduce((sum, item) => sum + (item.estimated_price || 0), 0),
      byPriority: {
        high: filtered.filter(item => item.priority === 'high').length,
        medium: filtered.filter(item => item.priority === 'medium').length,
        low: filtered.filter(item => item.priority === 'low').length
      },
      byStore: {}
    };

    // Group by store
    filtered.forEach(item => {
      const store = item.store || '기타';
      if (!stats.byStore[store]) {
        stats.byStore[store] = { total: 0, completed: 0 };
      }
      stats.byStore[store].total++;
      if (item.is_completed) stats.byStore[store].completed++;
    });

    return stats;
  }, [getFilteredItems]);

  /**
   * Set up real-time subscription
   */
  useEffect(() => {
    if (!realtime) return;

    const handleRealtimeUpdate = (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      switch (eventType) {
        case 'INSERT':
          setItems(prev => {
            // Avoid duplicates and ignore optimistic updates
            if (prev.some(item => item.id === newRecord.id) || 
                optimisticUpdatesRef.current.has(newRecord.id)) {
              return prev;
            }
            return [newRecord, ...prev];
          });
          break;

        case 'UPDATE':
          setItems(prev =>
            prev.map(item => item.id === newRecord.id ? newRecord : item)
          );
          break;

        case 'DELETE':
          setItems(prev => prev.filter(item => item.id !== oldRecord.id));
          break;

        default:
          break;
      }

      // Clear cache on any change
      cacheRef.current.clear();
    };

    subscriptionRef.current = dbHelpers.createRealtimeSubscription(
      'grocery_items',
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
      loadItems();
    }
  }, [autoLoad, loadItems]);

  // Calculate derived state
  const filteredItems = getFilteredItems();
  const groupedItems = groupByStore ? getItemsGroupedByStore() : null;
  const stats = getStats();
  const isEmpty = !isLoading && filteredItems.length === 0;
  const isSuccess = !isLoading && !isError;
  const isStale = lastFetched ? isCacheStale(lastFetched.getTime()) : true;

  return {
    // Data
    items: filteredItems,
    allItems: items,
    groupedItems,
    stats,
    isEmpty,

    // Loading states
    isLoading,
    isRefreshing,
    isError,
    isSuccess,
    error,

    // Cache info
    lastFetched,
    isStale,

    // Current state
    currentFilters,

    // Methods
    refresh,
    createItem,
    toggleItem,
    deleteItem,
    updateFilters,
    loadItems,
    getFilteredItems,
    getItemsGroupedByStore,
    getStats
  };
};

export default useGroceryItems;