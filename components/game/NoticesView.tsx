
import React, { useState } from 'react';

interface Notice {
    id: string;
    type: 'Combat' | 'Trade' | 'System' | 'Alliance' | 'Raid';
    message: string;
    date: string;
    isRead: boolean;
}

const MOCK_NOTICES: Notice[] = [
    {
        id: '1',
        type: 'Raid',
        message: "ALERT: Port 420 in Sector 5000 is under attack by 'Rebel Fleet'!",
        date: "2024-01-20 14:35",
        isRead: false
    },
    {
        id: '2',
        type: 'Combat',
        message: "You killed 'Greedo' in Sector 101.",
        date: "2024-01-20 14:30",
        isRead: false
    },
    {
        id: '3',
        type: 'Combat',
        message: "You were killed by 'Skywalker' in Sector 4500.",
        date: "2024-01-20 12:15",
        isRead: true
    },
    {
        id: '4',
        type: 'Combat',
        message: "Your drone in Sector 5555 was destroyed by 'Vader'.",
        date: "2024-01-18 22:45",
        isRead: true
    },
    {
        id: '5',
        type: 'Trade',
        message: "Trade completed: Sold 500 Ore at Port 99 for 15,000 Credits.",
        date: "2024-01-20 12:15",
        isRead: true
    },
    {
        id: '6',
        type: 'Alliance',
        message: "Alliance 'Rebels' has requested a peace treaty.",
        date: "2024-01-19 09:00",
        isRead: false
    }
];

export const NoticesView: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<string>('All');

    const filteredNotices = notices.filter(n => filter === 'All' || n.type === filter);

    const toggleSelection = (id: string) => {
        const newSelection = new Set(selectedIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedIds(newSelection);
    };

    const deleteSelected = () => {
        setNotices(prev => prev.filter(n => !selectedIds.has(n.id)));
        setSelectedIds(new Set());
    };

    const markRead = () => {
        setNotices(prev => prev.map(n => selectedIds.has(n.id) ? { ...n, isRead: true } : n));
        setSelectedIds(new Set());
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Combat': return 'text-red-400 border-red-900/50 bg-red-950/20';
            case 'Trade': return 'text-green-400 border-green-900/50 bg-green-950/20';
            case 'Alliance': return 'text-yellow-400 border-yellow-900/50 bg-yellow-950/20';
            case 'Raid': return 'text-orange-400 border-orange-900/50 bg-orange-950/20';
            default: return 'text-blue-400 border-blue-900/50 bg-blue-950/20';
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {/* Header */}
            <div className="w-full max-w-[800px] mb-6 text-center">
                <h2 className="text-[#00ccff] font-bold text-[24px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,204,255,0.5)] mb-2">
                    Personal Comm-Link
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#004488] to-transparent mb-4"></div>

                {/* Filter Bar */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {['All', 'Combat', 'Raid', 'Trade', 'Alliance', 'System'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`
                                px-3 py-1 text-[10px] font-bold uppercase tracking-wider border rounded transition-all
                                ${filter === type
                                    ? 'bg-[#00ccff] text-[#000] border-[#00ccff] shadow-[0_0_10px_rgba(0,204,255,0.3)]'
                                    : 'bg-[#050a10] text-[#667788] border-[#223344] hover:border-[#445566] hover:text-[#8899aa]'
                                }
                            `}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Actions Bar */}
                <div className="flex justify-between items-center bg-[#001122] border border-[#223344] p-2 rounded mb-4">
                    <div className="text-[#667788] text-[11px]">
                        <span className="text-white font-bold">{notices.filter(n => !n.isRead).length}</span> Unread Messages
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={markRead}
                            disabled={selectedIds.size === 0}
                            className="px-3 py-1 bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] font-bold uppercase hover:bg-[#003366] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Mark Read
                        </button>
                        <button
                            onClick={deleteSelected}
                            disabled={selectedIds.size === 0}
                            className="px-3 py-1 bg-[#220000] border border-[#440000] text-[#ff5555] text-[10px] font-bold uppercase hover:bg-[#330000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Notices List */}
            <div className="w-full max-w-[800px] space-y-2">
                {filteredNotices.length === 0 ? (
                    <div className="text-center py-12 text-[#445566] italic border border-[#223344] bg-[#050a10] rounded">
                        No messages in inbox.
                    </div>
                ) : (
                    filteredNotices.map((notice) => (
                        <div
                            key={notice.id}
                            onClick={() => toggleSelection(notice.id)}
                            className={`
                                flex items-center gap-4 p-3 border rounded cursor-pointer transition-all group relative overflow-hidden
                                ${selectedIds.has(notice.id)
                                    ? 'bg-[#002244] border-[#00ccff]'
                                    : 'bg-[#050a10] border-[#223344] hover:border-[#445566]'
                                }
                                ${!notice.isRead ? 'border-l-4 border-l-[#00ccff]' : ''}
                            `}
                        >
                            {/* Checkbox Mock */}
                            <div className={`
                                w-4 h-4 border flex items-center justify-center shrink-0
                                ${selectedIds.has(notice.id) ? 'border-[#00ccff] bg-[#00ccff]/20' : 'border-[#445566] bg-[#000]'}
                            `}>
                                {selectedIds.has(notice.id) && <div className="w-2 h-2 bg-[#00ccff]"></div>}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getTypeColor(notice.type)}`}>
                                        {notice.type}
                                    </span>
                                    <span className="text-[#667788] text-[10px] font-mono">{notice.date}</span>
                                </div>
                                <div className={`text-[12px] truncate ${notice.isRead ? 'text-[#8899aa]' : 'text-white font-bold'}`}>
                                    {notice.message}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
