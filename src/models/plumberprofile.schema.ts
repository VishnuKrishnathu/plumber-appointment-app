import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Plumber } from "./plumber.schema";
import { Service } from "./service.schema";

export type PlumberProfileDocument = HydratedDocument<PlumberProfile>;

@Schema()
class ServiceSchema {
  @Prop({ type: Types.ObjectId, ref: Service.name })
  serviceId: Service;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: [String], required: true })
  zipCodes: string[];
}

@Schema({ timestamps: true })
export class PlumberProfile {
  @Prop({ type: Types.ObjectId, required: true, unique: true })
  plumberId: Plumber;

  @Prop({ type: [ServiceSchema], default: [] })
  services: ServiceSchema[];
}

export const PlumberProfileSchema = SchemaFactory.createForClass(PlumberProfile);
