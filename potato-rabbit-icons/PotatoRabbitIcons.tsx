import React from 'react';

export type EmotionType = 'neutral' | 'success' | 'warning' | 'info' | 'error' | 'loading';
export type CharacterType = 'potato' | 'rabbit';
export type EmptyStateType = 'transactions' | 'meals' | 'loading';

interface IconProps {
  size?: number;
  className?: string;
  'aria-label'?: string;
}

interface CharacterIconProps extends IconProps {
  emotion: EmotionType;
  character: CharacterType;
}

interface EmptyStateProps extends IconProps {
  type: EmptyStateType;
}

// 감자 캐릭터 아이콘 컴포넌트
export const PotatoIcon: React.FC<{ emotion: EmotionType } & IconProps> = ({ 
  emotion, 
  size = 24, 
  className = '', 
  'aria-label': ariaLabel 
}) => {
  const getPotatoSVG = (emotion: EmotionType) => {
    const baseProps = {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      'aria-label': ariaLabel || `${emotion} 감자`,
      role: "img"
    };

    const potatoBody = (
      <>
        <ellipse cx="12" cy="13" rx="7" ry="8" fill="#D4A574" stroke="#8B4513" strokeWidth="1.5"/>
        <circle cx="8" cy="10" r="0.8" fill="#8B4513" opacity="0.3"/>
        <circle cx="16" cy="11" r="0.6" fill="#8B4513" opacity="0.3"/>
        <circle cx="10" cy="18" r="0.7" fill="#8B4513" opacity="0.3"/>
      </>
    );

    const expressions = {
      neutral: (
        <>
          <circle cx="9.5" cy="11" r="1.2" fill="white"/>
          <circle cx="14.5" cy="11" r="1.2" fill="white"/>
          <circle cx="9.5" cy="11" r="0.6" fill="#333"/>
          <circle cx="14.5" cy="11" r="0.6" fill="#333"/>
          <path d="M10 15 Q12 16 14 15" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </>
      ),
      success: (
        <>
          <path d="M8.5 10.5 Q9.5 9.5 10.5 10.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M13.5 10.5 Q14.5 9.5 15.5 10.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M9 14.5 Q12 17 15 14.5" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </>
      ),
      warning: (
        <>
          <path d="M8 9 L10.5 9.5" stroke="#8B4513" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M16 9 L13.5 9.5" stroke="#8B4513" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="9.5" cy="11" r="1.2" fill="white"/>
          <circle cx="14.5" cy="11" r="1.2" fill="white"/>
          <circle cx="9.5" cy="11" r="0.6" fill="#333"/>
          <circle cx="14.5" cy="11" r="0.6" fill="#333"/>
          <path d="M10.5 15.5 Q12 14.5 13.5 15.5" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </>
      ),
      info: (
        <>
          <path d="M8.5 10.5 Q9.5 10 10.5 10.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <circle cx="14.5" cy="11" r="1.2" fill="white"/>
          <circle cx="14.5" cy="11" r="0.6" fill="#333"/>
          <path d="M10.5 15 Q12 16.5 13.5 15" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </>
      ),
      error: (
        <>
          <circle cx="9.5" cy="10.5" r="1.5" fill="white" stroke="#333" strokeWidth="0.5"/>
          <circle cx="14.5" cy="10.5" r="1.5" fill="white" stroke="#333" strokeWidth="0.5"/>
          <circle cx="9.5" cy="10.5" r="0.8" fill="#333"/>
          <circle cx="14.5" cy="10.5" r="0.8" fill="#333"/>
          <ellipse cx="12" cy="15.5" rx="1.5" ry="2" fill="none" stroke="#8B4513" strokeWidth="1.5"/>
        </>
      ),
      loading: (
        <>
          <path d="M8 11 L11 11" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M13 11 L16 11" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M11 15 Q12 15.5 13 15" stroke="#8B4513" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <g opacity="0.6">
            <path d="M17 8 L18.5 8 L17.2 9.5 L18.7 9.5" stroke="#8B4513" strokeWidth="1" fill="none" strokeLinecap="round"/>
          </g>
        </>
      )
    };

    return React.createElement('svg', baseProps, potatoBody, expressions[emotion]);
  };

  return getPotatoSVG(emotion);
};

