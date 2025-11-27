
import React, { useState } from 'react';

interface RightPanelProps {
    isFloating?: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({ isFloating = false }) => {
    // Collapsible states
    const [isWeaponsOpen, setWeaponsOpen] = useState(true);
    const [isEquipmentOpen, setEquipmentOpen] = useState(false);
    const [isDronesOpen, setDronesOpen] = useState(false);
    const [isCargoOpen, setCargoOpen] = useState(true);

    // Squadron State: 0 = X (None), 1-4 = Squadrons
    const [selectedSquadron, setSelectedSquadron] = useState<number>(2);

    // Deploy State
    const [isDeployed, setIsDeployed] = useState(false);

    // Mock data
    const primaryWeapons = Array(4).fill("25GC");
    const secondaryWeapons = Array(6).fill("ResDM 33");
    const equipmentList = [
        "Cloaking Device",
        "Scanners",
        "Spatial Rift Gen",
        "Drone Transponder",
        "Signature Dampener"
    ];
    const cargoList = [
        { name: "Electronics", quantity: 50 },
        { name: "Machinery", quantity: 20 },
        { name: "Ore", quantity: 1500 }
    ];
    const droneList = [
        { name: "Scout", quantity: 0 },
        { name: "Combat", quantity: 0 },
        { name: "Shield", quantity: 0 },
        { name: "Resource", quantity: 0 },
        { name: "Repair", quantity: 50, highlight: true },
        { name: "Mine", quantity: 0 },
        { name: "EMP", quantity: 0 }
    ];

    // Reusable toggle link style
    const ToggleLink = ({ label, isOpen, onClick }: { label: string, isOpen: boolean, onClick: () => void }) => (
        <div
            onClick={onClick}
            className="cursor-pointer text-blue-400 hover:text-white text-[9px] uppercase tracking-wide text-right mb-1 select-none transition-colors flex justify-end items-center gap-1"
        >
            <span>{label}</span>
            <span className="text-[8px]">{isOpen ? '▼' : '►'}</span>
        </div>
    );

    return (
        <div className="flex flex-col h-full text-[10px] font-verdana text-[#aaccff] select-none overflow-hidden min-h-0">

            {/* Fixed Status Section */}
            <div className="shrink-0 px-3 pt-4">

                {/* Desktop Spacer */}
                <div className={`w-full shrink-0 hidden md:block ${isFloating ? '!hidden' : 'h-[140px]'}`}></div>

                {/* STATUS Header Block */}
                <div className="relative flex flex-col items-center pt-2 w-full mb-2">
                    <div className="mb-2 flex items-center gap-2 border-b border-[#003366] pb-1 px-4 w-full justify-center">
                        <span className="text-red-500 text-[10px] animate-pulse">•</span>
                        <span className="text-white font-bold tracking-[0.2em] text-[12px]">STATUS</span>
                        <span className="text-red-500 text-[10px] animate-pulse">•</span>
                    </div>

                    <div className="w-full space-y-2 px-1">
                        <div>
                            <div className="flex justify-between text-[9px] mb-0.5">
                                <span className="text-cyan-300 font-bold">SHD</span>
                                <span className="text-white">64/625</span>
                            </div>
                            <div className="w-full h-1.5 bg-black border border-[#003366] rounded-sm overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-cyan-700 to-cyan-400 w-[10%] shadow-[0_0_5px_#00ffff]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[9px] mb-0.5">
                                <span className="text-gray-300 font-bold">ARM</span>
                                <span className="text-white">1392/2000</span>
                            </div>
                            <div className="w-full h-1.5 bg-black border border-[#003366] rounded-sm overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-gray-600 to-gray-300 w-[70%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[9px] mb-0.5">
                                <span className="text-yellow-300 font-bold">POW</span>
                                <span className="text-white">296/300</span>
                            </div>
                            <div className="w-full h-1.5 bg-black border border-[#003366] rounded-sm overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-yellow-700 to-yellow-400 w-[98%] shadow-[0_0_5px_#ffff00]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-between gap-2 text-center w-full mb-4">
                    <button className="flex-1 py-1 border border-[#004488] hover:border-[#00ccff] hover:bg-[#001133] text-[#00ccff] cursor-pointer text-[9px] rounded bg-black/50 transition-colors shadow-[0_0_5px_rgba(0,100,255,0.1)]">Details</button>
                    <button className="flex-1 py-1 border border-[#004488] hover:border-[#00ccff] hover:bg-[#001133] text-[#00ccff] cursor-pointer text-[9px] rounded bg-black/50 transition-colors shadow-[0_0_5px_rgba(0,100,255,0.1)]">Repair</button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-retro px-3 pb-2 min-h-0">
                {/* Info Groups */}
                <div className="space-y-3 w-full pb-2">

                    {/* Ship Stats */}
                    <div className="space-y-0.5 text-right border-b border-[#112233] pb-2">
                        <div className="flex justify-between"><span className="text-[#667788]">Level:</span> <span className="text-white font-bold">230</span></div>
                        <div className="flex justify-between"><span className="text-[#667788]">Rating:</span> <span className="text-white">135/15</span></div>
                        <div className="flex justify-between"><span className="text-[#667788]">Speed:</span> <span className="text-white">20</span></div>
                        <div className="flex justify-between"><span className="text-[#667788]">Maneuver:</span> <span className="text-white">70</span></div>
                    </div>

                    {/* Cargo Section (Collapsible) - Added Above Equipment */}
                    <div className="border-b border-[#112233] pb-2">
                        <ToggleLink label="SHP CARGO" isOpen={isCargoOpen} onClick={() => setCargoOpen(!isCargoOpen)} />

                        {isCargoOpen && (
                            <div className="space-y-[1px] text-right animate-in slide-in-from-top-2 fade-in duration-200 mb-2">
                                {cargoList.map((item, i) => (
                                    <div key={i} className="flex justify-between text-[#aaccff] text-[9px] hover:text-white cursor-pointer group">
                                        <span className="text-[#667788] group-hover:text-[#8899aa]">[{item.quantity.toLocaleString()}]</span>
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Equipment Section (Collapsible) */}
                    <div className="border-b border-[#112233] pb-2">
                        <ToggleLink label="EQUIPMENT" isOpen={isEquipmentOpen} onClick={() => setEquipmentOpen(!isEquipmentOpen)} />

                        {isEquipmentOpen && (
                            <div className="space-y-[1px] text-right animate-in slide-in-from-top-2 fade-in duration-200 mb-2">
                                {equipmentList.map((item, i) => (
                                    <div key={i} className="text-[#aaccff] text-[9px] hover:text-white cursor-pointer">{item}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Weapons List (Collapsible) */}
                    <div className="border-b border-[#112233] pb-2">
                        <ToggleLink label="WEAPONS" isOpen={isWeaponsOpen} onClick={() => setWeaponsOpen(!isWeaponsOpen)} />

                        {isWeaponsOpen && (
                            <div className="space-y-1 animate-in slide-in-from-top-2 fade-in duration-200 mb-1">
                                <div className="text-[#667788] text-[8px] mb-0.5 text-right tracking-wider">PRIMARY</div>
                                <div className="space-y-[1px]">
                                    {primaryWeapons.map((w, i) => (
                                        <div key={`p-${i}`} className="flex justify-between text-yellow-200 hover:bg-[#001122] px-1 cursor-default group">
                                            <span className="text-[#445566] w-4 group-hover:text-[#667788]">[{i + 1}]</span>
                                            <span className="truncate">{w}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-[#667788] text-[8px] mb-0.5 text-right mt-2 tracking-wider">SECONDARY</div>
                                <div className="space-y-[1px]">
                                    {secondaryWeapons.map((w, i) => (
                                        <div key={`s-${i}`} className="flex justify-between text-cyan-200 hover:bg-[#001122] px-1 cursor-default group">
                                            <span className="text-[#445566] w-4 group-hover:text-[#667788]">[{i + 1}]</span>
                                            <span className="truncate">{w}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upgrades (TComp/DAmp) & Mode */}
                    <div className="space-y-1 border-b border-[#112233] pb-2">
                        <div className="flex justify-between items-center bg-[#001122] px-1 py-0.5 rounded-sm border border-[#112233]">
                            <span className="text-[#667788]">TComp Lvl:</span>
                            <span className="text-yellow-400 font-bold">7</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#001122] px-1 py-0.5 rounded-sm border border-[#112233]">
                            <span className="text-[#667788]">DAmp Lvl:</span>
                            <span className="text-yellow-400 font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-[9px] text-[#667788]">Mode:</span>
                            <span className="text-yellow-300 cursor-pointer hover:text-white text-[9px]">All/No Evade</span>
                        </div>
                    </div>

                    {/* Drones Section (Collapsible) */}
                    <div className="pb-1">
                        <ToggleLink label="DRONES" isOpen={isDronesOpen} onClick={() => setDronesOpen(!isDronesOpen)} />

                        {isDronesOpen && (
                            <div className="space-y-[1px] text-right animate-in slide-in-from-top-2 fade-in duration-200">
                                {droneList.map((d, i) => (
                                    <div key={i} className="flex justify-between items-center text-[9px]">
                                        <span className={`${d.quantity > 0 ? (d.highlight ? 'text-green-400' : 'text-[#aaccff]') : 'text-[#445566]'}`}>{d.name}:</span>
                                        <span className={`${d.quantity > 0 ? 'text-white font-bold' : 'text-[#445566]'}`}>{d.quantity}</span>
                                    </div>
                                ))}
                                <div className="my-1 border-t border-[#112233]"></div>
                                <div className="flex justify-between text-[9px]"><span className="text-[#667788]">Hangars:</span> <span className="text-white">50</span></div>
                                <div className="flex justify-between text-[9px]"><span className="text-[#667788]">Empty:</span> <span className="text-white">0</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Compact Squadron Controls at Bottom - Pinned */}
            <div className="shrink-0 bg-[#050a12] border-t border-[#112233] p-2 shadow-[0_-5px_15px_rgba(0,0,0,0.5)] z-10">
                <div className="text-[#00ccff] text-[9px] font-bold mb-2 tracking-widest uppercase border-b border-[#112233] pb-1">
                    SQUADRON
                </div>

                <div className="flex justify-between items-center gap-1 mb-2">
                    {/* Cancel / None Button (0) */}
                    <button
                        onClick={() => setSelectedSquadron(0)}
                        className={`
                    w-6 h-6 flex items-center justify-center text-[10px] transition-colors rounded-sm shadow-inner border
                    ${selectedSquadron === 0
                                ? 'bg-red-900 text-white border-red-500 shadow-[0_0_8px_rgba(255,0,0,0.8)]'
                                : 'bg-[#220000] border-[#442222] text-red-800 hover:text-red-500 hover:border-red-500'
                            }
                `}
                    >
                        ✕
                    </button>

                    {/* Squadron Buttons 1-4 */}
                    {[1, 2, 3, 4].map(num => (
                        <button
                            key={num}
                            onClick={() => setSelectedSquadron(num)}
                            className={`
                        flex-1 h-6 flex items-center justify-center text-[10px] transition-colors rounded-sm border
                        ${selectedSquadron === num
                                    ? 'bg-green-900/80 text-white border-green-400 shadow-[0_0_8px_rgba(0,255,0,0.6)] font-bold'
                                    : 'bg-[#001122] border-[#003366] text-[#006688] hover:bg-[#002244] hover:text-[#00ccff]'
                                }
                    `}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setIsDeployed(!isDeployed)}
                    className={`w-full py-1.5 border text-[9px] font-bold uppercase tracking-wider rounded-sm shadow-lg transition-all
                ${isDeployed
                            ? 'bg-red-900/90 border-red-500 text-white shadow-[0_0_15px_rgba(255,0,0,0.8)] animate-pulse'
                            : 'bg-gradient-to-b from-[#002244] to-[#001122] border-[#004488] text-[#00ccff] hover:from-[#003366] hover:to-[#002244] hover:border-[#00ccff] hover:text-white'
                        }
            `}
                >
                    DEPLOY
                </button>
            </div>

        </div>
    );
};
