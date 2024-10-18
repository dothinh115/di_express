import { Controller } from "../decorators/controller.decorator";
import { Get, Post } from "../decorators/method.decorator";
import { UserService } from "../services/user.service";
import { Body, Param } from "../decorators/param.decorator";
import { BadRequestException } from "../middlewares/handle-error.middleware";
import { CreateUserDto } from "../dto/create-user.dto";

@Controller("/user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUser(@Param("id") id: string) {
    if (id !== "1") throw new BadRequestException("Phải = 1");
    return this.userService.getUser();
  }

  @Get(":id")
  getSingleUser(@Param("id") id: string) {
    return this.userService.getSingleUser(id);
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    console.log(body);
    return body;
  }
}
