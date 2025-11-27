import React, { useState } from 'react';

interface PlanetInternalProps {
    planet: any;
    messages: { public: string, internal: string };
    onUndock: () => void;
    onUpdateMessages: (p: string, i: string) => void;
}

export const PlanetInternal: React.FC<PlanetInternalProps> = ({ planet, messages, onUndock, onUpdateMessages }) => {
    const [activeTab, setActiveTab] = useState('Surface');
    const [editPublic, setEditPublic] = useState(messages.public);
    const [editInternal, setEditInternal] = useState(messages.internal);

    const tabs = ['Surface', 'Defenses', 'Production', 'Options', 'Take Off'];

    const handleSave = () => {
        onUpdateMessages(editPublic, editInternal);
        setActiveTab('Surface');
    };

    const handleTabClick = (tab: string) => {
        if (tab === 'Take Off') {
            onUndock();
        } else {
            setActiveTab(tab);
        }
    };

    return (
        <div className="w-full bg-[#0a111a] border border-[#223344] rounded-t-sm shadow-lg mb-4 relative z-10 shrink-0 overflow-hidden animate-in fade-in duration-200">
            <div className="bg-gradient-to-r from-[#001122] via-[#002233] to-[#000000] border-b border-[#223344] py-2 px-4">
                <div className="text-white font-bold text-[16px] tracking-wide">Planet Surface ({planet.sector || '11199'})</div>
                <div className="text-[#667788] text-[10px]">Sector {planet.sector || '11199'} - Deep Space - Normal</div>
            </div>
            <div className="text-center py-1 bg-black border-b border-[#112233]">
                <span className="text-[#00ccff] text-[11px] underline font-bold cursor-pointer hover:text-white">Messages:</span>
            </div>
            <div className="flex justify-center bg-[#111111] border-b border-[#223344]">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`
                            px-4 py-1 text-[11px] font-bold border-r border-[#223344] last:border-r-0 transition-colors
                            ${activeTab === tab
                                ? 'bg-[#223344] text-white'
                                : 'text-[#888888] hover:text-[#cccccc] hover:bg-[#1a1a1a]'
                            }
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="p-4 bg-[#050a10]">
                {activeTab === 'Surface' && (
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="bg-[#0b131e]/50 border border-[#223344] p-4 w-full max-w-[500px] rounded-sm shadow-inner">
                            <div className="text-white font-bold text-[14px] mb-2">{planet.name} ({planet.sector || '11199'})</div>
                            <div className="flex flex-col gap-1 text-[11px] font-mono text-[#cccccc]">
                                <div>Rating: <span className="text-white font-bold">{planet.rating}</span></div>
                                <div>Population: <span className="text-green-400">{planet.population}</span></div>
                                <div>Alignment: <span className="text-red-400">{planet.alignment}</span></div>
                            </div>
                        </div>
                        <div className="w-full max-w-[500px] space-y-4">
                            <div className="bg-[#0b131e] border border-[#223344] p-3 shadow-md">
                                <div className="text-white font-bold text-[12px] mb-2 border-b border-[#223344] pb-1 inline-block">Planet Message</div>
                                <div className="text-[#8899aa] text-[11px] whitespace-pre-wrap leading-relaxed">{messages.public}</div>
                            </div>
                            <div className="bg-[#0b131e] border border-[#223344] p-3 shadow-md">
                                <div className="text-white font-bold text-[12px] mb-2 border-b border-[#223344] pb-1 inline-block">Planet Internal Message</div>
                                <div className="text-[#8899aa] text-[11px] whitespace-pre-wrap leading-relaxed">{messages.internal}</div>
                            </div>
                        </div>
                        <div className="text-[10px] text-[#445566]">
                            <div>60 Goods Exporters</div>
                            <div>300 Drone Hangers</div>
                            <div className="mt-2 text-[#00ccff] italic">Good luck ^_^</div>
                        </div>
                    </div>
                )}
                {activeTab === 'Options' && (
                    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto">
                        <div className="w-full mb-4">
                            <label className="block text-[#00ccff] text-[10px] font-bold mb-1">Planet Message</label>
                            <textarea
                                value={editPublic}
                                onChange={(e) => setEditPublic(e.target.value)}
                                className="w-full h-[100px] bg-[#000000] border border-[#334455] text-[#cccccc] p-2 text-[11px] outline-none focus:border-[#00ccff]"
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label className="block text-[#00ccff] text-[10px] font-bold mb-1">Planet Internal Message</label>
                            <textarea
                                value={editInternal}
                                onChange={(e) => setEditInternal(e.target.value)}
                                className="w-full h-[100px] bg-[#000000] border border-[#334455] text-[#cccccc] p-2 text-[11px] outline-none focus:border-[#00ccff]"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-[#003366] border border-[#0055aa] text-white px-6 py-1.5 text-[11px] font-bold uppercase hover:bg-[#004488] transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
                {(activeTab === 'Defenses' || activeTab === 'Production') && (
                    <div className="text-center py-12 text-[#445566] italic">
                        Scanning structural integrity... Systems online. <br />
                        (Feature unavailable in this simulation view)
                    </div>
                )}
            </div>
        </div>
    );
};
