import { Model, FilterQuery, UpdateQuery } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Service } from "@models/service.schema";
import { PlumberProfile, PlumberProfileDocument } from "@models/plumberprofile.schema";
import { Appointment } from "@models/appointment.schema";
import AddAvailabilityDto from "./dto/addavailability.dto";

@Injectable()
export class PlumberService {
  constructor(
    @InjectModel(PlumberProfile.name) private readonly plumberProfileModel: Model<PlumberProfile>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<Appointment>,
  ) {}

  async updatePlumberProfile(filter: FilterQuery<PlumberProfileDocument>, update: UpdateQuery<PlumberProfileDocument>) {
    return this.plumberProfileModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });
  }

  async addAvailability(addAvailabilityDto: AddAvailabilityDto & { plumberId: string }) {
    const appointment = new this.appointmentModel(addAvailabilityDto);
    return appointment.save();
  }

  async getAllServices() {
    return this.serviceModel.find({}, ["serviceName"]);
  }
}
