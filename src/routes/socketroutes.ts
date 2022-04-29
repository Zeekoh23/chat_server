import express, { Router } from "express";

import {
  fetchmessage,
  SendNotification,
  SendNotificationToId,
} from "../controllers/socketController";

const socketrouter: Router = express.Router();

socketrouter.route("/fetchmessage").post(fetchmessage);
//socketrouter.route("/").get(fetchmessage);
socketrouter.route("/sendnotification").get(SendNotification);
socketrouter.route("/sendnotificationid").post(SendNotificationToId);

export { socketrouter };
