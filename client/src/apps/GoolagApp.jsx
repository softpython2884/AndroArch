import { useState } from "react";

const GoolagApp = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        // Simulator for now, later we hit the proxy
        try {
            const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (err) {
            setResults([{ title: "Error", snippet: "Could not reach the Net-Node." }]);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col items-center justify-center py-10">
                <h1 className="text-4xl font-bold mb-6 text-white tracking-widest"><span className="text-neon-blue">Goo</span><span className="text-neon-pink">lag</span></h1>
                <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search the void..."
                        className="flex-1 bg-sub-gray border border-gray-700 p-2 text-white focus:border-neon-blue outline-none"
                    />
                    <button type="submit" className="bg-neon-blue/20 text-neon-blue border border-neon-blue px-4 hover:bg-neon-blue hover:text-black transition-colors">
                        GO
                    </button>
                </form>
            </div>

            <div className="flex-1 overflow-auto px-4 max-w-2xl mx-auto w-full">
                {loading && <div className="text-center text-neon-blue animate-pulse">Scanning the airwaves...</div>}

                <div className="space-y-4 pb-10">
                    {results.map((res, idx) => (
                        <div key={idx} className="border-l-2 border-neon-pink pl-4 py-2 hover:bg-white/5 transition-colors">
                            <h3 className="text-lg text-neon-pink font-bold hover:underline cursor-pointer truncate">{res.title}</h3>
                            <a href={res.link} target="_blank" rel="noreferrer" className="text-xs text-neon-blue/70 truncate block mb-1">
                                {res.link}
                            </a>
                            <p className="text-sm text-gray-400 line-clamp-2">{res.snippet}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GoolagApp;
