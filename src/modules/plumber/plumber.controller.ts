import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import AddServiceDto from "./dto/addservice.dto";
import { PlumberService } from "./plumber.service";
import { AuthorizedRequest } from "@globalTypes/auth";
import PlumberAuthGuard from "@guards/plumber-auth.guard";

@Controller("plumber")
export class PlumberController {
  constructor(private readonly plumberService: PlumberService) {}

  @UseGuards(PlumberAuthGuard)
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

  @Post("get-all-services")
  async getAllServices() {
    return this.plumberService.getAllServices();
  }
}
