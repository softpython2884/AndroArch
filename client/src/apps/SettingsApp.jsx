import { useState } from 'react';
import { Wifi, Moon, Volume2, Globe, Shield, Info, Battery, ChevronRight, Sun } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SettingItem = ({ icon: Icon, color, label, value, onClick, isToggle, isActive }) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl mb-2 active:bg-white/10 transition-colors cursor-pointer select-none">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${isActive ? color : 'bg-gray-700'}`}>
                <Icon size={16} />
            </div>
            <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-sm">
            <span>{value}</span>
            {isToggle ? (
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
            ) : (
                <ChevronRight size={16} />
            )}
        </div>
    </div>
);

const SliderItem = ({ icon: Icon, color, label, value, onChange }) => (
    <div className="p-4 bg-white/5 rounded-2xl mb-2">
        <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${color}`}>
                <Icon size={16} />
            </div>
            <span className="font-medium text-sm">{label}</span>
            <span className="ml-auto text-xs text-white/50">{value}%</span>
        </div>
        <input
            type="range"
            min="10"
            max="100"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full text-white"
        />
    </div>
)

const SettingsApp = () => {
    const { settings, toggleSetting, updateSetting } = useSettings();

    return (
        <div className="p-5 pb-20 max-w-lg mx-auto overflow-auto h-full no-scrollbar">
            <h2 className="text-3xl font-bold mb-6">Settings</h2>

            <div className="mb-6">
                <h3 className="text-xs uppercase font-medium text-gray-500 mb-2 pl-2">Connectivity</h3>
                <SettingItem
                    icon={Wifi}
                    color="bg-blue-500"
                    label="Wi-Fi"
                    value={settings.wifi ? "Connected" : "Off"}
                    isToggle
                    isActive={settings.wifi}
                    onClick={() => toggleSetting('wifi')}
                />
                <SettingItem icon={Globe} color="bg-green-500" label="Node Network" value="Active" />
            </div>

            <div className="mb-6">
                <h3 className="text-xs uppercase font-medium text-gray-500 mb-2 pl-2">Display & Sound</h3>
                <SliderItem
                    icon={Sun}
                    color="bg-yellow-500"
                    label="Brightness"
                    value={settings.brightness}
                    onChange={(v) => updateSetting('brightness', v)}
                />
                <SliderItem
                    icon={Volume2}
                    color="bg-pink-500"
                    label="Volume"
                    value={settings.volume}
                    onChange={(v) => updateSetting('volume', v)}
                />
            </div>

            <div className="mb-6">
                <h3 className="text-xs uppercase font-medium text-gray-500 mb-2 pl-2">System</h3>
                <SettingItem
                    icon={Moon}
                    color="bg-purple-500"
                    label="Dark Mode"
                    value={settings.theme === 'dark' ? "On" : "Off"}
                    isToggle
                    isActive={settings.theme === 'dark'}
                    onClick={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')}
                />
                <SettingItem icon={Shield} color="bg-slate-500" label="Privacy" value="" />
                <SettingItem icon={Battery} color="bg-emerald-500" label="Battery" value="84%" />
                <SettingItem icon={Info} color="bg-gray-500" label="About Arch-M" value="v2.1" />
            </div>

            <div className="text-center text-xs text-white/20 mt-8 mb-4">
                AndroArch OS v2.1 (Dev Build)<br />
                Running on React Core
            </div>
        </div>
    );
};

export default SettingsApp;
