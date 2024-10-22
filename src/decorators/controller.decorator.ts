import { CONTROLLER_PATH_METADATA_KEY } from "../utils/contants";

export const Controller = (path: string = ""): ClassDecorator => {
  return (target) => {
    if (path) {
      Reflect.defineMetadata(CONTROLLER_PATH_METADATA_KEY, path, target);
    }
  };
};

export const getControllerPath = (target: any) => {
  return Reflect.getMetadata(CONTROLLER_PATH_METADATA_KEY, target);
};
