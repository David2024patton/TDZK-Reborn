
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
    owner?: string;
    alliance?: string;
    messages: {
        public: string;
        internal: string;
    };
    buildings: {
        [key: string]: number;
    };
    defenses: {
        [key: string]: number;
    };
    drones: {
        combat: number;
        shield: number;
        emp: number;
    };
    dockedShips: DockedShip[];
}

interface DockedShip {
    id: string;
    name: string;
    class: string;
    race: string;
    level: number;
    rating: { off: number; def: number };
    alliance?: string;
    isCloaked?: boolean;
    isOnline?: boolean;
}

type PlanetCategory = 'Owned' | 'Alliance' | 'Allied' | 'Enemy';

// --- Constants & Data ---

const BUILDING_TYPES = {
    Resources: [
        { id: 'ore_refinery', name: 'Ore Refinery', cost: 1000, manpower: 5000, turns: 2 },
        { id: 'organics_farm', name: 'Organics Farm', cost: 1000, manpower: 5000, turns: 2 },
        { id: 'equipment_manufactory', name: 'Equipment Manufactory', cost: 1000, manpower: 5000, turns: 2 },
    ],
    Goods: [
        { id: 'slave_market', name: 'Slave Market', cost: 2000, manpower: 5000, turns: 2 },
        { id: 'weapons_compound', name: 'Weapons Compound', cost: 2000, manpower: 5000, turns: 2 },
        { id: 'narcotics_lab', name: 'Narcotics Laboratory', cost: 2000, manpower: 5000, turns: 2 },
    ],
    Services: [
        { id: 'drone_assembler', name: 'Drone Assembler', cost: 5000, manpower: 5000, turns: 4 },
        { id: 'repair_bay', name: 'Repair Bay', cost: 5000, manpower: 5000, turns: 4 },
        { id: 'goods_exporter', name: 'Goods Exporter', cost: 5000, manpower: 5000, turns: 4 },
    ],
    Defenses: [
        { id: 'shield_generator', name: 'Shield Generator', cost: 10000, manpower: 5000, turns: 5 },
        { id: 'drone_hangar', name: 'Drone Hangar', cost: 5000, manpower: 5000, turns: 3 },
        { id: 'beam_turret', name: 'Beam Turret', cost: 15000, manpower: 5000, turns: 6 },
        { id: 'emp_turret', name: 'EMP Turret', cost: 15000, manpower: 5000, turns: 6 },
        { id: 'fusion_turret', name: 'Fusion Turret', cost: 20000, manpower: 5000, turns: 8 },
        { id: 'missile_turret', name: 'Missile Turret', cost: 18000, manpower: 5000, turns: 7 },
        { id: 'rocket_turret', name: 'Rocket Turret', cost: 12000, manpower: 5000, turns: 5 },
    ]
};

// --- Mock Data ---

const MOCK_SHIPS: DockedShip[] = [
    { id: 's1', name: 'Orbital Guard', class: 'Cruiser', race: 'Zallun', level: 200, rating: { off: 80, def: 80 }, alliance: 'SystemDef', isOnline: true },
    { id: 's2', name: 'Trader One', class: 'Transport', race: 'Human', level: 45, rating: { off: 10, def: 50 }, alliance: 'TradeFed', isOnline: false },
    { id: 's3', name: 'Shadow', class: 'Scout', race: 'Cyber', level: 120, rating: { off: 150, def: 20 }, alliance: 'SpyNet', isCloaked: true, isOnline: true },
];

