import React, { useState, useEffect } from 'react';

// Icon Components for a professional look
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

  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        const dataUrl = `https://raw.githubusercontent.com/inefficientcodegit/showcase/main/arcade-data.json?t=${new Date().getTime()}`;
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error("Could not fetch data.");
        const gameData = await response.json();
        setApps(gameData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchGamesData();
  }, []);

  const filteredApps = apps.filter(app => (filter === 'all' ? true : app.status === filter));
  const activeApp = filteredApps[activeAppIndex] || filteredApps[0];

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setActiveAppIndex(0);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-emerald-500/30 pb-32 md:pb-0">
      
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent uppercase">
            Inefficient Arcade
          </h1>
          <button 
            onClick={() => setActiveAppIndex(Math.floor(Math.random() * filteredApps.length))}
            className="px-5 py-2 bg-white text-black text-[10px] font-black rounded-full hover:bg-emerald-400 transition-all uppercase tracking-widest"
          >
            🎲 Random
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-6 lg:p-12">
        
        {/* Left: Library */}
        <div className="w-full lg:w-72 flex flex-col gap-8 order-2 lg:order-1">
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">Navigation</h2>
            <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10">
              {['all', 'final', 'in-dev'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange(type)}
                  className={`flex-1 py-2 text-[9px] font-black uppercase rounded-xl transition-all
                    ${filter === type ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {type === 'final' ? 'Live' : type === 'in-dev' ? 'Dev' : 'All'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">Library ({filteredApps.length})</h2>
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 scrollbar-hide">
              {filteredApps.map((app, index) => (
                <button
                  key={app.id}
                  onClick={() => setActiveAppIndex(index)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all shrink-0 lg:shrink border
                    ${activeApp === app ? 'bg-white/10 border-white/20 shadow-2xl' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black
                    ${activeApp === app ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                    {app.title.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold truncate w-24 lg:w-32 ${activeApp === app ? 'text-white' : 'text-gray-400'}`}>
                      {app.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Stage */}
        <div className="flex-1 flex flex-col items-center order-1 lg:order-2">
          {activeApp ? (
            <div className="relative w-full flex justify-center">
              <div className="absolute -inset-10 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
              <div className="relative w-full max-w-[320px] aspect-[9/19] md:h-[680px] md:aspect-auto md:w-[340px] bg-black border-[10px] border-[#151515] rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                <iframe src={activeApp.url} title={activeApp.title} className="w-full h-full" sandbox="allow-scripts allow-same-origin" />
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-700 font-black uppercase text-xs tracking-widest">No Matches Found</div>
          )}
        </div>

        {/* Right: Info & CTA */}
        {activeApp && (
          <div className="w-full lg:w-80 space-y-8 order-3">
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter leading-none">{activeApp.title}</h2>
              <p className="text-gray-500 leading-relaxed font-medium">
                {activeApp.description}
              </p>
            </div>

            <div className="hidden md:block">
              {activeApp.status === 'final' ? (
                <div className="p-8 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[2rem] space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-white font-black text-xs uppercase tracking-widest">Experience More</h3>
                    <p className="text-[11px] text-gray-500 font-semibold leading-normal italic">Install the official build for full functionality, haptics, and progress syncing.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {activeApp.iosLink && (
                      <a href={activeApp.iosLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-6 py-3 bg-white text-black rounded-2xl font-black text-xs hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <AppleIcon />
                        <span>APP STORE</span>
                      </a>
                    )}
                    {activeApp.androidLink && (
                      <a href={activeApp.androidLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-6 py-3 bg-[#111] text-white border border-white/10 rounded-2xl font-black text-xs hover:border-emerald-500 transition-all hover:scale-[1.02] active:scale-[0.98]">
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
          </div>
        )}
      </main>

      {/* MOBILE STICKY CTA */}
      {activeApp && activeApp.status === 'final' && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-emerald-500 p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-4 border border-white/20">
            <div className="pl-2">
              <h4 className="text-[11px] font-black text-black leading-none uppercase tracking-tighter">Get the App</h4>
              <p className="text-[9px] font-bold text-black/60 uppercase">Full Version</p>
            </div>
            <div className="flex gap-2">
              {activeApp.iosLink && (
                <a href={activeApp.iosLink} target="_blank" rel="noreferrer" className="bg-black p-3 rounded-xl shadow-lg">
                  <AppleIcon />
                </a>
              )}
              {activeApp.androidLink && (
                <a href={activeApp.androidLink} target="_blank" rel="noreferrer" className="bg-black p-3 rounded-xl shadow-lg">
                  <PlayStoreIcon />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}