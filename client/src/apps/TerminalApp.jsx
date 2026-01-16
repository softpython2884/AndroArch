import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const TerminalApp = () => {
    const [history, setHistory] = useState([
        "AndroArch Sub-System [Version 1.0.42]",
        "(c) 2026 Nomads Corp. All rights reserved.",
        "",
        "Type 'help' for available commands or execute server-side commands.",
        ""
    ]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize Socket Connection
        socketRef.current = io("http://localhost:3000");

        socketRef.current.on("command_output", (output) => {
            setHistory(prev => [...prev, output]);
        });

        socketRef.current.on("connect_error", () => {
            setHistory(prev => [...prev, "Connection to server failed."]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            if (!cmd) return;

            setHistory(prev => [...prev, `user@andro:~$ ${cmd}`]);

            if (cmd === 'clear') {
                setHistory([]);
            } else if (cmd === 'neofetch') {
                setHistory(prev => [...prev,
                    "       /\\        OS: AndroArch v1.0",
                    "      /  \\       Host: Cyberdyne T-800",
                    "     /    \\      Kernel: 5.15.0-generic",
                    "    /      \\     Uptime: Forever",
                    "   /   ||   \\    Shell: bash 5.0",
                    "  /    ||    \\   Resolution: 1080x1920",
                    " /     ||     \\  CPU: Neural Net Processor",
                    "/______||______\\ Memory: Infinite"
                ]);
            } else if (cmd === 'help') {
                setHistory(prev => [...prev,
                    "Local Commands: clear, help, neofetch",
                    "Remote Commands: Any terminal command execution on server (dir, ipconfig, ping, etc.)"
                ]);
            } else {
                // Send to Server
                socketRef.current.emit("execute_command", cmd);
            }

            setInput("");
        }
    };

    return (
        <div className="font-mono text-sm p-4 h-full bg-sub-black text-green-500 overflow-hidden flex flex-col font-bold">
            <div className="flex-1 overflow-auto no-scrollbar space-y-1">
                {history.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-all">{line}</div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <div className="flex gap-2 mt-4 pt-2 border-t border-white/10 shrink-0 bg-sub-black">
                <span className="text-neon-blue">user@andro:~$</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    className="flex-1 bg-transparent border-none outline-none text-white caret-neon-green"
                    autoFocus
                    autoComplete="off"
                    spellCheck="false"
                />
            </div>
        </div>
    );
};

export default TerminalApp;
