import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [tracks, setTracks] = useState([
        {
            id: 1,
            title: "Neon Nights",
            artist: "Synthwave Boy",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            title: "Cyber Drift",
            artist: "Data Ghost",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 3,
            title: "Orbit Pulse",
            artist: "Lunar Echo",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            cover: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 4,
            title: "Digital Horizon",
            artist: "Silicon Soul",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 5,
            title: "Void Runner",
            artist: "Phantom Link",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
            cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 6,
            title: "Glitch Echo",
            artist: "Byte Bandit",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
            cover: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&w=500&q=80"
        }
    ]);

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(new Audio(tracks[0].url));

    const currentTrack = tracks[currentTrackIndex];

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => skipForward();

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentTrackIndex]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Global Audio Play Error:", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrackIndex]);

    const playTrack = (index, trackOverride = null) => {
        const track = trackOverride || tracks[index];
        if (!track) return;

        if (index === currentTrackIndex && !trackOverride) {
            setIsPlaying(!isPlaying);
        } else {
            audioRef.current.pause();
            audioRef.current.src = track.url;
            setCurrentTrackIndex(index);
            setIsPlaying(true);
        }
    };

    const addTrack = (newTrack) => {
        setTracks(prev => [...prev, newTrack]);
    };

    const skipForward = () => {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        playTrack(nextIndex);
    };

    const skipBackward = () => {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        playTrack(prevIndex);
    };

    const seek = (val) => {
        if (audioRef.current.duration) {
            audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
            setProgress(val);
        }
    };

    return (
        <MusicContext.Provider value={{
            currentTrack,
            isPlaying,
            setIsPlaying,
            progress,
            playTrack,
            addTrack,
            skipForward,
            skipBackward,
            seek,
            tracks
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);
