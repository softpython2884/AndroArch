import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import { Terminal, Globe, Activity, Settings, UserPlus, MessageCircle, Camera, Music, Calendar, Twitch, Youtube, Calculator, HelpCircle, AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// OS Components
import LockScreen from './components/os/LockScreen';
import StatusBar from './components/os/StatusBar';
import ControlCenter from './components/os/ControlCenter';
import Dock from './components/os/Dock';
import Window from './components/Window';
import NotificationTray from './components/os/NotificationTray';

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
import MessagingApp from './apps/MessagingApp';
import { MessagingProvider } from './context/MessagingContext';

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
import { useNotifications } from './context/NotificationContext';

function App() {
  const { settings } = useSettings();

  // System State
  const [serverStatus, setServerStatus] = useState('OFFLINE');
  const [sysStats, setSysStats] = useState({ cpu: 0, ram: 0 });

  // UI State
  const [isLocked, setIsLocked] = useState(true);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [openApp, setOpenApp] = useState(null);
  const [appArgs, setAppArgs] = useState(null);

  // Helper to launch apps with data
  const launchApp = (appName, args = null) => {
    setAppArgs(args);
    setOpenApp(appName);
  };

  const closeApp = () => {
    setOpenApp(null);
    setAppArgs(null);
  };

  // Weather State
  const [weather, setWeather] = useState({ temp: '--', condition: 'Scanning...', location: 'Locating...' });
  const [coords, setCoords] = useState(null);

  const { addNotification } = useNotifications();

  const socketRef = useRef(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  // Connect to Backend & Fetch Weather
  useEffect(() => {
    // Dynamic Host Discovery
    const serverHost = `${window.location.protocol}//${window.location.hostname}:3000`;

    // Socket
    const socket = io(serverHost);
    socketRef.current = socket;

    socket.on('connect', () => {
      setServerStatus('CONNECTED');
      setIsSocketReady(true);
      addNotification({ title: 'Kernel', message: 'System link established.', type: 'success' });
    });
    socket.on('disconnect', () => {
      setServerStatus('OFFLINE');
      setIsSocketReady(false);
      addNotification({ title: 'Kernel', message: 'System link lost.', type: 'error', persistent: true });
    });
    socket.on('system_status', (stats) => setSysStats(stats));

    // Admin Broadcasts
    socket.on('broadcast_notification', (data) => {
      addNotification({
        title: 'Emergency Broadcast',
        message: data.message,
        type: 'broadcast',
        persistent: true
      });
    });

    const fetchWeatherData = async (lat, lon) => {
      // 1. Fetch Location
      try {
        const geoRes = await fetch(`${serverHost}/api/weather/geocoding?lat=${lat}&lon=${lon}`);
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

  // Connect to Backend

  return (
    <MessagingProvider socket={socketRef.current}>
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
              <AppIcon label="Web" icon={Globe} onClick={() => launchApp('goolag')} />
              <AppIcon label="Term" icon={Terminal} onClick={() => launchApp('terminal')} />
              <AppIcon label="TubeArch" icon={Youtube} onClick={() => launchApp('youtube')} />
              <AppIcon label="Stream" icon={Twitch} onClick={() => launchApp('twitch')} />

              <AppIcon label="Settings" icon={Settings} onClick={() => launchApp('settings')} />
              <AppIcon label="Music" icon={Music} onClick={() => launchApp('music')} />
              <AppIcon label="Calc" icon={Calculator} onClick={() => launchApp('calc')} />
              <AppIcon label="Camera" icon={Camera} onClick={() => launchApp('camera')} />
            </div>

            {/* Quick Search Pill */}
            <div
              onClick={() => launchApp('goolag')}
              className="w-full h-12 bg-white/10 backdrop-blur-xl rounded-full mb-4 flex items-center px-4 gap-3 text-white/50 border border-white/5 active:scale-95 transition-transform"
            >
              <Globe size={18} />
              <span className="text-sm font-medium">Search Goolag...</span>
            </div>

          </div>

          {/* Dock */}
          <Dock items={[
            { icon: UserPlus, onClick: () => launchApp('messages') },
            { icon: MessageCircle, onClick: () => launchApp('messages') },
            { icon: Globe, onClick: () => setOpenApp('goolag') },
            { icon: Activity, onClick: () => setOpenApp('sysmon') }
          ]} />

        </motion.div>

        {/* 4. Overlays */}
        <NotificationTray />
        <ControlCenter
          isOpen={isControlCenterOpen}
          onClose={() => setIsControlCenterOpen(false)}
          onLock={() => { setIsLocked(true); setIsControlCenterOpen(false); }}
        />

        {/* 5. Apps */}
        <Window isOpen={openApp === 'goolag'} onClose={closeApp} title="Arc Web">
          <GoolagApp launchApp={launchApp} />
        </Window>

        <Window isOpen={openApp === 'terminal'} onClose={closeApp} title="Terminal">
          <TerminalApp />
        </Window>

        <Window isOpen={openApp === 'settings'} onClose={closeApp} title="Settings">
          <SettingsApp />
        </Window>

        <Window isOpen={openApp === 'calc'} onClose={closeApp} title="Calculator">
          <CalculatorApp />
        </Window>

        <Window isOpen={openApp === 'gallery'} onClose={closeApp} title="Gallery">
          <GalleryApp />
        </Window>

        <Window isOpen={openApp === 'sysmon'} onClose={closeApp} title="System Monitor">
          <SystemMonitorApp stats={sysStats} serverStatus={serverStatus} />
        </Window>

        <Window isOpen={openApp === 'music'} onClose={closeApp} title="Music Player">
          <MusicApp />
        </Window>

        <Window isOpen={openApp === 'youtube'} onClose={closeApp} title="TubeArch (Proxy)">
          <YoutubeApp initialArgs={appArgs} />
        </Window>

        <Window isOpen={openApp === 'twitch'} onClose={closeApp} title="Twitch">
          <IframeApp url="https://player.twitch.tv/?channel=lofi_girl&parent=localhost" title="Twitch" />
        </Window>

        <Window isOpen={openApp === 'weather'} onClose={closeApp} title="Weather">
          <WeatherApp coords={coords} locationName={weather.location} />
        </Window>

        <Window isOpen={openApp === 'messages'} onClose={closeApp} title="Messenger">
          <MessagingApp />
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
    </MessagingProvider>
  )
}

export default App
