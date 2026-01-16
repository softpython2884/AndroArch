@echo off
echo [SYSTEM] Initializing AndroArch Dev Environment...

:: Start Server
start "AndroArch Server (Node)" cmd /k "cd server & npm run dev"

:: Start Client (Sub-OS)
start "AndroArch Client (Sub-OS)" cmd /k "cd client & npm run dev"

:: Start Admin Dashboard
start "AndroArch Admin" cmd /k "cd admin & npm run dev"

echo [SYSTEM] All systems nominal. Waiting for nodes to report status.
