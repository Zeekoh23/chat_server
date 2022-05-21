import express, { Router } from "express";

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
  logout,
} from "../controllers/authController";

import {
  getAllUsers,
  updateMe,
  deleteMe,
  DeleteUser,
  updateUser,
  getUser,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
  getAllExceptLoggedUser,
  UpdateUser1,
} from "../controllers/userController";

const userrouter: Router = express.Router();

userrouter.post("/signup", signup);
userrouter.post("/login", login);
userrouter.get("/logout", logout);

userrouter.route("/").get(getAllUsers);
userrouter.route("/allusers").get(getAllExceptLoggedUser);
userrouter.route("/:id").get(getUser).post(updateUser).delete(DeleteUser);
userrouter.route("/:number").post(UpdateUser1);
userrouter.route("/forgotpassword").put(forgotPassword);
userrouter.post("/resetpassword/:token", resetPassword);

//protect all routes after this middleware
userrouter.use(protect);

userrouter.post("/updatemypassword", updatePassword);

userrouter.get("/me", getMe, getUser);
userrouter.post("/updateme", uploadUserPhoto, resizeUserPhoto, updateMe);
userrouter.delete("/deleteme", deleteMe);

userrouter.use(protect);

export { userrouter };
