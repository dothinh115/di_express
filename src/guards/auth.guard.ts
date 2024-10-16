import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../middlewares/handle-error.middleware";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).user) throw new UnAuthorizedException();
  next();
};
