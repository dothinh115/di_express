import { Controller } from "../decorators/controller.decorator";
import { Get, Protected } from "../decorators/method.decorator";
import { User } from "../decorators/param.decorator";
import { MeService } from "../services/me.service";

@Controller("/me")
export class MeController {
  constructor(private meService: MeService) {}

  @Get()
  @Protected()
  find(@User() user: any) {
    return this.meService.find(user);
  }
}
