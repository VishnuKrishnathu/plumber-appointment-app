import { Type } from "class-transformer";
import { IsDateString, IsMongoId, IsNotEmpty, IsString, ValidateNested } from "class-validator";

class AddAddressDto {
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
}

export default class CreateEventDto {
  @ValidateNested()
  @Type(() => AddAddressDto)
  address: AddAddressDto;

  @IsString()
  @IsMongoId()
  serviceId: string;

  @IsMongoId()
  plumberId: string;

  @IsDateString()
  preferredTime: string;
}
