
import React, { useState, useMemo } from 'react';
import { useGame } from '../../src/context/GameContext';
import { SYSTEMS, SystemNode } from '../../src/data/universe';

interface SystemMapProps {
    currentSector: string;
    onNavigateToSector?: (sector: string) => void;
}

type MapLayer = 'SECTOR' | 'AURA' | 'DEATHS' | 'LEGEND';

const SECTOR_TYPES = {
    EMPTY: 0,
    PORT: 1,
    PLANET: 2,
    BOTH: 3,
    ASTEROID: 4,
    NEBULA: 5,
    WORMHOLE: 6 // New Type
};

const AURA_TYPES = {
    NONE: 0,
    IONIZED: 1, // Dark Red, +Accuracy
    GRAVITY: 2, // Blue, Movement
    SINGULARITY: 3 // Purple, Jump Drive
};

export const SystemMap: React.FC<SystemMapProps> = ({ currentSector, onNavigateToSector }) => {
    const { player, systems, moveSector } = useGame();
    const [activeLayer, setActiveLayer] = useState<MapLayer>('SECTOR');

    const currentSectorNum = parseInt(currentSector);
    const baseSector = Math.floor(currentSectorNum / 100) * 100;

    // Find if this system has a wormhole
    const currentSystemData = systems.find(s => s.id === player.currentSystem);
    const wormholeSector = currentSystemData?.wormholeSector;

    // Mock Data Generation (Deterministic based on sector number)
    const grid = useMemo(() => Array.from({ length: 100 }, (_, i) => {
        const sectorNum = baseSector + i;
        const isCurrent = sectorNum === currentSectorNum;

        // Deterministic pseudo-random based on sector number
        const rand = (n: number) => Math.sin(n) * 10000 - Math.floor(Math.sin(n) * 10000);
        const r = rand(sectorNum);

        let type = SECTOR_TYPES.EMPTY;

        // Explicitly set Wormhole if it matches
        if (sectorNum === wormholeSector) {
            type = SECTOR_TYPES.WORMHOLE;
        } else {
            if (r > 0.95) type = SECTOR_TYPES.BOTH;
            else if (r > 0.9) type = SECTOR_TYPES.PLANET;
            else if (r > 0.8) type = SECTOR_TYPES.PORT;
            else if (r < 0.1) type = SECTOR_TYPES.ASTEROID;
            else if (r < 0.2 && r > 0.1) type = SECTOR_TYPES.NEBULA;
        }

        let aura = AURA_TYPES.NONE;
        if (r > 0.7 && r < 0.8) aura = AURA_TYPES.IONIZED;
        else if (r > 0.6 && r < 0.7) aura = AURA_TYPES.GRAVITY;
        else if (r > 0.55 && r < 0.6) aura = AURA_TYPES.SINGULARITY;

        const deaths = Math.floor(r * 10) % 3 === 0 ? Math.floor(r * 5) : 0;

        return {
            sector: sectorNum,
            type,
            aura,
            deaths,
            isCurrent
        };
    }), [baseSector, currentSectorNum, wormholeSector]);

    const handleSectorClick = (sector: number) => {
        // Basic adjacency check: +/- 1 or +/- 10 (grid movement)
        // For now, let's just allow clicking any sector in the system to move (teleport for testing)
        // Or implement the "adjacent only" rule if desired.
        // Let's stick to the plan: "Click adjacent sectors".

        const diff = Math.abs(sector - currentSectorNum);
        const isAdjacent = diff === 1 || diff === 10;

        // Allow move if adjacent OR if it's the current sector (no-op)
        // Actually, for better UX in this prototype, let's allow clicking anywhere in the system
        // but maybe show a cost?
        // Let's just call the context move.

        if (onNavigateToSector) {
            onNavigateToSector(sector.toString());
        } else {
            moveSector(sector);
        }
    };

    const getCellColor = (cell: typeof grid[0]) => {
        if (cell.isCurrent) return 'bg-[#ffffff] text-black font-bold animate-pulse';

        switch (activeLayer) {
            case 'SECTOR':
                if (cell.type === SECTOR_TYPES.WORMHOLE) return 'bg-[#440088] text-fuchsia-300 border-fuchsia-600 animate-pulse'; // Wormhole
                if (cell.type === SECTOR_TYPES.PORT) return 'bg-[#333300] text-yellow-200 border-yellow-900'; // Yellowish
                if (cell.type === SECTOR_TYPES.PLANET) return 'bg-[#003300] text-green-200 border-green-900'; // Greenish
                if (cell.type === SECTOR_TYPES.BOTH) return 'bg-[#003333] text-cyan-200 border-cyan-900'; // Cyan
                if (cell.type === SECTOR_TYPES.ASTEROID) return 'bg-[#222222] text-gray-400 border-gray-700'; // Gray
                if (cell.type === SECTOR_TYPES.NEBULA) return 'bg-[#220022] text-purple-300 border-purple-800'; // Purple
                return 'bg-[#001122] text-[#445566] border-[#112233]'; // Empty

            case 'AURA':
                if (cell.aura === AURA_TYPES.IONIZED) return 'bg-[#440000] text-red-300 border-red-800'; // Dark Red
                if (cell.aura === AURA_TYPES.GRAVITY) return 'bg-[#000044] text-blue-300 border-blue-800'; // Blue
                if (cell.aura === AURA_TYPES.SINGULARITY) return 'bg-[#220044] text-purple-300 border-purple-800'; // Purple
                return 'bg-[#000810] text-[#334455] border-[#112233] opacity-50';

            case 'DEATHS':
                if (cell.deaths > 0) return 'bg-[#330000] text-red-500 font-bold border-red-900';
                return 'bg-[#000810] text-[#334455] border-[#112233] opacity-50';

            default:
                return 'bg-[#001122] text-[#445566] border-[#112233]';
        }
    };

    const getCellContent = (cell: typeof grid[0]) => {
        if (activeLayer === 'DEATHS' && cell.deaths > 0) return "☠";
        if (cell.type === SECTOR_TYPES.WORMHOLE) return "WH";
        return cell.sector;
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 relative overflow-y-auto scrollbar-retro">

            {/* Header & Tabs */}
            <div className="w-full max-w-[600px] mb-4">
                <h2 className="text-[#00ccff] font-bold text-[16px] mb-4 tracking-widest uppercase border-b border-[#004488] pb-2 text-center drop-shadow-[0_0_5px_rgba(0,204,255,0.5)]">
                    System Map: {baseSector} - {baseSector + 99}
                </h2>

                <div className="flex justify-center gap-1 bg-[#001122] p-1 border border-[#223344] rounded-sm">
                    {(['SECTOR', 'AURA', 'DEATHS', 'LEGEND'] as MapLayer[]).map(layer => (
                        <button
                            key={layer}
                            onClick={() => setActiveLayer(layer)}
                            className={`
                                flex-1 py-1 text-[10px] font-bold uppercase tracking-wider transition-all
                                ${activeLayer === layer
                                    ? 'bg-[#004488] text-white shadow-[0_0_10px_rgba(0,100,255,0.5)]'
                                    : 'text-[#445566] hover:text-[#00ccff] hover:bg-[#002244]'
                                }
                            `}
                        >
                            {layer}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {activeLayer !== 'LEGEND' ? (
                <div className="grid grid-cols-10 gap-px w-full max-w-[600px] bg-[#003366] border border-[#004488] shadow-[0_0_20px_rgba(0,0,0,0.5)] p-0.5">
                    {grid.map((cell) => (
                        <div
                            key={cell.sector}
                            onClick={() => handleSectorClick(cell.sector)}
                            className={`
                                aspect-square border-[0.5px] text-[8px] md:text-[9px] flex items-center justify-center cursor-pointer transition-colors relative
                                ${getCellColor(cell)}
                            `}
                            title={`Sector ${cell.sector}`}
                        >
                            <span className="font-mono z-10">{getCellContent(cell)}</span>
                            {/* Mini Indicators for Sector Layer */}
                            {activeLayer === 'SECTOR' && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                    {cell.type === SECTOR_TYPES.PORT && <div className="w-full h-full bg-yellow-500/20"></div>}
                                    {cell.type === SECTOR_TYPES.PLANET && <div className="w-full h-full bg-green-500/20"></div>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                /* Legend View */
                <div className="w-full max-w-[600px] bg-[#001122] border border-[#223344] p-4 text-[11px] space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-white font-bold border-b border-[#223344] mb-2">Sector Types</h3>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#440088] border border-fuchsia-600"></div> <span className="text-fuchsia-300">Wormhole (Jump)</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#333300] border border-yellow-900"></div> <span className="text-yellow-200">Port (Trading)</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#003300] border border-green-900"></div> <span className="text-green-200">Planet (Colonizable)</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#222222] border border-gray-700"></div> <span className="text-gray-400">Asteroid (Ore)</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#220022] border border-purple-800"></div> <span className="text-purple-300">Nebula (Fuel)</span></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold border-b border-[#223344] mb-2">Auras</h3>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#440000] border border-red-800"></div> <span className="text-red-300">Ionized (+Accuracy)</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#000044] border border-blue-800"></div> <span className="text-blue-300">Gravity Well (Movement)</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#220044] border border-purple-800"></div> <span className="text-purple-300">Singularity (Jump Fail)</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Port Status Table */}
            <div className="w-full max-w-[600px] mt-6 bg-[#050a10] border border-[#223344] shadow-lg">
                <div className="bg-[#002244] px-3 py-1 text-[#00ccff] font-bold text-[11px] uppercase tracking-wide border-b border-[#004488]">
                    System Port Status
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-[10px] text-left border-collapse">
                        <thead>
                            <tr className="bg-[#001122] text-[#667788]">
                                <th className="p-2 border-b border-[#223344]">Sector</th>
                                <th className="p-2 border-b border-[#223344]">Name</th>
                                <th className="p-2 border-b border-[#223344] text-right">Ore</th>
                                <th className="p-2 border-b border-[#223344] text-right">Org</th>
                                <th className="p-2 border-b border-[#223344] text-right">Equ</th>
                                <th className="p-2 border-b border-[#223344] text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grid.filter(c => c.type === SECTOR_TYPES.PORT || c.type === SECTOR_TYPES.BOTH).slice(0, 10).map(port => (
                                <tr key={port.sector} className="border-b border-[#112233] hover:bg-[#0a1525]">
                                    <td className="p-2 font-mono text-white">{port.sector}</td>
                                    <td className="p-2 text-[#aaccff]">Port {port.sector}</td>
                                    <td className="p-2 text-right font-mono text-yellow-500">{(Math.random() * 10000).toFixed(0)}</td>
                                    <td className="p-2 text-right font-mono text-green-500">{(Math.random() * 10000).toFixed(0)}</td>
                                    <td className="p-2 text-right font-mono text-blue-500">{(Math.random() * 10000).toFixed(0)}</td>
                                    <td className="p-2 text-center">
                                        <span className="text-[#00ccff] cursor-pointer hover:underline">[Warp]</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
