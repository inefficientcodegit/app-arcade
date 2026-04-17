import React, { useState, useEffect } from 'react';

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

const PlayStoreIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor">
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
  </svg>
);

export default function App() {
  const [apps, setApps] = useState([]);
  const [activeAppIndex, setActiveAppIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // A simple shuffle function (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 1. INITIAL LOAD: Fetch, shuffle, and check URL for a specific game
  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        const dataUrl = `https://raw.githubusercontent.com/inefficientcodegit/showcase/main/arcade-data.json?t=${new Date().getTime()}`;
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error("Could not fetch data.");
        const gameData = await response.json();

        // Shuffle the data immediately upon receipt
        const shuffledGames = shuffleArray(gameData);

        // Check if there is a ?game= ID in the URL
        const params = new URLSearchParams(window.location.search);
        const gameId = params.get('game');

        let startIndex = 0;
        if (gameId) {
          const index = shuffledGames.findIndex(app => app.id === gameId);
          if (index !== -1) startIndex = index;
        }

        setApps(shuffledGames);
        setActiveAppIndex(startIndex);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchGamesData();
  }, []);

  // 2. UPDATE URL: When the active game changes, update the browser URL
  useEffect(() => {
    if (apps.length > 0 && apps[activeAppIndex]) {
      const currentApp = apps[activeAppIndex];
      const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?game=${currentApp.id}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }, [activeAppIndex, apps]);

  const filteredApps = apps.filter(app => (filter === 'all' ? true : app.status === filter));
  const activeApp = apps[activeAppIndex] || apps[0];

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSelectApp = (appId) => {
    const index = apps.findIndex(a => a.id === appId);
    if (index !== -1) setActiveAppIndex(index);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen md:h-screen bg-[#050505] text-gray-100 font-sans md:overflow-hidden flex flex-col selection:bg-emerald-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/80 backdrop-blur-xl shrink-0 px-6 py-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent uppercase">
            Inefficient Arcade
          </h1>
          <button 
            onClick={() => {
              const randomIndex = Math.floor(Math.random() * filteredApps.length);
              handleSelectApp(filteredApps[randomIndex].id);
            }}
            className="px-5 py-2 bg-white text-black text-[10px] font-black rounded-full hover:bg-emerald-400 transition-all uppercase tracking-widest"
          >
            🎲 Random
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6 lg:gap-8 p-4 md:p-8 lg:p-12 md:overflow-hidden">
        
        {/* Left: Library & Disclaimer */}
        <div className="w-full lg:w-72 flex flex-col gap-6 shrink-0 order-2 lg:order-1 md:overflow-y-auto custom-scrollbar md:pr-2">
          
          {/* Arcade Disclaimer Note */}
          <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              Development Note
            </h3>
            <p className="text-[10px] leading-relaxed text-gray-500 font-medium italic">
              All games in this arcade are pre-publication development samples. Games marked as <span className="text-emerald-400 font-bold not-italic">LIVE</span> have final, polished versions available on official app stores.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Filter</h2>
            <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10">
              {['all', 'final', 'in-dev'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange(type)}
                  className={`flex-1 py-2 text-[9px] font-black uppercase rounded-xl transition-all
                    ${filter === type ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {type === 'final' ? 'Live' : type === 'in-dev' ? 'Dev' : 'All'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Library ({filteredApps.length})</h2>
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 scrollbar-hide">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleSelectApp(app.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all shrink-0 lg:shrink border
                    ${activeApp && activeApp.id === app.id ? 'bg-white/10 border-white/20 shadow-2xl' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black
                    ${activeApp && activeApp.id === app.id ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                    {app.title.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold truncate w-24 lg:w-32 ${activeApp && activeApp.id === app.id ? 'text-white' : 'text-gray-400'}`}>
                      {app.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Stage */}
        <div className="flex-1 flex flex-col items-center justify-center order-1 lg:order-2">
          {activeApp ? (
            <div className="relative w-full flex items-center justify-center md:h-full">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none hidden md:block"></div>
              <div className="relative w-full max-w-[320px] md:max-w-none md:h-full aspect-[9/16] md:aspect-[9/19] bg-black border-[8px] md:border-[10px] border-[#151515] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                <iframe src={activeApp.url} title={activeApp.title} className="w-full h-full" sandbox="allow-scripts allow-same-origin" />
              </div>
            </div>
          ) : (
            <div className="text-gray-700 font-black uppercase text-xs tracking-widest py-20">No Matches Found</div>
          )}
        </div>

        {/* Right: Info Box */}
        {activeApp && (
          <div className="w-full lg:w-80 space-y-8 order-3 shrink-0 md:overflow-y-auto custom-scrollbar md:pr-2 pb-24 lg:pb-0">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">{activeApp.title}</h2>
              <p className="text-gray-500 leading-relaxed font-medium text-sm lg:text-base">
                {activeApp.description}
              </p>
            </div>

            {activeApp.status === 'final' ? (
              <div className="p-8 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[2rem] space-y-6">
                <div className="space-y-1">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">Experience More</h3>
                  <p className="text-[10px] text-gray-500 font-semibold leading-normal italic">Install for full functionality & haptics.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {activeApp.iosLink && (
                    <a href={activeApp.iosLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] hover:bg-emerald-400 transition-all">
                      <AppleIcon />
                      <span>APP STORE</span>
                    </a>
                  )}
                  {activeApp.androidLink && (
                    <a href={activeApp.androidLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-6 py-3 bg-[#111] text-white border border-white/10 rounded-xl font-black text-[10px] hover:border-emerald-500 transition-all">
                      <PlayStoreIcon />
                      <span>PLAY STORE</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 border border-dashed border-white/10 rounded-[2rem] flex items-center justify-center">
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">Build in progress</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MOBILE STICKY CTA */}
      {activeApp && activeApp.status === 'final' && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-[100]">
          <div className="bg-emerald-500 p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-4 border border-white/20">
            <div className="pl-2">
              <h4 className="text-[11px] font-black text-black leading-none uppercase tracking-tighter">Get the App</h4>
            </div>
            <div className="flex gap-2">
              {activeApp.iosLink && <a href={activeApp.iosLink} target="_blank" rel="noreferrer" className="bg-black p-3 rounded-xl"><AppleIcon /></a>}
              {activeApp.androidLink && <a href={activeApp.androidLink} target="_blank" rel="noreferrer" className="bg-black p-3 rounded-xl"><PlayStoreIcon /></a>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}