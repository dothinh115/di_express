import { NextFunction, Request, Response } from "express";

export const reponseFormatterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = res.locals.data;
  if (data) {
    res.send({
      message: "Thành công!",
      data,
      statusCode: res.statusCode,
    });
  } else next();
};
