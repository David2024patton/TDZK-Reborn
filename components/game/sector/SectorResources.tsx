import React from 'react';

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

export const SectorResources: React.FC = () => {
    return (
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
    );
};
