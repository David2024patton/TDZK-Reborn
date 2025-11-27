import React, { useState, useEffect, useRef } from 'react';

interface TopPanelProps {
  onLogout: () => void;
  onToggleMobileMenu?: () => void;
  currentSector?: string;
  onWarp?: (sector: string) => void;
}

// --- Notification Types & Mock Data ---

type NotificationType = 'combat' | 'planet' | 'force' | 'alliance' | 'personal';

interface GameNotification {
  id: string;
  text: string;
  date: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Record<NotificationType, GameNotification[]> = {
  combat: [
    { id: 'c1', text: 'You were attacked by Silver Horde', date: '17:40', read: false },
    { id: 'c2', text: 'You attacked Dragon', date: '17:35', read: true },
  ],
  planet: [], 
  force: [
    { id: 'f1', text: 'Scout Drone #842 destroyed in 11200', date: '16:20', read: false },
    { id: 'f2', text: 'Combat Drone #112 engaged enemy', date: '16:15', read: true },
  ],
  alliance: [
    { id: 'a1', text: 'War declared on House Corrino', date: '15:00', read: false },
    { id: 'a2', text: 'New trade route established', date: '14:30', read: false },
    { id: 'a3', text: 'Base at 9999 under attack!', date: '14:00', read: true },
    { id: 'a4', text: 'Player X joined the alliance', date: '12:00', read: true },
    { id: 'a5', text: 'Treaty signed with Rebels', date: '10:00', read: true },
    { id: 'a6', text: 'Old message...', date: '09:00', read: true },
  ],
  personal: [
     { id: 'p1', text: 'Message from mixi: "Help!"', date: '17:44', read: false },
  ]
};

// --- Notification Component ---

interface NotificationItemProps {
  type: NotificationType;
  items: GameNotification[];
  isActive: boolean;
  onDelete: (ids: string[]) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ type, items, isActive, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const hasItems = items.length > 0;

  // Config based on type
  const config = {
    combat: { 
      label: 'Combat Reports', 
      color: 'text-red-500', 
      border: 'border-red-500', 
      bg: 'bg-red-500',
      shadow: 'shadow-red-500/50',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    },
    planet: { 
      label: 'Planet Reports', 
      color: 'text-orange-500', 
      border: 'border-orange-500', 
      bg: 'bg-orange-500',
      shadow: 'shadow-orange-500/50',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18" />
        </svg>
      )
    },
    force: { 
      label: 'Force Reports', 
      color: 'text-yellow-400', 
      border: 'border-yellow-400', 
      bg: 'bg-yellow-400',
      shadow: 'shadow-yellow-400/50',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2L4 10h5v12h6V10h5L12 2z" />
        </svg>
      )
    },
    alliance: { 
      label: 'Alliance Messages', 
      color: 'text-green-500', 
      border: 'border-green-500', 
      bg: 'bg-green-500',
      shadow: 'shadow-green-500/50',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      )
    },
    personal: { 
      label: 'Personal Messages', 
      color: 'text-blue-400', 
      border: 'border-blue-400', 
      bg: 'bg-blue-400',
      shadow: 'shadow-blue-400/50',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      )
    }
  }[type];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(i => i.id)));
    }
  };

  const handleDelete = () => {
    onDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={config.label}
        className={`
          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
          border relative group
          ${hasItems 
            ? `${config.border} ${config.color} bg-opacity-40 ${config.bg} shadow-[0_0_15px_currentColor] animate-pulse` 
            : 'border-[#556677] text-[#556677] bg-[#0f172a] hover:border-[#94a3b8] hover:text-[#94a3b8] hover:bg-[#1e293b] hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'
          }
        `}
      >
        {hasItems && <div className={`absolute inset-0 rounded-full opacity-40 ${config.bg} blur-[2px]`}></div>}
        <div className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {config.icon}
        </div>
        {hasItems && (
          <div className="absolute -top-1 -right-1 bg-black border border-white text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none z-20 shadow-sm">
            {items.length > 9 ? '9+' : items.length}
          </div>
        )}
        {!isOpen && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black border border-[#445566] text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                {config.label}
            </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-3 left-0 w-[280px] bg-[#080c14] border border-[#334455] rounded-md shadow-[0_5px_20px_rgba(0,0,0,0.9)] z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
           <div className={`px-3 py-2 border-b border-[#223344] flex justify-between items-center bg-[#0c121e]`}>
              <span className={`font-bold text-[11px] ${config.color}`}>{config.label}</span>
              <div className="text-[9px] text-gray-500">Last 5</div>
           </div>
           <div className="max-h-[200px] overflow-y-auto scrollbar-retro">
              {items.length === 0 ? (
                  <div className="p-4 text-center text-gray-600 text-[10px] italic">No new reports.</div>
              ) : (
                  items.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex gap-2 p-2 border-b border-[#112233] hover:bg-[#112233] transition-colors group/item">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelect(item.id)}
                            className="mt-0.5 bg-black border border-gray-600 rounded-sm w-3 h-3 cursor-pointer accent-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                              <div className={`text-[10px] truncate ${item.read ? 'text-gray-400' : 'text-white font-bold'}`}>
                                  {item.text}
                              </div>
                              <div className="text-[8px] text-gray-600">{item.date}</div>
                          </div>
                      </div>
                  ))
              )}
           </div>
           {items.length > 0 && (
               <div className="p-2 bg-[#0c121e] border-t border-[#223344] flex justify-between items-center gap-2">
                  <button 
                    onClick={handleSelectAll}
                    className="text-[9px] text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-[#223344] transition-colors"
                  >
                    {selectedIds.size === items.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button 
                    onClick={handleDelete}
                    disabled={selectedIds.size === 0}
                    className="text-[9px] bg-red-900/30 border border-red-900/50 text-red-400 px-2 py-1 rounded hover:bg-red-900/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Delete Selected
                  </button>
               </div>
           )}
        </div>
      )}
    </div>
  );
};


