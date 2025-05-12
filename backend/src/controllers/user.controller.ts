import { Request, Response } from 'express';
import User from '../models/user.model';
import { wssSend } from '../socket/socket';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    // test 1 => 6821ae068ac13f6ccf930e29
    // test2 => 6821ae0a8ac13f6ccf930e2c
    wssSend({ type: "userStatus", userId: "6821ae068ac13f6ccf930e29", data: `hello user ${Math.floor(Math.random() * 1000)}` })
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
