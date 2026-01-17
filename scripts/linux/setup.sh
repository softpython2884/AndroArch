#!/bin/bash

# AndroArch Linux Setup Script
# Installs dependencies for all modules

echo "🏮 AndroArch: Initializing Installation..."

# Root directory check
ROOT_DIR=$(pwd)
echo "📍 Root: $ROOT_DIR"

# 1. Server
echo "🛰️ Installing Server Dependencies..."
cd "$ROOT_DIR/server" && npm install

# 2. Client
echo "📱 Installing Client Dependencies..."
cd "$ROOT_DIR/client" && npm install

# 3. Admin
echo "🖥️ Installing Admin Dependencies..."
cd "$ROOT_DIR/admin" && npm install

echo "✅ Installation Complete. All modules synchronized."
echo "💡 Use scripts/linux/launcher.sh to start the system."
