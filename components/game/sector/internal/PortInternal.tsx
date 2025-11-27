import React from 'react';

const PortTradeRow: React.FC<{ resource: string, stock: number, price: number }> = ({ resource, stock, price }) => {
    let status = "BUYING";
    let action = "Sell";
    let statusColor = "text-green-500";

    if (stock > 26000) {
        status = "SELLING";
        action = "Buy";
        statusColor = "text-red-500";
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

interface PortInternalProps {
    name: string;
    sub?: string;
    children: React.ReactNode;
    onUndock?: () => void;
}

export const PortInternal: React.FC<PortInternalProps> = ({ name, sub, children, onUndock }) => (
    <div className="w-full bg-[#050a10] border border-[#004488] flex flex-col mb-4 relative z-10 shrink-0 font-verdana shadow-lg">
        <div className="p-3 border-b border-[#004488] bg-gradient-to-r from-[#001122] to-[#000000] flex flex-col gap-1">
            <div className="text-white font-bold text-[16px] tracking-wide">
                {name}
            </div>
            <div className="text-[#667788] text-[10px] mb-2">
                {sub}
            </div>
            <div className="text-center py-2">
                <span className="text-[#00ccff] font-bold underline text-[11px] cursor-pointer hover:text-white">Messages:</span>
            </div>
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
        <div className="p-2 bg-black/80">
            <div className="text-[#00ccff] font-bold text-[12px] mb-2 pl-1 border-b border-[#002244] pb-1">
                Port Goods:
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 px-1 pb-2">
                {children}
            </div>
        </div>
    </div>
);

export { PortTradeRow };
