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

const server: any = httpServer.listen(port, "0.0.0.0", () => {
  console.log(`app running on port ${port}`);
});

process.on("unhandledRejection", (err: any) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down..");
  server.close(() => {
    process.exit(1);
  });
}); //a he

//to help close the app if there's any error and run other pending request
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED, Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated!");
  });
});
