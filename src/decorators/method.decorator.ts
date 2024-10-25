import { TRouteData } from "../types/common.type";
import { Method } from "../types/method.type";
import {
  IS_REPLACED_METADATA_KEY,
  METHOD_PARAM_DATA_METADATA_KEY,
  ROUTE_METADATA_KEY,
} from "../utils/constants";

export const Get = (path: string = "") => {
  return createMethodDecorator({ path, method: Method.GET });
};

export const Post = (path: string = "") => {
  return createMethodDecorator({ path, method: Method.POST });
};

export const Patch = (path: string = "") => {
  return createMethodDecorator({ path, method: Method.PATCH });
};

export const Delete = (path: string = "") => {
  return createMethodDecorator({ path, method: Method.DELETE });
};

export const Protected = () => {
  return createMethodDecorator({ isProtected: true });
};

const createMethodDecorator = ({
  path,
  method,
  isProtected,
}: {
  path?: string;
  method?: Method;
  isProtected?: boolean;
}) => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const currentMethodMetadata =
      Reflect.getMetadata(ROUTE_METADATA_KEY, target, propertyKey) ?? {};
    const updatedMethodMetadata = {
      ...currentMethodMetadata,
      method: method ? method : currentMethodMetadata.method,
      path: path ? path : currentMethodMetadata.path ?? "",
      isProtected: isProtected
        ? isProtected
        : currentMethodMetadata.isProtected ?? false,
    };
    Reflect.defineMetadata(
      ROUTE_METADATA_KEY,
      updatedMethodMetadata,
      target,
      propertyKey
    );

    //Param Decorator
    const paramData =
      Reflect.getMetadata(
        METHOD_PARAM_DATA_METADATA_KEY,
        target,
        propertyKey
      ) ?? [];

    const isReplaced = Reflect.getMetadata(
      IS_REPLACED_METADATA_KEY,
      target,
      propertyKey
    );
    if (isReplaced) {
      return descriptor;
    }

    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args;
      for (const param of paramData) {
        const newParam = await param.filter(req, res, next);
        args[param.index] = newParam;
      }
      return await originalMethod.apply(this, args);
    };
    Reflect.defineMetadata(IS_REPLACED_METADATA_KEY, true, target, propertyKey);
    return descriptor;
  };
};

export const getRouteMetadata = (
  prototype: any,
  propertyKey: string
): TRouteData => {
  return Reflect.getMetadata(ROUTE_METADATA_KEY, prototype, propertyKey) ?? {};
};
