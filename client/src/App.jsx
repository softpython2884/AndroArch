import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import { Terminal, Globe, Activity, Settings, Phone, MessageCircle, Camera, Music, Calendar, Twitch, Youtube, Calculator, HelpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// OS Components
import LockScreen from './components/os/LockScreen';
import StatusBar from './components/os/StatusBar';
import ControlCenter from './components/os/ControlCenter';
import Dock from './components/os/Dock';
import Window from './components/Window';

// Apps
import GoolagApp from './apps/GoolagApp';
import TerminalApp from './apps/TerminalApp';
import IframeApp from './apps/IframeApp';
import CalculatorApp from './apps/CalculatorApp';
import GalleryApp from './apps/GalleryApp';
import SettingsApp from './apps/SettingsApp';
import MusicApp from './apps/MusicApp';

import wallpaper from './assets/wallpaper.png';

const AppIcon = ({ label, icon: Icon, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform cursor-pointer">
    <div className="w-[60px] h-[60px] rounded-[20px] bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:bg-white/20">
      <Icon size={26} className="text-white drop-shadow-sm" />
    </div>
    <span className="text-[11px] font-medium text-white/90 drop-shadow-md tracking-tight leading-3 text-center">{label}</span>
  </div>
);

function App() {
  // System State
  const [serverStatus, setServerStatus] = useState('OFFLINE');
  const [sysStats, setSysStats] = useState({ cpu: 0, ram: 0 });

  // UI State
  const [isLocked, setIsLocked] = useState(true);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [openApp, setOpenApp] = useState(null);

  // Connect to Backend
  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => { setServerStatus('CONNECTED'); });
    socket.on('disconnect', () => { setServerStatus('OFFLINE'); });
    socket.on('system_status', (stats) => setSysStats(stats));
    return () => socket.disconnect();
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative selection:bg-none font-sans">

      {/* 1. Wallpaper Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform-gpu"
        style={{
          backgroundImage: `url(${wallpaper})`,
          transform: isLocked ? 'scale(1)' : 'scale(1.05)',
          filter: openApp ? 'blur(20px) brightness(0.5)' : 'blur(0px) brightness(0.9)'
        }}
      />

      {/* 2. Lock Screen Layer (Z-50) */}
      <LockScreen isLocked={isLocked} onUnlock={() => setIsLocked(false)} />

      {/* 3. OS Interface Layer */}
      <motion.div
        animate={{ opacity: isLocked ? 0 : 1, scale: isLocked ? 0.95 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex flex-col pointer-events-auto"
      >
        {/* Status Bar */}
        <div onClick={() => setIsControlCenterOpen(true)} className="pt-4 px-2">
          <StatusBar />
        </div>

        {/* Desktop Area - Optimized for Tall Screens */}
        <div className="flex-1 px-6 flex flex-col pt-12 pb-32 z-10">

          {/* Widgets Area */}
          <div className="w-full h-40 bg-white/5 rounded-[30px] border border-white/10 backdrop-blur-md p-6 mb-8 flex flex-col justify-between shadow-2xl backdrop-saturate-150 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold tracking-tight">Strasbourg</h3>
                <div className="flex items-center gap-1 text-xs opacity-60 font-medium uppercase tracking-wider">
                  <Globe size={10} />
                  <span>Partly Cloudy</span>
                </div>
              </div>
              <span className="text-5xl font-extralight tracking-tighter">12°</span>
            </div>
            <div className="text-xs opacity-50 flex justify-between font-mono font-medium z-10">
              <span>FRI 16</span>
              <span>H:14 L:8</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* App Grid - Centered Lower */}
          <div className="grid grid-cols-4 gap-x-5 gap-y-8 place-items-center mb-8">
            <AppIcon label="Web" icon={Globe} onClick={() => setOpenApp('goolag')} />
            <AppIcon label="Term" icon={Terminal} onClick={() => setOpenApp('terminal')} />
            <AppIcon label="YouLink" icon={Youtube} onClick={() => setOpenApp('youtube')} />
            <AppIcon label="Stream" icon={Twitch} onClick={() => setOpenApp('twitch')} />

            <AppIcon label="Settings" icon={Settings} onClick={() => setOpenApp('settings')} />
            <AppIcon label="Music" icon={Music} onClick={() => setOpenApp('music')} />
            <AppIcon label="Calc" icon={Calculator} onClick={() => setOpenApp('calc')} />
            <AppIcon label="Gallery" icon={Camera} onClick={() => setOpenApp('gallery')} />
          </div>

          {/* Quick Search Pill */}
          <div
            onClick={() => setOpenApp('goolag')}
            className="w-full h-12 bg-white/10 backdrop-blur-xl rounded-full mb-4 flex items-center px-4 gap-3 text-white/50 border border-white/5 active:scale-95 transition-transform"
          >
            <Globe size={18} />
            <span className="text-sm font-medium">Search Goolag...</span>
          </div>

        </div>

        {/* Dock */}
        <Dock items={[
          { icon: Phone, onClick: () => { } },
          { icon: MessageCircle, onClick: () => { } },
          { icon: Globe, onClick: () => setOpenApp('goolag') },
          { icon: Activity, onClick: () => setOpenApp('sysmon') }
        ]} />

      </motion.div>

      {/* 4. Overlays */}
      <ControlCenter isOpen={isControlCenterOpen} onClose={() => setIsControlCenterOpen(false)} />

      {/* 5. Apps */}
      <Window isOpen={openApp === 'goolag'} onClose={() => setOpenApp(null)} title="Arc Web">
        <GoolagApp />
      </Window>

      <Window isOpen={openApp === 'terminal'} onClose={() => setOpenApp(null)} title="Terminal">
        <TerminalApp />
      </Window>

      <Window isOpen={openApp === 'settings'} onClose={() => setOpenApp(null)} title="Settings">
        <SettingsApp />
      </Window>

      <Window isOpen={openApp === 'calc'} onClose={() => setOpenApp(null)} title="Calculator">
        <CalculatorApp />
      </Window>

      <Window isOpen={openApp === 'gallery'} onClose={() => setOpenApp(null)} title="Gallery">
        <GalleryApp />
      </Window>

      <Window isOpen={openApp === 'youtube'} onClose={() => setOpenApp(null)} title="YouTube">
        <IframeApp url="https://www.youtube.com/embed/jfKfPfyJRdk" title="YouTube" />
      </Window>

      <Window isOpen={openApp === 'twitch'} onClose={() => setOpenApp(null)} title="Twitch">
        {/* Twitch requires parent domain for embeds, might fail on localhost without config, using generic player for demo */}
        <div className="flex items-center justify-center h-full bg-[#6441a5] text-white">
          <span className="text-xl font-bold">Twitch Player Placeholder</span>
        </div>
      </Window>

      <Window isOpen={openApp === 'sysmon'} onClose={() => setOpenApp(null)} title="System">
        <div className="p-8 flex flex-col items-center justify-center h-full">
          <Activity size={64} className="text-white/20 mb-8" />
          <div className="text-2xl font-light mb-2">{sysStats.cpu}% CPU</div>
          <div className="text-sm opacity-50 mb-8">System Load</div>
          <div className="text-2xl font-light mb-2">{sysStats.ram}% RAM</div>
          <div className="text-sm opacity-50">Memory Usage</div>
        </div>
      </Window>

      <Window isOpen={openApp === 'music'} onClose={() => setOpenApp(null)} title="Music">
        <MusicApp />
      </Window>

    </div>
  )
}

export default App
