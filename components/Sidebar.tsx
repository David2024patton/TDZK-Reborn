
import React from 'react';

interface SidebarProps {
  currentTime: string;
  onLinkClick?: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTime, onLinkClick }) => {
  
  const handleClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    onLinkClick?.(page);
  };

  return (
    <div className="flex flex-col items-end text-right space-y-6 pl-4 border-l border-[#111111] md:border-none">
      
      {/* Donation Box */}
      <div className="w-full flex flex-col items-end">
        <div 
          className="bg-gradient-to-b from-[#000066] to-[#000033] border border-[#003399] p-1 mb-1 w-full max-w-[200px] cursor-pointer hover:brightness-110 group"
          onClick={(e) => handleClick(e, 'Donate!')}
        >
          <div className="flex justify-between items-center px-1">
             <span className="text-[#aaaaaa] text-[10px]">Help Support</span>
             <span className="text-white font-bold text-[14px] group-hover:text-[#00ccff]">TDZK</span>
          </div>
           <div className="text-right text-[10px] text-[#aaaaaa] px-1">by Donating!</div>
        </div>
        <a href="#" onClick={(e) => handleClick(e, 'Donate!')} className="text-white hover:text-[#00ccff] text-[11px]">Why Donate?</a>
      </div>

      {/* Time */}
      <div className="text-white font-mono">
        {currentTime || "Loading..."}
      </div>

      {/* Quick Links */}
      <div className="flex flex-col gap-1 text-[#cccccc]">
        <a href="#" onClick={(e) => handleClick(e, 'Redial: News & Tools')} className="hover:text-white">Redial: News & Tools</a>
        <a href="#" onClick={(e) => handleClick(e, 'History Book')} className="hover:text-white">History Book</a>
      </div>

      {/* Footer External Link */}
      <div className="text-[10px] text-[#888888] w-full max-w-[180px]">
        Visit <a href="#" className="text-[#aaaaaa] hover:text-white underline">OMGN.com</a> for news on TDZK and other web games!
      </div>

    </div>
  );
};
