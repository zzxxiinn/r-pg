import { createDeepSeek } from '@ai-sdk/deepseek';
import express, { Request, Response } from 'express';
import { generateText } from 'ai';
import dotenv from 'dotenv';
import { createRecord } from './db';

dotenv.config();

const chatRoutes = express.Router();

const deepSeek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const today = () => new Date().toISOString().split('T')[0];

const prompt = (today: string) =>
  `请你分析一下我的输入,如果是消费或者支出记录,则按照json格式返回,不然正常返回。格式如下:{"amount"1800,"title":"others","date”:"2024-01-01"},规则是:1.如果是消费,则amount是负数,如果是收入,则amount是正数,2.如果是支出,则title是消费的商品或者服务,如果是收入,则title是收入的来源,如果分析不出来,则填others 3.今天是${today},如果能分析出日期,则date是日期,否则为今天`;

// localhost:8000/chat/
chatRoutes.post('/', async (req: Request, res: Response) => {
  const { messages, user_id: userId } = req.body;
  console.log(userId, `:`, messages);
  console.log(JSON.stringify(messages));

  let resJson = {
    text: '',
    record: null,
  };

  try {
    const { text } = await generateText({
      model: deepSeek('deepseek-chat'),
      system: prompt(today()),
      messages,
    });
    const record = parseResult(text);
    if (record) {
      // save to db
      await createRecord(userId, record.amount, record.title, record.date);
      resJson.record = record;
    } else {
      resJson.text = text;
    }

    res.status(200).json(resJson);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json(resJson);
    return;
  }
});

const parseResult = (result: string) => {
  try {
    // 清理可能存在的 Markdown 格式
    console.log('before parse: ', result);

    const cleanResult = result
      .replace(/```json\n/, '')
      .replace(/```/g, '')
      .replace(/\\n/g, '')
      .replace(/\\"/g, '"')
      .trim();
    const parsedResult = JSON.parse(cleanResult);
    console.log('parsedResult', parsedResult);

    if (parsedResult.amount && parsedResult.title && parsedResult.date) {
      return parsedResult;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export { chatRoutes };
