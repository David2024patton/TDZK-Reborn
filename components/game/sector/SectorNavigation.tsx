import React from 'react';
import { useGame } from '../../../src/context/GameContext';

interface SectorNavigationProps {
    currentSector: string;
}

export const SectorNavigation: React.FC<SectorNavigationProps> = ({ currentSector }) => {
    const { moveSector, systems, warpSystem } = useGame();
    const baseSector = parseInt(currentSector) || 11199;

    const handleMove = (sector: number) => {
        moveSector(sector.toString());
    };

    // Calculate adjacent sectors
    const up = baseSector - 10;
    const down = baseSector + 10;
    const left = baseSector - 1;
    const right = baseSector + 1;

    // Check boundaries
    const canMoveUp = baseSector % 100 >= 10;
    const canMoveDown = baseSector % 100 < 90;
    const canMoveLeft = baseSector % 100 % 10 !== 0;
    const canMoveRight = baseSector % 100 % 10 !== 9;

    // Wormhole check
    const currentSecNum = parseInt(currentSector);
    const currentSystem = systems.find(s => s.wormholes?.some(w => w.sector === currentSecNum));
    const wormholeTarget = currentSystem?.wormholes?.find(w => w.sector === currentSecNum);

    return (
        <div className="flex justify-center w-full mt-2 relative">
            <div className="relative bg-[#0d1520]/80 border border-[#334455] p-1 flex shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-sm backdrop-blur-md min-w-[320px]">
                {/* Left Side: Sector Info */}
                <div className="w-[100px] h-[100px] bg-black border border-[#223344] relative overflow-hidden shrink-0 hidden sm:block">
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
                </div>

                <div className="flex-1 pl-3 pr-2 flex items-center">
                    {/* Sector Details */}
                    <div className="flex flex-col justify-center mr-4 min-w-[100px]">
                        <div className="text-[#667788] font-bold text-[10px] mb-0.5">Sector</div>
                        <div className="text-white font-bold text-[24px] leading-none mb-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] font-mono">{currentSector}</div>
                        <div className="text-[#00ccff] text-[9px] leading-tight">Deep Space</div>
                        <div className="text-[#445566] text-[9px] leading-tight">Normal</div>
                        <div className="text-[#667788] text-[9px] mt-1.5">100% Visibility</div>
                    </div>

                    {/* Navigation Grid */}
                    <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-center font-mono text-[12px] flex-1">
                        {/* Top Row */}
                        <div className="col-start-2">
                            {canMoveUp ? (
                                <span className="text-[#00ccff] cursor-pointer hover:text-white hover:underline transition-colors" onClick={() => handleMove(up)}>[{up}]</span>
                            ) : <span className="text-[#334455] cursor-default">---</span>}
                        </div>

                        {/* Middle Row */}
                        <div className="col-start-1 flex justify-end">
                            {canMoveLeft ? (
                                <span className="text-[#00ccff] cursor-pointer hover:text-white hover:underline transition-colors" onClick={() => handleMove(left)}>[{left}]</span>
                            ) : <span className="text-[#334455] cursor-default">---</span>}
                        </div>

                        <div className="col-start-2 flex justify-center">
                            <span className="text-white font-bold opacity-50 cursor-default shadow-[0_0_10px_rgba(0,200,255,0.3)] bg-[#00ccff]/10 px-1 rounded">[{currentSector}]</span>
                        </div>

                        <div className="col-start-3 flex justify-start">
                            {canMoveRight ? (
                                <span className="text-[#00ccff] cursor-pointer hover:text-white hover:underline transition-colors" onClick={() => handleMove(right)}>[{right}]</span>
                            ) : <span className="text-[#334455] cursor-default">---</span>}
                        </div>

                        {/* Bottom Row */}
                        <div className="col-start-2">
                            {canMoveDown ? (
                                <span className="text-[#00ccff] cursor-pointer hover:text-white hover:underline transition-colors" onClick={() => handleMove(down)}>[{down}]</span>
                            ) : <span className="text-[#334455] cursor-default">---</span>}
                        </div>

                        {/* Wormhole Link (Bottom Right) */}
                        <div className="col-start-3 flex justify-start">
                            {wormholeTarget && (
                                <span
                                    className="text-[#00ffff] font-bold cursor-pointer hover:text-white hover:underline animate-pulse drop-shadow-[0_0_5px_rgba(0,255,255,0.8)] transition-all"
                                    onClick={() => warpSystem(wormholeTarget.targetSystemId.toString())}
                                    title={`Warp to System ${wormholeTarget.targetSystemId}`}
                                >
                                    [{wormholeTarget.targetSystemId}]
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
