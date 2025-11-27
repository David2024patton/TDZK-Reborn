import React from 'react';

interface SectorEntityProps {
    name: string;
    sub?: string;
    align?: string | number;
    level?: string | number;
    onRaid?: () => void;
    onDock?: () => void;
}

export const SectorEntity: React.FC<SectorEntityProps> = ({ name, sub, align = "0", level = "5", onRaid, onDock }) => (
    <div className="w-full max-w-[340px] bg-[#0b131e]/80 border border-[#223344] rounded-md shadow-lg backdrop-blur-sm group overflow-hidden flex flex-col mb-2 relative z-20 shrink-0">
        <div className="p-4 pb-3 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#00ccff] to-transparent opacity-40"></div>
            <h2 className="text-white font-bold text-[14px] tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)] mb-1">
                {name}
            </h2>
            {sub && (
                <h3 className="text-[#aaccff] text-[11px] tracking-wide mb-3 opacity-80">
                    {sub}
                </h3>
            )}

            <div className="flex justify-center gap-6 text-[10px] text-[#667788] mb-3 font-mono">
                <div>Alignment: <span className="text-[#8899aa]">{align}</span></div>
                <div>Level: <span className="text-[#8899aa]">{level}</span></div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={onDock}
                    className="text-white font-bold text-[11px] tracking-wider hover:text-[#00ccff] hover:shadow-[0_0_10px_rgba(0,204,255,0.5)] transition-all uppercase"
                >
                    [DOCK]
                </button>
                <button
                    onClick={onRaid}
                    className="text-red-400 font-bold text-[11px] tracking-wider hover:text-red-200 hover:shadow-[0_0_10px_rgba(255,0,0,0.5)] transition-all uppercase"
                >
                    [RAID]
                </button>
            </div>
        </div>
    </div>
);
