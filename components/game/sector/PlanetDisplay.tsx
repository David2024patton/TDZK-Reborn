import React from 'react';

interface PlanetDisplayProps {
    name: string;
    ownerName: string;
    allianceName?: string;
    rating: string;
    population: string;
    alignment: string;
    relationship?: string;
    onAttack?: () => void;
    onLand?: () => void;
}

export const PlanetDisplay: React.FC<PlanetDisplayProps> = ({
    name, ownerName, allianceName, rating, population, alignment, relationship, onAttack, onLand
}) => {
    const isWar = relationship?.toLowerCase().includes('war');
    const isAlly = relationship?.toLowerCase().includes('allied') || relationship?.toLowerCase().includes('peace');
    const relColor = isWar ? "text-red-600" : (isAlly ? "text-green-500" : "text-yellow-500");

    return (
        <div className="w-full max-w-[400px] bg-[#0b131e]/90 border border-[#223344] rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-sm flex flex-col mb-4 relative z-20 shrink-0 overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#004488]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#004488]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#004488]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#004488]"></div>

            <div className="py-2 text-center bg-gradient-to-r from-[#000000] via-[#112233] to-[#000000] border-b border-[#223344] relative">
                <div className="text-white font-bold text-[18px] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{name}</div>
            </div>

            <div className="p-4 text-center flex flex-col items-center gap-1.5">
                <div className="text-[#8899aa] text-[11px]">
                    Owned by: <span className="text-white font-bold tracking-wide">{ownerName}</span>
                </div>
                {allianceName && (
                    <div className="text-[#eccc66] text-[10px] tracking-wide mb-1 font-bold">
                        {allianceName}
                    </div>
                )}

                <div className="w-2/3 h-[1px] bg-[#223344] my-1"></div>

                <div className="text-[#eccc66] font-bold text-[12px] tracking-wider">
                    Rating: <span className="text-white">{rating}</span>
                </div>

                <div className="text-[#66cc66] text-[11px]">
                    Population: <span className="text-white font-mono">{population}</span>
                </div>

                <div className="text-[#8899aa] text-[11px]">
                    Alignment: <span className="text-white">{alignment}</span>
                </div>

                {relationship && (
                    <div className="mt-2 flex flex-col items-center">
                        <div className="text-[#667788] text-[9px] uppercase tracking-widest mb-0.5">Alliance Relationship</div>
                        <div className={`font-bold text-[14px] uppercase tracking-wide ${relColor} drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]`}>
                            {relationship}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center items-center gap-6 bg-[#000000]/60 p-3 border-t border-[#223344]">
                <button
                    onClick={onLand}
                    className="text-[#cccccc] hover:text-white font-bold text-[14px] uppercase tracking-widest hover:text-shadow-[0_0_8px_white] transition-all"
                >
                    [LAND]
                </button>
                <button
                    onClick={onAttack}
                    className="text-[#ff4444] hover:text-[#ff8888] font-bold text-[14px] uppercase tracking-widest hover:text-shadow-[0_0_8px_red] transition-all"
                >
                    [ATTACK]
                </button>
            </div>
        </div>
    );
};
