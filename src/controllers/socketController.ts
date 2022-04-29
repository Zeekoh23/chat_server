import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

import http from "http";
import crypto, { CipherKey, Cipher, Decipher, BinaryLike } from "crypto";

import express, { Request, Router, NextFunction, Response } from "express";

import { app } from "../index";
var httpServer = http.createServer(app);
//import { httpServer, app } from "./server";
var io = require("socket.io")(httpServer);
import { Message } from "../models/messageModel";
import { getAll } from "../utils/HandlerFactory";
import CatchAsync from "../utils/CatchAsync";
import { sendNotificationService } from "../utils/push_notification_service";
import { ErrorHandling } from "../utils/ErrorHandling";
import { ONE_SIGNAL_CONFIG } from "../app.config";

//const socketrouter: Router = express.Router();

const onesignalid: string = process.env.APP_ID as string;

const algorithm: string = "aes-256-cbc";
//generate 16 bytes of random data
const initVector: BinaryLike = crypto.randomBytes(16);
//secret key generate 32 bytes of random data
const securityKey: CipherKey = crypto.randomBytes(32);

export const SendNotification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var message = {
    app_id: onesignalid,
    contents: { en: "Welcome to my Chat App" },
    included_segments: ["All"],
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "CUSTOM NOTIFICATION",
    },
  };

  sendNotificationService(message, (err: any, results: any) => {
    if (err) {
      return next(err);
    }
    return res.status(200).send({
      status: "Success",
      data: results,
    });
  });
};

export const SendNotificationToId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var message = {
    app_id: onesignalid,
    contents: { en: req.body.message },
    included_segments: ["included_player_ids"],
    include_player_ids: req.body.devices,
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "CUSTOM NOTIFICATION",
    },
  };

  sendNotificationService(message, (err: any, results: any) => {
    if (err) {
      return next(err);
    }
    return res.status(200).json({
      status: "Success",
      data: results,
    });
  });
};

var connectedUsers: any = [];

io.on("connection", (socket: any) => {
  socket.on("chatid", (data: any) => {
    let chatid: any = data.id;
    console.log(chatid + " connected");

    socket.join(chatid);
    connectedUsers.push(chatid);

    socket.broadcast.emit("onlineusers", {
      users: connectedUsers,
    });

    socket.on("disconnect", () => {
      let index: any = connectedUsers.indexOf(chatid);
      console.log(chatid, " disconnected");
      if (index > -1) {
        connectedUsers.splice(index, 1);
      }
      socket.leave(chatid);
      socket.broadcast.emit("onlineusers", {
        users: connectedUsers,
      });
    });

    socket.on("sendmessage", (message: any) => {
      var receiverid: string = message.receiverid;
      var senderid: string = message.senderid;
      var text: string = message.text;
      var time: string = message.time;
      var path: string = message.path;
      var type: string = message.type1;
      var videopath: string = message.videopath;
      var name: string = message.name;
      console.log(message);

      saveMessage(
        text,
        time,
        type,
        senderid,
        receiverid,
        true,
        path,
        videopath
      );

      socket.in(receiverid).emit("receivemessage", {
        text: text,
        senderid: senderid,
        receiverid: receiverid,
        time: time,
        type1: type,
        path: path,
        videopath: videopath,
        name: name,
      });
      saveMessage(
        text,
        time,
        type,
        receiverid,
        senderid,
        false,
        path,
        videopath
      );
    });
  });
});

