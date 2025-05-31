import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';
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



