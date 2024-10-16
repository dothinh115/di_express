import { Model } from "mongoose";

export const INJECT_MODEL_METADATA_KEY = Symbol("inject:model");

export const InjectModel = (model: Model<any>) => {
  return (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    const modelData =
      Reflect.getMetadata(INJECT_MODEL_METADATA_KEY, target) ?? [];
    modelData.push({
      index: parameterIndex,
      model,
    });
    Reflect.defineMetadata(INJECT_MODEL_METADATA_KEY, modelData, target);
  };
};
