
import React, { useState } from 'react';

interface PlayerStats {
    name: string;
    id: number;
    level: number;
    race: string;
    class: string;
    shipClass: string;
    shipLevel: number;
    rating: { off: number; def: number };
    xp: number;
    nextLevelXp: number;
    alignment: number;
    credits: number;
    bank: number;
    kills: number;
    pirates: number;
    npcKills: number;
    portsRaided: number;
    deaths: number;
    bountiesClaimed: number;
    gender: 'Male' | 'Female' | 'Unknown';
    bio: string;
    description: string;
    history: string;
}

const MOCK_PLAYER: PlayerStats = {
    name: "CABAAL.",
    id: 960,
    level: 49,
    race: "Zallun",
    class: "Admiral",
    shipClass: "Battleship",
    shipLevel: 245,
    rating: { off: 289, def: 25 },
    xp: 553180173,
    nextLevelXp: 588245000,
    alignment: -248,
    credits: 2326487750,
    bank: 5000000000,
    kills: 124,
    pirates: 45,
    npcKills: 890,
    portsRaided: 12,
    deaths: 3,
    bountiesClaimed: 5,
    gender: 'Male',
    bio: "I am the shadow in the night.",
    description: "Tall, dark, and menacing.",
    history: "Born in the void, raised by wolves... space wolves."
};