// 토끼 캐릭터 아이콘 컴포넌트
export const RabbitIcon: React.FC<{ emotion: EmotionType } & IconProps> = ({ 
  emotion, 
  size = 24, 
  className = '', 
  'aria-label': ariaLabel 
}) => {
  const getRabbitSVG = (emotion: EmotionType) => {
    const baseProps = {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      'aria-label': ariaLabel || `${emotion} 토끼`,
      role: "img"
    };

    const expressions = {
      neutral: (
        <>
          <ellipse cx="9" cy="6" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1"/>
          <ellipse cx="15" cy="6" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1"/>
          <ellipse cx="9" cy="6" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5"/>
          <ellipse cx="15" cy="6" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5"/>
          <circle cx="12" cy="14" r="6.5" fill="#E0E0E0" stroke="#808080" strokeWidth="1"/>
          <circle cx="9.5" cy="12" r="1.2" fill="white"/>
          <circle cx="14.5" cy="12" r="1.2" fill="white"/>
          <circle cx="9.5" cy="12" r="0.6" fill="#333"/>
          <circle cx="14.5" cy="12" r="0.6" fill="#333"/>
          <path d="M12 14.5 L11.5 15.5 M12 14.5 L12.5 15.5" stroke="#808080" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M10.5 16.5 Q12 17.5 13.5 16.5" stroke="#808080" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </>
      ),
      success: (
        <>
          <ellipse cx="9" cy="4.5" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1"/>
          <ellipse cx="15" cy="4.5" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1"/>
          <ellipse cx="9" cy="4.5" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5"/>
          <ellipse cx="15" cy="4.5" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5"/>
          <circle cx="12" cy="14" r="6.5" fill="#E0E0E0" stroke="#808080" strokeWidth="1"/>
          <path d="M8.5 11.5 Q9.5 10.5 10.5 11.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M13.5 11.5 Q14.5 10.5 15.5 11.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M12 14.5 L11.5 15.5 M12 14.5 L12.5 15.5" stroke="#808080" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M9.5 16 Q12 18.5 14.5 16" stroke="#808080" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </>
      ),
      warning: (
        <>
          <ellipse cx="9" cy="6.5" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1" transform="rotate(-10 9 6.5)"/>
          <ellipse cx="15" cy="6.5" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1" transform="rotate(10 15 6.5)"/>
          <ellipse cx="9" cy="6.5" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5" transform="rotate(-10 9 6.5)"/>
          <ellipse cx="15" cy="6.5" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5" transform="rotate(10 15 6.5)"/>
          <circle cx="12" cy="14" r="6.5" fill="#E0E0E0" stroke="#808080" strokeWidth="1"/>
          <path d="M8.5 10.5 L10.5 11" stroke="#808080" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M15.5 10.5 L13.5 11" stroke="#808080" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="9.5" cy="12" r="1.2" fill="white"/>
          <circle cx="14.5" cy="12" r="1.2" fill="white"/>
          <circle cx="9.5" cy="12" r="0.6" fill="#333"/>
          <circle cx="14.5" cy="12" r="0.6" fill="#333"/>
          <path d="M12 14.5 L11.5 15.5 M12 14.5 L12.5 15.5" stroke="#808080" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="12" cy="17" r="0.8" fill="none" stroke="#808080" strokeWidth="1.2"/>
        </>
      ),
      info: (
        <>
          <ellipse cx="8.5" cy="6" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1" transform="rotate(-15 8.5 6)"/>
          <ellipse cx="15.5" cy="6" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1" transform="rotate(5 15.5 6)"/>
          <ellipse cx="8.5" cy="6" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5" transform="rotate(-15 8.5 6)"/>
          <ellipse cx="15.5" cy="6" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5" transform="rotate(5 15.5 6)"/>
          <circle cx="12" cy="14" r="6.5" fill="#E0E0E0" stroke="#808080" strokeWidth="1" transform="rotate(-5 12 14)"/>
          <circle cx="9.5" cy="12" r="1.4" fill="white"/>
          <circle cx="14.5" cy="12" r="1.4" fill="white"/>
          <circle cx="9.5" cy="12" r="0.7" fill="#333"/>
          <circle cx="14.5" cy="12" r="0.7" fill="#333"/>
          <circle cx="9.8" cy="11.7" r="0.3" fill="white"/>
          <circle cx="14.8" cy="11.7" r="0.3" fill="white"/>
          <path d="M12 14.5 L11.5 15.5 M12 14.5 L12.5 15.5" stroke="#808080" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="12" cy="17" r="1" fill="none" stroke="#808080" strokeWidth="1.2"/>
        </>
      ),
      error: (
        <>
          <ellipse cx="8" cy="8" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1" transform="rotate(-30 8 8)"/>
          <ellipse cx="16" cy="8" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1" transform="rotate(30 16 8)"/>
          <ellipse cx="8" cy="8" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5" transform="rotate(-30 8 8)"/>
          <ellipse cx="16" cy="8" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5" transform="rotate(30 16 8)"/>
          <circle cx="12" cy="14" r="6.5" fill="#E0E0E0" stroke="#808080" strokeWidth="1"/>
          <circle cx="9.5" cy="11.5" r="1.8" fill="white" stroke="#333" strokeWidth="0.5"/>
          <circle cx="14.5" cy="11.5" r="1.8" fill="white" stroke="#333" strokeWidth="0.5"/>
          <circle cx="9.5" cy="11.5" r="1" fill="#333"/>
          <circle cx="14.5" cy="11.5" r="1" fill="#333"/>
          <path d="M12 14.5 L11.5 15.5 M12 14.5 L12.5 15.5" stroke="#808080" strokeWidth="1.2" strokeLinecap="round"/>
          <ellipse cx="12" cy="17" rx="1.2" ry="1.8" fill="none" stroke="#808080" strokeWidth="1.5"/>
          <circle cx="16.5" cy="10" r="0.8" fill="#87CEEB" opacity="0.7"/>
          <path d="M16.5 9.2 Q16.2 8.8 16.5 8.4" stroke="#4682B4" strokeWidth="0.5" fill="none"/>
        </>
      ),
      loading: (
        <>
          <ellipse cx="9" cy="6" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1"/>
          <ellipse cx="15" cy="7.5" rx="1.5" ry="4" fill="#E0E0E0" stroke="#808080" strokeWidth="1" transform="rotate(25 15 7.5)"/>
          <ellipse cx="9" cy="6" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5"/>
          <ellipse cx="15" cy="7.5" rx="0.8" ry="2.5" fill="#FFB6C1" opacity="0.5" transform="rotate(25 15 7.5)"/>
          <circle cx="12" cy="14" r="6.5" fill="#E0E0E0" stroke="#808080" strokeWidth="1"/>
          <path d="M8.5 12 L10.5 12" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="14.5" cy="12" r="1.2" fill="white"/>
          <circle cx="14.5" cy="12" r="0.6" fill="#333"/>
          <path d="M12 14.5 L11.5 15.5 M12 14.5 L12.5 15.5" stroke="#808080" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M11 16.5 Q12 17 13 16.5" stroke="#808080" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <g opacity="0.6">
            <circle cx="17" cy="9" r="1" fill="white" stroke="#B0B0B0" strokeWidth="0.5"/>
            <circle cx="18.5" cy="7.5" r="0.7" fill="white" stroke="#B0B0B0" strokeWidth="0.5"/>
            <circle cx="19.5" cy="6" r="0.5" fill="white" stroke="#B0B0B0" strokeWidth="0.5"/>
          </g>
        </>
      )
    };

    return React.createElement('svg', baseProps, expressions[emotion]);
  };

  return getRabbitSVG(emotion);
};

