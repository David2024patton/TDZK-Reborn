
import React, { useState } from 'react';
import { useGame } from '../src/context/GameContext';

// Import data from centralized TypeScript file to avoid JSON module resolution issues
import {
    SHIPS, WEAPONS, DRONES, UPGRADES, GOODS, ITEMS,
    SECTOR_TYPES, AURAS, BUILDINGS, GUIDES, EQUIPMENT,
    RACES, FAQ, EQUATIONS, FACTIONS, TERMS, INTRODUCTION
} from '../data/helpData';

interface HelpViewProps {
    onClose: () => void;
    initialTopic?: string;
}

const HELP_TOPICS = [
    { category: "General", items: ["Introduction", "Web Board"] },
    { category: "Lore", items: ["Races", "Factions"] },
    { category: "Miscellaneous", items: ["FAQ", "Equations", "Terms"] },
    { category: "Reference", items: ["Ships", "Weapons", "Equipment", "Upgrades", "Drones", "Goods", "Items", "Sector Types", "Auras", "Buildings"] },
    { category: "Guides", items: ["Survival", "Trading", "Combat", "War", "Ports", "Planets", "Alliances"] }
];

export const HelpView: React.FC<HelpViewProps> = ({ onClose, initialTopic }) => {
    const { setAdmin, player } = useGame();
    const [selectedTopic, setSelectedTopic] = useState(initialTopic || 'Introduction');

    // Static data map pointing to imported constants
    const data: any = {
        ships: SHIPS,
        weapons: WEAPONS,
        drones: DRONES,
        upgrades: UPGRADES,
        goods: GOODS,
        items: ITEMS,
        sectorTypes: SECTOR_TYPES,
        auras: AURAS,
        buildings: BUILDINGS,
        guides: GUIDES,
        equipment: EQUIPMENT,
        races: RACES,
        faq: FAQ,
        equations: EQUATIONS,
        factions: FACTIONS,
        terms: TERMS,
        introduction: INTRODUCTION
    };

    // --- Generic Renderers ---

    const renderDataTable = (columns: string[], tableData: any[], keyField: string) => {
        if (!tableData) return <div className="text-red-500">No data available</div>;

        return (
            <div className="overflow-x-auto bg-[#0a111a] border border-[#223344] rounded p-4">
                <table className="w-full text-left border-collapse text-[11px] font-mono whitespace-nowrap">
                    <thead>
                        <tr className="bg-[#002244] text-[#00ccff]">
                            {columns.map(col => <th key={col} className="p-2 uppercase tracking-wider">{col}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#112233]">
                        {tableData.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-[#ffffff]/5">
                                {columns.map(col => {
                                    const key = col.toLowerCase();
                                    // Fuzzy match for keys like "Base Cost" -> "base_cost" or "cost"
                                    const dataKey = Object.keys(row).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === key.replace(/[^a-z0-9]/g, ''));
                                    let val = row[dataKey || key] || '-';

                                    let style = "text-gray-400";
                                    if (col === "Name" || col === "Class" || col === "Type" || col === "Upgrade" || col === "Term") style = "font-bold text-white";
                                    if (col.includes("Cost") || col === "Value") style = "text-green-400 text-right";
                                    if (col === "Acc" || col === "Speed") style = "text-yellow-400";
                                    if (col.includes("Shield")) style = "text-blue-300";
                                    if (col === "Desc" || col === "Description" || col === "Definition") style = "text-gray-500 italic whitespace-normal min-w-[200px]";

                                    return <td key={col} className={`p-2 ${style}`}>{val}</td>
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderDataCards = (cardData: any[]) => {
        if (!cardData) return null;
        return (
            <div className="grid grid-cols-1 gap-4 mt-6">
                {cardData.map((item: any, i: number) => (
                    <div key={i} className="bg-[#050a10] border border-[#223344] p-4 rounded hover:border-[#004488] transition-colors relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-[#00ccff] font-bold text-[14px]">{item.name || item.class || item.upgrade}</h3>
                                {item.tagline && <div className="text-[#8899aa] text-[10px] italic mb-1">{item.tagline}</div>}
                                {item.type && <span className="text-[#445566] text-[10px] uppercase tracking-wider border border-[#223344] px-1 rounded bg-[#020408]">{item.type}</span>}
                            </div>
                            {(item.cost || item.base_cost) && <span className="text-green-400 font-mono text-[11px]">${item.cost || item.base_cost}</span>}
                        </div>
                        <p className="text-[#cccccc] text-[11px] leading-relaxed whitespace-pre-line">{item.desc || item.description}</p>

                        {/* Bonuses/Penalties for Races */}
                        {item.bonuses && item.bonuses.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-[#223344]">
                                <div className="text-green-400 text-[10px] font-bold uppercase">Bonuses:</div>
                                <ul className="list-disc list-inside text-[10px] text-[#88aa88]">
                                    {item.bonuses.map((b: string, idx: number) => <li key={idx}>{b}</li>)}
                                </ul>
                            </div>
                        )}
                        {item.penalties && item.penalties.length > 0 && (
                            <div className="mt-1">
                                <div className="text-red-400 text-[10px] font-bold uppercase">Penalties:</div>
                                <ul className="list-disc list-inside text-[10px] text-[#aa8888]">
                                    {item.penalties.map((p: string, idx: number) => <li key={idx}>{p}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* Stats Grid if available */}
                        {item.stats && !Array.isArray(item.stats) && (
                            <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] border-t border-[#223344] pt-2">
                                {Object.entries(item.stats).map(([k, v]) => (
                                    <div key={k} className="flex justify-between">
                                        <span className="text-[#667788] uppercase">{k}:</span>
                                        <span className="text-white">{String(v)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderGuide = (sections: any[]) => {
        if (!sections) return <div className="text-gray-500">No guide data found.</div>;
        return (
            <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in space-y-6">
                {sections.map((section: any, i: number) => (
                    <div key={i} className="bg-[#0a111a] border border-[#223344] p-4 rounded">
                        <h3 className="text-[#00ccff] font-bold text-[16px] mb-3 border-b border-[#004488] pb-1">{section.title}</h3>
                        <div className="text-[#cccccc] text-[12px] leading-relaxed whitespace-pre-line">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderBuildings = () => (
        <div className="mt-8 pt-4 border-t border-[#223344]">
            <h3 className="text-[#00ccff] font-bold text-[16px] mb-3 uppercase tracking-widest">Building Specifications</h3>
            {renderDataTable(["Name", "Type", "Cost", "Goods", "Curve", "Max", "Desc"], data.buildings, "name")}
        </div>
    );

    // --- Topic Renderers ---

    const renderContent = () => {
        try {
            switch (selectedTopic) {
                case 'Ships': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Ship Database</h2>
                        {renderDataTable(["Class", "Size", "Speed", "Armor", "Shields", "Holds", "Cost"], data.ships, "class")}
                        {renderDataCards(data.ships)}
                    </div>
                );
                case 'Weapons': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Weapon Database</h2>
                        {renderDataTable(["Name", "Type", "Class", "Acc", "Shield", "Armor", "Cost"], data.weapons, "name")}
                    </div>
                );
                case 'Drones': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Drone Database</h2>
                        {renderDataCards(data.drones)}
                    </div>
                );
                case 'Upgrades': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Ship Upgrades</h2>
                        {renderDataTable(["Upgrade", "Level", "Base Cost", "Description"], data.upgrades, "upgrade")}
                    </div>
                );
                case 'Goods': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Trade Goods</h2>
                        {renderDataTable(["Name", "Exp", "Value", "Align", "Desc"], data.goods, "name")}
                    </div>
                );
                case 'Items': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Special Items</h2>
                        {renderDataCards(data.items)}
                    </div>
                );
                case 'Sector Types': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in space-y-8">
                        <div>
                            <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Sector Types</h2>
                            {renderDataTable(["Name", "Visibility", "Resources", "Desc"], data.sectorTypes.types, "name")}
                        </div>
                        <div>
                            <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Sector Subtypes</h2>
                            {renderDataTable(["Name", "Effect", "Desc"], data.sectorTypes.subtypes, "name")}
                        </div>
                    </div>
                );
                case 'Auras': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Auras</h2>
                        {renderDataTable(["Name", "Stacking", "Ranged", "Desc"], data.auras, "name")}
                    </div>
                );
                case 'Buildings': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Planet Buildings</h2>
                        {renderDataTable(["Name", "Type", "Cost", "Goods", "Curve", "Max", "Desc"], data.buildings, "name")}
                    </div>
                );
                case 'Equipment': {
                    // Group by Type for easier handling
                    const grouped = (data.equipment || []).reduce((acc: any, item: any) => {
                        if (!acc[item.type]) acc[item.type] = [];
                        acc[item.type].push(item);
                        return acc;
                    }, {});

                    const categories = ["Aura", "Defensive", "Miscellaneous", "Offensive", "Repair", "Resourcing"];

                    return (
                        <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in space-y-8">
                            {/* Summary Table - Constrained Width */}
                            <div className="bg-[#0a111a] border border-[#223344] p-4 rounded w-full md:w-[600px]">
                                <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 uppercase tracking-widest border-b border-[#004488] pb-2">Equipment Price List</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-[11px] font-mono whitespace-nowrap">
                                        <thead>
                                            <tr className="bg-[#002244] text-[#00ccff]">
                                                <th className="p-2">Equipment Name</th>
                                                <th className="p-2 text-right">Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#112233]">
                                            {categories.map(cat => (
                                                <React.Fragment key={cat}>
                                                    <tr className="bg-[#0c1825]">
                                                        <td colSpan={2} className="p-2 font-bold text-[#00ccff] uppercase tracking-wider border-l-4 border-[#00ccff] bg-[#001122]">
                                                            {cat}
                                                        </td>
                                                    </tr>
                                                    {grouped[cat]?.map((item: any, i: number) => (
                                                        <tr key={i} className="hover:bg-[#ffffff]/5 border-b border-[#112233]/30 last:border-none">
                                                            <td className="p-2 pl-6 text-white font-bold">{item.name}</td>
                                                            <td className="p-2 text-right text-green-400">${item.cost}</td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Detailed Descriptions Section - Multi-Column Layout */}
                            <div className="space-y-6">
                                {categories.map(cat => (
                                    <div key={cat}>
                                        <h3 className="text-white font-bold text-[14px] mb-3 pl-2 border-l-4 border-[#00ccff] uppercase tracking-widest bg-[#0a111a] py-1">{cat} Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {grouped[cat]?.map((item: any, i: number) => (
                                                <div key={i} className="bg-[#050a10] border border-[#223344] p-3 rounded hover:border-[#004488] transition-colors">
                                                    <div className="flex justify-between items-start mb-1 pb-1 border-b border-[#112233]">
                                                        <span className="text-[#00ccff] font-bold text-[13px]">{item.name}</span>
                                                        <span className="text-green-400 text-[10px] font-mono">${item.cost}</span>
                                                    </div>
                                                    <p className="text-[#aaaaaa] text-[11px] leading-relaxed mt-2">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }
                case 'Races': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Races</h2>
                        {renderDataTable(["Name", "Difficulty", "Description"], data.races, "name")}
                        {renderDataCards(data.races)}
                    </div>
                );
                case 'Factions': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in space-y-4">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Factions</h2>
                        {data.factions.map((f: any, i: number) => (
                            <div key={i} className="border border-[#223344] bg-[#0a111a] rounded-lg p-4 relative overflow-hidden group hover:border-[#004488] transition-colors">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#004488]"></div>
                                <h3 className="text-[16px] font-bold text-[#00ccff] mb-2 pl-3">{f.name}</h3>
                                <div className="pl-3 text-[#cccccc] space-y-2 text-[12px] leading-relaxed whitespace-pre-line">
                                    {f.description}
                                </div>
                            </div>
                        ))}
                    </div>
                );
                case 'FAQ': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in space-y-4">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">FAQ</h2>
                        {data.faq.map((item: any, i: number) => (
                            <details key={i} className="group bg-[#080f1c] border border-[#223344] rounded open:border-[#004488]">
                                <summary className="cursor-pointer p-3 font-bold text-[#00ccff] hover:bg-[#112233] flex justify-between select-none list-none">
                                    {item.q}
                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-3 border-t border-[#223344] text-[#cccccc] text-[12px] bg-[#050a14] leading-relaxed whitespace-pre-line">{item.a}</div>
                            </details>
                        ))}
                    </div>
                );
                case 'Equations': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in space-y-4">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Game Mechanics Equations</h2>
                        {data.equations.map((eq: any, i: number) => (
                            <div key={i} className="border border-[#223344] bg-[#050a14] rounded overflow-hidden">
                                <div className="bg-[#0c1520] px-3 py-2 border-b border-[#223344] text-[#00ccff] font-bold text-[12px]">{eq.title}</div>
                                <div className="p-3">
                                    <p className="text-[#8899aa] text-[11px] mb-2">{eq.desc}</p>
                                    <div className="bg-black border border-[#334455] p-2 font-mono text-[11px] text-[#aaccff] rounded shadow-inner whitespace-pre-wrap">{eq.code}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
                case 'Terms': return (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 fade-in">
                        <h2 className="text-[#00ccff] font-bold text-[18px] mb-4 border-b border-[#004488] pb-2">Glossary of Terms</h2>
                        {renderDataTable(["Term", "Definition"], data.terms, "term")}
                    </div>
                );

                // Guides
                case 'Ports': return renderGuide(data.guides.Ports);
                case 'Planets': return (
                    <div className="space-y-8">
                        {renderGuide(data.guides.Planets)}
                        {renderBuildings()}
                    </div>
                );
                case 'Alliances': return renderGuide(data.guides.Alliances);
                case 'Survival': return renderGuide(data.guides.Survival);
                case 'Trading': return renderGuide(data.guides.Trading);
                case 'Combat': return renderGuide(data.guides.Combat);
                case 'War': return renderGuide(data.guides.War);

                case 'Introduction': return (
                    <div className="animate-in fade-in">
                        {renderGuide(data.introduction)}
                    </div>
                );
                case 'Web Board': return (
                    <div className="animate-in fade-in">
                        <div className="bg-[#001122] border-l-2 border-[#00ccff] p-4 mb-6 text-[#aaccff]">
                            <p className="font-bold text-white mb-1">Web Board</p>
                            <p className="text-[12px] opacity-80">The community forum where players discuss strategy, trade, and alliance politics. Visit the main site to access the boards.</p>
                        </div>
                    </div>
                );
                default: return (
                    <div className="flex flex-col items-center justify-center h-64 text-[#445566]">
                        <div className="w-10 h-10 border-2 border-[#223344] border-t-[#00ccff] rounded-full animate-spin mb-4"></div>
                        <p className="font-mono text-[12px]">Awaiting Data Input...</p>
                        <p className="text-[10px] mt-2">Topic: {selectedTopic}</p>
                    </div>
                );
            }
        } catch (e) {
            return <div className="text-red-500 p-4 border border-red-900 bg-red-900/10">Error rendering content: {String(e)}</div>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#020408] flex flex-col font-verdana text-[#cccccc] animate-in fade-in duration-200">
            {/* Header */}
            <div className="h-[60px] shrink-0 bg-[#050a10] border-b border-[#223344] flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-900/20 border border-blue-500/50 rounded flex items-center justify-center text-blue-400 font-bold">?</div>
                    <div>
                        <h1 className="text-white font-bold text-[16px] tracking-wide uppercase">TDZK Archives</h1>
                        <div className="text-[#445566] text-[9px] tracking-[0.3em]">KNOWLEDGE BASE V3.0</div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const newStatus = !player.isAdmin;
                            setAdmin(newStatus);
                            alert(`Admin Mode: ${newStatus ? 'ENABLED' : 'DISABLED'}`);
                        }}
                        className="bg-[#331111] hover:bg-[#552222] text-[#ff5555] border border-[#662222] px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider"
                    >
                        {player.isAdmin ? 'Disable Admin' : 'Enable Admin'}
                    </button>
                    <button onClick={onClose} className="bg-[#112233] hover:bg-[#224466] text-[#00ccff] border border-[#004488] px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                        Return <span className="text-[14px] leading-none">×</span>
                    </button>
                </div>

            </div>

            {/* Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-[240px] bg-[#03060c] border-r border-[#112233] hidden md:flex flex-col overflow-y-auto p-4 space-y-6">
                    {HELP_TOPICS.map((section, i) => (
                        <div key={i}>
                            <h3 className="text-[#445566] font-bold text-[10px] uppercase tracking-widest mb-2 pl-2 border-l-2 border-[#00ccff]">{section.category}</h3>
                            <div className="flex flex-col pl-3 space-y-1 border-l border-[#112233] ml-[1px]">
                                {section.items.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => setSelectedTopic(item)}
                                        className={`text-left text-[11px] py-1.5 px-3 rounded transition-all ${selectedTopic === item ? 'bg-[#002244] text-white font-bold pl-4 border-l-2 border-[#00ccff]' : 'text-[#8899aa] hover:text-[#00ccff] hover:pl-4 border-l-2 border-transparent'}`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,#0a1525_0%,#000000_100%)] p-6 md:p-10">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="flex justify-between items-end mb-6 border-b border-[#223344] pb-2">
                            <h1 className="text-[32px] font-bold text-white drop-shadow-[0_0_10px_rgba(0,200,255,0.3)]">{selectedTopic}</h1>
                            <div className="text-[#445566] font-mono text-[9px] DOC_ID">{selectedTopic.toUpperCase()}_V4.2</div>
                        </div>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
