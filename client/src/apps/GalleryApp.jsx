import { motion } from 'framer-motion';

const images = [
    'https://images.unsplash.com/photo-1542202619-3c3e80c98f80',
    'https://images.unsplash.com/photo-1549488390-e555ae245df8',
    'https://images.unsplash.com/photo-1518098268026-4e1c91a28a63',
    'https://images.unsplash.com/photo-1472289065668-ce650ac443d2',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07'
];

const GalleryApp = () => {
    return (
        <div className="p-4 grid grid-cols-2 gap-4 pb-20">
            {images.map((img, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-900 relative group"
                >
                    <img src={img + '?auto=format&fit=crop&w=300&q=60'} alt="" className="w-full h-full object-cover" />
                </motion.div>
            ))}
        </div>
    );
};

export default GalleryApp;
