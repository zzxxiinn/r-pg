import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello There');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
