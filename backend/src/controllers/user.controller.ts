import { Request, Response } from 'express';
import User from '../models/user.model';
import { wssSend } from '../socket/socket';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    wssSend({ type: "userStatus", userId: "681c95b0dda883c36e9013a8", data: `hello user ${Math.floor(Math.random() * 1000)}` })
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'خطا در دریافت کاربران' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'ایجاد کاربر ناموفق بود' });
  }
};
