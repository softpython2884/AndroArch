import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, ListMusic, Volume2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { motion, AnimatePresence } from 'framer-motion';

const MusicApp = () => {
    const {
        currentTrack,
        isPlaying,
        setIsPlaying,
        progress,
        playTrack,
        skipForward,
        skipBackward,
        seek,
        tracks
    } = useMusic();

    const [showPlaylist, setShowPlaylist] = useState(false);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const currentTrackIndex = tracks.findIndex(t => t.id === currentTrack.id);

    return (
        <div className="h-full flex flex-col bg-[#050505] text-white overflow-hidden font-sans relative">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"
                    style={{ animationDuration: '4s' }}
                />
                <div
                    className="absolute -bottom-[20%] -right-[20%] w-[80%] h-[80%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"
                    style={{ animationDuration: '6s' }}
                />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 z-10 border-b border-white/5 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
                        <Music size={18} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">AndroPlayer</h2>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none mt-0.5">Hi-Res Engine</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className={`p-2.5 rounded-xl transition-all ${showPlaylist ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
                >
                    <ListMusic size={18} />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!showPlaylist ? (
                        <motion.div
                            key="player"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-sm flex flex-col items-center"
                        >
                            {/* Vinyl Record */}
                            <div className="relative group mb-12">
                                <motion.div
                                    animate={{ rotate: isPlaying ? 360 : 0 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-zinc-900 border-[8px] border-zinc-800 shadow-2xl flex items-center justify-center relative ring-1 ring-white/10"
                                >
                                    {/* Grooves */}
                                    <div className="absolute inset-4 rounded-full border border-white/5" />
                                    <div className="absolute inset-8 rounded-full border border-white/5" />
                                    <div className="absolute inset-12 rounded-full border border-white/5" />

                                    {/* Cover */}
                                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-zinc-900 z-10 shadow-xl">
                                        <img src={currentTrack.cover} alt="album" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Center Hole */}
                                    <div className="absolute w-3 h-3 rounded-full bg-zinc-900 border-2 border-zinc-700 z-20 shadow-inner" />
                                </motion.div>
                            </div>

                            {/* Info */}
                            <div className="text-center mb-10 w-full space-y-1">
                                <h3 className="text-xl font-black tracking-tight text-white truncate px-4">{currentTrack.title}</h3>
                                <p className="text-blue-500 font-bold tracking-[0.2em] uppercase text-[9px] opacity-60">{currentTrack.artist}</p>
                            </div>

                            {/* Controls & Progress */}
                            <div className="w-full space-y-8">
                                <div className="space-y-3">
                                    <div
                                        className="h-1 w-full bg-white/10 rounded-full relative cursor-pointer group"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const x = e.clientX - rect.left;
                                            seek((x / rect.width) * 100);
                                        }}
                                    >
                                        <div
                                            className="absolute top-0 left-0 h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                                            style={{ width: `${progress}%` }}
                                        />
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"
                                            style={{ left: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-4">
                                    <button
                                        onClick={skipBackward}
                                        className="p-3 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-90"
                                    >
                                        <SkipBack size={24} fill="currentColor" />
                                    </button>
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center transition-all shadow-xl shadow-white/10 active:scale-95 hover:scale-105"
                                    >
                                        {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
                                    </button>
                                    <button
                                        onClick={skipForward}
                                        className="p-3 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-90"
                                    >
                                        <SkipForward size={24} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="playlist"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="w-full h-full flex flex-col pt-4"
                        >
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-white/20 px-2">Up Next</h3>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-none">
                                {tracks.map((t, i) => (
                                    <button
                                        key={t.id}
                                        onClick={() => playTrack(i)}
                                        className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${currentTrack.id === t.id ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-md">
                                            <img src={t.cover} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h4 className={`font-bold text-xs truncate ${currentTrack.id === t.id ? 'text-white' : 'text-white/80'}`}>{t.title}</h4>
                                            <p className={`text-[9px] uppercase tracking-widest font-medium ${currentTrack.id === t.id ? 'text-white/60' : 'text-white/30'}`}>{t.artist}</p>
                                        </div>
                                        {currentTrack.id === t.id && isPlaying && (
                                            <div className="flex gap-0.5 items-end h-3 mr-2">
                                                {[1, 2, 3].map(b => (
                                                    <motion.div
                                                        key={b}
                                                        animate={{ height: [4, 10, 6, 10, 4] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: b * 0.1 }}
                                                        className="w-0.5 bg-white rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Volume Hint */}
            <div className="p-6 flex items-center justify-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
                <Volume2 size={12} />
                <div className="w-24 h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-white" />
                </div>
            </div>
        </div>
    );
};

export default MusicApp;
