import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { ZipCodeValidationPipe } from "@pipes/zipcode.pipe";
import { UserService } from "./user.service";
import UserAuthGuard from "@guards/user-auth.guard";
import { ValidateObjectIdPipe } from "@pipes/mongoid.pipe";
import CreateEventDto from "./dto/createevent.dto";

@UseGuards(UserAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("get-plumbers")
  async getPlumbers(@Query("zipcode", ZipCodeValidationPipe) zipCode: string, @Query("limit", ParseIntPipe) limit: number, @Query("skip", ParseIntPipe) skip: number) {
    return await this.userService.getPlumbers(zipCode, limit, skip);
  }

  @Post("create-event")
  @HttpCode(HttpStatus.OK)
  async createEvent(@Body() createEventDto: CreateEventDto) {
    const { preferredTime } = createEventDto;

    const day_difference = this.userService.getDayDifference(preferredTime);
    if (day_difference < 0) {
      throw new HttpException("Invalid date", HttpStatus.BAD_REQUEST);
    }

    const day = this.userService.extractDay(preferredTime);
    const [hours, minutes] = this.userService.extractTime(preferredTime);
    // check if the plumber is available
    console.log({
      hours,
      minutes,
    });
    const query = {
      plumberId: createEventDto.plumberId,
      weeklyAvailability: {
        $elemMatch: {
          day,
          "startTime.hours": {
            $lte: hours,
          },
          "endTime.hours": {
            $gte: hours,
          },
        },
      },
    };
    const appointment = await this.userService.getAppointmentDetails(query);

    if (!appointment) {
      throw new HttpException("Plumber is not available", HttpStatus.BAD_REQUEST);
    }

    return appointment;
  }

  @Get("get-plumber-details/:id")
  async getPlumberDetails(@Param("id", ValidateObjectIdPipe) plumberId: string) {
    const plumberData = await this.userService.findPlumberWithDetails({
      plumberId,
    });

    return plumberData;
  }
}
