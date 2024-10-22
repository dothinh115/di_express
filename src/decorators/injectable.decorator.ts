import { CONSTRUCTOR_PARAM_METADATA_KEY } from "../utils/constants";

export const Injectable = (): ClassDecorator => {
  return (target: any) => {
    const modelData: { index: number; replaceWith: any }[] =
      Reflect.getMetadata(CONSTRUCTOR_PARAM_METADATA_KEY, target) ?? [];
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
    const metadataKey = Reflect.getMetadataKeys(originalConstructor);
    metadataKey.forEach((key) => {
      const originalMetadataValue = Reflect.getMetadata(
        key,
        originalConstructor
      );
      Reflect.defineMetadata(key, originalMetadataValue, newConstructor);
    });
    return newConstructor as typeof originalConstructor;
  };
};
