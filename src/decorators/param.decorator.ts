import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../middlewares/handle-error.middleware";
import {
  CONSTRUCTOR_PARAM_METADATA_KEY,
  METHOD_PARAM_DATA_METADATA_KEY,
} from "../utils/constants";

export const Param = (paramName: string): ParameterDecorator => {
  return createMethodParamDecorator((req: Request) => req.params[paramName]);
};

export const Req = (): ParameterDecorator => {
  return createMethodParamDecorator((req: Request) => req);
};

export const Res = (): ParameterDecorator => {
  return createMethodParamDecorator((req: Request, res: Response) => res);
};

export const User = (): ParameterDecorator => {
  return createMethodParamDecorator((req: Request) => req.user);
};

export const Body = (): ParameterDecorator => {
  return (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    if (!propertyKey) return;
    const paramTypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey
    );
    const paramType = paramTypes[parameterIndex];

    return createMethodParamDecorator(async (req: Request) => {
      let body = req.body;

      if (
        typeof paramType === "function" &&
        paramType !== Object &&
        paramType !== Array &&
        paramType.name !== "Object"
      ) {
        body = plainToInstance(paramType, body, {
          excludeExtraneousValues: true,
        });
        const errors = await validate(body);
        const errorMessages: string[] = [];
        if (errors.length > 0) {
          errors.forEach((error) => {
            if (!error.constraints) return;
            Object.values(error.constraints).forEach((message) =>
              errorMessages.push(message)
            );
          });
          throw new BadRequestException(errorMessages);
        }
      }

      return body;
    })(target, propertyKey, parameterIndex);
  };
};

const createMethodParamDecorator = (
  filter: (req: Request, res: Response, next: NextFunction) => any
) => {
  return (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    if (!propertyKey) return;
    const paramData =
      Reflect.getMetadata(
        METHOD_PARAM_DATA_METADATA_KEY,
        target,
        propertyKey
      ) ?? [];
    paramData.push({
      index: parameterIndex,
      filter,
    });
    Reflect.defineMetadata(
      METHOD_PARAM_DATA_METADATA_KEY,
      paramData,
      target,
      propertyKey
    );
  };
};

export const createConstructorParamDecorator = (replaceWith: any) => {
  return (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    const modelData =
      Reflect.getMetadata(CONSTRUCTOR_PARAM_METADATA_KEY, target) ?? [];
    modelData.push({
      index: parameterIndex,
      replaceWith,
    });
    Reflect.defineMetadata(CONSTRUCTOR_PARAM_METADATA_KEY, modelData, target);
  };
};
