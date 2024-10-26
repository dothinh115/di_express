import { Response, NextFunction } from "express";
import { Request } from "../../types/common.type";
import { AppMiddleware } from "./base.middleware";

export class ExcuteHandlerMiddleware implements AppMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const instance = req.context.instance;
    const handlerName = req.context.handlerName;
    try {
      const result = await instance[handlerName](req, res, next);
      res.locals.data = result;
      next();
    } catch (error) {
      next(error);
    }
  }
}
