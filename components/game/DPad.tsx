import React from 'react';

interface DPadProps {
  className?: string;
  onCenterClick?: () => void;
}

export const DPad: React.FC<DPadProps> = ({ className = '', onCenterClick }) => {
  return (
    <div className={`relative w-[100px] h-[100px] flex items-center justify-center ${className}`}>
      {/* Decorative Ring */}
      <div className="absolute inset-0 border border-[#003366] rounded-full opacity-50 pointer-events-none"></div>
      <div className="absolute inset-2 border border-[#002244] rounded-full opacity-50 pointer-events-none"></div>

      {/* Up */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-[#003355] to-[#001122] border border-[#0066cc] hover:border-[#00ccff] hover:from-[#004477] cursor-pointer flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)] group active:translate-y-[1px] z-10 rounded-sm active:scale-95 transition-transform">
        <span className="text-white group-hover:text-cyan-300 font-bold text-[10px] -mt-1">^</span>
      </div>
      {/* Left */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-[#003355] to-[#001122] border border-[#0066cc] hover:border-[#00ccff] hover:from-[#004477] cursor-pointer flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)] group active:translate-x-[-1px] z-10 rounded-sm active:scale-95 transition-transform">
        <span className="text-white group-hover:text-cyan-300 font-bold text-[10px]">&lt;</span>
      </div>
      {/* Center (Sector) */}
      <div
        onClick={onCenterClick}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black border border-[#0066cc] flex items-center justify-center z-20 shadow-[0_0_15px_rgba(0,100,255,0.3)] rounded-sm active:scale-95 transition-transform cursor-pointer hover:bg-[#001133]"
      >
        <span className="text-[#ffcc00] font-bold text-[14px]">S</span>
      </div>
      {/* Right */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 bg-gradient-to-l from-[#003355] to-[#001122] border border-[#0066cc] hover:border-[#00ccff] hover:from-[#004477] cursor-pointer flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)] group active:translate-x-[1px] z-10 rounded-sm active:scale-95 transition-transform">
        <span className="text-white group-hover:text-cyan-300 font-bold text-[10px]">&gt;</span>
      </div>
      {/* Down */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-t from-[#003355] to-[#001122] border border-[#0066cc] hover:border-[#00ccff] hover:from-[#004477] cursor-pointer flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)] group active:translate-y-[1px] z-10 rounded-sm active:scale-95 transition-transform">
        <span className="text-white group-hover:text-cyan-300 font-bold text-[10px] -mb-1">v</span>
      </div>
    </div>
  );
};