import { NextFunction, Request, Response } from "express";
import { AppErrorMiddleware } from "../core/middlewares/base.middleware";

export class HandleErrorMiddleware implements AppErrorMiddleware {
  use(error: any, req: Request, res: Response, next: NextFunction) {
    let message = "Internal Error";
    let statusCode = 500;

    if (
      error instanceof BadRequestException ||
      error instanceof UnAuthorizedException ||
      error instanceof ForbiddenException
    ) {
      message = error.message;
      statusCode = error.statusCode;
    }
    console.log(error);
    res.status(statusCode).send({
      statusCode,
      message,
    });
  }
}

export class BadRequestException extends Error {
  statusCode: number;
  message: any;
  constructor(message: any) {
    super(message);
    if (Array.isArray(message)) {
      this.message = message;
    }
    this.statusCode = 400;
  }
}

export class UnAuthorizedException extends Error {
  statusCode: number;
  constructor(message: string = "Unorthorized") {
    super(message);
    this.statusCode = 401;
  }
}

export class ForbiddenException extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}
