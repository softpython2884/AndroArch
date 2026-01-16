import { useState, useEffect } from 'react';
import { Cloud, Wind, Droplets, Sun, Moon, Thermometer, MapPin, Navigation } from 'lucide-react';
import { GlassPane } from '../components/ui/GlassPane';

const WeatherApp = ({ coords, locationName }) => {
    const [detailedIds, setDetailedData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock Data for UI Dev (will be replaced by API)
    useEffect(() => {
        if (!coords) return;

        // Simulating API fetch for detailed data
        setTimeout(() => {
            setDetailedData({
                current: {
                    temp: 14,
                    condition: "Partly Cloudy",
                    description: "High probability of rain in the evening.",
                    windSpeed: 12,
                    humidity: 65,
                    uvIndex: 4,
                    visibility: 10,
                    pressure: 1015
                },
                forecast: [
                    { day: "Sat", temp: 15, icon: Sun },
                    { day: "Sun", temp: 18, icon: Cloud },
                    { day: "Mon", temp: 12, icon: Droplets },
                    { day: "Tue", temp: 14, icon: Cloud },
                    { day: "Wed", temp: 16, icon: Sun },
                ],
                astro: {
                    sunrise: "06:45",
                    sunset: "20:15",
                    moonPhase: "Waxing Crescent"
                }
            });
            setLoading(false);
        }, 1000);
    }, [coords]);

    if (!coords || loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-white/50">
                <Navigation className="animate-spin mb-4" size={32} />
                <p>Acquiring Satellite Data...</p>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-b from-[#1a2980] to-[#26d0ce] text-white overflow-y-auto no-scrollbar p-6">

            {/* Header / Current Status */}
            <div className="flex flex-col items-center pt-8 pb-12 text-center">
                <h2 className="text-3xl font-light tracking-widest uppercase mb-1 flex items-center gap-2">
                    <MapPin size={24} />
                    {locationName || "Detecting Sector..."}
                </h2>
                <h1 className="text-8xl font-thin tracking-tighter mb-4">{detailedIds.current.temp}°</h1>
                <p className="text-xl font-medium opacity-90">{detailedIds.current.condition}</p>
                <div className="flex gap-4 mt-2 text-sm opacity-75">
                    <span>H:16°</span>
                    <span>L:9°</span>
                </div>
            </div>

            {/* Detailed Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <GlassPane className="p-4 rounded-2xl flex flex-col items-center gap-2">
                    <Wind className="opacity-70" />
                    <span className="text-sm opacity-60">Wind</span>
                    <span className="text-xl font-bold">{detailedIds.current.windSpeed} km/h</span>
                </GlassPane>
                <GlassPane className="p-4 rounded-2xl flex flex-col items-center gap-2">
                    <Droplets className="opacity-70" />
                    <span className="text-sm opacity-60">Humidity</span>
                    <span className="text-xl font-bold">{detailedIds.current.humidity}%</span>
                </GlassPane>
                <GlassPane className="p-4 rounded-2xl flex flex-col items-center gap-2">
                    <Sun className="opacity-70" />
                    <span className="text-sm opacity-60">UV Index</span>
                    <span className="text-xl font-bold">{detailedIds.current.uvIndex}</span>
                </GlassPane>
                <GlassPane className="p-4 rounded-2xl flex flex-col items-center gap-2">
                    <Thermometer className="opacity-70" />
                    <span className="text-sm opacity-60">Pressure</span>
                    <span className="text-xl font-bold">{detailedIds.current.pressure} hPa</span>
                </GlassPane>
            </div>

            {/* Astro Section */}
            <GlassPane className="p-6 rounded-3xl mb-8 flex items-center justify-between">
                <div className="flex flex-col items-center">
                    <Sun size={32} className="text-yellow-400 mb-2" />
                    <span className="text-xs opacity-60 uppercase">Sunrise</span>
                    <span className="font-bold">{detailedIds.astro.sunrise}</span>
                </div>
                <div className="h-10 w-px bg-white/10"></div>
                <div className="flex flex-col items-center">
                    <Moon size={32} className="text-blue-200 mb-2" />
                    <span className="text-xs opacity-60 uppercase">Moon</span>
                    <span className="font-bold text-xs">{detailedIds.astro.moonPhase}</span>
                </div>
                <div className="h-10 w-px bg-white/10"></div>
                <div className="flex flex-col items-center">
                    <Sun size={32} className="text-orange-400 mb-2" />
                    <span className="text-xs opacity-60 uppercase">Sunset</span>
                    <span className="font-bold">{detailedIds.astro.sunset}</span>
                </div>
            </GlassPane>

            {/* Daily Forecast */}
            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium uppercase opacity-50 mb-2 pl-2">5-Day Forecast</h3>
                {detailedIds.forecast.map((day, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <span className="w-12 font-medium">{day.day}</span>
                        <day.icon size={20} className="opacity-80" />
                        <span className="opacity-60 text-sm">Partly Cloudy</span>
                        <span className="font-bold">{day.temp}°</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherApp;
