import express, { Router, Request, Response } from "express";
import { resetPassword } from "../controllers/viewController";

const viewrouter: Router = express.Router();

viewrouter.get("/resetpassword/:token", resetPassword);
viewrouter.route("/").get((req: Request, res: Response) => {
  return res.json("home to chat easy");
});

viewrouter.route("/check").get((req: Request, res: Response) => {
  return res.json("App working well");
});

export { viewrouter };
