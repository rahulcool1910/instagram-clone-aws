import express from 'express'
import serverless from "serverless-http";
const app = express();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "js")));
app.use(express.json())
const port = 3000;
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import path from 'path';

import { createClient } from 'redis'
import { Client } from 'redis-om'

const redis = createClient({ url: 'redis://localhost:6379' })
await redis.connect()
const client = await new Client().use(redis)


const io = new Server(server, {
  cors: {
    origin: '*'
  },

});


app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' })
});


app.post('/set', async (req, res) => {
  const { key, value } = req.body;
  await redis.set(key, value)
  res.json({
    status:
      "ok"
  })
});
app.get('/get', async (req, res) => {
  const { key } = req.body;
  const data = await redis.get(key)
  res.json({ data })
});


const map = new Map();
io.on('connection', (socket) => {
  const { userName } = socket.handshake.auth
  console.log("🚀 ~ file: index.ts:23 ~ io.on ~ userName", userName)
  map.set(userName, socket.id)
  socket.on('chat_message', (msg) => {

    const user = msg.userData;
    const message = msg.message;
    io.to(map.get(user)).emit('chat_message', message)
  });
});

// io.on('connection', (socket) => {
//   socket.on('chat message', (msg) => {
//     console.log('message: ' + msg);
//   });
//   console.log('a user connected', socket.id);

//   // socket.on('disconnect', () => {
//   //   console.log('user disconnected');
//   // });
// });

server.listen(3000, () => {
  console.log('listening on *:3000');
});


export const handler = serverless(app);