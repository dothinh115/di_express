import { Injectable } from "../decorators/injectable.decorator";

@Injectable()
export class MeService {
  find(user: any) {
    return user;
  }
}
