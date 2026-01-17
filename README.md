# AndroArch 🛰️💀🔥

> **AndroArch** is a modular, high-fidelity cyberpunk OS ecosystem designed for "Hacker Nomads". It turns your phone into a portable sub-OS client while your laptop/tablet acts as the primary Neural Node.

![Cyberpunk Interface](https://img.shields.io/badge/Interface-Arch_Noir-blueviolet?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployment-Linux_/_Windows-blue?style=for-the-badge)
![Network](https://img.shields.io/badge/Network-P2P_Messaging-green?style=for-the-badge)

---

## 🏗️ Architecture

AndroArch is divided into three distinct modules:

1.  **🛰️ The Server (Neural Node)**:
    *   Node.js backend.
    *   Handles P2P message routing (Neural Link).
    *   Proxies "Goolag" searches and YouTube streams.
    *   Monitors system vitals (CPU, RAM).
2.  **📱 The Client (Mobile Sub-OS)**:
    *   React + Tailwind + Framer Motion.
    *   High-fidelity mobile UI with Arch Linux aesthetics.
    *   Features: Messenger, MusicPlayer, Camera, Goolag Web, Youtube (TubeArch), Weather, and Terminal.
3.  **🖥️ The Admin (Command Center)**:
    *   Dedicated monitoring dashboard.
    *   Real-time node statistics and global emergency broadcasts.

---

## 🚀 Quick Start

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) (Project tested on Node 20+)
*   Linux (Recommended) or Windows.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/youruser/AndroArch.git
cd AndroArch

# Auto-setup (Linux)
chmod +x scripts/linux/setup.sh
./scripts/linux/setup.sh

# Manual (Windows)
# Run 'npm install' in /server, /client, and /admin
```

### 3. Launch
*   **Linux**: `./scripts/linux/launcher.sh`
*   **Windows**: Run `npm run dev` in each of the three directories.

---

## 📡 Connectivity

AndroArch is designed to be accessed from a phone. Here are the 4 recommended link methods:

| Method | Latency | Complexity | Description |
| :--- | :--- | :--- | :--- |
| **Hotspot** | Low | Very Easy | PC connects to phone's Wi-Fi hotspot. |
| **USB Tethering** | Minimal | Medium | Phone connects via USB cable (High speed + Charging). |
| **Server AP** | Low | Medium | PC creates own Wi-Fi network for clients. |
| **Bluetooth PAN**| High | Expert | Experimental slow-link for emergency data. |

---

## 🛠️ Tech Stack
*   **Frontend**: React 19, Vite, TailwindCSS v3, Framer Motion, Lucide Icons.
*   **Backend**: Node.js, Express, Socket.io, Systeminformation.
*   **APIs**: Open-Meteo (Weather), DuckDuckGo (Goolag Proxy), ytsr/ytdl (YouTube Proxy).

---

## 📜 License
MIT - Created for the Hacker Nomad lifestyle. Stay safe out there. 💀⚡
