import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Plumber } from "./plumber.schema";

export type PlumberProfileDocument = HydratedDocument<PlumberProfile>;

@Schema({ timestamps: true })
export class PlumberProfile {
  @Prop({ type: Types.ObjectId, required: true, unique: true })
  plumberId: Plumber;
}

export const PlumberProfileSchema = SchemaFactory.createForClass(PlumberProfile);
