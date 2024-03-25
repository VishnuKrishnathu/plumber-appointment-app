import { Model, FilterQuery, ProjectionType } from "mongoose";
import { PlumberProfile, PlumberProfileDocument } from "@models/plumberprofile.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UserService {
  constructor(@InjectModel(PlumberProfile.name) private readonly plumberProfileModel: Model<PlumberProfile>) {}

  async getPlumbers(zipCode: string, limit: number, skip: number) {
    return await this.plumberProfileModel.find({ "services.zipCodes": zipCode }).limit(limit).skip(skip);
  }

  async findPlumberWithDetails(filter: FilterQuery<PlumberProfileDocument>, projection?: ProjectionType<PlumberProfileDocument>) {
    return this.plumberProfileModel
      .findOne(filter, projection)
      .populate({
        path: "services.serviceId",
        select: "serviceName",
      })
      .populate({
        path: "plumberId",
        select: "name",
      });
  }
}
