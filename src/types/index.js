/**
 * Database Entity Types for Couple Budget App
 * TypeScript-like definitions for JavaScript with JSDoc annotations
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User email
 * @property {string} name - Display name
 * @property {'husband'|'wife'} type - User type in couple
 * @property {string} avatar_url - Profile image URL
 * @property {Date} created_at - Account creation date
 * @property {Date} updated_at - Last update date
 */

/**
 * @typedef {Object} Profile
 * @property {string} id - Profile ID (matches user.id)
 * @property {string} user_id - Foreign key to users table
 * @property {string} full_name - Full name
 * @property {'husband'|'wife'} user_type - Type in couple
 * @property {string} avatar_url - Profile image
 * @property {Object} preferences - User preferences JSON
 * @property {Date} created_at - Profile creation date
 * @property {Date} updated_at - Last update date
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique transaction identifier
 * @property {string} user_id - Foreign key to users table
 * @property {number} amount - Transaction amount (in cents/원)
 * @property {'income'|'expense'} type - Transaction type
 * @property {string} category_id - Foreign key to categories table
 * @property {string} description - Transaction description
 * @property {Date} transaction_date - When transaction occurred
 * @property {string} [notes] - Additional notes
 * @property {string} [receipt_url] - Receipt image URL
 * @property {Object} [metadata] - Additional data JSON
 * @property {Date} created_at - Record creation date
 * @property {Date} updated_at - Last update date
 * @property {Category} [category] - Expanded category data
 * @property {Profile} [user] - Expanded user data
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Unique category identifier
 * @property {string} name - Category name
 * @property {string} icon - Emoji or icon identifier
 * @property {string} color - Color hex code
 * @property {'income'|'expense'} type - Category type
 * @property {'husband'|'wife'|'both'} user_type - Which user can use this category
 * @property {boolean} is_default - Whether this is a default category
 * @property {number} sort_order - Display order
 * @property {Date} created_at - Category creation date
 * @property {Date} updated_at - Last update date
 */

/**
 * @typedef {Object} GroceryItem
 * @property {string} id - Unique grocery item identifier
 * @property {string} user_id - Foreign key to users table
 * @property {string} name - Item name
 * @property {string} [quantity] - Quantity description
 * @property {string} [category] - Item category
 * @property {number} [estimated_price] - Estimated price in cents
 * @property {'high'|'medium'|'low'} priority - Item priority
 * @property {boolean} is_completed - Whether item is checked off
 * @property {Date} [completed_at] - When item was completed
 * @property {string} [completed_by] - User ID who completed item
 * @property {string} [store] - Preferred store
 * @property {string} [notes] - Additional notes
 * @property {number} sort_order - Display order
 * @property {Date} created_at - Item creation date
 * @property {Date} updated_at - Last update date
 * @property {Profile} [user] - Expanded user data
 */

/**
 * @typedef {Object} Recipe
 * @property {string} id - Unique recipe identifier
 * @property {string} user_id - Foreign key to users table (recipe creator)
 * @property {string} name - Recipe name
 * @property {string} [description] - Recipe description
 * @property {number} prep_time - Preparation time in minutes
 * @property {number} cook_time - Cooking time in minutes
 * @property {number} servings - Number of servings
 * @property {'easy'|'medium'|'hard'} difficulty - Recipe difficulty
 * @property {string[]} instructions - Cooking instructions array
 * @property {number} [calories_per_serving] - Calories per serving
 * @property {string[]} [tags] - Recipe tags array
 * @property {string} [image_url] - Recipe image URL
 * @property {boolean} is_favorite - Whether recipe is favorited
 * @property {number} rating - User rating (1-5)
 * @property {Date} created_at - Recipe creation date
 * @property {Date} updated_at - Last update date
 * @property {RecipeIngredient[]} [ingredients] - Recipe ingredients
 * @property {Profile} [user] - Expanded user data
 */

/**
 * @typedef {Object} RecipeIngredient
 * @property {string} id - Unique ingredient identifier
 * @property {string} recipe_id - Foreign key to recipes table
 * @property {string} name - Ingredient name
 * @property {string} amount - Amount description
 * @property {string} [unit] - Unit of measurement
 * @property {boolean} [is_optional] - Whether ingredient is optional
 * @property {number} sort_order - Display order
 * @property {Date} created_at - Ingredient creation date
 */

/**
 * @typedef {Object} MealPlan
 * @property {string} id - Unique meal plan identifier
 * @property {string} user_id - Foreign key to users table
 * @property {Date} date - Meal date
 * @property {'breakfast'|'lunch'|'dinner'|'snack'} meal_type - Type of meal
 * @property {string} [recipe_id] - Foreign key to recipes table
 * @property {string} [custom_meal_name] - Custom meal name (if not using recipe)
 * @property {string} [notes] - Meal notes
 * @property {boolean} is_completed - Whether meal was prepared/eaten
 * @property {Date} [completed_at] - When meal was completed
 * @property {string} [prepared_by] - User ID who prepared meal
 * @property {Date} created_at - Meal plan creation date
 * @property {Date} updated_at - Last update date
 * @property {Recipe} [recipe] - Expanded recipe data
 * @property {Profile} [user] - Expanded user data
 * @property {Profile} [preparer] - Expanded preparer data
 */

