import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { X, AlertCircle, Info, CheckCircle, BellRing } from 'lucide-react';

const NotificationTray = () => {
    const { notifications, removeNotification } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'broadcast': return <BellRing className="text-white" size={20} />;
            case 'error': return <AlertCircle className="text-red-400" size={20} />;
            case 'success': return <CheckCircle className="text-green-400" size={20} />;
            default: return <Info className="text-blue-400" size={20} />;
        }
    };

    const getVariant = (type) => {
        switch (type) {
            case 'broadcast':
                return "bg-red-900/60 border-red-500/30 shadow-red-950/40";
            case 'error':
                return "bg-black/60 border-red-500/20 shadow-black";
            case 'success':
                return "bg-black/60 border-green-500/20 shadow-black";
            default:
                return "bg-black/60 border-white/10 shadow-black";
        }
    };

    return (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg flex flex-col gap-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        layout
                        initial={{ y: -50, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={`pointer-events-auto backdrop-blur-2xl border rounded-3xl p-5 shadow-2xl flex items-start gap-4 ring-1 ring-white/10 ${getVariant(notif.type)}`}
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${notif.type === 'broadcast' ? 'bg-red-600' : 'bg-white/5'}`}>
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${notif.type === 'broadcast' ? 'text-red-100' : 'text-white/50'}`}>
                                    {notif.title}
                                </h4>
                                <span className="text-[9px] font-mono opacity-40">{notif.timestamp}</span>
                            </div>
                            <p className={`text-sm leading-relaxed ${notif.type === 'broadcast' ? 'font-bold text-white' : 'text-white/80'}`}>
                                {notif.message}
                            </p>
                        </div>
                        <button
                            onClick={() => removeNotification(notif.id)}
                            className="text-white/20 hover:text-white p-1 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationTray;
