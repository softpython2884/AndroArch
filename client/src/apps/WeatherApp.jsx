import { useState, useEffect } from 'react';
import { Cloud, Wind, Droplets, Sun, Moon, Thermometer, MapPin, Navigation, Sunset } from 'lucide-react';
import { GlassPane } from '../components/ui/GlassPane';

const WeatherApp = ({ coords, locationName }) => {
    const [detailedData, setDetailedData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getWeatherIcon = (code) => {
        if (code === 0) return Sun;
        if (code >= 1 && code <= 3) return Cloud;
        if (code >= 45 && code <= 48) return Cloud; // Fog
        if (code >= 51 && code <= 67) return Droplets; // Rain
        if (code >= 71 && code <= 77) return Cloud; // Snow
        if (code >= 80 && code <= 82) return Droplets; // Showers
        if (code >= 95) return Cloud; // Storm
        return Cloud;
    };

    const getConditionText = (code) => {
        if (code === 0) return "Clear Sky";
        if (code >= 1 && code <= 3) return "Partly Cloudy";
        if (code >= 45 && code <= 48) return "Foggy";
        if (code >= 51 && code <= 67) return "Rainy";
        if (code >= 71 && code <= 77) return "Snowy";
        if (code >= 80 && code <= 82) return "Heavy Rain";
        if (code >= 95) return "Thunderstorm";
        return "Cloudy";
    };

    useEffect(() => {
        if (!coords) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
                const res = await fetch(url);
                const data = await res.json();

                const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const forecast = data.daily.time.slice(1, 6).map((time, i) => {
                    const date = new Date(time);
                    const code = data.daily.weather_code[i + 1];
                    return {
                        day: days[date.getDay()],
                        temp: Math.round(data.daily.temperature_2m_max[i + 1]),
                        icon: getWeatherIcon(code),
                        condition: getConditionText(code)
                    };
                });

                setDetailedData({
                    current: {
                        temp: Math.round(data.current.temperature_2m),
                        condition: getConditionText(data.current.weather_code),
                        high: Math.round(data.daily.temperature_2m_max[0]),
                        low: Math.round(data.daily.temperature_2m_min[0]),
                        windSpeed: Math.round(data.current.wind_speed_10m),
                        humidity: data.current.relative_humidity_2m,
                        uvIndex: data.daily.uv_index_max[0],
                        pressure: Math.round(data.current.surface_pressure)
                    },
                    forecast: forecast,
                    astro: {
                        sunrise: data.daily.sunrise[0].split('T')[1],
                        sunset: data.daily.sunset[0].split('T')[1],
                        moonPhase: "Satellite Tracked" // Open-Meteo simplification
                    }
                });
            } catch (error) {
                console.error("Weather App error:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, [coords]);

    if (!coords || loading || !detailedData) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-white/50 bg-slate-900">
                <Navigation className="animate-spin mb-4" size={32} />
                <p className="animate-pulse">Acquiring Satellite Data...</p>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-b from-[#1a2980] to-[#26d0ce] text-white overflow-y-auto no-scrollbar p-6">
            {/* Header / Current Status */}
            <div className="flex flex-col items-center pt-8 pb-12 text-center animate-in fade-in zoom-in duration-700">
                <h2 className="text-3xl font-light tracking-widest uppercase mb-1 flex items-center gap-2">
                    <MapPin size={24} className="text-white/70" />
                    {locationName || "Detecting..."}
                </h2>
                <h1 className="text-8xl font-thin tracking-tighter mb-4">{detailedData.current.temp}°</h1>
                <p className="text-xl font-medium opacity-90">{detailedData.current.condition}</p>
                <div className="flex gap-4 mt-2 text-sm opacity-75">
                    <span>H:{detailedData.current.high}°</span>
                    <span>L:{detailedData.current.low}°</span>
                </div>
            </div>

            {/* Detailed Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <GlassPane className="p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
                    <Wind className="opacity-70 text-blue-200" />
                    <span className="text-sm opacity-60">Wind</span>
                    <span className="text-xl font-bold">{detailedData.current.windSpeed} <span className="text-xs font-normal opacity-50">km/h</span></span>
                </GlassPane>
                <GlassPane className="p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
                    <Droplets className="opacity-70 text-blue-300" />
                    <span className="text-sm opacity-60">Humidity</span>
                    <span className="text-xl font-bold">{detailedData.current.humidity}<span className="text-xs font-normal opacity-50">%</span></span>
                </GlassPane>
                <GlassPane className="p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
                    <Sun className="opacity-70 text-yellow-200" />
                    <span className="text-sm opacity-60">UV Index</span>
                    <span className="text-xl font-bold">{detailedData.current.uvIndex}</span>
                </GlassPane>
                <GlassPane className="p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
                    <Thermometer className="opacity-70 text-red-200" />
                    <span className="text-sm opacity-60">Pressure</span>
                    <span className="text-xl font-bold font-mono">{detailedData.current.pressure}</span>
                </GlassPane>
            </div>

            {/* Astro Section */}
            <GlassPane className="p-6 rounded-3xl mb-8 flex items-center justify-between shadow-xl">
                <div className="flex flex-col items-center">
                    <Sun size={32} className="text-yellow-400 mb-2 drop-shadow-lg" />
                    <span className="text-[10px] opacity-60 uppercase tracking-widest">Sunrise</span>
                    <span className="font-bold">{detailedData.astro.sunrise}</span>
                </div>
                <div className="h-10 w-px bg-white/20"></div>
                <div className="flex flex-col items-center">
                    <Moon size={32} className="text-blue-100 mb-2 drop-shadow-lg" />
                    <span className="text-[10px] opacity-60 uppercase tracking-widest">Moon</span>
                    <span className="font-bold text-[10px] opacity-90">{detailedData.astro.moonPhase}</span>
                </div>
                <div className="h-10 w-px bg-white/20"></div>
                <div className="flex flex-col items-center">
                    <Sunset size={32} className="text-orange-400 mb-2 drop-shadow-lg" />
                    <span className="text-[10px] opacity-60 uppercase tracking-widest">Sunset</span>
                    <span className="font-bold">{detailedData.astro.sunset}</span>
                </div>
            </GlassPane>

            {/* Daily Forecast */}
            <div className="flex flex-col gap-3 mb-12">
                <h3 className="text-xs font-bold uppercase opacity-50 mb-2 pl-2 tracking-[0.2em]">Next 5 Days</h3>
                {detailedData.forecast.map((day, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <span className="w-12 font-medium">{day.day}</span>
                        <day.icon size={24} className="opacity-80 text-white" />
                        <span className="flex-1 px-4 opacity-60 text-sm truncate">{day.condition}</span>
                        <span className="font-bold text-lg">{day.temp}°</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherApp;
