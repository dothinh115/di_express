import { Method } from "./method.type";
import { Request as ExpressRequest } from "express";

export type TRouteData = {
  method: Method;
  path: string;
  isProtected: boolean;
};

export type Request = ExpressRequest & {
  context: {
    instance: any;
    handlerName: string;
  };
};
