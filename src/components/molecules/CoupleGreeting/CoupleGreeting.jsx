import React from 'react';
import Character from '../../atoms/Character';

const CoupleGreeting = ({ 
  husbandName = '철수', 
  wifeName = '영희',
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="flex flex-col items-center">
        <Character type="potato" size="lg" />
        <span className="text-sm font-medium text-text-dark mt-1">{husbandName}</span>
      </div>
      
      <div className="text-2xl animate-pulse-heart">💕</div>
      
      <div className="flex flex-col items-center">
        <Character type="rabbit" size="lg" />
        <span className="text-sm font-medium text-text-dark mt-1">{wifeName}</span>
      </div>
    </div>
  );
};

export default CoupleGreeting;