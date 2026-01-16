import { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, BatteryCharging, WifiOff } from 'lucide-react';

const StatusBar = ({ dark = false }) => {
    const [time, setTime] = useState(new Date());
    const [battery, setBattery] = useState({ level: 100, charging: false });
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 10000);

        const updateOnline = () => setOnline(navigator.onLine);
        window.addEventListener('online', updateOnline);
        window.addEventListener('offline', updateOnline);

        if ('getBattery' in navigator) {
            navigator.getBattery().then(bat => {
                const updateBat = () => setBattery({ level: Math.round(bat.level * 100), charging: bat.charging });
                updateBat();
                bat.addEventListener('levelchange', updateBat);
                bat.addEventListener('chargingchange', updateBat);
            });
        }

        return () => {
            clearInterval(timer);
            window.removeEventListener('online', updateOnline);
            window.removeEventListener('offline', updateOnline);
        };
    }, []);

    const colorClass = dark ? 'text-black' : 'text-white';

    return (
        <div className={`h-11 w-full flex items-center justify-between px-6 text-[11px] font-black uppercase tracking-widest ${colorClass} z-50 select-none`}>
            <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs opacity-80">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            <div className="flex items-center gap-3 opacity-60">
                <div className="flex items-center gap-1">
                    <Signal size={12} />
                    <span className="text-[9px]">5G</span>
                </div>
                {online ? <Wifi size={12} /> : <WifiOff size={12} className="text-red-500" />}
                <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono">{battery.level}%</span>
                    {battery.charging ? <BatteryCharging size={14} className="text-green-400" /> : <Battery size={14} />}
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