// --- Main TopPanel Component ---

export const TopPanel: React.FC<TopPanelProps> = ({ onLogout, onToggleMobileMenu, currentSector, onWarp }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [warpSector, setWarpSector] = useState('');

  const deleteNotifications = (type: NotificationType, ids: string[]) => {
    setNotifications(prev => ({
      ...prev,
      [type]: prev[type].filter(n => !ids.includes(n.id))
    }));
  };

  const handleEngage = () => {
      if (warpSector && onWarp) {
          onWarp(warpSector);
          setWarpSector('');
      }
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center">
        
        {/* Content area - Flex container for Notifications and Warp Drive */}
        <div className="relative w-full flex items-center justify-between px-4 md:px-8 pt-2">
            
            {/* Notifications Area */}
            <div className="flex items-center gap-3">
                 <NotificationItem 
                    type="combat" 
                    items={notifications.combat} 
                    isActive={notifications.combat.length > 0} 
                    onDelete={(ids) => deleteNotifications('combat', ids)}
                  />
                  <NotificationItem 
                    type="planet" 
                    items={notifications.planet} 
                    isActive={notifications.planet.length > 0} 
                    onDelete={(ids) => deleteNotifications('planet', ids)}
                  />
                  <NotificationItem 
                    type="force" 
                    items={notifications.force} 
                    isActive={notifications.force.length > 0} 
                    onDelete={(ids) => deleteNotifications('force', ids)}
                  />
                  <NotificationItem 
                    type="alliance" 
                    items={notifications.alliance} 
                    isActive={notifications.alliance.length > 0} 
                    onDelete={(ids) => deleteNotifications('alliance', ids)}
                  />
                  <NotificationItem 
                    type="personal" 
                    items={notifications.personal} 
                    isActive={notifications.personal.length > 0} 
                    onDelete={(ids) => deleteNotifications('personal', ids)}
                  />
            </div>

            {/* Warp Drive Area */}
            <div className="flex items-center gap-2 bg-[#000000]/60 border border-[#003366] p-1 rounded-md shadow-lg backdrop-blur-sm">
                <div className="text-[9px] font-bold text-[#00ccff] uppercase px-1 tracking-wider hidden sm:block">Warp To:</div>
                <input 
                    type="text" 
                    value={warpSector}
                    onChange={(e) => setWarpSector(e.target.value)}
                    placeholder={currentSector || "Sector #"} 
                    className="w-[80px] bg-[#001122] border border-[#004488] text-white px-2 py-1 text-[11px] rounded-sm focus:outline-none focus:border-[#00ccff] shadow-inner"
                    onKeyDown={(e) => e.key === 'Enter' && handleEngage()}
                />
                <button 
                    onClick={handleEngage}
                    className="bg-gradient-to-b from-[#004488] to-[#002244] text-white border border-[#0055aa] text-[10px] px-3 py-1 rounded-sm hover:from-[#0055aa] hover:to-[#003355] hover:shadow-[0_0_10px_rgba(0,100,255,0.4)] transition-all uppercase font-bold tracking-wide"
                >
                    Engage
                </button>
            </div>

        </div>
    </div>
  );
};
