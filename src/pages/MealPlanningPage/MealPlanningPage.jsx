import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import Badge from '../../components/atoms/Badge';
import Character from '../../components/atoms/Character';
import EmptyState from '../../components/molecules/EmptyState';
import useMealPlans from '../../hooks/useMealPlans.js';
import useRecipes from '../../hooks/useRecipes.js';
import { 
  ArrowLeftIcon, 
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  HeartIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';

const MealPlanningPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('weekly'); // 'weekly', 'recipes'
  const [selectedDay, setSelectedDay] = useState('today');
  const [selectedMealType, setSelectedMealType] = useState('all'); // 'all', 'breakfast', 'lunch', 'dinner'

  // Date filters for current week
  const weekFilters = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));
    
    return {
      start_date: startOfWeek,
      end_date: endOfWeek
    };
  }, []);

  // Load meal plans with real-time updates
  const {
    weeklyPlan,
    stats: mealStats,
    isLoading: mealsLoading,
    isError: mealsError,
    error: mealError,
    createMealPlan,
    deleteMealPlan,
    toggleMealCompletion,
    getMealsForDate
  } = useMealPlans({
    filters: weekFilters,
    realtime: true,
    autoLoad: true,
    groupByDate: true
  });

  // Load recipes for recipe tab
  const {
    recipes,
    favoriteRecipes,
    stats: recipeStats,
    isLoading: recipesLoading,
    isError: recipesError,
    error: recipeError,
    toggleFavorite,
    refresh: refreshRecipes
  } = useRecipes({
    realtime: true,
    autoLoad: activeTab === 'recipes'
  });

  // Get selected day's meals
  const getSelectedDayMeals = useMemo(() => {
    if (!weeklyPlan || weeklyPlan.length === 0) return [];
    
    // Find the selected day from weekly plan
    const selectedDayData = weeklyPlan.find(day => {
      if (selectedDay === 'today') {
        return day.dateObj.toDateString() === new Date().toDateString();
      } else if (selectedDay === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return day.dateObj.toDateString() === tomorrow.toDateString();
      }
      return day.date === selectedDay;
    });
    
    return selectedDayData ? Object.values(selectedDayData.meals).filter(meal => meal) : [];
  }, [weeklyPlan, selectedDay]);

  // Filter recipes based on meal type if needed
  const filteredRecipes = useMemo(() => {
    if (selectedMealType === 'all') return favoriteRecipes || [];
    // For now, return all recipes - can add meal type filtering later
    return favoriteRecipes || [];
  }, [favoriteRecipes, selectedMealType]);

  // Get selected day's display info
  const getSelectedDayInfo = useMemo(() => {
    if (!weeklyPlan || weeklyPlan.length === 0) {
      return {
        date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }),
        hasData: false
      };
    }
    
    // Find the selected day from weekly plan
    const selectedDayData = weeklyPlan.find(day => {
      if (selectedDay === 'today') {
        return day.dateObj.toDateString() === new Date().toDateString();
      } else if (selectedDay === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return day.dateObj.toDateString() === tomorrow.toDateString();
      }
      return day.date === selectedDay;
    });
    
    return {
      date: selectedDayData ? selectedDayData.displayDate : '계획된 식단이 없습니다',
      hasData: !!selectedDayData
    };
  }, [weeklyPlan, selectedDay]);

  // Get mapped recipe data for compatibility with existing UI
  const getMappedRecipeData = useCallback((recipe) => {
    return {
      id: recipe.id,
      name: recipe.name,
      cookingTime: (recipe.prep_time || 0) + (recipe.cook_time || 0),
      difficulty: recipe.difficulty === 'easy' ? '쉬움' : recipe.difficulty === 'medium' ? '보통' : '어려움',
      calories: recipe.calories || 0,
      rating: recipe.rating || 4.5,
      isLiked: recipe.is_favorite,
      tags: recipe.tags || [],
      image: recipe.image || '🍽️',
      ingredients: recipe.ingredients?.map(ing => ing.name) || [],
      description: recipe.description || '맛있는 요리'
    };
  }, []);

  // Mock fallback recipes (removed)
  const mockFavoriteRecipes = [
    {
      id: '1',
      name: '간장계란밥',
      cookingTime: 15,
      difficulty: '쉬움',
      calories: 420,
      rating: 4.8,
      isLiked: true,
      tags: ['간단', '한식', '밥'],
      image: '🍚',
      ingredients: ['계란', '간장', '참기름', '파', '밥'],
      description: '간단하고 맛있는 한�끼 요리'
    },
    {
      id: '2',
      name: '크림파스타',
      cookingTime: 25,
      difficulty: '보통',
      calories: 520,
      rating: 4.6,
      isLiked: false,
      tags: ['양식', '파스타', '크림'],
      image: '🍝',
      ingredients: ['파스타', '생크림', '마늘', '버섯', '파르메산치즈'],
      description: '부드럽고 진한 크림파스타'
    },
    {
      id: '3',
      name: '김치찌개',
      cookingTime: 30,
      difficulty: '쉬움',
      calories: 380,
      rating: 4.9,
      isLiked: true,
      tags: ['한식', '찌개', '김치'],
      image: '🍲',
      ingredients: ['김치', '돼지고기', '두부', '파', '고춧가루'],
      description: '집밥의 대표, 김치찌개'
    }
  ];

  const weekDays = useMemo(() => {
    if (!weeklyPlan || weeklyPlan.length === 0) {
      // Fallback static data if no weekly plan loaded
      const today = new Date();
      const days = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        let label, key;
        if (i === 0) {
          label = '오늘';
          key = 'today';
        } else if (i === 1) {
          label = '내일';
          key = 'tomorrow';
        } else {
          label = date.toLocaleDateString('ko-KR', { weekday: 'short' });
          key = `day${i + 1}`;
        }
        
        days.push({
          key,
          label,
          date: date.toLocaleDateString('ko-KR', { day: 'numeric', weekday: 'short' }),
          dateObj: date,
          mealCount: 0
        });
      }
      
      return days;
    }

    // Use real weekly plan data
    return weeklyPlan.map((day, index) => {
      let label, key;
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (day.dateObj.toDateString() === today.toDateString()) {
        label = '오늘';
        key = 'today';
      } else if (day.dateObj.toDateString() === tomorrow.toDateString()) {
        label = '내일';
        key = 'tomorrow';
      } else {
        label = day.dateObj.toLocaleDateString('ko-KR', { weekday: 'short' });
        key = `day${index + 1}`;
      }
      
      return {
        key,
        label,
        date: day.displayDate,
        dateObj: day.dateObj,
        mealCount: day.totalPlans || 0
      };
    });
  }, [weeklyPlan]);

  const mealTypes = [
    { key: 'breakfast', label: '아침', icon: '🌅' },
    { key: 'lunch', label: '점심', icon: '☀️' },
    { key: 'dinner', label: '저녁', icon: '🌙' }
  ];

  const handleAddMeal = async (day, mealType) => {
    // Navigate to meal addition page with context
    navigate(`/meal/add?day=${day}&type=${mealType}`);
  };

  const handleCreateMealPlan = async (mealPlanData) => {
    try {
      await createMealPlan(mealPlanData);
    } catch (error) {
      console.error('식단 추가 실패:', error);
      alert('식단 추가에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteMealPlan = async (mealPlanId) => {
    if (window.confirm('이 식단을 삭제하시겠습니까?')) {
      try {
        await deleteMealPlan(mealPlanId);
      } catch (error) {
        console.error('식단 삭제 실패:', error);
        alert('식단 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleToggleMealCompletion = async (mealPlanId, isCompleted) => {
    try {
      await toggleMealCompletion(mealPlanId, isCompleted);
    } catch (error) {
      console.error('식단 완료 상태 변경 실패:', error);
      alert('식단 완료 상태 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleAddRecipe = () => {
    navigate('/recipe/add');
  };

  const handleRecipeDetail = (recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleToggleRecipeFavorite = async (recipeId) => {
    try {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return;
      
      await toggleFavorite(recipeId, !recipe.is_favorite);
    } catch (error) {
      console.error('레시피 즐겨찾기 변경 실패:', error);
      alert('레시피 즐겨찾기 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleAddRecipeToMealPlan = async (recipeId, date = new Date(), mealType = 'dinner') => {
    try {
      const mealPlanData = {
        date: date.toISOString(),
        meal_type: mealType,
        recipe_id: recipeId,
        notes: null
      };
      
      await createMealPlan(mealPlanData);
      alert('레시피가 식단에 추가되었습니다!');
    } catch (error) {
      console.error('레시피 식단 추가 실패:', error);
      alert('레시피를 식단에 추가하는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  const getDayMeals = (day) => {
    if (!weeklyPlan || weeklyPlan.length === 0) return [];
    
    // Find the selected day from weekly plan
    const selectedDayData = weeklyPlan.find(dayData => {
      if (day === 'today') {
        return dayData.dateObj.toDateString() === new Date().toDateString();
      } else if (day === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return dayData.dateObj.toDateString() === tomorrow.toDateString();
      }
      return dayData.date === day;
    });
    
    return selectedDayData ? Object.values(selectedDayData.meals).filter(meal => meal) : [];
  };

  const getMealTypeColor = (type) => {
    switch (type) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800';
      case 'lunch': return 'bg-blue-100 text-blue-800';
      case 'dinner': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderWeeklyView = () => (
    <div className="space-y-4">
      {/* Week Calendar */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-dark">이번 주 식단</h3>
          <Button variant="ghost" size="sm" className="text-potato-600 hover:text-potato-700">
            <CalendarDaysIcon className="w-4 h-4 mr-1" />
            달력 보기
          </Button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weekDays.map((day) => (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              className={`min-w-[80px] p-3 rounded-xl border-2 transition-all duration-200 ${
                selectedDay === day.key
                  ? 'border-potato-primary bg-potato-50'
                  : 'border-border-light bg-surface-white hover:border-potato-200'
              }`}
            >
              <div className="text-sm font-medium text-text-dark">{day.label}</div>
              <div className="text-xs text-text-medium mt-1">{day.date}</div>
              {getDayMeals(day.key).length > 0 && (
                <div className="mt-1">
                  <Badge variant="secondary" size="sm">{getDayMeals(day.key).length}</Badge>
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Daily Meals */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-dark">
            {mealsLoading ? (
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            ) : (
              getSelectedDayInfo.date
            )}
          </h3>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => handleAddMeal(selectedDay, 'breakfast')}
            disabled={mealsLoading}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            추가
          </Button>
        </div>

        {mealsLoading ? (
          <div className="space-y-4">
            {mealTypes.map((mealType) => (
              <div key={mealType.key} className="border-b border-border-light last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{mealType.icon}</span>
                    <span className="font-medium text-text-dark">{mealType.label}</span>
                  </div>
                </div>
                <div className="bg-background-cream rounded-lg p-4 animate-pulse">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div>
                      <div className="w-32 h-5 bg-gray-200 rounded mb-1"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : getDayMeals(selectedDay).length > 0 ? (
          <div className="space-y-4">
            {mealTypes.map((mealType) => {
              const meal = getDayMeals(selectedDay).find(m => m.meal_type === mealType.key);
              
              return (
                <div key={mealType.key} className="border-b border-border-light last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mealType.icon}</span>
                      <span className="font-medium text-text-dark">{mealType.label}</span>
                      <Badge variant={getMealTypeColor(mealType.key).includes('yellow') ? 'warning' : mealType.key === 'lunch' ? 'info' : 'secondary'} size="sm">
                        {mealType.label}
                      </Badge>
                    </div>
                    {!meal && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddMeal(selectedDay, mealType.key)}
                      >
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {meal ? (
                    <div className="bg-background-cream rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">
                              {meal.recipe?.image || (meal.custom_meal_name ? '🍽️' : '🥘')}
                            </span>
                            <div>
                              <h4 className="font-semibold text-text-dark">
                                {meal.recipe?.name || meal.custom_meal_name || '커스텀 식사'}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-text-medium">
                                <span className="flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  {new Date(meal.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {meal.recipe?.calories && (
                                  <span>{meal.recipe.calories}kcal</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {meal.user && (
                            <div className="flex items-center gap-2 mb-2">
                              <Character 
                                type={meal.user.user_type === 'wife' ? 'rabbit' : 'potato'} 
                                size="sm" 
                              />
                              <span className="text-sm text-text-medium">
                                {meal.user.name || (meal.user.user_type === 'wife' ? '영희' : '철수')}가 계획
                              </span>
                            </div>
                          )}

                          {meal.recipe?.ingredients && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {meal.recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                                <Badge key={index} variant="outline" size="sm">
                                  {ingredient.name}
                                </Badge>
                              ))}
                              {meal.recipe.ingredients.length > 3 && (
                                <Badge variant="outline" size="sm">
                                  +{meal.recipe.ingredients.length - 3}개
                                </Badge>
                              )}
                            </div>
                          )}

                          {meal.notes && (
                            <p className="text-sm text-text-medium mt-2">
                              {meal.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-text-medium hover:text-text-dark"
                            onClick={() => handleToggleMealCompletion(meal.id, !meal.is_completed)}
                          >
                            {meal.is_completed ? (
                              <CheckIconSolid className="w-4 h-4 text-green-600" />
                            ) : (
                              <CheckIcon className="w-4 h-4" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-text-medium hover:text-red-600"
                            onClick={() => handleDeleteMealPlan(meal.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border-light rounded-lg p-8 text-center">
                      <div className="text-4xl mb-2">{mealType.icon}</div>
                      <p className="text-text-medium mb-3">
                        {mealType.label} 식단을 계획해보세요
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddMeal(selectedDay, mealType.key)}
                      >
                        식단 추가
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            type="meals"
            title="계획된 식단이 없어요"
            description="오늘의 식단을 계획해보세요"
            actionText="식단 추가하기"
            onAction={() => handleAddMeal(selectedDay, 'breakfast')}
          />
        )}
      </Card>

      {/* Weekly Stats */}
      <Card>
        <h3 className="text-lg font-semibold text-text-dark mb-4">이번 주 통계</h3>
        {mealsLoading ? (
          <div className="grid grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-potato-600 mb-1">{mealStats.total || 0}</div>
              <div className="text-sm text-text-medium">계획된 식사</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-rabbit-600 mb-1">{mealStats.completed || 0}</div>
              <div className="text-sm text-text-medium">완료된 식사</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-dark mb-1">{mealStats.avgCalories || 0}</div>
              <div className="text-sm text-text-medium">평균 칼로리</div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderRecipesView = () => (
    <div className="space-y-4">
      {/* Recipes Header */}
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-dark">즐겨찾는 레시피</h3>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddRecipe}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            레시피 추가
          </Button>
        </div>
      </Card>

      {/* Recipe Grid */}
      {recipesLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="none" className="overflow-hidden animate-pulse">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div>
                      <div className="w-32 h-5 bg-gray-200 rounded mb-1"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="flex gap-2 mb-3">
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : recipesError ? (
        <Card>
          <div className="text-center p-6">
            <p className="text-text-medium mb-2">레시피를 불러올 수 없습니다</p>
            <Button variant="outline" size="sm" onClick={refreshRecipes}>
              다시 시도
            </Button>
          </div>
        </Card>
      ) : favoriteRecipes && favoriteRecipes.length > 0 ? (
        <div className="grid gap-4">
          {favoriteRecipes.map((recipe) => {
            const mappedRecipe = getMappedRecipeData(recipe);
            return (
              <Card key={mappedRecipe.id} padding="none" className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{mappedRecipe.image}</div>
                      <div>
                        <h4 className="font-semibold text-text-dark">{mappedRecipe.name}</h4>
                        <p className="text-sm text-text-medium">{mappedRecipe.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleRecipeFavorite(recipe.id)}
                      className="text-xl"
                    >
                      {mappedRecipe.isLiked ? (
                        <HeartIconSolid className="w-6 h-6 text-red-500" />
                      ) : (
                        <HeartIcon className="w-6 h-6 text-text-medium hover:text-red-500" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm text-text-medium">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {mappedRecipe.cookingTime}분
                    </span>
                    <span>{mappedRecipe.difficulty}</span>
                    <span>{mappedRecipe.calories}kcal</span>
                    <span>⭐ {mappedRecipe.rating}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {mappedRecipe.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {mappedRecipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {ingredient}
                        </Badge>
                      ))}
                      {mappedRecipe.ingredients.length > 3 && (
                        <Badge variant="outline" size="sm">
                          +{mappedRecipe.ingredients.length - 3}개
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddRecipeToMealPlan(recipe.id)}
                      >
                        식단에 추가
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRecipeDetail(recipe)}
                      >
                        자세히 보기
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="text-center p-6">
            <div className="text-4xl mb-2">📝</div>
            <h4 className="font-semibold text-text-dark mb-2">즐겨찾는 레시피가 없어요</h4>
            <p className="text-text-medium mb-3">
              자주 만드는 요리를 레시피로 저장해보세요
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddRecipe}
            >
              레시피 추가하기
            </Button>
          </div>
        </Card>
      )}

      {/* Add Recipe Card - only show when we have recipes */}
      {favoriteRecipes && favoriteRecipes.length > 0 && (
        <Card className="border-2 border-dashed border-border-light hover:border-potato-300 transition-colors duration-200">
          <button
            onClick={handleAddRecipe}
            className="w-full text-center py-8"
          >
            <div className="text-4xl mb-2">👨‍🍳</div>
            <h4 className="font-semibold text-text-dark mb-2">새 레시피 추가</h4>
            <p className="text-text-medium">
              자주 만드는 요리를 레시피로 저장해보세요
            </p>
          </button>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background-cream pb-24">
      {/* Header */}
      <div className="bg-surface-white border-b border-border-light p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-text-medium hover:text-text-dark"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold text-text-dark">식단 계획</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-4">
        <Card padding="sm">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'weekly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('weekly')}
              className="flex-1"
            >
              주간 식단
            </Button>
            <Button
              variant={activeTab === 'recipes' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('recipes')}
              className="flex-1"
            >
              레시피 모음
            </Button>
          </div>
        </Card>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'weekly' ? renderWeeklyView() : renderRecipesView()}
      </div>
    </div>
  );
};

export default MealPlanningPage;