import { IsArray, IsMongoId, IsNumber, Min, Matches, IsString } from "class-validator";

export default class AddServiceDto {
  @IsMongoId()
  serviceId: string;

  @IsNumber()
  @Min(0, { message: "Price must be greater than 0" })
  price: number;

  @IsArray()
  @IsString({ each: true })
  @Matches(/^\d{5}$/, { message: "Invalid ZIP Code", each: true })
  zipCodes: string[];
}
