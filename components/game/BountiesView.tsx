
import React from 'react';

interface Bounty {
    id: string;
    target: string;
    targetLevel: number;
    amount: number;
    placedBy: string;
    date: string;
}

const MOCK_BOUNTIES: Bounty[] = [
    { id: 'b1', target: "Vader", targetLevel: 300, amount: 50000000, placedBy: "RebelAlliance", date: "2 days ago" },
    { id: 'b2', target: "Blackbeard", targetLevel: 150, amount: 10000000, placedBy: "MerchantGuild", date: "1 week ago" },
    { id: 'b3', target: "Solo", targetLevel: 250, amount: 25000000, placedBy: "Jabba", date: "3 days ago" },
    { id: 'b4', target: "Sparky", targetLevel: 128, amount: 5000000, placedBy: "Unknown", date: "Yesterday" },
];

export const BountiesView: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {/* Header */}
            <div className="w-full max-w-[800px] mb-6 text-center">
                <h2 className="text-[#ff0000] font-bold text-[24px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] mb-2">
                    Wanted List
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#880000] to-transparent mb-4"></div>
                <p className="text-[#884444] text-[11px] mb-4">
                    Dead or Alive. Rewards paid upon confirmed destruction of target vessel.
                </p>
            </div>

            {/* Bounty List */}
            <div className="w-full max-w-[800px] bg-[#0a0505] border border-[#440000] shadow-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                        <tr className="bg-[#220000] text-[#ff5555] border-b border-[#440000]">
                            <th className="p-3 pl-4">Target</th>
                            <th className="p-3 text-center">Level</th>
                            <th className="p-3 text-right">Reward</th>
                            <th className="p-3 text-right">Placed By</th>
                            <th className="p-3 text-right pr-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#220000]">
                        {MOCK_BOUNTIES.map((bounty) => (
                            <tr key={bounty.id} className="hover:bg-[#220000]/50 transition-colors group">
                                <td className="p-3 pl-4 font-bold text-white group-hover:text-red-400">{bounty.target}</td>
                                <td className="p-3 text-center text-[#eccc66] font-mono">{bounty.targetLevel}</td>
                                <td className="p-3 text-right text-[#00ff00] font-mono font-bold">${bounty.amount.toLocaleString()}</td>
                                <td className="p-3 text-right text-[#888888]">{bounty.placedBy}</td>
                                <td className="p-3 text-right pr-4 text-[#666666]">{bounty.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-[#666666] text-[10px] italic">
                To place a bounty, visit the Bounty Office at any major Starport.
            </div>
        </div>
    );
};
