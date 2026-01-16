import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, SwitchCamera, Video, Circle } from 'lucide-react';

const CameraApp = () => {
    const webcamRef = useRef(null);
    const [facingMode, setFacingMode] = useState("user");
    const [capturedImage, setCapturedImage] = useState(null);

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
    }, [webcamRef]);

    const saveToGallery = () => {
        if (!capturedImage) return;

        const existing = JSON.parse(localStorage.getItem('andro_gallery_photos') || '[]');
        const newPhoto = {
            id: Date.now(),
            url: capturedImage,
            date: new Date().toISOString()
        };

        localStorage.setItem('andro_gallery_photos', JSON.stringify([newPhoto, ...existing]));
        setCapturedImage(null); // Return to camera
        // Optional: Trigger a system toast here if we had one
    };

    if (capturedImage) {
        return (
            <div className="h-full bg-black flex flex-col items-center justify-center relative">
                <img src={capturedImage} alt="captured" className="w-full h-full object-contain" />
                <div className="absolute bottom-10 flex gap-8">
                    <button onClick={() => setCapturedImage(null)} className="px-6 py-2 bg-white/10 rounded-full text-white backdrop-blur-md active:scale-95 transition-transform">Discard</button>
                    <button onClick={saveToGallery} className="px-6 py-2 bg-white text-black rounded-full font-bold shadow-lg shadow-white/20 active:scale-95 transition-transform">Save</button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full bg-black relative flex flex-col">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode }}
                className="flex-1 object-cover h-full"
            />

            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between px-10 pb-4">
                <button onClick={toggleCamera} className="p-4 bg-white/10 rounded-full active:scale-95 transition-transform backdrop-blur-sm">
                    <SwitchCamera className="text-white" />
                </button>

                <button
                    onClick={capture}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
                >
                    <div className="w-16 h-16 bg-white rounded-full"></div>
                </button>

                <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden border border-white/20">
                    {/* Last Shot Thumbnail Mockup */}
                </div>
            </div>
        </div>
    );
};

export default CameraApp;
