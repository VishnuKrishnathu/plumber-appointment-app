import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Plumber } from "./plumber.schema";
import { Service } from "./service.schema";

export type PlumberProfileDocument = HydratedDocument<PlumberProfile>;

@Schema()
class ServiceSchema {
  @Prop({ type: Types.ObjectId, ref: Service })
  serviceId: Service;

  @Prop({ type: Number, required: true })
  price: number;
}

@Schema({ timestamps: true })
export class PlumberProfile {
  @Prop({ type: Types.ObjectId, required: true, unique: true })
  plumberId: Plumber;

  services: ServiceSchema[];
}

export const PlumberProfileSchema = SchemaFactory.createForClass(PlumberProfile);
