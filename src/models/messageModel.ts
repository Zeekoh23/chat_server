import mongoose, { HookNextFunction, Schema, model } from "mongoose";
const object1 = Schema.Types.ObjectId;

export interface IMessage {
  text: string;
  isSender: boolean;
  type1: string;
  time: string;
  path: string;
  videopath: string;
 // senderid: string;
  //receiverid: string;
}

const contentSchema = new Schema<IMessage>(
  {
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
    /*senderid: {
      type: String,
    },
    receiverid: {
      type: String,
    }*/
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const receiverSchema = new Schema({
  receiverid: {
    type: String,
    //unique: true
  },
  messages: [contentSchema],
});

const messageSchema = new Schema({
  senderid: {
    type: String,
    //unique: true,
  },
  users: [receiverSchema],
});

const Message = model("Message", messageSchema);
export { Message };
