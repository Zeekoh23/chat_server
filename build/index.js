"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config({ path: "./config.env" });
}
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const ejsmate = require("ejs-mate");
const errorController_1 = require("./controllers/errorController");
const app = (0, express_1.default)();
exports.app = app;
const userRoutes_1 = require("./routes/userRoutes");
const chatRoutes_1 = require("./routes/chatRoutes");
const socketroutes_1 = require("./routes/socketroutes");
const agoraTokenController_1 = require("./controllers/agoraTokenController");
const viewRoutes_1 = require("./routes/viewRoutes");
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.static(__dirname + "/public"));
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express_1.default.json());
var clients = {};
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
console.log(process.env.NODE_ENV);
app.use((req, res, next) => {
    console.log("Hello from the middleware gang");
    next();
});
app.use("/api/v1/users", userRoutes_1.userrouter);
app.use("/api/v1/chats", chatRoutes_1.chatrouter);
app.use("/api/v1/socket", socketroutes_1.socketrouter);
app.use("/accesstoken", agoraTokenController_1.agorarouter);
app.use("/", viewRoutes_1.viewrouter);
//catch the favicon.ico to show no content status
app.route("/favicon.ico").get((req, res) => res.status(204));
/*app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ErrorHandling(`Can't find ${req.originalUrl} on this server`, 404));
});*/
app.use(errorController_1.GlobalErrorHandler);
