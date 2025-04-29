import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import { chatRoutes } from './src/chatRoute';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/chat', chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
