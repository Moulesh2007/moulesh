const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

// simple health
app.get('/', (req, res) => res.send('Socket server running'));

// receive manual update via POST (for testing)
app.post('/update', (req, res) => {
  const payload = req.body;
  io.emit('location', payload);
  res.json({ ok: true });
});

io.on('connection', (socket) => {
  console.log('client connected', socket.id);

  socket.on('driver-update', (payload) => {
    io.emit('location', payload);
  });

  socket.on('disconnect', () => console.log('client disconnected', socket.id));
});

const PORT = process.env.SOCKET_PORT || 4000;
server.listen(PORT, () => console.log(`Socket server listening on ${PORT}`));
