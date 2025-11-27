
import React, { useState, useMemo } from 'react';
import { HOF_DATA, RoundData, HoFEntry, CategoryKey } from '../data/hallOfFameData';

interface HallOfFameViewProps {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

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
  { label: "Hall of Fame", action: 'current' },
  { label: "Statistics", action: 'stats' },
  { label: "Downloads", action: 'Downloads' },
  { label: "Merchandise", action: 'Merchandise' },
];

export const HallOfFameView: React.FC<HallOfFameViewProps> = ({ onClose, onNavigate }) => {
  const [selectedRoundId, setSelectedRoundId] = useState<string>('VII');
  const [viewMode, setViewMode] = useState<'alliances' | 'players'>('alliances');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('experience');

  const currentRound = useMemo(() => 
    HOF_DATA.find(r => r.id === selectedRoundId) || HOF_DATA[0], 
  [selectedRoundId]);

  const handleLinkClick = (action: string) => {
    if (action === 'home') onClose();
    else if (action === 'current') { /* do nothing */ }
    else onNavigate(action);
  };

  const getCategoryOptions = () => {
    if (viewMode === 'alliances') {
      return [
        { key: 'experience', label: 'Ranked By Total EXP' },
        { key: 'kills', label: 'Ranked By Kills' },
        { key: 'pirated', label: 'Ranked By Ships Pirated' },
        { key: 'raids', label: 'Ranked By Ports Raided' },
      ];
    } else {
      return [
        { key: 'experience', label: 'Ranked By Experience' },
        { key: 'avg_kills', label: 'Ranked By Average Kill Level' },
        { key: 'kills', label: 'Ranked By Kills' },
        { key: 'pirated', label: 'Ranked By Ships Pirated' },
        { key: 'raids', label: 'Ranked By Ports Raided' },
      ];
    }
  };

  const tableData: HoFEntry[] = useMemo(() => {
    // @ts-ignore - dynamic key access
    return currentRound[viewMode][selectedCategory] || [];
  }, [currentRound, viewMode, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020408] flex flex-col font-verdana text-[#cccccc] animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="h-[60px] shrink-0 bg-[#050a10] border-b border-[#223344] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-900/20 border border-blue-500/50 rounded flex items-center justify-center text-blue-400 font-bold">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                   <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                  <h1 className="text-white font-bold text-[16px] tracking-wide uppercase">Hall of Fame</h1>
                  <div className="text-[#445566] text-[9px] tracking-[0.3em]">HISTORICAL RECORDS</div>
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
                        ${link.label === 'Hall of Fame' 
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
        <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,#0a1525_0%,#000000_100%)] p-6 md:p-10 flex flex-col items-center">
          
          <div className="w-full max-w-[1000px] mb-8">
             <div className="flex justify-between items-end mb-6 border-b border-[#223344] pb-2">
                <h1 className="text-[32px] font-bold text-white drop-shadow-[0_0_10px_rgba(0,200,255,0.3)]">Hall of Fame</h1>
                <div className="text-[#445566] font-mono text-[9px]">ROUND_{selectedRoundId}_ARCHIVE</div>
            </div>

            {/* Round Filter Tabs */}
            <div className="flex border-b border-[#223344] mb-6">
               {HOF_DATA.map(round => (
                 <button
                   key={round.id}
                   onClick={() => setSelectedRoundId(round.id)}
                   className={`
                      flex-1 py-2 text-center text-[11px] font-bold border-b-2 transition-all uppercase tracking-widest
                      ${selectedRoundId === round.id 
                        ? 'border-[#00ccff] text-white bg-[#001122]' 
                        : 'border-transparent text-[#667788] hover:text-[#00ccff] hover:bg-[#001122]/50'
                      }
                   `}
                 >
                   {round.id}
                 </button>
               ))}
            </div>

            {/* Category Filter Controls */}
            <div className="bg-[#0a111a] border border-[#223344] p-3 rounded mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                    <button 
                      onClick={() => { setViewMode('alliances'); setSelectedCategory('experience'); }}
                      className={`px-4 py-1.5 rounded text-[10px] uppercase font-bold border transition-all ${viewMode === 'alliances' ? 'bg-[#002244] text-[#00ccff] border-[#004488] shadow-[0_0_10px_rgba(0,200,255,0.1)]' : 'bg-transparent text-[#667788] border-[#223344] hover:border-[#445566]'}`}
                    >
                      Alliances
                    </button>
                    <button 
                      onClick={() => { setViewMode('players'); setSelectedCategory('experience'); }}
                      className={`px-4 py-1.5 rounded text-[10px] uppercase font-bold border transition-all ${viewMode === 'players' ? 'bg-[#002244] text-[#00ccff] border-[#004488] shadow-[0_0_10px_rgba(0,200,255,0.1)]' : 'bg-transparent text-[#667788] border-[#223344] hover:border-[#445566]'}`}
                    >
                      Players
                    </button>
                </div>

                <select 
                  className="bg-[#050a10] text-white border border-[#223344] px-3 py-1.5 text-[11px] rounded outline-none focus:border-[#00ccff] min-w-[200px]"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryKey)}
                >
                  {getCategoryOptions().map(opt => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto bg-[#0a111a] border border-[#223344] rounded p-4 shadow-lg">
              <h2 className="text-[#00ccff] font-bold text-[14px] mb-4 uppercase tracking-widest border-b border-[#004488] pb-2">
                 {viewMode === 'alliances' ? 'Alliance Rankings' : 'Player Rankings'}
                 <span className="text-[#445566] text-[10px] ml-2 normal-case tracking-normal">// {getCategoryOptions().find(c => c.key === selectedCategory)?.label}</span>
              </h2>
              
              <table className="w-full border-collapse text-[11px] font-mono whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#002244] text-[#00ccff]">
                      <th className="p-2 uppercase tracking-wider w-[40px] text-center">#</th>
                      <th className="p-2 uppercase tracking-wider w-[350px] text-left">{viewMode === 'alliances' ? 'Alliance Name' : 'Name'}</th>
                      <th className="p-2 uppercase tracking-wider text-left">{viewMode === 'alliances' ? 'Leader' : 'Level'}</th>
                      <th className="p-2 uppercase tracking-wider text-left">{viewMode === 'alliances' ? 'Mem' : 'Race'}</th>
                      <th className="p-2 uppercase tracking-wider text-right">
                          {selectedCategory === 'experience' ? 'Total EXP' : 
                           selectedCategory === 'kills' ? 'Total Kills' :
                           selectedCategory === 'avg_kills' ? 'KAvg' :
                           selectedCategory === 'pirated' ? 'Total EXP' : 
                           selectedCategory === 'raids' ? 'Total EXP' : 'Value'}
                      </th>
                      <th className="p-2 uppercase tracking-wider text-right w-[120px]">
                          {selectedCategory === 'experience' ? (viewMode === 'alliances' ? 'Avg EXP' : '') : 
                           selectedCategory === 'kills' ? (viewMode === 'alliances' ? 'Total Kills' : 'Kills') :
                           selectedCategory === 'avg_kills' ? 'Kills' :
                           selectedCategory === 'pirated' ? 'Pirated' : 
                           selectedCategory === 'raids' ? 'Raided' : ''}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#112233]">
                    {tableData.length > 0 ? (
                      tableData.map((row) => (
                        <tr key={row.rank} className="hover:bg-[#ffffff]/5 transition-colors group">
                          <td className="p-2 text-center text-gray-500">{row.rank}</td>
                          
                          {/* Name / Banner Column */}
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                               {viewMode === 'alliances' ? (
                                   // Alliance View: Single Banner 50x20
                                   row.banner && <img src={`https://picsum.photos/seed/${row.banner}/50/20`} alt="Tag" className="w-[50px] h-[20px] object-cover border border-[#334455] opacity-80 group-hover:opacity-100 block" />
                               ) : (
                                   // Player View: Combined Tags with 0 gap
                                   <div className="flex items-center gap-0 border border-[#334455] select-none">
                                      {/* Alliance Tag Slot (50x20) */}
                                      {row.guild ? (
                                          <img src={`https://picsum.photos/seed/${row.guild}/50/20`} alt="Alliance" className="w-[50px] h-[20px] object-cover opacity-80 group-hover:opacity-100 block bg-[#111]" />
                                      ) : (
                                          <div className="w-[50px] h-[20px] bg-transparent"></div>
                                      )}
                                      
                                      {/* Player Tag Slot (150x20) */}
                                      {row.banner ? (
                                          <img src={`https://picsum.photos/seed/${row.banner}/150/20`} alt="Player" className="w-[150px] h-[20px] object-cover opacity-80 group-hover:opacity-100 block bg-[#222]" />
                                      ) : (
                                          <div className="w-[150px] h-[20px] bg-[#000000]/30"></div>
                                      )}
                                   </div>
                               )}
                               
                               <span className="text-white font-bold truncate ml-1">{row.name}</span>
                            </div>
                          </td>

                          {/* Leader / Level */}
                          <td className="p-2 text-gray-400">
                              {viewMode === 'alliances' ? <span className="text-[#00ccff]">{row.leader}</span> : <span className="text-white font-bold">{row.level}</span>}
                          </td>

                          {/* Members / Race */}
                          <td className="p-2 text-gray-400">
                              {viewMode === 'alliances' ? row.members : row.race}
                          </td>
                          
                          {/* Primary Stat */}
                          <td className="p-2 text-right text-green-400 font-mono">
                              {row.value}
                          </td>

                          {/* Secondary Stat */}
                          <td className="p-2 text-right text-gray-500 font-mono">
                              {row.secondary || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                          No records found for this round.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
