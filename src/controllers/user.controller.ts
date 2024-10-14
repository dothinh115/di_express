import { Controller } from "../decorators/controller.decorator";
import { UserService } from "../services/user.service";

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  getUser() {
    return this.userService.getUser();
  }
}
