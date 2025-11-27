import React, { useState, useEffect, useRef } from 'react';
import { ShipData } from './types';

interface CombatViewProps {
    target: any;
    onClose: () => void;
}

export const CombatView: React.FC<CombatViewProps> = ({ target, onClose }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const logEndRef = useRef<HTMLDivElement>(null);

    const targetName = target.name || target.shipName || "Unknown Target";
    const targetLevel = target.level || target.shipLevel || "??";

    useEffect(() => {
        const combatSequence = [
            `Scanning target ${targetName}...`,
            `Target locked. Level ${targetLevel}.`,
            `Initiating attack sequence...`,
            `Firing main weapons...`,
            `> Hit! Enemy shields at 80%`,
            `Enemy returning fire...`,
            `> Evasion successful.`,
            `Firing photon torpedoes...`,
            `> Critical Hit! Enemy hull breached.`,
            `Enemy vessel disabled.`,
            `Combat resolved. Victory!`
        ];

        let delay = 0;
        const timeoutIds: ReturnType<typeof setTimeout>[] = [];

        combatSequence.forEach((log, index) => {
            delay += 500 + Math.random() * 500;
            const id = setTimeout(() => {
                setLogs(prev => [...prev, log]);
                if (index === combatSequence.length - 1) {
                    setIsFinished(true);
                }
            }, delay);
            timeoutIds.push(id);
        });

        return () => {
            timeoutIds.forEach(clearTimeout);
        };
    }, [targetName, targetLevel]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-[600px] bg-[#050a10] border-2 border-[#ff0000] shadow-[0_0_50px_rgba(255,0,0,0.3)] flex flex-col relative overflow-hidden">

                {/* Header */}
                <div className="bg-[#220000] border-b border-[#ff0000] p-3 flex justify-between items-center relative">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,0,0,0.05)_10px,rgba(255,0,0,0.05)_20px)]"></div>
                    <h2 className="text-[#ff5555] font-bold text-[16px] tracking-[0.2em] uppercase relative z-10 animate-pulse">
                        Combat Log
                    </h2>
                    <div className="text-[#aa0000] font-mono text-[12px] relative z-10">
                        Target: <span className="text-white">{targetName}</span>
                    </div>
                </div>

                {/* Log Area */}
                <div className="h-[400px] bg-black p-4 font-mono text-[12px] overflow-y-auto scrollbar-retro relative">
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02),rgba(255,0,0,0.06))] z-10 bg-[length:100%_4px,6px_100%]"></div>
                    <div className="flex flex-col gap-1 relative z-20">
                        {logs.map((log, i) => (
                            <div key={i} className={`
                                ${log.includes('Critical') ? 'text-yellow-400 font-bold' : ''}
                                ${log.includes('Victory') ? 'text-green-400 font-bold text-[14px] mt-2' : ''}
                                ${log.includes('Hit') && !log.includes('Critical') ? 'text-orange-400' : ''}
                                ${!log.includes('Hit') && !log.includes('Victory') && !log.includes('Critical') ? 'text-[#ffaaaa]' : ''}
                                animate-in slide-in-from-left-2 duration-200
                            `}>
                                <span className="text-[#440000] mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="bg-[#110000] border-t border-[#440000] p-4 flex justify-center items-center gap-4">
                    {isFinished ? (
                        <button
                            onClick={onClose}
                            className="bg-[#440000] border border-[#ff0000] text-white px-8 py-2 text-[12px] font-bold uppercase tracking-widest hover:bg-[#ff0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.8)] transition-all animate-in zoom-in duration-300"
                        >
                            Close Log
                        </button>
                    ) : (
                        <>
                            <div className="text-[#ff5555] text-[10px] uppercase tracking-widest animate-pulse">
                                Combat in progress...
                            </div>
                            <button
                                onClick={onClose}
                                className="px-4 py-1 border border-yellow-700 text-yellow-500 hover:bg-yellow-900/20 hover:text-yellow-300 text-[10px] uppercase transition-colors"
                            >
                                Abort
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
