import { supabase, TABLES, dbHelpers } from '../lib/supabase.js';

/**
 * Database utility functions with comprehensive error handling and caching
 */

/**
 * Transaction Database Operations
 */
export const transactionDB = {
  /**
   * Get transactions with filters and pagination
   * @param {Object} options - Query options
   * @param {import('../types/index.js').TransactionFilters} options.filters - Filter criteria
   * @param {Object} options.pagination - Pagination options
   * @param {number} options.pagination.page - Page number (0-based)
   * @param {number} options.pagination.limit - Items per page
   * @param {string} options.orderBy - Order by field
   * @param {boolean} options.ascending - Sort order
   * @returns {Promise<import('../types/index.js').PaginatedResponse>}
   */
  async getTransactions({ 
    filters = {}, 
    pagination = { page: 0, limit: 50 }, 
    orderBy = 'transaction_date', 
    ascending = false 
  } = {}) {
    try {
      let query = supabase
        .from(TABLES.TRANSACTIONS)
        .select(`
          *,
          category:categories(*),
          user:profiles(*)
        `, { count: 'exact' });

      // Apply filters
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters.start_date) {
        query = query.gte('transaction_date', filters.start_date.toISOString());
      }

      if (filters.end_date) {
        query = query.lte('transaction_date', filters.end_date.toISOString());
      }

      if (filters.min_amount) {
        query = query.gte('amount', filters.min_amount);
      }

      if (filters.max_amount) {
        query = query.lte('amount', filters.max_amount);
      }

      // Apply pagination and ordering
      const from = pagination.page * pagination.limit;
      const to = from + pagination.limit - 1;

      query = query
        .order(orderBy, { ascending })
        .range(from, to);

      const { data, count } = await dbHelpers.executeQuery(query, 'get transactions');

      return {
        data: data || [],
        count: count || 0,
        page: pagination.page,
        limit: pagination.limit,
        hasMore: (count || 0) > (from + data.length),
        error: null
      };
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return {
        data: [],
        count: 0,
        page: pagination.page,
        limit: pagination.limit,
        hasMore: false,
        error: error.message
      };
    }
  },

  /**
   * Create new transaction
   * @param {import('../types/index.js').TransactionFormData} transactionData - Transaction data
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async createTransaction(transactionData) {
    try {
      const user = await dbHelpers.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const transaction = {
        user_id: user.id,
        amount: parseInt(transactionData.amount) || 0,
        type: transactionData.type,
        category_id: transactionData.category_id,
        description: transactionData.description,
        notes: transactionData.notes || null,
        transaction_date: transactionData.transaction_date || new Date(),
        created_at: new Date(),
        updated_at: new Date()
      };

      const query = supabase
        .from(TABLES.TRANSACTIONS)
        .insert([transaction])
        .select(`
          *,
          category:categories(*),
          user:profiles(*)
        `);

      const { data } = await dbHelpers.executeQuery(query, 'create transaction');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to create transaction:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  },

  /**
   * Update existing transaction
   * @param {string} id - Transaction ID
   * @param {import('../types/index.js').TransactionFormData} updateData - Update data
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async updateTransaction(id, updateData) {
    try {
      const updates = {
        ...updateData,
        amount: updateData.amount ? parseInt(updateData.amount) : undefined,
        updated_at: new Date()
      };

      // Remove undefined values
      Object.keys(updates).forEach(key => {
        if (updates[key] === undefined) delete updates[key];
      });

      const query = supabase
        .from(TABLES.TRANSACTIONS)
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          category:categories(*),
          user:profiles(*)
        `);

      const { data } = await dbHelpers.executeQuery(query, 'update transaction');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to update transaction:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  },

  /**
   * Delete transaction
   * @param {string} id - Transaction ID
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async deleteTransaction(id) {
    try {
      const query = supabase
        .from(TABLES.TRANSACTIONS)
        .delete()
        .eq('id', id);

      await dbHelpers.executeQuery(query, 'delete transaction');

      return {
        data: { id },
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  },

  /**
   * Get transaction statistics
   * @param {import('../types/index.js').TransactionFilters} filters - Filter criteria
   * @returns {Promise<import('../types/index.js').TransactionStats>}
   */
  async getTransactionStats(filters = {}) {
    try {
      let query = supabase
        .from(TABLES.TRANSACTIONS)
        .select('amount, type, category_id, transaction_date');

      // Apply filters (similar to getTransactions)
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters.user_id) query = query.eq('user_id', filters.user_id);
      if (filters.start_date) query = query.gte('transaction_date', filters.start_date.toISOString());
      if (filters.end_date) query = query.lte('transaction_date', filters.end_date.toISOString());

      const { data } = await dbHelpers.executeQuery(query, 'get transaction stats');

      const stats = {
        total_income: 0,
        total_expense: 0,
        net_amount: 0,
        transaction_count: data.length,
        category_breakdown: {},
        monthly_trends: {}
      };

      data.forEach(transaction => {
        if (transaction.type === 'income') {
          stats.total_income += transaction.amount;
        } else {
          stats.total_expense += transaction.amount;
        }

        // Category breakdown
        const categoryId = transaction.category_id;
        if (!stats.category_breakdown[categoryId]) {
          stats.category_breakdown[categoryId] = { amount: 0, count: 0 };
        }
        stats.category_breakdown[categoryId].amount += transaction.amount;
        stats.category_breakdown[categoryId].count += 1;

        // Monthly trends
        const month = new Date(transaction.transaction_date).toISOString().slice(0, 7);
        if (!stats.monthly_trends[month]) {
          stats.monthly_trends[month] = { income: 0, expense: 0 };
        }
        stats.monthly_trends[month][transaction.type] += transaction.amount;
      });

      stats.net_amount = stats.total_income - stats.total_expense;

      return stats;
    } catch (error) {
      console.error('Failed to get transaction stats:', error);
      return {
        total_income: 0,
        total_expense: 0,
        net_amount: 0,
        transaction_count: 0,
        category_breakdown: {},
        monthly_trends: {}
      };
    }
  }
};

