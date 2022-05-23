"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const object1 = mongoose_1.Schema.Types.ObjectId;
const contentSchema = new mongoose_1.Schema({
    text: {
        type: String,
    },
    isSender: {
        type: Boolean,
    },
    type1: {
        type: String,
    },
    time: {
        type: String,
    },
    path: {
        type: String,
    },
    videopath: {
        type: String,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const receiverSchema = new mongoose_1.Schema({
    receiverid: {
        type: String,
    },
    messages: [contentSchema],
});
const messageSchema = new mongoose_1.Schema({
    senderid: {
        type: String,
    },
    users: [receiverSchema],
});
const Message = (0, mongoose_1.model)("Message", messageSchema);
exports.Message = Message;
