import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

process.on("unCaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! SHUTTING DOWN");
  console.log(err.name, err.message);
  process.exit(1);
});

import mongoose from "mongoose";
import express, { Request, Response, NextFunction } from "express";

import http from "http";
//const app = express();

//var httpServer = http.createServer(app);

import { app } from "./";
import { httpServer } from "./controllers/socketController";

import { AppRouter } from "./AppRouter";

const port: any = process.env.PORT || 4000;

const dburl: string =
  (process.env.DB_URL as string) ||
  ("mongodb://localhost:27017/chat_server" as string);

const port1: any = process.env.PORT || 4000;

mongoose
  .connect(`${dburl}`, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected successfully");
  })
  .catch((err) => console.log("error is " + err));

app.use(AppRouter.getInstance());

const server: any = httpServer.listen(4000, "0.0.0.0", () => {
  console.log("app running on port 4000");
});

/*const server1: any = app.listen(4000, () => {
  console.log("app running on port 4000");
});*/

process.on("unhandledRejection", (err: any) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down..");
  server.close(() => {
    process.exit(1);
  });
  /*server1.close(() => {
    process.exit(1);
  });*/
});

//export { httpServer, app };
