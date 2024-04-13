import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export default class ApproveEventDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNotEmpty()
  @IsString()
  timeZone: string;
}
