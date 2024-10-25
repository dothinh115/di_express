import { Controller } from "../decorators/controller.decorator";
import { Post } from "../decorators/method.decorator";
import { Body } from "../decorators/param.decorator";
import { LoginDto } from "../dto/login.dto";
import { AuthService } from "../services/auth.service";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
