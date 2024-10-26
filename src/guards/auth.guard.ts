import { NextFunction, Response } from "express";
import { UnAuthorizedException } from "../middlewares/handle-error.middleware";
import { AppMiddleware } from "../core/middlewares/base.middleware";
import { Request } from "../types/common.type";
import {
  IS_PROTECTED_METADATA_KEY,
  IS_PUBLIC_METADAT_KEY,
} from "../utils/constants";
import { passport } from "../core/passport/jwt.passport";

export class AuthGuard implements AppMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const instance = req.context.instance;
    const handlerName = req.context.handlerName;
    const isPublic = Reflect.getMetadata(
      IS_PUBLIC_METADAT_KEY,
      instance.constructor.prototype,
      handlerName
    );
    if (isPublic) {
      return next();
    }
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: any, info: any) => {
        if (info) {
          next(new UnAuthorizedException());
        } else {
          req.user = user;
          next();
        }
      }
    )(req, res, next);
  }
}
