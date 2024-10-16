import { Injectable } from "../decorators/injectable.decorator";
import { InjectModel } from "../mongoose/decorators/inject-model.decorator";
import { User } from "../mongoose/models/user.model";

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}
  async getUser() {
    return await this.userModel.find();
  }

  async getSingleUser(id: string) {
    return await this.userModel.findById(id);
  }
}
