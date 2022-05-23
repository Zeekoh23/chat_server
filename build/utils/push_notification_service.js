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
exports.sendNotificationService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config({ path: "./config.env" });
}
const https_1 = __importDefault(require("https"));
const onesignalkey = process.env.API_KEY;
const sendNotificationService = (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Basic " + onesignalkey,
    };
    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers,
    };
    var req = https_1.default.request(options, (res) => {
        res.on("data", function (data) {
            console.log(JSON.parse(data));
            return callback(null, JSON.parse(data));
        });
    });
    req.on("error", function (e) {
        return callback({
            message: e,
        });
    });
    var stringified = JSON.stringify(data);
    req.write(JSON.parse(stringified));
    req.end();
});
exports.sendNotificationService = sendNotificationService;
