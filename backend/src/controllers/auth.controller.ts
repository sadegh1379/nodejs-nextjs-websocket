import { Request, Response } from 'express';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });
    }

    const token = generateToken({ userId: user._id });


    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const register = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'این ایمیل قبلاً ثبت شده است' });
      }
  
      const newUser = new User({ email, password });
      await newUser.save();
  
      const token = generateToken({ userId: newUser._id });
  
      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'خطای سرور' });
    }
  };
