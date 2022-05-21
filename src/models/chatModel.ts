import { HookNextFunction, Schema, model, Document, Model } from "mongoose";

const object1 = Schema.Types.ObjectId;

let date_ob = new Date();
var hours = date_ob.getHours();
var minutes = date_ob.getMinutes();
var seconds = date_ob.getSeconds();

var time1 = hours + ":" + minutes + ":" + seconds;

export interface IChat {
  name: string;
  email: string;
  number: string;
  image: string;
  about: string;
  users: any;
  createdAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Chat = model<IChat>("Chat", chatSchema);

export { Chat };
