import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import { Terminal, Globe, Activity, Settings, Phone, MessageCircle, Camera, Music, Calendar, Twitch, Youtube, Calculator, HelpCircle, AlertCircle, X } from 'lucide-react';
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
import SystemMonitorApp from './apps/SystemMonitorApp';
import CameraApp from './apps/CameraApp';
import WeatherApp from './apps/WeatherApp';
import YoutubeApp from './apps/YoutubeApp';

import wallpaper from './assets/wallpaper.png';

const AppIcon = ({ label, icon: Icon, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform cursor-pointer">
    <div className="w-[60px] h-[60px] rounded-[20px] bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:bg-white/20">
      <Icon size={26} className="text-white drop-shadow-sm" />
    </div>
    <span className="text-[11px] font-medium text-white/90 drop-shadow-md tracking-tight leading-3 text-center">{label}</span>
  </div>
);

import { useSettings } from './context/SettingsContext';

function App() {
  const { settings } = useSettings();

  // System State
  const [serverStatus, setServerStatus] = useState('OFFLINE');
  const [sysStats, setSysStats] = useState({ cpu: 0, ram: 0 });

  // UI State
  const [isLocked, setIsLocked] = useState(true);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [openApp, setOpenApp] = useState(null);

  // Weather State
  const [weather, setWeather] = useState({ temp: '--', condition: 'Scanning...', location: 'Locating...' });
  const [coords, setCoords] = useState(null);

  // Broadcast State
  const [broadcast, setBroadcast] = useState(null);

  // Connect to Backend & Fetch Weather
  useEffect(() => {
    // Socket
    const socket = io('http://localhost:3000');
    socket.on('connect', () => { setServerStatus('CONNECTED'); });
    socket.on('disconnect', () => { setServerStatus('OFFLINE'); });
    socket.on('system_status', (stats) => setSysStats(stats));

    // Admin Broadcasts
    socket.on('broadcast_notification', (data) => {
      setBroadcast(data);
      // Auto-hide after 10 seconds
      setTimeout(() => setBroadcast(null), 10000);
    });

    const fetchWeatherData = async (lat, lon) => {
      // 1. Fetch Location
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=11`, {
          headers: { 'User-Agent': 'AndroArch-OS/1.0' }
        });
        const geoData = await geoRes.json();

        // Extended city detection
        const addr = geoData.address;
        const city = addr?.city || addr?.town || addr?.village || addr?.municipality || addr?.suburb || addr?.county || "Unknown Sector";

        setWeather(prev => ({ ...prev, location: city }));
      } catch (e) {
        console.warn("Location fetch failed", e);
        setWeather(prev => ({ ...prev, location: "Unknown Sector" }));
      }

      // 2. Fetch Weather
      try {
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);
        const data = await weatherRes.json();

        const code = data.current.weather_code;
        let condition = "Clear";
        if (code > 0 && code <= 3) condition = "Cloudy";
        if (code >= 45 && code <= 48) condition = "Fog";
        if (code >= 51 && code <= 67) condition = "Rain";
        if (code >= 71) condition = "Snow";
        if (code >= 95) condition = "Storm";

        setWeather(prev => ({
          ...prev,
          temp: Math.round(data.current.temperature_2m),
          condition: condition
        }));
      } catch (e) {
        console.error("Weather fetch error", e);
        setWeather(prev => ({ ...prev, temp: '--', condition: 'Offline' }));
      }
    };

    // Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude }); // Use lat/lon
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Geo Access Denied:", error);
          // Fallback (Strasbourg)
          setCoords({ lat: 48.5839, lon: 7.7455 });
          fetchWeatherData(48.5839, 7.7455);
        }
      );
    } else {
      // Fallback
      setCoords({ lat: 48.5839, lon: 7.7455 });
      fetchWeatherData(48.5839, 7.7455);
    }

    return () => socket.disconnect();
  }, []);

  // Connect to Backend ...

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative selection:bg-none font-sans">

      {/* 1. Wallpaper Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform-gpu"
        style={{
          backgroundImage: `url(${settings.wallpaper || wallpaper})`,
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
          <div
            onClick={() => setOpenApp('weather')}
            className="w-full h-40 bg-white/5 rounded-[30px] border border-white/10 backdrop-blur-md p-6 mb-8 flex flex-col justify-between shadow-2xl backdrop-saturate-150 relative overflow-hidden group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold tracking-tight">{weather.location}</h3>
                <div className="flex items-center gap-1 text-xs opacity-60 font-medium uppercase tracking-wider">
                  <Globe size={10} />
                  <span>{weather.condition}</span>
                </div>
              </div>
              <span className="text-5xl font-extralight tracking-tighter">{weather.temp}°</span>
            </div>
            <div className="text-xs opacity-50 flex justify-between font-mono font-medium z-10">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }).toUpperCase()}</span>
              <span>Updated Just Now</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* App Grid - Centered Lower */}
          <div className="grid grid-cols-4 gap-x-5 gap-y-8 place-items-center mb-8">
            <AppIcon label="Web" icon={Globe} onClick={() => setOpenApp('goolag')} />
            <AppIcon label="Term" icon={Terminal} onClick={() => setOpenApp('terminal')} />
            <AppIcon label="TubeArch" icon={Youtube} onClick={() => setOpenApp('youtube')} />
            <AppIcon label="Stream" icon={Twitch} onClick={() => setOpenApp('twitch')} />

            <AppIcon label="Settings" icon={Settings} onClick={() => setOpenApp('settings')} />
            <AppIcon label="Music" icon={Music} onClick={() => setOpenApp('music')} />
            <AppIcon label="Calc" icon={Calculator} onClick={() => setOpenApp('calc')} />
            <AppIcon label="Camera" icon={Camera} onClick={() => setOpenApp('camera')} />
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
      {/* Admin Broadcast Notification */}
      <AnimatePresence>
        {broadcast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg"
          >
            <div className="bg-red-900/60 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-6 shadow-2xl shadow-red-950/40 flex items-start gap-4 ring-1 ring-white/10">
              <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-900/40">
                <AlertCircle className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-100 opacity-80">System Broadcast</h4>
                  <span className="text-[9px] font-mono opacity-40">Just Now</span>
                </div>
                <p className="text-sm font-bold text-white leading-relaxed">
                  {broadcast.message}
                </p>
              </div>
              <button
                onClick={() => setBroadcast(null)}
                className="text-white/40 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <Window isOpen={openApp === 'sysmon'} onClose={() => setOpenApp(null)} title="System Monitor">
        <SystemMonitorApp stats={sysStats} serverStatus={serverStatus} />
      </Window>

      <Window isOpen={openApp === 'music'} onClose={() => setOpenApp(null)} title="Music Player">
        <MusicApp />
      </Window>

      <Window isOpen={openApp === 'youtube'} onClose={() => setOpenApp(null)} title="TubeArch (Proxy)">
        <YoutubeApp />
      </Window>

      <Window isOpen={openApp === 'twitch'} onClose={() => setOpenApp(null)} title="Twitch">
        <IframeApp url="https://player.twitch.tv/?channel=lofi_girl&parent=localhost" title="Twitch" />
      </Window>

      <Window isOpen={openApp === 'weather'} onClose={() => setOpenApp(null)} title="Weather">
        <WeatherApp coords={coords} locationName={weather.location} />
      </Window>

      {/* Camera App (Custom Fullscreen Mode) */}
      <AnimatePresence>
        {openApp === 'camera' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-40 bg-black"
          >
            <CameraApp onClose={() => setOpenApp(null)} onOpenGallery={() => setOpenApp('gallery')} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default App
