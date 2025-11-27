
import React from 'react';
import { ShipData } from './types';

// Mock Data for Forces View
const MOCK_ENEMY_SHIPS: ShipData[] = [
    {
        id: 'e1',
        location: 'sector',
        shipName: 'Vindicator',
        playerName: 'Unknown',
        shipClass: 'Destroyer',
        race: 'Human',
        playerLevel: 45,
        shipLevel: 45,
        rating: '120/80',
        isOnline: true,
        isEnemy: true,
        status: ['Hostile']
    },
    {
        id: 'e2',
        location: 'sector',
        shipName: 'Shadow',
        playerName: 'Unknown',
        shipClass: 'Scout',
        race: 'Zallun',
        playerLevel: 52,
        shipLevel: 52,
        rating: '60/40',
        isOnline: true,
        isEnemy: false,
        status: ['Neutral']
    },
    {
        id: 'e3',
        location: 'sector',
        shipName: 'Dreadnought',
        playerName: 'Unknown',
        shipClass: 'Battleship',
        race: 'Kitaran',
        playerLevel: 110,
        shipLevel: 110,
        rating: '350/200',
        isOnline: true,
        isEnemy: true,
        status: ['Hostile']
    }
];

interface DroneForce {
    id: string;
    owner: string;
    sct: number;
    com: number;
    emp: number;
    res: number;
    rep: number;
    min: number;
    time: string;
}

const MOCK_DRONE_FORCES: DroneForce[] = [
    { id: 'd1', owner: 'Sparky', sct: 10, com: 50, emp: 5, res: 0, rep: 0, min: 20, time: '23h 45m' },
    { id: 'd2', owner: 'Vader', sct: 5, com: 100, emp: 10, res: 0, rep: 5, min: 0, time: '12h 10m' },
];

export const ForcesView: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto scrollbar-retro bg-[#020408]">
            {/* Header */}
            <div className="w-full max-w-[800px] mb-6 text-center">
                <h2 className="text-[#ff0000] font-bold text-[24px] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] mb-2">
                    Sector Forces
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#880000] to-transparent mb-4"></div>
            </div>

            {/* Other Ships Table */}
            <div className="w-full max-w-[800px] mb-8">
                <div className="bg-[#220000] px-3 py-1 text-[#ff5555] font-bold text-[12px] uppercase tracking-wide border border-[#440000] border-b-0">
                    Other Ships in this Sector
                </div>
                <div className="bg-[#0a0505] border border-[#440000] shadow-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-[#110000] text-[#aa4444] border-b border-[#330000]">
                                <th className="p-2">Ship Name</th>
                                <th className="p-2">Class / Race</th>
                                <th className="p-2 text-center">Level</th>
                                <th className="p-2 text-center">Rating (Off/Def)</th>
                                <th className="p-2 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#220000]">
                            {MOCK_ENEMY_SHIPS.map((ship) => (
                                <tr key={ship.id} className="hover:bg-[#220000]/50 transition-colors">
                                    <td className="p-2 font-bold text-white">{ship.shipName}</td>
                                    <td className="p-2 text-[#888888]">{ship.shipClass} <span className="text-[#666666]">({ship.race})</span></td>
                                    <td className="p-2 text-center text-[#eccc66] font-mono">L: {ship.playerLevel}</td>
                                    <td className="p-2 text-center font-mono">
                                        <span className="text-red-400">{ship.rating.split('/')[0]}</span>
                                        <span className="text-[#666666]"> / </span>
                                        <span className="text-blue-400">{ship.rating.split('/')[1]}</span>
                                    </td>
                                    <td className="p-2 text-right">
                                        <button className="text-[#00ccff] hover:text-white hover:underline">[Examine]</button>
                                    </td>
                                </tr>
                            ))}
                            {MOCK_ENEMY_SHIPS.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-[#666666] italic">No other ships detected.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drone Forces Table */}
            <div className="w-full max-w-[800px]">
                <div className="bg-[#001122] px-3 py-1 text-[#00ccff] font-bold text-[12px] uppercase tracking-wide border border-[#003366] border-b-0">
                    Drone Forces in this Sector
                </div>
                <div className="bg-[#050a10] border border-[#003366] shadow-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                            <tr className="bg-[#001122] text-[#4488aa] border-b border-[#002244]">
                                <th className="p-2">Owner</th>
                                <th className="p-2 text-center">Sct</th>
                                <th className="p-2 text-center">Com</th>
                                <th className="p-2 text-center">EMP</th>
                                <th className="p-2 text-center">Res</th>
                                <th className="p-2 text-center">Rep</th>
                                <th className="p-2 text-center">Min</th>
                                <th className="p-2 text-right">Time</th>
                                <th className="p-2 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#002244]">
                            {MOCK_DRONE_FORCES.map((force) => (
                                <tr key={force.id} className="hover:bg-[#002244]/30 transition-colors">
                                    <td className="p-2 font-bold text-white">{force.owner}</td>
                                    <td className="p-2 text-center text-[#aaaaaa]">{force.sct > 0 ? force.sct : '-'}</td>
                                    <td className="p-2 text-center text-red-400 font-bold">{force.com > 0 ? force.com : '-'}</td>
                                    <td className="p-2 text-center text-blue-400">{force.emp > 0 ? force.emp : '-'}</td>
                                    <td className="p-2 text-center text-green-400">{force.res > 0 ? force.res : '-'}</td>
                                    <td className="p-2 text-center text-yellow-400">{force.rep > 0 ? force.rep : '-'}</td>
                                    <td className="p-2 text-center text-purple-400">{force.min > 0 ? force.min : '-'}</td>
                                    <td className="p-2 text-right text-[#667788] font-mono">{force.time}</td>
                                    <td className="p-2 text-right">
                                        <button className="text-red-500 hover:text-red-300 hover:underline font-bold">[ATTACK]</button>
                                    </td>
                                </tr>
                            ))}
                            {MOCK_DRONE_FORCES.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="p-4 text-center text-[#666666] italic">No drone forces detected.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
