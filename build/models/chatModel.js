"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const object1 = mongoose_1.Schema.Types.ObjectId;
let date_ob = new Date();
var hours = date_ob.getHours();
var minutes = date_ob.getMinutes();
var seconds = date_ob.getSeconds();
var time1 = hours + ":" + minutes + ":" + seconds;
const chatSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    number: {
        type: String,
    },
    image: String,
    quantity: Number,
    about: String,
    lastMessage: String,
    time: String,
    users: Object,
    userid: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const Chat = (0, mongoose_1.model)("Chat", chatSchema);
exports.Chat = Chat;
