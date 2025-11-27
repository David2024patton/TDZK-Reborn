import React, { useState } from 'react';
import { SHIPS, UPGRADES, WEAPONS, DRONES, EQUIPMENT, ITEMS } from '../../../../data/helpData';

interface StationInternalProps {
    name: string;
    onUndock?: () => void;
}

export const StationInternal: React.FC<StationInternalProps> = ({ name, onUndock }) => {
    const [activeTab, setActiveTab] = useState('Ships');
    const tabs = ['Ships', 'Upgrades', 'Weapons', 'Drones', 'Equipment', 'Items'];

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

    const getRowData = (item: any) => {
        const name = item.name || item.class || item.upgrade;
        const cost = item.cost || item.base_cost || "N/A";
        const type = item.type || item.size || item.level;
        return { name, cost, type };
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
                {getList().map((item: any, i: number) => {
                    const { name, cost, type } = getRowData(item);
                    return (
                        <div key={i} className="flex justify-between items-center p-2 border-b border-[#112233] hover:bg-[#0a1525] group">
                            <div className="flex flex-col min-w-0 flex-1 pr-4">
                                <span className="text-[#ddeeff] font-bold text-[12px] truncate">{name}</span>
                                <span className="text-[#667788] text-[10px]">{type && String(type)}</span>
                            </div>
                            <div className="text-right min-w-[100px]">
                                <div className="text-green-400 font-mono text-[12px] mb-1 font-bold">${String(cost).replace(/\s/g, '')}</div>
                                <button className="bg-[#002244] border border-[#004488] text-[#00ccff] text-[10px] px-3 py-1 rounded-[2px] hover:bg-[#00ccff] hover:text-black hover:font-bold transition-colors w-full uppercase">
                                    Buy
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
