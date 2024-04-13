import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Plumber } from "./plumber.schema";
import { User } from "./user.schema";
import { Service } from "./service.schema";

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Address {
  @Prop({ type: String, required: true })
  addressLine1: string;

  @Prop({ type: String, required: true })
  addressLine2: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  state: string;

  @Prop({ type: String, required: true })
  zipCode: string;
}

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

  @Prop({ type: Boolean, default: true })
  approved: boolean;

  @Prop({ type: Boolean, default: false })
  paymentStatus: boolean;

  @Prop({ type: Boolean, default: false })
  orderDelivered: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
