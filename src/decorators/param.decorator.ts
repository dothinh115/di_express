import { Request, Response } from "express";
import { createParamDecorator } from "../utils/common";

export const Param = (paramName: string): ParameterDecorator => {
  return createParamDecorator((req: Request) => req.params[paramName]);
};

export const Req = (): ParameterDecorator => {
  return createParamDecorator((req: Request) => req);
};

export const Res = (): ParameterDecorator => {
  return createParamDecorator((req: Request, res: Response) => res);
};
