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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorHandler = void 0;
const ErrorHandling_1 = require("../utils/ErrorHandling");
const handleCastleErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new ErrorHandling_1.ErrorHandling(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field values: ${value}, Please use another value!`;
    return new ErrorHandling_1.ErrorHandling(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data, ${errors.join(". ")}`;
    return new ErrorHandling_1.ErrorHandling(message, 400);
};
const handleJWTError = () => new ErrorHandling_1.ErrorHandling("Invalid token, please login again!", 401);
const handleJWTExpiredError = () => new ErrorHandling_1.ErrorHandling("Your token has expired! Please log in again", 401);
function sendErrorDev(err, req, res) {
    if (req.originalUrl.startsWith("/api")) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    else {
        console.error("ERROR", err);
        res.status(err.statusCode).render("error", {
            title: "Something went wrong",
            msg: err.message,
        });
    }
}
const sendErrorProd = (err, req, res) => {
    //api
    if (req.originalUrl.startsWith("/api")) {
        //a) operational or trusted error
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        //b) programming or unknown error
        //1. log error
        console.error("ERROR ", err);
        return res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
    //rendered website
    //a) operational or trusted error
    if (err.isOperational) {
        return res.status(err.statusCode).render("error", {
            title: "Something went wrong",
            msg: err.message,
        });
    }
    console.error("ERROR", err);
    //b) programming or unknown error
    return res.status(err.statusCode).render("error", {
        title: "Something went wrong",
        msg: "Please try again later",
    });
};
function GlobalErrorHandler(err, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(err.stack);
        err.statusCode = err.statusCode || 500;
        err.status = err.status || "error";
        if (process.env.NODE_ENV === "development") {
            sendErrorDev(err, req, res);
        }
        else if (process.env.NODE_ENV === "production") {
            let error = Object.assign({}, err);
            error.message = err.message;
            if (error.name === "CastError")
                error = handleCastleErrorDB(error);
            if ((error.statusCode = 11000))
                error = handleDuplicateFieldsDB(error);
            if (error.name === "ValidationError")
                error = handleValidationErrorDB(error);
            if (error.name === "JsonWebTokenError")
                error = handleJWTError();
            if (error.name === "TokenExpiredError")
                error = handleJWTExpiredError();
            sendErrorProd(error, req, res);
        }
    });
}
exports.GlobalErrorHandler = GlobalErrorHandler;
