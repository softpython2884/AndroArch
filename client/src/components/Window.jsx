import { motion, AnimatePresence } from 'framer-motion';

const Window = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    // Mobile: Fixed inset-0 (full screen). Desktop (md): inset-4 or centered modal style could be used, 
                    // but here we keep full screen-ish for that "Immersive App" feel, just with some margin on desktop if desired.
                    // For strictly mobile "Sub-OS", full screen overlays feel most native.
                    className="absolute inset-0 z-50 flex flex-col bg-sub-black text-white overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-neon-green/20 bg-sub-gray/90 backdrop-blur-md">
                        <span className="font-mono text-neon-green font-bold text-lg tracking-widest pl-2">
                            {title}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/30"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-4 relative bg-sub-black/50">
                        {/* Scanlines effect overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.03]"></div>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Window;