const MOCK_PLANETS: Record<PlanetCategory, PlanetSummary[]> = {
    'Owned': [
        {
            id: 'p1', name: "Helga's House of Gain", sector: 13209, population: 5779399, level: 38, rating: { off: 4300, def: 521 }, tax: 5, credits: 1540200, alignment: -197, imageSeed: 'Helga',
            messages: { public: "Welcome to Helga's! Best prices in the sector.", internal: "Keep the defenses up, we're expecting trouble." },
            buildings: { 'goods_exporter': 60, 'drone_hangar': 300, 'ore_refinery': 50 },
            defenses: { 'shield_generator': 20, 'beam_turret': 15, 'missile_turret': 10 },
            drones: { combat: 1500, shield: 500, emp: 100 },
            dockedShips: MOCK_SHIPS
        },
        {
            id: 'p2', name: "Mining Outpost Alpha", sector: 4421, population: 120500, level: 1, rating: { off: 500, def: 200 }, tax: 2, credits: 45000, alignment: 50, imageSeed: 'Alpha',
            messages: { public: "Mining operations in progress.", internal: "Quota met for the month." },
            buildings: { 'ore_refinery': 20 },
            defenses: { 'shield_generator': 2 },
            drones: { combat: 50, shield: 0, emp: 0 },
            dockedShips: []
        },
    ],
    'Alliance': [
        {
            id: 'a1', name: "Renegade Base", sector: 101, population: 2000000, level: 50, rating: { off: 8000, def: 8000 }, tax: 5, credits: 0, alignment: 0, imageSeed: 'Renegade', owner: 'Wolfi', alliance: 'Renegades',
            messages: { public: "Restricted Area.", internal: "Rally point for the raid." },
            buildings: { 'repair_bay': 10, 'drone_assembler': 5 },
            defenses: { 'fusion_turret': 50 },
            drones: { combat: 5000, shield: 2000, emp: 500 },
            dockedShips: [MOCK_SHIPS[0]]
        },
    ],
    'Allied': [],
    'Enemy': []
};

const MOCK_PLAYERS = ["Vader", "Sidious", "Thrawn", "Tarkin", "Boba Fett"];

// --- Components ---

