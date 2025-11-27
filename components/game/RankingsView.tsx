
import React, { useState } from 'react';

interface RankingEntry {
    rank: number;
    name: string;
    guildRank: string;
    level: number;
    race: string;
    guild: string;
    value: number | string;
    subValue?: string; // For K/Avg or similar
}

type RankingCategory = 'EXP' | 'Kills' | 'NPC Kills' | 'Bounties' | 'Ports Raided' | 'Pirates' | 'Trading' | 'Gathering';

const MOCK_RANKINGS: Record<RankingCategory, RankingEntry[]> = {
    'EXP': [
        { rank: 1, name: "Sparky", guildRank: "Emperor", level: 128, race: "Kitaran", guild: "Renegades", value: "2,450,100,500" },
        { rank: 2, name: "Cryton", guildRank: "High Lord", level: 612, race: "Zallun", guild: "Renegades", value: "1,890,220,000" },
        { rank: 3, name: "Wolfi", guildRank: "Warlord", level: 445, race: "Derivian", guild: "Renegades", value: "1,200,500,100" },
        { rank: 4, name: "Vader", guildRank: "Sith Lord", level: 300, race: "Human", guild: "Empire", value: "900,000,000" },
        { rank: 5, name: "Solo", guildRank: "Smuggler", level: 250, race: "Human", guild: "Rebels", value: "850,000,000" },
    ],
    'Kills': [
        { rank: 1, name: "Vader", guildRank: "Sith Lord", level: 300, race: "Human", guild: "Empire", value: 5432, subValue: "98%" },
        { rank: 2, name: "Sparky", guildRank: "Emperor", level: 128, race: "Kitaran", guild: "Renegades", value: 4100, subValue: "95%" },
        { rank: 3, name: "Boba", guildRank: "Hunter", level: 280, race: "Mandalorian", guild: "Hunters", value: 3800, subValue: "99%" },
    ],
    'NPC Kills': [],
    'Bounties': [],
    'Ports Raided': [
        { rank: 1, name: "Blackbeard", guildRank: "Captain", level: 150, race: "Human", guild: "Pirates", value: 500 },
        { rank: 2, name: "Sparrow", guildRank: "Captain", level: 140, race: "Human", guild: "Pirates", value: 450 },
    ],
    'Pirates': [],
    'Trading': [],
    'Gathering': []
};

// Helper for generating seed-based images
const getAllyTag = (seed: string) => `https://picsum.photos/seed/${seed.replace(/\W/g, '')}/50/20`;
const getPersonalTag = (seed: string) => `https://picsum.photos/seed/${seed.replace(/\W/g, '')}/150/20`;

export const RankingsView: React.FC = () => {
    const [category, setCategory] = useState<RankingCategory>('EXP');

    const data = MOCK_RANKINGS[category] || [];

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {/* Header */}
            <div className="w-full max-w-[800px] mb-6 text-center">
                <h2 className="text-[#00ccff] font-bold text-[24px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,204,255,0.5)] mb-2">
                    Galactic Rankings
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#004488] to-transparent mb-4"></div>

                {/* Category Buttons */}
                <div className="flex flex-wrap justify-center gap-1">
                    {(Object.keys(MOCK_RANKINGS) as RankingCategory[]).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`
                                px-3 py-1 text-[10px] font-bold uppercase tracking-wider border transition-all rounded
                                ${category === cat
                                    ? 'bg-[#00ccff] text-black border-[#00ccff] shadow-[0_0_10px_rgba(0,204,255,0.3)]'
                                    : 'bg-[#050a10] text-[#667788] border-[#223344] hover:text-[#aaccff]'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Header */}
            <div className="w-full max-w-[800px]">
                <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[24px] backdrop-blur-sm shadow-md grid grid-cols-[30px_200px_1fr_70px_30px_100px] gap-x-1 items-center text-[#667788] text-[8px] uppercase tracking-wider">
                    <div className="text-center">#</div>
                    <div className="text-left pl-1">Identity</div>
                    <div className="text-left pl-1">Pilot Name</div>
                    <div className="text-right">Race</div>
                    <div className="text-right px-1">Lvl</div>
                    <div className="text-right pr-1">{category}</div>
                </div>

                <div className="border border-[#003366] bg-black/50 shadow-lg rounded-b-sm overflow-hidden flex flex-col backdrop-blur-sm">
                    {data.length > 0 ? (
                        data.map((entry, i) => (
                            <RankingRow key={i} entry={entry} />
                        ))
                    ) : (
                        <div className="p-8 text-center text-[#445566] italic">
                            No ranking data available for this category.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const RankingRow: React.FC<{ entry: RankingEntry }> = ({ entry }) => {
    const allianceSeed = entry.guild ? entry.guild.replace(/\W/g, '') : 'neutral';
    const personalSeed = entry.name.replace(/\W/g, '');
    const allianceTagUrl = `https://picsum.photos/seed/${allianceSeed}/50/20`;
    const personalTagUrl = `https://picsum.photos/seed/${personalSeed}/150/20`;

    const getRaceColor = (r: string) => {
        switch (r) {
            case 'Kitaran': return 'text-red-400';
            case 'Derivian': return 'text-blue-400';
            case 'Zallun': return 'text-green-400';
            case 'Wraith': return 'text-purple-400';
            case 'Terran': return 'text-yellow-200';
            case 'Human': return 'text-yellow-200'; // Map Human to Terran color or similar
            case 'Mandalorian': return 'text-orange-400';
            default: return 'text-[#aaccff]';
        }
    };

    return (
        <div className="grid grid-cols-[30px_200px_1fr_70px_30px_100px] gap-x-1 border-b border-[#002244] hover:bg-[#001133] text-[9px] group cursor-pointer bg-[#020408] transition-colors py-1 px-1 h-[30px] items-center">
            <div className="flex items-center justify-center font-bold text-[#eccc66] font-mono">
                {entry.rank}
            </div>
            <div className="flex items-start justify-start">
                <img src={allianceTagUrl} alt="Ally" className="w-[50px] h-[20px] object-cover block bg-[#111] border border-[#333]" />
                <img src={personalTagUrl} alt="Personal" className="w-[150px] h-[20px] object-cover block bg-[#222] border border-[#333] border-l-0" />
            </div>
            <div className="flex items-center pl-1 overflow-hidden h-[20px]">
                <span className="text-white font-bold text-[10px] truncate drop-shadow-md">
                    {entry.name}
                </span>
            </div>
            <div className="flex items-center justify-end h-[20px]">
                <span className={`${getRaceColor(entry.race)} text-[9px] uppercase tracking-wider`}>{entry.race}</span>
            </div>
            <div className="flex items-center justify-end px-1 h-[20px]">
                <span className="text-white text-[9px] font-bold">{entry.level}</span>
            </div>
            <div className="flex flex-col items-end justify-center pr-1 h-[20px]">
                <span className="text-[#00ccff] font-bold text-[9px] font-mono">{entry.value}</span>
                {entry.subValue && <span className="text-[#667788] text-[8px]">{entry.subValue}</span>}
            </div>
        </div>
    );
};
