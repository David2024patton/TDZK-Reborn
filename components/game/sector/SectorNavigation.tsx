import React from 'react';
import { useGame } from '../../../src/context/GameContext';

interface SectorNavigationProps {
    currentSector: string;
}

export const SectorNavigation: React.FC<SectorNavigationProps> = ({ currentSector }) => {
    const { moveSector } = useGame();
    const baseSector = parseInt(currentSector) || 11199;

    const handleMove = (sector: number) => {
        moveSector(sector.toString());
    };

    return (
        <div className="flex justify-center w-full mt-2">
            <div className="relative bg-[#0d1520]/80 border border-[#334455] p-1 flex shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-sm backdrop-blur-md min-w-[320px]">
                <div className="w-[100px] h-[100px] bg-black border border-[#223344] relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
                </div>

                <div className="flex-1 pl-3 pr-2 flex">
                    <div className="flex flex-col justify-center mr-4 min-w-[100px]">
                        <div className="text-[#667788] font-bold text-[10px] mb-0.5">Sector</div>
                        <div className="text-white font-bold text-[24px] leading-none mb-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] font-mono">{currentSector}</div>
                        <div className="text-[#00ccff] text-[9px] leading-tight">Deep Space</div>
                        <div className="text-[#445566] text-[9px] leading-tight">Normal</div>
                        <div className="text-[#667788] text-[9px] mt-1.5">100% Visibility</div>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-0.5 font-mono text-[10px] flex-1">
                        <div onClick={() => handleMove(baseSector - 15)} className="text-[#445566] hover:text-[#00ccff] cursor-pointer mb-0.5">[{baseSector - 15}]</div>
                        <div className="text-[#223344] h-2 w-[1px] bg-[#223344]"></div>

                        <div className="flex items-center gap-1.5">
                            <span onClick={() => handleMove(baseSector - 1)} className="text-[#445566] hover:text-[#00ccff] cursor-pointer">[{baseSector - 1}]</span>
                            <span className="text-[#223344]">-</span>
                            <span className="text-white font-bold drop-shadow-[0_0_5px_rgba(0,200,255,0.5)] bg-[#004488] px-1 rounded-sm">[{currentSector}]</span>
                            <span className="text-[#223344]">-</span>
                            <span onClick={() => handleMove(baseSector + 1)} className="text-[#445566] hover:text-[#00ccff] cursor-pointer">[{baseSector + 1}]</span>
                        </div>

                        <div className="text-[#223344] h-2 w-[1px] bg-[#223344]"></div>
                        <div onClick={() => handleMove(baseSector + 15)} className="text-[#445566] hover:text-[#00ccff] cursor-pointer mt-0.5">[{baseSector + 15}]</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
