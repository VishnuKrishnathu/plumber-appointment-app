import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.schema";

export type UserProfileDocument = HydratedDocument<UserProfile>;

@Schema()
class Address {
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

  @Prop({ type: String, required: true })
  addressTag: string;
}

@Schema({ timestamps: true })
export class UserProfile {
  @Prop({ type: Types.ObjectId, required: true, unique: true })
  userId: User;

  @Prop([{ type: Address }])
  address?: Address[];
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
