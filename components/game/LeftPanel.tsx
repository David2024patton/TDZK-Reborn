
import React from 'react';
import { DPad } from './DPad';
import type { ViewType } from './GameLayout';

interface LeftPanelProps {
  isFloating?: boolean;
  onNavigate?: (view: ViewType) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ isFloating = false, onNavigate }) => {
  return (
    <div className="flex flex-col h-full text-[10px] font-verdana select-none text-[#aaccff] overflow-hidden min-h-0">

      {/* Top Section: D-Pad & Stats - Flexible container for responsive resizing */}
      <div className={`shrink-0 px-3 ${isFloating ? 'pt-2' : 'pt-0 md:pt-4'} flex flex-wrap gap-x-2`}>

        {/* NAV Header Block (D-Pad) */}
        {!isFloating && (
          <div className={`relative flex items-center justify-center py-6 md:py-0 md:h-[140px] mb-2 shrink-0 ${isFloating ? '' : 'w-full'}`}>
            <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 h-24 items-center">
              <span className="text-[#0055aa] font-bold text-[18px] tracking-[0.5em] opacity-60 [writing-mode:vertical-rl] rotate-180 drop-shadow-[0_0_5px_rgba(0,100,255,0.5)]">NAV</span>
            </div>
            <div>
              <DPad />
            </div>
          </div>
        )}

        {/* Player Stats Block - Grows to fill space if resizing width */}
        <div className="mb-4 space-y-0.5 p-2 bg-black/40 border border-[#003366] rounded-xl relative overflow-hidden backdrop-blur-sm cursor-default text-[11px] min-w-[180px] flex-1">

          <div className="flex justify-between items-baseline">
            <span className="text-[#00ccff]">Level:</span>
            <span className="text-white font-bold">49</span>
          </div>

          <div className="w-full bg-[#081122] h-2 mb-1 border border-[#223344]">
            <div className="bg-[#223344] h-full w-[90%]"></div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-[#8899aa]">XP:</span>
            <span className="text-white text-right font-mono text-[10px]">553,180,173</span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-[#666666]">NL:</span>
            <span className="text-[#888888] text-right font-mono text-[10px]">588,245,000</span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-[#8899aa]">Alignment:</span>
            <span className="text-white text-right">-91</span>
          </div>

          <div className="text-[#00ff00] font-mono text-left py-0.5 text-[11px] drop-shadow-[0_0_3px_rgba(0,255,0,0.5)]">
            $2,326,487,750
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-[#eccc66]">Turns:</span>
            <span className="text-[#eccc66] font-bold">2666</span>
          </div>

          <div className="mt-1 pt-1 border-t border-[#002244] flex items-center gap-1 opacity-50">
            <div className="w-2 h-2 border border-[#445566] rotate-45"></div>
            <div className="h-[1px] bg-[#445566] flex-1"></div>
          </div>
        </div>
      </div>

      {/* Fixed Galactic Time Section */}
      <div className="shrink-0 px-3 mb-4 text-center w-full">
        <div className="text-[#445566] text-[9px] uppercase tracking-wider mb-1">Galactic Time</div>
        <div className="text-[#00ccff] font-mono bg-black/60 border border-[#003366] py-1 rounded shadow-[inset_0_0_5px_rgba(0,0,0,1)]">17:45:51 EST</div>
      </div>

      {/* Scrollable Bottom Section: Links */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-retro w-full min-h-0">

        {/* Navigation Menu Links - Vertical Stack */}
        <div className={`flex flex-col gap-y-1 pl-2 pb-4 w-full @container`}>
          <div className="w-full columns-1 [column-fill:auto] group-data-[width=wide]:columns-4 md:group-data-[width=wide]:columns-6"
            style={{ columnGap: '1rem', columnWidth: '150px' }}
          >
            {[
              { label: "System Map", action: () => onNavigate?.('system') },
              { label: "Navigation", action: () => onNavigate?.('sector') },
              { label: "Galaxy Map", action: () => onNavigate?.('galaxy') },
              "DIVIDER",
              { label: "News", action: () => onNavigate?.('news') },
              { label: "Notices", action: () => onNavigate?.('notices') },
              "DIVIDER",
              { label: "Online Players", action: () => onNavigate?.('online') },
              "DIVIDER",
              { label: "Stats/Options", action: () => onNavigate?.('stats') },
              { label: "Alliance", action: () => onNavigate?.('alliance') },
              { label: "Alliance List", action: () => onNavigate?.('alliance') },
              { label: "Bounties", action: () => onNavigate?.('bounties') },
              { label: "Rankings", action: () => onNavigate?.('rankings') },
              "DIVIDER",
              { label: "Forces", action: () => onNavigate?.('forces') },
              { label: "Planets", action: () => onNavigate?.('planets') },
              "DIVIDER",
              { label: "Web Board", action: () => onNavigate?.('webboard') },
              { label: "Help", action: () => onNavigate?.('help') },
              { label: "Logout", action: () => window.location.reload() }
            ].map((item, i) => {
              if (item === "DIVIDER") return <div key={i} className="h-2 border-b border-[#002244] mb-2 mx-4 opacity-50 break-inside-avoid"></div>;
              if (typeof item === 'string') {
                return (
                  <div key={i} className="flex items-center group cursor-pointer py-1 hover:translate-x-1 transition-transform break-inside-avoid">
                    <div className="w-1 h-1 bg-[#004488] group-hover:bg-[#00ccff] mr-2 rotate-45 transition-colors shadow-[0_0_2px_#004488]"></div>
                    <span className="text-[#8899bb] group-hover:text-white text-[10px] tracking-wide transition-colors truncate">{item}</span>
                  </div>
                );
              }
              return (
                <div key={i} onClick={item.action} className="flex items-center group cursor-pointer py-1 hover:translate-x-1 transition-transform break-inside-avoid">
                  <div className="w-1 h-1 bg-[#00ccff] group-hover:bg-white mr-2 rotate-45 transition-colors shadow-[0_0_4px_#00ccff]"></div>
                  <span className="text-[#aaccff] font-bold group-hover:text-white text-[10px] tracking-wide transition-colors truncate">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
