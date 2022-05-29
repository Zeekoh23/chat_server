import express, { Router } from "express";

import {
  GetChat,
  GetAllChats,
  UpdateChat,
  DeleteChat,
  createChat,
  UpdateChat1,
  UpdateChat2,
  UpdateChat3,
  GetChat1,
  UpdateChatImage,
  UpdateChatName,
  UpdateChatAbout,
} from "../controllers/chatController";

const chatrouter: Router = express.Router();

chatrouter.route("/").get(GetAllChats);
chatrouter.route("/").post(createChat);
chatrouter.route("/:id").delete(DeleteChat).post(UpdateChat);
chatrouter.route("/time/:time").get(GetChat).post(UpdateChat1);
chatrouter.route("/lastMessage/:lastMessage").post(UpdateChat2);
chatrouter.route("/number/:number").get(GetChat1).post(UpdateChat3);
chatrouter.route("/image/:email").post(UpdateChatImage);
chatrouter.route("/name/:email").post(UpdateChatName);
chatrouter.route("/about/:email").post(UpdateChatAbout);

export { chatrouter };
