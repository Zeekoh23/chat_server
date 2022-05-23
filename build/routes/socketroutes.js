"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketrouter = void 0;
const express_1 = __importDefault(require("express"));
const socketController_1 = require("../controllers/socketController");
const socketrouter = express_1.default.Router();
exports.socketrouter = socketrouter;
socketrouter.route("/fetchmessage").post(socketController_1.fetchmessage);
socketrouter.route("/sendnotification").get(socketController_1.SendNotification);
socketrouter.route("/sendnotificationid").post(socketController_1.SendNotificationToId);
