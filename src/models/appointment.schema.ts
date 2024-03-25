import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Plumber } from "./plumber.schema";

export type AppointmentDocument = HydratedDocument<Appointment>;

class Time {
  @Prop({ type: Number, required: true })
  hours: number;

  @Prop({ type: Number, required: true })
  minutes: number;
}

class WeeklyAvailability {
  @Prop({ type: String, required: true })
  day: string;

  @Prop({ type: Time, required: true })
  startTime: Time;

  @Prop({ type: Time, required: true })
  endTime: Time;
}

@Schema()
export class Appointment {
  @Prop({ type: Types.ObjectId, required: true, ref: Plumber.name })
  plumberId: Plumber;

  @Prop({ type: [WeeklyAvailability], default: [] })
  weeklyAvailability: WeeklyAvailability[];

  @Prop({ type: Number, required: true })
  maxAppointmentsPerDay: number;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
