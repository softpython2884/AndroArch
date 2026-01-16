import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const Window = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%', opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: '20%', opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 250, damping: 25 }}
                    className="absolute inset-0 z-40 bg-black flex flex-col overflow-hidden"
                >
                    {/* Mobile App Header */}
                    <div className="h-16 bg-black/80 backdrop-blur-md flex items-end justify-between px-4 pb-3 border-b border-white/5 z-50">
                        <button
                            onClick={onClose}
                            className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="text-white" />
                        </button>
                        <span className="font-semibold text-sm tracking-wide">{title}</span>
                        <div className="w-8"></div> {/* Spacer for center alignment */}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-auto bg-gray-900/90 relative">
                        {children}
                    </div>

                    {/* Home Indicator / Gesture Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-transparent flex justify-center items-end pb-2 pointer-events-none z-50">
                        <div className="w-32 h-1 bg-white/40 rounded-full" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Window;
