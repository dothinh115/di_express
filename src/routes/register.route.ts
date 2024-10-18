import { NextFunction, Request, Response, Router } from "express";
import { getRoutes } from "../decorators/method.decorator";
import { getControllerPath } from "../decorators/controller.decorator";
import { combinePaths } from "../utils/common";
import { TRouteData } from "../types/common.type";

export const registerRoutes = (instance: any, prefix: string[] = []) => {
  const router = Router();
  const routes = getRoutes(instance.constructor);
  if (routes.length > 0) {
    const controllerPath = getControllerPath(instance.constructor);
    routes.map((route) => {
      const path = combinePaths(...prefix, controllerPath, route.path);
      const method = route.method.toLowerCase();
      (router as any)[method](path, asyncHandler(instance, route));
      console.log(`Đã đăng ký thành công [${route.method}] ${path}`);
    });
  }
  return router;
};

const asyncHandler = (instance: any, route: TRouteData) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await (instance[route.handler] as Function)(
        req,
        res,
        next
      );
      res.locals.data = result;
      next();
    } catch (error) {
      next(error);
    }
  };
};
