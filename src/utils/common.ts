import { Request, Response } from "express";
import { Method } from "../types/method.type";
import { ROUTES_METADATA_KEY } from "../decorators/method.decorator";

export function combinePaths(...paths: string[]) {
  return (
    "/" + paths.map((path) => path.replace(/^\/+|\/+$/g, "")).join("/")
  ).replace(/\/+$/, ""); // Loại bỏ dấu / ở cuối nếu có
}

export const createParamDecorator = (
  filter: (req: Request, res: Response) => any
) => {
  return (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    if (!propertyKey) return;
    target[propertyKey].paramData = [
      ...(target[propertyKey].paramData ?? []),
      {
        index: parameterIndex,
        filter,
      },
    ];
  };
};

export const createMethodDecorator = (path: string, method: Method) => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const routes =
      Reflect.getMetadata(ROUTES_METADATA_KEY, target.constructor) ?? [];
    routes.push({
      method,
      path,
      handler: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_METADATA_KEY, routes, target.constructor);

    const paramData = target[propertyKey].paramData ?? [];
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const [req, res] = args;
      paramData.map((param: any) => {
        args[param.index] = param.filter(req, res);
      });
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
};
