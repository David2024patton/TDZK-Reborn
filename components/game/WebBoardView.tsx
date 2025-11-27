
import React, { useState } from 'react';

interface ForumCategory {
    id: string;
    title: string;
    description: string;
    moderators: string[];
    topics: number;
    posts: number;
    lastPost: {
        date: string;
        author: string;
    };
}

interface ForumSection {
    title: string;
    categories: ForumCategory[];
}

const MOCK_FORUMS: ForumSection[] = [
    {
        title: "General",
        categories: [
            {
                id: 'announcements',
                title: "Announcements",
                description: "Developments, fixes, events, and updates from the admins.",
                moderators: ["Admin", "Helios"],
                topics: 154,
                posts: 2450,
                lastPost: { date: "Today 10:45 AM", author: "Admin" }
            },
            {
                id: 'qa',
                title: "Questions & Answers",
                description: "Ask questions to both players and admins.",
                moderators: ["XChaosX", "Dfdrfye", "Helios"],
                topics: 890,
                posts: 12400,
                lastPost: { date: "Yesterday 11:20 PM", author: "Newbie123" }
            },
            {
                id: 'ideas',
                title: "Ideas & Suggestions",
                description: "Input on new things players would like to see in TDZK.",
                moderators: ["DevTeam"],
                topics: 340,
                posts: 5600,
                lastPost: { date: "Today 09:15 AM", author: "Visionary" }
            },
            {
                id: 'recruitment',
                title: "Alliance Recruitment",
                description: "Alliances recruiting new members, and players looking for alliances.",
                moderators: ["CommunityMgr"],
                topics: 120,
                posts: 890,
                lastPost: { date: "2 days ago", author: "RecruiterBot" }
            }
        ]
    },
    {
        title: "Content & Story",
        categories: [
            {
                id: 'lore',
                title: "Taenarian Lore",
                description: "Tidbits about the TDZK Game Universe.",
                moderators: ["Loremaster"],
                topics: 45,
                posts: 320,
                lastPost: { date: "Last Week", author: "StoryTeller" }
            },
            {
                id: 'rp',
                title: "Role-Playing",
                description: "Roleplaying, stories, writings, etc.",
                moderators: ["RP_Mod"],
                topics: 210,
                posts: 4500,
                lastPost: { date: "Today 02:30 PM", author: "SpaceBard" }
            },
            {
                id: 'warroom',
                title: "Federation War Room",
                description: "Share plans for galactic domination and ship building knowledge.",
                moderators: ["Strategist"],
                topics: 560,
                posts: 8900,
                lastPost: { date: "Yesterday 04:45 PM", author: "AdmiralAckbar" }
            }
        ]
    }
];

export const WebBoardView: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {/* Header */}
            <div className="w-full max-w-[900px] mb-6 flex justify-between items-end border-b border-[#004488] pb-2">
                <div>
                    <h2 className="text-[#00ccff] font-bold text-[24px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,204,255,0.5)]">
                        TDZK Communications
                    </h2>
                    <div className="text-[#667788] text-[11px] font-mono">Official Galactic Forums</div>
                </div>
                <div className="flex gap-2 text-[10px]">
                    <button className="text-[#aaaaaa] hover:text-white hover:underline">[FAQ]</button>
                    <button className="text-[#aaaaaa] hover:text-white hover:underline">[Search]</button>
                    <button className="text-[#aaaaaa] hover:text-white hover:underline">[Memberlist]</button>
                    <button className="text-[#aaaaaa] hover:text-white hover:underline">[Usergroups]</button>
                </div>
            </div>

            {/* Forum Sections */}
            <div className="w-full max-w-[900px] space-y-8">
                {MOCK_FORUMS.map((section) => (
                    <div key={section.title} className="bg-[#050a10] border border-[#223344] shadow-lg overflow-hidden">
                        <div className="bg-[#002244] px-3 py-2 text-[#ffffff] font-bold text-[12px] uppercase tracking-wide border-b border-[#004488]">
                            {section.title}
                        </div>
                        <table className="w-full text-left border-collapse text-[11px]">
                            <thead>
                                <tr className="bg-[#001122] text-[#667788] border-b border-[#112233]">
                                    <th className="p-2 pl-4 w-[50%]">Forum</th>
                                    <th className="p-2 text-center w-[10%]">Topics</th>
                                    <th className="p-2 text-center w-[10%]">Posts</th>
                                    <th className="p-2 text-right pr-4 w-[30%]">Last Post</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#112233]">
                                {section.categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-[#001122] transition-colors group cursor-pointer">
                                        <td className="p-3 pl-4">
                                            <div className="text-[#00ccff] font-bold text-[13px] group-hover:underline mb-1">{cat.title}</div>
                                            <div className="text-[#8899aa] text-[10px] mb-1">{cat.description}</div>
                                            <div className="text-[#445566] text-[9px]">
                                                Moderators: <span className="text-[#667788]">{cat.moderators.join(', ')}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center text-[#cccccc] font-mono">{cat.topics}</td>
                                        <td className="p-3 text-center text-[#cccccc] font-mono">{cat.posts}</td>
                                        <td className="p-3 text-right pr-4">
                                            <div className="text-[#eccc66] text-[10px]">{cat.lastPost.date}</div>
                                            <div className="text-[#667788] text-[9px]">by <span className="text-[#aaaaaa] font-bold">{cat.lastPost.author}</span></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* Footer Stats */}
            <div className="w-full max-w-[900px] mt-6 bg-[#001122] border border-[#223344] p-3 text-[10px] text-[#667788] flex justify-between items-center">
                <div>
                    <span className="text-[#aaaaaa] font-bold">Who is Online:</span> In total there are <span className="text-white font-bold">12</span> users online :: 4 Registered, 0 Hidden and 8 Guests
                </div>
                <div className="text-[#445566]">
                    Most users ever online was <span className="text-white font-bold">452</span> on Mon Jan 15, 2024
                </div>
            </div>
        </div>
    );
};
