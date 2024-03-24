import { IsNotEmpty, IsString } from "class-validator";

export default class GoogleLoginDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
