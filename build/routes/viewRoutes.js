"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewrouter = void 0;
const express_1 = __importDefault(require("express"));
const viewController_1 = require("../controllers/viewController");
const viewrouter = express_1.default.Router();
exports.viewrouter = viewrouter;
viewrouter.get("/resetpassword/:token", viewController_1.resetPassword);
viewrouter.get("", (req, res) => {
    return res.json("home to chat easy");
});
