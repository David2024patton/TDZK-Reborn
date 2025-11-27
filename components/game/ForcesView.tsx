import React, { useState, useMemo } from 'react';

// --- Types ---

interface SectorForces {
    sector: number;
    name?: string; // Optional sector name if available
    drones: {
        combat: number;
        emp: number;
        research: number;
        repair: number;
        mining: number;
    };
}

// --- Mock Data ---

const MOCK_SECTOR_FORCES: SectorForces[] = Array.from({ length: 150 }, (_, i) => ({
    sector: Math.floor(Math.random() * 10000) + 1,
    name: Math.random() > 0.8 ? `Outpost ${String.fromCharCode(65 + i % 26)}-${i}` : undefined,
    drones: {
        combat: Math.random() > 0.6 ? Math.floor(Math.random() * 51) : 0,
        emp: Math.random() > 0.9 ? Math.floor(Math.random() * 51) : 0,
        research: Math.random() > 0.9 ? Math.floor(Math.random() * 51) : 0,
        repair: Math.random() > 0.8 ? Math.floor(Math.random() * 51) : 0,
        mining: Math.random() > 0.5 ? Math.floor(Math.random() * 51) : 0,
    }
})).sort((a, b) => a.sector - b.sector);

type SortField = 'sector' | 'combat' | 'emp' | 'research' | 'repair' | 'mining' | 'total';
type FilterCategory = 'All' | 'Combat' | 'Mining' | 'Support';

// --- Components ---

