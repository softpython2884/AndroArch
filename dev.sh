#!/bin/bash

# AndroArch Linux Dev Environment Initializer
# This script starts the Server, Client, and Admin modules in background processes.

echo -e "\e[1;36m[SYSTEM] Initializing AndroArch Dev Environment (Linux)...\e[0m"

# Function to handle cleanup on exit
cleanup() {
    echo -e "\e[1;33m[SYSTEM] Shutting down all services...\e[0m"
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT

# Start Server
echo -e "\e[1;32m[SYSTEM] Starting Server module...\e[0m"
cd server && npm run dev &
pid_server=$!

# Start Client (Sub-OS)
echo -e "\e[1;32m[SYSTEM] Starting Client module...\e[0m"
cd ../client && npm run dev &
pid_client=$!

# Start Admin Dashboard
echo -e "\e[1;32m[SYSTEM] Starting Admin module...\e[0m"
cd ../admin && npm run dev &
pid_admin=$!

echo -e "\e[1;36m[SYSTEM] All processes started in background.\e[0m"
echo -e "\e[1;35m[SYSTEM] Server PID: $pid_server | Client PID: $pid_client | Admin PID: $pid_admin\e[0m"
echo -e "\e[1;36m[SYSTEM] Press Ctrl+C to stop all services.\e[0m"

# Keep the script running to maintain background jobs
wait
