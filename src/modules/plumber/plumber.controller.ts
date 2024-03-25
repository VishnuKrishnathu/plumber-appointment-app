import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import AddServiceDto from "./dto/addservice.dto";
import { PlumberService } from "./plumber.service";
import { AuthorizedRequest } from "@globalTypes/auth";
import PlumberAuthGuard from "@guards/plumber-auth.guard";
import UpdateProfileDto from "./dto/updateprofile.dto";
import AddAvailabilityDto from "./dto/addavailability.dto";

@UseGuards(PlumberAuthGuard)
@Controller("plumber")
export class PlumberController {
  constructor(private readonly plumberService: PlumberService) {}

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
            serviceId: addServiceDto.serviceId,
            price: addServiceDto.price,
            zipCodes: addServiceDto.zipCodes,
          },
        },
      },
    );

    return service;
  }

  @Post("add-availability")
  async addAvailability(@Body() addAvailabilityDto: AddAvailabilityDto, @Req() request: AuthorizedRequest) {
    return await this.plumberService.addAvailability({
      ...addAvailabilityDto,
      plumberId: request.user._id,
    });
  }

  @Post("get-all-services")
  async getAllServices() {
    return this.plumberService.getAllServices();
  }
}
