import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file:\n' +
    '- VITE_SUPABASE_URL or REACT_APP_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY or REACT_APP_SUPABASE_ANON_KEY'
  );
}

// Create Supabase client with additional configurations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-client-info': 'couple-budget-app@1.0.0'
    }
  }
});

// Database table names - centralized for consistency
export const TABLES = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  GROCERY_ITEMS: 'grocery_items',
  MEAL_PLANS: 'meal_plans',
  RECIPES: 'recipes',
  RECIPE_INGREDIENTS: 'recipe_ingredients',
  PROFILES: 'profiles'
};

// Real-time subscription channels
export const CHANNELS = {
  TRANSACTIONS: 'transactions-changes',
  GROCERY: 'grocery-changes',
  MEALS: 'meal-changes'
};

// Database helper functions
export const dbHelpers = {
  // Execute query with error handling
  async executeQuery(queryBuilder, operation = 'query') {
    try {
      const { data, error, count } = await queryBuilder;
      
      if (error) {
        console.error(`Database ${operation} error:`, error);
        throw new Error(error.message || `Failed to execute ${operation}`);
      }

      return { data: data || [], count: count || 0 };
    } catch (err) {
      console.error(`Database operation failed:`, err);
      throw err;
    }
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  // Create real-time subscription
  createRealtimeSubscription(table, callback, filter = '*') {
    return supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        callback
      )
      .subscribe();
  },

  // Format date for database
  formatDateForDB(date = new Date()) {
    return date.toISOString();
  },

  // Parse database date
  parseDBDate(dateString) {
    return new Date(dateString);
  }
};

// Authentication helpers
export const authHelpers = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export default supabase;