const PlanetList: React.FC<{ onSelect: (planet: PlanetSummary) => void }> = ({ onSelect }) => {
    const [category, setCategory] = useState<PlanetCategory>('Owned');
    const [enemyPlanets, setEnemyPlanets] = useState<PlanetSummary[]>(MOCK_PLANETS['Enemy']);

    // Add Enemy Form State
    const [newEnemyName, setNewEnemyName] = useState('');
    const [newEnemySector, setNewEnemySector] = useState('');
    const [newEnemyOwner, setNewEnemyOwner] = useState(MOCK_PLAYERS[0]);

    const handleAddEnemy = () => {
        if (!newEnemyName || !newEnemySector) return;

        const newPlanet: PlanetSummary = {
            id: `e-${Date.now()}`,
            name: newEnemyName,
            sector: parseInt(newEnemySector) || 0,
            population: 0,
            level: 1,
            rating: { off: 0, def: 0 },
            tax: 0,
            credits: 0,
            alignment: 0,
            imageSeed: newEnemyName,
            owner: newEnemyOwner,
            alliance: 'Unknown',
            messages: { public: '', internal: '' },
            buildings: {},
            defenses: {},
            drones: { combat: 0, shield: 0, emp: 0 },
            dockedShips: []
        };

        setEnemyPlanets([...enemyPlanets, newPlanet]);
        setNewEnemyName('');
        setNewEnemySector('');
    };

    const currentList = category === 'Enemy' ? enemyPlanets : MOCK_PLANETS[category];

    return (
        <div className="w-full max-w-[800px] flex flex-col gap-4">
            <div className="flex flex-col gap-2 border-b border-[#004488] pb-2 mb-2">
                <div className="flex justify-between items-end">
                    <h2 className="text-[#00ccff] font-bold text-[20px] uppercase tracking-widest">Planetary Command</h2>
                    <div className="text-[#667788] text-[11px] font-mono">
                        {category === 'Owned' ? `Owned Planets: ${currentList.length} / 5` : `${category} Planets: ${currentList.length}`}
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-1">
                    {['Owned', 'Alliance', 'Allied', 'Enemy'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat as PlanetCategory)}
                            className={`
                                px-4 py-1 text-[11px] font-bold uppercase tracking-wider border rounded-t transition-all
                                ${category === cat
                                    ? 'bg-[#004488] text-white border-[#00ccff] border-b-0'
                                    : 'bg-[#001122] text-[#667788] border-[#223344] hover:text-[#00ccff] hover:bg-[#002244]'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add Enemy Form */}
            {category === 'Enemy' && (
                <div className="bg-[#001122] border border-[#223344] p-3 rounded flex gap-2 items-end mb-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex-1">
                        <label className="block text-[#667788] text-[9px] uppercase font-bold mb-1">Planet Name</label>
                        <input
                            type="text"
                            value={newEnemyName}
                            onChange={(e) => setNewEnemyName(e.target.value)}
                            className="w-full bg-[#050a10] border border-[#223344] text-white px-2 py-1 text-[11px] focus:border-[#00ccff] outline-none"
                            placeholder="Enter Name..."
                        />
                    </div>
                    <div className="w-[80px]">
                        <label className="block text-[#667788] text-[9px] uppercase font-bold mb-1">Sector</label>
                        <input
                            type="number"
                            value={newEnemySector}
                            onChange={(e) => setNewEnemySector(e.target.value)}
                            className="w-full bg-[#050a10] border border-[#223344] text-white px-2 py-1 text-[11px] focus:border-[#00ccff] outline-none"
                            placeholder="####"
                        />
                    </div>
                    <div className="w-[150px]">
                        <label className="block text-[#667788] text-[9px] uppercase font-bold mb-1">Owner</label>
                        <select
                            value={newEnemyOwner}
                            onChange={(e) => setNewEnemyOwner(e.target.value)}
                            className="w-full bg-[#050a10] border border-[#223344] text-white px-2 py-1 text-[11px] focus:border-[#00ccff] outline-none"
                        >
                            {MOCK_PLAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleAddEnemy}
                        className="bg-[#440000] text-red-400 border border-red-900 px-3 py-1 text-[10px] font-bold uppercase hover:bg-[#660000] h-[26px]"
                    >
                        Add Target
                    </button>
                </div>
            )}

            <div className="bg-[#050a10] border border-[#223344] shadow-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                        <tr className="bg-[#002244] text-[#00ccff] border-b border-[#004488]">
                            <th className="p-2 pl-4">Planet Name</th>
                            {category !== 'Owned' && <th className="p-2">Owner / Alliance</th>}
                            <th className="p-2 text-center">Sector</th>
                            <th className="p-2 text-center">Pop / Lvl</th>
                            <th className="p-2 text-center">Rating</th>
                            <th className="p-2 text-center">Tax</th>
                            <th className="p-2 text-right pr-4">Treasury</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#112233]">
                        {currentList.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-[#445566] italic">No planets found in this category.</td>
                            </tr>
                        ) : (
                            currentList.map((planet) => (
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
                                    {category !== 'Owned' && (
                                        <td className="p-2 text-[#eccc66]">
                                            {planet.owner} <span className="text-[#667788]">[{planet.alliance}]</span>
                                        </td>
                                    )}
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
                            ))
                        )}
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
                                <div className="space-y-2">
                                    <div className="bg-[#001122] border border-[#223344] p-3 text-[11px] text-[#aaaaaa] italic rounded">
                                        <div className="text-[#445566] text-[9px] uppercase mb-1">Public</div>
                                        "{planet.messages.public}"
                                    </div>
                                    <div className="bg-[#001122] border border-[#223344] p-3 text-[11px] text-[#aaaaaa] italic rounded">
                                        <div className="text-[#445566] text-[9px] uppercase mb-1">Internal</div>
                                        "{planet.messages.internal}"
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#112233] text-[10px] text-[#667788] flex justify-between">
                                <span>{planet.buildings['goods_exporter'] || 0} Goods Exporters</span>
                                <span>{planet.buildings['drone_hangar'] || 0} Drone Hangars</span>
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
                            <div className="mt-2 text-[#445566] text-[10px] italic">Good luck ^_^</div>
                        </div>
                    </div>
                )}

                {activeTab === 'Defenses' && (
                    <div className="relative z-10 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-[#001122] border border-[#223344] p-2 text-center rounded">
                                <div className="text-[#667788] text-[10px] uppercase">Shield Capacity</div>
                                <div className="text-blue-400 font-bold font-mono">{(planet.defenses['shield_generator'] || 0) * 1000}</div>
                            </div>
                            <div className="bg-[#001122] border border-[#223344] p-2 text-center rounded">
                                <div className="text-[#667788] text-[10px] uppercase">Armor Capacity</div>
                                <div className="text-gray-400 font-bold font-mono">25,000</div>
                            </div>
                            <div className="bg-[#001122] border border-[#223344] p-2 text-center rounded">
                                <div className="text-[#667788] text-[10px] uppercase">Drone Capacity</div>
                                <div className="text-yellow-400 font-bold font-mono">{(planet.buildings['drone_hangar'] || 0) * 10}</div>
                            </div>
                        </div>

                        {/* Drones */}
                        <div>
                            <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-2">Drone Status</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['Combat', 'Shield', 'EMP'].map(type => (
                                    <div key={type} className="flex justify-between bg-[#001122] px-3 py-2 rounded border border-[#223344]">
                                        <span className="text-[#8899aa] text-[11px]">{type}</span>
                                        <span className="text-white font-mono text-[11px]">{planet.drones[type.toLowerCase() as keyof typeof planet.drones]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Structures */}
                        <div>
                            <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-2">Defensive Structures</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {BUILDING_TYPES.Defenses.map(def => (
                                    <div key={def.id} className="flex justify-between items-center bg-[#001122] px-3 py-2 rounded border border-[#223344]">
                                        <span className="text-[#aaccff] text-[11px]">{def.name}</span>
                                        <span className="text-white font-mono text-[11px] font-bold">{planet.defenses[def.id] || 0}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Production' && (
                    <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-center bg-[#001122] p-2 border border-[#223344] rounded mb-4">
                            <div className="text-[11px] text-[#8899aa]">Available Manpower: <span className="text-white font-bold">{planet.population.toLocaleString()}</span></div>
                            <div className="text-[11px] text-[#8899aa]">Construction Queue: <span className="text-green-400">Idle</span></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['Resources', 'Goods', 'Services'].map(category => (
                                <div key={category}>
                                    <h3 className="text-[#00ccff] font-bold text-[14px] uppercase border-b border-[#004488] pb-1 mb-2">{category}</h3>
                                    <div className="space-y-1">
                                        {BUILDING_TYPES[category as keyof typeof BUILDING_TYPES].map((b: any) => (
                                            <div key={b.id} className="flex justify-between items-center bg-[#001122] px-2 py-1.5 rounded border border-[#223344] hover:bg-[#002244] cursor-pointer group">
                                                <div className="flex flex-col">
                                                    <span className="text-[#aaccff] text-[11px] font-bold group-hover:text-white">{b.name}</span>
                                                    <span className="text-[#445566] text-[9px]">Cost: ${b.cost} | Turns: {b.turns}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#667788] text-[10px]">Owned: <span className="text-white">{planet.buildings[b.id] || 0}</span></span>
                                                    <button className="bg-[#003366] text-[#00ccff] text-[10px] px-2 py-0.5 rounded hover:bg-[#004488] border border-[#004488] uppercase">Build</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Options' && (
                    <div className="space-y-6 relative z-10 max-w-[500px] mx-auto">
                        <div>
                            <label className="block text-[#00ccff] text-[11px] font-bold mb-1 uppercase">Planet Name</label>
                            <input type="text" defaultValue={planet.name} className="w-full bg-[#001122] border border-[#223344] text-white px-2 py-1 text-[12px] focus:border-[#00ccff] outline-none" />
                        </div>
                        <div>
                            <label className="block text-[#00ccff] text-[11px] font-bold mb-1 uppercase">Tax Rate (%)</label>
                            <div className="flex gap-2 items-center">
                                <input type="range" min="0" max="10" defaultValue={planet.tax} className="flex-1 accent-[#00ccff]" />
                                <span className="text-white font-mono font-bold w-10 text-right">{planet.tax}%</span>
                            </div>
                            <div className="text-[#445566] text-[9px] mt-1">Warning: Taxes above 5% reduce population growth.</div>
                        </div>
                        <div>
                            <label className="block text-[#00ccff] text-[11px] font-bold mb-1 uppercase">Public Message</label>
                            <textarea defaultValue={planet.messages.public} className="w-full h-16 bg-[#001122] border border-[#223344] text-white px-2 py-1 text-[12px] focus:border-[#00ccff] outline-none resize-none"></textarea>
                        </div>
                        <div>
                            <label className="block text-[#00ccff] text-[11px] font-bold mb-1 uppercase">Internal Message (Alliance Only)</label>
                            <textarea defaultValue={planet.messages.internal} className="w-full h-16 bg-[#001122] border border-[#223344] text-white px-2 py-1 text-[12px] focus:border-[#00ccff] outline-none resize-none"></textarea>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="viewDefenses" className="accent-[#00ccff]" />
                            <label htmlFor="viewDefenses" className="text-[#aaccff] text-[11px]">Allow Alliance to View Defenses</label>
                        </div>
                        <button className="bg-[#003366] text-white px-4 py-2 text-[11px] font-bold uppercase hover:bg-[#004488] transition-colors w-full border border-[#004488] shadow-[0_0_10px_rgba(0,100,255,0.2)]">
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Docked Ships Section */}
            <div className="bg-[#050a10] border border-[#223344] shadow-lg overflow-hidden mt-2">
                <div className="bg-[#001122] px-3 py-1 border-b border-[#223344] text-[#00ccff] font-bold text-[11px] uppercase tracking-wider">
                    Other Ships at this Planet
                </div>
                <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                        <tr className="text-[#445566] border-b border-[#112233] text-[9px] uppercase">
                            <th className="p-2 pl-4">Name</th>
                            <th className="p-2 text-right">Class/Race</th>
                            <th className="p-2 text-center">Lvl</th>
                            <th className="p-2 text-center">Rating</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#112233]">
                        {planet.dockedShips.length === 0 ? (
                            <tr><td colSpan={4} className="p-4 text-center text-[#445566] italic">No other ships docked.</td></tr>
                        ) : (
                            planet.dockedShips.map(ship => (
                                <tr key={ship.id} className="hover:bg-[#001122]">
                                    <td className="p-2 pl-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-4 bg-[#112233] border border-[#223344] overflow-hidden relative">
                                                {/* Placeholder ship icon */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">{ship.name}</div>
                                                <div className="flex gap-1 text-[9px]">
                                                    {ship.alliance && <span className="text-[#00ccff]">[{ship.alliance}]</span>}
                                                    {ship.isOnline && <span className="text-green-500">[ONLINE]</span>}
                                                    {ship.isCloaked && <span className="text-[#445566]">[CLOAKED]</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-2 text-right">
                                        <div className="text-[#aaccff]">{ship.class}</div>
                                        <div className="text-[#667788] text-[9px] uppercase">{ship.race}</div>
                                    </td>
                                    <td className="p-2 text-center text-white font-bold">{ship.level}</td>
                                    <td className="p-2 text-center">
                                        <div className="text-[#00ccff]">{ship.rating.off}/{ship.rating.def}</div>
                                        <div className="text-[#445566] text-[9px] cursor-pointer hover:text-white">[Examine]</div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
