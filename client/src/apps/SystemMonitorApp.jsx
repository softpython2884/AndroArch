import { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Battery, Zap } from 'lucide-react';
import { io } from 'socket.io-client';

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-between border border-white/5 relative overflow-hidden group">
        <div className={`text-${color}-500 mb-2`}>
            <Icon size={24} />
        </div>
        <div>
            <div className="text-2xl font-light tracking-tighter">{value}%</div>
            <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</div>
        </div>
        {subtext && <div className="text-[10px] text-white/30 mt-1 font-mono">{subtext}</div>}

        {/* Progress Bar Background */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div className={`h-full bg-${color}-500 transition-all duration-500`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const SystemMonitorApp = () => {
    const [stats, setStats] = useState({ cpu: 0, ram: 0, battery: 100, charging: false });

    useEffect(() => {
        const socket = io('http://localhost:3000');
        socket.on('system_status', (data) => setStats(data));
        return () => socket.disconnect();
    }, []);

    // History graph simulator (visual only for now)
    const [graphBars, setGraphBars] = useState(new Array(20).fill(10));
    useEffect(() => {
        const interval = setInterval(() => {
            setGraphBars(prev => [...prev.slice(1), stats.cpu]);
        }, 2000);
        return () => clearInterval(interval);
    }, [stats.cpu]);

    return (
        <div className="h-full bg-sub-black p-4 flex flex-col gap-4 overflow-auto">
            {/* Header Graph */}
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">System Load</h2>
                        <p className="text-sm opacity-50">Real-time telemetry</p>
                    </div>
                    <div className="text-right">
                        <div className="text-neon-green font-mono">ONLINE</div>
                        <div className="text-xs opacity-50">Localhost Node</div>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="flex items-end gap-1 h-24 mb-2">
                    {graphBars.map((val, i) => (
                        <div key={i} className="flex-1 bg-neon-blue/30 rounded-t-sm transition-all duration-500" style={{ height: `${val}%` }}></div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard icon={Cpu} label="CPU Core" value={stats.cpu} color="blue" subtext="AMD Ryzen / Intel" />
                <StatCard icon={Activity} label="Memory" value={stats.ram} color="pink" subtext="RAM Usage" />
                <StatCard icon={Battery} label="Power" value={stats.battery} color="green" subtext={stats.charging ? "Charging AC" : "Discharging"} />
                <StatCard icon={HardDrive} label="Disk" value={42} color="yellow" subtext="/dev/sda1" />
            </div>

            {/* Process List (Mockup for now) */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex-1">
                <h3 className="text-xs uppercase font-medium text-white/50 mb-4">Top Processes</h3>
                <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                        <span className="text-neon-blue">node.exe</span>
                        <span className="opacity-50">12% CPU</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-neon-pink">chrome.exe</span>
                        <span className="opacity-50">850MB RAM</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white">code.exe</span>
                        <span className="opacity-50">2% CPU</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemMonitorApp;
