
import React, { useState } from 'react';

interface SystemNode {
    id: number;
    name: string;
    x: number;
    y: number;
    region: string;
    connections: number[];
}

const SYSTEMS: SystemNode[] = [
    // Core Worlds
    { id: 1, name: "Neo-Taenaria", x: 500, y: 300, region: "Core Worlds", connections: [2, 3, 9] },
    { id: 2, name: "Derivia", x: 450, y: 350, region: "Core Worlds", connections: [1, 4, 9] },
    { id: 3, name: "Zallus", x: 550, y: 350, region: "Core Worlds", connections: [1, 5, 9] },
    { id: 9, name: "Nexus", x: 500, y: 400, region: "Core Worlds", connections: [1, 2, 3, 4, 5, 6] },

    // Inner Worlds
    { id: 4, name: "Kitara", x: 400, y: 450, region: "Inner Worlds", connections: [2, 9, 7] },
    { id: 5, name: "Tamara", x: 600, y: 450, region: "Inner Worlds", connections: [3, 9, 8] },
    { id: 6, name: "Chronos", x: 500, y: 500, region: "Inner Worlds", connections: [9, 7, 8, 10] },

    // Pleiora Nebula
    { id: 7, name: "Heart of Pleiora", x: 300, y: 500, region: "Pleiora Nebula", connections: [4, 6, 11] },
    { id: 8, name: "Magnus", x: 700, y: 500, region: "Pleiora Nebula", connections: [5, 6, 12] },

    // Outer Rim
    { id: 10, name: "Cryptos", x: 500, y: 600, region: "Outer Rim", connections: [6, 11, 12, 13] },
    { id: 11, name: "Imrasael", x: 350, y: 650, region: "Outer Rim", connections: [7, 10, 14] },
    { id: 12, name: "Vanguard", x: 650, y: 650, region: "Outer Rim", connections: [8, 10, 15] },

    // Pirate Territories
    { id: 13, name: "Skull's Haven", x: 500, y: 750, region: "Pirate Territories", connections: [10, 14, 15] },
    { id: 14, name: "Black Market", x: 300, y: 750, region: "Pirate Territories", connections: [11, 13] },
    { id: 15, name: "Corsair's Rest", x: 700, y: 750, region: "Pirate Territories", connections: [12, 13] },

    // Independent Worlds
    { id: 16, name: "Freeport 7", x: 200, y: 400, region: "Independent Worlds", connections: [7] },
    { id: 17, name: "Outpost Alpha", x: 800, y: 400, region: "Independent Worlds", connections: [8] },
    { id: 18, name: "Hermit's Void", x: 500, y: 150, region: "Independent Worlds", connections: [1] }
];

const REGION_COLORS: Record<string, string> = {
    "Core Worlds": "#00ccff",
    "Inner Worlds": "#00ff88",
    "Pleiora Nebula": "#aa00ff",
    "Outer Rim": "#ffaa00",
    "Pirate Territories": "#ff0000",
    "Independent Worlds": "#aaaaaa"
};

