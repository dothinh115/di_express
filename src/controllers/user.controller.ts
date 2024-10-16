import { Request, Response } from "express";
import { Controller } from "../decorators/controller.decorator";
import { Get, Post } from "../decorators/method.decorator";
import { UserService } from "../services/user.service";
import { Param } from "../decorators/param.decorator";
import { BadRequestException } from "../middlewares/handle-error.middleware";

@Controller("/user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get(":id")
  getUser(@Param("id") id: string) {
    if (id !== "1") throw new BadRequestException("Phải = 1");
    return this.userService.getUser();
  }

  @Post()
  postUser() {
    return "xyz";
  }
}
