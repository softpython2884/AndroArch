@echo off
setlocal enabledelayedexpansion
echo 🏮 AndroArch: Connectivity Diagnostic
echo ------------------------------------------

:: Get IPv4 for Wi-Fi or Ethernet
echo [SCAN] Scanning for network interfaces...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    echo [+] Detected IP Candidate: !ip!
)

echo.
echo [CONFIG] Ports 5173 (Client), 5174 (Admin), and 3000 (Server) must be open.
echo [CONFIG] Current launch mode: npm run dev --host

echo.
echo 📱 On your phone, try these addresses:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    echo    - http://!ip!:5173
)

echo.
echo 💡 TIP: If it still "loads forever", check if your phone is truly 
echo    connected to your laptop's Wi-Fi / Hotspot and NOT using 4G/5G.
echo.
pause
