import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const defaultImages = [
    { url: 'https://images.unsplash.com/photo-1542202619-3c3e80c98f80' },
    { url: 'https://images.unsplash.com/photo-1549488390-e555ae245df8' },
    { url: 'https://images.unsplash.com/photo-1518098268026-4e1c91a28a63' },
    { url: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2' },
    { url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07' }
];

const GalleryApp = () => {
    const [photos, setPhotos] = useState([]);
    const { updateSetting } = useSettings();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('andro_gallery_photos') || '[]');
        // Merge saved photos with default ones
        setPhotos([...saved, ...defaultImages]);
    }, []);

    const setWallpaper = (url) => {
        updateSetting('wallpaper', url);
    };

    return (
        <div className="p-4 grid grid-cols-2 gap-4 pb-20 overflow-y-auto h-full no-scrollbar">
            {photos.map((item, i) => (
                <motion.div
                    key={i} // Using index as fallback key since mixed sources
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-900 relative group border border-white/5"
                >
                    <img
                        src={item.url.startsWith('data:') ? item.url : item.url + '?auto=format&fit=crop&w=300&q=60'}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                        <button
                            onClick={(e) => { e.stopPropagation(); setWallpaper(item.url.startsWith('data:') ? item.url : item.url + '?auto=format&fit=crop&w=800&q=80'); }}
                            className="bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full backdrop-blur-md transition-all active:scale-95"
                            title="Set as Wallpaper"
                        >
                            <ImageIcon size={20} />
                        </button>
                    </div>

                    {/* Date Overlay for Local Photos */}
                    {item.date && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-[10px] text-white/70">
                            {new Date(item.date).toLocaleDateString()}
                        </div>
                    )}
                </motion.div>
            ))}

            {/* Empty State / Footer */}
            <div className="col-span-2 py-8 text-center opacity-30 text-xs uppercase tracking-widest">
                End of Gallery
            </div>
        </div>
    );
};

export default GalleryApp;
