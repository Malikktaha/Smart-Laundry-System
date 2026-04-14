// server.js
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Rider accepting an order
    socket.on('accept_order', (data) => {
      // Notify the specific user that their order was accepted
      io.emit(`order_update_${data.userId}`, { 
        status: 'PickedUp', 
        message: 'A rider is on the way!' 
      });
    });

    // Live tracking updates
    socket.on('rider_location_update', (data) => {
      io.emit(`tracking_${data.orderId}`, { 
        lat: data.lat, 
        lng: data.lng 
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});