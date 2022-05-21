import { Request, Response, NextFunction } from "express";

import { Chat, IChat } from "../models/chatModel";
import { APIFeatures } from "../utils/APIFeatures";
import CatchAsync from "../utils/CatchAsync";
import { ErrorHandling } from "../utils/ErrorHandling";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "../utils/HandlerFactory";

export const createChat = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const chats = await Chat.create({
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      image: req.body.image,
      quantity: req.body.quantity,
      about: req.body.about,
      lastMessage: req.body.lastMessage,
      time: req.body.time,
      users: req.body.users,
      userid: req.body.userid,
      createdAt: Date.now(),
    });

    res.status(201).json({
      status: "success",
      data: {
        chats,
      },
    });
  }
);
export const GetAllChats = getAll(Chat);

export const GetChat = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doc: any = await Chat.findOne();

    const timeStr: any = doc.time.toString();

    const query = await Chat.findOne({ time: timeStr });

    if (!query) {
      return next(new ErrorHandling("No doc found with that number", 404));
    }
    res.status(200).json({
      ...query,
    });
  }
);

export const GetChat1 = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = await Chat.findOne({ number: req.params.number });

    if (!query) {
      return next(new ErrorHandling("No doc found with that number", 404));
    }
    res.status(200).json({
      status: "Success",
      data: {
        query,
      },
    });
  }
);

export const DeleteChat = deleteOne(Chat);

export const UpdateChat1 = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const chat = await Chat.findOneAndUpdate(
      { time: req.params.time },
      req.body,
      { new: true, runValidators: true }
    );

    if (!chat) {
      return next(new ErrorHandling("No document found with that time", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        chat,
      },
    });
  }
);

export const UpdateChat2 = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const chat = await Chat.findOneAndUpdate(
      { lastMessage: req.params.lastMessage },
      req.body,
      { new: true, runValidators: true }
    );

    if (!chat) {
      return next(
        new ErrorHandling("No document found with that message", 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        chat,
      },
    });
  }
);

export const UpdateChat3 = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const chat = await Chat.findOneAndUpdate(
      { number: req.params.number },
      req.body,
      { new: true, runValidators: true }
    );

    if (!chat) {
      return next(new ErrorHandling("No document found with that number", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        chat,
      },
    });
  }
);
export const UpdateChat = updateOne(Chat);
