import { TRouteData } from "../types/common.type";
import { Method } from "../types/method.type";
import {
  IS_REPLACED_METADATA_KEY,
  METHOD_PARAM_DATA_METADATA_KEY,
  ROUTE_METADATA_KEY,
} from "../utils/constants";

export const Get = (path: string = ""): MethodDecorator => {
  return createMethodDecorator({ path, method: Method.GET });
};

export const Post = (path: string = ""): MethodDecorator => {
  return createMethodDecorator({ path, method: Method.POST });
};

export const Patch = (path: string = ""): MethodDecorator => {
  return createMethodDecorator({ path, method: Method.PATCH });
};

export const Delete = (path: string = ""): MethodDecorator => {
  return createMethodDecorator({ path, method: Method.DELETE });
};

export const Protected = (): MethodDecorator & ClassDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol | undefined,
    descriptor?: PropertyDescriptor
  ) => {
    if (descriptor) {
      return createMethodDecorator({ isProtected: true })(
        target,
        propertyKey,
        descriptor
      ) as any;
    } else {
      const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
        (method) => method !== "constructor"
      );
      if (methodNames.length > 0) {
        methodNames.forEach((methodName) => {
          const methodDescriptor = Object.getOwnPropertyDescriptor(
            target.prototype,
            methodName
          );
          if (!methodDescriptor) return;
          createMethodDecorator({ isProtected: true })(
            target.prototype,
            methodName,
            methodDescriptor
          );
        });
      }
    }
  };
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
    propertyKey: string | symbol | undefined,
    descriptor: PropertyDescriptor
  ) => {
    if (!propertyKey) return;
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