export const ForcesView: React.FC = () => {
    const [sortBy, setSortBy] = useState<SortField>('sector');
    const [sortDesc, setSortDesc] = useState(false);
    const [filter, setFilter] = useState<FilterCategory>('All');
    const [sectorRange, setSectorRange] = useState<number>(0); // 0 = All, 1 = 1-1000, 2 = 1001-2000, etc.

    // Calculate totals (always based on full list)
    const totals = useMemo(() => MOCK_SECTOR_FORCES.reduce((acc, curr) => ({
        combat: acc.combat + curr.drones.combat,
        emp: acc.emp + curr.drones.emp,
        research: acc.research + curr.drones.research,
        repair: acc.repair + curr.drones.repair,
        mining: acc.mining + curr.drones.mining,
    }), { combat: 0, emp: 0, research: 0, repair: 0, mining: 0 }), []);

    // Generate Ranges
    const ranges = useMemo(() => {
        const maxSector = Math.max(...MOCK_SECTOR_FORCES.map(f => f.sector), 10000);
        const rangeCount = Math.ceil(maxSector / 1000);
        return Array.from({ length: rangeCount }, (_, i) => ({
            id: i + 1,
            label: `${i + 1}k`,
            min: i * 1000 + 1,
            max: (i + 1) * 1000
        }));
    }, []);

    const filteredAndSortedForces = useMemo(() => {
        let result = [...MOCK_SECTOR_FORCES];

        // Filter by Range
        if (sectorRange > 0) {
            const range = ranges.find(r => r.id === sectorRange);
            if (range) {
                result = result.filter(f => f.sector >= range.min && f.sector <= range.max);
            }
        }

        // Filter by Category
        if (filter !== 'All') {
            result = result.filter(force => {
                if (filter === 'Combat') return force.drones.combat > 0;
                if (filter === 'Mining') return force.drones.mining > 0;
                if (filter === 'Support') return force.drones.emp > 0 || force.drones.research > 0 || force.drones.repair > 0;
                return true;
            });
        }

        // Sort
        result.sort((a, b) => {
            let valA = 0;
            let valB = 0;

            if (sortBy === 'sector') {
                valA = a.sector;
                valB = b.sector;
            } else if (sortBy === 'total') {
                valA = Object.values(a.drones).reduce((sum: number, v: number) => sum + v, 0);
                valB = Object.values(b.drones).reduce((sum: number, v: number) => sum + v, 0);
            } else {
                valA = a.drones[sortBy];
                valB = b.drones[sortBy];
            }

            return sortDesc ? valB - valA : valA - valB;
        });

        return result;
    }, [filter, sortBy, sortDesc, sectorRange, ranges]);

    const handleSort = (field: SortField) => {
        if (sortBy === field) {
            setSortDesc(!sortDesc);
        } else {
            setSortBy(field);
            setSortDesc(true); // Default to descending for numbers usually
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortBy !== field) return <span className="opacity-20 ml-1">↕</span>;
        return <span className="ml-1 text-[#00ccff]">{sortDesc ? '↓' : '↑'}</span>;
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {/* Header */}
            <div className="w-full max-w-[800px] mb-4 text-center">
                <h2 className="text-[#00ccff] font-bold text-[24px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,204,255,0.5)] mb-2">
                    Drone Command
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#004488] to-transparent mb-4"></div>

                {/* Sector Range Filters */}
                <div className="flex flex-wrap justify-center gap-1 mb-3 max-w-[600px] mx-auto">
                    <button
                        onClick={() => setSectorRange(0)}
                        className={`
                            px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded transition-all mb-1
                            ${sectorRange === 0
                                ? 'bg-[#00ccff] text-[#000] border-[#00ccff] shadow-[0_0_10px_rgba(0,204,255,0.5)]'
                                : 'bg-[#001122] text-[#445566] border-[#223344] hover:text-[#00ccff] hover:border-[#00ccff]'
                            }
                        `}
                    >
                        ALL SECTORS
                    </button>
                    {ranges.map((range) => (
                        <button
                            key={range.id}
                            onClick={() => setSectorRange(range.id)}
                            className={`
                                px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded transition-all mb-1 min-w-[40px]
                                ${sectorRange === range.id
                                    ? 'bg-[#004488] text-white border-[#00ccff] shadow-[0_0_10px_rgba(0,100,255,0.3)]'
                                    : 'bg-[#001122] text-[#667788] border-[#223344] hover:text-[#00ccff] hover:bg-[#002244]'
                                }
                            `}
                            title={`Sectors ${range.min} - ${range.max}`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>

                {/* Category Filters */}
                <div className="flex justify-center gap-2 mb-4">
                    {['All', 'Combat', 'Mining', 'Support'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat as FilterCategory)}
                            className={`
                                px-4 py-1 text-[11px] font-bold uppercase tracking-wider border rounded transition-all
                                ${filter === cat
                                    ? 'bg-[#004488] text-white border-[#00ccff] shadow-[0_0_10px_rgba(0,100,255,0.3)]'
                                    : 'bg-[#001122] text-[#667788] border-[#223344] hover:text-[#00ccff] hover:bg-[#002244]'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="text-[#667788] text-[12px] font-mono flex justify-between px-2">
                    <span>Showing {filteredAndSortedForces.length} Sectors</span>
                    <span>Total Forces: {Object.values(totals).reduce((a: number, b: number) => a + b, 0).toLocaleString()}</span>
                </div>
            </div>

            {/* Forces Table */}
            <div className="w-full max-w-[800px] bg-[#050a10] border border-[#223344] shadow-lg overflow-hidden flex-1 flex flex-col">
                <div className="overflow-y-auto scrollbar-retro">
                    <table className="w-full text-left border-collapse text-[12px]">
                        <thead className="sticky top-0 bg-[#002244] z-10 shadow-md">
                            <tr className="text-[#00ccff] border-b border-[#004488]">
                                <th className="p-3 pl-4 cursor-pointer hover:bg-[#003366] transition-colors select-none" onClick={() => handleSort('sector')}>
                                    Sector <SortIcon field="sector" />
                                </th>
                                <th className="p-3 text-center text-red-400 cursor-pointer hover:bg-[#003366] transition-colors select-none" onClick={() => handleSort('combat')}>
                                    Combat <SortIcon field="combat" />
                                </th>
                                <th className="p-3 text-center text-blue-400 cursor-pointer hover:bg-[#003366] transition-colors select-none" onClick={() => handleSort('emp')}>
                                    EMP <SortIcon field="emp" />
                                </th>
                                <th className="p-3 text-center text-green-400 cursor-pointer hover:bg-[#003366] transition-colors select-none" onClick={() => handleSort('research')}>
                                    Research <SortIcon field="research" />
                                </th>
                                <th className="p-3 text-center text-yellow-400 cursor-pointer hover:bg-[#003366] transition-colors select-none" onClick={() => handleSort('repair')}>
                                    Repair <SortIcon field="repair" />
                                </th>
                                <th className="p-3 text-center text-purple-400 cursor-pointer hover:bg-[#003366] transition-colors select-none" onClick={() => handleSort('mining')}>
                                    Mining <SortIcon field="mining" />
                                </th>
                                <th className="p-3 text-right pr-4 text-white cursor-pointer hover:bg-[#003366] transition-colors select-none" onClick={() => handleSort('total')}>
                                    Total <SortIcon field="total" />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#112233]">
                            {filteredAndSortedForces.map((force) => {
                                const sectorTotal = Object.values(force.drones).reduce((a: number, b: number) => a + b, 0);
                                return (
                                    <tr key={force.sector} className="hover:bg-[#003366] transition-colors group">
                                        <td className="p-3 pl-4">
                                            <div className="text-white font-bold text-[13px] group-hover:text-[#00ccff] transition-colors">
                                                Sector {force.sector}
                                            </div>
                                            {force.name && <div className="text-[#667788] text-[10px]">{force.name}</div>}
                                        </td>
                                        <td className="p-3 text-center font-mono text-[#ffaaaa]">{force.drones.combat > 0 ? force.drones.combat.toLocaleString() : '-'}</td>
                                        <td className="p-3 text-center font-mono text-[#aaaaff]">{force.drones.emp > 0 ? force.drones.emp.toLocaleString() : '-'}</td>
                                        <td className="p-3 text-center font-mono text-[#aaffaa]">{force.drones.research > 0 ? force.drones.research.toLocaleString() : '-'}</td>
                                        <td className="p-3 text-center font-mono text-[#ffffaa]">{force.drones.repair > 0 ? force.drones.repair.toLocaleString() : '-'}</td>
                                        <td className="p-3 text-center font-mono text-[#ffccff]">{force.drones.mining > 0 ? force.drones.mining.toLocaleString() : '-'}</td>
                                        <td className="p-3 text-right pr-4 font-bold text-white font-mono">{sectorTotal.toLocaleString()}</td>
                                    </tr>
                                );
                            })}

                            {filteredAndSortedForces.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-[#667788] italic">
                                        No sectors found matching filter "{filter}" {sectorRange > 0 ? `in range ${ranges.find(r => r.id === sectorRange)?.label}` : ''}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Sticky Footer Totals */}
                <div className="bg-[#001122] border-t-2 border-[#004488]">
                    <table className="w-full text-left text-[12px]">
                        <tbody>
                            <tr>
                                <td className="p-3 pl-4 font-bold text-[#00ccff] uppercase tracking-wider w-[20%]">Fleet Totals</td>
                                <td className="p-3 text-center font-bold text-red-400 font-mono w-[11%]">{totals.combat.toLocaleString()}</td>
                                <td className="p-3 text-center font-bold text-blue-400 font-mono w-[11%]">{totals.emp.toLocaleString()}</td>
                                <td className="p-3 text-center font-bold text-green-400 font-mono w-[11%]">{totals.research.toLocaleString()}</td>
                                <td className="p-3 text-center font-bold text-yellow-400 font-mono w-[11%]">{totals.repair.toLocaleString()}</td>
                                <td className="p-3 text-center font-bold text-purple-400 font-mono w-[11%]">{totals.mining.toLocaleString()}</td>
                                <td className="p-3 text-right pr-4 font-bold text-white font-mono text-[14px] w-[15%]">
                                    {Object.values(totals).reduce((a: number, b: number) => a + b, 0).toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