export const GalaxyMap: React.FC = () => {
    const [hoveredSystem, setHoveredSystem] = useState<SystemNode | null>(null);
    const [selectedSystem, setSelectedSystem] = useState<SystemNode | null>(null);

    // Calculate lines (edges)
    const lines = React.useMemo(() => {
        const uniqueLines = new Set<string>();
        const lineElements: React.ReactNode[] = [];

        SYSTEMS.forEach(sys => {
            sys.connections.forEach(targetId => {
                const target = SYSTEMS.find(s => s.id === targetId);
                if (target) {
                    const key = [sys.id, target.id].sort().join('-');
                    if (!uniqueLines.has(key)) {
                        uniqueLines.add(key);
                        lineElements.push(
                            <line
                                key={key}
                                x1={sys.x}
                                y1={sys.y}
                                x2={target.x}
                                y2={target.y}
                                stroke="#224466"
                                strokeWidth="1"
                                className="transition-all duration-300"
                            />
                        );
                    }
                }
            });
        });
        return lineElements;
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center bg-[#020408] relative overflow-hidden">
            {/* Header */}
            <div className="w-full bg-[#001122] border-b border-[#004488] p-2 flex justify-between items-center z-10 shadow-md">
                <h2 className="text-[#00ccff] font-bold text-[14px] uppercase tracking-widest pl-2">
                    Galaxy Map
                </h2>
                <div className="text-[#667788] text-[10px] font-mono pr-2">
                    {SYSTEMS.length} Systems Detected
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 w-full relative overflow-auto flex items-center justify-center p-4">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(#112233 1px, transparent 1px), linear-gradient(90deg, #112233 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}>
                </div>

                <svg width="1000" height="900" viewBox="0 0 1000 900" className="max-w-full max-h-full">
                    {/* Connections */}
                    <g className="opacity-60">{lines}</g>

                    {/* Systems */}
                    {SYSTEMS.map(sys => {
                        const isHovered = hoveredSystem?.id === sys.id;
                        const isSelected = selectedSystem?.id === sys.id;
                        const isConnected = selectedSystem?.connections.includes(sys.id);
                        const color = REGION_COLORS[sys.region] || "#ffffff";

                        return (
                            <g
                                key={sys.id}
                                onMouseEnter={() => setHoveredSystem(sys)}
                                onMouseLeave={() => setHoveredSystem(null)}
                                onClick={() => setSelectedSystem(sys)}
                                className="cursor-pointer transition-all duration-300 group"
                            >
                                {/* Glow Effect */}
                                {(isHovered || isSelected) && (
                                    <circle cx={sys.x} cy={sys.y} r="15" fill={color} opacity="0.2" className="animate-pulse" />
                                )}

                                {/* Connection Highlight Line (if selected) */}
                                {isConnected && (
                                    <line
                                        x1={selectedSystem!.x} y1={selectedSystem!.y}
                                        x2={sys.x} y2={sys.y}
                                        stroke={color} strokeWidth="2" opacity="0.5"
                                    />
                                )}

                                {/* System Node */}
                                <circle
                                    cx={sys.x}
                                    cy={sys.y}
                                    r={isSelected ? 6 : 4}
                                    fill={isSelected ? "#ffffff" : "#000000"}
                                    stroke={color}
                                    strokeWidth={isSelected ? 2 : 1.5}
                                    className="transition-all duration-300"
                                />

                                {/* Label */}
                                <text
                                    x={sys.x}
                                    y={sys.y + 15}
                                    textAnchor="middle"
                                    fill={isHovered || isSelected ? "#ffffff" : "#667788"}
                                    fontSize={isHovered || isSelected ? "12" : "10"}
                                    fontWeight={isHovered || isSelected ? "bold" : "normal"}
                                    className="pointer-events-none transition-all duration-300 font-mono"
                                >
                                    {sys.name} ({sys.id})
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Info Panel Overlay */}
                {(hoveredSystem || selectedSystem) && (
                    <div className="absolute bottom-4 right-4 w-[250px] bg-[#0b131e]/90 border border-[#223344] p-3 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm pointer-events-none">
                        {(hoveredSystem || selectedSystem) && (() => {
                            const sys = hoveredSystem || selectedSystem!;
                            const color = REGION_COLORS[sys.region];
                            return (
                                <>
                                    <div className="flex justify-between items-start border-b border-[#223344] pb-2 mb-2">
                                        <div>
                                            <div className="text-white font-bold text-[14px]">{sys.name}</div>
                                            <div className="text-[#667788] text-[10px] font-mono">System ID: {sys.id}</div>
                                        </div>
                                        <div className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-black border" style={{ borderColor: color, color: color }}>
                                            {sys.region}
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-[11px]">
                                        <div className="flex justify-between">
                                            <span className="text-[#8899aa]">Connections:</span>
                                            <span className="text-white">{sys.connections.length} Jump Nodes</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#8899aa]">Status:</span>
                                            <span className="text-green-400">Secure</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#8899aa]">Travel Cost:</span>
                                            <span className="text-[#00ccff]">10 Turns</span>
                                        </div>
                                    </div>
                                    {selectedSystem && selectedSystem.id === sys.id && (
                                        <div className="mt-3 pt-2 border-t border-[#223344] text-center text-[#00ccff] text-[10px] font-bold animate-pulse">
                                            [ SYSTEM SELECTED ]
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};
