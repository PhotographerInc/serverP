const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = JSON.parse(data);

    if (message.typing !== undefined) {
      // Envia mensaje de estado de escritura a otros clientes
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ typing: message.typing }));
        }
      });
    } else {
      // Envia mensaje normalmente
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ content: message.content }));
        }
      });
    }
  });
});

server.listen(8080, () => {
  console.log('Servidor de websockets iniciado en el puerto 8080');
});
