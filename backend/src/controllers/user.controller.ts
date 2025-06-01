import { Request, Response } from "express";
import User from "../models/user.model";
import { wssSend } from "../socket/socket";
import { SOCKET_TYPE } from "../socket/socket-type-enum";
import { Post, UserProfile } from "./types";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();

    // websocket update
    wssSend<Post>({
      type: SOCKET_TYPE.POST,
      userId: "6821ae068ac13f6ccf930e29",
      data: {
        id: 3,
        userId: 2,
        title: `this post edited ${Math.random().toString(36).substring(7)}`,
        body: `this post edited by websocket ${Math.random()
          .toString(36)
          .substring(7)}`,
      },
    });

    wssSend<Partial<UserProfile>>({
      type: SOCKET_TYPE.USER_PROFILE,
      userId: "6821ae068ac13f6ccf930e29",
      data: {
        email: "websocket@gmail.com",
        phone: "09367",
      },
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: "Failed to create user" });
  }
};
