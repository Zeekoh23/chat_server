"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatrouter = void 0;
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const chatrouter = express_1.default.Router();
exports.chatrouter = chatrouter;
chatrouter.route("/").get(chatController_1.GetAllChats);
chatrouter.route("/").post(chatController_1.createChat);
chatrouter.route("/:id").delete(chatController_1.DeleteChat).post(chatController_1.UpdateChat);
chatrouter.route("/time/:time").get(chatController_1.GetChat).post(chatController_1.UpdateChat1);
chatrouter.route("/lastMessage/:lastMessage").post(chatController_1.UpdateChat2);
chatrouter.route("/number/:number").get(chatController_1.GetChat1).post(chatController_1.UpdateChat3);
chatrouter.route("/image/:email").post(chatController_1.UpdateChatAgain);
chatrouter.route("/name/:email").post(chatController_1.UpdateChatName);
chatrouter.route("/about/:email").post(chatController_1.UpdateChatAbout);
