import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  age!: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  name!: string;
}
