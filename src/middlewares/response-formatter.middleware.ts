import { NextFunction, Request, Response } from "express";
import { AppMiddleware } from "../core/middlewares/base.middleware";
import { InjectModel } from "../mongoose/decorators/inject-model.decorator";
import { User } from "../mongoose/models/user.model";
import { Injectable } from "../decorators/injectable.decorator";

@Injectable()
export class ResponseFormatterMiddleware implements AppMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
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
