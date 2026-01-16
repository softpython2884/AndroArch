const IframeApp = ({ url, title }) => {
    return (
        <div className="w-full h-full bg-black flex flex-col">
            {/* Browser-like address bar (Fake) */}
            <div className="h-10 bg-sub-gray border-b border-white/10 flex items-center px-4 gap-2 text-xs text-gray-400">
                <span className="opacity-50">🔒</span>
                <span className="flex-1 text-center font-mono opacity-80 truncate">{url}</span>
                <span className="opacity-50">↻</span>
            </div>

            <iframe
                src={url}
                title={title}
                className="flex-1 w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

export default IframeApp;
