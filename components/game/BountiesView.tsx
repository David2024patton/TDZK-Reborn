import React, { useState } from 'react';

// --- Types ---

interface Bounty {
    id: string;
    target: string;
    targetAlliance?: string;
    targetRace: string;
    targetLevel: number;
    amount: number;
    placedBy: string;
    placedByAlliance?: string;
    hoursActive: number;
}

interface Hunter {
    rank: number;
    name: string;
    alliance?: string;
    race: string;
    bountiesClaimed: number;
    totalEarned: number;
    reputation: string;
}

// --- Mock Data ---

const MOCK_BOUNTIES: Bounty[] = [
    { id: 'b1', target: "Vader", targetAlliance: "IMP", targetRace: "Human", targetLevel: 300, amount: 50000000, placedBy: "Mothma", placedByAlliance: "REB", hoursActive: 48 },
    { id: 'b2', target: "Blackbeard", targetAlliance: "PIR", targetRace: "Human", targetLevel: 150, amount: 10000000, placedBy: "Gov. Swann", placedByAlliance: "ROYAL", hoursActive: 168 },
    { id: 'b3', target: "Solo", targetAlliance: "REB", targetRace: "Human", targetLevel: 250, amount: 25000000, placedBy: "Jabba", placedByAlliance: "HUTT", hoursActive: 72 },
    { id: 'b4', target: "Sparky", targetRace: "Kitaran", targetLevel: 128, amount: 5000000, placedBy: "Unknown", hoursActive: 24 },
    { id: 'b5', target: "Xenon", targetAlliance: "AI", targetRace: "Android", targetLevel: 99, amount: 1500000, placedBy: "SystemAuth", hoursActive: 5 },
    { id: 'b6', target: "Kryten", targetAlliance: "JUP", targetRace: "Android", targetLevel: 45, amount: 500000, placedBy: "Rimmer", placedByAlliance: "HOL", hoursActive: 0 },
];

const MOCK_HUNTERS: Hunter[] = [
    { rank: 1, name: "Boba Fett", alliance: "BHG", race: "Human", bountiesClaimed: 142, totalEarned: 1500000000, reputation: "Legendary" },
    { rank: 2, name: "Din Djarin", alliance: "MANDO", race: "Human", bountiesClaimed: 89, totalEarned: 850000000, reputation: "Elite" },
    { rank: 3, name: "Cad Bane", alliance: "MERC", race: "Duros", bountiesClaimed: 76, totalEarned: 720000000, reputation: "Notorious" },
    { rank: 4, name: "Bossk", alliance: "TRANDO", race: "Trandoshan", bountiesClaimed: 55, totalEarned: 450000000, reputation: "Feared" },
    { rank: 5, name: "IG-88", alliance: "DROID", race: "Droid", bountiesClaimed: 42, totalEarned: 380000000, reputation: "Ruthless" },
];

const CURRENT_USER_ALLIANCE = "Rebels";

const MOCK_ONLINE_PLAYERS = [
    { id: '1', name: "Sparky", alliance: "Renegades" },
    { id: '2', name: "Helios", alliance: "Staff" },
    { id: '3', name: "Vader", alliance: "Empire" },
    { id: '4', name: "Newbie123", alliance: "None" },
    { id: '5', name: "XChaosX", alliance: "Staff" },
    { id: '6', name: "Wolfi", alliance: "Renegades" },
    { id: '7', name: "Solo", alliance: "Rebels" },
    { id: '8', name: "Boba", alliance: "Hunters" },
    { id: '9', name: "Jabba", alliance: "Hutt Cartel" },
    { id: '10', name: "Luke", alliance: "Rebels" },
    { id: '11', name: "Leia", alliance: "Rebels" },
    { id: '12', name: "Chewie", alliance: "Rebels" },
];

type Tab = 'wanted' | 'place' | 'rankings';

// --- Components ---

const IdentityColumn: React.FC<{ name: string, alliance?: string }> = ({ name, alliance }) => {
    const allianceSeed = alliance ? alliance.replace(/\W/g, '') : 'neutral';
    const personalSeed = name.replace(/\W/g, '');
    const allianceTagUrl = `https://picsum.photos/seed/${allianceSeed}/50/20`;
    const personalTagUrl = `https://picsum.photos/seed/${personalSeed}/150/20`;

    return (
        <div className="flex items-start justify-start w-[200px]">
            <img src={allianceTagUrl} alt="Ally" className="w-[50px] h-[20px] object-cover block bg-[#111] border border-[#333]" />
            <img src={personalTagUrl} alt="Personal" className="w-[150px] h-[20px] object-cover block bg-[#222] border border-[#333] border-l-0" />
        </div>
    );
};

