import React from 'react';
import { cva } from 'class-variance-authority';

// Character mascot imports
import PotatoDefault from '../../../assets/images/mascots/potato-default.svg';
import PotatoHappy from '../../../assets/images/mascots/potato-happy.svg';
import PotatoSad from '../../../assets/images/mascots/potato-sad.svg';
import PotatoExcited from '../../../assets/images/mascots/potato-excited.svg';

import RabbitDefault from '../../../assets/images/mascots/rabbit-default.svg';
import RabbitHappy from '../../../assets/images/mascots/rabbit-happy.svg';
import RabbitShy from '../../../assets/images/mascots/rabbit-shy.svg';
import RabbitLove from '../../../assets/images/mascots/rabbit-love.svg';

const characterVariants = cva(
  'inline-block select-none',
  {
    variants: {
      type: {
        potato: 'animate-potato-bounce',
        rabbit: 'animate-rabbit-hop'
      },
      size: {
        sm: 'text-lg',  // 18px
        base: 'text-2xl', // 24px
        lg: 'text-4xl',   // 36px
        xl: 'text-5xl'    // 48px
      }
    },
    defaultVariants: {
      type: 'potato',
      size: 'base'
    }
  }
);

const characterImages = {
  potato: {
    default: PotatoDefault,
    happy: PotatoHappy,
    sad: PotatoSad,
    excited: PotatoExcited
  },
  rabbit: {
    default: RabbitDefault,
    happy: RabbitHappy,
    shy: RabbitShy,
    love: RabbitLove
  }
};

const Character = ({ 
  type = 'potato', 
  expression = 'default', 
  size = 'base',
  className = '',
  useEmoji = true, // fallback to emoji if SVG not available
  ...props 
}) => {
  const characterClass = characterVariants({ type, size, className });
  
  // Fallback emojis
  const emojiMap = {
    potato: '🥔',
    rabbit: '🐰'
  };

  // Try to use SVG first, fallback to emoji
  if (!useEmoji && characterImages[type]?.[expression]) {
    const ImageComponent = characterImages[type][expression];
    return (
      <div className={characterClass} {...props}>
        <img 
          src={ImageComponent} 
          alt={`${type} ${expression}`}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Use emoji as fallback
  return (
    <span className={characterClass} {...props}>
      {emojiMap[type] || '🥔'}
    </span>
  );
};

export default Character;