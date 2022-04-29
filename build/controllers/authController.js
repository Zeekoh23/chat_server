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
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.isLoggedIn = exports.protect = exports.logout = exports.login = exports.signup = exports.createSendToken = exports.signToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config({ path: "./config.env" });
}
const userModel_1 = require("../models/userModel");
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandling_1 = require("../utils/ErrorHandling");
const email_1 = require("../utils/email");
const crypto_1 = __importDefault(require("crypto"));
//import Cookies from 'js-cookie';
//import nodecookie from 'node-cookie';
//import session from 'express-session';
//import MongoStore from 'connect-mongo';
const secret = process.env.JWT_SECRET;
const mycookie = Number(process.env.JWT_COOKIE_EXPIRES_IN);
//const dblocal: any = process.env.DATABASE_LOCAL;
const expiresin = process.env.EXPIRES_IN;
function signToken(id) {
    return jsonwebtoken_1.default.sign({ id }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}
exports.signToken = signToken;
const checktoken = (req, res, next) => {
    let token = req.headers["authorization"];
    console.log(token);
    next();
};
function createSendToken(user, statusCode, res, req) {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + mycookie * 24 * 60 * 60 * 1000),
        maxAge: new Date(Date.now() + mycookie * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    //Cookies.set('jwt', token, cookieOptions);
    //nodecookie.create(res, 'jwt', token, cookieOptions);
    //nodecookie.parse(req, token);
    //nodecookie.get(req, 'jwt', token);
    //res.setHeader('set-cookie', ['jwt; SameSite=None']);
    //remove password from the output
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        expiresin,
        data: {
            user,
        },
    });
}
exports.createSendToken = createSendToken;
exports.signup = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.create({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        about: req.body.about,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEXj0tnVJRzEzqSDdtGqfoqHgzaO7mmOxybg&usqp=CAU",
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        //passwordChangedAt: req.body.passwordChangedAt,
        //passwordResetToken: req.body.passwordResetToken,
        //passwordResetExpires: req.body.passwordResetExpires,
    });
    //const user = await User.create(req.body);
    const url = `${req.protocol}://${req.get("host")}/me`;
    //await new Email(user, url).sendWelcome();
    createSendToken(user, 201, res, req);
}));
exports.login = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { number, password } = req.body;
    //check if email and password
    if (!number || !password) {
        return next(new ErrorHandling_1.ErrorHandling("Please provide email and password", 400));
    }
    //check if user exist and if password is correct
    const user = yield userModel_1.User.findOne({ number }).select("+password");
    console.log(user);
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next(new ErrorHandling_1.ErrorHandling("Incorrect number or password", 401)); //unauthorised
    }
    //if everything is okay send something to the client
    createSendToken(user, 200, res, req);
    /*const token: any = signToken(user._id);

    res.cookie('jwt', token, {
    expires: new Date(Date.now() + mycookie * 24 * 60 * 60 * 1000),
    maxAge: new Date(Date.now() + mycookie * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
    
  });

   user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });*/
}));
const logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};
exports.logout = logout;
exports.protect = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    //console.log(token);
    if (!token) {
        return next(new ErrorHandling_1.ErrorHandling("You are not logged in. Please log in to get access", 401));
    }
    //2 verification token
    //const decoded: any = await util.promisify(jwt.verify)(token, secret);
    const decoded = yield jsonwebtoken_1.default.verify(token, secret);
    console.log(decoded);
    //check if user still exists
    //const user1 = new User();
    const freshUser = yield userModel_1.User.findById(decoded.id);
    if (!freshUser) {
        return next(new ErrorHandling_1.ErrorHandling("The user belonging to the token does no longer exist", 401));
    }
    //check if user change password was issued. But not yet working
    if (yield freshUser.changePasswordAfter(decoded.iat)) {
        return next(new ErrorHandling_1.ErrorHandling("User recently changed password! Please log in again", 401));
    }
    //grant access to protected route
    req.user = freshUser;
    res.locals.user = freshUser;
    next();
}));
//only for logged in rendered pages
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.jwt) {
        try {
            //2 verifies token
            /*const decoded: any = await util.promisify(jwt.verify)(
              req.cookies.jwt,
              secret
            );*/
            const decoded = yield jsonwebtoken_1.default.verify(req.cookies.jwt, secret);
            console.log(decoded);
            //check if user still exists
            //const user1 = new User();
            const freshUser = yield userModel_1.User.findById(decoded.id);
            if (!freshUser) {
                return next();
            }
            //check if user change password was issued. But not yet working
            if (yield freshUser.changePasswordAfter(decoded.iat)) {
                return next();
            }
            //there is a logged in user
            res.locals.user = freshUser;
            return next();
        }
        catch (err) {
            return next();
        }
    }
    next();
});
exports.isLoggedIn = isLoggedIn;
function restrictTo(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandling_1.ErrorHandling("You do not have permission to perform this action", 403));
        }
        next();
    };
}
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get user based on posted email
    const { email } = req.body;
    const user1 = yield userModel_1.User.findOne({ email });
    console.log(user1);
    if (!user1) {
        return next(new ErrorHandling_1.ErrorHandling("There is no user with email address", 404));
    }
    //generate the random reset token
    const resetToken = user1.createPasswordResetToken();
    yield user1.save({ validateBeforeSave: false });
    //send to users email
    // try {
    /*await sendEmail({
        email: user1.email,
        subject: 'Your password reset token valid for 10 min',
        message,
      });*/
    const url = `${req.protocol}://${req.get("host")}/resetpassword/${resetToken}`;
    yield new email_1.Email(user1, url).sendPasswordReset();
    res.status(200).json({
        status: "success",
        message: "Token sent to email",
    });
    return resetToken;
    /* } catch (err: any) {
      user1.passwordResetToken = undefined;
      user1.passwordResetExpires = undefined;

      await user1.save({ validateBeforeSave: false });

      return next(
        new ErrorHandling(
          "There was an error sending the email, try again later!",
          500
        )
      );
    }*/
}));
exports.resetPassword = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get user based on the token
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = yield userModel_1.User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    //if token has not expired and there is user, set the new password
    if (!user) {
        return next(new ErrorHandling_1.ErrorHandling("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    //log the user in, send JWT
    createSendToken(user, 200, res, req);
}));
exports.updatePassword = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get user from collection
    const user1 = yield userModel_1.User.findById(req.user.id).select("+password");
    //check if posted current password is correct
    if (!(yield user1.correctPassword(req.body.passwordCurrent, user1.password))) {
        return next(new ErrorHandling_1.ErrorHandling("Your current password is wrong", 401));
    }
    //if so, update password
    user1.password = req.body.password;
    user1.passwordConfirm = req.body.passwordConfirm;
    yield user1.save();
    //user.findbyidandupdate will not work as intended
    //log user in, send jwt
    createSendToken(user1, 200, res, req);
}));
