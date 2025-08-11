import React from 'react';
import Character from '../../atoms/Character';
import Button from '../../atoms/Button';

const EmptyState = ({ 
  type = 'transactions', 
  onAction,
  className = '' 
}) => {
  const getEmptyStateContent = (type) => {
    switch (type) {
      case 'transactions':
        return {
          character: <Character type="potato" size="xl" expression="sad" />,
          title: '거래 내역이 없어요',
          description: '첫 거래를 추가해서 가계부를 시작해보세요.\n수입과 지출을 기록하면 더 나은 가계 관리를 할 수 있어요!',
          actionText: '첫 거래 추가하기',
          speechBubble: '아직 거래 내역이 없네요!'
        };
      case 'meals':
        return {
          character: <Character type="rabbit" size="xl" expression="default" />,
          title: '식단 계획을 세워보세요',
          description: '일주일 식단을 미리 계획하면\n장보기도 쉬워지고 음식 낭비도 줄일 수 있어요!',
          actionText: '이번 주 식단 계획하기',
          thoughtBubble: '오늘 뭐 먹지?',
          floatingItems: ['🍽️', '🥗', '🍚']
        };
      case 'recipes':
        return {
          character: (
            <div className="flex items-center gap-4">
              <Character type="potato" size="xl" expression="happy" />
              <Character type="rabbit" size="xl" expression="excited" />
            </div>
          ),
          title: '나만의 레시피북을 만들어보세요',
          description: '자주 만드는 요리의 레시피를 저장해두면\n다음에 요리할 때 편리해요!',
          actionText: '나만의 레시피 추가',
          secondaryActionText: '레시피 검색하기',
          cookingItems: ['🍲', '📖', '👨‍🍳']
        };
      case 'grocery':
        return {
          character: <Character type="rabbit" size="xl" expression="happy" />,
          title: '장보기 목록을 만들어보세요',
          description: '필요한 물건들을 미리 적어두면\n마트에서 빠뜨리지 않고 쇼핑할 수 있어요!',
          actionText: '장보기 목록 만들기',
          shoppingCart: '🛒',
          floatingItems: ['🥛', '🥕', '🍞', '🧅']
        };
      case 'search':
        return {
          character: <Character type="potato" size="xl" expression="sad" />,
          title: '검색 결과가 없어요',
          description: '다른 검색어로 다시 시도해보세요.\n혹시 오타는 없었나요?',
          actionText: '검색어 다시 입력',
          searchIcon: '🔍',
          questionMarks: ['?', '?', '?']
        };
      case 'error':
        return {
          character: (
            <div className="flex items-center gap-4">
              <Character type="potato" size="xl" expression="sad" />
              <Character type="rabbit" size="xl" expression="sad" />
            </div>
          ),
          title: '앗, 문제가 발생했어요',
          description: '네트워크 연결을 확인하고\n잠시 후 다시 시도해주세요.',
          actionText: '다시 시도하기',
          errorSymbol: '⚠️'
        };
      default:
        return {
          character: <Character type="potato" size="xl" />,
          title: '내용이 없어요',
          description: '새로운 내용을 추가해보세요.',
          actionText: '추가하기'
        };
    }
  };

  const content = getEmptyStateContent(type);

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 min-h-96 ${className}`}>
      {/* Illustration Area */}
      <div className="relative mb-8 flex flex-col items-center gap-4">
        {/* Characters */}
        <div className="relative">
          {content.character}
          
          {/* Speech/Thought Bubble */}
          {(content.speechBubble || content.thoughtBubble) && (
            <div className="absolute -top-4 -right-4 bg-surface-white border-2 border-potato-primary rounded-lg p-2 shadow-md animate-fade-in">
              <div className="text-sm font-medium text-text-dark whitespace-nowrap">
                {content.speechBubble || content.thoughtBubble}
              </div>
              <div className="absolute bottom-0 left-1/2 transform translate-y-full -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-potato-primary"></div>
            </div>
          )}
        </div>

        {/* Floating Items */}
        {content.floatingItems && (
          <div className="absolute inset-0 pointer-events-none">
            {content.floatingItems.map((item, index) => (
              <span
                key={index}
                className={`absolute text-2xl opacity-70 animate-bounce`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  top: `${20 + index * 15}%`,
                  left: `${10 + index * 25}%`
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Special Icons */}
        {content.shoppingCart && (
          <div className="text-3xl animate-bounce">
            {content.shoppingCart}
          </div>
        )}
        
        {content.searchIcon && (
          <div className="text-3xl">
            {content.searchIcon}
          </div>
        )}
        
        {content.errorSymbol && (
          <div className="text-4xl text-expense animate-pulse">
            {content.errorSymbol}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-sm">
        <h3 className="text-xl font-bold text-text-dark mb-4">
          {content.title}
        </h3>
        <p className="text-base text-text-medium leading-relaxed mb-6 whitespace-pre-line">
          {content.description}
        </p>
        
        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          {content.actionText && (
            <Button
              variant="primary"
              onClick={onAction}
              className="w-full"
            >
              {content.actionText}
            </Button>
          )}
          {content.secondaryActionText && (
            <Button
              variant="outline"
              onClick={onAction}
              className="w-full"
            >
              {content.secondaryActionText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;