"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: "./config.env" });
}
process.on("unCaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! SHUTTING DOWN");
    console.log(err.name, err.message);
    process.exit(1);
});
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require("./");
const socketController_1 = require("./controllers/socketController");
const AppRouter_1 = require("./AppRouter");
const port = process.env.PORT || 4000;
const dburl = process.env.DB_URL ||
    "mongodb://localhost:27017/chat_server";
const port1 = process.env.PORT || 4000;
mongoose_1.default
    .connect(`${dburl}`, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log("DB Connected successfully");
})
    .catch((err) => console.log("error is " + err));
_1.app.use(AppRouter_1.AppRouter.getInstance());
const server = socketController_1.httpServer.listen(port, "0.0.0.0", () => {
    console.log(`app running on port ${port}`);
});
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! Shutting down..");
    server.close(() => {
        process.exit(1);
    });
});
//to help close the app if there's any error and run other pending request
process.on("SIGTERM", () => {
    console.log("SIGTERM RECEIVED, Shutting down gracefully");
    server.close(() => {
        console.log("Process terminated!");
    });
});
