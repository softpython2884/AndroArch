import { GlassPane } from '../ui/GlassPane';
import { motion } from 'framer-motion';

const DockItem = ({ icon: Icon, onClick }) => (
    <motion.div
        whileTap={{ scale: 0.8 }}
        onClick={onClick}
        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-lg"
    >
        <Icon size={26} className="text-white" />
    </motion.div>
);

const Dock = ({ items }) => {
    return (
        <GlassPane
            className="absolute bottom-6 left-4 right-4 h-24 rounded-[30px] flex items-center justify-around px-2 z-30"
            blur="xl"
            border={true}
        >
            {items.map((item, idx) => (
                <DockItem key={idx} icon={item.icon} onClick={item.onClick} />
            ))}
        </GlassPane>
    );
};

export default Dock;
