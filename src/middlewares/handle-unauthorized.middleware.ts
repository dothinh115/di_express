import { NextFunction, Request, Response } from "express";
import { passport } from "../passport/jwt.passport";
import { UnAuthorizedException } from "./handle-error.middleware";

export const unAuthorizedHandlerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};
