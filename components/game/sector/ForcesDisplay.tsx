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
        race: '',
        shipClass: 'Combat',
        shipLevel: 0,
        playerLevel: 0,
        rating: '5',
        isOnline: true,
        status: []
    },
    {
        id: 'drone-2',
        location: 'sector',
        shipName: 'Darth Vader',
        playerName: '',
        guild: 'Empire',
        race: '',
        shipClass: 'Scout',
        shipLevel: 0,
        playerLevel: 0,
        rating: '12',
        isOnline: true,
        status: []
    }
];

export const ForcesDisplay: React.FC<{ onAttack?: (target?: any) => void }> = ({ onAttack }) => {
    return (
        <div className="flex flex-col w-full min-w-[500px] overflow-x-auto mt-4">
            <div className="bg-[#1a0505] border border-[#441111] border-b-0 py-1 text-center">
                <span className="text-[#ff5555] font-bold text-[11px] uppercase tracking-wider shadow-black drop-shadow-md">
                    Forces in Sector
                </span>
            </div>

            <div className="bg-gradient-to-r from-[#330000]/90 via-[#441111]/90 to-[#110000]/90 border border-[#660000] border-b-0 px-1 py-1 h-[24px] backdrop-blur-sm shadow-md grid grid-cols-[200px_1fr_70px_30px_60px] gap-x-1 items-center text-[#ff8888] text-[8px] uppercase tracking-wider">
                <div className="text-left pl-1"></div>
                <div className="text-left pl-1">Name</div>
                <div className="text-right">Type</div>
                <div className="text-right px-1">Qty</div>
                <div className="text-right pr-1"></div>
            </div>

            <div className="border border-[#660000] bg-black/50 shadow-lg rounded-b-sm overflow-hidden flex flex-col backdrop-blur-sm">
                {DRONE_DATA.map(drone => (
                    <StandardPlayerRow
                        key={drone.id}
                        data={drone}
                        onExamine={() => onAttack?.(drone)}
                        actionLabel="[Attack]"
                        variant="compact"
                    />
                ))}
            </div>
        </div>
    );
};
