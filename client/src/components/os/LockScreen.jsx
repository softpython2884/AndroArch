import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Delete, ChevronUp, BellRing, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { GlassPane } from '../ui/GlassPane';
import { useNotifications } from '../../context/NotificationContext';
import { useSettings } from '../../context/SettingsContext';

const LockScreen = ({ isLocked, onUnlock }) => {
    const { notifications } = useNotifications();
    const { settings } = useSettings();
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [time, setTime] = useState(new Date());

    const CORRECT_PIN = settings.pin;

    const getIcon = (type) => {
        switch (type) {
            case 'broadcast': return <BellRing className="text-white" size={20} />;
            case 'error': return <AlertCircle className="text-red-400" size={20} />;
            case 'success': return <CheckCircle className="text-green-400" size={20} />;
            default: return <Info className="text-blue-400" size={20} />;
        }
    };

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleNum = (num) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
            setError(false);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    useEffect(() => {
        if (pin.length === 4) {
            if (pin === CORRECT_PIN) {
                onUnlock();
                setPin("");
                setShowPin(false);
            } else {
                setError(true);
                setTimeout(() => setPin(""), 500);
            }
        }
    }, [pin, onUnlock]);

    return (
        <AnimatePresence>
            {isLocked && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl text-white overflow-hidden"
                >
                    {/* ==================== SCREEN 1: CLOCK & NOTIFICATIONS ==================== */}
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center pt-24 pb-8"
                        initial={{ opacity: 1, y: 0 }}
                        animate={{
                            opacity: showPin ? 0 : 1,
                            y: showPin ? -50 : 0,
                            scale: showPin ? 0.9 : 1
                        }}
                        transition={{ duration: 0.4 }}
                        style={{ pointerEvents: showPin ? 'none' : 'auto' }}
                    >
                        {/* Clock */}
                        <div className="mb-12 text-center">
                            <h1 className="text-7xl font-thin tracking-tighter drop-shadow-lg">
                                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </h1>
                            <p className="text-xl font-light opacity-80 drop-shadow-md">
                                {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        {/* Notifications */}
                        <div className="w-full px-6 flex-1 flex flex-col gap-3 items-center max-w-sm overflow-hidden">
                            {notifications.length === 0 ? (
                                <div className="opacity-20 flex flex-col items-center">
                                    <Lock size={32} className="mb-2" />
                                    <span className="text-[10px] uppercase tracking-widest font-black">Secure Link Established</span>
                                </div>
                            ) : (
                                notifications.slice(0, 3).map(notif => (
                                    <GlassPane
                                        key={notif.id}
                                        blur="md"
                                        className="w-full p-4 rounded-[2rem] flex gap-4 items-center cursor-pointer active:scale-[0.98] border border-white/5"
                                    >
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${notif.type === 'broadcast' ? 'bg-red-600' : 'bg-white/5'}`}>
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold truncate">{notif.title}</h4>
                                            <p className="text-xs opacity-60 truncate">{notif.message}</p>
                                        </div>
                                        <span className="text-[10px] opacity-40 font-mono">{notif.timestamp}</span>
                                    </GlassPane>
                                ))
                            )}
                            {notifications.length > 3 && (
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-30 mt-2">
                                    + {notifications.length - 3} more encrypted alerts
                                </span>
                            )}
                        </div>

                        {/* Swipe Up Indicator */}
                        <motion.div
                            className="mt-auto flex flex-col items-center gap-2 cursor-pointer w-full py-8"
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset, velocity }) => {
                                if (offset.y < -50 || velocity.y < -300) {
                                    setShowPin(true);
                                }
                            }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ChevronUp size={24} className="opacity-50" />
                            <span className="text-xs font-medium tracking-widest opacity-50 uppercase">Swipe to Unlock</span>
                        </motion.div>
                    </motion.div>


                    {/* ==================== SCREEN 2: PIN PAD ==================== */}
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-2xl"
                        initial={{ y: '100%' }}
                        animate={{ y: showPin ? 0 : '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        <div className="flex flex-col items-center w-full max-w-xs">

                            <div className="mb-8 text-sm font-medium tracking-widest uppercase opacity-70">
                                Enter Passcode
                            </div>

                            {/* PIN Dots */}
                            <div className="flex gap-6 mb-12">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-4 h-4 rounded-full border border-white/30 transition-all duration-200 ${i < pin.length
                                            ? (error ? "bg-red-500 border-red-500" : "bg-white border-white")
                                            : "bg-transparent"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Numpad */}
                            <div className="grid grid-cols-3 gap-x-8 gap-y-6 mb-12">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleNum(num.toString())}
                                        className="w-20 h-20 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 transition-all flex items-center justify-center text-3xl font-light"
                                    >
                                        {num}
                                    </button>
                                ))}
                                <div /> {/* Spacer */}
                                <button
                                    onClick={() => handleNum("0")}
                                    className="w-20 h-20 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 transition-all flex items-center justify-center text-3xl font-light"
                                >
                                    0
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-20 h-20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-90"
                                >
                                    {/* If PIN is empty, show 'Cancel' button to go back */}
                                    {pin.length === 0 ? (
                                        <span className="text-sm font-medium uppercase tracking-wide" onClick={() => setShowPin(false)}>Cancel</span>
                                    ) : (
                                        <Delete size={28} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LockScreen;
