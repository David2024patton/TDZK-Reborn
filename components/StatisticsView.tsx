
import React from 'react';

interface StatisticsViewProps {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

const STATS_DATA = {
  galaxy: [
    { label: "Systems in Galaxy", value: "22" },
    { label: "Sectors in Galaxy", value: "6475" },
    { label: "Ports in Galaxy", value: "490" },
    { label: "Stations in Galaxy", value: "23" },
    { label: "Planets in Galaxy", value: "24" },
  ],
  playerBase: [
    { label: "Total Players", value: "4515" },
    { label: "Players under Newbie Protection", value: "3486" },
    { label: "Players with Exploratory Turns", value: "2214" },
    { label: "Taenarian Players", value: "437" },
    { label: "Scourge Players", value: "223" },
    { label: "Derivian Players", value: "827" },
    { label: "Zallun Players", value: "485" },
    { label: "Tamaran Players", value: "668" },
    { label: "Sniv Players", value: "343" },
    { label: "Wraith Players", value: "982" },
    { label: "Quelaar Players", value: "113" },
    { label: "Kitaran Players", value: "219" },
    { label: "Polloid Players", value: "217" },
    { label: "Average Pilot Level (w/o Exploratory Turns)", value: "17" },
  ],
  alliance: [
    { label: "Number of Alliances", value: "196" },
    { label: "Number of Good Alliances", value: "0" },
    { label: "Number of Evil Alliances", value: "0" },
    { label: "Allied Players", value: "1465" },
    { label: "Non-Allied Players", value: "3050" },
  ],
  alignment: [
    { label: "Very Good Aligned Players (+300 to +400)", value: "506" },
    { label: "Good Aligned Players (+100 to +299)", value: "1013" },
    { label: "Neutral Aligned Players (-99 to +99)", value: "1704" },
    { label: "Evil Aligned Players (-100 to -299)", value: "871" },
    { label: "Very Evil Aligned Players (-300 to -400)", value: "421" },
  ],
  shipClass: [
    { label: "Escape Pod", value: "1289" },
    { label: "Frigate", value: "1955" },
    { label: "Freighter", value: "437" },
    { label: "Resourcer", value: "358" },
    { label: "Corvette", value: "43" },
    { label: "Cruiser", value: "52" },
    { label: "Destroyer", value: "115" },
    { label: "Carrier", value: "92" },
    { label: "Interceptor", value: "49" },
    { label: "Battleship", value: "45" },
    { label: "Ranger", value: "31" },
    { label: "Vengeance", value: "2" },
    { label: "Persecutor", value: "47" },
    { label: "Toy Frigate", value: "0" },
  ]
};

const SIDEBAR_LINKS = [
  { label: "Home", action: 'home' },
  { label: "Help Files", action: 'help' },
  { label: "Web Board", action: 'Web Board' },
  { label: "Register!", action: 'Register!' },
  { label: "Donate!", action: 'Donate!' },
  { label: "Advertise with us!", action: 'Advertise with us!' },
  { label: "Changelog", action: 'Changelog' },
  { label: "Discord", action: 'Discord' },
  { label: "Forum Rules", action: 'Forum Rules' },
  { label: "ToA", action: 'ToA' },
  { label: "Privacy Policy", action: 'Privacy Policy' },
  { label: "Hall of Fame", action: 'hof' },
  { label: "Statistics", action: 'current' },
  { label: "Downloads", action: 'Downloads' },
  { label: "Merchandise", action: 'Merchandise' },
];

export const StatisticsView: React.FC<StatisticsViewProps> = ({ onClose, onNavigate }) => {

  const handleLinkClick = (action: string) => {
    if (action === 'home') onClose();
    else if (action === 'current') { /* do nothing */ }
    else onNavigate(action);
  };

  const renderStatsTable = (title: string, data: {label: string, value: string}[]) => (
    <div className="mb-6 last:mb-0">
        <h2 className="text-[#00ccff] font-bold text-[16px] mb-2 border-b border-[#004488] pb-1 uppercase tracking-wide">
            {title}
        </h2>
        <div className="overflow-x-auto bg-[#0a111a] border border-[#223344] rounded p-4">
            <table className="w-full text-left border-collapse text-[11px] font-mono whitespace-nowrap">
                <tbody className="divide-y divide-[#112233]">
                    {data.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#ffffff]/5">
                            <td className="p-2 text-[#cccccc]">{item.label}</td>
                            <td className="p-2 text-right text-white font-bold">{item.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#020408] flex flex-col font-verdana text-[#cccccc] animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="h-[60px] shrink-0 bg-[#050a10] border-b border-[#223344] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-900/20 border border-blue-500/50 rounded flex items-center justify-center text-blue-400 font-bold">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M3 3v18h18v-2H5V3H3zm4 14h2v-4H7v4zm4 0h2V7h-2v10zm4 0h2v-7h-2v7z"/>
                </svg>
              </div>
              <div>
                  <h1 className="text-white font-bold text-[16px] tracking-wide uppercase">TDZK Statistics</h1>
                  <div className="text-[#445566] text-[9px] tracking-[0.3em]">SERVER METRICS V2.6</div>
              </div>
          </div>
          <button onClick={onClose} className="bg-[#112233] hover:bg-[#224466] text-[#00ccff] border border-[#004488] px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
              Return <span className="text-[14px] leading-none">×</span>
          </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[240px] bg-[#03060c] border-r border-[#112233] hidden md:flex flex-col overflow-y-auto p-4 space-y-6">
            <div>
                <h3 className="text-[#445566] font-bold text-[10px] uppercase tracking-widest mb-2 pl-2 border-l-2 border-[#00ccff]">Navigation</h3>
                <div className="flex flex-col pl-3 space-y-1 border-l border-[#112233] ml-[1px]">
                  {SIDEBAR_LINKS.map((link, i) => (
                    <button
                      key={i}
                      onClick={() => handleLinkClick(link.action)}
                      className={`
                        text-left text-[11px] py-1.5 px-3 rounded transition-all 
                        ${link.label === 'Statistics' 
                          ? 'bg-[#002244] text-white font-bold pl-4 border-l-2 border-[#00ccff]' 
                          : 'text-[#8899aa] hover:text-[#00ccff] hover:pl-4 border-l-2 border-transparent'
                        }
                      `}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,#0a1525_0%,#000000_100%)] p-6 md:p-10">
          <div className="max-w-[600px] mx-auto">
             <div className="flex justify-between items-end mb-6 border-b border-[#223344] pb-2">
                <h1 className="text-[32px] font-bold text-white drop-shadow-[0_0_10px_rgba(0,200,255,0.3)]">Statistics</h1>
                <div className="text-[#445566] font-mono text-[9px]">LIVE_DATA_FEED</div>
            </div>

            <div className="space-y-8">
                {renderStatsTable("Galaxy Statistics", STATS_DATA.galaxy)}
                {renderStatsTable("Player Base Statistics", STATS_DATA.playerBase)}
                {renderStatsTable("Alliance Statistics", STATS_DATA.alliance)}
                {renderStatsTable("Player Alignment Statistics", STATS_DATA.alignment)}
                {renderStatsTable("Ship Class Distribution", STATS_DATA.shipClass)}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
