import React from 'react';
import { StandardPlayerRow } from './ShipList';
import { ShipData } from '../types';

const DRONE_DATA: ShipData[] = [
    {
        id: 'drone-1',
        location: 'sector',
        shipName: 'Starkiller',
        playerName: '',
        guild: 'Sith',
        race: '5 Combat Drones',
        shipClass: 'Drone Cluster',
        shipLevel: 0,
        playerLevel: 99,
        rating: 'N/A',
        isOnline: true,
        status: []
    },
    {
        id: 'drone-2',
        location: 'sector',
        shipName: 'Darth Vader',
        playerName: '',
        guild: 'Empire',
        race: '12 Scout Drones',
        shipClass: 'Drone Cluster',
        shipLevel: 0,
        playerLevel: 100,
        rating: 'N/A',
        isOnline: true,
        status: []
    }
];

export const ForcesDisplay: React.FC<{ onAttack?: (target?: any) => void }> = ({ onAttack }) => {
    return (
        <div className="w-full bg-[#0b131e]/80 border border-[#223344] rounded-sm p-3 shadow-lg backdrop-blur-sm">
            <div className="text-[#ff5555] font-bold text-[11px] mb-2 uppercase tracking-wide border-b border-[#442222] pb-1">
                Forces in Sector
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#8899aa]">
                <div>
                    <span className="text-white font-bold">Owner:</span> <span className="text-[#aaccff]">(0-0)</span>
                </div>
                <div className="flex gap-2">
                    <span>Sct: <span className="text-white">50</span></span>
                    <span>Com: <span className="text-white">200</span></span>
                    <span>EMP: <span className="text-white">10</span></span>
                </div>
            </div>

            <div className="mt-2 border-t border-[#223344] pt-2">
                <div className="text-[#667788] text-[9px] uppercase tracking-wider mb-1">Deployed Drones</div>
                <div className="flex flex-col gap-1 border border-[#003366] bg-black/50 shadow-lg rounded-sm overflow-hidden">
                    {DRONE_DATA.map(drone => (
                        <StandardPlayerRow
                            key={drone.id}
                            data={drone}
                            onExamine={() => onAttack?.(drone)}
                            actionLabel="[Attack]"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
