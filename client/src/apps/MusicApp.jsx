import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc, Music } from 'lucide-react';

const MusicApp = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(30);
    const [track, setTrack] = useState({ title: "Neon Nights", artist: "Synthwave Boy", duration: "3:45" });

    // Simulate progress
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(p => (p >= 100 ? 0 : p + 1));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-indigo-900 to-black p-8 text-white">

            {/* Album Art Area */}
            <div className="flex-1 flex items-center justify-center py-8">
                <div className={`w-64 h-64 rounded-full bg-black border-4 border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=500&q=80')] bg-cover bg-center opacity-80"></div>
                    <div className="w-16 h-16 bg-black rounded-full z-10 flex items-center justify-center border border-white/20">
                        <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold tracking-tight mb-1">{track.title}</h2>
                    <p className="text-white/50 text-sm font-medium uppercase tracking-widest">{track.artist}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 group cursor-pointer">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-white/40 mt-2 font-mono">
                        <span>1:12</span>
                        <span>{track.duration}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between px-4">
                    <button className="text-white/70 hover:text-white active:scale-90 transition-transform"><SkipBack size={32} /></button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                        {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
                    </button>

                    <button className="text-white/70 hover:text-white active:scale-90 transition-transform"><SkipForward size={32} /></button>
                </div>
            </div>
        </div>
    );
};

export default MusicApp;
