import { Model, FilterQuery, ProjectionType } from "mongoose";
import { PlumberProfile, PlumberProfileDocument } from "@models/plumberprofile.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Appointments as Appointment, AppointmentsDocument as AppointmentDocument } from "@models/appointment.schema";
import * as moment from "moment";
import { Event, EventDocument } from "@models/events.schema";
import CreateEventDto from "./dto/createevent.dto";

type TappointmentFeatures = {
  startTime: number;
  endTime: number;
  bufferTime: number;
  appointmentDuration: number;
};

@Injectable()
export class UserService {
  constructor(
    @InjectModel(PlumberProfile.name) private readonly plumberProfileModel: Model<PlumberProfile>,
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<Appointment>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async createEvent(createEventDto: CreateEventDto & { userId: string; price: number }) {
    const event = new this.eventModel(createEventDto);
    return event.save();
  }

  /**
   *
   * @description Checks if the user preferred time doesn't fall in the buffer time
   * @description All the time provided should be in seconds
   *
   */
  eliminateBufferTime(appointmentfeatures: TappointmentFeatures, userPreferredTime: number) {
    const { startTime, endTime, bufferTime, appointmentDuration } = appointmentfeatures;

    // building the time array
    const timeArray = [];
    let i = startTime;
    while (i <= endTime) {
      timeArray.push(i);
      if (timeArray.length % 2 !== 0) {
        i += appointmentDuration;
      } else {
        i += bufferTime;
      }
    }

    if (userPreferredTime < timeArray[0] || userPreferredTime > timeArray[timeArray.length - 1]) {
      throw new Error("Time out of range");
    }

    // binary search logic
    let low = 0;
    let high = timeArray.length - 1;

    let pos = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      pos = mid;
      if (timeArray[mid] === userPreferredTime) {
        break;
      } else if (timeArray[mid] < userPreferredTime) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    if (pos % 2 === 0) {
      throw new Error("Time out of range");
    }
  }

  async findEventsCount(filter: FilterQuery<EventDocument>) {
    return this.eventModel.countDocuments(filter);
  }

  convertToTime(data: { hours: number; minutes: number }): number {
    return moment()
      .set({
        h: data.hours,
        m: data.minutes,
      })
      .valueOf();
  }

  async getPlumbers(zipCode: string, limit: number, skip: number) {
    return await this.plumberProfileModel.findOne({ "services.zipCodes": zipCode }).limit(limit).skip(skip);
  }

  extractDay(date: string) {
    return moment(date).format("dddd").toLowerCase();
  }

  /**
   * @description Extracts the time from the preferred time [ hours, minutes ]
   */
  extractTime(preferredTime: string): number[] {
    const formattedTime = new Date(preferredTime);
    console.log(formattedTime);
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

  async findPlumber(filter: FilterQuery<PlumberProfileDocument>, projection?: ProjectionType<PlumberProfileDocument>) {
    return this.plumberProfileModel.findOne(filter, projection);
  }
}
