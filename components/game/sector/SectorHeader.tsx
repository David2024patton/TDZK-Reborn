import React from 'react';

interface SectorHeaderProps {
    currentSector: string;
}

export const SectorHeader: React.FC<SectorHeaderProps> = ({ currentSector }) => {
    return (
        <div className="shrink-0 z-20 w-full bg-[#020408] border-b-2 border-[#004488] shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex flex-col min-h-[60px] h-auto">
            <div className="flex flex-wrap items-stretch bg-gradient-to-b from-[#0a1525] to-[#020408] relative min-h-[60px]">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ccff] to-transparent opacity-30"></div>

                <div className="basis-[100px] grow-0 shrink-0 flex items-center justify-center border-r border-[#112233] bg-[#050a10]/50 relative overflow-hidden group min-h-[60px] px-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ccff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#00ccff]">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>

                        <div className="flex flex-col items-start leading-none">
                            <div className="text-white font-bold text-[12px] leading-none mb-0.5">100%</div>
                            <div className="text-[#6688aa] text-[7px] uppercase tracking-wider">VISIBILITY</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-[150px] flex flex-col items-center justify-center px-2 py-1 relative border-r border-[#112233]">
                    <div className="text-[#00ccff] text-[8px] uppercase tracking-[0.4em] font-bold mb-1 opacity-80 text-center">Current Sector</div>
                    <div className="text-white font-mono text-[20px] font-bold leading-none drop-shadow-[0_0_8px_rgba(0,200,255,0.5)] tracking-widest text-center">
                        {currentSector}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 text-[9px] mt-1 text-[#8899aa] font-mono">
                        <span className="text-[#00ccff]">Deep Space</span>
                        <span className="text-[#6688aa]">/</span>
                        <span className="text-[#aaccff]">Normal</span>
                    </div>
                </div>

                <div className="basis-[140px] grow-0 shrink-0 flex flex-col justify-center bg-[#050a10]/50 p-2 relative overflow-hidden min-h-[60px]">
                    <div className="text-[7px] text-[#6688aa] uppercase tracking-[0.2em] text-center mb-1 font-bold">AURAS</div>
                    <div className="flex gap-1 justify-center">
                        {[
                            { color: 'text-red-400 border-red-500 bg-red-950', icon: 'M12 2L2 22h20L12 2z' },
                            { color: 'text-orange-400 border-orange-500 bg-orange-950', icon: 'M3 3h18v18H3z' },
                            { color: 'text-green-400 border-green-500 bg-green-950', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
                            { color: 'text-yellow-400 border-yellow-500 bg-yellow-950', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
                            { color: 'text-purple-400 border-purple-500 bg-purple-950', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z' }
                        ].map((aura, i) => (
                            <div key={i} className={`w-4 h-4 rounded-[2px] border ${aura.color} flex items-center justify-center shadow-[0_0_5px_rgba(0,0,0,0.5)]`}>
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2">
                                    <path d={aura.icon} />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
