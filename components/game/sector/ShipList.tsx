import React from 'react';
import { ShipData } from '../types';

const StatusBadge: React.FC<{ type: 'cloak' | 'deploy' }> = ({ type }) => {
    if (type === 'cloak') {
        return (
            <div className="w-[48px] h-[9px] bg-[#220000] border border-[#ff0000] flex items-center justify-center rounded-[1px] mb-[1px] shadow-[0_0_2px_rgba(255,0,0,0.5)]">
                <span className="text-[6px] text-[#ff0000] font-bold leading-none tracking-widest uppercase">CLOAKED</span>
            </div>
        );
    }
    if (type === 'deploy') {
        return (
            <div className="w-[48px] h-[9px] bg-[#222200] border border-[#ffff00] flex items-center justify-center rounded-[1px] mb-[1px] shadow-[0_0_2px_rgba(255,255,0,0.5)]">
                <span className="text-[6px] text-[#ffff00] font-bold leading-none tracking-widest uppercase">DEPLOYED</span>
            </div>
        );
    }
    return null;
};

export const StandardPlayerRow: React.FC<{ data: ShipData, onExamine?: (ship: ShipData) => void, actionLabel?: string }> = ({ data, onExamine, actionLabel = "[Examine]" }) => {
    const {
        shipName, playerName, guild, race, shipClass,
        shipLevel, playerLevel, rating,
        isOnline, status
    } = data;

    const allianceSeed = guild ? guild.replace(/\W/g, '') : 'neutral';
    const personalSeed = playerName.replace(/\W/g, '') || 'unknown';
    const allianceTagUrl = `https://picsum.photos/seed/${allianceSeed}/50/20`;
    const personalTagUrl = `https://picsum.photos/seed/${personalSeed}/150/20`;

    const getRaceColor = (r: string) => {
        switch (r) {
            case 'Kitaran': return 'text-red-400';
            case 'Derivian': return 'text-blue-400';
            case 'Zallun': return 'text-green-400';
            case 'Wraith': return 'text-purple-400';
            case 'Taenarian': return 'text-yellow-200';
            case 'Sniv': return 'text-orange-400';
            case 'Scourge': return 'text-red-600';
            default: return 'text-[#aaccff]';
        }
    };
    const nameColor = getRaceColor(race);

    return (
        <div className="grid grid-cols-[50px_150px_1fr_70px_30px_60px] gap-x-1 border-b border-[#002244] hover:bg-[#001133] text-[9px] group cursor-pointer bg-[#020408] transition-colors py-1 px-1 min-w-[500px]">
            <div className="flex items-start justify-center">
                <img src={allianceTagUrl} alt="Ally" className="w-[50px] h-[20px] object-cover block bg-[#111] border border-[#333]" />
            </div>
            <div className="flex items-start justify-start">
                <img src={personalTagUrl} alt="Personal" className="w-[150px] h-[20px] object-cover block bg-[#222] border border-[#333] border-l-0" />
            </div>
            <div className="flex items-center pl-1 overflow-hidden h-[20px]">
                <span className="text-white font-bold text-[10px] truncate drop-shadow-md">
                    {shipName || <span className="opacity-50 italic">Unidentified Vessel</span>}
                </span>
            </div>
            <div className="flex items-center justify-end h-[20px]">
                <span className="text-[#8899aa] text-[9px] truncate">{shipClass}</span>
            </div>
            <div className="flex items-center justify-end px-1 h-[20px]">
                <span className="text-white text-[9px] font-bold">L: {shipLevel}</span>
            </div>
            <div className="flex items-center justify-end pr-1 h-[20px]">
                <span className="text-[#00ccff] font-bold text-[9px]">{rating}</span>
            </div>
            <div className="flex flex-col items-center justify-start pt-0.5 min-h-[14px]">
                {status?.includes('Cloaked') && <StatusBadge type="cloak" />}
                {status?.includes('Deployed') && <StatusBadge type="deploy" />}
            </div>
            <div className="bg-[#000]/10 border-r border-[#112233]/20"></div>
            <div className="flex items-start pt-0.5 pl-1">
                <span className={`${nameColor} text-[9px] font-bold mr-1 truncate`}>{playerName}</span>
                {isOnline && <span className="text-[#446644] text-[8px] font-mono tracking-tight">[ONLINE]</span>}
            </div>
            <div className="flex items-start justify-end pt-0.5">
                <span className="text-[#445566] text-[8px] uppercase tracking-wider">{race}</span>
            </div>
            <div className="flex items-start justify-end px-1 pt-0.5">
                <span className="text-[#556677] text-[8px]">L: {playerLevel}</span>
            </div>
            <div className="flex items-start justify-end pr-1 pt-0.5">
                <span
                    className="text-[#0088aa] group-hover:text-[#00ccff] text-[8px] hover:underline cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onExamine?.(data);
                    }}
                >{actionLabel}</span>
            </div>
        </div>
    );
};

interface ShipListProps {
    ships: ShipData[];
    header: string;
    onExamine?: (ship: ShipData) => void;
}

export const ShipList: React.FC<ShipListProps> = ({ ships, header, onExamine }) => {
    return (
        <div className="flex flex-col w-full min-w-[500px] overflow-x-auto mt-4">
            <div className="bg-[#0d1520] border border-[#223344] border-b-0 py-1 text-center">
                <span className="text-white font-bold text-[11px] uppercase tracking-wider shadow-black drop-shadow-md">
                    {header}
                </span>
            </div>

            <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[24px] backdrop-blur-sm shadow-md grid grid-cols-[50px_150px_1fr_70px_30px_60px] gap-x-1 items-center text-[#667788] text-[8px] uppercase tracking-wider">
                <div className="text-center"></div>
                <div className="text-left pl-1"></div>
                <div className="text-left pl-1">Name</div>
                <div className="text-right">Class/Race</div>
                <div className="text-right px-1">Lvl</div>
                <div className="text-right pr-1">Rating</div>
            </div>

            <div className="border border-[#003366] bg-black/50 shadow-lg rounded-b-sm overflow-hidden flex flex-col backdrop-blur-sm">
                {ships.length > 0 ? (
                    ships.map(ship => (
                        <StandardPlayerRow key={ship.id} data={ship} onExamine={onExamine} />
                    ))
                ) : (
                    <div className="p-4 text-center text-[#445566] italic text-[10px]">
                        No other ships detected in this area.
                    </div>
                )}
            </div>
        </div>
    );
};
