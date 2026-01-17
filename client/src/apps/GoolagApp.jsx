import { useState } from "react";
import { ArrowLeft, Search, RotateCcw, Globe } from "lucide-react";

const GoolagApp = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults([]); // Clear previous
        const serverHost = `${window.location.protocol}//${window.location.hostname}:3000`;
        try {
            const res = await fetch(`${serverHost}/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (err) {
            setResults([{ title: "Net-Node Error", snippet: "Could not reach the Goolag servers. Check backend connection.", link: "#" }]);
        }
        setLoading(false);
    };

    const openLink = (url) => {
        // Simple check to ensure we have a valid protocol
        let target = url;
        if (!target.startsWith('http')) {
            target = 'https://' + target;
        }
        setCurrentUrl(target);
    };

    const goBack = () => {
        setCurrentUrl(null);
    };

    // --- Browser View ---
    if (currentUrl) {
        return (
            <div className="flex flex-col h-full bg-white text-black">
                {/* Browser Toolbar */}
                <div className="flex items-center gap-2 p-3 bg-gray-100 border-b border-gray-300 shadow-sm z-20">
                    <button onClick={goBack} className="p-2 hover:bg-gray-200 rounded-full text-black transition-colors active:scale-95">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-1.5 text-sm text-gray-700 flex items-center gap-2 shadow-inner">
                        <Globe size={14} className="opacity-50" />
                        <span className="truncate flex-1">{currentUrl}</span>
                    </div>
                    <button onClick={() => setCurrentUrl(currentUrl)} className="p-2 hover:bg-gray-200 rounded-full text-black transition-colors active:scale-95">
                        <RotateCcw size={18} />
                    </button>
                </div>

                {/* Web Content */}
                <iframe
                    src={currentUrl}
                    className="flex-1 w-full h-full border-none bg-white z-10"
                    title="Goolag Browser"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
                    referrerPolicy="no-referrer"
                />
            </div>
        );
    }

    // --- Search Engine View ---
    return (
        <div className="flex flex-col h-full bg-sub-black text-white px-4 relative overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent"></div>

            {/* Search Bar centered or top based on results */}
            <div className={`transition-all duration-500 ease-in-out flex flex-col items-center z-10 ${results.length > 0 ? 'py-6' : 'flex-1 justify-center -mt-20'}`}>
                <h1 className={`font-bold transition-all duration-500 ${results.length > 0 ? 'text-3xl mb-4' : 'text-5xl mb-8'} tracking-widest flex items-center gap-2`}>
                    <Globe className={`text-neon-blue transition-all ${results.length > 0 ? 'w-6 h-6' : 'w-12 h-12'}`} />
                    <span>
                        <span className="text-neon-blue">Goo</span><span className="text-neon-pink">lag</span>
                    </span>
                </h1>

                <form onSubmit={handleSearch} className={`w-full transition-all duration-500 ${results.length > 0 ? 'max-w-full' : 'max-w-md'}`}>
                    <div className="relative group">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search the void..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-neon-blue focus:bg-white/10 outline-none transition-all placeholder:text-white/20 shadow-lg"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-neon-blue transition-colors" size={18} />
                    </div>
                </form>
            </div>

            {/* Results List */}
            {results.length > 0 && (
                <div className="flex-1 overflow-y-auto w-full pb-8 no-scrollbar z-10">
                    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {loading && <div className="text-center py-8 text-neon-blue animate-pulse">Scanning nodes...</div>}

                        {!loading && results.map((res, idx) => (
                            <div
                                key={idx}
                                onClick={() => openLink(res.link)}
                                className="group cursor-pointer bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-transparent hover:border-white/10 transition-all active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-white/50">
                                        {res.link.charAt(8).toUpperCase()}
                                    </div>
                                    <div className="text-xs text-neon-blue/80 truncate flex-1">{res.link}</div>
                                </div>
                                <h3 className="text-lg text-neon-pink font-medium group-hover:underline leading-tight mb-2">{res.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{res.snippet}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoolagApp;
