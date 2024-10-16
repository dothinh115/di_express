import { Model } from "mongoose";
import { INJECT_MODEL_METADATA_KEY } from "../mongoose/decorators/inject-model.decorator";

export const Injectable = (): ClassDecorator => {
  return (target: any) => {
    const modelData: { index: number; model: Model<any> }[] =
      Reflect.getMetadata(INJECT_MODEL_METADATA_KEY, target);

    const originalConstructor = target;
    const newConstructor = function (...args: any[]) {
      modelData.map((param) => {
        args[param.index] = param.model;
      });
      return new originalConstructor(...args);
    };
    return newConstructor as typeof originalConstructor;
  };
};
