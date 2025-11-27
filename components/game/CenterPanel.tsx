
import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { ViewType } from './GameLayout';
import { 
  GOODS, SHIPS, WEAPONS, DRONES, UPGRADES, EQUIPMENT, ITEMS 
} from '../../data/helpData';
import { AllianceView } from './AllianceView';

// --- Helper Components ---

interface ShipData {
  id: string;
  location: 'sector' | 'station' | 'port' | 'planet'; // New field for filtering
  shipName?: string;
  playerName: string;
  guild?: string; // Alliance Tag
  race: string;
  shipClass: string;
  shipLevel: number;
  playerLevel: number;
  rating: string; // "Attack/Defense"
  isOnline: boolean;
  isEnemy?: boolean;
  isAlly?: boolean;
  isNpc?: boolean;
  status?: string[]; // 'Cloaked', 'Deployed'
}

const MOCK_SHIPS: ShipData[] = [
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

const StatusBadge: React.FC<{ type: 'cloak' | 'deploy' }> = ({ type }) => {
  if (type === 'cloak') {
      return (
        <div className="w-[48px] h-[9px] bg-[#220000] border border-[#ff0000] flex items-center justify-center rounded-[1px] mb-[1px] shadow-[0_0_2px_rgba(255,0,0,0.5)]">
            <span className="text-[6px] text-[#ff0000] font-bold leading-none tracking-widest uppercase">CLOAKED</span>
        </div>
      );
  }
  if (type === 'deploy') {
      return (
        <div className="w-[48px] h-[9px] bg-[#222200] border border-[#ffff00] flex items-center justify-center rounded-[1px] mb-[1px] shadow-[0_0_2px_rgba(255,255,0,0.5)]">
            <span className="text-[6px] text-[#ffff00] font-bold leading-none tracking-widest uppercase">DEPLOYED</span>
        </div>
      );
  }
  return null;
};

// ... (Other Modals ActionModal, ExamineModal, StandardPlayerRow, ResourceRow remain unchanged) ...

// --- Action Modal (Attack/Raid) ---
interface ActionModalProps {
  type: 'attack' | 'raid';
  target: any;
  onClose: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ type, target, onClose }) => {
    const isRaid = type === 'raid';
    const title = isRaid ? "Tactical Raid" : "Engage Enemy";
    const actionLabel = isRaid ? "BEGIN RAID" : "ATTACK SHIP";
    
    // Derived display data
    const name = target.name || target.shipName || "Unknown Target";
    const sub = target.sub || target.playerName || "Sector Entity";
    const alliance = target.guild || target.allianceName || (isRaid ? "Neutral Target" : "Independent");
    const level = target.level || target.shipLevel || "Unknown";
    
    const bannerSeed = name.replace(/\s/g, '');
    const allianceTagUrl = `https://picsum.photos/seed/${alliance}/50/20`;
    const targetBannerUrl = `https://picsum.photos/seed/${bannerSeed}/150/20`;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="relative w-[400px] bg-[#1a0505] border-2 border-[#660000] shadow-[0_0_40px_rgba(255,0,0,0.4)] p-1 text-verdana" onClick={e => e.stopPropagation()}>
                
                <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-l-2 border-t-2 border-[#ff0000]"></div>
                <div className="absolute -top-[2px] -right-[2px] w-4 h-4 border-r-2 border-t-2 border-[#ff0000]"></div>
                <div className="absolute -bottom-[2px] -left-[2px] w-4 h-4 border-l-2 border-b-2 border-[#ff0000]"></div>
                <div className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-r-2 border-b-2 border-[#ff0000]"></div>

                <div className="bg-[#330000] border-b border-[#660000] pb-2 pt-2 mb-2">
                    <h2 className="text-center text-[#ffaaaa] text-[14px] font-bold tracking-[0.1em] uppercase animate-pulse">{title}</h2>
                    
                    <div className="flex justify-center items-center gap-0 mt-2 opacity-80 grayscale-[0.5]">
                        <img src={allianceTagUrl} className="w-[50px] h-[20px] border border-[#441111]" alt="Alliance" />
                        <img src={targetBannerUrl} className="w-[150px] h-[20px] border border-[#441111] border-l-0" alt="Target" />
                    </div>
                </div>

                <div className="px-4 py-4">
                    <div className="flex justify-between gap-4 mb-4">
                        <div className="flex-1 text-left">
                            <div className="text-red-500 font-bold text-[12px] mb-1 uppercase tracking-wide">{name}</div>
                            <div className="text-[#aa5555] text-[10px] mb-2">{sub}</div>
                            
                            <div className="text-[#884444] text-[10px]">
                                Status: <span className="text-red-500 font-bold blink">LOCKED</span>
                            </div>
                        </div>

                        <div className="flex-1 text-right">
                             <div className="text-[#cc8888] text-[10px] mb-1">Level: <span className="text-white font-bold">{level}</span></div>
                             <div className="text-[#cc8888] text-[10px] mb-2">Alliance: <span className="text-white">{alliance}</span></div>
                             
                             <div className="text-red-600 text-[10px] font-mono">[Combat Log Ready]</div>
                        </div>
                    </div>

                    <div className="bg-[#220000] border border-[#441111] p-2 mb-4 text-center">
                        <div className="text-[#ff5555] text-[10px] uppercase font-bold tracking-wider mb-1">Combat Simulation</div>
                        <div className="text-[#884444] text-[9px]">
                            Odds of success: <span className="text-white">Calculating...</span>
                        </div>
                    </div>

                    <div className="text-center mt-2 mb-1">
                        <div className="flex justify-center gap-4">
                             <button onClick={onClose} className="px-4 py-1 border border-[#662222] text-[#884444] hover:bg-[#220a0a] hover:text-[#aa6666] text-[10px] uppercase transition-colors">
                                 Abort
                             </button>
                             <button className="px-6 py-1.5 bg-[#550000] border border-[#ff0000] text-white hover:bg-[#880000] hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] text-[11px] font-bold uppercase tracking-widest transition-all">
                                 {actionLabel}
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ExamineModalProps {
  ship: ShipData;
  onClose: () => void;
  onAttack: () => void;
}

const ExamineModal: React.FC<ExamineModalProps> = ({ ship, onClose, onAttack }) => {
  const allianceSeed = ship.guild ? ship.guild.replace(/\W/g, '') : 'neutral';
  const personalSeed = ship.playerName.replace(/\W/g, '');
  const allianceTagUrl = `https://picsum.photos/seed/${allianceSeed}/50/20`;
  const personalTagUrl = `https://picsum.photos/seed/${personalSeed}/150/20`;

  const relationship = ship.isEnemy ? "War Declared" : (ship.isAlly ? "Allied Forces" : "Cease-Fire Agreement");
  const relColor = ship.isEnemy ? "text-red-500" : (ship.isAlly ? "text-green-500" : "text-green-500");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
        <div className="relative w-[400px] bg-[#000033] border-2 border-[#003366] shadow-[0_0_30px_rgba(0,50,200,0.5)] p-1 text-verdana" onClick={e => e.stopPropagation()}>
            <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-l-2 border-t-2 border-[#0066cc]"></div>
            <div className="absolute -top-[2px] -right-[2px] w-4 h-4 border-r-2 border-t-2 border-[#0066cc]"></div>
            <div className="absolute -bottom-[2px] -left-[2px] w-4 h-4 border-l-2 border-b-2 border-[#0066cc]"></div>
            <div className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-r-2 border-b-2 border-[#0066cc]"></div>

            <div className="bg-[#001122] border-b border-[#003366] pb-2 pt-2 mb-2">
                <h2 className="text-center text-white text-[14px] font-normal tracking-wide">Examine Ship</h2>
                <div className="flex justify-center items-center gap-0 mt-2">
                    <img src={allianceTagUrl} className="w-[50px] h-[20px] border border-[#333]" alt="Alliance" />
                    <img src={personalTagUrl} className="w-[150px] h-[20px] border border-[#333] border-l-0" alt="Player" />
                </div>
            </div>

            <div className="px-4 py-2">
                <div className="flex justify-between gap-4">
                    <div className="flex-1 text-left">
                        <div className="text-white font-bold text-[11px] mb-1 leading-tight min-h-[2.5em] break-words">
                            {ship.shipName || "Unidentified Vessel"}
                        </div>
                        <div className="text-[#ffff00] text-[10px] mb-1">{ship.shipClass}</div>
                        <div className="text-[#00ccff] text-[10px] font-bold mb-1">Level: <span className="text-white">{ship.shipLevel}</span></div>
                        <div className="text-[#ffff00] text-[16px] font-bold tracking-wider mb-2">{ship.rating}</div>
                        <div className="flex flex-col gap-1 items-start">
                            {ship.status?.map(s => (
                                <div key={s} className={`
                                    text-[9px] px-1 py-0.5 border leading-none uppercase tracking-wider font-bold shadow-[0_0_5px_currentColor]
                                    ${s === 'Cloaked' ? 'bg-[#330000] border-[#ff0000] text-[#ff0000]' : ''}
                                    ${s === 'Deployed' ? 'bg-[#333300] border-[#ffff00] text-[#ffff00]' : ''}
                                `}>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 text-right">
                        <div className="text-white font-bold text-[11px] mb-1 leading-tight min-h-[2.5em]">
                            {ship.playerName}
                        </div>
                        <div className="text-[#ffff00] text-[10px] mb-1">{ship.race}</div>
                        <div className="text-[#00ccff] text-[10px] font-bold mb-2">Level: <span className="text-white">{ship.playerLevel}</span></div>
                        <div className="space-y-1">
                            <div className="text-[#00cc00] hover:text-[#00ff00] cursor-pointer text-[10px]">[Send Message]</div>
                            <div className="text-[#00cc00] hover:text-[#00ff00] cursor-pointer text-[10px]">[Repair]</div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6 mb-2">
                    <div className="text-[#8899aa] text-[9px] mb-1">Alliance Relationship:</div>
                    <div className={`${relColor} font-bold text-[12px] mb-4 drop-shadow-[0_0_5px_rgba(0,0,0,1)]`}>{relationship}</div>

                    <button 
                        onClick={onAttack}
                        className="bg-[#440000] border border-[#ff0000] text-[#ff0000] px-8 py-1.5 text-[11px] font-bold uppercase hover:bg-[#880000] hover:text-white transition-all shadow-[0_0_10px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.6)]"
                    >
                        Attack
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

// ... StandardPlayerRow ...
const StandardPlayerRow: React.FC<{ data: ShipData, onExamine?: (ship: ShipData) => void }> = ({ data, onExamine }) => {
  const { 
    shipName, playerName, guild, race, shipClass, 
    shipLevel, playerLevel, rating, 
    isOnline, status
  } = data;
  
  const allianceSeed = guild ? guild.replace(/\W/g, '') : 'neutral';
  const personalSeed = playerName.replace(/\W/g, '');
  const allianceTagUrl = `https://picsum.photos/seed/${allianceSeed}/50/20`;
  const personalTagUrl = `https://picsum.photos/seed/${personalSeed}/150/20`;
  
  const getRaceColor = (r: string) => {
      switch(r) {
          case 'Kitaran': return 'text-red-400';
          case 'Derivian': return 'text-blue-400';
          case 'Zallun': return 'text-green-400';
          case 'Wraith': return 'text-purple-400';
          case 'Taenarian': return 'text-yellow-200';
          case 'Sniv': return 'text-orange-400';
          case 'Scourge': return 'text-red-600';
          default: return 'text-[#aaccff]';
      }
  };
  const nameColor = getRaceColor(race);

  return (
    <div className="grid grid-cols-[50px_150px_1fr_70px_30px_60px] gap-x-1 border-b border-[#002244] hover:bg-[#001133] text-[9px] group cursor-pointer bg-[#020408] transition-colors py-1 px-1 min-w-[500px]">
      <div className="flex items-start justify-center">
         <img src={allianceTagUrl} alt="Ally" className="w-[50px] h-[20px] object-cover block bg-[#111] border border-[#333]" />
      </div>
      <div className="flex items-start justify-start">
         <img src={personalTagUrl} alt="Personal" className="w-[150px] h-[20px] object-cover block bg-[#222] border border-[#333] border-l-0" />
      </div>
      <div className="flex items-center pl-1 overflow-hidden h-[20px]">
         <span className="text-white font-bold text-[10px] truncate drop-shadow-md">
            {shipName || <span className="opacity-50 italic">Unidentified Vessel</span>}
         </span>
      </div>
      <div className="flex items-center justify-end h-[20px]">
         <span className="text-[#8899aa] text-[9px] truncate">{shipClass}</span>
      </div>
      <div className="flex items-center justify-end px-1 h-[20px]">
         <span className="text-white text-[9px] font-bold">L: {shipLevel}</span>
      </div>
      <div className="flex items-center justify-end pr-1 h-[20px]">
         <span className="text-[#00ccff] font-bold text-[9px]">{rating}</span>
      </div>
      <div className="flex flex-col items-center justify-start pt-0.5 min-h-[14px]">
         {status?.includes('Cloaked') && <StatusBadge type="cloak" />}
         {status?.includes('Deployed') && <StatusBadge type="deploy" />}
      </div>
      <div className="bg-[#000]/10 border-r border-[#112233]/20"></div>
      <div className="flex items-start pt-0.5 pl-1">
         <span className={`${nameColor} text-[9px] font-bold mr-1 truncate`}>{playerName}</span>
         {isOnline && <span className="text-[#446644] text-[8px] font-mono tracking-tight">[ONLINE]</span>}
      </div>
      <div className="flex items-start justify-end pt-0.5">
         <span className="text-[#445566] text-[8px] uppercase tracking-wider">{race}</span>
      </div>
      <div className="flex items-start justify-end px-1 pt-0.5">
         <span className="text-[#556677] text-[8px]">L: {playerLevel}</span>
      </div>
      <div className="flex items-start justify-end pr-1 pt-0.5">
         <span 
            className="text-[#0088aa] group-hover:text-[#00ccff] text-[8px] hover:underline cursor-pointer"
            onClick={(e) => {
                e.stopPropagation();
                onExamine?.(data);
            }}
         >[Examine]</span>
      </div>
    </div>
  );
};

const ResourceRow: React.FC<{ name: string, amount: number }> = ({ name, amount }) => (
  <div className="flex justify-between items-center py-1 px-4 border-b border-[#223344]/30 last:border-none hover:bg-[#112233]/50 transition-colors">
    <div className="text-[#aaccff] text-[10px] font-bold w-[100px]">{name}:</div>
    <div className="text-white font-mono text-[10px] flex-1 text-right pr-4">{amount.toLocaleString()}</div>
    <div className="flex gap-2">
      <span className="text-[#00ccff] hover:text-white cursor-pointer text-[9px] font-bold">[Gather]</span>
      <span className="text-[#00ccff] hover:text-white cursor-pointer text-[9px] font-bold">[Gather All]</span>
    </div>
  </div>
);

// --- Redesigned PortTradeRow ---
const PortTradeRow: React.FC<{ resource: string, stock: number, price: number }> = ({ resource, stock, price }) => {
    let status = "BUYING";
    let action = "Sell";
    let statusColor = "text-green-500"; // Default Buying green
    
    // Simple logic to simulate port state
    if (stock > 26000) {
        status = "SELLING";
        action = "Buy";
        statusColor = "text-red-500"; // Selling red
    }

    const getGoodColor = (name: string) => {
        if (name === 'Food') return 'text-red-400';
        if (name === 'Fuel') return 'text-yellow-200';
        if (name === 'Ore') return 'text-yellow-400';
        if (name === 'Electronics') return 'text-green-400';
        if (name === 'Crystal') return 'text-cyan-400';
        if (name === 'Weapons') return 'text-red-600';
        if (name === 'Narcotics') return 'text-red-500';
        if (name === 'Precious Metals') return 'text-yellow-300';
        if (name === 'Chemicals') return 'text-green-600';
        if (name === 'Machinery') return 'text-gray-300';
        if (name === 'Slaves') return 'text-white';
        if (name === 'Luxury Items') return 'text-white';
        return 'text-[#aaccff]';
    };

    const goodColor = getGoodColor(resource);

    return (
        <div className="flex flex-col mb-4 px-1 border-b border-[#112233] md:border-none pb-2 md:pb-0">
            {/* Top Row: Icon, Name, Amount, Price */}
            <div className="flex justify-between items-baseline text-[10px] mb-1">
                 <div className="flex items-center gap-1.5">
                     <div className={`w-2 h-2 border ${goodColor} border-opacity-50 opacity-70`}></div>
                     <span className={`${goodColor} font-bold`}>{resource}</span>
                 </div>
                 <div className="flex gap-3 text-right font-mono text-[10px]">
                     <div className="text-white w-[50px]">{stock > 0 ? stock.toLocaleString() : '0'}</div>
                     <div className="text-[#00ccff] w-[40px]">{price.toLocaleString()}</div>
                 </div>
            </div>
            
            {/* Bottom Row: Status, Input, Button */}
            <div className="flex justify-between items-center h-[20px]">
                 <div className={`${statusColor} font-bold text-[10px] uppercase tracking-wide`}>
                     {status}
                 </div>
                 <div className="flex gap-1 items-center">
                     <input 
                        type="text" 
                        defaultValue="0" 
                        className="w-[60px] bg-[#001122] border border-[#004488] text-white text-right px-1 py-0.5 text-[10px] focus:border-[#00ccff] outline-none font-mono rounded-sm"
                     />
                     <button className="bg-[#002244] border border-[#004488] text-[#00ccff] hover:bg-[#003366] hover:text-white px-2 py-0.5 text-[10px] uppercase font-bold transition-colors min-w-[35px] rounded-sm shadow-sm">
                        {action}
                     </button>
                 </div>
            </div>
        </div>
    );
};

const generateStars = (n: number) => {
  let value = '';
  for (let i = 0; i < n; i++) {
    value += `${Math.random() * 100}vw ${Math.random() * 2000}px #FFF, `;
  }
  return value.slice(0, -2);
};

const getPortName = (sector: number) => `Port ${sector}`;

const getStationName = (sector: number) => {
     const names = [
        "Concentric Station", "Titan Prime", "Helios Alpha", "Prometheus Station",
        "Atlas Dock", "Hyperion Outpost", "Kronos Base", "Rhea Station"
    ];
    return names[sector % names.length];
};

// --- ENTITY COMPONENT ---
interface SectorEntityProps {
    name: string;
    sub?: string;
    align?: string | number;
    level?: string | number;
    onRaid?: () => void;
    onDock?: () => void;
}

const SectorEntity: React.FC<SectorEntityProps> = ({ name, sub, align = "0", level = "5", onRaid, onDock }) => (
    <div className="w-full max-w-[340px] bg-[#0b131e]/80 border border-[#223344] rounded-md shadow-lg backdrop-blur-sm group overflow-hidden flex flex-col mb-2 relative z-20 shrink-0">
        <div className="p-4 pb-3 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#00ccff] to-transparent opacity-40"></div>
            <h2 className="text-white font-bold text-[14px] tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)] mb-1">
                {name}
            </h2>
            {sub && (
                <h3 className="text-[#aaccff] text-[11px] tracking-wide mb-3 opacity-80">
                    {sub}
                </h3>
            )}
            
            <div className="flex justify-center gap-6 text-[10px] text-[#667788] mb-3 font-mono">
                <div>Alignment: <span className="text-[#8899aa]">{align}</span></div>
                <div>Level: <span className="text-[#8899aa]">{level}</span></div>
            </div>

            <div className="flex justify-center gap-4">
                <button 
                    onClick={onDock}
                    className="text-white font-bold text-[11px] tracking-wider hover:text-[#00ccff] hover:shadow-[0_0_10px_rgba(0,204,255,0.5)] transition-all uppercase"
                >
                    [DOCK]
                </button>
                <button 
                    onClick={onRaid}
                    className="text-red-400 font-bold text-[11px] tracking-wider hover:text-red-200 hover:shadow-[0_0_10px_rgba(255,0,0,0.5)] transition-all uppercase"
                >
                    [RAID]
                </button>
            </div>
        </div>
    </div>
);

// --- Redesigned PortEntity (Commerce) ---
const PortEntity: React.FC<{ name: string, sub?: string, children: React.ReactNode, onUndock?: () => void }> = ({ name, sub, children, onUndock }) => (
    <div className="w-full bg-[#050a10] border border-[#004488] flex flex-col mb-4 relative z-10 shrink-0 font-verdana shadow-lg">
        
        {/* Top Header Section (Port Name + Nav) */}
        <div className="p-3 border-b border-[#004488] bg-gradient-to-r from-[#001122] to-[#000000] flex flex-col gap-1">
             <div className="text-white font-bold text-[16px] tracking-wide">
                 {name}
             </div>
             <div className="text-[#667788] text-[10px] mb-2">
                 {sub}
             </div>
             
             {/* Messages Section Placeholder */}
             <div className="text-center py-2">
                 <span className="text-[#00ccff] font-bold underline text-[11px] cursor-pointer hover:text-white">Messages:</span>
             </div>

             {/* Navigation Tabs (Simulated) */}
             <div className="flex justify-center gap-2 mt-2">
                 <div className="px-6 py-1 border border-[#00ccff] text-[#00ccff] bg-[#002244] font-bold text-[11px] shadow-[0_0_5px_rgba(0,204,255,0.3)] cursor-default">
                     Port Goods
                 </div>
                 {onUndock && (
                     <button 
                        onClick={onUndock}
                        className="px-6 py-1 border border-[#004488] text-[#667788] hover:text-[#00ccff] hover:border-[#00ccff] hover:bg-[#001122] text-[11px] transition-all"
                     >
                         Leave Port
                     </button>
                 )}
             </div>
        </div>
        
        {/* Inner Content Area */}
        <div className="p-2 bg-black/80">
            <div className="text-[#00ccff] font-bold text-[12px] mb-2 pl-1 border-b border-[#002244] pb-1">
                Port Goods:
            </div>

            {/* Column Headers */}
            <div className="hidden md:grid grid-cols-2 gap-x-8 mb-2 text-[10px] text-[#445566] font-normal px-1">
                 <div className="flex justify-between items-center">
                     <span>Name / Status</span>
                     <div className="flex gap-3 text-right">
                         <span className="w-[50px]">Amount</span>
                         <span className="w-[40px]">Price</span>
                     </div>
                 </div>
                 <div className="flex justify-between items-center">
                     <span>Name / Status</span>
                     <div className="flex gap-3 text-right">
                         <span className="w-[50px]">Amount</span>
                         <span className="w-[40px]">Price</span>
                     </div>
                 </div>
            </div>

            {/* Goods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 px-1 pb-2">
                {children}
            </div>
        </div>
    </div>
);

// --- STATION INNER ENTITY (Services) ---
interface StationInnerEntityProps {
    name: string;
    onUndock?: () => void;
}

const StationInnerEntity: React.FC<StationInnerEntityProps> = ({ name, onUndock }) => {
    const [activeTab, setActiveTab] = useState('Ships');
    const tabs = ['Ships', 'Upgrades', 'Weapons', 'Drones', 'Equipment', 'Items'];

    const getList = () => {
        switch(activeTab) {
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

// --- PLANET INNER ENTITY ---
interface PlanetInnerEntityProps {
    planet: any;
    messages: { public: string, internal: string };
    onUndock: () => void;
    onUpdateMessages: (p: string, i: string) => void;
}

const PlanetInnerEntity: React.FC<PlanetInnerEntityProps> = ({ planet, messages, onUndock, onUpdateMessages }) => {
    const [activeTab, setActiveTab] = useState('Surface');
    const [editPublic, setEditPublic] = useState(messages.public);
    const [editInternal, setEditInternal] = useState(messages.internal);

    const tabs = ['Surface', 'Defenses', 'Production', 'Options', 'Take Off'];

    const handleSave = () => {
        onUpdateMessages(editPublic, editInternal);
        setActiveTab('Surface');
    };

    const handleTabClick = (tab: string) => {
        if (tab === 'Take Off') {
            onUndock();
        } else {
            setActiveTab(tab);
        }
    };

    return (
        <div className="w-full bg-[#0a111a] border border-[#223344] rounded-t-sm shadow-lg mb-4 relative z-10 shrink-0 overflow-hidden animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#001122] via-[#002233] to-[#000000] border-b border-[#223344] py-2 px-4">
                <div className="text-white font-bold text-[16px] tracking-wide">Planet Surface ({planet.sector || '11199'})</div>
                <div className="text-[#667788] text-[10px]">Sector {planet.sector || '11199'} - Deep Space - Normal</div>
            </div>

            {/* Messages Notification */}
            <div className="text-center py-1 bg-black border-b border-[#112233]">
                <span className="text-[#00ccff] text-[11px] underline font-bold cursor-pointer hover:text-white">Messages:</span>
            </div>

            {/* Tabs */}
            <div className="flex justify-center bg-[#111111] border-b border-[#223344]">
                {tabs.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`
                            px-4 py-1 text-[11px] font-bold border-r border-[#223344] last:border-r-0 transition-colors
                            ${activeTab === tab 
                                ? 'bg-[#223344] text-white' 
                                : 'text-[#888888] hover:text-[#cccccc] hover:bg-[#1a1a1a]'
                            }
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-4 bg-[#050a10]">
                
                {activeTab === 'Surface' && (
                    <div className="flex flex-col items-center text-center space-y-6">
                        
                        <div className="bg-[#0b131e]/50 border border-[#223344] p-4 w-full max-w-[500px] rounded-sm shadow-inner">
                            <div className="text-white font-bold text-[14px] mb-2">{planet.name} ({planet.sector || '11199'})</div>
                            <div className="flex flex-col gap-1 text-[11px] font-mono text-[#cccccc]">
                                <div>Rating: <span className="text-white font-bold">{planet.rating}</span></div>
                                <div>Population: <span className="text-green-400">{planet.population}</span></div>
                                <div>Alignment: <span className="text-red-400">{planet.alignment}</span></div>
                            </div>
                        </div>

                        <div className="w-full max-w-[500px] space-y-4">
                            <div className="bg-[#0b131e] border border-[#223344] p-3 shadow-md">
                                <div className="text-white font-bold text-[12px] mb-2 border-b border-[#223344] pb-1 inline-block">Planet Message</div>
                                <div className="text-[#8899aa] text-[11px] whitespace-pre-wrap leading-relaxed">{messages.public}</div>
                            </div>

                            <div className="bg-[#0b131e] border border-[#223344] p-3 shadow-md">
                                <div className="text-white font-bold text-[12px] mb-2 border-b border-[#223344] pb-1 inline-block">Planet Internal Message</div>
                                <div className="text-[#8899aa] text-[11px] whitespace-pre-wrap leading-relaxed">{messages.internal}</div>
                            </div>
                        </div>

                        <div className="text-[10px] text-[#445566]">
                            <div>60 Goods Exporters</div>
                            <div>300 Drone Hangers</div>
                            <div className="mt-2 text-[#00ccff] italic">Good luck ^_^</div>
                        </div>
                    </div>
                )}

                {activeTab === 'Options' && (
                    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto">
                        <div className="w-full mb-4">
                            <label className="block text-[#00ccff] text-[10px] font-bold mb-1">Planet Message</label>
                            <textarea 
                                value={editPublic}
                                onChange={(e) => setEditPublic(e.target.value)}
                                className="w-full h-[100px] bg-[#000000] border border-[#334455] text-[#cccccc] p-2 text-[11px] outline-none focus:border-[#00ccff]"
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label className="block text-[#00ccff] text-[10px] font-bold mb-1">Planet Internal Message</label>
                            <textarea 
                                value={editInternal}
                                onChange={(e) => setEditInternal(e.target.value)}
                                className="w-full h-[100px] bg-[#000000] border border-[#334455] text-[#cccccc] p-2 text-[11px] outline-none focus:border-[#00ccff]"
                            />
                        </div>
                        <button 
                            onClick={handleSave}
                            className="bg-[#003366] border border-[#0055aa] text-white px-6 py-1.5 text-[11px] font-bold uppercase hover:bg-[#004488] transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                )}

                {(activeTab === 'Defenses' || activeTab === 'Production') && (
                    <div className="text-center py-12 text-[#445566] italic">
                        Scanning structural integrity... Systems online. <br/>
                        (Feature unavailable in this simulation view)
                    </div>
                )}

            </div>
        </div>
    );
};

// ... PlanetEntity, SectorView, SystemMapView, GalaxyMapView ...
// (Rest of the file follows, need to ensure I don't cut off PlanetEntity or others)

interface PlanetEntityProps {
  name: string;
  ownerName: string;
  allianceName?: string;
  rating: string;
  population: string;
  alignment: string;
  relationship?: string;
  onAttack?: () => void;
  onLand?: () => void;
}

const PlanetEntity: React.FC<PlanetEntityProps> = ({ 
  name, ownerName, allianceName, rating, population, alignment, relationship, onAttack, onLand
}) => {
    const isWar = relationship?.toLowerCase().includes('war');
    const isAlly = relationship?.toLowerCase().includes('allied') || relationship?.toLowerCase().includes('peace');
    
    const relColor = isWar ? "text-red-600" : (isAlly ? "text-green-500" : "text-yellow-500");

    return (
        <div className="w-full max-w-[400px] bg-[#0b131e]/90 border border-[#223344] rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-sm flex flex-col mb-4 relative z-20 shrink-0 overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#004488]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#004488]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#004488]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#004488]"></div>

            <div className="py-2 text-center bg-gradient-to-r from-[#000000] via-[#112233] to-[#000000] border-b border-[#223344] relative">
                 <div className="text-white font-bold text-[18px] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{name}</div>
            </div>
            
            <div className="p-4 text-center flex flex-col items-center gap-1.5">
                <div className="text-[#8899aa] text-[11px]">
                    Owned by: <span className="text-white font-bold tracking-wide">{ownerName}</span>
                </div>
                {allianceName && (
                    <div className="text-[#eccc66] text-[10px] tracking-wide mb-1 font-bold">
                        {allianceName}
                    </div>
                )}
                
                <div className="w-2/3 h-[1px] bg-[#223344] my-1"></div>

                <div className="text-[#eccc66] font-bold text-[12px] tracking-wider">
                    Rating: <span className="text-white">{rating}</span>
                </div>
                
                <div className="text-[#66cc66] text-[11px]">
                    Population: <span className="text-white font-mono">{population}</span>
                </div>
                
                <div className="text-[#8899aa] text-[11px]">
                    Alignment: <span className="text-white">{alignment}</span>
                </div>

                {relationship && (
                     <div className="mt-2 flex flex-col items-center">
                        <div className="text-[#667788] text-[9px] uppercase tracking-widest mb-0.5">Alliance Relationship</div>
                        <div className={`font-bold text-[14px] uppercase tracking-wide ${relColor} drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]`}>
                            {relationship}
                        </div>
                     </div>
                )}
            </div>
            
            <div className="flex justify-center items-center gap-6 bg-[#000000]/60 p-3 border-t border-[#223344]">
                <button 
                    onClick={onLand}
                    className="text-[#cccccc] hover:text-white font-bold text-[14px] uppercase tracking-widest hover:text-shadow-[0_0_8px_white] transition-all"
                >
                    [LAND]
                </button>
                <button 
                    onClick={onAttack}
                    className="text-[#ff4444] hover:text-[#ff8888] font-bold text-[14px] uppercase tracking-widest hover:text-shadow-[0_0_8px_red] transition-all"
                >
                    [ATTACK]
                </button>
            </div>
       </div>
    );
};

const SectorView: React.FC<{ currentSector: string, onExamine?: (ship: ShipData) => void, onTriggerAction: (type: 'attack' | 'raid', target: any) => void }> = ({ currentSector, onExamine, onTriggerAction }) => {
    const [dockedLocation, setDockedLocation] = useState<'station' | 'port' | 'planet' | null>(null);
    const [planetMessages, setPlanetMessages] = useState({
        public: "Phoenix Property.\nClosed for: Non-Related to Phoenix and Production-buildings.",
        internal: "Words of cheesy wisdom:\nThe planet is now adequately sheilded. Please continue on with this list only if you have turns to spare. GNU appears to want us to get #1 slot this round..."
    });

    const baseSector = parseInt(currentSector) || 11199;
    const isDocked = dockedLocation !== null;
    
    const smallStars = useMemo(() => generateStars(400), []);
    const mediumStars = useMemo(() => generateStars(100), []);
    const bigStars = useMemo(() => generateStars(50), []);

    useEffect(() => {
        setDockedLocation(null);
    }, [currentSector]);

    const currentShips = useMemo(() => {
        return MOCK_SHIPS.filter(ship => {
            if (dockedLocation === 'station') return ship.location === 'station';
            if (dockedLocation === 'port') return ship.location === 'port';
            if (dockedLocation === 'planet') return ship.location === 'planet';
            return ship.location === 'sector';
        });
    }, [dockedLocation]);

    const planetData = {
        name: "Yuuzhan'tar",
        ownerName: "(0-0)",
        allianceName: "(Cartel-Hidden Force)",
        rating: "4145 / 2173",
        population: "5,920,349",
        alignment: "+202",
        relationship: "War Declared",
        sector: currentSector
    };

    const stationData = {
        name: getStationName(baseSector),
        sub: `Federation Outpost`,
        align: "0",
        level: "5"
    };

    const portData = {
        name: `${getPortName(baseSector)} (${baseSector})`,
        sub: `Sector ${currentSector} - Asteroid Cluster - Gravity Well`,
        align: "0",
        level: "5"
    };

    let shipListHeader = "Other Ships in this Sector";
    if (dockedLocation === 'station') shipListHeader = "Other Ships at this Station";
    if (dockedLocation === 'port') shipListHeader = "Other Ships at this Port";
    if (dockedLocation === 'planet') shipListHeader = "Other Ships at this Planet";

    return (
        <div className="flex flex-col h-full relative min-h-0">
            
            <div className="shrink-0 z-20 w-full bg-[#020408] border-b-2 border-[#004488] shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex flex-col min-h-[60px] h-auto">
                
                <div className="flex flex-wrap items-stretch bg-gradient-to-b from-[#0a1525] to-[#020408] relative min-h-[60px]">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ccff] to-transparent opacity-30"></div>

                    <div className="basis-[100px] grow-0 shrink-0 flex items-center justify-center border-r border-[#112233] bg-[#050a10]/50 relative overflow-hidden group min-h-[60px] px-2">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00ccff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#00ccff]">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            
                            <div className="flex flex-col items-start leading-none">
                                <div className="text-white font-bold text-[12px] leading-none mb-0.5">100%</div>
                                <div className="text-[#335577] text-[7px] uppercase tracking-wider">VISIBILITY</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-[150px] flex flex-col items-center justify-center px-2 py-1 relative border-r border-[#112233]">
                        <div className="text-[#00ccff] text-[8px] uppercase tracking-[0.4em] font-bold mb-1 opacity-80 text-center">Current Sector</div>
                        <div className="text-white font-mono text-[20px] font-bold leading-none drop-shadow-[0_0_8px_rgba(0,200,255,0.5)] tracking-widest text-center">
                            {currentSector}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 text-[9px] mt-1 text-[#667788] font-mono">
                            <span className="text-[#0088aa]">Deep Space</span>
                            <span>/</span>
                            <span>Normal</span>
                        </div>
                    </div>

                    <div className="basis-[110px] grow-0 shrink-0 flex flex-col justify-center bg-[#050a10]/50 p-2 relative overflow-hidden min-h-[60px]">
                        <div className="text-[7px] text-[#445566] uppercase tracking-[0.2em] text-center mb-1 font-bold">AURAS</div>
                        <div className="flex gap-1 justify-center flex-wrap">
                             {[
                                { color: 'text-red-400 border-red-500 bg-red-950', icon: 'M12 2L2 22h20L12 2z' }, 
                                { color: 'text-orange-400 border-orange-500 bg-orange-950', icon: 'M3 3h18v18H3z' }, 
                                { color: 'text-green-400 border-green-500 bg-green-950', icon: 'M12 2L2 7l10 5 10-5-10-5z' }, 
                                { color: 'text-yellow-400 border-yellow-500 bg-yellow-950', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' }, 
                                { color: 'text-purple-400 border-purple-500 bg-purple-950', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z' } 
                            ].map((aura, i) => (
                                <div key={i} className={`w-4 h-4 rounded-[2px] border ${aura.color} flex items-center justify-center shadow-[0_0_5px_rgba(0,0,0,0.5)]`}>
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2">
                                        <path d={aura.icon} />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-retro pb-20 relative z-10 p-2 flex flex-col items-center bg-transparent min-h-0 min-w-0">
                <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none select-none ${isDocked ? 'bg-black' : ''}`}>
                    <div className="star-layer" style={{ '--shadows': smallStars, animationDuration: '120s' } as React.CSSProperties} />
                    <div className="star-layer" style={{ '--shadows': mediumStars, animationDuration: '180s', width: '2px', height: '2px' } as React.CSSProperties} />
                    <div className="star-layer" style={{ '--shadows': bigStars, animationDuration: '240s', width: '3px', height: '3px' } as React.CSSProperties} />
                    
                    {!isDocked && (
                        <>
                            <style>{`
                                @keyframes drift { 0% { transform: translate(0,0); } 50% { transform: translate(20px, 10px); } 100% { transform: translate(0,0); } }
                                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
                                @keyframes pulse-glow { 0% { opacity: 0.3; } 50% { opacity: 0.5; } 100% { opacity: 0.3; } }
                            `}</style>
                            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] mix-blend-screen animate-[drift_30s_infinite_ease-in-out]" />
                            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[80px] mix-blend-screen animate-[drift_45s_infinite_ease-in-out_reverse]" />
                            <div className="absolute top-[15%] right-[10%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-gray-300 via-gray-500 to-black opacity-90 shadow-[0_0_50px_rgba(255,255,255,0.1)] animate-[float_20s_infinite_ease-in-out]">
                                <div className="absolute top-[50%] left-[-20%] w-[140%] h-[20px] bg-gray-400/20 rotate-[-20deg] blur-sm rounded-full border-t border-white/10"></div>
                            </div>
                            <div className="absolute bottom-[20%] left-[15%] w-[80px] h-[80px] rounded-full bg-gradient-to-tr from-red-900 to-red-500 opacity-80 shadow-[0_0_30px_rgba(255,50,50,0.2)] animate-[float_25s_infinite_ease-in-out_reverse]"></div>
                        </>
                    )}
                </div>

                <div className={`w-full ${isDocked ? 'max-w-[700px]' : 'max-w-[600px]'} space-y-4 flex flex-col items-center z-10 min-w-0 transition-[max-width] duration-300`}>

                    <div className="w-full bg-[#001122] border border-[#003355] py-1.5 flex justify-center items-center relative overflow-hidden rounded-sm shadow-md shrink-0">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#004488]"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#004488]"></div>
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000000_10px,#000000_20px)] opacity-20 pointer-events-none"></div>
                        
                        <span className="text-[#eccc66] font-bold text-[10px] tracking-wide relative z-10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#eccc66] animate-pulse"></span>
                            Level 0 (2250ms Examine || 1250ms Attack)
                        </span>
                    </div>

                    {!isDocked && (
                        <div className="flex justify-center w-full mt-2">
                            <div className="relative bg-[#0d1520]/80 border border-[#334455] p-1 flex shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-sm backdrop-blur-md min-w-[320px]">
                                <div className="w-[100px] h-[100px] bg-black border border-[#223344] relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
                                </div>
                                
                                <div className="flex-1 pl-3 pr-2 flex">
                                    <div className="flex flex-col justify-center mr-4 min-w-[100px]">
                                        <div className="text-[#667788] font-bold text-[10px] mb-0.5">Sector</div>
                                        <div className="text-white font-bold text-[24px] leading-none mb-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] font-mono">{currentSector}</div>
                                        <div className="text-[#00ccff] text-[9px] leading-tight">Deep Space</div>
                                        <div className="text-[#445566] text-[9px] leading-tight">Normal</div>
                                        <div className="text-[#667788] text-[9px] mt-1.5">100% Visibility</div>
                                    </div>

                                    <div className="flex flex-col justify-center items-center gap-0.5 font-mono text-[10px] flex-1">
                                        <div className="text-[#445566] hover:text-[#00ccff] cursor-pointer mb-0.5">[{baseSector - 15}]</div>
                                        <div className="text-[#223344] h-2 w-[1px] bg-[#223344]"></div>
                                        
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[#445566] hover:text-[#00ccff] cursor-pointer">[{baseSector - 1}]</span>
                                            <span className="text-[#223344]">-</span>
                                            <span className="text-white font-bold drop-shadow-[0_0_5px_rgba(0,200,255,0.5)] bg-[#004488] px-1 rounded-sm">[{currentSector}]</span>
                                            <span className="text-[#223344]">-</span>
                                            <span className="text-[#445566] hover:text-[#00ccff] cursor-pointer">[{baseSector + 1}]</span>
                                        </div>

                                        <div className="text-[#223344] h-2 w-[1px] bg-[#223344]"></div>
                                        <div className="text-[#445566] hover:text-[#00ccff] cursor-pointer mt-0.5">[{baseSector + 15}]</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isDocked && (
                        <PlanetEntity 
                            {...planetData}
                            onAttack={() => onTriggerAction('attack', planetData)}
                            onLand={() => setDockedLocation('planet')}
                        />
                    )}

                    {!isDocked && (
                        <SectorEntity 
                            {...stationData}
                            onRaid={() => onTriggerAction('raid', stationData)}
                            onDock={() => setDockedLocation('station')}
                        />
                    )}

                    {!isDocked && (
                        <SectorEntity 
                            {...portData}
                            onRaid={() => onTriggerAction('raid', portData)}
                            onDock={() => setDockedLocation('port')}
                        />
                    )}

                    {dockedLocation === 'station' && (
                        <StationInnerEntity 
                            name={stationData.name} 
                            onUndock={() => setDockedLocation(null)} 
                        />
                    )}
                    
                    {dockedLocation === 'port' && (
                        <PortEntity 
                            name={portData.name}
                            sub={portData.sub}
                            onUndock={() => setDockedLocation(null)}
                        >
                            {GOODS.map((good, idx) => {
                                const mockStock = Math.floor(Math.random() * 50000);
                                let price = good.value;
                                if (mockStock < 24000) price = Math.floor(good.value * 1.2);
                                else if (mockStock > 26000) price = Math.floor(good.value * 0.8);
                                else price = good.value;

                                return (
                                    <PortTradeRow 
                                        key={good.name}
                                        resource={good.name} 
                                        stock={mockStock} 
                                        price={price} 
                                    />
                                );
                            })}
                        </PortEntity>
                    )}

                    {dockedLocation === 'planet' && (
                        <PlanetInnerEntity 
                            planet={planetData}
                            messages={planetMessages}
                            onUndock={() => setDockedLocation(null)}
                            onUpdateMessages={(pub, int) => setPlanetMessages({ public: pub, internal: int })}
                        />
                    )}

                    <div className="flex flex-col w-full min-w-[500px] overflow-x-auto mt-4">
                        <div className="bg-[#0d1520] border border-[#223344] border-b-0 py-1 text-center">
                            <span className="text-white font-bold text-[11px] uppercase tracking-wider shadow-black drop-shadow-md">
                                {shipListHeader}
                            </span>
                        </div>

                        <div className="bg-gradient-to-r from-[#001133]/90 via-[#002244]/90 to-[#000011]/90 border border-[#003366] border-b-0 px-1 py-1 h-[24px] backdrop-blur-sm shadow-md grid grid-cols-[50px_150px_1fr_70px_30px_60px] gap-x-1 items-center text-[#667788] text-[8px] uppercase tracking-wider">
                            <div className="text-center"></div>
                            <div className="text-left pl-1"></div>
                            <div className="text-left pl-1">Name</div>
                            <div className="text-right">Class/Race</div>
                            <div className="text-right px-1">Lvl</div>
                            <div className="text-right pr-1">Rating</div>
                        </div>

                        <div className="border border-[#003366] bg-black/50 shadow-lg rounded-b-sm overflow-hidden flex flex-col backdrop-blur-sm">
                            {currentShips.length > 0 ? (
                                currentShips.map(ship => (
                                    <StandardPlayerRow key={ship.id} data={ship} onExamine={onExamine} />
                                ))
                            ) : (
                                <div className="p-4 text-center text-[#445566] italic text-[10px]">
                                    No other ships detected in this area.
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {!isDocked && (
                        <div className="w-full bg-gradient-to-b from-[#112233] to-[#080c14] border border-[#334455] rounded-sm shadow-lg overflow-hidden mt-2 opacity-90 hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <div className="bg-[#1a2a3a] border-b border-[#334455] py-1 text-center text-[#ffffff] font-bold text-[11px] tracking-wide uppercase shadow-sm">
                                Sector Resources
                            </div>
                            <div className="flex flex-col">
                                <ResourceRow name="Machinery" amount={10390} />
                                <ResourceRow name="Electronics" amount={5255} />
                                <ResourceRow name="Ore" amount={2300} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const SystemMapView: React.FC<{ currentSector: string; onNavigateToSector?: (sector: string) => void }> = ({ currentSector, onNavigateToSector }) => {
    const baseSector = Math.floor(parseInt(currentSector) / 100) * 100;
    
    const grid = useMemo(() => Array.from({ length: 100 }, (_, i) => {
        const sectorNum = baseSector + i + 1;
        return {
            sector: sectorNum,
            hasPort: Math.random() > 0.8,
            hasPlanet: Math.random() > 0.95,
            isCurrent: sectorNum === parseInt(currentSector)
        };
    }), [baseSector, currentSector]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-y-auto">
            <h2 className="text-[#00ccff] font-bold text-[16px] mb-4 tracking-widest uppercase border-b border-[#004488] pb-2 w-full text-center">System Map</h2>
            <div className="grid grid-cols-10 gap-1 w-full max-w-[600px]">
                {grid.map((cell) => (
                    <div 
                        key={cell.sector}
                        onClick={() => onNavigateToSector?.(cell.sector.toString())}
                        className={`
                            aspect-square border text-[9px] flex flex-col items-center justify-center cursor-pointer transition-all
                            ${cell.isCurrent 
                                ? 'bg-[#004488] border-white text-white scale-110 z-10 shadow-[0_0_10px_white]' 
                                : 'bg-[#001122] border-[#223344] text-[#445566] hover:bg-[#002244] hover:text-[#00ccff] hover:border-[#00ccff]'
                            }
                        `}
                    >
                        <span className="font-mono">{cell.sector}</span>
                        <div className="flex gap-0.5 mt-0.5">
                            {cell.hasPort && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>}
                            {cell.hasPlanet && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GalaxyMapView: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center">
             <div className="w-[200px] h-[200px] border-2 border-[#003366] rounded-full flex items-center justify-center relative bg-black shadow-[0_0_50px_rgba(0,50,100,0.2)]">
                 <div className="absolute inset-0 rounded-full border border-[#112233] animate-[spin_60s_linear_infinite] opacity-30" style={{ borderStyle: 'dashed' }}></div>
                 <div className="absolute inset-4 rounded-full border border-[#112233] animate-[spin_40s_linear_infinite_reverse] opacity-30" style={{ borderStyle: 'dotted' }}></div>
                 <span className="text-[#00ccff] font-bold animate-pulse">GALAXY MAP</span>
             </div>
             <p className="mt-4 text-[#667788] text-[10px]">Long range sensors scanning...</p>
        </div>
    );
};

interface CenterPanelProps {
  view: ViewType;
  currentSector: string;
  onSystemSelect?: (sector: string) => void;
  onNavigate?: (view: string) => void;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({ view, currentSector, onSystemSelect, onNavigate }) => {
  const [examineTarget, setExamineTarget] = useState<ShipData | null>(null);
  const [actionTarget, setActionTarget] = useState<{ type: 'attack' | 'raid', data: any } | null>(null);

  const handleTriggerAction = (type: 'attack' | 'raid', target: any) => {
      setActionTarget({ type, data: target });
  };

  return (
    <div className="w-full h-full relative flex flex-col">
        {view === 'sector' && (
            <SectorView 
                currentSector={currentSector} 
                onExamine={setExamineTarget}
                onTriggerAction={handleTriggerAction}
            />
        )}
        {view === 'system' && <SystemMapView currentSector={currentSector} onNavigateToSector={onSystemSelect} />}
        {view === 'galaxy' && <GalaxyMapView />}
        {view === 'alliance' && <AllianceView onNavigate={onNavigate} />}

        {examineTarget && (
            <ExamineModal 
                ship={examineTarget} 
                onClose={() => setExamineTarget(null)} 
                onAttack={() => {
                    setExamineTarget(null);
                    handleTriggerAction('attack', examineTarget);
                }}
            />
        )}

        {actionTarget && (
            <ActionModal 
                type={actionTarget.type} 
                target={actionTarget.data} 
                onClose={() => setActionTarget(null)} 
            />
        )}
    </div>
  );
};
