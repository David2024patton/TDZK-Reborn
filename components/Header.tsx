
import React from 'react';

interface HeaderProps {
  currentIndex: number;
  totalImages: number;
  onIndexChange: (index: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentIndex, totalImages, onIndexChange }) => {
  const safeCount = Math.max(0, totalImages);

  return (
    <div className="pt-3 px-3 mb-0 bg-black">
      <h1 className="text-white text-[18px] font-normal tracking-wide mb-1 font-verdana">
        Taenaria Derivia Zallus Kitara
      </h1>
      <div className="text-[#999999] text-[10px] font-verdana flex flex-wrap gap-1 items-center pb-2 border-b border-[#333333]">
        <span className="mr-1">Explore, Trade, Conquer! -</span>
        
        {safeCount > 0 ? (
          Array.from({ length: safeCount }).map((_, i) => (
            <React.Fragment key={i}>
              <span 
                className={`cursor-pointer transition-colors select-none ${
                  currentIndex === i 
                    ? 'text-white font-bold' 
                    : 'text-[#666666] hover:text-[#aaaaaa]'
                }`}
                onClick={() => onIndexChange(i)}
              >
                {i.toString().padStart(2, '0')}
              </span>
              {i < safeCount - 1 && <span className="text-[#444444]">-</span>}
            </React.Fragment>
          ))
        ) : (
          <span className="text-[#444] animate-pulse">Initializing...</span>
        )}
      </div>
    </div>
  );
};
