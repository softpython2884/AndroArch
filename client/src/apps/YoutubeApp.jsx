import { useState, useRef, useEffect } from "react";
import { Search, Play, Pause, Volume2, Maximize, ArrowLeft, Youtube, Loader2, AlertCircle } from "lucide-react";

const YoutubeApp = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoError, setVideoError] = useState(null);
    const videoRef = useRef(null);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setCurrentVideo(null);
        try {
            const res = await fetch(`http://localhost:3000/api/youtube/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const playVideo = (video) => {
        setCurrentVideo(video);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleBack = () => {
        if (currentVideo) {
            setCurrentVideo(null);
        } else {
            setResults([]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black text-white overflow-hidden font-sans">
            {/* Header / Search Bar */}
            <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-black/50 backdrop-blur-md z-20">
                {(results.length > 0 || currentVideo) && (
                    <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                )}

                <div className="flex items-center gap-2 mr-4">
                    <Youtube className="text-red-600" size={28} />
                    <span className="font-bold tracking-tighter text-xl hidden sm:inline">Tube<span className="text-red-600">Arch</span></span>
                </div>

                {!currentVideo && (
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher sur YouTube..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 focus:outline-none focus:border-red-600/50 transition-all text-sm"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    </form>
                )}

                {currentVideo && (
                    <div className="flex-1 truncate font-medium text-sm text-gray-300">
                        {currentVideo.title}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
                        <Loader2 className="text-red-600 animate-spin mb-4" size={40} />
                        <p className="text-sm text-gray-400 animate-pulse">Extraction des flux...</p>
                    </div>
                )}

                {/* Video Player View */}
                {currentVideo && (
                    <div className="h-full flex flex-col bg-black">
                        <div className="relative group flex-1 flex items-center justify-center bg-black">
                            <video
                                ref={videoRef}
                                src={`http://localhost:3000/api/youtube/stream?id=${currentVideo.id}`}
                                className="max-w-full max-h-full aspect-video shadow-2xl z-10"
                                autoPlay
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onError={(e) => {
                                    console.error("Video error:", e);
                                    setVideoError("Format non supporté ou erreur de flux. Réessaie...");
                                }}
                            />

                            {videoError && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 z-20 p-6 text-center">
                                    <AlertCircle className="text-red-500 mb-4" size={48} />
                                    <p className="text-sm font-medium mb-4">{videoError}</p>
                                    <button
                                        onClick={() => {
                                            setVideoError(null);
                                            videoRef.current.load();
                                        }}
                                        className="px-6 py-2 bg-red-600 rounded-full font-bold text-xs"
                                    >
                                        Réessayer
                                    </button>
                                </div>
                            )}

                            {/* Custom Controls Overlay (Fade out) */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                <div className="flex items-center gap-6">
                                    <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
                                        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                                    </button>
                                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-600 w-1/3 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                                    </div>
                                    <Volume2 size={24} className="text-white/60" />
                                    <Maximize size={24} className="text-white/60" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-neutral-950 border-t border-white/5">
                            <h2 className="text-xl font-bold mb-2">{currentVideo.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="text-red-600 font-medium">{currentVideo.author}</span>
                                <span>•</span>
                                <span>{currentVideo.views} vues</span>
                                <span>•</span>
                                <span>{currentVideo.duration}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Results Grid */}
                {!currentVideo && results.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                        {results.map((video) => (
                            <div
                                key={video.id}
                                onClick={() => playVideo(video)}
                                className="group cursor-pointer flex flex-col gap-3"
                            >
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/5 group-hover:border-red-600/30 transition-all shadow-lg">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                        {video.duration}
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                                            <Play fill="white" size={20} className="ml-1" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-red-500 transition-colors leading-snug">{video.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{video.author} • {video.views}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Welcome State */}
                {!currentVideo && results.length === 0 && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10">
                        <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Youtube className="text-red-600" size={48} />
                        </div>
                        <h1 className="text-3xl font-bold mb-3 tracking-tight">Bienvenue sur TubeArch</h1>
                        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                            Profitez de YouTube sans traçage, sans publicités et avec une intégration complète via nos serveurs sécurisés.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YoutubeApp;
