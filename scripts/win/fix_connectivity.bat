@echo off
echo 🏮 AndroArch: Fixing Windows Connectivity...
echo ------------------------------------------

:: Request Administrator privileges
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo [!] Please run this script as ADMINISTRATOR.
    pause
    exit /b
)

echo [+] Opening Firewall Ports (3000, 5173, 5174)...

:: Server
netsh advfirewall firewall add rule name="AndroArch Server" dir=in action=allow protocol=TCP localport=3000
:: Client
netsh advfirewall firewall add rule name="AndroArch Client" dir=in action=allow protocol=TCP localport=5173
:: Admin
netsh advfirewall firewall add rule name="AndroArch Admin" dir=in action=allow protocol=TCP localport=5174

echo.
echo ✅ Done! Ports are now open.
echo 📱 On your phone, open: http://10.141.12.4:5173
echo.
pause
