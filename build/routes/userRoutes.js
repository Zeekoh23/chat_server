"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userrouter = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const userrouter = express_1.default.Router();
exports.userrouter = userrouter;
userrouter.post("/signup", authController_1.signup);
userrouter.post("/login", authController_1.login);
userrouter.get("/logout", authController_1.logout);
userrouter.route("/").get(userController_1.getAllUsers);
userrouter.route("/allusers").get(userController_1.getAllExceptLoggedUser);
userrouter.route("/:id").get(userController_1.getUser).post(userController_1.updateUser).delete(userController_1.DeleteUser);
userrouter.route("/:number").post(userController_1.UpdateUser1);
userrouter.route("/forgotpassword").put(authController_1.forgotPassword);
userrouter.post("/resetpassword/:token", authController_1.resetPassword);
//protect all routes after this middleware
userrouter.use(authController_1.protect);
userrouter.post("/updatemypassword", authController_1.updatePassword);
userrouter.get("/me", userController_1.getMe, userController_1.getUser);
userrouter.post("/updateme", userController_1.uploadUserPhoto, userController_1.resizeUserPhoto, userController_1.updateMe);
userrouter.delete("/deleteme", userController_1.deleteMe);
userrouter.use(authController_1.protect);
