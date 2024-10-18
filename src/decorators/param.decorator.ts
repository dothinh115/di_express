import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../middlewares/handle-error.middleware";

export const Param = (paramName: string): ParameterDecorator => {
  return createParamDecorator((req: Request) => req.params[paramName]);
};

export const Req = (): ParameterDecorator => {
  return createParamDecorator((req: Request) => req);
};

export const Res = (): ParameterDecorator => {
  return createParamDecorator((req: Request, res: Response) => res);
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
    return createParamDecorator(async (req: Request) => {
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

const createParamDecorator = (
  filter: (req: Request, res: Response, next: NextFunction) => any
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
