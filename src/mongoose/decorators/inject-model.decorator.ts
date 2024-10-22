import { Model } from "mongoose";
import { createConstructorParamDecorator } from "../../decorators/param.decorator";

export const InjectModel = (model: Model<any>) => {
  return createConstructorParamDecorator(model);
};
