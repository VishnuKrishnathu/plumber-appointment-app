import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseBoolPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import AddServiceDto from "./dto/addservice.dto";
import { PlumberService } from "./plumber.service";
import { AuthorizedRequest } from "@globalTypes/auth";
import PlumberAuthGuard from "@guards/plumber-auth.guard";
import UpdateProfileDto from "./dto/updateprofile.dto";
import AddAvailabilityDto from "./dto/addavailability.dto";
import ApproveEventDto from "./dto/approveevent.dto";
import { Types } from "mongoose";

@UseGuards(PlumberAuthGuard)
@Controller("plumber")
export class PlumberController {
  constructor(private readonly plumberService: PlumberService) {}

  @Get("complete-order/:orderId")
  async completeOrder(@Param("orderId") orderId: string, @Query("set", ParseBoolPipe) set: boolean) {
    await this.plumberService.completeOrder(orderId, set);

    return {
      message: "Order completed successfully",
    };
  }

  @Post("approve-event/:eventId")
  async approveEvent(@Param("eventId") eventId: string, @Req() request: AuthorizedRequest, @Body() completeOrderDto: ApproveEventDto) {
    let event = await this.plumberService.findEvent({ _id: new Types.ObjectId(eventId) });

    if (!event) {
      throw new HttpException("Event Not Found", HttpStatus.NOT_FOUND);
    }

    event.approved = true;

    event = await event.save();

    //checking if the access token has expired
    if (new Date().getTime() - request.user.expiry <= 20) {
      const { access_token, expires_in } = await this.plumberService.refreshToken(request.user.refresh_token);
      request.user = {
        ...request.user,
        access_token,
        expiry: new Date().getTime() + expires_in,
      };
      await this.plumberService.findOneAndUpdatePlumber(
        {
          _id: request.user._id,
        },
        {
          $set: {
            access_token,
            expiry_time: new Date().getTime() + expires_in,
          },
        },
      );
    }

    const event_schema = {
      summary: "Plumbing work at XYZ",
      description: "This is a test event created using Google Calendar API",
      start: {
        dateTime: `${new Date(completeOrderDto.startTime).toISOString()}`, // Date and time of the event start
        timeZone: completeOrderDto.timeZone,
      },
      end: {
        dateTime: `${new Date(completeOrderDto.endTime).toISOString()}`, // Date and time of the event end
        timeZone: completeOrderDto.timeZone,
      },
    };

    await this.plumberService.createEvent(event_schema, request.user.access_token, request.user.refresh_token);

    return {
      message: "Event approved successfuly",
    };
  }

  @Post("update-profile")
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Req() request: AuthorizedRequest) {
    const profile = await this.plumberService.updatePlumberProfile(
      {
        plumberId: request.user._id,
      },
      {
        $set: {
          ...updateProfileDto,
        },
      },
    );

    return profile;
  }

  @Post("add-service")
  async addService(@Body() addServiceDto: AddServiceDto, @Req() request: AuthorizedRequest) {
    // TODO: Add logic to check if the service already exists
    const service = await this.plumberService.updatePlumberProfile(
      {
        plumberId: request.user._id,
      },
      {
        $push: {
          services: {
            serviceId: new Types.ObjectId(addServiceDto.serviceId),
            price: addServiceDto.price,
            zipCodes: addServiceDto.zipCodes,
          },
        },
      },
    );

    return service;
  }

  @Get("get-all-availability")
  async getAllAvailability(@Req() request: AuthorizedRequest) {
    return await this.plumberService.findAllAppointment({
      userId: new Types.ObjectId(request.user._id),
    });
  }

  @Post("add-availability")
  async addAvailability(@Body() addAvailabilityDto: AddAvailabilityDto, @Req() request: AuthorizedRequest) {
    const { endDate } = addAvailabilityDto;
    if (!endDate) {
      const plumber_data = await this.plumberService.findOneAppointment({
        endDate: {
          $exists: false,
        },
        userId: new Types.ObjectId(request.user._id),
      });
      if (plumber_data) {
        plumber_data.weeklyAvailability = addAvailabilityDto.weeklyAvailability;
        plumber_data.maxAppointmentsPerDay = addAvailabilityDto.maxAppointmentsPerDay ? addAvailabilityDto.maxAppointmentsPerDay : plumber_data.maxAppointmentsPerDay;
        plumber_data.bufferTime = addAvailabilityDto.bufferTime;
        await plumber_data.save();
      } else {
        await this.plumberService.addAvailability({
          ...addAvailabilityDto,
          userId: new Types.ObjectId(request.user._id),
          startDate: new Date(addAvailabilityDto.startDate),
          endDate: endDate ? new Date(endDate) : undefined,
        });
      }
    }
    return {
      message: "Availability Updated",
    };
  }

  @Post("get-all-services")
  async getAllServices() {
    return this.plumberService.getAllServices();
  }
}
