
import React, { useState, useMemo } from 'react';
import { SITE_CONTENT } from '../data/siteContent';

interface GenericPageViewProps {
  initialPage: string;
  onClose: () => void;
  onNavigate: (view: string) => void; // Generic string to handle 'help', 'stats', 'hof', or other content pages
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
  { label: "Hall of Fame", action: 'hof' },
  { label: "Statistics", action: 'stats' },
  { label: "Downloads", action: 'Downloads' },
  { label: "Merchandise", action: 'Merchandise' },
];

export const GenericPageView: React.FC<GenericPageViewProps> = ({ initialPage, onClose, onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fallback if page doesn't exist
  const content = SITE_CONTENT[currentPage] || {
    title: currentPage,
    subtitle: "UNKNOWN_DATA",
    type: "text",
    content: "No data available for this section."
  };

  const handleLinkClick = (action: string) => {
    if (action === 'home') {
        onClose();
    } else if (action === 'help' || action === 'stats' || action === 'hof') {
        onNavigate(action);
    } else {
        setCurrentPage(action);
    }
  };

  const renderContent = () => {
    if (content.type === 'form' && currentPage === 'Register!') {
        return (
            <div className="bg-[#0a111a] border border-[#223344] p-6 rounded max-w-2xl">
                <p className="text-[#cccccc] text-[12px] mb-6">{content.content as string}</p>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#00ccff] text-[10px] uppercase font-bold mb-1">Login Name</label>
                            <input type="text" className="w-full bg-[#050a10] border border-[#334455] text-white px-2 py-1.5 text-[11px] focus:border-[#00ccff] outline-none" />
                        </div>
                        <div>
                            <label className="block text-[#00ccff] text-[10px] uppercase font-bold mb-1">E-Mail Address</label>
                            <input type="email" className="w-full bg-[#050a10] border border-[#334455] text-white px-2 py-1.5 text-[11px] focus:border-[#00ccff] outline-none" />
                        </div>
                        <div>
                            <label className="block text-[#00ccff] text-[10px] uppercase font-bold mb-1">Password</label>
                            <input type="password" className="w-full bg-[#050a10] border border-[#334455] text-white px-2 py-1.5 text-[11px] focus:border-[#00ccff] outline-none" />
                        </div>
                        <div>
                            <label className="block text-[#00ccff] text-[10px] uppercase font-bold mb-1">Confirm Password</label>
                            <input type="password" className="w-full bg-[#050a10] border border-[#334455] text-white px-2 py-1.5 text-[11px] focus:border-[#00ccff] outline-none" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#223344]">
                        <label className="block text-[#00ccff] text-[10px] uppercase font-bold mb-2">Select Race</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['Derivian', 'Zallun', 'Kitaran', 'Tamaran', 'Sniv', 'Wraith', 'Quelaar'].map(race => (
                                <label key={race} className="flex items-center gap-2 bg-[#020408] border border-[#223344] p-2 hover:border-[#00ccff] cursor-pointer">
                                    <input type="radio" name="race" className="accent-[#00ccff]" />
                                    <span className="text-[#aaaaaa] text-[10px] font-bold">{race}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                        <input type="checkbox" className="accent-[#00ccff]" />
                        <span className="text-[#8899aa] text-[10px]">I agree to the Terms of Agreement and Rules.</span>
                    </div>

                    <button className="bg-[#002244] border border-[#004488] text-[#00ccff] px-6 py-2 text-[11px] font-bold uppercase hover:bg-[#003366] hover:text-white hover:shadow-[0_0_10px_rgba(0,100,255,0.4)] transition-all mt-2">
                        Initiate Registration
                    </button>
                </div>
            </div>
        );
    }

    if (content.type === 'list' && Array.isArray(content.content)) {
        return (
            <div className="grid grid-cols-1 gap-4">
                {content.content.map((item, i) => (
                    <div key={i} className="bg-[#0a111a] border border-[#223344] p-4 rounded flex justify-between items-center hover:border-[#004488] group cursor-pointer">
                        <div>
                            <h3 className="text-white font-bold text-[12px] group-hover:text-[#00ccff]">{item.label}</h3>
                            <p className="text-[#8899aa] text-[10px]">{item.desc}</p>
                        </div>
                        <button className="text-[#00ccff] text-[10px] border border-[#004488] px-3 py-1 hover:bg-[#002244] uppercase">Download</button>
                    </div>
                ))}
            </div>
        );
    }

    if (content.type === 'external') {
        return (
            <div className="bg-[#0a111a] border border-[#223344] p-8 rounded text-center">
                <div className="mb-4 text-[#00ccff] text-[48px] animate-pulse">
                    ⚠
                </div>
                <p className="text-white text-[14px] mb-4 whitespace-pre-line">{content.content as string}</p>
                <button className="bg-[#004488] text-white px-6 py-2 rounded font-bold text-[11px] hover:bg-[#0055aa]">
                    Open Link in New Window
                </button>
            </div>
        );
    }

    // Default Text
    return (
        <div className="bg-[#0a111a] border border-[#223344] p-6 rounded">
            <div className="text-[#cccccc] text-[12px] leading-relaxed whitespace-pre-line font-verdana">
                {content.content as string}
            </div>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020408] flex flex-col font-verdana text-[#cccccc] animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="h-[60px] shrink-0 bg-[#050a10] border-b border-[#223344] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-900/20 border border-blue-500/50 rounded flex items-center justify-center text-blue-400 font-bold">
                i
              </div>
              <div>
                  <h1 className="text-white font-bold text-[16px] tracking-wide uppercase">{content.title}</h1>
                  <div className="text-[#445566] text-[9px] tracking-[0.3em]">{content.subtitle}</div>
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
                        ${currentPage === link.label
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
          <div className="max-w-[800px] mx-auto">
             <div className="flex justify-between items-end mb-6 border-b border-[#223344] pb-2">
                <h1 className="text-[28px] md:text-[32px] font-bold text-white drop-shadow-[0_0_10px_rgba(0,200,255,0.3)]">{content.title}</h1>
                <div className="text-[#445566] font-mono text-[9px] hidden md:block">SECURE_DATA_STREAM</div>
            </div>

            {renderContent()}

          </div>
        </div>
      </div>
    </div>
  );
};
