import { Constructor } from "../types/constructor.type";

class Container {
  services = new Map<string, Constructor<any>>();
  registered = new Map<string, any>();

  register(constructor: Constructor<any>): void {
    this.services.set(constructor.name, constructor);
  }

  get<T>(constructor: Constructor<T>): T {
    const service = this.services.get(constructor.name);

    if (!service) {
      throw new Error("Lỗi!");
    }

    if (this.registered.has(service.name)) {
      return this.registered.get(service.name);
    }

    const paramTypes = Reflect.getMetadata("design:paramtypes", service) ?? [];
    const dependencies = paramTypes.map((param: Constructor<any>) => {
      if (
        typeof param === "function" &&
        param.prototype &&
        param.name !== "Object"
      ) {
        this.register(param);
        return this.get(param);
      }
    });

    const instance = new service(...dependencies);

    this.registered.set(service.name, instance);

    return instance;
  }
}

export { Container };
