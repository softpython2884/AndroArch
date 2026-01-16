import { useState, useEffect } from 'react'
import { io } from 'socket.io-client';

function App() {
  const [nodeStatus, setNodeStatus] = useState('Checking...');
  const [clientCount, setClientCount] = useState(0);

  useEffect(() => {
    // Connect to the backend server
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      setNodeStatus('Active');
    });

    socket.on('disconnect', () => {
      setNodeStatus('Disconnected');
    });

    // Listen for client count updates from the server
    socket.on('client_count', (count) => {
      // The server includes the admin in the count, so we subtract 1 to see only "clients"
      // provided the admin itself connects as a client. 
      // Logic might need tweaking depending on if we want to count admin or not.
      // For now, raw count is fine.
      setClientCount(count);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-10 min-h-screen bg-slate-900 text-slate-100 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">AndroArch Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Node Status Card */}
        <div className="bg-slate-800 p-6 rounded shadow border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-2 text-gray-400">Node Status</h2>
          <p className={`text-2xl font-bold ${nodeStatus === 'Active' ? 'text-green-400' : 'text-red-500'}`}>
            {nodeStatus}
          </p>
        </div>

        {/* Connected Clients Card */}
        <div className="bg-slate-800 p-6 rounded shadow border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold mb-2 text-gray-400">Connected Nodes</h2>
          <p className="text-4xl font-bold text-white">{clientCount}</p>
          <p className="text-xs text-gray-500 mt-2">Real-time WebSocket Data</p>
        </div>

      </div>
    </div>
  )
}

export default App
