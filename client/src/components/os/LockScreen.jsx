import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Wifi, Bluetooth } from 'lucide-react';
import { GlassPane } from '../ui/GlassPane';
import wallpaper from '../../assets/wallpaper.png';

const LockScreen = ({ isLocked, onUnlock }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <AnimatePresence>
            {isLocked && (
                <motion.div
                    initial={{ y: 0, opacity: 1 }}
                    exit={{ y: -800, opacity: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
                    className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-between pb-10 overflow-hidden"
                >
                    {/* Background with heavy blur if notifications exist, usually clear on lockscreen */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${wallpaper})` }}
                    >
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>

                    {/* Status Bar Placeholder (Lock Screen version) */}
                    <div className="z-10 w-full flex justify-between px-6 py-3 text-xs opacity-80">
                        <span>Vodafone FR</span>
                        <div className="flex gap-2">
                            <Wifi size={14} />
                            <span>100%</span>
                        </div>
                    </div>

                    {/* Clock Area */}
                    <div className="z-10 flex flex-col items-center mt-12 w-full text-center">
                        <h1 className="text-8xl font-thin tracking-tighter text-white drop-shadow-lg">
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </h1>
                        <p className="text-lg font-normal text-white/90 mt-2 capitalize drop-shadow-md">
                            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Notifications Mockup */}
                    <div className="z-10 w-full px-4 flex-1 flex flex-col justify-center gap-2 max-w-sm">
                        <GlassPane blur="md" className="p-4 rounded-2xl flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-xl">💬</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold">Discord</h4>
                                <p className="text-xs opacity-70">New message from @Neo</p>
                            </div>
                            <span className="text-[10px] opacity-50">2m</span>
                        </GlassPane>
                    </div>

                    {/* Bottom Action */}
                    <motion.div
                        className="z-10 flex flex-col items-center gap-3 w-full"
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (offset.y < -100 || velocity.y < -500) {
                                onUnlock();
                            }
                        }}
                    >
                        <div className="flex items-center gap-2 mb-4 opacity-80">
                            <Lock size={16} />
                            <span className="text-sm font-medium">Swipe up to unlock</span>
                        </div>

                        {/* Bottom Handles / Shortcuts */}
                        <div className="flex justify-between w-full px-8">
                            <GlassPane className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform" blur="lg">
                                <span className="text-xl">🔦</span>
                            </GlassPane>
                            <GlassPane className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform" blur="lg">
                                <span className="text-xl">📷</span>
                            </GlassPane>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LockScreen;
