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
exports.UpdateChat = exports.UpdateChat3 = exports.UpdateChat2 = exports.UpdateChat1 = exports.DeleteChat = exports.GetChat1 = exports.GetChat = exports.GetAllChats = exports.createChat = void 0;
const chatModel_1 = require("../models/chatModel");
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const ErrorHandling_1 = require("../utils/ErrorHandling");
const HandlerFactory_1 = require("../utils/HandlerFactory");
//export const createChat = createOne(Chat);
exports.createChat = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield chatModel_1.Chat.create({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        image: req.body.image,
        quantity: req.body.quantity,
        about: req.body.about,
        lastMessage: req.body.lastMessage,
        time: req.body.time,
        users: req.body.users,
        userid: req.body.userid,
        createdAt: Date.now()
    });
    res.status(201).json({
        status: 'success',
        data: {
            chats,
        }
    });
}));
exports.GetAllChats = (0, HandlerFactory_1.getAll)(chatModel_1.Chat);
//export const GetChat = getOne(Chat);
exports.GetChat = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield chatModel_1.Chat.findOne();
    const timeStr = doc.time.toString();
    const query = yield chatModel_1.Chat.findOne({ time: timeStr });
    //const query = await Chat.aggregate([{$match: {number: numberStr}}]);
    if (!query) {
        return next(new ErrorHandling_1.ErrorHandling("No doc found with that number", 404));
    }
    res.status(200).json(Object.assign({}, query));
    //if(popOptions) query = query.populate(popOptions);
}));
exports.GetChat1 = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const doc: any = await Chat.findOne();
    //const number: any = doc.number.toString();
    const query = yield chatModel_1.Chat.findOne({ number: req.params.number });
    //const query = await Chat.aggregate([{$match: {number: numberStr}}]);
    if (!query) {
        return next(new ErrorHandling_1.ErrorHandling("No doc found with that number", 404));
    }
    res.status(200).json({
        status: "Success",
        data: {
            query,
        },
    });
    //if(popOptions) query = query.populate(popOptions);
}));
exports.DeleteChat = (0, HandlerFactory_1.deleteOne)(chatModel_1.Chat);
/*export const UpdateChat = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const chat = await Chat.findByIdAndUpdate(
     req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!chat) {
      return next(new ErrorHandling("No document found with that id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        chat,
      },
    });
  }
);*/
exports.UpdateChat1 = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield chatModel_1.Chat.findOneAndUpdate({ time: req.params.time }, req.body, { new: true, runValidators: true });
    if (!chat) {
        return next(new ErrorHandling_1.ErrorHandling("No document found with that time", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            chat,
        },
    });
}));
exports.UpdateChat2 = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield chatModel_1.Chat.findOneAndUpdate({ lastMessage: req.params.lastMessage }, req.body, { new: true, runValidators: true });
    if (!chat) {
        return next(new ErrorHandling_1.ErrorHandling("No document found with that message", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            chat,
        },
    });
}));
exports.UpdateChat3 = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield chatModel_1.Chat.findOneAndUpdate({ number: req.params.number }, req.body, { new: true, runValidators: true });
    if (!chat) {
        return next(new ErrorHandling_1.ErrorHandling("No document found with that number", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            chat,
        },
    });
}));
exports.UpdateChat = (0, HandlerFactory_1.updateOne)(chatModel_1.Chat);
