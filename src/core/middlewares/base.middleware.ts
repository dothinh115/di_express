import { NextFunction, Response } from "express";
import { Request } from "../../types/common.type";

export class AppMiddleware {
  use(req: Request, res: Response, next: NextFunction): any | Promise<any> {}
}

export class AppErrorMiddleware {
  use(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): any | Promise<any> {}
}
