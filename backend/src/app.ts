import express from 'express';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Middleware
app.use(express.json());


// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app;
