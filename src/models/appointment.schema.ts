import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Plumber } from "@models/plumber.schema";

@Schema()
export class DailyaAvailaility {
  @Prop({ required: true, type: Number, min: 0, max: 86400 })
  startTime: number;

  @Prop({ required: true, type: Number, min: 0, max: 86400 })
  endTime: number;
}

@Schema()
export class WeeklyAvailability {
  @Prop({ type: [DailyaAvailaility] })
  monday?: DailyaAvailaility[];

  @Prop({ type: [DailyaAvailaility] })
  tuesday?: DailyaAvailaility[];

  @Prop({ type: [DailyaAvailaility] })
  wednesday?: DailyaAvailaility[];

  @Prop({ type: [DailyaAvailaility] })
  thursday?: DailyaAvailaility[];

  @Prop({ type: [DailyaAvailaility] })
  friday?: DailyaAvailaility[];

  @Prop({ type: [DailyaAvailaility] })
  saturday?: DailyaAvailaility[];

  @Prop({ type: [DailyaAvailaility] })
  sunday?: DailyaAvailaility[];
}

export type AppointmentsDocument = HydratedDocument<Appointments>;

@Schema({ timestamps: true })
export class Appointments {
  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ required: true, type: WeeklyAvailability })
  weeklyAvailability: WeeklyAvailability;

  @Prop({ type: [Date], default: [] })
  excludedDates?: Date[];

  @Prop({ type: Number, required: true, default: 0 })
  bufferTime: number;

  @Prop({ type: Number, default: 5 })
  maxAppointmentsPerDay: number;

  @Prop({ type: Number, required: true })
  appointmentDuration: number;

  @Prop({ type: Types.ObjectId, required: true, ref: Plumber.name })
  userId: Plumber;
}

export const AppointmentsSchema = SchemaFactory.createForClass(Appointments);
