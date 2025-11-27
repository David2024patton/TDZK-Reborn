
import React, { useState } from 'react';

// --- Types ---

interface PlanetSummary {
    id: string;
    name: string;
    sector: number;
    population: number;
    level: number;
    rating: { off: number; def: number };
    tax: number;
    credits: number;
    alignment: number;
    imageSeed: string;
}

interface Building {
    name: string;
    count: number;
    max: number;
    type: 'Defense' | 'Production' | 'Service' | 'Illegal';
}

// --- Mock Data ---

const MOCK_PLANETS: PlanetSummary[] = [
    { id: 'p1', name: "Helga's House of Gain", sector: 13209, population: 5779399, level: 38, rating: { off: 4300, def: 521 }, tax: 5, credits: 1540200, alignment: -197, imageSeed: 'Helga' },
    { id: 'p2', name: "Mining Outpost Alpha", sector: 4421, population: 120500, level: 1, rating: { off: 500, def: 200 }, tax: 2, credits: 45000, alignment: 50, imageSeed: 'Alpha' },
    { id: 'p3', name: "Fortress Prime", sector: 9901, population: 12500000, level: 83, rating: { off: 12500, def: 8000 }, tax: 10, credits: 50000000, alignment: -500, imageSeed: 'Prime' },
];

const MOCK_BUILDINGS: Building[] = [
    { name: "Laser Cannon", count: 500, max: 1000, type: 'Defense' },
    { name: "Plasma Cannon", count: 200, max: 500, type: 'Defense' },
    { name: "Shield Generator", count: 100, max: 200, type: 'Defense' },
    { name: "Ore Mine", count: 50, max: 100, type: 'Production' },
    { name: "Hydroponics Farm", count: 80, max: 100, type: 'Production' },
    { name: "Repair Bay", count: 10, max: 20, type: 'Service' },
    { name: "Slave Market", count: 5, max: 5, type: 'Illegal' },
];

// --- Components ---

