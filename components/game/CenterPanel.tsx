
import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { ViewType } from './GameLayout';
import {
    GOODS, SHIPS, WEAPONS, DRONES, UPGRADES, EQUIPMENT, ITEMS
} from '../../data/helpData';
import { AllianceView } from './AllianceView';
import { SystemMap } from './SystemMap';
import { SectorView } from './SectorView';
import { GalaxyMap } from './GalaxyMap';
import { GenericView } from './GenericView';
import { HelpView } from './HelpView';
import { RankingsView } from './RankingsView';
import { ForcesView } from './ForcesView';
import { PlanetsView } from './PlanetsView';
import { WebBoardView } from './WebBoardView';
import { StatsView } from './StatsView';
import { BountiesView } from './BountiesView';
import { OnlinePlayersView } from './OnlinePlayersView';
import { NewsView } from './NewsView';
import { NoticesView } from './NoticesView';
import { ShipData } from './types';
import { CombatView } from './CombatView';

// --- Helper Components ---



// ... (Other Modals ActionModal, ExamineModal, StandardPlayerRow, ResourceRow remain unchanged) ...

// --- Action Modal (Attack/Raid) ---
interface ActionModalProps {
    type: 'attack' | 'raid';
    target: any;
    onClose: () => void;
    onConfirm?: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ type, target, onClose, onConfirm }) => {
    const isRaid = type === 'raid';
    const isPlanet = !!target.population;

    let title = "Engage Enemy";
    if (isRaid) title = "Tactical Raid";
    else if (isPlanet) title = "ENGAGE PLANET";

    let actionLabel = "ATTACK SHIP";
    if (isRaid) actionLabel = "BEGIN RAID";
    else if (isPlanet) actionLabel = "ATTACK PLANET";

    // Derived display data
    const name = target.name || target.shipName || "Unknown Target";
    const sub = target.sub || target.playerName || (target.ownerName ? `Owner: ${target.ownerName}` : "Sector Entity");
    const alliance = target.guild || target.allianceName || (isRaid ? "Neutral Target" : "Independent");
    const level = target.level || target.shipLevel || "Unknown";

    const bannerSeed = name.replace(/\s/g, '');
    const allianceTagUrl = `https://picsum.photos/seed/${alliance}/50/20`;

    // Use a different image source or seed for planets to distinguish them
    const targetBannerUrl = isPlanet
        ? `https://picsum.photos/seed/${bannerSeed}_planet/150/20`
        : `https://picsum.photos/seed/${bannerSeed}/150/20`;

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
                            <button
                                onClick={onConfirm}
                                className="px-6 py-1.5 bg-[#550000] border border-[#ff0000] text-white hover:bg-[#880000] hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] text-[11px] font-bold uppercase tracking-widest transition-all"
                            >
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






interface CenterPanelProps {
    view: ViewType;
    currentSector: string;
    onSystemSelect?: (sector: string) => void;
    onNavigate?: (view: string) => void;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({ view, currentSector, onSystemSelect, onNavigate }) => {
    const [examineTarget, setExamineTarget] = useState<ShipData | null>(null);
    const [actionTarget, setActionTarget] = useState<{ type: 'attack' | 'raid', data: any } | null>(null);
    const [combatTarget, setCombatTarget] = useState<any | null>(null);
    const [helpTopic, setHelpTopic] = useState<string | undefined>(undefined);

    const handleTriggerAction = (type: 'attack' | 'raid', target: any) => {
        // Only skip the "Engage Enemy" screen (ActionModal) for player ships
        const isShip = target.shipName || target.playerName;

        if (type === 'attack' && isShip) {
            setCombatTarget(target);
        } else {
            setActionTarget({ type, data: target });
        }
    };

    const handleOpenHelp = (topic: string) => {
        setHelpTopic(topic);
        onNavigate?.('help');
    };

    return (
        <div className="w-full h-full relative flex flex-col">
            {view === 'sector' && (
                <SectorView
                    currentSector={currentSector}
                    onExamine={setExamineTarget}
                    onTriggerAction={handleTriggerAction}
                    onOpenHelp={handleOpenHelp}
                />
            )}
            {view === 'system' && <SystemMap currentSector={currentSector} onNavigateToSector={onSystemSelect} />}
            {view === 'galaxy' && <GalaxyMap />}
            {view === 'alliance' && <AllianceView onNavigate={onNavigate} />}
            {view === 'alliance_list' && <AllianceView onNavigate={onNavigate} initialTab="list" />}
            {view === 'news' && <NewsView />}
            {view === 'notices' && <NoticesView />}
            {view === 'online' && <OnlinePlayersView />}
            {view === 'stats' && <StatsView />}
            {view === 'bounties' && <BountiesView />}
            {view === 'rankings' && <RankingsView />}
            {view === 'forces' && <ForcesView />}
            {view === 'planets' && <PlanetsView />}
            {view === 'webboard' && <WebBoardView />}
            {view === 'help' && <HelpView onClose={() => onNavigate?.('sector')} initialTopic={helpTopic} />}

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
                    onConfirm={() => {
                        setActionTarget(null);
                        setCombatTarget(actionTarget.data);
                    }}
                />
            )}

            {combatTarget && (
                <CombatView
                    target={combatTarget}
                    onClose={() => setCombatTarget(null)}
                />
            )}
        </div>
    );
};
