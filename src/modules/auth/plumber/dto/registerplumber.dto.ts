import { IsString, IsNotEmpty } from "class-validator";

export class RegisterPlumberDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
