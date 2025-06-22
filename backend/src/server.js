import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import chatRoutes from "./routes/chat.route.js";
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true, // allow frontend to send cookies
    })
  );

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth',authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);



app.get('/', (req, res) => {
    res.send('Hello World!');
    });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    });