import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

import cors from "cors";

import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
const xss = require("xss-clean");
const hpp = require("hpp");
import helmet from "helmet";
import cookieParser from "cookie-parser";

const ejsmate = require("ejs-mate");

import { GlobalErrorHandler } from "./controllers/errorController";

import { ErrorHandling } from "./utils/ErrorHandling";

const app = express();

import { userrouter } from "./routes/userRoutes";
import { chatrouter } from "./routes/chatRoutes";
import { socketrouter } from "./routes/socketroutes";
import { agorarouter } from "./controllers/agoraTokenController";
import { viewrouter } from "./routes/viewRoutes";

app.enable("trust proxy");

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//GLOBAL MIDDLEWARES
app.use(express.static(__dirname + "/public"));

//implement cors
app.use(cors());

//set security http headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// data sanitization againtst NoSql query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Hello from the middleware gang");
  next();
});

// Body Parser. reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

//url parser
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(compression());

//middleware for time of request
app.use((req: any, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

console.log(process.env.NODE_ENV);

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

app.route("/img/favicon.png").get((req: Request, res: Response) => {
  res.status(204);
  res.end();
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ErrorHandling(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalErrorHandler);

export { app };
