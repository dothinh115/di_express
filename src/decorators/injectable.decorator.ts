import { Model } from "mongoose";
import { INJECT_MODEL_METADATA_KEY } from "../mongoose/decorators/inject-model.decorator";

export const Injectable = (): ClassDecorator => {
  return (target: any) => {
    const modelData: { index: number; model: Model<any> }[] =
      Reflect.getMetadata(INJECT_MODEL_METADATA_KEY, target) ?? [];

    const originalConstructor = target;
    const newConstructor = function (...args: any[]) {
      modelData.map((param) => {
        args[param.index] = param.model;
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
