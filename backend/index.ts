import express from 'express'
import serverless from "serverless-http";
const app = express();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "js")));
const port = 3000;
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import path from 'path';
const io = new Server(server, {
  cors: {
    origin: '*'
  },

});


app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' })
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