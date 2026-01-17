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

## 🚀 Quick Start & Launch Guide

AndroArch requires the **Server**, **Client**, and **Admin** to be running simultaneously.

### 1. Installation
Run this in the root directory to install all dependencies for all modules:
*   **Linux**: `chmod +x scripts/linux/setup.sh && ./scripts/linux/setup.sh`
*   **Windows**: You must manually run `npm install` inside the `/server`, `/client`, and `/admin` folders.

### 2. Launching the System
#### 🪟 On Windows (Easy Method)
Double-click the **`dev.cmd`** file at the root. It will open three terminal windows automatically:
1.  **Node Server** (Port 3000)
2.  **OS Client** (Port 5173 - Exposed to network)
3.  **Admin Panel** (Port 5174)

#### 🐧 On Linux
```bash
chmod +x scripts/linux/launcher.sh
./scripts/linux/launcher.sh
```

---

## 📡 Connecting your Phone (The "Nomad" Setup)

To use your phone as the primary interface, follow these steps:

### Step 1: Network Link
Both the PC and the Phone **MUST** be on the same local network.
*   **Recommended**: Turn on your phone's **Mobile Hotspot** and connect your laptop to it.

### Step 2: Open Windows Firewall (Windows only)
By default, Windows blocks incoming connections.
1.  Go to `scripts/win/`
2.  Right-click **`fix_connectivity.bat`** and select **"Run as Administrator"**.
3.  This opens ports 3000, 5173, and 5174.

### Step 3: Find your Local IP
If you don't know your PC's IP address:
1.  Run **`scripts/win/check_ip.bat`**.
2.  It will display a list of IPs. Look for the one that looks like `10.141.12.x` or `192.168.x.x`.

### Step 4: Access on Phone
Open your phone's browser and type the URL shown by the script, for example:
`http://10.141.12.4:5173`

---

## 🛠️ Tech Stack
*   **Frontend**: React 19, Vite, TailwindCSS v3, Framer Motion, Lucide Icons.
*   **Backend**: Node.js, Express, Socket.io, Systeminformation.
*   **APIs**: Open-Meteo (Weather), DuckDuckGo (Goolag Proxy), ytsr/ytdl (YouTube Proxy).

---

---

## 📱 Android / Termux Guide (Experimental)

AndroArch can run on **Android** using **Termux**, turning your phone into a portable sub-node.  
⚠️ This setup is **experimental** and performance depends heavily on your device.

---

### ⚠️ Important Notes
- Termux **must be installed from F-Droid**, not Google Play.
- Android devices have **limited CPU/RAM** compared to PCs.
- Running **Server + Client + Admin** simultaneously may cause lag.
- The **Admin panel is optional** and can be disabled to improve performance.

---

## 🧩 Requirements
- Android device
- Termux (F-Droid version)
- Node.js (installed via Termux)
- Git

---

## 📦 Installation

pkg update && pkg upgrade
pkg install git nodejs iproute2


Clone the repository:

git clone https://github.com/softpython2884/AndroArch.git
cd AndroArch

Install dependencies:

npm install
cd server && npm install
cd ../client && npm install
cd ../admin && npm install
cd ..


If you encounter missing dependencies (e.g. lucide-react):

cd admin
npm install lucide-react
cd ..

---

## 🚀 Termux Launcher

AndroArch includes a dedicated Termux launcher to run multiple services simultaneously.

*   **📁 Location**: `scripts/termux/launcher.sh`

### 1. Setup
Make the script executable:
```bash
chmod +x scripts/termux/launcher.sh
```

### 2. Launch Modes
*   **🔥 Full Mode** (Server + Client + Admin):
    ```bash
    ./scripts/termux/launcher.sh
    ```
    ./scripts/termux/launcher.sh no-admin
    ```

⚠️ **Note**: Disabling the Admin panel significantly reduces CPU and RAM usage and is recommended on low-end or mid-range phones.

---

## 📡 Connecting on Android

### 1. Find your IP
Run the launcher and look for the "Local IP" line:
```bash
./scripts/termux/launcher.sh
```
Example output:
```
📡 Local IP: [IP_ADDRESS]
```

### 2. Open on Phone
Open your phone's browser (Chrome, Firefox, etc.) and enter:
```
http://[IP_ADDRESS]
```

### 3. Troubleshooting
If the connection fails:
- Ensure Termux is installed from **F-Droid**
- Check that your phone and PC are on the **same Wi-Fi network**
- Some Android versions block background services - try running in **Performance Mode** (no-admin)
- Disable **battery optimization** for Termux

---

## 🔧 Performance Tips for Android

### Disable Admin Panel (Recommended)
```bash
./scripts/termux/launcher.sh no-admin
```

### Reduce Client Quality
Edit `client/src/App.jsx` and change:
```javascript
const QUALITY_OPTIONS = [
  { label: "4K", value: 2160 },
  { label: "2K", value: 1440 },
  { label: "1080p", value: 1080 },
  { label: "720p", value: 720 },
  { label: "480p", value: 480 },
  { label: "360p", value: 360 },
  { label: "240p", value: 240 },
  { label: "144p", value: 144 }
];
```
To:
```javascript
const QUALITY_OPTIONS = [
  { label: "720p", value: 720 },
  { label: "480p", value: 480 },
  { label: "360p", value: 360 },
  { label: "240p", value: 240 },
  { label: "144p", value: 144 }
];
```

### Disable Animations
Edit `client/src/App.jsx` and change:
```javascript
<AnimatePresence>
```
to:
```javascript
<>