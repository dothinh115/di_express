const CONTROLLER_METADATA_KEY = Symbol("controllers");

export const Controller = (): ClassDecorator => {
  return (target) => {
    const controllers =
      Reflect.getMetadata(CONTROLLER_METADATA_KEY, Object) ?? [];
    controllers.push(target);
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, controllers, Object);
  };
};

export const getControllers = (): any[] => {
  return Reflect.getMetadata(CONTROLLER_METADATA_KEY, Object) ?? [];
};
