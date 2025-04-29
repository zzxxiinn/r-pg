import { createDeepSeek } from '@ai-sdk/deepseek';
import express, { Request, Response } from 'express';
import { generateText } from 'ai';
import dotenv from 'dotenv';

dotenv.config();

const chatRoutes = express.Router();

const deepSeek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// localhost:8000/chat/
chatRoutes.post('/', async (req: Request, res: Response) => {
  const result = await generateText({
    model: deepSeek('deepseek-chat'),
    prompt: 'You are a helpful assistant',
  });

  console.log(result);

  res.json(result);
});

export { chatRoutes };
