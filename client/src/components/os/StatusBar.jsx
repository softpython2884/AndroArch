import { Wifi, Signal, Battery } from 'lucide-react';

const StatusBar = ({ dark = false }) => {
    const colorClass = dark ? 'text-black' : 'text-white';

    return (
        <div className={`h-11 w-full flex items-center justify-between px-6 text-sm font-medium ${colorClass} z-50 select-none`}>
            <div className="flex items-center gap-1">
                <span>9:41</span>
            </div>

            {/* Notch area or Spacer */}

            <div className="flex items-center gap-2">
                <Signal size={16} />
                <Wifi size={16} />
                <Battery size={18} />
            </div>
        </div>
    );
};

export default StatusBar;
