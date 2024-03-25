import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Service {
  @Prop({ type: String, required: true, unique: true })
  serviceName: string;
}
