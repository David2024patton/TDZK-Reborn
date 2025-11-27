import React from 'react';

interface NewsItemProps {
  date: string;
  title: string;
  type?: 'normal' | 'alert';
  children: React.ReactNode;
}

const NewsItem: React.FC<NewsItemProps> = ({ date, title, type = 'normal', children }) => {
  const titleColor = type === 'alert' ? 'text-[#00ccff]' : 'text-[#00ccff]';

  return (
    <div className="mb-6">
      <div className="news-header py-1 px-2 mb-2 border border-[#002244]">
        <span className="text-white font-bold mr-2">{date}</span>
        <span className={`${titleColor} font-bold hover:underline cursor-pointer`}>{title}</span>
      </div>
      <div className="px-2 text-[#dddddd] leading-relaxed text-justify">
        {children}
      </div>
    </div>
  );
};

export const NewsSection: React.FC = () => {
  return (
    <div className="flex flex-col">
      <NewsItem date="05/20/04" title="AOL Ban" type="alert">
        Due to the massive ongoing abuse of our services by certain users, we are forced to ban a large number of european AOL users from connecting to our servers. Hopefully, this will only be temporary as we are working on finding solutions to prevent this from happening in the future, so that all may enjoy the game as it is intended to be played.
      </NewsItem>

      <NewsItem date="05/10/04" title="Upgrade Downtime">
        TDZK will be taken down today, Monday May 17th, at 10:30 AM server time to install some hardware upgrades. Downtime should last an hour or less.
      </NewsItem>

       <NewsItem date="04/22/04" title="New Universe Reset">
        The universe has been reset. All player accounts have been archived to the History Book. Prepare for a new era of conquest. Good luck to all factions.
      </NewsItem>
    </div>
  );
};