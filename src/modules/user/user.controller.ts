import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ZipCodeValidationPipe } from "@pipes/zipcode.pipe";
import { UserService } from "./user.service";
import UserAuthGuard from "@guards/user-auth.guard";
import { ValidateObjectIdPipe } from "@pipes/mongoid.pipe";
import CreateEventDto from "./dto/createevent.dto";
import { AuthorizedRequest } from "@globalTypes/auth";
import { WeeklyAvailability } from "@models/appointment.schema";

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
  async createEvent(@Body() createEventDto: CreateEventDto, @Req() request: AuthorizedRequest) {
    const { preferredTime } = createEventDto;

    const day_difference = this.userService.getDayDifference(preferredTime);
    if (day_difference < 0) {
      throw new HttpException("Invalid date", HttpStatus.BAD_REQUEST);
    }

    const day = this.userService.extractDay(preferredTime) as keyof WeeklyAvailability;
    const [hours, minutes] = this.userService.extractTime(preferredTime);
    const hours_in_seconds = hours * 60 * 60 + minutes * 60;
    const minutes_in_seconds = minutes * 60;
    // check if the plumber is available
    const query = {
      userId: createEventDto.plumberId,
      weeklyAvailability: {
        [day]: {
          $elemMatch: {
            startTime: { $lte: hours_in_seconds + minutes_in_seconds },
            endTime: { $gte: hours_in_seconds + minutes_in_seconds },
          },
        },
      },
    };

    const appointment = await this.userService.getAppointmentDetails(query);

    if (!appointment) {
      throw new HttpException("Plumber is not available", HttpStatus.BAD_REQUEST);
    }

    const day_availability = appointment.weeklyAvailability[day];
    if (!day_availability) {
      throw new HttpException("Plumber is not available", HttpStatus.BAD_REQUEST);
    }

    const availability_time = day_availability.filter(val => val.startTime <= hours_in_seconds + minutes_in_seconds && val.endTime >= hours_in_seconds + minutes_in_seconds)[0];

    if (!availability_time) {
      throw new HttpException("Plumber is not available", HttpStatus.BAD_REQUEST);
    }

    try {
      this.userService.eliminateBufferTime(
        {
          appointmentDuration: appointment.appointmentDuration,
          bufferTime: appointment.bufferTime,
          endTime: availability_time.endTime,
          startTime: availability_time.startTime,
        },
        hours_in_seconds + minutes_in_seconds,
      );
    } catch (err) {
      throw new HttpException("Plumber is not available", HttpStatus.BAD_REQUEST);
    }

    const plumber = await this.userService.findPlumber(
      {
        plumberId: createEventDto.plumberId,
      },
      ["services"],
    );

    if (!plumber) {
      throw new HttpException("Plumber not found", HttpStatus.BAD_REQUEST);
    }

    const service = plumber.services.filter(val => val.serviceId.toString() === createEventDto.serviceId)[0];

    if (!service) {
      throw new HttpException("Service not found", HttpStatus.BAD_REQUEST);
    }

    const events_count = await this.userService.findEventsCount({
      plumberId: createEventDto.plumberId,
      approved: true,
    });

    if (appointment.maxAppointmentsPerDay && events_count >= appointment.maxAppointmentsPerDay) {
      throw new HttpException("Plumber is not available", HttpStatus.BAD_REQUEST);
    }

    const event = await this.userService.createEvent({
      ...createEventDto,
      userId: request.user._id,
      price: service.price,
    });

    return {
      message: "Event created successfully",
      data: event,
    };
  }

  @Get("get-plumber-details/:id")
  async getPlumberDetails(@Param("id", ValidateObjectIdPipe) plumberId: string) {
    const plumberData = await this.userService.findPlumberWithDetails({
      plumberId,
    });

    return plumberData;
  }
}
