import { useState, useRef, useEffect } from "react";

const TerminalApp = () => {
    const [history, setHistory] = useState([
        "AndroArch Sub-System [Version 1.0.42]",
        "(c) 2026 Nomads Corp. All rights reserved.",
        "",
        "Type 'help' for available commands.",
        ""
    ]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            const newHistory = [...history, `user@andro:~$ ${cmd}`];

            if (cmd === 'clear') {
                setHistory([]);
            } else if (cmd === 'help') {
                setHistory([...newHistory, "Available commands: help, clear, ping, status"]);
            } else if (cmd === 'ping') {
                setHistory([...newHistory, "Pinging server...", "Reply from 127.0.0.1: bytes=32 time<1ms TTL=128"]);
            } else {
                setHistory([...newHistory, `Command not found: ${cmd}`]);
            }

            setInput("");
        }
    };

    return (
        <div className="font-mono text-sm p-2 h-full bg-black text-green-500 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto">
                {history.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">{line}</div>
                ))}
                <div ref={bottomRef}></div>
            </div>
            <div className="flex gap-2 mt-2 sticky bottom-0 bg-black">
                <span className="text-neon-pink">user@andro:~$</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    className="flex-1 bg-transparent border-none outline-none text-white caret-neon-green"
                    autoFocus
                />
            </div>
        </div>
    );
};

export default TerminalApp;
