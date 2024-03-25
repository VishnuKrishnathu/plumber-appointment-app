import { IsNotEmpty, IsString } from "class-validator";

export default class AddAddressDto {
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @IsString()
  @IsNotEmpty()
  addressLine2: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  addressTag: string;
}
