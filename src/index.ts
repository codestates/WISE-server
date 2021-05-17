/* eslint-disable import/no-unresolved */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URL as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection
  .once('open', () => {
    console.log('MONGODB is connected');
  })
  .on('error', (err) => {
    console.log(`MONGODB connection error: ${err}`);
  });

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());

// routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
