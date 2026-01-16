import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import { Terminal, Globe, Activity, Settings, Phone, MessageCircle, Camera, Music, Calendar } from 'lucide-react';
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

import wallpaper from './assets/wallpaper.png';

const AppIcon = ({ label, icon: Icon, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center gap-2 active:scale-95 transition-transform cursor-pointer">
    <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-sm">
      <Icon size={28} className="text-white drop-shadow-md" />
    </div>
    <span className="text-xs font-medium text-white/90 drop-shadow-md">{label}</span>
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
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative selection:bg-none">

      {/* 1. Wallpaper Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${wallpaper})`,
          transform: isLocked ? 'scale(1)' : 'scale(1.05)',
          filter: openApp ? 'blur(20px) brightness(0.6)' : 'blur(0px) brightness(0.9)'
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
        <div onClick={() => setIsControlCenterOpen(true)}>
          <StatusBar />
        </div>

        {/* Desktop Area */}
        <div className="flex-1 px-6 pt-8 pb-32 overflow-y-auto no-scrollbar">

          {/* Widgets Area */}
          <div className="w-full h-40 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md p-6 mb-8 flex flex-col justify-between shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">Paris</h3>
                <p className="text-xs opacity-60">Clouds</p>
              </div>
              <span className="text-4xl font-light">12°</span>
            </div>
            <div className="text-xs opacity-50 flex justify-between">
              <span>Fri 16</span>
              <span>H:14 L:8</span>
            </div>
          </div>

          {/* App Grid */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-8">
            <AppIcon label="Web" icon={Globe} onClick={() => setOpenApp('goolag')} />
            <AppIcon label="Term" icon={Terminal} onClick={() => setOpenApp('terminal')} />
            <AppIcon label="Map" icon={Calendar} />
            <AppIcon label="Settings" icon={Settings} />
            <AppIcon label="Camera" icon={Camera} />
            <AppIcon label="Music" icon={Music} />
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

      {/* 5. Active App Window (Full Screen Mobile Style) */}
      <Window
        isOpen={openApp === 'goolag'}
        onClose={() => setOpenApp(null)}
        title="Arc Web"
      >
        <GoolagApp />
      </Window>

      <Window
        isOpen={openApp === 'terminal'}
        onClose={() => setOpenApp(null)}
        title="Terminal"
      >
        <TerminalApp />
      </Window>

      <Window
        isOpen={openApp === 'sysmon'}
        onClose={() => setOpenApp(null)}
        title="System"
      >
        <div className="p-8 flex flex-col items-center justify-center h-full">
          <Activity size={64} className="text-white/20 mb-8" />
          <div className="text-2xl font-light mb-2">{sysStats.cpu}% CPU</div>
          <div className="text-sm opacity-50 mb-8">System Load</div>

          <div className="text-2xl font-light mb-2">{sysStats.ram}% RAM</div>
          <div className="text-sm opacity-50">Memory Usage</div>
        </div>
      </Window>

    </div>
  )
}

export default App
