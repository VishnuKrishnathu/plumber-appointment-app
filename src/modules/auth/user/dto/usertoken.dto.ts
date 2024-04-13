import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export default class UserTokenDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsMongoId()
  _id: string;

  @IsNumber()
  expiry: number;

  @IsNotEmpty()
  @IsString()
  access_token: string;

  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
