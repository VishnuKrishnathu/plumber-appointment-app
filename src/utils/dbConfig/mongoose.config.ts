import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";

export const mongooseConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const MONGO_PASSWORD = configService.get<string>("MONGODB_PASSWORD");
    const MONGO_USER = configService.get<string>("MONGODB_USER");
    const MONGODB_NAME = configService.get<string>("MONGODB_NAME");
    return {
      uri: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ragko.mongodb.net/${MONGODB_NAME}`,
    };
  },
};
