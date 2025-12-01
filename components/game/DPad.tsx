import React from 'react';
import { useGame } from '../../src/context/GameContext';

interface DPadProps {
  className?: string;
  onCenterClick?: () => void;
  onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const DPad: React.FC<DPadProps> = ({ className = '', onCenterClick, onMove }) => {
  const { player, systems, warpSystem } = useGame();

  // Check for wormhole in current sector
  const currentSecNum = parseInt(player.currentSector);
  const currentSystem = systems.find(s => s.wormholes?.some(w => w.sector === currentSecNum));
  const wormholeTarget = currentSystem?.wormholes?.find(w => w.sector === currentSecNum);

  const handleCenterClick = () => {
    if (wormholeTarget) {
      warpSystem(wormholeTarget.targetSystemId.toString());
    } else {
      onCenterClick?.();
    }
  };

  return (
    <div className={`relative w-[100px] h-[100px] flex items-center justify-center ${className}`}>
      {/* Decorative Ring */}
      <div className="absolute inset-0 border border-[#003366] rounded-full opacity-50 pointer-events-none"></div>
      <div className="absolute inset-2 border border-[#002244] rounded-full opacity-50 pointer-events-none"></div>

      {/* Up */}
      <div
        onClick={() => onMove?.('up')}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-[#003355] to-[#001122] border border-[#0066cc] hover:border-[#00ccff] hover:from-[#004477] cursor-pointer flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)] group active:translate-y-[1px] z-10 rounded-sm active:scale-95 transition-transform"
      >
        <span className="text-white group-hover:text-cyan-300 font-bold text-[10px] -mt-1">^</span>
      </div>
      {/* Left */}
      <div
        onClick={() => onMove?.('left')}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-[#003355] to-[#001122] border border-[#0066cc] hover:border-[#00ccff] hover:from-[#004477] cursor-pointer flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)] group active:translate-x-[-1px] z-10 rounded-sm active:scale-95 transition-transform"
      >
        <span className="text-white group-hover:text-cyan-300 font-bold text-[10px]">&lt;</span>
      </div>

      {/* Center (Sector/Warp) */}
      <div
        onClick={handleCenterClick}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border flex items-center justify-center z-20 shadow-[0_0_15px_rgba(0,100,255,0.3)] rounded-sm active:scale-95 transition-transform cursor-pointer
            ${wormholeTarget
            ? 'bg-purple-900/80 border-purple-500 hover:bg-purple-800 hover:border-purple-300 animate-pulse'
            : 'bg-black border-[#0066cc] hover:bg-[#001133]'
          }`}
        title={wormholeTarget ? `WARP to System ${wormholeTarget.targetSystemId}` : 'Current Sector'}
      >
        <span className={`font-bold text-[14px] ${wormholeTarget ? 'text-white' : 'text-[#ffcc00]'}`}>
          {wormholeTarget ? 'W' : 'S'}
        </span>
      </div>

      {/* Right */}
      <div
        onClick={() => onMove?.('right')}
        className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 bg-gradient-to-l from-[#003355] to-[#001122] border border-[#0066cc] hover:border-[#00ccff] hover:from-[#004477] cursor-pointer flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)] group active:translate-x-[1px] z-10 rounded-sm active:scale-95 transition-transform"
      >
        <span className="text-white group-hover:text-cyan-300 font-bold text-[10px]">&gt;</span>
      </div>
      {/* Down */}
      <div
        onClick={() => onMove?.('down')}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-t from-[#003355] to-[#001122] border border-[#0066cc] hover:border-[#00ccff] hover:from-[#004477] cursor-pointer flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)] group active:translate-y-[1px] z-10 rounded-sm active:scale-95 transition-transform"
      >
        <span className="text-white group-hover:text-cyan-300 font-bold text-[10px] -mb-1">v</span>
      </div>
    </div>
  );
};