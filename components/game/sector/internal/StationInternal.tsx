import React, { useState } from 'react';
import { SHIPS, UPGRADES, WEAPONS, DRONES, EQUIPMENT, ITEMS } from '../../../../data/helpData';

interface StationInternalProps {
    name: string;
    onUndock?: () => void;
    onOpenHelp?: (topic: string) => void;
}

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

export const StationInternal: React.FC<StationInternalProps> = ({ name, onUndock, onOpenHelp }) => {
    const [activeTab, setActiveTab] = useState('Ships');
    const [bankBalance, setBankBalance] = useState(50000000);
    const [playerCash, setPlayerCash] = useState(10000000);
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transferTarget, setTransferTarget] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [donationAmount, setDonationAmount] = useState('');
    const [quantities, setQuantities] = useState<Record<string, string>>({});

    const tabs = ['Ships', 'Upgrades', 'Weapons', 'Drones', 'Equipment', 'Items', 'Bounties', 'Bank'];

    const MOCK_CLAIMABLE_BOUNTIES = [
        { target: "Pirate Lord Vex", alliance: "PIR", status: "Eliminated", reward: "5,000,000" },
        { target: "Rogue Drone 77", alliance: "AI", status: "Destroyed", reward: "500,000" },
        { target: "Smuggler Han", alliance: "HUTT", status: "Captured", reward: "1,200,000" }
    ];

    const MOCK_PILOTS = [
        "Ace Rimmer",
        "Starbuck",
        "Maverick",
        "Han Solo",
        "Ellen Ripley"
    ];

    // Interest calculation effect
    React.useEffect(() => {
        const interestRate = 0.1; // 10% interest
        const interval = setInterval(() => {
            setBankBalance(prev => Math.floor(prev * (1 + interestRate)));
        }, 3600000); // 1 hour in milliseconds

        return () => clearInterval(interval);
    }, []);

    const handleQuantityChange = (id: string, value: string) => {
        // Allow empty string or numbers
        if (value === '' || /^\d+$/.test(value)) {
            setQuantities(prev => ({ ...prev, [id]: value }));
        }
    };

    const getQuantity = (id: string) => {
        return quantities[id] || '1';
    };

    const handleDeposit = () => {
        const amount = parseInt(transactionAmount.replace(/,/g, ''));
        if (isNaN(amount) || amount <= 0) return;
        if (amount > playerCash) return;

        setPlayerCash(prev => prev - amount);
        setBankBalance(prev => prev + amount);
        setTransactionAmount('');
    };

    const handleWithdraw = () => {
        const amount = parseInt(transactionAmount.replace(/,/g, ''));
        if (isNaN(amount) || amount <= 0) return;
        if (amount > bankBalance) return;

        setBankBalance(prev => prev - amount);
        setPlayerCash(prev => prev + amount);
        setTransactionAmount('');
    };

    const handleTransfer = () => {
        const amount = parseInt(transferAmount.replace(/,/g, ''));
        if (isNaN(amount) || amount <= 0) return;
        if (amount > bankBalance) return;
        if (!transferTarget) return;

        setBankBalance(prev => prev - amount);
        setTransferAmount('');
        setTransferTarget('');
        console.log(`Transferred ${amount} to ${transferTarget}`);
    };

    const handleDonate = () => {
        const amount = parseInt(donationAmount.replace(/,/g, ''));
        if (isNaN(amount) || amount <= 0) return;
        if (amount > bankBalance) return;

        setBankBalance(prev => prev - amount);
        setDonationAmount('');
        console.log(`Donated ${amount} to Alliance`);
    };

    const getList = () => {
        switch (activeTab) {
            case 'Ships': return SHIPS;
            case 'Upgrades': return UPGRADES;
            case 'Weapons': return WEAPONS;
            case 'Drones': return DRONES;
            case 'Equipment': return EQUIPMENT;
            case 'Items': return ITEMS;
            default: return [];
        }
    };

    const formatCost = (val: string | number) => {
        if (val === undefined || val === null) return "N/A";
        let cost = typeof val === 'number' ? val.toLocaleString() : String(val);

        return cost
            .replace(/(\d+),500,000/g, "$1.5M")
            .replace(/(\d+),250,000/g, "$1.25M")
            .replace(/(\d+),750,000/g, "$1.75M")
            .replace(/(\d+),000,000/g, "$1M")
            .replace(/(\d+),000/g, "$1k")
            .replace(/\s?\*\s?Ship\s?Size/gi, " x Size");
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Bank':
                return (
                    <div className="p-4 flex flex-col h-full gap-4 overflow-y-auto">
                        {/* Balances Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                            <div className="bg-[#001122] border border-[#223344] p-4 rounded shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#00ff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-[#667788] text-[10px] uppercase font-bold mb-1 tracking-wider">Bank Account</div>
                                <div className="text-[#00ff00] font-mono text-[18px] font-bold tracking-wider drop-shadow-[0_0_5px_rgba(0,255,0,0.5)] w-full text-center truncate px-2">
                                    ${bankBalance.toLocaleString()}
                                </div>
                                <div className="text-[#00aa00] text-[9px] uppercase tracking-widest mt-1">Safe from Piracy</div>
                            </div>
                            <div className="bg-[#001122] border border-[#223344] p-4 rounded shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#00ccff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-[#667788] text-[10px] uppercase font-bold mb-1 tracking-wider">Wallet Cash</div>
                                <div className="text-[#00ccff] font-mono text-[18px] font-bold tracking-wider drop-shadow-[0_0_5px_rgba(0,204,255,0.5)] w-full text-center truncate px-2">
                                    ${playerCash.toLocaleString()}
                                </div>
                                <div className="text-[#007799] text-[9px] uppercase tracking-widest mt-1">At Risk</div>
                            </div>
                        </div>

                        {/* Operations Grid */}
                        <div className="flex flex-wrap gap-4 grow">

                            {/* Deposit / Withdraw */}
                            <div className="bg-[#0b131e] border border-[#112233] p-3 rounded flex flex-col gap-3 min-w-[240px] flex-1">
                                <div className="text-[#ddeeff] text-[11px] font-bold uppercase tracking-wide border-b border-[#223344] pb-1">
                                    Teller Services
                                </div>
                                <div className="flex flex-col gap-2 grow">
                                    <input
                                        type="number"
                                        value={transactionAmount}
                                        onChange={(e) => setTransactionAmount(e.target.value)}
                                        placeholder="Amount"
                                        className="w-full bg-[#000810] border border-[#223344] text-white p-2 text-center font-mono focus:border-[#00ccff] focus:outline-none transition-colors text-[12px]"
                                    />
                                    <div className="grid grid-cols-2 gap-2 mt-auto">
                                        <button
                                            onClick={handleDeposit}
                                            className="bg-[#003322] border border-[#006644] text-[#00ffaa] py-2 text-[11px] uppercase font-bold hover:bg-[#004433] transition-colors rounded-[2px]"
                                        >
                                            Deposit
                                        </button>
                                        <button
                                            onClick={handleWithdraw}
                                            className="bg-[#331100] border border-[#662200] text-[#ffaa00] py-2 text-[11px] uppercase font-bold hover:bg-[#441100] transition-colors rounded-[2px]"
                                        >
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Transfer */}
                            <div className="bg-[#0b131e] border border-[#112233] p-3 rounded flex flex-col gap-3 min-w-[240px] flex-1">
                                <div className="text-[#ddeeff] text-[11px] font-bold uppercase tracking-wide border-b border-[#223344] pb-1">
                                    Wire Transfer
                                </div>
                                <div className="flex flex-col gap-2 grow">
                                    <select
                                        value={transferTarget}
                                        onChange={(e) => setTransferTarget(e.target.value)}
                                        className="w-full bg-[#000810] border border-[#223344] text-white p-2 text-center focus:border-[#00ccff] focus:outline-none transition-colors text-[12px]"
                                    >
                                        <option value="">Select Pilot</option>
                                        {MOCK_PILOTS.map(pilot => (
                                            <option key={pilot} value={pilot}>{pilot}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={transferAmount}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                        placeholder="Amount"
                                        className="w-full bg-[#000810] border border-[#223344] text-white p-2 text-center font-mono focus:border-[#00ccff] focus:outline-none transition-colors text-[12px]"
                                    />
                                    <button
                                        onClick={handleTransfer}
                                        className="w-full bg-[#002244] border border-[#004488] text-[#00ccff] py-2 text-[11px] uppercase font-bold hover:bg-[#003355] transition-colors rounded-[2px] mt-auto"
                                    >
                                        Transfer Funds
                                    </button>
                                </div>
                            </div>

                            {/* Alliance */}
                            <div className="bg-[#0b131e] border border-[#112233] p-3 rounded flex flex-col gap-3 min-w-[240px] flex-1">
                                <div className="text-[#ddeeff] text-[11px] font-bold uppercase tracking-wide border-b border-[#223344] pb-1">
                                    Alliance Treasury
                                </div>
                                <div className="flex flex-col gap-2 grow">
                                    <div className="text-[#667788] text-[10px] text-center italic mb-1">
                                        Support your alliance by donating directly to the central bank.
                                    </div>
                                    <input
                                        type="number"
                                        value={donationAmount}
                                        onChange={(e) => setDonationAmount(e.target.value)}
                                        placeholder="Amount"
                                        className="w-full bg-[#000810] border border-[#223344] text-white p-2 text-center font-mono focus:border-[#00ccff] focus:outline-none transition-colors text-[12px]"
                                    />
                                    <button
                                        onClick={handleDonate}
                                        className="w-full bg-[#220033] border border-[#550066] text-[#ff44ff] py-2 text-[11px] uppercase font-bold hover:bg-[#330044] transition-colors rounded-[2px] mt-auto"
                                    >
                                        Donate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Bounties':
                return (
                    <>
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md hidden md:grid grid-cols-[200px_1fr_100px_80px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="text-left pl-1">Identity</div>
                            <div className="text-left pl-1">Target</div>
                            <div className="text-right pr-6">Reward</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {MOCK_CLAIMABLE_BOUNTIES.map((bounty, i) => (
                                <div key={i} className="flex flex-col md:grid md:grid-cols-[200px_1fr_100px_80px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-2 px-2 md:py-1 md:px-1 min-h-[34px] gap-y-2 md:gap-y-0">
                                    <IdentityColumn name={bounty.target} alliance={bounty.alliance} />
                                    <div className="flex items-center pl-1 overflow-hidden h-full">
                                        <span className="text-[#ddeeff] font-bold truncate group-hover:text-[#ff4444] transition-colors">{bounty.target}</span>
                                    </div>
                                    <div className="text-left md:text-right text-green-400 font-mono font-bold text-[13px] flex items-center justify-start md:justify-end h-full md:pr-6">
                                        <span className="md:hidden text-[#667788] mr-2">REWARD:</span>
                                        ${formatCost(bounty.reward.replace(/,/g, ''))}
                                    </div>
                                    <div className="text-right md:pr-1 flex items-center justify-start md:justify-end h-full">
                                        <button className="bg-[#221100] border border-[#ffaa00] text-[#ffaa00] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#ffaa00] hover:text-black hover:font-bold transition-colors uppercase w-[50px] shadow-[0_0_5px_rgba(255,170,0,0.3)]">Claim</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'Ships':
                return (
                    <>
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md hidden md:grid grid-cols-[160px_1fr_100px_100px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="pl-1">Class</div>
                            <div>Description</div>
                            <div className="text-right">Cost</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {getList().map((ship: any, i: number) => (
                                <div key={i} className="flex flex-col md:grid md:grid-cols-[160px_1fr_100px_100px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-2 px-2 md:py-1 md:px-1 min-h-[34px] gap-y-2 md:gap-y-0">
                                    <div className="text-[#ddeeff] font-bold truncate">{ship.class}</div>
                                    <div className="flex flex-col justify-center h-full py-0.5">
                                        <div className="text-[#00ccff] font-bold text-[9px] leading-tight mb-0.5">
                                            Size: {ship.size} | Spd: {ship.speed} | Arm: {ship.armor} | Shld: {ship.shields} | Holds: {ship.holds}
                                        </div>
                                        <div className="text-[#8899aa] text-[9px] truncate leading-tight" title={ship.desc}>
                                            {ship.desc}
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right text-green-400 font-mono font-bold text-[13px]">
                                        <span className="md:hidden text-[#667788] mr-2">COST:</span>
                                        ${formatCost(ship.cost)}
                                    </div>
                                    <div className="text-right md:pr-1 flex justify-start md:justify-end gap-1">
                                        <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-[40px]">Buy</button>
                                        <button className="bg-[#330000] border border-[#660000] text-[#ff4444] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#ff4444] hover:text-white transition-colors uppercase w-[40px]">Sell</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'Weapons':
                return (
                    <>
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md hidden md:grid grid-cols-[160px_1fr_100px_130px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="pl-1">Name</div>
                            <div>Description</div>
                            <div className="text-right">Cost</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {getList().map((w: any, i: number) => (
                                <div key={i} className="flex flex-col md:grid md:grid-cols-[160px_1fr_100px_130px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-2 px-2 md:py-1 md:px-1 min-h-[34px] gap-y-2 md:gap-y-0">
                                    <div className="text-[#ddeeff] font-bold truncate" title={w.name}>{w.name}</div>
                                    <div className="flex flex-col justify-center h-full py-0.5">
                                        <div className="text-[#00ccff] font-bold text-[9px] leading-tight mb-0.5">
                                            Type: {w.type}-{w.class} | Acc: {w.acc} | Dmg: {w.shield}/{w.armor}
                                        </div>
                                        <div className="text-[#8899aa] text-[9px] truncate leading-tight" title={w.desc}>
                                            {w.desc}
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right text-green-400 font-mono font-bold text-[13px]">
                                        <span className="md:hidden text-[#667788] mr-2">COST:</span>
                                        ${formatCost(w.cost)}
                                    </div>
                                    <div className="text-right md:pr-1 flex justify-start md:justify-end gap-1 items-center">
                                        <input
                                            type="text"
                                            value={getQuantity(`weapon-${i}`)}
                                            onChange={(e) => handleQuantityChange(`weapon-${i}`, e.target.value)}
                                            className="w-[30px] h-[20px] bg-[#000810] border border-[#223344] text-white text-[10px] text-center focus:border-[#00ccff] focus:outline-none"
                                        />
                                        <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-[40px]">Buy</button>
                                        <button className="bg-[#330000] border border-[#660000] text-[#ff4444] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#ff4444] hover:text-white transition-colors uppercase w-[40px]">Sell</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'Drones':
                return (
                    <>
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md grid grid-cols-[160px_1fr_100px_130px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="pl-1">Name</div>
                            <div>Description</div>
                            <div className="text-right">Cost</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {getList().map((d: any, i: number) => {
                                const hasEmp = d.stats.emp && d.stats.emp !== 0;
                                return (
                                    <div key={i} className="grid grid-cols-[160px_1fr_100px_130px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-1 px-1 min-h-[34px]">
                                        <div className="text-[#ddeeff] font-bold truncate">{d.name}</div>
                                        <div className="flex flex-col justify-center h-full py-0.5">
                                            <div className="text-[#00ccff] font-bold text-[9px] leading-tight mb-0.5">
                                                Cmb: {d.stats.combat} | Arm: {d.stats.armor}
                                                {hasEmp && <span className="text-[#ff4444]"> | EMP: {d.stats.emp}</span>}
                                                <span className="text-[#ddeeff]"> | Limit: {d.limit}</span>
                                            </div>
                                            <div className="text-[#8899aa] text-[9px] truncate leading-tight" title={d.description}>
                                                {d.description}
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right text-green-400 font-mono font-bold">
                                            <span className="md:hidden text-[#667788] mr-2">COST:</span>
                                            N/A
                                        </div>
                                        <div className="text-right pr-1 flex justify-end gap-1 items-center">
                                            <input
                                                type="text"
                                                value={getQuantity(`drone-${i}`)}
                                                onChange={(e) => handleQuantityChange(`drone-${i}`, e.target.value)}
                                                className="w-[30px] h-[20px] bg-[#000810] border border-[#223344] text-white text-[10px] text-center focus:border-[#00ccff] focus:outline-none"
                                            />
                                            <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-[40px]">Buy</button>
                                            <button className="bg-[#330000] border border-[#660000] text-[#ff4444] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#ff4444] hover:text-white transition-colors uppercase w-[40px]">Sell</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                );
            case 'Equipment': {
                const getTypeColor = (type: string) => {
                    switch (type) {
                        case 'Aura': return 'text-purple-400 border-purple-900/50 bg-purple-950/20';
                        case 'Defensive': return 'text-blue-400 border-blue-900/50 bg-blue-950/20';
                        case 'Offensive': return 'text-red-400 border-red-900/50 bg-red-950/20';
                        case 'Repair': return 'text-green-400 border-green-900/50 bg-green-950/20';
                        case 'Resourcing': return 'text-yellow-400 border-yellow-900/50 bg-yellow-950/20';
                        default: return 'text-gray-400 border-gray-800 bg-gray-900/20';
                    }
                };

                return (
                    <>
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md hidden md:grid grid-cols-[180px_1fr_100px_130px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="pl-1">Equipment Name</div>
                            <div>Effect</div>
                            <div className="text-right">Cost</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {getList().map((item: any, i: number) => (
                                <div key={i} className="flex flex-col md:grid md:grid-cols-[180px_1fr_100px_130px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-2 px-2 md:py-1 md:px-1 min-h-[34px] gap-y-2 md:gap-y-0">
                                    <div className="flex flex-col justify-center h-full">
                                        <div className="text-[#ddeeff] font-bold truncate leading-tight" title={item.name}>{item.name}</div>
                                        <div className={`text-[9px] px-1.5 py-0.5 rounded border w-fit mt-0.5 ${getTypeColor(item.type)}`}>
                                            {item.type}
                                        </div>
                                    </div>
                                    <div className="text-[#8899aa] text-[9px] leading-tight flex items-center h-full" title={item.desc}>
                                        {item.desc}
                                    </div>
                                    <div className="text-left md:text-right text-green-400 font-mono font-bold text-[13px] leading-tight flex items-center justify-start md:justify-end h-full">
                                        <span className="md:hidden text-[#667788] mr-2">COST:</span>
                                        ${formatCost(item.cost)}
                                    </div>
                                    <div className="text-right md:pr-1 flex items-center justify-start md:justify-end h-full gap-1">
                                        <input
                                            type="text"
                                            value={getQuantity(`equip-${i}`)}
                                            onChange={(e) => handleQuantityChange(`equip-${i}`, e.target.value)}
                                            className="w-[30px] h-[20px] bg-[#000810] border border-[#223344] text-white text-[10px] text-center focus:border-[#00ccff] focus:outline-none"
                                        />
                                        <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-[40px]">Buy</button>
                                        <button className="bg-[#330000] border border-[#660000] text-[#ff4444] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#ff4444] hover:text-white transition-colors uppercase w-[40px]">Sell</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            }
            case 'Upgrades': {
                const DOWNGRADE_MAP: Record<string, string> = {
                    "Additional Drone Hangars": "Remove Drone Hangars",
                    "Additional Primary Weapon": "Remove Primary Weapon",
                    "Additional Secondary Weapon": "Remove Secondary Weapon",
                    "Cargo Holds Upgrade": "Cargo Hold Downgrade",
                    "Main Engine Upgrade": "Main Engine Downgrade",
                    "Armor Integrity Upgrade": "Armor Strength Downgrade",
                    "Armor Upgrade": "Armor Downgrade",
                    "Damage Amplifier": "Downgrade Damage Amplifier",
                    "Maneuverability Upgrade": "Maneuverability Downgrade",
                    "Power Battery Upgrade": "Power Battery Downgrade",
                    "Power Generator Upgrade": "Power Generator Downgrade",
                    "Shield Battery Upgrade": "Shield Battery Downgrade",
                    "Shield Generator Upgrade": "Shield Generator Downgrade",
                    "Stealth Coating Upgrade": "Stealth Coating Downgrade",
                    "Targeting Computer Upgrade": "Targeting Computer Downgrade"
                };

                const upgradesList = getList().filter((u: any) => u.level > 0);
                const allUpgrades = getList();

                return (
                    <>
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md hidden md:grid grid-cols-[250px_1fr_100px_150px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="pl-1">Upgrade Name</div>
                            <div>Effect</div>
                            <div className="text-right">Cost</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {upgradesList.map((u: any, i: number) => {
                                const downgradeName = DOWNGRADE_MAP[u.upgrade];
                                const downgradeItem = allUpgrades.find((d: any) => d.upgrade === downgradeName);

                                return (
                                    <div key={i} className="flex flex-col md:grid md:grid-cols-[250px_1fr_100px_150px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-2 px-2 md:py-1 md:px-1 min-h-[34px] gap-y-2 md:gap-y-0">
                                        <div className="flex flex-col justify-center h-full">
                                            <div className="font-bold text-[#ddeeff] truncate leading-tight" title={u.upgrade}>
                                                {u.upgrade}
                                            </div>
                                        </div>
                                        <div className="text-[#8899aa] text-[9px] leading-tight flex items-center h-full" title={u.description}>
                                            {u.description}
                                        </div>
                                        <div className="text-left md:text-right text-green-400 font-mono font-bold text-[13px] leading-tight flex items-center justify-start md:justify-end h-full">
                                            <span className="md:hidden text-[#667788] mr-2">COST:</span>
                                            ${formatCost(u.base_cost)}
                                        </div>
                                        <div className="text-right pr-1 flex items-center justify-end h-full gap-1">
                                            <input
                                                type="text"
                                                value={getQuantity(`upgrade-${i}`)}
                                                onChange={(e) => handleQuantityChange(`upgrade-${i}`, e.target.value)}
                                                className="w-[30px] h-[20px] bg-[#000810] border border-[#223344] text-white text-[10px] text-center focus:border-[#00ccff] focus:outline-none"
                                            />
                                            <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-[40px]">Buy</button>
                                            {downgradeItem && (
                                                <button className="bg-[#330000] border border-[#660000] text-[#ff4444] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#ff4444] hover:text-white transition-colors uppercase w-[40px]">Sell</button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                );
            }
            case 'Items':
                return (
                    <>
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md grid grid-cols-[180px_1fr_100px_130px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="pl-1">Item Name</div>
                            <div>Description</div>
                            <div className="text-right">Cost</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {getList().map((item: any, i: number) => (
                                <div key={i} className="grid grid-cols-[180px_1fr_100px_130px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-1 px-1 min-h-[34px]">
                                    <div className="flex flex-col justify-center">
                                        <div className="text-[#ddeeff] font-bold truncate leading-tight" title={item.name}>{item.name}</div>
                                        <div className="text-[#445566] text-[9px] uppercase tracking-wider">{item.type}</div>
                                    </div>
                                    <div className="text-[#8899aa] text-[9px] leading-tight flex flex-col justify-center h-full" title={item.desc}>
                                        <div>{item.desc}</div>
                                        <div className="text-[#00ccff]">{item.cargo} Holds</div>
                                    </div>
                                    <div className="text-right text-green-400 font-mono font-bold text-[13px] leading-tight flex items-center justify-end h-full">
                                        ${formatCost(item.cost)}
                                    </div>
                                    <div className="text-right pr-1 flex items-center justify-end h-full gap-1">
                                        <input
                                            type="text"
                                            value={getQuantity(`item-${i}`)}
                                            onChange={(e) => handleQuantityChange(`item-${i}`, e.target.value)}
                                            className="w-[30px] h-[20px] bg-[#000810] border border-[#223344] text-white text-[10px] text-center focus:border-[#00ccff] focus:outline-none"
                                        />
                                        <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-[40px]">Buy</button>
                                        <button className="bg-[#330000] border border-[#660000] text-[#ff4444] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#ff4444] hover:text-white transition-colors uppercase w-[40px]">Sell</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            default:
                return (
                    <>
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md hidden md:grid grid-cols-[160px_1fr_100px_80px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="pl-1">Name</div>
                            <div>Description</div>
                            <div className="text-right">Cost</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {getList().map((item: any, i: number) => {
                                const name = item.name || item.upgrade || item.class;
                                const cost = item.cost || item.base_cost || "N/A";
                                const desc = item.desc || item.description || "";
                                return (
                                    <div key={i} className="flex flex-col md:grid md:grid-cols-[160px_1fr_100px_80px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-2 px-2 md:py-1 md:px-1 min-h-[34px] gap-y-2 md:gap-y-0">
                                        <div className="text-[#ddeeff] font-bold leading-tight" title={name}>{name}</div>
                                        <div className="text-[#8899aa] text-[9px] truncate leading-snug" title={desc}>{desc}</div>
                                        <div className="text-left md:text-right text-green-400 font-mono font-bold text-[13px]">
                                            <span className="md:hidden text-[#667788] mr-2">COST:</span>
                                            ${String(cost).replace(/\s/g, '')}
                                        </div>
                                        <div className="text-right md:pr-1 flex justify-start md:justify-end">
                                            <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 h-[20px] py-0 flex items-center justify-center rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-[40px]">Buy</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="w-full bg-[#0b131e] border border-[#0055aa] rounded-t-md shadow-[0_0_25px_rgba(0,85,170,0.4)] backdrop-blur-md flex flex-col relative z-20 shrink-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#002244] to-[#001122] border-b border-[#0055aa] py-2 px-4 flex justify-between items-center">
                <div>
                    <div className="text-white font-bold text-[16px] tracking-wide uppercase">{name}</div>
                    <div className="flex items-center gap-4">
                        <div className="text-[#00ccff] text-[11px] tracking-wider">STATION SERVICES</div>
                        <button
                            onClick={() => {
                                let topic = activeTab;
                                if (activeTab === 'Bounties') topic = 'Combat';
                                if (activeTab === 'Bank') topic = 'Trading';
                                onOpenHelp?.(topic);
                            }}
                            className="bg-[#003344] hover:bg-[#004455] border border-[#006688] text-[#00ccff] hover:text-white text-[10px] uppercase flex items-center gap-1.5 transition-all group px-2 py-0.5 rounded shadow-[0_0_5px_rgba(0,204,255,0.2)]"
                        >
                            <svg className="w-3 h-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {activeTab} Manual
                        </button>
                    </div>
                </div>
                <button
                    onClick={onUndock}
                    className="text-red-400 hover:text-white text-[11px] uppercase border border-red-900/50 bg-red-950/30 px-4 py-1.5 rounded hover:bg-red-900/50 hover:shadow-[0_0_5px_red] transition-all font-bold"
                >
                    Undock
                </button>
            </div >

            <div className="flex flex-wrap bg-[#000810] border-b border-[#223344]">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            flex-1 min-w-[80px] text-[11px] py-2 uppercase tracking-tight font-bold border-r border-[#112233] last:border-r-0 transition-colors
                            ${activeTab === tab
                                ? 'bg-[#003366] text-white shadow-[inset_0_-2px_0_#00ccff]'
                                : 'text-[#667788] hover:text-[#aaccff] hover:bg-[#001122]'
                            }
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="h-[600px] overflow-y-auto scrollbar-retro bg-[#050a10] p-1">
                {renderContent()}
            </div>
        </div >
    );
};
