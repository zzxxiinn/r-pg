import express from 'express';
import { getRecords } from './db';

export const recordRoute = express.Router();

recordRoute.post('/', async (req, res) => {
  const { user_id, date } = req.body;

  try {
    //date 格式 YYYY-MM-DD
    const records = await getRecords(user_id, date);
    res.status(200).json(records);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Interval server Error',
    });
  }
});
