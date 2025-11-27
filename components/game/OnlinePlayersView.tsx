
import React, { useState } from 'react';

interface OnlinePlayer {
    id: string;
    name: string;
    rank: string;
    alliance: string;
    isGuide: boolean;
    status: 'Active' | 'Idle';
    race: string;
    level: number;
    kills: number;
    raids: number;
    droneKills: number;
}

const MOCK_ONLINE_PLAYERS: OnlinePlayer[] = [
    { id: '1', name: "Sparky", rank: "Emperor", alliance: "Renegades", isGuide: false, status: 'Active', race: 'Terran', level: 250, kills: 1500, raids: 50, droneKills: 300 },
    { id: '2', name: "Helios", rank: "Guide", alliance: "Staff", isGuide: true, status: 'Active', race: 'Kitaran', level: 300, kills: 0, raids: 0, droneKills: 0 },
    { id: '3', name: "Vader", rank: "Sith Lord", alliance: "Empire", isGuide: false, status: 'Idle', race: 'Derivian', level: 240, kills: 5000, raids: 200, droneKills: 1000 },
    { id: '4', name: "Newbie123", rank: "Cadet", alliance: "None", isGuide: false, status: 'Active', race: 'Terran', level: 5, kills: 0, raids: 0, droneKills: 2 },
    { id: '5', name: "XChaosX", rank: "Moderator", alliance: "Staff", isGuide: true, status: 'Active', race: 'Zallun', level: 280, kills: 100, raids: 10, droneKills: 50 },
    { id: '6', name: "Wolfi", rank: "Warlord", alliance: "Renegades", isGuide: false, status: 'Active', race: 'Kitaran', level: 245, kills: 1200, raids: 45, droneKills: 250 },
    { id: '7', name: "Solo", rank: "Smuggler", alliance: "Rebels", isGuide: false, status: 'Idle', race: 'Terran', level: 150, kills: 300, raids: 80, droneKills: 100 },
    { id: '8', name: "Boba", rank: "Hunter", alliance: "Hunters", isGuide: false, status: 'Active', race: 'Wraith', level: 200, kills: 800, raids: 120, droneKills: 400 },
    { id: '9', name: "Jabba", rank: "Crime Lord", alliance: "Hutt Cartel", isGuide: false, status: 'Idle', race: 'Zallun', level: 180, kills: 50, raids: 10, droneKills: 20 },
    { id: '10', name: "Luke", rank: "Jedi", alliance: "Rebels", isGuide: false, status: 'Active', race: 'Terran', level: 220, kills: 600, raids: 30, droneKills: 500 },
    { id: '11', name: "Leia", rank: "Princess", alliance: "Rebels", isGuide: false, status: 'Active', race: 'Terran', level: 210, kills: 200, raids: 20, droneKills: 150 },
    { id: '12', name: "Chewie", rank: "Wookiee", alliance: "Rebels", isGuide: false, status: 'Active', race: 'Kitaran', level: 230, kills: 900, raids: 60, droneKills: 600 },
];

