import { NextFunction, Request, Response } from "express";
import { AppMiddleware } from "../core/middlewares/base.middleware";

export class ResponseFormatterMiddleware implements AppMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const data = res.locals.data;
    if (data) {
      res.send({
        message: "Thành công!",
        data,
        statusCode: res.statusCode,
      });
    } else next();
  }
}
