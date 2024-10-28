import { Request, Response, NextFunction } from "express";
import { AppMiddleware } from "../core/middlewares/base.middleware";
import { Injectable } from "../decorators/injectable.decorator";

@Injectable()
export class Handle404Middleware implements AppMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.status(404).send({
      statusCode: 404,
      message: "Not Found",
    });
  }
}
