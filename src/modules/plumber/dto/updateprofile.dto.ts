import { IsString, Matches } from "class-validator";

export default class UpdateProfileDto {
  @IsString()
  @Matches(/\d{10}$/)
  mobileNumber: string;
}
