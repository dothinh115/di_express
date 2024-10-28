import { Controller } from "../decorators/controller.decorator";
import { Get, IsPublic, Post } from "../decorators/method.decorator";
import { UserService } from "../services/user.service";
import { Body, Param } from "../decorators/param.decorator";
import { CreateUserDto } from "../dto/create-user.dto";

// @IsPublic()
@Controller("/user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUser() {
    return this.userService.getUser();
  }

  @Get(":id")
  getSingleUser(@Param("id") id: string) {
    return this.userService.getSingleUser(id);
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return body;
  }
}
