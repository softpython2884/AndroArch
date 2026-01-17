import { useState, useEffect } from 'react'
import { io } from 'socket.io-client';
import { Activity, Users, Send, Cpu, Database, AlertCircle, Terminal } from 'lucide-react';

function App() {
  const [nodeStatus, setNodeStatus] = useState('Checking...');
  const [clientCount, setClientCount] = useState(0);
  const [sysStats, setSysStats] = useState({ cpu: 0, ram: 0 });
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [logs, setLogs] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const serverHost = `${window.location.protocol}//${window.location.hostname}:3000`;
    const newSocket = io(serverHost);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setNodeStatus('Active');
      addLog("Admin console connected to Node server.");
    });

    newSocket.on('disconnect', () => {
      setNodeStatus('Disconnected');
      addLog("Warning: Node server connection lost.");
    });

    newSocket.on('client_count', (count) => {
      setClientCount(count);
    });

    newSocket.on('system_status', (stats) => {
      setSysStats(stats);
    });

    return () => newSocket.disconnect();
  }, []);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 10));
  }

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim() || !socket) return;
    socket.emit('admin_broadcast', broadcastMsg);
    addLog(`Broadcast sent: ${broadcastMsg}`);
    setBroadcastMsg("");
  }

  return (
    <div className="p-8 min-h-screen bg-[#0a0a0c] text-slate-300 font-sans selection:bg-blue-500/30">

      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-900/40">
              <Terminal size={18} />
            </div>
            ANDRO<span className="text-blue-500 text-opacity-80">ARCH</span> ADMIN
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mt-1 ml-11">
            Central Command & Control
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${nodeStatus === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'} animate-pulse`}></div>
          <span className="text-[10px] font-bold uppercase tracking-widest">{nodeStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Stats Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={<Users className="text-purple-400" />}
              label="Connected Nodes"
              value={clientCount}
              subValue="Global Live Clients"
              color="border-purple-500"
            />
            <StatCard
              icon={<Cpu className="text-blue-400" />}
              label="CPU Usage"
              value={`${sysStats.cpu}%`}
              subValue="Node Server Core"
              color="border-blue-500"
            />
            <StatCard
              icon={<Database className="text-orange-400" />}
              label="Memory"
              value={`${sysStats.ram}%`}
              subValue="RAM Allocations"
              color="border-orange-500"
            />
            <StatCard
              icon={<Activity className="text-green-400" />}
              label="Server Uptime"
              value="100%"
              subValue="Optimal Performance"
              color="border-green-500"
            />
          </div>

          {/* Broadcast Panel */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Send size={16} className="text-blue-500" />
              Emergency Broadcast
            </h3>
            <form onSubmit={handleBroadcast} className="flex gap-4">
              <input
                type="text"
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Message to all active clients..."
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-900/20"
              >
                Send
              </button>
            </form>
            <p className="text-[10px] text-white/20 mt-4 uppercase tracking-widest leading-relaxed">
              WARNING: Broadcasts are visible to every user connected to the primary node.
              Authorized personnel only.
            </p>
          </div>
        </div>

        {/* Logs Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-black/40 border border-white/10 rounded-3xl p-6 flex-1 flex flex-col h-[500px]">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 opacity-60">
              <Terminal size={14} />
              System Event Log
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[10px] italic opacity-30">
                  Awaiting system events...
                </div>
              ) : logs.map((log, i) => (
                <div key={i} className="text-[11px] font-mono leading-relaxed border-b border-white/5 pb-2 opacity-70 hover:opacity-100 transition-opacity">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ icon, label, value, subValue, color }) {
  return (
    <div className={`bg-white/5 border-l-4 ${color} rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors shadow-2xl`}>
      <div className="flex justify-between items-start mb-4">
        <span className="p-3 bg-white/5 rounded-xl">{icon}</span>
        <Activity size={12} className="opacity-10" />
      </div>
      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">{label}</p>
      <h4 className="text-3xl font-black tracking-tighter text-white mb-2">{value}</h4>
      <p className="text-[10px] text-white/20 uppercase tracking-tighter font-medium">{subValue}</p>
    </div>
  )
}

export default App
