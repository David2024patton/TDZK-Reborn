import React, { useState } from 'react';
import { SHIPS, UPGRADES, WEAPONS, DRONES, EQUIPMENT, ITEMS } from '../../../../data/helpData';

interface StationInternalProps {
    name: string;
    onUndock?: () => void;
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

export const StationInternal: React.FC<StationInternalProps> = ({ name, onUndock }) => {
    const [activeTab, setActiveTab] = useState('Ships');
    const [bankBalance, setBankBalance] = useState(50000000);
    const [playerCash, setPlayerCash] = useState(10000000);
    const [transactionAmount, setTransactionAmount] = useState('');

    const tabs = ['Ships', 'Upgrades', 'Weapons', 'Drones', 'Equipment', 'Items', 'Bounties', 'Bank'];

    const MOCK_CLAIMABLE_BOUNTIES = [
        { target: "Pirate Lord Vex", alliance: "PIR", status: "Eliminated", reward: "5,000,000" },
        { target: "Rogue Drone 77", alliance: "AI", status: "Destroyed", reward: "500,000" },
        { target: "Smuggler Han", alliance: "HUTT", status: "Captured", reward: "1,200,000" }
    ];

    const handleDeposit = () => {
        const amount = parseInt(transactionAmount);
        if (isNaN(amount) || amount <= 0 || amount > playerCash) return;
        setPlayerCash(prev => prev - amount);
        setBankBalance(prev => prev + amount);
        setTransactionAmount('');
    };

    const handleWithdraw = () => {
        const amount = parseInt(transactionAmount);
        if (isNaN(amount) || amount <= 0 || amount > bankBalance) return;
        setBankBalance(prev => prev - amount);
        setPlayerCash(prev => prev + amount);
        setTransactionAmount('');
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



    const renderContent = () => {
        switch (activeTab) {
            case 'Bank':
                return (
                    <div className="p-6 flex flex-col items-center justify-center h-full gap-6">
                        <div className="w-full max-w-[300px] bg-[#001122] border border-[#223344] p-4 rounded shadow-lg">
                            <div className="text-[#667788] text-[10px] uppercase font-bold mb-1">Station Account Balance</div>
                            <div className="text-[#00ff00] font-mono text-[24px] font-bold tracking-wider drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
                                ${bankBalance.toLocaleString()}
                            </div>
                        </div>

                        <div className="w-full max-w-[300px] flex flex-col gap-2">
                            <div className="flex justify-between text-[11px] text-[#8899aa]">
                                <span>Wallet Cash:</span>
                                <span className="text-white font-mono">${playerCash.toLocaleString()}</span>
                            </div>
                            <input
                                type="number"
                                value={transactionAmount}
                                onChange={(e) => setTransactionAmount(e.target.value)}
                                placeholder="Enter Amount"
                                className="w-full bg-[#000810] border border-[#223344] text-white p-2 text-center font-mono focus:border-[#00ccff] focus:outline-none transition-colors"
                            />
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <button
                                    onClick={handleDeposit}
                                    className="bg-[#003322] border border-[#006644] text-[#00ffaa] py-2 text-[12px] uppercase font-bold hover:bg-[#004433] transition-colors"
                                >
                                    Deposit
                                </button>
                                <button
                                    onClick={handleWithdraw}
                                    className="bg-[#331100] border border-[#662200] text-[#ffaa00] py-2 text-[12px] uppercase font-bold hover:bg-[#441100] transition-colors"
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'Bounties':
                return (
                    <>
                        <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md grid grid-cols-[200px_1fr_100px_80px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="text-left pl-1">Identity</div>
                            <div className="text-left pl-1">Target</div>
                            <div className="text-right">Reward</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {MOCK_CLAIMABLE_BOUNTIES.map((bounty, i) => (
                                <div key={i} className="grid grid-cols-[200px_1fr_100px_80px] gap-x-1 border-b border-[#002244] hover:bg-[#001133] text-[11px] group cursor-pointer bg-[#020408] transition-colors py-1 px-1 h-[34px] items-center">
                                    <IdentityColumn name={bounty.target} alliance={bounty.alliance} />
                                    <div className="flex items-center pl-1 overflow-hidden h-[24px]">
                                        <span className="text-white font-bold text-[14px] truncate drop-shadow-md group-hover:text-[#ff4444] transition-colors">{bounty.target}</span>
                                    </div>
                                    <div className="flex items-center justify-end h-[24px]">
                                        <span className="text-[#00ff00] font-bold text-[14px] font-mono tracking-wide">${bounty.reward}</span>
                                    </div>
                                    <div className="flex items-center justify-end pr-1 h-[24px]">
                                        <button className="bg-[#221100] border border-[#ffaa00] text-[#ffaa00] text-[10px] px-2 py-0.5 rounded-[2px] hover:bg-[#ffaa00] hover:text-black hover:font-bold transition-colors uppercase shadow-[0_0_5px_rgba(255,170,0,0.3)]">Claim</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'Ships':
                return (
                    <>
                        <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md grid grid-cols-[120px_80px_100px_60px_1fr_80px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="pl-1">Class</div>
                            <div>Size/Spd</div>
                            <div>Arm/Shld</div>
                            <div>Holds</div>
                            <div className="text-right">Cost</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {getList().map((ship: any, i: number) => (
                                <div key={i} className="grid grid-cols-[120px_80px_100px_60px_1fr_80px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-1 px-1 h-[34px]">
                                    <div className="text-[#ddeeff] font-bold truncate">{ship.class}</div>
                                    <div className="text-[#8899aa]">{ship.size} / <span className="text-[#00ccff]">{ship.speed}</span></div>
                                    <div className="text-[#8899aa]">{ship.armor} / <span className="text-[#00ccff]">{ship.shields}</span></div>
                                    <div className="text-[#ddeeff]">{ship.holds}</div>
                                    <div className="text-right text-green-400 font-mono font-bold">${String(ship.cost).replace(/\s/g, '')}</div>
                                    <div className="text-right pr-1">
                                        <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 py-0.5 rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-full">Buy</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'Weapons':
                return (
                    <>
                        <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md grid grid-cols-[140px_80px_40px_100px_1fr_80px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="pl-1">Name</div>
                            <div>Type</div>
                            <div>Acc</div>
                            <div>Dmg (S/A)</div>
                            <div className="text-right">Cost</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {getList().map((w: any, i: number) => (
                                <div key={i} className="grid grid-cols-[140px_80px_40px_100px_1fr_80px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-1 px-1 h-[34px]">
                                    <div className="text-[#ddeeff] font-bold truncate" title={w.name}>{w.name}</div>
                                    <div className="text-[#8899aa] text-[10px]">{w.type}-{w.class}</div>
                                    <div className="text-[#ddeeff]">{w.acc}</div>
                                    <div className="text-[#8899aa] text-[10px]">{w.shield} / {w.armor}</div>
                                    <div className="text-right text-green-400 font-mono font-bold">${String(w.cost).replace(/\s/g, '')}</div>
                                    <div className="text-right pr-1">
                                        <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 py-0.5 rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-full">Buy</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'Drones':
                return (
                    <>
                        <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md grid grid-cols-[120px_100px_60px_60px_1fr_80px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
                            <div className="pl-1">Name</div>
                            <div>Cmb/Arm</div>
                            <div>EMP</div>
                            <div>Limit</div>
                            <div className="text-right">Cost</div>
                            <div className="text-right pr-1">Action</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            {getList().map((d: any, i: number) => (
                                <div key={i} className="grid grid-cols-[120px_100px_60px_60px_1fr_80px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-1 px-1 h-[34px]">
                                    <div className="text-[#ddeeff] font-bold truncate">{d.name}</div>
                                    <div className="text-[#8899aa]">{d.stats.combat} / {d.stats.armor}</div>
                                    <div className="text-[#ddeeff]">{d.stats.emp}</div>
                                    <div className="text-[#ddeeff]">{d.limit}</div>
                                    <div className="text-right text-green-400 font-mono font-bold">N/A</div>
                                    <div className="text-right pr-1">
                                        <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 py-0.5 rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-full">Buy</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            default:
                return (
                    <>
                        <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[28px] backdrop-blur-sm shadow-md grid grid-cols-[150px_1fr_100px_80px] gap-x-1 items-center text-[#667788] text-[10px] uppercase tracking-wider mb-1">
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
                                    <div key={i} className="grid grid-cols-[150px_1fr_100px_80px] gap-x-1 border-b border-[#112233] hover:bg-[#0a1525] text-[11px] items-center py-1 px-1 min-h-[34px]">
                                        <div className="text-[#ddeeff] font-bold truncate" title={name}>{name}</div>
                                        <div className="text-[#8899aa] text-[10px] truncate" title={desc}>{desc}</div>
                                        <div className="text-right text-green-400 font-mono font-bold">${String(cost).replace(/\s/g, '')}</div>
                                        <div className="text-right pr-1">
                                            <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-2 py-0.5 rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors uppercase w-full">Buy</button>
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
                    <div className="text-[#00ccff] text-[11px] tracking-wider">STATION SERVICES</div>
                </div>
                <button
                    onClick={onUndock}
                    className="text-red-400 hover:text-white text-[11px] uppercase border border-red-900/50 bg-red-950/30 px-4 py-1.5 rounded hover:bg-red-900/50 hover:shadow-[0_0_5px_red] transition-all font-bold"
                >
                    Undock
                </button>
            </div>

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

            <div className="h-[350px] overflow-y-auto scrollbar-retro bg-[#050a10] p-1">
                {renderContent()}
            </div>
        </div>
    );
};
