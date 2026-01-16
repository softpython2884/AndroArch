import { motion } from 'framer-motion';
import { Wifi, Bluetooth, Sun, Moon, Volume2, Plane, Share2 } from 'lucide-react';
import { GlassPane } from '../ui/GlassPane';

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
    return (
        <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={isOpen ? { y: 0, opacity: 1 } : { y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-3xl pt-12 px-6 pb-6 flex flex-col gap-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Control Center</h2>
                <button onClick={onClose} className="text-sm bg-white/10 px-4 py-2 rounded-full">Done</button>
            </div>

            {/* Connectivity Grid */}
            <div className="grid grid-cols-2 gap-4">
                <GlassPane className="p-4 rounded-3xl grid grid-cols-2 gap-3" blur="xl">
                    <ControlTile icon={Wifi} label="Wi-Fi" active={true} />
                    <ControlTile icon={Bluetooth} label="Bluetooth" active={true} />
                    <ControlTile icon={Plane} label="Airplane" />
                    <ControlTile icon={Share2} label="Share" />
                </GlassPane>

                <GlassPane className="p-4 rounded-3xl flex flex-col justify-between" blur="xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Moon size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">Do Not Disturb</span>
                            <span className="text-xs opacity-50">On</span>
                        </div>
                    </div>
                </GlassPane>
            </div>

            {/* Sliders */}
            <GlassPane className="p-5 rounded-3xl flex flex-col gap-6" blur="xl">
                <div className="flex items-center gap-4">
                    <Sun size={20} className="opacity-50" />
                    <div className="flex-1 h-12 bg-white/10 rounded-2xl relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-white/80 w-[70%]"></div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Volume2 size={20} className="opacity-50" />
                    <div className="flex-1 h-12 bg-white/10 rounded-2xl relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-white/80 w-[40%]"></div>
                    </div>
                </div>
            </GlassPane>

            {/* Music Player Mockup */}
            <GlassPane className="p-4 rounded-3xl flex items-center gap-4 mt-auto" blur="xl">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl"></div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold">Midnight City</h4>
                    <p className="text-xs opacity-60">M83</p>
                </div>
                <div className="flex gap-4 text-xl">
                    <span>⏮</span>
                    <span>⏯</span>
                    <span>⏭</span>
                </div>
            </GlassPane>

        </motion.div>
    );
}

export default ControlCenter;
