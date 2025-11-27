
import { ShipData } from '../components/game/types';

export const MOCK_SHIPS: ShipData[] = [
    // SECTOR SHIPS
    { id: '1', location: 'sector', shipName: "~R~The canadien w...", playerName: "canadien_dude", guild: "DRAGON", race: "Kitaran", shipClass: "Ranger", shipLevel: 245, playerLevel: 92, rating: "90/13", isOnline: true, isEnemy: true },
    { id: '2', location: 'sector', playerName: "dragon", race: "Sniv", shipClass: "Escape Pod", shipLevel: 43, playerLevel: 43, rating: "-", isOnline: true, isEnemy: true, status: ['Cloaked'] },
    { id: '3', location: 'sector', shipName: "T[R]agically 1337", playerName: "TragicHero", guild: "DRAGON", race: "Derivian", shipClass: "Cruiser", shipLevel: 240, playerLevel: 88, rating: "55/35", isOnline: true, isEnemy: true },
    { id: '5', location: 'sector', shipName: "[PFS] Las Maquina...", playerName: "LasMaquina", guild: "PFS", race: "Zallun", shipClass: "Cruiser", shipLevel: 250, playerLevel: 102, rating: "102/29", isOnline: true, isAlly: true, status: ['Deployed'] },
    { id: '6', location: 'sector', playerName: "FilthPig", race: "Wraith", shipClass: "Corvette", shipLevel: 36, playerLevel: 36, rating: "22/15", isOnline: true },
    { id: '7', location: 'sector', shipName: "[PFS] Fear the sw...", playerName: "FearSwarm", guild: "Subversion", race: "Kitaran", shipClass: "Ranger", shipLevel: 255, playerLevel: 99, rating: "70/14", isOnline: true, isAlly: true, status: ['Cloaked', 'Deployed'] },

    // STATION SHIPS (Repairing/Shopping)
    { id: '4', location: 'station', playerName: "Loca`ne", race: "Derivian", shipClass: "Frigate", shipLevel: 30, playerLevel: 30, rating: "5/9", isOnline: true },
    { id: '8', location: 'station', shipName: "[PFS] Sword of Ha...", playerName: "SwordH", guild: "Chechman", race: "Taenarian", shipClass: "Destroyer", shipLevel: 240, playerLevel: 104, rating: "104/38", isOnline: true, isAlly: true },
    { id: '11', location: 'station', playerName: "Tar-El Tanor", race: "Derivian", shipClass: "Escape Pod", shipLevel: 30, playerLevel: 30, rating: "-", isOnline: true },

    // PORT SHIPS (Trading)
    { id: '9', location: 'port', playerName: "Nova Chechman", race: "Wraith", shipClass: "Frigate", shipLevel: 34, playerLevel: 34, rating: "8/8", isOnline: true, isNpc: true, status: ['Cloaked'] },
    { id: '10', location: 'port', shipName: "[PFS]. All Good T...", playerName: "AllGood", guild: "Tar-El Tanor", race: "Derivian", shipClass: "Freighter", shipLevel: 230, playerLevel: 98, rating: "98/38", isOnline: true, isAlly: true },
    { id: '12', location: 'port', shipName: "[Mixi] [PFS] Black widow", playerName: "BlackWidow", guild: "Mixi", race: "Zallun", shipClass: "Freighter", shipLevel: 225, playerLevel: 85, rating: "36/24", isOnline: true, isAlly: true },
    { id: '13', location: 'port', shipName: "Merchant One", playerName: "TradeBot", race: "Tamaran", shipClass: "Freighter", shipLevel: 150, playerLevel: 50, rating: "10/50", isOnline: true },

    // PLANET SHIPS
    { id: '14', location: 'planet', shipName: "Orbital Guard", playerName: "SystemDef", race: "Zallun", shipClass: "Cruiser", shipLevel: 200, playerLevel: 80, rating: "80/80", isOnline: true, isAlly: true, status: ['Deployed'] },
];
