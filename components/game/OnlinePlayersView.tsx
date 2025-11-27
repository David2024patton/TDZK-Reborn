
import React, { useState } from 'react';

interface OnlinePlayer {
    id: string;
    name: string;
    rank: string;
    alliance: string;
    isGuide: boolean;
    status: 'Active' | 'Idle';
}

const MOCK_ONLINE_PLAYERS: OnlinePlayer[] = [
    { id: '1', name: "Sparky", rank: "Emperor", alliance: "Renegades", isGuide: false, status: 'Active' },
    { id: '2', name: "Helios", rank: "Guide", alliance: "Staff", isGuide: true, status: 'Active' },
    { id: '3', name: "Vader", rank: "Sith Lord", alliance: "Empire", isGuide: false, status: 'Idle' },
    { id: '4', name: "Newbie123", rank: "Cadet", alliance: "None", isGuide: false, status: 'Active' },
    { id: '5', name: "XChaosX", rank: "Moderator", alliance: "Staff", isGuide: true, status: 'Active' },
    { id: '6', name: "Wolfi", rank: "Warlord", alliance: "Renegades", isGuide: false, status: 'Active' },
    { id: '7', name: "Solo", rank: "Smuggler", alliance: "Rebels", isGuide: false, status: 'Idle' },
    { id: '8', name: "Boba", rank: "Hunter", alliance: "Hunters", isGuide: false, status: 'Active' },
    { id: '9', name: "Jabba", rank: "Crime Lord", alliance: "Hutt Cartel", isGuide: false, status: 'Idle' },
    { id: '10', name: "Luke", rank: "Jedi", alliance: "Rebels", isGuide: false, status: 'Active' },
    { id: '11', name: "Leia", rank: "Princess", alliance: "Rebels", isGuide: false, status: 'Active' },
    { id: '12', name: "Chewie", rank: "Wookiee", alliance: "Rebels", isGuide: false, status: 'Active' },
];

export const OnlinePlayersView: React.FC = () => {
    const [showGuidesOnly, setShowGuidesOnly] = useState(false);

    const displayedPlayers = showGuidesOnly
        ? MOCK_ONLINE_PLAYERS.filter(p => p.isGuide)
        : MOCK_ONLINE_PLAYERS;

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {/* Header */}
            <div className="w-full max-w-[600px] mb-6 text-center">
                <h2 className="text-[#00ccff] font-bold text-[24px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,204,255,0.5)] mb-2">
                    Galactic Comms
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#004488] to-transparent mb-4"></div>

                <div className="flex justify-between items-center bg-[#001122] border border-[#223344] p-2 rounded">
                    <div className="text-[#667788] text-[11px]">
                        <span className="text-white font-bold">{MOCK_ONLINE_PLAYERS.length}</span> / 6138 Online Players
                    </div>
                    <button
                        onClick={() => setShowGuidesOnly(!showGuidesOnly)}
                        className={`
                            px-3 py-1 text-[10px] font-bold uppercase tracking-wider border rounded transition-all
                            ${showGuidesOnly
                                ? 'bg-[#004488] text-white border-[#00ccff]'
                                : 'bg-[#002244] text-[#667788] border-[#223344] hover:text-[#00ccff]'
                            }
                        `}
                    >
                        {showGuidesOnly ? 'Show All' : 'Show Guides'}
                    </button>
                </div>
            </div>

            {/* Player List */}
            <div className="w-full max-w-[600px] bg-[#050a10] border border-[#223344] shadow-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                        <tr className="bg-[#002244] text-[#00ccff] border-b border-[#004488]">
                            <th className="p-2 pl-4">Pilot Name</th>
                            <th className="p-2">Rank</th>
                            <th className="p-2">Alliance</th>
                            <th className="p-2 text-right pr-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#112233]">
                        {displayedPlayers.map((player) => (
                            <tr key={player.id} className="hover:bg-[#001122] transition-colors">
                                <td className="p-2 pl-4 font-bold text-white flex items-center gap-2">
                                    {player.name}
                                    {player.isGuide && <span className="text-[#00ff00] text-[9px] border border-[#00ff00] px-1 rounded-[2px]">GUIDE</span>}
                                </td>
                                <td className="p-2 text-[#eccc66]">{player.rank}</td>
                                <td className="p-2 text-[#8899aa]">{player.alliance}</td>
                                <td className="p-2 text-right pr-4">
                                    <span className={player.status === 'Active' ? 'text-green-400' : 'text-yellow-600'}>
                                        {player.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
