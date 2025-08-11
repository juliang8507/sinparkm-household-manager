import { useState, useEffect, useCallback, useRef } from 'react';
import { mealPlanDB } from '../utils/database.js';
import { dbHelpers } from '../lib/supabase.js';

/**
 * Custom hook for managing meal plans with real-time updates
 * @param {Object} options - Hook options
 * @param {import('../types/index.js').MealPlanFilters} options.filters - Initial filters
 * @param {boolean} options.realtime - Enable real-time subscriptions
 * @param {boolean} options.autoLoad - Auto-load data on mount
 * @param {boolean} options.groupByDate - Group meal plans by date
 * @returns {Object} Hook state and methods
 */
const useMealPlans = ({
  filters = {
    start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
    end_date: new Date(new Date().setDate(new Date().getDate() + 7))
  },
  realtime = true,
  autoLoad = true,
  groupByDate = true
} = {}) => {
  // State management
  const [mealPlans, setMealPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cache and subscription management
  const [lastFetched, setLastFetched] = useState(null);
  const [currentFilters, setCurrentFilters] = useState(filters);
  const subscriptionRef = useRef(null);
  const cacheRef = useRef(new Map());

  /**
   * Generate cache key based on filters
   */
  const getCacheKey = useCallback((filters) => {
    return `mealplans-${JSON.stringify(filters)}`;
  }, []);

  /**
   * Check if cache is stale (older than 5 minutes)
   */
  const isCacheStale = useCallback((timestamp) => {
    return !timestamp || Date.now() - timestamp > 5 * 60 * 1000;
  }, []);

  /**
   * Load meal plans from database
   */
  const loadMealPlans = useCallback(async (
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
        setMealPlans(cached.data);
        setLastFetched(new Date(cached.timestamp));
        setIsLoading(false);
        return cached.data;
      }

      // Fetch from database
      const data = await mealPlanDB.getMealPlans(loadFilters);

      // Update state
      setMealPlans(data);
      setLastFetched(new Date());

      // Update cache
      cacheRef.current.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (err) {
      console.error('Failed to load meal plans:', err);
      setIsError(true);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters, getCacheKey, isCacheStale]);

  /**
   * Create new meal plan with optimistic update
   */
  const createMealPlan = useCallback(async (mealPlanData) => {
    try {
      const tempId = `temp-${Date.now()}`;
      
      // Optimistic update - add temporary meal plan
      const tempMealPlan = {
        id: tempId,
        ...mealPlanData,
        is_completed: false,
        created_at: new Date(),
        user: { name: '철수', user_type: 'husband' } // Default user
      };

      setMealPlans(prev => [...prev, tempMealPlan]);

      // Create in database
      const result = await mealPlanDB.createMealPlan(mealPlanData);

      if (result.error) {
        // Revert optimistic update on error
        setMealPlans(prev => prev.filter(plan => plan.id !== tempId));
        throw new Error(result.error);
      }

      // Replace temporary meal plan with real one
      setMealPlans(prev => 
        prev.map(plan => plan.id === tempId ? result.data : plan)
      );

      // Clear cache
      cacheRef.current.clear();

      return result;
    } catch (err) {
      console.error('Failed to create meal plan:', err);
      setIsError(true);
      setError(err.message);
      return { data: null, error: err.message, success: false };
    }
  }, []);

  /**
   * Update meal plan completion status
   */
  const toggleMealCompletion = useCallback(async (id, isCompleted) => {
    try {
      const originalPlan = mealPlans.find(plan => plan.id === id);
      if (!originalPlan) return;

      // Optimistic update
      setMealPlans(prev =>
        prev.map(plan =>
          plan.id === id
            ? {
                ...plan,
                is_completed: isCompleted,
                completed_at: isCompleted ? new Date() : null
              }
            : plan
        )
      );

      // Update in database
      const result = await mealPlanDB.toggleMealPlanCompletion(id, isCompleted);

      if (result.error) {
        // Revert optimistic update on error
        setMealPlans(prev =>
          prev.map(plan => plan.id === id ? originalPlan : plan)
        );
        throw new Error(result.error);
      }

      // Clear cache
      cacheRef.current.clear();

      return result;
    } catch (err) {
      console.error('Failed to toggle meal completion:', err);
      setIsError(true);
      setError(err.message);
      return { data: null, error: err.message, success: false };
    }
  }, [mealPlans]);

  /**
   * Delete meal plan with optimistic update
   */
  const deleteMealPlan = useCallback(async (id) => {
    try {
      const originalPlan = mealPlans.find(plan => plan.id === id);
      if (!originalPlan) return;

      // Optimistic update - remove meal plan
      setMealPlans(prev => prev.filter(plan => plan.id !== id));

      // Delete from database
      const result = await mealPlanDB.deleteMealPlan(id);

      if (result.error) {
        // Revert optimistic update on error
        setMealPlans(prev => [...prev, originalPlan]);
        throw new Error(result.error);
      }

      // Clear cache
      cacheRef.current.clear();

      return result;
    } catch (err) {
      console.error('Failed to delete meal plan:', err);
      setIsError(true);
      setError(err.message);
      return { data: null, error: err.message, success: false };
    }
  }, [mealPlans]);

  /**
   * Get meal plans grouped by date
   */
  const getMealPlansGroupedByDate = useCallback(() => {
    const grouped = mealPlans.reduce((acc, plan) => {
      const dateKey = plan.date.split('T')[0]; // Get YYYY-MM-DD part
      const dateObj = new Date(plan.date);
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          dateObj,
          displayDate: dateObj.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
          }),
          plans: []
        };
      }
      
      acc[dateKey].plans.push(plan);
      return acc;
    }, {});

    // Sort by date and sort meal plans by meal type within each day
    return Object.values(grouped)
      .sort((a, b) => a.dateObj - b.dateObj)
      .map(day => ({
        ...day,
        plans: day.plans.sort((a, b) => {
          const mealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
          return mealOrder[a.meal_type] - mealOrder[b.meal_type];
        })
      }));
  }, [mealPlans]);

  /**
   * Get weekly meal plan structure
   */
  const getWeeklyMealPlan = useCallback(() => {
    const weekDays = [];
    const startDate = new Date(currentFilters.start_date);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateKey = date.toISOString().split('T')[0];
      const dayPlans = mealPlans.filter(plan => 
        plan.date.split('T')[0] === dateKey
      );

      weekDays.push({
        date: dateKey,
        dateObj: date,
        dayName: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
        displayDate: date.toLocaleDateString('ko-KR', { 
          month: 'numeric', 
          day: 'numeric' 
        }),
        meals: {
          breakfast: dayPlans.find(plan => plan.meal_type === 'breakfast'),
          lunch: dayPlans.find(plan => plan.meal_type === 'lunch'),
          dinner: dayPlans.find(plan => plan.meal_type === 'dinner'),
          snack: dayPlans.find(plan => plan.meal_type === 'snack')
        },
        totalPlans: dayPlans.length,
        completedPlans: dayPlans.filter(plan => plan.is_completed).length
      });
    }

    return weekDays;
  }, [mealPlans, currentFilters.start_date]);

  /**
   * Get meal plan statistics
   */
  const getStats = useCallback(() => {
    const stats = {
      total: mealPlans.length,
      completed: mealPlans.filter(plan => plan.is_completed).length,
      pending: mealPlans.filter(plan => !plan.is_completed).length,
      byMealType: {
        breakfast: mealPlans.filter(plan => plan.meal_type === 'breakfast').length,
        lunch: mealPlans.filter(plan => plan.meal_type === 'lunch').length,
        dinner: mealPlans.filter(plan => plan.meal_type === 'dinner').length,
        snack: mealPlans.filter(plan => plan.meal_type === 'snack').length
      },
      averageCalories: 0,
      recipesUsed: new Set(mealPlans.filter(plan => plan.recipe_id).map(plan => plan.recipe_id)).size
    };

    // Calculate average calories if available
    const plansWithCalories = mealPlans.filter(plan => 
      plan.recipe && plan.recipe.calories_per_serving
    );
    
    if (plansWithCalories.length > 0) {
      stats.averageCalories = Math.round(
        plansWithCalories.reduce((sum, plan) => 
          sum + plan.recipe.calories_per_serving, 0
        ) / plansWithCalories.length
      );
    }

    return stats;
  }, [mealPlans]);

  /**
   * Update filters and reload data
   */
  const updateFilters = useCallback(async (newFilters) => {
    setCurrentFilters(newFilters);
    return await loadMealPlans(newFilters);
  }, [loadMealPlans]);

  /**
   * Refresh data (force reload without cache)
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Clear cache
      cacheRef.current.clear();
      
      // Reload data
      return await loadMealPlans(currentFilters, false);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadMealPlans, currentFilters]);

  /**
   * Get meals for a specific date
   */
  const getMealsForDate = useCallback((date) => {
    const dateKey = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return mealPlans.filter(plan => plan.date.split('T')[0] === dateKey);
  }, [mealPlans]);

  /**
   * Check if date has meal plan
   */
  const hasPlansForDate = useCallback((date) => {
    return getMealsForDate(date).length > 0;
  }, [getMealsForDate]);

  /**
   * Set up real-time subscription
   */
  useEffect(() => {
    if (!realtime) return;

    const handleRealtimeUpdate = (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      switch (eventType) {
        case 'INSERT':
          setMealPlans(prev => {
            // Avoid duplicates
            if (prev.some(plan => plan.id === newRecord.id)) return prev;
            return [...prev, newRecord];
          });
          break;

        case 'UPDATE':
          setMealPlans(prev =>
            prev.map(plan => plan.id === newRecord.id ? newRecord : plan)
          );
          break;

        case 'DELETE':
          setMealPlans(prev => prev.filter(plan => plan.id !== oldRecord.id));
          break;

        default:
          break;
      }

      // Clear cache on any change
      cacheRef.current.clear();
    };

    subscriptionRef.current = dbHelpers.createRealtimeSubscription(
      'meal_plans',
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
      loadMealPlans();
    }
  }, [autoLoad, loadMealPlans]);

  // Calculate derived state
  const groupedPlans = groupByDate ? getMealPlansGroupedByDate() : null;
  const weeklyPlan = getWeeklyMealPlan();
  const stats = getStats();
  const isEmpty = !isLoading && mealPlans.length === 0;
  const isSuccess = !isLoading && !isError;
  const isStale = lastFetched ? isCacheStale(lastFetched.getTime()) : true;

  return {
    // Data
    mealPlans,
    groupedPlans,
    weeklyPlan,
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
    createMealPlan,
    deleteMealPlan,
    toggleMealCompletion,
    updateFilters,
    loadMealPlans,
    getMealPlansGroupedByDate,
    getWeeklyMealPlan,
    getMealsForDate,
    hasPlansForDate,
    getStats
  };
};

export default useMealPlans;