import express, { Router } from "express";
import { resetPassword } from "../controllers/viewController";

const viewrouter: Router = express.Router();

viewrouter.get("/resetpassword/:token", resetPassword);

export { viewrouter };
