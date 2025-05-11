import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { initWebSocket } from './socket/socket';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  console.log("DB connected successfully")
})
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

initWebSocket(server)



