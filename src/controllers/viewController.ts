import express, { Request, Response, NextFunction } from "express";

import { User } from "../models/userModel";
import CatchAsync from "../utils/CatchAsync";

export const resetPassword = CatchAsync(async (req: Request, res: Response) => {
  res.status(200).render("passwordResetForm", {
    title: "Reset your Password",
  });
});
