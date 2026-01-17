import { useState } from 'react';
import { Wifi, Moon, Volume2, Globe, Shield, Info, Battery, ChevronRight, Sun, Lock, Eraser, Smartphone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

const SettingItem = ({ icon: Icon, color, label, value, onClick, isToggle, isActive }) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl mb-2 active:bg-white/10 transition-colors cursor-pointer select-none">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${isActive ? color : 'bg-gray-700'}`}>
                <Icon size={16} />
            </div>
            <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-sm">
            <span className="truncate max-w-[100px]">{value}</span>
            {isToggle ? (
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-blue-500' : 'bg-gray-600'}`}>
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
    const [showPinModal, setShowPinModal] = useState(false);
    const [newPin, setNewPin] = useState("");

    const handlePinChange = () => {
        if (newPin.length === 4) {
            updateSetting('pin', newPin);
            setShowPinModal(false);
            setNewPin("");
        }
    };

    return (
        <div className="p-5 pb-20 max-w-lg mx-auto overflow-auto h-full no-scrollbar relative">
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
                <SettingItem
                    icon={Moon}
                    color="bg-black"
                    label="AMOLED Mode"
                    value={settings.theme === 'amoled' ? "On" : "Off"}
                    isToggle
                    isActive={settings.theme === 'amoled'}
                    onClick={() => updateSetting('theme', settings.theme === 'amoled' ? 'dark' : 'amoled')}
                />
            </div>

            <div className="mb-6">
                <h3 className="text-xs uppercase font-medium text-gray-500 mb-2 pl-2">Security</h3>
                <SettingItem
                    icon={Lock}
                    color="bg-red-500"
                    label="System PIN"
                    value={`**** (Active)`}
                    onClick={() => setShowPinModal(true)}
                />
                <SettingItem icon={Shield} color="bg-slate-500" label="Encryption" value="Quantum 256" />
            </div>

            <div className="mb-6">
                <h3 className="text-xs uppercase font-medium text-gray-500 mb-2 pl-2">Device</h3>
                <SettingItem icon={Battery} color="bg-emerald-500" label="Energy State" value="84% (Nominal)" />
                <SettingItem icon={Info} color="bg-gray-500" label="Device Identity" value={`Build v3.0`} />
                <SettingItem
                    icon={Eraser}
                    color="bg-red-900"
                    label="Factory Reset"
                    value="Dangerous"
                    onClick={() => { if (confirm("Erase all local data?")) localStorage.clear(); window.location.reload(); }}
                />
            </div>

            <div className="text-center text-xs text-white/20 mt-8 mb-4">
                AndroArch OS Kernel v3.0.4<br />
                Node ID: {window.location.hostname}
            </div>

            {/* PIN MODAL */}
            <AnimatePresence>
                {showPinModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-[2.5rem] p-8"
                        >
                            <div className="flex flex-col items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Lock size={32} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Security Protocol</h2>
                                <p className="text-center text-xs text-white/40">Enter 4-digit code to update decryption key.</p>
                            </div>

                            <input
                                type="text"
                                maxLength={4}
                                placeholder="----"
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center text-2xl font-mono tracking-[1em] focus:outline-none focus:border-red-500 transition-all mb-8"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPinModal(false)}
                                    className="flex-1 py-4 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={handlePinChange}
                                    disabled={newPin.length !== 4}
                                    className="flex-1 py-4 rounded-2xl bg-red-600 shadow-lg shadow-red-900/40 text-xs font-black uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50"
                                >
                                    Override
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingsApp;
