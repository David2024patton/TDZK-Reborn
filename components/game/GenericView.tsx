
import React from 'react';

export const GenericView: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center bg-[#050a10] border border-[#223344] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}>
            </div>

            <div className="w-[200px] h-[200px] border-2 border-[#003366] rounded-full flex items-center justify-center relative bg-black shadow-[0_0_50px_rgba(0,50,100,0.2)] z-10">
                <div className="absolute inset-0 rounded-full border border-[#112233] animate-[spin_60s_linear_infinite] opacity-30" style={{ borderStyle: 'dashed' }}></div>
                <div className="absolute inset-4 rounded-full border border-[#112233] animate-[spin_40s_linear_infinite_reverse] opacity-30" style={{ borderStyle: 'dotted' }}></div>
                <span className="text-[#00ccff] font-bold animate-pulse text-[14px] uppercase tracking-widest">{title}</span>
            </div>

            <div className="mt-6 z-10 max-w-[400px]">
                <h2 className="text-white font-bold text-[18px] mb-2">{title}</h2>
                <p className="text-[#667788] text-[11px] leading-relaxed">
                    This section is currently under development. Access to this terminal is restricted pending further system upgrades.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                    <span className="text-[#223344] text-[10px] font-mono">[ SYSTEM LOCKED ]</span>
                </div>
            </div>
        </div>
    );
};
