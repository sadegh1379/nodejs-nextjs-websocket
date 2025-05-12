import { Request, Response } from 'express';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt';
import { wssSend } from '../socket/socket';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'invalid email' });
    }

    const token = generateToken({ userId: user._id });


    res.json({ token, userId: user._id });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'server error'});
  }
};

export const register = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'email already exists' });
      }
  
      const newUser = new User({ email, password });
      await newUser.save();
  
      const token = generateToken({ userId: newUser._id });
  
      res.status(201).json({ token });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'server error' });
    }
  };
