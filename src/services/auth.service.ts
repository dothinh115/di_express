import { Injectable } from "../decorators/injectable.decorator";
import { LoginDto } from "../dto/login.dto";
import { BadRequestException } from "../middlewares/handle-error.middleware";
import jwt from "jsonwebtoken";

const users = [
  {
    id: 1,
    email: "test@gmail.com",
    password: "test",
  },
];

@Injectable()
export class AuthService {
  login(body: LoginDto) {
    const user = users.find((user) => user.email === body.email);
    if (!user) {
      throw new BadRequestException("Email hoặc password không đúng!");
    }
    if (user.password !== body.password) {
      throw new BadRequestException("Email hoặc password không đúng!");
    }
    const payload = user;
    if (!process.env.JWT_SCRET_KEY) {
      throw new Error("Lỗi không xác định!");
    }
    const token = jwt.sign(payload, process.env.JWT_SCRET_KEY, {
      expiresIn: "15m",
    });
    return { access_token: token };
  }
}
