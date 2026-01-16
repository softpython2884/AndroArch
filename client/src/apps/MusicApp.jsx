import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc, Music } from 'lucide-react';

const tracks = [
    {
        title: "Neon Nights",
        artist: "Synthwave Boy",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Cyber Drift",
        artist: "Data Ghost",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Orbit Pulse",
        artist: "Lunar Echo",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        cover: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=500&q=80"
    }
];

const MusicApp = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    const track = tracks[currentTrackIndex];

    useEffect(() => {
        // Stop current audio if switching tracks
        if (audioRef.current) {
            audioRef.current.pause();
        }
        audioRef.current = new Audio(track.url);
        audioRef.current.loop = false; // Disable loop for auto-next

        const updateProgress = () => {
            if (audioRef.current?.duration) {
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
        };

        const handleEnded = () => skipForward();

        audioRef.current.addEventListener('timeupdate', updateProgress);
        audioRef.current.addEventListener('ended', handleEnded);

        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Audio Play Error:", e));
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateProgress);
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.pause();
            }
        };
    }, [currentTrackIndex]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Audio Play Error:", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const skipForward = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
        setIsPlaying(true);
    };

    const skipBack = () => {
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
        } else {
            setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
        }
        setIsPlaying(true);
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-indigo-950 to-black p-8 text-white">
            {/* Album Art Area */}
            <div className="flex-1 flex items-center justify-center py-8">
                <div className={`w-64 h-64 rounded-full bg-black border-4 border-white/5 shadow-[0_0_50px_rgba(79,70,229,0.3)] flex items-center justify-center relative overflow-hidden transition-all duration-700 ${isPlaying ? 'scale-105' : 'scale-95 opacity-80'}`}>
                    <div
                        className={`absolute inset-0 bg-cover bg-center opacity-70 transition-transform duration-[10s] linear infinite ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}
                        style={{ backgroundImage: `url(${track.cover})` }}
                    />
                    <div className="w-16 h-16 bg-black rounded-full z-10 flex items-center justify-center border border-white/20">
                        <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-auto max-w-md mx-auto w-full">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold tracking-tight mb-1 animate-in fade-in slide-in-from-bottom-2 duration-500">{track.title}</h2>
                    <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest opacity-80">{track.artist}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 group cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    if (audioRef.current?.duration) {
                        audioRef.current.currentTime = percent * audioRef.current.duration;
                        setProgress(percent * 100);
                    }
                }}>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-white/30 mt-2 font-mono tracking-tighter">
                        <span>{formatTime(audioRef.current?.currentTime)}</span>
                        <span>{formatTime(audioRef.current?.duration)}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between px-6 mb-4">
                    <button onClick={skipBack} className="text-white/50 hover:text-white active:scale-90 transition-all">
                        <SkipBack size={32} fill="currentColor" className="opacity-80" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all"
                    >
                        {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
                    </button>

                    <button onClick={skipForward} className="text-white/50 hover:text-white active:scale-90 transition-all">
                        <SkipForward size={32} fill="currentColor" className="opacity-80" />
                    </button>
                </div>

                {/* Playlist Hint */}
                <div className="text-center text-[10px] opacity-20 uppercase tracking-[0.2em] font-bold">
                    Track {currentTrackIndex + 1} of {tracks.length}
                </div>
            </div>
        </div>
    );
};

export default MusicApp;
