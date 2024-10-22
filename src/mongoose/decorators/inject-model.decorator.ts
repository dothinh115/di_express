import { Model } from "mongoose";
import { PARAM_METADATA_KEY } from "../../utils/contants";

export const InjectModel = (model: Model<any>) => {
  return (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    const modelData = Reflect.getMetadata(PARAM_METADATA_KEY, target) ?? [];
    modelData.push({
      index: parameterIndex,
      replaceWith: model,
    });
    Reflect.defineMetadata(PARAM_METADATA_KEY, modelData, target);
  };
};
