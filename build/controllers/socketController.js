"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.fetchmessage = exports.SendNotificationToId = exports.SendNotification = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config({ path: "./config.env" });
}
const http_1 = __importDefault(require("http"));
const crypto_1 = __importDefault(require("crypto"));
const index_1 = require("../index");
var httpServer = http_1.default.createServer(index_1.app);
exports.httpServer = httpServer;
var io = require("socket.io")(httpServer);
const messageModel_1 = require("../models/messageModel");
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const push_notification_service_1 = require("../utils/push_notification_service");
const ErrorHandling_1 = require("../utils/ErrorHandling");
const onesignalid = process.env.APP_ID;
const algorithm = "aes-256-cbc";
//generate 16 bytes of random data
const initVector = crypto_1.default.randomBytes(16);
//secret key generate 32 bytes of random data
const securityKey = crypto_1.default.randomBytes(32);
const SendNotification = (req, res, next) => {
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
    (0, push_notification_service_1.sendNotificationService)(message, (err, results) => {
        if (err) {
            return next(err);
        }
        return res.status(200).send({
            status: "Success",
            data: results,
        });
    });
};
exports.SendNotification = SendNotification;
const SendNotificationToId = (req, res, next) => {
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
    (0, push_notification_service_1.sendNotificationService)(message, (err, results) => {
        if (err) {
            return next(err);
        }
        return res.status(200).json({
            status: "Success",
            data: results,
        });
    });
};
exports.SendNotificationToId = SendNotificationToId;
var connectedUsers = [];
io.on("connection", (socket) => {
    socket.on("chatid", (data) => {
        let chatid = data.id;
        console.log(chatid + " connected");
        socket.join(chatid);
        connectedUsers.push(chatid);
        socket.broadcast.emit("onlineusers", {
            users: connectedUsers,
        });
        socket.on("disconnect", () => {
            let index = connectedUsers.indexOf(chatid);
            console.log(chatid, " disconnected");
            if (index > -1) {
                connectedUsers.splice(index, 1);
            }
            socket.leave(chatid);
            socket.broadcast.emit("onlineusers", {
                users: connectedUsers,
            });
        });
        socket.on("sendtyping", (type) => {
            var typing = type.typing;
            var sender = type.sender;
            var receiver = type.receiver;
            socket.in(receiver).emit("receivetyping", {
                typing: typing,
                sender: sender,
                receiver: receiver,
            });
        });
        socket.on("sendmessage", (message) => {
            var receiverid = message.receiverid;
            var senderid = message.senderid;
            var text = message.text;
            var time = message.time;
            var path = message.path;
            var type = message.type1;
            var videopath = message.videopath;
            var name = message.name;
            console.log(message);
            saveMessage(text, time, type, senderid, receiverid, true, path, videopath);
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
            saveMessage(text, time, type, receiverid, senderid, false, path, videopath);
        });
    });
});
function saveMessage(text, time, type, sender, receiver, isSender, path, videopath) {
    var message = new messageModel_1.Message({
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
    messageModel_1.Message.findOne({ senderid: sender }, (err, doc) => {
        if (!doc) {
            message.save();
        }
        else {
            var receiverIndex = doc.users.findIndex((element) => element.receiverid === receiver);
            if (receiverIndex !== undefined && receiverIndex != -1) {
                doc.users[receiverIndex].messages.push({
                    isSender: isSender,
                    text: text,
                    time: time,
                    type1: type,
                    path: path,
                    videopath: videopath,
                });
                doc.save();
            }
            else {
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
    }).catch((err) => {
        console.log(err.message);
    });
}
exports.fetchmessage = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var senderid = req.body.senderid;
    var receiverid = req.body.receiverid;
    const doc = yield messageModel_1.Message.find({ senderid: senderid }, {
        users: {
            $elemMatch: { receiverid: receiverid },
        },
    });
    if (doc.length > 0) {
        if (doc[0].users.length > 0) {
            var messages = doc[0].users[0].messages;
            var mess = messages.slice(Math.max(messages.length - 15, 0));
            res.status(200).json(Object.assign({}, mess));
        }
        else {
            return next(new ErrorHandling_1.ErrorHandling("No messages found to the receiver", 404));
        }
    }
    else {
        return next(new ErrorHandling_1.ErrorHandling("No messages found", 404));
    }
}));