export const StatsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Character' | 'Preferences' | 'Account'>('Character');
    const [player, setPlayer] = useState<PlayerStats>(MOCK_PLAYER);

    // Form State for Preferences
    const [bio, setBio] = useState(player.bio);
    const [desc, setDesc] = useState(player.description);
    const [history, setHistory] = useState(player.history);

    const handleSavePreferences = () => {
        setPlayer(prev => ({ ...prev, bio, description: desc, history }));
        alert("Preferences Saved!");
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {/* Header */}
            <div className="w-full max-w-[800px] mb-6 text-center">
                <h2 className="text-[#00ccff] font-bold text-[24px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,204,255,0.5)] mb-2">
                    Character Stats
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#004488] to-transparent mb-4"></div>

                {/* Tabs */}
                <div className="flex justify-center gap-1">
                    {['Character', 'Preferences', 'Account'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`
                                px-6 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-all
                                ${activeTab === tab
                                    ? 'bg-[#004488] text-white border-[#00ccff] shadow-[0_0_10px_rgba(0,100,255,0.5)]'
                                    : 'bg-[#001122] text-[#667788] border-[#223344] hover:text-[#00ccff] hover:border-[#00ccff]'
                                }
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="w-full max-w-[800px] bg-[#050a10] border border-[#223344] shadow-lg p-6 min-h-[400px]">

                {activeTab === 'Character' && (
                    <div className="animate-in fade-in duration-300">
                        {/* Top Section: Identity & Ship */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-3">Pilot Identity</h3>
                                <div className="space-y-2 text-[12px]">
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Name:</span> <span className="text-white font-bold">{player.name} <span className="text-[#667788] font-mono">({player.id})</span></span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Race:</span> <span className="text-[#eccc66]">{player.race}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Class:</span> <span className="text-[#eccc66]">{player.class}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Level:</span> <span className="text-white font-bold">{player.level}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Alignment:</span> <span className={player.alignment < 0 ? 'text-red-400' : 'text-blue-400'}>{player.alignment}</span></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-3">Ship Status</h3>
                                <div className="space-y-2 text-[12px]">
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Class:</span> <span className="text-white">{player.shipClass}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Level:</span> <span className="text-[#eccc66] font-mono">{player.shipLevel}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Rating:</span> <span className="font-mono"><span className="text-red-400">{player.rating.off}</span> / <span className="text-blue-400">{player.rating.def}</span></span></div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="mb-8">
                            <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-[#00ccff]">Experience Progress</span>
                                <span className="text-[#667788] font-mono">{player.xp.toLocaleString()} / {player.nextLevelXp.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-3 bg-[#001122] border border-[#223344] rounded-sm overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#004488] to-[#0088ff]"
                                    style={{ width: `${(player.xp / player.nextLevelXp) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Financials & Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-3">Financials</h3>
                                <div className="space-y-2 text-[12px]">
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Credits:</span> <span className="text-[#00ff00] font-mono">${player.credits.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Bank:</span> <span className="text-[#00ff00] font-mono">${player.bank.toLocaleString()}</span></div>
                                    <div className="flex justify-between border-t border-[#223344] pt-2 mt-2"><span className="text-[#8899aa]">Net Worth:</span> <span className="text-[#00ff00] font-mono font-bold">${(player.credits + player.bank).toLocaleString()}</span></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-3">Combat Record</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Kills:</span> <span className="text-red-400 font-bold">{player.kills}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Deaths:</span> <span className="text-[#666666]">{player.deaths}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">NPC Kills:</span> <span className="text-orange-300">{player.npcKills}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Pirates:</span> <span className="text-yellow-200">{player.pirates}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Raids:</span> <span className="text-white">{player.portsRaided}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Bounties:</span> <span className="text-green-400">{player.bountiesClaimed}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Preferences' && (
                    <div className="animate-in fade-in duration-300 max-w-[600px] mx-auto">
                        <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-6">Public Profile Settings</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[#8899aa] text-[11px] font-bold mb-1 uppercase">Gender</label>
                                <select
                                    value={player.gender}
                                    onChange={(e) => setPlayer({ ...player, gender: e.target.value as any })}
                                    className="w-full bg-[#001122] border border-[#223344] text-white px-2 py-1 text-[12px] outline-none focus:border-[#00ccff]"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Unknown">Unknown</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[#8899aa] text-[11px] font-bold mb-1 uppercase">Biography</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full h-20 bg-[#001122] border border-[#223344] text-white px-2 py-1 text-[12px] outline-none focus:border-[#00ccff] resize-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-[#8899aa] text-[11px] font-bold mb-1 uppercase">Character Description</label>
                                <textarea
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    className="w-full h-20 bg-[#001122] border border-[#223344] text-white px-2 py-1 text-[12px] outline-none focus:border-[#00ccff] resize-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-[#8899aa] text-[11px] font-bold mb-1 uppercase">History</label>
                                <textarea
                                    value={history}
                                    onChange={(e) => setHistory(e.target.value)}
                                    className="w-full h-20 bg-[#001122] border border-[#223344] text-white px-2 py-1 text-[12px] outline-none focus:border-[#00ccff] resize-none"
                                ></textarea>
                            </div>

                            <button
                                onClick={handleSavePreferences}
                                className="w-full bg-[#003366] text-white py-2 font-bold uppercase tracking-wider hover:bg-[#004488] transition-colors text-[12px]"
                            >
                                Save Profile
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Account' && (
                    <div className="animate-in fade-in duration-300 max-w-[600px] mx-auto text-center">
                        <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-6">Account Management</h3>

                        <div className="bg-[#110000] border border-[#330000] p-4 mb-6">
                            <h4 className="text-red-500 font-bold text-[12px] uppercase mb-2">Danger Zone</h4>
                            <p className="text-[#884444] text-[11px] mb-4">
                                Dropping protective turns is irreversible. You will be vulnerable to attack immediately.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button className="bg-[#330000] border border-[#660000] text-[#ff5555] px-3 py-1 text-[10px] font-bold uppercase hover:bg-[#550000]">
                                    Drop Newbie Turns
                                </button>
                                <button className="bg-[#330000] border border-[#660000] text-[#ff5555] px-3 py-1 text-[10px] font-bold uppercase hover:bg-[#550000]">
                                    Drop Exploratory Turns
                                </button>
                            </div>
                        </div>

                        <div className="text-[#667788] text-[11px]">
                            <p>Account Status: <span className="text-green-400">Active</span></p>
                            <p>Last Login: Today</p>
                            <p className="mt-4">
                                <button className="text-[#00ccff] hover:underline">Change Password</button> • <button className="text-[#00ccff] hover:underline">Reset Account</button>
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
