import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Bluetooth, Sun, Moon, Volume2, Plane, Share2, Play, Pause, SkipBack, SkipForward, Power, Lock, BellOff, X, Battery, BatteryCharging, WifiOff } from 'lucide-react';
import { GlassPane } from '../ui/GlassPane';
import { useSettings } from '../../context/SettingsContext';
import { useMusic } from '../../context/MusicContext';
import { useNotifications } from '../../context/NotificationContext';

const ControlTile = ({ icon: Icon, label, active, onClick, status }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all active:scale-95 duration-200 ${active ? 'bg-blue-500 text-white shadow-blue-500/30 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
    >
        <Icon size={22} />
        <span className="text-[9px] mt-1.5 font-bold uppercase tracking-tighter opacity-80">{label}</span>
        {status && <span className="text-[8px] font-mono mt-0.5 opacity-50">{status}</span>}
    </button>
);

const ControlCenter = ({ isOpen, onClose, onLock }) => {
    const { settings, toggleSetting, updateSetting } = useSettings();
    const { currentTrack, isPlaying, setIsPlaying, skipForward, skipBackward } = useMusic();
    const { notifications, removeNotification, clearAll } = useNotifications();

    const [battery, setBattery] = useState({ level: 100, charging: false });
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const updateOnline = () => setOnline(navigator.onLine);
        window.addEventListener('online', updateOnline);
        window.addEventListener('offline', updateOnline);

        if ('getBattery' in navigator) {
            navigator.getBattery().then(bat => {
                const updateBat = () => setBattery({ level: Math.round(bat.level * 100), charging: bat.charging });
                updateBat();
                bat.addEventListener('levelchange', updateBat);
                bat.addEventListener('chargingchange', updateBat);
            });
        }

        return () => {
            window.removeEventListener('online', updateOnline);
            window.removeEventListener('offline', updateOnline);
        };
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '-100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-3xl pt-16 px-6 pb-6 flex flex-col gap-6 overflow-y-auto no-scrollbar"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white/90">System Node</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Quick Stats Tiles */}
                    <div className="grid grid-cols-4 gap-3">
                        <ControlTile
                            icon={online ? Wifi : WifiOff}
                            label="Net"
                            active={online}
                            status={online ? "Online" : "Terminated"}
                        />
                        <ControlTile
                            icon={battery.charging ? BatteryCharging : Battery}
                            label="Cell"
                            active={battery.charging}
                            status={`${battery.level}%`}
                        />
                        <ControlTile icon={Bluetooth} label="W-Link" active={settings.bluetooth} status="Idle" onClick={() => toggleSetting('bluetooth')} />
                        <ControlTile icon={Plane} label="Ghost" active={false} status="OFF" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Sliders */}
                        <GlassPane className="p-5 rounded-3xl flex flex-col gap-6" blur="xl">
                            <div className="flex items-center gap-4">
                                <Sun size={18} className="text-white/40" />
                                <div className="flex-1 h-10 bg-white/5 rounded-xl relative overflow-hidden group border border-white/5">
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={settings.brightness}
                                        onChange={(e) => updateSetting('brightness', Number(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                    />
                                    <motion.div
                                        animate={{ width: `${settings.brightness}%` }}
                                        className="absolute inset-y-0 left-0 bg-white transition-all duration-100 ease-out"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Volume2 size={18} className="text-white/40" />
                                <div className="flex-1 h-10 bg-white/5 rounded-xl relative overflow-hidden group border border-white/5">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={settings.volume}
                                        onChange={(e) => updateSetting('volume', Number(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                    />
                                    <motion.div
                                        animate={{ width: `${settings.volume}%` }}
                                        className="absolute inset-y-0 left-0 bg-white transition-all duration-100 ease-out"
                                    />
                                </div>
                            </div>
                        </GlassPane>

                        {/* System Controls */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onLock}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 transition-all active:scale-95 group"
                            >
                                <Lock size={20} className="text-white/60 group-hover:text-white mb-2" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Verrou</span>
                            </button>
                            <button
                                onClick={onLock} // Same for now
                                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 transition-all active:scale-95 group"
                            >
                                <Power size={20} className="text-red-500/60 group-hover:text-red-500 mb-2" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Veille</span>
                            </button>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Active Alerts</h3>
                            {notifications.length > 0 && (
                                <button onClick={clearAll} className="text-[9px] font-black uppercase tracking-widest text-blue-500/50 hover:text-blue-500">Log Wipe</button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-none">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 opacity-10">
                                    <BellOff size={32} />
                                    <span className="text-xs font-bold uppercase mt-4 tracking-widest">Void Clear</span>
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-3 group relative">
                                        <div className={`w-1 rounded-full ${notif.type === 'broadcast' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-[9px] font-black uppercase tracking-widest opacity-40">{notif.title}</h4>
                                                <span className="text-[8px] font-mono opacity-20">{notif.timestamp}</span>
                                            </div>
                                            <p className="text-xs text-white/80 line-clamp-2">{notif.message}</p>
                                        </div>
                                        <button onClick={() => removeNotification(notif.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded-lg transition-all absolute top-2 right-2">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Music Player Footer */}
                    <motion.div
                        className="p-4 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center gap-4 shadow-2xl backdrop-blur-3xl shrink-0"
                    >
                        <div className="w-12 h-12 bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-white/10">
                            <img src={currentTrack.cover} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold truncate text-white">{currentTrack.title}</h4>
                            <p className="text-[9px] opacity-40 uppercase tracking-widest font-black truncate text-blue-400">{currentTrack.artist}</p>
                        </div>
                        <div className="flex items-center gap-5 pr-2">
                            <button onClick={skipBackward} className="text-white/20 hover:text-white transition-colors">
                                <SkipBack size={18} fill="currentColor" />
                            </button>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl active:scale-90"
                            >
                                {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
                            </button>
                            <button onClick={skipForward} className="text-white/20 hover:text-white transition-colors">
                                <SkipForward size={18} fill="currentColor" />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ControlCenter;
