import { Router } from "express";
import { getControllerPath } from "../../decorators/controller.decorator";
import { combinePaths } from "../../utils/common";
import { getRouteMetadata } from "../../decorators/method.decorator";
import { DefineContextMiddleware } from "../middlewares/context.middleware";

export const registerRoutes = (instance: any, prefix: string[] = []) => {
  const router = Router();
  const instanceMethods = Object.getOwnPropertyNames(
    Object.getPrototypeOf(instance)
  ).filter((method) => method !== "constructor" && method !== "onInit");
  if (instanceMethods.length > 0) {
    const controllerPath = getControllerPath(instance.constructor);
    instanceMethods.map((methodName) => {
      const routeMetadata = getRouteMetadata(
        instance.constructor.prototype,
        methodName
      );
      const contextMiddleware = new DefineContextMiddleware(
        instance,
        methodName
      );
      const path = combinePaths(...prefix, controllerPath, routeMetadata.path);
      const method = routeMetadata.method.toLowerCase();
      (router as any)[method](
        path,
        contextMiddleware.use.bind(contextMiddleware)
      );
      console.log(`Đã đăng ký thành công [${routeMetadata.method}] ${path}`);
    });
  }

  return router;
};