export const OnlinePlayersView: React.FC = () => {
    const [sortMode, setSortMode] = useState<'Level' | 'Kills' | 'Raids' | 'Drone Kills'>('Level');
    const [raceFilter, setRaceFilter] = useState<string>('All');

    const getSortedPlayers = () => {
        let filtered = MOCK_ONLINE_PLAYERS;
        if (raceFilter !== 'All') {
            filtered = filtered.filter(p => p.race === raceFilter);
        }
        return [...filtered].sort((a, b) => {
            switch (sortMode) {
                case 'Level': return b.level - a.level;
                case 'Kills': return b.kills - a.kills;
                case 'Raids': return b.raids - a.raids;
                case 'Drone Kills': return b.droneKills - a.droneKills;
                default: return 0;
            }
        });
    };

    const sortedPlayers = getSortedPlayers();

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            <div className="w-full max-w-[800px] mb-6 text-center">
                <h2 className="text-[#00ccff] font-bold text-[24px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,204,255,0.5)] mb-2">
                    Galactic Comms
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#004488] to-transparent mb-4"></div>

                {/* Controls */}
                <div className="flex flex-col gap-2 mb-4 bg-[#001122] border border-[#223344] p-3 rounded">
                    <div className="flex justify-between items-center">
                        <div className="text-[#667788] text-[11px] font-bold">SORT BY:</div>
                        <div className="flex gap-1">
                            {['Level', 'Kills', 'Raids', 'Drone Kills'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setSortMode(mode as any)}
                                    className={`px-2 py-1 text-[9px] uppercase font-bold border rounded transition-colors ${sortMode === mode
                                        ? 'bg-[#00ccff] text-black border-[#00ccff]'
                                        : 'bg-[#050a10] text-[#667788] border-[#223344] hover:text-[#aaccff]'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[1px] bg-[#112233] w-full"></div>
                    <div className="flex justify-between items-center">
                        <div className="text-[#667788] text-[11px] font-bold">FILTER RACE:</div>
                        <div className="flex gap-1">
                            {['All', 'Terran', 'Kitaran', 'Derivian', 'Zallun', 'Wraith'].map(race => (
                                <button
                                    key={race}
                                    onClick={() => setRaceFilter(race)}
                                    className={`px-2 py-1 text-[9px] uppercase font-bold border rounded transition-colors ${raceFilter === race
                                        ? 'bg-[#ffaa00] text-black border-[#ffaa00]'
                                        : 'bg-[#050a10] text-[#667788] border-[#223344] hover:text-[#ffcc66]'
                                        }`}
                                >
                                    {race}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* List Header */}
            <div className="w-full max-w-[800px]">
                <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[24px] backdrop-blur-sm shadow-md grid grid-cols-[200px_1fr_70px_30px_60px] gap-x-1 items-center text-[#667788] text-[8px] uppercase tracking-wider">
                    <div className="text-left pl-1">Identity</div>
                    <div className="text-left pl-1">Pilot Name</div>
                    <div className="text-right">Race</div>
                    <div className="text-right px-1">Lvl</div>
                    <div className="text-right pr-1">Stat</div>
                </div>

                <div className="border border-[#003366] bg-black/50 shadow-lg rounded-b-sm overflow-hidden flex flex-col backdrop-blur-sm">
                    {sortedPlayers.map(player => (
                        <PlayerRow key={player.id} player={player} sortMode={sortMode} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const PlayerRow: React.FC<{ player: OnlinePlayer, sortMode: string }> = ({ player, sortMode }) => {
    const allianceSeed = player.alliance ? player.alliance.replace(/\W/g, '') : 'neutral';
    const personalSeed = player.name.replace(/\W/g, '');
    const allianceTagUrl = `https://picsum.photos/seed/${allianceSeed}/50/20`;
    const personalTagUrl = `https://picsum.photos/seed/${personalSeed}/150/20`;

    const getRaceColor = (r: string) => {
        switch (r) {
            case 'Kitaran': return 'text-red-400';
            case 'Derivian': return 'text-blue-400';
            case 'Zallun': return 'text-green-400';
            case 'Wraith': return 'text-purple-400';
            case 'Terran': return 'text-yellow-200';
            default: return 'text-[#aaccff]';
        }
    };

    const getStatValue = () => {
        switch (sortMode) {
            case 'Level': return player.level;
            case 'Kills': return player.kills;
            case 'Raids': return player.raids;
            case 'Drone Kills': return player.droneKills;
            default: return player.level;
        }
    };

    return (
        <div className="grid grid-cols-[200px_1fr_70px_30px_60px] gap-x-1 border-b border-[#002244] hover:bg-[#001133] text-[9px] group cursor-pointer bg-[#020408] transition-colors py-1 px-1 h-[30px] items-center">
            <div className="flex items-start justify-start">
                <img src={allianceTagUrl} alt="Ally" className="w-[50px] h-[20px] object-cover block bg-[#111] border border-[#333]" />
                <img src={personalTagUrl} alt="Personal" className="w-[150px] h-[20px] object-cover block bg-[#222] border border-[#333] border-l-0" />
            </div>
            <div className="flex items-center pl-1 overflow-hidden h-[20px]">
                <span className="text-white font-bold text-[10px] truncate drop-shadow-md">
                    {player.name}
                </span>
            </div>
            <div className="flex items-center justify-end h-[20px]">
                <span className={`${getRaceColor(player.race)} text-[9px] uppercase tracking-wider`}>{player.race}</span>
            </div>
            <div className="flex items-center justify-end px-1 h-[20px]">
                <span className="text-white text-[9px] font-bold">{player.level}</span>
            </div>
            <div className="flex items-center justify-end pr-1 h-[20px]">
                <span className="text-[#00ccff] font-bold text-[9px]">{getStatValue()}</span>
            </div>
        </div>
    );
};
