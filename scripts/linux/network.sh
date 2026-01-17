#!/bin/bash

# AndroArch Connectivity Manager
# Helps establish links between Host and Client devices

echo "🌊 AndroArch: Connectivity Manager"
echo "-----------------------------------"
echo "1) Create Wi-Fi Hotspot (Server as AP)"
echo "2) USB Tethering Info (Low Latency)"
echo "3) Bluetooth PAN Setup (Experimental)"
echo "4) Local Network Scan (Find Phone IP)"
echo "-----------------------------------"
read -p "Select Link Type [1-4]: " Choice

case $Choice in
    1)
        read -p "Enter SSID: " SSID
        read -p "Enter Password (min 8 char): " PASS
        echo "📡 Creating Hotspot..."
        nmcli device wifi hotspot ssid "$SSID" password "$PASS"
        ;;
    2)
        echo "🔌 USB Tethering Instructions:"
        echo "1. Connect phone via USB cable."
        echo "2. on Phone: Settings > Hotspot > USB Tethering [ENABLE]."
        echo "3. The laptop will detect a new ethernet interface."
        echo "4. Use 'hostname -I' to find your IP on that interface."
        ;;
    3)
        echo "🔵 Bluetooth PAN (Personal Area Network):"
        echo "Requires 'bluez-tools' or 'blueman'."
        echo "1. Pair phone and laptop."
        echo "2. on Phone: Enable 'Bluetooth Tethering'."
        echo "3. on Laptop: Connect to phone's network service."
        ;;
    4)
        echo "🔍 Scanning local network for clients..."
        ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}'
        echo "Note: Ensure your phone is on the same subnet."
        ;;
    *)
        echo "Invalid choice."
        ;;
esac
