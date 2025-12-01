import React, { useState, useRef, useMemo } from 'react';
import { useGame } from '../../src/context/GameContext';
import { REGION_COLORS, SystemNode } from '../../src/data/universe';

export const GalaxyMap: React.FC = () => {
    const { systems, player, warpSystem } = useGame();
    const [hoveredSystem, setHoveredSystem] = useState<SystemNode | null>(null);
    const [selectedSystem, setSelectedSystem] = useState<SystemNode | null>(null);

    // Zoom & Pan State
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const lastTransform = useRef({ x: 0, y: 0 });

    // Calculate lines (edges)
    const lines = useMemo(() => {
        const uniqueLines = new Set<string>();
        const lineElements: React.ReactNode[] = [];

        systems.forEach(sys => {
            sys.connections.forEach(targetId => {
                const target = systems.find(s => s.id === targetId);
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
    }, [systems]);

    const handleWarp = (targetSystem: SystemNode) => {
        const currentSystemData = systems.find(s => s.id === parseInt(player.currentSystem));
        if (!currentSystemData) return;

        if (player.currentSector === currentSystemData.wormholeSector) {
            if (currentSystemData.connections.includes(targetSystem.id)) {
                warpSystem(targetSystem.id);
            } else {
                alert("System not connected via jump node.");
            }
        } else {
            alert(`You must be at the Wormhole (Sector ${currentSystemData.wormholeSector}) to jump.`);
        }
    };

    // --- Zoom & Pan Handlers ---

    const handleWheel = (e: React.WheelEvent) => {
        // e.preventDefault(); // React synthetic events can't always prevent default passive listeners
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.max(0.1, Math.min(5, transform.scale * (1 + scaleAmount)));
        setTransform(prev => ({ ...prev, scale: newScale }));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only drag if clicking background (not a system)
        // But since systems are inside the SVG, we can check target or just allow drag everywhere
        // If clicking a system, onClick will fire too.
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        lastTransform.current = { x: transform.x, y: transform.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setTransform(prev => ({
            ...prev,
            x: lastTransform.current.x + dx,
            y: lastTransform.current.y + dy
        }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleZoomIn = () => {
        setTransform(prev => ({ ...prev, scale: Math.min(5, prev.scale * 1.2) }));
    };

    const handleZoomOut = () => {
        setTransform(prev => ({ ...prev, scale: Math.max(0.1, prev.scale / 1.2) }));
    };

    const handleReset = () => {
        setTransform({ x: 0, y: 0, scale: 1 });
    };

    return (
        <div className="w-full h-full flex flex-col items-center bg-[#020408] relative overflow-hidden">
            {/* Header */}
            <div className="w-full bg-[#001122] border-b border-[#004488] p-2 flex justify-between items-center z-10 shadow-md shrink-0">
                <h2 className="text-[#00ccff] font-bold text-[14px] uppercase tracking-widest pl-2">
                    Galaxy Map
                </h2>
                <div className="flex gap-2 items-center">
                    <div className="text-[#667788] text-[10px] font-mono pr-2">
                        {systems.length} Systems
                    </div>
                    {/* Zoom Controls */}
                    <div className="flex gap-1">
                        <button onClick={handleZoomOut} className="px-2 py-0.5 bg-[#002244] border border-[#004488] text-[#00ccff] hover:bg-[#003366] rounded text-[12px] font-bold">-</button>
                        <button onClick={handleReset} className="px-2 py-0.5 bg-[#002244] border border-[#004488] text-[#00ccff] hover:bg-[#003366] rounded text-[10px]">R</button>
                        <button onClick={handleZoomIn} className="px-2 py-0.5 bg-[#002244] border border-[#004488] text-[#00ccff] hover:bg-[#003366] rounded text-[12px] font-bold">+</button>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div
                className="flex-1 w-full relative overflow-hidden flex items-center justify-center bg-[#050a10]"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                {/* Background Grid - Fixed */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(#112233 1px, transparent 1px), linear-gradient(90deg, #112233 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}>
                </div>

                <svg width="100%" height="100%" className="w-full h-full pointer-events-none">
                    <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`} className="pointer-events-auto transition-transform duration-75 ease-out origin-center">
                        {/* Connections */}
                        <g className="opacity-60">{lines}</g>

                        {/* Systems */}
                        {systems.map(sys => {
                            const isHovered = hoveredSystem?.id === sys.id;
                            const isSelected = selectedSystem?.id === sys.id;
                            const isCurrent = parseInt(player.currentSystem) === sys.id;
                            const isConnected = selectedSystem?.connections.includes(sys.id);
                            const color = REGION_COLORS[sys.region] || "#ffffff";

                            return (
                                <g
                                    key={sys.id}
                                    onMouseEnter={() => setHoveredSystem(sys)}
                                    onMouseLeave={() => setHoveredSystem(null)}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent drag start if clicking system? No, we want to select.
                                        // If we dragged, maybe don't select? 
                                        // For now simple click is fine.
                                        setSelectedSystem(sys);
                                    }}
                                    className="cursor-pointer transition-all duration-300 group"
                                >
                                    {/* Glow Effect */}
                                    {(isHovered || isSelected || isCurrent) && (
                                        <circle cx={sys.x} cy={sys.y} r={(isCurrent ? 20 : 15) / Math.sqrt(transform.scale)} fill={isCurrent ? "#00ccff" : color} opacity="0.2" className="animate-pulse" />
                                    )}

                                    {/* Connection Highlight Line (if selected) */}
                                    {isConnected && (
                                        <line
                                            x1={selectedSystem!.x} y1={selectedSystem!.y}
                                            x2={sys.x} y2={sys.y}
                                            stroke={color} strokeWidth={2 / transform.scale} opacity="0.5"
                                        />
                                    )}

                                    {/* System Node */}
                                    <circle
                                        cx={sys.x}
                                        cy={sys.y}
                                        r={(isSelected ? 6 : 4) / Math.sqrt(transform.scale)}
                                        fill={isSelected ? "#ffffff" : (isCurrent ? "#00ccff" : "#000000")}
                                        stroke={color}
                                        strokeWidth={(isSelected ? 2 : 1.5) / Math.sqrt(transform.scale)}
                                        className="transition-all duration-300"
                                    />

                                    {/* Label - Scale text inverse to zoom so it stays readable but gets smaller */}
                                    <text
                                        x={sys.x}
                                        y={sys.y + (15 / transform.scale)}
                                        textAnchor="middle"
                                        fill={isHovered || isSelected ? "#ffffff" : "#667788"}
                                        fontSize={Math.max(4, 10 / Math.sqrt(transform.scale))}
                                        fontWeight={isHovered || isSelected ? "bold" : "normal"}
                                        className="pointer-events-none transition-all duration-300 font-mono select-none"
                                    >
                                        {sys.name} ({sys.id * 1000})
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>

                {/* Info Panel Overlay */}
                {(hoveredSystem || selectedSystem) && (
                    <div className="absolute bottom-4 right-4 w-[250px] bg-[#0b131e]/90 border border-[#223344] p-3 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm pointer-events-none z-20">
                        {(hoveredSystem || selectedSystem) && (() => {
                            const sys = hoveredSystem || selectedSystem!;
                            const color = REGION_COLORS[sys.region];
                            const isCurrent = parseInt(player.currentSystem) === sys.id;

                            // Check connection to current system
                            const currentSys = systems.find(s => s.id === parseInt(player.currentSystem));
                            const isConnectedToCurrent = currentSys?.connections.includes(sys.id);

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

                                    {isCurrent && (
                                        <div className="mt-3 pt-2 border-t border-[#223344] text-center text-green-400 text-[10px] font-bold">
                                            [ CURRENT LOCATION ]
                                        </div>
                                    )}

                                    {selectedSystem && selectedSystem.id === sys.id && !isCurrent && (
                                        <div className="mt-3 pt-2 border-t border-[#223344] flex flex-col gap-2 pointer-events-auto">
                                            {isConnectedToCurrent ? (
                                                <button
                                                    onClick={() => handleWarp(sys)}
                                                    className="w-full bg-[#004488] hover:bg-[#0055aa] text-white font-bold py-1 px-2 rounded text-[10px] transition-colors"
                                                >
                                                    INITIATE JUMP
                                                </button>
                                            ) : (
                                                <div className="text-center text-red-500 text-[10px]">
                                                    NO DIRECT CONNECTION
                                                </div>
                                            )}
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
