
import React, { useState } from 'react';

interface AllianceViewProps {
  onNavigate?: (view: string) => void;
  initialTab?: AllianceTab;
}

type AllianceTab = 'list' | 'roster' | 'relations' | 'forum' | 'bank' | 'ranks' | 'options';

// Helper for generating seed-based images
const getAllyTag = (seed: string) => `https://picsum.photos/seed/${seed.replace(/\W/g, '')}/50/20`;
const getPersonalTag = (seed: string) => `https://picsum.photos/seed/${seed.replace(/\W/g, '')}/150/20`;

interface Member {
  id: string;
  name: string;
  rank: string;
  level: number;
  race: string;
  status: 'Online' | 'Offline';
  guild: string;
}

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: "Sparky", rank: "Emperor", level: 128, race: "Kitaran", status: "Online", guild: "Renegades" },
  { id: '2', name: "Cryton", rank: "High Lord", level: 612, race: "Zallun", status: "Offline", guild: "Renegades" },
  { id: '3', name: "Wolfi", rank: "Warlord", level: 445, race: "Derivian", status: "Online", guild: "Renegades" },
  { id: '4', name: "Spuck", rank: "Grunt", level: 88, race: "Sniv", status: "Online", guild: "Renegades" },
  { id: '5', name: "Mixi", rank: "Trader", level: 210, race: "Tamaran", status: "Online", guild: "Renegades" },
  { id: '6', name: "Neo", rank: "Recruit", level: 45, race: "Human", status: "Offline", guild: "Renegades" },
];

const MOCK_ALLIANCES = [
  { rank: 1, name: "Lords of Fear - The Pyrites", leader: "snuff", members: 29, totalExp: "10,384,275,510", avgExp: "358,078,465" },
  { rank: 2, name: "Galactic Trade Guild", leader: "iYRe", members: 29, totalExp: "9,568,715,286", avgExp: "329,955,699" },
  { rank: 3, name: "Phoenix Talon", leader: "GNU Order", members: 29, totalExp: "9,454,317,362", avgExp: "326,010,943" },
  { rank: 4, name: "Silver Horde", leader: "Gryffin", members: 28, totalExp: "9,095,198,335", avgExp: "324,828,511" },
  { rank: 5, name: "Lords of Fear", leader: "LordFear", members: 30, totalExp: "8,351,646,634", avgExp: "278,388,221" },
  { rank: 6, name: "Silver Horde.", leader: "Greven", members: 30, totalExp: "8,253,004,976", avgExp: "275,100,165" },
  { rank: 7, name: "Aerodyne Siege Corporation", leader: "JshWright", members: 30, totalExp: "8,089,284,101", avgExp: "269,642,803" },
  { rank: 8, name: "Armada Lusitana", leader: "Camoes", members: 27, totalExp: "7,894,330,329", avgExp: "292,382,604" },
  { rank: 9, name: "Shinsengumi", leader: "Dagrim", members: 26, totalExp: "7,670,688,719", avgExp: "295,026,489" },
  { rank: 10, name: "Shinsen Gumi", leader: "Ace Lee", members: 30, totalExp: "7,097,978,604", avgExp: "236,599,286" },
];

interface RosterRowProps {
  member: Member;
  onPromote: (id: string) => void;
  onKick: (id: string) => void;
}

