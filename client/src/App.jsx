import { useState, useEffect } from 'react'
import { io } from 'socket.io-client';
import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import GoolagApp from './apps/GoolagApp';
import TerminalApp from './apps/TerminalApp';

function App() {
  const [serverStatus, setServerStatus] = useState('OFFLINE');
  const [openApp, setOpenApp] = useState(null);
  const [sysStats, setSysStats] = useState({ cpu: 0, ram: 0 });

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      setServerStatus('CONNECTED');
    });

    socket.on('disconnect', () => {
      setServerStatus('OFFLINE');
    });

    socket.on('system_status', (stats) => {
      setSysStats(stats);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative font-mono selection:bg-neon-green selection:text-black">

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,20,20,1)_0%,_rgba(0,0,0,1)_100%)]"></div>

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/90 flex items-center justify-between px-4 text-xs z-10 border-b border-gray-800">
        <span className="text-neon-green font-bold tracking-widest">SUB-OS</span>
        <div className="flex gap-4 text-gray-400">
          <span className={serverStatus === 'CONNECTED' ? 'text-neon-green' : 'text-red-500'}>
            {serverStatus === 'CONNECTED' ? '● NET' : '○ NET'}
          </span>
          <span>BAT: 84%</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Desktop Grid - Optimized for Mobile */}
      <div className="pt-12 p-6 grid grid-cols-3 gap-6 content-start h-full max-w-md mx-auto">
        <DesktopIcon
          label="Goolag"
          icon="🌐"
          onClick={() => setOpenApp('goolag')}
        />
        <DesktopIcon
          label="Term"
          icon=">_"
          onClick={() => setOpenApp('terminal')}
        />
        <DesktopIcon
          label="Mon"
          icon="📊"
          onClick={() => setOpenApp('sysmon')}
        />
        <DesktopIcon
          label="Settings"
          icon="⚙️"
          onClick={() => setOpenApp('settings')}
        />
      </div>

      {/* Windows */}
      <Window
        isOpen={openApp === 'goolag'}
        onClose={() => setOpenApp(null)}
        title="Goolag Search"
      >
        <GoolagApp />
      </Window>

      <Window
        isOpen={openApp === 'terminal'}
        onClose={() => setOpenApp(null)}
        title="Terminal Uplink"
      >
        <TerminalApp />
      </Window>

      <Window
        isOpen={openApp === 'sysmon'}
        onClose={() => setOpenApp(null)}
        title="Hardware Monitor"
      >
        <div className="p-6 flex flex-col gap-6 items-center justify-center h-full">
          <div className="w-full">
            <div className="flex justify-between mb-1 text-neon-pink">
              <span>SERVER CPU</span>
              <span>{sysStats.cpu}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-neon-pink transition-all duration-500" style={{ width: `${sysStats.cpu}%` }}></div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between mb-1 text-neon-blue">
              <span>SERVER RAM</span>
              <span>{sysStats.ram}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-neon-blue transition-all duration-500" style={{ width: `${sysStats.ram}%` }}></div>
            </div>
          </div>

          <div className="mt-8 text-xs text-gray-500 text-center">
            Data received via Socket.io Uplink
          </div>
        </div>
      </Window>

      <Window
        isOpen={openApp === 'settings'}
        onClose={() => setOpenApp(null)}
        title="Settings"
      >
        <div className="p-4">
          <h3 className="text-neon-green mb-4 text-lg">Display</h3>
          <div className="flex justify-between items-center mb-6">
            <span>Brightness</span>
            <input type="range" className="w-1/2 accent-neon-green" />
          </div>

          <h3 className="text-neon-green mb-4 text-lg">Network</h3>
          <div className="bg-gray-900 p-3 rounded text-sm text-gray-400 font-mono">
            IP: 192.168.1.X<br />
            GATEWAY: ARCH-NODE-01<br />
            STATUS: {serverStatus}
          </div>
        </div>
      </Window>

    </div>
  )
}

export default App
