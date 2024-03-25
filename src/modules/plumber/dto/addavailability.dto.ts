import { Type } from "class-transformer";
import { Min, ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";

enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

class Time {
  @IsNumber()
  hours: number;

  @IsNumber()
  minutes: number;
}

class WeeklyAvailabilityDto {
  @IsString()
  @IsEnum(DayOfWeek)
  day: keyof typeof DayOfWeek;

  @ValidateNested()
  @Type(() => Time)
  startTime: Time;

  @ValidateNested()
  @Type(() => Time)
  endTime: Time;
}

export default class AddAvailabilityDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => WeeklyAvailabilityDto)
  weeklyAvailability: WeeklyAvailabilityDto[];

  @IsNumber()
  @Min(1)
  maxAppointmentsPerDay: number;
}
