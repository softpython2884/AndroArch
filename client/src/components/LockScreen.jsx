import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

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
                    initial={{ y: 0 }}
                    exit={{ y: '-100%', transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[90] bg-black text-white flex flex-col items-center justify-between py-20 bg-cover bg-center"
                    style={{ backgroundImage: "url('/src/assets/wallpaper.png')" }}
                >
                    {/* Mist Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

                    <div className="z-10 flex flex-col items-center mt-10">
                        <h1 className="text-7xl font-light tracking-tighter text-white/90 drop-shadow-2xl">
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </h1>
                        <p className="text-sm tracking-[0.3em] font-light text-white/70 mt-2 uppercase">
                            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <motion.div
                        className="z-10 flex flex-col items-center gap-2 cursor-pointer"
                        drag="y"
                        dragConstraints={{ top: -200, bottom: 0 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (offset.y < -100 || velocity.y < -500) {
                                onUnlock();
                            }
                        }}
                    >
                        <Lock className="w-6 h-6 text-white/50 mb-2 animate-bounce" />
                        <p className="text-xs uppercase tracking-widest text-white/50">Swipe Up to Unlock</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LockScreen;
