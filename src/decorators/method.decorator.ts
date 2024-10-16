import { TRouteData } from "../types/common.type";
import { Method } from "../types/method.type";

const ROUTES_METADATA_KEY = Symbol("routes");

export const Get = (path: string = "") => {
  return createMethodDecorator(path, Method.GET);
};

export const Post = (path: string = "") => {
  return createMethodDecorator(path, Method.POST);
};

export const Patch = (path: string = "") => {
  return createMethodDecorator(path, Method.PATCH);
};

export const Delete = (path: string = "") => {
  return createMethodDecorator(path, Method.DELETE);
};

const createMethodDecorator = (path: string, method: Method) => {
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

export const getRoutes = (target: any): TRouteData[] => {
  return Reflect.getMetadata(ROUTES_METADATA_KEY, target) ?? [];
};
