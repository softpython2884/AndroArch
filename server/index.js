const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all connections for now (dev mode)
    methods: ["GET", "POST"]
  }
});

const axios = require('axios');
const cheerio = require('cheerio');
const ytsr = require('ytsr');
const ytdl = require('@distube/ytdl-core');

// Goolag Proxy Route (Real DDG Scraper)
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  console.log(`[Proxy] Search request for: ${query}`);

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    // We use html.duckduckgo.com because it's lighter and easier to parse than the JS heavy version
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

    const response = await axios.get(url, {
      headers: {
        // Mimic a real browser to avoid some blocking
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $('.result').each((i, element) => {
      const title = $(element).find('.result__title .result__a').text().trim();
      const link = $(element).find('.result__title .result__a').attr('href');
      const snippet = $(element).find('.result__snippet').text().trim();

      if (title && link) {
        results.push({ title, link, snippet });
      }
    });

    console.log(`[Proxy] Found ${results.length} results.`);
    res.json({ results: results.slice(0, 10) }); // Return top 10

  } catch (error) {
    console.error('[Proxy] Error fetching search results:', error.message);
    res.status(500).json({
      results: [],
      error: "Failed to reach the external network."
    });
  }
});

// YouTube Search Route
app.get('/api/youtube/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const searchResults = await ytsr(query, { limit: 20 });
    const videos = searchResults.items.filter(item => item.type === 'video').map(v => ({
      id: v.id,
      title: v.title,
      thumbnail: v.bestThumbnail.url,
      duration: v.duration,
      author: v.author.name,
      views: v.views,
      url: v.url
    }));
    res.json({ results: videos });
  } catch (error) {
    console.error('[YouTube] Search error:', error.message);
    res.status(500).json({ error: "YouTube search failed" });
  }
});

// YouTube Video Info Route
app.get('/api/youtube/info', async (req, res) => {
  const videoId = req.query.id;
  if (!videoId) return res.status(400).json({ error: "Missing video ID" });

  try {
    const info = await ytdl.getInfo(videoId);
    res.json({
      title: info.videoDetails.title,
      description: info.videoDetails.description,
      thumbnails: info.videoDetails.thumbnails,
      author: info.videoDetails.author.name,
      videoId: info.videoDetails.videoId
    });
  } catch (error) {
    console.error('[YouTube] Info error:', error.message);
    res.status(500).json({ error: "Failed to get video info" });
  }
});

// YouTube Video Stream Proxy Route
app.get('/api/youtube/stream', async (req, res) => {
  const videoId = req.query.id;
  if (!videoId) return res.status(400).json({ error: "Missing video ID" });

  try {
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });
    
    if (!format) {
      return res.status(404).json({ error: "Compatible format not found" });
    }

    console.log(`[YouTube] Proxying stream for: ${videoId}`);

    // Set headers for video streaming
    res.setHeader('Content-Type', 'video/mp4');
    
    // Use ytdl to stream directly to response
    ytdl(videoId, {
      format: format,
    }).pipe(res);

  } catch (error) {
    console.error('[YouTube] Stream error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Streaming failed" });
    }
  }
});

// WebSocket Connection
let connectedClients = 0;

const { exec } = require('child_process');

io.on('connection', (socket) => {
  connectedClients++;
  // console.log('A user connected:', socket.id, '| Total:', connectedClients);

  // Broadcast updated client count to all
  io.emit('client_count', connectedClients);

  // Send initial status
  socket.emit('system_status', { cpu: 12, ram: 45 });

  socket.on('disconnect', () => {
    connectedClients--;
    // console.log('User disconnected:', socket.id, '| Total:', connectedClients);
    io.emit('client_count', connectedClients);
  });

  // Remote Command Execution
  socket.on('execute_command', (cmd) => {
    console.log(`[Remote Term] Executing: ${cmd}`);

    // Security: Basic filter to prevent completely nuking the server accidentally
    if (cmd.includes('rm -rf /') || cmd.includes('format c:')) {
      socket.emit('command_output', 'Error: Command blocked for safety protocols.');
      return;
    }

    exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        socket.emit('command_output', `Error: ${error.message}`);
        return;
      }
      if (stderr) {
        socket.emit('command_output', stderr);
        return;
      }
      socket.emit('command_output', stdout);
    });
  });
});

const si = require('systeminformation');

// Periodic System Status Update (Real)
setInterval(async () => {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const battery = await si.battery();

    io.emit('system_status', {
      cpu: Math.round(cpu.currentLoad),
      ram: Math.round((mem.active / mem.total) * 100),
      battery: battery.hasBattery ? battery.percent : 100,
      charging: battery.isCharging
    });
  } catch (e) {
    console.error('Stats error:', e);
  }
}, 2000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
