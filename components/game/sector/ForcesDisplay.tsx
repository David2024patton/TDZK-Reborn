import React from 'react';
import { StandardPlayerRow } from './ShipList';
import { ShipData } from '../types';

export const ForcesDisplay: React.FC<{ forces: any[], onAttack?: (target?: any) => void }> = ({ forces, onAttack }) => {
    const droneShips: ShipData[] = forces.map(f => ({
        id: f.id.toString(),
        location: 'sector',
        shipName: f.name,
        playerName: '',
        guild: f.stats?.guild || 'Unknown',
        race: f.type,
        shipClass: f.type,
        shipLevel: f.stats?.level || 0,
        playerLevel: 0,
        rating: f.stats?.rating || '0',
        isOnline: true,
        status: []
    }));

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
                {droneShips.length > 0 ? (
                    droneShips.map(drone => (
                        <StandardPlayerRow
                            key={drone.id}
                            data={drone}
                            onExamine={() => onAttack?.(drone)}
                            actionLabel="[Attack]"
                            variant="compact"
                        />
                    ))
                ) : (
                    <div className="p-4 text-center text-[#664444] italic text-[10px]">
                        No forces detected in this sector.
                    </div>
                )}
            </div>
        </div>
    );
};