const RaceText: React.FC<{ race: string }> = ({ race }) => {
    let colorClass = 'text-[#aaccff]';
    switch (race) {
        case 'Kitaran': colorClass = 'text-red-400'; break;
        case 'Derivian': colorClass = 'text-blue-400'; break;
        case 'Zallun': colorClass = 'text-green-400'; break;
        case 'Wraith': colorClass = 'text-purple-400'; break;
        case 'Terran': case 'Human': colorClass = 'text-yellow-200'; break;
        case 'Android': case 'Droid': colorClass = 'text-gray-400'; break;
    }
    return <span className={`${colorClass} text-[10px] uppercase tracking-wider`}>{race}</span>;
};

export const BountiesView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('wanted');
    const [bounties, setBounties] = useState(MOCK_BOUNTIES);

    // Place Bounty Form State
    const [targetName, setTargetName] = useState('');
    const [bountyAmount, setBountyAmount] = useState('');

    const handlePlaceBounty = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetName || !bountyAmount) return;

        const newBounty: Bounty = {
            id: `b${Date.now()}`,
            target: targetName,
            targetRace: "Unknown",
            targetLevel: Math.floor(Math.random() * 100) + 1,
            amount: parseInt(bountyAmount),
            placedBy: "You",
            placedByAlliance: "PLAYER",
            hoursActive: 0
        };

        setBounties([newBounty, ...bounties]);
        setTargetName('');
        setBountyAmount('');
        setActiveTab('wanted');
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {/* Header */}
            <div className="w-full max-w-[900px] mb-6 text-center">
                <h2 className="text-[#00ccff] font-bold text-[24px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,204,255,0.5)] mb-2">
                    Bounty Office
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#004488] to-transparent mb-4"></div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('wanted')}
                        className={`px-4 py-2 text-[12px] font-bold uppercase tracking-wider border transition-all ${activeTab === 'wanted' ? 'bg-[#004488] text-white border-[#00ccff] shadow-[0_0_10px_rgba(0,204,255,0.5)]' : 'bg-[#001122] text-[#667788] border-[#223344] hover:text-[#00ccff] hover:border-[#00ccff]'}`}
                    >
                        Wanted List
                    </button>
                    <button
                        onClick={() => setActiveTab('place')}
                        className={`px-4 py-2 text-[12px] font-bold uppercase tracking-wider border transition-all ${activeTab === 'place' ? 'bg-[#004488] text-white border-[#00ccff] shadow-[0_0_10px_rgba(0,204,255,0.5)]' : 'bg-[#001122] text-[#667788] border-[#223344] hover:text-[#00ccff] hover:border-[#00ccff]'}`}
                    >
                        Place Bounty
                    </button>
                    <button
                        onClick={() => setActiveTab('rankings')}
                        className={`px-4 py-2 text-[12px] font-bold uppercase tracking-wider border transition-all ${activeTab === 'rankings' ? 'bg-[#004488] text-white border-[#00ccff] shadow-[0_0_10px_rgba(0,204,255,0.5)]' : 'bg-[#001122] text-[#667788] border-[#223344] hover:text-[#00ccff] hover:border-[#00ccff]'}`}
                    >
                        Hunter Rankings
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full max-w-[900px]">

                {/* WANTED LIST TAB */}
                {activeTab === 'wanted' && (
                    <>
                        {/* List Header */}
                        <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md grid grid-cols-[200px_1fr_120px_120px_80px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider">
                            <div className="text-left pl-1">Identity</div>
                            <div className="text-left pl-1">Target</div>
                            <div className="text-right">Reward</div>
                            <div className="text-right">Placed By</div>
                            <div className="text-right pr-1">Age</div>
                        </div>

                        <div className="border border-[#003366] bg-black/50 shadow-lg rounded-b-sm overflow-hidden flex flex-col backdrop-blur-sm">
                            {bounties.map((bounty) => (
                                <div key={bounty.id} className="grid grid-cols-[200px_1fr_120px_120px_80px] gap-x-1 border-b border-[#002244] hover:bg-[#001133] text-[11px] group cursor-pointer bg-[#020408] transition-colors py-1 px-1 h-[34px] items-center">
                                    <IdentityColumn name={bounty.target} alliance={bounty.targetAlliance} />

                                    <div className="flex items-center pl-1 overflow-hidden h-[24px]">
                                        <span className="text-white font-bold text-[14px] truncate drop-shadow-md group-hover:text-[#ff4444] transition-colors">
                                            {bounty.target}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-end h-[24px]">
                                        <span className="text-[#00ff00] font-bold text-[14px] font-mono tracking-wide">${(bounty.amount / 1000000).toFixed(1)}M</span>
                                    </div>

                                    <div className="flex flex-col items-end justify-center h-[24px] leading-none">
                                        <span className="text-[#cccccc] text-[12px]">{bounty.placedBy}</span>
                                    </div>

                                    <div className="flex items-center justify-end pr-1 h-[24px]">
                                        <span className="text-[#667788] text-[12px] font-mono">{bounty.hoursActive}h</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* PLACE BOUNTY TAB */}
                {activeTab === 'place' && (
                    <div className="bg-[#050a10] border border-[#223344] p-8 shadow-lg">
                        <h3 className="text-[#00ccff] font-bold text-[18px] mb-6 uppercase tracking-wide text-center">New Bounty Contract</h3>
                        <form onSubmit={handlePlaceBounty} className="max-w-[400px] mx-auto flex flex-col gap-4">
                            <div>
                                <label className="block text-[#667788] text-[12px] uppercase font-bold mb-1">Target Name</label>
                                <select
                                    value={targetName}
                                    onChange={(e) => setTargetName(e.target.value)}
                                    className="w-full bg-[#001122] border border-[#223344] text-white p-2 text-[14px] focus:border-[#00ccff] focus:outline-none transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select a target...</option>
                                    {MOCK_ONLINE_PLAYERS
                                        .filter(p => p.alliance !== CURRENT_USER_ALLIANCE)
                                        .map(p => (
                                            <option key={p.id} value={p.name}>
                                                {p.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#667788] text-[12px] uppercase font-bold mb-1">Reward Amount (Credits)</label>
                                <input
                                    type="number"
                                    value={bountyAmount}
                                    onChange={(e) => setBountyAmount(e.target.value)}
                                    className="w-full bg-[#001122] border border-[#223344] text-[#00ff00] p-2 text-[14px] font-mono focus:border-[#00ccff] focus:outline-none transition-colors"
                                    placeholder="0"
                                />
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-[#004488] hover:bg-[#0055aa] text-white font-bold py-3 uppercase tracking-widest text-[14px] transition-all border border-[#0066cc] shadow-[0_0_15px_rgba(0,100,255,0.3)]"
                                >
                                    Authorize Bounty
                                </button>
                            </div>
                            <p className="text-center text-[#445566] text-[11px] mt-2">
                                * A 5% guild processing fee will be deducted from your account.
                            </p>
                        </form>
                    </div>
                )}

                {/* RANKINGS TAB */}
                {activeTab === 'rankings' && (
                    <>
                        {/* List Header */}
                        <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md grid grid-cols-[30px_200px_1fr_60px_60px_80px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider">
                            <div className="text-center">#</div>
                            <div className="text-left pl-1">Identity</div>
                            <div className="text-left pl-1">Hunter</div>
                            <div className="text-right">Race</div>
                            <div className="text-right">Claims</div>
                            <div className="text-right pr-1">Earned</div>
                        </div>

                        <div className="border border-[#003366] bg-black/50 shadow-lg rounded-b-sm overflow-hidden flex flex-col backdrop-blur-sm">
                            {MOCK_HUNTERS.map((hunter) => (
                                <div key={hunter.rank} className="grid grid-cols-[30px_200px_1fr_60px_60px_80px] gap-x-1 border-b border-[#002244] hover:bg-[#001133] text-[11px] group cursor-pointer bg-[#020408] transition-colors py-1 px-1 h-[34px] items-center">
                                    <div className="text-center font-bold text-[#eccc66] font-mono">
                                        {hunter.rank}
                                    </div>

                                    <IdentityColumn name={hunter.name} alliance={hunter.alliance} />

                                    <div className="flex items-center pl-1 overflow-hidden h-[24px]">
                                        <span className="text-white font-bold text-[12px] truncate drop-shadow-md">
                                            {hunter.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-end h-[24px]">
                                        <RaceText race={hunter.race} />
                                    </div>

                                    <div className="flex items-center justify-end h-[24px]">
                                        <span className="text-white font-mono">{hunter.bountiesClaimed}</span>
                                    </div>

                                    <div className="flex items-center justify-end pr-1 h-[24px]">
                                        <span className="text-[#00ff00] font-bold text-[11px] font-mono">${(hunter.totalEarned / 1000000).toFixed(0)}M</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};
