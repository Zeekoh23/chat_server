import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

import express, { Router, Request, Response, NextFunction } from "express";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

import CatchAsync from "../utils/CatchAsync";
import { ErrorHandling } from "../utils/ErrorHandling";

const appid: string = process.env.AGORA_APPID as string;
const app_cert: string = process.env.AGORA_APP_CERT as string;

const agorarouter: Router = Router();

const nocache = (req: Request, res: Response, next: NextFunction) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const generateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //set response header
  res.header("Access-Control-Allow-Origin", "*");

  //get channel name
  const channelName: string = req.query.channelName as string;

  if (!channelName) {
    //return next(new ErrorHandling("Channel is required", 404));
    res.status(404).json({ error: "channel is required" });
  }

  //get uid
  let uid: any = req.query.uid;
  if (!uid || uid == 0) {
    uid = 0;
  }

  //get role
  let role: any = RtcRole.SUBSCRIBER;
  if (req.query.role == "publisher") {
    role = RtcRole.PUBLISHER;
  }

  //get the expirytime
  let expireTime: any = req.query.expireTime;
  if (!expireTime || expireTime == "") {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }

  //calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  //build the token
  const token: string = RtcTokenBuilder.buildTokenWithUid(
    appid,
    app_cert,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );
  res.status(200).json({
    token: token,
  });
};

agorarouter.route("").get(nocache, generateAccessToken);

export { agorarouter };
