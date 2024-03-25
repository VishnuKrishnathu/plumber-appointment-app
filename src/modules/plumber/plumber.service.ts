import { Model, FilterQuery, UpdateQuery } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Service } from "@models/service.schema";
import { PlumberProfile, PlumberProfileDocument } from "@models/plumberprofile.schema";

@Injectable()
export class PlumberService {
  constructor(
    @InjectModel(PlumberProfile.name) private readonly plumberProfileModel: Model<PlumberProfile>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
  ) {}

  async updatePlumberProfile(filter: FilterQuery<PlumberProfileDocument>, update: UpdateQuery<PlumberProfileDocument>) {
    return this.plumberProfileModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });
  }

  async getAllServices() {
    return this.serviceModel.find({}, ["serviceName"]);
  }
}
