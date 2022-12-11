import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
console.log("🚀 ~ file: index.ts:5 ~ socket");
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
if (form && input != null) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat_message', input.value);
            input.value = '';
        }
    });
}
socket.on('chat_message', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
