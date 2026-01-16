import { motion } from 'framer-motion';

const DesktopIcon = ({ label, Icon, onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="flex flex-col items-center justify-center p-2 gap-3 w-20 group"
        >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shadow-lg backdrop-blur-sm group-hover:bg-white/10 group-hover:border-white/30 transition-all">
                {Icon && <Icon size={24} strokeWidth={1.5} />}
            </div>
            <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider group-hover:text-white transition-colors text-center leading-tight shadow-black drop-shadow-md">
                {label}
            </span>
        </motion.button>
    );
};

export default DesktopIcon;
