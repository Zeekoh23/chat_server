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
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new ErrorHandling_1.ErrorHandling(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*\1/)[0];
    const message = `Duplicate field value. please use another value`;
    return new ErrorHandling_1.ErrorHandling(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new ErrorHandling_1.ErrorHandling(message, 400);
};
const handleJWTError = () => new ErrorHandling_1.ErrorHandling("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () => new ErrorHandling_1.ErrorHandling("Token is expired.Please login again!!!", 401);
const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    // B) RENDERED WEBSITE
    console.error("ERROR???", err);
    return res.status(err.statusCode).render("error", {
        title: "something went wrong",
        msg: err.message,
    });
};
const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith("/api")) {
        // A) operational trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // B) Programming or other unknown error: don't leak details
        console.error("ERROR???", err);
        return res.status(500).json({
            status: "error",
            message: "something went wrong",
        });
    }
    // B) RENDERED WEBSITE
    if (err.isOperational) {
        return res.status(err.statusCode).render("error", {
            title: "something went wrong",
            msg: err.message,
        });
    }
    // Programming or other unknown error: don't leak error information
    // 1) Log error
    console.error("ERROR???", err);
    return res.status(err.statusCode).render("error", {
        title: "something went wrong",
        msg: "Please try again",
    });
};
function GlobalErrorHandler(err, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || "err";
        if (process.env.NODE_ENV === "development") {
            sendErrorDev(err, req, res);
        }
        else if (process.env.NODE_ENV === "production") {
            let error = Object.assign(err);
            if (error.name === "CastError")
                error = handleCastErrorDB(error);
            if (error.code === 11000)
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
