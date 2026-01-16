import { motion } from 'framer-motion';
import { Wifi, Bluetooth, Sun, Moon, Volume2, Plane, Share2, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { GlassPane } from '../ui/GlassPane';
import { useSettings } from '../../context/SettingsContext';
import { useMusic } from '../../context/MusicContext';

const ControlTile = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all active:scale-95 duration-200 ${active ? 'bg-blue-500 text-white shadow-blue-500/30 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
    >
        <Icon size={24} />
        <span className="text-[10px] mt-2 font-medium">{label}</span>
    </button>
);

const ControlCenter = ({ isOpen, onClose }) => {
    const { settings, toggleSetting, updateSetting } = useSettings();
    const { currentTrack, isPlaying, setIsPlaying, skipForward, skipBackward } = useMusic();

    return (
        <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={isOpen ? { y: 0, opacity: 1 } : { y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-3xl pt-12 px-6 pb-6 flex flex-col gap-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Control Center</h2>
                <button
                    onClick={onClose}
                    className="text-xs font-bold uppercase tracking-widest bg-white/10 px-6 py-2.5 rounded-full hover:bg-white/20 transition-all border border-white/10"
                >
                    Close
                </button>
            </div>

            {/* Connectivity Grid */}
            <div className="grid grid-cols-2 gap-4">
                <GlassPane className="p-4 rounded-3xl grid grid-cols-2 gap-3" blur="xl">
                    <ControlTile
                        icon={Wifi}
                        label="Wi-Fi"
                        active={settings.wifi}
                        onClick={() => toggleSetting('wifi')}
                    />
                    <ControlTile
                        icon={Bluetooth}
                        label="Bluetooth"
                        active={settings.bluetooth}
                        onClick={() => toggleSetting('bluetooth')}
                    />
                    <ControlTile icon={Plane} label="Airplane" />
                    <ControlTile icon={Share2} label="Share" />
                </GlassPane>

                <GlassPane className="p-4 rounded-3xl flex flex-col justify-between" blur="xl">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${settings.theme === 'dark' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white'}`}
                        >
                            <Moon size={20} />
                        </button>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">Theme</span>
                            <span className="text-xs opacity-50 uppercase tracking-widest font-bold">{settings.theme}</span>
                        </div>
                    </div>
                </GlassPane>
            </div>

            {/* Sliders */}
            <GlassPane className="p-5 rounded-3xl flex flex-col gap-6" blur="xl">
                <div className="flex items-center gap-4">
                    <Sun size={20} className="opacity-50" />
                    <div className="flex-1 h-12 bg-white/10 rounded-2xl relative overflow-hidden group">
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={settings.brightness}
                            onChange={(e) => updateSetting('brightness', Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                        />
                        <div
                            className="absolute inset-y-0 left-0 bg-white/80 transition-all duration-100 ease-out"
                            style={{ width: `${settings.brightness}%` }}
                        ></div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Volume2 size={20} className="opacity-50" />
                    <div className="flex-1 h-12 bg-white/10 rounded-2xl relative overflow-hidden group">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.volume}
                            onChange={(e) => updateSetting('volume', Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                        />
                        <div
                            className="absolute inset-y-0 left-0 bg-white/80 transition-all duration-100 ease-out"
                            style={{ width: `${settings.volume}%` }}
                        ></div>
                    </div>
                </div>
            </GlassPane>

            {/* Music Player */}
            <GlassPane className="p-4 rounded-3xl flex items-center gap-4 mt-auto border border-white/5" blur="xl">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl overflow-hidden shadow-lg">
                    <img src={currentTrack.cover} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-bold truncate">{currentTrack.title}</h4>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest font-medium truncate">{currentTrack.artist}</p>
                </div>
                <div className="flex items-center gap-5 pr-2">
                    <button onClick={skipBackward} className="text-white/40 hover:text-white transition-colors">
                        <SkipBack size={18} fill="currentColor" />
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg"
                    >
                        {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
                    </button>
                    <button onClick={skipForward} className="text-white/40 hover:text-white transition-colors">
                        <SkipForward size={18} fill="currentColor" />
                    </button>
                </div>
            </GlassPane>

        </motion.div>
    );
}

export default ControlCenter;
