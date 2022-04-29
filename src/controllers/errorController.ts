import { Request, Response, NextFunction } from "express";

import { ErrorHandling } from "../utils/ErrorHandling";

const handleCastleErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ErrorHandling(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field values: ${value}, Please use another value!`;
  return new ErrorHandling(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);

  const message = `Invalid input data, ${errors.join(". ")}`;
  return new ErrorHandling(message, 400);
};

const handleJWTError = () =>
  new ErrorHandling("Invalid token, please login again!", 401);

const handleJWTExpiredError = () =>
  new ErrorHandling("Your token has expired! Please log in again", 401);

function sendErrorDev(err: ErrorHandling, req: Request, res: Response) {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error("ERROR", err);
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }
}

const sendErrorProd = (err: ErrorHandling, req: Request, res: Response) => {
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

export async function GlobalErrorHandler(
  err: ErrorHandling,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handleCastleErrorDB(error);
    if ((error.statusCode = 11000)) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
}