/**
 * Category Database Operations
 */
export const categoryDB = {
  /**
   * Get categories for user type
   * @param {'husband'|'wife'|'both'} userType - User type
   * @returns {Promise<import('../types/index.js').Category[]>}
   */
  async getCategories(userType = 'both') {
    try {
      let query = supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .order('sort_order', { ascending: true });

      if (userType !== 'both') {
        query = query.or(`user_type.eq.${userType},user_type.eq.both`);
      }

      const { data } = await dbHelpers.executeQuery(query, 'get categories');

      return data || [];
    } catch (error) {
      console.error('Failed to get categories:', error);
      return [];
    }
  },

  /**
   * Create custom category
   * @param {Object} categoryData - Category data
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async createCategory(categoryData) {
    try {
      const category = {
        ...categoryData,
        is_default: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      const query = supabase
        .from(TABLES.CATEGORIES)
        .insert([category])
        .select('*');

      const { data } = await dbHelpers.executeQuery(query, 'create category');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to create category:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }
};

/**
 * Grocery Database Operations
 */
export const groceryDB = {
  /**
   * Get grocery items with filters
   * @param {import('../types/index.js').GroceryFilters} filters - Filter criteria
   * @returns {Promise<import('../types/index.js').GroceryItem[]>}
   */
  async getGroceryItems(filters = {}) {
    try {
      let query = supabase
        .from(TABLES.GROCERY_ITEMS)
        .select(`
          *,
          user:profiles(*)
        `)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status === 'remaining') {
        query = query.eq('is_completed', false);
      } else if (filters.status === 'completed') {
        query = query.eq('is_completed', true);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters.store) {
        query = query.eq('store', filters.store);
      }

      const { data } = await dbHelpers.executeQuery(query, 'get grocery items');

      return data || [];
    } catch (error) {
      console.error('Failed to get grocery items:', error);
      return [];
    }
  },

  /**
   * Create grocery item
   * @param {import('../types/index.js').GroceryItemFormData} itemData - Item data
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async createGroceryItem(itemData) {
    try {
      const user = await dbHelpers.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const item = {
        user_id: user.id,
        name: itemData.name,
        quantity: itemData.quantity || '1개',
        category: itemData.category || 'household',
        estimated_price: itemData.estimated_price ? parseInt(itemData.estimated_price) : 0,
        priority: itemData.priority || 'medium',
        store: itemData.store || '이마트',
        notes: itemData.notes || null,
        is_completed: false,
        sort_order: 0,
        created_at: new Date(),
        updated_at: new Date()
      };

      const query = supabase
        .from(TABLES.GROCERY_ITEMS)
        .insert([item])
        .select(`
          *,
          user:profiles(*)
        `);

      const { data } = await dbHelpers.executeQuery(query, 'create grocery item');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to create grocery item:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  },

  /**
   * Toggle grocery item completion
   * @param {string} id - Item ID
   * @param {boolean} isCompleted - Completion status
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async toggleGroceryItem(id, isCompleted) {
    try {
      const user = await dbHelpers.getCurrentUser();
      
      const updates = {
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date() : null,
        completed_by: isCompleted ? user?.id : null,
        updated_at: new Date()
      };

      const query = supabase
        .from(TABLES.GROCERY_ITEMS)
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          user:profiles(*)
        `);

      const { data } = await dbHelpers.executeQuery(query, 'toggle grocery item');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to toggle grocery item:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  },

  /**
   * Delete grocery item
   * @param {string} id - Item ID
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async deleteGroceryItem(id) {
    try {
      const query = supabase
        .from(TABLES.GROCERY_ITEMS)
        .delete()
        .eq('id', id);

      await dbHelpers.executeQuery(query, 'delete grocery item');

      return {
        data: { id },
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to delete grocery item:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }
};

/**
 * Recipe Database Operations
 */
export const recipeDB = {
  /**
   * Get recipes with ingredients
   * @param {Object} options - Query options
   * @returns {Promise<import('../types/index.js').Recipe[]>}
   */
  async getRecipes(options = {}) {
    try {
      let query = supabase
        .from(TABLES.RECIPES)
        .select(`
          *,
          ingredients:recipe_ingredients(*),
          user:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (options.favorites_only) {
        query = query.eq('is_favorite', true);
      }

      if (options.user_id) {
        query = query.eq('user_id', options.user_id);
      }

      const { data } = await dbHelpers.executeQuery(query, 'get recipes');

      return data || [];
    } catch (error) {
      console.error('Failed to get recipes:', error);
      return [];
    }
  },

  /**
   * Get single recipe with full details
   * @param {string} id - Recipe ID
   * @returns {Promise<import('../types/index.js').Recipe|null>}
   */
  async getRecipe(id) {
    try {
      const query = supabase
        .from(TABLES.RECIPES)
        .select(`
          *,
          ingredients:recipe_ingredients(*),
          user:profiles(*)
        `)
        .eq('id', id)
        .single();

      const { data } = await dbHelpers.executeQuery(query, 'get recipe');

      return data || null;
    } catch (error) {
      console.error('Failed to get recipe:', error);
      return null;
    }
  },

  /**
   * Create new recipe
   * @param {Object} recipeData - Recipe data
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async createRecipe(recipeData) {
    try {
      const user = await dbHelpers.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const recipe = {
        user_id: user.id,
        name: recipeData.name,
        description: recipeData.description || null,
        prep_time: recipeData.prep_time || 0,
        cook_time: recipeData.cook_time || 0,
        servings: recipeData.servings || 1,
        difficulty: recipeData.difficulty || 'medium',
        calories: recipeData.calories || 0,
        instructions: recipeData.instructions || [],
        tags: recipeData.tags || [],
        is_favorite: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      const query = supabase
        .from(TABLES.RECIPES)
        .insert([recipe])
        .select(`
          *,
          ingredients:recipe_ingredients(*),
          user:profiles(*)
        `);

      const { data } = await dbHelpers.executeQuery(query, 'create recipe');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to create recipe:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  },

  /**
   * Toggle recipe favorite status
   * @param {string} id - Recipe ID
   * @param {boolean} isFavorite - Favorite status
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async toggleRecipeFavorite(id, isFavorite) {
    try {
      const query = supabase
        .from(TABLES.RECIPES)
        .update({ 
          is_favorite: isFavorite,
          updated_at: new Date()
        })
        .eq('id', id)
        .select('*');

      const { data } = await dbHelpers.executeQuery(query, 'toggle recipe favorite');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to toggle recipe favorite:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  },

  /**
   * Create recipe ingredient
   * @param {Object} ingredientData - Ingredient data
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async createRecipeIngredient(ingredientData) {
    try {
      const ingredient = {
        recipe_id: ingredientData.recipe_id,
        name: ingredientData.name,
        quantity: ingredientData.quantity,
        unit: ingredientData.unit || null,
        notes: ingredientData.notes || null,
        created_at: new Date()
      };

      const query = supabase
        .from(TABLES.RECIPE_INGREDIENTS)
        .insert([ingredient])
        .select('*');

      const { data } = await dbHelpers.executeQuery(query, 'create recipe ingredient');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to create recipe ingredient:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }
};

/**
 * Meal Plan Database Operations
 */
export const mealPlanDB = {
  /**
   * Get meal plans with filters
   * @param {import('../types/index.js').MealPlanFilters} filters - Filter criteria
   * @returns {Promise<import('../types/index.js').MealPlan[]>}
   */
  async getMealPlans(filters) {
    try {
      let query = supabase
        .from(TABLES.MEAL_PLANS)
        .select(`
          *,
          recipe:recipes(*, ingredients:recipe_ingredients(*)),
          user:profiles(*),
          preparer:profiles(*)
        `)
        .gte('date', filters.start_date.toISOString())
        .lte('date', filters.end_date.toISOString())
        .order('date', { ascending: true })
        .order('meal_type', { ascending: true });

      if (filters.meal_type) {
        query = query.eq('meal_type', filters.meal_type);
      }

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters.only_completed) {
        query = query.eq('is_completed', true);
      }

      const { data } = await dbHelpers.executeQuery(query, 'get meal plans');

      return data || [];
    } catch (error) {
      console.error('Failed to get meal plans:', error);
      return [];
    }
  },

  /**
   * Create meal plan
   * @param {Object} mealPlanData - Meal plan data
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async createMealPlan(mealPlanData) {
    try {
      const user = await dbHelpers.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const mealPlan = {
        user_id: user.id,
        date: mealPlanData.date,
        meal_type: mealPlanData.meal_type,
        recipe_id: mealPlanData.recipe_id || null,
        custom_meal_name: mealPlanData.custom_meal_name || null,
        notes: mealPlanData.notes || null,
        is_completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      const query = supabase
        .from(TABLES.MEAL_PLANS)
        .insert([mealPlan])
        .select(`
          *,
          recipe:recipes(*, ingredients:recipe_ingredients(*)),
          user:profiles(*)
        `);

      const { data } = await dbHelpers.executeQuery(query, 'create meal plan');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to create meal plan:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  },

  /**
   * Delete meal plan
   * @param {string} id - Meal plan ID
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async deleteMealPlan(id) {
    try {
      const query = supabase
        .from(TABLES.MEAL_PLANS)
        .delete()
        .eq('id', id);

      await dbHelpers.executeQuery(query, 'delete meal plan');

      return {
        data: { id },
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to delete meal plan:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  },

  /**
   * Toggle meal plan completion status
   * @param {string} id - Meal plan ID
   * @param {boolean} isCompleted - Completion status
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async toggleMealPlanCompletion(id, isCompleted) {
    try {
      const query = supabase
        .from(TABLES.MEAL_PLANS)
        .update({ 
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date() : null,
          updated_at: new Date()
        })
        .eq('id', id)
        .select(`
          *,
          recipe:recipes(*, ingredients:recipe_ingredients(*)),
          user:profiles(*)
        `);

      const { data } = await dbHelpers.executeQuery(query, 'toggle meal plan completion');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to toggle meal plan completion:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  },

  /**
   * Update meal plan
   * @param {string} id - Meal plan ID
   * @param {Object} updateData - Update data
   * @returns {Promise<import('../types/index.js').ApiResponse>}
   */
  async updateMealPlan(id, updateData) {
    try {
      const query = supabase
        .from(TABLES.MEAL_PLANS)
        .update({ 
          ...updateData,
          updated_at: new Date()
        })
        .eq('id', id)
        .select(`
          *,
          recipe:recipes(*, ingredients:recipe_ingredients(*)),
          user:profiles(*)
        `);

      const { data } = await dbHelpers.executeQuery(query, 'update meal plan');

      return {
        data: data?.[0] || null,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Failed to update meal plan:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }
};

export default {
  transactionDB,
  categoryDB,
  groceryDB,
  recipeDB,
  mealPlanDB
};