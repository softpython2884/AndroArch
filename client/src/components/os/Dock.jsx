import { GlassPane } from '../ui/GlassPane';
import { motion } from 'framer-motion';

const DockItem = ({ icon: Icon, onClick }) => (
    <motion.div
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        // Standard app icon size ~60px on mobile, here scaled down for web view
        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-lg active:bg-white/10"
    >
        <Icon size={24} className="text-white" />
    </motion.div>
);

const Dock = ({ items }) => {
    return (
        // Floats slightly off bottom, height reduced from 24 (96px) to 20 (80px), closer to bottom
        <div className="absolute bottom-4 left-4 right-4 z-30 flex justify-center">
            <GlassPane
                className="h-[84px] w-full max-w-sm rounded-[28px] flex items-center justify-around px-4"
                blur="2xl"
                border={true}
            >
                {items.map((item, idx) => (
                    <DockItem key={idx} icon={item.icon} onClick={item.onClick} />
                ))}
            </GlassPane>
        </div>
    );
};

export default Dock;