function saveMessage(
  text: string,
  time: string,
  type: string,
  sender: string,
  receiver: string,
  isSender: boolean,
  path: string,
  videopath: string
) {
  /* var message: any = new Message({
    isSender: isSender,
    text: text,
    time: time,
    type1: type,
    path: path,
    senderid: sender,
    receiverid: receiver,
    videopath: videopath,
  });
  message.save();*/

  //cipher function
  /*const cipher: Cipher = crypto.createCipheriv(
    algorithm,
    securityKey,
    initVector
  );

  //output encoding
  let encryptedData = cipher.update(text, "utf-8", "hex");
  encryptedData += cipher.final("hex");*/

  var message: any = new Message({
    senderid: sender,
    users: [
      {
        receiverid: receiver,
        messages: {
          isSender: isSender,
          text: text,

          time: time,
          type1: type,
          path: path,
          videopath: videopath,
        },
      },
    ],
  });

  Message.findOne({ senderid: sender }, (err: any, doc: any) => {
    if (!doc) {
      message.save();
    } else {
      var receiverIndex = doc.users.findIndex(
        (element: any) => element.receiverid === receiver
      );

      if (
        receiverIndex !== undefined &&
        receiverIndex != -1 /*&&
        doc.users[receiverIndex].messages.isSender != isSender*/
      ) {
        doc.users[receiverIndex].messages.push({
          isSender: isSender,
          text: text,

          time: time,
          type1: type,
          path: path,
          videopath: videopath,
        });
        doc.save();
      } else {
        doc.users.push({
          receiverid: receiver,
          messages: {
            isSender: isSender,
            text: text,
            videopath: videopath,
            time: time,
            type1: type,
            path: path,
          },
        });
        doc.save();
      }
    }
  }).catch((err: any) => {
    console.log(err.message);
  });
}

//export const fetchmessage = getAll(Message);
export const fetchmessage = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    var senderid: string = req.body.senderid;
    var receiverid: string = req.body.receiverid;

    /*const text1 = doc2[0].users[0].messages[0].text;

    const decipher = crypto.createDecipheriv(
      algorithm,
      securityKey,
      initVector
    );
    let decryptedData: string = decipher.update(text1, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    console.log(decryptedData);*/

    /* Message.findOne({ senderid: senderid }, (err: any, doc: any) => {
      var receiverIndex = doc.users.findIndex(
        (element: any) => element.receiverid === receiverid
      );

      doc.users[receiverIndex].messages.update({
        text: decryptedData,
      });
      doc.save();
    });*/

    const doc = await Message.find(
      { senderid: senderid },
      {
        users: {
          $elemMatch: { receiverid: receiverid },
        },
      }
    );

    if (doc.length > 0) {
      if (doc[0].users.length > 0) {
        var messages = doc[0].users[0].messages;
        var mess = messages.slice(Math.max(messages.length - 15, 0));
        res.status(200).json({
          //status: 'success',
          ...mess,
        });
        //res.send(messages.slice(Math.max(messages.length - 15, 0)));
      } else {
        return next(
          new ErrorHandling("No messages found to the receiver", 404)
        );
        //res.send([]);
      }
    } else {
      return next(new ErrorHandling("No messages found", 404));
      //res.send([]);
    }
    /*.then((doc: any) => {
      if (doc.length > 0) {
        if (doc[0].users.length > 0) {
          var messages = doc[0].users[0].messages;
          res.send(messages.slice(Math.max(messages.length - 15, 0)));
        } else {
          res.send([]);
        }
      } else {
        res.send([]);
      }
    })
    .catch((err: any) => {
      console.log(err);
    });*/

    //var messages = doc[0].users[0].messages;
    // var mes1 = messages.slice(Math.max(messages.length - 15, 0));

    /*if (!doc) {
      return next(new ErrorHandling("No doc found with messages", 404));
    }*/

    /*res.status(200).json({
      status: "success",
      data: {
        mes1,
      },
    });*/
    /*Message.find({senderid: senderid}, {
      users: {
        $eleMatch: {receiverid: receiverid}
      }
    }).then((doc: any) => {
      if(doc.length > 0){
        if(doc[0].users.length > 0){
          var messages = doc[0].users[0].messages;
          res.send(messages.slice(Math.max(messages.length - 15, 0)));
        } else{
          res.send([]);
        }
      } else{
        res.send([]);
      }
    });*/
  }
);

//socketrouter.route("/fetchmessage").post(fetchmessage);

//socketrouter.get("/connect", socketConnect);

export { httpServer };
