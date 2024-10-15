import { Method } from "../types/method.type";
import { createMethodDecorator } from "../utils/common";

export const ROUTES_METADATA_KEY = Symbol("routes");

export const Get = (path: string = "") => {
  return createMethodDecorator(path, Method.GET);
};

export const Post = (path: string = "") => {
  return createMethodDecorator(path, Method.POST);
};

export const getRoutes = (target: any): any[] => {
  return Reflect.getMetadata(ROUTES_METADATA_KEY, target) ?? [];
};
