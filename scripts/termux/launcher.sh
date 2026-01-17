#!/data/data/com.termux/files/usr/bin/bash

echo "🏗️ AndroArch (Termux) – Booting System..."

# Récup IP locale (compatible Android)
IP=$(ip route get 1 | awk '{print $7}')
[ -z "$IP" ] && IP="127.0.0.1"

echo "📡 Local IP: $IP"
echo ""

# Kill proprement à la sortie
cleanup() {
  echo ""
  echo "💀 Shutting down AndroArch..."
  kill $SERVER_PID $CLIENT_PID $ADMIN_PID 2>/dev/null
  exit 0
}
trap cleanup INT

# SERVER
echo "🛰️ Launching Neural Link Server (3000)..."
cd server
npx nodemon index.js &
SERVER_PID=$!
cd ..

# CLIENT
echo "📱 Launching OS Client (5173)..."
cd client
npx vite --host &
CLIENT_PID=$!
cd ..

# ADMIN
echo "🖥️ Launching Admin Dashboard (5174)..."
cd admin
npx vite --host &
ADMIN_PID=$!
cd ..

echo ""
echo "✅ AndroArch Online"
echo "🔗 Client: http://$IP:5173"
echo "🔗 Admin : http://$IP:5174"
echo ""
echo "📡 Press Ctrl+C to disconnect"

wait
