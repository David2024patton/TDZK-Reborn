
import React, { useState, useEffect, useMemo } from 'react';
import { NavBar } from './components/NavBar';
import { LoginForm } from './components/LoginForm';
import { NewsSection } from './components/NewsSection';
import { Sidebar } from './components/Sidebar';
import { GameLayout } from './components/game/GameLayout';
import { HelpView } from './components/HelpView';
import { StatisticsView } from './components/StatisticsView';
import { HallOfFameView } from './components/HallOfFameView';
import { GenericPageView } from './components/GenericPageView';
import { SplashLoader } from './components/SplashLoader';

// Helper to generate random star positions as a box-shadow string
const generateStars = (n: number) => {
  let value = '';
  for (let i = 0; i < n; i++) {
    // x position in vw to handle resizing, y in px matching the loop height
    value += `${Math.random() * 100}vw ${Math.random() * 2000}px #FFF, `;
  }
  return value.slice(0, -2);
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Modal Views
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showHoF, setShowHoF] = useState<boolean>(false);
  const [activeGenericPage, setActiveGenericPage] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState<string>("");
  
  // Memoize star patterns to avoid regenerating on every render
  const smallStars = useMemo(() => generateStars(700), []);
  const mediumStars = useMemo(() => generateStars(200), []);
  const bigStars = useMemo(() => generateStars(100), []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format similar to "11:39:43 EDT"
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Navigation Handlers ---

  const resetViews = () => {
    setShowHelp(false);
    setShowStats(false);
    setShowHoF(false);
    setActiveGenericPage(null);
  };

  const handleNavFromModal = (target: string) => {
    resetViews();
    if (target === 'help') setShowHelp(true);
    else if (target === 'stats') setShowStats(true);
    else if (target === 'hof') setShowHoF(true);
    else if (target === 'home') { /* Just close */ }
    else {
      // It's a generic page
      setActiveGenericPage(target);
    }
  };

  const handleGenericLink = (pageName: string) => {
    resetViews();
    setActiveGenericPage(pageName);
  };

  if (isLoggedIn) {
    return <GameLayout onLogout={() => setIsLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen w-full bg-black text-[#b0b0b0] pb-20 relative overflow-hidden">
      
      {/* Starfield Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="star-layer" 
          style={{ '--shadows': smallStars, animationDuration: '100s' } as React.CSSProperties} 
        />
        <div 
          className="star-layer" 
          style={{ '--shadows': mediumStars, animationDuration: '150s', width: '2px', height: '2px' } as React.CSSProperties} 
        />
        <div 
          className="star-layer" 
          style={{ '--shadows': bigStars, animationDuration: '200s', width: '3px', height: '3px' } as React.CSSProperties} 
        />
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-[900px] mx-auto border-x border-[#111111] bg-black/90 min-h-screen shadow-2xl shadow-blue-900/5">
        
        {/* Splash Loader handles Header and Banner logic internally */}
        <SplashLoader />
        
        <NavBar 
          onHelpClick={() => handleNavFromModal('help')}
          onStatsClick={() => handleNavFromModal('stats')}
          onHoFClick={() => handleNavFromModal('hof')}
          onGenericClick={handleGenericLink}
        />
        
        <LoginForm onLogin={() => setIsLoggedIn(true)} />

        <div className="flex flex-col md:flex-row mt-4 px-2 gap-4">
          <div className="flex-1">
            <NewsSection />
          </div>
          
          <div className="w-full md:w-[280px] shrink-0">
            <Sidebar 
              currentTime={currentTime} 
              onLinkClick={handleGenericLink}
            />
          </div>
        </div>

      </div>

      {/* Modal Views */}
      {showHelp && <HelpView onClose={() => setShowHelp(false)} />}
      {showStats && <StatisticsView onClose={() => setShowStats(false)} onNavigate={handleNavFromModal} />}
      {showHoF && <HallOfFameView onClose={() => setShowHoF(false)} onNavigate={handleNavFromModal} />}
      {activeGenericPage && (
        <GenericPageView 
          initialPage={activeGenericPage} 
          onClose={() => setActiveGenericPage(null)} 
          onNavigate={handleNavFromModal} 
        />
      )}
    </div>
  );
}
