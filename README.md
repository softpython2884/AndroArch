# AndroArch

> **Status:** Pre-Alpha / Prototype
> **Codename:** "Cyber-Nomad"

## 📑 Overview
AndroArch is a split-node architecture system designed for a "Cyberpunk / Hacker Nomad" experience. It turns a tablet into a powerful server/admin node and a phone into a sleek, "Sub-OS" client interface.

## 🏗 Architecture

### 1. Server (The Brain) - `/server`
- **Role:** Backend Logic, Proxy, System Monitor.
- **Tech:** Node.js, Express, Socket.io.
- **Functions:** 
  - Host for API & WebSockets.
  - "Goolag" Proxy (Gateway for the client).

### 2. Client (Sub-OS) - `/client`
- **Role:** The "Phone" Interface.
- **Tech:** React, Vite, Tailwind, Framer Motion.
- **Design:** High-tech, localized, minimalist UI.

### 3. Admin - `/admin`
- **Role:** The "Tablet" Dashboard.
- **Tech:** React, Vite, Tailwind.
- **Functions:** Monitoring connectivity, bandwidth, and logs.

## 🚀 Getting Started

### Windows (Dev)
Run the auto-launcher to start all 3 services in separate terminals:
```cmd
dev.cmd
```

### Termux / Linux
Each module has its own `start.sh` for individual deployment on devices.

```bash
# On Tablet (Server)
cd server && ./start.sh

# On Tablet (Admin)
cd admin && ./start.sh

# On Phone (Client)
cd client && ./start.sh
```

## 🔌 Connection Setup (Dev)
1. **Server** runs on `localhost:3000`.
2. **Client** connects to `http://localhost:3000`.
3. In a real scenario (USB Tethering), use SSH Tunneling on the phone:
   `ssh -L 8080:localhost:3000 user@192.168.x.x`
