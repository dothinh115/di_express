import { Constructor } from "../types/constructor.type";

class Container {
  services = new Map<string, Constructor<any>>();
  instances = new Map<string, any>();
  progress = new Map<string, boolean>();

  register(constructor: Constructor<any>): void {
    this.services.set(constructor.name, constructor);
  }

  get<T>(constructor: Constructor<T>): T {
    const service = this.services.get(constructor.name);

    if (!service) {
      throw new Error("Không có service này tồn tại!");
    }

    //nếu đã khởi tạo thì trả ngay
    if (this.instances.has(service.name)) {
      return this.instances.get(service.name);
    }

    //nếu chưa khởi tạo, nhưng đang được khởi tạo thì quăng lỗi
    if (this.progress.has(service.name)) {
      throw new Error(`${service.name} đang được khởi tạo trùng lặp.`);
    }

    //nếu vượt qua hết thì set vào progress và tiến hành đăng ký
    this.progress.set(service.name, true);

    const paramTypes = Reflect.getMetadata("design:paramtypes", service) ?? [];
    const dependencies = paramTypes.map((param: Constructor<any>) => {
      this.register(param);
      return this.get(param);
    });

    const instance = new service(...dependencies);

    //đăng ký xong thì set vào instances và xoá trong progress
    this.instances.set(service.name, instance);
    this.progress.delete(service.name);

    //trả lại instance đã lưu
    return instance;
  }
}

export { Container };
