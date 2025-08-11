import { useState, useEffect, useCallback, useRef } from 'react';
import { recipeDB } from '../utils/database.js';
import { dbHelpers } from '../lib/supabase.js';

/**
 * Custom hook for managing recipes with caching and real-time updates
 * @param {Object} options - Hook options
 * @param {boolean} options.favoritesOnly - Load only favorite recipes
 * @param {string} options.userId - Filter by specific user
 * @param {boolean} options.realtime - Enable real-time subscriptions
 * @param {boolean} options.autoLoad - Auto-load data on mount
 * @returns {Object} Hook state and methods
 */
const useRecipes = ({
  favoritesOnly = false,
  userId = null,
  realtime = true,
  autoLoad = true
} = {}) => {
  // State management
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cache and subscription management
  const [lastFetched, setLastFetched] = useState(null);
  const [currentOptions, setCurrentOptions] = useState({ favoritesOnly, userId });
  const subscriptionRef = useRef(null);
  const cacheRef = useRef(new Map());

  /**
   * Generate cache key based on options
   */
  const getCacheKey = useCallback((options) => {
    return `recipes-${JSON.stringify(options)}`;
  }, []);

  /**
   * Check if cache is stale (older than 10 minutes for recipes)
   */
  const isCacheStale = useCallback((timestamp) => {
    return !timestamp || Date.now() - timestamp > 10 * 60 * 1000;
  }, []);

  /**
   * Load recipes from database
   */
  const loadRecipes = useCallback(async (
    loadOptions = currentOptions,
    useCache = true
  ) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Check cache first
      const cacheKey = getCacheKey(loadOptions);
      const cached = cacheRef.current.get(cacheKey);
      
      if (useCache && cached && !isCacheStale(cached.timestamp)) {
        setRecipes(cached.data);
        setLastFetched(new Date(cached.timestamp));
        setIsLoading(false);
        return cached.data;
      }

      // Fetch from database
      const data = await recipeDB.getRecipes({
        favorites_only: loadOptions.favoritesOnly,
        user_id: loadOptions.userId
      });

      // Update state
      setRecipes(data);
      setLastFetched(new Date());

      // Update cache
      cacheRef.current.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (err) {
      console.error('Failed to load recipes:', err);
      setIsError(true);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentOptions, getCacheKey, isCacheStale]);

  /**
   * Get single recipe with full details
   */
  const getRecipe = useCallback(async (id) => {
    try {
      // Check if recipe is already in our list
      const existingRecipe = recipes.find(recipe => recipe.id === id);
      if (existingRecipe && existingRecipe.ingredients) {
        return existingRecipe;
      }

      // Fetch detailed recipe from database
      const recipe = await recipeDB.getRecipe(id);
      
      // Update the recipe in our list if it exists
      if (recipe && existingRecipe) {
        setRecipes(prev =>
          prev.map(r => r.id === id ? recipe : r)
        );
      }

      return recipe;
    } catch (err) {
      console.error('Failed to get recipe:', err);
      return null;
    }
  }, [recipes]);

  /**
   * Toggle recipe favorite status with optimistic update
   */
  const toggleFavorite = useCallback(async (id, isFavorite) => {
    try {
      // Find original recipe for rollback
      const originalRecipe = recipes.find(recipe => recipe.id === id);
      if (!originalRecipe) return;

      // Optimistic update
      setRecipes(prev =>
        prev.map(recipe =>
          recipe.id === id
            ? { ...recipe, is_favorite: isFavorite }
            : recipe
        )
      );

      // Update in database
      const result = await recipeDB.toggleRecipeFavorite(id, isFavorite);

      if (result.error) {
        // Revert optimistic update on error
        setRecipes(prev =>
          prev.map(recipe => recipe.id === id ? originalRecipe : recipe)
        );
        throw new Error(result.error);
      }

      // Update with real data from server
      setRecipes(prev =>
        prev.map(recipe => recipe.id === id ? result.data : recipe)
      );

      // Clear cache
      cacheRef.current.clear();

      return result;
    } catch (err) {
      console.error('Failed to toggle recipe favorite:', err);
      setIsError(true);
      setError(err.message);
      return { data: null, error: err.message, success: false };
    }
  }, [recipes]);

  /**
   * Search recipes by name, tags, or ingredients
   */
  const searchRecipes = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return recipes;

    const term = searchTerm.toLowerCase();
    
    return recipes.filter(recipe => {
      // Search in name
      if (recipe.name.toLowerCase().includes(term)) return true;
      
      // Search in description
      if (recipe.description && recipe.description.toLowerCase().includes(term)) return true;
      
      // Search in tags
      if (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(term))) return true;
      
      // Search in ingredients
      if (recipe.ingredients && recipe.ingredients.some(ingredient => 
        ingredient.name.toLowerCase().includes(term)
      )) return true;
      
      return false;
    });
  }, [recipes]);

  /**
   * Filter recipes by criteria
   */
  const filterRecipes = useCallback((criteria) => {
    let filtered = recipes;

    if (criteria.difficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty === criteria.difficulty);
    }

    if (criteria.maxPrepTime) {
      filtered = filtered.filter(recipe => recipe.prep_time <= criteria.maxPrepTime);
    }

    if (criteria.maxCookTime) {
      filtered = filtered.filter(recipe => recipe.cook_time <= criteria.maxCookTime);
    }

    if (criteria.tags && criteria.tags.length > 0) {
      filtered = filtered.filter(recipe => 
        recipe.tags && criteria.tags.some(tag => recipe.tags.includes(tag))
      );
    }

    if (criteria.minRating) {
      filtered = filtered.filter(recipe => recipe.rating >= criteria.minRating);
    }

    return filtered;
  }, [recipes]);

  /**
   * Get recipes grouped by category/difficulty
   */
  const getRecipesGrouped = useCallback((groupBy = 'difficulty') => {
    const grouped = recipes.reduce((acc, recipe) => {
      let key;
      
      switch (groupBy) {
        case 'difficulty':
          key = recipe.difficulty || 'medium';
          break;
        case 'prep_time':
          key = recipe.prep_time <= 15 ? 'quick' : 
               recipe.prep_time <= 45 ? 'medium' : 'long';
          break;
        case 'tags':
          // Group by first tag
          key = recipe.tags && recipe.tags.length > 0 ? recipe.tags[0] : 'uncategorized';
          break;
        default:
          key = 'all';
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(recipe);
      return acc;
    }, {});

    return grouped;
  }, [recipes]);

  /**
   * Get recipe statistics
   */
  const getStats = useCallback(() => {
    const stats = {
      total: recipes.length,
      favorites: recipes.filter(recipe => recipe.is_favorite).length,
      byDifficulty: {
        easy: recipes.filter(recipe => recipe.difficulty === 'easy').length,
        medium: recipes.filter(recipe => recipe.difficulty === 'medium').length,
        hard: recipes.filter(recipe => recipe.difficulty === 'hard').length
      },
      averageRating: 0,
      averagePrepTime: 0,
      averageCookTime: 0,
      topTags: {}
    };

    // Calculate averages
    if (recipes.length > 0) {
      stats.averageRating = recipes.reduce((sum, recipe) => sum + (recipe.rating || 0), 0) / recipes.length;
      stats.averagePrepTime = recipes.reduce((sum, recipe) => sum + (recipe.prep_time || 0), 0) / recipes.length;
      stats.averageCookTime = recipes.reduce((sum, recipe) => sum + (recipe.cook_time || 0), 0) / recipes.length;
    }

    // Count tags
    recipes.forEach(recipe => {
      if (recipe.tags) {
        recipe.tags.forEach(tag => {
          stats.topTags[tag] = (stats.topTags[tag] || 0) + 1;
        });
      }
    });

    return stats;
  }, [recipes]);

  /**
   * Update options and reload data
   */
  const updateOptions = useCallback(async (newOptions) => {
    setCurrentOptions(newOptions);
    return await loadRecipes(newOptions);
  }, [loadRecipes]);

  /**
   * Refresh data (force reload without cache)
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Clear cache
      cacheRef.current.clear();
      
      // Reload data
      return await loadRecipes(currentOptions, false);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadRecipes, currentOptions]);

  /**
   * Get favorite recipes only
   */
  const getFavoriteRecipes = useCallback(() => {
    return recipes.filter(recipe => recipe.is_favorite);
  }, [recipes]);

  /**
   * Get recipes by difficulty
   */
  const getRecipesByDifficulty = useCallback((difficulty) => {
    return recipes.filter(recipe => recipe.difficulty === difficulty);
  }, [recipes]);

  /**
   * Get quick recipes (prep time + cook time <= 30 minutes)
   */
  const getQuickRecipes = useCallback(() => {
    return recipes.filter(recipe => 
      (recipe.prep_time + recipe.cook_time) <= 30
    );
  }, [recipes]);

  /**
   * Set up real-time subscription
   */
  useEffect(() => {
    if (!realtime) return;

    const handleRealtimeUpdate = (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      switch (eventType) {
        case 'INSERT':
          setRecipes(prev => {
            // Avoid duplicates
            if (prev.some(recipe => recipe.id === newRecord.id)) return prev;
            return [newRecord, ...prev];
          });
          break;

        case 'UPDATE':
          setRecipes(prev =>
            prev.map(recipe => recipe.id === newRecord.id ? newRecord : recipe)
          );
          break;

        case 'DELETE':
          setRecipes(prev => prev.filter(recipe => recipe.id !== oldRecord.id));
          break;

        default:
          break;
      }

      // Clear cache on any change
      cacheRef.current.clear();
    };

    subscriptionRef.current = dbHelpers.createRealtimeSubscription(
      'recipes',
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
      loadRecipes();
    }
  }, [autoLoad, loadRecipes]);

  // Calculate derived state
  const favoriteRecipes = getFavoriteRecipes();
  const quickRecipes = getQuickRecipes();
  const groupedRecipes = getRecipesGrouped();
  const stats = getStats();
  const isEmpty = !isLoading && recipes.length === 0;
  const isSuccess = !isLoading && !isError;
  const isStale = lastFetched ? isCacheStale(lastFetched.getTime()) : true;

  return {
    // Data
    recipes,
    favoriteRecipes,
    quickRecipes,
    groupedRecipes,
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
    currentOptions,

    // Methods
    refresh,
    getRecipe,
    toggleFavorite,
    updateOptions,
    loadRecipes,
    searchRecipes,
    filterRecipes,
    getRecipesGrouped,
    getFavoriteRecipes,
    getRecipesByDifficulty,
    getQuickRecipes,
    getStats
  };
};

export default useRecipes;