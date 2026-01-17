import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    // Initialize state from LocalStorage or Defaults
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('andro_settings');
        return saved ? JSON.parse(saved) : {
            brightness: 100,
            volume: 80,
            theme: 'dark', // 'dark' | 'light' | 'amoled'
            amoled: false,
            wifi: true,
            bluetooth: true,
            wallpaper: null, // null uses default
            pin: '1234'
        };
    });

    // Save to LocalStorage whenever settings change
    useEffect(() => {
        localStorage.setItem('andro_settings', JSON.stringify(settings));

        // Apply Global Effects
        // 1. Brightness Filter
        document.documentElement.style.filter = `brightness(${settings.brightness}%)`;
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, toggleSetting }}>
            {children}
        </SettingsContext.Provider>
    );
};
