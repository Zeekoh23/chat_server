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
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss = require("xss-clean");
const hpp = require("hpp");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ejsmate = require("ejs-mate");
const errorController_1 = require("./controllers/errorController");
const ErrorHandling_1 = require("./utils/ErrorHandling");
const app = (0, express_1.default)();
exports.app = app;
const userRoutes_1 = require("./routes/userRoutes");
const chatRoutes_1 = require("./routes/chatRoutes");
const socketroutes_1 = require("./routes/socketroutes");
const agoraTokenController_1 = require("./controllers/agoraTokenController");
const viewRoutes_1 = require("./routes/viewRoutes");
app.enable("trust proxy");
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
//GLOBAL MIDDLEWARES
app.use(express_1.default.static(__dirname + "/public"));
//implement cors
app.use((0, cors_1.default)());
//set security http headers
app.use((0, helmet_1.default)());
//development logging
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// data sanitization againtst NoSql query injection
app.use((0, express_mongo_sanitize_1.default)());
// data sanitization against XSS
app.use(xss());
app.use((req, res, next) => {
    console.log("Hello from the middleware gang");
    next();
});
// Body Parser. reading data from body into req.body
app.use(express_1.default.json({ limit: "10kb" }));
//url parser
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
//middleware for time of request
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
console.log(process.env.NODE_ENV);
app.use("/api/v1/users", userRoutes_1.userrouter);
app.use("/api/v1/chats", chatRoutes_1.chatrouter);
app.use("/api/v1/socket", socketroutes_1.socketrouter);
app.use("/accesstoken", agoraTokenController_1.agorarouter);
app.use("", viewRoutes_1.viewrouter);
//catch the favicon.ico to show no content status
app.route("/favicon.ico").get((req, res) => {
    res.status(204);
    res.end();
});
app.route("/img/favicon.png").get((req, res) => {
    res.status(204);
    res.end();
});
app.all("*", (req, res, next) => {
    next(new ErrorHandling_1.ErrorHandling(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.GlobalErrorHandler);
