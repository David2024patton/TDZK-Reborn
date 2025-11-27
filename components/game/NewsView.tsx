
import React from 'react';

interface NewsItem {
    id: string;
    title: string;
    date: string;
    author: string;
    content: string;
    tags?: string[];
}

const MOCK_NEWS: NewsItem[] = [
    {
        id: 'n1',
        title: "Galactic Reset Complete",
        date: "2024-01-15",
        author: "Admin",
        content: "The galaxy has been reset. All sectors, planets, and ships have been restored to their initial states. Good luck in the new cycle, pilots! The race to level 100 begins now.",
        tags: ['System', 'Major']
    },
    {
        id: 'n2',
        title: "Patch Notes v2.4.1",
        date: "2024-01-10",
        author: "DevTeam",
        content: "Updates:\n- Increased spawn rate of Kitaran Scouts in deep space.\n- Fixed a bug where trading Ore at Port 42 would sometimes fail.\n- Adjusted the cost of Level 5 Lasers.\n\nKnown Issues:\n- Cloaking device visual glitch on Zallun ships.",
        tags: ['Patch', 'Fixes']
    },
    {
        id: 'n3',
        title: "Community Event: The Void Hunt",
        date: "2024-01-05",
        author: "EventMaster",
        content: "Attention all bounty hunters! A massive influx of pirate activity has been detected in the outer rim. Double XP for all pirate kills this weekend. Join the hunt and claim your rewards!",
        tags: ['Event', 'Bonus']
    },
    {
        id: 'n4',
        title: "Market Update: Crystal Shortage",
        date: "2024-01-01",
        author: "EcoBot",
        content: "Due to recent conflicts in the mining sectors, the price of Crystal has skyrocketed. Traders are advised to sell high while the demand lasts.",
        tags: ['Economy']
    }
];

export const NewsView: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {/* Header */}
            <div className="w-full max-w-[800px] mb-8 text-center">
                <h2 className="text-[#00ccff] font-bold text-[28px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,204,255,0.5)] mb-2">
                    Galactic News Network
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#004488] to-transparent mb-1"></div>
                <div className="text-[#667788] text-[10px] uppercase tracking-[0.3em]">Official TDZK Broadcasts</div>
            </div>

            {/* News Feed */}
            <div className="w-full max-w-[800px] space-y-6">
                {MOCK_NEWS.map((item) => (
                    <div key={item.id} className="bg-[#050a10] border border-[#223344] shadow-lg relative overflow-hidden group hover:border-[#004488] transition-colors">
                        {/* Item Header */}
                        <div className="bg-[#001122] border-b border-[#223344] px-4 py-2 flex justify-between items-center">
                            <div>
                                <h3 className="text-white font-bold text-[14px] tracking-wide group-hover:text-[#00ccff] transition-colors">
                                    {item.title}
                                </h3>
                                <div className="flex gap-2 text-[10px] mt-0.5">
                                    <span className="text-[#667788]">Posted by <span className="text-[#aaccff]">{item.author}</span></span>
                                    <span className="text-[#445566]">•</span>
                                    <span className="text-[#667788]">{item.date}</span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {item.tags?.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-[#002244] border border-[#003355] text-[#00ccff] text-[9px] uppercase font-bold rounded-[2px]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Item Content */}
                        <div className="p-4">
                            <div className="text-[#aaccff] text-[12px] leading-relaxed whitespace-pre-wrap font-verdana opacity-90">
                                {item.content}
                            </div>
                        </div>

                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ccff] opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00ccff] opacity-50"></div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-8 text-[#445566] text-[10px] italic">
                End of transmission stream.
            </div>
        </div>
    );
};
