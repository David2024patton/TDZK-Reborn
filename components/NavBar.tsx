
import React from 'react';

interface NavBarProps {
  onHelpClick?: () => void;
  onStatsClick?: () => void;
  onHoFClick?: () => void;
  onGenericClick?: (page: string) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ onHelpClick, onStatsClick, onHoFClick, onGenericClick }) => {
  const [counts, setCounts] = React.useState({ online: 0, total: 0 });

  React.useEffect(() => {
    fetch('/api/online-players')
      .then(res => res.json())
      .then(data => setCounts({ online: data.count, total: data.total }))
      .catch(err => console.error("Failed to fetch counts:", err));
  }, []);

  const links = [
    "Web Board",
    "Statistics",
    "Downloads",
    "Help Files",
    "Hall of Fame",
    "Register!"
  ];

  const handleLinkClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    if (link === "Help Files") {
      onHelpClick?.();
    } else if (link === "Statistics") {
      onStatsClick?.();
    } else if (link === "Hall of Fame") {
      onHoFClick?.();
    } else {
      onGenericClick?.(link);
    }
  };

  return (
    <div className="w-full border-y border-[#003366] bg-[#000022]">
      <div className="flex flex-wrap items-center justify-between text-white px-2 py-1">
        <div className="flex divide-x divide-[#003366] flex-wrap">
          {links.map((link, index) => (
            <a
              key={index}
              href="#"
              onClick={(e) => handleLinkClick(e, link)}
              className={`px-3 hover:bg-[#001144] hover:text-[#00ccff] transition-colors ${index === 0 ? 'pl-1' : ''}`}
            >
              {link}
            </a>
          ))}
        </div>
        <div className="px-2 font-bold text-[10px] md:text-[11px] text-white mt-1 md:mt-0">
          <span className="text-white">{counts.online}</span><span className="text-[#666666]">/</span><span className="text-[#999999]">{counts.total}</span> Online Players
        </div>
      </div>
    </div>
  );
};
