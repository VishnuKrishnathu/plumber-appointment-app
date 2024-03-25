import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PlumberDocument = HydratedDocument<Plumber>;

@Schema({ timestamps: true })
export class Plumber {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  refresh_token: string;

  @Prop({ type: Date, required: true })
  expiry_time: Date;

  @Prop({ type: String, required: true })
  access_token: string;

  @Prop({ type: String })
  profile_pic?: string;
}

export const PlumberSchema = SchemaFactory.createForClass(Plumber);
