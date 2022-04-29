import express, { Router, Request, Response } from "express";
import { resetPassword } from "../controllers/viewController";

const viewrouter: Router = express.Router();

viewrouter.get("/resetpassword/:token", resetPassword);
viewrouter.get("", (req: Request, res: Response) => {
  return res.json("home to chat easy");
});
export { viewrouter };
