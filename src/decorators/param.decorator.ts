import { Request, Response } from "express";

export const Param = (paramName: string): ParameterDecorator => {
  return createParamDecorator((req: Request) => req.params[paramName]);
};

export const Req = (): ParameterDecorator => {
  return createParamDecorator((req: Request) => req);
};

export const Res = (): ParameterDecorator => {
  return createParamDecorator((req: Request, res: Response) => res);
};

const createParamDecorator = (filter: (req: Request, res: Response) => any) => {
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
