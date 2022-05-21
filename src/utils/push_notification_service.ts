import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

import http, { IncomingMessage } from "http";
import https, { RequestOptions, request } from "https";
import { ONE_SIGNAL_CONFIG } from "../app.config";

const onesignalkey: string = process.env.API_KEY as string;

export const sendNotificationService = async (data: any, callback: any) => {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: "Basic " + onesignalkey,
  };

  var options: RequestOptions = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers,
  };

  var req: any = https.request(options, (res: IncomingMessage) => {
    res.on("data", function (data: any) {
      console.log(JSON.parse(data));
      return callback(null, JSON.parse(data));
    });
  });
  req.on("error", function (e: any) {
    return callback({
      message: e,
    });
  });
  var stringified: string = JSON.stringify(data);
  req.write(JSON.parse(stringified));

  req.end();
};
