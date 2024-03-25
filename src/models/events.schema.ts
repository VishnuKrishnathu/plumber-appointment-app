import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Address } from "./userprofile.schema";
import { Plumber } from "./plumber.schema";
import { User } from "./user.schema";
import { Service } from "./service.schema";

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({ type: Types.ObjectId, required: true, ref: Service.name })
  serviceId: Service;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Date })
  preferredTime?: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: Plumber.name })
  plumberId: Plumber;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: User;

  @Prop({ type: Boolean, default: false })
  approved: boolean;

  @Prop({ type: Boolean, default: false })
  paymentStatus: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
