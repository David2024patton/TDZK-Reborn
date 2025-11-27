
export interface ShipData {
    id: string;
    location: 'sector' | 'station' | 'port' | 'planet';
    shipName?: string;
    playerName: string;
    guild?: string;
    race: string;
    shipClass: string;
    shipLevel: number;
    playerLevel: number;
    rating: string;
    isOnline: boolean;
    isEnemy?: boolean;
    isAlly?: boolean;
    isNpc?: boolean;
    status?: string[];
}
