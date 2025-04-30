import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import { chatRoutes } from './src/chatRoute';
import { recordRoute } from './src/recordRoute';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/chat', chatRoutes);
app.use('/records', recordRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
