import { PARAM_METADATA_KEY } from "../utils/contants";

export const Injectable = (): ClassDecorator => {
  return (target: any) => {
    const modelData: { index: number; replaceWith: any }[] =
      Reflect.getMetadata(PARAM_METADATA_KEY, target) ?? [];

    const originalConstructor = target;
    const newConstructor = function (...args: any[]) {
      modelData.map((param) => {
        args[param.index] = param.replaceWith;
      });
      return new originalConstructor(...args);
    };
    newConstructor.prototype = originalConstructor.prototype;
    Object.defineProperty(newConstructor, "name", {
      value: originalConstructor.name,
    });
    const paramTypes = Reflect.getMetadata(
      "design:paramtypes",
      originalConstructor
    );
    Reflect.defineMetadata("design:paramtypes", paramTypes, newConstructor);
    return newConstructor as typeof originalConstructor;
  };
};
