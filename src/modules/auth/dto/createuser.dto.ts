import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  profile_pic?: string;

  @IsNotEmpty()
  @IsString()
  access_token: string;

  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
