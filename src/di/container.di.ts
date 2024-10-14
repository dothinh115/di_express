import { Constructor } from "../types/constructor.type";

class Container {
  services = new Map<string, Constructor<any>>();

  register(constructor: Constructor<any>) {
    this.services.set(constructor.name, constructor);
  }

  get<T>(constructor: Constructor<T>): T {
    const service = this.services.get(constructor.name);
    if (!service) {
      throw new Error("Lỗi!");
    }
    const paramTypes = Reflect.getMetadata("design:paramtypes", service) ?? [];
    const dependencies = paramTypes.map((param: Constructor<any>) => {
      this.register(param);
      return this.get(param);
    });
    return new service(...dependencies);
  }
}

export { Container };
