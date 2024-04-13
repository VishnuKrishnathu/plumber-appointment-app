import { Types, Model, FilterQuery, UpdateQuery, ProjectionType } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Service } from "@models/service.schema";
import { PlumberProfile, PlumberProfileDocument } from "@models/plumberprofile.schema";
import { Appointments as Appointment, AppointmentsDocument } from "@models/appointment.schema";
import AddAvailabilityDto from "./dto/addavailability.dto";
import { Event, EventDocument } from "@models/events.schema";
import { User, UserDocument } from "@models/user.schema";
import { Plumber, PlumberDocument } from "@models/plumber.schema";
import { GoogleService } from "@services/google/google.service";

@Injectable()
export class PlumberService {
  @Inject(GoogleService)
  private readonly googleService: GoogleService;

  constructor(
    @InjectModel(PlumberProfile.name) private readonly plumberProfileModel: Model<PlumberProfile>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<Appointment>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Plumber.name) private readonly plumberModel: Model<Plumber>,
  ) {}

  async refreshToken(refresh_token: string) {
    return this.googleService.refreshTheToken(refresh_token);
  }

  async createEvent(event: any, access_token: string, refresh_token: string) {
    return this.googleService.createEvent(event, access_token, refresh_token);
  }

  async findOneUser(filter: FilterQuery<UserDocument>, projection?: ProjectionType<UserDocument>) {
    return this.userModel.findOne(filter, projection);
  }

  async findOnePlumber(filter: FilterQuery<PlumberDocument>, projection?: ProjectionType<PlumberDocument>) {
    return this.plumberModel.findOne(filter, projection);
  }

  async findOneAndUpdatePlumber(filter: FilterQuery<PlumberDocument>, update: UpdateQuery<PlumberDocument>) {
    return this.plumberModel.findOneAndUpdate(filter, update);
  }

  async updatePlumberProfile(filter: FilterQuery<PlumberProfileDocument>, update: UpdateQuery<PlumberProfileDocument>) {
    return this.plumberProfileModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });
  }

  async findAllAppointment(filter: FilterQuery<AppointmentsDocument>, projection?: ProjectionType<AppointmentsDocument>) {
    return this.appointmentModel.find(filter, projection);
  }

  async findOneAppointment(filter: FilterQuery<AppointmentsDocument>, projection?: ProjectionType<AppointmentsDocument>) {
    return this.appointmentModel.findOne(filter, projection);
  }

  async addAvailability(addAvailabilityDto: AddAvailabilityDto & { userId: Types.ObjectId; startDate: Date; endDate?: Date }) {
    const appointment = new this.appointmentModel(addAvailabilityDto);
    return appointment.save();
  }

  async getAllServices() {
    return this.serviceModel.find({}, ["serviceName"]);
  }

  async completeOrder(orderId: string, set: boolean) {
    return this.eventModel.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          orderDelivered: set,
        },
      },
    );
  }

  async findEvent(filter: FilterQuery<EventDocument>, projection?: ProjectionType<EventDocument>) {
    return this.eventModel.findOne(filter, projection);
  }
}
