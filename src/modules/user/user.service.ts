import { Model, FilterQuery, ProjectionType } from "mongoose";
import { PlumberProfile, PlumberProfileDocument } from "@models/plumberprofile.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Appointment, AppointmentDocument } from "@models/appointment.schema";
import * as moment from "moment";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(PlumberProfile.name) private readonly plumberProfileModel: Model<PlumberProfile>,
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<Appointment>,
  ) {}

  async getPlumbers(zipCode: string, limit: number, skip: number) {
    return await this.plumberProfileModel.findOne({ "services.zipCodes": zipCode }).limit(limit).skip(skip);
  }

  extractDay(date: string) {
    return moment(date).format("dddd").toUpperCase();
  }

  extractTime(preferredTime: string): number[] {
    const formattedTime = new Date(preferredTime);
    console.log(formattedTime);
    // return formattedTime.split(":").map(val => parseInt(val));
    return [formattedTime.getHours(), formattedTime.getMinutes()];
  }

  getDayDifference(date: string): number {
    return moment(date).diff(moment(), "days");
  }

  async getAppointmentDetails(filter: FilterQuery<AppointmentDocument>, projection?: ProjectionType<AppointmentDocument>) {
    return this.appointmentModel.findOne(filter, projection);
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
