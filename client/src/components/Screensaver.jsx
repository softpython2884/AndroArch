import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Screensaver = ({ active, onUnlock }) => {
    const [time, setTime] = useState(new Date());

    // Wake Lock implementation
    useEffect(() => {
        let wakeLock = null;

        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Wake Lock is active');
                }
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        };

        if (active) {
            requestWakeLock();
        } else {
            if (wakeLock) {
                wakeLock.release().then(() => {
                    wakeLock = null;
                });
            }
        }

        return () => {
            if (wakeLock) wakeLock.release();
        };
    }, [active]);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center cursor-none"
                    onClick={onUnlock}
                >
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-8xl font-thin tracking-widest text-white/80"
                    >
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </motion.div>
                    <div className="mt-4 text-xs tracking-[0.5em] text-gray-500 uppercase">
                        System Hibernation
                    </div>

                    {/* Ambient Background Particles or Mist could go here */}
                    <div className="absolute inset-0 bg-[url('/src/assets/wallpaper.png')] bg-cover opacity-10 blur-xl"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Screensaver;