// 통합 캐릭터 아이콘 컴포넌트
export const CharacterIcon: React.FC<CharacterIconProps> = ({ 
  character, 
  emotion, 
  size = 24, 
  className = '', 
  'aria-label': ariaLabel 
}) => {
  if (character === 'potato') {
    return <PotatoIcon emotion={emotion} size={size} className={className} aria-label={ariaLabel} />;
  }
  return <RabbitIcon emotion={emotion} size={size} className={className} aria-label={ariaLabel} />;
};

// 빈 상태 일러스트 컴포넌트
export const EmptyStateIcon: React.FC<EmptyStateProps> = ({ 
  type, 
  size = 120, 
  className = '', 
  'aria-label': ariaLabel 
}) => {
  const getEmptyStateSVG = (type: EmptyStateType) => {
    const baseProps = {
      width: size,
      height: size,
      viewBox: "0 0 120 120",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      'aria-label': ariaLabel || `${type} 빈 상태`,
      role: "img"
    };

    // SVG 내용이 복잡하므로 파일에서 불러오는 것을 권장
    // 실제 구현에서는 각 타입별로 완전한 SVG 내용을 반환해야 합니다.
    return React.createElement('svg', baseProps, 
      React.createElement('text', {
        x: size/2,
        y: size/2,
        textAnchor: 'middle',
        fontSize: 12,
        fill: '#888'
      }, `${type} 상태`)
    );
  };

  return getEmptyStateSVG(type);
};

// 사용 예시 컴포넌트
export const IconShowcase: React.FC = () => {
  const emotions: EmotionType[] = ['neutral', 'success', 'warning', 'info', 'error', 'loading'];
  
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">감자 캐릭터</h2>
        <div className="flex gap-4 flex-wrap">
          {emotions.map(emotion => (
            <div key={emotion} className="text-center">
              <PotatoIcon emotion={emotion} size={48} />
              <p className="text-sm mt-2 capitalize">{emotion}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">토끼 캐릭터</h2>
        <div className="flex gap-4 flex-wrap">
          {emotions.map(emotion => (
            <div key={emotion} className="text-center">
              <RabbitIcon emotion={emotion} size={48} />
              <p className="text-sm mt-2 capitalize">{emotion}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">빈 상태 일러스트</h2>
        <div className="flex gap-4 flex-wrap">
          {(['transactions', 'meals', 'loading'] as EmptyStateType[]).map(type => (
            <div key={type} className="text-center">
              <EmptyStateIcon type={type} size={100} />
              <p className="text-sm mt-2 capitalize">{type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterIcon;