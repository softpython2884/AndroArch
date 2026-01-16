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

// WebSocket Connection
let connectedClients = 0;

io.on('connection', (socket) => {
  connectedClients++;
  console.log('A user connected:', socket.id, '| Total:', connectedClients);

  // Broadcast updated client count to all
  io.emit('client_count', connectedClients);

  // Send initial status
  socket.emit('system_status', { cpu: 12, ram: 45 });

  socket.on('disconnect', () => {
    connectedClients--;
    console.log('User disconnected:', socket.id, '| Total:', connectedClients);
    io.emit('client_count', connectedClients);
  });

  socket.on('command', (cmd) => {
    console.log(`Command received: ${cmd}`);
  });
});

// Periodic System Status Update (Simulated)
setInterval(() => {
  const cpu = Math.floor(Math.random() * 30) + 10; // 10-40%
  const ram = Math.floor(Math.random() * 20) + 40; // 40-60%
  io.emit('system_status', { cpu, ram });
}, 2000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
