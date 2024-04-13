import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Appointments } from "./appointment.schema";
import { Types, HydratedDocument } from "mongoose";
import { Service } from "./service.schema";
import { Plumber } from "./plumber.schema";

export type EventSlotDocument = HydratedDocument<EventSlots>;

export class EventSlots {
  @Prop({ required: true, type: Types.ObjectId, ref: Appointments.name })
  appointmentId: Appointments;

  @Prop({ type: Date, required: true })
  startDateTime: Date;

  @Prop({ type: Date, required: true })
  endDateTime: Date;

  @Prop({ type: [Types.ObjectId], ref: Service.name, default: [] })
  services: Service[];

  @Prop({ type: Types.ObjectId, ref: Plumber.name, required: true })
  userId: Plumber;
}

export const EventSlotsSchema = SchemaFactory.createForClass(EventSlots);
