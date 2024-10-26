import { Response, NextFunction } from "express";
import { AppMiddleware } from "./base.middleware";
import { Request } from "../../types/common.type";

export class DefineContextMiddleware implements AppMiddleware {
  instance: any;
  handlerName: string;
  constructor(instance: any, handlerName: string) {
    this.instance = instance;
    this.handlerName = handlerName;
  }
  use(req: Request, res: Response, next: NextFunction) {
    req.context = {
      instance: this.instance,
      handlerName: this.handlerName,
    };
    next();
  }
}
