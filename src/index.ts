import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import ejs from "ejs";

const ejsmate = require("ejs-mate");

import { GlobalErrorHandler } from "./controllers/errorController";

import { ErrorHandling } from "./utils/ErrorHandling";

const app = express();

import { userrouter } from "./routes/userRoutes";
import { chatrouter } from "./routes/chatRoutes";
import { socketrouter } from "./routes/socketroutes";
import { agorarouter } from "./controllers/agoraTokenController";
import { viewrouter } from "./routes/viewRoutes";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(__dirname + "/public"));

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.json());

var clients: any = {};
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));

console.log(process.env.NODE_ENV);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Hello from the middleware gang");
  next();
});

app.use("/api/v1/users", userrouter);
app.use("/api/v1/chats", chatrouter);
app.use("/api/v1/socket", socketrouter);
app.use("/accesstoken", agorarouter);
app.use("", viewrouter);

//catch the favicon.ico to show no content status
app.route("/favicon.ico").get((req: Request, res: Response) => {
  res.status(204);
  res.end();
});

app.use(GlobalErrorHandler);

export { app };