const PlanetList: React.FC<{ onSelect: (planet: PlanetSummary) => void }> = ({ onSelect }) => {
    return (
        <div className="w-full max-w-[800px] flex flex-col gap-4">
            <div className="flex justify-between items-end border-b border-[#004488] pb-2 mb-2">
                <h2 className="text-[#00ccff] font-bold text-[20px] uppercase tracking-widest">Planetary Command</h2>
                <div className="text-[#667788] text-[11px] font-mono">Owned Planets: {MOCK_PLANETS.length} / 5</div>
            </div>

            <div className="bg-[#050a10] border border-[#223344] shadow-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                        <tr className="bg-[#002244] text-[#00ccff] border-b border-[#004488]">
                            <th className="p-2 pl-4">Planet Name</th>
                            <th className="p-2 text-center">Sector</th>
                            <th className="p-2 text-center">Pop / Lvl</th>
                            <th className="p-2 text-center">Rating</th>
                            <th className="p-2 text-center">Tax</th>
                            <th className="p-2 text-right pr-4">Treasury</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#112233]">
                        {MOCK_PLANETS.map((planet) => (
                            <tr
                                key={planet.id}
                                onClick={() => onSelect(planet)}
                                className="hover:bg-[#003366] cursor-pointer transition-colors group"
                            >
                                <td className="p-2 pl-4 font-bold text-white group-hover:text-[#00ccff] flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[#445566]">
                                        <img src={`https://picsum.photos/seed/${planet.imageSeed}/50/50`} alt="Planet" className="w-full h-full object-cover opacity-80" />
                                    </div>
                                    {planet.name}
                                </td>
                                <td className="p-2 text-center text-[#aaaaaa] font-mono">{planet.sector}</td>
                                <td className="p-2 text-center text-[#eccc66]">
                                    {(planet.population / 1000000).toFixed(1)}M <span className="text-[#666666]">/</span> {planet.level}
                                </td>
                                <td className="p-2 text-center font-mono text-[10px]">
                                    <span className="text-red-400">{planet.rating.off}</span>
                                    <span className="text-[#444444]">/</span>
                                    <span className="text-blue-400">{planet.rating.def}</span>
                                </td>
                                <td className="p-2 text-center text-green-400">{planet.tax}%</td>
                                <td className="p-2 text-right pr-4 text-[#00ff00] font-mono">${planet.credits.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PlanetDetail: React.FC<{ planet: PlanetSummary; onBack: () => void }> = ({ planet, onBack }) => {
    const [activeTab, setActiveTab] = useState<'Surface' | 'Defenses' | 'Production' | 'Options'>('Surface');

    return (
        <div className="w-full max-w-[800px] flex flex-col gap-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-[#004488] pb-4 mb-2">
                <button onClick={onBack} className="text-[#00ccff] hover:text-white text-[10px] uppercase font-bold border border-[#004488] px-3 py-1 rounded hover:bg-[#002244] transition-colors">
                    &lt; Back to List
                </button>
                <div className="flex-1">
                    <h2 className="text-white font-bold text-[24px] leading-none">{planet.name}</h2>
                    <div className="text-[#667788] text-[11px] font-mono mt-1">
                        Sector {planet.sector} • Level {planet.level} • {planet.alignment > 0 ? 'Lawful' : 'Chaotic'} ({planet.alignment})
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[#00ff00] font-mono font-bold text-[16px]">${planet.credits.toLocaleString()}</div>
                    <div className="text-[#445566] text-[10px] uppercase tracking-wider">Treasury</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-[#001122] p-1 rounded border border-[#223344]">
                {['Surface', 'Defenses', 'Production', 'Options'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`
                            flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all rounded-sm
                            ${activeTab === tab
                                ? 'bg-[#004488] text-white shadow-[0_0_10px_rgba(0,100,255,0.3)]'
                                : 'text-[#667788] hover:text-[#00ccff] hover:bg-[#002244]'
                            }
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-[#050a10] border border-[#223344] p-6 min-h-[400px] relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#002244]/20 to-transparent rounded-bl-full pointer-events-none"></div>

                {activeTab === 'Surface' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-2">Planet Status</h3>
                                <div className="space-y-2 text-[12px]">
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Population:</span> <span className="text-white font-mono">{planet.population.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Tax Rate:</span> <span className="text-green-400">{planet.tax}%</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Rating:</span> <span className="font-mono text-[#eccc66]">{planet.rating.off} / {planet.rating.def}</span></div>
                                    <div className="flex justify-between"><span className="text-[#8899aa]">Shields:</span> <span className="text-blue-400">100%</span></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-2">Messages</h3>
                                <div className="bg-[#001122] border border-[#223344] p-3 text-[11px] text-[#aaaaaa] italic rounded">
                                    "Phoenix Property. Trespassers will be fired upon."
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-[#003366] shadow-[0_0_30px_rgba(0,100,255,0.2)] relative mb-4">
                                <img src={`https://picsum.photos/seed/${planet.imageSeed}/300/300`} alt="Planet Surface" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <button className="w-full bg-[#221100] border border-[#ffaa00] text-[#ffaa00] py-2 font-bold uppercase tracking-widest hover:bg-[#442200] hover:text-white transition-colors text-[12px]">
                                Take Off
                            </button>
                        </div>
                    </div>
                )}

                {(activeTab === 'Defenses' || activeTab === 'Production') && (
                    <div className="relative z-10">
                        <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-4">
                            {activeTab === 'Defenses' ? 'Planetary Defenses' : 'Production Facilities'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {MOCK_BUILDINGS.filter(b =>
                                activeTab === 'Defenses' ? b.type === 'Defense' : b.type !== 'Defense'
                            ).map((b, i) => (
                                <div key={i} className="bg-[#001122] border border-[#223344] p-3 flex justify-between items-center group hover:border-[#0055aa] transition-colors">
                                    <div>
                                        <div className="text-white font-bold text-[12px]">{b.name}</div>
                                        <div className="text-[#667788] text-[10px]">{b.type}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[#00ccff] font-mono font-bold text-[14px]">{b.count} <span className="text-[#445566] text-[10px]">/ {b.max}</span></div>
                                        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="px-1.5 py-0.5 bg-[#003300] text-green-400 border border-green-800 text-[9px] hover:bg-[#005500]">+</button>
                                            <button className="px-1.5 py-0.5 bg-[#330000] text-red-400 border border-red-800 text-[9px] hover:bg-[#550000]">-</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Options' && (
                    <div className="space-y-6 relative z-10 max-w-[400px]">
                        <div>
                            <label className="block text-[#00ccff] text-[11px] font-bold mb-1 uppercase">Planet Name</label>
                            <input type="text" defaultValue={planet.name} className="w-full bg-[#001122] border border-[#223344] text-white px-2 py-1 text-[12px] focus:border-[#00ccff] outline-none" />
                        </div>
                        <div>
                            <label className="block text-[#00ccff] text-[11px] font-bold mb-1 uppercase">Tax Rate (%)</label>
                            <input type="number" defaultValue={planet.tax} max={10} min={0} className="w-full bg-[#001122] border border-[#223344] text-white px-2 py-1 text-[12px] focus:border-[#00ccff] outline-none" />
                        </div>
                        <div>
                            <label className="block text-[#00ccff] text-[11px] font-bold mb-1 uppercase">Public Message</label>
                            <textarea className="w-full h-20 bg-[#001122] border border-[#223344] text-white px-2 py-1 text-[12px] focus:border-[#00ccff] outline-none resize-none"></textarea>
                        </div>
                        <button className="bg-[#003366] text-white px-4 py-2 text-[11px] font-bold uppercase hover:bg-[#004488] transition-colors w-full">
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const PlanetsView: React.FC = () => {
    const [selectedPlanet, setSelectedPlanet] = useState<PlanetSummary | null>(null);

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {selectedPlanet ? (
                <PlanetDetail planet={selectedPlanet} onBack={() => setSelectedPlanet(null)} />
            ) : (
                <PlanetList onSelect={setSelectedPlanet} />
            )}
        </div>
    );
};
