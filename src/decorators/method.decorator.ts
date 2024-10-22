import { TRouteData } from "../types/common.type";
import { Method } from "../types/method.type";
import {
  PARAM_DATA_METADATA_KEY,
  ROUTES_METADATA_KEY,
} from "../utils/contants";

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

    // const paramData = target[propertyKey].paramData ?? [];
    const paramData =
      Reflect.getMetadata(PARAM_DATA_METADATA_KEY, target, propertyKey) ?? [];

    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args;
      for (const param of paramData) {
        const newParam = await param.filter(req, res, next);
        args[param.index] = newParam;
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
};

export const getRoutes = (target: any): TRouteData[] => {
  return Reflect.getMetadata(ROUTES_METADATA_KEY, target) ?? [];
};
