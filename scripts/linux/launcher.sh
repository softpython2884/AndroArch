#!/bin/bash

# AndroArch Linux Launcher
# Launches Server, Client, and Admin in the background

echo "🏗️ AndroArch: Booting System..."

ROOT_DIR=$(pwd)

# Function to handle exit
cleanup() {
    echo "🛑 Shutting down system..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT SIGTERM

# 1. Start Server
echo "🛰️ Launching Neural Link Server (Port 3000)..."
cd "$ROOT_DIR/server" && npm run dev &

# 2. Start Client
echo "📱 Launching OS Client (Port 5173)..."
cd "$ROOT_DIR/client" && npm run dev &

# 3. Start Admin
echo "🖥️ Launching Admin Dashboard (Port 5174)..."
cd "$ROOT_DIR/admin" && npm run dev &

echo "✅ System Online."
echo "🔗 Client: http://$(ip route get 1 | awk '{print $7}'):5173"
echo "🔗 Admin: http://$(ip route get 1 | awk '{print $7}'):5174"
echo "📡 Press Ctrl+C to disconnect."

# Keep alive
wait
