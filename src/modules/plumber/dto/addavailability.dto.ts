import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsArray, ArrayMinSize, ValidateNested, Min, Max, IsDateString } from "class-validator";
import { Type } from "class-transformer";

class DailyAvailabilityDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(86400)
  startTime: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(86400)
  endTime: number;
}

class WeeklyAvailabilityDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DailyAvailabilityDto)
  monday?: DailyAvailabilityDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DailyAvailabilityDto)
  tuesday?: DailyAvailabilityDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DailyAvailabilityDto)
  wednesday?: DailyAvailabilityDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DailyAvailabilityDto)
  thursday?: DailyAvailabilityDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DailyAvailabilityDto)
  friday?: DailyAvailabilityDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DailyAvailabilityDto)
  saturday?: DailyAvailabilityDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DailyAvailabilityDto)
  sunday?: DailyAvailabilityDto[];
}

export default class AddAvailabilityDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WeeklyAvailabilityDto)
  weeklyAvailability: WeeklyAvailabilityDto;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsDate({ each: true })
  excludedDates?: Date[];

  @IsNumber()
  @Min(0)
  @Max(86400)
  appointmentDuration: number; // in seconds

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  bufferTime: number;

  @IsNumber()
  @Min(1)
  maxAppointmentsPerDay: number;
}
