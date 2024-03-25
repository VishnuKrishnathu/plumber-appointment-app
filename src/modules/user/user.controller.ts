import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { ZipCodeValidationPipe } from "@pipes/zipcode.pipe";
import { UserService } from "./user.service";
import UserAuthGuard from "@guards/user-auth.guard";
import { ValidateObjectIdPipe } from "@pipes/mongoid.pipe";

@UseGuards(UserAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("get-plumbers")
  async getPlumbers(@Query("zipcode", ZipCodeValidationPipe) zipCode: string, @Query("limit", ParseIntPipe) limit: number, @Query("skip", ParseIntPipe) skip: number) {
    return await this.userService.getPlumbers(zipCode, limit, skip);
  }

  @Get("get-plumber-details/:id")
  async getPlumberDetails(@Param("id", ValidateObjectIdPipe) plumberId: string) {
    const plumberData = await this.userService.findPlumberWithDetails({
      plumberId,
    });

    return plumberData;
  }
}
