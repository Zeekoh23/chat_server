"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agorarouter = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config({ path: "./config.env" });
}
const express_1 = require("express");
const agora_access_token_1 = require("agora-access-token");
const appid = process.env.AGORA_APPID;
const app_cert = process.env.AGORA_APP_CERT;
const agorarouter = (0, express_1.Router)();
exports.agorarouter = agorarouter;
const nocache = (req, res, next) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
};
const generateAccessToken = (req, res, next) => {
    //set response header
    res.header("Access-Control-Allow-Origin", "*");
    //get channel name
    const channelName = req.query.channelName;
    if (!channelName) {
        res.status(404).json({ error: "channel is required" });
    }
    //get uid
    let uid = req.query.uid;
    if (!uid || uid == 0) {
        uid = 0;
    }
    //get role
    let role = agora_access_token_1.RtcRole.SUBSCRIBER;
    if (req.query.role == "publisher") {
        role = agora_access_token_1.RtcRole.PUBLISHER;
    }
    //get the expirytime
    let expireTime = req.query.expireTime;
    if (!expireTime || expireTime == "") {
        expireTime = 3600;
    }
    else {
        expireTime = parseInt(expireTime, 10);
    }
    //calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    //build the token
    const token = agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(appid, app_cert, channelName, uid, role, privilegeExpireTime);
    res.status(200).json({
        token: token,
    });
};
agorarouter.route("").get(nocache, generateAccessToken);
