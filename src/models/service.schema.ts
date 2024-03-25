import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ServiceDocument = HydratedDocument<Service>;

@Schema()
export class Service {
  @Prop({ type: String, required: true })
  serviceName: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
