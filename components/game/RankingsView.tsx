
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

type RankingCategory = 'EXP' | 'Kills' | 'NPC Kills' | 'Bounties' | 'Ports Raided' | 'Pirates' | 'Goods Bought' | 'Total Goods';

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
    'Goods Bought': [],
    'Total Goods': []
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
                                px-3 py-1 text-[10px] font-bold uppercase tracking-wider border transition-all
                                ${category === cat
                                    ? 'bg-[#004488] text-white border-[#00ccff] shadow-[0_0_10px_rgba(0,100,255,0.5)]'
                                    : 'bg-[#001122] text-[#667788] border-[#223344] hover:text-[#00ccff] hover:border-[#00ccff]'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rankings Table */}
            <div className="w-full max-w-[800px] bg-[#050a10] border border-[#223344] shadow-lg">
                <div className="grid grid-cols-[40px_220px_1fr_120px_120px] bg-[#002244] text-[#00ccff] font-bold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-[#004488]">
                    <div className="text-center">Rank</div>
                    <div className="pl-2">Pilot Info</div>
                    <div className="pl-2">Name / Rank</div>
                    <div className="text-right pr-2">Lvl / Race</div>
                    <div className="text-right pr-2">{category}</div>
                </div>

                <div className="divide-y divide-[#112233]">
                    {data.length > 0 ? (
                        data.map((entry, i) => (
                            <div key={i} className="grid grid-cols-[40px_220px_1fr_120px_120px] py-2 px-2 items-center hover:bg-[#ffffff]/5 transition-colors text-[11px]">
                                {/* Rank */}
                                <div className="text-center font-bold text-[#eccc66] text-[14px] font-mono">
                                    {entry.rank}
                                </div>

                                {/* Banners */}
                                <div className="flex flex-col gap-1 pl-2">
                                    <div className="flex items-center gap-1">
                                        <img src={getAllyTag(entry.guild)} alt="Ally" className="w-[50px] h-[20px] object-cover border border-[#333]" />
                                        <span className="text-[9px] text-[#667788]">{entry.guild}</span>
                                    </div>
                                    <img src={getPersonalTag(entry.name)} alt="Personal" className="w-[150px] h-[20px] object-cover border border-[#333]" />
                                </div>

                                {/* Name / Rank */}
                                <div className="pl-2 flex flex-col justify-center">
                                    <span className="text-white font-bold text-[12px]">{entry.name}</span>
                                    <span className="text-[#eccc66] text-[10px]">{entry.guildRank}</span>
                                </div>

                                {/* Level / Race */}
                                <div className="text-right pr-2 flex flex-col justify-center">
                                    <span className="text-white font-bold">L: {entry.level}</span>
                                    <span className="text-[#8899aa] text-[10px]">{entry.race}</span>
                                </div>

                                {/* Value */}
                                <div className="text-right pr-2 flex flex-col justify-center">
                                    <span className="text-[#00ff00] font-mono font-bold">{entry.value}</span>
                                    {entry.subValue && <span className="text-[#888888] text-[9px]">{entry.subValue}</span>}
                                </div>
                            </div>
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
