import { NextFunction, Request, Response, Router } from "express";
import { getControllerPath } from "../decorators/controller.decorator";
import { combinePaths } from "../utils/common";
import { getRouteMetadata } from "../decorators/method.decorator";
import { unAuthorizedHandlerMiddleware } from "../middlewares/handle-unauthorized.middleware";

export const registerRoutes = (instance: any, prefix: string[] = []) => {
  const router = Router();
  const instanceMethods = Object.getOwnPropertyNames(
    Object.getPrototypeOf(instance)
  ).filter((method) => method !== "constructor");
  if (instanceMethods.length > 0) {
    const controllerPath = getControllerPath(instance.constructor);
    instanceMethods.map((methodName) => {
      const routeMetadata = getRouteMetadata(
        instance.constructor.prototype,
        methodName
      );
      const middlewares = routeMetadata.isProtected
        ? [unAuthorizedHandlerMiddleware, asyncHandler(instance, methodName)]
        : [asyncHandler(instance, methodName)];
      const path = combinePaths(...prefix, controllerPath, routeMetadata.path);
      const method = routeMetadata.method.toLowerCase();
      (router as any)[method](path, ...middlewares);
      console.log(`Đã đăng ký thành công [${routeMetadata.method}] ${path}`);
    });
  }

  return router;
};

const asyncHandler = (instance: any, handler: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await (instance[handler] as Function)(req, res, next);
      res.locals.data = result;
      next();
    } catch (error) {
      next(error);
    }
  };
};
