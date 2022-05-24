import { Request, Response, NextFunction } from "express";

import { ErrorHandling } from "../utils/ErrorHandling";

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ErrorHandling(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*\1/)[0];

  const message = `Duplicate field value. please use another value`;
  return new ErrorHandling(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ErrorHandling(message, 400);
};

const handleJWTError = () =>
  new ErrorHandling("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new ErrorHandling("Token is expired.Please login again!!!", 401);

const sendErrorDev = (err: ErrorHandling, req: Request, res: Response) => {
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

const sendErrorProd = (err: ErrorHandling, req: Request, res: Response) => {
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

export async function GlobalErrorHandler(
  err: ErrorHandling,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "err";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
}