const RosterRow: React.FC<RosterRowProps> = ({ member, onPromote, onKick }) => {
  const allyUrl = getAllyTag(member.guild);
  const personalUrl = getPersonalTag(member.name);
  const isOnline = member.status === 'Online';

  const getRaceColor = (r: string) => {
    switch (r) {
      case 'Kitaran': return 'text-red-400';
      case 'Derivian': return 'text-blue-400';
      case 'Zallun': return 'text-green-400';
      case 'Wraith': return 'text-purple-400';
      case 'Taenarian': return 'text-yellow-200';
      case 'Sniv': return 'text-orange-400';
      default: return 'text-[#aaccff]';
    }
  };

  return (
    <div className="grid grid-cols-[50px_150px_1fr_80px_30px_50px_70px] gap-x-1 border-b border-[#002244] hover:bg-[#001133] text-[9px] group cursor-default bg-[#020408] transition-colors py-1 px-1 items-center">
      {/* Banners */}
      <div className="flex items-center justify-center">
        <img src={allyUrl} alt="Ally" className="w-[50px] h-[20px] object-cover block bg-[#111] border border-[#333]" />
      </div>
      <div className="flex items-center justify-start">
        <img src={personalUrl} alt="Personal" className="w-[150px] h-[20px] object-cover block bg-[#222] border border-[#333] border-l-0" />
      </div>

      {/* Name */}
      <div className="pl-2 overflow-hidden">
        <div className="text-white font-bold text-[10px] truncate">{member.name}</div>
      </div>

      {/* Rank */}
      <div className="text-right pr-2">
        <span className="text-[#eccc66] font-bold text-[9px]">{member.rank}</span>
      </div>

      {/* Level */}
      <div className="text-right px-1">
        <span className="text-white text-[9px] font-bold">L: {member.level}</span>
      </div>

      {/* Race */}
      <div className="text-right pr-1">
        <span className={`${getRaceColor(member.race)} text-[9px]`}>{member.race}</span>
      </div>

      {/* Status & Actions */}
      <div className="flex flex-col items-end gap-0.5 justify-center pr-1">
        {isOnline ? (
          <span className="text-[#44ff44] text-[8px] font-mono tracking-tight leading-none">[ONLINE]</span>
        ) : (
          <span className="text-[#666666] text-[8px] font-mono tracking-tight leading-none">[OFFLINE]</span>
        )}

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onPromote(member.id)}
            title="Promote Member"
            className="w-4 h-4 flex items-center justify-center bg-[#221100] border border-orange-600 text-orange-500 hover:bg-orange-600 hover:text-white text-[8px] font-bold rounded-[1px]"
          >
            P
          </button>
          <button
            onClick={() => onKick(member.id)}
            title="Kick Member"
            className="w-4 h-4 flex items-center justify-center bg-[#220000] border border-red-600 text-red-500 hover:bg-red-600 hover:text-white text-[8px] font-bold rounded-[1px]"
          >
            K
          </button>
        </div>
      </div>
    </div>
  );
};

