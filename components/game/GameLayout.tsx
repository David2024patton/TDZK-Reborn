
import React, { useState, useEffect, useRef } from 'react';
import { TopPanel } from './TopPanel';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { CenterPanel } from './CenterPanel';
import { HelpView } from '../HelpView';
import { DPad } from './DPad';
import { useGame } from '../../src/context/GameContext';

interface GameLayoutProps {
    onLogout: () => void;
}

type PanelMode = 'docked' | 'float';
export type ViewType = 'sector' | 'system' | 'galaxy' | 'help' | 'alliance' | 'alliance_list' | 'news' | 'notices' | 'online' | 'stats' | 'bounties' | 'rankings' | 'forces' | 'planets' | 'webboard' | 'admin';

export const GameLayout: React.FC<GameLayoutProps> = ({ onLogout }) => {
    // Global Game State from Context
    const { player, moveSector, warpSystem, addMessage } = useGame();

    const [activeView, setActiveView] = useState<ViewType>('sector');
    // Removed local currentSector state, using player.currentSector

    // Panel Visibility States
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);

    // Panel Modes
    const [leftMode, setLeftMode] = useState<PanelMode>('docked');
    const [rightMode, setRightMode] = useState<PanelMode>('docked');

    // Panel Positions & Sizes for Floating Mode
    const [leftPos, setLeftPos] = useState({ x: 20, y: 120 });
    const [leftSize, setLeftSize] = useState({ w: 220, h: 500 });

    const [rightPos, setRightPos] = useState({ x: window.innerWidth - 240, y: 120 });
    const [rightSize, setRightSize] = useState({ w: 220, h: 500 });

    // Dragging Logic
    const [dragAction, setDragAction] = useState<string | null>(null);
    const dragStart = useRef({ x: 0, y: 0 });
    const initialPos = useRef({ x: 0, y: 0 });
    const initialSize = useRef({ w: 0, h: 0 });

    // Track previous width for resize direction detection
    const prevWidth = useRef(window.innerWidth);

    // Initialize standard sidebar visibility for mobile
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setLeftOpen(false);
            setRightOpen(false);
            setLeftSize({ w: 210, h: 400 });
            setRightSize({ w: 210, h: 400 });
        }
    }, []);

    // Handle Window Resize
    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            // 1. Handle Mobile Transition (Auto-close when shrinking below 1024px)
            if (w < 1024 && prevWidth.current >= 1024) {
                setLeftOpen(false);
                setRightOpen(false);
            }
            // 2. Handle Desktop Transition (Auto-open when expanding above 1024px)
            else if (w >= 1024 && prevWidth.current < 1024) {
                setLeftOpen(true);
                setRightOpen(true);
            }

            // 3. Clamp Floating Panels to Viewport
            if (leftMode === 'float') {
                setLeftPos(prev => ({
                    x: Math.max(0, Math.min(prev.x, w - leftSize.w)),
                    y: Math.max(0, Math.min(prev.y, h - 50))
                }));
            }
            if (rightMode === 'float') {
                setRightPos(prev => ({
                    x: Math.max(0, Math.min(prev.x, w - rightSize.w)),
                    y: Math.max(0, Math.min(prev.y, h - 50))
                }));
            } else if (rightMode === 'docked' && w >= 1024) {
                // Reset floating pos for right panel if we are docked, 
                // so if we pop out later it spawns in a visible location
                setRightPos({ x: w - 240, y: 120 });
            }

            prevWidth.current = w;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [leftMode, rightMode, leftSize.w, rightSize.w]);

    // Navigation Handlers
    const handleNavigate = (view: ViewType) => {
        setActiveView(view);
        // On mobile, close left panel after navigation to see content
        if (window.innerWidth < 1024) {
            setLeftOpen(false);
        }
    };

    const handleWarp = (sector: string) => {
        const sectorNum = parseInt(sector);
        if (!isNaN(sectorNum)) {
            moveSector(sector.toString());
        }
        setActiveView('sector');
    };

    const handleSystemSelect = (sector: string) => {
        const sectorNum = parseInt(sector);
        if (!isNaN(sectorNum)) {
            moveSector(sector.toString());
        }
        setActiveView('sector');
    };

    const handleMouseDown = (e: React.MouseEvent, side: 'left' | 'right', type: 'move' | 'resize') => {
        e.preventDefault();
        e.stopPropagation();

        const mode = side === 'left' ? leftMode : rightMode;
        if (mode === 'docked') return;

        const action = `${side}-${type}`;
        setDragAction(action);

        dragStart.current = { x: e.clientX, y: e.clientY };

        if (side === 'left') {
            initialPos.current = { ...leftPos };
            initialSize.current = { ...leftSize };
        } else {
            initialPos.current = { ...rightPos };
            initialSize.current = { ...rightSize };
        }
    };

    // Movement Logic
    const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
        const current = parseInt(player.currentSector);
        if (isNaN(current)) return;

        // Boundary Checks
        if (direction === 'left' && current % 10 === 0) {
            addMessage("Cannot move past sector edge");
            return;
        }
        if (direction === 'right' && current % 10 === 9) {
            addMessage("Cannot move past sector edge");
            return;
        }

        let target = current;
        if (direction === 'up') target -= 10;
        if (direction === 'down') target += 10;
        if (direction === 'left') target -= 1;
        if (direction === 'right') target += 1;

        moveSector(target.toString());
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeView !== 'sector') return; // Only move in sector view

            if (e.key === 'ArrowUp') handleMove('up');
            if (e.key === 'ArrowDown') handleMove('down');
            if (e.key === 'ArrowLeft') handleMove('left');
            if (e.key === 'ArrowRight') handleMove('right');
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [player.currentSector, activeView]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragAction) return;

            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const [side, type] = dragAction.split('-');

            if (side === 'left') {
                if (type === 'move') {
                    setLeftPos({
                        x: initialPos.current.x + dx,
                        y: initialPos.current.y + dy
                    });
                } else if (type === 'resize') {
                    setLeftSize({
                        w: Math.max(200, initialSize.current.w + dx),
                        h: Math.max(200, initialSize.current.h + dy)
                    });
                }
            } else if (side === 'right') {
                if (type === 'move') {
                    setRightPos({
                        x: initialPos.current.x + dx,
                        y: initialPos.current.y + dy
                    });
                } else if (type === 'resize') {
                    setRightSize({
                        w: Math.max(200, initialSize.current.w + dx),
                        h: Math.max(200, initialSize.current.h + dy)
                    });
                }
            }
        };

        const handleMouseUp = () => {
            if (dragAction && dragAction.includes('move')) {
                // Snap Logic on Drop
                const [side] = dragAction.split('-');
                const pos = side === 'left' ? leftPos : rightPos;
                const setPos = side === 'left' ? setLeftPos : setRightPos;
                const setSize = side === 'left' ? setLeftSize : setRightSize;

                const SNAP_THRESHOLD = 50;
                const VIEWPORT_W = window.innerWidth;
                const VIEWPORT_H = window.innerHeight;

                let newX = pos.x;
                let newY = pos.y;

                let newW = side === 'left' ? leftSize.w : rightSize.w;
                let newH = side === 'left' ? leftSize.h : rightSize.h;

                // Snap Left
                if (pos.x < SNAP_THRESHOLD) {
                    newX = 0;
                    newY = 0;
                    newH = VIEWPORT_H;
                    newW = 220;
                }
                // Snap Right
                else if (pos.x + newW > VIEWPORT_W - SNAP_THRESHOLD) {
                    newX = VIEWPORT_W - 220;
                    newY = 0;
                    newH = VIEWPORT_H;
                    newW = 220;
                }
                // Snap Top
                else if (pos.y < SNAP_THRESHOLD) {
                    newY = 0;
                    newX = 0;
                    newW = VIEWPORT_W;
                    newH = 200;
                }
                // Snap Bottom
                else if (pos.y + newH > VIEWPORT_H - SNAP_THRESHOLD) {
                    newY = VIEWPORT_H - 200;
                    newX = 0;
                    newW = VIEWPORT_W;
                    newH = 200;
                }

                setPos({ x: newX, y: newY });
                setSize({ w: newW, h: newH });
            }
            setDragAction(null);
        };

        if (dragAction) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragAction, leftPos, rightPos, leftSize, rightSize]);


    const renderPanel = (side: 'left' | 'right') => {
        const isLeft = side === 'left';
        const isOpen = isLeft ? leftOpen : rightOpen;
        const mode = isLeft ? leftMode : rightMode;
        const pos = isLeft ? leftPos : rightPos;
        const size = isLeft ? leftSize : rightSize;
        const Component = isLeft ? LeftPanel : RightPanel;

        if (!isOpen) return null;

        const panelProps = isLeft ? { onNavigate: handleNavigate, onMove: handleMove } : {};

        if (mode === 'docked') {
            return (
                <div className={`
                fixed lg:relative z-40 lg:z-auto top-0 bottom-0 lg:inset-auto 
                ${isLeft ? 'left-0' : 'right-0'}
                w-[210px] lg:w-[220px] shrink-0 flex flex-col h-full
                bg-black/95 lg:bg-transparent
                border-r lg:border-none border-[#003366]
                shadow-[0_0_50px_rgba(0,0,0,0.8)] lg:shadow-none
                transition-transform duration-300
                ${!isOpen ? (isLeft ? '-translate-x-full lg:translate-x-0' : 'translate-x-full lg:translate-x-0') : 'translate-x-0'}
             `}>
                    {/* Mobile Header */}
                    <div className="lg:hidden flex justify-between items-center p-2 border-b border-[#003366] bg-[#001122]">
                        <div className="flex gap-2 items-center">
                            <span className="text-[#00ccff] font-bold text-[10px]">{isLeft ? 'NAVIGATION' : 'STATUS'}</span>
                            <button
                                onClick={() => isLeft ? setLeftMode('float') : setRightMode('float')}
                                className="text-[#eccc66] font-bold border border-[#eccc66] px-2 py-0.5 text-[10px] rounded hover:bg-[#eccc66]/20"
                            >
                                Pop Out
                            </button>
                        </div>
                        <button
                            onClick={() => isLeft ? setLeftOpen(false) : setRightOpen(false)}
                            className="text-red-500 font-bold border border-red-900 px-2 py-0.5 text-[10px] rounded hover:bg-red-900/20"
                        >
                            Close
                        </button>
                    </div>

                    <Component isFloating={false} {...panelProps} />
                </div>
            );
        } else {
            return (
                <div
                    className="fixed z-50 bg-black/90 border border-[#0055aa] rounded-lg shadow-[0_0_20px_rgba(0,100,255,0.2)] flex flex-col overflow-hidden backdrop-blur-md"
                    style={{
                        left: pos.x,
                        top: pos.y,
                        width: size.w,
                        height: size.h,
                    }}
                >
                    {/* Drag Header */}
                    <div
                        className="h-6 shrink-0 bg-gradient-to-r from-[#002244] to-[#001122] border-b border-[#004488] flex items-center justify-center px-2 cursor-move relative"
                        onMouseDown={(e) => handleMouseDown(e, side, 'move')}
                    >
                        <span className="text-[10px] text-[#00ccff] font-bold select-none">{isLeft ? 'NAVIGATION' : 'STATUS'}</span>
                        <div className="flex gap-2 absolute right-2">
                            <button onClick={() => isLeft ? setLeftMode('docked') : setRightMode('docked')} className="text-[#8899aa] hover:text-white text-[10px]" title="Dock">_</button>
                            <button onClick={() => isLeft ? setLeftOpen(false) : setRightOpen(false)} className="text-[#ff5555] hover:text-white text-[10px]" title="Close">X</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        <div className="w-full h-full" style={{ '--panel-width': `${size.w}px` } as React.CSSProperties}>
                            <Component isFloating={true} {...panelProps} />
                        </div>
                    </div>

                    <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
                        onMouseDown={(e) => handleMouseDown(e, side, 'resize')}
                    >
                        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-[#00ccff] opacity-50"></div>
                    </div>
                </div>
            );
        }
    };

    // Render Full Screen Help View if active
    if (activeView === 'help') {
        return <HelpView onClose={() => setActiveView('sector')} />;
    }

    return (
        <div className="flex h-[100dvh] w-full bg-[#000018] overflow-hidden font-verdana text-[11px] text-[#cccccc] relative">

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#112244 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {/* Persistent D-Pad */}
            {(!leftOpen || leftMode === 'float') && (
                <div className="fixed top-2 left-2 z-50 scale-75 origin-top-left opacity-90 hover:opacity-100 transition-opacity">
                    <DPad onCenterClick={() => handleNavigate('sector')} onMove={handleMove} />
                </div>
            )}

            {/* Edge Tabs */}
            {!leftOpen && (
                <button
                    onClick={() => setLeftOpen(true)}
                    className="fixed z-40 top-[200px] left-0 bg-[#002244] border-r border-y border-[#0055aa] text-[#00ccff] py-3 px-1 rounded-r-md shadow-[0_0_10px_rgba(0,100,255,0.3)] hover:pl-2 transition-all"
                >
                    &gt;
                </button>
            )}
            {!rightOpen && (
                <button
                    onClick={() => setRightOpen(true)}
                    className="fixed z-40 top-[200px] right-0 bg-[#002244] border-l border-y border-[#0055aa] text-[#00ccff] py-3 px-1 rounded-l-md shadow-[0_0_10px_rgba(0,100,255,0.3)] hover:pr-2 transition-all"
                >
                    &lt;
                </button>
            )}

            {/* Docked Left Panel Placeholder */}
            <div className="hidden lg:flex w-[220px] flex-col shrink-0 z-20 relative transition-all duration-300 h-full">
                {leftMode === 'docked' && (
                    <div className="w-full h-full absolute inset-0">
                        {renderPanel('left')}
                    </div>
                )}
            </div>

            {/* Render Left Panel (Floating or Mobile Docked) */}
            {(leftMode === 'float' || (window.innerWidth < 1024 && leftOpen)) && renderPanel('left')}


            {/* Center Column */}
            <div className="flex-1 flex flex-col min-w-0 z-10 relative w-full h-full min-h-0">
                <div className="shrink-0 h-[60px] flex items-end justify-center pb-1 relative z-30 pointer-events-auto">
                    <TopPanel
                        onLogout={onLogout}
                        currentSector={player.currentSector.toString()}
                        onWarp={handleWarp}
                        showDPad={!leftOpen || leftMode === 'float'}
                    />
                </div>
                <div className="flex-1 relative pl-1 pr-1 pb-1 overflow-hidden min-h-0">
                    <div className="w-full h-full bg-black rounded-tl-[20px] rounded-tr-[20px] lg:rounded-tl-[50px] lg:rounded-tr-[50px] border-t border-l border-r border-[#0055aa] shadow-[inset_0_10px_30px_rgba(0,0,0,1),0_-2px_10px_rgba(0,100,255,0.3)] flex flex-col overflow-hidden relative min-h-0">
                        <div className="absolute top-0 left-[20px] right-[20px] lg:left-[50px] lg:right-[50px] h-[1px] bg-gradient-to-r from-transparent via-[#0088ff] to-transparent opacity-50 z-20"></div>

                        {/* Content */}
                        <CenterPanel
                            view={activeView}
                            currentSector={player.currentSector.toString()}
                            onSystemSelect={handleSystemSelect}
                            onNavigate={handleNavigate}
                        />
                    </div>
                </div>
            </div>

            {/* Docked Right Panel Placeholder */}
            <div className="hidden lg:flex w-[220px] flex-col shrink-0 z-20 relative transition-all duration-300 h-full">
                {rightMode === 'docked' && (
                    <div className="w-full h-full absolute inset-0">
                        {renderPanel('right')}
                    </div>
                )}
            </div>

            {/* Render Right Panel (Floating or Mobile Docked) */}
            {(rightMode === 'float' || (window.innerWidth < 1024 && rightOpen)) && renderPanel('right')}



        </div>
    );
};
