import React, { useState, useMemo, useEffect } from 'react';
import { ShipData } from './types';
import { MOCK_SHIPS } from '../../data/mockData';
import { GOODS } from '../../data/helpData';
import { useGame } from '../../src/context/GameContext';

// Modular Components
import { SectorHeader } from './sector/SectorHeader';
import { SectorNavigation } from './sector/SectorNavigation';
import { SectorEntity } from './sector/SectorEntity';
import { PlanetDisplay } from './sector/PlanetDisplay';
import { ForcesDisplay } from './sector/ForcesDisplay';
import { SectorResources } from './sector/SectorResources';
import { ShipList } from './sector/ShipList';

// Internal Views
import { PlanetInternal } from './sector/internal/PlanetInternal';
import { StationInternal } from './sector/internal/StationInternal';
import { PortInternal, PortTradeRow } from './sector/internal/PortInternal';

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

export const SectorView: React.FC<{ currentSector: string, onExamine?: (ship: ShipData) => void, onTriggerAction: (type: 'attack' | 'raid', target: any) => void, onOpenHelp?: (topic: string) => void }> = ({ currentSector, onExamine, onTriggerAction, onOpenHelp }) => {
    const { player, gameState, systems, currentSectorData, message } = useGame();
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
        if (!currentSectorData?.pilots) return [];

        return currentSectorData.pilots
            .filter((pilot: any) => pilot.username !== player.username) // Don't show self
            .map((pilot: any) => ({
                id: pilot.id,
                playerName: pilot.username,
                shipName: "Unknown Ship",
                race: "Human", // Default
                shipClass: "Scout", // Default
                shipLevel: parseInt(pilot.pilot_level),
                playerLevel: parseInt(pilot.pilot_level),
                rating: "0",
                isOnline: true,
                location: 'sector'
            }));
    }, [currentSectorData, player.username]);

    const sectorType = currentSectorData?.sector_type;

    // Determine if the current sector is a station, port, or planet based on type
    const isStation = sectorType === 'Station';
    const isPort = sectorType === 'Port';
    const isPlanet = sectorType === 'Planet';
    // const isWormhole = sectorType === 'Wormhole'; // Not used yet

    const planetData = {
        name: `Planet ${baseSector}`,
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

            <SectorHeader currentSector={currentSector} />

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

                <div className={`w-full ${isDocked ? 'max-w-[1000px]' : 'max-w-[600px]'} space-y-4 flex flex-col items-center z-10 min-w-0 transition-[max-width] duration-300`}>

                    {/* Notification Banner - Only visible if there is a message */}
                    {message && (
                        <div className="w-full bg-[#001122] border border-[#003355] py-1.5 flex justify-center items-center relative overflow-hidden rounded-sm shadow-md shrink-0 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#004488]"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#004488]"></div>

                            {/* Background Stripes */}
                            <div className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #004488 10px, #004488 20px)'
                                }}
                            ></div>

                            <div className="relative z-10 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ccaa00] animate-pulse shadow-[0_0_5px_#ccaa00]"></div>
                                <span className="text-[#ffcc00] font-bold text-[12px] tracking-wide text-shadow-sm">
                                    {message}
                                </span>
                            </div>
                        </div>
                    )}

                    {!isDocked && (
                        <SectorNavigation currentSector={currentSector} />
                    )}

                    {!isDocked && isPlanet && (
                        <PlanetDisplay
                            {...planetData}
                            onAttack={() => onTriggerAction('attack', planetData)}
                            onLand={() => setDockedLocation('planet')}
                        />
                    )}

                    {!isDocked && isStation && (
                        <SectorEntity
                            {...stationData}
                            onRaid={() => onTriggerAction('raid', stationData)}
                            onDock={() => setDockedLocation('station')}
                        />
                    )}

                    {!isDocked && isPort && (
                        <SectorEntity
                            {...portData}
                            onRaid={() => onTriggerAction('raid', portData)}
                            onDock={() => setDockedLocation('port')}
                        />
                    )}

                    {dockedLocation === 'station' && (
                        <StationInternal
                            name={stationData.name}
                            onUndock={() => setDockedLocation(null)}
                            onOpenHelp={onOpenHelp}
                        />
                    )}

                    {dockedLocation === 'port' && (
                        <PortInternal
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
                        </PortInternal>
                    )}

                    {dockedLocation === 'planet' && (
                        <PlanetInternal
                            planet={planetData}
                            messages={planetMessages}
                            onUndock={() => setDockedLocation(null)}
                            onUpdateMessages={(pub, int) => setPlanetMessages({ public: pub, internal: int })}
                        />
                    )}

                    {currentShips.length > 0 && (
                        <ShipList
                            ships={currentShips}
                            header={shipListHeader}
                            onExamine={onExamine}
                        />
                    )}

                    {!isDocked && (currentSectorData?.forces?.length || 0) > 0 && (
                        <ForcesDisplay
                            forces={currentSectorData?.forces || []}
                            onAttack={(target) => onTriggerAction('attack', target || { name: "Sector Forces", level: "50" })}
                        />
                    )}

                    {!isDocked && (
                        <SectorResources />
                    )}
                </div>
            </div>
        </div>
    );
}