export const AllianceView: React.FC<AllianceViewProps> = ({ onNavigate, initialTab = 'roster' }) => {
  const [activeTab, setActiveTab] = useState<AllianceTab>(initialTab);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

  // Editable State
  const [allianceName, setAllianceName] = useState("RENEGADES");
  const [motto, setMotto] = useState(`We're broke, we've been largely undershipped for a while, yet we won't keel over into inactivity or stop trying. For we have something you don't.\nWe have..\n\nFRIGATES\n\nIf it's all gone pants and you just don't care - Buy a Frigate\n\nIf you can't afford new ships and there's no reason to bother trying to fund one - Buy a Frigate\n\nIf NG is complaining about our 'un-Renegade' methods - He can bloody well buy a frigate\n\nBecause we're having fun - In Frigates\n\nSo screw you NG. Screw you. I will trash every damn ship we have over and over in the name of pissing on your opinion. Love ~Spuck\n\nHail Emperor.\n\nBeer Owns You`);
  const [leaderMessage, setLeaderMessage] = useState(`If you're new to being a Renegade a quick recap:\n\n1. What leadership says, goes. ie. |Sparky|, Cryton, Wolfi (I dont care if he doesnt want to be a leader or not, I still take orders from him)\n2. You do NOT play with yourself. If you can help someone at your own expense. You will. If you insist on solo hunting, you had better be good at it and it had better give us something to jump.\n3. Love it.`);
  const [leaderInfo, setLeaderInfo] = useState("For leader type stuff: || |Sparky| (128) || Cryton (612) || #rennies");

  const handleTabClick = (tab: AllianceTab) => {
    setActiveTab(tab);
  };

  const handleKick = (id: string) => {
    if (window.confirm("Are you sure you want to kick this member?")) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const handlePromote = (id: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        let newRank = m.rank;
        if (m.rank === 'Recruit') newRank = 'Grunt';
        else if (m.rank === 'Grunt') newRank = 'Trader';
        else if (m.rank === 'Trader') newRank = 'Warlord';
        else if (m.rank === 'Warlord') newRank = 'High Lord';
        return { ...m, rank: newRank };
      }
      return m;
    }));
  };

  const renderNavBar = () => (
    <div className="flex flex-wrap justify-center gap-0 bg-[#000033] border-b border-[#000066] w-full shrink-0">
      {[
        { id: 'list', label: 'Alliance List' },
        { id: 'roster', label: 'Roster' },
        { id: 'relations', label: 'Relations' },
        { id: 'forum', label: 'Forum' },
        { id: 'bank', label: 'Bank' },
        { id: 'ranks', label: 'Ranks' },
        { id: 'options', label: 'Options' },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id as AllianceTab)}
          className={`
            px-4 py-1 text-[11px] font-bold border-r border-[#000066] last:border-r-0 transition-colors
            ${activeTab === tab.id
              ? 'text-white bg-[#000066]'
              : 'text-[#8888cc] hover:text-white hover:bg-[#000044]'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  // --- SUB-VIEWS ---

  const renderRoster = () => (
    <div className="w-full max-w-[800px] flex flex-col items-center text-center animate-in fade-in duration-300">

      {/* Header Graphic Placeholder / Text */}
      <div className="mt-8 mb-2">
        <div className="bg-[#330000] text-white px-2 py-0.5 text-[12px] inline-block mb-1 border border-[#660000]">&lt;3 {allianceName.charAt(0) + allianceName.slice(1).toLowerCase()} &lt;3</div>
      </div>

      <h1 className="text-[48px] font-bold text-[#ff0000] leading-none mb-4 tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] uppercase font-impact">
        {allianceName}
      </h1>

      {/* Motto Section */}
      <div className="text-[#cc0000] text-[12px] font-bold whitespace-pre-wrap mb-6 max-w-[600px] leading-relaxed">
        {motto.split('\n').map((line, i) => {
          if (line.includes('FRIGATES')) {
            return <div key={i} className="text-[24px] my-2 text-[#ff0000] uppercase tracking-widest">{line}</div>;
          }
          return <div key={i}>{line}</div>;
        })}
      </div>

      {/* Leader Footer Info */}
      <div className="text-[#cc0000] text-[10px] mb-8">
        {leaderInfo}
      </div>

      {/* Leader Message Box */}
      <div className="w-full max-w-[600px] bg-[#000033] border border-[#000066] mb-8 text-left shadow-[0_0_20px_rgba(0,0,100,0.5)]">
        <div className="bg-[#000022] text-[#ffff00] font-bold text-center py-1 border-b border-[#000066] text-[12px]">
          Message from the Alliance Leader:
        </div>
        <div className="p-4 text-[#aaaaaa] text-[11px] whitespace-pre-wrap font-verdana leading-relaxed">
          {leaderMessage}
        </div>
      </div>

      {/* Roster Grid */}
      <div className="w-full max-w-[700px] mb-12 flex flex-col">
        {/* Header Row */}
        <div className="bg-gradient-to-r from-[#001133] via-[#002244] to-[#000011] border border-[#003366] border-b-0 py-1 px-1 grid grid-cols-[50px_150px_1fr_80px_30px_50px_70px] gap-x-1 text-[#667788] text-[8px] uppercase tracking-wider font-bold items-center">
          <div className="text-center">TAG</div>
          <div className="text-left pl-1">BANNER</div>
          <div className="text-left pl-2">NAME</div>
          <div className="text-right pr-2">RANK</div>
          <div className="text-right px-1">LVL</div>
          <div className="text-right pr-1">RACE</div>
          <div className="text-right pr-1">ACTION</div>
        </div>

        {/* List Body */}
        <div className="border border-[#003366] bg-black/50 shadow-lg rounded-b-sm overflow-hidden flex flex-col backdrop-blur-sm">
          {members.map((m) => (
            <RosterRow key={m.id} member={m} onPromote={handlePromote} onKick={handleKick} />
          ))}
          {members.length === 0 && (
            <div className="p-4 text-center text-[#445566] italic text-[10px]">
              No members found.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderOptions = () => (
    <div className="w-full max-w-[600px] mt-8 p-4 border border-[#333333] bg-[#050505]">
      <h2 className="text-[#ff0000] font-bold text-[16px] mb-4 border-b border-[#330000] pb-2">Alliance Options</h2>

      <div className="mb-4">
        <label className="block text-[#cc0000] text-[10px] font-bold mb-1">Alliance Name</label>
        <input
          type="text"
          value={allianceName}
          onChange={(e) => setAllianceName(e.target.value)}
          className="w-full bg-[#110000] border border-[#330000] text-[#ffaaaa] px-2 py-1 text-[11px] outline-none focus:border-[#ff0000]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[#cc0000] text-[10px] font-bold mb-1">Public Motto (Top Message)</label>
        <textarea
          value={motto}
          onChange={(e) => setMotto(e.target.value)}
          className="w-full h-[150px] bg-[#110000] border border-[#330000] text-[#ffaaaa] px-2 py-1 text-[11px] outline-none focus:border-[#ff0000] font-mono"
        />
        <div className="text-gray-600 text-[9px] mt-1">Supports simple formatting. Use newline for breaks.</div>
      </div>

      <div className="mb-4">
        <label className="block text-[#0000cc] text-[10px] font-bold mb-1">Leader Message (Internal)</label>
        <textarea
          value={leaderMessage}
          onChange={(e) => setLeaderMessage(e.target.value)}
          className="w-full h-[150px] bg-[#000011] border border-[#000033] text-[#aaaaff] px-2 py-1 text-[11px] outline-none focus:border-[#0000cc] font-mono"
        />
      </div>

      <div className="mb-6">
        <label className="block text-[#cc0000] text-[10px] font-bold mb-1">Leader Footer Info</label>
        <input
          type="text"
          value={leaderInfo}
          onChange={(e) => setLeaderInfo(e.target.value)}
          className="w-full bg-[#110000] border border-[#330000] text-[#ffaaaa] px-2 py-1 text-[11px] outline-none focus:border-[#ff0000]"
        />
      </div>

      <button
        onClick={() => setActiveTab('roster')}
        className="bg-[#330000] text-[#ff0000] border border-[#660000] px-4 py-1 text-[11px] font-bold uppercase hover:bg-[#550000] hover:text-white transition-colors"
      >
        Save Changes
      </button>
    </div>
  );

  const renderList = () => (
    <div className="w-full max-w-[95%] mt-6 p-2">
      <div className="mb-4 border-b border-[#004488] pb-1 flex justify-between items-end">
        <h2 className="text-[#00ccff] font-bold text-[16px] uppercase tracking-wider">
          ALLIANCE RANKINGS <span className="text-[#445566] text-[11px] normal-case ml-2 font-mono">// Ranked By Total EXP</span>
        </h2>
      </div>

      <div className="w-full min-w-[600px]">
        {/* Table Header */}
        <div className="grid grid-cols-[30px_1fr_80px_30px_90px_90px] gap-1 text-[#00ccff] font-bold text-[9px] uppercase mb-1 px-2 pb-1 border-b border-[#112233]">
          <div className="text-center">#</div>
          <div className="text-left">ALLIANCE NAME</div>
          <div className="text-left">LEADER</div>
          <div className="text-center">MEM</div>
          <div className="text-right">TOTAL EXP</div>
          <div className="text-right">AVG EXP</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0.5">
          {MOCK_ALLIANCES.map((a) => (
            <div key={a.rank} className="grid grid-cols-[30px_1fr_80px_30px_90px_90px] gap-1 items-center bg-[#050a10] border-b border-[#112233] hover:bg-[#0a1520] py-1.5 px-2 transition-colors group">

              {/* Rank */}
              <div className="text-[#667788] text-center text-[10px] font-mono">{a.rank}</div>

              {/* Name + Banner */}
              <div className="flex items-center gap-2 cursor-pointer overflow-hidden" onClick={() => setActiveTab('roster')}>
                <img
                  src={`https://picsum.photos/seed/${a.name.replace(/\s/g, '')}/50/20`}
                  alt="Banner"
                  className="w-[50px] h-[20px] object-cover border border-[#334455] opacity-80 group-hover:opacity-100 transition-opacity shrink-0"
                />
                <span className="text-white font-bold text-[10px] group-hover:text-[#00ccff] transition-colors truncate">{a.name}</span>
              </div>

              {/* Leader */}
              <div className="text-[#00ccff] text-[10px] truncate">{a.leader}</div>

              {/* Members */}
              <div className="text-[#8899aa] text-center text-[10px]">{a.members}</div>

              {/* Total EXP */}
              <div className="text-[#00ff00] text-right font-mono text-[10px] tracking-tight">{a.totalExp}</div>

              {/* Avg EXP */}
              <div className="text-[#8899aa] text-right font-mono text-[10px] tracking-tight">{a.avgExp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="mt-12 text-center">
      <h2 className="text-[#444444] font-bold text-[24px] mb-4">{title}</h2>
      <p className="text-[#666666] text-[11px]">Access Restricted or Under Construction.</p>
      <button onClick={() => setActiveTab('roster')} className="mt-4 text-[#00ccff] hover:underline text-[10px]">Return to Roster</button>
    </div>
  );

  return (
    <div className="w-full h-full bg-black flex flex-col items-center overflow-y-auto scrollbar-retro relative z-10">
      {renderNavBar()}

      <div className="flex-1 w-full flex flex-col items-center px-4 pb-10">
        {activeTab === 'roster' && renderRoster()}
        {activeTab === 'list' && renderList()}
        {activeTab === 'options' && renderOptions()}

        {['relations', 'forum', 'bank', 'ranks'].includes(activeTab) && renderPlaceholder(activeTab.toUpperCase())}
      </div>
    </div>
  );
};
