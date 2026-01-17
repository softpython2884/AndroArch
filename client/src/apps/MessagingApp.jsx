import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, UserPlus, Trash2, Smartphone, ShieldCheck, Cpu, ArrowLeft, Search, Plus } from 'lucide-react';
import { useMessaging } from '../context/MessagingContext';

const MessagingApp = () => {
    const { myPhone, contacts, messages, activeNodes, sendMessage, addContact, deleteThread } = useMessaging();
    const [selectedThread, setSelectedThread] = useState(null);
    const [inputText, setInputText] = useState("");
    const [showAddContact, setShowAddContact] = useState(false);
    const [newContact, setNewContact] = useState({ name: "", phone: "" });
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedThread]);

    const handleSend = () => {
        if (!inputText.trim() || !selectedThread) return;
        sendMessage(selectedThread, inputText);
        setInputText("");
    };

    const handleAddContact = () => {
        if (!newContact.name || !newContact.phone) return;
        addContact(newContact.name, newContact.phone);
        setNewContact({ name: "", phone: "" });
        setShowAddContact(false);
    };

    const getContactName = (phone) => {
        const contact = contacts.find(c => c.phone === phone);
        return contact ? contact.name : phone;
    };

    const sortedThreads = Object.keys(messages).sort((a, b) => {
        const lastA = messages[a][messages[a].length - 1].timestamp;
        const lastB = messages[b][messages[b].length - 1].timestamp;
        return new Date(lastB) - new Date(lastA);
    });

    if (selectedThread) {
        const threadMessages = messages[selectedThread] || [];
        const name = getContactName(selectedThread);
        const isOnline = activeNodes.includes(selectedThread);

        return (
            <div className="h-full flex flex-col bg-black">
                {/* Thread Header */}
                <div className="p-4 border-b border-white/10 flex items-center bg-white/5 backdrop-blur-xl">
                    <button onClick={() => setSelectedThread(null)} className="p-2 -ml-2 text-white/40 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1 ml-2">
                        <h2 className="text-sm font-bold tracking-tight">{name}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-white/10'}`} />
                            <span className="text-[9px] uppercase tracking-tighter opacity-40 font-black">
                                {isOnline ? 'Direct Link' : 'Offline'}
                            </span>
                        </div>
                    </div>
                    <button onClick={() => deleteThread(selectedThread)} className="p-2 text-white/20 hover:text-red-500">
                        <Trash2 size={18} />
                    </button>
                </div>

                {/* Message Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
                    <div className="flex flex-col items-center justify-center py-8 opacity-20">
                        <ShieldCheck size={32} />
                        <span className="text-[10px] mt-4 uppercase tracking-[0.2em] font-black">Quantum Encryption</span>
                    </div>
                    {threadMessages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.own ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.own
                                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20'
                                : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
                                }`}>
                                <p className="leading-relaxed">{msg.text}</p>
                                <span className="text-[8px] opacity-30 mt-1 block text-right font-mono">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/5 border-t border-white/10">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim()}
                            className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
                        >
                            <Send size={20} className="text-white ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-black text-white">
            {/* App Header */}
            <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">Messenger</h1>
                        <span className="text-[10px] text-blue-500 font-mono tracking-widest">{myPhone}</span>
                    </div>
                    <button
                        onClick={() => setShowAddContact(true)}
                        className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shadow-xl"
                    >
                        <UserPlus size={20} />
                    </button>
                </div>

                {/* Identity Card */}
                <div className="w-full bg-blue-600/10 border border-blue-500/20 rounded-3xl p-5 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-900/40">
                        <Cpu className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Node Identifier</h3>
                        <p className="text-lg font-mono font-bold leading-none mt-1">{myPhone}</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-8 no-scrollbar">
                {/* Threads */}
                {sortedThreads.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Active Threads</h3>
                        {sortedThreads.map(phone => {
                            const thread = messages[phone];
                            const lastMsg = thread[thread.length - 1];
                            const name = getContactName(phone);
                            const isOnline = activeNodes.includes(phone);

                            return (
                                <button
                                    key={phone}
                                    onClick={() => setSelectedThread(phone)}
                                    className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform hover:bg-white/10"
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xl font-bold border border-white/10">
                                            {name[0].toUpperCase()}
                                        </div>
                                        {isOnline && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="text-sm font-bold truncate">{name}</span>
                                            <span className="text-[9px] opacity-20 font-mono italic">
                                                {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs opacity-50 truncate">{lastMsg.own ? 'You: ' : ''}{lastMsg.text}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Contacts / Nodes */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Network Nodes</h3>
                    {activeNodes.length === 0 ? (
                        <div className="p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <Smartphone className="inline-block opacity-20 mb-3" size={32} />
                            <p className="text-xs opacity-30 font-bold uppercase tracking-widest">No nodes scanned</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {activeNodes.map(phone => (
                                <button
                                    key={phone}
                                    onClick={() => setSelectedThread(phone)}
                                    className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center active:scale-95 transition-all hover:bg-green-500/10 group"
                                >
                                    <Smartphone size={20} className="mb-2 text-white/20 group-hover:text-green-500 transition-colors" />
                                    <span className="text-[10px] font-bold truncate w-full">{getContactName(phone)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Contact Modal */}
            <AnimatePresence>
                {showAddContact && (
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
                            <h2 className="text-xl font-black uppercase tracking-tight mb-6">New Contact</h2>
                            <div className="space-y-4 mb-8">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Identity</label>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={newContact.name}
                                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Phone Code</label>
                                    <input
                                        type="text"
                                        placeholder="555-XXXX"
                                        value={newContact.phone}
                                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAddContact(false)}
                                    className="flex-1 py-4 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddContact}
                                    className="flex-1 py-4 rounded-2xl bg-blue-600 shadow-lg shadow-blue-900/40 text-xs font-black uppercase tracking-widest active:scale-95 transition-transform"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MessagingApp;