/**
 * Hook State Types
 */

/**
 * @typedef {Object} LoadingState
 * @property {boolean} isLoading - Whether operation is in progress
 * @property {boolean} isError - Whether an error occurred
 * @property {string|null} error - Error message if any
 * @property {boolean} isSuccess - Whether operation completed successfully
 */

/**
 * @typedef {Object} CacheState
 * @property {Date} lastFetched - When data was last fetched
 * @property {boolean} isStale - Whether data is considered stale
 * @property {number} refetchInterval - Refetch interval in ms
 */

/**
 * @typedef {Object} TransactionFilters
 * @property {'all'|'income'|'expense'} type - Filter by transaction type
 * @property {string} [category_id] - Filter by category
 * @property {string} [user_id] - Filter by user
 * @property {Date} [start_date] - Filter from date
 * @property {Date} [end_date] - Filter to date
 * @property {number} [min_amount] - Minimum amount filter
 * @property {number} [max_amount] - Maximum amount filter
 */

/**
 * @typedef {Object} TransactionStats
 * @property {number} total_income - Total income amount
 * @property {number} total_expense - Total expense amount
 * @property {number} net_amount - Net amount (income - expense)
 * @property {number} transaction_count - Total number of transactions
 * @property {Object} category_breakdown - Breakdown by category
 * @property {Object} monthly_trends - Monthly trend data
 */

/**
 * @typedef {Object} GroceryFilters
 * @property {'all'|'remaining'|'completed'} status - Filter by completion status
 * @property {string} [category] - Filter by category
 * @property {'high'|'medium'|'low'} [priority] - Filter by priority
 * @property {string} [store] - Filter by store
 */

/**
 * @typedef {Object} MealPlanFilters
 * @property {Date} start_date - Start date for meal plans
 * @property {Date} end_date - End date for meal plans
 * @property {'breakfast'|'lunch'|'dinner'|'snack'} [meal_type] - Filter by meal type
 * @property {string} [user_id] - Filter by user
 * @property {boolean} [only_completed] - Show only completed meals
 */

/**
 * @typedef {Object} RealtimeSubscription
 * @property {function} unsubscribe - Function to unsubscribe from updates
 * @property {string} channel - Channel name
 * @property {boolean} isConnected - Whether subscription is active
 */

/**
 * API Response Types
 */

/**
 * @typedef {Object} ApiResponse
 * @property {any} data - Response data
 * @property {string|null} error - Error message if any
 * @property {boolean} success - Whether operation was successful
 * @property {Object} [meta] - Additional metadata
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {any[]} data - Response data array
 * @property {number} count - Total count of items
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 * @property {boolean} hasMore - Whether more pages exist
 * @property {string|null} error - Error message if any
 */

/**
 * Form Data Types
 */

/**
 * @typedef {Object} TransactionFormData
 * @property {string} amount - Amount as string for input
 * @property {'income'|'expense'} type - Transaction type
 * @property {string} category_id - Selected category ID
 * @property {string} description - Transaction description
 * @property {string} [notes] - Additional notes
 * @property {Date} [transaction_date] - Transaction date
 */

/**
 * @typedef {Object} GroceryItemFormData
 * @property {string} name - Item name
 * @property {string} [quantity] - Quantity description
 * @property {string} [category] - Item category
 * @property {string} [estimated_price] - Estimated price as string
 * @property {'high'|'medium'|'low'} [priority] - Item priority
 * @property {string} [store] - Preferred store
 * @property {string} [notes] - Additional notes
 */

/**
 * @typedef {Object} RecipeFormData
 * @property {string} name - Recipe name
 * @property {string} [description] - Recipe description
 * @property {string} prep_time - Prep time as string
 * @property {string} cook_time - Cook time as string
 * @property {string} servings - Servings as string
 * @property {'easy'|'medium'|'hard'} difficulty - Recipe difficulty
 * @property {string[]} instructions - Cooking instructions
 * @property {string} [calories_per_serving] - Calories as string
 * @property {string[]} [tags] - Recipe tags
 * @property {RecipeIngredientFormData[]} ingredients - Recipe ingredients
 */

/**
 * @typedef {Object} RecipeIngredientFormData
 * @property {string} name - Ingredient name
 * @property {string} amount - Amount description
 * @property {string} [unit] - Unit of measurement
 * @property {boolean} [is_optional] - Whether ingredient is optional
 */

// Export all types for JSDoc usage
export const Types = {
  User: {},
  Profile: {},
  Transaction: {},
  Category: {},
  GroceryItem: {},
  Recipe: {},
  RecipeIngredient: {},
  MealPlan: {},
  LoadingState: {},
  CacheState: {},
  TransactionFilters: {},
  TransactionStats: {},
  GroceryFilters: {},
  MealPlanFilters: {},
  RealtimeSubscription: {},
  ApiResponse: {},
  PaginatedResponse: {},
  TransactionFormData: {},
  GroceryItemFormData: {},
  RecipeFormData: {},
  RecipeIngredientFormData: {}
};

export default Types;